import { At } from "./global.dto";

export type AppSettingsDto = At & {
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
  social: {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    tiktok: string | null;
  };
};
