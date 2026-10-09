import { museums, relics as originals, categories, museumById } from '../data.js'
import { expandedRelics, collections } from './expanded-data.js'
import { supplementalRelics } from './supplemental-data.js'

export { museums, categories, museumById, collections }
const precise = new Set(['emperor-procession', 'empress-procession', 'saluzi', 'quanmaogua', 'medicine-buddha'])
const regional = new Set(['yixian-bm', 'yixian-met', 'david-vases', 'maitreya-paradise'])
const inferred = new Set(['hibiscus', 'pig-dragon', 'aic-buddha'])
// Each replacement photograph has an object-matched Commons file page and a
// per-file licence in ATTRIBUTIONS.md. Own museum photos stay Git-ignored.
const openPhoto = (name, imageSource, creditZh, creditEn, extra = {}) => ({
  image: `${import.meta.env?.BASE_URL || './'}art/${name}`,
  imageSource, creditZh, creditEn, ...extra,
})
const verifiedOpenPhotos = {
  'yixian-bm': openPhoto('bm-luohan-open.jpg', 'https://commons.wikimedia.org/wiki/File:Luohan_at_British_Museum.JPG', '摄影：Midnightblueowl / Wikimedia Commons，CC BY-SA 3.0；网页尺寸缩放，馆藏资料：大英博物馆。', 'Photo: Midnightblueowl / Wikimedia Commons, CC BY-SA 3.0; resized for web. Object data: British Museum.'),
  'admonitions': openPhoto('bm-admonitions-open.jpg', 'https://commons.wikimedia.org/wiki/File:Admonitions_Scroll_Scene_10.jpg', '图：Wikimedia Commons，公有领域标记；藏品资料：大英博物馆。', 'Image: Wikimedia Commons, public-domain mark. Object data: British Museum.'),
  'david-vases': openPhoto('bm-david-vases-open.jpg', 'https://commons.wikimedia.org/wiki/File:The_David_Vases.jpg', '摄影：Szilas / Wikimedia Commons，公有领域；馆藏资料：大英博物馆。', 'Photo: Szilas / Wikimedia Commons, public domain. Object data: British Museum.'),
  'nelson-guanyin': openPhoto('nelson-guanyin-open.jpg', 'https://commons.wikimedia.org/wiki/File:Guanyin_of_the_southern_sea_(8425213585).jpg', '摄影：Dean Hochman / Wikimedia Commons，CC BY 2.0；馆藏资料：纳尔逊—阿特金斯艺术博物馆。', 'Photo: Dean Hochman / Wikimedia Commons, CC BY 2.0. Object data: Nelson-Atkins Museum of Art.'),
  'empress-procession': openPhoto('nelson-empress-open.jpg', 'https://commons.wikimedia.org/wiki/File:Procession_of_the_Empress_as_Donor_with_Her_Court,_Chinese,_from_the_Binyang_Cave,_Longmen,_Henan_Province,_Norther_Wei_Dynasty,_about_522_-_Nelson-Atkins_Museum_of_Art_-_DSC09118.JPG', '摄影：Daderot / Wikimedia Commons，CC0；馆藏资料：纳尔逊—阿特金斯艺术博物馆。', 'Photo: Daderot / Wikimedia Commons, CC0. Object data: Nelson-Atkins Museum of Art.'),
  'saluzi': openPhoto('penn-saluzi-open.jpg', 'https://commons.wikimedia.org/wiki/File:Emperor_Taizong_Horse_Relief_Saluzi.jpg', '摄影：SnowFire / Wikimedia Commons，CC BY 4.0；网页尺寸缩放，馆藏资料：宾大博物馆。', 'Photo: SnowFire / Wikimedia Commons, CC BY 4.0; resized for web. Object data: Penn Museum.'),
  'quanmaogua': openPhoto('penn-quanmaogua-open.jpg', 'https://commons.wikimedia.org/wiki/File:Emperor_Taizong_Horse_Relief_Quanmaogua.jpg', '摄影：SnowFire / Wikimedia Commons，CC BY 4.0；网页尺寸缩放，馆藏资料：宾大博物馆。', 'Photo: SnowFire / Wikimedia Commons, CC BY 4.0; resized for web. Object data: Penn Museum.'),
  'bronze-rhino': openPhoto('aam-rhino-open.jpg', 'https://commons.wikimedia.org/wiki/File:Bronze_Rhino_(8216203650).jpg', '摄影：Ed Bierman / Wikimedia Commons，CC BY 2.0；网页尺寸缩放，馆藏资料：旧金山亚洲艺术博物馆。', 'Photo: Ed Bierman / Wikimedia Commons, CC BY 2.0; resized for web. Object data: Asian Art Museum.'),
  'luo-nymph': openPhoto('freer-luo-nymph-open.jpg', 'https://commons.wikimedia.org/wiki/File:Gu_Kaizhi_river_Lo.jpg', '图：Wikimedia Commons，PD-Art / 公有领域标记；藏品资料：美国国立亚洲艺术博物馆。', 'Image: Wikimedia Commons, PD-Art / public-domain mark. Object data: National Museum of Asian Art.', { imageCaptionZh: '《洛神赋图》卷局部，非全卷。', imageCaptionEn: 'Detail of the Nymph of the Luo River scroll, not the complete work.' }),
  'hibiscus': openPhoto('tnm-hibiscus-open.jpg', 'https://commons.wikimedia.org/wiki/File:Li_Di_-_Red_and_White_Cotton_Roses_-_Google_Art_Project.jpg', '图：Google Art Project / Wikimedia Commons，PD-Art / 公有领域标记；藏品资料：东京国立博物馆。', 'Image: Google Art Project / Wikimedia Commons, PD-Art / public-domain mark. Object data: Tokyo National Museum.'),
  'pig-dragon': openPhoto('guimet-pig-dragon-open.jpg', 'https://commons.wikimedia.org/wiki/File:Cultura_di_hongshan_(neolitico),_oggetto_rituale_zhulong_(dragone-maiale)_in_nefrite,_da_lianing,_3500_ac._ca.JPG', '摄影：Sailko / Wikimedia Commons，CC BY-SA 3.0；网页尺寸缩放，馆藏资料：吉美博物馆。', 'Photo: Sailko / Wikimedia Commons, CC BY-SA 3.0; resized for web. Object data: Musée Guimet.'),
  'polo-player': openPhoto('guimet-polo-open.jpg', 'https://commons.wikimedia.org/wiki/File:Joueuse_de_polo_MA_6118.jpg', '摄影：Caroline Léna Becker / Wikimedia Commons，CC BY 4.0；网页尺寸缩放，馆藏资料：吉美博物馆。', 'Photo: Caroline Léna Becker / Wikimedia Commons, CC BY 4.0; resized for web. Object data: Musée Guimet.'),
  'maitreya-paradise': openPhoto('rom-maitreya-open.jpg', 'https://commons.wikimedia.org/wiki/File:The_Paradise_of_Maitreya,_painted_by_Zhu_Haogu_and_Zhang_Boyuan,_Xinghua_Monastery,_Shanxi_Province,_China,_Yuan_Dynasty,_1298,_ink_and_color_on_clay_-_Royal_Ontario_Museum_-_DSC09829.JPG', '摄影：Daderot / Wikimedia Commons，CC0；馆藏资料：皇家安大略博物馆。', 'Photo: Daderot / Wikimedia Commons, CC0. Object data: Royal Ontario Museum.'),
  'rom-homage-east': openPhoto('rom-homage-east-open.jpg', 'https://commons.wikimedia.org/wiki/File:Homage_to_the_Highest_Power,_probably_Longmen_Monastery,_Shanxi_Province,_China,_Yuan_Dynasty,_c._1300_-_Royal_Ontario_Museum_-_DSC09823.JPG', '摄影：Daderot / Wikimedia Commons，CC0；馆藏资料：皇家安大略博物馆。', 'Photo: Daderot / Wikimedia Commons, CC0. Object data: Royal Ontario Museum.', { imageCaptionZh: '《朝元图》东壁中央局部，非整幅壁画。', imageCaptionEn: 'Central detail of the east-wall mural, not the entire wall.' }),
}
const openPhotoLicenses = {
  'yixian-bm': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'nelson-guanyin': 'https://creativecommons.org/licenses/by/2.0/',
  'empress-procession': 'https://creativecommons.org/publicdomain/zero/1.0/',
  'saluzi': 'https://creativecommons.org/licenses/by/4.0/',
  'quanmaogua': 'https://creativecommons.org/licenses/by/4.0/',
  'bronze-rhino': 'https://creativecommons.org/licenses/by/2.0/',
  'pig-dragon': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'polo-player': 'https://creativecommons.org/licenses/by/4.0/',
  'maitreya-paradise': 'https://creativecommons.org/publicdomain/zero/1.0/',
  'rom-homage-east': 'https://creativecommons.org/publicdomain/zero/1.0/',
}
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
  'luo-nymph': { source: 'https://asia.si.edu/object/F1914.53/' },
}
export const relics = [...originals,...expandedRelics,...supplementalRelics].map(r => ({ ...r,
  originPrecision: r.originPrecision ?? (precise.has(r.id) ? 'site' : regional.has(r.id) ? 'region' : inferred.has(r.id) ? 'inferred' : 'unknown'),
  // A representative point is never presented as a known findspot.
  homePoint: r.homePoint !== undefined ? r.homePoint : precise.has(r.id) || regional.has(r.id) ? [r.originLat, r.originLng] : null,
  ...corrections[r.id],
  ...verifiedOpenPhotos[r.id],
  ...(openPhotoLicenses[r.id] ? { imageLicense: openPhotoLicenses[r.id] } : {}),
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
