import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { museums, museumById, counts, pick } from './catalog'
import { globePoint, globeCameraDistance, GLOBE_RADIUS as R, GLOBE_HEIGHT as Y, GLOBE_ZOOM_MIN, GLOBE_ZOOM_MAX, GLOBE_ZOOM_DEFAULT } from './globe-geography'
import { createStarfield } from './Starfield'
import { createQianliLandscape } from './QianliLandscape'

function landMask(world) {
  const c=document.createElement('canvas');c.width=2048;c.height=1024
  const ctx=c.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#fff'
  for(const f of world.features){
    const polygons=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates
    for(const polygon of polygons){ctx.beginPath();for(const ring of polygon){ring.forEach(([lng,lat],i)=>{const x=(lng+180)/360*2048,y=(90-lat)/180*1024;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath()}ctx.fill('evenodd')}
  }
  return ctx.getImageData(0,0,2048,1024).data
}
function countryBorders(world){
  const points=[]
  for(const feature of world.features){
    const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates
    for(const polygon of polygons)for(const ring of polygon)for(let i=1;i<ring.length;i++){
      const [lngA,latA]=ring[i-1],[lngB,latB]=ring[i]
      // A dateline wrap is not a border crossing the whole globe.
      if(Math.abs(lngA-lngB)>180)continue
      points.push(...globePoint(latA,lngA,R+.031),...globePoint(latB,lngB,R+.031))
    }
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3))
  return new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:'#d3ac6b',transparent:true,opacity:.33,depthWrite:false}))
}
function glowTexture() {
  const c=document.createElement('canvas');c.width=64;c.height=64
  const ctx=c.getContext('2d'),g=ctx.createRadialGradient(32,32,0,32,32,32)
  g.addColorStop(0,'#fff5d1');g.addColorStop(.17,'#f8d6a1cc');g.addColorStop(.48,'#c5944d33');g.addColorStop(1,'#c5944d00')
  ctx.fillStyle=g;ctx.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)
}
function makeLabel(title,subtitle) {
  const c=document.createElement('canvas');c.width=768;c.height=192
  const ctx=c.getContext('2d');ctx.textAlign='center';ctx.font='500 56px "Noto Serif SC",serif'
  // Wrap long institution names instead of squeezing the text horizontally.
  const words=/\s/.test(title)?title.split(' '):[...title],lines=[];let current=''
  for(const word of words){const next=current+(current&&/\s/.test(title)?' ':'')+word;if(ctx.measureText(next).width>740&&current){lines.push(current);current=word}else current=next}if(current)lines.push(current)
  ctx.shadowColor='#110a06';ctx.shadowBlur=12;ctx.fillStyle='#f5ddb0'
  lines.slice(0,2).forEach((text,i)=>ctx.fillText(text,384,lines.length>1?62+i*60:78))
  const textWidth=Math.min(740,Math.max(...lines.map(text=>ctx.measureText(text).width)))
  ctx.font='40px sans-serif';ctx.fillStyle='#c8a472';ctx.fillText(subtitle,384,lines.length>1?177:144,740)
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.userData.textWidth=Math.max(textWidth,ctx.measureText(subtitle).width);return texture
}
export default function GlobeRoom({language,selected,onMuseum,onHover,motion,autoRotate=true,command,onFailure,collectionOpen=false}) {
  const host=useRef(),engine=useRef(),latest=useRef()
  latest.current={language,selected,onMuseum,onHover,motion,autoRotate,onFailure,collectionOpen}
  const [ready,setReady]=useState(false)
  useEffect(()=>{
    let renderer
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'})}catch{latest.current.onFailure();return}
    const mount=host.current,canvas=renderer.domElement,scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(46,1,.1,400)
    const abort=new AbortController(),textures=new Set(),events=[]
    let disposed=false,raf=0,lastFrame=0,lastTime=0,particleMaterial
    const state={latitude:20,longitude:-30,targetLatitude:20,targetLongitude:-30,zoom:GLOBE_ZOOM_DEFAULT,targetZoom:GLOBE_ZOOM_DEFAULT,time:0,dirty:true,selected:latest.current.selected.museumId,hover:null,fit:12,width:1,height:1,holdUntil:0}
    engine.current=state
    renderer.setClearColor('#020305',0)
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02
    canvas.tabIndex=0;canvas.setAttribute('aria-label',language==='zh'?'悬浮全息地球仪；方向键旋转，加减键拉近或拉远整个空间':'Floating holographic globe; arrows rotate, plus/minus move through the whole scene')
    mount.appendChild(canvas)

    const starfield=createStarfield();scene.add(starfield.group)
    const landscape=createQianliLandscape({compact:window.matchMedia('(max-width:760px)').matches,hall:true});scene.add(landscape.group)
    const globe=new THREE.Group();globe.position.y=Y;scene.add(globe)
    // A black interior occludes distant terrain and far-side particles. It has no
    // visible atmospheric/glass shell, no highlight and no enlarged outer radius.
    const depthShell=new THREE.Mesh(new THREE.SphereGeometry(R*.993,64,40),new THREE.MeshBasicMaterial({color:'#020305',depthWrite:true}));globe.add(depthShell)
    fetch(`${import.meta.env.BASE_URL}data/world-countries.geojson`,{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json()}).then(world=>{
      if(disposed)return
      globe.add(countryBorders(world))
      const mask=landMask(world),positions=[],seeds=[],surfaces=[]
      // Equal-area samples avoid artificial particle crowding near the poles.
      const n=window.matchMedia('(max-width:760px)').matches?110000:195000,golden=Math.PI*(3-Math.sqrt(5))
      for(let i=0;i<n;i++){
        const lat=Math.asin(1-2*(i+.5)/n)*180/Math.PI,lng=(i*golden*180/Math.PI)%360-180
        const x=Math.min(2047,Math.floor((lng+180)/360*2048)),y=Math.min(1023,Math.floor((90-lat)/180*1024))
        const land=mask[(y*2048+x)*4+3]>180
        // A quieter ocean point field preserves the whole globe at every longitude.
        // It lies on the SAME surface as the land, not on a separate outer shell.
        if(land||i%3!==0){
          // Subpixel angular jitter breaks the mechanical Fibonacci striping.
          const latJitter=Math.sin(i*127.1)*.055,lngJitter=Math.cos(i*311.7)*.055/Math.max(.16,Math.cos(lat*Math.PI/180))
          positions.push(...globePoint(lat+latJitter,lng+lngJitter,R+.015));seeds.push((i*.73)%6.28);surfaces.push(land?1:0)
        }
      }
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('seed',new THREE.Float32BufferAttribute(seeds,1));g.setAttribute('land',new THREE.Float32BufferAttribute(surfaces,1))
      particleMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{time:{value:0},breath:{value:1},ratio:{value:Math.min(devicePixelRatio||1,1.6)}},
        vertexShader:`attribute float seed;attribute float land;varying float s;varying float isLand;varying float facing;uniform float ratio;
          void main(){s=seed;isLand=land;vec3 n=normalize(normalMatrix*normalize(position));vec4 p=modelViewMatrix*vec4(position,1.);
          facing=max(0.,dot(n,normalize(-p.xyz)));gl_Position=projectionMatrix*p;
          gl_PointSize=clamp(11.3/-p.z,.7,1.4)*ratio;}`,
        fragmentShader:`uniform float time;uniform float breath;varying float s;varying float isLand;varying float facing;
          void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;
          float core=1.-smoothstep(.07,.43,d);float shimmer=.86+.12*sin(s*2.4+time*.44);
          float rim=pow(1.-facing,2.5);float softEdge=smoothstep(.0,.14,facing);
          float ocean=.20+rim*.23;float continent=.80-rim*.12;
          float a=1.38*core*shimmer*breath*mix(ocean,continent,isLand)*softEdge;
          vec3 gold=mix(vec3(.66,.47,.25),vec3(1.,.83,.54),.44+.22*sin(s*3.1));
          gl_FragColor=vec4(gold,a);}`})
      globe.add(new THREE.Points(g,particleMaterial));state.dirty=true;setReady(true)
    }).catch(e=>{if(e.name!=='AbortError'&&!disposed)latest.current.onFailure()})

    const glow=glowTexture();textures.add(glow)
    const pins=[]
    for(const [index,m] of museums.entries()){
      const group=new THREE.Group();group.position.set(...globePoint(m.lat,m.lng,R+.075));globe.add(group)
      const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:'#ffe2a8',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));halo.scale.set(.28,.28,1);group.add(halo)
      const core=new THREE.Mesh(new THREE.SphereGeometry(.023,10,8),new THREE.MeshBasicMaterial({color:'#fff3cf'}));group.add(core)
      const crown=new THREE.Group();crown.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),group.position.clone().normalize());group.add(crown)
      const satellites=[]
      for(let i=0;i<counts[m.id];i++){const a=i/counts[m.id]*Math.PI*2;const s=new THREE.Mesh(new THREE.SphereGeometry(.009,6,5),new THREE.MeshBasicMaterial({color:'#e8bc79'}));s.position.set(Math.sin(a)*.055,Math.cos(a)*.055,.012);crown.add(s);satellites.push(s)}
      const map=makeLabel(pick(m,'city',language),`${counts[m.id]} ${language==='zh'?'件文物':'objects'}`);textures.add(map)
      const label=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,depthWrite:false,depthTest:false}));label.position.y=.19;label.scale.set(1.7,.425,1);label.renderOrder=20;group.add(label)
      pins.push({m,group,halo,core,label,satellites,phase:index*.55,front:false})
    }
    function updateLabels(){
      for(const pin of pins){const active=pin.m.id===state.selected||pin.m.id===state.hover,old=pin.label.material.map
        const map=makeLabel(pick(pin.m,active?'name':'city',latest.current.language),`${counts[pin.m.id]} ${latest.current.language==='zh'?'件文物':'objects'}`)
        textures.add(map);pin.label.material.map=map;textures.delete(old);old.dispose()
        pin.core.material.color.set(pin.m.id===state.selected?'#ea8459':'#fff3cf')
      }state.dirty=true
    }
    const journey=new THREE.Group();globe.add(journey)
    function focusMuseum(){
      const object=latest.current.selected,m=museumById[object.museumId];state.selected=m.id
      state.targetLatitude=m.lat
      state.targetLongitude=state.longitude+THREE.MathUtils.radToDeg(Math.atan2(Math.sin(THREE.MathUtils.degToRad(m.lng-state.longitude)),Math.cos(THREE.MathUtils.degToRad(m.lng-state.longitude))))
      state.targetZoom=GLOBE_ZOOM_DEFAULT
      state.holdUntil=performance.now()+8000
      journey.children.slice().forEach(o=>{journey.remove(o);o.geometry?.dispose();o.material?.dispose()})
      if(object.homePoint){
        const a=new THREE.Vector3(...globePoint(m.lat,m.lng,1)),b=new THREE.Vector3(...globePoint(...object.homePoint,1)),angle=a.angleTo(b),points=[]
        for(let i=0;i<=80;i++){const t=i/80;const v=angle<1e-6?a.clone():a.clone().multiplyScalar(Math.sin((1-t)*angle)/Math.sin(angle)).addScaledVector(b,Math.sin(t*angle)/Math.sin(angle));points.push(v.normalize().multiplyScalar(R+.04+Math.sin(t*Math.PI)*.22))}
        const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineDashedMaterial({color:'#d76f4b',dashSize:.045,gapSize:.035,transparent:true,opacity:.85,depthWrite:false}));l.computeLineDistances();journey.add(l)
        const home=new THREE.Mesh(new THREE.SphereGeometry(.032,12,8),new THREE.MeshBasicMaterial({color:'#df7954'}));home.position.set(...globePoint(...object.homePoint,R+.055));journey.add(home)
      }
      updateLabels()
    }
    function reset(){state.targetLatitude=20;state.targetLongitude=state.longitude+THREE.MathUtils.radToDeg(Math.atan2(Math.sin(THREE.MathUtils.degToRad(-30-state.longitude)),Math.cos(THREE.MathUtils.degToRad(-30-state.longitude))));state.targetZoom=GLOBE_ZOOM_DEFAULT;state.dirty=true}
    state.focus=focusMuseum;state.updateLabels=updateLabels;state.reset=reset
    updateLabels()

    const pickPoint=new THREE.Vector3(),pointers=new Map()
    let down=null,pinch=null
    function hitAt(e){
      const rect=canvas.getBoundingClientRect();let nearest=null,best=e.pointerType==='touch'?24:16
      for(const pin of pins){if(!pin.front)continue;pin.group.getWorldPosition(pickPoint);pickPoint.project(camera);const dx=(pickPoint.x+1)*rect.width/2-(e.clientX-rect.left),dy=(1-pickPoint.y)*rect.height/2-(e.clientY-rect.top),distance=Math.hypot(dx,dy);if(distance<best){nearest=pin.m.id;best=distance}}
      return nearest
    }
    function hover(id){if(state.hover===id)return;state.hover=id;updateLabels();latest.current.onHover(id)}
    function pointerDown(e){if(e.pointerType==='mouse'&&e.button!==0)return;canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);down={distance:0};pinch=null;state.holdUntil=performance.now()+8000}
    function pointerMove(e){
      if(!pointers.has(e.pointerId)){hover(hitAt(e));return}
      const old=pointers.get(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY])
      if(pointers.size===2){const[a,b]=[...pointers.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)state.targetZoom=THREE.MathUtils.clamp(state.targetZoom*d/pinch,GLOBE_ZOOM_MIN,GLOBE_ZOOM_MAX);pinch=d;if(down)down.distance=100}
      else{const dx=e.clientX-old[0],dy=e.clientY-old[1];if(down)down.distance+=Math.abs(dx)+Math.abs(dy);state.targetLongitude-=dx*.3;state.targetLatitude=THREE.MathUtils.clamp(state.targetLatitude+dy*.25,-80,80)}
      state.dirty=true;state.holdUntil=performance.now()+8000;hover(null)
    }
    function pointerUp(e){if(down&&down.distance<7&&pointers.size===1){const id=hitAt(e);if(id)latest.current.onMuseum(id)}pointers.delete(e.pointerId);down=null;pinch=null}
    function cancel(e){pointers.delete(e.pointerId);down=null;pinch=null;hover(null)}
    function wheel(e){e.preventDefault();const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?state.height:1);state.targetZoom=THREE.MathUtils.clamp(state.targetZoom*Math.exp(-delta*.0011),GLOBE_ZOOM_MIN,GLOBE_ZOOM_MAX);state.holdUntil=performance.now()+8000;state.dirty=true}
    function key(e){const actions={ArrowLeft:()=>state.targetLongitude-=15,ArrowRight:()=>state.targetLongitude+=15,ArrowUp:()=>state.targetLatitude=Math.min(80,state.targetLatitude+10),ArrowDown:()=>state.targetLatitude=Math.max(-80,state.targetLatitude-10),'+':()=>state.targetZoom=Math.min(GLOBE_ZOOM_MAX,state.targetZoom+.07),'-':()=>state.targetZoom=Math.max(GLOBE_ZOOM_MIN,state.targetZoom-.07),Home:reset};if(actions[e.key]){e.preventDefault();actions[e.key]();state.holdUntil=performance.now()+8000;state.dirty=true}}
    function listen(type,fn,options){canvas.addEventListener(type,fn,options);events.push([type,fn])}
    listen('pointerdown',pointerDown);listen('pointermove',pointerMove);listen('pointerup',pointerUp);listen('pointercancel',cancel);listen('pointerleave',()=>{if(!down)hover(null)});listen('wheel',wheel,{passive:false});listen('keydown',key)
    listen('webglcontextlost',e=>{e.preventDefault();if(!disposed)latest.current.onFailure()})
    const resize=new ResizeObserver(()=>{const {width,height}=mount.getBoundingClientRect();state.width=Math.max(1,width);state.height=Math.max(1,height);renderer.setSize(state.width,state.height,false);camera.aspect=state.width/state.height;state.fit=globeCameraDistance(camera.aspect);camera.updateProjectionMatrix();state.dirty=true});resize.observe(mount)
    const worldPosition=new THREE.Vector3(),normal=new THREE.Vector3(),view=new THREE.Vector3(),center=new THREE.Vector3(),quaternion=new THREE.Quaternion(),inverseQuaternion=new THREE.Quaternion(),projected=new THREE.Vector3()
    function frame(now){
      if(disposed)return;raf=requestAnimationFrame(frame);if(document.hidden||now-lastFrame<32)return
      const dt=Math.min((now-lastTime)/1000||0,.06);lastTime=now
      if(latest.current.motion&&latest.current.autoRotate&&!state.hover&&!pointers.size&&now>state.holdUntil)state.targetLongitude-=dt*.9
      const moving=Math.abs(state.latitude-state.targetLatitude)+Math.abs(state.longitude-state.targetLongitude)+Math.abs(state.zoom-state.targetZoom)>.001
      if(!latest.current.motion&&!moving&&!state.dirty)return
      lastFrame=now;const f=latest.current.motion?Math.min(1,dt*8):1
      state.latitude=THREE.MathUtils.lerp(state.latitude,state.targetLatitude,f);state.longitude=THREE.MathUtils.lerp(state.longitude,state.targetLongitude,f);state.zoom=THREE.MathUtils.lerp(state.zoom,state.targetZoom,f)
      if(latest.current.motion)state.time+=dt
      globe.rotation.set(THREE.MathUtils.degToRad(state.latitude),-THREE.MathUtils.degToRad(state.longitude),0,'XYZ')
      const breath=latest.current.motion?.84+.25*Math.sin(state.time*Math.PI/3.8):1
      starfield.update(state.time)
      landscape.update(state.time)
      globe.position.y=Y+(latest.current.motion?Math.sin(state.time*.55)*.018:0)
      // Dolly the shared camera: globe, relief and water all respond to zoom.
      // Reserve reading space for an open mobile card, without cutting the water canvas.
      let fit=state.fit,offset=0
      if(state.width<=760&&latest.current.collectionOpen){
        const cardHeight=parseFloat(getComputedStyle(mount.closest('.museum-stage')).getPropertyValue('--collection-height'))||250
        const available=Math.max(190,state.height-116-cardHeight-132)
        fit=Math.max(fit,globeCameraDistance(state.width/available)*state.height/available)
        offset=state.height/2-(116+available/2)
      }
      if(offset)camera.setViewOffset(state.width,state.height,0,offset,state.width,state.height)
      else if(camera.view?.enabled)camera.clearViewOffset()
      camera.position.set(0,Y+.9,fit/state.zoom);camera.lookAt(0,Y-.5,0)
      camera.updateMatrixWorld()
      globe.updateMatrixWorld(true);globe.getWorldPosition(center);globe.getWorldQuaternion(quaternion);view.copy(camera.position).sub(center);const distance=view.length();view.normalize()
      inverseQuaternion.copy(quaternion).invert();const labelCandidates=[]
      for(const pin of pins){
        normal.copy(pin.group.position).normalize().applyQuaternion(quaternion);pin.front=normal.dot(view)>(R+.075)/distance+.025
        pin.group.visible=pin.front
        const active=pin.m.id===state.selected||pin.m.id===state.hover
        pin.label.visible=false
        if(pin.front){
          pin.group.getWorldPosition(worldPosition)
          const depth=-projected.copy(worldPosition).applyMatrix4(camera.matrixWorldInverse).z
          const unitPerPixel=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*depth/state.height
          const labelWidth=active?240:210
          pin.label.scale.set(labelWidth*unitPerPixel,labelWidth*.25*unitPerPixel,1)
          pin.label.position.set(0,35*unitPerPixel,0).applyQuaternion(inverseQuaternion)
          pin.label.getWorldPosition(projected);projected.project(camera)
          const x=(projected.x+1)*state.width/2,y=(1-projected.y)*state.height/2,w=labelWidth*pin.label.material.map.userData.textWidth/768+12
          labelCandidates.push({pin,priority:pin.m.id===state.hover?3:pin.m.id===state.selected?2:1,rect:{left:x-w/2,right:x+w/2,top:y-29,bottom:y+29}})
        }
        const pulse=latest.current.motion?.5+.5*Math.sin(state.time*1.6+pin.phase):.6,size=(active?.36:.26)*(.8+pulse*.4)
        pin.halo.scale.set(size,size,1);pin.halo.material.opacity=.55+pulse*.4
      }
      // Keep labels screen-sized and suppress collisions; all pins remain selectable.
      const placed=[]
      for(const {pin,rect,priority} of labelCandidates.sort((a,b)=>b.priority-a.priority)){
        const fits=rect.left>5&&rect.right<state.width-5&&rect.top>5&&rect.bottom<state.height-5
        const overlaps=placed.some(r=>rect.left<r.right&&rect.right>r.left&&rect.top<r.bottom&&rect.bottom>r.top)
        pin.label.visible=fits&&(!overlaps||priority===3)
        if(pin.label.visible)placed.push(rect)
      }
      if(particleMaterial){particleMaterial.uniforms.time.value=state.time;particleMaterial.uniforms.breath.value=breath}
      renderer.render(scene,camera);state.dirty=false
    }
    raf=requestAnimationFrame(frame)
    return()=>{disposed=true;abort.abort();cancelAnimationFrame(raf);resize.disconnect();engine.current=null;events.forEach(([t,f])=>canvas.removeEventListener(t,f));scene.traverse(o=>{o.geometry?.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m?.dispose())});textures.forEach(t=>t.dispose());renderer.dispose();canvas.remove()}
  },[])
  const previous=useRef(selected.id)
  useEffect(()=>{if(previous.current!==selected.id){previous.current=selected.id;engine.current?.focus()}},[selected.id])
  useEffect(()=>{engine.current?.updateLabels?.();host.current?.querySelector('canvas')?.setAttribute('aria-label',language==='zh'?'悬浮全息地球仪；方向键旋转，加减键拉近或拉远整个空间':'Floating holographic globe; arrows rotate, plus/minus move through the whole scene')},[language])
  useEffect(()=>{const s=engine.current;if(!s)return;if(command.type==='left')s.targetLongitude-=20;else if(command.type==='right')s.targetLongitude+=20;else if(command.type==='zoomIn')s.targetZoom=Math.min(GLOBE_ZOOM_MAX,s.targetZoom+.07);else if(command.type==='zoomOut')s.targetZoom=Math.max(GLOBE_ZOOM_MIN,s.targetZoom-.07);else if(command.type==='museum')s.focus();else s.reset();s.holdUntil=performance.now()+(command.tick?8000:1200);s.dirty=true},[command.tick])
  useEffect(()=>{if(engine.current)engine.current.dirty=true},[motion,collectionOpen])
  return <div className={`three-room globe-room ${ready?'room-ready':''}`}><div className="room-loading"><span role="status">{language==='zh'?'一方天地，正在点亮…':'Bringing a world into light…'}</span></div><div ref={host} className="three-canvas"/><p className="globe-hint">{language==='zh'?'星河流转，循光寻藏':'FOLLOW THE LIGHT ACROSS THE STARS'}</p><span className="room-caption">{language==='zh'?'山海厅 · 星河无界':'SHANHAI HALL · AN OPEN SKY'}</span></div>
}
