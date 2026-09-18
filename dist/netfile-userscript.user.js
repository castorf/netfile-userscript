// ==UserScript==
// @name         NetFile ActBlue Assistant
// @namespace    https://github.com/castor
// @version      1.0.0
// @author       Castor Fu
// @description  Assists with entering ActBlue contributions into NetFile Campaign Disclosure
// @license      MIT
// @match        https://netfile.com/Filer/LegacyFree/*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function() {
	"use strict";
	var s$2 = new Set();
	var _css = async (t) => {
		if (s$2.has(t)) return;
		s$2.add(t);
		((c) => {
			if (typeof GM_addStyle === "function") GM_addStyle(c);
			else (document.head || document.documentElement).appendChild(document.createElement("style")).append(c);
		})(t);
	};
	var n;
	var l$1;
	var u$2;
	var i$2;
	var r$1;
	var o$1;
	var e$1;
	var f$2;
	var c$1;
	var a$1;
	var s$1;
	var h$1;
	var p$1;
	var v$1;
	var d$1 = {};
	var w$1 = [];
	var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
	var g = Array.isArray;
	function m$1(n, l) {
		for (var u in l) n[u] = l[u];
		return n;
	}
	function b(n) {
		n && n.parentNode && n.parentNode.removeChild(n);
	}
	function k$1(l, u, t) {
		var i, r, o, e = {};
		for (o in u) "key" == o ? i = u[o] : "ref" == o ? r = u[o] : e[o] = u[o];
		if (arguments.length > 2 && (e.children = arguments.length > 3 ? n.call(arguments, 2) : t), "function" == typeof l && null != l.defaultProps) for (o in l.defaultProps) void 0 === e[o] && (e[o] = l.defaultProps[o]);
		return x(l, e, i, r, null);
	}
	function x(n, t, i, r, o) {
		var e = {
			type: n,
			props: t,
			key: i,
			ref: r,
			__k: null,
			__: null,
			__b: 0,
			__e: null,
			__c: null,
			constructor: void 0,
			__v: null == o ? ++u$2 : o,
			__i: -1,
			__u: 0
		};
		return null == o && null != l$1.vnode && l$1.vnode(e), e;
	}
	function S(n) {
		return n.children;
	}
	function C$1(n, l) {
		this.props = n, this.context = l;
	}
	function $(n, l) {
		if (null == l) return n.__ ? $(n.__, n.__i + 1) : null;
		for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
		return "function" == typeof n.type ? $(n) : null;
	}
	function I(n) {
		if (n.__P && n.__d) {
			var u = n.__v, t = u.__e, i = [], r = [], o = m$1({}, u);
			o.__v = u.__v + 1, l$1.vnode && l$1.vnode(o), q(n.__P, o, u, n.__n, n.__P.namespaceURI, 32 & u.__u ? [t] : null, i, null == t ? $(u) : t, !!(32 & u.__u), r), o.__v = u.__v, o.__.__k[o.__i] = o, D$1(i, o, r), u.__e = u.__ = null, o.__e != t && P(o);
		}
	}
	function P(n) {
		if (null != (n = n.__) && null != n.__c) return n.__e = n.__c.base = null, n.__k.some(function(l) {
			if (null != l && null != l.__e) return n.__e = n.__c.base = l.__e;
		}), P(n);
	}
	function A$1(n) {
		(!n.__d && (n.__d = !0) && i$2.push(n) && !H.__r++ || r$1 != l$1.debounceRendering) && ((r$1 = l$1.debounceRendering) || o$1)(H);
	}
	function H() {
		try {
			for (var n, l = 1; i$2.length;) i$2.length > l && i$2.sort(e$1), n = i$2.shift(), l = i$2.length, I(n);
		} finally {
			i$2.length = H.__r = 0;
		}
	}
	function L(n, l, u, t, i, r, o, e, f, c, a) {
		var s, h, p, v, y, _, g = t && t.__k || w$1, m = l.length;
		for (f = T$1(u, l, g, f, m), s = 0; s < m; s++) null != (p = u.__k[s]) && (h = -1 != p.__i && g[p.__i] || d$1, p.__i = s, _ = q(n, p, h, i, r, o, e, f, c, a), v = p.__e, p.ref && h.ref != p.ref && (h.ref && J(h.ref, null, p), a.push(p.ref, p.__c || v, p)), null == y && null != v && (y = v), 4 & p.__u ? (f = j$1(p, f, n), h.__e && (h.__e = null)) : "function" == typeof p.type && void 0 !== _ ? f = _ : v && (f = v.nextSibling), p.__u &= -7);
		return u.__e = y, f;
	}
	function T$1(n, l, u, t, i) {
		var r, o, e, f, c, a = u.length, s = a, h = 0;
		for (n.__k = new Array(i), r = 0; r < i; r++) null != (o = l[r]) && "boolean" != typeof o && "function" != typeof o ? ("string" == typeof o || "number" == typeof o || "bigint" == typeof o || o.constructor == String ? o = n.__k[r] = x(null, o, null, null, null) : g(o) ? o = n.__k[r] = x(S, { children: o }, null, null, null) : void 0 === o.constructor && o.__b > 0 ? o = n.__k[r] = x(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : n.__k[r] = o, f = r + h, o.__ = n, o.__b = n.__b + 1, e = null, -1 != (c = o.__i = O(o, u, f, s)) && (s--, (e = u[c]) && (e.__u |= 2)), null == e || null == e.__v ? (-1 == c && (i > a ? h-- : i < a && h++), "function" != typeof o.type && (o.__u |= 4)) : c != f && (c == f - 1 ? h-- : c == f + 1 ? h++ : (c > f ? h-- : h++, o.__u |= 4))) : n.__k[r] = null;
		if (s) for (r = 0; r < a; r++) null != (e = u[r]) && 0 == (2 & e.__u) && (e.__e == t && (t = $(e)), K(e, e));
		return t;
	}
	function j$1(n, l, u) {
		var t, i;
		if ("function" == typeof n.type) {
			for (t = n.__k, i = 0; t && i < t.length; i++) t[i] && (t[i].__ = n, l = j$1(t[i], l, u));
			return l;
		}
		n.__e != l && (l && n.type && !l.parentNode && (l = $(n)), l = u.insertBefore(n.__e, l || null));
		do
			l = l && l.nextSibling;
		while (null != l && 8 == l.nodeType);
		return l;
	}
	function O(n, l, u, t) {
		var i, r, o, e = n.key, f = n.type, c = l[u], a = null != c && 0 == (2 & c.__u);
		if (null === c && null == e || a && e == c.key && f == c.type) return u;
		if (t > (a ? 1 : 0)) {
			for (i = u - 1, r = u + 1; i >= 0 || r < l.length;) if (null != (c = l[o = i >= 0 ? i-- : r++]) && 0 == (2 & c.__u) && e == c.key && f == c.type) return o;
		}
		return -1;
	}
	function z$1(n, l, u) {
		"-" == l[0] ? n.setProperty(l, null == u ? "" : u) : n[l] = null == u ? "" : "number" != typeof u || _.test(l) ? u : u + "px";
	}
	function N(n, l, u, t, i) {
		var r, o;
		n: if ("style" == l) if ("string" == typeof u) n.style.cssText = u;
		else {
			if ("string" == typeof t && (n.style.cssText = t = ""), t) for (l in t) u && l in u || z$1(n.style, l, "");
			if (u) for (l in u) t && u[l] == t[l] || z$1(n.style, l, u[l]);
		}
		else if ("o" == l[0] && "n" == l[1]) r = l != (l = l.replace(s$1, "$1")), o = l.toLowerCase(), l = o in n || "onFocusOut" == l || "onFocusIn" == l ? o.slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + r] = u, u ? t ? u[a$1] = t[a$1] : (u[a$1] = h$1, n.addEventListener(l, r ? v$1 : p$1, r)) : n.removeEventListener(l, r ? v$1 : p$1, r);
		else {
			if ("http://www.w3.org/2000/svg" == i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
			else if ("width" != l && "height" != l && "href" != l && "list" != l && "form" != l && "tabIndex" != l && "download" != l && "rowSpan" != l && "colSpan" != l && "role" != l && "popover" != l && l in n) try {
				n[l] = null == u ? "" : u;
				break n;
			} catch (n) {}
			"function" == typeof u || (null == u || !1 === u && "-" != l[4] ? n.removeAttribute(l) : n.setAttribute(l, "popover" == l && 1 == u ? "" : u));
		}
	}
	function V(n) {
		return function(u) {
			if (this.l) {
				var t = this.l[u.type + n];
				if (null == u[c$1]) u[c$1] = h$1++;
				else if (u[c$1] < t[a$1]) return;
				return t(l$1.event ? l$1.event(u) : u);
			}
		};
	}
	function q(n, u, t, i, r, o, e, f, c, a) {
		var s, h, p, v, y, d, _, k, x, M, I, P, A, H, T, j, F = u.type;
		if (void 0 !== u.constructor) return null;
		128 & t.__u && (c = !!(32 & t.__u), o = [f = u.__e = t.__e]), (s = l$1.__b) && s(u);
		n: if ("function" == typeof F) {
			h = e.length;
			try {
				if (x = u.props, M = F.prototype && F.prototype.render, I = (s = F.contextType) && i[s.__c], P = s ? I ? I.props.value : s.__ : i, t.__c ? k = (p = u.__c = t.__c).__ = p.__E : (M ? u.__c = p = new F(x, P) : (u.__c = p = new C$1(x, P), p.constructor = F, p.render = Q), I && I.sub(p), p.state || (p.state = {}), p.__n = i, v = p.__d = !0, p.__h = [], p._sb = []), M && null == p.__s && (p.__s = p.state), M && null != F.getDerivedStateFromProps && (p.__s == p.state && (p.__s = m$1({}, p.__s)), m$1(p.__s, F.getDerivedStateFromProps(x, p.__s))), y = p.props, d = p.state, p.__v = u, v) M && null == F.getDerivedStateFromProps && null != p.componentWillMount && p.componentWillMount(), M && null != p.componentDidMount && p.__h.push(p.componentDidMount);
				else {
					if (M && null == F.getDerivedStateFromProps && x !== y && null != p.componentWillReceiveProps && p.componentWillReceiveProps(x, P), u.__v == t.__v || !p.__e && null != p.shouldComponentUpdate && !1 === p.shouldComponentUpdate(x, p.__s, P)) {
						u.__v != t.__v && (p.props = x, p.state = p.__s, p.__d = !1), u.__e = t.__e, u.__k = t.__k, u.__k.some(function(n) {
							n && (n.__ = u);
						}), w$1.push.apply(p.__h, p._sb), p._sb = [], p.__h.length && e.push(p), f = $(t);
						break n;
					}
					null != p.componentWillUpdate && p.componentWillUpdate(x, p.__s, P), M && null != p.componentDidUpdate && p.__h.push(function() {
						p.componentDidUpdate(y, d, _);
					});
				}
				if (p.context = P, p.props = x, p.__P = n, p.__e = !1, A = l$1.__r, H = 0, M) p.state = p.__s, p.__d = !1, A && A(u), s = p.render(p.props, p.state, p.context), w$1.push.apply(p.__h, p._sb), p._sb = [];
				else do
					p.__d = !1, A && A(u), s = p.render(p.props, p.state, p.context), p.state = p.__s;
				while (p.__d && ++H < 25);
				p.state = p.__s, null != p.getChildContext && (i = m$1(m$1({}, i), p.getChildContext())), M && !v && null != p.getSnapshotBeforeUpdate && (_ = p.getSnapshotBeforeUpdate(y, d)), T = null != s && s.type === S && null == s.key ? E(s.props.children) : s, f = L(n, g(T) ? T : [T], u, t, i, r, o, e, f, c, a), p.base = u.__e, u.__u &= -161, p.__h.length && e.push(p), k && (p.__E = p.__ = null);
			} catch (n) {
				if (e.length = h, u.__v = null, c || null != o) {
					if (n.then) {
						for (u.__u |= c ? 160 : 128; f && 8 == f.nodeType && f.nextSibling;) f = f.nextSibling;
						null != o && (o[o.indexOf(f)] = null), u.__e = f;
					} else if (null != o) for (j = o.length; j--;) b(o[j]);
				} else u.__e = t.__e;
				u.__k ??= t.__k || [], n.then || B$1(u), l$1.__e(n, u, t);
			}
		} else null == o && u.__v == t.__v ? (u.__k = t.__k, u.__e = t.__e) : f = u.__e = G(t.__e, u, t, i, r, o, e, c, a);
		return (s = l$1.diffed) && s(u), 128 & u.__u ? void 0 : f;
	}
	function B$1(n) {
		n && (n.__c && (n.__c.__e = !0), n.__k && n.__k.some(B$1));
	}
	function D$1(n, u, t) {
		for (var i = 0; i < t.length; i++) J(t[i], t[++i], t[++i]);
		l$1.__c && l$1.__c(u, n), n.some(function(u) {
			try {
				n = u.__h, u.__h = [], n.some(function(n) {
					n.call(u);
				});
			} catch (n) {
				l$1.__e(n, u.__v);
			}
		});
	}
	function E(n) {
		return "object" != typeof n || null == n || n.__b > 0 ? n : g(n) ? n.map(E) : void 0 !== n.constructor ? null : m$1({}, n);
	}
	function G(u, t, i, r, o, e, f, c, a) {
		var s, h, p, v, y, w, _, m = i.props || d$1, k = t.props, x = t.type;
		if ("svg" == x ? o = "http://www.w3.org/2000/svg" : "math" == x ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), null != e) {
			for (s = 0; s < e.length; s++) if ((y = e[s]) && "setAttribute" in y == !!x && (x ? y.localName == x : 3 == y.nodeType)) {
				u = y, e[s] = null;
				break;
			}
		}
		if (null == u) {
			if (null == x) return document.createTextNode(k);
			u = document.createElementNS(o, x, k.is && k), c && (l$1.__m && l$1.__m(t, e), c = !1), e = null;
		}
		if (null == x) m === k || c && u.data == k || (u.data = k);
		else {
			if (e = "textarea" == x && null != k.defaultValue ? null : e && n.call(u.childNodes), !c && null != e) for (m = {}, s = 0; s < u.attributes.length; s++) m[(y = u.attributes[s]).name] = y.value;
			for (s in m) y = m[s], "dangerouslySetInnerHTML" == s ? p = y : "children" == s || s in k || "value" == s && "defaultValue" in k || "checked" == s && "defaultChecked" in k || N(u, s, null, y, o);
			for (s in k) y = k[s], "children" == s ? v = y : "dangerouslySetInnerHTML" == s ? h = y : "value" == s ? w = y : "checked" == s ? _ = y : c && "function" != typeof y || m[s] === y || N(u, s, y, m[s], o);
			if (h) c || p && (h.__html == p.__html || h.__html == u.innerHTML) || (u.innerHTML = h.__html), t.__k = [];
			else if (p && (u.innerHTML = ""), L("template" == t.type ? u.content : u, g(v) ? v : [v], t, i, r, "foreignObject" == x ? "http://www.w3.org/1999/xhtml" : o, e, f, e ? e[0] : i.__k && $(i, 0), c, a), null != e) for (s = e.length; s--;) b(e[s]);
			c && "textarea" != x || (s = "value", "progress" == x && null == w ? u.removeAttribute("value") : null != w && (w !== u[s] || "progress" == x && !w || "option" == x && w != m[s]) && N(u, s, w, m[s], o), s = "checked", null != _ && _ != u[s] && N(u, s, _, m[s], o));
		}
		return u;
	}
	function J(n, u, t) {
		try {
			if ("function" == typeof n) {
				var i = "function" == typeof n.__u;
				i && n.__u(), i && null == u || (n.__u = n(u));
			} else n.current = u;
		} catch (n) {
			l$1.__e(n, t);
		}
	}
	function K(n, u, t) {
		var i, r;
		if (l$1.unmount && l$1.unmount(n), (i = n.ref) && (i.current && i.current != n.__e || J(i, null, u)), null != (i = n.__c)) {
			if (i.componentWillUnmount) try {
				i.componentWillUnmount();
			} catch (n) {
				l$1.__e(n, u);
			}
			i.base = i.__P = i.__n = null;
		}
		if (i = n.__k) for (r = 0; r < i.length; r++) i[r] && K(i[r], u, t || "function" != typeof n.type);
		t || b(n.__e), n.__c = n.__ = n.__e = void 0;
	}
	function Q(n, l, u) {
		return this.constructor(n, u);
	}
	function R(u, t, i) {
		var r, o, e, f;
		t == document && (t = document.documentElement), l$1.__ && l$1.__(u, t), o = (r = "function" == typeof i) ? null : i && i.__k || t.__k, e = [], f = [], q(t, u = (!r && i || t).__k = k$1(S, null, [u]), o || d$1, d$1, t.namespaceURI, !r && i ? [i] : o ? null : t.firstChild ? n.call(t.childNodes) : null, e, !r && i ? i : o ? o.__e : t.firstChild, r, f), D$1(e, u, f), u.props.children = null;
	}
	n = w$1.slice, l$1 = { __e: function(n, l, u, t) {
		for (var i, r, o; l = l.__;) if ((i = l.__c) && !i.__) try {
			if ((r = i.constructor) && null != r.getDerivedStateFromError && (i.setState(r.getDerivedStateFromError(n)), o = i.__d), null != i.componentDidCatch && (i.componentDidCatch(n, t || {}), o = i.__d), o) return i.__E = i;
		} catch (l) {
			n = l;
		}
		throw n;
	} }, u$2 = 0, C$1.prototype.setState = function(n, l) {
		var u = null != this.__s && this.__s != this.state ? this.__s : this.__s = m$1({}, this.state);
		"function" == typeof n && (n = n(m$1({}, u), this.props)), n && m$1(u, n), null != n && this.__v && (l && this._sb.push(l), A$1(this));
	}, C$1.prototype.forceUpdate = function(n) {
		this.__v && (this.__e = !0, n && this.__h.push(n), A$1(this));
	}, C$1.prototype.render = S, i$2 = [], o$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$1 = function(n, l) {
		return n.__v.__b - l.__v.__b;
	}, H.__r = 0, f$2 = Math.random().toString(8), c$1 = "__d" + f$2, a$1 = "__a" + f$2, s$1 = /(PointerCapture)$|Capture$/i, h$1 = 0, p$1 = V(!1), v$1 = V(!0);
	var t;
	var r;
	var u$1;
	var i$1;
	var o = 0;
	var f$1 = [];
	var c = l$1;
	var e = c.__b;
	var a = c.__r;
	var v = c.diffed;
	var l = c.__c;
	var m = c.unmount;
	var p = c.__;
	function s(n, t) {
		c.__h && c.__h(r, n, o || t), o = 0;
		var u = r.__H || (r.__H = {
			__: [],
			__h: []
		});
		return n >= u.__.length && u.__.push({}), u.__[n];
	}
	function d(n) {
		return o = 1, y(D, n);
	}
	function y(n, u, i) {
		var o = s(t++, 2);
		if (o.t = n, !o.__c && (o.__ = [i ? i(u) : D(void 0, u), function(n) {
			var t = o.__N ? o.__N[0] : o.__[0], r = o.t(t, n);
			t !== r && (o.__N = [r, o.__[1]], o.__c.setState({}));
		}], o.__c = r, !r.__f)) {
			var f = function(n, t, r) {
				if (!o.__c.__H) return !0;
				var u = !1, i = o.__c.props !== n;
				if (o.__c.__H.__.some(function(n) {
					if (n.__N) {
						u = !0;
						var t = n.__[0];
						n.__ = n.__N, n.__N = void 0, t !== n.__[0] && (i = !0);
					}
				}), c) {
					var f = c.call(this, n, t, r);
					return u ? f || i : f;
				}
				return !u || i;
			};
			r.__f = !0;
			var c = r.shouldComponentUpdate, e = r.componentWillUpdate;
			r.componentWillUpdate = function(n, t, r) {
				if (this.__e) {
					var u = c;
					c = void 0, f(n, t, r), c = u;
				}
				e && e.call(this, n, t, r);
			}, r.shouldComponentUpdate = f;
		}
		return o.__N || o.__;
	}
	function h(n, u) {
		var i = s(t++, 3);
		!c.__s && C(i.__H, u) && (i.__ = n, i.u = u, r.__H.__h.push(i));
	}
	function A(n) {
		return o = 5, T(function() {
			return { current: n };
		}, []);
	}
	function T(n, r) {
		var u = s(t++, 7);
		return C(u.__H, r) && (u.__ = n(), u.__H = r, u.__h = n), u.__;
	}
	function j() {
		for (var n; n = f$1.shift();) {
			var t = n.__H;
			if (n.__P && t) try {
				t.__h.some(z), t.__h.some(B), t.__h = [];
			} catch (r) {
				t.__h = [], c.__e(r, n.__v);
			}
		}
	}
	c.__b = function(n) {
		r = null, e && e(n);
	}, c.__ = function(n, t) {
		n && t.__k && t.__k.__m && (n.__m = t.__k.__m), p && p(n, t);
	}, c.__r = function(n) {
		a && a(n), t = 0;
		var i = (r = n.__c).__H;
		i && (u$1 === r ? (i.__h = [], r.__h = [], i.__.some(function(n) {
			n.__N && (n.__ = n.__N), n.u = n.__N = void 0;
		})) : (i.__h.some(z), i.__h.some(B), i.__h = [], t = 0)), u$1 = r;
	}, c.diffed = function(n) {
		v && v(n);
		var t = n.__c;
		t && t.__H && (t.__H.__h.length && (1 !== f$1.push(t) && i$1 === c.requestAnimationFrame || ((i$1 = c.requestAnimationFrame) || w)(j)), t.__H.__.some(function(n) {
			n.u && (n.__H = n.u, n.u = void 0);
		})), u$1 = r = null;
	}, c.__c = function(n, t) {
		t.some(function(n) {
			try {
				n.__h.some(z), n.__h = n.__h.filter(function(n) {
					return !n.__ || B(n);
				});
			} catch (r) {
				t.some(function(n) {
					n.__h && (n.__h = []);
				}), t = [], c.__e(r, n.__v);
			}
		}), l && l(n, t);
	}, c.unmount = function(n) {
		m && m(n);
		var t, r = n.__c;
		r && r.__H && (r.__H.__.some(function(n) {
			try {
				z(n);
			} catch (n) {
				t = n;
			}
		}), r.__H = void 0, t && c.__e(t, r.__v));
	};
	var k = "function" == typeof requestAnimationFrame;
	function w(n) {
		var t, r = function() {
			clearTimeout(u), k && cancelAnimationFrame(t), setTimeout(n);
		}, u = setTimeout(r, 35);
		k && (t = requestAnimationFrame(r));
	}
	function z(n) {
		var t = r, u = n.__c;
		"function" == typeof u && (n.__c = void 0, u()), r = t;
	}
	function B(n) {
		var t = r;
		n.__c = n.__(), r = t;
	}
	function C(n, t) {
		return !n || n.length !== t.length || t.some(function(t, r) {
			return t !== n[r];
		});
	}
	function D(n, t) {
		return "function" == typeof t ? t(n) : t;
	}
	var MOCK_CONTRIBUTIONS = [
		{
			id: "mock-001",
			orderNumber: "AB-MOCK-101",
			firstName: "Jane",
			lastName: "Doe",
			fullName: "Jane Doe",
			amount: "100.00",
			stripeFee: "2.43",
			actblueFee: "1.05",
			totalFee: "3.48",
			netSettlement: "96.52",
			dateUS: "08/15/2026",
			dateISO: "2026-08-15",
			payoutDate: "2026-08-17",
			address: "100 Sample Way",
			city: "Mountain View",
			state: "CA",
			zip: "94041",
			occupation: "Software Engineer",
			employer: "Acme Tech Inc",
			email: "jane.doe@example.com",
			phone: "650-555-0101"
		},
		{
			id: "mock-002",
			orderNumber: "AB-MOCK-102",
			firstName: "Robert",
			lastName: "Smith",
			fullName: "Robert Smith",
			amount: "250.00",
			stripeFee: "5.73",
			actblueFee: "2.63",
			totalFee: "8.36",
			netSettlement: "241.64",
			dateUS: "08/18/2026",
			dateISO: "2026-08-18",
			payoutDate: "2026-08-20",
			address: "450 Foothill Blvd",
			city: "Los Altos",
			state: "CA",
			zip: "94022",
			occupation: "Retired",
			employer: "Not Employed",
			email: "robert.smith@example.com",
			phone: "650-555-0102"
		},
		{
			id: "mock-003",
			orderNumber: "AB-MOCK-103",
			firstName: "Alice",
			lastName: "Johnson",
			fullName: "Alice Johnson",
			amount: "50.00",
			stripeFee: "1.33",
			actblueFee: "0.53",
			totalFee: "1.86",
			netSettlement: "48.14",
			dateUS: "08/25/2026",
			dateISO: "2026-08-25",
			payoutDate: "2026-08-27",
			address: "789 Castro St",
			city: "Mountain View",
			state: "CA",
			zip: "94040",
			occupation: "Teacher",
			employer: "Local School District",
			email: "alice.j@example.com",
			phone: "650-555-0103"
		}
	];
	function parseCSV(text) {
		const rows = [];
		let currentRow = [];
		let currentVal = "";
		let insideQuote = false;
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			const nextChar = text[i + 1];
			if (char === "\"") {
				if (insideQuote && nextChar === "\"") {
					currentVal += "\"";
					i++;
				} else insideQuote = !insideQuote;
			} else if (char === "," && !insideQuote) {
				currentRow.push(currentVal.trim());
				currentVal = "";
			} else if ((char === "\r" || char === "\n") && !insideQuote) {
				if (char === "\r" && nextChar === "\n") i++;
				currentRow.push(currentVal.trim());
				currentVal = "";
				if (currentRow.length > 1 || currentRow[0] !== "") rows.push(currentRow);
				currentRow = [];
			} else currentVal += char;
		}
		if (currentVal || currentRow.length > 0) {
			currentRow.push(currentVal.trim());
			if (currentRow.length > 1 || currentRow[0] !== "") rows.push(currentRow);
		}
		if (rows.length < 2) return [];
		const headers = rows[0].map((h) => h.trim());
		const results = [];
		for (let r = 1; r < rows.length; r++) {
			const row = rows[r];
			const obj = {};
			for (let c = 0; c < headers.length; c++) obj[headers[c]] = row[c] ?? "";
			results.push(obj);
		}
		return results;
	}
	function convertActBlueCSV(csvText) {
		return parseCSV(csvText).filter((r) => r["Amount"] || r["Donor Last Name"]).map((r) => {
			const dtRaw = (r["Contribution Datetime"] || r["Paid At"] || "").split(" ")[0] || "";
			let dateUS = "";
			let dateISO = dtRaw;
			if (dtRaw.includes("-")) {
				const parts = dtRaw.split("-");
				if (parts.length === 3) {
					dateUS = `${parts[1]}/${parts[2]}/${parts[0]}`;
					dateISO = `${parts[0]}-${parts[1]}-${parts[2]}`;
				}
			} else dateUS = dtRaw;
			const amtNum = parseFloat((r["Amount"] || "0").replace(/[^0-9.]/g, ""));
			const amountStr = isNaN(amtNum) ? "0.00" : amtNum.toFixed(2);
			const stripeNum = parseFloat((r["Stripe Fee Amount"] || "0").replace(/[^0-9.]/g, "")) || 0;
			const feeNum = parseFloat((r["Fee"] || "0").replace(/[^0-9.]/g, "")) || 0;
			const totalFeeNum = stripeNum + feeNum;
			const netNum = parseFloat((r["Net Settlement"] || "0").replace(/[^0-9.]/g, "")) || amtNum - totalFeeNum;
			const payoutDate = (r["Payout Datetime"] || "").split(" ")[0] || "";
			const firstName = (r["Donor First Name"] || "").trim();
			const lastName = (r["Donor Last Name"] || "").trim();
			const fullName = `${firstName} ${lastName}`.trim();
			return {
				id: r["Lineitem ID"] || r["Order Number"] || `item-${Math.random().toString(36).substring(2, 9)}`,
				orderNumber: r["Order Number"] || "",
				firstName,
				lastName,
				fullName,
				amount: amountStr,
				stripeFee: stripeNum.toFixed(2),
				actblueFee: feeNum.toFixed(2),
				totalFee: totalFeeNum.toFixed(2),
				netSettlement: netNum.toFixed(2),
				dateUS,
				dateISO,
				payoutDate,
				address: (r["Donor Address Line 1"] || "").trim(),
				city: (r["Donor City"] || "").trim(),
				state: (r["Donor State"] || "").trim(),
				zip: (r["Donor ZIP"] || "").trim(),
				occupation: (r["Donor Occupation"] || "").trim(),
				employer: (r["Donor Employer"] || "").trim(),
				email: (r["Donor Email"] || "").trim(),
				phone: (r["Donor Phone"] || "").trim()
			};
		});
	}
	function computePayoutBatches(contributions) {
		const map = {};
		for (const c of contributions) {
			const p = c.payoutDate || "Unsettled";
			if (!map[p]) map[p] = {
				count: 0,
				gross: 0,
				stripe: 0,
				fee: 0,
				totalFee: 0,
				net: 0
			};
			map[p].count++;
			map[p].gross += parseFloat(c.amount) || 0;
			map[p].stripe += parseFloat(c.stripeFee) || 0;
			map[p].fee += parseFloat(c.actblueFee) || 0;
			map[p].totalFee += parseFloat(c.totalFee) || 0;
			map[p].net += parseFloat(c.netSettlement) || 0;
		}
		return Object.entries(map).map(([payoutDate, d]) => ({
			payoutDate,
			count: d.count,
			gross: d.gross.toFixed(2),
			stripeFee: d.stripe.toFixed(2),
			actblueFee: d.fee.toFixed(2),
			totalFee: d.totalFee.toFixed(2),
			net: d.net.toFixed(2)
		}));
	}
	function detectCurrentScreen(customUrl, customDoc) {
		const url = customUrl !== void 0 ? customUrl : typeof window !== "undefined" ? window.location.href : "";
		const doc = customDoc !== void 0 ? customDoc : typeof document !== "undefined" ? document : null;
		if (!doc && !url) return "Unknown";
		if (url.includes("/Entity/SelectEntity") || doc?.getElementById?.("EntityName")) return "SelectEntity";
		if (url.includes("/Entity/PeopleAdd") || doc?.getElementById?.("FirstName") && doc?.getElementById?.("BusinessAddress_Line1")) return "PeopleAdd";
		if (url.includes("OrgAdd") || doc?.querySelector?.("iframe[src*=\"OrgAdd\"]")) return "OrgAdd";
		if (url.includes("Disbursements") || doc?.getElementById?.("FppcSpendCodeDropDownField") || (doc?.body?.innerText || "").includes("Enter a Disbursement")) return "TransactionAddDisbursement";
		if (url.includes("MonetaryContribution") || (doc?.body?.innerText || "").includes("Enter a Monetary Contribution")) return "TransactionAddContribution";
		if (url.includes("/Transaction/Add") || doc?.getElementById?.("Date") && doc?.getElementById?.("Amount")) return "TransactionAddContribution";
		return "Unknown";
	}
	function getElement(id) {
		const el = document.getElementById(id);
		if (el) return el;
		for (const iframe of Array.from(document.querySelectorAll("iframe"))) try {
			const doc = iframe.contentDocument || iframe.contentWindow?.document;
			if (doc) {
				const frameEl = doc.getElementById(id);
				if (frameEl) return frameEl;
			}
		} catch {}
		return null;
	}
	function setKendoOrStandardValue(el, value) {
		if (!el || value === void 0 || value === null) return false;
		const win = window;
		const $ = win.jQuery || win.$;
		if ($ && $(el).length) {
			const numeric = $(el).data("kendoNumericTextBox");
			if (numeric) {
				const num = typeof value === "number" ? value : parseFloat(value.toString());
				numeric.value(isNaN(num) ? 0 : num);
				numeric.trigger("change");
			}
			const drop = $(el).data("kendoDropDownList");
			if (drop) {
				drop.value(value.toString());
				drop.trigger("change");
			}
			const datePicker = $(el).data("kendoDatePicker");
			if (datePicker) {
				datePicker.value(value.toString());
				datePicker.trigger("change");
			}
		}
		const parent = el.parentElement;
		if (parent) {
			const visibleInner = parent.querySelector("input.k-input-inner, input[role=\"spinbutton\"]");
			if (visibleInner && visibleInner !== el) {
				visibleInner.value = value.toString();
				visibleInner.dispatchEvent(new Event("input", { bubbles: true }));
				visibleInner.dispatchEvent(new Event("change", { bubbles: true }));
			}
		}
		if ("value" in el) {
			el.value = value.toString();
			el.dispatchEvent(new Event("input", { bubbles: true }));
			el.dispatchEvent(new Event("change", { bubbles: true }));
		}
		return true;
	}
	function searchEntity(donorName) {
		const input = getElement("EntityName");
		const btn = getElement("btnSearch");
		if (input && btn) {
			setKendoOrStandardValue(input, donorName);
			btn.click();
			return true;
		}
		return false;
	}
	function navigateToCreateIndividual() {
		const link = document.querySelector("a.nf-button-proceed[href*=\"PeopleAdd\"]");
		if (link) {
			link.click();
			return true;
		}
		window.location.href = "https://netfile.com/Filer/LegacyFree/Entity/PeopleAdd?inProgressTransactionType=MonetaryContribution";
		return true;
	}
	function fillPeopleAddForm(c) {
		let count = 0;
		const map = [
			["FirstName", c.firstName],
			["LastName", c.lastName],
			["BusinessAddress_Line1", c.address],
			["BusinessAddress_City", c.city],
			["BusinessAddress_State", c.state],
			["BusinessAddress_ZipCode", c.zip],
			["Employer", c.employer],
			["Occupation", c.occupation],
			["Email", c.email],
			["WorkPhone_Phone", c.phone]
		];
		for (const [id, val] of map) {
			const el = getElement(id);
			if (el && val) {
				setKendoOrStandardValue(el, val);
				count++;
			}
		}
		return count;
	}
	function fillOrganizationAddForm(c) {
		let count = 0;
		const map = [
			["Name", c.employer && c.employer !== "Not Employed" ? c.employer : c.fullName],
			["BusinessAddress_Line1", c.address],
			["BusinessAddress_City", c.city],
			["BusinessAddress_State", c.state],
			["BusinessAddress_ZipCode", c.zip],
			["Email", c.email],
			["WorkPhone_Phone", c.phone]
		];
		for (const [id, val] of map) {
			const el = getElement(id);
			if (el && val) {
				setKendoOrStandardValue(el, val);
				count++;
			}
		}
		return count;
	}
	function fillTransactionAddForm(c) {
		let count = 0;
		const dateInput = getElement("Date");
		if (dateInput && c.dateUS) {
			setKendoOrStandardValue(dateInput, c.dateUS);
			count++;
		}
		const amountInput = getElement("Amount");
		if (amountInput && c.amount) {
			setKendoOrStandardValue(amountInput, c.amount);
			count++;
		}
		return count;
	}
	function fillDisbursementForm(opts) {
		let count = 0;
		const dateInput = getElement("Date");
		if (dateInput && opts.date) {
			setKendoOrStandardValue(dateInput, opts.date);
			count++;
		}
		const amountInput = getElement("Amount");
		if (amountInput && opts.amount) {
			setKendoOrStandardValue(amountInput, opts.amount);
			count++;
		}
		const spendCode = opts.spendCode || "WEB";
		const spendInput = getElement("FppcSpendCodeDropDownField");
		if (spendInput) {
			setKendoOrStandardValue(spendInput, spendCode);
			count++;
		}
		const descInput = getElement("Description");
		if (descInput && opts.description) {
			setKendoOrStandardValue(descInput, opts.description);
			count++;
		}
		return count;
	}
	var f = 0;
	Array.isArray;
	function u(e, t, n, o, i, u) {
		t || (t = {});
		var a, c, p = t;
		if ("ref" in p) for (c in p = {}, t) "ref" == c ? a = t[c] : p[c] = t[c];
		var l = {
			type: e,
			props: p,
			key: n,
			ref: a,
			__k: null,
			__: null,
			__b: 0,
			__e: null,
			__c: null,
			constructor: void 0,
			__v: --f,
			__i: -1,
			__u: 0,
			__source: i,
			__self: u
		};
		if ("function" == typeof e && (a = e.defaultProps)) for (c in a) void 0 === p[c] && (p[c] = a[c]);
		return l$1.vnode && l$1.vnode(l), l;
	}
	var STORAGE_DATA_KEY = "actblue_user_data_v1";
	var STORAGE_STATUS_KEY = "actblue_entered_status_v1";
	var STORAGE_INDEX_KEY = "actblue_current_index_v1";
	function App() {
		const [contributions, setContributions] = d(() => {
			try {
				const saved = localStorage.getItem(STORAGE_DATA_KEY);
				return saved ? JSON.parse(saved) : [];
			} catch {
				return [];
			}
		});
		const [statusMap, setStatusMap] = d(() => {
			try {
				const saved = localStorage.getItem(STORAGE_STATUS_KEY);
				return saved ? JSON.parse(saved) : {};
			} catch {
				return {};
			}
		});
		const [currentIndex, setCurrentIndex] = d(() => {
			try {
				const saved = localStorage.getItem(STORAGE_INDEX_KEY);
				return saved ? parseInt(saved, 10) : 0;
			} catch {
				return 0;
			}
		});
		const [screen, setScreen] = d("Unknown");
		const [activeTab, setActiveTab] = d("transactions");
		const [isMinimized, setIsMinimized] = d(false);
		const [toast, setToast] = d(null);
		const fileInputRef = A(null);
		const panelRef = A(null);
		h(() => {
			const updateScreen = () => setScreen(detectCurrentScreen());
			updateScreen();
			const interval = setInterval(updateScreen, 1e3);
			return () => clearInterval(interval);
		}, []);
		h(() => {
			localStorage.setItem(STORAGE_INDEX_KEY, currentIndex.toString());
		}, [currentIndex]);
		const showToast = (msg) => {
			setToast(msg);
			setTimeout(() => setToast(null), 1500);
		};
		const copyToClipboard = (txt, label) => {
			navigator.clipboard.writeText(txt).then(() => {
				showToast(`Copied ${label}!`);
			});
		};
		const handleFileUpload = (e) => {
			const file = e.target.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = (event) => {
				const text = event.target?.result;
				const parsed = convertActBlueCSV(text);
				if (parsed.length === 0) {
					alert("Could not parse any contributions from this CSV. Check format.");
					return;
				}
				setContributions(parsed);
				setCurrentIndex(0);
				localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(parsed));
				showToast(`Loaded ${parsed.length} contributions!`);
			};
			reader.readAsText(file);
		};
		const handleLoadMock = () => {
			setContributions(MOCK_CONTRIBUTIONS);
			setCurrentIndex(0);
			localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(MOCK_CONTRIBUTIONS));
			showToast(`Loaded ${MOCK_CONTRIBUTIONS.length} test records!`);
		};
		const handleClear = () => {
			if (confirm("Clear uploaded contributions from browser storage?")) {
				setContributions([]);
				setStatusMap({});
				setCurrentIndex(0);
				localStorage.removeItem(STORAGE_DATA_KEY);
				localStorage.removeItem(STORAGE_STATUS_KEY);
				localStorage.removeItem(STORAGE_INDEX_KEY);
				showToast("Data cleared.");
			}
		};
		const handleToggleEntered = () => {
			const c = contributions[currentIndex];
			if (!c) return;
			const next = !statusMap[c.id];
			const updated = {
				...statusMap,
				[c.id]: next
			};
			setStatusMap(updated);
			localStorage.setItem(STORAGE_STATUS_KEY, JSON.stringify(updated));
			showToast(next ? "Marked Entered ✓" : "Marked Pending");
		};
		const handlePrev = () => {
			if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
		};
		const handleNext = () => {
			if (currentIndex < contributions.length - 1) setCurrentIndex(currentIndex + 1);
		};
		const handleMouseDown = (e) => {
			if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
			const panel = panelRef.current;
			if (!panel) return;
			const rect = panel.getBoundingClientRect();
			panel.style.bottom = "auto";
			panel.style.right = "auto";
			panel.style.left = `${rect.left}px`;
			panel.style.top = `${rect.top}px`;
			const startX = e.clientX;
			const startY = e.clientY;
			const initialLeft = rect.left;
			const initialTop = rect.top;
			const onMouseMove = (moveEvent) => {
				panel.style.left = `${initialLeft + (moveEvent.clientX - startX)}px`;
				panel.style.top = `${initialTop + (moveEvent.clientY - startY)}px`;
			};
			const onMouseUp = () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
			};
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		};
		const current = contributions[currentIndex];
		const isEntered = current ? !!statusMap[current.id] : false;
		const payoutBatches = computePayoutBatches(contributions);
		contributions.reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0);
		const totalStripe = contributions.reduce((acc, c) => acc + (parseFloat(c.stripeFee) || 0), 0);
		const totalActBlue = contributions.reduce((acc, c) => acc + (parseFloat(c.actblueFee) || 0), 0);
		const totalCombinedFees = totalStripe + totalActBlue;
		return u("div", {
			id: "actblue-userscript-panel",
			ref: panelRef,
			children: [
				u("div", {
					className: "ab-header",
					onMouseDown: handleMouseDown,
					children: [u("div", {
						className: "ab-title",
						children: [u("span", { children: "NetFile Assistant" }), contributions.length > 0 && activeTab === "transactions" && u("span", {
							className: "ab-counter",
							children: [
								currentIndex + 1,
								" / ",
								contributions.length
							]
						})]
					}), u("div", {
						style: {
							display: "flex",
							gap: "6px",
							alignItems: "center"
						},
						children: [current && activeTab === "transactions" && u("span", {
							className: `ab-badge ${isEntered ? "ab-badge-entered" : "ab-badge-pending"}`,
							children: isEntered ? "Entered" : "Pending"
						}), u("button", {
							onClick: () => setIsMinimized(!isMinimized),
							style: {
								background: "none",
								border: "none",
								color: "#9ca3af",
								cursor: "pointer",
								fontSize: "14px"
							},
							children: isMinimized ? "+" : "−"
						})]
					})]
				}),
				toast && u("div", {
					className: "ab-toast",
					children: toast
				}),
				!isMinimized && u(S, { children: [u("div", {
					className: "ab-body",
					children: contributions.length === 0 ? u("div", { children: [
						u("input", {
							type: "file",
							accept: ".csv",
							ref: fileInputRef,
							style: { display: "none" },
							onChange: handleFileUpload
						}),
						u("div", {
							className: "ab-upload-box",
							onClick: () => fileInputRef.current?.click(),
							children: [u("div", {
								style: {
									fontWeight: 600,
									color: "#60a5fa",
									marginBottom: 4
								},
								children: "📁 Click to Upload ActBlue CSV"
							}), u("div", {
								style: {
									fontSize: 11,
									color: "#9ca3af"
								},
								children: "Data stays 100% inside your browser session"
							})]
						}),
						u("button", {
							className: "ab-btn ab-btn-secondary",
							style: { width: "100%" },
							onClick: handleLoadMock,
							children: "🧪 Load Synthetic Test Data"
						})
					] }) : u(S, { children: [
						u("div", {
							className: "ab-screen-banner",
							children: [
								u("div", {
									className: "ab-screen-tag",
									children: [
										screen === "SelectEntity" && "Step 1: Entity Search",
										screen === "PeopleAdd" && "Step 2: Add New Individual",
										screen === "OrgAdd" && "Modal: Add Organization",
										screen === "TransactionAddContribution" && "Step 3: Monetary Contribution",
										screen === "TransactionAddDisbursement" && "Enter Expense / Fee",
										screen === "Unknown" && "Current Screen"
									]
								}),
								screen === "SelectEntity" && current && u("div", {
									style: {
										display: "flex",
										gap: 6
									},
									children: [u("button", {
										className: "ab-btn ab-btn-action",
										onClick: () => {
											searchEntity(current.lastName || current.fullName);
											showToast(`Searching for "${current.lastName || current.fullName}"...`);
										},
										children: [
											"🔍 Search \"",
											current.lastName,
											"\""
										]
									}), u("button", {
										className: "ab-btn ab-btn-secondary",
										onClick: () => navigateToCreateIndividual(),
										title: "If not found, click to create new individual",
										children: "➕ New Person"
									})]
								}),
								screen === "PeopleAdd" && current && u("button", {
									className: "ab-btn ab-btn-action",
									onClick: () => {
										const count = fillPeopleAddForm(current);
										showToast(`Filled ${count} contributor fields!`);
									},
									children: "⚡ Fill Contributor Info"
								}),
								screen === "OrgAdd" && current && u("button", {
									className: "ab-btn ab-btn-action",
									onClick: () => {
										const count = fillOrganizationAddForm(current);
										showToast(`Filled ${count} organization fields in modal!`);
									},
									children: "⚡ Fill Organization Info"
								}),
								screen === "TransactionAddContribution" && current && u("button", {
									className: "ab-btn ab-btn-action",
									onClick: () => {
										fillTransactionAddForm(current);
										showToast(`Filled Date (${current.dateUS}) & Amount ($${current.amount})!`);
									},
									children: [
										"⚡ Fill Contribution ($",
										current.amount,
										")"
									]
								}),
								screen === "TransactionAddDisbursement" && current && u("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 6
									},
									children: [u("button", {
										className: "ab-btn ab-btn-action",
										onClick: () => {
											fillDisbursementForm({
												date: current.dateUS,
												amount: current.totalFee,
												description: `ActBlue/Stripe processing fee (${current.fullName})`
											});
											showToast(`Filled Total Fee: $${current.totalFee}!`);
										},
										children: [
											"⚡ Fill Total Fee ($",
											current.totalFee,
											")"
										]
									}), u("div", {
										style: {
											display: "flex",
											gap: 6
										},
										children: [u("button", {
											className: "ab-btn ab-btn-secondary",
											style: {
												flex: 1,
												fontSize: 11
											},
											onClick: () => {
												fillDisbursementForm({
													date: current.dateUS,
													amount: current.stripeFee,
													description: `Stripe fee (${current.fullName})`
												});
												showToast(`Filled Stripe Fee: $${current.stripeFee}!`);
											},
											children: [
												"Stripe Fee ($",
												current.stripeFee,
												")"
											]
										}), u("button", {
											className: "ab-btn ab-btn-secondary",
											style: {
												flex: 1,
												fontSize: 11
											},
											onClick: () => {
												fillDisbursementForm({
													date: current.dateUS,
													amount: current.actblueFee,
													description: `ActBlue fee (${current.fullName})`
												});
												showToast(`Filled ActBlue Fee: $${current.actblueFee}!`);
											},
											children: [
												"ActBlue Fee ($",
												current.actblueFee,
												")"
											]
										})]
									})]
								}),
								screen === "Unknown" && u("div", {
									style: {
										fontSize: 11,
										color: "#9ca3af"
									},
									children: [
										"Navigate to ",
										u("em", { children: "Transactions > Money In" }),
										" or ",
										u("em", { children: "Disbursements" })
									]
								})
							]
						}),
						u("div", {
							className: "ab-tabs",
							children: [u("button", {
								className: `ab-tab ${activeTab === "transactions" ? "active" : ""}`,
								onClick: () => setActiveTab("transactions"),
								children: [
									"Transactions (",
									contributions.length,
									")"
								]
							}), u("button", {
								className: `ab-tab ${activeTab === "batches" ? "active" : ""}`,
								onClick: () => setActiveTab("batches"),
								children: [
									"Payout Fee Batches (",
									payoutBatches.length,
									")"
								]
							})]
						}),
						activeTab === "transactions" ? u(S, { children: [u("select", {
							className: "ab-select",
							value: currentIndex,
							onChange: (e) => setCurrentIndex(parseInt(e.target.value, 10)),
							children: contributions.map((c, i) => u("option", {
								value: i,
								children: [
									statusMap[c.id] ? "✓ " : "• ",
									" #",
									i + 1,
									" ",
									c.fullName,
									" ($",
									c.amount,
									") — Fee: $",
									c.totalFee
								]
							}, c.id))
						}), current && u(S, { children: [
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "Donor"
								}), u("span", {
									className: "ab-val ab-copyable",
									onClick: () => copyToClipboard(current.fullName, "Name"),
									title: "Click to copy",
									children: current.fullName
								})]
							}),
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "Gross"
								}), u("span", {
									className: "ab-val ab-amount ab-copyable",
									onClick: () => copyToClipboard(current.amount, "Gross Amount"),
									title: "Click to copy",
									children: ["$", current.amount]
								})]
							}),
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "Stripe Fee"
								}), u("span", {
									className: "ab-val ab-fee ab-copyable",
									onClick: () => copyToClipboard(current.stripeFee, "Stripe Fee"),
									title: "Click to copy",
									children: ["$", current.stripeFee]
								})]
							}),
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "ActBlue Fee"
								}), u("span", {
									className: "ab-val ab-fee ab-copyable",
									onClick: () => copyToClipboard(current.actblueFee, "ActBlue Fee"),
									title: "Click to copy",
									children: ["$", current.actblueFee]
								})]
							}),
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "Total Fee"
								}), u("span", {
									className: "ab-val ab-fee ab-copyable",
									style: { fontWeight: 700 },
									onClick: () => copyToClipboard(current.totalFee, "Total Fee"),
									title: "Click to copy",
									children: ["$", current.totalFee]
								})]
							}),
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "Net Deposit"
								}), u("span", {
									className: "ab-val ab-copyable",
									style: { color: "#60a5fa" },
									onClick: () => copyToClipboard(current.netSettlement, "Net Deposit"),
									title: "Click to copy",
									children: ["$", current.netSettlement]
								})]
							}),
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "Date"
								}), u("span", {
									className: "ab-val ab-copyable",
									onClick: () => copyToClipboard(current.dateUS, "Date"),
									title: "Click to copy",
									children: current.dateUS
								})]
							}),
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "Payout Date"
								}), u("span", {
									className: "ab-val ab-copyable",
									onClick: () => copyToClipboard(current.payoutDate, "Payout Date"),
									title: "Click to copy",
									children: current.payoutDate || "Pending"
								})]
							}),
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "Address"
								}), u("span", {
									className: "ab-val ab-copyable",
									onClick: () => copyToClipboard(`${current.address}, ${current.city}, ${current.state} ${current.zip}`, "Address"),
									title: "Click to copy",
									children: [
										current.address,
										", ",
										current.city,
										", ",
										current.state,
										" ",
										current.zip
									]
								})]
							}),
							u("div", {
								className: "ab-row",
								children: [u("span", {
									className: "ab-label",
									children: "Work"
								}), u("span", {
									className: "ab-val ab-copyable",
									onClick: () => copyToClipboard(`${current.occupation} / ${current.employer}`, "Occupation/Employer"),
									title: "Click to copy",
									children: [
										current.occupation,
										" / ",
										current.employer
									]
								})]
							})
						] })] }) : u("div", { children: [u("div", {
							style: {
								fontSize: 11,
								color: "#9ca3af",
								marginBottom: 6
							},
							children: "Summary of fees grouped by bank payout settlement:"
						}), u("table", {
							className: "ab-batch-table",
							children: [u("thead", { children: u("tr", { children: [
								u("th", { children: "Payout" }),
								u("th", { children: "Txns" }),
								u("th", { children: "Stripe" }),
								u("th", { children: "ActBlue" }),
								u("th", { children: "Total Fee" }),
								screen === "TransactionAddDisbursement" && u("th", { children: "Action" })
							] }) }), u("tbody", { children: [payoutBatches.map((b) => u("tr", { children: [
								u("td", { children: b.payoutDate }),
								u("td", { children: b.count }),
								u("td", {
									className: "ab-fee",
									children: ["$", b.stripeFee]
								}),
								u("td", {
									className: "ab-fee",
									children: ["$", b.actblueFee]
								}),
								u("td", {
									className: "ab-fee",
									style: { fontWeight: 700 },
									children: ["$", b.totalFee]
								}),
								screen === "TransactionAddDisbursement" && u("td", { children: u("button", {
									className: "ab-batch-btn",
									onClick: () => {
										fillDisbursementForm({
											date: b.payoutDate,
											amount: b.totalFee,
											description: `ActBlue/Stripe fees for payout batch (${b.count} txns)`
										});
										showToast(`Filled batch fee: $${b.totalFee}!`);
									},
									children: "Fill"
								}) })
							] }, b.payoutDate)), u("tr", {
								style: {
									fontWeight: 700,
									borderTop: "2px solid #374151"
								},
								children: [
									u("td", { children: "TOTAL" }),
									u("td", { children: contributions.length }),
									u("td", {
										className: "ab-fee",
										children: ["$", totalStripe.toFixed(2)]
									}),
									u("td", {
										className: "ab-fee",
										children: ["$", totalActBlue.toFixed(2)]
									}),
									u("td", {
										className: "ab-fee",
										children: ["$", totalCombinedFees.toFixed(2)]
									}),
									screen === "TransactionAddDisbursement" && u("td", {})
								]
							})] })]
						})] }),
						u("div", {
							style: {
								marginTop: 10,
								display: "flex",
								justifyContent: "space-between"
							},
							children: [
								u("button", {
									style: {
										background: "none",
										border: "none",
										color: "#ef4444",
										fontSize: 11,
										cursor: "pointer"
									},
									onClick: handleClear,
									children: "Clear Data"
								}),
								u("button", {
									style: {
										background: "none",
										border: "none",
										color: "#60a5fa",
										fontSize: 11,
										cursor: "pointer"
									},
									onClick: () => fileInputRef.current?.click(),
									children: "Upload Different CSV"
								}),
								u("input", {
									type: "file",
									accept: ".csv",
									ref: fileInputRef,
									style: { display: "none" },
									onChange: handleFileUpload
								})
							]
						})
					] })
				}), contributions.length > 0 && activeTab === "transactions" && u("div", {
					className: "ab-nav",
					children: [
						u("button", {
							className: "ab-btn ab-btn-secondary",
							onClick: handlePrev,
							disabled: currentIndex === 0,
							children: "◀ Prev"
						}),
						u("button", {
							className: `ab-btn ${isEntered ? "ab-btn-secondary" : "ab-btn-success"}`,
							onClick: handleToggleEntered,
							children: isEntered ? "✓ Entered" : "Mark Done"
						}),
						u("button", {
							className: "ab-btn ab-btn-secondary",
							onClick: handleNext,
							disabled: currentIndex === contributions.length - 1,
							children: "Next ▶"
						})
					]
				})] })
			]
		});
	}
	_css("#actblue-userscript-panel{color:#f3f4f6;z-index:2147483647;-webkit-user-select:none;user-select:none;background:#18191f;border-radius:12px;width:410px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;position:fixed;bottom:20px;right:20px;overflow:hidden;box-shadow:0 12px 36px #00000073,0 0 0 1px #ffffff1f}.ab-header{cursor:move;background:#111216;border-bottom:1px solid #2e3039;justify-content:space-between;align-items:center;padding:10px 14px;display:flex}.ab-title{color:#60a5fa;align-items:center;gap:8px;font-size:13px;font-weight:700;display:flex}.ab-counter{color:#e5e7eb;background:#2e3039;border-radius:9999px;padding:2px 8px;font-size:11px}.ab-body{-webkit-user-select:text;user-select:text;max-height:520px;padding:14px;overflow-y:auto}.ab-screen-banner{background:#1f293d;border:1px solid #3b82f6;border-radius:8px;flex-direction:column;gap:6px;margin-bottom:12px;padding:8px 10px;display:flex}.ab-screen-tag{color:#93c5fd;text-transform:uppercase;letter-spacing:.5px;font-size:11px;font-weight:700}.ab-row{justify-content:space-between;align-items:baseline;margin-bottom:6px;display:flex}.ab-label{color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;min-width:80px;font-size:11px}.ab-val{color:#f9fafb;text-align:right;word-break:break-word;flex:1;font-weight:500}.ab-copyable{cursor:pointer;border-radius:4px;padding:1px 4px;transition:background .15s}.ab-copyable:hover{color:#93c5fd;background:#374151}.ab-amount{color:#34d399;font-size:16px;font-weight:700}.ab-fee{color:#f87171;font-weight:600}.ab-badge{border-radius:4px;padding:2px 6px;font-size:10px;font-weight:600;display:inline-block}.ab-badge-pending{color:#f3f4f6;background:#4b5563}.ab-badge-entered{color:#6ee7b7;background:#065f46}.ab-nav{background:#111216;border-top:1px solid #2e3039;gap:8px;padding:10px 14px 14px;display:flex}.ab-btn{cursor:pointer;border:none;border-radius:6px;justify-content:center;align-items:center;gap:4px;padding:7px 10px;font-size:12px;font-weight:600;transition:all .15s;display:flex}.ab-btn-primary{color:#fff;background:#2563eb;flex:1.3}.ab-btn-primary:hover{background:#1d4ed8}.ab-btn-action{color:#fff;background:#0284c7;width:100%;padding:7px}.ab-btn-action:hover{background:#0369a1}.ab-btn-secondary{color:#f3f4f6;background:#2e3039;flex:1}.ab-btn-secondary:hover{background:#3f424e}.ab-btn-success{color:#fff;background:#059669}.ab-btn-success:hover{background:#047857}.ab-select{color:#f9fafb;background:#242630;border:1px solid #374151;border-radius:6px;width:100%;margin-bottom:10px;padding:6px;font-size:12px}.ab-upload-box{text-align:center;cursor:pointer;background:#242630;border:2px dashed #374151;border-radius:8px;margin-bottom:12px;padding:18px 12px}.ab-upload-box:hover{border-color:#60a5fa}.ab-toast{color:#fff;pointer-events:none;z-index:10;background:#059669;border-radius:4px;padding:4px 10px;font-size:11px;position:absolute;top:42px;left:50%;transform:translate(-50%)}.ab-tabs{background:#242630;border-radius:6px;margin-bottom:10px;padding:2px;display:flex}.ab-tab{text-align:center;color:#9ca3af;cursor:pointer;background:0 0;border:none;border-radius:4px;flex:1;padding:5px;font-size:11px;font-weight:600;transition:all .15s}.ab-tab.active{color:#60a5fa;background:#374151}.ab-batch-table{border-collapse:collapse;width:100%;margin-top:6px;font-size:11px}.ab-batch-table th,.ab-batch-table td{text-align:right;border-bottom:1px solid #2e3039;padding:5px 4px}.ab-batch-table th:first-child,.ab-batch-table td:first-child{text-align:left}.ab-batch-btn{color:#fff;cursor:pointer;background:#2563eb;border:none;border-radius:4px;padding:2px 6px;font-size:10px}.ab-batch-btn:hover{background:#1d4ed8}");
	function init() {
		if (window !== window.top) return;
		const existing = document.getElementById("actblue-userscript-root");
		if (existing) existing.remove();
		const container = document.createElement("div");
		container.id = "actblue-userscript-root";
		document.body.appendChild(container);
		R(u(App, {}), container);
	}
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
})();
