import * as THREE from 'three'

// Seeded, distant layers keep the space calm and stable across renders.
export function createStarfield() {
  const group = new THREE.Group()
  let seed = 71429
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  const positions = [], sizes = [], phases = [], colors = []
  for (let i = 0; i < 4400; i++) {
    const radius = 80 + random() * 155
    const azimuth = random() * Math.PI * 2
    const latitude = i < 1700 ? (random() - .5) * .24 : Math.asin(random() * 2 - 1)
    const point = new THREE.Vector3(
      Math.cos(latitude) * Math.sin(azimuth),
      Math.sin(latitude),
      Math.cos(latitude) * Math.cos(azimuth),
    ).multiplyScalar(radius).applyAxisAngle(new THREE.Vector3(0, 0, 1), .42)
    positions.push(...point)
    sizes.push(i < 1700 ? .6 + random() * .7 : .8 + random() ** 4 * 2.7)
    phases.push(random() * Math.PI * 2)
    const warmth = random()
    colors.push(.62 + warmth * .24, .67 + warmth * .08, .78 - warmth * .23)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { time: { value: 0 }, ratio: { value: Math.min(devicePixelRatio || 1, 1.6) } },
    vertexShader: `
      attribute float size; attribute float phase; attribute vec3 color;
      uniform float ratio; varying float vPhase; varying vec3 vColor;
      void main() {
        vPhase=phase; vColor=color;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
        gl_PointSize=size*ratio*2.0;
      }`,
    fragmentShader: `
      uniform float time; varying float vPhase; varying vec3 vColor;
      void main() {
        float d=length(gl_PointCoord-.5); if(d>.5)discard;
        float core=exp(-d*d*70.0); float halo=exp(-d*d*14.0)*.12;
        float twinkle=.28+.16*sin(time*.26+vPhase);
        gl_FragColor=vec4(vColor,(core+halo)*twinkle);
      }`,
  })
  group.add(new THREE.Points(geometry, material))
  return { group, update(time) { material.uniforms.time.value = time; group.rotation.y = time * .0006 } }
}
