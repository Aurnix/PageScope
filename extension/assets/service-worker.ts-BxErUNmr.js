chrome.runtime.onMessage.addListener((r,h,t)=>{if(r.type==="FETCH_RAW_HTML")return fetch(r.url).then(e=>e.text()).then(e=>t({html:e})).catch(e=>t({error:e.message})),!0});
