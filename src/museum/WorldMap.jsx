import { useEffect, useMemo, useState } from 'react'
import { museums, counts, relics, pick } from './catalog'

export const project = (lat, lng) => [(lng + 180) / 360 * 1200, (90 - lat) / 180 * 600]
export function geometryPath(geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  return polygons.map(p => p.map(ring => ring.map(([lng, lat], i) => `${i ? 'L' : 'M'}${project(lat, lng).map(n => n.toFixed(2)).join(',')}`).join(' ') + 'Z').join(' ')).join(' ')
}
export default function WorldMap({ language, selected, onMuseum, onHover }) {
  const [world, setWorld] = useState(null)
  const [error, setError] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState([600, 290])
  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`${import.meta.env.BASE_URL}data/world-countries.geojson`, { signal: ctrl.signal }).then(r => { if (!r.ok) throw Error(); return r.json() }).then(setWorld).catch(e => { if (e.name !== 'AbortError') setError(true) })
    return () => ctrl.abort()
  }, [])
  const paths = useMemo(() => world?.features.map((f, i) => <path key={i} d={geometryPath(f.geometry)} />), [world])
  const current = museums.find(m => m.id === selected?.museumId)
  const from = current && project(current.lat, current.lng)
  const home = selected?.homePoint && project(...selected.homePoint)
  const t = (zh, en) => language === 'zh' ? zh : en
  return <div className="world-map">
    {!world && <p className="map-message" role="status">{error ? t('地图暂时无法载入，请从馆藏列表继续探索。', 'Map unavailable. Explore the museum list below.') : t('正在展开世界地图…', 'Unfolding the world map…')}</p>}
    <svg viewBox={`${center[0] - 600 / zoom} ${center[1] - 300 / zoom} ${1200 / zoom} ${600 / zoom}`} aria-label={t('现藏地世界地图，可点击博物馆光点', 'World map of current collections. Select a museum pin.')}>
      <defs><radialGradient id="map-sea"><stop stopColor="#21180f"/><stop offset="1" stopColor="#0c0907"/></radialGradient></defs>
      <rect x="-1200" y="-600" width="3600" height="1800" fill="url(#map-sea)"/>
      <g className="graticule">{Array.from({length:11},(_,i)=><path key={`v${i}`} d={`M${(i+1)*100},0V600`}/>)}{Array.from({length:5},(_,i)=><path key={`h${i}`} d={`M0,${(i+1)*100}H1200`}/>)}</g>
      <g className="land-paths">{paths}</g>
      <g className="ocean-labels"><text x="180" y="350">PACIFIC OCEAN</text><text x="460" y="310">ATLANTIC OCEAN</text><text x="810" y="410">INDIAN OCEAN</text></g>
      {home && from && <g className="home-journey"><path d={`M${from}Q${(from[0]+home[0])/2},${Math.min(from[1],home[1])-115} ${home}`} /><circle cx={home[0]} cy={home[1]} r={5 / zoom}/><text x={home[0]+10/zoom} y={home[1]+19/zoom} fontSize={14/zoom}>{t('故乡', 'Origin')}</text></g>}
      {museums.map(m => { const [x,y] = project(m.lat,m.lng); const active = m.id === current?.id; return <g key={m.id} className={`museum-pin ${active ? 'active' : ''}`} transform={`translate(${x},${y}) scale(${1/zoom})`} tabIndex="0" role="button" aria-label={`${pick(m,'name',language)} · ${counts[m.id]} ${t('件文物','objects')}`} onClick={()=>onMuseum(m.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onMuseum(m.id)}}} onMouseEnter={()=>onHover?.(m.id)} onMouseLeave={()=>onHover?.(null)} onFocus={()=>onHover?.(m.id)} onBlur={()=>onHover?.(null)}>
        <title>{`${pick(m,'name',language)} — ${relics.filter(r=>r.museumId===m.id).map(r=>`${pick(r,'name',language)} / ${pick(r,'origin',language)}`).join('; ')}`}</title>
        <circle r="13" className="pin-halo"/><circle r="4" className="pin-core"/>{(active || ['bm','guimet','tnm','aam','nelson'].includes(m.id)) && <text y={m.id==='guimet'?25:-19} textAnchor="middle">{pick(m,active?'name':'city',language)}</text>}
      </g>})}
    </svg>
    <div className="flat-controls"><button onClick={()=>{if(zoom===1 && current) setCenter(project(current.lat,current.lng));setZoom(z=>Math.min(5,z+1))}} aria-label={t('放大至选中博物馆','Zoom into selected museum')}>+</button><button onClick={()=>setZoom(z=>Math.max(1,z-1))} aria-label={t('缩小','Zoom out')}>−</button><button onClick={()=>{setZoom(1);setCenter([600,290])}}>{t('全图','Reset')}</button></div>
    <span className="map-attribution">Natural Earth · {t('等距圆柱投影','Equirectangular projection')}</span>
  </div>
}
