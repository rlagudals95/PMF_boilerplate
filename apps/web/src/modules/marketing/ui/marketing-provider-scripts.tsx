import Script from "next/script";

import { marketingProviderConfig } from "../model/provider-config";

const buildMetaPixelInitScript = (pixelId: string) => `
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', ${JSON.stringify(pixelId)});
`;

const buildGoogleAdsInitScript = (googleAdsId: string) => `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ${JSON.stringify(googleAdsId)}, { send_page_view: false });
`;

export function MarketingProviderScripts() {
  const { googleAdsId, kakaoPixelId, metaPixelId } = marketingProviderConfig;

  if (!googleAdsId && !kakaoPixelId && !metaPixelId) {
    return null;
  }

  return (
    <>
      {metaPixelId ? (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {buildMetaPixelInitScript(metaPixelId)}
        </Script>
      ) : null}

      {kakaoPixelId ? (
        <Script
          src="//t1.daumcdn.net/kas/static/kp.js"
          strategy="afterInteractive"
        />
      ) : null}

      {googleAdsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads-init" strategy="afterInteractive">
            {buildGoogleAdsInitScript(googleAdsId)}
          </Script>
        </>
      ) : null}
    </>
  );
}
