import Script from "next/script";

/**
 * Meta Pixel bootstrap — Meta's own base code, wrapped in `next/script`.
 *
 * Deliberately `strategy="afterInteractive"`, not `beforeInteractive` like
 * GtmScript. GTM is `beforeInteractive` for a specific, confirmed reason:
 * some verification tools read the raw server HTML without executing JS, so
 * the tag has to be physically present before hydration. No such
 * requirement exists for Meta's Pixel — Meta's own Test Events tool and the
 * Pixel Helper extension both execute JS normally, so there is nothing to
 * gain from loading this before the page is interactive, and real cost
 * (main-thread contention during hydration) to loading it earlier than
 * `afterInteractive`. `lazyOnload` was considered and rejected: it can
 * defer until well after the page is idle, which risks losing the PageView
 * for a visitor who navigates away quickly — exactly the traffic Meta's
 * Aggregated Event Measurement needs to see.
 *
 * Only the base pixel snippet + one initial PageView are fired here.
 * Client-side route changes (Next.js App Router doesn't reload the page)
 * are handled separately by MetaPixelPageview, which explicitly skips the
 * first pathname it sees so this initial call is never duplicated.
 */
export function MetaPixelScript({ pixelId }: { pixelId: string }) {
  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- Meta's own required fallback, not a content image */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
