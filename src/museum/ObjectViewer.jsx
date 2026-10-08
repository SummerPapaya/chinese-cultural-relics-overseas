import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Box, Image, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react'
import { pick } from './catalog'

// A photograph mounted in real 3D space. Angles are deliberately bounded:
// a single source image contains no evidence for the object's rear geometry.
export default function ObjectViewer({ object, language, motion, onExpand }) {
  const host = useRef(), engine = useRef(), latest = useRef({ motion })
  latest.current = { motion }
  const [view, setView] = useState('spatial')
  const [status, setStatus] = useState('loading')
  const [photoFailed, setPhotoFailed] = useState(false)
  const t = (zh, en) => language === 'zh' ? zh : en
  useEffect(() => { setPhotoFailed(false) }, [object.id])

  useEffect(() => {
    if (view !== 'spatial') return
    setStatus('loading')
    const mount = host.current
    let renderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) }
    catch { setStatus('fallback'); return }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const canvas = renderer.domElement
    canvas.tabIndex = 0
    mount.appendChild(canvas)
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(37, 1, .1, 40)
    const artwork = new THREE.Group()
    scene.add(artwork, new THREE.HemisphereLight('#ffedd1', '#342a25', 2))
    const key = new THREE.DirectionalLight('#ffe0aa', 3.5)
    key.position.set(-3, 4, 6); scene.add(key)
    const fill = new THREE.DirectionalLight('#c1c9d8', 1.2)
    fill.position.set(4, -1, 3); scene.add(fill)
    const state = { x: .05, y: -.18, targetX: .05, targetY: -.18, zoom: 1, targetZoom: 1, fit: 7, dirty: true }
    engine.current = state
    let texture, disposed = false, raf = 0, last = 0, width = 3, height = 3, ready = false
    function resize() {
      const bounds = mount.getBoundingClientRect()
      const w = Math.max(bounds.width, 1), h = Math.max(bounds.height, 1)
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
      state.fit = Math.max(height / 2, width / (2 * camera.aspect)) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.38
      state.dirty = true
    }
    const loader = new THREE.TextureLoader()
    loader.load(object.image, loaded => {
      if (disposed) { loaded.dispose(); return }
      texture = loaded; texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
      const ratio = loaded.image.width / loaded.image.height
      width = ratio > 1 ? 3.4 : 3.3 * ratio
      height = ratio > 1 ? 3.4 / ratio : 3.3
      const slab = new THREE.Mesh(new THREE.BoxGeometry(width + .055, height + .055, .105), new THREE.MeshStandardMaterial({ color: '#6f5235', metalness: .65, roughness: .42 }))
      const photo = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }))
      photo.position.z = .055
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(slab.geometry), new THREE.LineBasicMaterial({ color: '#d7b684', transparent: true, opacity: .7 }))
      artwork.add(slab, photo, edge)
      ready = true; resize(); setStatus('ready')
    }, undefined, () => { if (!disposed) setStatus('fallback') })
    const pointers = new Map(); let pinch = null
    const clamp = THREE.MathUtils.clamp
    const stopDrag = e => { pointers.delete(e.pointerId); pinch = null }
    function pointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      canvas.focus({ preventScroll: true }); canvas.setPointerCapture(e.pointerId)
      pointers.set(e.pointerId, [e.clientX, e.clientY]); pinch = null
    }
    function pointerMove(e) {
      const old = pointers.get(e.pointerId)
      if (!old) return
      pointers.set(e.pointerId, [e.clientX, e.clientY])
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1])
        if (pinch) state.targetZoom = clamp(state.targetZoom * d / pinch, .8, 1.8)
        pinch = d
      } else {
        state.targetY = clamp(state.targetY + (e.clientX - old[0]) * .006, -.78, .78)
        state.targetX = clamp(state.targetX + (e.clientY - old[1]) * .005, -.44, .44)
      }
      state.dirty = true
    }
    function reset() { state.targetX = 0; state.targetY = 0; state.targetZoom = 1; state.dirty = true }
    function zoom(delta) { state.targetZoom = clamp(state.targetZoom + delta, .8, 1.8); state.dirty = true }
    state.reset = reset; state.zoomBy = zoom
    function wheel(e) { e.preventDefault(); zoom(-e.deltaY * .001) }
    function keydown(e) {
      const actions = {
        ArrowLeft: () => state.targetY = clamp(state.targetY - .12, -.78, .78),
        ArrowRight: () => state.targetY = clamp(state.targetY + .12, -.78, .78),
        ArrowUp: () => state.targetX = clamp(state.targetX - .1, -.44, .44),
        ArrowDown: () => state.targetX = clamp(state.targetX + .1, -.44, .44),
        '+': () => zoom(.15), '-': () => zoom(-.15), Home: reset,
      }
      if (actions[e.key]) { e.preventDefault(); actions[e.key](); state.dirty = true }
    }
    const contextLost = e => { e.preventDefault(); if (!disposed) setStatus('fallback') }
    const events = { pointerdown: pointerDown, pointermove: pointerMove, pointerup: stopDrag, pointercancel: stopDrag, wheel, keydown, webglcontextlost: contextLost }
    for (const [event, handler] of Object.entries(events)) canvas.addEventListener(event, handler, { passive: false })
    const observer = new ResizeObserver(resize); observer.observe(mount); resize()
    function frame(now) {
      if (disposed) return
      raf = requestAnimationFrame(frame)
      if (!ready || document.hidden || now - last < 30) return
      const moving = Math.abs(state.x - state.targetX) + Math.abs(state.y - state.targetY) + Math.abs(state.zoom - state.targetZoom) > .0001
      if (!moving && !state.dirty) return
      const smoothing = latest.current.motion ? Math.min(1, (now - last) / 85) : 1
      last = now
      state.x = THREE.MathUtils.lerp(state.x, state.targetX, smoothing)
      state.y = THREE.MathUtils.lerp(state.y, state.targetY, smoothing)
      state.zoom = THREE.MathUtils.lerp(state.zoom, state.targetZoom, smoothing)
      artwork.rotation.set(state.x, state.y, 0)
      camera.position.set(0, 0, state.fit / state.zoom); camera.lookAt(0, 0, 0)
      renderer.render(scene, camera); state.dirty = false
    }
    raf = requestAnimationFrame(frame)
    return () => {
      disposed = true; cancelAnimationFrame(raf); observer.disconnect(); engine.current = null
      for (const [event, handler] of Object.entries(events)) canvas.removeEventListener(event, handler)
      scene.traverse(node => { node.geometry?.dispose(); node.material?.dispose() })
      texture?.dispose(); renderer.dispose(); canvas.remove()
    }
  }, [object.id, object.image, view])
  useEffect(() => {
    host.current?.querySelector('canvas')?.setAttribute('aria-label', t(`${object.nameZh}：拖动调整观赏角度，方向键旋转，加减键缩放`, `${object.nameEn}: drag or use arrow keys to tilt; plus/minus to zoom`))
  }, [object.id, language, view, status])

  const spatial = view === 'spatial' && status !== 'fallback'
  return <div className="object-viewer">
    <div className="object-view-tabs" aria-label={t('展品浏览方式', 'Object view')}>
      <button className={view === 'spatial' ? 'active' : ''} aria-pressed={view === 'spatial'} onClick={() => setView('spatial')}><Box size={15}/>{t('立体观赏', 'Spatial view')}</button>
      <button className={view === 'photo' ? 'active' : ''} aria-pressed={view === 'photo'} onClick={() => setView('photo')}><Image size={15}/>{t('原图', 'Photograph')}</button>
    </div>
    <div className="object-view-stage">
      {view === 'spatial' && <div ref={host} className="object-view-canvas" style={status === 'fallback' ? { visibility: 'hidden' } : undefined}/>}
      {!spatial && (photoFailed ? <p className="object-view-message">{t('图片暂不可用，请查看馆方原页。', 'Image unavailable. Please see the museum record.')}</p> : <img className="object-view-photo" src={object.image} alt={pick(object, 'name', language)} onError={() => setPhotoFailed(true)}/>)}
      {spatial && status === 'loading' && <p className="object-view-message" role="status">{t('正在点亮这件文物…', 'Bringing the object into view…')}</p>}
      {spatial && status === 'ready' && <p className="object-view-hint">{t('拖动调整角度 · 滚轮 / 双指缩放', 'Drag to tilt · Scroll / pinch to zoom')}</p>}
    </div>
    <div className="object-view-controls">
      {spatial && <><button onClick={() => engine.current?.zoomBy(-.15)} aria-label={t('缩小展品', 'Zoom out object')}><Minus size={17}/></button><button onClick={() => engine.current?.zoomBy(.15)} aria-label={t('放大展品', 'Zoom in object')}><Plus size={17}/></button><button onClick={() => engine.current?.reset()} aria-label={t('回到正面', 'Return to front')}><RotateCcw size={16}/></button></>}
      <button className="object-view-expand" onClick={onExpand}><Maximize2 size={15}/>{t('放大原图', 'Enlarge photo')}</button>
    </div>
    <p className="object-view-note">{t('馆藏照片的立体呈现 · 非文物三维扫描', 'Photograph presented in 3D · not a 3D scan')}</p>
  </div>
}
