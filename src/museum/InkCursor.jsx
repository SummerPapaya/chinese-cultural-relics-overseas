import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// This is an interaction effect, not a painting asset. No event is intercepted.
export default function InkCursor({motion=true}) {
  const canvasRef=useRef()
  const [target,setTarget]=useState(()=>document.body)
  useEffect(()=>{
    const followLayer=()=>setTarget(document.querySelector('dialog[open]')||document.fullscreenElement||document.body)
    const observer=new MutationObserver(followLayer)
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']})
    document.addEventListener('fullscreenchange',followLayer);followLayer()
    return()=>{observer.disconnect();document.removeEventListener('fullscreenchange',followLayer)}
  },[])
  useEffect(()=>{
    const media=matchMedia('(pointer:fine) and (hover:hover)')
    if(!media.matches)return
    const canvas=canvasRef.current,ctx=canvas.getContext('2d')
    if(!ctx)return
    let particles=[],raf=0,last=0,lastEmit=0,previous=null,alive=true
    const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=`${innerWidth}px`;canvas.style.height=`${innerHeight}px`;ctx.setTransform(dpr,0,0,dpr,0,0)}
    const root=document.documentElement
    root.style.setProperty('--ink-cursor',`url("${import.meta.env.BASE_URL}cursors/gold-dot.svg") 9 9, auto`)
    root.classList.add('ink-pointer-active')
    const spawn=(px,py,burst=false)=>{
      const count=burst?32:2
      for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=burst?24+Math.random()*76:7+Math.random()*21;particles.push({x:px+(Math.random()-.5)*4,y:py+(Math.random()-.5)*4,vx:Math.cos(a)*s,vy:Math.sin(a)*s-5,r:.65+Math.random()*(burst?1.4:.85),life:0,ttl:burst?.9+Math.random()*.7:.55+Math.random()*.6,tone:Math.random()})}
      particles=particles.slice(-240)
      if(!raf&&motion){last=performance.now();raf=requestAnimationFrame(frame)}
    }
    function frame(now){
      if(!alive)return
      const dt=Math.min((now-last)/1000,.04);last=now;ctx.clearRect(0,0,innerWidth,innerHeight)
      particles=particles.filter(p=>p.life<p.ttl)
      ctx.globalCompositeOperation='lighter'
      for(const p of particles){
        p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-dt*1.5);p.vy+=18*dt
        const fade=Math.max(0,1-p.life/p.ttl),radius=p.r*(.4+fade*.6),halo=radius*6
        const color=p.tone<.16?'229,151,92':'245,213,151'
        const gradient=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,halo)
        gradient.addColorStop(0,`rgba(${color},${fade*.42})`);gradient.addColorStop(.3,`rgba(${color},${fade*.1})`);gradient.addColorStop(1,`rgba(${color},0)`)
        ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(p.x,p.y,halo,0,Math.PI*2);ctx.fill()
        ctx.fillStyle=`rgba(255,240,198,${fade*.88})`;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill()
      }
      ctx.globalCompositeOperation='source-over'
      raf=particles.length?requestAnimationFrame(frame):0
    }
    const move=e=>{
      if(e.pointerType!=='mouse'||!motion)return
      const now=performance.now();if(now-lastEmit<16)return
      const from=previous||[e.clientX,e.clientY],dx=e.clientX-from[0],dy=e.clientY-from[1],steps=Math.min(7,Math.max(1,Math.ceil(Math.hypot(dx,dy)/7)))
      for(let i=1;i<=steps;i++)spawn(from[0]+dx*i/steps,from[1]+dy*i/steps)
      previous=[e.clientX,e.clientY];lastEmit=now
    }
    const click=e=>{if(motion&&e.pointerType==='mouse')spawn(e.clientX,e.clientY,true)}
    const hide=()=>{particles=[];previous=null;ctx.clearRect(0,0,innerWidth,innerHeight)}
    resize();window.addEventListener('resize',resize);document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerdown',click,{passive:true});window.addEventListener('blur',hide)
    return()=>{alive=false;cancelAnimationFrame(raf);root.classList.remove('ink-pointer-active');window.removeEventListener('resize',resize);document.removeEventListener('pointermove',move);document.removeEventListener('pointerdown',click);window.removeEventListener('blur',hide)}
  },[motion,target])
  return createPortal(<canvas ref={canvasRef} className="ink-cursor-effects" aria-hidden="true"/>,target)
}
