(()=>{
  const TRACK='https://usshkvzljddfjuyuxtcu.supabase.co/functions/v1/track';
  const rid=()=>crypto.randomUUID?crypto.randomUUID():'sof_'+Date.now().toString(36)+Math.random().toString(36).slice(2);

  let sid,vid;
  try{
    sid=sessionStorage.getItem('sof_session')||rid();
    sessionStorage.setItem('sof_session',sid);
  }catch(e){sid=rid()}
  try{
    vid=localStorage.getItem('sof_visitor')||rid();
    localStorage.setItem('sof_visitor',vid);
  }catch(e){vid=sid}

  const params=new URLSearchParams(location.search);
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
    if(/instagram\.com$/.test(refHost))return'instagram';
    return refHost||'direct';
  };

  const source=inferSource().slice(0,80);
  try{sessionStorage.setItem('sof_source',source)}catch(e){}

  const track=(event_name,meta={})=>{
    try{
      fetch(TRACK,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          event_name,
          path:location.pathname,
          session_id:sid,
          visitor_id:vid,
          source,
          referrer_host:refHost||null,
          meta
        }),
        keepalive:true,
        mode:'cors'
      }).catch(()=>{});
    }catch(e){}
  };
  window.sofTrack=track;
  track('page_view',{title:document.title.slice(0,180),layout:'home_v11'});

  if(incoming){
    document.querySelectorAll('a[href^="/"]').forEach(a=>{
      try{
        const u=new URL(a.getAttribute('href'),location.origin);
        if(!u.searchParams.has('src'))u.searchParams.set('src',incoming);
        a.setAttribute('href',u.pathname+u.search+u.hash);
      }catch(e){}
    });
  }

  const menuBtn=document.querySelector('.menuButton');
  const mobileMenu=document.querySelector('.mobileMenu');
  const closeMenu=()=>{
    document.body.classList.remove('menuOpen');
    menuBtn?.setAttribute('aria-expanded','false');
    mobileMenu?.setAttribute('aria-hidden','true');
  };
  menuBtn?.addEventListener('click',()=>{
    const open=!document.body.classList.contains('menuOpen');
    document.body.classList.toggle('menuOpen',open);
    menuBtn.setAttribute('aria-expanded',open?'true':'false');
    mobileMenu?.setAttribute('aria-hidden',open?'false':'true');
  });
  mobileMenu?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
  addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  const progress=document.querySelector('.scrollProgress span');
  const updateProgress=()=>{
    if(!progress)return;
    const max=document.documentElement.scrollHeight-innerHeight;
    const value=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
    progress.style.transform=`scaleX(${value})`;
  };
  addEventListener('scroll',updateProgress,{passive:true});
  addEventListener('resize',updateProgress,{passive:true});
  updateProgress();

  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
  }else{
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },{threshold:.10,rootMargin:'0px 0px -35px'});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

    if(matchMedia('(pointer:fine)').matches){
      document.querySelectorAll('[data-tilt]').forEach(card=>{
        card.addEventListener('pointermove',e=>{
          const r=card.getBoundingClientRect();
          const px=(e.clientX-r.left)/r.width;
          const py=(e.clientY-r.top)/r.height;
          const rx=(.5-py)*4.2;
          const ry=(px-.5)*5.2;
          card.style.setProperty('--mx',`${(px*100).toFixed(1)}%`);
          card.style.setProperty('--my',`${(py*100).toFixed(1)}%`);
          card.style.transform=`perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
        });
        card.addEventListener('pointerleave',()=>{card.style.transform=''});
      });

      const hero=document.querySelector('[data-hero-tilt]');
      hero?.addEventListener('pointermove',e=>{
        const r=hero.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-.5;
        const py=(e.clientY-r.top)/r.height-.5;
        hero.style.transform=`perspective(1200px) rotateX(${(-py*3.4).toFixed(2)}deg) rotateY(${(px*4.8).toFixed(2)}deg)`;
      });
      hero?.addEventListener('pointerleave',()=>{hero.style.transform=''});
    }
  }

  document.querySelectorAll('[data-partner-id]').forEach((a,i)=>{
    a.addEventListener('click',()=>{
      const common={
        partner:a.dataset.partnerId,
        product:a.dataset.partnerId,
        category:a.dataset.category,
        placement:a.dataset.placement,
        card_position:i+1
      };
      if(a.dataset.partnerId==='fomo')track('referral_click',common);
      else if(a.dataset.partnerType==='amazon')track('tool_use',{...common,action:'amazon_click'});
      else track('tool_use',{...common,action:'partner_click'});
    });
  });

  document.querySelectorAll('[data-tool]').forEach(a=>{
    a.addEventListener('click',()=>track('tool_use',{action:'tool_open',tool:a.dataset.tool,placement:'home_tools'}));
  });

  document.querySelectorAll('[data-social]').forEach(a=>{
    a.addEventListener('click',()=>track('tool_use',{action:'social_click',network:a.dataset.social,placement:'footer'}));
  });
})();