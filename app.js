(function(){
  const LABELS={location:"Location",pollution:"Pollution type",theme:"Theme",type:"Resource type"};
  const state={search:"",location:new Set(),pollution:new Set(),theme:new Set(),type:new Set(),sort:"recommended",limit:24};
  const el=id=>document.getElementById(id);
  const escapeHtml=s=>String(s||"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#039;"}[c]));
  const domains={location:r=>r.location,pollution:r=>r.pollution,theme:r=>r.theme,type:r=>r.type};
  function valuesFor(key){return [...new Set(PRISM_DATA.map(domains[key]).filter(Boolean))].sort((a,b)=>a.localeCompare(b));}
  function filtered(except){return PRISM_DATA.filter(r=>{
    const q=state.search.trim().toLowerCase();
    const hay=[r.name,r.description,r.source,r.location,r.pollution,r.theme,r.type].join(" ").toLowerCase();
    if(q&&!hay.includes(q))return false;
    return Object.keys(domains).every(k=>k===except||!state[k].size||state[k].has(domains[k](r)));
  });}
  function buildFilters(){el("filterGroups").innerHTML=Object.keys(domains).map(key=>`<section class="filter-group"><h3>${LABELS[key]}</h3>${valuesFor(key).map(v=>`<label class="filter-option"><input type="checkbox" data-key="${key}" value="${escapeHtml(v)}"><span>${escapeHtml(v)}</span><span class="count" data-count="${key}|${escapeHtml(v)}"></span></label>`).join("")}</section>`).join("");}
  function updateCounts(){Object.keys(domains).forEach(key=>{const base=filtered(key);valuesFor(key).forEach(v=>{const node=document.querySelector(`[data-count="${CSS.escape(key+"|"+v)}"]`);if(node)node.textContent=base.filter(r=>domains[key](r)===v).length;});});}
  function chips(){const parts=[];Object.keys(domains).forEach(k=>state[k].forEach(v=>parts.push(`<button type="button" data-remove="${k}|${escapeHtml(v)}">${escapeHtml(v)} <span aria-hidden="true">×</span></button>`)));if(state.search)parts.push(`<button type="button" data-search-remove="1">“${escapeHtml(state.search)}” <span aria-hidden="true">×</span></button>`);el("activeFilters").innerHTML=parts.join("");}
  function card(r){const href=/^https?:\/\//i.test(r.link)?r.link:"#";return `<article class="resource-card"><div class="card-meta"><span class="pill type">${escapeHtml(r.type||"Resource")}</span>${r.pollution?`<span class="pill">${escapeHtml(r.pollution)}</span>`:""}${r.location?`<span class="pill">${escapeHtml(r.location)}</span>`:""}</div><a class="card-image" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(r.name||"resource")}"><img src="${escapeHtml(r.thumbnail)}" alt="${escapeHtml(r.thumbnailAlt)}" loading="lazy" decoding="async"></a><div class="card-body"><h2>${escapeHtml(r.name||"Untitled resource")}</h2><p>${escapeHtml(r.description||"No description available.")}</p><div class="card-footer"><div class="source-label"><span>Source</span><strong title="${escapeHtml(r.source)}">${escapeHtml(r.source||"Not specified")}</strong></div><a class="open-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(r.name)}">↗</a></div></div></article>`;}
  function render(){let list=filtered();if(state.sort==="az")list.sort((a,b)=>a.name.localeCompare(b.name));if(state.sort==="source")list.sort((a,b)=>a.source.localeCompare(b.source));const shown=list.slice(0,state.limit);el("cardGrid").innerHTML=shown.map(card).join("");el("resultCount").textContent=`${list.length} ${list.length===1?"resource":"resources"}`;const active=Object.values(state).filter(v=>v instanceof Set).reduce((n,s)=>n+s.size,0);el("resultSummary").textContent=active||state.search?"Matching your current filters":"Showing all resources";el("totalCount").textContent=PRISM_DATA.length;el("loadMore").hidden=list.length<=state.limit;el("emptyState").hidden=list.length>0;chips();updateCounts();}
  function clearAll(){state.search="";Object.keys(domains).forEach(k=>state[k].clear());state.limit=24;el("searchInput").value="";document.querySelectorAll('.filter-option input').forEach(i=>i.checked=false);render();}
  buildFilters();
  el("filterGroups").addEventListener("change",e=>{if(!e.target.matches("input"))return;const {key}=e.target.dataset;e.target.checked?state[key].add(e.target.value):state[key].delete(e.target.value);state.limit=24;render();});
  el("searchInput").addEventListener("input",e=>{state.search=e.target.value;state.limit=24;render();});
  el("sortSelect").addEventListener("change",e=>{state.sort=e.target.value;render();});
  el("clearButton").addEventListener("click",clearAll);el("emptyClear").addEventListener("click",clearAll);
  el("loadMore").addEventListener("click",()=>{state.limit+=24;render();});
  el("activeFilters").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.searchRemove){state.search="";el("searchInput").value="";}else{const [k,v]=b.dataset.remove.split("|");state[k].delete(v);const input=[...document.querySelectorAll(`input[data-key="${k}"]`)].find(i=>i.value===v);if(input)input.checked=false;}render();});
  document.addEventListener("keydown",e=>{if(e.key==="/"&&!/input|textarea|select/i.test(document.activeElement.tagName)){e.preventDefault();el("searchInput").focus();}});
  const closeMobile=()=>{el("filtersPanel").classList.remove("open");el("mobileBackdrop").classList.remove("open");el("mobileFilterButton").setAttribute("aria-expanded","false")};
  el("mobileFilterButton").addEventListener("click",()=>{el("filtersPanel").classList.add("open");el("mobileBackdrop").classList.add("open");el("mobileFilterButton").setAttribute("aria-expanded","true")});el("mobileBackdrop").addEventListener("click",closeMobile);
  const dialog=el("aboutDialog");el("aboutButton").addEventListener("click",()=>dialog.showModal());el("dialogClose").addEventListener("click",()=>dialog.close());
  render();
})();
