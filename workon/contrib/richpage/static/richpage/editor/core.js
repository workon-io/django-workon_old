/*!
 * froala_editor v2.3.5 (https://www.froala.com/wysiwyg-editor)
 * License https://froala.com/wysiwyg-editor/terms/
 * Copyright 2014-2016 Froala Labs
 */

! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function(b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c), c
    } : a(jQuery)
}(function(a) {
    var b = function(c, d) {
        this.id = ++a.FE.ID, this.opts = a.extend(!0, {}, a.extend({}, b.DEFAULTS, "object" == typeof d && d));
        var e = JSON.stringify(this.opts);
        a.FE.OPTS_MAPPING[e] = a.FE.OPTS_MAPPING[e] || this.id, this.sid = a.FE.OPTS_MAPPING[e], a.FE.SHARED[this.sid] = a.FE.SHARED[this.sid] || {}, this.shared = a.FE.SHARED[this.sid], this.shared.count = (this.shared.count || 0) + 1, this.$oel = a(c), this.$oel.data("froala.editor", this), this.o_doc = c.ownerDocument, this.o_win = "defaultView" in this.o_doc ? this.o_doc.defaultView : this.o_doc.parentWindow;
        var f = a(this.o_win).scrollTop();
        this.$oel.on("froala.doInit", a.proxy(function() {
            this.$oel.off("froala.doInit"), this.doc = this.$el.get(0).ownerDocument, this.win = "defaultView" in this.doc ? this.doc.defaultView : this.doc.parentWindow, this.$doc = a(this.doc), this.$win = a(this.win), this.opts.pluginsEnabled || (this.opts.pluginsEnabled = Object.keys(a.FE.PLUGINS)), this.opts.initOnClick ? (this.load(a.FE.MODULES), this.$el.on("touchstart.init", function() {
                a(this).data("touched", !0)
            }), this.$el.on("touchmove.init", function() {
                a(this).removeData("touched")
            }), this.$el.on("mousedown.init touchend.init dragenter.init focus.init", a.proxy(function(b) {
                if ("touchend" == b.type && !this.$el.data("touched")) return !0;
                if (1 === b.which || !b.which) {
                    this.$el.off("mousedown.init touchstart.init touchmove.init touchend.init dragenter.init focus.init"), this.load(a.FE.MODULES), this.load(a.FE.PLUGINS);
                    var c = b.originalEvent && b.originalEvent.originalTarget;
                    c && "IMG" == c.tagName && a(c).trigger("mousedown"), "undefined" == typeof this.ul && this.destroy(), "touchend" == b.type && this.image && b.originalEvent && b.originalEvent.target && a(b.originalEvent.target).is("img") && setTimeout(a.proxy(function() {
                        this.image.edit(a(b.originalEvent.target))
                    }, this), 100), this.events.trigger("initialized")
                }
            }, this))) : (this.load(a.FE.MODULES), this.load(a.FE.PLUGINS), a(this.o_win).scrollTop(f), "undefined" == typeof this.ul && this.destroy(), this.events.trigger("initialized"))
        }, this)), this._init()
    };
    b.DEFAULTS = {
        initOnClick: !1,
        pluginsEnabled: null
    }, b.MODULES = {}, b.PLUGINS = {}, b.VERSION = "2.3.5", b.INSTANCES = [], b.OPTS_MAPPING = {}, b.SHARED = {}, b.ID = 0, b.prototype._init = function() {
        var b = this.$oel.prop("tagName"),
            c = a.proxy(function() {
                this._original_html = this._original_html || this.$oel.html(), this.$box = this.$box || this.$oel, this.opts.fullPage && (this.opts.iframe = !0), this.opts.iframe ? (this.$iframe = a('<iframe src="about:blank" frameBorder="0">'), this.$wp = a("<div></div>"), this.$box.html(this.$wp), this.$wp.append(this.$iframe), this.$iframe.get(0).contentWindow.document.open(), this.$iframe.get(0).contentWindow.document.write("<!DOCTYPE html>"), this.$iframe.get(0).contentWindow.document.write("<html><head></head><body></body></html>"), this.$iframe.get(0).contentWindow.document.close(), this.$el = this.$iframe.contents().find("body"), this.$head = this.$iframe.contents().find("head"), this.$html = this.$iframe.contents().find("html"), this.iframe_document = this.$iframe.get(0).contentWindow.document, this.$oel.trigger("froala.doInit")) : (this.$el = a("<div></div>"), this.$wp = a("<div></div>").append(this.$el), this.$box.html(this.$wp), this.$oel.trigger("froala.doInit"))
            }, this),
            d = a.proxy(function() {
                this.$box = a("<div>"), this.$oel.before(this.$box).hide(), this._original_html = this.$oel.val(), this.$oel.parents("form").on("submit." + this.id, a.proxy(function() {
                    this.events.trigger("form.submit")
                }, this)), this.$oel.parents("form").on("reset." + this.id, a.proxy(function() {
                    this.events.trigger("form.reset")
                }, this)), c()
            }, this),
            e = a.proxy(function() {
                this.$el = this.$oel, this.$el.attr("contenteditable", !0).css("outline", "none").css("display", "inline-block"), this.opts.multiLine = !1, this.opts.toolbarInline = !1, this.$oel.trigger("froala.doInit")
            }, this),
            f = a.proxy(function() {
                this.$el = this.$oel, this.opts.toolbarInline = !1, this.$oel.trigger("froala.doInit")
            }, this),
            g = a.proxy(function() {
                this.$el = this.$oel, this.opts.toolbarInline = !1, this.$oel.on("click.popup", function(a) {
                    a.preventDefault()
                }), this.$oel.trigger("froala.doInit")
            }, this);
        this.opts.editInPopup ? g() : "TEXTAREA" == b ? d() : "A" == b ? e() : "IMG" == b ? f() : "BUTTON" == b || "INPUT" == b ? (this.opts.editInPopup = !0, this.opts.toolbarInline = !1, g()) : c()
    }, b.prototype.load = function(b) {
        for (var c in b)
            if (b.hasOwnProperty(c)) {
                if (this[c]) continue;
                if (a.FE.PLUGINS[c] && this.opts.pluginsEnabled.indexOf(c) < 0) continue;
                if (this[c] = new b[c](this), this[c]._init && (this[c]._init(), this.opts.initOnClick && "core" == c)) return !1
            }
    }, b.prototype.destroy = function() {
        this.shared.count--, this.events.$off();
        var b = this.html.get();
        if (this.events.trigger("destroy", [], !0), this.events.trigger("shared.destroy", void 0, !0), 0 === this.shared.count) {
            for (var c in this.shared) this.shared.hasOwnProperty(c) && (null == this.shared[c], a.FE.SHARED[this.sid][c] = null);
            a.FE.SHARED[this.sid] = {}
        }
        this.$oel.parents("form").off("." + this.id), this.$oel.off("click.popup"), this.$oel.removeData("froala.editor"), this.$oel.off("froalaEditor"), this.core.destroy(b), a.FE.INSTANCES.splice(a.FE.INSTANCES.indexOf(this), 1)
    }, a.fn.froalaEditor = function(c) {
        for (var d = [], e = 0; e < arguments.length; e++) d.push(arguments[e]);
        if ("string" == typeof c) {
            var f = [];
            return this.each(function() {
                var b = a(this),
                    e = b.data("froala.editor");
                if (e) {
                    var g, h;
                    if (c.indexOf(".") > 0 && e[c.split(".")[0]] ? (e[c.split(".")[0]] && (g = e[c.split(".")[0]]), h = c.split(".")[1]) : (g = e, h = c.split(".")[0]), !g[h]) return a.error("Method " + c + " does not exist in Froala Editor.");
                    var i = g[h].apply(e, d.slice(1));
                    void 0 === i ? f.push(this) : 0 === f.length && f.push(i)
                }
            }), 1 == f.length ? f[0] : f
        }
        return "object" != typeof c && c ? void 0 : this.each(function() {
            var d = a(this).data("froala.editor");
            if (!d) {
                var e = this;
                new b(e, c)
            }
        })
    }, a.fn.froalaEditor.Constructor = b, a.FroalaEditor = b, a.FE = b, a.FE.MODULES.node = function(b) {
        function c(b) {
            return b && "IFRAME" != b.tagName ? a(b).contents() : []
        }

        function d(b) {
            return b ? b.nodeType != Node.ELEMENT_NODE ? !1 : a.FE.BLOCK_TAGS.indexOf(b.tagName.toLowerCase()) >= 0 : !1
        }

        function e(e, f) {
            if (a(e).find("table").length > 0) return !1;
            if (e.querySelectorAll(a.FE.VOID_ELEMENTS.join(",")).length - e.querySelectorAll("br").length) return !1;
            if (e.querySelectorAll(b.opts.htmlAllowedEmptyTags.join(":not(.fr-marker),") + ":not(.fr-marker)").length) return !1;
            if (e.querySelectorAll(a.FE.BLOCK_TAGS.join(",")).length > 1) return !1;
            if (e.querySelectorAll(b.opts.htmlDoNotWrapTags.join(":not(.fr-marker),") + ":not(.fr-marker)").length) return !1;
            var g = c(e);
            1 == g.length && d(g[0]) && (g = c(g[0]));
            for (var h = !1, i = 0; i < g.length; i++) {
                var j = g[i];
                if (!(f && a(j).hasClass("fr-marker") || j.nodeType == Node.TEXT_NODE && 0 == j.textContent.length)) {
                    if ("BR" != j.tagName && (j.textContent || "").replace(/\u200B/gi, "").replace(/\n/g, "").length > 0) return !1;
                    if (h) return !1;
                    "BR" == j.tagName && (h = !0)
                }
            }
            return !0
        }

        function f(c) {
            for (; c && c.parentNode !== b.$el.get(0) && (!c.parentNode || !a(c.parentNode).hasClass("fr-inner"));)
                if (c = c.parentNode, d(c)) return c;
            return null
        }

        function g(c, e, f) {
            if ("undefined" == typeof e && (e = []), "undefined" == typeof f && (f = !0), e.push(b.$el.get(0)), e.indexOf(c.parentNode) >= 0 || c.parentNode && a(c.parentNode).hasClass("fr-inner") || c.parentNode && a.FE.SIMPLE_ENTER_TAGS.indexOf(c.parentNode.tagName) >= 0 && f) return null;
            for (; e.indexOf(c.parentNode) < 0 && c.parentNode && !a(c.parentNode).hasClass("fr-inner") && (a.FE.SIMPLE_ENTER_TAGS.indexOf(c.parentNode.tagName) < 0 || !f) && (!d(c) || !d(c.parentNode) || !f);) c = c.parentNode;
            return c
        }

        function h(a) {
            var b = {},
                c = a.attributes;
            if (c)
                for (var d = 0; d < c.length; d++) {
                    var e = c[d];
                    b[e.nodeName] = e.value
                }
            return b
        }

        function i(a) {
            for (var b = "", c = h(a), d = Object.keys(c).sort(), e = 0; e < d.length; e++) {
                var f = d[e],
                    g = c[f];
                b += g.indexOf('"') < 0 ? " " + f + '="' + g + '"' : " " + f + "='" + g + "'"
            }
            return b
        }

        function j(a) {
            for (var b = a.attributes, c = 0; c < b.length; c++) {
                var d = b[c];
                a.removeAttribute(d.nodeName)
            }
        }

        function k(a) {
            return "<" + a.tagName.toLowerCase() + i(a) + ">"
        }

        function l(a) {
            return "</" + a.tagName.toLowerCase() + ">"
        }

        function m(b, c) {
            "undefined" == typeof c && (c = !0);
            for (var d = b.previousSibling; d && c && a(d).hasClass("fr-marker");) d = d.previousSibling;
            return d ? d.nodeType == Node.TEXT_NODE && "" === d.textContent ? m(d) : !1 : !0
        }

        function n(b, c) {
            "undefined" == typeof c && (c = !0);
            for (var d = b.nextSibling; d && c && a(d).hasClass("fr-marker");) d = d.nextSibling;
            return d ? d.nodeType == Node.TEXT_NODE && "" === d.textContent ? n(d) : !1 : !0
        }

        function o(b) {
            return b && b.nodeType == Node.ELEMENT_NODE && a.FE.VOID_ELEMENTS.indexOf((b.tagName || "").toLowerCase()) >= 0
        }

        function p(a) {
            return a ? ["UL", "OL"].indexOf(a.tagName) >= 0 : !1
        }

        function q(a) {
            return a === b.$el.get(0)
        }

        function r(a) {
            return a && a.nodeType == Node.ELEMENT_NODE && a.getAttribute("class") && (a.getAttribute("class") || "").indexOf("fr-deletable") >= 0
        }

        function s(a) {
            return a === b.doc.activeElement && (!b.doc.hasFocus || b.doc.hasFocus()) && !!(q(a) || a.type || a.href || ~a.tabIndex)
        }

        function t(a) {
            return (!a.getAttribute || "false" != a.getAttribute("contenteditable")) && ["STYLE", "SCRIPT"].indexOf(a.tagName) < 0
        }
        return {
            isBlock: d,
            isEmpty: e,
            blockParent: f,
            deepestParent: g,
            rawAttributes: h,
            attributes: i,
            clearAttributes: j,
            openTagString: k,
            closeTagString: l,
            isFirstSibling: m,
            isLastSibling: n,
            isList: p,
            isElement: q,
            contents: c,
            isVoid: o,
            hasFocus: s,
            isEditable: t,
            isDeletable: r
        }
    }, a.extend(a.FE.DEFAULTS, {
        htmlAllowedTags: ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "queue", "rp", "rt", "ruby", "s", "samp", "script", "style", "section", "select", "small", "source", "span", "strike", "strong", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "var", "video", "wbr"],
        htmlRemoveTags: ["script", "style"],
        htmlAllowedAttrs: ["accept", "accept-charset", "accesskey", "action", "align", "allowfullscreen", "allowtransparency", "alt", "async", "autocomplete", "autofocus", "autoplay", "autosave", "background", "bgcolor", "border", "charset", "cellpadding", "cellspacing", "checked", "cite", "class", "color", "cols", "colspan", "content", "contenteditable", "contextmenu", "controls", "coords", "data", "data-.*", "datetime", "default", "defer", "dir", "dirname", "disabled", "download", "draggable", "dropzone", "enctype", "for", "form", "formaction", "frameborder", "headers", "height", "hidden", "high", "href", "hreflang", "http-equiv", "icon", "id", "ismap", "itemprop", "keytype", "kind", "label", "lang", "language", "list", "loop", "low", "max", "maxlength", "media", "method", "min", "mozallowfullscreen", "multiple", "name", "novalidate", "open", "optimum", "pattern", "ping", "placeholder", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "reversed", "rows", "rowspan", "sandbox", "scope", "scoped", "scrolling", "seamless", "selected", "shape", "size", "sizes", "span", "src", "srcdoc", "srclang", "srcset", "start", "step", "summary", "spellcheck", "style", "tabindex", "target", "title", "type", "translate", "usemap", "value", "valign", "webkitallowfullscreen", "width", "wrap"],
        htmlAllowComments: !0,
        fullPage: !1
    }), a.FE.HTML5Map = {
        B: "STRONG",
        I: "EM",
        STRIKE: "S"
    }, a.FE.MODULES.clean = function(b) {
        function c(a) {
            if (a.nodeType == Node.ELEMENT_NODE && a.getAttribute("class") && a.getAttribute("class").indexOf("fr-marker") >= 0) return !1;
            var d, e = b.node.contents(a),
                f = [];
            for (d = 0; d < e.length; d++) e[d].nodeType != Node.ELEMENT_NODE || b.node.isVoid(e[d]) ? e[d].nodeType == Node.TEXT_NODE && (e[d].textContent = e[d].textContent.replace(/\u200b/g, "").replace(/&/g, "&amp;")) : e[d].textContent.replace(/\u200b/g, "").length != e[d].textContent.length && c(e[d]);
            if (a.nodeType == Node.ELEMENT_NODE && !b.node.isVoid(a) && (a.normalize(), e = b.node.contents(a), f = a.querySelectorAll(".fr-marker"), e.length - f.length == 0)) {
                for (d = 0; d < e.length; d++)
                    if ((e[d].getAttribute("class") || "").indexOf("fr-marker") < 0) return !1;
                for (d = 0; d < f.length; d++) a.parentNode.insertBefore(f[d].cloneNode(!0), a);
                return a.parentNode.removeChild(a), !1
            }
        }

        function d(a) {
            if (a.nodeType == Node.COMMENT_NODE) return "<!--" + a.nodeValue + "-->";
            if (a.nodeType == Node.TEXT_NODE) return a.textContent.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\u00A0/g, "&nbsp;");
            if (a.nodeType != Node.ELEMENT_NODE) return a.outerHTML;
            if (a.nodeType == Node.ELEMENT_NODE && ["STYLE", "SCRIPT"].indexOf(a.tagName) >= 0) return a.outerHTML;
            if ("IFRAME" == a.tagName) return a.outerHTML;
            var c = a.childNodes;
            if (0 === c.length) return a.outerHTML;
            for (var e = "", f = 0; f < c.length; f++) e += d(c[f]);
            return b.node.openTagString(a) + e + b.node.closeTagString(a)
        }

        function e(a) {
            return H = [], a = a.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, function(a) {
                return H.push(a), "[FROALA.EDITOR.SCRIPT " + (H.length - 1) + "]"
            }), a = a.replace(/<img((?:[\w\W]*?)) src="/g, '<img$1 data-fr-src="')
        }

        function f(a) {
            return a = a.replace(/\[FROALA\.EDITOR\.SCRIPT ([\d]*)\]/gi, function(a, c) {
                return b.opts.htmlRemoveTags.indexOf("script") >= 0 ? "" : H[parseInt(c, 10)]
            }), a = a.replace(/<img((?:[\w\W]*?)) data-fr-src="/g, '<img$1 src="')
        }

        function g(a) {
            var b;
            for (b in a) a.hasOwnProperty(b) && (b.match(G) || delete a[b]);
            for (var c = "", d = Object.keys(a).sort(), e = 0; e < d.length; e++) b = d[e], c += a[b].indexOf('"') < 0 ? " " + b + '="' + a[b] + '"' : " " + b + "='" + a[b] + "'";
            return c
        }

        function h(a, c, d) {
            if (b.opts.fullPage) {
                var e = b.html.extractDoctype(d),
                    f = g(b.html.extractNodeAttrs(d, "html"));
                c = null == c ? b.html.extractNode(d, "head") || "<title></title>" : c;
                var h = g(b.html.extractNodeAttrs(d, "head")),
                    i = g(b.html.extractNodeAttrs(d, "body"));
                return e + "<html" + f + "><head" + h + ">" + c + "</head><body" + i + ">" + a + "</body></html>"
            }
            return a
        }

        function i(c, e) {
            var f = a("<div>" + c + "</div>"),
                g = "";
            if (f) {
                for (var h = b.node.contents(f.get(0)), i = 0; i < h.length; i++) e(h[i]);
                h = b.node.contents(f.get(0));
                for (var i = 0; i < h.length; i++) g += d(h[i])
            }
            return g
        }

        function j(a, c, d) {
            a = e(a);
            var g = a,
                j = null;
            if (b.opts.fullPage) {
                var g = b.html.extractNode(a, "body") || (a.indexOf("<body") >= 0 ? "" : a);
                d && (j = b.html.extractNode(a, "head") || "")
            }
            g = i(g, c), j && (j = i(j, c));
            var k = h(g, j, a);
            return f(k)
        }

        function k(a) {
            return a.replace(/\u200b/g, "").length == a.length ? a : b.clean.exec(a, c)
        }

        function l() {
            var c = b.$el.get(0).querySelectorAll(Object.keys(a.FE.HTML5Map).join(","));
            if (c.length) {
                var d = !1;
                0 == b.$el.get(0).querySelectorAll(".fr-marker").length && (b.selection.save(), d = !0);
                for (var e = 0; e < c.length; e++) "" === b.node.attributes(c[e]) && a(c[e]).replaceWith("<" + a.FE.HTML5Map[c[e].tagName] + ">" + c[e].innerHTML + "</" + a.FE.HTML5Map[c[e].tagName] + ">");
                d && b.selection.restore()
            }
        }

        function m(c) {
            if ("SPAN" == c.tagName && (c.getAttribute("class") || "").indexOf("fr-marker") >= 0) return !1;
            if ("PRE" == c.tagName && o(c), c.nodeType == Node.ELEMENT_NODE && (c.getAttribute("data-fr-src") && c.setAttribute("data-fr-src", b.helpers.sanitizeURL(c.getAttribute("data-fr-src"))), c.getAttribute("href") && c.setAttribute("href", b.helpers.sanitizeURL(c.getAttribute("href"))), ["TABLE", "TBODY", "TFOOT", "TR"].indexOf(c.tagName) >= 0 && (c.innerHTML = c.innerHTML.trim())), !b.opts.pasteAllowLocalImages && c.nodeType == Node.ELEMENT_NODE && "IMG" == c.tagName && c.getAttribute("data-fr-src") && 0 == c.getAttribute("data-fr-src").indexOf("file://")) return c.parentNode.removeChild(c), !1;
            if (c.nodeType == Node.ELEMENT_NODE && a.FE.HTML5Map[c.tagName] && "" === b.node.attributes(c)) {
                var d = a.FE.HTML5Map[c.tagName],
                    e = "<" + d + ">" + c.innerHTML + "</" + d + ">";
                c.insertAdjacentHTML("beforebegin", e), c = c.previousSibling, c.parentNode.removeChild(c.nextSibling)
            }
            if (b.opts.htmlAllowComments || c.nodeType != Node.COMMENT_NODE)
                if (c.tagName && c.tagName.match(F)) c.parentNode.removeChild(c);
                else if (c.tagName && !c.tagName.match(E)) c.outerHTML = c.innerHTML;
            else {
                var f = c.attributes;
                if (f)
                    for (var g = f.length - 1; g >= 0; g--) {
                        var h = f[g];
                        h.nodeName.match(G) || c.removeAttribute(h.nodeName)
                    }
            } else 0 !== c.data.indexOf("[FROALA.EDITOR") && c.parentNode.removeChild(c)
        }

        function n(a) {
            for (var c = b.node.contents(a), d = 0; d < c.length; d++) c[d].nodeType != Node.TEXT_NODE && n(c[d]);
            m(a)
        }

        function o(a) {
            var b = a.innerHTML;
            b.indexOf("\n") >= 0 && (a.innerHTML = b.replace(/\n/g, "<br>"))
        }

        function p(c, d, e, f) {
            "undefined" == typeof d && (d = []), "undefined" == typeof e && (e = []), "undefined" == typeof f && (f = !1), c = c.replace(/\u0009/g, "");
            var g, h = a.merge([], b.opts.htmlAllowedTags);
            for (g = 0; g < d.length; g++) h.indexOf(d[g]) >= 0 && h.splice(h.indexOf(d[g]), 1);
            var i = a.merge([], b.opts.htmlAllowedAttrs);
            for (g = 0; g < e.length; g++) i.indexOf(e[g]) >= 0 && i.splice(i.indexOf(e[g]), 1);
            return i.push("data-fr-.*"), i.push("fr-.*"), E = new RegExp("^" + h.join("$|^") + "$", "gi"), G = new RegExp("^" + i.join("$|^") + "$", "gi"), F = new RegExp("^" + b.opts.htmlRemoveTags.join("$|^") + "$", "gi"), c = j(c, n, !0)
        }

        function q() {
            for (var c = b.$el.get(0).querySelectorAll("blockquote + blockquote"), d = 0; d < c.length; d++) {
                var e = c[d];
                b.node.attributes(e) == b.node.attributes(e.previousSibling) && (a(e).prev().append(a(e).html()), a(e).remove())
            }
        }

        function r() {
            for (var a = b.$el.get(0).querySelectorAll("tr"), c = 0; c < a.length; c++) {
                for (var d = a[c].children, e = !0, f = 0; f < d.length; f++)
                    if ("TH" != d[f].tagName) {
                        e = !1;
                        break
                    }
                if (0 != e && 0 != d.length) {
                    for (var g = a[c]; g && "TABLE" != g.tagName && "THEAD" != g.tagName;) g = g.parentNode;
                    var h = g;
                    "THEAD" != h.tagName && (h = b.doc.createElement("THEAD"), g.insertBefore(h, g.firstChild)), h.appendChild(a[c])
                }
            }
        }

        function s() {
            var c = b.html.defaultTag();
            if (c)
                for (var d = b.$el.get(0).querySelectorAll("td > " + c + ", th > " + c), e = 0; e < d.length; e++) "" === b.node.attributes(d[e]) && a(d[e]).replaceWith(d[e].innerHTML + "<br>")
        }

        function t() {
            r(), s()
        }

        function u() {
            var a = [],
                c = function(a) {
                    return !b.node.isList(a.parentNode)
                };
            do {
                if (a.length) {
                    var d = a[0],
                        e = b.doc.createElement("ul");
                    d.parentNode.insertBefore(e, d);
                    do {
                        var f = d;
                        d = d.nextSibling, e.appendChild(f)
                    } while (d && "LI" == d.tagName)
                }
                a = [];
                for (var g = b.$el.get(0).querySelectorAll("li"), h = 0; h < g.length; h++) c(g[h]) && a.push(g[h])
            } while (a.length > 0)
        }

        function v() {
            for (var a = b.$el.get(0).querySelectorAll("ol + ol, ul + ul"), c = 0; c < a.length; c++) {
                var d = a[c];
                if (b.node.isList(d.previousSibling) && b.node.openTagString(d) == b.node.openTagString(d.previousSibling)) {
                    for (var e = b.node.contents(d), f = 0; f < e.length; f++) d.previousSibling.appendChild(e[f]);
                    d.parentNode.removeChild(d)
                }
            }
        }

        function w() {
            var a, c = function(b) {
                0 === b.querySelectorAll("LI").length && (a = !0, b.parentNode.removeChild(b))
            };
            do {
                a = !1;
                for (var d = b.$el.get(0).querySelectorAll("li:empty"), e = 0; e < d.length; e++) d[e].parentNode.removeChild(d[e]);
                for (var f = b.$el.get(0).querySelectorAll("ul, ol"), e = 0; e < f.length; e++) c(f[e])
            } while (a === !0)
        }

        function x() {
            for (var c = b.$el.get(0).querySelectorAll("ul > ul, ol > ol, ul > ol, ol > ul"), d = 0; d < c.length; d++) {
                var e = c[d],
                    f = e.previousSibling;
                f && ("LI" == f.tagName ? f.appendChild(e) : a(e).wrap("<li></li>"))
            }
        }

        function y() {
            for (var c = b.$el.get(0).querySelectorAll("li > ul, li > ol"), d = 0; d < c.length; d++) {
                var e = c[d];
                if (e.nextSibling) {
                    var f = e.nextSibling,
                        g = a("<li>");
                    a(e.parentNode).after(g);
                    do {
                        var h = f;
                        f = f.nextSibling, g.append(h)
                    } while (f)
                }
            }
        }

        function z() {
            for (var c = b.$el.get(0).querySelectorAll("li > ul, li > ol"), d = 0; d < c.length; d++) {
                var e = c[d];
                if (b.node.isFirstSibling(e)) a(e).before("<br/>");
                else if (e.previousSibling && "BR" == e.previousSibling.tagName) {
                    for (var f = e.previousSibling.previousSibling; f && a(f).hasClass("fr-marker");) f = f.previousSibling;
                    f && "BR" != f.tagName && a(e.previousSibling).remove()
                }
            }
        }

        function A() {
            for (var c = b.$el.get(0).querySelectorAll("li:empty"), d = 0; d < c.length; d++) a(c[d]).remove()
        }

        function B() {
            for (var c = b.$el.get(0).querySelectorAll("ul, ol"), d = 0; d < c.length; d++)
                for (var e = b.node.contents(c[d]), f = null, g = e.length - 1; g >= 0; g--) "LI" != e[g].tagName ? (f || (f = a("<li>"), f.insertBefore(e[g])), f.prepend(e[g])) : f = null
        }

        function C() {
            u(), v(), w(), x(), y(), z(), B(), A()
        }

        function D() {
            b.opts.fullPage && a.merge(b.opts.htmlAllowedTags, ["head", "title", "style", "link", "base", "body", "html", "meta"])
        }
        var E, F, G, H = [],
            H = [];
        return {
            _init: D,
            html: p,
            toHTML5: l,
            tables: t,
            lists: C,
            quotes: q,
            invisibleSpaces: k,
            exec: j
        }
    }, a.FE.XS = 0, a.FE.SM = 1, a.FE.MD = 2, a.FE.LG = 3, a.FE.MODULES.helpers = function(b) {
        function c() {
            var a, b, c = -1;
            return "Microsoft Internet Explorer" == navigator.appName ? (a = navigator.userAgent, b = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})"), null !== b.exec(a) && (c = parseFloat(RegExp.$1))) : "Netscape" == navigator.appName && (a = navigator.userAgent, b = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})"), null !== b.exec(a) && (c = parseFloat(RegExp.$1))), c
        }

        function d() {
            var a = {},
                b = c();
            if (b > 0) a.msie = !0;
            else {
                var d = navigator.userAgent.toLowerCase(),
                    e = /(edge)[ \/]([\w.]+)/.exec(d) || /(chrome)[ \/]([\w.]+)/.exec(d) || /(webkit)[ \/]([\w.]+)/.exec(d) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(d) || /(msie) ([\w.]+)/.exec(d) || d.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(d) || [],
                    f = {
                        browser: e[1] || "",
                        version: e[2] || "0"
                    };
                e[1] && (a[f.browser] = !0), a.chrome ? a.webkit = !0 : a.webkit && (a.safari = !0)
            }
            return a.msie && (a.version = b), a
        }

        function e() {
            return /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !h()
        }

        function f() {
            return /(Android)/g.test(navigator.userAgent) && !h()
        }

        function g() {
            return /(Blackberry)/g.test(navigator.userAgent)
        }

        function h() {
            return /(Windows Phone)/gi.test(navigator.userAgent)
        }

        function i() {
            return f() || e() || g()
        }

        function j() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(a) {
                window.setTimeout(a, 1e3 / 60)
            }
        }

        function k(a) {
            return parseInt(a, 10) || 0
        }

        function l() {
            var b = a('<div class="fr-visibility-helper"></div>').appendTo("body"),
                c = k(b.css("margin-left"));
            return b.remove(), c
        }

        function m() {
            return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch
        }

        function n(a) {
            if (!/^(https?:|ftps?:|)\/\//i.test(a)) return !1;
            a = String(a).replace(/</g, "%3C").replace(/>/g, "%3E").replace(/"/g, "%22").replace(/ /g, "%20");
            var b = /(http|ftp|https):\/\/[a-z\u00a1-\uffff0-9{}]+(\.[a-z\u00a1-\uffff0-9{}]*)*([a-z\u00a1-\uffff0-9.,@?^=%&amp;:\/~+#-_{}]*[a-z\u00a1-\uffff0-9@?^=%&amp;\/~+#-_{}])?/gi;
            return b.test(a)
        }

        function o(a) {
            if (/^(https?:|ftps?:|)\/\//i.test(a)) {
                if (!n(a) && !n("http:" + a)) return ""
            } else a = encodeURIComponent(a).replace(/%23/g, "#").replace(/%2F/g, "/").replace(/%25/g, "%").replace(/mailto%3A/gi, "mailto:").replace(/file%3A/gi, "file:").replace(/sms%3A/gi, "sms:").replace(/tel%3A/gi, "tel:").replace(/notes%3A/gi, "notes:").replace(/data%3Aimage/gi, "data:image").replace(/blob%3A/gi, "blob:").replace(/webkit-fake-url%3A/gi, "webkit-fake-url:").replace(/%3F/g, "?").replace(/%3D/g, "=").replace(/%26/g, "&").replace(/&amp;/g, "&").replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%2B/g, "+").replace(/%40/g, "@").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/%7B/g, "{").replace(/%7D/g, "}");
            return a
        }

        function p(a) {
            return a && !a.propertyIsEnumerable("length") && "object" == typeof a && "number" == typeof a.length
        }

        function q(a) {
            function b(a) {
                return ("0" + parseInt(a, 10).toString(16)).slice(-2)
            }
            try {
                return a && "transparent" !== a ? /^#[0-9A-F]{6}$/i.test(a) ? a : (a = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/), ("#" + b(a[1]) + b(a[2]) + b(a[3])).toUpperCase()) : ""
            } catch (c) {
                return null
            }
        }

        function r(a) {
            var b = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            a = a.replace(b, function(a, b, c, d) {
                return b + b + c + c + d + d
            });
            var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
            return c ? "rgb(" + parseInt(c[1], 16) + ", " + parseInt(c[2], 16) + ", " + parseInt(c[3], 16) + ")" : ""
        }

        function s(b) {
            var c = (b.css("text-align") || "").replace(/-(.*)-/g, "");
            if (["left", "right", "justify", "center"].indexOf(c) < 0) {
                if (!v) {
                    var d = a('<div dir="auto" style="text-align: initial; position: fixed; left: -3000px;"><span id="s1">.</span><span id="s2">.</span></div>');
                    a("body").append(d);
                    var e = d.find("#s1").get(0).getBoundingClientRect().left,
                        f = d.find("#s2").get(0).getBoundingClientRect().left;
                    d.remove(), v = f > e ? "left" : "right"
                }
                c = v
            }
            return c
        }

        function t() {
            return null == w && (w = navigator.platform.toUpperCase().indexOf("MAC") >= 0), w
        }

        function u() {
            b.browser = d()
        }
        var v, w = null;
        return {
            _init: u,
            isIOS: e,
            isMac: t,
            isAndroid: f,
            isBlackberry: g,
            isWindowsPhone: h,
            isMobile: i,
            requestAnimationFrame: j,
            getPX: k,
            screenSize: l,
            isTouch: m,
            sanitizeURL: o,
            isArray: p,
            RGBToHex: q,
            HEXtoRGB: r,
            isURL: n,
            getAlignment: s
        }
    }, a.FE.MODULES.events = function(b) {
        function c(a, b, c) {
            s(a, b, c)
        }

        function d() {
            c(b.$el, "cut copy paste beforepaste", function(a) {
                v(a.type, [a])
            })
        }

        function e() {
            c(b.$el, "click mouseup mousedown touchstart touchend dragenter dragover dragleave dragend drop dragstart", function(a) {
                v(a.type, [a])
            }), r("mousedown", function() {
                for (var c = 0; c < a.FE.INSTANCES.length; c++) a.FE.INSTANCES[c] != b && a.FE.INSTANCES[c].popups && a.FE.INSTANCES[c].popups.areVisible() && a.FE.INSTANCES[c].$el.find(".fr-marker").remove()
            })
        }

        function f() {
            c(b.$el, "keydown keypress keyup input", function(a) {
                v(a.type, [a])
            })
        }

        function g() {
            c(b.$win, b._mousedown, function(a) {
                v("window.mousedown", [a]), n()
            }), c(b.$win, b._mouseup, function(a) {
                v("window.mouseup", [a])
            }), c(b.$win, "cut copy keydown keyup touchmove touchend", function(a) {
                v("window." + a.type, [a])
            })
        }

        function h() {
            c(b.$doc, "dragend drop", function(a) {
                v("document." + a.type, [a])
            })
        }

        function i(c) {
            if ("undefined" == typeof c && (c = !0), !b.$wp) return !1;
            if (b.helpers.isIOS() && b.$win.get(0).focus(), !b.core.hasFocus() && c) {
                var d = b.$win.scrollTop();
                return b.$el.focus(), d != b.$win.scrollTop() && b.$win.scrollTop(d), !1
            }
            if (!b.core.hasFocus() || b.$el.find(".fr-marker").length > 0) return !1;
            var e = b.selection.info(b.$el.get(0));
            if (e.atStart && b.selection.isCollapsed() && null != b.html.defaultTag()) {
                var f = b.markers.insert();
                if (f && !b.node.blockParent(f)) {
                    a(f).remove();
                    var g = b.$el.find(b.html.blockTagsQuery()).get(0);
                    g && (a(g).prepend(a.FE.MARKERS), b.selection.restore())
                } else f && a(f).remove()
            }
        }

        function j() {
            c(b.$el, "focus", function(a) {
                p() && (i(!1), C === !1 && v(a.type, [a]))
            }), c(b.$el, "blur", function(a) {
                p() && C === !0 && (v(a.type, [a]), n())
            }), r("focus", function() {
                C = !0
            }), r("blur", function() {
                C = !1
            })
        }

        function k() {
            b.helpers.isMobile() ? (b._mousedown = "touchstart", b._mouseup = "touchend", b._move = "touchmove", b._mousemove = "touchmove") : (b._mousedown = "mousedown", b._mouseup = "mouseup", b._move = "", b._mousemove = "mousemove")
        }

        function l(c) {
            var d = a(c.currentTarget);
            return b.edit.isDisabled() || d.hasClass("fr-disabled") ? (c.preventDefault(), !1) : "mousedown" === c.type && 1 !== c.which ? !0 : (b.helpers.isMobile() || c.preventDefault(), (b.helpers.isAndroid() || b.helpers.isWindowsPhone()) && 0 === d.parents(".fr-dropdown-menu").length && (c.preventDefault(), c.stopPropagation()), d.addClass("fr-selected"), void b.events.trigger("commands.mousedown", [d]))
        }

        function m(c, d) {
            var e = a(c.currentTarget);
            if (b.edit.isDisabled() || e.hasClass("fr-disabled")) return c.preventDefault(), !1;
            if ("mouseup" === c.type && 1 !== c.which) return !0;
            if (!e.hasClass("fr-selected")) return !0;
            if ("touchmove" != c.type) {
                if (c.stopPropagation(), c.stopImmediatePropagation(), c.preventDefault(), !e.hasClass("fr-selected")) return a(".fr-selected").removeClass("fr-selected"), !1;
                if (a(".fr-selected").removeClass("fr-selected"), e.data("dragging") || e.attr("disabled")) return e.removeData("dragging"), !1;
                var f = e.data("timeout");
                f && (clearTimeout(f), e.removeData("timeout")), d.apply(b, [c])
            } else e.data("timeout") || e.data("timeout", setTimeout(function() {
                e.data("dragging", !0)
            }, 100))
        }

        function n() {
            A = !0
        }

        function o() {
            A = !1
        }

        function p() {
            return A
        }

        function q(a, c, d) {
            s(a, b._mousedown, c, function(a) {
                b.edit.isDisabled() || l(a)
            }, !0), s(a, b._mouseup + " " + b._move, c, function(a) {
                b.edit.isDisabled() || m(a, d)
            }, !0), s(a, "mousedown click mouseup", c, function(a) {
                b.edit.isDisabled() || a.stopPropagation()
            }, !0), r("window.mouseup", function() {
                b.edit.isDisabled() || (a.find(c).removeClass("fr-selected"), n())
            })
        }

        function r(a, c, d) {
            var e = a.split(" ");
            if (e.length > 1) {
                for (var f = 0; f < e.length; f++) r(e[f], c, d);
                return !0
            }
            "undefined" == typeof d && (d = !1);
            var g;
            g = 0 != a.indexOf("shared.") ? B[a] = B[a] || [] : b.shared._events[a] = b.shared._events[a] || [], d ? g.unshift(c) : g.push(c)
        }

        function s(a, c, d, e, f) {
            "function" == typeof d && (f = e, e = d, d = !1);
            var g = f ? b.shared.$_events : D,
                h = f ? b.sid : b.id;
            d ? a.on(c.split(" ").join(".ed" + h + " ") + ".ed" + h, d, e) : a.on(c.split(" ").join(".ed" + h + " ") + ".ed" + h, e), g.indexOf(a.get(0)) < 0 && g.push(a.get(0))
        }

        function t(b, c) {
            for (var d = 0; d < b.length; d++) a(b[d]).off(".ed" + c)
        }

        function u() {
            t(D, b.id), D = [], 0 == b.shared.count && (t(b.shared.$_events, b.sid), b.shared.$_events = null)
        }

        function v(c, d, e) {
            if (!b.edit.isDisabled() || e) {
                var f;
                if (0 != c.indexOf("shared.")) f = B[c];
                else {
                    if (b.shared.count > 0) return !1;
                    f = b.shared._events[c]
                }
                var g;
                if (f)
                    for (var h = 0; h < f.length; h++)
                        if (g = f[h].apply(b, d), g === !1) return !1;
                return g = b.$oel.triggerHandler("froalaEditor." + c, a.merge([b], d || [])), g === !1 ? !1 : g
            }
        }

        function w(c, d, e) {
            if (!b.edit.isDisabled() || e) {
                var f;
                if (0 != c.indexOf("shared.")) f = B[c];
                else {
                    if (b.shared.count > 0) return !1;
                    f = b.shared._events[c]
                }
                var g;
                if (f)
                    for (var h = 0; h < f.length; h++) g = f[h].apply(b, [d]), "undefined" != typeof g && (d = g);
                return g = b.$oel.triggerHandler("froalaEditor." + c, a.merge([b], [d])), "undefined" != typeof g && (d = g), d
            }
        }

        function x() {
            for (var a in B) B.hasOwnProperty(a) && delete B[a]
        }

        function y() {
            for (var a in b.shared._events) b.shared._events.hasOwnProperty(a) && delete b.shared._events[a]
        }

        function z() {
            b.shared.$_events = b.shared.$_events || [], b.shared._events = {}, k(), e(), g(), h(), f(), j(), n(), d(), r("destroy", x), r("shared.destroy", y)
        }
        var A, B = {},
            C = !1,
            D = [];
        return {
            _init: z,
            on: r,
            trigger: v,
            bindClick: q,
            disableBlur: o,
            enableBlur: n,
            blurActive: p,
            focus: i,
            chainTrigger: w,
            $on: s,
            $off: u
        }
    }, a.FE.INVISIBLE_SPACE = "&#8203;", a.FE.START_MARKER = '<span class="fr-marker" data-id="0" data-type="true" style="display: none; line-height: 0;">' + a.FE.INVISIBLE_SPACE + "</span>", a.FE.END_MARKER = '<span class="fr-marker" data-id="0" data-type="false" style="display: none; line-height: 0;">' + a.FE.INVISIBLE_SPACE + "</span>", a.FE.MARKERS = a.FE.START_MARKER + a.FE.END_MARKER, a.FE.MODULES.markers = function(b) {
        function c(c, d) {
            return a('<span class="fr-marker" data-id="' + d + '" data-type="' + c + '" style="display: ' + (b.browser.safari ? "none" : "inline-block") + '; line-height: 0;">' + a.FE.INVISIBLE_SPACE + "</span>", b.doc)[0]
        }

        function d(d, e, f) {
            try {
                var g = d.cloneRange();
                if (g.collapse(e), g.insertNode(c(e, f)), e === !0 && d.collapsed)
                    for (var h = b.$el.find('span.fr-marker[data-type="true"][data-id="' + f + '"]'), i = h.get(0).nextSibling; i && i.nodeType === Node.TEXT_NODE && 0 === i.textContent.length;) a(i).remove(), i = h.nextSibling;
                if (e === !0 && !d.collapsed) {
                    var h = b.$el.find('span.fr-marker[data-type="true"][data-id="' + f + '"]').get(0),
                        i = h.nextSibling;
                    if (i && i.nodeType === Node.ELEMENT_NODE && b.node.isBlock(i)) {
                        var j = [i];
                        do i = j[0], j = b.node.contents(i); while (j[0] && b.node.isBlock(j[0]));
                        a(i).prepend(a(h))
                    }
                }
                if (e === !1 && !d.collapsed) {
                    var h = b.$el.find('span.fr-marker[data-type="false"][data-id="' + f + '"]').get(0),
                        i = h.previousSibling;
                    if (i && i.nodeType === Node.ELEMENT_NODE && b.node.isBlock(i)) {
                        var j = [i];
                        do i = j[j.length - 1], j = b.node.contents(i); while (j[j.length - 1] && b.node.isBlock(j[j.length - 1]));
                        a(i).append(a(h))
                    }
                    h.parentNode && ["TD", "TH"].indexOf(h.parentNode.tagName) >= 0 && h.parentNode.previousSibling && !h.previousSibling && a(h.parentNode.previousSibling).append(h)
                }
                var k = b.$el.find('span.fr-marker[data-type="' + e + '"][data-id="' + f + '"]').get(0);
                return k && (k.style.display = "none"), k
            } catch (l) {
                return null
            }
        }

        function e() {
            if (!b.$wp) return null;
            try {
                var c = b.selection.ranges(0),
                    d = c.commonAncestorContainer;
                if (d != b.$el.get(0) && 0 == b.$el.find(d).length) return null;
                var e = c.cloneRange(),
                    f = c.cloneRange();
                e.collapse(!0);
                var g = a('<span class="fr-marker" style="display: none; line-height: 0;">' + a.FE.INVISIBLE_SPACE + "</span>", b.doc)[0];
                if (e.insertNode(g), g = b.$el.find("span.fr-marker").get(0)) {
                    for (var h = g.nextSibling; h && h.nodeType === Node.TEXT_NODE && 0 === h.textContent.length;) a(h).remove(), h = b.$el.find("span.fr-marker").get(0).nextSibling;
                    return b.selection.clear(), b.selection.get().addRange(f), g
                }
                return null
            } catch (i) {}
        }

        function f() {
            b.selection.isCollapsed() || b.selection.remove();
            var c = b.$el.find(".fr-marker").get(0);
            if (null == c && (c = e()), null == c) return null;
            var d;
            if (d = b.node.deepestParent(c))
                if (b.node.isBlock(d) && b.node.isEmpty(d)) a(d).replaceWith('<span class="fr-marker"></span>');
                else {
                    var f = c,
                        g = "",
                        h = "";
                    do f = f.parentNode, g += b.node.closeTagString(f), h = b.node.openTagString(f) + h; while (f != d);
                    a(c).replaceWith('<span id="fr-break"></span>');
                    var i = b.node.openTagString(d) + a(d).html() + b.node.closeTagString(d);
                    i = i.replace(/<span id="fr-break"><\/span>/g, g + '<span class="fr-marker"></span>' + h), a(d).replaceWith(i)
                }
            return b.$el.find(".fr-marker").get(0)
        }

        function g(a) {
            var c = a.clientX,
                d = a.clientY;
            h();
            var f, g = null;
            if ("undefined" != typeof b.doc.caretPositionFromPoint ? (f = b.doc.caretPositionFromPoint(c, d),
                    g = b.doc.createRange(), g.setStart(f.offsetNode, f.offset), g.setEnd(f.offsetNode, f.offset)) : "undefined" != typeof b.doc.caretRangeFromPoint && (f = b.doc.caretRangeFromPoint(c, d), g = b.doc.createRange(), g.setStart(f.startContainer, f.startOffset), g.setEnd(f.startContainer, f.startOffset)), null !== g && "undefined" != typeof b.win.getSelection) {
                var i = b.win.getSelection();
                i.removeAllRanges(), i.addRange(g)
            } else if ("undefined" != typeof b.doc.body.createTextRange) try {
                g = b.doc.body.createTextRange(), g.moveToPoint(c, d);
                var j = g.duplicate();
                j.moveToPoint(c, d), g.setEndPoint("EndToEnd", j), g.select()
            } catch (k) {
                return !1
            }
            e()
        }

        function h() {
            b.$el.find(".fr-marker").remove()
        }
        return {
            place: d,
            insert: e,
            split: f,
            insertAtPoint: g,
            remove: h
        }
    }, a.FE.MODULES.selection = function(b) {
        function c() {
            var a = "";
            return b.win.getSelection ? a = b.win.getSelection() : b.doc.getSelection ? a = b.doc.getSelection() : b.doc.selection && (a = b.doc.selection.createRange().text), a.toString()
        }

        function d() {
            var a = "";
            return a = b.win.getSelection ? b.win.getSelection() : b.doc.getSelection ? b.doc.getSelection() : b.doc.selection.createRange()
        }

        function e(a) {
            var c = d(),
                e = [];
            if (c && c.getRangeAt && c.rangeCount)
                for (var e = [], f = 0; f < c.rangeCount; f++) e.push(c.getRangeAt(f));
            else e = b.doc.createRange ? [b.doc.createRange()] : [];
            return "undefined" != typeof a ? e[a] : e
        }

        function f() {
            var a = d();
            try {
                a.removeAllRanges ? a.removeAllRanges() : a.empty ? a.empty() : a.clear && a.clear()
            } catch (b) {}
        }

        function g() {
            var f = d();
            try {
                if (f.rangeCount) {
                    var g = e(0),
                        h = g.startContainer;
                    if (h.nodeType == Node.TEXT_NODE && g.startOffset == (h.textContent || "").length && h.nextSibling && (h = h.nextSibling), h.nodeType == Node.ELEMENT_NODE) {
                        var i = !1;
                        if (h.childNodes.length > 0 && h.childNodes[g.startOffset]) {
                            for (var j = h.childNodes[g.startOffset]; j && j.nodeType == Node.TEXT_NODE && 0 == j.textContent.length;) j = j.nextSibling;
                            if (j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = !0), !i && h.childNodes.length > 1 && g.startOffset > 0 && h.childNodes[g.startOffset - 1]) {
                                for (var j = h.childNodes[g.startOffset - 1]; j && j.nodeType == Node.TEXT_NODE && 0 == j.textContent.length;) j = j.nextSibling;
                                j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = !0)
                            }
                        } else if (!g.collapsed && h.nextSibling && h.nextSibling.nodeType == Node.ELEMENT_NODE) {
                            var j = h.nextSibling;
                            j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = !0)
                        }!i && h.childNodes.length > 0 && a(h.childNodes[0]).text().replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && ["BR", "IMG", "HR"].indexOf(h.childNodes[0].tagName) < 0 && (h = h.childNodes[0])
                    }
                    for (; h.nodeType != Node.ELEMENT_NODE && h.parentNode;) h = h.parentNode;
                    for (var k = h; k && "HTML" != k.tagName;) {
                        if (k == b.$el.get(0)) return h;
                        k = a(k).parent()[0]
                    }
                }
            } catch (l) {}
            return b.$el.get(0)
        }

        function h() {
            var f = d();
            try {
                if (f.rangeCount) {
                    var g = e(0),
                        h = g.endContainer;
                    if (h.nodeType == Node.ELEMENT_NODE) {
                        var i = !1;
                        if (h.childNodes.length > 0 && h.childNodes[g.endOffset] && a(h.childNodes[g.endOffset]).text() === c()) h = h.childNodes[g.endOffset], i = !0;
                        else if (!g.collapsed && h.previousSibling && h.previousSibling.nodeType == Node.ELEMENT_NODE) {
                            var j = h.previousSibling;
                            j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = !0)
                        } else if (!g.collapsed && h.childNodes.length > 0 && h.childNodes[g.endOffset]) {
                            var j = h.childNodes[g.endOffset].previousSibling;
                            j.nodeType == Node.ELEMENT_NODE && j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = !0)
                        }!i && h.childNodes.length > 0 && a(h.childNodes[h.childNodes.length - 1]).text() === c() && ["BR", "IMG", "HR"].indexOf(h.childNodes[h.childNodes.length - 1].tagName) < 0 && (h = h.childNodes[h.childNodes.length - 1])
                    }
                    for (h.nodeType == Node.TEXT_NODE && 0 == g.endOffset && h.previousSibling && h.previousSibling.nodeType == Node.ELEMENT_NODE && (h = h.previousSibling); h.nodeType != Node.ELEMENT_NODE && h.parentNode;) h = h.parentNode;
                    for (var k = h; k && "HTML" != k.tagName;) {
                        if (k == b.$el.get(0)) return h;
                        k = a(k).parent()[0]
                    }
                }
            } catch (l) {}
            return b.$el.get(0)
        }

        function i(a, b) {
            var c = a;
            return c.nodeType == Node.ELEMENT_NODE && c.childNodes.length > 0 && c.childNodes[b] && (c = c.childNodes[b]), c.nodeType == Node.TEXT_NODE && (c = c.parentNode), c
        }

        function j() {
            var c = [],
                f = d();
            if (t() && f.rangeCount)
                for (var g = e(), h = 0; h < g.length; h++) {
                    var j = g[h],
                        k = i(j.startContainer, j.startOffset),
                        l = i(j.endContainer, j.endOffset);
                    b.node.isBlock(k) && c.indexOf(k) < 0 && c.push(k);
                    var m = b.node.blockParent(k);
                    m && c.indexOf(m) < 0 && c.push(m);
                    for (var n = [], o = k; o !== l && o !== b.$el.get(0);) n.indexOf(o) < 0 && o.children && o.children.length ? (n.push(o), o = o.children[0]) : o.nextSibling ? o = o.nextSibling : o.parentNode && (o = o.parentNode, n.push(o)), b.node.isBlock(o) && n.indexOf(o) < 0 && c.indexOf(o) < 0 && (o !== l || j.endOffset > 0) && c.push(o);
                    b.node.isBlock(l) && c.indexOf(l) < 0 && j.endOffset > 0 && c.push(l);
                    var m = b.node.blockParent(l);
                    m && c.indexOf(m) < 0 && c.push(m)
                }
            for (var h = c.length - 1; h > 0; h--) a(c[h]).find(c).length && "LI" != c[h].tagName && c.splice(h, 1);
            return c
        }

        function k() {
            if (b.$wp) {
                b.markers.remove();
                for (var a = e(), c = [], d = 0; d < a.length; d++)
                    if (a[d].startContainer !== b.doc) {
                        var f = a[d],
                            g = f.collapsed,
                            h = b.markers.place(f, !0, d),
                            i = b.markers.place(f, !1, d);
                        if (b.$el.get(0).normalize(), b.browser.safari && !g) {
                            var f = b.doc.createRange();
                            f.setStartAfter(h), f.setEndBefore(i), c.push(f)
                        }
                    }
                if (b.browser.safari && c.length) {
                    b.selection.clear();
                    for (var d = 0; d < c.length; d++) b.selection.get().addRange(c[d])
                }
            }
        }

        function l() {
            var c = b.$el.get(0).querySelectorAll('.fr-marker[data-type="true"]');
            if (!b.$wp) return b.markers.remove(), !1;
            if (0 === c.length) return !1;
            if (b.browser.msie || b.browser.edge)
                for (var e = 0; e < c.length; e++) c[e].style.display = "inline-block";
            b.core.hasFocus() || b.browser.msie || b.browser.webkit || b.$el.focus(), f();
            for (var g = d(), e = 0; e < c.length; e++) {
                var h = a(c[e]).data("id"),
                    i = c[e],
                    j = b.doc.createRange(),
                    k = b.$el.find('.fr-marker[data-type="false"][data-id="' + h + '"]');
                (b.browser.msie || b.browser.edge) && k.css("display", "inline-block");
                var l = null;
                if (k.length > 0) {
                    k = k[0];
                    try {
                        for (var n = !1, o = i.nextSibling; o && o.nodeType == Node.TEXT_NODE && 0 == o.textContent.length;) {
                            var p = o;
                            o = o.nextSibling, a(p).remove()
                        }
                        for (var q = k.nextSibling; q && q.nodeType == Node.TEXT_NODE && 0 == q.textContent.length;) {
                            var p = q;
                            q = q.nextSibling, a(p).remove()
                        }
                        if (i.nextSibling == k || k.nextSibling == i) {
                            for (var r = i.nextSibling == k ? i : k, s = r == i ? k : i, t = r.previousSibling; t && t.nodeType == Node.TEXT_NODE && 0 == t.length;) {
                                var p = t;
                                t = t.previousSibling, a(p).remove()
                            }
                            if (t && t.nodeType == Node.TEXT_NODE)
                                for (; t && t.previousSibling && t.previousSibling.nodeType == Node.TEXT_NODE;) t.previousSibling.textContent = t.previousSibling.textContent + t.textContent, t = t.previousSibling, a(t.nextSibling).remove();
                            for (var u = s.nextSibling; u && u.nodeType == Node.TEXT_NODE && 0 == u.length;) {
                                var p = u;
                                u = u.nextSibling, a(p).remove()
                            }
                            if (u && u.nodeType == Node.TEXT_NODE)
                                for (; u && u.nextSibling && u.nextSibling.nodeType == Node.TEXT_NODE;) u.nextSibling.textContent = u.textContent + u.nextSibling.textContent, u = u.nextSibling, a(u.previousSibling).remove();
                            if (t && (b.node.isVoid(t) || b.node.isBlock(t)) && (t = null), u && (b.node.isVoid(u) || b.node.isBlock(u)) && (u = null), t && u && t.nodeType == Node.TEXT_NODE && u.nodeType == Node.TEXT_NODE) {
                                a(i).remove(), a(k).remove();
                                var v = t.textContent.length;
                                t.textContent = t.textContent + u.textContent, a(u).remove(), b.spaces.normalize(t), j.setStart(t, v), j.setEnd(t, v), n = !0
                            } else !t && u && u.nodeType == Node.TEXT_NODE ? (a(i).remove(), a(k).remove(), b.spaces.normalize(u), l = a(b.doc.createTextNode("\u200b")), a(u).before(l), j.setStart(u, 0), j.setEnd(u, 0), n = !0) : !u && t && t.nodeType == Node.TEXT_NODE && (a(i).remove(), a(k).remove(), b.spaces.normalize(t), l = a(b.doc.createTextNode("\u200b")), a(t).after(l), j.setStart(t, t.textContent.length), j.setEnd(t, t.textContent.length), n = !0)
                        }
                        if (!n) {
                            var w, x;
                            if (b.browser.chrome && i.nextSibling == k) w = m(k, j, !0) || j.setStartAfter(k), x = m(i, j, !1) || j.setEndBefore(i);
                            else {
                                i.previousSibling == k && (i = k, k = i.nextSibling), k.nextSibling && "BR" === k.nextSibling.tagName || !k.nextSibling && b.node.isBlock(i.previousSibling) || i.previousSibling && "BR" == i.previousSibling.tagName || (i.style.display = "inline", k.style.display = "inline", l = a(b.doc.createTextNode("\u200b")));
                                var y = i.previousSibling;
                                y && y.style && "block" == b.win.getComputedStyle(y).display && !b.opts.enter == a.FE.ENTER_BR ? (j.setEndAfter(y), j.setStartAfter(y)) : (w = m(i, j, !0) || a(i).before(l) && j.setStartBefore(i), x = m(k, j, !1) || a(k).after(l) && j.setEndAfter(k))
                            }
                            "function" == typeof w && w(), "function" == typeof x && x()
                        }
                    } catch (z) {}
                }
                l && l.remove();
                try {
                    g.addRange(j)
                } catch (z) {}
            }
            b.markers.remove()
        }

        function m(c, d, e) {
            var f = c.previousSibling,
                g = c.nextSibling;
            if (f && g && f.nodeType == Node.TEXT_NODE && g.nodeType == Node.TEXT_NODE) {
                var h = f.textContent.length;
                return e ? (g.textContent = f.textContent + g.textContent, a(f).remove(), a(c).remove(), b.spaces.normalize(g), function() {
                    d.setStart(g, h)
                }) : (f.textContent = f.textContent + g.textContent, a(g).remove(), a(c).remove(), b.spaces.normalize(f), function() {
                    d.setEnd(f, h)
                })
            }
            if (f && !g && f.nodeType == Node.TEXT_NODE) {
                var h = f.textContent.length;
                return e ? (b.spaces.normalize(f), function() {
                    d.setStart(f, h)
                }) : (b.spaces.normalize(f), function() {
                    d.setEnd(f, h)
                })
            }
            return g && !f && g.nodeType == Node.TEXT_NODE ? e ? (b.spaces.normalize(g), function() {
                d.setStart(g, 0)
            }) : (b.spaces.normalize(g), function() {
                d.setEnd(g, 0)
            }) : !1
        }

        function n() {
            return !0
        }

        function o() {
            for (var a = e(), b = 0; b < a.length; b++)
                if (!a[b].collapsed) return !1;
            return !0
        }

        function p(a) {
            var c, d, e = !1,
                f = !1;
            if (b.win.getSelection) {
                var g = b.win.getSelection();
                g.rangeCount && (c = g.getRangeAt(0), d = c.cloneRange(), d.selectNodeContents(a), d.setEnd(c.startContainer, c.startOffset), e = "" === d.toString(), d.selectNodeContents(a), d.setStart(c.endContainer, c.endOffset), f = "" === d.toString())
            } else b.doc.selection && "Control" != b.doc.selection.type && (c = b.doc.selection.createRange(), d = c.duplicate(), d.moveToElementText(a), d.setEndPoint("EndToStart", c), e = "" === d.text, d.moveToElementText(a), d.setEndPoint("StartToEnd", c), f = "" === d.text);
            return {
                atStart: e,
                atEnd: f
            }
        }

        function q() {
            if (o()) return !1;
            b.$el.find("td, th, img").prepend('<span class="fr-mk">' + a.FE.INVISIBLE_SPACE + "</span>");
            var c = !1,
                d = p(b.$el.get(0));
            return d.atStart && d.atEnd && (c = !0), b.$el.find(".fr-mk").remove(), c
        }

        function r(c, d) {
            "undefined" == typeof d && (d = !0);
            var e = a(c).html();
            e && e.replace(/\u200b/g, "").length != e.length && a(c).html(e.replace(/\u200b/g, ""));
            for (var f = b.node.contents(c), g = 0; g < f.length; g++) f[g].nodeType != Node.ELEMENT_NODE ? a(f[g]).remove() : (r(f[g], 0 == g), 0 == g && (d = !1));
            c.nodeType == Node.TEXT_NODE ? a(c).replaceWith('<span data-first="true" data-text="true"></span>') : d && a(c).attr("data-first", !0)
        }

        function s(c, d) {
            var e = b.node.contents(c.get(0));
            ["TD", "TH"].indexOf(c.get(0).tagName) >= 0 && 1 == c.find(".fr-marker").length && a(e[0]).hasClass("fr-marker") && c.attr("data-del-cell", !0);
            for (var f = 0; f < e.length; f++) {
                var g = e[f];
                a(g).hasClass("fr-marker") ? d = (d + 1) % 2 : d ? a(g).find(".fr-marker").length > 0 ? d = s(a(g), d) : ["TD", "TH"].indexOf(g.tagName) < 0 && !a(g).hasClass("fr-inner") ? !b.opts.keepFormatOnDelete || b.$el.find("[data-first]").length > 0 ? a(g).remove() : r(g) : a(g).hasClass("fr-inner") ? 0 == a(g).find(".fr-inner").length ? a(g).html("<br>") : a(g).find(".fr-inner").filter(function() {
                    return 0 == a(this).find("fr-inner").length
                }).html("<br>") : (a(g).empty(), a(g).attr("data-del-cell", !0)) : a(g).find(".fr-marker").length > 0 && (d = s(a(g), d))
            }
            return d
        }

        function t() {
            try {
                if (!b.$wp) return !1;
                for (var a = e(0), c = a.commonAncestorContainer; c && !b.node.isElement(c);) c = c.parentNode;
                return b.node.isElement(c) ? !0 : !1
            } catch (d) {
                return !1
            }
        }

        function u() {
            if (o()) return !0;
            k();
            for (var c = function(b) {
                    for (var c = b.previousSibling; c && c.nodeType == Node.TEXT_NODE && 0 == c.textContent.length;) {
                        var d = c,
                            c = c.previousSibling;
                        a(d).remove()
                    }
                    return c
                }, d = function(b) {
                    for (var c = b.nextSibling; c && c.nodeType == Node.TEXT_NODE && 0 == c.textContent.length;) {
                        var d = c,
                            c = c.nextSibling;
                        a(d).remove()
                    }
                    return c
                }, e = b.$el.find('.fr-marker[data-type="true"]'), f = 0; f < e.length; f++)
                for (var g = e[f]; !c(g) && !b.node.isBlock(g.parentNode) && !b.$el.is(g.parentNode);) a(g.parentNode).before(g);
            for (var h = b.$el.find('.fr-marker[data-type="false"]'), f = 0; f < h.length; f++) {
                for (var i = h[f]; !d(i) && !b.node.isBlock(i.parentNode) && !b.$el.is(i.parentNode);) a(i.parentNode).after(i);
                i.parentNode && b.node.isBlock(i.parentNode) && b.node.isEmpty(i.parentNode) && !b.$el.is(i.parentNode) && b.opts.keepFormatOnDelete && a(i.parentNode).after(i)
            }
            if (n()) {
                s(b.$el, 0);
                var j = b.$el.find('[data-first="true"]');
                if (j.length) b.$el.find(".fr-marker").remove(), j.append(a.FE.INVISIBLE_SPACE + a.FE.MARKERS).removeAttr("data-first"), j.attr("data-text") && j.replaceWith(j.html());
                else {
                    b.$el.find("table").filter(function() {
                        var b = a(this).find("[data-del-cell]").length > 0 && a(this).find("[data-del-cell]").length == a(this).find("td, th").length;
                        return b
                    }).remove(), b.$el.find("[data-del-cell]").removeAttr("data-del-cell");
                    for (var e = b.$el.find('.fr-marker[data-type="true"]'), f = 0; f < e.length; f++) {
                        var m = e[f],
                            p = m.nextSibling,
                            q = b.$el.find('.fr-marker[data-type="false"][data-id="' + a(m).data("id") + '"]').get(0);
                        if (q) {
                            if (p && p == q);
                            else if (m) {
                                var r = b.node.blockParent(m),
                                    t = b.node.blockParent(q),
                                    u = !1,
                                    v = !1;
                                if (r && ["UL", "OL"].indexOf(r.tagName) >= 0 && (r = null, u = !0), t && ["UL", "OL"].indexOf(t.tagName) >= 0 && (t = null, v = !0), a(m).after(q), r == t);
                                else if (null != r || u)
                                    if (null != t || v || 0 != a(r).parentsUntil(b.$el, "table").length) r && t && 0 == a(r).parentsUntil(b.$el, "table").length && 0 == a(t).parentsUntil(b.$el, "table").length && (a(r).append(a(t).html()), a(t).remove());
                                    else {
                                        for (var p = r; !p.nextSibling && p.parentNode != b.$el.get(0);) p = p.parentNode;
                                        for (p = p.nextSibling; p && "BR" != p.tagName;) {
                                            var w = p.nextSibling;
                                            a(r).append(p), p = w
                                        }
                                        p && "BR" == p.tagName && a(p).remove()
                                    } else {
                                    var x = b.node.deepestParent(m);
                                    x ? (a(x).after(a(t).html()), a(t).remove()) : 0 == a(t).parentsUntil(b.$el, "table").length && (a(m).next().after(a(t).html()), a(t).remove())
                                }
                            }
                        } else q = a(m).clone().attr("data-type", !1), a(m).after(q)
                    }
                }
            }
            b.opts.keepFormatOnDelete || b.html.fillEmptyBlocks(), b.html.cleanEmptyTags(!0), b.clean.lists(), b.spaces.normalize();
            var y = b.$el.find(".fr-marker:last").get(0),
                z = b.$el.find(".fr-marker:first").get(0);
            !y.nextSibling && z.previousSibling && "BR" == z.previousSibling.tagName && b.node.isElement(y.parentNode) && b.node.isElement(z.parentNode) && b.$el.append("<br>"), l()
        }

        function v(c) {
            if (a(c).find(".fr-marker").length > 0) return !1;
            for (var d = b.node.contents(c); d.length && b.node.isBlock(d[0]);) c = d[0], d = b.node.contents(c);
            a(c).prepend(a.FE.MARKERS)
        }

        function w(c) {
            if (a(c).find(".fr-marker").length > 0) return !1;
            for (var d = b.node.contents(c); d.length && b.node.isBlock(d[d.length - 1]);) c = d[d.length - 1], d = b.node.contents(c);
            a(c).append(a.FE.MARKERS)
        }

        function x(c) {
            for (var d = c.previousSibling; d && d.nodeType == Node.TEXT_NODE && 0 == d.textContent.length;) d = d.previousSibling;
            return d ? (b.node.isBlock(d) ? w(d) : "BR" == d.tagName ? a(d).before(a.FE.MARKERS) : a(d).after(a.FE.MARKERS), !0) : !1
        }

        function y(c) {
            for (var d = c.nextSibling; d && d.nodeType == Node.TEXT_NODE && 0 == d.textContent.length;) d = d.nextSibling;
            return d ? (b.node.isBlock(d) ? v(d) : a(d).before(a.FE.MARKERS), !0) : !1
        }
        return {
            text: c,
            get: d,
            ranges: e,
            clear: f,
            element: g,
            endElement: h,
            save: k,
            restore: l,
            isCollapsed: o,
            isFull: q,
            inEditor: t,
            remove: u,
            blocks: j,
            info: p,
            setAtEnd: w,
            setAtStart: v,
            setBefore: x,
            setAfter: y,
            rangeElement: i
        }
    }, a.FE.MODULES.spaces = function(b) {
        function c(a) {
            var b = a.nextSibling || a.parentNode;
            return a.parentNode.removeChild(a), b
        }

        function d(a, b) {
            return a && a.parentNode === b || "PRE" === b.nodeName ? b.nextSibling || b.parentNode : b.firstChild || b.nextSibling || b.parentNode
        }

        function e(a) {
            if (a.firstChild && "PRE" !== a.nodeName && !(["STYLE", "SCRIPT"].indexOf(a.tagName) >= 0)) {
                for (var e = null, f = null, g = d(f, a); g !== a && "PRE" !== g.nodeName && ["STYLE", "SCRIPT"].indexOf(g.tagName) < 0;) {
                    if (g.nodeType === Node.TEXT_NODE) {
                        var h = g.data.replace(/[ \r\n\t]+/g, " ");
                        if (e && !/ $/.test(e.data) || " " !== h[0] || g.previousSibling && b.node.isVoid(g.previousSibling) && "BR" !== g.previousSibling.tagName || (h = h.substr(1)), !h || 0 == h.length) {
                            g = c(g);
                            continue
                        }
                        g.data = h, e = g
                    } else g.nodeType === Node.ELEMENT_NODE && (b.node.isBlock(g) || b.node.isVoid(g) ? (e && e.data && (b.node.isBlock(g) || "BR" === g.tagName) && (e.data = e.data.replace(/ $/, "")), e = null) : 0 == g.textContent.length && (e = g));
                    var i = d(f, g);
                    f = g, g = i
                }
                e && e.data && (e.data = e.data.replace(/ $/, ""), e.data || c(e))
            }
        }

        function f(c, d) {
            if ("undefined" != typeof c && c || (c = b.$el.get(0)), "undefined" == typeof d && (d = !1), d && e(c), !c.getAttribute || "false" != c.getAttribute("contenteditable"))
                if (c.nodeType == Node.ELEMENT_NODE && ["STYLE", "SCRIPT", "HEAD"].indexOf(c.tagName) < 0)
                    for (var g = b.node.contents(c), h = g.length - 1; h >= 0; h--)(g[h].tagName != Node.ELEMENT_NODE || (g[h].getAttribute("class") || "").indexOf("fr-marker") < 0) && f(g[h]);
                else if (c.nodeType == Node.TEXT_NODE && c.textContent.length > 0) {
                var i = (c.previousSibling, c.nextSibling, c.textContent);
                i = i.replace(new RegExp(a.FE.UNICODE_NBSP, "g"), " ");
                for (var j = "", k = 0; k < i.length; k++) j += 32 != i.charCodeAt(k) || 0 !== k && 32 != j.charCodeAt(k - 1) ? i[k] : a.FE.UNICODE_NBSP;
                (!c.nextSibling || b.node.isBlock(c.nextSibling) || c.nextSibling.nodeType == Node.ELEMENT_NODE && b.win.getComputedStyle(c.nextSibling) && "block" == b.win.getComputedStyle(c.nextSibling).display) && (j = j.replace(/ $/, a.FE.UNICODE_NBSP)), !c.previousSibling || b.node.isVoid(c.previousSibling) || b.node.isBlock(c.previousSibling) || (j = j.replace(/^\u00A0([^ $])/, " $1"), 1 !== j.length || 160 !== j.charCodeAt(0) || !c.nextSibling || b.node.isVoid(c.nextSibling) || b.node.isBlock(c.nextSibling) || (j = " ")), j = j.replace(/([^ \u00A0])\u00A0([^ \u00A0])/g, "$1 $2"), c.textContent != j && (c.textContent = j)
            }
        }
        return {
            normalize: f
        }
    }, a.FE.UNICODE_NBSP = String.fromCharCode(160), a.FE.VOID_ELEMENTS = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"], a.FE.BLOCK_TAGS = ["address", "article", "aside", "audio", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul", "video"], a.extend(a.FE.DEFAULTS, {
        htmlAllowedEmptyTags: ["textarea", "a", "iframe", "object", "video", "style", "script", ".fa", ".fr-emoticon"],
        htmlDoNotWrapTags: ["script", "style"],
        htmlSimpleAmpersand: !1,
        htmlIgnoreCSSProperties: []
    }), a.FE.MODULES.html = function(b) {
        function c() {
            return b.opts.enter == a.FE.ENTER_P ? "p" : b.opts.enter == a.FE.ENTER_DIV ? "div" : b.opts.enter == a.FE.ENTER_BR ? null : void 0
        }

        function d() {
            var c = [],
                d = b.$el.get(0).querySelectorAll(f()),
                e = f();
            e += "," + a.FE.VOID_ELEMENTS.join(","), e += "," + b.opts.htmlAllowedEmptyTags.join(":not(.fr-marker),") + ":not(.fr-marker)";
            for (var g = d.length - 1; g >= 0; g--)
                if (!(d[g].querySelectorAll(e).length > 0 || d[g].textContent && d[g].textContent.replace(/\u200B|\n/g, "").length > 0)) {
                    for (var h = b.node.contents(d[g]), i = !1, j = 0; j < h.length; j++)
                        if (h[j].nodeType != Node.COMMENT_NODE && h[j].textContent && h[j].textContent.replace(/\u200B|\n/g, "").length > 0) {
                            i = !0;
                            break
                        }
                    i || c.push(d[g])
                }
            return c
        }

        function e() {
            return a.FE.BLOCK_TAGS.join(":empty, ") + ":empty"
        }

        function f() {
            return a.FE.BLOCK_TAGS.join(", ")
        }

        function g(c) {
            var d = a.merge([], a.FE.VOID_ELEMENTS);
            d = a.merge(d, b.opts.htmlAllowedEmptyTags), "undefined" == typeof c && (d = a.merge(d, a.FE.BLOCK_TAGS));
            var e, f;
            do {
                f = !1, e = b.$el.get(0).querySelectorAll("*:empty:not(" + d.join("):not(") + "):not(.fr-marker)");
                for (var g = 0; g < e.length; g++)(0 === e[g].attributes.length || "undefined" != typeof e[g].getAttribute("href")) && (a(e[g]).remove(), f = !0);
                e = b.$el.get(0).querySelectorAll("*:empty:not(" + d.join("):not(") + "):not(.fr-marker)")
            } while (e.length && f)
        }

        function h(d, e) {
            var f = c();
            if (e && (f = 'div class="fr-temp-div"'), f)
                for (var g = b.node.contents(d.get(0)), h = null, i = 0; i < g.length; i++) {
                    var j = g[i];
                    if (j.nodeType == Node.ELEMENT_NODE && (b.node.isBlock(j) || a(j).is(b.opts.htmlDoNotWrapTags.join(",")) && !a(j).hasClass("fr-marker"))) h = null;
                    else if (j.nodeType != Node.ELEMENT_NODE && j.nodeType != Node.TEXT_NODE) h = null;
                    else if (j.nodeType == Node.ELEMENT_NODE && "BR" == j.tagName)
                        if (null == h) e ? a(j).replaceWith("<" + f + ' data-empty="true"><br></div>') : a(j).replaceWith("<" + f + "><br></" + f + ">");
                        else {
                            a(j).remove();
                            for (var k = b.node.contents(h), l = !1, m = 0; m < k.length; m++)
                                if (!a(k[m]).hasClass("fr-marker") && (k[m].nodeType != Node.TEXT_NODE || 0 !== k[m].textContent.replace(/ /g, "").length)) {
                                    l = !0;
                                    break
                                }
                            l === !1 && (h.append("<br>"), h.data("empty", !0)), h = null
                        } else j.nodeType == Node.TEXT_NODE && 0 == j.textContent.replace(/\n/g, "").replace(/(^ *)|( *$)/g, "").length ? a(j).remove() : (null == h && (h = a("<" + f + ">"), a(j).before(h)), j.nodeType == Node.TEXT_NODE && a(j).text().trim().length > 0 ? (h.append(a(j).clone()), a(j).remove()) : h.append(a(j)))
                }
        }

        function i(c, d, e, f) {
            return b.$wp ? ("undefined" == typeof c && (c = !1), "undefined" == typeof d && (d = !1), "undefined" == typeof e && (e = !1), "undefined" == typeof f && (f = !1), h(b.$el, c), f && b.$el.find(".fr-inner").each(function() {
                h(a(this), c)
            }), d && b.$el.find("td, th").each(function() {
                h(a(this), c)
            }), void(e && b.$el.find("blockquote").each(function() {
                h(a(this), c)
            }))) : !1
        }

        function j() {
            b.$el.find("div.fr-temp-div").each(function() {
                a(this).data("empty") || "LI" == this.parentNode.tagName || b.node.isBlock(this.previousSibling) ? a(this).replaceWith(a(this).html()) : a(this).replaceWith(a(this).html() + "<br>")
            }), b.$el.find(".fr-temp-div").removeClass("fr-temp-div").filter(function() {
                return "" == a(this).attr("class")
            }).removeAttr("class")
        }

        function k() {
            for (var c = d(), e = 0; e < c.length; e++) {
                var f = c[e];
                "false" == f.getAttribute("contenteditable") || 0 != f.querySelectorAll(b.opts.htmlAllowedEmptyTags.join(":not(.fr-marker),") + ":not(.fr-marker)").length || b.node.isVoid(f) || "TABLE" != f.tagName && "TBODY" != f.tagName && "TR" != f.tagName && f.appendChild(b.doc.createElement("br"))
            }
            if (b.browser.msie && b.opts.enter == a.FE.ENTER_BR) {
                var g = b.node.contents(b.$el.get(0));
                g.length && g[g.length - 1].nodeType == Node.TEXT_NODE && b.$el.append("<br>")
            }
        }

        function l() {
            return b.$el.find(f())
        }

        function m(a) {
            if ("undefined" == typeof a && (a = b.$el.get(0)), a && ["SCRIPT", "STYLE", "PRE"].indexOf(a.tagName) >= 0) return !1;
            for (var c = b.node.contents(a), d = c.length - 1; d >= 0; d--)
                if (c[d].nodeType == Node.TEXT_NODE) {
                    c[d].textContent = c[d].textContent.replace(/(?!^)( ){2,}(?!$)/g, " "), c[d].textContent = c[d].textContent.replace(/\n/g, " "), c[d].textContent = c[d].textContent.replace(/^[ ]{2,}/g, " "), c[d].textContent = c[d].textContent.replace(/[ ]{2,}$/g, " "), (b.node.isBlock(a) || b.node.isElement(a)) && (c[d].previousSibling || (c[d].textContent = c[d].textContent.replace(/^ */, "")), c[d].nextSibling || (c[d].textContent = c[d].textContent.replace(/ *$/, "")), c[d].previousSibling && c[d].nextSibling && " " == c[d].textContent && (c[d].previousSibling && c[d].nextSibling && b.node.isBlock(c[d].previousSibling) && b.node.isBlock(c[d].nextSibling) ? c[d].textContent = "" : c[d].textContent = "\n"))
                } else m(c[d])
        }

        function n(a) {
            return a && (b.node.isBlock(a) || ["STYLE", "SCRIPT", "HEAD", "BR", "HR"].indexOf(a.tagName) >= 0 || a.nodeType == Node.COMMENT_NODE)
        }

        function o(c) {
            if ("undefined" == typeof c && (c = b.$el.get(0)), c.nodeType == Node.ELEMENT_NODE && ["STYLE", "SCRIPT", "HEAD"].indexOf(c.tagName) < 0) {
                for (var d = b.node.contents(c), e = d.length - 1; e >= 0; e--)
                    if (!a(d[e]).hasClass("fr-marker")) {
                        var f = o(d[e]);
                        if (1 == f) return !0
                    }
            } else if (c.nodeType == Node.TEXT_NODE && c.textContent.length > 0) {
                var g = c.previousSibling,
                    h = c.nextSibling;
                if (n(g) && n(h) && 0 === c.textContent.trim().length) return !0;
                var i = c.textContent;
                i = i.replace(new RegExp(a.FE.UNICODE_NBSP, "g"), " ");
                for (var j = "", k = 0; k < i.length; k++) j += 32 != i.charCodeAt(k) || 0 !== k && 32 != j.charCodeAt(k - 1) ? i[k] : a.FE.UNICODE_NBSP;
                if (c.nextSibling || (j = j.replace(/ $/, a.FE.UNICODE_NBSP)), c.previousSibling && !b.node.isVoid(c.previousSibling) && (j = j.replace(/^\u00A0([^ $])/, " $1")), j = j.replace(/([^ \u00A0])\u00A0([^ \u00A0])/g, "$1 $2"), c.textContent != j) return !0
            }
            return !1
        }

        function p(a, b, c) {
            var d = new RegExp(b, "gi"),
                e = d.exec(a);
            return e ? e[c] : null
        }

        function q(a, b) {
            var c = a.match(/<!DOCTYPE ?([^ ]*) ?([^ ]*) ?"?([^"]*)"? ?"?([^"]*)"?>/i);
            return c ? b.implementation.createDocumentType(c[1], c[3], c[4]) : b.implementation.createDocumentType("html")
        }

        function r(a) {
            var b = a.doctype,
                c = "<!DOCTYPE html>";
            return b && (c = "<!DOCTYPE " + b.name + (b.publicId ? ' PUBLIC "' + b.publicId + '"' : "") + (!b.publicId && b.systemId ? " SYSTEM" : "") + (b.systemId ? ' "' + b.systemId + '"' : "") + ">"), c
        }

        function s() {
            g(), i(), m(), b.spaces.normalize(null, !0), b.html.fillEmptyBlocks(), b.clean.quotes(), b.clean.lists(), b.clean.tables(), b.clean.toHTML5(), b.selection.restore(), t(), b.placeholder.refresh()
        }

        function t() {
            b.core.isEmpty() && (null != c() ? 0 === b.$el.get(0).querySelectorAll(f()).length && 0 === b.$el.get(0).querySelectorAll(b.opts.htmlDoNotWrapTags.join(":not(.fr-marker),") + ":not(.fr-marker)").length && (b.core.hasFocus() ? (b.$el.html("<" + c() + ">" + a.FE.MARKERS + "<br/></" + c() + ">"), b.selection.restore()) : b.$el.html("<" + c() + "><br/></" + c() + ">")) : 0 === b.$el.get(0).querySelectorAll("*:not(.fr-marker):not(br)").length && (b.core.hasFocus() ? (b.$el.html(a.FE.MARKERS + "<br/>"), b.selection.restore()) : b.$el.html("<br/>")))
        }

        function u(a, b) {
            return p(a, "<" + b + "[^>]*?>([\\w\\W]*)</" + b + ">", 1)
        }

        function v(c, d) {
            var e = a("<div " + (p(c, "<" + d + "([^>]*?)>", 1) || "") + ">");
            return b.node.rawAttributes(e.get(0))
        }

        function w(a) {
            return p(a, "<!DOCTYPE([^>]*?)>", 0) || "<!DOCTYPE html>"
        }

        function x(c) {
            var d = b.clean.html(c || "", [], [], b.opts.fullPage);
            if (b.opts.fullPage) {
                var e = u(d, "body") || (d.indexOf("<body") >= 0 ? "" : d),
                    f = v(d, "body"),
                    g = u(d, "head") || "<title></title>",
                    h = v(d, "head"),
                    i = a("<div>").append(g).contents().each(function() {
                        (this.nodeType == Node.COMMENT_NODE || ["BASE", "LINK", "META", "NOSCRIPT", "SCRIPT", "STYLE", "TEMPLATE", "TITLE"].indexOf(this.tagName) >= 0) && this.parentNode.removeChild(this)
                    }).end().html().trim();
                g = a("<div>").append(g).contents().map(function() {
                    return this.nodeType == Node.COMMENT_NODE ? "<!--" + this.nodeValue + "-->" : ["BASE", "LINK", "META", "NOSCRIPT", "SCRIPT", "STYLE", "TEMPLATE", "TITLE"].indexOf(this.tagName) >= 0 ? this.outerHTML : ""
                }).toArray().join("");
                var j = w(d),
                    k = v(d, "html");
                b.$el.html(i + "\n" + e), b.node.clearAttributes(b.$el.get(0)), b.$el.attr(f), b.$el.addClass("fr-view"), b.$el.attr("spellcheck", b.opts.spellcheck), b.$el.attr("dir", b.opts.direction), b.$head.html(g), b.node.clearAttributes(b.$head.get(0)), b.$head.attr(h), b.node.clearAttributes(b.$html.get(0)), b.$html.attr(k), b.iframe_document.doctype.parentNode.replaceChild(q(j, b.iframe_document), b.iframe_document.doctype)
            } else b.$el.html(d);
            var l = b.edit.isDisabled();
            b.edit.on(), b.core.injectStyle(b.opts.iframeStyle), s(), b.opts.useClasses || (b.$el.find("[fr-original-class]").each(function() {
                this.setAttribute("class", this.getAttribute("fr-original-class")), this.removeAttribute("fr-original-class")
            }), b.$el.find("[fr-original-style]").each(function() {
                this.setAttribute("style", this.getAttribute("fr-original-style")), this.removeAttribute("fr-original-style")
            })), l && b.edit.off(), b.events.trigger("html.set")
        }

        function y(a, c) {
            if (!b.$wp) return b.$oel.clone().removeClass("fr-view").removeAttr("contenteditable").get(0).outerHTML;
            var d = "";
            b.events.trigger("html.beforeGet");
            var e, f = function(a) {
                    var b = /(#[^\s\+>~\.\[:]+)/g,
                        c = /(\[[^\]]+\])/g,
                        d = /(\.[^\s\+>~\.\[:]+)/g,
                        e = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi,
                        f = /(:[\w-]+\([^\)]*\))/gi,
                        g = /(:[^\s\+>~\.\[:]+)/g,
                        h = /([^\s\+>~\.\[:]+)/g;
                    ! function() {
                        var b = /:not\(([^\)]*)\)/g;
                        b.test(a) && (a = a.replace(b, "     $1 "))
                    }();
                    var i = 100 * (a.match(b) || []).length + 10 * (a.match(c) || []).length + 10 * (a.match(d) || []).length + 10 * (a.match(f) || []).length + 10 * (a.match(g) || []).length + (a.match(e) || []).length;
                    return a = a.replace(/[\*\s\+>~]/g, " "), a = a.replace(/[#\.]/g, " "), i += (a.match(h) || []).length
                },
                g = [],
                h = {};
            if (!b.opts.useClasses && !c) {
                var i = new RegExp("^" + b.opts.htmlIgnoreCSSProperties.join("$|^") + "$", "gi");
                for (e = 0; e < b.doc.styleSheets.length; e++) {
                    var j, k = 0;
                    try {
                        j = b.doc.styleSheets[e].cssRules, b.doc.styleSheets[e].ownerNode && "STYLE" == b.doc.styleSheets[e].ownerNode.nodeType && (k = 1)
                    } catch (l) {}
                    if (j)
                        for (var m = 0, n = j.length; n > m; m++)
                            if (j[m].selectorText && j[m].style.cssText.length > 0) {
                                var o, p = j[m].selectorText.replace(/body |\.fr-view /g, "").replace(/::/g, ":");
                                try {
                                    o = b.$el.get(0).querySelectorAll(p)
                                } catch (l) {
                                    o = []
                                }
                                for (var q = 0; q < o.length; q++) {
                                    !o[q].getAttribute("fr-original-style") && o[q].getAttribute("style") ? (o[q].setAttribute("fr-original-style", o[q].getAttribute("style")), g.push(o[q])) : o[q].getAttribute("fr-original-style") || g.push(o[q]), h[o[q]] || (h[o[q]] = {});
                                    for (var s = 1e3 * k + f(j[m].selectorText), t = j[m].style.cssText.split(";"), u = 0; u < t.length; u++) {
                                        var v = t[u].trim().split(":")[0];
                                        v.match(i) || (h[o[q]][v] || (h[o[q]][v] = 0, (o[q].getAttribute("fr-original-style") || "").indexOf(v + ":") >= 0 && (h[o[q]][v] = 1e4)), s >= h[o[q]][v] && (h[o[q]][v] = s, t[u].trim().length && (o[q].style[v.trim()] = t[u].trim().split(":")[1].trim())))
                                    }
                                }
                            }
                }
                for (e = 0; e < g.length; e++)
                    if (g[e].getAttribute("class") && (g[e].setAttribute("fr-original-class", g[e].getAttribute("class")), g[e].removeAttribute("class")), (g[e].getAttribute("fr-original-style") || "").trim().length > 0)
                        for (var w = g[e].getAttribute("fr-original-style").split(";"), q = 0; q < w.length; q++) w[q].indexOf(":") > 0 && (g[e].style[w[q].split(":")[0].trim()] = w[q].split(":")[1].trim())
            }
            if (b.core.isEmpty() ? b.opts.fullPage && (d = r(b.iframe_document), d += "<html" + b.node.attributes(b.$html.get(0)) + ">" + b.$html.find("head").get(0).outerHTML + "<body></body></html>") : ("undefined" == typeof a && (a = !1), b.opts.fullPage ? (d = r(b.iframe_document), b.$el.removeClass("fr-view"), d += "<html" + b.node.attributes(b.$html.get(0)) + ">" + b.$html.html() + "</html>", b.$el.addClass("fr-view")) : d = b.$el.html()), !b.opts.useClasses && !c)
                for (e = 0; e < g.length; e++) g[e].getAttribute("fr-original-class") && (g[e].setAttribute("class", g[e].getAttribute("fr-original-class")), g[e].removeAttribute("fr-original-class")), g[e].getAttribute("fr-original-style") ? (g[e].setAttribute("style", g[e].getAttribute("fr-original-style")), g[e].removeAttribute("fr-original-style")) : g[e].removeAttribute("style");
            b.opts.fullPage && (d = d.replace(/<style data-fr-style="true">(?:[\w\W]*?)<\/style>/g, ""), d = d.replace(/<link([^>]*)data-fr-style="true"([^>]*)>/g, ""), d = d.replace(/<style(?:[\w\W]*?)class="firebugResetStyles"(?:[\w\W]*?)>(?:[\w\W]*?)<\/style>/g, ""), d = d.replace(/<body((?:[\w\W]*?)) spellcheck="true"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$2>$3</body>"), d = d.replace(/<body((?:[\w\W]*?)) contenteditable="(true|false)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$3>$4</body>"), d = d.replace(/<body((?:[\w\W]*?)) dir="([\w]*)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$3>$4</body>"), d = d.replace(/<body((?:[\w\W]*?))class="([\w\W]*?)(fr-rtl|fr-ltr)([\w\W]*?)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, '<body$1class="$2$4"$5>$6</body>'), d = d.replace(/<body((?:[\w\W]*?)) class=""((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$2>$3</body>")), b.opts.htmlSimpleAmpersand && (d = d.replace(/\&amp;/gi, "&")), b.events.trigger("html.afterGet"), a || (d = d.replace(/<span[^>]*? class\s*=\s*["']?fr-marker["']?[^>]+>\u200b<\/span>/gi, "")), d = b.clean.invisibleSpaces(d);
            var x = b.events.chainTrigger("html.get", d);
            return "string" == typeof x && (d = x), d = d.replace(/<pre(?:[\w\W]*?)>(?:[\w\W]*?)<\/pre>/g, function(a) {
                return a.replace(/<br>/g, "\n")
            })
        }

        function z() {
            var c = function(c, d) {
                    for (; d && (d.nodeType == Node.TEXT_NODE || !b.node.isBlock(d)) && !b.node.isElement(d);) d && d.nodeType != Node.TEXT_NODE && a(c).wrapInner(b.node.openTagString(d) + b.node.closeTagString(d)), d = d.parentNode;
                    d && c.innerHTML == d.innerHTML && (c.innerHTML = d.outerHTML)
                },
                d = function() {
                    var c, d = null;
                    return b.win.getSelection ? (c = b.win.getSelection(), c && c.rangeCount && (d = c.getRangeAt(0).commonAncestorContainer, d.nodeType != Node.ELEMENT_NODE && (d = d.parentNode))) : (c = b.doc.selection) && "Control" != c.type && (d = c.createRange().parentElement()), null != d && (a.inArray(b.$el.get(0), a(d).parents()) >= 0 || d == b.$el.get(0)) ? d : null
                },
                e = "";
            if ("undefined" != typeof b.win.getSelection) {
                b.browser.mozilla && (b.selection.save(), b.$el.find('.fr-marker[data-type="false"]').length > 1 && (b.$el.find('.fr-marker[data-type="false"][data-id="0"]').remove(), b.$el.find('.fr-marker[data-type="false"]:last').attr("data-id", "0"), b.$el.find(".fr-marker").not('[data-id="0"]').remove()), b.selection.restore());
                for (var f = b.selection.ranges(), g = 0; g < f.length; g++) {
                    var h = document.createElement("div");
                    h.appendChild(f[g].cloneContents()), c(h, d()), a(h).find(".fr-element").length > 0 && (h = b.$el.get(0)), e += h.innerHTML
                }
            } else "undefined" != typeof b.doc.selection && "Text" == b.doc.selection.type && (e = b.doc.selection.createRange().htmlText);
            return e
        }

        function A(b) {
            var c = a("<div>").html(b);
            return c.find(f()).length > 0
        }

        function B(a) {
            var c = b.doc.createElement("div");
            return c.innerHTML = a, b.selection.setAtEnd(c), c.innerHTML
        }

        function C(a) {
            return a.replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/"/gi, "&quot;").replace(/'/gi, "&#39;")
        }

        function D(c, d, e) {
            b.selection.isCollapsed() || b.selection.remove();
            var f;
            if (f = d ? c : b.clean.html(c), f = f.replace(/\r|\n/g, " "), c.indexOf('class="fr-marker"') < 0 && (f = B(f)),
                b.core.isEmpty()) b.$el.html(f);
            else {
                var g = b.markers.insert();
                if (g) {
                    var h;
                    if ((A(f) || e) && (h = b.node.deepestParent(g))) {
                        var g = b.markers.split();
                        if (!g) return !1;
                        a(g).replaceWith(f)
                    } else a(g).replaceWith(f)
                } else b.$el.append(f)
            }
            s(), b.events.trigger("html.inserted")
        }

        function E(c) {
            var d = null;
            "undefined" == typeof c && (d = b.selection.element());
            var e, f;
            do {
                f = !1, e = b.$el.get(0).querySelectorAll("*:not(.fr-marker)");
                for (var g = 0; g < e.length; g++) {
                    var h = e[g];
                    if (d != h) {
                        var i = h.textContent;
                        0 === h.children.length && 1 === i.length && 8203 == i.charCodeAt(0) && (a(h).remove(), f = !0)
                    }
                }
            } while (f)
        }

        function F() {
            var a = function() {
                E(), b.placeholder && b.placeholder.refresh()
            };
            b.events.on("mouseup", a), b.events.on("keydown", a), b.events.on("contentChanged", t)
        }
        return {
            defaultTag: c,
            emptyBlocks: d,
            emptyBlockTagsQuery: e,
            blockTagsQuery: f,
            fillEmptyBlocks: k,
            cleanEmptyTags: g,
            cleanWhiteTags: E,
            doNormalize: o,
            cleanBlankSpaces: m,
            blocks: l,
            getDoctype: r,
            set: x,
            get: y,
            getSelected: z,
            insert: D,
            wrap: i,
            unwrap: j,
            escapeEntities: C,
            checkIfEmpty: t,
            extractNode: u,
            extractNodeAttrs: v,
            extractDoctype: w,
            _init: F
        }
    }, a.extend(a.FE.DEFAULTS, {
        height: null,
        heightMax: null,
        heightMin: null,
        width: null
    }), a.FE.MODULES.size = function(a) {
        function b() {
            c(), a.opts.height && a.$el.css("minHeight", a.opts.height - a.helpers.getPX(a.$el.css("padding-top")) - a.helpers.getPX(a.$el.css("padding-bottom"))), a.$iframe.height(a.$el.outerHeight(!0))
        }

        function c() {
            a.opts.heightMin ? a.$el.css("minHeight", a.opts.heightMin) : a.$el.css("minHeight", ""), a.opts.heightMax ? (a.$wp.css("maxHeight", a.opts.heightMax), a.$wp.css("overflow", "auto")) : (a.$wp.css("maxHeight", ""), a.$wp.css("overflow", "")), a.opts.height ? (a.$wp.height(a.opts.height), a.$el.css("minHeight", a.opts.height - a.helpers.getPX(a.$el.css("padding-top")) - a.helpers.getPX(a.$el.css("padding-bottom"))), a.$wp.css("overflow", "auto")) : (a.$wp.css("height", ""), a.opts.heightMin || a.$el.css("minHeight", ""), a.opts.heightMax || a.$wp.css("overflow", "")), a.opts.width && a.$box.width(a.opts.width)
        }

        function d() {
            return a.$wp ? (c(), void(a.$iframe && (a.events.on("keyup", b), a.events.on("commands.after", b), a.events.on("html.set", b), a.events.on("init", b), a.events.on("initialized", b)))) : !1
        }
        return {
            _init: d,
            syncIframe: b,
            refresh: c
        }
    }, a.extend(a.FE.DEFAULTS, {
        language: null
    }), a.FE.LANGUAGE = {}, a.FE.MODULES.language = function(b) {
        function c(a) {
            return e && e.translation[a] ? e.translation[a] : a
        }

        function d() {
            a.FE.LANGUAGE && (e = a.FE.LANGUAGE[b.opts.language]), e && e.direction && (b.opts.direction = e.direction)
        }
        var e;
        return {
            _init: d,
            translate: c
        }
    }, a.extend(a.FE.DEFAULTS, {
        placeholderText: "Type something"
    }), a.FE.MODULES.placeholder = function(b) {
        function c() {
            b.$placeholder || g();
            var c = 0,
                d = 0,
                e = 0,
                f = 0,
                h = b.node.contents(b.$el.get(0));
            if (h.length && h[0].nodeType == Node.ELEMENT_NODE) {
                var i = a(h[0]);
                b.opts.toolbarInline || (c = b.helpers.getPX(i.css("margin-top")), e = b.helpers.getPX(i.css("padding-top")), d = b.helpers.getPX(i.css("margin-left")), f = b.helpers.getPX(i.css("padding-left"))), b.$placeholder.css("font-size", i.css("font-size")), b.$placeholder.css("line-height", i.css("line-height"))
            } else b.$placeholder.css("font-size", b.$el.css("font-size")), b.$placeholder.css("line-height", b.$el.css("line-height"));
            b.$wp.addClass("show-placeholder"), b.$placeholder.css({
                marginTop: Math.max(b.helpers.getPX(b.$el.css("margin-top")), c),
                paddingTop: Math.max(b.helpers.getPX(b.$el.css("padding-top")), e),
                paddingLeft: Math.max(b.helpers.getPX(b.$el.css("padding-left")), f),
                marginLeft: Math.max(b.helpers.getPX(b.$el.css("margin-left")), d)
            }).text(b.language.translate(b.opts.placeholderText || b.$oel.attr("placeholder") || "")), b.$placeholder.html(b.$placeholder.text().replace(/\n/g, "<br>"))
        }

        function d() {
            b.$wp.removeClass("show-placeholder")
        }

        function e() {
            return b.$wp ? b.$wp.hasClass("show-placeholder") : !0
        }

        function f() {
            return b.$wp ? void(b.core.isEmpty() ? c() : d()) : !1
        }

        function g() {
            b.$placeholder = a('<span class="fr-placeholder"></span>'), b.$wp.append(b.$placeholder)
        }

        function h() {
            return b.$wp ? void b.events.on("init input keydown keyup contentChanged initialized", f) : !1
        }
        return {
            _init: h,
            show: c,
            hide: d,
            refresh: f,
            isVisible: e
        }
    }, a.FE.MODULES.edit = function(a) {
        function b() {
            if (a.browser.mozilla) try {
                a.doc.execCommand("enableObjectResizing", !1, "false"), a.doc.execCommand("enableInlineTableEditing", !1, "false")
            } catch (b) {}
            if (a.browser.msie) try {
                a.doc.body.addEventListener("mscontrolselect", function(a) {
                    return a.preventDefault(), !1
                })
            } catch (b) {}
        }

        function c() {
            a.$wp ? (a.$el.attr("contenteditable", !0), a.$el.removeClass("fr-disabled"), a.$tb && a.$tb.removeClass("fr-disabled"), b()) : a.$el.is("a") && a.$el.attr("contenteditable", !0), f = !1
        }

        function d() {
            a.$wp ? (a.$el.attr("contenteditable", !1), a.$el.addClass("fr-disabled"), a.$tb && a.$tb.addClass("fr-disabled")) : a.$el.is("a") && a.$el.attr("contenteditable", !1), f = !0
        }

        function e() {
            return f
        }
        var f = !1;
        return {
            on: c,
            off: d,
            disableDesign: b,
            isDisabled: e
        }
    }, a.extend(a.FE.DEFAULTS, {
        editorClass: null,
        typingTimer: 500,
        iframe: !1,
        requestWithCORS: !0,
        requestWithCredentials: !1,
        requestHeaders: {},
        useClasses: !0,
        spellcheck: !0,
        iframeStyle: 'html{margin:0px;height:auto;}body{height:auto;padding:10px;background:transparent;color:#000000;position:relative;z-index: 2;-webkit-user-select:auto;margin:0px;overflow:hidden;min-height:20px;}body:after{content:"";display:block;clear:both;}',
        iframeStyleFiles: [],
        direction: "auto",
        zIndex: 1,
        disableRightClick: !1,
        scrollableContainer: "body",
        keepFormatOnDelete: !1,
        theme: null
    }), a.FE.MODULES.core = function(b) {
        function c(c) {
            if (b.opts.iframe) {
                b.$head.find("style[data-fr-style], link[data-fr-style]").remove(), b.$head.append('<style data-fr-style="true">' + c + "</style>");
                for (var d = 0; d < b.opts.iframeStyleFiles.length; d++) {
                    var e = a('<link data-fr-style="true" rel="stylesheet" href="' + b.opts.iframeStyleFiles[d] + '">');
                    e.get(0).addEventListener("load", b.size.syncIframe), b.$head.append(e)
                }
            }
        }

        function d() {
            b.opts.iframe || b.$el.addClass("fr-element fr-view")
        }

        function e() {
            if (b.$box.addClass("fr-box" + (b.opts.editorClass ? " " + b.opts.editorClass : "")), b.$wp.addClass("fr-wrapper"), d(), b.opts.iframe) {
                b.$iframe.addClass("fr-iframe"), b.$el.addClass("fr-view");
                for (var a = 0; a < b.o_doc.styleSheets.length; a++) {
                    var c;
                    try {
                        c = b.o_doc.styleSheets[a].cssRules
                    } catch (e) {}
                    if (c)
                        for (var f = 0, g = c.length; g > f; f++) !c[f].selectorText || 0 !== c[f].selectorText.indexOf(".fr-view") && 0 !== c[f].selectorText.indexOf(".fr-element") || c[f].style.cssText.length > 0 && (0 === c[f].selectorText.indexOf(".fr-view") ? b.opts.iframeStyle += c[f].selectorText.replace(/\.fr-view/g, "body") + "{" + c[f].style.cssText + "}" : b.opts.iframeStyle += c[f].selectorText.replace(/\.fr-element/g, "body") + "{" + c[f].style.cssText + "}")
                }
            }
            "auto" != b.opts.direction && b.$box.removeClass("fr-ltr fr-rtl").addClass("fr-" + b.opts.direction), b.$el.attr("dir", b.opts.direction), b.$wp.attr("dir", b.opts.direction), b.opts.zIndex > 1 && b.$box.css("z-index", b.opts.zIndex), b.opts.theme && b.$box.addClass(b.opts.theme + "-theme")
        }

        function f() {
            return b.node.isEmpty(b.$el.get(0))
        }

        function g() {
            b.drag_support = {
                filereader: "undefined" != typeof FileReader,
                formdata: !!b.win.FormData,
                progress: "upload" in new XMLHttpRequest
            }
        }

        function h(a, c) {
            var d = new XMLHttpRequest;
            d.open(c, a, !0), b.opts.requestWithCredentials && (d.withCredentials = !0);
            for (var e in b.opts.requestHeaders) b.opts.requestHeaders.hasOwnProperty(e) && d.setRequestHeader(e, b.opts.requestHeaders[e]);
            return d
        }

        function i(a) {
            "TEXTAREA" == b.$oel.get(0).tagName && b.$oel.val(a), b.$wp && ("TEXTAREA" == b.$oel.get(0).tagName ? (b.$el.html(""), b.$wp.html(""), b.$box.replaceWith(b.$oel), b.$oel.show()) : (b.$wp.replaceWith(a), b.$el.html(""), b.$box.removeClass("fr-view fr-ltr fr-box " + (b.opts.editorClass || "")), b.opts.theme && b.$box.addClass(b.opts.theme + "-theme"))), this.$wp = null, this.$el = null, this.$box = null
        }

        function j() {
            return b.browser.mozilla && b.helpers.isMobile() ? b.selection.inEditor() : b.node.hasFocus(b.$el.get(0)) || b.$el.find("*:focus").length > 0
        }

        function k(a) {
            if (!a) return !1;
            var c = a.data("instance");
            return c ? c.id == b.id : !1
        }

        function l() {
            if (a.FE.INSTANCES.push(b), g(), b.$wp) {
                e(), b.html.set(b._original_html), b.$el.attr("spellcheck", b.opts.spellcheck), b.helpers.isMobile() && (b.$el.attr("autocomplete", b.opts.spellcheck ? "on" : "off"), b.$el.attr("autocorrect", b.opts.spellcheck ? "on" : "off"), b.$el.attr("autocapitalize", b.opts.spellcheck ? "on" : "off")), b.opts.disableRightClick && b.events.$on(b.$el, "contextmenu", function(a) {
                    return 2 == a.button ? !1 : void 0
                });
                try {
                    b.doc.execCommand("styleWithCSS", !1, !1)
                } catch (c) {}
            }
            b.events.on("drop", function(a) {
                a.preventDefault(), a.stopPropagation()
            }), "TEXTAREA" == b.$oel.get(0).tagName && (b.events.on("contentChanged", function() {
                b.$oel.val(b.html.get())
            }), b.events.on("form.submit", function() {
                b.$oel.val(b.html.get())
            }), b.events.on("form.reset", function() {
                b.html.set(b._original_html)
            }), b.$oel.val(b.html.get())), b.helpers.isIOS() && b.events.$on(b.$doc, "selectionchange", function() {
                b.$doc.get(0).hasFocus() || b.$win.get(0).focus()
            }), b.events.trigger("init")
        }
        return {
            _init: l,
            destroy: i,
            isEmpty: f,
            getXHR: h,
            injectStyle: c,
            hasFocus: j,
            sameInstance: k
        }
    }, a.FE.MODULES.format = function(b) {
        function c(a, b) {
            var c = "<" + a;
            for (var d in b) b.hasOwnProperty(d) && (c += " " + d + '="' + b[d] + '"');
            return c += ">"
        }

        function d(a) {
            return "</" + a + ">"
        }

        function e(a, b) {
            var c = a;
            for (var d in b) b.hasOwnProperty(d) && (a += "id" == d ? "#" + b[d] : "class" == d ? "." + b[d] : "[" + d + '="' + b[d] + '"]');
            return c
        }

        function f(a, b) {
            return a && a.nodeType == Node.ELEMENT_NODE ? (a.matches || a.matchesSelector || a.msMatchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.oMatchesSelector).call(a, b) : !1
        }

        function g(d, e, f) {
            if (d) {
                if (b.node.isBlock(d)) return g(d.firstChild, e, f), !1;
                for (var h = a(c(e, f)).insertBefore(d), i = d; i && !a(i).is(".fr-marker") && 0 == a(i).find(".fr-marker").length;) {
                    var j = i;
                    i = i.nextSibling, h.append(j)
                }
                if (i) a(i).find(".fr-marker").length && g(i.firstChild, e, f);
                else {
                    for (var k = h.get(0).parentNode; k && !k.nextSibling && !b.node.isElement(k);) k = k.parentNode;
                    if (k) {
                        var l = k.nextSibling;
                        l && (b.node.isBlock(l) ? g(l.firstChild, e, f) : g(l, e, f))
                    }
                }
                h.is(":empty") && h.remove()
            }
        }

        function h(h, i) {
            if ("undefined" == typeof i && (i = {}), i.style && delete i.style, b.selection.isCollapsed()) {
                b.markers.insert();
                var j = b.$el.find(".fr-marker");
                j.replaceWith(c(h, i) + a.FE.INVISIBLE_SPACE + a.FE.MARKERS + d(h)), b.selection.restore()
            } else {
                b.selection.save();
                var k = b.$el.find('.fr-marker[data-type="true"]').get(0).nextSibling;
                g(k, h, i);
                var l;
                do l = b.$el.find(e(h, i) + " > " + e(h, i)), l.each(function() {
                    a(this).replaceWith(this.innerHTML)
                }); while (l.length);
                b.$el.get(0).normalize();
                for (var m = b.$el.get(0).querySelectorAll(".fr-marker"), n = 0; n < m.length; n++) {
                    var o = a(m[n]);
                    1 == o.data("type") ? f(o.get(0).nextSibling, e(h, i)) && o.next().prepend(o) : f(o.get(0).previousSibling, e(h, i)) && o.prev().append(o)
                }
                b.selection.restore()
            }
        }

        function i(a, c, d, g) {
            if (!g) {
                var h = !1;
                if (a.data("type") === !0)
                    for (; b.node.isFirstSibling(a.get(0)) && !a.parent().is(b.$el);) a.parent().before(a), h = !0;
                else if (a.data("type") === !1)
                    for (; b.node.isLastSibling(a.get(0)) && !a.parent().is(b.$el);) a.parent().after(a), h = !0;
                if (h) return !0
            }
            if (a.parents(c).length || "undefined" == typeof c) {
                var i = "",
                    j = "",
                    k = a.parent();
                if (k.is(b.$el) || b.node.isBlock(k.get(0))) return !1;
                for (;
                    "undefined" == typeof c && !b.node.isBlock(k.parent().get(0)) || "undefined" != typeof c && !f(k.get(0), e(c, d));) i += b.node.closeTagString(k.get(0)), j = b.node.openTagString(k.get(0)) + j, k = k.parent();
                var l = a.get(0).outerHTML;
                a.replaceWith('<span id="mark"></span>');
                var m = k.html().replace(/<span id="mark"><\/span>/, i + b.node.closeTagString(k.get(0)) + j + l + i + b.node.openTagString(k.get(0)) + j);
                return k.replaceWith(b.node.openTagString(k.get(0)) + m + b.node.closeTagString(k.get(0))), !0
            }
            return !1
        }

        function j(c, d, g, h) {
            for (var i = b.node.contents(c.get(0)), k = 0; k < i.length; k++) {
                var l = i[k];
                a(l).hasClass("fr-marker") ? d = (d + 1) % 2 : d ? a(l).find(".fr-marker").length > 0 ? d = j(a(l), d, g, h) : (a(a(l).find(g || "*").get().reverse()).each(function() {
                    b.node.isBlock(this) || b.node.isVoid(this) || a(this).replaceWith(this.innerHTML)
                }), ("undefined" == typeof g && l.nodeType == Node.ELEMENT_NODE && !b.node.isVoid(l) && !b.node.isBlock(l) || f(l, e(g, h))) && a(l).replaceWith(l.innerHTML)) : a(l).find(".fr-marker").length > 0 && (d = j(a(l), d, g, h))
            }
            return d
        }

        function k(c, d) {
            "undefined" == typeof d && (d = {}), d.style && delete d.style;
            var e = b.selection.isCollapsed();
            b.selection.save();
            for (var f = !0; f;) {
                f = !1;
                for (var g = b.$el.find(".fr-marker"), h = 0; h < g.length; h++)
                    if (i(a(g[h]), c, d, e)) {
                        f = !0;
                        break
                    }
            }
            j(b.$el, 0, c, d), e && b.$el.find(".fr-marker").before(a.FE.INVISIBLE_SPACE).after(a.FE.INVISIBLE_SPACE), b.html.cleanEmptyTags(), b.$el.get(0).normalize(), b.selection.restore()
        }

        function l(a, b) {
            q(a, b) ? k(a, b) : h(a, b)
        }

        function m(b, c) {
            var d = a(b);
            d.css(c, ""), "" === d.attr("style") && d.replaceWith(d.html())
        }

        function n(b, c) {
            return 0 === a(b).attr("style").indexOf(c + ":") || a(b).attr("style").indexOf(";" + c + ":") >= 0 || a(b).attr("style").indexOf("; " + c + ":") >= 0
        }

        function o(c, d) {
            if (b.selection.isCollapsed()) {
                b.markers.insert();
                var e = b.$el.find(".fr-marker"),
                    f = e.parent();
                if (b.node.openTagString(f.get(0)) == '<span style="' + c + ": " + f.css(c) + ';">')
                    if (b.node.isEmpty(f.get(0))) f.replaceWith('<span style="' + c + ": " + d + ';">' + a.FE.INVISIBLE_SPACE + a.FE.MARKERS + "</span>");
                    else {
                        var h = {};
                        h[c] = d, i(e, "span", h, !0), e = b.$el.find(".fr-marker"), e.replaceWith('<span style="' + c + ": " + d + ';">' + a.FE.INVISIBLE_SPACE + a.FE.MARKERS + "</span>")
                    } else b.node.isEmpty(f.get(0)) && f.is("span") ? (e.replaceWith(a.FE.MARKERS), f.css(c, d)) : e.replaceWith('<span style="' + c + ": " + d + ';">' + a.FE.INVISIBLE_SPACE + a.FE.MARKERS + "</span>");
                b.selection.restore()
            } else {
                b.selection.save();
                for (var j = b.$el.find(".fr-marker"), k = 0; k < j.length; k++) {
                    var e = a(j[k]);
                    if (e.data("type") === !0)
                        for (; b.node.isFirstSibling(e.get(0)) && !e.parent().is(b.$el);) e.parent().before(e);
                    else
                        for (; b.node.isLastSibling(e.get(0)) && !e.parent().is(b.$el);) e.parent().after(e)
                }
                var l = b.$el.find('.fr-marker[data-type="true"]').get(0).nextSibling,
                    o = {
                        "class": "fr-unprocessed"
                    };
                for (d && (o.style = c + ": " + d + ";"), g(l, "span", o), b.$el.find(".fr-marker + .fr-unprocessed").each(function() {
                        a(this).prepend(a(this).prev())
                    }), b.$el.find(".fr-unprocessed + .fr-marker").each(function() {
                        a(this).prev().append(this)
                    }); b.$el.find("span.fr-unprocessed").length > 0;) {
                    var p = b.$el.find("span.fr-unprocessed:first").removeClass("fr-unprocessed");
                    if (p.parent().get(0).normalize(), p.parent().is("span") && 1 == p.parent().get(0).childNodes.length) {
                        p.parent().css(c, d);
                        var q = p;
                        p = p.parent(), q.replaceWith(q.html())
                    }
                    for (var r = p.find("span"), k = r.length - 1; k >= 0; k--) m(r[k], c);
                    var s = p.parentsUntil(b.$el, "span[style]").filter(function() {
                        return n(this, c)
                    });
                    if (s.length) {
                        var t = "",
                            u = "",
                            v = "",
                            w = "",
                            x = p.get(0);
                        do x = x.parentNode, a(x).addClass("fr-split"), t += b.node.closeTagString(x), u = b.node.openTagString(a(x).clone().addClass("fr-split").get(0)) + u, s.get(0) != x && (v += b.node.closeTagString(x), w = b.node.openTagString(a(x).clone().addClass("fr-split").get(0)) + w); while (s.get(0) != x);
                        var y = t + b.node.openTagString(a(s.get(0)).clone().css(c, d || "").get(0)) + w + p.css(c, "").get(0).outerHTML + v + "</span>" + u;
                        p.replaceWith('<span id="fr-break"></span>');
                        var z = s.get(0).outerHTML;
                        a(s.get(0)).replaceWith(z.replace(/<span id="fr-break"><\/span>/g, y))
                    }
                }
                for (; b.$el.find(".fr-split:empty").length > 0;) b.$el.find(".fr-split:empty").remove();
                b.$el.find(".fr-split").removeClass("fr-split"), b.$el.find('span[style=""]').removeAttr("style"), b.$el.find('span[class=""]').removeAttr("class"), b.html.cleanEmptyTags(), a(b.$el.find("span").get().reverse()).each(function() {
                    this.attributes && 0 != this.attributes.length || a(this).replaceWith(this.innerHTML)
                }), b.$el.get(0).normalize();
                var A = b.$el.find("span[style] + span[style]");
                for (k = 0; k < A.length; k++) {
                    var B = a(A[k]),
                        C = a(A[k]).prev();
                    B.get(0).previousSibling == C.get(0) && b.node.openTagString(B.get(0)) == b.node.openTagString(C.get(0)) && (B.prepend(C.html()), C.remove())
                }
                b.$el.get(0).normalize(), b.selection.restore()
            }
        }

        function p(a) {
            o(a, null)
        }

        function q(a, c) {
            "undefined" == typeof c && (c = {}), c.style && delete c.style;
            var d = b.selection.ranges(0),
                g = d.startContainer;
            g.nodeType == Node.ELEMENT_NODE && g.childNodes.length > 0 && g.childNodes[d.startOffset] && (g = g.childNodes[d.startOffset]);
            for (var h = g; h && h.nodeType == Node.ELEMENT_NODE && !f(h, e(a, c));) h = h.firstChild;
            if (h && h.nodeType == Node.ELEMENT_NODE && f(h, e(a, c))) return !0;
            var i = g;
            for (i && i.nodeType != Node.ELEMENT_NODE && (i = i.parentNode); i && i.nodeType == Node.ELEMENT_NODE && i != b.$el.get(0) && !f(i, e(a, c));) i = i.parentNode;
            return i && i.nodeType == Node.ELEMENT_NODE && i != b.$el.get(0) && f(i, e(a, c)) ? !0 : !1
        }
        return {
            is: q,
            toggle: l,
            apply: h,
            remove: k,
            applyStyle: o,
            removeStyle: p
        }
    }, a.FE.COMMANDS = {
        bold: {
            title: "Bold",
            refresh: function(a) {
                a.toggleClass("fr-active", this.format.is("strong"))
            }
        },
        italic: {
            title: "Italic",
            refresh: function(a) {
                a.toggleClass("fr-active", this.format.is("em"))
            }
        },
        underline: {
            title: "Underline",
            refresh: function(a) {
                a.toggleClass("fr-active", this.format.is("u"))
            }
        },
        strikeThrough: {
            title: "Strikethrough",
            refresh: function(a) {
                a.toggleClass("fr-active", this.format.is("s"))
            }
        },
        subscript: {
            title: "Subscript",
            refresh: function(a) {
                a.toggleClass("fr-active", this.format.is("sub"))
            }
        },
        superscript: {
            title: "Superscript",
            refresh: function(a) {
                a.toggleClass("fr-active", this.format.is("sup"))
            }
        },
        outdent: {
            title: "Decrease Indent"
        },
        indent: {
            title: "Increase Indent"
        },
        undo: {
            title: "Undo",
            undo: !1,
            forcedRefresh: !0,
            disabled: !0
        },
        redo: {
            title: "Redo",
            undo: !1,
            forcedRefresh: !0,
            disabled: !0
        },
        insertHR: {
            title: "Insert Horizontal Line"
        },
        clearFormatting: {
            title: "Clear Formatting"
        },
        selectAll: {
            title: "Select All",
            undo: !1
        }
    }, a.FE.RegisterCommand = function(b, c) {
        a.FE.COMMANDS[b] = c
    }, a.FE.MODULES.commands = function(b) {
        function c(c, d) {
            if (b.events.trigger("commands.before", a.merge([c], d || [])) !== !1) {
                var e = a.FE.COMMANDS[c] && a.FE.COMMANDS[c].callback || h[c],
                    f = !0;
                a.FE.COMMANDS[c] && "undefined" != typeof a.FE.COMMANDS[c].focus && (f = a.FE.COMMANDS[c].focus), b.core.hasFocus() || !f || b.popups.areVisible() || b.events.focus(!0), a.FE.COMMANDS[c] && a.FE.COMMANDS[c].undo !== !1 && b.undo.saveStep(), e && e.apply(b, a.merge([c], d || [])), b.events.trigger("commands.after", a.merge([c], d || [])), a.FE.COMMANDS[c] && a.FE.COMMANDS[c].undo !== !1 && b.undo.saveStep()
            }
        }

        function d(a, c) {
            b.format.toggle(c)
        }

        function e(c) {
            b.selection.save(), b.html.wrap(!0, !0, !0, !0), b.selection.restore();
            for (var d = b.selection.blocks(), e = 0; e < d.length; e++)
                if ("LI" != d[e].tagName && "LI" != d[e].parentNode.tagName) {
                    var f = a(d[e]),
                        g = "rtl" == b.opts.direction || "rtl" == f.css("direction") ? "margin-right" : "margin-left",
                        h = b.helpers.getPX(f.css(g));
                    f.css(g, Math.max(h + 20 * c, 0) || ""), f.removeClass("fr-temp-div")
                }
            b.selection.save(), b.html.unwrap(), b.selection.restore()
        }

        function f(a) {
            return function() {
                c(a)
            }
        }

        function g() {
            b.events.on("keydown", function(a) {
                var c = b.selection.element();
                return c && "HR" == c.tagName && !b.keys.isArrow(a.which) ? (a.preventDefault(), !1) : void 0
            }), b.events.on("keyup", function(c) {
                var d = b.selection.element();
                if (d && "HR" == d.tagName)
                    if (c.which == a.FE.KEYCODE.ARROW_LEFT || c.which == a.FE.KEYCODE.ARROW_UP) {
                        if (d.previousSibling) return b.node.isBlock(d.previousSibling) ? b.selection.setAtEnd(d.previousSibling) : a(d).before(a.FE.MARKERS), b.selection.restore(), !1
                    } else if ((c.which == a.FE.KEYCODE.ARROW_RIGHT || c.which == a.FE.KEYCODE.ARROW_DOWN) && d.nextSibling) return b.node.isBlock(d.nextSibling) ? b.selection.setAtStart(d.nextSibling) : a(d).after(a.FE.MARKERS), b.selection.restore(), !1
            }), b.events.on("mousedown", function(a) {
                return a.target && "HR" == a.target.tagName ? (a.preventDefault(), a.stopPropagation(), !1) : void 0
            }), b.events.on("mouseup", function(c) {
                var d = b.selection.element(),
                    e = b.selection.endElement();
                d == e && d && "HR" == d.tagName && (d.nextSibling && (b.node.isBlock(d.nextSibling) ? b.selection.setAtStart(d.nextSibling) : a(d).after(a.FE.MARKERS)), b.selection.restore())
            })
        }
        var h = {
                bold: function() {
                    d("bold", "strong")
                },
                subscript: function() {
                    d("subscript", "sub")
                },
                superscript: function() {
                    d("superscript", "sup")
                },
                italic: function() {
                    d("italic", "em")
                },
                strikeThrough: function() {
                    d("strikeThrough", "s")
                },
                underline: function() {
                    d("underline", "u")
                },
                undo: function() {
                    b.undo.run()
                },
                redo: function() {
                    b.undo.redo()
                },
                indent: function() {
                    e(1)
                },
                outdent: function() {
                    e(-1)
                },
                show: function() {
                    b.opts.toolbarInline && b.toolbar.showInline(null, !0)
                },
                insertHR: function() {
                    b.selection.remove();
                    var a = "";
                    b.core.isEmpty() && (a = "<br>", b.html.defaultTag() && (a = "<" + b.html.defaultTag() + ">" + a + "</" + b.html.defaultTag() + ">")), b.html.insert('<hr id="fr-just">' + a);
                    var c = b.$el.find("hr#fr-just");
                    c.removeAttr("id"), b.selection.setAfter(c.get(0)) || b.selection.setBefore(c.get(0)), b.selection.restore()
                },
                clearFormatting: function() {
                    b.format.remove()
                },
                selectAll: function() {
                    b.doc.execCommand("selectAll", !1, !1)
                }
            },
            i = {};
        for (var j in h) h.hasOwnProperty(j) && (i[j] = f(j));
        return a.extend(i, {
            exec: c,
            _init: g
        })
    }, a.FE.MODULES.cursorLists = function(b) {
        function c(a) {
            for (var b = a;
                "LI" != b.tagName;) b = b.parentNode;
            return b
        }

        function d(a) {
            for (var c = a; !b.node.isList(c);) c = c.parentNode;
            return c
        }

        function e(e) {
            var f, g = c(e),
                h = g.nextSibling,
                i = g.previousSibling,
                j = b.html.defaultTag();
            if (b.node.isEmpty(g, !0) && h) {
                for (var k = "", l = "", m = e.parentNode; !b.node.isList(m) && m.parentNode && "LI" !== m.parentNode.tagName;) k = b.node.openTagString(m) + k, l += b.node.closeTagString(m), m = m.parentNode;
                k = b.node.openTagString(m) + k, l += b.node.closeTagString(m);
                var n = "";
                for (n = m.parentNode && "LI" == m.parentNode.tagName ? l + "<li>" + a.FE.MARKERS + "<br>" + k : j ? l + "<" + j + ">" + a.FE.MARKERS + "<br></" + j + ">" + k : l + a.FE.MARKERS + "<br>" + k, a(g).html('<span id="fr-break"></span>');
                    ["UL", "OL"].indexOf(m.tagName) < 0 || m.parentNode && "LI" === m.parentNode.tagName;) m = m.parentNode;
                var o = b.node.openTagString(m) + a(m).html() + b.node.closeTagString(m);
                o = o.replace(/<span id="fr-break"><\/span>/g, n), a(m).replaceWith(o), b.$el.find("li:empty").remove()
            } else i && h || !b.node.isEmpty(g, !0) ? (a(g).before("<li><br></li>"), a(e).remove()) : i ? (f = d(g), f.parentNode && "LI" == f.parentNode.tagName ? a(f.parentNode).after("<li>" + a.FE.MARKERS + "<br></li>") : j ? a(f).after("<" + j + ">" + a.FE.MARKERS + "<br></" + j + ">") : a(f).after(a.FE.MARKERS + "<br>"), a(g).remove()) : (f = d(g), f.parentNode && "LI" == f.parentNode.tagName ? h ? a(f.parentNode).before("<li>" + a.FE.MARKERS + "<br></li>") : a(f.parentNode).after("<li>" + a.FE.MARKERS + "<br></li>") : j ? a(f).before("<" + j + ">" + a.FE.MARKERS + "<br></" + j + ">") : a(f).before(a.FE.MARKERS + "<br>"), a(g).remove())
        }

        function f(d) {
            for (var e = c(d), f = "", g = d, h = "", i = ""; g != e;) {
                g = g.parentNode;
                var j = "A" == g.tagName && b.cursor.isAtEnd(d, g) ? "fr-to-remove" : "";
                h = b.node.openTagString(a(g).clone().addClass(j).get(0)) + h, i = b.node.closeTagString(g) + i
            }
            f = i + f + h + a.FE.MARKERS, a(d).replaceWith('<span id="fr-break"></span>');
            var k = b.node.openTagString(e) + a(e).html() + b.node.closeTagString(e);
            k = k.replace(/<span id="fr-break"><\/span>/g, f), a(e).replaceWith(k)
        }

        function g(d) {
            for (var e = c(d), f = a.FE.MARKERS, g = "", h = d, i = !1; h != e;) {
                h = h.parentNode;
                var j = "A" == h.tagName && b.cursor.isAtEnd(d, h) ? "fr-to-remove" : "";
                i || h == e || b.node.isBlock(h) || (i = !0, g += a.FE.INVISIBLE_SPACE), g = b.node.openTagString(a(h).clone().addClass(j).get(0)) + g, f += b.node.closeTagString(h)
            }
            var k = g + f;
            a(d).remove(), a(e).after(k)
        }

        function h(e) {
            var f = c(e),
                g = f.previousSibling;
            if (g) {
                g = a(g).find(b.html.blockTagsQuery()).get(-1) || g, a(e).replaceWith(a.FE.MARKERS);
                var h = b.node.contents(g);
                h.length && "BR" == h[h.length - 1].tagName && a(h[h.length - 1]).remove(), a(f).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function() {
                    this.parentNode == f && a(this).replaceWith(a(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
                });
                for (var i, j = b.node.contents(f)[0]; j && !b.node.isList(j);) i = j.nextSibling, a(g).append(j), j = i;
                for (g = f.previousSibling; j;) i = j.nextSibling, a(g).append(j), j = i;
                a(f).remove()
            } else {
                var k = d(f);
                if (a(e).replaceWith(a.FE.MARKERS), k.parentNode && "LI" == k.parentNode.tagName) {
                    var l = k.previousSibling;
                    b.node.isBlock(l) ? (a(f).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function() {
                        this.parentNode == f && a(this).replaceWith(a(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
                    }), a(l).append(a(f).html())) : a(k).before(a(f).html())
                } else {
                    var m = b.html.defaultTag();
                    m && 0 === a(f).find(b.html.blockTagsQuery()).length ? a(k).before("<" + m + ">" + a(f).html() + "</" + m + ">") : a(k).before(a(f).html())
                }
                a(f).remove(), 0 === a(k).find("li").length && a(k).remove()
            }
        }

        function i(d) {
            var e, f = c(d),
                g = f.nextSibling;
            if (g) {
                e = b.node.contents(g), e.length && "BR" == e[0].tagName && a(e[0]).remove(), a(g).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function() {
                    this.parentNode == g && a(this).replaceWith(a(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
                });
                for (var h, i = d, j = b.node.contents(g)[0]; j && !b.node.isList(j);) h = j.nextSibling, a(i).after(j), i = j, j = h;
                for (; j;) h = j.nextSibling, a(f).append(j), j = h;
                a(d).replaceWith(a.FE.MARKERS), a(g).remove()
            } else {
                for (var k = f; !k.nextSibling && k != b.$el.get(0);) k = k.parentNode;
                if (k == b.$el.get(0)) return !1;
                if (k = k.nextSibling, b.node.isBlock(k)) a.FE.NO_DELETE_TAGS.indexOf(k.tagName) < 0 && (a(d).replaceWith(a.FE.MARKERS), e = b.node.contents(f), e.length && "BR" == e[e.length - 1].tagName && a(e[e.length - 1]).remove(), a(f).append(a(k).html()), a(k).remove());
                else
                    for (e = b.node.contents(f), e.length && "BR" == e[e.length - 1].tagName && a(e[e.length - 1]).remove(), a(d).replaceWith(a.FE.MARKERS); k && !b.node.isBlock(k) && "BR" != k.tagName;) a(f).append(a(k)), k = k.nextSibling
            }
        }
        return {
            _startEnter: e,
            _middleEnter: f,
            _endEnter: g,
            _backspace: h,
            _del: i
        }
    }, a.FE.NO_DELETE_TAGS = ["TH", "TD", "TR", "TABLE", "FORM"], a.FE.SIMPLE_ENTER_TAGS = ["TH", "TD", "LI", "DL", "DT", "FORM"], a.FE.MODULES.cursor = function(b) {
        function c(a) {
            return a ? b.node.isBlock(a) ? !0 : a.nextSibling && a.nextSibling.nodeType == Node.TEXT_NODE && 0 == a.nextSibling.textContent.replace(/\u200b/g, "").length ? c(a.nextSibling) : a.nextSibling ? !1 : c(a.parentNode) : !1
        }

        function d(a) {
            return a ? b.node.isBlock(a) ? !0 : a.previousSibling && a.previousSibling.nodeType == Node.TEXT_NODE && 0 == a.previousSibling.textContent.replace(/\u200b/g, "").length ? d(a.previousSibling) : a.previousSibling ? !1 : d(a.parentNode) : !1
        }

        function e(a, c) {
            return a ? a == b.$wp.get(0) ? !1 : a.previousSibling && a.previousSibling.nodeType == Node.TEXT_NODE && 0 == a.previousSibling.textContent.replace(/\u200b/g, "").length ? e(a.previousSibling, c) : a.previousSibling ? !1 : a.parentNode == c ? !0 : e(a.parentNode, c) : !1
        }

        function f(a, c) {
            return a ? a == b.$wp.get(0) ? !1 : a.nextSibling && a.nextSibling.nodeType == Node.TEXT_NODE && 0 == a.nextSibling.textContent.replace(/\u200b/g, "").length ? f(a.nextSibling, c) : a.nextSibling ? !1 : a.parentNode == c ? !0 : f(a.parentNode, c) : !1
        }

        function g(c) {
            return a(c).parentsUntil(b.$el, "LI").length > 0 && 0 === a(c).parentsUntil("LI", "TABLE").length
        }

        function h(c) {
            var d = a(c).parentsUntil(b.$el, "BLOCKQUOTE").length > 0,
                e = b.node.deepestParent(c, [], !d);
            if (e && "BLOCKQUOTE" == e.tagName) {
                var f = b.node.deepestParent(c, [a(c).parentsUntil(b.$el, "BLOCKQUOTE").get(0)]);
                f && f.previousSibling && (e = f)
            }
            if (null !== e) {
                var g, h = e.previousSibling;
                if (b.node.isBlock(e) && b.node.isEditable(e) && h && a.FE.NO_DELETE_TAGS.indexOf(h.tagName) < 0)
                    if (b.node.isDeletable(h)) a(h).remove(), a(c).replaceWith(a.FE.MARKERS);
                    else if (b.node.isEditable(h))
                    if (b.node.isBlock(h))
                        if (b.node.isEmpty(h) && !b.node.isList(h)) a(h).remove();
                        else {
                            if (b.node.isList(h) && (h = a(h).find("li:last").get(0)), g = b.node.contents(h), g.length && "BR" == g[g.length - 1].tagName && a(g[g.length - 1]).remove(), "BLOCKQUOTE" == h.tagName && "BLOCKQUOTE" != e.tagName)
                                for (g = b.node.contents(h); g.length && b.node.isBlock(g[g.length - 1]);) h = g[g.length - 1], g = b.node.contents(h);
                            else if ("BLOCKQUOTE" != h.tagName && "BLOCKQUOTE" == e.tagName)
                                for (g = b.node.contents(e); g.length && b.node.isBlock(g[0]);) e = g[0], g = b.node.contents(e);
                            a(c).replaceWith(a.FE.MARKERS), a(h).append(b.node.isEmpty(e) ? a.FE.MARKERS : e.innerHTML), a(e).remove()
                        } else a(c).replaceWith(a.FE.MARKERS), "BLOCKQUOTE" == e.tagName && h.nodeType == Node.ELEMENT_NODE ? a(h).remove() : (a(h).after(b.node.isEmpty(e) ? "" : a(e).html()), a(e).remove(), "BR" == h.tagName && a(h).remove())
            }
        }

        function i(c) {
            for (var d = c; !d.previousSibling;)
                if (d = d.parentNode, b.node.isElement(d)) return !1;
            d = d.previousSibling;
            var e;
            if (!b.node.isBlock(d) && b.node.isEditable(d)) {
                for (e = b.node.contents(d); d.nodeType != Node.TEXT_NODE && !b.node.isDeletable(d) && e.length && b.node.isEditable(d);) d = e[e.length - 1], e = b.node.contents(d);
                if (d.nodeType == Node.TEXT_NODE) {
                    if (b.helpers.isIOS()) return !0;
                    var f = d.textContent,
                        g = f.length - 1;
                    if (b.opts.tabSpaces && f.length >= b.opts.tabSpaces) {
                        var h = f.substr(f.length - b.opts.tabSpaces, f.length - 1);
                        0 == h.replace(/ /g, "").replace(new RegExp(a.FE.UNICODE_NBSP, "g"), "").length && (g = f.length - b.opts.tabSpaces)
                    }
                    d.textContent = f.substring(0, g), d.textContent.length && 55357 == d.textContent.charCodeAt(d.textContent.length - 1) && (d.textContent = d.textContent.substr(0, d.textContent.length - 1));
                    var i = f.length != d.textContent.length;
                    0 == d.textContent.length ? i && b.opts.keepFormatOnDelete ? a(d).after(a.FE.INVISIBLE_SPACE + a.FE.MARKERS) : 2 != d.parentNode.childNodes.length || d.parentNode != c.parentNode || b.node.isBlock(d.parentNode) || b.node.isElement(d.parentNode) ? (a(d).after(a.FE.MARKERS), b.node.isElement(d.parentNode) && !c.nextSibling && d.previousSibling && "BR" == d.previousSibling.tagName && a(c).after("<br>"), d.parentNode.removeChild(d)) : (a(d.parentNode).after(a.FE.MARKERS), a(d.parentNode).remove()) : a(d).after(a.FE.MARKERS)
                } else b.node.isDeletable(d) ? (a(d).after(a.FE.MARKERS), a(d).remove()) : b.events.trigger("node.remove", [a(d)]) !== !1 && (a(d).after(a.FE.MARKERS), a(d).remove())
            } else if (a.FE.NO_DELETE_TAGS.indexOf(d.tagName) < 0 && b.node.isEditable(d))
                if (b.node.isEmpty(d) && !b.node.isList(d)) a(d).remove(), a(c).replaceWith(a.FE.MARKERS);
                else {
                    for (b.node.isList(d) && (d = a(d).find("li:last").get(0)), e = b.node.contents(d), e && "BR" == e[e.length - 1].tagName && a(e[e.length - 1]).remove(), e = b.node.contents(d); e && b.node.isBlock(e[e.length - 1]);) d = e[e.length - 1], e = b.node.contents(d);
                    a(d).append(a.FE.MARKERS);
                    for (var j = c; !j.previousSibling;) j = j.parentNode;
                    for (; j && "BR" !== j.tagName && !b.node.isBlock(j);) {
                        var k = j;
                        j = j.nextSibling, a(d).append(k)
                    }
                    j && "BR" == j.tagName && a(j).remove(), a(c).remove()
                } else c.nextSibling && "BR" == c.nextSibling.tagName && a(c.nextSibling).remove()
        }

        function j() {
            var f = !1,
                j = b.markers.insert();
            if (!j) return !0;
            b.$el.get(0).normalize();
            var k = j.previousSibling;
            if (k) {
                var l = k.textContent;
                l && l.length && 8203 == l.charCodeAt(l.length - 1) && (1 == l.length ? a(k).remove() : (k.textContent = k.textContent.substr(0, l.length - 1), k.textContent.length && 55357 == k.textContent.charCodeAt(k.textContent.length - 1) && (k.textContent = k.textContent.substr(0, k.textContent.length - 1))))
            }
            return c(j) ? f = i(j) : d(j) ? g(j) && e(j, a(j).parents("li:first").get(0)) ? b.cursorLists._backspace(j) : h(j) : f = i(j), a(j).remove(), b.$el.find("blockquote:empty").remove(), b.html.fillEmptyBlocks(), b.html.cleanEmptyTags(), b.clean.quotes(), b.clean.lists(), b.spaces.normalize(), b.selection.restore(), f
        }

        function k(c) {
            var d = a(c).parentsUntil(b.$el, "BLOCKQUOTE").length > 0,
                e = b.node.deepestParent(c, [], !d);
            if (e && "BLOCKQUOTE" == e.tagName) {
                var f = b.node.deepestParent(c, [a(c).parentsUntil(b.$el, "BLOCKQUOTE").get(0)]);
                f && f.nextSibling && (e = f)
            }
            if (null !== e) {
                var g, h = e.nextSibling;
                if (b.node.isBlock(e) && (b.node.isEditable(e) || b.node.isDeletable(e)) && h && a.FE.NO_DELETE_TAGS.indexOf(h.tagName) < 0)
                    if (b.node.isDeletable(h)) a(h).remove(), a(c).replaceWith(a.FE.MARKERS);
                    else if (b.node.isBlock(h) && b.node.isEditable(h))
                    if (b.node.isList(h))
                        if (b.node.isEmpty(e, !0)) a(e).remove(), a(h).find("li:first").prepend(a.FE.MARKERS);
                        else {
                            var i = a(h).find("li:first");
                            "BLOCKQUOTE" == e.tagName && (g = b.node.contents(e), g.length && b.node.isBlock(g[g.length - 1]) && (e = g[g.length - 1])), 0 === i.find("ul, ol").length && (a(c).replaceWith(a.FE.MARKERS), i.find(b.html.blockTagsQuery()).not("ol, ul, table").each(function() {
                                this.parentNode == i.get(0) && a(this).replaceWith(a(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
                            }), a(e).append(b.node.contents(i.get(0))), i.remove(), 0 === a(h).find("li").length && a(h).remove())
                        } else {
                    if (g = b.node.contents(h), g.length && "BR" == g[0].tagName && a(g[0]).remove(), "BLOCKQUOTE" != h.tagName && "BLOCKQUOTE" == e.tagName)
                        for (g = b.node.contents(e); g.length && b.node.isBlock(g[g.length - 1]);) e = g[g.length - 1], g = b.node.contents(e);
                    else if ("BLOCKQUOTE" == h.tagName && "BLOCKQUOTE" != e.tagName)
                        for (g = b.node.contents(h); g.length && b.node.isBlock(g[0]);) h = g[0], g = b.node.contents(h);
                    a(c).replaceWith(a.FE.MARKERS), a(e).append(h.innerHTML), a(h).remove()
                } else {
                    for (a(c).replaceWith(a.FE.MARKERS); h && "BR" !== h.tagName && !b.node.isBlock(h) && b.node.isEditable(h);) {
                        var j = h;
                        h = h.nextSibling, a(e).append(j)
                    }
                    h && "BR" == h.tagName && b.node.isEditable(h) && a(h).remove()
                }
            }
        }

        function l(d) {
            for (var e = d; !e.nextSibling;)
                if (e = e.parentNode, b.node.isElement(e)) return !1;
            if (e = e.nextSibling, "BR" == e.tagName && b.node.isEditable(e))
                if (e.nextSibling) {
                    if (b.node.isBlock(e.nextSibling) && b.node.isEditable(e.nextSibling)) {
                        if (!(a.FE.NO_DELETE_TAGS.indexOf(e.nextSibling.tagName) < 0)) return void a(e).remove();
                        e = e.nextSibling, a(e.previousSibling).remove()
                    }
                } else if (c(e)) {
                if (g(d)) b.cursorLists._del(d);
                else {
                    var f = b.node.deepestParent(e);
                    f && (a(e).remove(), k(d))
                }
                return
            }
            var h;
            if (!b.node.isBlock(e) && b.node.isEditable(e)) {
                for (h = b.node.contents(e); e.nodeType != Node.TEXT_NODE && h.length && !b.node.isDeletable(e) && b.node.isEditable(e);) e = h[0], h = b.node.contents(e);
                e.nodeType == Node.TEXT_NODE ? (a(e).before(a.FE.MARKERS), e.textContent.length && 55357 == e.textContent.charCodeAt(0) ? e.textContent = e.textContent.substring(2, e.textContent.length) : e.textContent = e.textContent.substring(1, e.textContent.length)) : b.node.isDeletable(e) ? (a(e).before(a.FE.MARKERS), a(e).remove()) : b.events.trigger("node.remove", [a(e)]) !== !1 && (a(e).before(a.FE.MARKERS), a(e).remove()), a(d).remove()
            } else if (a.FE.NO_DELETE_TAGS.indexOf(e.tagName) < 0 && (b.node.isEditable(e) || b.node.isDeletable(e)))
                if (b.node.isDeletable(e)) a(d).replaceWith(a.FE.MARKERS), a(e).remove();
                else if (b.node.isList(e)) d.previousSibling ? (a(e).find("li:first").prepend(d), b.cursorLists._backspace(d)) : (a(e).find("li:first").prepend(a.FE.MARKERS), a(d).remove());
            else if (h = b.node.contents(e), h && "BR" == h[0].tagName && a(h[0]).remove(), h && "BLOCKQUOTE" == e.tagName) {
                var i = h[0];
                for (a(d).before(a.FE.MARKERS); i && "BR" != i.tagName;) {
                    var j = i;
                    i = i.nextSibling, a(d).before(j)
                }
                i && "BR" == i.tagName && a(i).remove()
            } else a(d).after(a(e).html()).after(a.FE.MARKERS), a(e).remove()
        }

        function m() {
            var e = b.markers.insert();
            if (!e) return !1;
            if (b.$el.get(0).normalize(), c(e))
                if (g(e))
                    if (0 === a(e).parents("li:first").find("ul, ol").length) b.cursorLists._del(e);
                    else {
                        var f = a(e).parents("li:first").find("ul:first, ol:first").find("li:first");
                        f = f.find(b.html.blockTagsQuery()).get(-1) || f, f.prepend(e), b.cursorLists._backspace(e)
                    } else k(e);
            else l(d(e) ? e : e);
            a(e).remove(), b.$el.find("blockquote:empty").remove(), b.html.fillEmptyBlocks(), b.html.cleanEmptyTags(), b.clean.quotes(), b.clean.lists(), b.spaces.normalize(), b.selection.restore()
        }

        function n() {
            b.$el.find(".fr-to-remove").each(function() {
                for (var c = b.node.contents(this), d = 0; d < c.length; d++) c[d].nodeType == Node.TEXT_NODE && (c[d].textContent = c[d].textContent.replace(/\u200B/g, ""));
                a(this).replaceWith(this.innerHTML)
            })
        }

        function o(c, d, e) {
            var g, h = b.node.deepestParent(c, [], !e);
            if (h && "BLOCKQUOTE" == h.tagName) return f(c, h) ? (g = b.html.defaultTag(), g ? a(h).after("<" + g + ">" + a.FE.MARKERS + "<br></" + g + ">") : a(h).after(a.FE.MARKERS + "<br>"), a(c).remove(), !1) : (q(c, d, e), !1);
            if (null == h) g = b.html.defaultTag(), g && b.node.isElement(c.parentNode) ? a(c).replaceWith("<" + g + ">" + a.FE.MARKERS + "<br></" + g + ">") : a(c).replaceWith("<br/>" + a.FE.MARKERS + "<br/>");
            else {
                var i = c,
                    j = "";
                (!b.node.isBlock(h) || d) && (j = "<br/>");
                var k = "",
                    l = "";
                g = b.html.defaultTag();
                var m = "",
                    n = "";
                g && b.node.isBlock(h) && (m = "<" + g + ">", n = "</" + g + ">", h.tagName == g.toUpperCase() && (m = b.node.openTagString(a(h).clone().removeAttr("id").get(0))));
                do
                    if (i = i.parentNode, !d || i != h || d && !b.node.isBlock(h))
                        if (k += b.node.closeTagString(i), i == h && b.node.isBlock(h)) l = m + l;
                        else {
                            var o = "A" == i.tagName && f(c, i) ? "fr-to-remove" : "";
                            l = b.node.openTagString(a(i).clone().addClass(o).get(0)) + l
                        }
                while (i != h);
                j = k + j + l + (c.parentNode == h && b.node.isBlock(h) ? "" : a.FE.INVISIBLE_SPACE) + a.FE.MARKERS, b.node.isBlock(h) && !a(h).find("*:last").is("br") && a(h).append("<br/>"), a(c).after('<span id="fr-break"></span>'), a(c).remove(), h.nextSibling && !b.node.isBlock(h.nextSibling) || b.node.isBlock(h) || a(h).after("<br>");
                var p;
                p = !d && b.node.isBlock(h) ? b.node.openTagString(h) + a(h).html() + n : b.node.openTagString(h) + a(h).html() + b.node.closeTagString(h), p = p.replace(/<span id="fr-break"><\/span>/g, j), a(h).replaceWith(p)
            }
        }

        function p(c, d, g) {
            var h, i = b.node.deepestParent(c, [], !g);
            if (i && "BLOCKQUOTE" == i.tagName) {
                if (e(c, i)) return h = b.html.defaultTag(), h ? a(i).before("<" + h + ">" + a.FE.MARKERS + "<br></" + h + ">") : a(i).before(a.FE.MARKERS + "<br>"), a(c).remove(), !1;
                f(c, i) ? o(c, d, !0) : q(c, d, !0)
            }
            if (null == i) h = b.html.defaultTag(), h && b.node.isElement(c.parentNode) ? a(c).replaceWith("<" + h + ">" + a.FE.MARKERS + "<br></" + h + ">") : a(c).replaceWith("<br>" + a.FE.MARKERS);
            else {
                if (b.node.isBlock(i))
                    if (d) a(c).remove(), a(i).prepend("<br>" + a.FE.MARKERS);
                    else {
                        if (b.node.isEmpty(i, !0)) return o(c, d, g);
                        a(i).before(b.node.openTagString(a(i).clone().removeAttr("id").get(0)) + "<br>" + b.node.closeTagString(i))
                    } else a(i).before("<br>");
                a(c).remove()
            }
        }

        function q(c, d, g) {
            var h = b.node.deepestParent(c, [], !g);
            if (null == h) b.html.defaultTag() && c.parentNode === b.$el.get(0) ? a(c).replaceWith("<" + b.html.defaultTag() + ">" + a.FE.MARKERS + "<br></" + b.html.defaultTag() + ">") : ((!c.nextSibling || b.node.isBlock(c.nextSibling)) && a(c).after("<br>"), a(c).replaceWith("<br>" + a.FE.MARKERS));
            else {
                var i = c,
                    j = "";
                "PRE" == h.tagName && (d = !0), (!b.node.isBlock(h) || d) && (j = "<br>");
                var k = "",
                    l = "";
                do {
                    var m = i;
                    if (i = i.parentNode, "BLOCKQUOTE" == h.tagName && b.node.isEmpty(m) && !a(m).hasClass("fr-marker") && a(m).find(c).length > 0 && a(m).after(c), ("BLOCKQUOTE" != h.tagName || !f(c, i) && !e(c, i)) && (!d || i != h || d && !b.node.isBlock(h))) {
                        k += b.node.closeTagString(i);
                        var n = "A" == i.tagName && f(c, i) ? "fr-to-remove" : "";
                        l = b.node.openTagString(a(i).clone().addClass(n).removeAttr("id").get(0)) + l
                    }
                } while (i != h);
                var o = h == c.parentNode && b.node.isBlock(h) || c.nextSibling;
                if ("BLOCKQUOTE" == h.tagName) {
                    c.previousSibling && b.node.isBlock(c.previousSibling) && c.nextSibling && "BR" == c.nextSibling.tagName && (a(c.nextSibling).after(c), c.nextSibling && "BR" == c.nextSibling.tagName && a(c.nextSibling).remove());
                    var p = b.html.defaultTag();
                    j = k + j + (p ? "<" + p + ">" : "") + a.FE.MARKERS + "<br>" + (p ? "</" + p + ">" : "") + l
                } else j = k + j + l + (o ? "" : a.FE.INVISIBLE_SPACE) + a.FE.MARKERS;
                a(c).replaceWith('<span id="fr-break"></span>');
                var q = b.node.openTagString(h) + a(h).html() + b.node.closeTagString(h);
                q = q.replace(/<span id="fr-break"><\/span>/g, j), a(h).replaceWith(q)
            }
        }

        function r(e) {
            var f = b.markers.insert();
            if (!f) return !0;
            b.$el.get(0).normalize();
            var h = !1;
            a(f).parentsUntil(b.$el, "BLOCKQUOTE").length > 0 && (e = !1, h = !0), a(f).parentsUntil(b.$el, "TD, TH").length && (h = !1), c(f) ? !g(f) || e || h ? o(f, e, h) : b.cursorLists._endEnter(f) : d(f) ? !g(f) || e || h ? p(f, e, h) : b.cursorLists._startEnter(f) : !g(f) || e || h ? q(f, e, h) : b.cursorLists._middleEnter(f), n(), b.html.fillEmptyBlocks(), b.html.cleanEmptyTags(), b.clean.lists(), b.spaces.normalize(), b.selection.restore()
        }
        return {
            enter: r,
            backspace: j,
            del: m,
            isAtEnd: f
        }
    }, a.FE.MODULES.data = function(a) {
        function b(a) {
            return a
        }

        function c(a) {
            if (!a) return a;
            for (var c = "", f = b("charCodeAt"), g = b("fromCharCode"), h = l.indexOf(a[0]), i = 1; i < a.length - 2; i++) {
                for (var j = d(++h), k = a[f](i), m = "";
                    /[0-9-]/.test(a[i + 1]);) m += a[++i];
                m = parseInt(m, 10) || 0, k = e(k, j, m), k ^= h - 1 & 31, c += String[g](k)
            }
            return c
        }

        function d(a) {
            for (var b = a.toString(), c = 0, d = 0; d < b.length; d++) c += parseInt(b.charAt(d), 10);
            return c > 10 ? c % 9 + 1 : c
        }

        function e(a, b, c) {
            for (var d = Math.abs(c); d-- > 0;) a -= b;
            return 0 > c && (a += 123), a
        }

        function f(a) {
            return a && "none" == a.css("display") ? (a.remove(), !0) : !1
        }

        function g() {
            return f(j) || f(k)
        }

        function h() {
            return a.$box ? (a.$box.append(n(b(n("kTDD4spmKD1klaMB1C7A5RA1G3RA10YA5qhrjuvnmE1D3FD2bcG-7noHE6B2JB4C3xXA8WF6F-10RG2C3G3B-21zZE3C3H3xCA16NC4DC1f1hOF1MB3B-21whzQH5UA2WB10kc1C2F4D3XC2YD4D1C4F3GF2eJ2lfcD-13HF1IE1TC11TC7WE4TA4d1A2YA6XA4d1A3yCG2qmB-13GF4A1B1KH1HD2fzfbeQC3TD9VE4wd1H2A20A2B-22ujB3nBG2A13jBC10D3C2HD5D1H1KB11uD-16uWF2D4A3F-7C9D-17c1E4D4B3d1D2CA6B2B-13qlwzJF2NC2C-13E-11ND1A3xqUA8UE6bsrrF-7C-22ia1D2CF2H1E2akCD2OE1HH1dlKA6PA5jcyfzB-22cXB4f1C3qvdiC4gjGG2H2gklC3D-16wJC1UG4dgaWE2D5G4g1I2H3B7vkqrxH1H2EC9C3E4gdgzKF1OA1A5PF5C4WWC3VA6XA4e1E3YA2YA5HE4oGH4F2H2IB10D3D2NC5G1B1qWA9PD6PG5fQA13A10XA4C4A3e1H2BA17kC-22cmOB1lmoA2fyhcptwWA3RA8A-13xB-11nf1I3f1B7GB3aD3pavFC10D5gLF2OG1LSB2D9E7fQC1F4F3wpSB5XD3NkklhhaE-11naKA9BnIA6D1F5bQA3A10c1QC6Kjkvitc2B6BE3AF3E2DA6A4JD2IC1jgA-64MB11D6C4==")))), j = a.$box.find("> div:last"), k = j.find("> a"), void("rtl" == a.opts.direction && j.css("left", "auto").css("right", 0))) : !1
        }

        function i() {
            var c = a.opts.key || [""];
            "string" == typeof c && (c = [c]), a.ul = !0;
            for (var d = 0; d < c.length; d++) {
                var e = n(c[d]) || "";
                if (!(e !== n(b(n("mcVRDoB1BGILD7YFe1BTXBA7B6=="))) && e.indexOf(m, e.length - m.length) < 0 && [n("9qqG-7amjlwq=="), n("KA3B3C2A6D1D5H5H1A3=="), n("QzbzvxyB2yA-9m=="), n("naamngiA3dA-16xtE-11C-9B1H-8sc==")].indexOf(m) < 0)) {
                    a.ul = !1;
                    break
                }
            }
            a.ul === !0 && h(), a.events.on("contentChanged", function() {
                a.ul === !0 && g() && h()
            }), a.events.on("destroy", function() {
                j && j.length && j.remove()
            }, !0)
        }
        var j, k, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            m = function() {
                for (var a = 0, b = document.domain, c = b.split("."), d = "_gd" + (new Date).getTime(); a < c.length - 1 && -1 == document.cookie.indexOf(d + "=" + d);) b = c.slice(-1 - ++a).join("."), document.cookie = d + "=" + d + ";domain=" + b + ";";
                return document.cookie = d + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + b + ";", (b || "").replace(/(^\.*)|(\.*$)/g, "")
            }(),
            n = b(c);
        return {
            _init: i
        }
    }, a.FE.ENTER_P = 0, a.FE.ENTER_DIV = 1, a.FE.ENTER_BR = 2, a.FE.KEYCODE = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        ESC: 27,
        SPACE: 32,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40,
        DELETE: 46,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        THREE: 51,
        FOUR: 52,
        FIVE: 53,
        SIX: 54,
        SEVEN: 55,
        EIGHT: 56,
        NINE: 57,
        FF_SEMICOLON: 59,
        FF_EQUALS: 61,
        QUESTION_MARK: 63,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        META: 91,
        NUM_ZERO: 96,
        NUM_ONE: 97,
        NUM_TWO: 98,
        NUM_THREE: 99,
        NUM_FOUR: 100,
        NUM_FIVE: 101,
        NUM_SIX: 102,
        NUM_SEVEN: 103,
        NUM_EIGHT: 104,
        NUM_NINE: 105,
        NUM_MULTIPLY: 106,
        NUM_PLUS: 107,
        NUM_MINUS: 109,
        NUM_PERIOD: 110,
        NUM_DIVISION: 111,
        SEMICOLON: 186,
        DASH: 189,
        EQUALS: 187,
        COMMA: 188,
        PERIOD: 190,
        SLASH: 191,
        APOSTROPHE: 192,
        TILDE: 192,
        SINGLE_QUOTE: 222,
        OPEN_SQUARE_BRACKET: 219,
        BACKSLASH: 220,
        CLOSE_SQUARE_BRACKET: 221
    }, a.extend(a.FE.DEFAULTS, {
        enter: a.FE.ENTER_P,
        multiLine: !0,
        tabSpaces: 0
    }), a.FE.MODULES.keys = function(b) {
        function c(a) {
            b.opts.multiLine ? b.helpers.isIOS() || (a.preventDefault(), a.stopPropagation(), b.selection.isCollapsed() || b.selection.remove(), b.cursor.enter()) : (a.preventDefault(), a.stopPropagation())
        }

        function d(a) {
            a.preventDefault(), a.stopPropagation(), b.opts.multiLine && (b.selection.isCollapsed() || b.selection.remove(), b.cursor.enter(!0))
        }

        function e(a) {
            b.selection.isCollapsed() ? b.cursor.backspace() || (a.preventDefault(), a.stopPropagation(), y = !1) : (a.preventDefault(), a.stopPropagation(), b.selection.remove(), b.html.fillEmptyBlocks(), y = !1), b.placeholder.refresh()
        }

        function f(a) {
            a.preventDefault(), a.stopPropagation(), "" === b.selection.text() ? b.cursor.del() : b.selection.remove(), b.placeholder.refresh()
        }

        function g(c) {
            if (b.browser.mozilla) {
                c.preventDefault(), c.stopPropagation(), b.selection.isCollapsed() || b.selection.remove(), b.markers.insert();
                var d = b.$el.find(".fr-marker").get(0),
                    e = d.previousSibling,
                    f = d.nextSibling;
                !f && d.parentNode && "A" == d.parentNode.tagName ? (a(d).parent().after("&nbsp;" + a.FE.MARKERS), a(d).remove()) : (e && e.nodeType == Node.TEXT_NODE && 1 == e.textContent.length && 160 == e.textContent.charCodeAt(0) ? a(e).after(" ") : a(d).before("&nbsp;"), a(d).replaceWith(a.FE.MARKERS)), b.selection.restore()
            }
        }

        function h() {
            if (b.browser.mozilla && b.selection.isCollapsed() && !B) {
                var a = b.selection.ranges(0),
                    c = a.startContainer,
                    d = a.startOffset;
                c && c.nodeType == Node.TEXT_NODE && d <= c.textContent.length && d > 0 && 32 == c.textContent.charCodeAt(d - 1) && (b.selection.save(), b.spaces.normalize(), b.selection.restore())
            }
        }

        function i() {
            b.selection.isFull() && setTimeout(function() {
                var c = b.html.defaultTag();
                c ? b.$el.html("<" + c + ">" + a.FE.MARKERS + "<br/></" + c + ">") : b.$el.html(a.FE.MARKERS + "<br/>"), b.selection.restore(), b.placeholder.refresh(), b.button.bulkRefresh(), b.undo.saveStep()
            }, 0)
        }

        function j(a) {
            if (b.opts.tabSpaces > 0)
                if (b.selection.isCollapsed()) {
                    b.undo.saveStep(), a.preventDefault(), a.stopPropagation();
                    for (var c = "", d = 0; d < b.opts.tabSpaces; d++) c += "&nbsp;";
                    b.html.insert(c), b.placeholder.refresh(), b.undo.saveStep()
                } else a.preventDefault(), a.stopPropagation(), a.shiftKey ? b.commands.outdent() : b.commands.indent()
        }

        function k(a) {
            B = !1
        }

        function l() {
            return B
        }

        function m(h) {
            b.events.disableBlur(), y = !0;
            var i = h.which;
            if (16 === i) return !0;
            if (229 === i) return B = !0, !0;
            B = !1;
            var k = t(i) && !r(h),
                l = i == a.FE.KEYCODE.BACKSPACE || i == a.FE.KEYCODE.DELETE;
            if ((b.selection.isFull() && !b.opts.keepFormatOnDelete && !b.placeholder.isVisible() || l && b.placeholder.isVisible() && b.opts.keepFormatOnDelete) && (k || l)) {
                var m = b.html.defaultTag();
                if (m ? b.$el.html("<" + m + ">" + a.FE.MARKERS + "<br/></" + m + ">") : b.$el.html(a.FE.MARKERS + "<br/>"), b.selection.restore(), !t(i)) return h.preventDefault(), !0
            }
            i == a.FE.KEYCODE.ENTER ? h.shiftKey ? d(h) : c(h) : i != a.FE.KEYCODE.BACKSPACE || r(h) || h.altKey ? i != a.FE.KEYCODE.DELETE || r(h) || h.altKey ? i == a.FE.KEYCODE.SPACE ? g(h) : i == a.FE.KEYCODE.TAB ? j(h) : r(h) || !t(h.which) || b.selection.isCollapsed() || h.ctrlKey || b.selection.remove() : b.placeholder.isVisible() ? (h.preventDefault(), h.stopPropagation()) : f(h) : b.placeholder.isVisible() ? (h.preventDefault(), h.stopPropagation()) : e(h), b.events.enableBlur()
        }

        function n(c) {
            for (var d = 0; d < c.length; d++) c[d].nodeType == Node.TEXT_NODE && /\u200B/gi.test(c[d].textContent) ? (c[d].textContent = c[d].textContent.replace(/\u200B/gi, ""), 0 === c[d].textContent.length && a(c[d]).remove()) : c[d].nodeType == Node.ELEMENT_NODE && "IFRAME" != c[d].nodeType && n(b.node.contents(c[d]))
        }

        function o() {
            if (!b.$wp) return !0;
            var c;
            b.opts.height || b.opts.heightMax ? (c = b.position.getBoundingRect().top, b.helpers.isIOS() && (c -= a(b.o_win).scrollTop()), b.opts.iframe && (c += b.$iframe.offset().top), c > b.$wp.offset().top - a(b.o_win).scrollTop() + b.$wp.height() - 20 && b.$wp.scrollTop(c + b.$wp.scrollTop() - (b.$wp.height() + b.$wp.offset().top) + a(b.o_win).scrollTop() + 20)) : (c = b.position.getBoundingRect().top, b.opts.toolbarBottom && (c += b.opts.toolbarStickyOffset), b.helpers.isIOS() && (c -= a(b.o_win).scrollTop()), b.opts.iframe && (c += b.$iframe.offset().top), c += b.opts.toolbarStickyOffset, c > b.o_win.innerHeight - 20 && a(b.o_win).scrollTop(c + a(b.o_win).scrollTop() - b.o_win.innerHeight + 20), c = b.position.getBoundingRect().top, b.opts.toolbarBottom || (c -= b.opts.toolbarStickyOffset), b.helpers.isIOS() && (c -= a(b.o_win).scrollTop()), b.opts.iframe && (c += b.$iframe.offset().top), c < b.$tb.height() + 20 && a(b.o_win).scrollTop(c + a(b.o_win).scrollTop() - b.$tb.height() - 20))
        }

        function p() {
            var c = b.selection.element(),
                d = b.node.blockParent(c);
            if (d && "DIV" == d.tagName && b.selection.info(d).atStart) {
                var e = b.html.defaultTag();
                d.previousSibling && "DIV" != d.previousSibling.tagName && e && "div" != e && (b.selection.save(), a(d).replaceWith("<" + e + ">" + d.innerHTML + "</" + e + ">"), b.selection.restore())
            }
        }

        function q(c) {
            if (B) return B = !1, !1;
            if (!b.selection.isCollapsed()) return !0;
            if (c && (c.which === a.FE.KEYCODE.META || c.which == a.FE.KEYCODE.CTRL)) return !0;
            if (c && s(c.which)) return !0;
            c && c.which == a.FE.KEYCODE.ENTER && b.helpers.isIOS() && p(), c && (c.which == a.FE.KEYCODE.ENTER || c.which == a.FE.KEYCODE.BACKSPACE || c.which >= 37 && c.which <= 40 && !b.browser.msie) && (c.which == a.FE.KEYCODE.BACKSPACE && y || o());
            var d = Array.prototype.slice.call(b.$el.get(0).querySelectorAll(b.html.blockTagsQuery()), 0);
            d.push(b.$el.get(0));
            for (var e = [], f = 0; f < d.length; f++)
                if (["TD", "TH"].indexOf(d[f].tagName) < 0)
                    for (var g = d[f].children, h = 0; h < g.length; h++) "BR" == g[h].tagName && e.push(g[h]);
            for (var d = [], f = 0; f < e.length; f++) {
                var i = e[f],
                    j = i.previousSibling,
                    k = i.nextSibling,
                    l = b.node.blockParent(i) || b.$el.get(0);
                j && l && "BR" != j.tagName && !b.node.isBlock(j) && !k && a(l).text().replace(/\u200B/g, "").length > 0 && a(j).text().length > 0 && (b.$el.is(l) && !k && b.opts.enter == a.FE.ENTER_BR && b.browser.msie || (b.selection.save(), a(i).remove(), b.selection.restore()))
            }
            e = [];
            var m = function(b) {
                    if (!b) return !1;
                    var c = a(b).html();
                    return c = c.replace(/<span[^>]*? class\s*=\s*["']?fr-marker["']?[^>]+>\u200b<\/span>/gi, ""), c && /\u200B/.test(c) && c.replace(/\u200B/gi, "").length > 0 ? !0 : !1
                },
                q = function(a) {
                    var c = /[\u3041-\u3096\u30A0-\u30FF\u4E00-\u9FFF\u3130-\u318F\uAC00-\uD7AF]/gi;
                    return !b.helpers.isIOS() || 0 === ((a.textContent || "").match(c) || []).length
                },
                r = b.selection.element();
            m(r) && 0 === a(r).find("li").length && !a(r).hasClass("fr-marker") && "IFRAME" != r.tagName && q(r) && (b.selection.save(), n(b.node.contents(r)), b.selection.restore()), !b.browser.mozilla && b.html.doNormalize(r) && (b.selection.save(), b.spaces.normalize(), b.selection.restore())
        }

        function r(a) {
            if (-1 != navigator.userAgent.indexOf("Mac OS X")) {
                if (a.metaKey && !a.altKey) return !0
            } else if (a.ctrlKey && !a.altKey) return !0;
            return !1
        }

        function s(b) {
            return b >= a.FE.KEYCODE.ARROW_LEFT && b <= a.FE.KEYCODE.ARROW_DOWN ? !0 : void 0
        }

        function t(c) {
            if (c >= a.FE.KEYCODE.ZERO && c <= a.FE.KEYCODE.NINE) return !0;
            if (c >= a.FE.KEYCODE.NUM_ZERO && c <= a.FE.KEYCODE.NUM_MULTIPLY) return !0;
            if (c >= a.FE.KEYCODE.A && c <= a.FE.KEYCODE.Z) return !0;
            if (b.browser.webkit && 0 === c) return !0;
            switch (c) {
                case a.FE.KEYCODE.SPACE:
                case a.FE.KEYCODE.QUESTION_MARK:
                case a.FE.KEYCODE.NUM_PLUS:
                case a.FE.KEYCODE.NUM_MINUS:
                case a.FE.KEYCODE.NUM_PERIOD:
                case a.FE.KEYCODE.NUM_DIVISION:
                case a.FE.KEYCODE.SEMICOLON:
                case a.FE.KEYCODE.FF_SEMICOLON:
                case a.FE.KEYCODE.DASH:
                case a.FE.KEYCODE.EQUALS:
                case a.FE.KEYCODE.FF_EQUALS:
                case a.FE.KEYCODE.COMMA:
                case a.FE.KEYCODE.PERIOD:
                case a.FE.KEYCODE.SLASH:
                case a.FE.KEYCODE.APOSTROPHE:
                case a.FE.KEYCODE.SINGLE_QUOTE:
                case a.FE.KEYCODE.OPEN_SQUARE_BRACKET:
                case a.FE.KEYCODE.BACKSLASH:
                case a.FE.KEYCODE.CLOSE_SQUARE_BRACKET:
                    return !0;
                default:
                    return !1
            }
        }

        function u(c) {
            var d = c.which;
            return r(c) || d >= 37 && 40 >= d || !t(d) && d != a.FE.KEYCODE.DELETE && d != a.FE.KEYCODE.BACKSPACE && d != a.FE.KEYCODE.ENTER ? !0 : (z || (A = b.snapshot.get()), clearTimeout(z), void(z = setTimeout(function() {
                z = null, b.undo.saveStep()
            }, Math.max(250, b.opts.typingTimer))))
        }

        function v(a) {
            return r(a) ? !0 : void(A && z && (b.undo.saveStep(A), A = null))
        }

        function w() {
            z && (clearTimeout(z), b.undo.saveStep(), A = null)
        }

        function x() {
            if (b.events.on("keydown", u), b.events.on("input", h), b.events.on("keyup input", v), b.events.on("keypress", k), b.events.on("keydown", m), b.events.on("keyup", q), b.events.on("html.inserted", q), b.events.on("cut", i), b.$el.get(0).msGetInputContext) try {
                b.$el.get(0).msGetInputContext().addEventListener("MSCandidateWindowShow", function() {
                    B = !0
                }), b.$el.get(0).msGetInputContext().addEventListener("MSCandidateWindowHide", function() {
                    B = !1, q()
                })
            } catch (a) {}
        }
        var y, z, A, B = !1;
        return {
            _init: x,
            ctrlKey: r,
            isCharacter: t,
            isArrow: s,
            forceUndo: w,
            isIME: l
        }
    }, a.extend(a.FE.DEFAULTS, {
        pastePlain: !1,
        pasteDeniedTags: ["colgroup", "col"],
        pasteDeniedAttrs: ["class", "id", "style"],
        pasteAllowLocalImages: !1
    }), a.FE.MODULES.paste = function(b) {
        function c(c) {
            a.FE.copied_html = b.html.getSelected(), a.FE.copied_text = a("<div>").html(a.FE.copied_html).text(), "cut" == c.type && (b.undo.saveStep(), setTimeout(function() {
                b.html.wrap(), b.events.focus(), b.undo.saveStep()
            }, 0))
        }

        function d(a) {
            if (o) return !1;
            if (a.originalEvent && (a = a.originalEvent), b.events.trigger("paste.before", [a]) === !1) return !1;
            if (l = b.$win.scrollTop(), a && a.clipboardData && a.clipboardData.getData) {
                var c = "",
                    d = a.clipboardData.types;
                if (b.helpers.isArray(d))
                    for (var f = 0; f < d.length; f++) c += d[f] + ";";
                else c = d;
                if (m = "", /text\/html/.test(c) ? m = a.clipboardData.getData("text/html") : /text\/rtf/.test(c) && b.browser.safari ? m = a.clipboardData.getData("text/rtf") : /text\/plain/.test(c) && !this.browser.mozilla && (m = b.html.escapeEntities(a.clipboardData.getData("text/plain")).replace(/\n/g, "<br>")), "" !== m) return h(), a.preventDefault && (a.stopPropagation(), a.preventDefault()), !1;
                m = null
            }
            e()
        }

        function e() {
            b.selection.save(), b.events.disableBlur(), m = null, n ? n.html("") : (n = a('<div contenteditable="true" style="position: fixed; top: 0; left: -9999px; height: 100%; width: 0; word-break: break-all; overflow:hidden; z-index: 9999; line-height: 140%;" tabindex="-1"></div>'), b.$box.after(n), b.events.on("destroy", function() {
                n.remove()
            })), n.focus(), b.win.setTimeout(h, 1)
        }

        function f(c) {
            c = c.replace(/<p(.*?)class="?'?MsoListParagraph"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ul><li>$3</li></ul>"), c = c.replace(/<p(.*?)class="?'?NumberedText"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ol><li>$3</li></ol>"), c = c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ul><li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?NumberedTextCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ol><li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?NumberedTextCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?MsoListBullet"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li></ul>"), c = c.replace(/<p(.*?)class="?'?NumberedTextCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li></ol>"), c = c.replace(/<span([^<]*?)style="?'?mso-list:Ignore"?'?([\s\S]*?)>([\s\S]*?)<span/gi, "<span><span"), c = c.replace(/<!--\[if \!supportLists\]-->([\s\S]*?)<!--\[endif\]-->/gi, ""), c = c.replace(/<!\[if \!supportLists\]>([\s\S]*?)<!\[endif\]>/gi, ""), c = c.replace(/(\n|\r| class=(")?Mso[a-zA-Z0-9]+(")?)/gi, " "), c = c.replace(/<!--[\s\S]*?-->/gi, ""), c = c.replace(/<(\/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>/gi, "");
            for (var d = ["style", "script", "applet", "embed", "noframes", "noscript"], e = 0; e < d.length; e++) {
                var f = new RegExp("<" + d[e] + ".*?" + d[e] + "(.*?)>", "gi");
                c = c.replace(f, "")
            }
            c = c.replace(/&nbsp;/gi, " "), c = c.replace(/<td([^>]*)><\/td>/g, "<td$1><br></td>"), c = c.replace(/<th([^>]*)><\/th>/g, "<th$1><br></th>");
            var g;
            do g = c, c = c.replace(/<[^\/>][^>]*><\/[^>]+>/gi, ""); while (c != g);
            c = c.replace(/<lilevel([^1])([^>]*)>/gi, '<li data-indent="true"$2>'), c = c.replace(/<lilevel1([^>]*)>/gi, "<li$1>"), c = b.clean.html(c, b.opts.pasteDeniedTags, b.opts.pasteDeniedAttrs), c = c.replace(/<a>(.[^<]+)<\/a>/gi, "$1"), c = c.replace(/<br> */g, "<br>");
            var h = a("<div>").html(c);
            return h.find("li[data-indent]").each(function(b, c) {
                var d = a(c);
                if (d.prev("li").length > 0) {
                    var e = d.prev("li").find("> ul, > ol");
                    0 === e.length && (e = a("ul"), d.prev("li").append(e)), e.append(c)
                } else d.removeAttr("data-indent")
            }), b.html.cleanBlankSpaces(h.get(0)), c = h.html()
        }

        function g(c) {
            var d = a("<div>").html(c);
            d.find("p, div, h1, h2, h3, h4, h5, h6, pre, blockquote").each(function(c, d) {
                a(d).replaceWith("<" + (b.html.defaultTag() || "DIV") + ">" + a(d).html() + "</" + (b.html.defaultTag() || "DIV") + ">")
            }), a(d.find("*").not("p, div, h1, h2, h3, h4, h5, h6, pre, blockquote, ul, ol, li, table, tbody, thead, tr, td, br, img").get().reverse()).each(function() {
                a(this).replaceWith(a(this).html())
            });
            var e = function(c) {
                for (var d = b.node.contents(c), f = 0; f < d.length; f++) 3 != d[f].nodeType && 1 != d[f].nodeType ? a(d[f]).remove() : e(d[f])
            };
            return e(d.get(0)), d.html()
        }

        function h() {
            b.keys.forceUndo();
            var c = b.snapshot.get();
            null === m && (m = n.html(), b.selection.restore(), b.events.enableBlur());
            var d = b.events.chainTrigger("paste.beforeCleanup", m);
            "string" == typeof d && (m = d);
            var e = !1;
            m.match(/(class=\"?Mso|class=\'?Mso|style=\"[^\"]*\bmso\-|style=\'[^\']*\bmso\-|w:WordDocument)/gi) && (e = !0), m.indexOf("<body") >= 0 && (m = m.replace(/[.\s\S\w\W<>]*<body[^>]*>([.\s\S\w\W<>]*)<\/body>[.\s\S\w\W<>]*/g, "$1"));
            var h = !1;
            if (m.indexOf('id="docs-internal-guid') >= 0 && (m = m.replace(/^.* id="docs-internal-guid[^>]*>(.*)<\/b>.*$/, "$1"), h = !0), e ? (m = m.replace(/^\n*/g, "").replace(/^ /g, ""), 0 === m.indexOf("<colgroup>") && (m = "<table>" + m + "</table>"), m = f(m), m = j(m)) : (b.opts.htmlAllowComments = !1, m = b.clean.html(m, b.opts.pasteDeniedTags, b.opts.pasteDeniedAttrs), b.opts.htmlAllowComments = !0, m = j(m), m = m.replace(/\r|\n|\t/g, ""), a.FE.copied_text && a("<div>").html(m).text().replace(/(\u00A0)/gi, " ").replace(/\r|\n/gi, "") == a.FE.copied_text.replace(/(\u00A0)/gi, " ").replace(/\r|\n/gi, "") && (m = a.FE.copied_html), m = m.replace(/^ */g, "").replace(/ *$/g, "")), b.opts.pastePlain && (m = g(m)), d = b.events.chainTrigger("paste.afterCleanup", m), "string" == typeof d && (m = d), "" !== m) {
                var k = a("<div>").html(m);
                b.spaces.normalize(k.get(0)), k.find("span").each(function() {
                    0 == this.attributes.length && a(this).replaceWith(this.innerHTML)
                }), h || k.find("br").each(function() {
                    this.previousSibling && b.node.isBlock(this.previousSibling) && a(this).remove()
                }), b.opts.enter == a.FE.ENTER_BR ? k.find("p, div").each(function(b, c) {
                    a(c).replaceWith(a(c).html() + (c.nextSibling ? "<br>" : ""))
                }) : b.opts.enter == a.FE.ENTER_DIV && k.find("p").each(function(b, c) {
                    a(c).replaceWith("<div>" + c.innerHTML + "</div>")
                }), m = k.html(), b.html.insert(m, !0)
            }
            i(), b.undo.saveStep(c), b.undo.saveStep()
        }

        function i() {
            b.events.trigger("paste.after")
        }

        function j(c) {
            for (var d, e = a("<div>").html(c), f = e.find("*:empty:not(br, img, td, th)"); f.length;) {
                for (d = 0; d < f.length; d++) a(f[d]).remove();
                f = e.find("*:empty:not(br, img, td, th)")
            }
            for (var g = e.find("> div:not([style]), td > div, th > div, li > div"); g.length && d++ < 100;) {
                var h = a(g[g.length - 1]);
                b.html.defaultTag() && "div" != b.html.defaultTag() ? h.replaceWith("<" + b.html.defaultTag() + ">" + h.html() + "</" + b.html.defaultTag() + ">") : h.find("*:last").is("br") ? h.replaceWith(h.html()) : h.replaceWith(h.html() + "<br>"), g = e.find("> div:not([style]), td > div, th > div, li > div")
            }
            for (g = e.find("div:not([style])"); g.length;) {
                for (d = 0; d < g.length; d++) {
                    var i = a(g[d]),
                        j = i.html().replace(/\u0009/gi, "").trim();
                    i.replaceWith(j)
                }
                g = e.find("div:not([style])")
            }
            return e.html()
        }

        function k() {
            b.events.on("copy", c), b.events.on("cut", c), b.events.on("paste", d), b.browser.msie && b.browser.version < 11 && (b.events.on("mouseup", function(a) {
                2 == a.button && (setTimeout(function() {
                    o = !1
                }, 50), o = !0)
            }, !0), b.events.on("beforepaste", d))
        }
        var l, m, n, o = !1;
        return {
            _init: k
        }
    }, a.extend(a.FE.DEFAULTS, {
        shortcutsEnabled: ["show", "bold", "italic", "underline", "strikeThrough", "indent", "outdent", "undo", "redo"],
        shortcutsHint: !0
    }), a.FE.SHORTCUTS_MAP = {}, a.FE.RegisterShortcut = function(b, c, d, e, f, g) {
        a.FE.SHORTCUTS_MAP[(f ? "^" : "") + (g ? "@" : "") + b] = {
            cmd: c,
            val: d,
            letter: e,
            shift: f,
            option: g
        }, a.FE.DEFAULTS.shortcutsEnabled.push(c)
    }, a.FE.RegisterShortcut(a.FE.KEYCODE.E, "show", null, "E", !1, !1), a.FE.RegisterShortcut(a.FE.KEYCODE.B, "bold", null, "B", !1, !1), a.FE.RegisterShortcut(a.FE.KEYCODE.I, "italic", null, "I", !1, !1), a.FE.RegisterShortcut(a.FE.KEYCODE.U, "underline", null, "U", !1, !1), a.FE.RegisterShortcut(a.FE.KEYCODE.S, "strikeThrough", null, "S", !1, !1), a.FE.RegisterShortcut(a.FE.KEYCODE.CLOSE_SQUARE_BRACKET, "indent", null, "]", !1, !1), a.FE.RegisterShortcut(a.FE.KEYCODE.OPEN_SQUARE_BRACKET, "outdent", null, "[", !1, !1), a.FE.RegisterShortcut(a.FE.KEYCODE.Z, "undo", null, "Z", !1, !1), a.FE.RegisterShortcut(a.FE.KEYCODE.Z, "redo", null, "Z", !0, !1), a.FE.MODULES.shortcuts = function(b) {
        function c(c) {
            if (!b.opts.shortcutsHint) return null;
            if (!f) {
                f = {};
                for (var d in a.FE.SHORTCUTS_MAP) a.FE.SHORTCUTS_MAP.hasOwnProperty(d) && b.opts.shortcutsEnabled.indexOf(a.FE.SHORTCUTS_MAP[d].cmd) >= 0 && (f[a.FE.SHORTCUTS_MAP[d].cmd + "." + (a.FE.SHORTCUTS_MAP[d].val || "")] = {
                    shift: a.FE.SHORTCUTS_MAP[d].shift,
                    option: a.FE.SHORTCUTS_MAP[d].option,
                    letter: a.FE.SHORTCUTS_MAP[d].letter
                })
            }
            var e = f[c];
            return e ? (b.helpers.isMac() ? String.fromCharCode(8984) : "Ctrl+") + (e.shift ? b.helpers.isMac() ? String.fromCharCode(8679) : "Shift+" : "") + (e.option ? b.helpers.isMac() ? String.fromCharCode(8997) : "Alt+" : "") + e.letter : null
        }

        function d(c) {
            if (!b.core.hasFocus()) return !0;
            var d = c.which,
                e = -1 != navigator.userAgent.indexOf("Mac OS X") ? c.metaKey : c.ctrlKey,
                f = (c.shiftKey ? "^" : "") + (c.altKey ? "@" : "") + d;
            if (e && a.FE.SHORTCUTS_MAP[f]) {
                var g = a.FE.SHORTCUTS_MAP[f].cmd;
                if (g && b.opts.shortcutsEnabled.indexOf(g) >= 0) {
                    var h, i = a.FE.SHORTCUTS_MAP[f].val;
                    if (g && !i ? h = b.$tb.find('.fr-command[data-cmd="' + g + '"]') : g && i && (h = b.$tb.find('.fr-command[data-cmd="' + g + '"][data-param1="' + i + '"]')), h.length) return c.preventDefault(), c.stopPropagation(), h.parents(".fr-toolbar").data("instance", b), "keydown" == c.type && b.button.exec(h), !1;
                    if (g && b.commands[g]) return c.preventDefault(), c.stopPropagation(), "keydown" == c.type && b.commands[g](), !1
                }
            }
        }

        function e() {
            b.events.on("keydown", d, !0), b.events.on("keyup", d, !0)
        }
        var f = null;
        return {
            _init: e,
            get: c
        }
    }, a.FE.MODULES.snapshot = function(a) {
        function b(a) {
            for (var b = a.parentNode.childNodes, c = 0, d = null, e = 0; e < b.length; e++) {
                if (d) {
                    var f = b[e].nodeType === Node.TEXT_NODE && "" === b[e].textContent,
                        g = d.nodeType === Node.TEXT_NODE && b[e].nodeType === Node.TEXT_NODE;
                    f || g || c++
                }
                if (b[e] == a) return c;
                d = b[e]
            }
        }

        function c(c) {
            var d = [];
            if (!c.parentNode) return [];
            for (; !a.node.isElement(c);) d.push(b(c)), c = c.parentNode;
            return d.reverse()
        }

        function d(a, b) {
            for (; a && a.nodeType === Node.TEXT_NODE;) {
                var c = a.previousSibling;
                c && c.nodeType == Node.TEXT_NODE && (b += c.textContent.length), a = c
            }
            return b
        }

        function e(a) {
            return {
                scLoc: c(a.startContainer),
                scOffset: d(a.startContainer, a.startOffset),
                ecLoc: c(a.endContainer),
                ecOffset: d(a.endContainer, a.endOffset)
            }
        }

        function f() {
            var b = {};
            if (a.events.trigger("snapshot.before"), b.html = (a.$wp ? a.$el.html() : a.$oel.get(0).outerHTML).replace(/ style=""/g, ""), b.ranges = [], a.$wp && a.selection.inEditor() && a.core.hasFocus())
                for (var c = a.selection.ranges(), d = 0; d < c.length; d++) b.ranges.push(e(c[d]));
            return a.events.trigger("snapshot.after"), b
        }

        function g(b) {
            for (var c = a.$el.get(0), d = 0; d < b.length; d++) c = c.childNodes[b[d]];
            return c
        }

        function h(b, c) {
            try {
                var d = g(c.scLoc),
                    e = c.scOffset,
                    f = g(c.ecLoc),
                    h = c.ecOffset,
                    i = a.doc.createRange();
                i.setStart(d, e), i.setEnd(f, h), b.addRange(i)
            } catch (j) {}
        }

        function i(b) {
            a.$el.html() != b.html && a.$el.html(b.html);
            var c = a.selection.get();
            a.selection.clear(), a.events.focus(!0);
            for (var d = 0; d < b.ranges.length; d++) h(c, b.ranges[d])
        }

        function j(b, c) {
            return b.html != c.html ? !1 : a.core.hasFocus() && JSON.stringify(b.ranges) != JSON.stringify(c.ranges) ? !1 : !0
        }
        return {
            get: f,
            restore: i,
            equal: j
        }
    }, a.FE.MODULES.undo = function(a) {
        function b(b) {
            var c = b.which,
                d = a.keys.ctrlKey(b);
            d && (90 == c && b.shiftKey && b.preventDefault(), 90 == c && b.preventDefault())
        }

        function c() {
            return 0 === a.undo_stack.length || a.undo_index <= 1 ? !1 : !0
        }

        function d() {
            return a.undo_index == a.undo_stack.length ? !1 : !0
        }

        function e(b) {
            return !a.undo_stack || a.undoing || a.$el.get(0).querySelectorAll(".fr-marker").length ? !1 : void("undefined" == typeof b ? (b = a.snapshot.get(), a.undo_stack[a.undo_index - 1] && a.snapshot.equal(a.undo_stack[a.undo_index - 1], b) || (f(), a.undo_stack.push(b), a.undo_index++, b.html != l && (a.events.trigger("contentChanged"), l = b.html))) : (f(), a.undo_index > 0 ? a.undo_stack[a.undo_index - 1] = b : (a.undo_stack.push(b), a.undo_index++)))
        }

        function f() {
            if (!a.undo_stack || a.undoing) return !1;
            for (; a.undo_stack.length > a.undo_index;) a.undo_stack.pop()
        }

        function g() {
            if (a.undo_index > 1) {
                a.undoing = !0;
                var b = a.undo_stack[--a.undo_index - 1];
                clearTimeout(a._content_changed_timer), a.snapshot.restore(b), l = b.html, a.popups.hideAll(), a.toolbar.enable(), a.events.trigger("contentChanged"), a.events.trigger("commands.undo"), a.undoing = !1
            }
        }

        function h() {
            if (a.undo_index < a.undo_stack.length) {
                a.undoing = !0;
                var b = a.undo_stack[a.undo_index++];
                clearTimeout(a._content_changed_timer), a.snapshot.restore(b), l = b.html, a.popups.hideAll(), a.toolbar.enable(), a.events.trigger("contentChanged"), a.events.trigger("commands.redo"), a.undoing = !1
            }
        }

        function i() {
            a.undo_index = 0, a.undo_stack = []
        }

        function j() {
            a.undo_stack = []
        }

        function k() {
            i(), a.events.on("initialized", function() {
                l = (a.$wp ? a.$el.html() : a.$oel.get(0).outerHTML).replace(/ style=""/g, "")
            }), a.events.on("blur", function() {
                a.undo.saveStep()
            }), a.events.on("keydown", b), a.events.on("destroy", j)
        }
        var l = null;
        return {
            _init: k,
            run: g,
            redo: h,
            canDo: c,
            canRedo: d,
            dropRedo: f,
            reset: i,
            saveStep: e
        }
    }, a.FE.ICON_DEFAULT_TEMPLATE = "font_awesome", a.FE.ICON_TEMPLATES = {
        font_awesome: '<i class="fa fa-[NAME]"></i>',
        text: '<span style="text-align: center;">[NAME]</span>',
        image: "<img src=[SRC] alt=[ALT] />",
        svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">[PATH]</svg>'
    }, a.FE.ICONS = {
        bold: {
            NAME: "bold"
        },
        italic: {
            NAME: "italic"
        },
        underline: {
            NAME: "underline"
        },
        strikeThrough: {
            NAME: "strikethrough"
        },
        subscript: {
            NAME: "subscript"
        },
        superscript: {
            NAME: "superscript"
        },
        color: {
            NAME: "tint"
        },
        outdent: {
            NAME: "outdent"
        },
        indent: {
            NAME: "indent"
        },
        undo: {
            NAME: "rotate-left"
        },
        redo: {
            NAME: "rotate-right"
        },
        insertHR: {
            NAME: "minus"
        },
        clearFormatting: {
            NAME: "eraser"
        },
        selectAll: {
            NAME: "mouse-pointer"
        }
    }, a.FE.DefineIconTemplate = function(b, c) {
        a.FE.ICON_TEMPLATES[b] = c
    }, a.FE.DefineIcon = function(b, c) {
        a.FE.ICONS[b] = c
    }, a.FE.MODULES.icon = function(b) {
        function c(b) {
            var c = null,
                d = a.FE.ICONS[b];
            if ("undefined" != typeof d) {
                var e = d.template || a.FE.ICON_DEFAULT_TEMPLATE;
                e && (e = a.FE.ICON_TEMPLATES[e]) && (c = e.replace(/\[([a-zA-Z]*)\]/g, function(a, c) {
                    return "NAME" == c ? d[c] || b : d[c]
                }))
            }
            return c || b
        }

        function d(b) {
            var c = a.FE.ICONS[b],
                d = "";
            if ("undefined" != typeof c) {
                var d = c.template || a.FE.ICON_DEFAULT_TEMPLATE;
                return d
            }
            return d
        }
        return {
            create: c,
            getTemplate: d
        }
    }, a.extend(a.FE.DEFAULTS, {
        tooltips: !0
    }), a.FE.MODULES.tooltip = function(b) {
        function c() {
            b.$tooltip && b.$tooltip.removeClass("fr-visible").css("left", "-3000px").css("position", "fixed")
        }

        function d(c, d) {
            if (c.data("title") || c.data("title", c.attr("title")), !c.data("title")) return !1;
            b.$tooltip || f(), c.removeAttr("title"), b.$tooltip.text(c.data("title")), b.$tooltip.addClass("fr-visible");
            var e = c.offset().left + (c.outerWidth() - b.$tooltip.outerWidth()) / 2;
            0 > e && (e = 0), e + b.$tooltip.outerWidth() > a(b.o_win).width() && (e = a(b.o_win).width() - b.$tooltip.outerWidth()), "undefined" == typeof d && (d = b.opts.toolbarBottom);
            var g = d ? c.offset().top - b.$tooltip.height() : c.offset().top + c.outerHeight();
            b.$tooltip.css("position", ""), b.$tooltip.css("left", e), b.$tooltip.css("top", Math.ceil(g)), "static" != a(b.o_doc).find("body").css("position") ? (b.$tooltip.css("margin-left", -a(b.o_doc).find("body").offset().left), b.$tooltip.css("margin-top", -a(b.o_doc).find("body").offset().top)) : (b.$tooltip.css("margin-left", ""), b.$tooltip.css("margin-top", ""))
        }

        function e(e, f, g) {
            b.opts.tooltips && !b.helpers.isMobile() && (b.events.$on(e, "mouseenter", f, function(c) {
                a(c.currentTarget).hasClass("fr-disabled") || b.edit.isDisabled() || d(a(c.currentTarget), g)
            }, !0), b.events.$on(e, "mouseleave " + b._mousedown + " " + b._mouseup, f, function(a) {
                c()
            }, !0))
        }

        function f() {
            b.opts.tooltips && !b.helpers.isMobile() && (b.shared.$tooltip ? b.$tooltip = b.shared.$tooltip : (b.shared.$tooltip = a('<div class="fr-tooltip"></div>'), b.$tooltip = b.shared.$tooltip, b.opts.theme && b.$tooltip.addClass(b.opts.theme + "-theme"), a(b.o_doc).find("body").append(b.$tooltip)), b.events.on("shared.destroy", function() {
                b.$tooltip.html("").removeData().remove(), b.$tooltip = null
            }, !0))
        }
        return {
            hide: c,
            to: d,
            bind: e
        }
    }, a.FE.MODULES.button = function(b) {
        function c(c) {
            var d = a(c.currentTarget),
                e = d.next(),
                f = d.hasClass("fr-active"),
                g = (b.helpers.isMobile(), a(".fr-dropdown.fr-active").not(d)),
                h = d.parents(".fr-toolbar, .fr-popup").data("instance") || b;
            if (h.helpers.isIOS() && 0 == h.$el.get(0).querySelectorAll(".fr-marker").length && (h.selection.save(), h.selection.clear(), h.selection.restore()), !f) {
                var i = d.data("cmd");
                e.find(".fr-command").removeClass("fr-active"), a.FE.COMMANDS[i] && a.FE.COMMANDS[i].refreshOnShow && a.FE.COMMANDS[i].refreshOnShow.apply(h, [d, e]), e.css("left", d.offset().left - d.parent().offset().left - ("rtl" == b.opts.direction ? e.width() - d.outerWidth() : 0)), b.opts.toolbarBottom ? e.css("bottom", b.$tb.height() - d.position().top) : e.css("top", d.position().top + d.outerHeight())
            }
            d.addClass("fr-blink").toggleClass("fr-active"), setTimeout(function() {
                d.removeClass("fr-blink")
            }, 300), e.offset().left + e.outerWidth() > a(b.opts.scrollableContainer).offset().left + a(b.opts.scrollableContainer).outerWidth() && e.css("margin-left", -(e.offset().left + e.outerWidth() - a(b.opts.scrollableContainer).offset().left - a(b.opts.scrollableContainer).outerWidth())), g.removeClass("fr-active"), g.parent(".fr-toolbar:not(.fr-inline)").css("zIndex", ""), 0 != d.parents(".fr-popup").length || b.opts.toolbarInline || (d.hasClass("fr-active") ? b.$tb.css("zIndex", (b.opts.zIndex || 1) + 4) : b.$tb.css("zIndex", ""))
        }

        function d(b) {
            b.addClass("fr-blink"), setTimeout(function() {
                b.removeClass("fr-blink")
            }, 500);
            for (var c = b.data("cmd"), d = [];
                "undefined" != typeof b.data("param" + (d.length + 1));) d.push(b.data("param" + (d.length + 1)));
            var e = a(".fr-dropdown.fr-active");
            e.length && (e.removeClass("fr-active"), e.parent(".fr-toolbar:not(.fr-inline)").css("zIndex", "")), b.parents(".fr-popup, .fr-toolbar").data("instance").commands.exec(c, d)
        }

        function e(b) {
            var c = a(b.currentTarget);
            d(c)
        }

        function f(b) {
            var d = a(b.currentTarget),
                f = d.parents(".fr-popup, .fr-toolbar").data("instance");
            if (0 != d.parents(".fr-popup").length || d.data("popup") || f.popups.hideAll(), f.popups.areVisible() && !f.popups.areVisible(f)) {
                for (var g = 0; g < a.FE.INSTANCES.length; g++) a.FE.INSTANCES[g] != f && a.FE.INSTANCES[g].popups && a.FE.INSTANCES[g].popups.areVisible() && a.FE.INSTANCES[g].$el.find(".fr-marker").remove();
                f.popups.hideAll()
            }
            d.hasClass("fr-dropdown") ? c(b) : (e(b), a.FE.COMMANDS[d.data("cmd")] && 0 != a.FE.COMMANDS[d.data("cmd")].refreshAfterCallback && f.button.bulkRefresh())
        }

        function g(a) {
            var b = a.find(".fr-dropdown.fr-active");
            b.length && (b.removeClass("fr-active"), b.parent(".fr-toolbar:not(.fr-inline)").css("zIndex", ""))
        }

        function h(a) {
            a.preventDefault(), a.stopPropagation()
        }

        function i(a) {
            return a.stopPropagation(), b.helpers.isMobile() ? void 0 : !1
        }

        function j(c, d) {
            b.events.bindClick(c, ".fr-command:not(.fr-disabled)", f), b.events.$on(c, b._mousedown + " " + b._mouseup + " " + b._move, ".fr-dropdown-menu", h, !0), b.events.$on(c, b._mousedown + " " + b._mouseup + " " + b._move, ".fr-dropdown-menu .fr-dropdown-wrapper", i, !0);
            var e = c.get(0).ownerDocument,
                j = "defaultView" in e ? e.defaultView : e.parentWindow,
                k = function(d) {
                    (!d || d.type == b._mouseup && d.target != a("html").get(0) || "keydown" == d.type && (b.keys.isCharacter(d.which) && !b.keys.ctrlKey(d) || d.which == a.FE.KEYCODE.ESC)) && g(c)
                };
            b.events.$on(a(j), b._mouseup + " resize keydown", k, !0), b.opts.iframe && b.events.$on(b.$win, b._mouseup, k, !0), c.hasClass("fr-popup") ? a.merge(t, c.find(".fr-btn").toArray()) : a.merge(s, c.find(".fr-btn").toArray()), b.tooltip.bind(c, ".fr-btn, .fr-title", d)
        }

        function k(a, c) {
            var d = "";
            if (c.html) d += "function" == typeof c.html ? c.html.call(b) : c.html;
            else {
                var e = c.options;
                "function" == typeof e && (e = e()), d += '<ul class="fr-dropdown-list">';
                for (var f in e)
                    if (e.hasOwnProperty(f)) {
                        var g = b.shortcuts.get(a + "." + f);
                        g = g ? '<span class="fr-shortcut">' + g + "</span>" : "", d += '<li><a class="fr-command" data-cmd="' + a + '" data-param1="' + f + '" title="' + e[f] + '">' + b.language.translate(e[f]) + "</a></li>"
                    }
                d += "</ul>"
            }
            return d
        }

        function l(a, c, d) {
            var e = c.displaySelection;
            "function" == typeof e && (e = e(b));
            var f;
            if (e) {
                var g = "function" == typeof c.defaultSelection ? c.defaultSelection(b) : c.defaultSelection;
                f = '<span style="width:' + (c.displaySelectionWidth || 100) + 'px">' + (g || b.language.translate(c.title)) + "</span>"
            } else f = b.icon.create(c.icon || a);
            var h = c.popup ? ' data-popup="true"' : "",
                i = b.shortcuts.get(a + ".");
            i = i ? " (" + i + ")" : "";
            var j = '<button type="button" tabindex="-1" aria-label="' + (b.language.translate(c.title) || "") + '" title="' + (b.language.translate(c.title) || "") + i + '" class="fr-command fr-btn' + ("dropdown" == c.type ? " fr-dropdown" : "") + (" fr-btn-" + b.icon.getTemplate(c.icon)) + (c.displaySelection ? " fr-selection" : "") + (c.back ? " fr-back" : "") + (c.disabled ? " fr-disabled" : "") + (d ? "" : " fr-hidden") + '" data-cmd="' + a + '"' + h + ">" + f + "</button>";
            if ("dropdown" == c.type) {
                var l = '<div class="fr-dropdown-menu"><div class="fr-dropdown-wrapper"><div class="fr-dropdown-content">';
                l += k(a, c), l += "</div></div></div>", j += l
            }
            return j
        }

        function m(c, d) {
            for (var e = "", f = 0; f < c.length; f++) {
                var g = c[f],
                    h = a.FE.COMMANDS[g];
                if (!(h && "undefined" != typeof h.plugin && b.opts.pluginsEnabled.indexOf(h.plugin) < 0))
                    if (h) {
                        var i = "undefined" != typeof d ? d.indexOf(g) >= 0 : !0;
                        e += l(g, h, i)
                    } else "|" == g ? e += '<div class="fr-separator fr-vs"></div>' : "-" == g && (e += '<div class="fr-separator fr-hs"></div>')
            }
            return e
        }

        function n(c) {
            var d, e = c.parents(".fr-popup, .fr-toolbar").data("instance") || b,
                f = c.data("cmd");
            c.hasClass("fr-dropdown") ? d = c.next() : c.removeClass("fr-active"), a.FE.COMMANDS[f] && a.FE.COMMANDS[f].refresh ? a.FE.COMMANDS[f].refresh.apply(e, [c, d]) : b.refresh[f] && e.refresh[f](c, d)
        }

        function o(c) {
            var d = b.$tb ? b.$tb.data("instance") || b : b;
            return 0 == b.events.trigger("buttons.refresh") ? !0 : void setTimeout(function() {
                for (var b = d.selection.inEditor() && d.core.hasFocus(), e = 0; e < c.length; e++) {
                    var f = a(c[e]),
                        g = f.data("cmd");
                    0 == f.parents(".fr-popup").length ? b || a.FE.COMMANDS[g] && a.FE.COMMANDS[g].forcedRefresh ? d.button.refresh(f) : f.hasClass("fr-dropdown") || f.removeClass("fr-active") : f.parents(".fr-popup").is(":visible") && d.button.refresh(f)
                }
            }, 0)
        }

        function p() {
            o(s), o(t)
        }

        function q() {
            s = [], t = []
        }

        function r() {
            b.opts.toolbarInline ? b.events.on("toolbar.show", p) : (b.events.on("mouseup", p), b.events.on("keyup", p), b.events.on("blur", p), b.events.on("focus", p), b.events.on("contentChanged", p)), b.events.on("shared.destroy", q)
        }
        var s = [];
        (b.opts.toolbarInline || b.opts.toolbarContainer) && (b.shared.buttons || (b.shared.buttons = []), s = b.shared.buttons);
        var t = [];
        return b.shared.popup_buttons || (b.shared.popup_buttons = []), t = b.shared.popup_buttons, {
            _init: r,
            buildList: m,
            bindCommands: j,
            refresh: n,
            bulkRefresh: p,
            exec: d
        }
    }, a.FE.POPUP_TEMPLATES = {
        "text.edit": "[_EDIT_]"
    }, a.FE.RegisterTemplate = function(b, c) {
        a.FE.POPUP_TEMPLATES[b] = c
    }, a.FE.MODULES.popups = function(b) {
        function c(c, d) {
            d.is(":visible") || (d = a(b.opts.scrollableContainer)), d.is(x[c].data("container")) || (x[c].data("container", d), d.append(x[c]))
        }

        function d(d, e, h, i) {
            if (g() && b.$el.find(".fr-marker").length > 0 && (b.events.disableBlur(), b.selection.restore()), m([d]), !x[d]) return !1;
            a(".fr-dropdown.fr-active").removeClass("fr-active").parent(".fr-toolbar").css("zIndex", ""), x[d].data("instance", b), b.$tb && b.$tb.data("instance", b);
            var j = x[d].outerWidth(),
                k = (x[d].outerHeight(), f(d));
            x[d].addClass("fr-active").removeClass("fr-hidden").find("input, textarea").removeAttr("disabled");
            var l = x[d].data("container");
            b.opts.toolbarInline && l && b.$tb && l.get(0) == b.$tb.get(0) && (c(d, a(b.opts.scrollableContainer)), h = b.$tb.offset().top - b.helpers.getPX(b.$tb.css("margin-top")), e = b.$tb.offset().left + b.$tb.outerWidth() / 2 + (parseFloat(b.$tb.find(".fr-arrow").css("margin-left")) || 0) + b.$tb.find(".fr-arrow").outerWidth() / 2, b.$tb.hasClass("fr-above") && h && (h += b.$tb.outerHeight()), i = 0), l = x[d].data("container"), !b.opts.iframe || i || k || (e && (e -= b.$iframe.offset().left), h && (h -= b.$iframe.offset().top)), l.is(b.$tb) ? b.$tb.css("zIndex", (b.opts.zIndex || 1) + 4) : x[d].css("zIndex", (b.opts.zIndex || 1) + 4), e && (e -= j / 2), b.opts.toolbarBottom && l && b.$tb && l.get(0) == b.$tb.get(0) && (x[d].addClass("fr-above"), h && (h -= x[d].outerHeight())), x[d].removeClass("fr-active"), b.position.at(e, h, x[d], i || 0), x[d].addClass("fr-active");
            var n = x[d].find("input:visible, textarea:visible").get(0);
            n && (0 == b.$el.find(".fr-marker").length && b.core.hasFocus() && b.selection.save(), b.events.disableBlur(), a(n).select().focus()), b.opts.toolbarInline && b.toolbar.hide(), b.events.trigger("popups.show." + d), s(d)._repositionPopup(), o()
        }

        function e(a, c) {
            b.events.on("popups.show." + a, c)
        }

        function f(a) {
            return x[a] && x[a].hasClass("fr-active") && b.core.sameInstance(x[a]) || !1
        }

        function g(a) {
            for (var b in x)
                if (x.hasOwnProperty(b) && f(b) && ("undefined" == typeof a || x[b].data("instance") == a)) return !0;
            return !1
        }

        function h(a) {
            x[a] && x[a].hasClass("fr-active") && (x[a].removeClass("fr-active fr-above"), b.events.trigger("popups.hide." + a), b.$tb && (b.opts.zIndex > 1 ? b.$tb.css("zIndex", b.opts.zIndex + 1) : b.$tb.css("zIndex", "")), b.events.disableBlur(), x[a].find("input, textarea, button").filter(":focus").blur(), x[a].find("input, textarea").attr("disabled", "disabled"))
        }

        function i(a, c) {
            b.events.on("popups.hide." + a, c)
        }

        function j(a) {
            var c = x[a];
            if (c && !c.data("inst" + b.id)) {
                var d = s(a);
                t(d, a)
            }
            return c
        }

        function k(a, c) {
            b.events.on("popups.refresh." + a, c)
        }

        function l(c) {
            b.events.trigger("popups.refresh." + c);
            for (var d = x[c].find(".fr-command"), e = 0; e < d.length; e++) {
                var f = a(d[e]);
                0 == f.parents(".fr-dropdown-menu").length && b.button.refresh(f)
            }
        }

        function m(a) {
            "undefined" == typeof a && (a = []);
            for (var b in x) x.hasOwnProperty(b) && a.indexOf(b) < 0 && h(b)
        }

        function n() {
            b.shared.exit_flag = !0
        }

        function o() {
            b.shared.exit_flag = !1
        }

        function p() {
            return b.shared.exit_flag
        }

        function q(c, d) {
            var e = a.FE.POPUP_TEMPLATES[c];
            "function" == typeof e && (e = e.apply(b));
            for (var f in d) d.hasOwnProperty(f) && (e = e.replace("[_" + f.toUpperCase() + "_]", d[f]));
            return e
        }

        function r(c, d) {
            var e = q(c, d),
                f = a('<div class="fr-popup' + (b.helpers.isMobile() ? " fr-mobile" : " fr-desktop") + (b.opts.toolbarInline ? " fr-inline" : "") + '"><span class="fr-arrow"></span>' + e + "</div>");
            b.opts.theme && f.addClass(b.opts.theme + "-theme"), b.opts.zIndex > 1 && b.$tb.css("z-index", b.opts.zIndex + 2), "auto" != b.opts.direction && f.removeClass("fr-ltr fr-rtl").addClass("fr-" + b.opts.direction), f.find("input, textarea").attr("dir", b.opts.direction).attr("disabled", "disabled");
            var g = a("body");
            return g.append(f), f.data("container", g), x[c] = f, b.button.bindCommands(f, !1), f
        }

        function s(c) {
            var d = x[c];
            return {
                _windowResize: function() {
                    var a = d.data("instance") || b;
                    !a.helpers.isMobile() && d.is(":visible") && (a.events.disableBlur(), a.popups.hide(c), a.events.enableBlur())
                },
                _inputFocus: function(c) {
                    var e = d.data("instance") || b;
                    if (c.preventDefault(), c.stopPropagation(), setTimeout(function() {
                            e.events.enableBlur()
                        }, 0), e.helpers.isMobile()) {
                        var f = a(e.o_win).scrollTop();
                        setTimeout(function() {
                            a(e.o_win).scrollTop(f)
                        }, 0)
                    }
                },
                _inputBlur: function(c) {
                    var e = d.data("instance") || b;
                    document.activeElement != this && a(this).is(":visible") && (e.events.blurActive() && e.events.trigger("blur"), e.events.enableBlur())
                },
                _inputKeydown: function(e) {
                    var g = d.data("instance") || b,
                        h = e.which;
                    if (a.FE.KEYCODE.TAB == h) {
                        e.preventDefault();
                        var i = d.find("input, textarea, button, select").filter(":visible").not(":disabled").toArray();
                        i.sort(function(b, c) {
                            return e.shiftKey ? a(b).attr("tabIndex") < a(c).attr("tabIndex") : a(b).attr("tabIndex") > a(c).attr("tabIndex")
                        }), g.events.disableBlur();
                        var j = i.indexOf(this) + 1;
                        j == i.length && (j = 0), a(i[j]).focus()
                    } else if (a.FE.KEYCODE.ENTER == h) d.find(".fr-submit:visible").length > 0 && (e.preventDefault(), e.stopPropagation(), g.events.disableBlur(), g.button.exec(d.find(".fr-submit:visible:first")));
                    else {
                        if (a.FE.KEYCODE.ESC == h) return e.preventDefault(), e.stopPropagation(), g.$el.find(".fr-marker") && (g.events.disableBlur(), a(this).data("skip", !0), g.selection.restore(), g.events.enableBlur()), f(c) && d.find(".fr-back:visible").length ? g.button.exec(d.find(".fr-back:visible:first")) : g.popups.hide(c), g.opts.toolbarInline && g.toolbar.showInline(null, !0), !1;
                        e.stopPropagation()
                    }
                },
                _windowKeydown: function(e) {
                    if (!b.core.sameInstance(d)) return !0;
                    var g = d.data("instance") || b,
                        h = e.which;
                    if (a.FE.KEYCODE.ESC == h) {
                        if (f(c) && g.opts.toolbarInline) return e.stopPropagation(), f(c) && d.find(".fr-back:visible").length ? g.button.exec(d.find(".fr-back:visible:first")) : (g.popups.hide(c), g.toolbar.showInline(null, !0)), !1;
                        f(c) && d.find(".fr-back:visible").length ? g.button.exec(d.find(".fr-back:visible:first")) : g.popups.hide(c)
                    }
                },
                _editorKeydown: function(e) {
                    var g = d.data("instance") || b;
                    g.keys.ctrlKey(e) || e.which == a.FE.KEYCODE.ESC || (f(c) && d.find(".fr-back:visible").length ? g.button.exec(d.find(".fr-back:visible:first")) : g.popups.hide(c))
                },
                _preventFocus: function(c) {
                    var e = d.data("instance") || b;
                    e.events.disableBlur();
                    var f = c.originalEvent ? c.originalEvent.target || c.originalEvent.originalTarget : null,
                        g = "input, textarea, button, select, label, .fr-command";
                    return f && !a(f).is(g) && 0 === a(f).parents(g).length ? (c.stopPropagation(), !1) : (f && a(f).is(g) && c.stopPropagation(), void o())
                },
                _editorMouseup: function(a) {
                    d.is(":visible") && p() && d.find("input:focus, textarea:focus, button:focus, select:focus").filter(":visible").length > 0 && b.events.disableBlur()
                },
                _windowMouseup: function(a) {
                    if (!b.core.sameInstance(d)) return !0;
                    var e = d.data("instance") || b;
                    d.is(":visible") && p() && (a.stopPropagation(), e.markers.remove(), e.popups.hide(c), o())
                },
                _doPlaceholder: function(b) {
                    var c = a(this).next();
                    0 == c.length && a(this).after("<label>" + a(this).attr("placeholder") + "</label>"), a(this).toggleClass("fr-not-empty", "" != a(this).val())
                },
                _repositionPopup: function(e) {
                    if (!b.opts.height && !b.opts.heightMax || b.opts.toolbarInline) return !0;
                    if (b.$wp && f(c) && d.parent().get(0) == a(b.opts.scrollableContainer).get(0)) {
                        var g = d.offset().top - b.$wp.offset().top,
                            h = b.$wp.outerHeight();
                        d.hasClass("fr-above") && (g += d.outerHeight()), g > h || 0 > g ? d.addClass("fr-hidden") : d.removeClass("fr-hidden")
                    }
                }
            }
        }

        function t(a, c) {
            b.events.on("mouseup", a._editorMouseup, !0), b.$wp && b.events.on("keydown", a._editorKeydown), b.events.on("blur", function(a) {
                g() && b.markers.remove(), m()
            }), b.$wp && !b.helpers.isMobile() && b.events.$on(b.$wp, "scroll.popup" + c, a._repositionPopup), b.events.on("window.keydown", a._windowKeydown), b.events.on("window.mouseup", a._windowMouseup, !0), x[c].data("inst" + b.id, !0), b.events.on("destroy", function() {
                b.core.sameInstance(x[c]) && x[c].removeClass("fr-active").appendTo("body")
            }, !0)
        }

        function u(c, d) {
            var e = r(c, d),
                f = s(c);
            return t(f, c), b.events.$on(e, "mousedown mouseup touchstart touchend touch", "*", f._preventFocus, !0), b.events.$on(e, "focus", "input, textarea, button, select", f._inputFocus, !0), b.events.$on(e, "blur", "input, textarea, button, select", f._inputBlur, !0), b.events.$on(e, "keydown", "input, textarea, button, select", f._inputKeydown, !0), b.events.$on(e, "keydown keyup change input", "input, textarea", f._doPlaceholder, !0), b.helpers.isIOS() && b.events.$on(e, "touchend", "label", function() {
                a("#" + a(this).attr("for")).prop("checked", function(a, b) {
                    return !b
                })
            }, !0), b.events.$on(a(b.o_win), "resize", f._windowResize, !0), e
        }

        function v() {
            for (var a in x)
                if (x.hasOwnProperty(a)) {
                    var b = x[a];
                    b.html("").removeData().remove(), x[a] = null
                }
            x = []
        }

        function w() {
            b.events.on("shared.destroy", v, !0), b.events.on("window.mousedown", n), b.events.on("window.touchmove", o), b.events.on("mousedown", function(a) {
                g() && (a.stopPropagation(), b.$el.find(".fr-marker").remove(), n(), b.events.disableBlur())
            })
        }
        b.shared.popups || (b.shared.popups = {});
        var x = b.shared.popups;
        return b.shared.exit_flag = !1, {
            _init: w,
            create: u,
            get: j,
            show: d,
            hide: h,
            onHide: i,
            hideAll: m,
            setContainer: c,
            refresh: l,
            onRefresh: k,
            onShow: e,
            isVisible: f,
            areVisible: g
        }
    }, a.FE.MODULES.position = function(b) {
        function c() {
            var c, d = b.selection.ranges(0);
            if (d && d.collapsed && b.selection.inEditor()) {
                var e = !1;
                0 == b.$el.find(".fr-marker").length && (b.selection.save(), e = !0);
                var f = b.$el.find(".fr-marker:first");
                f.css("display", "inline"), f.css("line-height", "");
                var g = f.offset(),
                    h = f.outerHeight();
                f.css("display", "none"), f.css("line-height", 0), c = {}, c.left = g.left, c.width = 0, c.height = h, c.top = g.top - (b.helpers.isIOS() ? 0 : a(b.o_win).scrollTop()), c.right = 1, c.bottom = 1, c.ok = !0, e && b.selection.restore()
            } else d && (c = d.getBoundingClientRect());
            return c
        }

        function d(c, d, e) {
            var f = c.outerHeight();
            if (!b.helpers.isMobile() && b.$tb && c.parent().get(0) != b.$tb.get(0)) {
                var g = (c.parent().height() - 20 - (b.opts.toolbarBottom ? b.$tb.outerHeight() : 0), c.parent().offset().top),
                    h = d - f - (e || 0);
                c.parent().get(0) == a(b.opts.scrollableContainer).get(0) && (g -= c.parent().position().top);
                var i = a(b.opts.scrollableContainer).get(0).scrollHeight;
                g + d + f > a(b.opts.scrollableContainer).offset().top + i && c.parent().offset().top + h > 0 ? (d = h, c.addClass("fr-above")) : c.removeClass("fr-above")
            }
            return d
        }

        function e(c, d) {
            var e = c.outerWidth();
            return d + e > a(b.opts.scrollableContainer).width() - 10 && (d = a(b.opts.scrollableContainer).width() - e - 10), 0 > d && (d = 10), d
        }

        function f(d) {
            var e = c();
            d.css("top", 0).css("left", 0);
            var f = e.top + e.height,
                h = e.left + e.width / 2 - d.outerWidth() / 2 + a(b.o_win).scrollLeft();
            b.opts.iframe || (f += a(b.o_win).scrollTop()), g(h, f, d, e.height)
        }

        function g(a, c, f, g) {
            var h = f.data("container");
            !h || h.is("body") && "static" == h.css("position") || (a && (a -= h.offset().left), c && (c -= h.offset().top), "BODY" != h.get(0).tagName ? (a && (a += h.scrollLeft()), c && (c += h.scrollTop())) : "absolute" == h.css("position") && (a && (a += h.position().left), c && (c += h.position().top))), b.opts.iframe && h && b.$tb && h.get(0) != b.$tb.get(0) && (a && (a += b.$iframe.offset().left), c && (c += b.$iframe.offset().top));
            var i = e(f, a);
            if (a) {
                f.css("left", i);
                var j = f.find(".fr-arrow");
                j.data("margin-left") || j.data("margin-left", b.helpers.getPX(j.css("margin-left"))), j.css("margin-left", a - i + j.data("margin-left"))
            }
            c && f.css("top", d(f, c, g))
        }

        function h(c) {
            var d = a(c),
                e = d.is(".fr-sticky-on"),
                f = d.data("sticky-top"),
                g = d.data("sticky-scheduled");
            if ("undefined" == typeof f) {
                d.data("sticky-top", 0);
                var h = a('<div class="fr-sticky-dummy" style="height: ' + d.outerHeight() + 'px;"></div>');
                b.$box.prepend(h)
            } else b.$box.find(".fr-sticky-dummy").css("height", d.outerHeight());
            if (b.core.hasFocus() || b.$tb.find("input:visible:focus").length > 0) {
                var i = a(window).scrollTop(),
                    j = Math.min(Math.max(i - b.$tb.parent().offset().top, 0), b.$tb.parent().outerHeight() - d.outerHeight());
                j != f && j != g && (clearTimeout(d.data("sticky-timeout")), d.data("sticky-scheduled", j), d.outerHeight() < i - b.$tb.parent().offset().top && d.addClass("fr-opacity-0"), d.data("sticky-timeout", setTimeout(function() {
                    var c = a(window).scrollTop(),
                        e = Math.min(Math.max(c - b.$tb.parent().offset().top, 0), b.$tb.parent().outerHeight() - d.outerHeight());
                    e > 0 && "BODY" == b.$tb.parent().get(0).tagName && (e += b.$tb.parent().position().top), e != f && (d.css("top", Math.max(e, 0)), d.data("sticky-top", e), d.data("sticky-scheduled", e)), d.removeClass("fr-opacity-0")
                }, 100))), e || (d.css("top", "0"), d.width(b.$tb.parent().width()), d.addClass("fr-sticky-on"), b.$box.addClass("fr-sticky-box"))
            } else clearTimeout(a(c).css("sticky-timeout")), d.css("top", "0"), d.css("position", ""), d.width(""), d.data("sticky-top", 0), d.removeClass("fr-sticky-on"), b.$box.removeClass("fr-sticky-box")
        }

        function i(c) {
            if (c.offsetWidth) {
                var d, e, f = a(c),
                    g = f.outerHeight(),
                    h = f.data("sticky-position"),
                    i = a("body" == b.opts.scrollableContainer ? b.o_win : b.opts.scrollableContainer).outerHeight(),
                    j = 0,
                    k = 0;
                "body" !== b.opts.scrollableContainer && (j = a(b.opts.scrollableContainer).offset().top, k = a(b.o_win).outerHeight() - j - i);
                var l = "body" == b.opts.scrollableContainer ? a(b.o_win).scrollTop() : j,
                    m = f.is(".fr-sticky-on");
                f.data("sticky-parent") || f.data("sticky-parent", f.parent());
                var n = f.data("sticky-parent"),
                    o = n.offset().top,
                    p = n.outerHeight();
                if (f.data("sticky-offset") || (f.data("sticky-offset", !0), f.after('<div class="fr-sticky-dummy" style="height: ' + g + 'px;"></div>')), !h) {
                    var q = "auto" !== f.css("top") || "auto" !== f.css("bottom");
                    q || f.css("position", "fixed"), h = {
                        top: f.hasClass("fr-top"),
                        bottom: f.hasClass("fr-bottom")
                    }, q || f.css("position", ""), f.data("sticky-position", h), f.data("top", f.hasClass("fr-top") ? f.css("top") : "auto"), f.data("bottom", f.hasClass("fr-bottom") ? f.css("bottom") : "auto")
                }
                var r = function() {
                        return l + d > o && o + p - g >= l + d
                    },
                    s = function() {
                        return l + i - e > o + g && o + p > l + i - e
                    };
                d = b.helpers.getPX(f.data("top")), e = b.helpers.getPX(f.data("bottom"));
                var t = h.top && r(),
                    u = h.bottom && s();
                t || u ? (f.css("width", n.width() + "px"), m || (f.addClass("fr-sticky-on"), f.removeClass("fr-sticky-off"), f.css("top") && ("auto" != f.data("top") ? f.css("top", b.helpers.getPX(f.data("top")) + j) : f.data("top", "auto")), f.css("bottom") && ("auto" != f.data("bottom") ? f.css("bottom", b.helpers.getPX(f.data("bottom")) + k) : f.css("bottom", "auto")))) : f.hasClass("fr-sticky-off") || (f.width(""), f.removeClass("fr-sticky-on"), f.addClass("fr-sticky-off"), f.css("top") && "auto" != f.data("top") && h.top && f.css("top", 0), f.css("bottom") && "auto" != f.data("bottom") && h.bottom && f.css("bottom", 0))
            }
        }

        function j() {
            var a = document.createElement("test"),
                c = a.style;
            return c.cssText = "position:" + ["-webkit-", "-moz-", "-ms-", "-o-", ""].join("sticky; position:") + " sticky;", -1 !== c.position.indexOf("sticky") && !b.helpers.isIOS() && !b.helpers.isAndroid()
        }

        function k() {
            if (!j())
                if (b._stickyElements = [], b.helpers.isIOS()) {
                    var c = function() {
                        b.helpers.requestAnimationFrame()(c);
                        for (var a = 0; a < b._stickyElements.length; a++) h(b._stickyElements[a])
                    };
                    c(), b.events.$on(a(b.o_win), "scroll", function() {
                        if (b.core.hasFocus())
                            for (var c = 0; c < b._stickyElements.length; c++) {
                                var d = a(b._stickyElements[c]),
                                    e = d.parent(),
                                    f = a(window).scrollTop();
                                d.outerHeight() < f - e.offset().top && (d.addClass("fr-opacity-0"), d.data("sticky-top", -1), d.data("sticky-scheduled", -1))
                            }
                    }, !0)
                } else b.events.$on(a("body" == b.opts.scrollableContainer ? b.o_win : b.opts.scrollableContainer), "scroll", l, !0), b.events.$on(a(b.o_win), "resize", l, !0), b.events.on("initialized", l), b.events.on("focus", l), b.events.$on(a(b.o_win), "resize", "textarea", l, !0);
            b.events.on("destroy", function(a) {
                b._stickyElements = []
            })
        }

        function l() {
            for (var a = 0; a < b._stickyElements.length; a++) i(b._stickyElements[a])
        }

        function m(a) {
            a.addClass("fr-sticky"), b.helpers.isIOS() && a.addClass("fr-sticky-ios"), j() || b._stickyElements.push(a.get(0))
        }

        function n() {
            k()
        }
        return {
            _init: n,
            forSelection: f,
            addSticky: m,
            refresh: l,
            at: g,
            getBoundingRect: c
        }
    }, a.FE.MODULES.refresh = function(b) {
        function c(a) {
            a.toggleClass("fr-disabled", !b.undo.canDo())
        }

        function d(a) {
            a.toggleClass("fr-disabled", !b.undo.canRedo())
        }

        function e(a) {
            if (a.hasClass("fr-no-refresh")) return !1;
            for (var c = b.selection.blocks(), d = 0; d < c.length; d++) {
                for (var e = c[d].previousSibling; e && e.nodeType == Node.TEXT_NODE && 0 === e.textContent.length;) e = e.previousSibling;
                if ("LI" != c[d].tagName || e) return a.removeClass("fr-disabled"), !0;
                a.addClass("fr-disabled")
            }
        }

        function f(c) {
            if (c.hasClass("fr-no-refresh")) return !1;
            for (var d = b.selection.blocks(), e = 0; e < d.length; e++) {
                var f = "rtl" == b.opts.direction || "rtl" == a(d[e]).css("direction") ? "margin-right" : "margin-left";
                if ("LI" == d[e].tagName || "LI" == d[e].parentNode.tagName) return c.removeClass("fr-disabled"), !0;
                if (b.helpers.getPX(a(d[e]).css(f)) > 0) return c.removeClass("fr-disabled"), !0
            }
            c.addClass("fr-disabled")
        }
        return {
            undo: c,
            redo: d,
            outdent: f,
            indent: e
        }
    }, a.extend(a.FE.DEFAULTS, {
        editInPopup: !1
    }), a.FE.MODULES.textEdit = function(b) {
        function c() {
            var a = '<div id="fr-text-edit-' + b.id + '" class="fr-layer fr-text-edit-layer"><div class="fr-input-line"><input type="text" placeholder="' + b.language.translate("Text") + '" tabIndex="1"></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="updateText" tabIndex="2">' + b.language.translate("Update") + "</button></div></div>",
                c = {
                    edit: a
                };
            b.popups.create("text.edit", c)
        }

        function d() {
            var c, d = b.popups.get("text.edit");
            c = "INPUT" === b.$el.prop("tagName") ? b.$el.attr("placeholder") : b.$el.text(), d.find("input").val(c).trigger("change"), b.popups.setContainer("text.edit", a("body")), b.popups.show("text.edit", b.$el.offset().left + b.$el.outerWidth() / 2, b.$el.offset().top + b.$el.outerHeight(), b.$el.outerHeight())
        }

        function e() {
            b.events.$on(b.$el, b._mouseup, function(a) {
                setTimeout(function() {
                    d()
                }, 10)
            })
        }

        function f() {
            var a = b.popups.get("text.edit"),
                c = a.find("input").val();
            0 == c.length && (c = b.opts.placeholderText), "INPUT" === b.$el.prop("tagName") ? b.$el.attr("placeholder", c) : b.$el.text(c), b.events.trigger("contentChanged"), b.popups.hide("text.edit")
        }

        function g() {
            b.opts.editInPopup && (c(), e())
        }
        return {
            _init: g,
            update: f
        }
    }, a.FE.RegisterCommand("updateText", {
        focus: !1,
        undo: !1,
        callback: function() {
            this.textEdit.update()
        }
    }), a.extend(a.FE.DEFAULTS, {
        toolbarBottom: !1,
        toolbarButtons: ["fullscreen", "bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "fontFamily", "fontSize", "|", "color", "emoticons", "inlineStyle", "paragraphStyle", "|", "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "insertHR", "-", "insertLink", "insertImage", "insertVideo", "insertFile", "insertTable", "undo", "redo", "clearFormatting", "selectAll", "html", "applyFormat", "removeFormat"],
        toolbarButtonsXS: ["bold", "italic", "fontFamily", "fontSize", "|", "undo", "redo"],
        toolbarButtonsSM: ["bold", "italic", "underline", "|", "fontFamily", "fontSize", "insertLink", "insertImage", "table", "|", "undo", "redo"],
        toolbarButtonsMD: ["fullscreen", "bold", "italic", "underline", "fontFamily", "fontSize", "color", "paragraphStyle", "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "insertHR", "-", "insertLink", "insertImage", "insertVideo", "insertFile", "insertTable", "undo", "redo", "clearFormatting"],
        toolbarContainer: null,
        toolbarInline: !1,
        toolbarSticky: !0,
        toolbarStickyOffset: 0,
        toolbarVisibleWithoutSelection: !1
    }), a.FE.MODULES.toolbar = function(b) {
        function c(a, b) {
            for (var c = 0; c < b.length; c++) "-" != b[c] && "|" != b[c] && a.indexOf(b[c]) < 0 && a.push(b[c])
        }

        function d() {
            var d = a.merge([], e());
            c(d, b.opts.toolbarButtonsXS || []), c(d, b.opts.toolbarButtonsSM || []), c(d, b.opts.toolbarButtonsMD || []), c(d, b.opts.toolbarButtons);
            for (var f = d.length - 1; f >= 0; f--) "-" != d[f] && "|" != d[f] && d.indexOf(d[f]) < f && d.splice(f, 1);
            var g = b.button.buildList(d, e());
            b.$tb.append(g), b.button.bindCommands(b.$tb)
        }

        function e() {
            var a = b.helpers.screenSize();
            return u[a]
        }

        function f() {
            var a = e();
            b.$tb.find(".fr-separator").remove(), b.$tb.find("> .fr-command").addClass("fr-hidden");
            for (var c = 0; c < a.length; c++)
                if ("|" == a[c] || "-" == a[c]) b.$tb.append(b.button.buildList([a[c]]));
                else {
                    var d = b.$tb.find('> .fr-command[data-cmd="' + a[c] + '"]'),
                        f = null;
                    d.next().hasClass("fr-dropdown-menu") && (f = d.next()), d.removeClass("fr-hidden").appendTo(b.$tb), f && f.appendTo(b.$tb)
                }
        }

        function g() {
            b.events.$on(a(b.o_win), "resize", f), b.events.$on(a(b.o_win), "orientationchange", f)
        }

        function h(c, d) {
            setTimeout(function() {
                if (c && c.which == a.FE.KEYCODE.ESC);
                else if (b.selection.inEditor() && b.core.hasFocus() && !b.popups.areVisible() && (b.opts.toolbarVisibleWithoutSelection && c && "keyup" != c.type || !b.selection.isCollapsed() && !b.keys.isIME() || d)) {
                    if (b.$tb.data("instance", b), 0 == b.events.trigger("toolbar.show", [c])) return !1;
                    b.opts.toolbarContainer || b.position.forSelection(b.$tb), b.$tb.show()
                }
            }, 0)
        }

        function i(c) {
            var d = a(".fr-dropdown.fr-active");
            return d.next().find(b.o_doc.activeElement).length ? !0 : void(b.events.trigger("toolbar.hide") !== !1 && b.$tb.hide())
        }

        function j() {
            return 0 == b.events.trigger("toolbar.show") ? !1 : void b.$tb.show()
        }

        function k() {
            b.events.on("window.mousedown", i), b.events.on("keydown", i), b.events.on("blur", i), b.events.on("window.mouseup", h), b.helpers.isMobile() ? b.helpers.isIOS() || (b.events.on("window.touchend", h), b.browser.mozilla && setInterval(h, 200)) : b.events.on("window.keyup", h), b.events.on("keydown", function(b) {
                b && b.which == a.FE.KEYCODE.ESC && i()
            }), b.events.$on(b.$wp, "scroll.toolbar", h), b.events.on("commands.after", h), b.helpers.isMobile() && (b.events.$on(b.$doc, "selectionchange", h), b.events.$on(b.$doc, "orientationchange", h))
        }

        function l() {
            b.opts.toolbarInline ? (a(b.opts.scrollableContainer).append(b.$tb), b.$tb.data("container", a(b.opts.scrollableContainer)), b.$tb.addClass("fr-inline"), b.$tb.prepend('<span class="fr-arrow"></span>'), k(), b.opts.toolbarBottom = !1) : (b.opts.toolbarBottom && !b.helpers.isIOS() ? (b.$box.append(b.$tb), b.$tb.addClass("fr-bottom"), b.$box.addClass("fr-bottom")) : (b.opts.toolbarBottom = !1, b.$box.prepend(b.$tb), b.$tb.addClass("fr-top"), b.$box.addClass("fr-top")), b.$tb.addClass("fr-basic"), b.opts.toolbarSticky && (b.opts.toolbarStickyOffset && (b.opts.toolbarBottom ? b.$tb.css("bottom", b.opts.toolbarStickyOffset) : b.$tb.css("top", b.opts.toolbarStickyOffset)), b.position.addSticky(b.$tb)))
        }

        function m() {
            b.$tb.html("").removeData().remove(), b.$tb = null
        }

        function n() {
            b.$box.removeClass("fr-top fr-bottom fr-inline fr-basic"), b.$box.find(".fr-sticky-dummy").remove()
        }

        function o() {
            b.opts.theme && b.$tb.addClass(b.opts.theme + "-theme"), b.opts.zIndex > 1 && b.$tb.css("z-index", b.opts.zIndex + 1), "auto" != b.opts.direction && b.$tb.removeClass("fr-ltr fr-rtl").addClass("fr-" + b.opts.direction), b.helpers.isMobile() ? b.$tb.addClass("fr-mobile") : b.$tb.addClass("fr-desktop"), b.opts.toolbarContainer ? (b.opts.toolbarInline && (k(), i()), b.opts.toolbarBottom ? b.$tb.addClass("fr-bottom") : b.$tb.addClass("fr-top")) : l(), s = b.$tb.get(0).ownerDocument, t = "defaultView" in s ? s.defaultView : s.parentWindow, d(), g(), b.events.$on(b.$tb, b._mousedown + " " + b._mouseup, function(a) {
                var c = a.originalEvent ? a.originalEvent.target || a.originalEvent.originalTarget : null;
                return c && "INPUT" != c.tagName && !b.edit.isDisabled() ? (a.stopPropagation(), a.preventDefault(), !1) : void 0
            }, !0)
        }

        function p() {
            return b.$wp ? (b.opts.toolbarContainer ? (b.shared.$tb ? (b.$tb = b.shared.$tb, b.opts.toolbarInline && k()) : (b.shared.$tb = a('<div class="fr-toolbar"></div>'), b.$tb = b.shared.$tb, a(b.opts.toolbarContainer).append(b.$tb), o(), b.$tb.data("instance", b)), b.opts.toolbarInline ? b.$box.addClass("fr-inline") : b.$box.addClass("fr-basic"), b.events.on("focus", function() {
                b.$tb.data("instance", b)
            }, !0), b.opts.toolbarInline = !1) : b.opts.toolbarInline ? (b.$box.addClass("fr-inline"), b.shared.$tb ? (b.$tb = b.shared.$tb, k()) : (b.shared.$tb = a('<div class="fr-toolbar"></div>'), b.$tb = b.shared.$tb, o())) : (b.$box.addClass("fr-basic"), b.$tb = a('<div class="fr-toolbar"></div>'), o(), b.$tb.data("instance", b)), b.events.on("destroy", n, !0), void b.events.on(b.opts.toolbarInline ? "shared.destroy" : "destroy", m, !0)) : !1
        }

        function q() {
            !v && b.$tb && (b.$tb.find("> .fr-command").addClass("fr-disabled fr-no-refresh"), v = !0)
        }

        function r() {
            v && b.$tb && (b.$tb.find("> .fr-command").removeClass("fr-disabled fr-no-refresh"), v = !1), b.button.bulkRefresh()
        }
        var s, t, u = [];
        u[a.FE.XS] = b.opts.toolbarButtonsXS || b.opts.toolbarButtons, u[a.FE.SM] = b.opts.toolbarButtonsSM || b.opts.toolbarButtons, u[a.FE.MD] = b.opts.toolbarButtonsMD || b.opts.toolbarButtons, u[a.FE.LG] = b.opts.toolbarButtons;
        var v = !1;
        return {
            _init: p,
            hide: i,
            show: j,
            showInline: h,
            disable: q,
            enable: r
        }
    }
});