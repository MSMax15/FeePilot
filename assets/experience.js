(()=>{
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;
  const TRACK='https://usshkvzljddfjuyuxtcu.supabase.co/functions/v1/track';
  const rid=()=>crypto.randomUUID?crypto.randomUUID():'sof_'+Date.now().toString(36)+Math.random().toString(36).slice(2);
  const params=new URLSearchParams(location.search);

  document.documentElement.classList.add('sof-v3');
  document.body.classList.add('subpageV3');

  qa('.brand img').forEach(img=>{img.src='/assets/fs-liquid.svg?v=12';img.alt='SaveOnFees FS logo'});
  qa('link[rel~="icon"]').forEach(link=>{link.href='/assets/fs-liquid.svg?v=12';link.type='image/svg+xml'});

  let visitorId; try{visitorId=localStorage.getItem('sof_visitor')||rid();localStorage.setItem('sof_visitor',visitorId)}catch(e){visitorId=rid()}
  let sessionId; try{sessionId=sessionStorage.getItem('sof_session')||rid();sessionStorage.setItem('sof_session',sessionId)}catch(e){sessionId=rid()}
  try{if(params.get('owner')==='1')localStorage.setItem('sof_owner','1');if(params.get('owner')==='0')localStorage.removeItem('sof_owner')}catch(e){}
  let internal=false; try{internal=localStorage.getItem('sof_owner')==='1'}catch(e){}

  const incoming=(params.get('src')||params.get('utm_source')||'').slice(0,40);
  let refHost=''; try{refHost=document.referrer?new URL(document.referrer).hostname.slice(0,180):''}catch(e){}
  const infer=()=>{if(incoming)return incoming;let saved='';try{saved=sessionStorage.getItem('sof_source')||''}catch(e){}if(saved)return saved;if(/(^|\.)x\.com$|(^|\.)twitter\.com$/.test(refHost))return'x';if(/google\./.test(refHost))return'google';if(/bing\./.test(refHost))return'bing';return refHost||'direct'};
  const source=infer().slice(0,80);try{sessionStorage.setItem('sof_source',source)}catch(e){}
  const track=(event_name,meta={})=>{const payload={...meta};if(internal)payload.internal=true;try{fetch(TRACK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event_name,path:location.pathname,session_id:sessionId,visitor_id:visitorId,source,referrer_host:refHost||null,meta:payload}),keepalive:true,mode:'cors'}).catch(()=>{})}catch(e){}};
  window.sofTrack=track; track('page_view',{title:document.title.slice(0,180),design:'v3'});

  if(incoming)qa('a[href^="/"]').forEach(a=>{try{const u=new URL(a.getAttribute('href'),location.origin);if(!u.searchParams.has('src'))u.searchParams.set('src',incoming);a.setAttribute('href',u.pathname+u.search+u.hash)}catch(e){}});

  const progress=q('.progress');
  const onScroll=()=>{const d=document.documentElement,h=d.scrollHeight-d.clientHeight;if(progress)progress.style.width=(h?d.scrollTop/h*100:0)+'%';document.body.classList.toggle('subpageScrolled',scrollY>24)};
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  const revealEls=qa('.reveal');
  if(reduce)revealEls.forEach(x=>x.classList.add('in'));
  else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.10,rootMargin:'0px 0px -3%'});revealEls.forEach(x=>io.observe(x))}

  if(fine&&!reduce){
    qa('.tilt,.card,.panel,.refbox,.heroArt').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--mx',`${((x+.5)*100).toFixed(1)}%`);el.style.setProperty('--my',`${((y+.5)*100).toFixed(1)}%`);if(el.classList.contains('tilt')||el.classList.contains('heroArt'))el.style.transform=`perspective(1000px) rotateX(${(-y*3.5).toFixed(2)}deg) rotateY(${(x*4.5).toFixed(2)}deg) translateY(-2px)`});
      el.addEventListener('pointerleave',()=>{el.style.transform='';el.style.setProperty('--mx','50%');el.style.setProperty('--my','50%')});
    });
  }

  window.copyReferral=async()=>{track('tool_use',{action:'copy_referral'});try{await navigator.clipboard.writeText('LMP506');const m=q('#copyMsg');if(m){m.textContent='Copied LMP506';setTimeout(()=>m.textContent='',1700)}}catch(e){}};
  window.sharePage=async(title='SaveOnFees')=>{track('share',{action:'share_page'});if(navigator.share){try{await navigator.share({title,url:location.href})}catch(e){}}else try{await navigator.clipboard.writeText(location.href)}catch(e){}};

  qa('a[href^="https://fomo.family/r/LMP506"]').forEach(a=>a.addEventListener('click',()=>{track('referral_click',{label:(a.textContent||'').trim().slice(0,120),placement:'subpage_v3'});try{localStorage.setItem('sof_last_ref_click',JSON.stringify({at:Date.now(),source,path:location.pathname}))}catch(e){}}));
  qa('a[href*="amazon.de"]').forEach(a=>a.addEventListener('click',()=>track('tool_use',{action:'amazon_click',placement:'subpage_v3'})));

  const f=q('.footer .wrap');
  if(f&&!q('.autoFooterLinks',f)){
    const n=document.createElement('div');n.className='autoFooterLinks';
    n.innerHTML='<a href="/">Home</a><a href="/crypto-tools/">Tools</a><a href="/fomo-fees/">FOMO fees</a><a href="/fomo-referral-code/">Referral</a><a href="/ledger-flex-vs-nano-gen5/">Wallets</a><a href="/would-you-ape/">Would You Ape?</a><a href="https://www.instagram.com/save.onfees/" target="_blank" rel="noopener">Instagram</a>';
    f.appendChild(n);
  }

  if(location.pathname!=='/crypto-tools/'){
    const affiliate=document.createElement('script');affiliate.src='/assets/ledger-affiliate.js?v=4';affiliate.defer=true;document.head.appendChild(affiliate);
  }
})();