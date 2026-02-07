import { DEFAULT_USER_IMAGE } from "../contract/global.dto";
import {
  USER_ACCOUNT_STATUS,
  USER_GENDERS,
  USER_ROLES,
  USER_STATE,
  type UserDto,
} from "../contract/user.dto";
import { Schema, model } from "mongoose";
import slugify from "slugify";
import bcrypt from "bcryptjs";

const UserSchema = new Schema<UserDto>(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [50, "Username must be at most 50 characters"],
    },
    slug: { type: String, trim: true, unique: true, sparse: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
      immutable: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [30, "Password must be at most 30 characters"],
    },
    name: {
      first: {
        type: String,
        trim: true,
        lowercase: true,
        minlength: [3, "First name must be at least 3 characters"],
        maxlength: [50, "First name must be at most 50 characters"],
      },
      last: {
        type: String,
        trim: true,
        lowercase: true,
        minlength: [3, "Last name must be at least 3 characters"],
        maxlength: [50, "Last name must be at most 50 characters"],
      },
    },
    age: { type: Number, min: [18, "Age must be at least 18"] },
    gender: { type: String, enum: USER_GENDERS },
    // phone: {
    //   type: String,
    //   trim: true,
    //   unique: true,
    //   minlength: [10, "Phone number must be at least 10 characters"],
    //   maxlength: [15, "Phone number must be at most 15 characters"],
    // },
    image: {
      secureUrl: {
        type: String,
        trim: true,
        default: DEFAULT_USER_IMAGE,
      },
      publicId: { type: String, trim: true, default: null },
    },
    // remember: { type: Boolean, default: false, select: false },
    status: { type: String, enum: USER_ACCOUNT_STATUS, default: "active" },
    activeAt: { type: Date, select: false },
    logoutAt: { type: Date, select: false },
    state: { type: String, enum: USER_STATE, default: "offline" },
    lockedUntil: { type: Date, select: false },
    // failedLoginAttempts: { type: Number, default: 0, select: false },
    role: { type: String, enum: USER_ROLES, default: "user" },
    // cart: [
    //   {
    //     type: { type: String },
    //     productId: { type: Schema.Types.ObjectId, ref: "Product" },
    //   },
    // ],
    // wishlist: [{ type: Schema.Types.ObjectId, ref: "Wishlist", select: false }],
    // verified: { type: Boolean, default: false, select: false },
    // verifiedAt: { type: Date, select: false },
    deletedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        const safeRet = ret as Partial<typeof ret>;
        delete safeRet.__v;
        delete safeRet._id;
        delete safeRet.password;
        return safeRet;
      },
    },
    toObject: { virtuals: true },
  },
);
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const doc = this as unknown as UserDto;
  if (typeof doc.password !== "string") {
    throw new Error("User password is not a string");
  }
  return await bcrypt.compare(candidatePassword, doc.password);
};
UserSchema.pre("save", function () {
  const doc = this as unknown as UserDto;
  if (doc.username) {
    doc.slug = slugify(doc.username, { lower: true, strict: true });
  }
});
UserSchema.pre("findOneAndUpdate", function () {
  const doc = this.getUpdate() as Partial<UserDto>;
  if (doc && doc.username) {
    doc.slug = slugify(doc.username, { lower: true, strict: true });
  }
});
export const User = model<UserDto>("User", UserSchema);
