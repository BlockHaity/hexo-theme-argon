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

### 方式二：使用 data 目录

将 `Hexo 根目录/themes/argon/_config.yml` 复制到 `Hexo 根目录/source/_data` 文件夹中，并重命名为 `argon.yml`，然后修改复制后的配置文件。

### 主要配置项

- **卡片样式**：支持调节卡片圆角、阴影、模糊程度和透明度
- **主题颜色**：可自定义主题色，支持夜间模式和 AMOLED 暗色模式
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

## 卡片模糊和透明度

主题支持为所有卡片添加模糊和透明度效果：

### 配置文件设置
```yaml
# _config.argon.yml
card_blur: 5      # 卡片模糊程度，0-20px，0为不模糊
card_opacity: 0.95 # 卡片透明度，0-1，1为不透明
```

### 右下角配置菜单调节
1. 点击右下角的设置按钮
2. 使用"模糊"滑块调节卡片模糊程度（0-20px）
3. 使用"透明度"滑块调节卡片透明度（0.3-1）
4. 设置会自动保存到本地存储

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
+ 新增卡片模糊和透明度效果，可在配置文件中设置，也支持在右下角配置菜单中实时调节
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
