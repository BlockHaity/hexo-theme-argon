![Argon](https://cdn.jsdelivr.net/gh/solstice23/cdn@master/argon_new_animate.svg)

# Hexo-Theme-Argon

[Argon-Theme](https://github.com/solstice23/argon-theme) 的 Hexo 移植版

# 关于

Hexo-Theme-Argon 移植自 WordPress 版 Argon 主题。

## 项目状态

目前没有精力维护移植版，只维护 Wordpress 版本。Wordpress 的新功能将不会来到 Hexo 版本，只进行必要的 BUG 修复。~~（很久没有使用 Hexo）~~

欢迎提交 Pull Request 贡献/移植新功能/修复 BUG。

# 使用

## 1. 安装并启用主题

1. 在 `Hexo 根目录/themes` 目录下 Clone 本 Repo。

```
git clone https://github.com/solstice23/hexo-theme-argon.git
```
安装 ejs 渲染器。

```
npm install hexo-renderer-ejs
```

2. 重命名 Clone 后的文件夹为 `argon`

3. 在 `Hexo 根目录/_config.yml` 中将 `theme` 项改为 `argon`

## 2. 修改主题配置

### 方式一（推荐）：在博客根目录创建配置文件

在 `Hexo 根目录` 下创建 `_config.argon.yml` 文件，所有主题配置项均可在此文件中设置。这样在主题更新时配置不会被覆盖。

> **注意**：该文件会**整体覆盖**主题的 `themes/argon/_config.yml`，两者不会合并。因此在这里没有写出的配置项会回退到主题代码内置的默认值（而不是主题 `_config.yml` 里的值）。所有配置项都有内置默认值，只写想改的部分即可。

### 方式二：使用 data 目录

将 `Hexo 根目录/themes/argon/_config.yml` 复制到 `Hexo 根目录/source/_data` 文件夹中，并重命名为 `argon.yml`，然后修改复制后的配置文件。

### 主要配置项

- **卡片样式**：支持调节卡片圆角和阴影
- **主题颜色**：可自定义主题色，支持夜间模式和 AMOLED 暗色模式
- **标签页 / 分类页**：自动生成 `/tags` 与 `/categories` 索引页，展示样式可配置
- **评论系统**：支持 Gitalk、Giscus、Waline、Twikoo
- **Giscus 主题**：支持自定义 CSS 主题或使用 Giscus 原生主题，自动适配亮色/暗色模式
- **代码高亮**：内置 VSCode 现代亮 / 暗色代码主题，可分别指定亮色与暗色模式使用的代码主题

## 3. 配置搜索功能

1. 在 `Hexo 根目录/themes` 目录下执行

```
npm install hexo-generator-search --save
```

2. 在 `Hexo 根目录/_config.yml` 中添加选项

```
search:
  path: search.xml
  field: post
  content: true
```

# 更新

在 `Hexo 根目录/themes/argon` 目录中执行

```
git pull
```

# 文章内参数

Argon 支持给文章设定一些单独的参数，例如文章头图

| 参数名                   | 解释                               |
|--------------------------|-----------------------------------|
| thumbnail                | 文章头图地址                       |
| first_image_as_thumbnail | 该篇文章是否选用文中第一张图作为头图 |
| after_post               | 文末附加内容                       |
| excerpt                  | 文章自定义摘要                     |

# 新功能

## 标签页与分类页

主题会自动生成标签索引页 `/tags` 和分类索引页 `/categories`，两者的展示样式都可以配置。

### 开启与关闭

```yaml
# _config.argon.yml
enable_tag_page: true      # 标签页
enable_category_page: true # 分类页
```

如果你已经在 `source/tags/index.md` 或 `source/categories/index.md` 中手写了同名页面，主题会跳过自动生成并保留你自己的页面，此时主题不再为它渲染上述布局。

### 配置入口位置

入口位置和「归档」一样，完全由菜单配置决定，在 `toolbar_menu`（顶栏）和 `leftbar_menu`（侧栏）中自行添加条目：

```yaml
toolbar_menu:
  归档: /archives
  标签: /tags
  分类: /categories

leftbar_menu:
  归档: /archives
  标签: /tags
  分类: /categories
```

> 关闭 `enable_tag_page` / `enable_category_page` 时，请同步移除菜单中的对应条目，否则点击会 404。

侧栏「站点概览」中的分类、标签弹窗仍然保留，弹窗内额外提供一个「查看全部」入口跳转到对应索引页。若不需要该入口：

```yaml
tag_page_modal_all_link: false
category_page_modal_all_link: false
```

### 展示样式

`tag_page_style` 与 `category_page_style` 支持三种样式：

| 值 | 说明 |
|---|---|
| `cloud` | 标签云，字号按文章数在 `font_min` 与 `font_max` 之间缩放 |
| `list` | 列表，每行展示名称、相对长度条和文章数 |
| `grid` | 栅格卡片，适合分类数量较少的站点 |

### 完整配置项

标签页与分类页各有一套对称配置，把前缀 `tag_page_` 换成 `category_page_` 即为分类页配置。以下默认值已内置在主题中，通常无需填写。

| 配置项 | 默认值 | 说明 |
|---------|--------|------|
| `enable_tag_page` | `true` | 是否生成标签页 |
| `tag_page_style` | `cloud` | 展示样式，`cloud` / `list` / `grid` |
| `tag_page_sort` | `length` | 排序字段，`length` 文章数、`name` 名称、`none` 不排序 |
| `tag_page_order` | `-1` | 排序方向，`-1` 降序、`1` 升序 |
| `tag_page_font_min` | `14` | 标签云最小字号，仅 `cloud` 生效 |
| `tag_page_font_max` | `26` | 标签云最大字号，仅 `cloud` 生效 |
| `tag_page_show_count` | `true` | 是否显示文章数 |
| `tag_page_show_card` | `true` | 是否显示页面顶部的渐变信息卡 |
| `tag_page_limit` | `0` | 最多显示数量，`0` 表示不限制 |
| `tag_page_empty_text` | `''` | 没有标签时的提示文案，留空使用默认文案 |
| `tag_page_modal_all_link` | `true` | 侧栏标签弹窗内是否显示「查看全部」 |

## Giscus 评论主题自定义

### 配置选项
```yaml
giscus:
  enable: true
  loading: 'lazy'          # 评论加载时机，lazy 滚动到附近才加载，eager 立即加载
  use_custom_theme: true   # true 使用 Argon 配色，false 使用 Giscus 原生主题
  light_theme: 'light'     # 仅在 use_custom_theme 为 false 时生效
  dark_theme: 'dark'       # 仅在 use_custom_theme 为 false 时生效
  amoled_dark_theme: 'dark' # 仅在 use_custom_theme 为 false 时生效
```

### Argon 配色模式（`use_custom_theme: true`）

`hexo generate` 时会产出三个 CSS 文件，浏览器按当前模式加载对应的那一份：

| 文件 | 对应 Argon 模式 | 卡片底色 |
| --- | --- | --- |
| `giscus/argon-light.css` | 亮色 | `#ffffff` |
| `giscus/argon-dark.css` | `darkmode` | `#424242` |
| `giscus/argon-amoled.css` | `darkmode` + `amoled-dark` | `#000000` |

- 主色取自 `theme_color`，圆角取自 `card_radius`，字体栈与页面正文一致
- 覆盖 Giscus 的 Primer 配色变量（画布、文字、边框、按钮、强调色等），
  不去改 `gsc-*` 类名——Giscus 官方说明类名与结构可能随版本变动
- 切换亮色/暗色/AMOLED 时通过 `postMessage` 让 Giscus 同步换主题，无需刷新
- 主题 URL 在浏览器端用 `location.origin` 拼绝对地址，
  所以站点的 `url` 配置写成 `http` 也不会影响

> 限制：评论区配色在构建期烘焙，访客用主题色取色器临时改色时不会跟着变。
> Giscus 的 iframe 是独立文档，`setConfig` 只能接收一个主题 URL，
> 无法把 CSS 变量传进去，因此没有绕开的办法。

### Giscus 原生主题模式（`use_custom_theme: false`）

- 亮色主题：`light`, `light_tritanopia`, `light_high_contrast`, `preferred_color_scheme`, `transparent`
- 暗色主题：`dark`, `dark_dimmed`, `dark_high_contrast`, `dark_tritanopia`, `transparent`, `preferred_color_scheme`
- 这三个键也可以填任意第三方主题 CSS 的 URL
- Giscus 原生没有 AMOLED 档位，`amoled_dark_theme` 留空等同 `dark`

## 代码高亮

代码高亮由 highlight.js 渲染，代码框外观与配色都可以配置。

### 配置选项

```yaml
# _config.argon.yml
enable_code_highlight: true    # 是否启用代码高亮
code_theme: vscode-light       # 亮色模式的代码主题
code_dark_theme: vscode-dark   # 暗色 + 暗黑模式的代码主题，留空则回落 code_theme
```

| 配置项 | 说明 |
|--------|------|
| `enable_code_highlight` | 是否启用 highlight.js 代码高亮 |
| `code_theme` | 亮色模式使用的代码主题 |
| `code_dark_theme` | 暗色与 AMOLED 暗黑模式使用的代码主题 |

主题分两档：亮色模式走 `code_theme`，暗色和 AMOLED 暗黑模式共用 `code_dark_theme`。
这与 Giscus 的三档配色逻辑一致，但两者互不影响，各自读自己的配置键。

> `code_dark_theme` 留空时会**回落到 `code_theme`**，也就是三种模式共用同一个主题，
> 相当于旧版本的行为。因此升级后不写这个键，代码框配色和之前一样。

### 选择代码主题

`code_theme` / `code_dark_theme` 的值是 `source/assets/vendor/highlight/styles/` 下的文件名，**不含 `.css`**。

内置的默认主题是手工编写的 `vscode-light` / `vscode-dark`，完全照搬 VSCode 现代亮色 / 暗色主题的色值：

| 主题 | 背景 | 前景 |
| --- | --- | --- |
| `vscode-light` | `#FFFFFF` | `#3B3B3B` |
| `vscode-dark` | `#1F1F1F` | `#CCCCCC` |

除这两套之外，目录里还有 highlight.js **v11.12.0** 官方 `styles/` 根目录的 **82 套主题**，
可以直接填进这两个键，常用的几款：

- `github-dark-dimmed`、`tokyo-night-dark`、`rose-pine`、`night-owl`、`nord`、`cybertopia-*`
- `shades-of-purple`、`vs-dark`、`intellij-light`、`stackoverflow-*`、`a11y-*`

> 这些主题**不包含** highlight.js `styles/base16/` 下的那批排列变体。
> 想用官方主题就直接写文件名，例如 `code_theme: github`；没有后缀的写法是错的。

### 表面色与 token 颜色

代码框的**外壳**由 Argon 主题的 `source/style.css` 负责，与代码主题无关：边框、圆角、行号槽、
头栏按钮都属于这一层。

圆角跟随站点的 `card_radius`（即 `--card-radius`），但会**收敛到 8px 上限**
（`min(var(--card-radius), 8px)`）。直接把 `--card-radius` 用上去的话，
`card_radius: 30` 会让代码框圆得像胶囊，不好看。

由 `code_theme` / `code_dark_theme` 决定的，是**代码区本身的底色与字色，以及全部语法 token 颜色**
（关键字、字符串、注释等）。这部分 Argon 不参与覆盖，选了哪个主题就是哪个主题的样子。

行号用的是 VSCode 的 `editorLineNumber.foreground`（亮暗都是 `#6E7681`），但整体加了 50% 透明度。
这样在 82 套主题里那些底色偏极端的主题（如 `blackboard`）上也不会出现过亮或过暗的行号。

> 换完主题如果页面出现闪烁、或者颜色和预期对不上，先确认 `code_theme` 里写的文件名
> 确实存在于 `source/assets/vendor/highlight/styles/` 目录下，文件名不对时页面会直接 404。

### 在编辑器中打开

代码框头栏的第 4 个控制按钮是「在编辑器中打开」（原先这个位置放的是全屏按钮，本次已移除）。
点开后会弹出一个全屏的 Monaco 编辑器——Monaco 就是 VS Code 的编辑器内核，与 vscode.dev 同源——
可以把代码捞出来改，改完可以复制，也可以「另存为」下载到本地。

```yaml
# _config.argon.yml
enable_codeblock_editor: true    # 是否启用代码框「在编辑器中打开」按钮
monaco_cdn_url: https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/ # Monaco CDN 根目录，留空则只用本地副本
```

| 配置项 | 说明 |
|--------|------|
| `enable_codeblock_editor` | 是否在代码框头栏渲染「在编辑器中打开」按钮，默认 `true` |
| `monaco_cdn_url` | Monaco 的 CDN 根目录，jsDelivr、unpkg 等均可；留空则只用本地副本 |

Monaco 按 **CDN 优先、本地兼底** 的顺序加载：先试 `monaco_cdn_url`，拿不到再回落到
`/assets/vendor/monaco/min/vs/`（由 `config.root` 拼出）。它**不进首屏同步加载的
`argon_js_merged.js`**，而是等用户点了按钮才开始下载；加载成功后 `window.monaco` 常驻，
同一页里第二次打开就是瞬开。Esc 或点击遮罩可以关闭，关闭后焦点会还给原来那个按钮；
两处都失败时弹「编辑器加载失败」提示。

编辑层里的常用功能（对齐 VS Code 的习惯）：

| 位置 | 功能 |
|------|------|
| 工具条 | 查找（`Ctrl/Cmd+F`）、替换（`Ctrl+H`）、减小字号、增大字号、折行开关、另存为、复制、关闭 |
| 状态栏（左侧） | `行 x, 列 y`；有选区时显示已选字符数 |
| 状态栏（右侧） | 缩进（`空格: n` / `制表符: n`，按代码内容自动探测）、换行符（LF / CRLF）、**语言切换器** |
| 语言切换器 | 列出 Monaco 注册的全部语言（含运行时补的 diff / makefile）；切换后着色与「另存为」的扩展名一起变 |
| Esc | **分层关闭**：先关查找框 / 命令面板，再关整个编辑层；没有浮层时一次 Esc 就关掉 |
| 其它 | `F1` 命令面板（Monaco 自带）、括号匹配与自动闭合、多光标（`Alt+点击`）、代码折叠 |

语言识别不出来时（比如写了 ```` ```某些语言 ````），页面和编辑器都会退化成纯文本，
这时可以直接在状态栏的语言切换器里手动指定，不用回去改文章。

本地兼底是要付体积代价的。仓库里躺着完整的一份 Monaco 0.52.2，位于
`source/assets/vendor/monaco/min/vs/`，一共 94 个文件：

| 分组 | 文件数 | 原始体积 | gzip 后 |
| --- | ---: | ---: | ---: |
| `editor/`（内核 + 样式） | 2 | 3,807.1 KiB | 950.4 KiB |
| `loader.js` | 1 | 29.3 KiB | 9.0 KiB |
| `basic-languages/**`（语法高亮词法） | 81 | 486.2 KiB | 181.7 KiB |
| `language/**`（json / css / html / ts 语言服务） | 8 | 7,071.3 KiB | 1,581.1 KiB |
| `base/worker/workerMain.js` | 1 | 367.7 KiB | 112.0 KiB |
| `base/.../codicon.ttf`（UI 图标字体） | 1 | 78.5 KiB | 43.4 KiB |
| 合计 | **94** | **11.56 MiB** | **2.81 MiB** |

这 11.56 MiB 是**实打实的仓库与产物体积**：它要跟着主题仓库走，`hexo generate` 时也会被原样
拷进 `public/assets/vendor/monaco/`。好在访客平时碰不到它——CDN 正常时传输全部发生在 CDN 上，
而且**只在点开编辑器之后才发起**，不拖慢首屏；本地兼底只在 CDN 拿不到时才启用，
并且各资源按需加载：打开一个代码块只拉它用到的那个词法文件（3–20 KiB），
只有真的要 JS / TS / JSON / CSS / HTML 的智能提示时才拉对应的语言服务 worker。

文件名与扩展名按代码块的语言自动决定：`bash` → `snippet.sh`、`js` → `snippet.js`、
`py` → `snippet.py`，此外还有 `ts` → `.ts`、`yaml` → `.yml`、`powershell` → `.ps1` 等。
识别不出的语言存为 `snippet.txt`，工具条左侧会显示这个文件名。

能力边界摆在这里，免得按 VS Code 的期待去用它：

- **有语言服务**：JSON / CSS / HTML / JavaScript / TypeScript 有诊断（红波浪线）、补全、
  跳转定义与格式化数据源；worker 跑在**同源 blob 代理**里，这样走 CDN 时也不受同源策略限制。
  普通 JS 默认不开 `checkJs`，所以类型错误不会报，语法错误会报。
- 其余语言是 basic languages 的**纯语法高亮**（Monarch 词法），没有语言服务。
- `diff` / `makefile`：Monaco 0.52.2 确实没有这两个语言，但主题自带的 highlight.js 有。
  为了不出现「页面有高亮、编辑器纯文本」，主题侧用精简 Monarch 规则在运行时补上了
  （语言 id `argon-diff` / `argon-makefile`），属于 best-effort，与 VS Code 的 TextMate
  规则不会逐字一致。
- 主题自带 highlight.js 是只打包了 36 种语言的定制构建；Monaco 侧有 81 种可高亮。
  两边都没有 haskell / erlang / latex / nginx 这类语言，所以这些代码块在页面和编辑器里
  都没有语法着色（可在状态栏手动切到相近语言）。
- 编辑全程在浏览器本地完成，代码不会上传到任何服务器。
- 「另存为」用的是浏览器原生能力：`Blob` + `URL.createObjectURL` + `<a download>`，
  触发的是浏览器自己的下载，不经过主题中转。
- 编辑器配色跟随页面的亮色 / 暗色 / AMOLED 暗黑模式（内置 `vs` 与 `vs-dark`），
  页面配色切换时实时跟着换。
- Monaco 自身 UI（查找框、右键菜单等）是英文：本地副本没带 `nls.messages.<lang>.js`
  语言包，主题自己的按钮与状态栏文案走 `__()`，中英俄繁都已覆盖。

> 关于「语法高亮」的一个坑（已修）：`editor.main.js` 只内联了语言注册表，**词法本体与
> 语言服务都是懒加载的 AMD 模块**，漏一个文件不会有任何报错，只会静默退化成纯文本。
> 早期版本的本地副本只放了 3 个文件，于是 CDN 被墙时出现「编辑器能打开、但所有语言都是
> 纯文本」。现在按模块清单整组 vendor，并在 `source/assets/vendor/monaco/README.md`
> 里留了升级后必跑的自检脚本。

# Hexo 版相比 Wordpress 版

+ 保留了 Wordpress 版的大部分特性
+ 相同的界面
+ 暂时不支持多语言（欢迎 PR）
+ 目前仅支持 Gitalk、giscus、waline 评论系统（欢迎 PR）

# Telegram 频道
[t.me/argontheme](https://t.me/argontheme)

自动推送更新消息以及其他关于 Argon 的消息

> Readme 待完善...

# 更新日志

## 最新更新
+ 适配现代 Hexo 配置，支持在博客根目录创建 `_config.argon.yml` 管理主题配置
+ 新增标签页与分类页 `/tags`、`/categories`，支持标签云 / 列表 / 栅格卡片三种展示样式，排序、字号、数量上限等均可配置，入口位置与归档页一样由菜单配置决定
+ 修复 Banner 打字效果间隔配置项 `theme.banner_typing_effect_interval` 因键名嵌套错误而失效的问题，现更名为 `banner_typing_effect_interval`（旧写法仍兼容）
+ 修复 Mathjax 2 的 CDN 配置项 `argon_mathjax_v2_cdn_url` 与模板读取键名不一致导致加载 `undefined` 的问题，现更名为 `mathjax_v2_cdn_url`（旧写法仍兼容）
+ 移除已下线的卡片模糊和透明度设置（`card_blur`、`card_opacity`）及相关死代码
+ Giscus 评论系统改为由主题生成配色 CSS：`use_custom_theme: true` 时按 `theme_color` / `card_radius` 烘焙出亮色、`darkmode`、`amoled-dark` 三份，切换配色时通过 `postMessage` 同步给 Giscus，无需刷新；`light_theme` / `dark_theme` / `amoled_dark_theme` 改为只在关闭该开关时生效，用于选择 Giscus 原生主题或第三方主题 URL
+ 修复 Giscus 的 `use_custom_theme`、`light_theme`、`dark_theme` 三个配置项从未被模板读取、评论区始终是 Giscus 原生主题的问题
+ 修复 Giscus 评论区的内边距选择器写成 `.giscus` 但模板渲染出的是 `<div id="giscus">`，导致 `padding` 从未生效、iframe 紧贴卡片边缘的问题
+ 修复 Giscus 评论脚本里 `useCustomTheme` 字段定义后从未传给 script；`data-loading` 之前为空字符串，改为可配置的 `loading`（默认 `lazy`）
+ 修复 Giscus 的 `MutationObserver` 与 `pjax:end` 监听在每次 pjax 跳转后重复叠加的问题
+ 移除 `source/giscus/light.css` 与 `source/giscus/dark.css`：两个文件从未被任何代码引用，
  且其中 17 个 `gsc-*` 类名里有 11 个在 Giscus 中并不存在，`var(--themecolor)` 之类的引用在
  Giscus 的 iframe 里也永远取不到值（iframe 源是 `giscus.app`，拿不到父页面的 CSS 变量）
+ highlight.js 从 v9.18.1 升级到 v11.12.0，官方主题从 96 套换成 v11 `styles/` 根目录的 82 套
  （不含 `styles/base16/` 下的排列变体）
+ 代码框默认主题改为手工编写的 `vscode-light` / `vscode-dark`，完全照搬 VSCode 现代亮色 / 暗色主题（亮色背景 `#FFFFFF`，暗色背景 `#1F1F1F`）
+ 新增 `code_dark_theme`，代码框配色区分亮色与暗色 + 暗黑两档，暗色和暗黑模式共用该主题；
  留空则回落到 `code_theme`，旧配置不受影响
+ 代码框外观重做：去掉原先那个假的 macOS 三点圆点装饰，改成带语言标签的头栏；
  行号槽不再靠 `background: inherit` 伪造背景
+ 代码框交互补全：全屏支持 Esc 退出、点击遮罩退出、退出后焦点归还；
  触屏设备上控制按钮不再隐藏（原先 `opacity:0` 只在 hover 时显示，触屏根本看不到）
+ 修复行内代码背景色写成 `##eff1f5`（双 `#`，整条声明无效）导致亮色模式下没有背景的问题
+ 修复代码框的 `border-radius:100px` 被下一行覆盖的死代码
+ 修复代码框 tooltip 定位硬编码导致溢出的问题
+ 复制按钮原先每渲染一个代码块就 `new` 一个 ClipboardJS 并绑定到全局随机 id，
  pjax 换页后实例与 id 全部泄漏；改为注册单个委托实例
+ 合并两段几乎逐字重复的代码高亮 JS 为一次遍历。原先每个代码块会被处理两次，
  生成两个行号表格和两个控制区
+ 代码框头栏移除「全屏」按钮，第 4 个控制按钮改为「在编辑器中打开」：点击后弹出全屏 Monaco 编辑器
  （Monaco 即 VS Code 的编辑器内核，与 vscode.dev 同源），可直接修改代码、复制或「另存为」下载到本地，
  编辑器配色跟随页面亮色 / 暗色 / AMOLED 暗黑模式
+ 新增 `enable_codeblock_editor`（默认 `true`）与 `monaco_cdn_url` 两个配置项。Monaco 走 CDN 优先、
  `source/assets/vendor/monaco/`（3 个文件，约 3.75 MiB）本地兼底，只在点击按钮时才加载，
  不进首屏的 `argon_js_merged.js`；按语言自动决定另存为的扩展名，未识别语言存为 `.txt`
+ 随之清理全屏按钮的遗留死代码：`setCodeblockFullscreen()` 与三个委托处理器（按钮点击、遮罩点击、Esc）、
  `.hljs-fullscreen-backdrop`、`body.hljs-fullscreen-open`、`.hljs-codeblock-fullscreen`、
  `@keyframes codeblock-fullscreen`，以及 `全屏` / `退出全屏` 在 en_US / ru_RU / zh_TW 三份词典中的条目；
  其中的滚动锁定与关闭后焦点归还两处设计被编辑层沿用
+ **修复「CDN 被墙时编辑器里所有语言都是纯文本」**：`editor.main.js` 只内联语言注册表，
  词法本体是懒加载的 AMD 模块，而本地副本此前只放了 3 个文件，语言模块 404 后 Monaco
  静默降级为纯文本。现在补齐 81 个 `basic-languages` 词法模块
+ **接上真实语言服务**：补齐 `vs/language/**`（json / css / html / typescript 的 `*Mode.js` 与
  `*Worker.js`）、通用 `base/worker/workerMain.js` 与图标字体 `codicon.ttf`；
  `MonacoEnvironment` 从「空转 stub worker」改为**同源 blob 代理**，这样走 CDN 时也能创建 worker
  （worker 脚本受同源策略约束，不能直接 `new Worker(cdnUrl)`）。本地副本从 3 个文件 3.75 MiB
  增至 94 个文件 11.56 MiB（gzip 2.81 MiB），仍是点击后才按需加载
+ 补齐语言映射：`objective-c` / `swift` / `vb` / `php-template` / `shell-session` / `mdx` / `pug` /
  `fsharp` / `scala` / `dart` / `scheme` / `tcl` / `systemverilog` / `cypher` / `bicep` / `azcli` /
  `sparql` / `liquid` / `apex` / `wgsl` / XML 家族；`diff` 与 `makefile` 改为运行时注册的精简
  Monarch 规则（`argon-diff` / `argon-makefile`），与页面 highlight.js 的表现对齐；
  表里没有的语言再用别名 / 扩展名去 Monaco 注册表兜底猜一次，
  但显式登记为「确实没有」的语言（如 matlab / nginx）不参与兜底，避免张冠李戴
+ 编辑层新增状态栏（对齐 VSCode 底栏）：左侧 `行 x, 列 y` 与选中字符数，右侧缩进 / 换行符 /
  **语言切换器**（可手动指定识别不出的语言，切换后着色与另存为扩展名同步变化）
+ 编辑层工具条新增 查找 / 替换 / 减小字号 / 增大字号 / 折行开关；字号与折行都复用 Monaco
  自带 action（`actions.find`、`editor.action.startFindReplaceAction`），不自己造轮子
+ 修复 Esc 的语义：改为**捕获阶段**分层关闭，先关查找框 / 命令面板，最后才关编辑层。
  原先无条件关闭整个编辑层，会连查找框一起关掉
+ 新增 `查找` / `替换` / `折行` / `增大字号` / `减小字号` / `选择语言` / `行` / `列` /
  `已选择` / `个字符` / `空格` / `制表符` / `换行符` 共 13 条文案，en_US / ru_RU / zh_TW 三份词典同步补齐
+ 修复编辑层加载失败时的 `TypeError`（`getCodeLanguage()` 传了 DOM 元素而不是 jQuery 对象），
  该异常会让编辑层直接打不开

## 20201031 v1.0.2
+ 新增不蒜子用于统计访问人次和文章阅读量
+ 再次修复 Page 生成问题
+ 更改高亮显示颜色为红色
+ 修复 Gitalk 评论不加载问题
+ 修复文章目录不能数字+标题的问题

## 20200908 v1.0.1
+ 修复搜索结果点击后不会关闭问题
+ 修复手机搜索按钮重复问题
+ 修复 Page 生成问题

## 20200905 v1.0.0
+ 增加文章自定义摘要
+ 支持 More 标签
+ 修复 Gitalk 边距问题

## 20200822 v1.0.0.beta
+ 最初版本
