(()=>{
  'use strict';

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
    if(/instagram\.com$/.test(refHost))return'instagram';
    if(/reddit\.com$/.test(refHost))return'reddit';
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
      fetch(TRACK,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          event_name,
          path:location.pathname,
          session_id:sessionId,
          visitor_id:visitorId,
          source,
          referrer_host:refHost||null,
          meta:payload
        }),
        keepalive:true,
        mode:'cors'
      }).catch(()=>{});
    }catch(e){}
  };
  window.sofTrack=track;
  track('page_view',{title:document.title.slice(0,180),version:'home_v3_liquid'});

  const internalHref=(href)=>{
    if(!incoming||!href||!href.startsWith('/'))return href;
    try{
      const u=new URL(href,location.origin);
      if(!u.searchParams.has('src'))u.searchParams.set('src',incoming);
      return u.pathname+u.search+u.hash;
    }catch(e){return href}
  };

  if(incoming){
    document.querySelectorAll('a[href^="/"]').forEach(a=>a.setAttribute('href',internalHref(a.getAttribute('href'))));
  }

  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const partners=(Array.isArray(window.SOF_PARTNERS)?window.SOF_PARTNERS:[])
    .filter(p=>p&&p.enabled!==false)
    .sort((a,b)=>(b.priority||0)-(a.priority||0));

  const categoryMeta={
    trade:{
      label:'Trade',
      decision:'TRADE',
      reason:'Start with the fee terms, then decide whether the outbound trading route fits what you want.',
      guide:'/fomo-fees/',
      guideLabel:'Understand fees first',
      research:'Current fee guide'
    },
    wallets:{
      label:'Store',
      decision:'STORE',
      reason:'Self-custody is a separate decision from trading. Compare the hardware before following a purchase route.',
      guide:'/ledger-flex-vs-nano-gen5/',
      guideLabel:'Compare the hardware first',
      research:'Wallet comparison'
    },
    shop:{
      label:'Shop',
      decision:'SHOP',
      reason:'If you already planned a purchase, a disclosed partner route can be used without pretending the product itself is cheaper.',
      guide:null,
      guideLabel:null,
      research:'Partner disclosure'
    },
    build:{
      label:'Build',
      decision:'BUILD',
      reason:'If you are already choosing hosting or a domain route, see the referral disclosure before leaving SaveOnFees.',
      guide:null,
      guideLabel:null,
      research:'Referral disclosure'
    }
  };

  const categoryLabel={trade:'TRADE',wallets:'STORE',shop:'SHOP',build:'BUILD'};

  const brandVisual=(p)=>{
    const cls=p.category==='wallets'?'wallet':p.visualType==='fomo'?'fomo':p.visualType==='amazon'?'amazon':p.visualType==='hostinger'?'hostinger':'';
    const text=p.visualType==='amazon'?'amazon.de':p.name;
    return `<div class="routeBrandText ${cls}" aria-label="${esc(p.name)}">${esc(text)}</div>`;
  };

  const partnerAttrs=(p,placement)=>`data-partner-id="${esc(p.trackingId||p.id)}" data-partner-type="${esc(p.affiliateType||'partner')}" data-category="${esc(p.category)}" data-placement="${esc(placement)}"`;
  const choosePartner=category=>partners.find(p=>p.category===category)||null;

  let selectedCategory='trade';

  const renderRoute=(category,{scroll=false,trackSelection=false}={})=>{
    if(!categoryMeta[category])return;
    selectedCategory=category;
    const meta=categoryMeta[category];
    const partner=choosePartner(category);

    document.querySelectorAll('[data-job]').forEach(el=>el.classList.toggle('active',el.dataset.job===category));

    const title=document.getElementById('routeDockTitle');
    const reason=document.getElementById('routeDockReason');
    const result=document.getElementById('routeDockResult');
    if(title)title.textContent=meta.label;
    if(reason)reason.textContent=meta.reason;

    if(result){
      if(!partner){
        result.innerHTML=`<div class="routeLoading"><img src="/assets/fs-liquid.svg?v=12" alt=""><span>No active route in this category yet.</span></div>`;
      }else{
        const guide=meta.guide?`<a class="routeSecondary" href="${esc(internalHref(meta.guide))}">${esc(meta.guideLabel)} <span>→</span></a>`:'';
        result.innerHTML=`<article class="routeResultCard">
          <div class="routeProduct">${brandVisual(partner)}</div>
          <div class="routeDetails">
            <span>${esc(categoryLabel[category])} / CURRENT START</span>
            <h4>${esc(partner.name)}</h4>
            <div class="routeBenefit">${esc(partner.benefit||'Partner route')}</div>
            <p>${esc(partner.description||'')}</p>
            <div class="routeActions">
              ${guide}
              <a class="routePrimary" ${partnerAttrs(partner,'home_v3_router')} href="${esc(partner.url)}" target="_blank" rel="sponsored nofollow noopener">${esc(partner.cta||'Open route')} <span>↗</span></a>
            </div>
            <small class="routeDisclosure">${esc(partner.disclosure||'Partner route')} · verify current terms, eligibility and pricing at the destination.</small>
          </div>
        </article>`;
      }
    }

    renderDecision(category,partner);

    if(trackSelection){
      track('tool_use',{action:'category_select',category,partner:partner?.id||null,placement:'home_v3_router'});
    }
    if(scroll){
      document.getElementById('route-dock')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
    }
  };

  const renderDecision=(category,partner)=>{
    const meta=categoryMeta[category];
    const intent=document.getElementById('decisionIntent');
    const research=document.getElementById('decisionResearch');
    const partnerEl=document.getElementById('decisionPartner');
    const action=document.getElementById('decisionAction');
    if(intent)intent.textContent=meta.decision;
    if(research)research.textContent=meta.research;
    if(partnerEl)partnerEl.textContent=partner?.name||'No route yet';

    if(action){
      if(!partner){
        action.innerHTML='<div><span>STATUS</span><strong>No active partner route in this category.</strong></div>';
        return;
      }
      if(meta.guide){
        action.innerHTML=`<div><span>WHY THIS CLICK EXISTS</span><strong>Research first. The partner remains optional.</strong></div>
          <a href="${esc(internalHref(meta.guide))}">${esc(meta.guideLabel)} →</a>`;
      }else{
        action.innerHTML=`<div><span>WHY THIS CLICK EXISTS</span><strong>You already chose ${esc(meta.label.toLowerCase())}; the disclosure is visible before the outbound route.</strong></div>
          <a ${partnerAttrs(partner,'home_v3_decision')} href="${esc(partner.url)}" target="_blank" rel="sponsored nofollow noopener">${esc(partner.cta||'Open route')} ↗</a>`;
      }
    }
  };

  document.querySelectorAll('.choiceCard[data-job]').forEach(card=>{
    card.addEventListener('click',e=>{
      e.preventDefault();
      renderRoute(card.dataset.job,{scroll:true,trackSelection:true});
    });
  });

  document.querySelectorAll('[data-nav-job]').forEach(link=>{
    link.addEventListener('click',e=>{
      const category=link.dataset.navJob;
      if(!categoryMeta[category])return;
      e.preventDefault();
      renderRoute(category,{scroll:false,trackSelection:true});
      closeMenu();
      document.getElementById('router')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    });
  });

  const allRoutesGrid=document.getElementById('allRoutesGrid');
  if(allRoutesGrid){
    allRoutesGrid.innerHTML=partners.map(p=>`<article class="allRouteCard reveal">
      <div class="allRouteTop"><span>${esc(categoryLabel[p.category]||p.category)}</span><span>${esc(p.benefit||'Partner route')}</span></div>
      <div class="allRouteVisual">${brandVisual(p)}</div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.description||'')}</p>
      <div class="allRouteBottom">
        <a ${partnerAttrs(p,'home_v3_all_routes')} href="${esc(p.url)}" target="_blank" rel="sponsored nofollow noopener">${esc(p.cta||'Open route')} ↗</a>
        <small>${esc(p.disclosure||'Partner route')}</small>
      </div>
    </article>`).join('');
  }

  document.addEventListener('click',e=>{
    const partnerLink=e.target.closest('[data-partner-id]');
    if(partnerLink){
      const common={
        partner:partnerLink.dataset.partnerId,
        product:partnerLink.dataset.partnerId,
        category:partnerLink.dataset.category,
        placement:partnerLink.dataset.placement
      };
      if(partnerLink.dataset.partnerId==='fomo')track('referral_click',common);
      else if(partnerLink.dataset.partnerType==='amazon')track('tool_use',{...common,action:'amazon_click'});
      else track('tool_use',{...common,action:'partner_click'});
    }
    const tool=e.target.closest('[data-tool]');
    if(tool)track('tool_use',{action:'tool_open',tool:tool.dataset.tool,placement:'home_v3_tools'});
    const social=e.target.closest('[data-social]');
    if(social)track('tool_use',{action:'social_click',network:social.dataset.social,placement:'footer'});
  });

  const menuBtn=document.querySelector('.menuButton');
  const mobileMenu=document.querySelector('.mobileMenu');
  function closeMenu(){
    document.body.classList.remove('menuOpen');
    menuBtn?.setAttribute('aria-expanded','false');
    mobileMenu?.setAttribute('aria-hidden','true');
  }
  menuBtn?.addEventListener('click',()=>{
    const open=!document.body.classList.contains('menuOpen');
    document.body.classList.toggle('menuOpen',open);
    menuBtn.setAttribute('aria-expanded',open?'true':'false');
    mobileMenu?.setAttribute('aria-hidden',open?'false':'true');
  });
  mobileMenu?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
  addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  const nav=document.getElementById('siteNav');
  const updateNav=()=>nav?.classList.toggle('scrolled',scrollY>24);
  updateNav();
  addEventListener('scroll',updateNav,{passive:true});

  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls=[...document.querySelectorAll('.reveal')];
  if(reduce){
    revealEls.forEach(el=>el.classList.add('in'));
  }else{
    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },{threshold:.1,rootMargin:'0px 0px -4%'});
    revealEls.forEach((el,i)=>{
      if(el.closest('.choiceGrid,.toolGrid,.trustGrid,.allRoutesGrid'))el.style.transitionDelay=`${Math.min((i%4)*55,165)}ms`;
      revealObserver.observe(el);
    });
  }

  const storySteps=[...document.querySelectorAll('.storyStep')];
  if(storySteps.length){
    if(reduce){
      storySteps.forEach(s=>s.classList.add('active'));
    }else{
      const storyObserver=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            storySteps.forEach(s=>s.classList.remove('active'));
            entry.target.classList.add('active');
          }
        });
      },{threshold:.48});
      storySteps.forEach(s=>storyObserver.observe(s));
    }
  }

  const storySection=document.getElementById('story');
  const storyProgress=document.getElementById('storyProgress');
  let scrollTick=false;
  const updateStoryProgress=()=>{
    scrollTick=false;
    if(!storySection||!storyProgress||reduce)return;
    const rect=storySection.getBoundingClientRect();
    const travel=Math.max(1,rect.height-innerHeight);
    const passed=Math.min(Math.max(-rect.top,0),travel);
    storyProgress.style.height=`${Math.min(100,Math.max(0,(passed/travel)*100)).toFixed(1)}%`;
  };
  if(!reduce){
    addEventListener('scroll',()=>{
      if(!scrollTick){
        scrollTick=true;
        requestAnimationFrame(updateStoryProgress);
      }
    },{passive:true});
    updateStoryProgress();
  }

  const decisionWidget=document.querySelector('.decisionWidget');
  const decisionNodes=[...document.querySelectorAll('.decisionNode')];
  if(decisionWidget&&decisionNodes.length&&!reduce){
    const decisionObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          decisionNodes.forEach((node,i)=>setTimeout(()=>node.classList.add('active'),i*210));
          decisionObserver.disconnect();
        }
      });
    },{threshold:.35});
    decisionObserver.observe(decisionWidget);
  }else if(reduce){
    decisionNodes.forEach(n=>n.classList.add('active'));
  }

  const fine=matchMedia('(pointer:fine)').matches&&!reduce;
  if(fine){
    const stage=document.getElementById('liquidStage');
    stage?.addEventListener('pointermove',e=>{
      const r=stage.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      stage.style.setProperty('--ry',`${(x*5).toFixed(2)}deg`);
      stage.style.setProperty('--rx',`${(-y*3.5).toFixed(2)}deg`);
      stage.style.setProperty('--px',`${((x+.5)*100).toFixed(1)}%`);
      stage.style.setProperty('--py',`${((y+.5)*100).toFixed(1)}%`);
    });
    stage?.addEventListener('pointerleave',()=>{
      stage.style.setProperty('--ry','0deg');
      stage.style.setProperty('--rx','0deg');
    });

    document.querySelectorAll('.choiceCard').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx',`${((e.clientX-r.left)/r.width*100).toFixed(1)}%`);
        card.style.setProperty('--my',`${((e.clientY-r.top)/r.height*100).toFixed(1)}%`);
      });
    });
  }

  renderRoute('trade',{scroll:false,trackSelection:false});
})();