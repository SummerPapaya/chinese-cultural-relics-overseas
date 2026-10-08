// Each entry states a documented event, not a guessed departure date for an object.
// Source links were checked against institutional catalogue and research pages.
export const timeline = [
  {
    year: '1860', kind: 'context',
    titleZh: '圆明园遭毁，宫廷珍藏流入海外市场', titleEn: 'The destruction of Yuanmingyuan',
    placeZh: '北京 · 圆明园', placeEn: 'Beijing · Yuanmingyuan',
    bodyZh: '英法联军占领北京期间，圆明园于1860年被焚毁。大都会艺术博物馆的收藏史指出，部分清代玉器在此后进入国际艺术市场。这是文物流散的一条历史线索，不意味着所有海外中国文物都来自圆明园。',
    bodyEn: 'Yuanmingyuan was burned during the Anglo-French campaign of 1860. The Met records that some Qing jades entered the art market after its destruction. This is one documented route of dispersal, not an origin story for every Chinese object abroad.',
    sources: [
      { label: 'British Museum · China’s hidden century', url: 'https://www.britishmuseum.org/sites/default/files/2023-09/Chinas_hidden_century_large_print_guide.pdf' },
      { label: 'The Met · Asian Art at the Met', url: 'https://resources.metmuseum.org/resources/metpublications/pdf/Asian_Art_at_the_Metropolitan_Bulletin_v_73_no_1.pdf' },
    ],
  },
  {
    year: '1907', kind: 'context',
    titleZh: '斯坦因从敦煌藏经洞取得文献与绘画', titleEn: 'Stein acquires material from Cave 17',
    placeZh: '甘肃敦煌 · 莫高窟第17窟', placeEn: 'Dunhuang, Gansu · Mogao Cave 17',
    bodyZh: '斯坦因于1907年到达敦煌，并从藏经洞取得大批文献、绘画等材料。大英博物馆说明，相关收藏其后运往伦敦，并在多家机构间分置；国际敦煌项目记述了当年的交易。',
    bodyEn: 'Stein reached Dunhuang in 1907 and acquired manuscripts, paintings and other materials from Cave 17. The British Museum traces their shipment to London and division among institutions; the International Dunhuang Programme documents the transaction.',
    sources: [
      { label: 'British Museum · The Stein Collection', url: 'https://www.britishmuseum.org/collection/china/exploring-silk-roads' },
      { label: 'International Dunhuang Programme · Cave 17', url: 'https://idp.bl.uk/discover/learning/dunhuang/dunhuang-articles/cave-17-the-library-cave/discovering-cave-17/' },
    ],
  },
  {
    year: '1908', kind: 'context',
    titleZh: '伯希和在敦煌选购藏经洞文献', titleEn: 'Pelliot selects manuscripts at Dunhuang',
    placeZh: '甘肃敦煌 → 法国巴黎', placeEn: 'Dunhuang, Gansu → Paris',
    bodyZh: '伯希和于1908年在藏经洞选购手稿及其他材料。法国国家图书馆记载，文献于1909年底抵达巴黎；绘画及织物后来归吉美国立亚洲艺术博物馆收藏。这里将1908年标为选购年份，而非全部材料抵法年份。',
    bodyEn: 'Pelliot selected manuscripts and other material from Cave 17 in 1908. The BnF states that the documents arrived in Paris at the end of 1909; paintings and textiles are now held by the Musée Guimet. The date here marks selection, not arrival in France.',
    sources: [
      { label: 'BnF · Paul Pelliot et Dunhuang', url: 'https://heritage.bnf.fr/france-chine/paul-pelliot-1878-1945-et-dunhuang' },
      { label: 'International Dunhuang Programme · BnF collection', url: 'https://idp.bl.uk/discover/collection-categories/the-bibliotheque-nationale-de-france-bnf-collection/' },
    ],
  },
  {
    year: '1913', kind: 'object',
    titleZh: '大英博物馆购入一尊易县罗汉', titleEn: 'A Yixian luohan enters the British Museum',
    placeZh: '河北易县（传出） → 英国伦敦', placeEn: 'Yixian, Hebei (reported) → London',
    bodyZh: '大英博物馆藏品记录将罗汉像的入藏年份写为1913年，售方为 S. M. Franck & Son，并注明得到 Art Fund 资助；资助方的档案也记录了1913年的支持。易县洞窟为馆方所载来源，具体出土经过仍应审慎看待。',
    bodyEn: 'The British Museum records the luohan’s purchase in 1913 from S. M. Franck & Son with Art Fund support. The Art Fund archive independently records its 1913 grant. The museum attributes the sculpture to the Yixian caves; its earlier path is less certain.',
    sources: [
      { label: 'British Museum · 1913,1221.1', url: 'https://www.britishmuseum.org/collection/object/A_1913-1221-1' },
      { label: 'Art Fund · Seated Luohan', url: 'https://www.artfund.org/our-purpose/art-funded-by-you/seated-luohan-disciple-of-buddha' },
    ],
  },
  {
    year: '1914', kind: 'object',
    titleZh: '另一尊易县罗汉入藏宾大博物馆', titleEn: 'A Yixian luohan enters the Penn Museum',
    placeZh: '河北易县（馆方记载来源）→ 美国费城', placeEn: 'Yixian, Hebei (museum attribution) → Philadelphia',
    bodyZh: '宾大博物馆将馆藏罗汉像 C66A 的购藏年记为1914年，售方为巴黎古董商 Edgar Worch。馆方研究进一步记述，雕像于1913年离开中国，博物馆于1914年6月购入；这两年分别指离境与入藏。易县洞窟的早期经过仍存研究争议。',
    bodyEn: 'Penn Museum records its luohan C66A as purchased from the Paris dealer Edgar Worch in 1914. Its research places the sculpture’s departure from China in 1913 and the museum’s purchase in June 1914. These are different events; the earlier cave history remains uncertain.',
    sources: [
      { label: 'Penn Museum · C66A', url: 'https://www.penn.museum/collections/object/151869' },
      { label: 'Penn Museum · The Luohan that Came from Afar', url: 'https://www.penn.museum/sites/expedition/the-luohan-that-came-from-afar/' },
    ],
  },
  {
    year: '1920', kind: 'object',
    titleZh: '“昭陵六骏”中的两件入藏宾大博物馆', titleEn: 'Two Zhaoling horse reliefs enter the Penn Museum',
    placeZh: '陕西昭陵 → 美国费城', placeEn: 'Zhaoling, Shaanxi → Philadelphia',
    bodyZh: '宾夕法尼亚大学博物馆的两件藏品记录均写明：飒露紫与拳毛騧于1920年从古董商卢芹斋处购得。馆方研究指出，六件石刻在20世纪初被移离昭陵；其离开原址的确切年份不等同于1920年入藏年份。',
    bodyEn: 'Penn Museum records list both Saluzi and Quanmaogua as purchased from C. T. Loo in 1920. Museum research places the removal of the six reliefs from Zhaoling in the early twentieth century; the exact removal date is not asserted to be 1920.',
    sources: [
      { label: 'Penn Museum · C395 Saluzi', url: 'https://www.penn.museum/collections/object/167942' },
      { label: 'Penn Museum · C396 Quanmaogua', url: 'https://www.penn.museum/collections/object/239945' },
      { label: 'Penn Museum · Zhaoling excavations', url: 'https://www.penn.museum/sites/expedition/excavations-at-zhaoling-shaanxi-china/' },
    ],
  },
  {
    year: '1920', kind: 'object',
    titleZh: '大都会艺术博物馆购入一尊易县罗汉', titleEn: 'A Yixian luohan enters The Met',
    placeZh: '河北易县（相关罗汉群）→ 美国纽约', placeEn: 'Yixian, Hebei (associated group) → New York',
    bodyZh: '大都会馆藏三彩罗汉像编号 20.114，馆方将其购藏列为 Fletcher Fund，1920 年。宾大博物馆的研究将大都会罗汉与易县罗汉群并论。1920 年是大都会的入藏年份，并非可据此确定的离开原址之年。',
    bodyEn: 'The Met lists its three-color-glazed arhat as object 20.114, acquired through the Fletcher Fund in 1920. Penn Museum research discusses The Met’s sculpture among the Yixian luohan group. The year dates accession at The Met, not a verified removal from its original site.',
    sources: [
      { label: 'The Met · Arhat 20.114', url: 'https://www.metmuseum.org/art/collection/search/42722' },
      { label: 'Penn Museum · The Luohan that Came from Afar', url: 'https://www.penn.museum/sites/expedition/the-luohan-that-came-from-afar/' },
    ],
  },
  {
    year: '1927', kind: 'object',
    titleZh: '广胜寺下寺壁画的出售见于碑记', titleEn: 'A stele records the sale of Guangsheng murals',
    placeZh: '山西洪洞 · 广胜寺下寺', placeEn: 'Lower Guangsheng Monastery · Hongtong, Shanxi',
    bodyZh: '纳尔逊—阿特金斯的来源研究引述寺内一方 1929 年碑记：住持为修缮建筑，于 1927 年出售寺内壁画。大都会艺术博物馆的壁画研究亦记载这一碑文。碑记对应的是售画缘由与年份；《炽盛光佛佛会图》1932 年入藏堪萨斯城、《药师经变》1965 年入藏纽约，应分别看待。',
    bodyEn: 'The Nelson-Atkins cites a 1929 stele recording the abbot’s sale of monastery murals in 1927 to fund repairs. The Met also discusses this inscription. It documents a sale at the monastery, not the later accession dates: 1932 in Kansas City for The Assembly of Tejaprabha and 1965 in New York for the Medicine Buddha mural.',
    sources: [
      { label: 'Nelson-Atkins · Assembly provenance', url: 'https://art.nelson-atkins.org/objects/14590/the-assembly-of-tejaprabha' },
      { label: 'The Met · Buddha of Medicine conservation', url: 'https://www.metmuseum.org/essays/in-gallery-conservation-buddha-of-medicine' },
    ],
  },
  {
    year: '1932', kind: 'object',
    titleZh: '广胜寺《炽盛光佛佛会图》入藏纳尔逊—阿特金斯', titleEn: 'A Guangsheng Monastery mural reaches Kansas City',
    placeZh: '山西广胜寺下寺 → 美国堪萨斯城', placeEn: 'Lower Guangsheng Monastery, Shanxi → Kansas City',
    bodyZh: '纳尔逊—阿特金斯艺术博物馆记录，原位于广胜寺下寺大殿西壁的《炽盛光佛佛会图》于1932年从卢芹斋处购入。大都会艺术博物馆的壁画研究也记录了这一入藏年份，并将其与现藏大都会的对壁壁画并置讨论。',
    bodyEn: 'The Nelson-Atkins records its purchase of The Assembly of Tejaprabha from C. T. Loo in 1932. The Met’s research independently dates its entry to the Kansas City museum and studies it alongside the facing Guangsheng mural now at The Met.',
    sources: [
      { label: 'Nelson-Atkins · The Assembly of Tejaprabha', url: 'https://art.nelson-atkins.org/objects/14590/the-assembly-of-tejaprabha' },
      { label: 'The Met · Yuan Buddhist Mural study', url: 'https://resources.metmuseum.org/resources/metpublications/pdf/Yuan_Buddhist_Mural_of_the_Paradise_of_Bhaisajyguru_The_Metropolitan_Museum_Journal_v_26_1991.pdf' },
    ],
  },
  {
    year: '1934', kind: 'object',
    titleZh: '纳尔逊—阿特金斯购入一尊易县罗汉', titleEn: 'A Yixian luohan enters the Nelson-Atkins',
    placeZh: '河北易县（馆方归属）→ 法国巴黎 → 美国堪萨斯城', placeEn: 'Yixian, Hebei (museum attribution) → Paris → Kansas City',
    bodyZh: '纳尔逊—阿特金斯的藏品记录标明，这尊罗汉像编号 34-6，于 1933 年至 1934 年间经卢芹斋巴黎公司，并于 1934 年由馆方购入。宾大博物馆的研究将纳尔逊藏像列为相关罗汉群成员；可确认的是经手与购藏记录，不能由此倒推离开易县的年份。',
    bodyEn: 'The Nelson-Atkins records luohan 34-6 with C. T. Loo & Co. in Paris by 1933–34 and purchased by the museum in 1934. Penn Museum research includes its sculpture in the associated luohan group. These records establish dealership and purchase, not the year it left Yixian.',
    sources: [
      { label: 'Nelson-Atkins · Luohan 34-6', url: 'https://art.nelson-atkins.org/objects/15683/luohan' },
      { label: 'Penn Museum · The Luohan that Came from Afar', url: 'https://www.penn.museum/sites/expedition/the-luohan-that-came-from-afar/' },
    ],
  },
  {
    year: '1935', kind: 'object',
    titleZh: '龙门石窟《孝文帝礼佛图》入藏大都会', titleEn: 'Longmen’s Emperor Xiaowen procession enters The Met',
    placeZh: '河南龙门宾阳中洞 → 美国纽约', placeEn: 'Central Binyang Cave, Longmen → New York',
    bodyZh: '大都会艺术博物馆记录《孝文帝礼佛图》藏品号为 35.146，购藏年为 1935 年；原位于龙门宾阳中洞，并与现藏纳尔逊—阿特金斯的《皇后礼佛图》相对。芝加哥大学龙门数字档案同样追溯这组浮雕的原位及遭毁损经过。1935 年不应被误作浮雕从石窟剥离之年。',
    bodyEn: 'The Met records Emperor Xiaowen and his entourage as object 35.146, acquired in 1935. It once faced the Empress procession in Longmen’s Central Binyang Cave. The University of Chicago’s Longmen archive also documents the reliefs’ original setting and damage. Accession in 1935 is not a documented date of removal from the cave.',
    sources: [
      { label: 'The Met · Emperor Xiaowen 35.146', url: 'https://www.metmuseum.org/art/collection/search/42707' },
      { label: 'University of Chicago · Longmen reliefs', url: 'https://caea.lib.uchicago.edu/dcadp/en/longmenbcc/reliefs/' },
    ],
  },
  {
    year: '1940', kind: 'object',
    titleZh: '龙门《皇后礼佛图》残片进入堪萨斯城', titleEn: 'Longmen’s Empress procession enters Kansas City',
    placeZh: '河南龙门宾阳中洞 → 美国堪萨斯城', placeEn: 'Longmen, Henan → Kansas City',
    bodyZh: '纳尔逊—阿特金斯的来源记录写明，馆方于1940年在中国艺术市场购入《皇后礼佛图》残片。芝加哥大学的龙门数字档案记载，馆方购得大量残片，并于1941年展示重组后的作品。1940年是馆方记录的购藏年，不是浮雕遭破坏的年份。',
    bodyEn: 'The Nelson-Atkins provenance record dates its purchase of Empress procession fragments to 1940. The University of Chicago’s Longmen archive confirms that the museum acquired many fragments and unveiled the reconstructed relief in 1941. The purchase year is distinct from the date of damage at the cave.',
    sources: [
      { label: 'Nelson-Atkins · Empress procession provenance', url: 'https://art.nelson-atkins.org/objects/8976/offering-procession-of-the-empress-as-donor-with-her-cour' },
      { label: 'University of Chicago · Destruction of Reliefs', url: 'https://caea.lib.uchicago.edu/dcadp/en/longmenbcc/reliefs/' },
    ],
  },
  {
    year: '1965', kind: 'object',
    titleZh: '广胜寺《药师经变》以赠礼形式入藏大都会', titleEn: 'The Guangsheng Medicine Buddha mural enters The Met',
    placeZh: '山西广胜寺下寺 → 美国纽约', placeEn: 'Lower Guangsheng Monastery, Shanxi → New York',
    bodyZh: '大都会艺术博物馆的藏品记录列明，《药师经变》由阿瑟·萨克勒于1965年捐赠，藏品号为65.29.2。馆方研究说明，这幅壁画原属广胜寺下寺大殿，并与1932年入藏堪萨斯城的壁画相对。1965年是入藏大都会的年份。',
    bodyEn: 'The Met records Arthur M. Sackler’s 1965 gift of the Medicine Buddha mural (65.29.2). Museum research identifies its original setting in the main hall of Lower Guangsheng Monastery, opposite the mural acquired by the Nelson-Atkins in 1932. The date marks its accession at The Met.',
    sources: [
      { label: 'The Met · 65.29.2', url: 'https://www.metmuseum.org/zh/art/collection/search/42716' },
      { label: 'The Met · Yuan Buddhist Mural study', url: 'https://resources.metmuseum.org/resources/metpublications/pdf/Yuan_Buddhist_Mural_of_the_Paradise_of_Bhaisajyguru_The_Metropolitan_Museum_Journal_v_26_1991.pdf' },
    ],
  },
]
