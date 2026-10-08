import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronLeft, ChevronRight, Compass, Globe2, Info, MapPin, Maximize2, Minimize2, Minus, Move, Pause, Play, Plus, RotateCcw, Search, Sparkles, X } from 'lucide-react'
import { museums, relics, museumById, categories, collections, counts, featuredIds, pick, precisionCopy } from './catalog'
import WorldMap from './WorldMap'
import Landing from './Landing'
import InkCursor from './InkCursor'
import BrandMark from './BrandMark'

// The gallery stays usable while the optional 3D room loads.
const Room = lazy(() => import('./GlobeRoom'))
const ObjectViewer = lazy(() => import('./ObjectViewer'))
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
function ObjectImage({ object, language, ...props }) {
  const [failed, setFailed] = useState(false)
  useEffect(()=>setFailed(false),[object.id])
  return !object.image ? <span className="image-unavailable rights-placeholder"><span className="placeholder-emblem">藏</span><span>{object.imageWithheld ? (language==='zh'?'图片暂未随公开版本提供':'Image withheld from public release') : (language==='zh'?'暂无可核实的开放图片':'No verified reusable image yet')}</span><small>{language==='zh'?'请从馆方原页查看':'View image on museum record'}</small></span> : failed ? <span className="image-unavailable">{language==='zh'?'图片暂不可用 · 可查看馆方原页':'Image unavailable · see museum record'}</span> : <img src={object.image} alt={pick(object,'name',language)} onError={()=>setFailed(true)} {...props}/>
}
function RecordNotes({object,language}) {
  const t=(zh,en)=>language==='zh'?zh:en
  return <>{object.imageCaptionZh&&<p className="record-note">{pick(object,'imageCaption',language)}</p>}{object.noteZh&&<p className="record-note">{pick(object,'note',language)}</p>}{object.sourceExtra&&<a className="source-extra" href={object.sourceExtra} target="_blank" rel="noreferrer">{t('补充资料','Further reading')}<ArrowUpRight size={13}/></a>}{object.imageSource&&<a className="source-extra" href={object.imageSource} target="_blank" rel="noreferrer">{t('本图来源','Source of this image')}<ArrowUpRight size={13}/></a>}</>
}
function Modal({ children, label, onClose, className='' }) {
  const ref = useRef()
  useEffect(()=>{
    const before = document.activeElement
    ref.current.showModal()
    return ()=> { before?.focus?.() }
  },[])
  return <dialog ref={ref} aria-label={label} className={className} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===ref.current)onClose()}}><div className="modal-inner">{children}</div></dialog>
}
export default function MuseumApp() {
  const [entered,setEntered]=useState(()=>new URLSearchParams(window.location.search).get('view')==='hall')
  const [museumOpened,setMuseumOpened]=useState(false)
  const [language, setLanguage] = useState('zh')
  const [mode, setMode] = useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches?'map':'room')
  const [selectedId, setSelectedId] = useState('nelson-guanyin')
  const [museumFilter, setMuseumFilter] = useState('all')
  const [category, setCategory] = useState('all')
  const [collection, setCollection] = useState(null)
  const [query,setQuery]=useState('')
  const [panel,setPanel]=useState(null)
  const [hover,setHover]=useState(null)
  const [motion,setMotion]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [cameraCommand,setCameraCommand]=useState({type:'reset',tick:0})
  const [full,setFull]=useState(false)
  const [zoom,setZoom]=useState(1)
  const [sceneFailed,setSceneFailed]=useState(false)
  const stage=useRef()
  const archive=useRef()
  const collectionCard=useRef()
  const object=relics.find(r=>r.id===selectedId)
  const museum=museumById[object.museumId]
  const t=(zh,en)=>language==='zh'?zh:en
  const name=value=>pick(value,'name',language)
  const activeCollection=collections.find(c=>c.id===collection)
  const results=relics.filter(r=>(!activeCollection||activeCollection.ids.includes(r.id))&&(museumFilter==='all'||r.museumId===museumFilter)&&(category==='all'||category===r.category)&&`${r.nameZh} ${r.nameEn} ${r.originZh} ${r.originEn} ${museumById[r.museumId].nameZh} ${museumById[r.museumId].nameEn} ${museumById[r.museumId].cityZh} ${museumById[r.museumId].cityEn}`.toLowerCase().includes(query.toLowerCase()))
  useEffect(()=>{document.documentElement.lang=language==='zh'?'zh-CN':'en'},[language])
  useEffect(()=>{const handler=()=>setFull(!!document.fullscreenElement);document.addEventListener('fullscreenchange',handler);return()=>document.removeEventListener('fullscreenchange',handler)},[])
  useEffect(()=>{
    if(!entered||!museumOpened||!collectionCard.current)return
    const observer=new ResizeObserver(([entry])=>stage.current?.style.setProperty('--collection-height',`${entry.borderBoxSize?.[0]?.blockSize||entry.contentRect.height}px`))
    observer.observe(collectionCard.current)
    return()=>observer.disconnect()
  },[entered,museumOpened])
  function selectMuseum(id) {setMuseumFilter(id);setSelectedId(relics.find(r=>r.museumId===id).id);setHover(null);setMuseumOpened(true);setCameraCommand(c=>({type:'museum',tick:c.tick+1}))}
  function selectObject(r,details=false) {setSelectedId(r.id);if(details)setPanel('detail')}
  function command(type) {setCameraCommand(c=>({type,tick:c.tick+1}))}
  function showArchive() {archive.current.scrollIntoView({behavior:motion?'smooth':'instant'})}
  async function toggleFull() {try {if(document.fullscreenElement)await document.exitFullscreen();else if(stage.current.requestFullscreen)await stage.current.requestFullscreen();else setFull(v=>!v)}catch{setFull(v=>!v)}}
  const currentHover=hover&&museumById[hover]
  if(!entered)return <div className={`museum-app night-museum ${motion?'':'still'} ${language==='en'?'english':''}`}><Landing language={language} onLanguage={()=>setLanguage(l=>l==='zh'?'en':'zh')} onEnter={()=>{setEntered(true);window.scrollTo(0,0)}}/><InkCursor motion={motion}/></div>
  return <div className={`museum-app night-museum entered ${museumOpened?'museum-opened':''} ${motion?'':'still'} ${language==='en'?'english':''}`}>
    <button className="return-landing" onClick={()=>{setEntered(false);setMuseumOpened(false);setHover(null);window.scrollTo(0,0)}}><ArrowLeft size={14}/>{t('返回序厅','Back to entrance')}</button>
    <header className="museum-header"><a href="#hall" className="museum-brand" aria-label={t('山海归藏，返回展厅','Shanhai Museum, return to hall')}><BrandMark/><span><strong>山海归藏</strong><small>THE SHANHAI MUSEUM</small></span></a><nav aria-label={t('主导航','Main navigation')}><a href="#hall" className="nav-current">{t('漫游展厅','The museum')}<span/></a><button onClick={showArchive}>{t('馆藏图录','The collection')}</button><button onClick={()=>setPanel('about')}>{t('关于这场远行','Our story')}</button></nav><a className="timeline-nav-button" href={`./timeline.html?lang=${language}`}>{t('流散时间线','Timeline')}<ArrowUpRight size={14}/></a><button className="lang-switch" onClick={()=>setLanguage(l=>l==='zh'?'en':'zh')} aria-label={t('切换为英文','Switch to Chinese')}><Globe2 size={16}/><span className={language==='zh'?'chosen':''}>中</span><i>/</i><span className={language==='en'?'chosen':''}>EN</span></button></header>
    <main>
      <section id="hall" ref={stage} className={`museum-stage ${full?'is-full':''}`} aria-label={t('沉浸式文物展厅','Immersive relics hall')}>
        <InkCursor motion={motion}/>
        <div className="stage-topline"><span><i/> {t('常设展览 · 第一辑','PERMANENT COLLECTION · VOL. 01')}</span><span>{relics.length} {t('条馆藏','RECORDS')} · {museums.length} {t('座博物馆','MUSEUMS')} · {new Set(museums.map(m=>m.countryEn)).size} {t('个国家','COUNTRIES')}</span></div>
        <div className="hall-heading"><p>MAP OF CHINESE CULTURAL RELICS OVERSEAS</p><h1>{t(<>散落山海，<br/>仍是故乡。</>,<>Far from home.<br/><em>Never forgotten.</em></>)}</h1><div>{t('海外中国文物地图','An atlas of Chinese treasures overseas')}</div><p className="heading-note">{t('点亮一处馆藏，听见一段回响。','A point of light. A story that carries home.')}</p></div>
        <div className="scene-surface">
          {mode==='room'?<SceneBoundary onFailure={()=>setSceneFailed(true)} fallback={<WorldMap language={language} selected={object} onMuseum={selectMuseum} onHover={setHover}/>}><Suspense fallback={<WorldMap language={language} selected={object} onMuseum={selectMuseum} onHover={setHover}/>}><Room language={language} selected={object} onMuseum={selectMuseum} onHover={setHover} motion={motion&&!panel} autoRotate={!museumOpened&&!panel} command={cameraCommand} collectionOpen={museumOpened} onFailure={()=>{setSceneFailed(true);setMode('map')}}/></Suspense></SceneBoundary>:<WorldMap language={language} selected={object} onMuseum={selectMuseum} onHover={setHover}/>}
        </div>
        <div className="view-switch" aria-label={t('浏览模式','View mode')}><button className={mode==='room'?'active':''} onClick={()=>{setMode('room');setSceneFailed(false)}}><Compass size={16}/>{t('沉浸式展厅','Immersive gallery')}</button><button className={mode==='map'?'active':''} onClick={()=>setMode('map')}><Globe2 size={16}/>{t('坤舆万国图','World map')}</button></div>
        <aside ref={collectionCard} className="featured-object" aria-label={t('当前博物馆的馆藏','Objects in the selected museum')}>
          <div className="museum-mini-title"><span>{name(museum)}<small>{pick(museum,'city',language)} · {counts[museum.id]} {t('件文物','objects')}</small></span><button onClick={()=>setMuseumOpened(false)} aria-label={t('收起馆藏，继续环顾','Close collection and keep exploring')}><X size={16}/></button></div>
          <button className="feature-photo" onClick={()=>setPanel('detail')} aria-label={`${t('查看','View')} ${name(object)}`}><ObjectImage object={object} language={language}/><span><Maximize2 size={15}/></span></button>
          <div className="feature-copy"><span className="object-era">{pick(object,'date',language)}</span><h2>{name(object)}</h2><p className="feature-english">{language==='zh'?object.nameEn:object.nameZh}</p><button className="visit-object" onClick={()=>setPanel('detail')}>{t('走近这件文物','Discover this object')}<ArrowUpRight size={16}/></button></div>
          <div className="museum-object-tray" aria-label={t('这座博物馆的文物','Objects in this museum')}>{relics.filter(r=>r.museumId===museum.id).map(r=><button key={r.id} className={r.id===object.id?'active':''} onClick={()=>selectObject(r)} aria-label={name(r)} aria-pressed={r.id===object.id} title={name(r)}><ObjectImage object={r} language={language}/></button>)}</div>
        </aside>
        {currentHover&&<div className="museum-tooltip" role="status"><strong>{name(currentHover)}</strong><span>{pick(currentHover,'city',language)} · {counts[currentHover.id]} {t('件文物','objects')}</span><p>{t('故乡','Origins')}：{[...new Set(relics.filter(r=>r.museumId===hover).map(r=>pick(r,'origin',language)))].join(' / ')}</p></div>}
        <div className="stage-bottom">
          <div className="map-key"><span><i/>{t('现藏博物馆','Current museum')}</span><span><i className="home"/>{t('故乡（已知地点）','Origin (where known)')}</span></div>
          <p>{sceneFailed?t('已切换到轻量地图，馆藏仍可完整浏览。','Lightweight map enabled. All objects remain available.'):mode==='room'?t('拖动转动地球 · 滚轮 / 双指拉近拉远空间','Drag to rotate · Scroll / pinch to move through the scene'):t('点击光点选择博物馆 · 放大查看相邻馆藏','Select a museum light · Zoom in to separate nearby pins')}</p>
          <div className="scene-controls">
            {mode==='room'&&<>
              <button onClick={()=>command('left')} aria-label={t('向左旋转地球','Rotate globe left')}><ChevronLeft size={17}/></button>
              <button onClick={()=>command('right')} aria-label={t('向右旋转地球','Rotate globe right')}><ChevronRight size={17}/></button>
              <button onClick={()=>command('zoomOut')} aria-label={t('拉远整个空间','Move away from the scene')}><Minus size={15}/></button>
              <button onClick={()=>command('zoomIn')} aria-label={t('拉近整个空间','Move closer to the scene')}><Plus size={15}/></button>
              <button onClick={()=>command('reset')} aria-label={t('重置地球仪','Reset globe')}><RotateCcw size={15}/></button>
            </>}
            <button onClick={()=>setMotion(v=>!v)} aria-label={motion?t('暂停动态效果','Pause motion'):t('开启动态效果','Enable motion')} aria-pressed={!motion}>{motion?<Pause size={15}/>:<Play size={15}/>}</button>
            <button onClick={toggleFull} aria-label={full?t('退出全屏','Exit fullscreen'):t('全屏','Fullscreen')}>{full?<Minimize2 size={16}/>:<Maximize2 size={16}/>}</button>
          </div>
        </div>
      </section>
      <section className="museum-selector" aria-label={t('选择博物馆','Choose a museum')}><div className="selector-title"><Compass size={20}/><span>{t('循光而行','FOLLOW THE LIGHT')}<small>{t('选择一座博物馆','Choose a museum')}</small></span></div><div className="museum-city-list">{museums.map(m=><button key={m.id} className={museum.id===m.id?'selected':''} onClick={()=>selectMuseum(m.id)} title={name(m)}><span>{pick(m,'city',language)}<sup>{counts[m.id]}</sup></span><small>{language==='zh'?m.cityEn:m.countryEn}</small></button>)}</div></section>
      <section ref={archive} id="collection" className="museum-collection"><div className="collection-heading"><div><p className="section-eyebrow">THE COLLECTION · {t('馆藏图录','OBJECT STORIES')}</p><h2>{museumFilter==='all'?t('一件文物，一程山海。','Every object, a journey.'):name(museumById[museumFilter])}</h2></div><label className="collection-search"><Search size={17}/><input aria-label={t('搜索文物、城市或博物馆','Search objects, cities or museums')} placeholder={t('寻找一件文物、一座城市…','Find an object, a city…')} value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button onClick={()=>setQuery('')} aria-label={t('清除搜索','Clear search')}><X size={15}/></button>}</label></div><div className="themed-collections" aria-label={t('专题合集','Thematic collections')}><div className="themed-collections-heading"><span>{t('小专题 · 跨馆寻踪','CURATED PATHS · ACROSS MUSEUMS')}</span>{activeCollection&&<button onClick={()=>setCollection(null)}>{t('查看全部','All records')} <X size={13}/></button>}</div><div className="themed-collections-grid">{collections.map((c,index)=><button key={c.id} className={`themed-collection ${collection===c.id?'selected':''}`} aria-pressed={collection===c.id} onClick={()=>{setCollection(current=>current===c.id?null:c.id);setMuseumFilter('all');setCategory('all');setQuery('')}}><span className="collection-number">0{index+1} / {String(c.ids.length).padStart(2,'0')}</span><strong>{pick(c,'name',language)}</strong><small>{language==='zh'?c.nameEn:c.nameZh}</small><p>{pick(c,'desc',language)}</p><ArrowUpRight size={17}/></button>)}</div></div><div className="collection-filters"><div>{categories.map(c=><button key={c.id} className={category===c.id?'active':''} onClick={()=>setCategory(c.id)}>{language==='zh'?c.zh:c.en}</button>)}</div><span>{museumFilter!=='all'&&<button onClick={()=>setMuseumFilter('all')}>{t('全部博物馆','All museums')} <X size={12}/></button>}{results.length} {t('条馆藏记录','collection records')}</span></div><div className="object-grid">{results.map(r=><button className="object-card" key={r.id} onClick={()=>selectObject(r,true)}><div className={`object-card-image category-${r.category}`}><ObjectImage object={r} language={language} loading="lazy"/><span className="card-index">{String(relics.findIndex(x=>x.id===r.id)+1).padStart(2,'0')}</span><span className="card-arrow"><ArrowUpRight size={19}/></span></div><div className="object-card-text"><span>{pick(museumById[r.museumId],'city',language)} · {pick(r,'date',language)}</span><h3>{name(r)}</h3><p>{language==='zh'?r.nameEn:r.nameZh}</p></div></button>)}</div>{!results.length&&<div className="empty-collection"><Search/><h3>{t('还没有找到这件文物','No matching objects')}</h3><p>{t('试试其他名称，或清除筛选查看全部馆藏。','Try another name, or clear filters to see all records.')}</p><button onClick={()=>{setQuery('');setCategory('all');setMuseumFilter('all');setCollection(null)}}>{t('查看全部馆藏','Show all objects')}</button></div>}</section>
    </main><footer className="museum-footer"><span className="footer-poem">{t('山海有尽，文脉无疆。','Across oceans, a shared memory endures.')}</span><p>{t('文物信息据馆方记录整理 · 图像权利归原权利人','Object information from museum records · Images retain their original rights')}</p><button onClick={()=>setPanel('about')}>{t('资料来源与地图说明','Sources & map notes')}<ArrowUpRight size={14}/></button></footer>
    {panel==='detail'&&<Modal label={name(object)} onClose={()=>setPanel(null)} className="detail-dialog">
      <button className="modal-close" onClick={()=>setPanel(null)} aria-label={t('关闭详情','Close details')}><X/></button>
      <div className="detail-visual">{object.image?<SceneBoundary onFailure={()=>{}} fallback={<div className="detail-image"><ObjectImage object={object} language={language}/><button onClick={()=>{setZoom(1);setPanel('image')}}><Maximize2 size={16}/>{t('放大欣赏','View full image')}</button></div>}><Suspense fallback={<p className="object-view-message" role="status">{t('正在打开这件文物…','Opening this object…')}</p>}><ObjectViewer object={object} language={language} motion={motion} onExpand={()=>{setZoom(1);setPanel('image')}}/></Suspense></SceneBoundary>:<div className="detail-image restricted-detail"><ObjectImage object={object} language={language}/><a href={object.source} target="_blank" rel="noreferrer">{t('前往馆方查看图像','See image at the museum')}<ArrowUpRight size={15}/></a></div>}</div>
      <div className="detail-content">
        <p className="section-eyebrow">COLLECTION NO. {object.accession}</p><h2>{name(object)}</h2><p className="detail-second-name">{language==='zh'?object.nameEn:object.nameZh}</p>
        <p className="detail-date">{pick(object,'date',language)}<br/>{pick(object,'medium',language)}</p>
        <div className="provenance"><div><i/><span>{t('此刻 · 现藏地','NOW · CURRENT COLLECTION')}<strong>{name(museum)}</strong><small>{pick(museum,'city',language)} · {pick(museum,'country',language)}</small></span></div><div><i/><span>{t('来处 · 故乡','THEN · PLACE OF ORIGIN')}<strong>{pick(object,'origin',language)}</strong><small>{precisionCopy[object.originPrecision][language==='zh'?0:1]}</small></span></div></div>
        <p className="detail-description">{pick(object,'desc',language)}</p><p className="detail-translation">{language==='zh'?object.descEn:object.descZh}</p>
        <RecordNotes object={object} language={language}/>
        {object.pairId&&<button className="pair-link" onClick={()=>setSelectedId(object.pairId)}><BookOpen size={16}/>{t('寻找另一半','Discover its companion')}<ArrowRight size={17}/></button>}
        <a className="museum-source" href={object.source} target="_blank" rel="noreferrer">{t('查看馆方原始记录','View original museum record')}<ArrowUpRight size={16}/></a><p className="detail-credit">{pick(object,'credit',language)}</p>
        <div className="detail-navigation"><button onClick={()=>setSelectedId(relics[(relics.findIndex(r=>r.id===object.id)+relics.length-1)%relics.length].id)}><ArrowLeft size={16}/>{t('上一件','Previous')}</button><span>{relics.findIndex(r=>r.id===object.id)+1} / {relics.length}</span><button onClick={()=>setSelectedId(relics[(relics.findIndex(r=>r.id===object.id)+1)%relics.length].id)}>{t('下一件','Next')}<ArrowRight size={16}/></button></div>
      </div>
    </Modal>}
    {panel==='image'&&<Modal label={t('文物图片查看器','Object image viewer')} onClose={()=>setPanel('detail')} className="image-dialog"><button className="modal-close" onClick={()=>setPanel('detail')} aria-label={t('返回详情','Return to details')}><X/></button><div className="image-scroll"><ObjectImage object={object} language={language} style={{width:`${zoom*100}%`,maxWidth:'none'}}/></div><div className="image-toolbar"><span>{name(object)}</span><button onClick={()=>setZoom(z=>Math.max(1,z-.5))} aria-label={t('缩小图片','Zoom out image')}><Minus size={18}/></button><span>{Math.round(zoom*100)}%</span><button onClick={()=>setZoom(z=>Math.min(4,z+.5))} aria-label={t('放大图片','Zoom in image')}><Plus size={18}/></button></div><p className="image-viewer-note">{t('放大后可滚动或滑动查看局部；为馆藏照片动态展示，非文物三维扫描。','Scroll or swipe to inspect the enlarged photograph. This is a photograph, not a 3D scan.')}</p></Modal>}
    {panel==='about'&&<Modal label={t('关于山海归藏','About Shanhai Museum')} onClose={()=>setPanel(null)} className="about-dialog">
      <button className="modal-close" onClick={()=>setPanel(null)} aria-label={t('关闭','Close')}><X/></button><BrandMark/>
      <p className="section-eyebrow">A MUSEUM WITHOUT BORDERS</p><h2>{t('让远方的文物，离我们近一点。','A little closer to treasures far from home.')}</h2>
      <p>{t(`山海归藏是一座中英双语的虚拟博物馆。从第一阶段的20条记录扩充到本阶段的${relics.length}条，覆盖${museums.length}家海外博物馆；一对花瓶或一幅完整壁画按一条记录计数。我们希望沿着器物的来处与去处，感受绵延的文化乡愁。`,`Shanhai is a bilingual virtual museum. Its first 20 records have grown to ${relics.length} across ${museums.length} museums; a pair or an intact mural counts as one record. Follow the objects between their origins and present collections, and encounter the memories they carry.`)}</p>
      <h3>{t('地球仪与“故乡”','The globe and the idea of home')}</h3>
      <p>{t('地球仪采用Natural Earth真实地理轮廓，按经纬度映射到球面，球体随窗口等比调整。金色光点标注现藏机构，周围的小光粒对应本站收录的馆藏记录，不代表文物此刻一定正在展出。现藏馆坐标定位至馆址附近；同馆文物聚合在同一馆址。出土地、制作地、原供奉地并不总是同一处，故乡已知时绘制概略位置，只有推定地区或地点未详时不绘制精确光点。球面连接线表达文化地理联系，并非经考证的流转路线。','Natural Earth geography is mapped by latitude and longitude onto a proportionally scaled globe. Golden lights locate current holding institutions; surrounding tiny lights represent records in this collection, not a guarantee of objects on display. Coordinates approximate museum buildings, with objects grouped at their holding museum. Findspots, production sites and original temples can differ. Origin pins are approximate and appear only where a site or region is known. Globe connections express geographic relationships, not documented transport routes.')}</p>
      <h3>{t('图像与资料','Images and records')}</h3><p>{t('文字据各馆公开记录编写，中英文简介为本站整理。每件文物均附馆方原页与图像署名，年代及归属可能随研究更新。艺术化灯光、漂浮和粒子效果只用于展示，不把二维照片当成真实三维复原。不同图片适用不同许可，本站不宣称对所有图像拥有统一授权。','Descriptions are bilingual editorial summaries of public museum records. Each object links to its original record and image credit. Dates and attributions may change with research. Lighting and animation are interpretive presentation, not a 3D reconstruction. Images carry different licenses; no blanket image license is claimed.')}</p>
      <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth · {t('地图数据与许可','map data and terms')}<ArrowUpRight size={14}/></a><p className="about-footnote">{t('首批资料沿用项目馆藏档案，并复核重点条目；详情以馆方原始记录为准。','The first release reuses the project collection archive, with priority records rechecked. Original museum records remain authoritative.')}</p>
    </Modal>}
  </div>
}
