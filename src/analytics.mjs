// Independent, opt-in manual beacon. No interaction events or URL rewriting.
function loadBeacon(origin,token){
 if(location.origin!==origin||document.querySelector('#cloudflare-analytics-beacon'))return;
 const script=document.createElement('script');
 script.id='cloudflare-analytics-beacon';script.defer=true;
 script.src='https://static.cloudflareinsights.com/beacon.min.js';
 script.setAttribute('data-cf-beacon',JSON.stringify({token}));
 document.body.append(script);
}
export function renderAnalytics(config,siteURL){
 if(config==null)return '';
 if(typeof config.enabled!=='boolean')throw Error('invalid analytics enabled setting');
 if(!config.enabled)return '';
 if(typeof config.siteToken!=='string'||! /^[a-f0-9]{32}$/i.test(config.siteToken))throw Error('enabled analytics requires a valid siteToken');
 const origin=new URL(siteURL).origin;
 if(new URL(siteURL).protocol!=='https:')throw Error('analytics requires HTTPS production origin');
 return `<script>(${loadBeacon.toString()})(${JSON.stringify(origin)},${JSON.stringify(config.siteToken)});</script>`;
}
