// 读配置文件
hexo.extend.filter.register('before_generate', function () {
	var rootConfig = hexo.config;
	var themeConfig = hexo.theme.config || {};

	// 读取博客根目录下的 _config.argon.yml
	var blogArgonConfigPath = hexo.base_dir + '_config.argon.yml';
	var fs = require('fs');
	var yaml = require('js-yaml');
	var blogArgonConfig = {};

	if (fs.existsSync(blogArgonConfigPath)) {
		try {
			var blogArgonConfigContent = fs.readFileSync(blogArgonConfigPath, 'utf8');
			blogArgonConfig = yaml.load(blogArgonConfigContent);
			// 直接使用 _config.argon.yml 的配置，不合并
			hexo.theme.config = blogArgonConfig;
			hexo.theme.config.rootConfig = rootConfig;
		} catch (e) {
			console.error('Error loading _config.argon.yml:', e);
			// 加载失败时使用主题默认配置
			hexo.theme.config = themeConfig;
			hexo.theme.config.rootConfig = rootConfig;
		}
	} else {
		// 不存在 _config.argon.yml 时使用主题默认配置
		hexo.theme.config = themeConfig;
		hexo.theme.config.rootConfig = rootConfig;
	}
});


hexo.extend.helper.register('get_option', function(value, defaultValue){
	if (value.length == 0){
		return defaultValue;
	}
	return value;
});

// 文章头图
hexo.extend.helper.register('get_first_image_of_article', function(post){
	let match = post.content.match(/<img(.*?)src="((http:|https:)?\/\/(.*?))"(.*?)\/.>/i);
	if (match != null){
		return match[2];
	}
	return false;
});
hexo.extend.helper.register('has_thumbnail', function(post, theme){
	if (post.thumbnail != undefined){
		return true;
	}
	if (post.first_image_as_thumbnail === false){
		return false;
	}
	if (!theme.first_image_as_thumbnail && post.first_image_as_thumbnail !== true){
		return false;
	}
	if (this.get_first_image_of_article(post) == false){
		return false;
	}
	return true;
});
hexo.extend.helper.register('get_thumbnail', function(post, theme){
	if (post.thumbnail != undefined){
		return post.thumbnail;
	}
	if (!theme.first_image_as_thumbnail){
		return false;
	}
	return this.get_first_image_of_article(post);
});

// 颜色计算
hexo.extend.helper.register('rgb2hsl', function(R,G,B){
	let r = R / 255;
	let g = G / 255;
	let b = B / 255;

	let var_Min = Math.min(r, g, b);
	let var_Max = Math.max(r, g, b);
	let del_Max = var_Max - var_Min;

	let H, S, L = (var_Max + var_Min) / 2;

	if (del_Max == 0){
		H = 0;
		S = 0;
	}else{
		if (L < 0.5){
			S = del_Max / (var_Max + var_Min);
		}else{
			S = del_Max / (2 - var_Max - var_Min);
		}

		del_R = (((var_Max - r) / 6) + (del_Max / 2)) / del_Max;
		del_G = (((var_Max - g) / 6) + (del_Max / 2)) / del_Max;
		del_B = (((var_Max - b) / 6) + (del_Max / 2)) / del_Max;

		if (r == var_Max){
			H = del_B - del_G;
		}
		else if (g == var_Max){
			H = (1 / 3) + del_R - del_B;
		}
		else if (b == var_Max){
			H = (2 / 3) + del_G - del_R;
		}
		if (H < 0) H += 1;
		if (H > 1) H -= 1;
	}
	return {
		'h': H, // 0~1
		's': S,
		'l': L
	};
});
hexo.extend.helper.register('Hue_2_RGB', function(v1,v2,vH){
	if (vH < 0) vH += 1;
	if (vH > 1) vH -= 1;
	if ((6 * vH) < 1) return (v1 + (v2 - v1) * 6 * vH);
	if ((2 * vH) < 1) return v2;
	if ((3 * vH) < 2) return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
	return v1;
});
hexo.extend.helper.register('hsl2rgb', function(h,s,l){
	let r, g, b, var_1, var_2;
	if (s == 0){
		r = l;
		g = l;
		b = l;
	}
	else{
		if (l < 0.5){
			var_2 = l * (1 + s);
		}
		else{
			var_2 = (l + s) - (s * l);
		}
		var_1 = 2 * l - var_2;
		r = this.Hue_2_RGB(var_1, var_2, h + (1 / 3));
		g = this.Hue_2_RGB(var_1, var_2, h);
		b = this.Hue_2_RGB(var_1, var_2, h - (1 / 3));
	}
	return {
		'R': Math.round(r * 255), // 0~255
		'G': Math.round(g * 255),
		'B': Math.round(b * 255),
		'r': r, // 0~1
		'g': g,
		'b': b
	};
});
hexo.extend.helper.register('rgb2hex', function(r,g,b){
	let hex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F');
	let rh, gh, bh;
	rh = "", gh = "", bh = "";
	while (rh.length < 2){
		rh = hex[r%16] + rh;
		r = Math.floor(r / 16);
	}
	while (gh.length < 2){
		gh = hex[g%16] + gh;
		g = Math.floor(g / 16);
	}
	while (bh.length < 2){
		bh = hex[b%16] + bh;
		b = Math.floor(b / 16);
	}
	return "#" + rh + gh + bh;
});
hexo.extend.helper.register('hex2rgb', function(hex){
	// hex: #XXXXXX
	hex = hex.toUpperCase();
	let dec = {
		'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
	};
	return {
		'R': (dec[hex.substr(1,1)] * 16 + dec[hex.substr(2,1)]), // 0~255
		'G': (dec[hex.substr(3,1)] * 16 + dec[hex.substr(4,1)]),
		'B': (dec[hex.substr(5,1)] * 16 + dec[hex.substr(6,1)]),
		'r': (dec[hex.substr(1,1)] * 16 + dec[hex.substr(2,1)]) / 255, // 0~1
		'g': (dec[hex.substr(3,1)] * 16 + dec[hex.substr(4,1)]) / 255,
		'b': (dec[hex.substr(5,1)] * 16 + dec[hex.substr(6,1)]) / 255
	};
});
hexo.extend.helper.register('rgb2gray', function(R,G,B){
	return Math.round(R * 0.299 + G * 0.587 + B * 0.114);
});
hexo.extend.helper.register('hex2gray', function(hex){
	let rgb_array = this.hex2rgb(hex);
	return this.hex2gray(rgb_array['R'], rgb_array['G'], rgb_array['B']);
});
hexo.extend.helper.register('rgb2str', function(rgb){
	return rgb['R'] + "," + rgb['G'] + "," + rgb['B'];
});
hexo.extend.helper.register('hex2str', function(hex){
	return this.rgb2str(this.hex2rgb(hex));
});


// https://github.com/willin/hexo-wordcount
var util = require('hexo-util');
var stripHTML = util.stripHTML;

var counter = function (content) {
	content = stripHTML(content);
	const cn = (content.match(/[\u4E00-\u9FA5]/g) || []).length;
	const en = (content.replace(/[\u4E00-\u9FA5]/g, '').match(/[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g) || []).length;
	return [cn, en];
};

hexo.extend.helper.register('min2read', function (content, { cn = 300, en = 160 } = {}) {
	var len = counter(content);
	var readingTime = len[0] / cn + len[1] / en;
	return readingTime < 1 ? '1' : parseInt(readingTime, 10);
});

hexo.extend.helper.register('wordcount', function (content) {
	var len = counter(content);
	var count = len[0] + len[1];
	if (count < 1000) {
		return count;
	}
	return Math.round(count / 100) / 10 + 'k';
});

hexo.extend.helper.register('totalcount', function (site) {
	var count = 0;
	site.posts.forEach(function (post) {
		var len = counter(post.content);
		count += len[0] + len[1];
	});
	if (count < 1000) {
		return count;
	}
	return Math.round(count / 100) / 10 + 'k';
});

// excerpt
hexo.extend.helper.register('getexcerpt', function (content, len, moretag) {
	content = stripHTML(content);
	if (moretag){
		if (content.search(/<!--more(.*?)-->/i) !== -1){
			return content.substr(0, content.search(/<!--more(.*?)-->/i)) + "...";
		}
	}
	if (content.length <= len){
		return content;
	}
	return content.substr(0,len) + "...";
});

// 预处理文章
hexo.extend.helper.register('argon_preprocess_article', function (content, theme, moretag) {
	// Lazyload
	if (theme.enable_lazyload){
		let lazyload_loading_style = theme.lazyload_loading_style;
		if (lazyload_loading_style == undefined || lazyload_loading_style == ''){
			lazyload_loading_style = 'none';
		}
		lazyload_loading_style = "lazyload-style-" + lazyload_loading_style;

		content = content.replace(/<img(.+)src=[\'"]([^\'"]+)[\'"](.*)>/ig,"<img class=\"lazyload " + lazyload_loading_style + "\" src=\"data:image/svg+xml;base64,PCEtLUFyZ29uTG9hZGluZy0tPgo8c3ZnIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjZmZmZmZmMDAiPjxnPjwvZz4KPC9zdmc+\" \$1data-original=\"\$2\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC\"\$3>\n");
		content = content.replace(/<img(.*?)data-full-url=[\'"]([^\'"]+)[\'"](.*)>/ig,"<img$1data-full-url=\"$2\" data-original=\"$2\"$3>");
		content = content.replace(/<img(.*?)srcset=[\'"](.*?)[\'"](.*)>/ig,"<img$1$3>");
	}
	// 处理代码块，移除外部的 figure 和 table 包装
	// 匹配所有带有 language 类的代码块
	content = content.replace(/<figure class="highlight [^>]*"><table><tr><td class="gutter"><pre>.*?<\/pre><\/td><td class="code">(<pre.*?<\/pre>)<\/td><\/tr><\/table><\/figure>/sg,"$1");
	// More Tag
	if (moretag){
		if (content.search(/<!--more(.*?)-->/i) !== -1){
			content = content.substr(0, content.search(/<!--more(.*?)-->/i)) + "...";
		}
	}
	return content;
});

// 文末信息
hexo.extend.helper.register('get_additional_content_after_post', function (post, theme) {
	if (post.after_post != undefined){
		return post.after_post;
	}
	let res = theme.additional_content_after_post;
	if (res == undefined){
		return "";
	}
	res = res.replace(/\n/g, "</br>");
	res = res.replace(/%url%/g, this.full_url_for(post.path));
	res = res.replace(/%link%/g, '<a href="' + this.full_url_for(post.path) + '" target="_blank">' + this.full_url_for(post.path) + '</a>');
	res = res.replace(/%title%/g, post.title);
	res = res.replace(/%author%/g, post.author);
	return res;
});

// 标签页/分类页配置解析
// 注意：博客根目录的 _config.argon.yml 会整体覆盖主题配置（见本文件顶部的 before_generate），
// 因此每个配置项都必须在此处提供兜底默认值，不能依赖主题 _config.yml。
hexo.extend.helper.register('argon_taxonomy_config', function (type) {
	const prefix = (type == 'category') ? 'category_page_' : 'tag_page_';
	// Hexo 会把 helper 绑定到渲染上下文上（this === locals），
	// 但下面的 get() 是普通函数调用，其 this 并不是上下文，所以这里先取出 theme 配置。
	const themeConfig = this.theme || {};
	function get(key, defaultValue) {
		const value = themeConfig[prefix + key];
		return (value === undefined || value === null || value === '') ? defaultValue : value;
	}
	function toNumber(value, defaultValue) {
		const n = parseFloat(value);
		return isNaN(n) ? defaultValue : n;
	}
	const style = String(get('style', 'cloud')).toLowerCase();
	const sort = String(get('sort', 'length')).toLowerCase();
	let font_min = toNumber(get('font_min', 14), 14);
	let font_max = toNumber(get('font_max', 26), 26);
	if (font_min < 8) font_min = 8;
	if (font_max < font_min) font_max = font_min;
	return {
		style: ['cloud', 'list', 'grid'].indexOf(style) >= 0 ? style : 'cloud',
		sort: ['length', 'name', 'none'].indexOf(sort) >= 0 ? sort : 'length',
		order: toNumber(get('order', -1), -1) < 0 ? -1 : 1,
		font_min: font_min,
		font_max: font_max,
		show_count: get('show_count', true) !== false,
		show_card: get('show_card', true) !== false,
		limit: Math.max(0, Math.floor(toNumber(get('limit', 0), 0))),
		empty_text: String(get('empty_text', ''))
	};
});
