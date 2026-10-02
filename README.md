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
  use_custom_theme: true  # true 使用自定义 CSS，false 使用 Giscus 原生主题
  light_theme: 'light'    # 亮色模式主题
  dark_theme: 'dark'      # 暗色模式主题
```

### 自定义主题模式
- 自动生成与 Argon 主题匹配的 CSS 样式
- 支持 AMOLED 暗色模式
- 自动切换亮色/暗色模式

### Giscus 原生主题模式
- 亮色主题：`light`, `light_tritanopia`, `light_high_contrast`, `preferred_color_scheme`, `transparent`
- 暗色主题：`dark`, `dark_dimmed`, `dark_high_contrast`, `dark_tritanopia`, `transparent`, `preferred_color_scheme`

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
+ 优化 Giscus 评论系统支持，提供自定义 CSS 主题文件，自动适配亮色/暗色模式，可选择使用自定义样式或 Giscus 原生主题

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
