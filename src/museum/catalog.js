import { museums, relics as originals, categories, museumById } from '../data.js'
import { expandedRelics, collections } from './expanded-data.js'
import { supplementalRelics } from './supplemental-data.js'

export { museums, categories, museumById, collections }
const precise = new Set(['emperor-procession', 'empress-procession', 'saluzi', 'quanmaogua', 'medicine-buddha'])
const regional = new Set(['yixian-bm', 'yixian-met', 'david-vases', 'maitreya-paradise'])
const inferred = new Set(['hibiscus', 'pig-dragon', 'aic-buddha'])
// Records remain searchable, but unpublished or unverified photos are not
// requested by the public build. See ATTRIBUTIONS.md for per-image status.
const ownPhotosWithheld = new Set(['nelson-guanyin', 'saluzi', 'quanmaogua'])
const thirdPartyPhotosWithheld = new Set([
  'yixian-bm', 'admonitions', 'david-vases', 'bronze-rhino',
  'empress-procession', 'hibiscus', 'pig-dragon', 'polo-player',
  'maitreya-paradise', 'luo-nymph',
])
const corrections = {
  'water-moon-met': { accession: '53.196a, b', originZh: '河北东安（铭文所记供养社群）；原寺院未定', originEn: 'Dong’an, Hebei (community named in inscription); exact temple unidentified' },
  'aic-buddha': { nameZh: '唐代石雕佛坐像', nameEn: 'Seated Buddha', sourceExtra: 'https://archive.artic.edu/silkroadforteachers/artwork/86380' },
  'maitreya-paradise': { accession: '933.6.1', nameZh: '《弥勒净土变》壁画', originZh: '山西小宁村（馆方物件记录）', originEn: 'Xiaoning village, Shanxi (museum object record)', source: 'https://artsandculture.google.com/asset/the-paradise-of-maitreya-wall-painting-zhu-haogu-and-zhang-boyuan/owFNMNDPDipAgw?hl=en', descZh: '这幅元代壁画绘于1298年，描绘弥勒的净土。皇家安大略博物馆提供的物件记录署名为Zhu Haogu和Zhang Boyuan，并记载来自山西小宁村；此处不把未经复核的寺名或村址当作确定信息。', descEn: 'Dated 1298, this Yuan mural depicts Maitreya’s paradise. The ROM-supplied object record credits Zhu Haogu and Zhang Boyuan and identifies Xiaoning village in Shanxi; a more precise temple or village location is not asserted here.', originPrecision: 'region', homePoint: null },
  'emperor-procession': { descZh: '皇帝与侍从持花与供物礼佛。这幅浮雕与今藏堪萨斯城的皇后礼佛图原分列龙门宾阳中洞入口两侧，共同构成帝室供养图像。', descEn: 'The emperor and attendants carry flowers and offerings. This relief and the companion empress procession now in Kansas City formed a pair flanking the entrance of Longmen’s Central Binyang Cave.' },
  'yixian-bm': { noteZh: '断代说明：馆方主目录列为辽代（907–1125），另一馆方中文介绍采用金代解释；本展保留主目录纪年，不将其视作无争议结论。', noteEn: 'Dating note: the main catalogue assigns the work to the Liao dynasty, while another museum Chinese-language interpretation dates it to the Jin. This exhibition retains the catalogue dating and acknowledges the disagreement.', sourceExtra: 'https://britishmuseum.org.cn/exhibition.aspx?id=171' },
  'yixian-met': { originZh: '传出河北易县西部山洞', originEn: 'Reportedly from caves west of Yixian, Hebei', originPrecision: 'inferred', homePoint: null },
  'admonitions': { imageCaptionZh: '《女史箴图》局部', imageCaptionEn: 'Detail of the Admonitions Scroll' },
  'hibiscus': { imageCaptionZh: '图示红芙蓉，为《红白芙蓉图》两幅之一。', imageCaptionEn: 'The image shows Red Cotton Rosemallow, one of the two scrolls.' },
  'david-vases': { sourceExtra: 'https://www.britishmuseum.org/collection/object/A_PDF-B-613' },
  'nine-dragons': { image: `${import.meta.env?.BASE_URL || './'}art/mfa-nine-dragons-verified.jpg`, imageCaptionZh: '《九龙图》画心局部，非全卷。', imageCaptionEn: 'Painting detail from Nine Dragons, not the complete scroll.', imageSource: 'https://commons.wikimedia.org/wiki/File:Nine_Dragons,_detail,_Song_Dynasty.jpg', creditZh: '图：Wikimedia Commons，PD-Art / 公有领域；原图条目注明来源为Michael Sullivan《The Arts of China》(1999)。藏品资料：波士顿美术博物馆。', creditEn: 'Image: Wikimedia Commons, PD-Art / public domain; the file cites Michael Sullivan, The Arts of China (1999). Object data: MFA Boston.' },
  'luo-nymph': { source: 'https://asia.si.edu/object/F1914.53/', image: `${import.meta.env?.BASE_URL || './'}art/freer-luo-nymph-verified.jpg`, imageCaptionZh: '馆方数字长卷局部，非全卷。', imageCaptionEn: 'Detail of the museum’s digitized handscroll, not the complete scroll.', imageSource: 'https://ids.si.edu/ids/iiif/FS-F1914.53_Stitched/3200,0,1050,651/full/0/default.jpg', creditZh: '图：Smithsonian / 美国国立亚洲艺术博物馆，F1914.53。Usage Conditions Apply；非CC0，当前用于非商业教育预览。', creditEn: 'Image: Smithsonian / National Museum of Asian Art, F1914.53. Usage Conditions Apply; not CC0. Used here for a non-commercial educational preview.' },
}
export const relics = [...originals,...expandedRelics,...supplementalRelics].map(r => ({ ...r,
  originPrecision: r.originPrecision ?? (precise.has(r.id) ? 'site' : regional.has(r.id) ? 'region' : inferred.has(r.id) ? 'inferred' : 'unknown'),
  // A representative point is never presented as a known findspot.
  homePoint: r.homePoint !== undefined ? r.homePoint : precise.has(r.id) || regional.has(r.id) ? [r.originLat, r.originLng] : null,
  ...corrections[r.id],
  ...(ownPhotosWithheld.has(r.id) || thirdPartyPhotosWithheld.has(r.id) ? {
    image: null,
    imageWithheld: true,
    imageSource: null,
    imageCaptionZh: null,
    imageCaptionEn: null,
    creditZh: ownPhotosWithheld.has(r.id) ? '自摄照片未纳入公开仓库；藏品资料见馆方原页。' : '图片来源或再分发权利待核，公开版本暂不提供图片；藏品资料见馆方原页。',
    creditEn: ownPhotosWithheld.has(r.id) ? 'Creator-shot photograph omitted from the public repository; see the museum record for object data.' : 'Image source or redistribution rights under review; the public release omits the image. See the museum record for object data.',
  } : {}),
}))
export const counts = Object.fromEntries(museums.map(m => [m.id, relics.filter(r => r.museumId === m.id).length]))
export const featuredIds = ['nelson-guanyin', 'saluzi', 'emperor-procession', 'medicine-buddha', 'yixian-bm', 'david-vases']
export const pick = (value, field, language) => value[`${field}${language === 'zh' ? 'Zh' : 'En'}`]
export const precisionCopy = {
  site: ['原址附近 · 地图位置为约数', 'Original site · approximate map location'],
  region: ['地区定位 · 非精确出土地', 'Regional location · not an exact findspot'],
  inferred: ['推定 / 传世归属 · 不绘制精确故乡点', 'Attributed or inferred · no exact origin pin'],
  unknown: ['具体地点未详 · 不绘制精确故乡点', 'Precise origin unknown · no exact origin pin'],
}
