import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Globe2, MoveRight } from 'lucide-react'
import BrandMark from './BrandMark'
import { relics, museums } from './catalog'
const LandscapeBackdrop=lazy(()=>import('./LandscapeBackdrop'))

export default function Landing({language,onLanguage,onEnter}) {
  const [opening,setOpening]=useState(false)
  const timer=useRef(null)
  const t=(zh,en)=>language==='zh'?zh:en
  useEffect(()=>()=>window.clearTimeout(timer.current),[])
  function trackPointer(event){
    if(event.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const box=event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pan-x',((event.clientX-box.left)/box.width-.5).toFixed(3))
    event.currentTarget.style.setProperty('--pan-y',((event.clientY-box.top)/box.height-.5).toFixed(3))
  }
  function enter(){
    if(opening)return
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){onEnter();return}
    setOpening(true)
    timer.current=window.setTimeout(onEnter,620)
  }
  return <section className={`museum-landing landing-reverie ${opening?'landing-opening':''}`} onPointerMove={trackPointer} onPointerLeave={event=>{event.currentTarget.style.setProperty('--pan-x',0);event.currentTarget.style.setProperty('--pan-y',0)}}>
    <div className="landing-art" aria-hidden="true"><Suspense fallback={null}><LandscapeBackdrop/></Suspense><div className="landing-gate"><i/><i/></div><div className="landing-clouds">{[0,1,2].map(index=><svg key={index} className={`landing-cloud cloud-${index+1}`} viewBox="0 0 240 78" fill="none"><path d="M8 58c23 0 35-11 46-26 8-12 21-16 31-11 9 5 8 18 1 23-9 6-19 1-18-7 1-5 8-8 12-4M37 58c17 0 24-7 29-15m27 15c12 0 19-6 23-16 4-10 13-15 23-11 8 4 10 12 6 18-5 7-15 6-17 0m-51 9h79c15 0 21-9 32-15 12-7 23-3 26 6 3 11-8 19-17 14-5-3-4-9 0-11m-31 6h62" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 68h86m15 0h66m14 0h34" stroke="currentColor" strokeWidth=".55" strokeLinecap="round"/></svg>)}</div><div className="landing-mist"/></div>
    <header className="landing-header"><a className="museum-brand" href="#"><BrandMark/><span><strong>山海归藏</strong><small>THE SHANHAI MUSEUM</small></span></a><div className="landing-header-actions"><a href={`./timeline.html?lang=${language}`}>{t('流散时间线','Timeline')}<ArrowUpRight size={14}/></a><button className="lang-switch" onClick={onLanguage}><Globe2 size={16}/>{language==='zh'?'EN / 中文':'中文 / EN'}</button></div></header>
    <div className="landing-side left">{t('山海有尽 · 文脉无疆','CULTURE BEYOND BORDERS')}</div>
    <div className="landing-content"><p className="landing-eyebrow">{t('海外中国文物地图','MAP OF CHINESE CULTURAL RELICS OVERSEAS')}</p><h1>山海<span>归藏</span></h1><p className="landing-english">A MEMORY BEYOND BORDERS</p><div className="landing-rule"/><p className="landing-poem">{t(<>器物远行，故土未远。<br/>循一缕微光，赴一场跨越山海的重逢。</>,<>Objects travel. Their memories remain.<br/>Follow a light across oceans, into a shared past.</>)}</p><button className="enter-museum" onClick={enter} disabled={opening}><span>{t('进入展厅','Enter the museum')}</span><MoveRight size={22}/></button><p className="landing-invitation">{t('轻移指针，山海随光而动 · 360° 沉浸漫游','MOVE THE LIGHT · EXPLORE THE WORLD IN 360°')}</p></div>
    <div className="landing-side right">{t('一器一故乡 · 一眼一千年','ONE OBJECT. A THOUSAND YEARS.')}</div>
    <footer className="landing-footer"><span>VOL. 01 <i/> {t('常设展览','PERMANENT COLLECTION')}</span><div className="landing-stats"><div><span><b>{relics.length}</b>{t('条馆藏','records')}</span><span><b>{museums.length}</b>{t('座博物馆','museums')}</span><span><b>{String(new Set(museums.map(m=>m.countryEn)).size).padStart(2,'0')}</b>{t('个国家','countries')}</span></div><p>{t(`第一阶段收录20条；本阶段扩充至${relics.length}条 · 将持续核实并扩充`,`Phase I began with 20 records; now ${relics.length} · verification and expansion continue`)}</p><small>{t('收录机制：以馆方藏品记录为准，优先选用可公开再分发的照片；地点不明不标精确故乡。','Selection: museum records first; freely reusable images preferred; no exact origin pin without evidence.')}</small></div><span>{t('于山海之间，重见。','MEET AGAIN, ACROSS THE SEAS.')}<ArrowUpRight size={13}/></span></footer>
  </section>
}
