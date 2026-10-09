import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Globe2, MoveRight } from 'lucide-react'
import BrandMark from './BrandMark'
import { relics, museums } from './catalog'
const LandscapeBackdrop=lazy(()=>import('./LandscapeBackdrop'))

function AuspiciousCloud({index}) {
  return <svg className={`landing-cloud cloud-${index+1}`} viewBox="0 0 250 110" aria-hidden="true">
    <g transform={index===1?'translate(250 0) scale(-1 1)':undefined}>
      <path className="cloud-sea-glaze" d="M42 76c23 4 40 11 63 10 23-1 38-11 59-12 22-1 38 7 68 2-22 13-48 9-69 10-27 1-41 10-67 6-21-3-39-11-54-16Z"/>
      <path className="cloud-undertone" d="M5 72c22 3 43 1 59-7 12-6 15-14 28-13 7-12 20-15 31-9 9-15 30-19 43-6 17-9 33-2 37 13 13 4 20 13 18 23-2 14-16 18-28 17-14-1-19-8-31-5-13 3-26 9-42 5-22-6-33-12-50-11-25 2-44 0-65-7Z"/>
      <path className="cloud-body" d="M8 69c23 3 40 0 55-8 11-6 17-15 27-13 7-12 19-16 31-10 9-17 31-19 43-6 18-9 34-2 38 14 12 3 20 12 17 22-3 11-14 15-27 13-13-2-18-7-30-3-14 5-29 10-45 6-18-5-30-10-47-9-24 2-43 0-62-6Z"/>
      <path className="cloud-light" d="M53 63c12-7 20-18 34-18 4 0 8 1 12 3 5-13 17-19 29-12 7-13 20-17 32-8 5 4 7 10 8 14 13-8 28-3 32 9 8 1 14 6 15 12-12-7-22-3-31 3-12 7-22 5-36 0-13-5-20 1-32 3-17 3-27-2-38-2-9 0-17 1-25-4Z"/>
      <path className="cloud-warm-fold" d="M37 70c18-2 31-10 43-20M86 73c18-3 31-12 43-25m4 30c14-6 24-16 27-29"/>
      <path className="cloud-tail-wash" d="M144 82c19-2 38-7 53-15 17-10 31-16 49-16-15 5-26 15-39 24-17 12-41 15-63 7ZM62 77c-17 4-38 5-58-2 18 2 35-1 47-6Z"/>
      <path className="cloud-gleam" d="M78 48c10-8 21-7 27 0m17-12c12-9 26-7 34 2m20 1c10-3 19 1 24 9"/>
    </g>
  </svg>
}

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
    <div className="landing-art" aria-hidden="true"><Suspense fallback={null}><LandscapeBackdrop/></Suspense><div className="landing-gate"><i/><i/></div><div className="landing-clouds">{[0,1,2].map(index=><AuspiciousCloud key={index} index={index}/>)}</div><div className="landing-mist"/></div>
    <header className="landing-header"><a className="museum-brand" href="#"><BrandMark/><span><strong>山海归藏</strong><small>THE SHANHAI MUSEUM</small></span></a><div className="landing-header-actions"><a href={`./timeline.html?lang=${language}`}>{t('流散时间线','Timeline')}<ArrowUpRight size={14}/></a><button className="lang-switch" onClick={onLanguage}><Globe2 size={16}/>{language==='zh'?'EN / 中文':'中文 / EN'}</button></div></header>
    <div className="landing-side left">{t('山海有尽 · 文脉无疆','CULTURE BEYOND BORDERS')}</div>
    <div className="landing-content"><p className="landing-eyebrow">{t('海外中国文物地图','MAP OF CHINESE CULTURAL RELICS OVERSEAS')}</p><h1>山海<span>归藏</span></h1><p className="landing-english">A MEMORY BEYOND BORDERS</p><div className="landing-rule"/><p className="landing-poem">{t(<>器物远行，故土未远。<br/>循一缕微光，赴一场跨越山海的重逢。</>,<>Objects travel. Their memories remain.<br/>Follow a light across oceans, into a shared past.</>)}</p><button className="enter-museum" onClick={enter} disabled={opening}><span>{t('进入展厅','Enter the museum')}</span><MoveRight size={22}/></button><p className="landing-invitation">{t('轻移指针，山海随光而动 · 360° 沉浸漫游','MOVE THE LIGHT · EXPLORE THE WORLD IN 360°')}</p></div>
    <div className="landing-side right">{t('一器一故乡 · 一眼一千年','ONE OBJECT. A THOUSAND YEARS.')}</div>
    <footer className="landing-footer"><span>VOL. 01 <i/> {t('常设展览','PERMANENT COLLECTION')}</span><div className="landing-stats"><div><span><b>{relics.length}</b>{t('条馆藏','records')}</span><span><b>{museums.length}</b>{t('座博物馆','museums')}</span><span><b>{String(new Set(museums.map(m=>m.countryEn)).size).padStart(2,'0')}</b>{t('个国家','countries')}</span></div><p>{t(`第一阶段收录20条；本阶段扩充至${relics.length}条 · 将持续核实并扩充`,`Phase I began with 20 records; now ${relics.length} · verification and expansion continue`)}</p><small>{t('收录机制：以馆方藏品记录为准，优先选用可公开再分发的照片；地点不明不标精确故乡。','Selection: museum records first; freely reusable images preferred; no exact origin pin without evidence.')}</small></div><span>{t('于山海之间，重见。','MEET AGAIN, ACROSS THE SEAS.')}<ArrowUpRight size={13}/></span></footer>
  </section>
}
