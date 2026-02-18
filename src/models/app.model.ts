import { Schema, model } from "mongoose";
import { AppSettingsDto } from "../contract/app.dto";

/**
 * Design Pattern: Singleton Pattern (via unique constraint)
 * Purpose: Ensures only one instance of application settings exists in the database.
 * Implementation: Uses unique 'id' field with default value "app-settings" to enforce single document.
 */
const AppSettingsSchema = new Schema<AppSettingsDto>(
  {
    id: { type: String, default: "app-settings" },
    general: {
      title: { type: String, default: "Mini Amazon" },
      icon: { type: String, default: null },
      logo: { type: String, default: null },
      favicon: { type: String, default: null },
    },
    system: {
      maintenance: { type: Boolean, default: false },
      maintenanceMessage: {
        type: String,
        default: "System is under maintenance. Please try again later.",
      },
    },

    seo: {
      title: { type: String, default: null },
      description: { type: String, default: null },
      keywords: { type: String, default: null },
      author: { type: String, default: null },
      robots: { type: String, default: "index, follow" },
      google_site_verification: { type: String, default: null },
      bing_site_verification: { type: String, default: null },
      yandex_site_verification: { type: String, default: null },
      alexa_site_verification: { type: String, default: null },
      pinterest_site_verification: { type: String, default: null },
    },
    settings: {
      currency: { type: String, default: null },
      language: { type: String, default: "en" },
      timezone: { type: String, default: "UTC" },
      date_format: { type: String, default: null },
      time_format: { type: String, default: null },
    },
    policy: {
      rules: { type: String, default: null },
      privacy: { type: String, default: null },
      terms: { type: String, default: null },
      refund: { type: String, default: null },
      shipping: { type: String, default: null },
      cancellation: { type: String, default: null },
    },
    social: {
      facebook: { type: String, default: null },
      twitter: { type: String, default: null },
      instagram: { type: String, default: null },
      linkedin: { type: String, default: null },
      youtube: { type: String, default: null },
      tiktok: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    collection: "app-settings",
    id: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const safeRet = ret as Partial<typeof ret>;
        delete safeRet._id;
        delete safeRet.__v;
        return safeRet;
      },
    },
    toObject: { virtuals: true },
  },
);
export const AppSettings = model<AppSettingsDto>(
  "AppSettings",
  AppSettingsSchema,
);
