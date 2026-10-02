// Giscus 评论系统自定义主题生成器
//
// 产出 giscus/argon-light.css、argon-dark.css、argon-amoled.css 三个文件，
// 把站点配置的 theme_color / card_radius 烘焙进 CSS，使 Giscus iframe 内的配色
// 与 Argon 的卡片、边框和暗色档位保持一致。
//
// 背景：
// 1. Giscus 的 data-theme 与 setConfig.theme 接受的是「主题值」——原生主题名，或一个
//    CSS 文件的 URL。iframe 的源是 https://giscus.app，所以相对 URL 会解析到 giscus.app
//    域下；站点的 url 配置若写成 http 又会触发混合内容拦截。因此这里只产出稳定路径，
//    绝对 URL 由页面脚本用 window.location.origin 拼接（见 layout/_comment/giscus.ejs）。
// 2. 自定义主题推荐覆盖 Primer 变量而不是 gsc-* 类名（Giscus 官方说明类名与结构会随
//    版本变动），所以下面的变量名取自 Giscus 自带的 custom_example.css。
// 3. 评论 iframe 收不到父页面的 CSS 变量值，setConfig 也只能传一个 URL，所以访客用
//    主题色取色器临时改色时，评论区不会跟着变。这是 Giscus 的限制，没有可行的绕法。
//
// 注意：博客根目录的 _config.argon.yml 会整体覆盖主题配置（见 functions.js 的
// before_generate），因此 theme_color / card_radius 未定义时必须回落到主题默认值。

hexo.extend.generator.register('argon_giscus_theme', function () {
	var DEFAULT_THEME_COLOR = '#5e72e4';
	var DEFAULT_CARD_RADIUS = 4;
	var MAX_CONTROL_RADIUS = 8;
	// 与 style.css 里 body 的字体栈保持一致
	var FONT_STACK = '\'Open Sans\', -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, ' +
		'"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif';

	var themeConfig = hexo.theme.config || {};

	var themeColor = String(themeConfig.theme_color || DEFAULT_THEME_COLOR).trim();
	var cardRadius = parseFloat(themeConfig.card_radius);
	if (isNaN(cardRadius)) {
		cardRadius = DEFAULT_CARD_RADIUS;
	}

	var themeRgb = hexToRgb(themeColor);
	if (!themeRgb) {
		hexo.log.warn('[argon] giscus.theme_color 不是合法的十六进制颜色（' + themeColor + '），已回落到 ' + DEFAULT_THEME_COLOR);
		themeColor = DEFAULT_THEME_COLOR;
		themeRgb = hexToRgb(themeColor);
	}

	// 输入框、按钮这类控件不适合跟着卡片一起变圆，取一个收敛后的值
	var controlRadius = Math.min(cardRadius, MAX_CONTROL_RADIUS);

	function hexToRgb(hex) {
		var matched = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!matched) {
			return null;
		}
		return [parseInt(matched[1], 16), parseInt(matched[2], 16), parseInt(matched[3], 16)];
	}

	function rgbToHex(rgb) {
		return '#' + rgb.map(function (value) {
			var rounded = Math.max(0, Math.min(255, Math.round(value))).toString(16);
			return rounded.length < 2 ? '0' + rounded : rounded;
		}).join('');
	}

	// 向 target 插值，用来生成主色的加深/减淡变体
	function mix(targetColor, ratio) {
		var targetRgb = hexToRgb(targetColor);
		if (!targetRgb) {
			return themeColor;
		}
		return rgbToHex(themeRgb.map(function (value, index) {
			return value + (targetRgb[index] - value) * ratio;
		}));
	}

	// 主色上的按钮文字取黑或白，保证可读
	function contrastText() {
		var luminance = (0.299 * themeRgb[0] + 0.587 * themeRgb[1] + 0.114 * themeRgb[2]) / 255;
		return luminance > 0.62 ? '#1f2328' : '#ffffff';
	}

	var btnPrimaryText = contrastText();
	// 主按钮的 hover / 选中态统一用同一主色的加深版。不能用 accentEmphasis——那一档在
	// 暗色下是提亮的，白字压上去对比度会掉到 2:1 以下。
	var btnPrimaryActiveBg = mix('#000000', 0.15);

	// 三档配色。暗色的边框色直接沿用 Argon 自身的取值
	// （style.css 中 html.darkmode 用 #777，html.darkmode.amoled-dark 用 #333），
	// 让评论区与页面其它卡片看起来是同一套东西。
	var palettes = {
		light: {
			canvas: '#ffffff',
			canvasOverlay: '#ffffff',
			canvasInset: '#f4f5f7',
			canvasSubtle: '#f4f5f7',
			fg: '#333333',
			fgMuted: '#6c757d',
			fgSubtle: '#9aa0a6',
			border: '#dee2e6',
			borderMuted: '#e9ecef',
			neutralMuted: '#f1f3f5',
			btnText: '#333333',
			btnBg: '#f8f9fa',
			btnBorder: '#dee2e6',
			btnHoverText: '#333333',
			btnHoverBg: '#e9ecef',
			btnHoverBorder: '#ced4da',
			btnActiveText: '#333333',
			btnActiveBg: '#dee2e6',
			btnActiveBorder: '#adb5bd',
			accent: themeColor,
			accentEmphasis: mix('#000000', 0.2)
		},
		dark: {
			canvas: '#424242',
			canvasOverlay: '#4a4a4a',
			canvasInset: '#383838',
			canvasSubtle: '#303030',
			fg: '#eeeeee',
			fgMuted: '#cccccc',
			fgSubtle: '#a0a0a0',
			border: '#777777',
			borderMuted: '#555555',
			neutralMuted: '#4a4a4a',
			btnText: '#eeeeee',
			btnBg: '#4a4a4a',
			btnBorder: '#555555',
			btnHoverText: '#ffffff',
			btnHoverBg: '#555555',
			btnHoverBorder: '#666666',
			btnActiveText: '#ffffff',
			btnActiveBg: '#5a5a5a',
			btnActiveBorder: '#777777',
			// 暗色底上主色需要提亮才能保证对比度
			accent: mix('#ffffff', 0.3),
			accentEmphasis: mix('#ffffff', 0.45)
		},
		amoled: {
			canvas: '#000000',
			canvasOverlay: '#0d0d0d',
			canvasInset: '#0a0a0a',
			canvasSubtle: '#111111',
			fg: '#eeeeee',
			fgMuted: '#b0b0b0',
			fgSubtle: '#888888',
			border: '#333333',
			borderMuted: '#242424',
			neutralMuted: '#141414',
			btnText: '#eeeeee',
			btnBg: '#141414',
			btnBorder: '#333333',
			btnHoverText: '#ffffff',
			btnHoverBg: '#1f1f1f',
			btnHoverBorder: '#3d3d3d',
			btnActiveText: '#ffffff',
			btnActiveBg: '#262626',
			btnActiveBorder: '#3d3d3d',
			// 纯黑底上再提亮一档
			accent: mix('#ffffff', 0.4),
			accentEmphasis: mix('#ffffff', 0.55)
		}
	};

	// 与 Giscus 无关的语义色，各档通用
	var semantic = {
		success: '#1f9d55',
		attention: '#b58105',
		attentionMuted: '#9a6700',
		attentionSubtle: '#fff8c5',
		danger: '#cf222e',
		dangerMuted: '#a40e26',
		dangerSubtle: '#ffebe9',
		gray7: '#24292f',
		blue8: '#0a3069'
	};

	function buildCss(mode) {
		var p = palettes[mode];
		var accentRgb = hexToRgb(p.accent);
		var accentRgbStr = accentRgb.join(',');
		var semanticBright = mode === 'light' ? 'light' : 'dark';
		var gray7 = semanticBright === 'light' ? semantic.gray7 : '#adbac7';
		var blue8 = semanticBright === 'light' ? semantic.blue8 : '#316dca';

		var lines = [];
		lines.push('/*');
		lines.push(' * Argon 主题的 Giscus 评论配色（' + mode + '）');
		lines.push(' * 由 hexo generate 自动生成，请勿手工修改');
		lines.push(' * 生成器：themes/argon/scripts/giscus-theme.js');
		lines.push(' */');
		lines.push(':root{');
		lines.push('\t/* Argon 站点变量 */');
		lines.push('\t--argon-card-radius:' + cardRadius + 'px;');
		lines.push('\t--argon-control-radius:' + controlRadius + 'px;');
		lines.push('\t/* 画布与文字 */');
		lines.push('\t--color-canvas-default:' + p.canvas + ';');
		lines.push('\t--color-canvas-overlay:' + p.canvasOverlay + ';');
		lines.push('\t--color-canvas-inset:' + p.canvasInset + ';');
		lines.push('\t--color-canvas-subtle:' + p.canvasSubtle + ';');
		lines.push('\t--color-fg-default:' + p.fg + ';');
		lines.push('\t--color-fg-muted:' + p.fgMuted + ';');
		lines.push('\t--color-fg-subtle:' + p.fgSubtle + ';');
		lines.push('\t--color-border-default:' + p.border + ';');
		lines.push('\t--color-border-muted:' + p.borderMuted + ';');
		lines.push('\t--color-neutral-muted:' + p.neutralMuted + ';');
		lines.push('\t--color-primer-shadow-inset:rgba(31,35,40,0.12);');
		lines.push('\t/* 强调色 */');
		lines.push('\t--color-accent-fg:' + p.accent + ';');
		lines.push('\t--color-accent-emphasis:' + p.accentEmphasis + ';');
		lines.push('\t--color-accent-muted:rgba(' + accentRgbStr + ',0.4);');
		lines.push('\t--color-accent-subtle:rgba(' + accentRgbStr + ',0.12);');
		lines.push('\t--color-social-reaction-bg-hover:rgba(' + accentRgbStr + ',0.12);');
		lines.push('\t--color-social-reaction-bg-reacted-hover:rgba(' + accentRgbStr + ',0.2);');
		lines.push('\t/* 按钮 */');
		lines.push('\t--color-btn-text:' + p.btnText + ';');
		lines.push('\t--color-btn-bg:' + p.btnBg + ';');
		lines.push('\t--color-btn-border:' + p.btnBorder + ';');
		lines.push('\t--color-btn-shadow:rgba(31,35,40,0.12);');
		lines.push('\t--color-btn-inset-shadow:rgba(255,255,255,0.15);');
		lines.push('\t--color-btn-hover-bg:' + p.btnHoverBg + ';');
		lines.push('\t--color-btn-hover-border:' + p.btnHoverBorder + ';');
		lines.push('\t--color-btn-active-bg:' + p.btnActiveBg + ';');
		lines.push('\t--color-btn-active-border:' + p.btnActiveBorder + ';');
		lines.push('\t--color-btn-primary-text:' + btnPrimaryText + ';');
		lines.push('\t--color-btn-primary-bg:' + themeColor + ';');
		lines.push('\t--color-btn-primary-border:rgba(31,35,40,0.15);');
		lines.push('\t--color-btn-primary-shadow:rgba(31,35,40,0.3);');
		lines.push('\t--color-btn-primary-inset-shadow:rgba(255,255,255,0.15);');
		lines.push('\t--color-btn-primary-hover-bg:' + btnPrimaryActiveBg + ';');
		lines.push('\t--color-btn-primary-hover-border:rgba(31,35,40,0.2);');
		lines.push('\t--color-btn-primary-selected-bg:' + btnPrimaryActiveBg + ';');
		lines.push('\t--color-btn-primary-selected-shadow:rgba(31,35,40,0.35);');
		lines.push('\t--color-btn-primary-disabled-text:' + p.btnText + ';');
		lines.push('\t--color-btn-primary-disabled-bg:' + p.neutralMuted + ';');
		lines.push('\t--color-btn-primary-disabled-border:rgba(31,35,40,0.1);');
		lines.push('\t/* 分段控件与操作列表 */');
		lines.push('\t--color-segmented-control-bg:' + p.neutralMuted + ';');
		lines.push('\t--color-segmented-control-button-bg:' + p.canvas + ';');
		lines.push('\t--color-segmented-control-button-selected-border:' + themeColor + ';');
		lines.push('\t--color-action-list-item-default-hover-bg:' + p.neutralMuted + ';');
		lines.push('\t/* 语义色 */');
		lines.push('\t--color-success-fg:' + semantic.success + ';');
		lines.push('\t--color-attention-fg:' + semantic.attention + ';');
		lines.push('\t--color-attention-muted:' + semantic.attentionMuted + ';');
		lines.push('\t--color-attention-subtle:' + semantic.attentionSubtle + ';');
		lines.push('\t--color-danger-fg:' + semantic.danger + ';');
		lines.push('\t--color-danger-muted:' + semantic.dangerMuted + ';');
		lines.push('\t--color-danger-subtle:' + semantic.dangerSubtle + ';');
		lines.push('\t--color-scale-gray-7:' + gray7 + ';');
		lines.push('\t--color-scale-blue-8:' + blue8 + ';');
		lines.push('}');
		lines.push('');
		lines.push('main{');
		lines.push('\t/* Giscus 自定义主题的默认样式是 margin-top:4rem，这里紧贴卡片 */');
		lines.push('\tmargin-top:0;');
		lines.push('\tborder-radius:var(--argon-card-radius);');
		lines.push('\tfont-family:' + FONT_STACK + ';');
		lines.push('\tline-height:1.6;');
		lines.push('}');
		lines.push('');
		lines.push('/* Giscus 的变量体系不涉及圆角，这几个是必要的结构覆盖。');
		lines.push(' * 类名取自 Giscus 的 styles/base.css，改动前请先核对，');
		lines.push(' * 因为 Giscus 官方说明类名与结构可能随版本变动。 */');
		lines.push('.gsc-comment-box{');
		lines.push('\tborder-radius:var(--argon-card-radius);');
		lines.push('}');
		lines.push('.gsc-comment-box-textarea , .gsc-comment-box-write , .gsc-comment-box-preview ,');
		lines.push('.gsc-direct-reaction-button , .gsc-upvote-button , .gsc-reactions-count , .btn{');
		lines.push('\tborder-radius:var(--argon-control-radius);');
		lines.push('}');
		lines.push('');

		return lines.join('\n');
	}

	var files = [
		{ path: 'giscus/argon-light.css', mode: 'light' },
		{ path: 'giscus/argon-dark.css', mode: 'dark' },
		{ path: 'giscus/argon-amoled.css', mode: 'amoled' }
	];

	// 无条件产出：这几个文件很小，且用户在配置里手填 URL 时也可能引用它们，
	// 这样开关切换不依赖构建顺序。
	return files.map(function (file) {
		return {
			path: file.path,
			data: buildCss(file.mode)
		};
	});
});