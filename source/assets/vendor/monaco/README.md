# Monaco Editor（本地副本）

代码框「在编辑器中打开」功能使用的 Monaco Editor 本地兼底副本。
默认走 CDN（`_config.yml` 的 `monaco_cdn_url`），本目录只在 CDN 不可用时兜底。

- **版本**：0.52.2
- **上游 commit**：`404545bded1df6ffa41ea0af4e8ddb219018c6c1`（见各文件首行 banner）
- **许可**：MIT，见 [`LICENSE`](./LICENSE)（Copyright (c) 2016 - present Microsoft Corporation）
- **站点根路径**：`/assets/vendor/monaco/min/vs/`（由 `config.root` 拼出）

## 目录结构与体积

| 分组 | 文件数 | 原始体积 | gzip 后 | 作用 |
| --- | ---: | ---: | ---: | --- |
| `min/vs/editor/` | 2 | 3 807.1 KiB | 950.4 KiB | 编辑器内核 + 样式表 |
| `min/vs/loader.js` | 1 | 29.3 KiB | 9.0 KiB | AMD 加载器 |
| `min/vs/basic-languages/**` | 81 | 486.2 KiB | 181.7 KiB | **语法高亮词法（懒加载）** |
| `min/vs/language/**` | 8 | 7 071.3 KiB | 1 581.1 KiB | **语言服务**：json / css / html / typescript 的 `*Mode.js` + `*Worker.js` |
| `min/vs/base/worker/workerMain.js` | 1 | 367.7 KiB | 112.0 KiB | 通用 worker 入口（所有语言服务共用） |
| `min/vs/base/browser/ui/codicons/codicon/codicon.ttf` | 1 | 78.5 KiB | 43.4 KiB | Monaco UI 图标字体（查找框、折叠箭头等） |
| `LICENSE`、`README.md` | 2 | — | — | 许可与说明 |
| **合计（`min/vs` 内 94 个文件）** | **94** | **11.56 MiB** | **2.81 MiB** | |

体积都是**仓库与产物体积**：`hexo generate` 会原样拷进 `public/assets/vendor/monaco/`。
访客平时碰不到它——CDN 正常时传输全部发生在 CDN 上，而且只在点开编辑器之后才发起；
本地兼底只在 CDN 拿不到时才启用，且各文件按需加载（打开一个代码块只拉它用到的那一个词法文件，
3–20 KiB 量级；只有用到 JS / TS / JSON / CSS / HTML 的智能提示时才会拉对应的 language service）。

## 关键认知：语言资源是「懒加载」的

`editor.main.js` 只内联了语言**注册表**，词法本体与语言服务都是运行时按需拉取的 AMD 模块：

```js
// editor.main.js 里每个语言的注册形如：
i({id: "javascript", extensions: [".js", ...],
   loader: () => new Promise((e, r) => { a(["vs/basic-languages/javascript/javascript"], e, r) })});
// 拿到之后才 registerTokensProviderFactory(id, { create: async () => (await s.load()).language })
```

**漏一个文件的后果是静默降级成纯文本**：loader 的 promise 被 reject 后，Monaco 不会报错、
不会提示，只是这个语言没有 tokenizer。所以本目录必须成组 vendor，
`vs/editor/editor.main.js` 单独一个文件是**不够**的——这正是曾经出现
「CDN 被墙时编辑器能打开、但所有语言都是纯文本」的原因。

同一机制也适用于语言服务：`vs/language/<x>/<x>Mode.js`（主线程部分）与
`vs/language/<x>/<x>Worker.js`（worker 部分）都是懒加载模块。

## worker 是怎么接上的

worker 脚本受同源策略约束，走 CDN 时 `new Worker(cdnUrl)` 会被浏览器直接拒绝。
`source/argontheme.js` 的 `setupMonacoEnvironment(base)` 因此用 **blob 造一个同源代理**：

```js
self.MonacoEnvironment = { baseUrl: "<…/min/>" };          // 注意：指到 vs/ 的上一级
importScripts("https://…/min/vs/base/worker/workerMain.js");
```

约定来自对 0.52.2 min 产物的实测：

| 约定 | 说明 |
| --- | --- |
| `baseUrl` 必须是 **`vs/` 的上一级** | `workerMain.js` 用 `baseUrl + "vs/loader.js"` 自举 AMD；写成 `…/min/vs/` 会拼出 `vs/vs/loader.js` |
| 必须是**绝对 URL** | blob worker 里 `importScripts` / `fetch` 不接受站内相对路径，传 `/assets/...` 会抛 `The URL … is invalid`，Monaco 随即退回主线程执行（UI 卡顿 + 控制台告警） |
| 只需一个通用 worker | `workerMain.js` 按主线程给的 moduleId/label 自己 AMD 加载 `json/css/html/tsWorker`，5 个 label 共用 |
| 不需要手动 `require` | `workerMain.js` 末尾自带 `globalThis.onmessage` 握手与 `vscode-worker-ready` 流程 |

blob 代理失败时 Monaco 会自动退回主线程执行语言服务（功能仍在，会卡），不会白屏。

## 未纳入本副本的资源

| 资源 | 为什么不要 |
| --- | --- |
| `min/vs/nls.messages.<lang>.js` | Monaco 内部 UI 文案的本地化包。不带就是英文（查找框、右键菜单等），主题自己的按钮/状态栏走 `__()` 不受影响。要中文界面可再补 `zh-cn`（157 KiB） |
| `min-maps/**` | source map，线上用不到 |
| `esm/**` | ESM 发行版，本主题走 AMD |

## 载入顺序（不可颠倒）

```js
// 1) 先引 CSS，并等 onload
<link rel="stylesheet" href="{base}editor/editor.main.css">

// 2) 再引 loader，并等 onload
<script src="{base}loader.js"></script>

// 3) 配置 AMD 路径（base 指向 min/vs/，带尾斜杠）
window.require.config({ paths: { vs: base } });

// 4) 载入模块
window.require(['vs/editor/editor.main'], ok, err);
```

**`editor.main.css` 必须单独引入。** 这个包里 CSS 不打包进 JS：漏引它会先闪一个无样式的编辑器（纯文本流、行号错位、没有选区/光标/滚动条外观），CSS 到位后才重排。

`editor.main.js` 里同样没有内联样式，`vs/editor/editor.main` 模块 resolve 时依赖 CSS 已经加载完成，所以要先 `onload` 再 `require`。

## 已知限制

- **不含 base16 主题**。主题只用 Monaco 内置的 `vs` / `vs-dark`，跟随页面
  `html.darkmode` / `html.darkmode.amoled-dark` 切换。
- **diff / makefile 不在本目录**。Monaco 0.52.2 确实没有这两个语言（
  `min/vs/basic-languages/diff/diff.js` 与 `makefile/makefile.js` 均 404，`editor.main.js` 内无注册），
  而主题自带的 highlight.js 定制构建里有。为了不出现「页面有高亮、编辑器纯文本」，
  改由 `source/argontheme.js` 的 `registerMonacoCustomLanguages()` 在运行时注册精简 Monarch 规则
  （语言 id 为 `argon-diff` / `argon-makefile`）。与 VS Code 的 TextMate 规则不会逐字一致，
  只保证关键字 / 注释 / 增删行可辨。
- **Monaco 内部 UI 是英文**（未带 nls 语言包），见上一节。

## 校验记录

- 原有 3 个文件用 `curl -sI` 的 `etag`（`W/"<size-hex>-<sha1-base64>"`）与本地 `sha1sum` 逐一对齐：

  | 文件 | 本地字节数 | etag size(hex) | sha1-base64 前 8 位 | 一致 |
  | --- | ---: | --- | --- | :-: |
  | `min/vs/loader.js` | 30 051 | `7563` | `MxBeUXPx` | ✅ |
  | `min/vs/editor/editor.main.js` | 3 766 654 | `39797e` | `ll+P4Hw/` | ✅ |
  | `min/vs/editor/editor.main.css` | 131 858 | `20312` | `PWtup/Xi` | ✅ |

- 本次新增的 91 个文件（81 个词法 + 8 个语言服务 + `workerMain.js` + `codicon.ttf`）
  的下载来源是 jsDelivr 官方文件清单（`https://data.jsdelivr.com/v1/packages/npm/monaco-editor@0.52.2?structure=flat`），
  每个文件下载后都与清单里的 `size` 逐一比对字节数，全部一致。

## 更新方式

语言资源**不要靠人肉列目录，也不要用「扫 editor.main.js 里的 vs/… 字符串」这种写法**——
依赖数组里的 `vs/base/common/xxx` 是打包进内核的模块 id，磁盘上没有对应文件，照抄会 404。
用 jsDelivr 的官方文件清单最稳（就是本副本当初的下载方式）：

```sh
V=0.52.2
cd source/assets/vendor/monaco

curl -s "https://data.jsdelivr.com/v1/packages/npm/monaco-editor@$V?structure=flat" -o mc.json

node -e '
const fs=require("fs"), https=require("https"), path=require("path");
const V="0.52.2";
const keep = f =>
     f.name.startsWith("/min/vs/basic-languages/")          // 81 个词法模块
  || f.name.startsWith("/min/vs/language/")                 // 语言服务：*Mode.js + *Worker.js
  || f.name === "/min/vs/base/worker/workerMain.js"         // 通用 worker 入口
  || f.name === "/min/vs/base/browser/ui/codicons/codicon/codicon.ttf"; // UI 图标字体
const files = JSON.parse(fs.readFileSync("mc.json","utf8")).files.filter(keep);
const get = url => new Promise((res, rej) => https.get(url, r => {
  if (r.statusCode !== 200) { r.resume(); return rej(new Error("HTTP " + r.statusCode)); }
  const c = []; r.on("data", x => c.push(x)); r.on("end", () => res(Buffer.concat(c)));
}).on("error", rej));
(async () => {
  let ok = 0, bad = [];
  await Promise.all(files.map(async f => {
    try {
      const buf = await get("https://cdn.jsdelivr.net/npm/monaco-editor@" + V + f.name);
      if (buf.length !== f.size) throw new Error("size " + buf.length + " != " + f.size);
      const rel = "min/vs" + f.name.replace("/min/vs", "");
      fs.mkdirSync(path.dirname(rel), { recursive: true });
      fs.writeFileSync(rel, buf); ok++;
    } catch (e) { bad.push(f.name + " (" + e.message + ")"); }
  }));
  console.log("downloaded", ok, "/", files.length);
  if (bad.length) { console.log(bad.join("\n")); process.exit(1); }
})();
'

rm -f mc.json
# 内核 / 加载器 / 样式 / 许可（同样按上面清单里的字节数核对）
B=https://cdn.jsdelivr.net/npm/monaco-editor@$V
curl -sSf -o min/vs/loader.js               "$B/min/vs/loader.js"
curl -sSf -o min/vs/editor/editor.main.js   "$B/min/vs/editor/editor.main.js"
curl -sSf -o min/vs/editor/editor.main.css  "$B/min/vs/editor/editor.main.css"
curl -sSf -o LICENSE                        "$B/LICENSE"
```

## 升版本后的自检（必做）

懒加载资源漏一个只会静默降级，不会有任何报错，所以升版本后跑一遍这个断言：

```sh
cd source/assets/vendor/monaco
node -e '
const fs=require("fs");
const vs="min/vs";
const src=fs.readFileSync(vs+"/editor/editor.main.js","utf8");
// 只认「懒加载模块」的两种形状：basic-languages/<x>/<x> 与 language/<x>/<x>Mode。
// 两个坑：1) 字符类必须含大写，否则 cssMode 会被截成 css；
//        2) 结尾要加 (?![\w.])，否则 monaco.contribution 会被截成 monaco。
// 依赖数组里的 vs/base/common/xxx 是打包进内核的 id，磁盘上没有文件，不能一起匹配。
const re=/vs\/(?:basic-languages|language)\/[a-z0-9-]+\/[A-Za-z0-9-]+(?![\w.])/g;
const ids=[...new Set([...src.matchAll(re)].map(m=>m[0]))];
const missing=ids.filter(id=>!fs.existsSync(vs+"/"+id.replace(/^vs\//,"")+".js"));
for(const extra of ["base/worker/workerMain.js","language/json/jsonWorker.js","language/css/cssWorker.js",
  "language/html/htmlWorker.js","language/typescript/tsWorker.js",
  "base/browser/ui/codicons/codicon/codicon.ttf"]){
  if(!fs.existsSync(vs+"/"+extra)) missing.push(extra);
}
console.log("懒加载模块:",ids.length,"(basic-languages",ids.filter(i=>i.startsWith("vs/basic") ).length,
  "+ language",ids.filter(i=>i.startsWith("vs/language")).length,") | 缺失:",missing.length);
if(missing.length){console.log(missing.join("\n"));process.exit(1);}
console.log("OK");
'
```

0.52.2 的正常输出是 `懒加载模块: 85 (basic-languages 81 + language 4) | 缺失: 0`。

同时更新本 README 的版本号 / 字节数 / 分组表，并检查
`source/argontheme.js` 与 `_config.yml` 里写死的 `0.52.2` CDN 路径。
