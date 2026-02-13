export const ADS_POSITION = ["top", "sidebar", "footer"] as const;
export type AdsPosition = (typeof ADS_POSITION)[number];
export const ADS_STATUS = ["active", "inactive", "pending"] as const;
export type AdsStatus = (typeof ADS_STATUS)[number];

export const ADS_TYPES = ["banner", "image"] as const;
export type AdsType = (typeof ADS_TYPES)[number];

export const ADS_PLACEMENT = ["home", "product", "category"] as const;
export type AdsPlacement = (typeof ADS_PLACEMENT)[number];
