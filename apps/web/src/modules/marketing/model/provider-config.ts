const optionalEnv = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export interface MarketingProviderConfig {
  metaPixelId?: string;
  kakaoPixelId?: string;
  googleAdsId?: string;
  googleAdsLeadConversionLabel?: string;
  googleAdsConsultationConversionLabel?: string;
}

export const marketingProviderConfig: MarketingProviderConfig = {
  metaPixelId: optionalEnv(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  kakaoPixelId: optionalEnv(process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID),
  googleAdsId: optionalEnv(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  googleAdsLeadConversionLabel: optionalEnv(
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD,
  ),
  googleAdsConsultationConversionLabel: optionalEnv(
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_CONSULTATION,
  ),
};

export const getMarketingProviderNames = (
  config: MarketingProviderConfig = marketingProviderConfig,
) => [
  ...(config.metaPixelId ? ["meta-pixel"] : []),
  ...(config.kakaoPixelId ? ["kakao-pixel"] : []),
  ...(config.googleAdsId ? ["google-ads"] : []),
];

export const getGoogleAdsConversionSendTo = (
  googleAdsId?: string,
  conversionLabel?: string,
) => {
  if (!googleAdsId || !conversionLabel) {
    return undefined;
  }

  return `${googleAdsId}/${conversionLabel}`;
};
