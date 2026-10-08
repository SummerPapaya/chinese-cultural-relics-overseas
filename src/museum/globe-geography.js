export const GLOBE_RADIUS=2.6
export const GLOBE_HEIGHT=3.5
export const GLOBE_ZOOM_MIN=.62
export const GLOBE_ZOOM_MAX=1.28
export const GLOBE_ZOOM_DEFAULT=1.1
export function globePoint(lat,lng,radius=GLOBE_RADIUS){
  const phi=lat*Math.PI/180,theta=lng*Math.PI/180
  return [radius*Math.cos(phi)*Math.sin(theta),radius*Math.sin(phi),radius*Math.cos(phi)*Math.cos(theta)]
}
// Fit the sphere to the smaller viewport dimension, including narrow phones.
export function globeCameraDistance(aspect,fov=46){
  const half=Math.atan(Math.tan(fov*Math.PI/360)*Math.min(1,aspect))
  // Reserve space below for relief and above for labels, including at max zoom.
  return GLOBE_RADIUS/Math.sin(half)*1.58
}
