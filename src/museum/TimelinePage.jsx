import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Globe2, MoveRight } from 'lucide-react'
import BrandMark from './BrandMark'
import InkCursor from './InkCursor'
import { timeline } from './timeline-data'

export default function TimelinePage() {
  const [language,setLanguage]=useState(()=>new URLSearchParams(window.location.search).get('lang')==='en'?'en':'zh')
  const t=(zh,en)=>language==='zh'?zh:en
  useEffect(()=>{document.documentElement.lang=language==='zh'?'zh-CN':'en'},[language])
  function changeLanguage(){setLanguage(current=>{const next=current==='zh'?'en':'zh';const url=new URL(window.location.href);url.searchParams.set('lang',next);window.history.replaceState(null,'',url);return next})}
  return <div className="timeline-page">
    <InkCursor motion={!window.matchMedia('(prefers-reduced-motion: reduce)').matches}/>
    <header className="timeline-header">
      <a className="timeline-brand" href="./museum.html"><BrandMark/><span><strong>山海归藏</strong><small>THE SHANHAI MUSEUM</small></span></a>
      <nav aria-label={t('页面导航','Page navigation')}><a href="./museum.html"><ArrowLeft size={16}/>{t('返回展厅','Back to the museum')}</a><button onClick={changeLanguage} aria-label={t('切换为英文','Switch to Chinese')}><Globe2 size={16}/>{language==='zh'?'EN':'中文'}</button></nav>
    </header>
    <main>
      <section className="timeline-hero" style={{'--timeline-landscape':`url("${import.meta.env.BASE_URL}generated/timeline-ink-landscape.svg")`}}>
        <span className="timeline-kicker">A DOCUMENTED JOURNEY · {t('史料时间线','A PROVENANCE TIMELINE')}</span>
        <h1>{t(<>流散<span>之年</span></>,<>Years <span>of dispersal</span></>)}</h1>
        <p className="timeline-intro">{t('一件文物何时离开原址、何时现身市场、何时进入博物馆，往往是不同的故事。以下仅选取可据馆藏记录与研究资料复核的节点，让时间成为理解离散的另一张地图。','When an object left its original place, appeared on the market, and entered a museum may be three different stories. This selection follows dates that can be checked against collection records and institutional research.')}</p>
        <div className="timeline-hero-foot"><span><i/>{t(`${timeline[0].year}—${timeline.at(-1).year} · ${timeline.length}个史料节点`,`${timeline[0].year}–${timeline.at(-1).year} · ${timeline.length} documented moments`)}</span><a href="#chronology">{t('顺时间而行','Explore the chronology')}<MoveRight size={18}/></a></div>
      </section>
      <section className="timeline-method" aria-label={t('考证说明','Research method')}>
        <span>01 / {t('阅读方式','HOW TO READ')}</span>
        <p>{t('时间标记以正文所述事件为准；“入藏”不等于“离开中国”。每条附至少两份可追溯资料。来源不完整或原址有争议时，使用“传出”“约”等限定语。此页是专题选录，不是全部流散史。','A date marks the event named in its entry. Museum accession does not necessarily date departure from China. Each entry links to at least two traceable records. Where origins are uncertain, the wording says so. This is a selected history, not an exhaustive chronology.')}</p>
      </section>
      <section id="chronology" className="timeline-chronology" aria-label={t('文物流散时间线','Chronology of dispersal')}>
        <div className="timeline-section-head"><span>02 / {t('史料节点','DOCUMENTED MOMENTS')}</span><p>{t('沿年份展开','Follow the years')}</p></div>
        <ol className="timeline-list">{timeline.map((entry,index)=><li key={`${entry.year}-${entry.titleEn}`} className="timeline-event">
          <div className="timeline-year"><span>{entry.year}</span><i/></div>
          <article className="timeline-card">
            <div className="timeline-card-meta"><span>{String(index+1).padStart(2,'0')} / {entry.kind==='context'?t('历史背景','HISTORICAL CONTEXT'):t('馆藏个案','OBJECT RECORD')}</span><span>{t(entry.placeZh,entry.placeEn)}</span></div>
            <h2>{t(entry.titleZh,entry.titleEn)}</h2><p>{t(entry.bodyZh,entry.bodyEn)}</p>
            <div className="timeline-sources"><span>{t('交叉核实资料','RECORDS CHECKED')}</span><div>{entry.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={14}/></a>)}</div></div>
          </article>
        </li>)}</ol>
      </section>
      <aside className="timeline-endnote"><span>AFTERWORD</span><p>{t('这条时间线仍在继续。接下来的阶段会继续核实更多文物的来源、流转和现藏记录，逐步补充进入展厅。','The record is still growing. Future phases will verify more objects, ownership histories and holding institutions before adding them to the museum.')}</p><a href="./museum.html">{t('回到山海厅','Return to the gallery')}<ArrowUpRight size={17}/></a></aside>
    </main>
    <footer className="timeline-footer"><span>山海归藏 · THE SHANHAI MUSEUM</span><span>{t('史料以所链接机构原文为准','Follow linked institutional records for the underlying evidence')}</span></footer>
  </div>
}
