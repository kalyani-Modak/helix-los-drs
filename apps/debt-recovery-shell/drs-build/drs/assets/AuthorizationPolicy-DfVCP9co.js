import { dN as reactExports, bx as React, ed as useIntl, ef as useLocation, dB as jsxRuntimeExports, Z as DMNDecisionTableBuilder, aX as Kr, p as AuthorizationPolicyRuleMasterAPI } from "./index-BhdgJqva.js";
function r(e) {
  var t, f2, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (f2 = r(e[t])) && (n && (n += " "), n += f2);
  else for (t in e) e[t] && (n && (n += " "), n += t);
  return n;
}
function clsx() {
  for (var e, t, f2 = 0, n = ""; f2 < arguments.length; ) (e = arguments[f2++]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
const u = (t) => "number" == typeof t && !isNaN(t), d = (t) => "string" == typeof t, p = (t) => "function" == typeof t, m = (t) => d(t) || p(t) ? t : null, f = (t) => reactExports.isValidElement(t) || d(t) || p(t) || u(t);
function g(t, e, n) {
  void 0 === n && (n = 300);
  const { scrollHeight: o, style: s } = t;
  requestAnimationFrame(() => {
    s.minHeight = "initial", s.height = o + "px", s.transition = `all ${n}ms`, requestAnimationFrame(() => {
      s.height = "0", s.padding = "0", s.margin = "0", setTimeout(e, n);
    });
  });
}
function h(e) {
  let { enter: a, exit: r2, appendPosition: i = false, collapse: l = true, collapseDuration: c = 300 } = e;
  return function(e2) {
    let { children: u2, position: d2, preventExitTransition: p2, done: m2, nodeRef: f2, isIn: h2 } = e2;
    const y2 = i ? `${a}--${d2}` : a, v2 = i ? `${r2}--${d2}` : r2, T2 = reactExports.useRef(0);
    return reactExports.useLayoutEffect(() => {
      const t = f2.current, e3 = y2.split(" "), n = (o) => {
        o.target === f2.current && (t.dispatchEvent(new Event("d")), t.removeEventListener("animationend", n), t.removeEventListener("animationcancel", n), 0 === T2.current && "animationcancel" !== o.type && t.classList.remove(...e3));
      };
      t.classList.add(...e3), t.addEventListener("animationend", n), t.addEventListener("animationcancel", n);
    }, []), reactExports.useEffect(() => {
      const t = f2.current, e3 = () => {
        t.removeEventListener("animationend", e3), l ? g(t, m2, c) : m2();
      };
      h2 || (p2 ? e3() : (T2.current = 1, t.className += ` ${v2}`, t.addEventListener("animationend", e3)));
    }, [h2]), React.createElement(React.Fragment, null, u2);
  };
}
function y(t, e) {
  return null != t ? { content: t.content, containerId: t.props.containerId, id: t.props.toastId, theme: t.props.theme, type: t.props.type, data: t.props.data || {}, isLoading: t.props.isLoading, icon: t.props.icon, status: e } : {};
}
const v = { list: /* @__PURE__ */ new Map(), emitQueue: /* @__PURE__ */ new Map(), on(t, e) {
  return this.list.has(t) || this.list.set(t, []), this.list.get(t).push(e), this;
}, off(t, e) {
  if (e) {
    const n = this.list.get(t).filter((t2) => t2 !== e);
    return this.list.set(t, n), this;
  }
  return this.list.delete(t), this;
}, cancelEmit(t) {
  const e = this.emitQueue.get(t);
  return e && (e.forEach(clearTimeout), this.emitQueue.delete(t)), this;
}, emit(t) {
  this.list.has(t) && this.list.get(t).forEach((e) => {
    const n = setTimeout(() => {
      e(...[].slice.call(arguments, 1));
    }, 0);
    this.emitQueue.has(t) || this.emitQueue.set(t, []), this.emitQueue.get(t).push(n);
  });
} }, T = (e) => {
  let { theme: n, type: o, ...s } = e;
  return React.createElement("svg", { viewBox: "0 0 24 24", width: "100%", height: "100%", fill: "colored" === n ? "currentColor" : `var(--toastify-icon-color-${o})`, ...s });
}, E = { info: function(e) {
  return React.createElement(T, { ...e }, React.createElement("path", { d: "M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z" }));
}, warning: function(e) {
  return React.createElement(T, { ...e }, React.createElement("path", { d: "M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z" }));
}, success: function(e) {
  return React.createElement(T, { ...e }, React.createElement("path", { d: "M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z" }));
}, error: function(e) {
  return React.createElement(T, { ...e }, React.createElement("path", { d: "M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z" }));
}, spinner: function() {
  return React.createElement("div", { className: "Toastify__spinner" });
} };
function C(t) {
  const [, o] = reactExports.useReducer((t2) => t2 + 1, 0), [l, c] = reactExports.useState([]), g2 = reactExports.useRef(null), h2 = reactExports.useRef(/* @__PURE__ */ new Map()).current, T2 = (t2) => -1 !== l.indexOf(t2), C2 = reactExports.useRef({ toastKey: 1, displayedToast: 0, count: 0, queue: [], props: t, containerId: null, isToastActive: T2, getToast: (t2) => h2.get(t2) }).current;
  function b2(t2) {
    let { containerId: e } = t2;
    const { limit: n } = C2.props;
    !n || e && C2.containerId !== e || (C2.count -= C2.queue.length, C2.queue = []);
  }
  function I2(t2) {
    c((e) => null == t2 ? [] : e.filter((e2) => e2 !== t2));
  }
  function _2() {
    const { toastContent: t2, toastProps: e, staleId: n } = C2.queue.shift();
    O2(t2, e, n);
  }
  function L2(t2, n) {
    let { delay: s, staleId: r2, ...i } = n;
    if (!f(t2) || function(t3) {
      return !g2.current || C2.props.enableMultiContainer && t3.containerId !== C2.props.containerId || h2.has(t3.toastId) && null == t3.updateId;
    }(i)) return;
    const { toastId: l2, updateId: c2, data: T3 } = i, { props: b3 } = C2, L3 = () => I2(l2), N2 = null == c2;
    N2 && C2.count++;
    const M2 = { ...b3, style: b3.toastStyle, key: C2.toastKey++, ...Object.fromEntries(Object.entries(i).filter((t3) => {
      let [e, n2] = t3;
      return null != n2;
    })), toastId: l2, updateId: c2, data: T3, closeToast: L3, isIn: false, className: m(i.className || b3.toastClassName), bodyClassName: m(i.bodyClassName || b3.bodyClassName), progressClassName: m(i.progressClassName || b3.progressClassName), autoClose: !i.isLoading && (R2 = i.autoClose, w = b3.autoClose, false === R2 || u(R2) && R2 > 0 ? R2 : w), deleteToast() {
      const t3 = y(h2.get(l2), "removed");
      h2.delete(l2), v.emit(4, t3);
      const e = C2.queue.length;
      if (C2.count = null == l2 ? C2.count - C2.displayedToast : C2.count - 1, C2.count < 0 && (C2.count = 0), e > 0) {
        const t4 = null == l2 ? C2.props.limit : 1;
        if (1 === e || 1 === t4) C2.displayedToast++, _2();
        else {
          const n2 = t4 > e ? e : t4;
          C2.displayedToast = n2;
          for (let t5 = 0; t5 < n2; t5++) _2();
        }
      } else o();
    } };
    var R2, w;
    M2.iconOut = function(t3) {
      let { theme: n2, type: o2, isLoading: s2, icon: r3 } = t3, i2 = null;
      const l3 = { theme: n2, type: o2 };
      return false === r3 || (p(r3) ? i2 = r3(l3) : reactExports.isValidElement(r3) ? i2 = reactExports.cloneElement(r3, l3) : d(r3) || u(r3) ? i2 = r3 : s2 ? i2 = E.spinner() : ((t4) => t4 in E)(o2) && (i2 = E[o2](l3))), i2;
    }(M2), p(i.onOpen) && (M2.onOpen = i.onOpen), p(i.onClose) && (M2.onClose = i.onClose), M2.closeButton = b3.closeButton, false === i.closeButton || f(i.closeButton) ? M2.closeButton = i.closeButton : true === i.closeButton && (M2.closeButton = !f(b3.closeButton) || b3.closeButton);
    let x = t2;
    reactExports.isValidElement(t2) && !d(t2.type) ? x = reactExports.cloneElement(t2, { closeToast: L3, toastProps: M2, data: T3 }) : p(t2) && (x = t2({ closeToast: L3, toastProps: M2, data: T3 })), b3.limit && b3.limit > 0 && C2.count > b3.limit && N2 ? C2.queue.push({ toastContent: x, toastProps: M2, staleId: r2 }) : u(s) ? setTimeout(() => {
      O2(x, M2, r2);
    }, s) : O2(x, M2, r2);
  }
  function O2(t2, e, n) {
    const { toastId: o2 } = e;
    n && h2.delete(n);
    const s = { content: t2, props: e };
    h2.set(o2, s), c((t3) => [...t3, o2].filter((t4) => t4 !== n)), v.emit(4, y(s, null == s.props.updateId ? "added" : "updated"));
  }
  return reactExports.useEffect(() => (C2.containerId = t.containerId, v.cancelEmit(3).on(0, L2).on(1, (t2) => g2.current && I2(t2)).on(5, b2).emit(2, C2), () => {
    h2.clear(), v.emit(3, C2);
  }), []), reactExports.useEffect(() => {
    C2.props = t, C2.isToastActive = T2, C2.displayedToast = l.length;
  }), { getToastToRender: function(e) {
    const n = /* @__PURE__ */ new Map(), o2 = Array.from(h2.values());
    return t.newestOnTop && o2.reverse(), o2.forEach((t2) => {
      const { position: e2 } = t2.props;
      n.has(e2) || n.set(e2, []), n.get(e2).push(t2);
    }), Array.from(n, (t2) => e(t2[0], t2[1]));
  }, containerRef: g2, isToastActive: T2 };
}
function b(t) {
  return t.targetTouches && t.targetTouches.length >= 1 ? t.targetTouches[0].clientX : t.clientX;
}
function I(t) {
  return t.targetTouches && t.targetTouches.length >= 1 ? t.targetTouches[0].clientY : t.clientY;
}
function _(t) {
  const [o, a] = reactExports.useState(false), [r2, l] = reactExports.useState(false), c = reactExports.useRef(null), u2 = reactExports.useRef({ start: 0, x: 0, y: 0, delta: 0, removalDistance: 0, canCloseOnClick: true, canDrag: false, boundingRect: null, didMove: false }).current, d2 = reactExports.useRef(t), { autoClose: m2, pauseOnHover: f2, closeToast: g2, onClick: h2, closeOnClick: y2 } = t;
  function v2(e) {
    if (t.draggable) {
      "touchstart" === e.nativeEvent.type && e.nativeEvent.preventDefault(), u2.didMove = false, document.addEventListener("mousemove", _2), document.addEventListener("mouseup", L2), document.addEventListener("touchmove", _2), document.addEventListener("touchend", L2);
      const n = c.current;
      u2.canCloseOnClick = true, u2.canDrag = true, u2.boundingRect = n.getBoundingClientRect(), n.style.transition = "", u2.x = b(e.nativeEvent), u2.y = I(e.nativeEvent), "x" === t.draggableDirection ? (u2.start = u2.x, u2.removalDistance = n.offsetWidth * (t.draggablePercent / 100)) : (u2.start = u2.y, u2.removalDistance = n.offsetHeight * (80 === t.draggablePercent ? 1.5 * t.draggablePercent : t.draggablePercent / 100));
    }
  }
  function T2(e) {
    if (u2.boundingRect) {
      const { top: n, bottom: o2, left: s, right: a2 } = u2.boundingRect;
      "touchend" !== e.nativeEvent.type && t.pauseOnHover && u2.x >= s && u2.x <= a2 && u2.y >= n && u2.y <= o2 ? C2() : E2();
    }
  }
  function E2() {
    a(true);
  }
  function C2() {
    a(false);
  }
  function _2(e) {
    const n = c.current;
    u2.canDrag && n && (u2.didMove = true, o && C2(), u2.x = b(e), u2.y = I(e), u2.delta = "x" === t.draggableDirection ? u2.x - u2.start : u2.y - u2.start, u2.start !== u2.x && (u2.canCloseOnClick = false), n.style.transform = `translate${t.draggableDirection}(${u2.delta}px)`, n.style.opacity = "" + (1 - Math.abs(u2.delta / u2.removalDistance)));
  }
  function L2() {
    document.removeEventListener("mousemove", _2), document.removeEventListener("mouseup", L2), document.removeEventListener("touchmove", _2), document.removeEventListener("touchend", L2);
    const e = c.current;
    if (u2.canDrag && u2.didMove && e) {
      if (u2.canDrag = false, Math.abs(u2.delta) > u2.removalDistance) return l(true), void t.closeToast();
      e.style.transition = "transform 0.2s, opacity 0.2s", e.style.transform = `translate${t.draggableDirection}(0)`, e.style.opacity = "1";
    }
  }
  reactExports.useEffect(() => {
    d2.current = t;
  }), reactExports.useEffect(() => (c.current && c.current.addEventListener("d", E2, { once: true }), p(t.onOpen) && t.onOpen(reactExports.isValidElement(t.children) && t.children.props), () => {
    const t2 = d2.current;
    p(t2.onClose) && t2.onClose(reactExports.isValidElement(t2.children) && t2.children.props);
  }), []), reactExports.useEffect(() => (t.pauseOnFocusLoss && (document.hasFocus() || C2(), window.addEventListener("focus", E2), window.addEventListener("blur", C2)), () => {
    t.pauseOnFocusLoss && (window.removeEventListener("focus", E2), window.removeEventListener("blur", C2));
  }), [t.pauseOnFocusLoss]);
  const O2 = { onMouseDown: v2, onTouchStart: v2, onMouseUp: T2, onTouchEnd: T2 };
  return m2 && f2 && (O2.onMouseEnter = C2, O2.onMouseLeave = E2), y2 && (O2.onClick = (t2) => {
    h2 && h2(t2), u2.canCloseOnClick && g2();
  }), { playToast: E2, pauseToast: C2, isRunning: o, preventExitTransition: r2, toastRef: c, eventHandlers: O2 };
}
function L(e) {
  let { closeToast: n, theme: o, ariaLabel: s = "close" } = e;
  return React.createElement("button", { className: `Toastify__close-button Toastify__close-button--${o}`, type: "button", onClick: (t) => {
    t.stopPropagation(), n(t);
  }, "aria-label": s }, React.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 14 16" }, React.createElement("path", { fillRule: "evenodd", d: "M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z" })));
}
function O(e) {
  let { delay: n, isRunning: o, closeToast: s, type: a = "default", hide: r2, className: i, style: l, controlledProgress: u2, progress: d2, rtl: m2, isIn: f2, theme: g2 } = e;
  const h2 = r2 || u2 && 0 === d2, y2 = { ...l, animationDuration: `${n}ms`, animationPlayState: o ? "running" : "paused", opacity: h2 ? 0 : 1 };
  u2 && (y2.transform = `scaleX(${d2})`);
  const v2 = clsx("Toastify__progress-bar", u2 ? "Toastify__progress-bar--controlled" : "Toastify__progress-bar--animated", `Toastify__progress-bar-theme--${g2}`, `Toastify__progress-bar--${a}`, { "Toastify__progress-bar--rtl": m2 }), T2 = p(i) ? i({ rtl: m2, type: a, defaultClassName: v2 }) : clsx(v2, i);
  return React.createElement("div", { role: "progressbar", "aria-hidden": h2 ? "true" : "false", "aria-label": "notification timer", className: T2, style: y2, [u2 && d2 >= 1 ? "onTransitionEnd" : "onAnimationEnd"]: u2 && d2 < 1 ? null : () => {
    f2 && s();
  } });
}
const N = (n) => {
  const { isRunning: o, preventExitTransition: s, toastRef: r2, eventHandlers: i } = _(n), { closeButton: l, children: u2, autoClose: d2, onClick: m2, type: f2, hideProgressBar: g2, closeToast: h2, transition: y2, position: v2, className: T2, style: E2, bodyClassName: C2, bodyStyle: b2, progressClassName: I2, progressStyle: N2, updateId: M2, role: R2, progress: w, rtl: x, toastId: $, deleteToast: k2, isIn: P2, isLoading: B2, iconOut: D2, closeOnClick: A2, theme: z2 } = n, F2 = clsx("Toastify__toast", `Toastify__toast-theme--${z2}`, `Toastify__toast--${f2}`, { "Toastify__toast--rtl": x }, { "Toastify__toast--close-on-click": A2 }), H2 = p(T2) ? T2({ rtl: x, position: v2, type: f2, defaultClassName: F2 }) : clsx(F2, T2), S2 = !!w || !d2, q2 = { closeToast: h2, type: f2, theme: z2 };
  let Q2 = null;
  return false === l || (Q2 = p(l) ? l(q2) : reactExports.isValidElement(l) ? reactExports.cloneElement(l, q2) : L(q2)), React.createElement(y2, { isIn: P2, done: k2, position: v2, preventExitTransition: s, nodeRef: r2 }, React.createElement("div", { id: $, onClick: m2, className: H2, ...i, style: E2, ref: r2 }, React.createElement("div", { ...P2 && { role: R2 }, className: p(C2) ? C2({ type: f2 }) : clsx("Toastify__toast-body", C2), style: b2 }, null != D2 && React.createElement("div", { className: clsx("Toastify__toast-icon", { "Toastify--animate-icon Toastify__zoom-enter": !B2 }) }, D2), React.createElement("div", null, u2)), Q2, React.createElement(O, { ...M2 && !S2 ? { key: `pb-${M2}` } : {}, rtl: x, theme: z2, delay: d2, isRunning: o, isIn: P2, closeToast: h2, hide: g2, type: f2, style: N2, className: I2, controlledProgress: S2, progress: w || 0 })));
}, M = function(t, e) {
  return void 0 === e && (e = false), { enter: `Toastify--animate Toastify__${t}-enter`, exit: `Toastify--animate Toastify__${t}-exit`, appendPosition: e };
}, R = h(M("bounce", true));
h(M("slide", true));
h(M("zoom"));
h(M("flip"));
const k = reactExports.forwardRef((e, n) => {
  const { getToastToRender: o, containerRef: a, isToastActive: r2 } = C(e), { className: i, style: l, rtl: u2, containerId: d2 } = e;
  function f2(t) {
    const e2 = clsx("Toastify__toast-container", `Toastify__toast-container--${t}`, { "Toastify__toast-container--rtl": u2 });
    return p(i) ? i({ position: t, rtl: u2, defaultClassName: e2 }) : clsx(e2, m(i));
  }
  return reactExports.useEffect(() => {
    n && (n.current = a.current);
  }, []), React.createElement("div", { ref: a, className: "Toastify", id: d2 }, o((e2, n2) => {
    const o2 = n2.length ? { ...l } : { ...l, pointerEvents: "none" };
    return React.createElement("div", { className: f2(e2), style: o2, key: `container-${e2}` }, n2.map((e3, o3) => {
      let { content: s, props: a2 } = e3;
      return React.createElement(N, { ...a2, isIn: r2(a2.toastId), style: { ...a2.style, "--nth": o3 + 1, "--len": n2.length }, key: `toast-${a2.key}` }, s);
    }));
  }));
});
k.displayName = "ToastContainer", k.defaultProps = { position: "top-right", transition: R, autoClose: 5e3, closeButton: L, pauseOnHover: true, pauseOnFocusLoss: true, closeOnClick: true, draggable: true, draggablePercent: 80, draggableDirection: "x", role: "alert", theme: "light" };
let P, B = /* @__PURE__ */ new Map(), D = [], A = 1;
function z() {
  return "" + A++;
}
function F(t) {
  return t && (d(t.toastId) || u(t.toastId)) ? t.toastId : z();
}
function H(t, e) {
  return B.size > 0 ? v.emit(0, t, e) : D.push({ content: t, options: e }), e.toastId;
}
function S(t, e) {
  return { ...e, type: e && e.type || t, toastId: F(e) };
}
function q(t) {
  return (e, n) => H(e, S(t, n));
}
function Q(t, e) {
  return H(t, S("default", e));
}
Q.loading = (t, e) => H(t, S("default", { isLoading: true, autoClose: false, closeOnClick: false, closeButton: false, draggable: false, ...e })), Q.promise = function(t, e, n) {
  let o, { pending: s, error: a, success: r2 } = e;
  s && (o = d(s) ? Q.loading(s, n) : Q.loading(s.render, { ...n, ...s }));
  const i = { isLoading: null, autoClose: null, closeOnClick: null, closeButton: null, draggable: null }, l = (t2, e2, s2) => {
    if (null == e2) return void Q.dismiss(o);
    const a2 = { type: t2, ...i, ...n, data: s2 }, r3 = d(e2) ? { render: e2 } : e2;
    return o ? Q.update(o, { ...a2, ...r3 }) : Q(r3.render, { ...a2, ...r3 }), s2;
  }, c = p(t) ? t() : t;
  return c.then((t2) => l("success", r2, t2)).catch((t2) => l("error", a, t2)), c;
}, Q.success = q("success"), Q.info = q("info"), Q.error = q("error"), Q.warning = q("warning"), Q.warn = Q.warning, Q.dark = (t, e) => H(t, S("default", { theme: "dark", ...e })), Q.dismiss = (t) => {
  B.size > 0 ? v.emit(1, t) : D = D.filter((e) => null != t && e.options.toastId !== t);
}, Q.clearWaitingQueue = function(t) {
  return void 0 === t && (t = {}), v.emit(5, t);
}, Q.isActive = (t) => {
  let e = false;
  return B.forEach((n) => {
    n.isToastActive && n.isToastActive(t) && (e = true);
  }), e;
}, Q.update = function(t, e) {
  void 0 === e && (e = {}), setTimeout(() => {
    const n = function(t2, e2) {
      let { containerId: n2 } = e2;
      const o = B.get(n2 || P);
      return o && o.getToast(t2);
    }(t, e);
    if (n) {
      const { props: o, content: s } = n, a = { delay: 100, ...o, ...e, toastId: e.toastId || t, updateId: z() };
      a.toastId !== t && (a.staleId = t);
      const r2 = a.render || s;
      delete a.render, H(r2, a);
    }
  }, 0);
}, Q.done = (t) => {
  Q.update(t, { progress: 1 });
}, Q.onChange = (t) => (v.on(4, t), () => {
  v.off(4, t);
}), Q.POSITION = { TOP_LEFT: "top-left", TOP_RIGHT: "top-right", TOP_CENTER: "top-center", BOTTOM_LEFT: "bottom-left", BOTTOM_RIGHT: "bottom-right", BOTTOM_CENTER: "bottom-center" }, Q.TYPE = { INFO: "info", SUCCESS: "success", WARNING: "warning", ERROR: "error", DEFAULT: "default" }, v.on(2, (t) => {
  P = t.containerId || t, B.set(P, t), D.forEach((t2) => {
    v.emit(0, t2.content, t2.options);
  }), D = [];
}).on(3, (t) => {
  B.delete(t.containerId || t), 0 === B.size && v.off(0).off(1).off(5);
});
const AuthorizationPolicyRuleMaster = () => {
  var _a;
  const [loading, setLoading] = reactExports.useState(false);
  const intl = useIntl();
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const outputAttributes = [
    {
      name: intl.formatMessage({
        id: "label.authorizationPolicy.output.multiAuthType",
        defaultMessage: "Multi-Auth Type"
      }),
      type: "string",
      code: "MultiAuthType"
    },
    {
      name: intl.formatMessage({
        id: "label.authorizationPolicy.output.numberOfAuthorizations",
        defaultMessage: "Number of Authorizations"
      }),
      type: "number",
      code: "NumberOfAuthorizations"
    },
    {
      name: intl.formatMessage({
        id: "label.authorizationPolicy.output.profileCodes",
        defaultMessage: "Profile Codes"
      }),
      type: "string",
      code: "ProfileCodes"
    }
  ];
  reactExports.useEffect(() => {
  }, []);
  const handleSave = async (dmnPayload) => {
    var _a2, _b;
    console.log("➡️ Save Clicked. Payload:", dmnPayload);
    try {
      setLoading(true);
      const res = await Kr.POST(
        AuthorizationPolicyRuleMasterAPI.saveAuthorizationPolicyRuleMaster(screenMenuId),
        dmnPayload,
        {},
        false,
        {
          "X-Tenant-Id": Realm
        }
      );
      if (res.status === 200) {
        Q.success(
          res.data.msg || intl.formatMessage({
            id: "save.success",
            defaultMessage: "Authorization Policy Rule uploaded successfully"
          })
        );
      } else {
        Q.error(
          res.data.msg || intl.formatMessage({
            id: "save.failed",
            defaultMessage: "Failed to upload Authorization Policy Rule"
          })
        );
      }
    } catch (err) {
      Q.error(
        ((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "save.error",
          defaultMessage: "Error uploading Authorization Policy Rule"
        })
      );
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    DMNDecisionTableBuilder,
    {
      rulename: "PolicyAuthorization",
      modulename: "COL",
      tenantId: Realm,
      dmnType: "DECISION_TABLE",
      entityName: "AuthorizationPolicy",
      outputAttributes,
      onSubmit: handleSave,
      editMode: true
    }
  ) });
};
export {
  AuthorizationPolicyRuleMaster as default
};
