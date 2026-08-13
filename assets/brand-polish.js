(()=>{
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const markTile=(sel,html)=>qa(sel).forEach(el=>{el.innerHTML=html});
  markTile('.brand-fomo','<span class="brandWordmark word-fomo">fomo</span><span class="brandMeta">official platform name</span>');
  markTile('.brand-amazon','<span class="availableAtAmazon"><small>Available at</small> Amazon</span><span class="brandMeta">affiliate route</span>');
  markTile('.brand-hostinger','<span class="brandWordmark word-hostinger">Hostinger®</span><span class="brandMeta">hosting & domains</span>');

  const ledgerFlex='https://ledger.com/cdn-cgi/image/width%3D3840%2Cformat%3Dauto/https%3A//images.ctfassets.net/ge894kijjvls/uWg3epsNdyRgJe5KTzOWc/3e9c587cb1154e4708f6fe596d5c27bf/flex_hero_graphite_mobile.webp';
  const ledgerNano='https://images.ctfassets.net/ge894kijjvls/UReddx7EcLyP7Bl9QWEdg/546928dbe7b4a67d8f11cfbacf9f95c6/transaction_check.webp';
  qa('.offerCard').forEach(card=>{
    const title=(q('.offerBody h3',card)?.textContent||'').trim();
    const media=q('.offerMedia',card);
    if(!media)return;
    if(/Ledger/i.test(title)&&!q('.realBrandLabel',media)){
      const l=document.createElement('span');l.className='realBrandLabel';l.textContent='LEDGER';media.appendChild(l);
    }
    if(title==='More Ledger'){
      media.innerHTML=`<span class="realBrandLabel">LEDGER</span><div class="devicePair"><img src="${ledgerFlex}" alt="Ledger Flex" loading="lazy" decoding="async"><img src="${ledgerNano}" alt="Ledger Nano Gen5" loading="lazy" decoding="async"></div>`;
    }
    const top=q('.offerTopline',card);
    if(top&&!q('.offerStatus',top)){
      const s=document.createElement('span');s.className='offerStatus';s.textContent='route live';top.appendChild(s);
    }
  });

  qa('.offerMedia img').forEach((img,i)=>{
    img.decoding='async';
    if(i<2)img.fetchPriority='high';
    img.addEventListener('error',()=>{
      const media=img.closest('.offerMedia');if(!media||media.dataset.fallback==='1')return;
      media.dataset.fallback='1';
      const title=(q('.offerBody h3',img.closest('.offerCard'))?.textContent||'Product').trim();
      media.innerHTML=`<div class="imageFallback"><strong>${title.replace(/[<>]/g,'')}</strong><span>official product visual unavailable</span></div>`;
    },{once:true});
  });

  const dock=q('#browse .shell');
  const filters=q('#offerFilters');
  const grid=q('#offerGrid');
  if(dock&&filters&&grid&&!q('.offerSearchRow',dock)){
    const row=document.createElement('div');row.className='offerSearchRow';
    row.innerHTML='<label class="offerSearchBox"><span>⌕</span><input id="offerSearch" type="search" inputmode="search" autocomplete="off" placeholder="Search routes: Ledger, Amazon, hosting…" aria-label="Search offers"></label><div class="offerCount" id="offerCount"></div>';
    filters.before(row);
    const input=q('#offerSearch',row),count=q('#offerCount',row);
    const apply=()=>{
      const term=(input.value||'').trim().toLowerCase();
      const active=q('[data-filter].active',filters)?.dataset.filter||'all';
      let shown=0;
      qa('.offerCard',grid).forEach(card=>{
        const text=(card.textContent||'').toLowerCase();
        const category=card.dataset.category||'';
        const okCat=active==='all'||category===active;
        const okText=!term||text.includes(term);
        card.hidden=!(okCat&&okText);if(okCat&&okText)shown++;
      });
      count.textContent=`${shown} route${shown===1?'':'s'} shown`;
    };
    input.addEventListener('input',apply);
    filters.addEventListener('click',()=>setTimeout(apply,0));
    apply();
  }

  const disclosure=q('.footerText');
  if(disclosure&&!/Amazon and the Amazon logo/.test(disclosure.textContent||'')){
    disclosure.insertAdjacentHTML('beforeend','<br><span>Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. Amazon links are affiliate links.</span>');
  }
})();