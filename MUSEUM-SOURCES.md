# 新版预览图像及资料补充

> 公开 GitHub 候选包为清权版本：三张项目作者实拍、十张仍待精确核实再分发权利的继承馆藏照，以及来源未补齐的 `earth-ink.jpg` 均已加入 `.gitignore`，不随仓库分发。对应 13 条馆藏记录保留，图片在公开构建中显示占位。本文其余段落描述本地研究与预览，不表示所有本地图像均可上传。

## 当前本地预览 · 56 条馆藏

第一阶段 20 条基础上，第二阶段新增 30 条，见 `src/museum/expanded-data.js`；其中 24 条来自大都会 Open Access，另六条来自宾大、纳尔逊、克利夫兰。第三阶段再新增 6 条，见 `src/museum/supplemental-data.js`：皇家安大略与波士顿各一尊罗汉、大英博物馆两幅敦煌绘画，以及 V&A 的御座与紫砂壶。馆藏号和文物信息按馆方原页核对；波士顿罗汉的“易县”归属另有宾大及芝加哥大学研究支持，不能说成波士顿馆方已确认的出土地。易县罗汉专题现收录 7 条，广胜寺壁画 4 条，水月观音 4 条。画册、成对花瓶及由多块重组的完整壁画按一条馆藏记录计算。

原址精确度独立于现藏馆坐标：馆方明确原址时只画概略位置，只有地区归属或“传出”资料时不画精确故乡点；未查明作地不以中国地理中心代替。新增记录都附中英文简介、年代、媒材、馆藏号与馆方链接。图片选择优先公有领域、CC0 和注明摄影者的可再分发 CC 照片；波士顿罗汉与 V&A 茶壶因尚无可核对的开放照片而显示占位。旧 20 条的图像许可仍需独立清理，不能把新增图片核验结果外推到所有图片。

所有原始文物记录见 `src/data.js`、`src/museum/expanded-data.js` 与 `src/museum/supplemental-data.js`，由 `src/museum/catalog.js` 合并。中英文简介由本站整理，不是馆方逐字翻译。

第三阶段交叉核验：

- 皇家安大略博物馆 914.4.1：[馆方展厅](https://www.rom.on.ca/whats-on/galleries/matthews-family-court-chinese-sculpture)明确称其为 Yizhou Luohan；[馆方提供的详细物件记录](https://artsandculture.google.com/asset/figure-of-a-luohan-unknown/-QFeB0dblF_4bQ)记为“Reportedly from Yi Xian”。因此本站只写“据传”。
- 波士顿美术博物馆 15.255：[馆方目录](https://collections.mfa.org/objects/13970)确认三彩罗汉、金代12世纪、购自 Yamanaka & Co，并注明目前不展出，但未写“易县”；[宾大博物馆的易县罗汉馆藏研究](https://collections.penn.museum/collections/object/151869)列举了波士顿藏件，[芝加哥大学易县罗汉专题](https://caeacollections.lib.uchicago.edu/view/15903/arhat-luohan?limit=100&offset=0&q=facet%2Cmetadata.WORK_Location5Name.en.keyword%2Cequals%2CMuseum+of+Fine+Arts%2C+Boston&q=filter%2Cparents%2Cequals%2C14454&sort=title.keyword)将 15.255 归入易县群，并采用辽代断代。本站保留波士顿馆方“金代”断代，并明确易县是研究归属，而非考古确证。
- 大英博物馆敦煌两件：[药师佛净土变 1919,0101,0.36](https://www.britishmuseum.org/collection/object/A_1919-0101-0-36)与[炽盛光佛与五星 1919,0101,0.31](https://www.britishmuseum.org/collection/object/A_1919-0101-0-31)的馆方记录均明确莫高窟第17窟，后者题记纪年897年。地图点使用[联合国教科文组织早期保护报告所列莫高窟群中心点](https://whc.unesco.org/document/162539)的约数，不将其冒充第17窟洞口精确坐标。
- V&A：[乾隆雕漆御座 W.399:1, 2-1922](https://www.vam.ac.uk/articles/va-trail-explore-as-a-family)与[宜兴茶壶 C.871&A-1936](https://www.vam.ac.uk/articles/teapots-through-time)由馆方专题页核对。御座与南苑团河行宫的关系在研究叙述中是推测，不画精确故乡点。

- 九龙图画心局部：`public/art/mfa-nine-dragons-verified.jpg`。来源：[Wikimedia Commons文件页](https://commons.wikimedia.org/wiki/File:Nine_Dragons,_detail,_Song_Dynasty.jpg)。文件页标记PD-Art / 公有领域，注明来源Michael Sullivan, *The Arts of China* (1999)；作品为陈容1244年《九龙图》，MFA 17.1697。[馆方记录](https://collections.mfa.org/objects/28526)。原`mfa-nine-dragons.jpg`为题跋画面，旧版保留，新版不用。
- 洛神赋图局部：`public/art/freer-luo-nymph-verified.jpg`。来源：[Smithsonian IIIF](https://ids.si.edu/ids/iiif/FS-F1914.53_Stitched/3200,0,1050,651/full/0/default.jpg)。[馆方记录F1914.53](https://asia.si.edu/object/F1914.53/)。媒体为Usage Conditions Apply，并非CC0；用于当前非商业教育预览，公开使用前须按馆方[使用说明](https://www.si.edu/openaccess/faq)核对适用范围。
- 第一阶段其余图片继承原`ATTRIBUTIONS.md`，未重新授予许可。吉美馆方图等不可一律视为公有领域；部分继承的 Commons 图片尚缺精确文件来源页。南海观音、飒露紫、拳毛騧现已换成项目作者的馆内实拍照片，详见`ATTRIBUTIONS.md`；场馆拍摄/发布条件仍须独立核对。
- [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/)地理数据为公有领域；现实地形纹理继承自旧项目`earth-ink.jpg`，原始下载来源尚需补齐。
- 原创展厅氛围素材使用内置imagegen一次生成，与实际文物图片分离。

重要复核来源：

- [大都会水月观音](https://www.metmuseum.org/art/collection/search/42727)
- [芝加哥坐佛官方存档](https://archive.artic.edu/silkroadforteachers/artwork/86380)
- [ROM提供的弥勒净土变物件记录](https://artsandculture.google.com/asset/the-paradise-of-maitreya-wall-painting-zhu-haogu-and-zhang-boyuan/owFNMNDPDipAgw?hl=en)
- [宾大飒露紫C395](https://collections.penn.museum/collections/object/167942)与[拳毛騧C396](https://collections.penn.museum/collections/object/239945)
- [龙门孝文帝浮雕](https://www.metmuseum.org/art/collection/search/42707)与[皇后浮雕](https://art.nelson-atkins.org/objects/8976/offering-procession-of-the-empress-as-donor-with-her-court)
- [纳尔逊南海观音](https://art.nelson-atkins.org/objects/597/guanyin-of-the-southern-sea)
- [广胜下寺药师佛壁画](https://www.metmuseum.org/art/collection/search/42716)
- [大英易县罗汉主目录](https://www.britishmuseum.org/collection/object/A_1913-1221-1)与[另一馆方中文断代解释](https://britishmuseum.org.cn/exhibition.aspx?id=171)
