chrome.runtime.onMessage.addListener((r,h,t)=>(r.type==="FETCH_RAW_HTML"&&fetch(r.url).then(e=>e.text()).then(e=>t({html:e})).catch(e=>t({error:e.message})),!0));
