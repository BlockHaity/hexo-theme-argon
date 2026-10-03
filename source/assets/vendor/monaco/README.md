# Monaco Editor（本地副本）

代码框「在编辑器中打开」功能使用的 Monaco Editor 本地兼底副本。
默认走 CDN（`_config.yml` 的 `monaco_cdn_url`），本目录只在 CDN 不可用时兜底。

- **版本**：0.52.2
- **上游 commit**：`404545bded1df6ffa41ea0af4e8ddb219018c6c1`（见各文件首行 banner）
- **许可**：MIT，见 [`LICENSE`](./LICENSE)（Copyright (c) 2016 - present Microsoft Corporation）
- **站点根路径**：`/assets/vendor/monaco/min/vs/`（由 `config.root` 拼出）

## 文件与来源

| 本地路径 | 来源 URL | 字节数 | 作用 |
| --- | --- | ---: | --- |
| `min/vs/loader.js` | `https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js` | 30 051 | **AMD 加载器**。必须先加载它，之后才有全局 `window.require` |
| `min/vs/editor/editor.main.js` | `https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/editor/editor.main.js` | 3 766 654 | **编辑器内核 + basic languages**。约 3.59 MB，通过 AMD 模块 `vs/editor/editor.main` 载入 |
| `min/vs/editor/editor.main.css` | `https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/editor/editor.main.css` | 131 858 | **编辑器样式表**，必须单独引入 |
| `LICENSE` | `https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/LICENSE` | 1 098 | MIT 许可文本 |

> 注：`monaco-editor@0.52.2/LICENSE.md` 不存在（404），许可文件在包内名为 `LICENSE`。

## 载入顺序（不可颠倒）

契约见 `/tmp/opencode/codeblock-contract.md` 第 5 节 `loadMonaco()`。每一处候选源（CDN → 本地）都要按这个顺序：

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

- **不含 base16 主题**。包内没有 `min/vs/editor/editor.main.css` 之外的任何主题资源（无 `min/vs/base16/`）。主题只用 Monaco 内置的 `vs` / `vs-dark`，跟随页面 `html.darkmode` / `html.darkmode.amoled-dark` 切换。
- **不含全部语言服务**。本副本只有 **basic languages**（纯语法高亮，基于 Monarch tokenizer），没有 TypeScript / JSON Schema / CSS 智能提示等语言服务。因此没有补全、没有诊断下划线、没有跳转定义、没有 hover 文档。

### 已实测的语言覆盖（0.52.2 内置 83 种 basic language）

契约第 5 节 `getCodeLanguageMeta()` 映射到的语言**全部实测存在**：

```
shell python go rust csharp cpp sql yaml markdown html xml javascript
php ruby lua dart scala kotlin swift powershell dockerfile ini julia
graphql elixir fsharp vb objective-c perl r clojure
```

另有 `abap aes apex azcli bat bicep c cameligo clojure coffeescript csp css cypher
freemarker2 handlebars hcl java less lexon liquid m3 mdx mips msdax mysql pascal
pascaligo pgsql pla postiats powerquery proto pug qsharp razor redis redshift
restructuredtext sb scheme scss sol sparql st systemverilog tcl twig typescript
typespec verilog wgsl` 等。

**确认不存在**（契约已写明的限制，已逐项 grep + 对 npm 包目录做 HTTP 校验，全部 404）：

| 语言 | 状态 |
| --- | --- |
| `haskell` | 缺 |
| `erlang` | 缺 |
| `latex` | 缺 |
| `diff` | **缺（契约未列出，但同样不存在）** |

> **⚠️ 与契约的偏差**：契约第 2 节把 `diff` 算进了 0.52.2 自带的 basic languages 列表，
> 实测 **0.52.2 整个包里都没有 diff 语言**（`min/vs/basic-languages/diff/diff.js` 与
> `esm/vs/basic-languages/diff/diff.js` 均 404，`editor.main.js` 内无注册）。
> 契约第 5 节映射里的 `diff|patch -> diff / diff` 会让 `monaco.editor.createModel(code, 'diff')`
> 拿一个不存在的语言 id，Monaco 会在控制台告警并按 `plaintext` 处理。
> **无功能损坏**（纯文本编辑正常），但会刷 warning。若要消掉，需要在
> `getCodeLanguageMeta()` 里把 `diff|patch` 改映射到 `null`——**该文件不属于本 vendor 目录**，
> 请由 js-owner 决定，本目录不做修改。

## 校验记录

三个文件均已用 `curl -sI` 拿到的 `etag`（格式 `W/"<size-hex>-<sha1-base64>"`）与本地文件
`sha1sum` 逐一比对，字节数与哈希**完全一致**，且 `file(1)` 确认均为 `JavaScript source, ASCII text`
或 `ASCII text`（不是 HTML 错误页）。

| 文件 | 本地字节数 | etag size(hex) | sha1-base64 前 8 位 | 一致 |
| --- | ---: | --- | --- | :-: |
| `min/vs/loader.js` | 30 051 | `7563` | `MxBeUXPx` | ✅ |
| `min/vs/editor/editor.main.js` | 3 766 654 | `39797e` | `ll+P4Hw/` | ✅ |
| `min/vs/editor/editor.main.css` | 131 858 | `20312` | `PWtup/Xi` | ✅ |

内容自检：

- `editor.main.js` 首行 banner 含 `Version: 0.52.2(404545b...)` 与 `Released under the MIT license`
- `editor.main.css` 含 `.monaco-editor` 选择器 644 处
- `loader.js` 含 `AMDLoader` 21 处、`define.amd` 2 处

> 任务单里给的 `editor.main.css` 参考值 **21 762 B** 是 **gzip 压缩后**的
> `content-length`（`curl --compressed` 下报的值），不是文件本身大小。
> 未压缩的真实大小是 **131 858 B**（= etag 的 `0x20312`）。三个文件里只有 CSS 会被压缩到这个量级。

## 更新方式

```sh
V=0.52.2
B=https://cdn.jsdelivr.net/npm/monaco-editor@$V
cd source/assets/vendor/monaco
curl -sSf --compressed -o min/vs/loader.js               "$B/min/vs/loader.js"
curl -sSf --compressed -o min/vs/editor/editor.main.js  "$B/min/vs/editor/editor.main.js"
curl -sSf --compressed -o min/vs/editor/editor.main.css "$B/min/vs/editor/editor.main.css"
curl -sSf -o LICENSE                                     "$B/LICENSE"
```

升版本后请同步更新本 README 的版本号 / 字节数 / 语言覆盖清单，并检查
`source/argontheme.js` 与 `_config.yml` 里写死的 `0.52.2` CDN 路径。
