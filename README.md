# 海外中国文物地图 / Relics Overseas Atlas

以 React + Three.js 构建的中英双语响应式 H5。第一阶段收录 20 条馆藏记录；当前版本已扩充至 56 条、13 家海外馆藏机构，并在可旋转地球上连接“现藏地”和有证据支持的“故乡”。文物与图片的核验仍将继续；当前版本尚未发布。

A bilingual, responsive React + Three.js museum. Phase I began with 20 records; this version contains 56 records across 13 museums. A rotating globe connects current collections to documented places of origin. Research and image-rights review are ongoing; this version has not been published.

## 发布范围 / Publication scope

本目录是**当前博物馆版本的独立候选发布包**。只把本目录作为 GitHub 仓库根目录；不要上传其上级工作目录。未收录旧项目首页、旧预览、嵌套旧仓库、生成的构建产物或本机配置。`index.html` 与 `museum.html` 均进入当前博物馆落地页。公开发布前仍须清理部分第一阶段图片的再分发权利，详见 `ATTRIBUTIONS.md` 与 `MUSEUM-SOURCES.md`。

This directory is a standalone candidate for the current museum version. Use **this directory only** as the GitHub repository root, not its parent workspace. Older pages, previews, nested repositories, build output and local configuration are excluded. Both `index.html` and `museum.html` open the current museum landing page. Some Phase I images still need redistribution-rights clearance before a public release; see the attribution and source notes.

## 本地运行

```bash
npm ci
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

构建结果位于 `dist/`。项目使用相对资源路径，可部署在根域名或 GitHub Pages 子路径。

## 交互与技术方案

- React 负责双语、检索、分类筛选、博物馆/文物切换与响应式详情面板。
- React Three Fiber / Three.js 渲染地球、准确经纬度点位、故乡弧线与移动光点。
- 真实地球纹理确保地形轮廓准确，再通过低饱和、青绿染色、纸纹与朱砂标记形成水墨风。
- 已核实可再分发的文物图片本地化；尚未清权的图片在公开版本显示占位并链接馆方原页。
- Three.js 独立懒加载；小红书 User-Agent 和“减少动态效果”系统设置默认进入省流模式，用户仍可手动切换 3D。

## 部署方案（推荐顺序）

### 1. Vercel（最快）

1. 在 GitHub 新建仓库并推送本目录。
2. 打开 [Vercel New Project](https://vercel.com/new)，导入仓库。
3. Vercel 会读取 `vercel.json`：Build Command 为 `npm run build`，Output Directory 为 `dist`。
4. 点击 Deploy。建议随后绑定自定义域名，便于小红书配置域名白名单。

### 2. Cloudflare Pages（国内外访问通常更稳）

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git。
2. Framework preset 选择 `Vite`。
3. Build command 填 `npm run build`，Build output directory 填 `dist`，Node 版本建议 22。
4. 部署后绑定自定义域名；`public/_headers` 会自动提供缓存和基础安全响应头。

### 3. GitHub Pages（如将来需要）

当前公开仓库不包含可执行部署工作流，因此推送代码**不会**自动发布网站。若未来选择 GitHub Pages，应在图片发布权利确认后，使用具备相应权限的 GitHub 账户另行添加工作流并手动启用；目前建议先按上面的 Cloudflare Pages 方案评估部署。

## 小红书小程序 / 小组件上线（重要）

本仓库可直接上线为网站/H5，但**不能把 React/Vite 的 `dist/` 直接当作小红书小程序代码包上传**。按小红书 2026 年官方文档，小程序需使用小红书开发者工具单独开发；小组件页面采用 `XHSML + CSS + JS`，或基于 Taro / uni 等框架配置小红书平台插件迁移。平台当前还限制单个代码包上限为 2 MB。

推荐采用“双端”方案：

1. 将本项目部署在 Vercel / Cloudflare，作为完整 3D 官网和小红书站外分享落地页。
2. 第二阶段建立 Taro 或原生 XHSML 小组件：复用 `src/data.js` 的数据与视觉规范，首屏使用轻量 2D 地图；Three.js 3D 只在平台能力与真机测试允许时启用。
3. 在小红书开放平台完成主体认证、类目选择与工信部备案，在官方 IDE 生成 `project.config.json` 后上传代码、提交发版审核。
4. 在 iOS、Android 小红书客户端真机测试；官方文档说明两端渲染与脚本环境不同，开发者工具结果不能代替真机结果。
5. 准备应用图标、9:16 封面与录屏、隐私政策、内容来源说明和图片授权/署名清单。正式商业使用前，逐一确认非公有领域图片的授权范围。

官方入口与依据：[小红书小程序介绍](https://miniapp.xiaohongshu.com/doc/DC137160)、[小组件项目结构](https://miniapp.xiaohongshu.com/doc/DC923374)、[小组件运行环境](https://miniapp.xiaohongshu.com/doc/DC096131)。

## 数据与版权

馆藏数据分列于 `src/data.js`、`src/museum/expanded-data.js` 与 `src/museum/supplemental-data.js`，保留馆方原始记录链接、馆藏编号、图像署名和不确定性说明。文物图片具有不同许可，不能把整个 `public/art/` 目录视作统一开源；详见 `ATTRIBUTIONS.md`。

## 许可与自摄照片 / License and own photographs

`LICENSE` 将本项目原创软件代码置于 [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0) 条款下：允许非商业使用、修改和再分发；**商业项目使用代码须另获权利人许可**。这是附有非商业条件的源码许可，不属于 OSI 意义上的开源许可。馆藏照片、其他视觉素材、馆方资料与嵌入的编辑文字不受该代码许可覆盖，逐项权利见 `ATTRIBUTIONS.md`。

项目作者自摄的南海观音、飒露紫、拳毛騧照片保留所有权利，未采用 CC 开放许可。三个本地预览文件已写入 `.gitignore`，不得作为候选 GitHub 仓库的内容提交。忽略源文件只能避免仓库克隆直接取得照片；**若网站公开显示图片，访客仍能从网页请求或截图获得显示版本**。另有 10 张馆藏照片和 1 张来源待核的旧地球纹理暂不纳入公开仓库；13 条对应馆藏记录保留并显示权利占位。当前本机的 `dist/` 已含被排除的图片，且重新从带照片的本地 `public/` 构建仍会复制它们；不得直接手动上传这个 `dist/`。仅从不含这些文件的 GitHub 仓库自动构建，才会生成上述占位版本。

宾大两张是普通游客在无禁拍标识区域拍摄，本站不售卖图片。纳尔逊照片也并非商业或专业摄影；但为避免把“允许游客拍照”误认为“明确允许公开作品集展示”，本站谨慎地在取得馆方书面确认前不随公开网站发布该张照片。不要把宾大官网可下载图片的使用条件套用到这些自摄照片；若改用馆方图片，应另按其非商业教育、署名及链接条款逐张处理。

The PolyForm Noncommercial 1.0.0 terms linked in `LICENSE` cover original software code only. Noncommercial use, modification and distribution are permitted; commercial use requires separate permission. This is source-available, not OSI open source. Photographs, other visuals, museum records, and embedded editorial text retain separate rights. The three creator-shot museum photographs remain all rights reserved and are ignored by Git. Ten further object photographs and an inherited earth texture are also withheld pending source or redistribution review. The 13 records remain searchable with rights placeholders. Keeping files out of Git prevents direct retrieval from the repository, but does not prevent saving an image shown on a public website. The existing local `dist/` contains withheld images; do not manually deploy it. Build from the clean Git repository instead. Obtain written clarification from Nelson-Atkins before publicly displaying the Guanyin photograph.
