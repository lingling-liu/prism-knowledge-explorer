(function(){
  const KEY="prismExplorerLanguage";
  const select=document.getElementById("languageSelect");
  let language=localStorage.getItem(KEY)||"en",timer=0,locked=false;
  const cache=new Map(),pending=new Set();
  const combo=()=>document.querySelector(".goog-te-combo");
  function syncLanguages(){
    const control=combo();if(!control)return false;
    const options=[...control.options].filter(option=>option.value&&option.value!=="en");
    if(!options.length)return false;
    select.replaceChildren(new Option("English","en"),...options.map(option=>new Option(option.textContent,option.value)));
    if(![...select.options].some(option=>option.value===language))language="en";
    select.value=language;select.disabled=false;
    return true;
  }
  function choose(value){
    language=value||"en";select.value=language;localStorage.setItem(KEY,language);document.documentElement.lang=language;
    if(language==="en"){
      document.cookie="googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie="googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain="+location.hostname;
      document.cookie="googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path="+location.pathname.replace(/[^/]*$/,"");
      location.reload();return;
    }
    const control=combo();if(!control){setTimeout(()=>choose(language),250);return}
    control.value=language;control.dispatchEvent(new Event("change",{bubbles:true}));
    setTimeout(()=>translateVisible(),1200);
  }
  window.prismGoogleTranslateInit=function(){
    new google.translate.TranslateElement({pageLanguage:"en",autoDisplay:false,multilanguagePage:true},"google_translate_element");
    const host=document.getElementById("google_translate_element");
    const observer=new MutationObserver(()=>{if(syncLanguages()){observer.disconnect();if(language!=="en")choose(language)}});
    observer.observe(host,{childList:true,subtree:true});
    if(syncLanguages()){observer.disconnect();if(language!=="en")choose(language)}
  };
  async function translateText(parts,targetLanguage){
    const marker="[[[PRISM_SPLIT_7F3]]]";
    const url="https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl="+encodeURIComponent(targetLanguage)+"&dt=t&q="+encodeURIComponent(parts.join("\n"+marker+"\n"));
    const response=await fetch(url);if(!response.ok)throw new Error("Translation request failed");
    const data=await response.json();return data[0].map(segment=>segment[0]).join("").split(marker).map(value=>value.trim());
  }
  async function translateCard(card){
    if(language==="en")return;const targetLanguage=language,index=Number(card.dataset.resourceIndex),key=targetLanguage+":"+index;if(pending.has(key))return;pending.add(key);
    try{
      const record=PRISM_DATA[index];const fields=[record.type||"Resource",record.pollution||"",record.location||"",record.name||"Untitled resource",record.description||"No description available.","Source",record.source||"Not specified",record.thumbnailAlt||""];
      let translated=cache.get(key);if(!translated){translated=await translateText(fields,targetLanguage);cache.set(key,translated)}
      if(language!==targetLanguage)return;
      const names=["type","pollution","location","name","description","sourceLabel","source"];
      names.forEach((name,i)=>{const node=card.querySelector(`[data-translate-field="${name}"]`);if(node&&translated[i])node.textContent=translated[i]});
      const translatedName=translated[3]||record.name,translatedAlt=translated[7]||record.thumbnailAlt;card.querySelectorAll("a").forEach(link=>{if(link.classList.contains("card-image")||link.classList.contains("open-link"))link.setAttribute("aria-label","Open "+translatedName)});const image=card.querySelector("img");if(image&&translatedAlt)image.alt=translatedAlt;
    }catch(error){console.warn("Dynamic resource translation unavailable",error)}finally{pending.delete(key)}
  }
  function translateVisible(){if(language==="en")return;const cards=[...document.querySelectorAll(".resource-card:not(.prism-concealed)")];let cursor=0;async function worker(){while(cursor<cards.length)await translateCard(cards[cursor++])}Promise.all(Array.from({length:4},worker));}
  window.PRISM_TRANSLATE={refresh(){if(language==="en"||locked)return;clearTimeout(timer);timer=setTimeout(()=>{const control=combo();if(!control)return;locked=true;control.value="";requestAnimationFrame(()=>{control.value=language;control.dispatchEvent(new Event("change",{bubbles:true}));setTimeout(()=>locked=false,900)})},180)},translateVisible};
  select.value=language;select.addEventListener("change",event=>choose(event.target.value));
})();
