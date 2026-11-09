import Script from "next/script";

/**
 * Microsoft Clarity bootstrap, Clarity's own snippet wrapped in `next/script`.
 *
 * `afterInteractive`, like the Meta Pixel and unlike GTM: nothing reads the raw
 * server HTML for this tag, and loading it later keeps it off the main thread
 * while the page hydrates. It is mounted only on public pages, never the admin.
 *
 * The enquiry forms carry `data-clarity-mask="True"`, so what a visitor types
 * into them is never recorded. See the CSP in next.config.mjs for the Clarity
 * hosts that must stay allowed.
 */
export function ClarityScript({ projectId }: { projectId: string }) {
  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(projectId)});`}
    </Script>
  );
}
