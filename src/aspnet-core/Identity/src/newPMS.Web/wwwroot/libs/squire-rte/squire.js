!(function (e, t) {
  "use strict";
  function n(e, t, n) {
    (this.root = this.currentNode = e),
      (this.nodeType = t),
      (this.filter = n || ue);
  }
  function o(e, t) {
    for (var n = e.length; n--; ) if (!t(e[n])) return !1;
    return !0;
  }
  function i(e) {
    return e.nodeType === M && !!pe[e.nodeName];
  }
  function r(e) {
    switch (e.nodeType) {
      case H:
        return me;
      case M:
      case z:
        if (de && Ce.has(e)) return Ce.get(e);
        break;
      default:
        return ge;
    }
    var t;
    return (
      (t = o(e.childNodes, a) ? (fe.test(e.nodeName) ? me : ve) : Ne),
      de && Ce.set(e, t),
      t
    );
  }
  function a(e) {
    return r(e) === me;
  }
  function s(e) {
    return r(e) === ve;
  }
  function d(e) {
    return r(e) === Ne;
  }
  function l(e, t) {
    var o = new n(t, q, s);
    return (o.currentNode = e), o;
  }
  function c(e, t) {
    return (e = l(e, t).previousNode()), e !== t ? e : null;
  }
  function h(e, t) {
    return (e = l(e, t).nextNode()), e !== t ? e : null;
  }
  function u(e) {
    return !e.textContent && !e.querySelector("IMG");
  }
  function f(e, t) {
    return (
      !i(e) &&
      e.nodeType === t.nodeType &&
      e.nodeName === t.nodeName &&
      "A" !== e.nodeName &&
      e.className === t.className &&
      ((!e.style && !t.style) || e.style.cssText === t.style.cssText)
    );
  }
  function p(e, t, n) {
    if (e.nodeName !== t) return !1;
    for (var o in n) if (e.getAttribute(o) !== n[o]) return !1;
    return !0;
  }
  function g(e, t, n, o) {
    for (; e && e !== t; ) {
      if (p(e, n, o)) return e;
      e = e.parentNode;
    }
    return null;
  }
  function m(e, t, n) {
    for (; e && e !== t; ) {
      if (n.test(e.nodeName)) return e;
      e = e.parentNode;
    }
    return null;
  }
  function v(e, t) {
    for (; t; ) {
      if (t === e) return !0;
      t = t.parentNode;
    }
    return !1;
  }
  function N(e, t, n) {
    var o,
      i,
      r,
      a,
      s,
      d = "";
    return (
      e &&
        e !== t &&
        ((d = N(e.parentNode, t, n)),
        e.nodeType === M &&
          ((d += (d ? ">" : "") + e.nodeName),
          (o = e.id) && (d += "#" + o),
          (i = e.className.trim()) &&
            ((r = i.split(/\s\s*/)), r.sort(), (d += "."), (d += r.join("."))),
          (a = e.dir) && (d += "[dir=" + a + "]"),
          r &&
            ((s = n.classNames),
            ce.call(r, s.highlight) > -1 &&
              (d +=
                "[backgroundColor=" +
                e.style.backgroundColor.replace(/ /g, "") +
                "]"),
            ce.call(r, s.colour) > -1 &&
              (d += "[color=" + e.style.color.replace(/ /g, "") + "]"),
            ce.call(r, s.fontFamily) > -1 &&
              (d +=
                "[fontFamily=" + e.style.fontFamily.replace(/ /g, "") + "]"),
            ce.call(r, s.fontSize) > -1 &&
              (d += "[fontSize=" + e.style.fontSize + "]")))),
      d
    );
  }
  function C(e) {
    var t = e.nodeType;
    return t === M || t === z ? e.childNodes.length : e.length || 0;
  }
  function _(e) {
    var t = e.parentNode;
    return t && t.removeChild(e), e;
  }
  function S(e, t) {
    var n = e.parentNode;
    n && n.replaceChild(t, e);
  }
  function y(e) {
    for (
      var t = e.ownerDocument.createDocumentFragment(),
        n = e.childNodes,
        o = n ? n.length : 0;
      o--;

    )
      t.appendChild(e.firstChild);
    return t;
  }
  function T(e, n, o, i) {
    var r,
      a,
      s,
      d = e.createElement(n);
    if ((o instanceof Array && ((i = o), (o = null)), o))
      for (r in o) o[r] !== t && d.setAttribute(r, o[r]);
    if (i) for (a = 0, s = i.length; a < s; a += 1) d.appendChild(i[a]);
    return d;
  }
  function E(e, t) {
    var n,
      o,
      r = t.__squire__,
      s = e.ownerDocument,
      d = e;
    if (
      (e === t &&
        (((o = e.firstChild) && "BR" !== o.nodeName) ||
          ((n = r.createDefaultBlock()),
          o ? e.replaceChild(n, o) : e.appendChild(n),
          (e = n),
          (n = null))),
      e.nodeType === H)
    )
      return d;
    if (a(e)) {
      for (o = e.firstChild; re && o && o.nodeType === H && !o.data; )
        e.removeChild(o), (o = e.firstChild);
      o ||
        (re
          ? ((n = s.createTextNode(K)), r._didAddZWS())
          : (n = s.createTextNode("")));
    } else if (ie) {
      for (; e.nodeType !== H && !i(e); ) {
        if (!(o = e.firstChild)) {
          n = s.createTextNode("");
          break;
        }
        e = o;
      }
      e.nodeType === H
        ? /^ +$/.test(e.data) && (e.data = "")
        : i(e) && e.parentNode.insertBefore(s.createTextNode(""), e);
    } else if ("HR" !== e.nodeName && !e.querySelector("BR"))
      for (n = T(s, "BR"); (o = e.lastElementChild) && !a(o); ) e = o;
    if (n)
      try {
        e.appendChild(n);
      } catch (t) {
        r.didError({
          name: "Squire: fixCursor – " + t,
          message:
            "Parent: " +
            e.nodeName +
            "/" +
            e.innerHTML +
            " appendChild: " +
            n.nodeName,
        });
      }
    return d;
  }
  function b(e, t) {
    var n,
      o,
      i,
      r,
      s = e.childNodes,
      l = e.ownerDocument,
      c = null,
      h = t.__squire__._config;
    for (n = 0, o = s.length; n < o; n += 1)
      (i = s[n]),
        (r = "BR" === i.nodeName),
        !r && a(i)
          ? (c || (c = T(l, h.blockTag, h.blockAttributes)),
            c.appendChild(i),
            (n -= 1),
            (o -= 1))
          : (r || c) &&
            (c || (c = T(l, h.blockTag, h.blockAttributes)),
            E(c, t),
            r
              ? e.replaceChild(c, i)
              : (e.insertBefore(c, i), (n += 1), (o += 1)),
            (c = null)),
        d(i) && b(i, t);
    return c && e.appendChild(E(c, t)), e;
  }
  function k(e, t, n, o) {
    var i,
      r,
      a,
      s = e.nodeType;
    if (s === H && e !== n) return k(e.parentNode, e.splitText(t), n, o);
    if (s === M) {
      if (
        ("number" == typeof t &&
          (t = t < e.childNodes.length ? e.childNodes[t] : null),
        e === n)
      )
        return t;
      for (i = e.parentNode, r = e.cloneNode(!1); t; )
        (a = t.nextSibling), r.appendChild(t), (t = a);
      return (
        "OL" === e.nodeName &&
          g(e, o, "BLOCKQUOTE") &&
          (r.start = (+e.start || 1) + e.childNodes.length - 1),
        E(e, o),
        E(r, o),
        (a = e.nextSibling) ? i.insertBefore(r, a) : i.appendChild(r),
        k(i, r, n, o)
      );
    }
    return t;
  }
  function x(e, t) {
    for (var n, o, i, r = e.childNodes, s = r.length, d = []; s--; )
      if (
        ((n = r[s]),
        (o = s && r[s - 1]),
        s && a(n) && f(n, o) && !pe[n.nodeName])
      )
        t.startContainer === n &&
          ((t.startContainer = o), (t.startOffset += C(o))),
          t.endContainer === n && ((t.endContainer = o), (t.endOffset += C(o))),
          t.startContainer === e &&
            (t.startOffset > s
              ? (t.startOffset -= 1)
              : t.startOffset === s &&
                ((t.startContainer = o), (t.startOffset = C(o)))),
          t.endContainer === e &&
            (t.endOffset > s
              ? (t.endOffset -= 1)
              : t.endOffset === s &&
                ((t.endContainer = o), (t.endOffset = C(o)))),
          _(n),
          n.nodeType === H ? o.appendData(n.data) : d.push(y(n));
      else if (n.nodeType === M) {
        for (i = d.length; i--; ) n.appendChild(d.pop());
        x(n, t);
      }
  }
  function A(e, t) {
    if ((e.nodeType === H && (e = e.parentNode), e.nodeType === M)) {
      var n = {
        startContainer: t.startContainer,
        startOffset: t.startOffset,
        endContainer: t.endContainer,
        endOffset: t.endOffset,
      };
      x(e, n),
        t.setStart(n.startContainer, n.startOffset),
        t.setEnd(n.endContainer, n.endOffset);
    }
  }
  function L(e) {
    var t = e.nodeName;
    return (
      "TD" === t || "TH" === t || "TR" === t || "TBODY" === t || "THEAD" === t
    );
  }
  function B(e, t, n, o) {
    var i,
      r,
      a,
      s = t;
    if (!L(e) || !L(t)) {
      for (
        ;
        (i = s.parentNode) &&
        i !== o &&
        i.nodeType === M &&
        1 === i.childNodes.length;

      )
        s = i;
      _(s),
        (a = e.childNodes.length),
        (r = e.lastChild),
        r && "BR" === r.nodeName && (e.removeChild(r), (a -= 1)),
        e.appendChild(y(t)),
        n.setStart(e, a),
        n.collapse(!0),
        A(e, n),
        J && (r = e.lastChild) && "BR" === r.nodeName && e.removeChild(r);
    }
  }
  function O(e, t) {
    var n,
      o,
      i = e.previousSibling,
      r = e.firstChild,
      a = e.ownerDocument,
      s = "LI" === e.nodeName;
    if ((!s || (r && /^[OU]L$/.test(r.nodeName))) && !L(e))
      if (i && f(i, e) && i.isContentEditable && e.isContentEditable) {
        if (!d(i)) {
          if (!s) return;
          (o = T(a, "DIV")), o.appendChild(y(i)), i.appendChild(o);
        }
        _(e), (n = !d(e)), i.appendChild(y(e)), n && b(i, t), r && O(r, t);
      } else s && ((i = T(a, "DIV")), e.insertBefore(i, r), E(i, t));
  }
  function R(e) {
    this.isShiftDown = e.shiftKey;
  }
  function D(e, t, n) {
    var o, i;
    if ((e || (e = {}), t))
      for (o in t)
        (!n && o in e) ||
          ((i = t[o]),
          (e[o] = i && i.constructor === Object ? D(e[o], i, n) : i));
    return e;
  }
  function P(e, t) {
    e.nodeType === W && (e = e.body);
    var n,
      o = e.ownerDocument,
      i = o.defaultView;
    (this._win = i),
      (this._doc = o),
      (this._root = e),
      (this._events = {}),
      (this._isFocused = !1),
      (this._lastSelection = null),
      ae && this.addEventListener("beforedeactivate", this.getSelection),
      (this._hasZWS = !1),
      (this._lastAnchorNode = null),
      (this._lastFocusNode = null),
      (this._path = ""),
      (this._willUpdatePath = !1),
      "onselectionchange" in o
        ? this.addEventListener("selectionchange", this._updatePathOnEvent)
        : (this.addEventListener("keyup", this._updatePathOnEvent),
          this.addEventListener("mouseup", this._updatePathOnEvent)),
      (this._undoIndex = -1),
      (this._undoStack = []),
      (this._undoStackLength = 0),
      (this._isInUndoState = !1),
      (this._ignoreChange = !1),
      (this._ignoreAllChanges = !1),
      se
        ? ((n = new MutationObserver(this._docWasChanged.bind(this))),
          n.observe(e, {
            childList: !0,
            attributes: !0,
            characterData: !0,
            subtree: !0,
          }),
          (this._mutation = n))
        : this.addEventListener("keyup", this._keyUpDetectChange),
      (this._restoreSelection = !1),
      this.addEventListener("blur", U),
      this.addEventListener("mousedown", I),
      this.addEventListener("touchstart", I),
      this.addEventListener("focus", w),
      (this._awaitingPaste = !1),
      this.addEventListener(X ? "beforecut" : "cut", nt),
      this.addEventListener("copy", ot),
      this.addEventListener("keydown", R),
      this.addEventListener("keyup", R),
      this.addEventListener(X ? "beforepaste" : "paste", it),
      this.addEventListener("drop", rt),
      this.addEventListener(J ? "keypress" : "keydown", Ie),
      (this._keyHandlers = Object.create(He)),
      this.setConfig(t),
      X &&
        (i.Text.prototype.splitText = function (e) {
          var t = this.ownerDocument.createTextNode(this.data.slice(e)),
            n = this.nextSibling,
            o = this.parentNode,
            i = this.length - e;
          return (
            n ? o.insertBefore(t, n) : o.appendChild(t),
            i && this.deleteData(e, i),
            t
          );
        }),
      e.setAttribute("contenteditable", "true");
    try {
      o.execCommand("enableObjectResizing", !1, "false"),
        o.execCommand("enableInlineTableEditing", !1, "false");
    } catch (e) {}
    (e.__squire__ = this), this.setHTML("");
  }
  function U() {
    this._restoreSelection = !0;
  }
  function I() {
    this._restoreSelection = !1;
  }
  function w() {
    this._restoreSelection && this.setSelection(this._lastSelection);
  }
  function F(e, t, n) {
    var o, i;
    for (o = t.firstChild; o; o = i) {
      if (((i = o.nextSibling), a(o))) {
        if (o.nodeType === H || "BR" === o.nodeName || "IMG" === o.nodeName) {
          n.appendChild(o);
          continue;
        }
      } else if (s(o)) {
        n.appendChild(
          e.createDefaultBlock([F(e, o, e._doc.createDocumentFragment())])
        );
        continue;
      }
      F(e, o, n);
    }
    return n;
  }
  var M = 1,
    H = 3,
    W = 9,
    z = 11,
    q = 1,
    K = "​",
    G = e.defaultView,
    Z = navigator.userAgent,
    j = /Android/.test(Z),
    Q = /iP(?:ad|hone|od)/.test(Z),
    $ = /Mac OS X/.test(Z),
    V = /Windows NT/.test(Z),
    Y = /Gecko\//.test(Z),
    X = /Trident\/[456]\./.test(Z),
    J = !!G.opera,
    ee = /Edge\//.test(Z),
    te = !ee && /WebKit\//.test(Z),
    ne = /Trident\/[4567]\./.test(Z),
    oe = $ ? "meta-" : "ctrl-",
    ie = X || J,
    re = X || te,
    ae = X,
    se = "undefined" != typeof MutationObserver,
    de = "undefined" != typeof WeakMap,
    le = /[^ \t\r\n]/,
    ce = Array.prototype.indexOf;
  Object.create ||
    (Object.create = function (e) {
      var t = function () {};
      return (t.prototype = e), new t();
    });
  var he = { 1: 1, 2: 2, 3: 4, 8: 128, 9: 256, 11: 1024 },
    ue = function () {
      return !0;
    };
  (n.prototype.nextNode = function () {
    for (
      var e,
        t = this.currentNode,
        n = this.root,
        o = this.nodeType,
        i = this.filter;
      ;

    ) {
      for (e = t.firstChild; !e && t && t !== n; )
        (e = t.nextSibling) || (t = t.parentNode);
      if (!e) return null;
      if (he[e.nodeType] & o && i(e)) return (this.currentNode = e), e;
      t = e;
    }
  }),
    (n.prototype.previousNode = function () {
      for (
        var e,
          t = this.currentNode,
          n = this.root,
          o = this.nodeType,
          i = this.filter;
        ;

      ) {
        if (t === n) return null;
        if ((e = t.previousSibling)) for (; (t = e.lastChild); ) e = t;
        else e = t.parentNode;
        if (!e) return null;
        if (he[e.nodeType] & o && i(e)) return (this.currentNode = e), e;
        t = e;
      }
    }),
    (n.prototype.previousPONode = function () {
      for (
        var e,
          t = this.currentNode,
          n = this.root,
          o = this.nodeType,
          i = this.filter;
        ;

      ) {
        for (e = t.lastChild; !e && t && t !== n; )
          (e = t.previousSibling) || (t = t.parentNode);
        if (!e) return null;
        if (he[e.nodeType] & o && i(e)) return (this.currentNode = e), e;
        t = e;
      }
    });
  var fe =
      /^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|EL|FN)|EM|FONT|I(?:FRAME|MG|NPUT|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:AMP|MALL|PAN|TR(?:IKE|ONG)|U[BP])?|TIME|U|VAR|WBR)$/,
    pe = { BR: 1, HR: 1, IFRAME: 1, IMG: 1, INPUT: 1 },
    ge = 0,
    me = 1,
    ve = 2,
    Ne = 3,
    Ce = de ? new WeakMap() : null,
    _e = function (e, t) {
      for (var n = e.childNodes; t && e.nodeType === M; )
        (e = n[t - 1]), (n = e.childNodes), (t = n.length);
      return e;
    },
    Se = function (e, t) {
      if (e.nodeType === M) {
        var n = e.childNodes;
        if (t < n.length) e = n[t];
        else {
          for (; e && !e.nextSibling; ) e = e.parentNode;
          e && (e = e.nextSibling);
        }
      }
      return e;
    },
    ye = function (e, t) {
      var n,
        o,
        i,
        r,
        a = e.startContainer,
        s = e.startOffset,
        d = e.endContainer,
        l = e.endOffset;
      a.nodeType === H
        ? ((n = a.parentNode),
          (o = n.childNodes),
          s === a.length
            ? ((s = ce.call(o, a) + 1), e.collapsed && ((d = n), (l = s)))
            : (s &&
                ((r = a.splitText(s)),
                d === a ? ((l -= s), (d = r)) : d === n && (l += 1),
                (a = r)),
              (s = ce.call(o, a))),
          (a = n))
        : (o = a.childNodes),
        (i = o.length),
        s === i ? a.appendChild(t) : a.insertBefore(t, o[s]),
        a === d && (l += o.length - i),
        e.setStart(a, s),
        e.setEnd(d, l);
    },
    Te = function (e, t, n) {
      var o = e.startContainer,
        i = e.startOffset,
        r = e.endContainer,
        a = e.endOffset;
      t || (t = e.commonAncestorContainer),
        t.nodeType === H && (t = t.parentNode);
      for (
        var s,
          d,
          l,
          c,
          h,
          u = k(r, a, t, n),
          f = k(o, i, t, n),
          p = t.ownerDocument.createDocumentFragment();
        f !== u;

      )
        (s = f.nextSibling), p.appendChild(f), (f = s);
      return (
        (o = t),
        (i = u ? ce.call(t.childNodes, u) : t.childNodes.length),
        (l = t.childNodes[i]),
        (d = l && l.previousSibling),
        d &&
          d.nodeType === H &&
          l.nodeType === H &&
          ((o = d),
          (i = d.length),
          (c = d.data),
          (h = l.data),
          " " === c.charAt(c.length - 1) &&
            " " === h.charAt(0) &&
            (h = " " + h.slice(1)),
          d.appendData(h),
          _(l)),
        e.setStart(o, i),
        e.collapse(!0),
        E(t, n),
        p
      );
    },
    Ee = function (e, t) {
      var n,
        o,
        i = Le(e, t),
        r = Be(e, t),
        a = i !== r;
      return (
        xe(e),
        Ae(e, i, r, t),
        (n = Te(e, null, t)),
        xe(e),
        a && ((r = Be(e, t)), i && r && i !== r && B(i, r, e, t)),
        i && E(i, t),
        (o = t.firstChild),
        o && "BR" !== o.nodeName
          ? e.collapse(!0)
          : (E(t, t), e.selectNodeContents(t.firstChild)),
        n
      );
    },
    be = function (e, t, n) {
      var o, i, r, s, l, u, f, p, v, N;
      for (b(t, n), o = t; (o = h(o, n)); ) E(o, n);
      if (
        (e.collapsed || Ee(e, n),
        xe(e),
        e.collapse(!1),
        (s = g(e.endContainer, n, "BLOCKQUOTE") || n),
        (i = Le(e, n)),
        (f = h(t, t)),
        i && f && !m(f, t, /PRE|TABLE|H[1-6]|OL|UL|BLOCKQUOTE/))
      ) {
        if (
          (Ae(e, i, i, n),
          e.collapse(!0),
          (l = e.endContainer),
          (u = e.endOffset),
          et(i, n, !1),
          a(l) &&
            ((p = k(l, u, c(l, n), n)),
            (l = p.parentNode),
            (u = ce.call(l.childNodes, p))),
          u !== C(l))
        )
          for (
            r = n.ownerDocument.createDocumentFragment();
            (o = l.childNodes[u]);

          )
            r.appendChild(o);
        B(l, f, e, n),
          (u = ce.call(l.parentNode.childNodes, l) + 1),
          (l = l.parentNode),
          e.setEnd(l, u);
      }
      C(t) &&
        (Ae(e, s, s, n),
        (p = k(e.endContainer, e.endOffset, s, n)),
        (v = p ? p.previousSibling : s.lastChild),
        s.insertBefore(t, p),
        p ? e.setEndBefore(p) : e.setEnd(s, C(s)),
        (i = Be(e, n)),
        xe(e),
        (l = e.endContainer),
        (u = e.endOffset),
        p && d(p) && O(p, n),
        (p = v && v.nextSibling),
        p && d(p) && O(p, n),
        e.setEnd(l, u)),
        r &&
          ((N = e.cloneRange()),
          B(i, r, N, n),
          e.setEnd(N.endContainer, N.endOffset)),
        xe(e);
    },
    ke = function (e, t, n) {
      var o = t.ownerDocument.createRange();
      if ((o.selectNode(t), n)) {
        var i = e.compareBoundaryPoints(3, o) > -1,
          r = e.compareBoundaryPoints(1, o) < 1;
        return !i && !r;
      }
      var a = e.compareBoundaryPoints(0, o) < 1,
        s = e.compareBoundaryPoints(2, o) > -1;
      return a && s;
    },
    xe = function (e) {
      for (
        var t,
          n = e.startContainer,
          o = e.startOffset,
          r = e.endContainer,
          a = e.endOffset,
          s = !0;
        n.nodeType !== H && (t = n.childNodes[o]) && !i(t);

      )
        (n = t), (o = 0);
      if (a)
        for (; r.nodeType !== H; ) {
          if (!(t = r.childNodes[a - 1]) || i(t)) {
            if (s && t && "BR" === t.nodeName) {
              (a -= 1), (s = !1);
              continue;
            }
            break;
          }
          (r = t), (a = C(r));
        }
      else for (; r.nodeType !== H && (t = r.firstChild) && !i(t); ) r = t;
      e.collapsed
        ? (e.setStart(r, a), e.setEnd(n, o))
        : (e.setStart(n, o), e.setEnd(r, a));
    },
    Ae = function (e, t, n, o) {
      var i,
        r = e.startContainer,
        a = e.startOffset,
        s = e.endContainer,
        d = e.endOffset,
        l = !0;
      for (
        t || (t = e.commonAncestorContainer), n || (n = t);
        !a && r !== t && r !== o;

      )
        (i = r.parentNode), (a = ce.call(i.childNodes, r)), (r = i);
      for (;;) {
        if (
          (l &&
            s.nodeType !== H &&
            s.childNodes[d] &&
            "BR" === s.childNodes[d].nodeName &&
            ((d += 1), (l = !1)),
          s === n || s === o || d !== C(s))
        )
          break;
        (i = s.parentNode), (d = ce.call(i.childNodes, s) + 1), (s = i);
      }
      e.setStart(r, a), e.setEnd(s, d);
    },
    Le = function (e, t) {
      var n,
        o = e.startContainer;
      return (
        a(o)
          ? (n = c(o, t))
          : o !== t && s(o)
          ? (n = o)
          : ((n = _e(o, e.startOffset)), (n = h(n, t))),
        n && ke(e, n, !0) ? n : null
      );
    },
    Be = function (e, t) {
      var n,
        o,
        i = e.endContainer;
      if (a(i)) n = c(i, t);
      else if (i !== t && s(i)) n = i;
      else {
        if (!(n = Se(i, e.endOffset)) || !v(t, n))
          for (n = t; (o = n.lastChild); ) n = o;
        n = c(n, t);
      }
      return n && ke(e, n, !0) ? n : null;
    },
    Oe = new n(null, 4 | q, function (e) {
      return e.nodeType === H ? le.test(e.data) : "IMG" === e.nodeName;
    }),
    Re = function (e, t) {
      var n,
        o = e.startContainer,
        i = e.startOffset;
      if (((Oe.root = null), o.nodeType === H)) {
        if (i) return !1;
        n = o;
      } else if (
        ((n = Se(o, i)),
        n && !v(t, n) && (n = null),
        !n && ((n = _e(o, i)), n.nodeType === H && n.length))
      )
        return !1;
      return (Oe.currentNode = n), (Oe.root = Le(e, t)), !Oe.previousNode();
    },
    De = function (e, t) {
      var n,
        o = e.endContainer,
        i = e.endOffset;
      if (((Oe.root = null), o.nodeType === H)) {
        if ((n = o.data.length) && i < n) return !1;
        Oe.currentNode = o;
      } else Oe.currentNode = _e(o, i);
      return (Oe.root = Be(e, t)), !Oe.nextNode();
    },
    Pe = function (e, t) {
      var n,
        o = Le(e, t),
        i = Be(e, t);
      o &&
        i &&
        ((n = o.parentNode),
        e.setStart(n, ce.call(n.childNodes, o)),
        (n = i.parentNode),
        e.setEnd(n, ce.call(n.childNodes, i) + 1));
    },
    Ue = {
      8: "backspace",
      9: "tab",
      13: "enter",
      32: "space",
      33: "pageup",
      34: "pagedown",
      37: "left",
      39: "right",
      46: "delete",
      219: "[",
      221: "]",
    },
    Ie = function (e) {
      var t = e.keyCode,
        n = Ue[t],
        o = "",
        i = this.getSelection();
      e.defaultPrevented ||
        (n ||
          ((n = String.fromCharCode(t).toLowerCase()),
          /^[A-Za-z0-9]$/.test(n) || (n = "")),
        J && 46 === e.which && (n = "."),
        111 < t && t < 124 && (n = "f" + (t - 111)),
        "backspace" !== n &&
          "delete" !== n &&
          (e.altKey && (o += "alt-"),
          e.ctrlKey && (o += "ctrl-"),
          e.metaKey && (o += "meta-")),
        e.shiftKey && (o += "shift-"),
        (n = o + n),
        this._keyHandlers[n]
          ? this._keyHandlers[n](this, e, i)
          : i.collapsed ||
            e.isComposing ||
            e.ctrlKey ||
            e.metaKey ||
            1 !== (ne ? n : e.key || n).length ||
            (this.saveUndoState(i),
            Ee(i, this._root),
            this._ensureBottomLine(),
            this.setSelection(i),
            this._updatePath(i, !0)));
    },
    we = function (e) {
      return function (t, n) {
        n.preventDefault(), t[e]();
      };
    },
    Fe = function (e, t) {
      return (
        (t = t || null),
        function (n, o) {
          o.preventDefault();
          var i = n.getSelection();
          n.hasFormat(e, null, i)
            ? n.changeFormat(null, { tag: e }, i)
            : n.changeFormat({ tag: e }, t, i);
        }
      );
    },
    Me = function (e, t) {
      try {
        t || (t = e.getSelection());
        var n,
          o = t.startContainer;
        for (
          o.nodeType === H && (o = o.parentNode), n = o;
          a(n) && (!n.textContent || n.textContent === K);

        )
          (o = n), (n = o.parentNode);
        o !== n &&
          (t.setStart(n, ce.call(n.childNodes, o)),
          t.collapse(!0),
          n.removeChild(o),
          s(n) || (n = c(n, e._root)),
          E(n, e._root),
          xe(t)),
          o === e._root && (o = o.firstChild) && "BR" === o.nodeName && _(o),
          e._ensureBottomLine(),
          e.setSelection(t),
          e._updatePath(t, !0);
      } catch (t) {
        e.didError(t);
      }
    },
    He = {
      enter: function (e, t, n) {
        var o,
          i,
          r,
          a,
          s,
          d = e._root;
        if (
          (t.preventDefault(),
          e._recordUndoState(n),
          yt(n.startContainer, d, e),
          e._removeZWS(),
          e._getRangeAndRemoveBookmark(n),
          n.collapsed || Ee(n, d),
          (o = Le(n, d)) && (i = g(o, d, "PRE")))
        )
          return (
            xe(n),
            (r = n.startContainer),
            (a = n.startOffset),
            r.nodeType !== H &&
              ((r = e._doc.createTextNode("")),
              i.insertBefore(r, i.firstChild)),
            t.shiftKey ||
            ("\n" !== r.data.charAt(a - 1) && !Re(n, d)) ||
            ("\n" !== r.data.charAt(a) && !De(n, d))
              ? (r.insertData(a, "\n"),
                E(i, d),
                r.length === a + 1 ? n.setStartAfter(r) : n.setStart(r, a + 1))
              : (r.deleteData(a && a - 1, a ? 2 : 1),
                (s = k(r, a && a - 1, d, d)),
                (r = s.previousSibling),
                r.textContent || _(r),
                (r = e.createDefaultBlock()),
                s.parentNode.insertBefore(r, s),
                s.textContent || _(s),
                n.setStart(r, 0)),
            n.collapse(!0),
            e.setSelection(n),
            e._updatePath(n, !0),
            void e._docWasChanged()
          );
        if (!o || t.shiftKey || /^T[HD]$/.test(o.nodeName))
          return (
            (i = g(n.endContainer, d, "A")),
            i && ((i = i.parentNode), Ae(n, i, i, d), n.collapse(!1)),
            ye(n, e.createElement("BR")),
            n.collapse(!1),
            e.setSelection(n),
            void e._updatePath(n, !0)
          );
        if (((i = g(o, d, "LI")) && (o = i), u(o))) {
          if (g(o, d, "UL") || g(o, d, "OL")) return e.decreaseListLevel(n);
          if (g(o, d, "BLOCKQUOTE")) return e.modifyBlocks(mt, n);
        }
        for (
          s = ft(e, o, n.startContainer, n.startOffset), ct(o), Ye(o), E(o, d);
          s.nodeType === M;

        ) {
          var l,
            c = s.firstChild;
          if ("A" === s.nodeName && (!s.textContent || s.textContent === K)) {
            (c = e._doc.createTextNode("")), S(s, c), (s = c);
            break;
          }
          for (
            ;
            c &&
            c.nodeType === H &&
            !c.data &&
            (l = c.nextSibling) &&
            "BR" !== l.nodeName;

          )
            _(c), (c = l);
          if (!c || "BR" === c.nodeName || (c.nodeType === H && !J)) break;
          s = c;
        }
        (n = e.createRange(s, 0)), e.setSelection(n), e._updatePath(n, !0);
      },
      "shift-enter": function (e, t, n) {
        return e._keyHandlers.enter(e, t, n);
      },
      backspace: function (e, t, n) {
        var o = e._root;
        if ((e._removeZWS(), e.saveUndoState(n), n.collapsed))
          if (Re(n, o)) {
            t.preventDefault();
            var i,
              r = Le(n, o);
            if (!r) return;
            if ((b(r.parentNode, o), (i = c(r, o)))) {
              if (!i.isContentEditable) {
                for (; !i.parentNode.isContentEditable; ) i = i.parentNode;
                return void _(i);
              }
              for (B(i, r, n, o), r = i.parentNode; r !== o && !r.nextSibling; )
                r = r.parentNode;
              r !== o && (r = r.nextSibling) && O(r, o), e.setSelection(n);
            } else if (r) {
              if (g(r, o, "UL") || g(r, o, "OL")) return e.decreaseListLevel(n);
              if (g(r, o, "BLOCKQUOTE")) return e.modifyBlocks(gt, n);
              e.setSelection(n), e._updatePath(n, !0);
            }
          } else
            e.setSelection(n),
              setTimeout(function () {
                Me(e);
              }, 0);
        else t.preventDefault(), Ee(n, o), Me(e, n);
      },
      delete: function (e, t, n) {
        var o,
          i,
          r,
          a,
          s,
          d,
          l = e._root;
        if ((e._removeZWS(), e.saveUndoState(n), n.collapsed))
          if (De(n, l)) {
            if ((t.preventDefault(), !(o = Le(n, l)))) return;
            if ((b(o.parentNode, l), (i = h(o, l)))) {
              if (!i.isContentEditable) {
                for (; !i.parentNode.isContentEditable; ) i = i.parentNode;
                return void _(i);
              }
              for (B(o, i, n, l), i = o.parentNode; i !== l && !i.nextSibling; )
                i = i.parentNode;
              i !== l && (i = i.nextSibling) && O(i, l),
                e.setSelection(n),
                e._updatePath(n, !0);
            }
          } else {
            if (
              ((r = n.cloneRange()),
              Ae(n, l, l, l),
              (a = n.endContainer),
              (s = n.endOffset),
              a.nodeType === M && (d = a.childNodes[s]) && "IMG" === d.nodeName)
            )
              return t.preventDefault(), _(d), xe(n), void Me(e, n);
            e.setSelection(r),
              setTimeout(function () {
                Me(e);
              }, 0);
          }
        else t.preventDefault(), Ee(n, l), Me(e, n);
      },
      tab: function (e, t, n) {
        var o,
          i,
          r = e._root;
        if ((e._removeZWS(), n.collapsed && Re(n, r)))
          for (o = Le(n, r); (i = o.parentNode); ) {
            if ("UL" === i.nodeName || "OL" === i.nodeName) {
              t.preventDefault(), e.increaseListLevel(n);
              break;
            }
            o = i;
          }
      },
      "shift-tab": function (e, t, n) {
        var o,
          i = e._root;
        e._removeZWS(),
          n.collapsed &&
            Re(n, i) &&
            ((o = n.startContainer),
            (g(o, i, "UL") || g(o, i, "OL")) &&
              (t.preventDefault(), e.decreaseListLevel(n)));
      },
      space: function (e, t, n) {
        var o,
          i = e._root;
        if (
          (e._recordUndoState(n),
          yt(n.startContainer, i, e),
          e._getRangeAndRemoveBookmark(n),
          (o = n.endContainer),
          n.collapsed && n.endOffset === C(o))
        )
          do {
            if ("A" === o.nodeName) {
              n.setStartAfter(o);
              break;
            }
          } while (!o.nextSibling && (o = o.parentNode) && o !== i);
        n.collapsed ||
          (Ee(n, i),
          e._ensureBottomLine(),
          e.setSelection(n),
          e._updatePath(n, !0)),
          e.setSelection(n);
      },
      left: function (e) {
        e._removeZWS();
      },
      right: function (e) {
        e._removeZWS();
      },
    };
  $ &&
    Y &&
    ((He["meta-left"] = function (e, t) {
      t.preventDefault();
      var n = lt(e);
      n && n.modify && n.modify("move", "backward", "lineboundary");
    }),
    (He["meta-right"] = function (e, t) {
      t.preventDefault();
      var n = lt(e);
      n && n.modify && n.modify("move", "forward", "lineboundary");
    })),
    $ ||
      ((He.pageup = function (e) {
        e.moveCursorToStart();
      }),
      (He.pagedown = function (e) {
        e.moveCursorToEnd();
      })),
    (He[oe + "b"] = Fe("B")),
    (He[oe + "i"] = Fe("I")),
    (He[oe + "u"] = Fe("U")),
    (He[oe + "shift-7"] = Fe("S")),
    (He[oe + "shift-5"] = Fe("SUB", { tag: "SUP" })),
    (He[oe + "shift-6"] = Fe("SUP", { tag: "SUB" })),
    (He[oe + "shift-8"] = we("makeUnorderedList")),
    (He[oe + "shift-9"] = we("makeOrderedList")),
    (He[oe + "["] = we("decreaseQuoteLevel")),
    (He[oe + "]"] = we("increaseQuoteLevel")),
    (He[oe + "d"] = we("toggleCode")),
    (He[oe + "y"] = we("redo")),
    (He[oe + "z"] = we("undo")),
    (He[oe + "shift-z"] = we("redo"));
  var We = { 1: 10, 2: 13, 3: 16, 4: 18, 5: 24, 6: 32, 7: 48 },
    ze = {
      backgroundColor: {
        regexp: le,
        replace: function (e, t, n) {
          return T(e, "SPAN", {
            class: t.highlight,
            style: "background-color:" + n,
          });
        },
      },
      color: {
        regexp: le,
        replace: function (e, t, n) {
          return T(e, "SPAN", { class: t.colour, style: "color:" + n });
        },
      },
      fontWeight: {
        regexp: /^bold|^700/i,
        replace: function (e) {
          return T(e, "B");
        },
      },
      fontStyle: {
        regexp: /^italic/i,
        replace: function (e) {
          return T(e, "I");
        },
      },
      fontFamily: {
        regexp: le,
        replace: function (e, t, n) {
          return T(e, "SPAN", {
            class: t.fontFamily,
            style: "font-family:" + n,
          });
        },
      },
      fontSize: {
        regexp: le,
        replace: function (e, t, n) {
          return T(e, "SPAN", { class: t.fontSize, style: "font-size:" + n });
        },
      },
      textDecoration: {
        regexp: /^underline/i,
        replace: function (e) {
          return T(e, "U");
        },
      },
    },
    qe = function (e) {
      return function (t, n) {
        var o = T(t.ownerDocument, e);
        return n.replaceChild(o, t), o.appendChild(y(t)), o;
      };
    },
    Ke = function (e, t, n) {
      var o,
        i,
        r,
        a,
        s,
        d,
        l = e.style,
        c = e.ownerDocument;
      for (o in ze)
        (i = ze[o]),
          (r = l[o]) &&
            i.regexp.test(r) &&
            ((d = i.replace(c, n.classNames, r)),
            s || (s = d),
            a && a.appendChild(d),
            (a = d),
            (e.style[o] = ""));
      return (
        s &&
          (a.appendChild(y(e)),
          "SPAN" === e.nodeName ? t.replaceChild(s, e) : e.appendChild(s)),
        a || e
      );
    },
    Ge = {
      P: Ke,
      SPAN: Ke,
      STRONG: qe("B"),
      EM: qe("I"),
      INS: qe("U"),
      STRIKE: qe("S"),
      FONT: function (e, t, n) {
        var o,
          i,
          r,
          a,
          s,
          d = e.face,
          l = e.size,
          c = e.color,
          h = e.ownerDocument,
          u = n.classNames;
        return (
          d &&
            ((o = T(h, "SPAN", {
              class: u.fontFamily,
              style: "font-family:" + d,
            })),
            (s = o),
            (a = o)),
          l &&
            ((i = T(h, "SPAN", {
              class: u.fontSize,
              style: "font-size:" + We[l] + "px",
            })),
            s || (s = i),
            a && a.appendChild(i),
            (a = i)),
          c &&
            /^#?([\dA-F]{3}){1,2}$/i.test(c) &&
            ("#" !== c.charAt(0) && (c = "#" + c),
            (r = T(h, "SPAN", { class: u.colour, style: "color:" + c })),
            s || (s = r),
            a && a.appendChild(r),
            (a = r)),
          s || (s = a = T(h, "SPAN")),
          t.replaceChild(s, e),
          a.appendChild(y(e)),
          a
        );
      },
      TT: function (e, t, n) {
        var o = T(e.ownerDocument, "SPAN", {
          class: n.classNames.fontFamily,
          style: 'font-family:menlo,consolas,"courier new",monospace',
        });
        return t.replaceChild(o, e), o.appendChild(y(e)), o;
      },
    },
    Ze =
      /^(?:A(?:DDRESS|RTICLE|SIDE|UDIO)|BLOCKQUOTE|CAPTION|D(?:[DLT]|IV)|F(?:IGURE|IGCAPTION|OOTER)|H[1-6]|HEADER|HR|L(?:ABEL|EGEND|I)|O(?:L|UTPUT)|P(?:RE)?|SECTION|T(?:ABLE|BODY|D|FOOT|H|HEAD|R)|COL(?:GROUP)?|UL)$/,
    je = /^(?:HEAD|META|STYLE)/,
    Qe = new n(null, 4 | q),
    $e = function (e, t) {
      var n,
        o = t.allowedBlocks,
        i = !1,
        r = o.length;
      if (r) {
        for (n = 0; n < r; n += 1) o[n] = o[n].toUpperCase();
        i = new RegExp(o.join("|")).test(e);
      }
      return Ze.test(e) || i;
    },
    Ve = function e(t, n, o) {
      var i,
        r,
        s,
        d,
        l,
        c,
        h,
        u,
        f,
        p,
        g,
        m,
        v = t.childNodes;
      for (i = t; a(i); ) i = i.parentNode;
      for (Qe.root = i, r = 0, s = v.length; r < s; r += 1)
        if (
          ((d = v[r]), (l = d.nodeName), (c = d.nodeType), (h = Ge[l]), c === M)
        ) {
          if (((u = d.childNodes.length), h)) d = h(d, t, n);
          else {
            if (je.test(l)) {
              t.removeChild(d), (r -= 1), (s -= 1);
              continue;
            }
            if (!$e(l, n) && !a(d)) {
              (r -= 1), (s += u - 1), t.replaceChild(y(d), d);
              continue;
            }
          }
          u && e(d, n, o || "PRE" === l);
        } else {
          if (c === H) {
            if (
              ((g = d.data),
              (f = !le.test(g.charAt(0))),
              (p = !le.test(g.charAt(g.length - 1))),
              o || (!f && !p))
            )
              continue;
            if (f) {
              for (
                Qe.currentNode = d;
                (m = Qe.previousPONode()) &&
                !(
                  "IMG" === (l = m.nodeName) ||
                  ("#text" === l && le.test(m.data))
                );

              )
                if (!a(m)) {
                  m = null;
                  break;
                }
              g = g.replace(/^[ \t\r\n]+/g, m ? " " : "");
            }
            if (p) {
              for (
                Qe.currentNode = d;
                (m = Qe.nextNode()) &&
                !("IMG" === l || ("#text" === l && le.test(m.data)));

              )
                if (!a(m)) {
                  m = null;
                  break;
                }
              g = g.replace(/[ \t\r\n]+$/g, m ? " " : "");
            }
            if (g) {
              d.data = g;
              continue;
            }
          }
          t.removeChild(d), (r -= 1), (s -= 1);
        }
      return t;
    },
    Ye = function e(t) {
      for (var n, o = t.childNodes, r = o.length; r--; )
        (n = o[r]),
          n.nodeType !== M || i(n)
            ? n.nodeType !== H || n.data || t.removeChild(n)
            : (e(n), a(n) && !n.firstChild && t.removeChild(n));
    },
    Xe = function (e) {
      return e.nodeType === M
        ? "BR" === e.nodeName || "IMG" === e.nodeName
        : le.test(e.data);
    },
    Je = function (e, t) {
      for (var o, i = e.parentNode; a(i); ) i = i.parentNode;
      return (
        (o = new n(i, 4 | q, Xe)),
        (o.currentNode = e),
        !!o.nextNode() || (t && !o.previousNode())
      );
    },
    et = function (e, t, n) {
      var o,
        i,
        r,
        s = e.querySelectorAll("BR"),
        d = [],
        l = s.length;
      for (o = 0; o < l; o += 1) d[o] = Je(s[o], n);
      for (; l--; )
        (i = s[l]), (r = i.parentNode) && (d[l] ? a(r) || b(r, t) : _(i));
    },
    tt = function (e, t, n, o) {
      var i,
        r,
        a = t.ownerDocument.body,
        s = o.willCutCopy;
      et(t, n, !0),
        t.setAttribute(
          "style",
          "position:fixed;overflow:hidden;bottom:100%;right:100%;"
        ),
        a.appendChild(t),
        (i = t.innerHTML),
        (r = t.innerText || t.textContent),
        s && (i = s(i)),
        V && (r = r.replace(/\r?\n/g, "\r\n")),
        e.setData("text/html", i),
        e.setData("text/plain", r),
        a.removeChild(t);
    },
    nt = function (e) {
      var t,
        n,
        o,
        i,
        r,
        a,
        s,
        d = e.clipboardData,
        l = this.getSelection(),
        c = this._root,
        h = this;
      if (l.collapsed) return void e.preventDefault();
      if ((this.saveUndoState(l), ee || Q || !d))
        setTimeout(function () {
          try {
            h._ensureBottomLine();
          } catch (e) {
            h.didError(e);
          }
        }, 0);
      else {
        for (
          t = Le(l, c),
            n = Be(l, c),
            o = (t === n && t) || c,
            i = Ee(l, c),
            r = l.commonAncestorContainer,
            r.nodeType === H && (r = r.parentNode);
          r && r !== o;

        )
          (a = r.cloneNode(!1)), a.appendChild(i), (i = a), (r = r.parentNode);
        (s = this.createElement("div")),
          s.appendChild(i),
          tt(d, s, c, this._config),
          e.preventDefault();
      }
      this.setSelection(l);
    },
    ot = function (e) {
      var t,
        n,
        o,
        i,
        r,
        a,
        s,
        d = e.clipboardData,
        l = this.getSelection(),
        c = this._root;
      if (!ee && !Q && d) {
        for (
          t = Le(l, c),
            n = Be(l, c),
            o = (t === n && t) || c,
            l = l.cloneRange(),
            xe(l),
            Ae(l, o, o, c),
            i = l.cloneContents(),
            r = l.commonAncestorContainer,
            r.nodeType === H && (r = r.parentNode);
          r && r !== o;

        )
          (a = r.cloneNode(!1)), a.appendChild(i), (i = a), (r = r.parentNode);
        (s = this.createElement("div")),
          s.appendChild(i),
          tt(d, s, c, this._config),
          e.preventDefault();
      }
    },
    it = function (e) {
      var t,
        n,
        o,
        i,
        r,
        a = e.clipboardData,
        s = a && a.items,
        d = this.isShiftDown,
        l = !1,
        c = !1,
        h = null,
        u = this;
      if (ee && s) {
        for (t = s.length; t--; )
          !d && /^image\/.*/.test(s[t].type) && (c = !0);
        c || (s = null);
      }
      if (s) {
        for (e.preventDefault(), t = s.length; t--; ) {
          if (((n = s[t]), (o = n.type), !d && "text/html" === o))
            return void n.getAsString(function (e) {
              u.insertHTML(e, !0);
            });
          "text/plain" === o && (h = n), !d && /^image\/.*/.test(o) && (c = !0);
        }
        return void (c
          ? (this.fireEvent("dragover", {
              dataTransfer: a,
              preventDefault: function () {
                l = !0;
              },
            }),
            l && this.fireEvent("drop", { dataTransfer: a }))
          : h &&
            h.getAsString(function (e) {
              u.insertPlainText(e, !0);
            }));
      }
      if (
        ((i = a && a.types),
        !ee &&
          i &&
          (ce.call(i, "text/html") > -1 ||
            (!Y &&
              ce.call(i, "text/plain") > -1 &&
              ce.call(i, "text/rtf") < 0)))
      )
        return (
          e.preventDefault(),
          void (!d && (r = a.getData("text/html"))
            ? this.insertHTML(r, !0)
            : ((r = a.getData("text/plain")) ||
                (r = a.getData("text/uri-list"))) &&
              this.insertPlainText(r, !0))
        );
      this._awaitingPaste = !0;
      var f = this._doc.body,
        p = this.getSelection(),
        g = p.startContainer,
        m = p.startOffset,
        v = p.endContainer,
        N = p.endOffset,
        C = this.createElement("DIV", {
          contenteditable: "true",
          style:
            "position:fixed; overflow:hidden; top:0; right:100%; width:1px; height:1px;",
        });
      f.appendChild(C),
        p.selectNodeContents(C),
        this.setSelection(p),
        setTimeout(function () {
          try {
            u._awaitingPaste = !1;
            for (var e, t, n = "", o = C; (C = o); )
              (o = C.nextSibling),
                _(C),
                (e = C.firstChild),
                e && e === C.lastChild && "DIV" === e.nodeName && (C = e),
                (n += C.innerHTML);
            (t = u.createRange(g, m, v, N)),
              u.setSelection(t),
              n && u.insertHTML(n, !0);
          } catch (e) {
            u.didError(e);
          }
        }, 0);
    },
    rt = function (e) {
      for (var t = e.dataTransfer.types, n = t.length, o = !1, i = !1; n--; )
        switch (t[n]) {
          case "text/plain":
            o = !0;
            break;
          case "text/html":
            i = !0;
            break;
          default:
            return;
        }
      (i || o) && this.saveUndoState();
    },
    at = P.prototype,
    st = function (e, t, n) {
      var o = n._doc,
        i = e
          ? DOMPurify.sanitize(e, {
              ALLOW_UNKNOWN_PROTOCOLS: !0,
              WHOLE_DOCUMENT: !1,
              RETURN_DOM: !0,
              RETURN_DOM_FRAGMENT: !0,
            })
          : null;
      return i ? o.importNode(i, !0) : o.createDocumentFragment();
    };
  (at.setConfig = function (e) {
    return (
      (e = D(
        {
          blockTag: "DIV",
          blockAttributes: null,
          tagAttributes: {
            blockquote: null,
            ul: null,
            ol: null,
            li: null,
            a: null,
          },
          classNames: {
            colour: "colour",
            fontFamily: "font",
            fontSize: "size",
            highlight: "highlight",
          },
          leafNodeNames: pe,
          undo: { documentSizeThreshold: -1, undoLimit: -1 },
          isInsertedHTMLSanitized: !0,
          isSetHTMLSanitized: !0,
          sanitizeToDOMFragment:
            "undefined" != typeof DOMPurify && DOMPurify.isSupported
              ? st
              : null,
          willCutCopy: null,
          allowedBlocks: [],
        },
        e,
        !0
      )),
      (e.blockTag = e.blockTag.toUpperCase()),
      (this._config = e),
      this
    );
  }),
    (at.createElement = function (e, t, n) {
      return T(this._doc, e, t, n);
    }),
    (at.createDefaultBlock = function (e) {
      var t = this._config;
      return E(
        this.createElement(t.blockTag, t.blockAttributes, e),
        this._root
      );
    }),
    (at.didError = function (e) {
      console.log(e);
    }),
    (at.getDocument = function () {
      return this._doc;
    }),
    (at.getRoot = function () {
      return this._root;
    }),
    (at.modifyDocument = function (e) {
      var t = this._mutation;
      t && (t.takeRecords().length && this._docWasChanged(), t.disconnect()),
        (this._ignoreAllChanges = !0),
        e(),
        (this._ignoreAllChanges = !1),
        t &&
          (t.observe(this._root, {
            childList: !0,
            attributes: !0,
            characterData: !0,
            subtree: !0,
          }),
          (this._ignoreChange = !1));
    });
  var dt = { pathChange: 1, select: 1, input: 1, undoStateChange: 1 };
  (at.fireEvent = function (e, t) {
    var n,
      o,
      i,
      r = this._events[e];
    if (/^(?:focus|blur)/.test(e))
      if (((n = this._root === this._doc.activeElement), "focus" === e)) {
        if (!n || this._isFocused) return this;
        this._isFocused = !0;
      } else {
        if (n || !this._isFocused) return this;
        this._isFocused = !1;
      }
    if (r)
      for (
        t || (t = {}),
          t.type !== e && (t.type = e),
          r = r.slice(),
          o = r.length;
        o--;

      ) {
        i = r[o];
        try {
          i.handleEvent ? i.handleEvent(t) : i.call(this, t);
        } catch (t) {
          (t.details = "Squire: fireEvent error. Event type: " + e),
            this.didError(t);
        }
      }
    return this;
  }),
    (at.destroy = function () {
      var e,
        t = this._events;
      for (e in t) this.removeEventListener(e);
      this._mutation && this._mutation.disconnect(),
        delete this._root.__squire__,
        (this._undoIndex = -1),
        (this._undoStack = []),
        (this._undoStackLength = 0);
    }),
    (at.handleEvent = function (e) {
      this.fireEvent(e.type, e);
    }),
    (at.addEventListener = function (e, t) {
      var n = this._events[e],
        o = this._root;
      return t
        ? (n ||
            ((n = this._events[e] = []),
            dt[e] ||
              ("selectionchange" === e && (o = this._doc),
              o.addEventListener(e, this, !0))),
          n.push(t),
          this)
        : (this.didError({
            name: "Squire: addEventListener with null or undefined fn",
            message: "Event type: " + e,
          }),
          this);
    }),
    (at.removeEventListener = function (e, t) {
      var n,
        o = this._events[e],
        i = this._root;
      if (o) {
        if (t) for (n = o.length; n--; ) o[n] === t && o.splice(n, 1);
        else o.length = 0;
        o.length ||
          (delete this._events[e],
          dt[e] ||
            ("selectionchange" === e && (i = this._doc),
            i.removeEventListener(e, this, !0)));
      }
      return this;
    }),
    (at.createRange = function (e, t, n, o) {
      if (e instanceof this._win.Range) return e.cloneRange();
      var i = this._doc.createRange();
      return i.setStart(e, t), n ? i.setEnd(n, o) : i.setEnd(e, t), i;
    }),
    (at.getCursorPosition = function (e) {
      if ((!e && !(e = this.getSelection())) || !e.getBoundingClientRect)
        return null;
      var t,
        n,
        o = e.getBoundingClientRect();
      return (
        o &&
          !o.top &&
          ((this._ignoreChange = !0),
          (t = this._doc.createElement("SPAN")),
          (t.textContent = K),
          ye(e, t),
          (o = t.getBoundingClientRect()),
          (n = t.parentNode),
          n.removeChild(t),
          A(n, e)),
        o
      );
    }),
    (at._moveCursorTo = function (e) {
      var t = this._root,
        n = this.createRange(t, e ? 0 : t.childNodes.length);
      return xe(n), this.setSelection(n), this;
    }),
    (at.moveCursorToStart = function () {
      return this._moveCursorTo(!0);
    }),
    (at.moveCursorToEnd = function () {
      return this._moveCursorTo(!1);
    });
  var lt = function (e) {
    return e._win.getSelection() || null;
  };
  (at.setSelection = function (e) {
    if (e)
      if (((this._lastSelection = e), this._isFocused))
        if (j && !this._restoreSelection)
          U.call(this), this.blur(), this.focus();
        else {
          Q && this._win.focus();
          var t = lt(this);
          t && (t.removeAllRanges(), t.addRange(e));
        }
      else U.call(this);
    return this;
  }),
    (at.getSelection = function () {
      var e,
        t,
        n,
        o,
        r = lt(this),
        a = this._root;
      return (
        this._isFocused &&
          r &&
          r.rangeCount &&
          ((e = r.getRangeAt(0).cloneRange()),
          (t = e.startContainer),
          (n = e.endContainer),
          t && i(t) && e.setStartBefore(t),
          n && i(n) && e.setEndBefore(n)),
        e && v(a, e.commonAncestorContainer)
          ? (this._lastSelection = e)
          : ((e = this._lastSelection),
            (o = e.commonAncestorContainer),
            v(o.ownerDocument, o) || (e = null)),
        e || (e = this.createRange(a.firstChild, 0)),
        e
      );
    }),
    (at.getSelectedText = function () {
      var e = this.getSelection();
      if (!e || e.collapsed) return "";
      var t,
        o = new n(e.commonAncestorContainer, 4 | q, function (t) {
          return ke(e, t, !0);
        }),
        i = e.startContainer,
        r = e.endContainer,
        s = (o.currentNode = i),
        d = "",
        l = !1;
      for (o.filter(s) || (s = o.nextNode()); s; )
        s.nodeType === H
          ? (t = s.data) &&
            /\S/.test(t) &&
            (s === r && (t = t.slice(0, e.endOffset)),
            s === i && (t = t.slice(e.startOffset)),
            (d += t),
            (l = !0))
          : ("BR" === s.nodeName || (l && !a(s))) && ((d += "\n"), (l = !1)),
          (s = o.nextNode());
      return d;
    }),
    (at.getPath = function () {
      return this._path;
    });
  var ct = function (e, t) {
    for (var o, i, r, s = new n(e, 4); (i = s.nextNode()); )
      for (; (r = i.data.indexOf(K)) > -1 && (!t || i.parentNode !== t); ) {
        if (1 === i.length) {
          do {
            (o = i.parentNode), o.removeChild(i), (i = o), (s.currentNode = o);
          } while (a(i) && !C(i));
          break;
        }
        i.deleteData(r, 1);
      }
  };
  (at._didAddZWS = function () {
    this._hasZWS = !0;
  }),
    (at._removeZWS = function () {
      this._hasZWS && (ct(this._root), (this._hasZWS = !1));
    }),
    (at._updatePath = function (e, t) {
      if (e) {
        var n,
          o = e.startContainer,
          i = e.endContainer;
        (t || o !== this._lastAnchorNode || i !== this._lastFocusNode) &&
          ((this._lastAnchorNode = o),
          (this._lastFocusNode = i),
          (n =
            o && i
              ? o === i
                ? N(i, this._root, this._config)
                : "(selection)"
              : ""),
          this._path !== n &&
            ((this._path = n), this.fireEvent("pathChange", { path: n }))),
          this.fireEvent(e.collapsed ? "cursor" : "select", { range: e });
      }
    }),
    (at._updatePathOnEvent = function (e) {
      var t = this;
      t._isFocused &&
        !t._willUpdatePath &&
        ((t._willUpdatePath = !0),
        setTimeout(function () {
          (t._willUpdatePath = !1), t._updatePath(t.getSelection());
        }, 0));
    }),
    (at.focus = function () {
      if (ne) {
        try {
          this._root.setActive();
        } catch (e) {}
        this.fireEvent("focus");
      } else this._root.focus();
      return this;
    }),
    (at.blur = function () {
      return this._root.blur(), ne && this.fireEvent("blur"), this;
    });
  var ht = "squire-selection-end";
  (at._saveRangeToBookmark = function (e) {
    var t,
      n = this.createElement("INPUT", {
        id: "squire-selection-start",
        type: "hidden",
      }),
      o = this.createElement("INPUT", { id: ht, type: "hidden" });
    ye(e, n),
      e.collapse(!1),
      ye(e, o),
      2 & n.compareDocumentPosition(o) &&
        ((n.id = ht),
        (o.id = "squire-selection-start"),
        (t = n),
        (n = o),
        (o = t)),
      e.setStartAfter(n),
      e.setEndBefore(o);
  }),
    (at._getRangeAndRemoveBookmark = function (e) {
      var t = this._root,
        n = t.querySelector("#squire-selection-start"),
        o = t.querySelector("#" + ht);
      if (n && o) {
        var i = n.parentNode,
          r = o.parentNode,
          a = ce.call(i.childNodes, n),
          s = ce.call(r.childNodes, o);
        i === r && (s -= 1),
          _(n),
          _(o),
          e || (e = this._doc.createRange()),
          e.setStart(i, a),
          e.setEnd(r, s),
          A(i, e),
          i !== r && A(r, e),
          e.collapsed &&
            ((i = e.startContainer),
            i.nodeType === H &&
              ((r = i.childNodes[e.startOffset]),
              (r && r.nodeType === H) || (r = i.childNodes[e.startOffset - 1]),
              r && r.nodeType === H && (e.setStart(r, 0), e.collapse(!0))));
      }
      return e || null;
    }),
    (at._keyUpDetectChange = function (e) {
      var t = e.keyCode;
      e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        !(t < 16 || t > 20) ||
        !(t < 33 || t > 45) ||
        this._docWasChanged();
    }),
    (at._docWasChanged = function () {
      if ((de && (Ce = new WeakMap()), !this._ignoreAllChanges)) {
        if (se && this._ignoreChange) return void (this._ignoreChange = !1);
        this._isInUndoState &&
          ((this._isInUndoState = !1),
          this.fireEvent("undoStateChange", { canUndo: !0, canRedo: !1 })),
          this.fireEvent("input");
      }
    }),
    (at._recordUndoState = function (e, t) {
      if (!this._isInUndoState || t) {
        var n,
          o = this._undoIndex,
          i = this._undoStack,
          r = this._config.undo,
          a = r.documentSizeThreshold,
          s = r.undoLimit;
        t || (o += 1),
          o < this._undoStackLength && (i.length = this._undoStackLength = o),
          e && this._saveRangeToBookmark(e),
          (n = this._getHTML()),
          a > -1 &&
            2 * n.length > a &&
            s > -1 &&
            o > s &&
            (i.splice(0, o - s), (o = s), (this._undoStackLength = s)),
          (i[o] = n),
          (this._undoIndex = o),
          (this._undoStackLength += 1),
          (this._isInUndoState = !0);
      }
    }),
    (at.saveUndoState = function (e) {
      return (
        e === t && (e = this.getSelection()),
        this._recordUndoState(e, this._isInUndoState),
        this._getRangeAndRemoveBookmark(e),
        this
      );
    }),
    (at.undo = function () {
      if (0 !== this._undoIndex || !this._isInUndoState) {
        this._recordUndoState(this.getSelection(), !1),
          (this._undoIndex -= 1),
          this._setHTML(this._undoStack[this._undoIndex]);
        var e = this._getRangeAndRemoveBookmark();
        e && this.setSelection(e),
          (this._isInUndoState = !0),
          this.fireEvent("undoStateChange", {
            canUndo: 0 !== this._undoIndex,
            canRedo: !0,
          }),
          this.fireEvent("input");
      }
      return this;
    }),
    (at.redo = function () {
      var e = this._undoIndex,
        t = this._undoStackLength;
      if (e + 1 < t && this._isInUndoState) {
        (this._undoIndex += 1), this._setHTML(this._undoStack[this._undoIndex]);
        var n = this._getRangeAndRemoveBookmark();
        n && this.setSelection(n),
          this.fireEvent("undoStateChange", {
            canUndo: !0,
            canRedo: e + 2 < t,
          }),
          this.fireEvent("input");
      }
      return this;
    }),
    (at.hasFormat = function (e, t, o) {
      if (
        ((e = e.toUpperCase()), t || (t = {}), !o && !(o = this.getSelection()))
      )
        return !1;
      !o.collapsed &&
        o.startContainer.nodeType === H &&
        o.startOffset === o.startContainer.length &&
        o.startContainer.nextSibling &&
        o.setStartBefore(o.startContainer.nextSibling),
        !o.collapsed &&
          o.endContainer.nodeType === H &&
          0 === o.endOffset &&
          o.endContainer.previousSibling &&
          o.setEndAfter(o.endContainer.previousSibling);
      var i,
        r,
        a = this._root,
        s = o.commonAncestorContainer;
      if (g(s, a, e, t)) return !0;
      if (s.nodeType === H) return !1;
      i = new n(s, 4, function (e) {
        return ke(o, e, !0);
      });
      for (var d = !1; (r = i.nextNode()); ) {
        if (!g(r, a, e, t)) return !1;
        d = !0;
      }
      return d;
    }),
    (at.getFontInfo = function (e) {
      var n,
        o,
        i,
        r = { color: t, backgroundColor: t, family: t, size: t },
        a = 0;
      if (!e && !(e = this.getSelection())) return r;
      if (((n = e.commonAncestorContainer), e.collapsed || n.nodeType === H))
        for (n.nodeType === H && (n = n.parentNode); a < 4 && n; )
          (o = n.style) &&
            (!r.color && (i = o.color) && ((r.color = i), (a += 1)),
            !r.backgroundColor &&
              (i = o.backgroundColor) &&
              ((r.backgroundColor = i), (a += 1)),
            !r.family && (i = o.fontFamily) && ((r.family = i), (a += 1)),
            !r.size && (i = o.fontSize) && ((r.size = i), (a += 1))),
            (n = n.parentNode);
      return r;
    }),
    (at._addFormat = function (e, t, o) {
      var i,
        r,
        s,
        d,
        l,
        c,
        h,
        u,
        f = this._root;
      if (o.collapsed) {
        for (
          i = E(this.createElement(e, t), f),
            ye(o, i),
            o.setStart(i.firstChild, i.firstChild.length),
            o.collapse(!0),
            u = i;
          a(u);

        )
          u = u.parentNode;
        ct(u, i);
      } else {
        if (
          ((r = new n(o.commonAncestorContainer, 4 | q, function (e) {
            return (
              (e.nodeType === H ||
                "BR" === e.nodeName ||
                "IMG" === e.nodeName) &&
              ke(o, e, !0)
            );
          })),
          (s = o.startContainer),
          (l = o.startOffset),
          (d = o.endContainer),
          (c = o.endOffset),
          (r.currentNode = s),
          r.filter(s) || ((s = r.nextNode()), (l = 0)),
          !s)
        )
          return o;
        do {
          (h = r.currentNode),
            !g(h, f, e, t) &&
              (h === d && h.length > c && h.splitText(c),
              h === s &&
                l &&
                ((h = h.splitText(l)),
                d === s && ((d = h), (c -= l)),
                (s = h),
                (l = 0)),
              (i = this.createElement(e, t)),
              S(h, i),
              i.appendChild(h));
        } while (r.nextNode());
        d.nodeType !== H &&
          (h.nodeType === H
            ? ((d = h), (c = h.length))
            : ((d = h.parentNode), (c = 1))),
          (o = this.createRange(s, l, d, c));
      }
      return o;
    }),
    (at._removeFormat = function (e, t, n, o) {
      this._saveRangeToBookmark(n);
      var i,
        r = this._doc;
      n.collapsed &&
        (re
          ? ((i = r.createTextNode(K)), this._didAddZWS())
          : (i = r.createTextNode("")),
        ye(n, i));
      for (var s = n.commonAncestorContainer; a(s); ) s = s.parentNode;
      var d = n.startContainer,
        l = n.startOffset,
        c = n.endContainer,
        h = n.endOffset,
        u = [],
        f = function (e, t) {
          if (!ke(n, e, !1)) {
            var o,
              i,
              r = e.nodeType === H;
            if (!ke(n, e, !0))
              return void (
                "INPUT" === e.nodeName ||
                (r && !e.data) ||
                u.push([t, e])
              );
            if (r)
              e === c && h !== e.length && u.push([t, e.splitText(h)]),
                e === d && l && (e.splitText(l), u.push([t, e]));
            else for (o = e.firstChild; o; o = i) (i = o.nextSibling), f(o, t);
          }
        },
        g = Array.prototype.filter.call(
          s.getElementsByTagName(e),
          function (o) {
            return ke(n, o, !0) && p(o, e, t);
          }
        );
      return (
        o ||
          g.forEach(function (e) {
            f(e, e);
          }),
        u.forEach(function (e) {
          var t = e[0].cloneNode(!1),
            n = e[1];
          S(n, t), t.appendChild(n);
        }),
        g.forEach(function (e) {
          S(e, y(e));
        }),
        this._getRangeAndRemoveBookmark(n),
        i && n.collapse(!1),
        A(s, n),
        n
      );
    }),
    (at.changeFormat = function (e, t, n, o) {
      return n || (n = this.getSelection())
        ? (this.saveUndoState(n),
          t &&
            (n = this._removeFormat(
              t.tag.toUpperCase(),
              t.attributes || {},
              n,
              o
            )),
          e &&
            (n = this._addFormat(e.tag.toUpperCase(), e.attributes || {}, n)),
          this.setSelection(n),
          this._updatePath(n, !0),
          se || this._docWasChanged(),
          this)
        : this;
    });
  var ut = { DT: "DD", DD: "DT", LI: "LI", PRE: "PRE" },
    ft = function (e, t, n, o) {
      var i = ut[t.nodeName],
        r = null,
        a = k(n, o, t.parentNode, e._root),
        s = e._config;
      return (
        i || ((i = s.blockTag), (r = s.blockAttributes)),
        p(a, i, r) ||
          ((t = T(a.ownerDocument, i, r)),
          a.dir && (t.dir = a.dir),
          S(a, t),
          t.appendChild(y(a)),
          (a = t)),
        a
      );
    };
  (at.forEachBlock = function (e, t, n) {
    if (!n && !(n = this.getSelection())) return this;
    t && this.saveUndoState(n);
    var o = this._root,
      i = Le(n, o),
      r = Be(n, o);
    if (i && r)
      do {
        if (e(i) || i === r) break;
      } while ((i = h(i, o)));
    return (
      t &&
        (this.setSelection(n),
        this._updatePath(n, !0),
        se || this._docWasChanged()),
      this
    );
  }),
    (at.modifyBlocks = function (e, t) {
      if (!t && !(t = this.getSelection())) return this;
      this._recordUndoState(t, this._isInUndoState);
      var n,
        o = this._root;
      return (
        Pe(t, o),
        Ae(t, o, o, o),
        (n = Te(t, o, o)),
        ye(t, e.call(this, n)),
        t.endOffset < t.endContainer.childNodes.length &&
          O(t.endContainer.childNodes[t.endOffset], o),
        O(t.startContainer.childNodes[t.startOffset], o),
        this._getRangeAndRemoveBookmark(t),
        this.setSelection(t),
        this._updatePath(t, !0),
        se || this._docWasChanged(),
        this
      );
    });
  var pt = function (e) {
      return this.createElement(
        "BLOCKQUOTE",
        this._config.tagAttributes.blockquote,
        [e]
      );
    },
    gt = function (e) {
      var t = this._root,
        n = e.querySelectorAll("blockquote");
      return (
        Array.prototype.filter
          .call(n, function (e) {
            return !g(e.parentNode, t, "BLOCKQUOTE");
          })
          .forEach(function (e) {
            S(e, y(e));
          }),
        e
      );
    },
    mt = function () {
      return this.createDefaultBlock([
        this.createElement("INPUT", {
          id: "squire-selection-start",
          type: "hidden",
        }),
        this.createElement("INPUT", { id: ht, type: "hidden" }),
      ]);
    },
    vt = function (e, t, n) {
      for (
        var o,
          i,
          r,
          a,
          s = l(t, e._root),
          d = e._config.tagAttributes,
          c = d[n.toLowerCase()],
          h = d.li;
        (o = s.nextNode());

      )
        "LI" === o.parentNode.nodeName &&
          ((o = o.parentNode), (s.currentNode = o.lastChild)),
          "LI" !== o.nodeName
            ? ((a = e.createElement("LI", h)),
              o.dir && (a.dir = o.dir),
              (r = o.previousSibling) && r.nodeName === n
                ? (r.appendChild(a), _(o))
                : S(o, e.createElement(n, c, [a])),
              a.appendChild(y(o)),
              (s.currentNode = a))
            : ((o = o.parentNode),
              (i = o.nodeName) !== n &&
                /^[OU]L$/.test(i) &&
                S(o, e.createElement(n, c, [y(o)])));
    },
    Nt = function (e) {
      return vt(this, e, "UL"), e;
    },
    Ct = function (e) {
      return vt(this, e, "OL"), e;
    },
    _t = function (e) {
      var t,
        n,
        o,
        i,
        r,
        a = e.querySelectorAll("UL, OL"),
        d = e.querySelectorAll("LI"),
        l = this._root;
      for (t = 0, n = a.length; t < n; t += 1)
        (o = a[t]), (i = y(o)), b(i, l), S(o, i);
      for (t = 0, n = d.length; t < n; t += 1)
        (r = d[t]),
          s(r) ? S(r, this.createDefaultBlock([y(r)])) : (b(r, l), S(r, y(r)));
      return e;
    },
    St = function (e, t) {
      for (
        var n = e.commonAncestorContainer,
          o = e.startContainer,
          i = e.endContainer;
        n && n !== t && !/^[OU]L$/.test(n.nodeName);

      )
        n = n.parentNode;
      if (!n || n === t) return null;
      for (
        o === n && (o = o.childNodes[e.startOffset]),
          i === n && (i = i.childNodes[e.endOffset]);
        o && o.parentNode !== n;

      )
        o = o.parentNode;
      for (; i && i.parentNode !== n; ) i = i.parentNode;
      return [n, o, i];
    };
  (at.increaseListLevel = function (e) {
    if (!e && !(e = this.getSelection())) return this.focus();
    var t = this._root,
      n = St(e, t);
    if (!n) return this.focus();
    var o = n[0],
      i = n[1],
      r = n[2];
    if (!i || i === o.firstChild) return this.focus();
    this._recordUndoState(e, this._isInUndoState);
    var a,
      s,
      d = o.nodeName,
      l = i.previousSibling;
    l.nodeName !== d &&
      ((a = this._config.tagAttributes[d.toLowerCase()]),
      (l = this.createElement(d, a)),
      o.insertBefore(l, i));
    do {
      (s = i === r ? null : i.nextSibling), l.appendChild(i);
    } while ((i = s));
    return (
      (s = l.nextSibling),
      s && O(s, t),
      this._getRangeAndRemoveBookmark(e),
      this.setSelection(e),
      this._updatePath(e, !0),
      se || this._docWasChanged(),
      this.focus()
    );
  }),
    (at.decreaseListLevel = function (e) {
      if (!e && !(e = this.getSelection())) return this.focus();
      var t = this._root,
        n = St(e, t);
      if (!n) return this.focus();
      var o = n[0],
        i = n[1],
        r = n[2];
      i || (i = o.firstChild),
        r || (r = o.lastChild),
        this._recordUndoState(e, this._isInUndoState);
      var a,
        s = o.parentNode,
        d = r.nextSibling ? k(o, r.nextSibling, s, t) : o.nextSibling;
      if (s !== t && "LI" === s.nodeName) {
        for (s = s.parentNode; d; )
          (a = d.nextSibling), r.appendChild(d), (d = a);
        d = o.parentNode.nextSibling;
      }
      var l = !/^[OU]L$/.test(s.nodeName);
      do {
        (a = i === r ? null : i.nextSibling),
          o.removeChild(i),
          l && "LI" === i.nodeName && (i = this.createDefaultBlock([y(i)])),
          s.insertBefore(i, d);
      } while ((i = a));
      return (
        o.firstChild || _(o),
        d && O(d, t),
        this._getRangeAndRemoveBookmark(e),
        this.setSelection(e),
        this._updatePath(e, !0),
        se || this._docWasChanged(),
        this.focus()
      );
    }),
    (at._ensureBottomLine = function () {
      var e = this._root,
        t = e.lastElementChild;
      (t && t.nodeName === this._config.blockTag && s(t)) ||
        e.appendChild(this.createDefaultBlock());
    }),
    (at.setKeyHandler = function (e, t) {
      return (this._keyHandlers[e] = t), this;
    }),
    (at._getHTML = function () {
      return this._root.innerHTML;
    }),
    (at._setHTML = function (e) {
      var t = this._root,
        n = t;
      n.innerHTML = e;
      do {
        E(n, t);
      } while ((n = h(n, t)));
      this._ignoreChange = !0;
    }),
    (at.getHTML = function (e) {
      var t,
        n,
        o,
        i,
        r,
        a,
        s = [];
      if ((e && (a = this.getSelection()) && this._saveRangeToBookmark(a), ie))
        for (t = this._root, n = t; (n = h(n, t)); )
          n.textContent ||
            n.querySelector("BR") ||
            ((o = this.createElement("BR")), n.appendChild(o), s.push(o));
      if (((i = this._getHTML().replace(/\u200B/g, "")), ie))
        for (r = s.length; r--; ) _(s[r]);
      return a && this._getRangeAndRemoveBookmark(a), i;
    }),
    (at.setHTML = function (e) {
      var t,
        n,
        o,
        i = this._config,
        r = i.isSetHTMLSanitized ? i.sanitizeToDOMFragment : null,
        a = this._root;
      "function" == typeof r
        ? (n = r(e, !1, this))
        : ((t = this.createElement("DIV")),
          (t.innerHTML = e),
          (n = this._doc.createDocumentFragment()),
          n.appendChild(y(t))),
        Ve(n, i),
        et(n, a, !1),
        b(n, a);
      for (var s = n; (s = h(s, a)); ) E(s, a);
      for (this._ignoreChange = !0; (o = a.lastChild); ) a.removeChild(o);
      a.appendChild(n),
        E(a, a),
        (this._undoIndex = -1),
        (this._undoStack.length = 0),
        (this._undoStackLength = 0),
        (this._isInUndoState = !1);
      var d =
        this._getRangeAndRemoveBookmark() || this.createRange(a.firstChild, 0);
      return (
        this.saveUndoState(d),
        (this._lastSelection = d),
        U.call(this),
        this._updatePath(d, !0),
        this
      );
    }),
    (at.insertElement = function (e, t) {
      if ((t || (t = this.getSelection()), t.collapse(!0), a(e)))
        ye(t, e), t.setStartAfter(e);
      else {
        for (
          var n, o, i = this._root, r = Le(t, i) || i;
          r !== i && !r.nextSibling;

        )
          r = r.parentNode;
        r !== i && ((n = r.parentNode), (o = k(n, r.nextSibling, i, i))),
          o
            ? i.insertBefore(e, o)
            : (i.appendChild(e),
              (o = this.createDefaultBlock()),
              i.appendChild(o)),
          t.setStart(o, 0),
          t.setEnd(o, 0),
          xe(t);
      }
      return (
        this.focus(),
        this.setSelection(t),
        this._updatePath(t),
        se || this._docWasChanged(),
        this
      );
    }),
    (at.insertImage = function (e, t) {
      var n = this.createElement("IMG", D({ src: e }, t, !0));
      return this.insertElement(n), n;
    }),
    (at.linkRegExp =
      /\b((?:(?:ht|f)tps?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,}\/)(?:[^\s()<>]+|\([^\s()<>]+\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))|([\w\-.%+]+@(?:[\w\-]+\.)+[A-Z]{2,}\b)(?:\?[^&?\s]+=[^&?\s]+(?:&[^&?\s]+=[^&?\s]+)*)?/i);
  var yt = function (e, t, o) {
    var i,
      r,
      a,
      s,
      d,
      l,
      c,
      h = e.ownerDocument,
      u = new n(e, 4, function (e) {
        return !g(e, t, "A");
      }),
      f = o.linkRegExp,
      p = o._config.tagAttributes.a;
    if (f)
      for (; (i = u.nextNode()); )
        for (r = i.data, a = i.parentNode; (s = f.exec(r)); )
          (d = s.index),
            (l = d + s[0].length),
            d && ((c = h.createTextNode(r.slice(0, d))), a.insertBefore(c, i)),
            (c = o.createElement(
              "A",
              D(
                {
                  href: s[1]
                    ? /^(?:ht|f)tps?:/i.test(s[1])
                      ? s[1]
                      : "http://" + s[1]
                    : "mailto:" + s[0],
                },
                p,
                !1
              )
            )),
            (c.textContent = r.slice(d, l)),
            a.insertBefore(c, i),
            (i.data = r = r.slice(l));
  };
  at.insertHTML = function (e, t) {
    var n,
      o,
      i,
      r,
      a,
      s,
      d,
      l = this._config,
      c = l.isInsertedHTMLSanitized ? l.sanitizeToDOMFragment : null,
      u = this.getSelection(),
      f = this._doc;
    "function" == typeof c
      ? (r = c(e, t, this))
      : (t &&
          ((n = e.indexOf("\x3c!--StartFragment--\x3e")),
          (o = e.lastIndexOf("\x3c!--EndFragment--\x3e")),
          n > -1 && o > -1 && (e = e.slice(n + 20, o))),
        /<\/td>((?!<\/tr>)[\s\S])*$/i.test(e) && (e = "<TR>" + e + "</TR>"),
        /<\/tr>((?!<\/table>)[\s\S])*$/i.test(e) &&
          (e = "<TABLE>" + e + "</TABLE>"),
        (i = this.createElement("DIV")),
        (i.innerHTML = e),
        (r = f.createDocumentFragment()),
        r.appendChild(y(i))),
      this.saveUndoState(u);
    try {
      for (
        a = this._root,
          s = r,
          d = {
            fragment: r,
            preventDefault: function () {
              this.defaultPrevented = !0;
            },
            defaultPrevented: !1,
          },
          yt(r, r, this),
          Ve(r, l),
          et(r, a, !1),
          Ye(r),
          r.normalize();
        (s = h(s, r));

      )
        E(s, a);
      t && this.fireEvent("willPaste", d),
        d.defaultPrevented ||
          (be(u, d.fragment, a),
          se || this._docWasChanged(),
          u.collapse(!1),
          this._ensureBottomLine()),
        this.setSelection(u),
        this._updatePath(u, !0),
        t && this.focus();
    } catch (e) {
      this.didError(e);
    }
    return this;
  };
  var Tt = function (e) {
    return e
      .split("&")
      .join("&amp;")
      .split("<")
      .join("&lt;")
      .split(">")
      .join("&gt;")
      .split('"')
      .join("&quot;");
  };
  at.insertPlainText = function (e, t) {
    var n = this.getSelection();
    if (n.collapsed && g(n.startContainer, this._root, "PRE")) {
      var o,
        i,
        r = n.startContainer,
        a = n.startOffset;
      return (
        (r && r.nodeType === H) ||
          ((o = this._doc.createTextNode("")),
          r.insertBefore(o, r.childNodes[a]),
          (r = o),
          (a = 0)),
        (i = {
          text: e,
          preventDefault: function () {
            this.defaultPrevented = !0;
          },
          defaultPrevented: !1,
        }),
        t && this.fireEvent("willPaste", i),
        i.defaultPrevented ||
          ((e = i.text),
          r.insertData(a, e),
          n.setStart(r, a + e.length),
          n.collapse(!0)),
        this.setSelection(n),
        this
      );
    }
    var s,
      d,
      l,
      c,
      h = e.split("\n"),
      u = this._config,
      f = u.blockTag,
      p = u.blockAttributes,
      m = "</" + f + ">",
      v = "<" + f;
    for (s in p) v += " " + s + '="' + Tt(p[s]) + '"';
    for (v += ">", d = 0, l = h.length; d < l; d += 1)
      (c = h[d]),
        (c = Tt(c).replace(/ (?= )/g, "&nbsp;")),
        (h[d] = v + (c || "<BR>") + m);
    return this.insertHTML(h.join(""), t);
  };
  var Et = function (e, t, n) {
    return function () {
      return this[e](t, n), this.focus();
    };
  };
  (at.addStyles = function (e) {
    if (e) {
      var t = this._doc.documentElement.firstChild,
        n = this.createElement("STYLE", { type: "text/css" });
      n.appendChild(this._doc.createTextNode(e)), t.appendChild(n);
    }
    return this;
  }),
    (at.bold = Et("changeFormat", { tag: "B" })),
    (at.italic = Et("changeFormat", { tag: "I" })),
    (at.underline = Et("changeFormat", { tag: "U" })),
    (at.strikethrough = Et("changeFormat", { tag: "S" })),
    (at.subscript = Et("changeFormat", { tag: "SUB" }, { tag: "SUP" })),
    (at.superscript = Et("changeFormat", { tag: "SUP" }, { tag: "SUB" })),
    (at.removeBold = Et("changeFormat", null, { tag: "B" })),
    (at.removeItalic = Et("changeFormat", null, { tag: "I" })),
    (at.removeUnderline = Et("changeFormat", null, { tag: "U" })),
    (at.removeStrikethrough = Et("changeFormat", null, { tag: "S" })),
    (at.removeSubscript = Et("changeFormat", null, { tag: "SUB" })),
    (at.removeSuperscript = Et("changeFormat", null, { tag: "SUP" })),
    (at.makeLink = function (e, t) {
      var n = this.getSelection();
      if (n.collapsed) {
        var o = e.indexOf(":") + 1;
        if (o) for (; "/" === e[o]; ) o += 1;
        ye(n, this._doc.createTextNode(e.slice(o)));
      }
      return (
        (t = D(D({ href: e }, t, !0), this._config.tagAttributes.a, !1)),
        this.changeFormat({ tag: "A", attributes: t }, { tag: "A" }, n),
        this.focus()
      );
    }),
    (at.removeLink = function () {
      return (
        this.changeFormat(null, { tag: "A" }, this.getSelection(), !0),
        this.focus()
      );
    }),
    (at.setFontFace = function (e) {
      var t = this._config.classNames.fontFamily;
      return (
        this.changeFormat(
          e
            ? {
                tag: "SPAN",
                attributes: {
                  class: t,
                  style: "font-family: " + e + ", sans-serif;",
                },
              }
            : null,
          { tag: "SPAN", attributes: { class: t } }
        ),
        this.focus()
      );
    }),
    (at.setFontSize = function (e) {
      var t = this._config.classNames.fontSize;
      return (
        this.changeFormat(
          e
            ? {
                tag: "SPAN",
                attributes: {
                  class: t,
                  style: "font-size: " + ("number" == typeof e ? e + "px" : e),
                },
              }
            : null,
          { tag: "SPAN", attributes: { class: t } }
        ),
        this.focus()
      );
    }),
    (at.setTextColour = function (e) {
      var t = this._config.classNames.colour;
      return (
        this.changeFormat(
          e
            ? { tag: "SPAN", attributes: { class: t, style: "color:" + e } }
            : null,
          { tag: "SPAN", attributes: { class: t } }
        ),
        this.focus()
      );
    }),
    (at.setHighlightColour = function (e) {
      var t = this._config.classNames.highlight;
      return (
        this.changeFormat(
          e
            ? {
                tag: "SPAN",
                attributes: { class: t, style: "background-color:" + e },
              }
            : e,
          { tag: "SPAN", attributes: { class: t } }
        ),
        this.focus()
      );
    }),
    (at.setTextAlignment = function (e) {
      return (
        this.forEachBlock(function (t) {
          var n = t.className
            .split(/\s+/)
            .filter(function (e) {
              return !!e && !/^align/.test(e);
            })
            .join(" ");
          e
            ? ((t.className = n + " align-" + e), (t.style.textAlign = e))
            : ((t.className = n), (t.style.textAlign = ""));
        }, !0),
        this.focus()
      );
    }),
    (at.setTextDirection = function (e) {
      return (
        this.forEachBlock(function (t) {
          e ? (t.dir = e) : t.removeAttribute("dir");
        }, !0),
        this.focus()
      );
    });
  var bt = function (e) {
      for (
        var t,
          o = this._root,
          i = this._doc,
          r = i.createDocumentFragment(),
          a = l(e, o);
        (t = a.nextNode());

      ) {
        var s,
          d,
          c = t.querySelectorAll("BR"),
          h = [],
          u = c.length;
        for (s = 0; s < u; s += 1) h[s] = Je(c[s], !1);
        for (; u--; ) (d = c[u]), h[u] ? S(d, i.createTextNode("\n")) : _(d);
        for (c = t.querySelectorAll("CODE"), u = c.length; u--; ) _(c[u]);
        r.childNodes.length && r.appendChild(i.createTextNode("\n")),
          r.appendChild(y(t));
      }
      for (a = new n(r, 4); (t = a.nextNode()); )
        t.data = t.data.replace(/ /g, " ");
      return (
        r.normalize(),
        E(this.createElement("PRE", this._config.tagAttributes.pre, [r]), o)
      );
    },
    kt = function (e) {
      for (
        var t,
          o,
          i,
          r,
          a,
          s,
          d = this._doc,
          l = this._root,
          c = e.querySelectorAll("PRE"),
          h = c.length;
        h--;

      ) {
        for (t = c[h], o = new n(t, 4); (i = o.nextNode()); ) {
          for (
            r = i.data,
              r = r.replace(/ (?= )/g, " "),
              a = d.createDocumentFragment();
            (s = r.indexOf("\n")) > -1;

          )
            a.appendChild(d.createTextNode(r.slice(0, s))),
              a.appendChild(d.createElement("BR")),
              (r = r.slice(s + 1));
          i.parentNode.insertBefore(a, i), (i.data = r);
        }
        b(t, l), S(t, y(t));
      }
      return e;
    };
  (at.code = function () {
    var e = this.getSelection();
    return (
      e.collapsed || d(e.commonAncestorContainer)
        ? this.modifyBlocks(bt, e)
        : this.changeFormat(
            { tag: "CODE", attributes: this._config.tagAttributes.code },
            null,
            e
          ),
      this.focus()
    );
  }),
    (at.removeCode = function () {
      var e = this.getSelection();
      return (
        g(e.commonAncestorContainer, this._root, "PRE")
          ? this.modifyBlocks(kt, e)
          : this.changeFormat(null, { tag: "CODE" }, e),
        this.focus()
      );
    }),
    (at.toggleCode = function () {
      return (
        this.hasFormat("PRE") || this.hasFormat("CODE")
          ? this.removeCode()
          : this.code(),
        this
      );
    }),
    (at.removeAllFormatting = function (e) {
      if ((!e && !(e = this.getSelection())) || e.collapsed) return this;
      for (var t = this._root, n = e.commonAncestorContainer; n && !s(n); )
        n = n.parentNode;
      if ((n || (Pe(e, t), (n = t)), n.nodeType === H)) return this;
      this.saveUndoState(e), Ae(e, n, n, t);
      for (
        var o,
          i,
          r = n.ownerDocument,
          a = e.startContainer,
          d = e.startOffset,
          l = e.endContainer,
          c = e.endOffset,
          h = r.createDocumentFragment(),
          u = r.createDocumentFragment(),
          f = k(l, c, n, t),
          p = k(a, d, n, t);
        p !== f;

      )
        (o = p.nextSibling), h.appendChild(p), (p = o);
      return (
        F(this, h, u),
        u.normalize(),
        (p = u.firstChild),
        (o = u.lastChild),
        (i = n.childNodes),
        p
          ? (n.insertBefore(u, f), (d = ce.call(i, p)), (c = ce.call(i, o) + 1))
          : ((d = ce.call(i, f)), (c = d)),
        e.setStart(n, d),
        e.setEnd(n, c),
        A(n, e),
        xe(e),
        this.setSelection(e),
        this._updatePath(e, !0),
        this.focus()
      );
    }),
    (at.increaseQuoteLevel = Et("modifyBlocks", pt)),
    (at.decreaseQuoteLevel = Et("modifyBlocks", gt)),
    (at.makeUnorderedList = Et("modifyBlocks", Nt)),
    (at.makeOrderedList = Et("modifyBlocks", Ct)),
    (at.removeList = Et("modifyBlocks", _t)),
    (P.isInline = a),
    (P.isBlock = s),
    (P.isContainer = d),
    (P.getBlockWalker = l),
    (P.getPreviousBlock = c),
    (P.getNextBlock = h),
    (P.areAlike = f),
    (P.hasTagAttributes = p),
    (P.getNearest = g),
    (P.isOrContains = v),
    (P.detach = _),
    (P.replaceWith = S),
    (P.empty = y),
    (P.getNodeBefore = _e),
    (P.getNodeAfter = Se),
    (P.insertNodeInRange = ye),
    (P.extractContentsOfRange = Te),
    (P.deleteContentsOfRange = Ee),
    (P.insertTreeFragmentIntoRange = be),
    (P.isNodeContainedInRange = ke),
    (P.moveRangeBoundariesDownTree = xe),
    (P.moveRangeBoundariesUpTree = Ae),
    (P.getStartBlockOfRange = Le),
    (P.getEndBlockOfRange = Be),
    (P.contentWalker = Oe),
    (P.rangeDoesStartAtBlockBoundary = Re),
    (P.rangeDoesEndAtBlockBoundary = De),
    (P.expandRangeToBlockBoundaries = Pe),
    (P.onPaste = it),
    (P.addLinks = yt),
    (P.splitBlock = ft),
    (P.startSelectionId = "squire-selection-start"),
    (P.endSelectionId = ht),
    "object" == typeof exports
      ? (module.exports = P)
      : "function" == typeof define && define.amd
      ? define(function () {
          return P;
        })
      : ((G.Squire = P),
        top !== G &&
          "true" === e.documentElement.getAttribute("data-squireinit") &&
          ((G.editor = new P(e)),
          G.onEditorLoad &&
            (G.onEditorLoad(G.editor), (G.onEditorLoad = null))));
})(document);
