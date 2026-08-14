(()=>{
  const TRACK='https://usshkvzljddfjuyuxtcu.supabase.co/functions/v1/track';
  const rid=()=>crypto.randomUUID?crypto.randomUUID():'sof_'+Date.now().toString(36)+Math.random().toString(36).slice(2);
  const params=new URLSearchParams(location.search);

  let visitorId;
  try{visitorId=localStorage.getItem('sof_visitor')||rid();localStorage.setItem('sof_visitor',visitorId)}catch(e){visitorId=rid()}
  let sessionId;
  try{sessionId=sessionStorage.getItem('sof_session')||rid();sessionStorage.setItem('sof_session',sessionId)}catch(e){sessionId=rid()}

  try{
    if(params.get('owner')==='1')localStorage.setItem('sof_owner','1');
    if(params.get('owner')==='0')localStorage.removeItem('sof_owner');
  }catch(e){}
  let internal=false;
  try{internal=localStorage.getItem('sof_owner')==='1'}catch(e){}

  const incoming=(params.get('src')||params.get('utm_source')||'').slice(0,40);
  let refHost='';
  try{refHost=document.referrer?new URL(document.referrer).hostname.slice(0,180):''}catch(e){}
  const inferSource=()=>{
    if(incoming)return incoming;
    let saved='';
    try{saved=sessionStorage.getItem('sof_source')||''}catch(e){}
    if(saved)return saved;
    if(/(^|\.)x\.com$|(^|\.)twitter\.com$/.test(refHost))return'x';
    if(/google\./.test(refHost))return'google';
    if(/bing\./.test(refHost))return'bing';
    return refHost||'direct';
  };
  const source=inferSource().slice(0,80);
  try{sessionStorage.setItem('sof_source',source)}catch(e){}

  const track=(event_name,meta={})=>{
    const payload={...meta};
    if(internal)payload.internal=true;
    try{
      fetch(TRACK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event_name,path:location.pathname,session_id:sessionId,visitor_id:visitorId,source,referrer_host:refHost||null,meta:payload}),keepalive:true,mode:'cors'}).catch(()=>{});
    }catch(e){}
  };
  window.sofTrack=track;
  track('page_view',{title:document.title.slice(0,180)});

  if(incoming){
    document.querySelectorAll('a[href^="/"]').forEach(a=>{
      try{const u=new URL(a.getAttribute('href'),location.origin);if(!u.searchParams.has('src'))u.searchParams.set('src',incoming);a.setAttribute('href',u.pathname+u.search+u.hash)}catch(e){}
    });
  }

  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const partners=(Array.isArray(window.SOF_PARTNERS)?window.SOF_PARTNERS:[]).filter(p=>p&&p.enabled!==false).sort((a,b)=>(b.priority||0)-(a.priority||0));
  const categoryLabel={trade:'TRADE',wallets:'WALLETS',shop:'SHOP',build:'BUILD'};

  const brandVisual=(p,context='route')=>{
    if(p.image)return `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`;
    const cls=p.visualType==='fomo'?'fomo':p.visualType==='amazon'?'amazon':p.visualType==='hostinger'?'hostinger':'';
    const name=p.visualType==='amazon'?'amazon.de':p.name;
    return `<div class="${context==='result'?'resultBrand':'routeBrand'} ${cls}">${esc(name)}</div>`;
  };

  const partnerAttrs=(p,placement)=>`data-partner-id="${esc(p.trackingId||p.id)}" data-partner-type="${esc(p.affiliateType||'partner')}" data-category="${esc(p.category)}" data-placement="${esc(placement)}"`;

  const routeCard=p=>`<article class="routeCard reveal" data-category="${esc(p.category)}">
    <div class="routeTop"><span>${esc(categoryLabel[p.category]||p.category)}</span><span>${esc(p.benefit||'Partner route')}</span></div>
    <div class="routeMedia">${brandVisual(p)}</div>
    <div class="routeBody"><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="routeChips">${(p.chips||[]).map(c=>`<span>${esc(c)}</span>`).join('')}</div></div>
    <div class="routeBottom"><a ${partnerAttrs(p,'home_all_routes')} href="${esc(p.url)}" target="_blank" rel="sponsored nofollow noopener">${esc(p.cta||'Open route')} <span>↗</span></a><small>${esc(p.disclosure||'Partner route')}</small></div>
  </article>`;

  const routeGrid=document.getElementById('routeGrid');
  if(routeGrid)routeGrid.innerHTML=partners.map(routeCard).join('');

  const finderResult=document.getElementById('finderResult');
  const resultMarkup=(p)=>{
    const alternatives=partners.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,2);
    return `<article class="resultCard">
      <div class="resultLabel"><span>RELEVANT ROUTE</span><span>${esc(categoryLabel[p.category]||p.category)}</span></div>
      <div class="resultVisual">${brandVisual(p,'result')}</div>
      <h3>${esc(p.name)}</h3>
      <div class="resultBenefit">${esc(p.benefit||'Partner route')}</div>
      <p>${esc(p.description)}</p>
      <a class="resultCta" ${partnerAttrs(p,'home_finder')} href="${esc(p.url)}" target="_blank" rel="sponsored nofollow noopener">${esc(p.cta||'Open route')} <span>↗</span></a>
      <small class="resultDisclosure">${esc(p.disclosure||'Partner route')} · verify current terms at destination</small>
      ${alternatives.length?`<div class="resultAlternatives"><b>Other ${esc(p.category)} routes</b><div class="altLinks">${alternatives.map(a=>`<a class="altLink" ${partnerAttrs(a,'home_finder_alt')} href="${esc(a.url)}" target="_blank" rel="sponsored nofollow noopener">${esc(a.name)} ↗</a>`).join('')}</div></div>`:''}
    </article>`;
  };

  document.querySelectorAll('[data-job]').forEach(btn=>btn.addEventListener('click',()=>{
    const job=btn.dataset.job;
    document.querySelectorAll('[data-job]').forEach(b=>b.classList.toggle('active',b===btn));
    const match=partners.find(p=>p.category===job);
    if(!match||!finderResult)return;
    finderResult.innerHTML=resultMarkup(match);
    track('tool_use',{action:'route_finder',category:job,partner:match.id,placement:'home_finder'});
  }));

  document.addEventListener('click',e=>{
    const partnerLink=e.target.closest('[data-partner-id]');
    if(partnerLink){
      const common={partner:partnerLink.dataset.partnerId,product:partnerLink.dataset.partnerId,category:partnerLink.dataset.category,placement:partnerLink.dataset.placement};
      if(partnerLink.dataset.partnerId==='fomo')track('referral_click',common);
      else if(partnerLink.dataset.partnerType==='amazon')track('tool_use',{...common,action:'amazon_click'});
      else track('tool_use',{...common,action:'partner_click'});
    }
    const tool=e.target.closest('[data-tool]');
    if(tool)track('tool_use',{action:'tool_open',tool:tool.dataset.tool,placement:'home_tools'});
    const social=e.target.closest('[data-social]');
    if(social)track('tool_use',{action:'social_click',network:social.dataset.social,placement:'footer'});
  });

  const menuBtn=document.querySelector('.menuButton');
  const mobileMenu=document.querySelector('.mobileMenu');
  const closeMenu=()=>{document.body.classList.remove('menuOpen');menuBtn?.setAttribute('aria-expanded','false');mobileMenu?.setAttribute('aria-hidden','true')};
  menuBtn?.addEventListener('click',()=>{const open=!document.body.classList.contains('menuOpen');document.body.classList.toggle('menuOpen',open);menuBtn.setAttribute('aria-expanded',open?'true':'false');mobileMenu?.setAttribute('aria-hidden',open?'false':'true')});
  mobileMenu?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
  addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls=[...document.querySelectorAll('.reveal')];
  if(reduce)revealEls.forEach(el=>el.classList.add('in'));
  else{
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target)}}),{threshold:.11,rootMargin:'0px 0px -3%'});
    revealEls.forEach(el=>io.observe(el));
  }

  const fine=matchMedia('(pointer:fine)').matches&&!reduce;
  if(fine){
    const stage=document.querySelector('.feeStage');
    stage?.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.setProperty('--ry',`${(x*6).toFixed(2)}deg`);stage.style.setProperty('--rx',`${(-y*4).toFixed(2)}deg`)});
    stage?.addEventListener('pointerleave',()=>{stage.style.setProperty('--ry','0deg');stage.style.setProperty('--rx','0deg')});
    document.querySelectorAll('.routeCard').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${((e.clientX-r.left)/r.width*100).toFixed(1)}%`);card.style.setProperty('--my',`${((e.clientY-r.top)/r.height*100).toFixed(1)}%`)}));
  }
})();