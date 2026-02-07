import { Schema, model } from "mongoose";
// import { AppDto } from "@/types/app.dto";

type AppSettingsDto = {
  id: string;
  general: {
    title: string | null;
    icon: string | null;
    logo: string | null;
    favicon: string | null;
  };
  system: {
    maintenance: boolean | null;
    maintenanceMessage: string | null;
  };
  social: {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    tiktok: string | null;
  };
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    author: string | null;
    robots: string | null;
    google_site_verification: string | null;
    bing_site_verification: string | null;
    yandex_site_verification: string | null;
    alexa_site_verification: string | null;
    pinterest_site_verification: string | null;
  };
  settings: {
    currency: string | null;
    language: string | null;
    timezone: string | null;
    date_format: string | null;
    time_format: string | null;
  };
  policy: {
    rules: string | null;
    privacy: string | null;
    terms: string | null;
    refund: string | null;
    shipping: string | null;
    cancellation: string | null;
  };
};

const AppSettingsSchema = new Schema<AppSettingsDto>(
  {
    id: { type: String, default: "app-settings" },
    //   title: { type: String, default: null },
    //   icon: { type: String, default: null },
    general: {
      title: { type: String, default: null },
      icon: { type: String, default: null },
      logo: { type: String, default: null },
      favicon: { type: String, default: null },
    },
    system: {
      maintenance: { type: Boolean, default: false },
      maintenanceMessage: { type: String, default: null },
    },
    social: {
      facebook: { type: String, default: null },
      twitter: { type: String, default: null },
      instagram: { type: String, default: null },
      linkedin: { type: String, default: null },
      youtube: { type: String, default: null },
      tiktok: { type: String, default: null },
    },
    seo: {
      title: { type: String, default: null },
      description: { type: String, default: null },
      keywords: { type: String, default: null },
      author: { type: String, default: null },
      robots: { type: String, default: null },
      google_site_verification: { type: String, default: null },
      bing_site_verification: { type: String, default: null },
      yandex_site_verification: { type: String, default: null },
      alexa_site_verification: { type: String, default: null },
      pinterest_site_verification: { type: String, default: null },
    },
    settings: {
      currency: { type: String, default: null },
      language: { type: String, default: null },
      timezone: { type: String, default: null },
      date_format: { type: String, default: null },
      time_format: { type: String, default: null },
    },
    policy: {
      privacy: { type: String, default: null },
      terms: { type: String, default: null },
      refund: { type: String, default: null },
      shipping: { type: String, default: null },
      cancellation: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    collection: "app-settings",
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
