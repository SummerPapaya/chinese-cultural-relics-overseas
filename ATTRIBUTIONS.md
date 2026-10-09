# 图像与数据署名

本项目代码与界面不改变各图像的原有版权状态。正式公开或商业使用前请再次查看链接页面的最新条款。

**公开图片选择。** 原先 14 条图片占位记录已逐件匹配 Wikimedia Commons 文件页，改用下列开放授权或公有领域图像；公开构建与本地预览均显示这些替代图。六张项目作者自摄照片、八张旧版待清权继承图、两张已停用的旧照与来源未补齐的 `earth-ink.jpg` 仍由 `.gitignore` 排除，也不进入构建。还有波士顿罗汉和 V&A 宜兴茶壶两条记录无合适替代图，继续显示占位。Commons 的摄影者授权并不等于场馆就拍摄或发布另行作出的许可；如有具体场馆限制，应按个案处理。

- 大都会艺术博物馆：孝文帝礼佛图、药师佛壁画、易县罗汉、水月观音；馆方 Open Access，Public Domain。
- 大英博物馆：易县罗汉、《女史箴图》、大维德花瓶；数据来自馆方，当前展示图来自 Wikimedia Commons。馆方易县罗汉下载页标注 CC BY-NC-SA 4.0。
- 纳尔逊—阿特金斯艺术博物馆：南海观音与皇后礼佛图使用逐件核验的 Commons 摄影图，不公开本站作者自摄照。
- 宾夕法尼亚大学博物馆：飒露紫 C395、拳毛騧 C396 使用 SnowFire 的 CC BY 4.0 Commons 摄影图，不公开本站作者自摄照。
- 旧金山亚洲艺术博物馆：犀牛形青铜尊使用 Ed Bierman 的 CC BY 2.0 摄影图。
- 波士顿美术博物馆：陈容《九龙图》；Wikimedia Commons，Public Domain。
- 美国国立亚洲艺术博物馆：《洛神赋图》；Wikimedia Commons，Public Domain。
- 东京国立博物馆：李迪《红白芙蓉图》；Google Art Project / Wikimedia Commons。
- 吉美博物馆：玉猪龙、彩绘陶打马球女俑使用逐件对应的 Commons 摄影图，不使用旧馆方署名照。
- 皇家安大略博物馆：《弥勒净土变》与《朝元图》东壁使用 Daderot 的 CC0 摄影图，不公开本站作者自摄照。
- 芝加哥艺术博物馆：唐代佛立像；馆方 IIIF / Open Access，数据 CC0。
- 克利夫兰艺术博物馆：牧溪《龙图》；馆方 Open Access。

馆方原始记录 URL、馆藏号、逐件中英文署名位于 `src/data.js`、`src/museum/expanded-data.js` 和 `src/museum/supplemental-data.js`。

## 项目作者实拍照片 · Own museum photographs

- `public/art/nelson-guanyin.jpg`：南海观音，纳尔逊—阿特金斯艺术博物馆，馆藏号 34-10；[馆藏记录](https://art.nelson-atkins.org/objects/597/guanyin-of-the-southern-sea)。
- `public/art/nelson-empress-own.jpg`：皇后礼佛图，纳尔逊—阿特金斯艺术博物馆，馆藏号 40-38；[馆藏记录](https://art.nelson-atkins.org/objects/8976/offering-procession-of-the-empress-as-donor-with-her-court)。
- `public/art/rom-maitreya-own.jpg`：兴化寺《弥勒净土变》，皇家安大略博物馆，馆藏号 933.6.1；[馆方展厅说明](https://www.rom.on.ca/whats-on/galleries/bishop-white-gallery-chinese-temple-art)。
- `public/art/rom-homage-east-own.jpg`：《朝元图》东壁中央局部，皇家安大略博物馆，馆藏号 933.6.3；[馆方藏品记录](https://collections.rom.on.ca/objects/304291/daoist-wall-painting-homage-to-the-highest-power-east-wal)。
- `public/art/penn-saluzi.jpg`：飒露紫，宾夕法尼亚大学博物馆，馆藏号 C395；[馆藏记录](https://collections.penn.museum/collections/object/167942)。
- `public/art/penn-quanmaogua.jpg`：拳毛騧，宾夕法尼亚大学博物馆，馆藏号 C396；[馆藏记录](https://collections.penn.museum/collections/object/239945)。

六张照片由项目作者作为普通游客自行拍摄，仅在本地保留去除 EXIF（含 GPS、设备、拍摄时间）的副本；目前网页已改用下列 Commons 替代图，**本地预览也不调用自摄照**。原件不在本项目或候选发布包内。六个副本路径已加入本仓库的 `.gitignore`，不应提交到 GitHub；构建脚本还会从 `dist/` 移除这些路径。**Git 忽略不等于网页防下载**：若将来决定展示自摄照，访客仍能保存网页取得的版本。照片不属于 CC0、CC BY 或项目代码的 PolyForm Noncommercial 许可，第三方复用须另获摄影者许可。

本站为非商业科普项目；宾大两张为无禁拍标识区域的游客拍摄，不售卖影像。[宾大拍摄规则](https://www.penn.museum/about-collections/rights-and-permissions)未对这类照片提出网页展示的明确预先申请要求；[馆方可下载图片的条款](https://www.penn.museum/about/statements-and-policies/terms-and-conditions)只适用于馆方提供的图片，不自动覆盖自摄照片。纳尔逊两张照片也不是商业或专业摄影；[摄影规则](https://nelson-atkins.org/visit/guidelines-and-policies/)允许一般游客拍照，但未明确说明公开作品集展示。皇家安大略博物馆[访客摄影规则](https://www.rom.on.ca/visit/visitor-information)写明普通馆内摄影限个人用途；线上展示不应据此擅自推定获准。因此六张自摄照仍不公开。如未来无可用替代图，须先逐馆复核展示条件，再考虑发布去除敏感信息的自摄版本；馆方拍摄规则与摄影者的著作权是不同问题。

## 第一阶段与皇家安大略壁画的开放替代图 · Verified open replacements

以下 14 张均在 `src/museum/catalog.js` 中逐件标注文件页和许可；馆藏身份另由各件 `source` 的馆方目录核对。站点分发的是网页尺寸 JPEG，已移除下载件的 EXIF/其他元数据；CC BY/CC BY-SA 的缩放与元数据处理在展品署名中说明或由本段统一说明。摄影者许可只覆盖相应照片；馆方资料、场地政策与摄影者许可是不同层面的权利。

- 大英易县罗汉 1913,1221.1：[Midnightblueowl / Commons](https://commons.wikimedia.org/wiki/File:Luohan_at_British_Museum.JPG)，[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)；`bm-luohan-open.jpg`。
- 《女史箴图》局部：[Commons Scene 10](https://commons.wikimedia.org/wiki/File:Admonitions_Scroll_Scene_10.jpg)，Public Domain Mark；`bm-admonitions-open.jpg`。
- 大维德花瓶 PDF,B.613–614：[Szilas / Commons](https://commons.wikimedia.org/wiki/File:The_David_Vases.jpg)，摄影者声明公有领域；`bm-david-vases-open.jpg`。
- 南海观音 34-10：[Dean Hochman / Commons](https://commons.wikimedia.org/wiki/File:Guanyin_of_the_southern_sea_(8425213585).jpg)，[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)；`nelson-guanyin-open.jpg`。
- 皇后礼佛图 40-38：[Daderot / Commons](https://commons.wikimedia.org/wiki/File:Procession_of_the_Empress_as_Donor_with_Her_Court,_Chinese,_from_the_Binyang_Cave,_Longmen,_Henan_Province,_Norther_Wei_Dynasty,_about_522_-_Nelson-Atkins_Museum_of_Art_-_DSC09118.JPG)，CC0；`nelson-empress-open.jpg`。
- 飒露紫 C395：[SnowFire / Commons](https://commons.wikimedia.org/wiki/File:Emperor_Taizong_Horse_Relief_Saluzi.jpg)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；`penn-saluzi-open.jpg`。
- 拳毛騧 C396：[SnowFire / Commons](https://commons.wikimedia.org/wiki/File:Emperor_Taizong_Horse_Relief_Quanmaogua.jpg)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；`penn-quanmaogua-open.jpg`。
- 犀牛形青铜尊 B60B1+：[Ed Bierman / Commons](https://commons.wikimedia.org/wiki/File:Bronze_Rhino_(8216203650).jpg)，[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)；`aam-rhino-open.jpg`。
- 《洛神赋图》局部 F1914.53：[Commons](https://commons.wikimedia.org/wiki/File:Gu_Kaizhi_river_Lo.jpg)，PD-Art / Public Domain Mark；`freer-luo-nymph-open.jpg`。
- 李迪《红白芙蓉图》之一 TA-137：[Google Art Project / Commons](https://commons.wikimedia.org/wiki/File:Li_Di_-_Red_and_White_Cotton_Roses_-_Google_Art_Project.jpg)，PD-Art / Public Domain Mark；`tnm-hibiscus-open.jpg`。
- 玉猪龙 MG18396：[Sailko / Commons](https://commons.wikimedia.org/wiki/File:Cultura_di_hongshan_(neolitico),_oggetto_rituale_zhulong_(dragone-maiale)_in_nefrite,_da_lianing,_3500_ac._ca.JPG)，[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)；`guimet-pig-dragon-open.jpg`。
- 打马球女俑 MA 6118：[Caroline Léna Becker / Commons](https://commons.wikimedia.org/wiki/File:Joueuse_de_polo_MA_6118.jpg)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；`guimet-polo-open.jpg`。
- 《弥勒净土变》933.6.1：[Daderot / Commons](https://commons.wikimedia.org/wiki/File:The_Paradise_of_Maitreya,_painted_by_Zhu_Haogu_and_Zhang_Boyuan,_Xinghua_Monastery,_Shanxi_Province,_China,_Yuan_Dynasty,_1298,_ink_and_color_on_clay_-_Royal_Ontario_Museum_-_DSC09829.JPG)，CC0；`rom-maitreya-open.jpg`。
- 《朝元图》东壁 933.6.3：[Daderot / Commons](https://commons.wikimedia.org/wiki/File:Homage_to_the_Highest_Power,_probably_Longmen_Monastery,_Shanxi_Province,_China,_Yuan_Dynasty,_c._1300_-_Royal_Ontario_Museum_-_DSC09823.JPG)，CC0；`rom-homage-east-open.jpg`。

## 第二阶段新增 30 条的照片

- 大都会艺术博物馆新增 24 件：`public/art/met-*.jpg` 均经馆方 [Open Access API](https://metmuseum.github.io/) 逐件核实 `isPublicDomain: true`，馆方原页与图像来源见 `src/museum/expanded-data.js`。大都会明确允许公有领域图像用于商业和非商业用途。
- 易县罗汉 C66A：摄影 [Patrick20242023](https://commons.wikimedia.org/wiki/File:宾夕法尼亚大学考古学与人类学博物馆易县辽代三彩罗汉.jpg)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；图片为馆内实物照片，并非宾大馆方授权图。
- 易县罗汉 34-6：摄影 [ArtHistVista](https://commons.wikimedia.org/wiki/File:Nelson-Atkins_Luohan_34-6.jpg)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；图片为馆内实物照片，并非纳尔逊馆方授权图。
- 广胜下寺《炽盛光佛会图》32-91/1：[Google Art Project / Commons 文件页](https://commons.wikimedia.org/wiki/File:The_Assembly_of_Tejaprabha_-_Google_Art_Project.jpg)标为 PD-Art / Public Domain Mark。二维古画忠实翻拍的权利判断可能随司法辖区而异，正式发布前仍需按目标地区复核。
- 宾大广胜寺《药师佛图》C688：摄影 [Mary Harrsch](https://commons.wikimedia.org/wiki/File:Bhaisajyaguru_and_Assembly_tempera_painting_on_mud_mixed_with_seeds,_straw,_and_leaves_Ming_Dynasty,_1368-1644_CE_Shanxi_Province_China.jpg)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。
- 宾大广胜寺《炽盛光佛图》C492：摄影 [Mary Harrsch](https://commons.wikimedia.org/wiki/File:Tejaprabha_and_Assembly_Tempera_on_mud_mixed_with_seeds,_straw_and_leaves,_1475_CE_Ming_Dynasty_Shanxi_Province,_Zhaocheng_Guangsheng_Monastery_China_02.jpg)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；站内使用的是局部视角。
- 克利夫兰水月观音 1984.7：[馆方 / Commons 文件页](https://commons.wikimedia.org/wiki/File:Clevelandart_1984.7.jpg)，[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。

以上 CC BY / CC BY-SA 照片在作品详情同时标明摄影者、Commons 文件页及许可。若进一步裁切、调色或改作 CC BY-SA 图片，应按相同许可处理改作版本，并注明改动。第一阶段被排除的吉美馆方署名照及 Smithsonian `Usage Conditions Apply` 图已由本页列出的开放替代图取代，仍不随公开构建分发。

## 第三阶段新增 6 条的图像处理

- 皇家安大略罗汉 914.4.1：摄影 [Daderot / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Luohan_(arhat),_Yixian_cave,_Hebei_Province,_China,_Liao_Dynasty,_11th_century_-_Royal_Ontario_Museum_-_DSC09807.JPG)，[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)；未复制 ROM 授权受限的馆方图。
- 大英博物馆《药师佛净土变》1919,0101,0.36：[Commons 文件页](https://commons.wikimedia.org/wiki/File:Anonymous-Paradise_of_Bhaishajyaguru.jpg)标注 PD-Art / Public Domain Mark。
- 大英博物馆《炽盛光佛与五星图》1919,0101,0.31：[Commons 文件页](https://commons.wikimedia.org/wiki/File:Tejaprabh%C4%81_Buddha_and_the_Five_Planets_by_Chang_Huai-hsing.jpg)标注 PD-Art / Public Domain Mark。二维古画忠实翻拍的使用规则可能随司法辖区而异，正式发布前仍需复核。
- V&A 乾隆雕漆御座 W.399:1, 2-1922：摄影 [Sourabh.biswas003 / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:PXL_20231218_155438181.MP_Victoria_and_Albert_Museum_Artefacts_09_extremely_rare_Chinese_imperial_%22Nine_Dragon%22_lacquer_throne_d_(1736-1795)_of_the_Qing_dynasty.jpg)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；不是 V&A 官网照片的许可。
- 波士顿美术博物馆罗汉 15.255 与 V&A 宜兴茶壶 C.871&A-1936：目前无能够同时核对馆藏对应关系和再分发权利的图片，站内仅展示许可说明占位并链接到馆方页面。芝加哥大学的相关 3D 模型标注“仅限非商业研究/教育使用”，未下载或复制。

地图与界面素材：

- 《坤舆万国图》现代海岸线与国界底图：Natural Earth `ne_50m_admin_0_countries`，Public Domain。
- 回乡路线水墨燕子：依据用户提供的水墨燕子风格参考，通过内置图像生成工具制作；项目使用优化文件 `public/generated/ink-swallow-v1-web.png`。
- 落地页与沉浸式展厅的三维青绿山水：本项目使用 Three.js 程序化生成的原创峰石、洲渚、松林、亭桥与水面，参考用户提供的《千里江山图》局部及[故宫博物院画卷阅览页](https://www.dpm.org.cn/dyx.html?path=/Uploads/tilegenerator/dest/files/image/8831/2017/7109/img0003.xml)的构图与青绿设色。它是风格化意境演绎，不是原画扫描图或考据式数字复原；场景不嵌入、下载或再分发馆方图像。
- “流散之年”背景：项目原创平面 SVG 淡墨山水（`public/generated/timeline-ink-landscape.svg`），不含外部位图、字体或追踪请求。
