import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createQianliLandscape, disposeScene } from './QianliLandscape'

export default function LandscapeBackdrop(){
  const host=useRef()
  useEffect(()=>{
    const mount=host.current,section=mount.closest('.museum-landing')
    let renderer
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'})}catch{return}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5))
    renderer.setClearColor('#070b0c',0);renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.82
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,150)
    const landscape=createQianliLandscape({compact:window.innerWidth<761});scene.add(landscape.group)
    mount.appendChild(renderer.domElement)
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced=preference.matches,raf=0,last=0,time=0,dirty=true,visible=true
    let x=0,y=0,targetX=0,targetY=0,yaw=0,targetYaw=0,drag=null,suppressClickUntil=0
    function move(e){
      if(reduced)return
      if(drag?.id===e.pointerId){
        const width=Math.max(1,section.clientWidth)
        const dx=e.clientX-drag.x,dy=e.clientY-drag.y
        if(!drag.moved&&Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy)*1.2){
          drag.moved=true;section.setPointerCapture(e.pointerId)
        }
        if(drag.moved){
          e.preventDefault()
          targetYaw=THREE.MathUtils.clamp(drag.yaw+dx/width*.9,-.4,.4)
        }
      }
      if(e.pointerType!=='touch'){
        const r=section.getBoundingClientRect()
        targetX=(e.clientX-r.left)/r.width-.5;targetY=(e.clientY-r.top)/r.height-.5
      }
      dirty=true
    }
    function start(e){
      if(reduced||e.button!==0)return
      drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw:targetYaw,moved:false}
    }
    function end(e){
      if(drag?.id!==e.pointerId)return
      if(drag.moved)suppressClickUntil=performance.now()+200
      drag=null
      if(section.hasPointerCapture(e.pointerId))section.releasePointerCapture(e.pointerId)
    }
    function guardClick(e){
      if(performance.now()>suppressClickUntil)return
      e.preventDefault();e.stopPropagation();suppressClickUntil=0
    }
    function stopNativeDrag(e){e.preventDefault()}
    function leave(){targetX=targetY=0;dirty=true}
    function motionChange(){reduced=preference.matches;if(reduced){drag=null;targetYaw=0}leave()}
    function lost(e){e.preventDefault();mount.classList.add('landscape-unavailable')}
    section.addEventListener('pointerdown',start);section.addEventListener('pointermove',move);section.addEventListener('pointerup',end);section.addEventListener('pointercancel',end);section.addEventListener('pointerleave',leave);section.addEventListener('click',guardClick,true);section.addEventListener('dragstart',stopNativeDrag)
    preference.addEventListener('change',motionChange);renderer.domElement.addEventListener('webglcontextlost',lost)
    const resize=new ResizeObserver(()=>{const r=mount.getBoundingClientRect();camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);dirty=true});resize.observe(mount)
    const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;dirty=true});visibility.observe(mount)
    function frame(now){
      raf=requestAnimationFrame(frame)
      if(document.hidden||!visible||now-last<40||reduced&&!dirty)return
      const dt=Math.min((now-last)/1000,.07);last=now;if(!reduced)time+=dt
      x=THREE.MathUtils.lerp(x,targetX,.055);y=THREE.MathUtils.lerp(y,targetY,.055);yaw=THREE.MathUtils.lerp(yaw,targetYaw,.085)
      // Keep the hand-painted clouds in the same camera motion as the landscape.
      section.style.setProperty('--cloud-scene-x',`${(-yaw*section.clientWidth*.16-x*16).toFixed(1)}px`)
      section.style.setProperty('--cloud-scene-y',`${(-y*8).toFixed(1)}px`)
      section.style.setProperty('--cloud-scene-yaw',`${(-yaw*14).toFixed(2)}deg`)
      const mobile=camera.aspect<1
      // On a phone, frame a section of the scroll rather than cropping both peaks.
      const scrollOffset=mobile?.7:0
      const distance=mobile?24:19.8
      camera.position.set(scrollOffset+x*.95+Math.sin(yaw)*distance,6.0-y*.25,Math.cos(yaw)*distance)
      camera.lookAt(scrollOffset+x*.18,mobile?3.6:3.45,-3.4)
      landscape.update(time);renderer.render(scene,camera);dirty=false
    }
    raf=requestAnimationFrame(frame)
    return()=>{cancelAnimationFrame(raf);resize.disconnect();visibility.disconnect();section.removeEventListener('pointerdown',start);section.removeEventListener('pointermove',move);section.removeEventListener('pointerup',end);section.removeEventListener('pointercancel',end);section.removeEventListener('pointerleave',leave);section.removeEventListener('click',guardClick,true);section.removeEventListener('dragstart',stopNativeDrag);preference.removeEventListener('change',motionChange);renderer.domElement.removeEventListener('webglcontextlost',lost);disposeScene(scene);renderer.dispose();renderer.domElement.remove()}
  },[])
  return <div ref={host} className="landing-landscape" aria-hidden="true"/>
}
