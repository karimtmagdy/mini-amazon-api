// import { AppSettingsDto } from "../contract/app-settings.dto";
import { z } from "zod/v4";

export const updateAppSettingsSchema = z.object({
  body: z.object({
    general: z.object({
      title: z.string().nullable().optional(),
      icon: z.string().nullable().optional(),
      logo: z.string().nullable().optional(),
      favicon: z.string().nullable().optional(),
    }),
    system: z.object({
      maintenance: z.boolean().optional(),
      maintenanceMessage: z.string().nullable().optional(),
    }),
    social: z.object({
      facebook: z.string().nullable().optional(),
      twitter: z.string().nullable().optional(),
      instagram: z.string().nullable().optional(),
      linkedin: z.string().nullable().optional(),
      youtube: z.string().nullable().optional(),
      tiktok: z.string().nullable().optional(),
    }),
    seo: z.object({
      title: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      keywords: z.string().nullable().optional(),
      author: z.string().nullable().optional(),
      robots: z.string().nullable().optional(),
      google_site_verification: z.string().nullable().optional(),
      bing_site_verification: z.string().nullable().optional(),
      yandex_site_verification: z.string().nullable().optional(),
      alexa_site_verification: z.string().nullable().optional(),
      pinterest_site_verification: z.string().nullable().optional(),
    }),
    settings: z.object({
      currency: z.string().nullable().optional(),
      language: z.string().nullable().optional(),
      timezone: z.string().nullable().optional(),
      date_format: z.string().nullable().optional(),
      time_format: z.string().nullable().optional(),
    }),
    policy: z.object({
      privacy: z.string().nullable().optional(),
      terms: z.string().nullable().optional(),
      refund: z.string().nullable().optional(),
      shipping: z.string().nullable().optional(),
      cancellation: z.string().nullable().optional(),
    }),
  }),
}) 
 
export const getAppSettingsSchema = z.object({
  body: z.object({
    policy: z.object({
      privacy: z.string().nullable().optional(),
      terms: z.string().nullable().optional(),
      refund: z.string().nullable().optional(),
      shipping: z.string().nullable().optional(),
      cancellation: z.string().nullable().optional(),
    }),
    settings: z.object({
      currency: z.string().nullable().optional(),
      language: z.string().nullable().optional(),
      timezone: z.string().nullable().optional(),
      date_format: z.string().nullable().optional(),
      time_format: z.string().nullable().optional(),
    }),
    seo: z.object({
      title: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      keywords: z.string().nullable().optional(),
      author: z.string().nullable().optional(),
      robots: z.string().nullable().optional(),
      google_site_verification: z.string().nullable().optional(),
      bing_site_verification: z.string().nullable().optional(),
      yandex_site_verification: z.string().nullable().optional(),
      alexa_site_verification: z.string().nullable().optional(),
      pinterest_site_verification: z.string().nullable().optional(),
    }),
    social: z.object({
      facebook: z.string().nullable().optional(),
      twitter: z.string().nullable().optional(),
      instagram: z.string().nullable().optional(),
      linkedin: z.string().nullable().optional(),
      youtube: z.string().nullable().optional(),
      tiktok: z.string().nullable().optional(),
    }),
    system: z.object({
      maintenance: z.boolean().optional(),
      maintenanceMessage: z.string().nullable().optional(),
    }),
    general: z.object({
      title: z.string().nullable().optional(),
      icon: z.string().nullable().optional(),
      logo: z.string().nullable().optional(),
      favicon: z.string().nullable().optional(),
    }),
  }),
}).strict();