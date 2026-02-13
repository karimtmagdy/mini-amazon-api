// import { IOrder } from "@/types/order.dto";
// import { Schema, model } from "mongoose";

// const OrderSchema = new Schema<IOrder>(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     orderItems: [
//       {
//         product: {
//           type: Schema.Types.ObjectId,
//           required: true,
//           ref: "Product",
//         },
//         name: { type: String, required: true },
//         quantity: { type: Number, required: true },
//         price: { type: Number, required: true },
//         image: String,
//       },
//     ],
//     shippingAddress: {
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: { type: String, required: true },
//       country: { type: String, required: true },
//     },
//     paymentMethod: { type: String, required: true, default: "Stripe" },
//     paymentResult: {
//       id: String,
//       status: String,
//       updateTime: Date,
//       emailAddress: String,
//     },
//     itemsPrice: { type: Number, required: true, default: 0.0 },
//     taxPrice: { type: Number, required: true, default: 0.0 },
//     shippingPrice: { type: Number, required: true, default: 0.0 },
//     totalPrice: { type: Number, required: true, default: 0.0 },
//     isPaid: { type: Boolean, required: true, default: false },
//     paidAt: Date,
//     isDelivered: { type: Boolean, required: true, default: false },
//     deliveredAt: Date,
//     stripeSessionId: String,
//   },
//   {
//     timestamps: true,
//     collection: "orders",
//     toJSON: {
//       virtuals: true,
//       transform(_doc, ret) {
//         const safeRet = ret as Partial<typeof ret>;
//         delete safeRet.__v;
//         delete safeRet._id;
//         return safeRet;
//       },
//     },
//     toObject: { virtuals: true },
//   }
// );

// export const Order = model<IOrder>("Order", OrderSchema);
