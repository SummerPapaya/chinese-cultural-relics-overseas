import * as THREE from 'three'

// An original, procedural interpretation of blue-green shanshui, not a scan of
// the Palace Museum scroll. All relief, brushwork and buildings are local geometry.
const clamp = THREE.MathUtils.clamp
const smooth = (a, b, x) => { const t = clamp((x-a)/(b-a), 0, 1); return t*t*(3-2*t) }
function random(seed) {
  return () => { seed = (Math.imul(seed, 1664525)+1013904223) >>> 0; return seed/4294967296 }
}
const noiseGLSL = `
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float wash(vec2 p){return noise(p)*.57+noise(p*2.03)*.28+noise(p*4.17)*.15;}
`
const reliefVertex = `
varying vec3 vPosition; varying vec3 vNormal; varying float vDepth;
void main(){vPosition=position;vNormal=normalize(normalMatrix*normal);
vec4 p=modelViewMatrix*vec4(position,1.);vDepth=-p.z;gl_Position=projectionMatrix*p;}
`
function mountainMaterial(summit, distance, hall) {
  return new THREE.ShaderMaterial({
    uniforms: { summit:{value:summit}, distant:{value:distance}, dimness:{value:hall?.105:.30}, saturation:{value:hall?.24:.7} },
    vertexShader:reliefVertex,
    fragmentShader:`
    uniform float summit; uniform float distant; uniform float dimness; uniform float saturation;
    varying vec3 vPosition; varying vec3 vNormal; varying float vDepth;
    ${noiseGLSL}
    void main(){
      // Do not render the rectangular heightfield outside its eroded coastline.
      if(vPosition.y<.008)discard;
      float h=vPosition.y/summit;
      float pigment=wash(vPosition.xz*2.1+vec2(vPosition.y*.5,-vPosition.y*.9));
      float crest=smoothstep(.24,.87,h+pigment*.24);
      vec3 earth=vec3(.108,.105,.066), malachite=vec3(.048,.147,.128), azurite=vec3(.035,.117,.177);
      vec3 color=mix(earth,malachite,smoothstep(.015,.3,h));
      color=mix(color,azurite,crest*.92);
      float grain=noise(vPosition.xz*135.+vPosition.y*17.);
      // Long, broken strokes running down a rock face (rather than polygon edges).
      float stroke=sin(vPosition.x*19.+vPosition.z*13.+wash(vPosition.xz*3.)*5.+vPosition.y*1.7);
      float cut=pow(max(0.,stroke),14.)*smoothstep(.06,.3,h);
      float light=dot(normalize(vNormal),normalize(vec3(-.6,.85,.7)))*.5+.5;
      float shade=mix(.43,1.27,smoothstep(.12,.88,light));
      color*=shade*(.77+pigment*.43)-cut*.21;
      color+=vec3(.06,.067,.042)*pow(max(0.,1.-abs(stroke)),9.)*.25;
      color*=.94+grain*.12;
      // Distance washes are blue-grey, like pigment receding into blank silk.
      color=mix(color,vec3(.039,.061,.063),distant*.54);
      color*=mix(1.,.44,smoothstep(22.,55.,vDepth));
      color*=dimness;
      color=mix(vec3(dot(color,vec3(.2126,.7152,.0722))),color,saturation);
      gl_FragColor=vec4(color,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
  })
}

// Each island contains asymmetric main peaks, subsidiary crags and an eroded apron.
// The centre stays open water, giving the globe a clear, unobstructed hovering gap.
const islands = [
  {x:-9.3,z:-9.5,w:10,d:5.1,h:2.25,seed:47,far:.75},
  {x:1.4,z:-15,w:18,d:4.3,h:1.45,seed:82,far:1},
  {x:10.6,z:-10.5,w:11,d:5.4,h:3.4,seed:62,far:.55},
  {x:-7.0,z:-3.6,w:7.5,d:4.2,h:2.8,seed:14,far:.12},
  {x:7.9,z:-4.0,w:8.6,d:5.3,h:4.15,seed:29,far:.12},
  {x:-11.5,z:1.0,w:6.9,d:4.0,h:2.0,seed:31,far:0},
  {x:9.3,z:2.0,w:6.2,d:4.2,h:2.6,seed:43,far:0},
  {x:-3.25,z:2.9,w:3.2,d:1.4,h:.33,seed:76,far:0},
  {x:2.8,z:3.4,w:3.6,d:1.5,h:.46,seed:51,far:0},
  {x:-.7,z:-6.4,w:3.5,d:1.2,h:.32,seed:92,far:.5},
  {x:1.6,z:7.0,w:7.8,d:2.2,h:.67,seed:104,far:0},
]

export function createQianliLandscape({ compact=false, hall=false }={}) {
  const group=new THREE.Group();group.name='Qianli · blue-green relief'
  const time={value:0}, linePositions=[], treePositions=[], treeScales=[], branches=[]
  const detail=compact?56:88
  const ink=new THREE.LineBasicMaterial({color:'#719083',transparent:true,opacity:hall?.015:.055,depthWrite:false})
  for(const island of islands){
    const rand=random(island.seed), peaks=[
      {x:.06,z:-.08,h:1,r:.25},
      {x:-.16,z:-.05,h:.82,r:.28},
      {x:.20,z:.10,h:.57,r:.22},
      {x:-.07,z:.22,h:.42,r:.19},
    ]
    for(let i=0;i<7;i++)peaks.push({x:(rand()-.5)*.72,z:(rand()-.5)*.48,h:.22+rand()*.46,r:.13+rand()*.17})
    function height(x,z){
      const u=x/island.w,v=z/island.d
      const coastAngle=Math.atan2(v,u)
      const coast=1+.1*Math.sin(coastAngle*5+island.seed)+.065*Math.sin(coastAngle*9+island.seed*.4)
      const envelope=1-smooth(.33,.49,Math.sqrt(u*u+v*v)*coast)
      let y=0
      for(const peak of peaks){
        const dx=u-peak.x, dz=(v-peak.z)*.94,angle=Math.atan2(dz,dx)
        const fold=1+.09*Math.sin(angle*7+island.seed)+.045*Math.sin(angle*13+u*11)
        const r=Math.sqrt(dx*dx+dz*dz)/peak.r*fold
        // Rounded summits and steep shoulders evoke stacked Song-dynasty crags.
        const shape=Math.pow(Math.max(0,1-Math.pow(r,1.65)),1.75)
        y=Math.max(y,shape*peak.h)
      }
      const apron=.035*(1+Math.sin(u*16+v*8)*.2)
      return (y+apron)*envelope*island.h
    }
    const nx=detail,nz=Math.round(detail*island.d/island.w)+18
    const geometry=new THREE.PlaneGeometry(island.w,island.d,nx,nz)
    geometry.rotateX(-Math.PI/2)
    const positions=geometry.attributes.position
    for(let i=0;i<positions.count;i++)positions.setY(i,height(positions.getX(i),positions.getZ(i)))
    geometry.computeVertexNormals()
    const mesh=new THREE.Mesh(geometry,mountainMaterial(island.h,island.far,hall))
    mesh.position.set(island.x,.01,island.z);group.add(mesh)
    // A few fine contour brushstrokes describe the folded stone, no wireframe.
    for(const peak of peaks.slice(0,5)){
      for(let a=0;a<9;a++){
        const angle=a*Math.PI*2/9+rand()*.27
        let last=null
        for(let step=2;step<24;step++){
          const r=step/24*peak.r
          const x=(peak.x+Math.cos(angle)*r)*island.w,z=(peak.z+Math.sin(angle)*r)*island.d
          const y=height(x,z)
          const p=[x+island.x,y+.017,z+island.z]
          if(last&&y>island.h*.09)linePositions.push(...last,...p)
          last=p
        }
      }
    }
    // Small, irregular pine groves on low banks, instanced for mobile GPUs.
    for(let i=0;i<(compact?32:62);i++){
      const x=(rand()-.5)*island.w*.87,z=(rand()-.5)*island.d*.8,y=height(x,z)
      if(y<.035||y>island.h*.36||island.far>.8)continue
      const scale=.055+rand()*.1,px=x+island.x,pz=z+island.z
      branches.push(px,y,pz,px+.018,y+scale*2,pz)
      for(let j=0;j<3;j++){
        treePositions.push(px+(rand()-.5)*scale,y+scale*(1.15+j*.25),pz+(rand()-.5)*scale)
        treeScales.push(scale*(.58-j*.08),scale*.29,scale*.55)
      }
    }
  }
  const lines=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(linePositions,3)),ink);group.add(lines)
  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(branches,3)),new THREE.LineBasicMaterial({color:'#303a28'})))
  const trees=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),new THREE.MeshBasicMaterial({color:'#142d27'}),treePositions.length/3)
  const transform=new THREE.Object3D()
  for(let i=0;i<trees.count;i++){transform.position.fromArray(treePositions,i*3);transform.scale.fromArray(treeScales,i*3);transform.updateMatrix();trees.setMatrixAt(i,transform.matrix)}
  group.add(trees)

  const water=new THREE.Mesh(new THREE.PlaneGeometry(240,240),new THREE.ShaderMaterial({
    uniforms:{time},transparent:true,depthWrite:false,
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform float time;varying vec2 vUv;${noiseGLSL}
    void main(){vec2 p=vUv*240.;float ink=wash(p*.22);
      float ripple=pow(max(0.,sin(p.y*32.+sin(p.x*.65+time*.06)*1.8)),22.);
      float broken=smoothstep(.48,.72,noise(vec2(p.x*2.1,p.y*.7)));
      float pool=exp(-pow((vUv.x-.5)*6.,2.)-pow((vUv.y-.51)*5.,2.));
      vec3 color=mix(vec3(.006,.011,.012),vec3(.020,.027,.025),pool);
      color+=vec3(.16,.15,.10)*ripple*broken*.19*pool;
      color*=.84+ink*.26;
      float fade=(1.-smoothstep(.23,.49,abs(vUv.x-.5)))*(1.-smoothstep(.13,.49,abs(vUv.y-.5)));
      gl_FragColor=vec4(color,fade*.88);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
  }));water.rotation.x=-Math.PI/2;water.position.set(0,-.015,-4);group.add(water)

  const wood=new THREE.MeshBasicMaterial({color:hall?'#30332d':'#474338'})
  const trim=new THREE.MeshBasicMaterial({color:hall?'#403f33':'#625b48'})
  const stone=new THREE.MeshBasicMaterial({color:hall?'#192522':'#3d4840'})
  const roof=new THREE.MeshBasicMaterial({color:hall?'#14211f':'#1d302e',side:THREE.DoubleSide})
  // All the small joinery shares one geometry and one draw call per pigment.
  function timbers(specs,material){
    const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),material,specs.length)
    const item=new THREE.Object3D(),up=new THREE.Vector3(0,1,0)
    specs.forEach(([a,b,w,d],i)=>{
      const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),direction=end.clone().sub(start)
      item.position.copy(start).add(end).multiplyScalar(.5)
      item.quaternion.setFromUnitVectors(up,direction.clone().normalize())
      item.scale.set(w,direction.length(),d);item.updateMatrix();mesh.setMatrixAt(i,item.matrix)
    })
    group.add(mesh)
  }
  const bridgeZ=3.25,from=-1.94,to=1.62,deckY=x=>.18+.085*Math.sin(Math.PI*(x-from)/(to-from))
  const joinery=[],gold=[],masonry=[]
  for(let i=0;i<22;i++){
    const x=from+(to-from)*(i+.5)/22,y=deckY(x)
    joinery.push([[x,y,bridgeZ-.135],[x,y+.018,bridgeZ+.135],.17,.025])
  }
  for(const side of [-1,1]){
    const z=bridgeZ+side*.145
    for(let i=0;i<=11;i++){
      const x=from+(to-from)*i/11,y=deckY(x)
      joinery.push([[x,y,z],[x,y+.26,z],.021,.021])
      if(i===11)continue
      const next=from+(to-from)*(i+1)/11,ny=deckY(next)
      gold.push([[x,y+.26,z],[next,ny+.26,z],.014,.014])
      joinery.push([[x,y+.08,z],[next,ny+.08,z],.011,.011])
      if(i%2===0){
        joinery.push([[x,y+.08,z],[next,ny+.26,z],.009,.009])
        joinery.push([[x,y+.26,z],[next,ny+.08,z],.009,.009])
      }
    }
  }
  for(const x of [from+.38,-.4,to-.38]){
    const y=deckY(x)
    masonry.push([[x,-.01,bridgeZ],[x,y-.025,bridgeZ],.085,.18])
  }
  // The little waterside pavilion has column brackets, two sweeping eaves,
  // raised corner tips and a tiled ridge, rather than a flat extruded roof.
  const pavilionX=-.34,pavilionY=deckY(pavilionX),pavilionZ=bridgeZ
  for(const x of [-.29,.29])for(const z of [-.19,.19]){
    const px=pavilionX+x,pz=pavilionZ+z
    joinery.push([[px,pavilionY,pz],[px,pavilionY+.45,pz],.031,.031])
    gold.push([[px-.075,pavilionY+.43,pz],[px+.075,pavilionY+.43,pz],.032,.026])
  }
  for(const z of [-.21,.21]){
    gold.push([[pavilionX-.34,pavilionY+.47,pavilionZ+z],[pavilionX+.34,pavilionY+.47,pavilionZ+z],.016,.018])
    for(const x of [-.24,.24])joinery.push([[pavilionX+x,pavilionY+.26,pavilionZ+z],[pavilionX+x,pavilionY+.43,pavilionZ+z],.013,.013])
  }
  function hipRoof(width,depth,base,height){
    const w=width/2,d=depth/2
    const points=[[-w,base+.055,-d],[0,base,-d],[w,base+.055,-d],[-w,base+.055,d],[0,base,d],[w,base+.055,d],[-w*.44,height,0],[w*.44,height,0]]
    const triangles=[0,1,6,1,7,6,1,2,7,3,6,4,4,6,7,4,7,5,0,6,3,2,5,7]
    const geometry=new THREE.BufferGeometry()
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));geometry.setIndex(triangles);geometry.computeVertexNormals()
    const mesh=new THREE.Mesh(geometry,roof);mesh.position.set(pavilionX,0,pavilionZ);group.add(mesh)
    for(const z of [-d,d]){
      gold.push([[pavilionX-w,base+.055,pavilionZ+z],[pavilionX,base,pavilionZ+z],.014,.014])
      gold.push([[pavilionX,base,pavilionZ+z],[pavilionX+w,base+.055,pavilionZ+z],.014,.014])
      for(let i=1;i<=6;i++){
        const x=-w+2*w*i/7
        gold.push([[pavilionX+x,base+.05,pavilionZ+z*.93],[pavilionX+x*.44,height-.01,pavilionZ],.005,.005])
      }
    }
    gold.push([[pavilionX-w*.44,height,pavilionZ],[pavilionX+w*.44,height,pavilionZ],.023,.023])
  }
  hipRoof(.92,.65,pavilionY+.49,pavilionY+.72)
  hipRoof(.45,.38,pavilionY+.79,pavilionY+.94)
  gold.push([[pavilionX,pavilionY+.94,pavilionZ],[pavilionX,pavilionY+1.01,pavilionZ],.025,.025])
  timbers(joinery,wood);timbers(gold,trim);timbers(masonry,stone)

  // Horizontal wisps live among the relief, not as a flat image over the globe.
  const mistMaterial=new THREE.ShaderMaterial({uniforms:{time},transparent:true,depthWrite:false,side:THREE.DoubleSide,
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform float time;varying vec2 vUv;${noiseGLSL}
    void main(){float cloud=wash(vec2(vUv.x*9.-time*.009,vUv.y*3.));float edge=pow(sin(vUv.x*3.14159),2.)*pow(sin(vUv.y*3.14159),2.);
      gl_FragColor=vec4(.19,.25,.24,edge*smoothstep(.22,.77,cloud)*.12);}`})
  for(let i=0;i<4;i++){
    const mist=new THREE.Mesh(new THREE.PlaneGeometry(30,1.5),mistMaterial)
    mist.position.set((i%2?1:-1)*2,.34+i*.12,-1-i*3.4);mist.rotation.x=-.2;group.add(mist)
  }
  // Keep the hall terrain entirely below the suspended sphere's lower edge.
  if(hall){group.scale.set(.65,.4,.47);group.position.set(0,-3.85,-6.2)}
  return {group,update(seconds){time.value=seconds}}
}

export function disposeScene(scene) {
  const geometries=new Set(),materials=new Set()
  scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m)materials.add(m)})
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose())
}
