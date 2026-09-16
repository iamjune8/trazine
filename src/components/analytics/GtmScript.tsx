import Script from "next/script";

/**
 * Hand-rolled GTM install — Google's own bootstrap snippet, wrapped in
 * `next/script` with `strategy="beforeInteractive"` — used instead of
 * `<GoogleTagManager>` from @next/third-parties. That component hardcodes
 * `next/script`'s default `afterInteractive` strategy, which defers actually
 * inserting the script tag into the DOM until after client-side hydration:
 * real browsers run it fine, but the tag is never present in the
 * server-rendered HTML itself, only a `<link rel="preload">` hint is
 * (confirmed by fetching the raw page). Anything that reads raw HTML without
 * executing JavaScript — including Google Ads' own tag verification — sees
 * no GTM tag at all. `beforeInteractive` puts this directly in the initial
 * HTML instead, matching what Google's literal snippet does when pasted by
 * hand.
 */
export function GtmScript({ gtmId }: { gtmId: string }) {
  return (
    <Script id="gtm-init" strategy="beforeInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
    </Script>
  );
}
