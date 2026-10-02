// 标签云/标签列表页 与 分类页 生成器
// 默认生成 /tags/index.html 与 /categories/index.html 两个独立页面，
// 页面通过 data.argon_taxonomy_index 区分类型（tag / category），
// 由 layout/layout.ejs 渲染成完整的头部 + 侧边栏 + 页脚结构。
// 注意：博客根目录的 _config.argon.yml 会整体覆盖主题配置（见 functions.js 的 before_generate），
// 因此 enable_tag_page / enable_category_page 在未定义时必须视为「开启」。
hexo.extend.generator.register('argon_taxonomy_index', function (locals) {
	var themeConfig = hexo.theme.config || {};

	var entries = [
		{ type: 'tag', dir: hexo.config.tag_dir || 'tags', title: '标签', enableKey: 'enable_tag_page' },
		{ type: 'category', dir: hexo.config.category_dir || 'categories', title: '分类', enableKey: 'enable_category_page' }
	];

	var pages = [];
	entries.forEach(function (entry) {
		// 显式配置为 false 时才关闭，未定义（undefined）保持默认开启
		if (themeConfig[entry.enableKey] === false) {
			return;
		}

		var dir = String(entry.dir).replace(/^\/+/, '').replace(/\/+$/, '');
		var path = dir + '/index.html';

		// 如果用户已经在 source/tags/index.md 或 source/categories/index.md 中手写了页面，
		// 则不生成，交由用户自己的页面优先，避免路由冲突
		var existed = false;
		if (locals && locals.pages && typeof locals.pages.findOne === 'function') {
			existed = locals.pages.findOne({ path: path }) != null;
		}
		if (existed) {
			hexo.log.warn('[argon] 检测到已存在页面 ' + path + '，' + entry.title + '页已跳过生成，请使用你自己创建的页面。');
			return;
		}

		pages.push({
			path: path,
			layout: ['layout'],
			data: {
				title: entry.title,
				argon_taxonomy_index: entry.type
			}
		});
	});

	return pages;
});