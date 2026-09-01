import Script from "next/script";

/**
 * Cookieless 4-event funnel counter (SXO layer).
 * landing -> cta_click -> booking_started -> booking_done
 *
 * Privacy posture: no cookies, no localStorage, no user identifier, no IP
 * stored (n8n drops it). Aggregate counts only, so no consent banner is
 * required under PECR/GDPR storage-access rules. Payload is a fire-and-forget
 * sendBeacon to our own n8n webhook (SXO-01).
 */
const SITE = "waseemnasir";
const ENDPOINT = "https://n8n.skynetjoe.com/webhook/sxo-event";

const src = `(function(){var S=${JSON.stringify(SITE)},E=${JSON.stringify(ENDPOINT)},started=false;
function send(ev,extra){try{var p={site:S,ev:ev,path:location.pathname.slice(0,200),ref:(document.referrer||'').slice(0,200)};
if(extra){for(var k in extra)p[k]=extra[k]}var b=JSON.stringify(p);
if(navigator.sendBeacon){navigator.sendBeacon(E,new Blob([b],{type:'text/plain'}))}
else{fetch(E,{method:'POST',body:b,keepalive:true,mode:'no-cors'})}}catch(e){}}
send('landing');
document.addEventListener('click',function(e){var t=e.target;var a=t&&t.closest?t.closest('a'):null;if(!a)return;
var h=a.getAttribute('href')||'';if(/calendly\\.com|\\/book|\\/discovery-call|#book/.test(h))send('cta_click',{href:h.slice(0,200)})},true);
window.addEventListener('message',function(e){if(e.origin!=='https://calendly.com')return;var n=e.data&&e.data.event;if(!n)return;
if(!started&&(n==='calendly.event_type_viewed'||n==='calendly.date_and_time_selected')){started=true;send('booking_started',{step:n})}
if(n==='calendly.event_scheduled')send('booking_done')});})();`;

export default function SxoBeacon() {
  return (
    <Script
      id="sxo-beacon"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: src }}
    />
  );
}
