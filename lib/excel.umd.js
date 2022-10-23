/* 
MIT License

Copyright (c) 2020 Steve Xu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 
*/(function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
              (global = global || self, factory(global.excel = {}));
       })(this, (function (exports) { 'use strict';
"use strict";
var __export__ = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/react/cjs/react.production.min.js
  var require_react_production_min = __commonJS({
    "node_modules/react/cjs/react.production.min.js"(exports) {
      "use strict";
      var l2 = Symbol.for("react.element");
      var n2 = Symbol.for("react.portal");
      var p2 = Symbol.for("react.fragment");
      var q2 = Symbol.for("react.strict_mode");
      var r2 = Symbol.for("react.profiler");
      var t2 = Symbol.for("react.provider");
      var u2 = Symbol.for("react.context");
      var v2 = Symbol.for("react.forward_ref");
      var w2 = Symbol.for("react.suspense");
      var x2 = Symbol.for("react.memo");
      var y2 = Symbol.for("react.lazy");
      var z2 = Symbol.iterator;
      function A2(a2) {
        if (null === a2 || "object" !== typeof a2)
          return null;
        a2 = z2 && a2[z2] || a2["@@iterator"];
        return "function" === typeof a2 ? a2 : null;
      }
      var B2 = { isMounted: function() {
        return false;
      }, enqueueForceUpdate: function() {
      }, enqueueReplaceState: function() {
      }, enqueueSetState: function() {
      } };
      var C = Object.assign;
      var D2 = {};
      function E2(a2, b2, e) {
        this.props = a2;
        this.context = b2;
        this.refs = D2;
        this.updater = e || B2;
      }
      E2.prototype.isReactComponent = {};
      E2.prototype.setState = function(a2, b2) {
        if ("object" !== typeof a2 && "function" !== typeof a2 && null != a2)
          throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, a2, b2, "setState");
      };
      E2.prototype.forceUpdate = function(a2) {
        this.updater.enqueueForceUpdate(this, a2, "forceUpdate");
      };
      function F2() {
      }
      F2.prototype = E2.prototype;
      function G2(a2, b2, e) {
        this.props = a2;
        this.context = b2;
        this.refs = D2;
        this.updater = e || B2;
      }
      var H2 = G2.prototype = new F2();
      H2.constructor = G2;
      C(H2, E2.prototype);
      H2.isPureReactComponent = true;
      var I2 = Array.isArray;
      var J = Object.prototype.hasOwnProperty;
      var K = { current: null };
      var L2 = { key: true, ref: true, __self: true, __source: true };
      function M2(a2, b2, e) {
        var d2, c2 = {}, k2 = null, h2 = null;
        if (null != b2)
          for (d2 in void 0 !== b2.ref && (h2 = b2.ref), void 0 !== b2.key && (k2 = "" + b2.key), b2)
            J.call(b2, d2) && !L2.hasOwnProperty(d2) && (c2[d2] = b2[d2]);
        var g2 = arguments.length - 2;
        if (1 === g2)
          c2.children = e;
        else if (1 < g2) {
          for (var f2 = Array(g2), m = 0; m < g2; m++)
            f2[m] = arguments[m + 2];
          c2.children = f2;
        }
        if (a2 && a2.defaultProps)
          for (d2 in g2 = a2.defaultProps, g2)
            void 0 === c2[d2] && (c2[d2] = g2[d2]);
        return { $$typeof: l2, type: a2, key: k2, ref: h2, props: c2, _owner: K.current };
      }
      function N(a2, b2) {
        return { $$typeof: l2, type: a2.type, key: b2, ref: a2.ref, props: a2.props, _owner: a2._owner };
      }
      function O2(a2) {
        return "object" === typeof a2 && null !== a2 && a2.$$typeof === l2;
      }
      function escape(a2) {
        var b2 = { "=": "=0", ":": "=2" };
        return "$" + a2.replace(/[=:]/g, function(a3) {
          return b2[a3];
        });
      }
      var P2 = /\/+/g;
      function Q2(a2, b2) {
        return "object" === typeof a2 && null !== a2 && null != a2.key ? escape("" + a2.key) : b2.toString(36);
      }
      function R2(a2, b2, e, d2, c2) {
        var k2 = typeof a2;
        if ("undefined" === k2 || "boolean" === k2)
          a2 = null;
        var h2 = false;
        if (null === a2)
          h2 = true;
        else
          switch (k2) {
            case "string":
            case "number":
              h2 = true;
              break;
            case "object":
              switch (a2.$$typeof) {
                case l2:
                case n2:
                  h2 = true;
              }
          }
        if (h2)
          return h2 = a2, c2 = c2(h2), a2 = "" === d2 ? "." + Q2(h2, 0) : d2, I2(c2) ? (e = "", null != a2 && (e = a2.replace(P2, "$&/") + "/"), R2(c2, b2, e, "", function(a3) {
            return a3;
          })) : null != c2 && (O2(c2) && (c2 = N(c2, e + (!c2.key || h2 && h2.key === c2.key ? "" : ("" + c2.key).replace(P2, "$&/") + "/") + a2)), b2.push(c2)), 1;
        h2 = 0;
        d2 = "" === d2 ? "." : d2 + ":";
        if (I2(a2))
          for (var g2 = 0; g2 < a2.length; g2++) {
            k2 = a2[g2];
            var f2 = d2 + Q2(k2, g2);
            h2 += R2(k2, b2, e, f2, c2);
          }
        else if (f2 = A2(a2), "function" === typeof f2)
          for (a2 = f2.call(a2), g2 = 0; !(k2 = a2.next()).done; )
            k2 = k2.value, f2 = d2 + Q2(k2, g2++), h2 += R2(k2, b2, e, f2, c2);
        else if ("object" === k2)
          throw b2 = String(a2), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a2).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
        return h2;
      }
      function S2(a2, b2, e) {
        if (null == a2)
          return a2;
        var d2 = [], c2 = 0;
        R2(a2, d2, "", "", function(a3) {
          return b2.call(e, a3, c2++);
        });
        return d2;
      }
      function T2(a2) {
        if (-1 === a2._status) {
          var b2 = a2._result;
          b2 = b2();
          b2.then(function(b3) {
            if (0 === a2._status || -1 === a2._status)
              a2._status = 1, a2._result = b3;
          }, function(b3) {
            if (0 === a2._status || -1 === a2._status)
              a2._status = 2, a2._result = b3;
          });
          -1 === a2._status && (a2._status = 0, a2._result = b2);
        }
        if (1 === a2._status)
          return a2._result.default;
        throw a2._result;
      }
      var U2 = { current: null };
      var V = { transition: null };
      var W2 = { ReactCurrentDispatcher: U2, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
      exports.Children = { map: S2, forEach: function(a2, b2, e) {
        S2(a2, function() {
          b2.apply(this, arguments);
        }, e);
      }, count: function(a2) {
        var b2 = 0;
        S2(a2, function() {
          b2++;
        });
        return b2;
      }, toArray: function(a2) {
        return S2(a2, function(a3) {
          return a3;
        }) || [];
      }, only: function(a2) {
        if (!O2(a2))
          throw Error("React.Children.only expected to receive a single React element child.");
        return a2;
      } };
      exports.Component = E2;
      exports.Fragment = p2;
      exports.Profiler = r2;
      exports.PureComponent = G2;
      exports.StrictMode = q2;
      exports.Suspense = w2;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W2;
      exports.cloneElement = function(a2, b2, e) {
        if (null === a2 || void 0 === a2)
          throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a2 + ".");
        var d2 = C({}, a2.props), c2 = a2.key, k2 = a2.ref, h2 = a2._owner;
        if (null != b2) {
          void 0 !== b2.ref && (k2 = b2.ref, h2 = K.current);
          void 0 !== b2.key && (c2 = "" + b2.key);
          if (a2.type && a2.type.defaultProps)
            var g2 = a2.type.defaultProps;
          for (f2 in b2)
            J.call(b2, f2) && !L2.hasOwnProperty(f2) && (d2[f2] = void 0 === b2[f2] && void 0 !== g2 ? g2[f2] : b2[f2]);
        }
        var f2 = arguments.length - 2;
        if (1 === f2)
          d2.children = e;
        else if (1 < f2) {
          g2 = Array(f2);
          for (var m = 0; m < f2; m++)
            g2[m] = arguments[m + 2];
          d2.children = g2;
        }
        return { $$typeof: l2, type: a2.type, key: c2, ref: k2, props: d2, _owner: h2 };
      };
      exports.createContext = function(a2) {
        a2 = { $$typeof: u2, _currentValue: a2, _currentValue2: a2, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
        a2.Provider = { $$typeof: t2, _context: a2 };
        return a2.Consumer = a2;
      };
      exports.createElement = M2;
      exports.createFactory = function(a2) {
        var b2 = M2.bind(null, a2);
        b2.type = a2;
        return b2;
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(a2) {
        return { $$typeof: v2, render: a2 };
      };
      exports.isValidElement = O2;
      exports.lazy = function(a2) {
        return { $$typeof: y2, _payload: { _status: -1, _result: a2 }, _init: T2 };
      };
      exports.memo = function(a2, b2) {
        return { $$typeof: x2, type: a2, compare: void 0 === b2 ? null : b2 };
      };
      exports.startTransition = function(a2) {
        var b2 = V.transition;
        V.transition = {};
        try {
          a2();
        } finally {
          V.transition = b2;
        }
      };
      exports.unstable_act = function() {
        throw Error("act(...) is not supported in production builds of React.");
      };
      exports.useCallback = function(a2, b2) {
        return U2.current.useCallback(a2, b2);
      };
      exports.useContext = function(a2) {
        return U2.current.useContext(a2);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(a2) {
        return U2.current.useDeferredValue(a2);
      };
      exports.useEffect = function(a2, b2) {
        return U2.current.useEffect(a2, b2);
      };
      exports.useId = function() {
        return U2.current.useId();
      };
      exports.useImperativeHandle = function(a2, b2, e) {
        return U2.current.useImperativeHandle(a2, b2, e);
      };
      exports.useInsertionEffect = function(a2, b2) {
        return U2.current.useInsertionEffect(a2, b2);
      };
      exports.useLayoutEffect = function(a2, b2) {
        return U2.current.useLayoutEffect(a2, b2);
      };
      exports.useMemo = function(a2, b2) {
        return U2.current.useMemo(a2, b2);
      };
      exports.useReducer = function(a2, b2, e) {
        return U2.current.useReducer(a2, b2, e);
      };
      exports.useRef = function(a2) {
        return U2.current.useRef(a2);
      };
      exports.useState = function(a2) {
        return U2.current.useState(a2);
      };
      exports.useSyncExternalStore = function(a2, b2, e) {
        return U2.current.useSyncExternalStore(a2, b2, e);
      };
      exports.useTransition = function() {
        return U2.current.useTransition();
      };
      exports.version = "18.2.0";
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/scheduler/cjs/scheduler.production.min.js
  var require_scheduler_production_min = __commonJS({
    "node_modules/scheduler/cjs/scheduler.production.min.js"(exports) {
      "use strict";
      function f2(a2, b2) {
        var c2 = a2.length;
        a2.push(b2);
        a:
          for (; 0 < c2; ) {
            var d2 = c2 - 1 >>> 1, e = a2[d2];
            if (0 < g2(e, b2))
              a2[d2] = b2, a2[c2] = e, c2 = d2;
            else
              break a;
          }
      }
      function h2(a2) {
        return 0 === a2.length ? null : a2[0];
      }
      function k2(a2) {
        if (0 === a2.length)
          return null;
        var b2 = a2[0], c2 = a2.pop();
        if (c2 !== b2) {
          a2[0] = c2;
          a:
            for (var d2 = 0, e = a2.length, w2 = e >>> 1; d2 < w2; ) {
              var m = 2 * (d2 + 1) - 1, C = a2[m], n2 = m + 1, x2 = a2[n2];
              if (0 > g2(C, c2))
                n2 < e && 0 > g2(x2, C) ? (a2[d2] = x2, a2[n2] = c2, d2 = n2) : (a2[d2] = C, a2[m] = c2, d2 = m);
              else if (n2 < e && 0 > g2(x2, c2))
                a2[d2] = x2, a2[n2] = c2, d2 = n2;
              else
                break a;
            }
        }
        return b2;
      }
      function g2(a2, b2) {
        var c2 = a2.sortIndex - b2.sortIndex;
        return 0 !== c2 ? c2 : a2.id - b2.id;
      }
      if ("object" === typeof performance && "function" === typeof performance.now) {
        l2 = performance;
        exports.unstable_now = function() {
          return l2.now();
        };
      } else {
        p2 = Date, q2 = p2.now();
        exports.unstable_now = function() {
          return p2.now() - q2;
        };
      }
      var l2;
      var p2;
      var q2;
      var r2 = [];
      var t2 = [];
      var u2 = 1;
      var v2 = null;
      var y2 = 3;
      var z2 = false;
      var A2 = false;
      var B2 = false;
      var D2 = "function" === typeof setTimeout ? setTimeout : null;
      var E2 = "function" === typeof clearTimeout ? clearTimeout : null;
      var F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
      "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function G2(a2) {
        for (var b2 = h2(t2); null !== b2; ) {
          if (null === b2.callback)
            k2(t2);
          else if (b2.startTime <= a2)
            k2(t2), b2.sortIndex = b2.expirationTime, f2(r2, b2);
          else
            break;
          b2 = h2(t2);
        }
      }
      function H2(a2) {
        B2 = false;
        G2(a2);
        if (!A2)
          if (null !== h2(r2))
            A2 = true, I2(J);
          else {
            var b2 = h2(t2);
            null !== b2 && K(H2, b2.startTime - a2);
          }
      }
      function J(a2, b2) {
        A2 = false;
        B2 && (B2 = false, E2(L2), L2 = -1);
        z2 = true;
        var c2 = y2;
        try {
          G2(b2);
          for (v2 = h2(r2); null !== v2 && (!(v2.expirationTime > b2) || a2 && !M2()); ) {
            var d2 = v2.callback;
            if ("function" === typeof d2) {
              v2.callback = null;
              y2 = v2.priorityLevel;
              var e = d2(v2.expirationTime <= b2);
              b2 = exports.unstable_now();
              "function" === typeof e ? v2.callback = e : v2 === h2(r2) && k2(r2);
              G2(b2);
            } else
              k2(r2);
            v2 = h2(r2);
          }
          if (null !== v2)
            var w2 = true;
          else {
            var m = h2(t2);
            null !== m && K(H2, m.startTime - b2);
            w2 = false;
          }
          return w2;
        } finally {
          v2 = null, y2 = c2, z2 = false;
        }
      }
      var N = false;
      var O2 = null;
      var L2 = -1;
      var P2 = 5;
      var Q2 = -1;
      function M2() {
        return exports.unstable_now() - Q2 < P2 ? false : true;
      }
      function R2() {
        if (null !== O2) {
          var a2 = exports.unstable_now();
          Q2 = a2;
          var b2 = true;
          try {
            b2 = O2(true, a2);
          } finally {
            b2 ? S2() : (N = false, O2 = null);
          }
        } else
          N = false;
      }
      var S2;
      if ("function" === typeof F2)
        S2 = function() {
          F2(R2);
        };
      else if ("undefined" !== typeof MessageChannel) {
        T2 = new MessageChannel(), U2 = T2.port2;
        T2.port1.onmessage = R2;
        S2 = function() {
          U2.postMessage(null);
        };
      } else
        S2 = function() {
          D2(R2, 0);
        };
      var T2;
      var U2;
      function I2(a2) {
        O2 = a2;
        N || (N = true, S2());
      }
      function K(a2, b2) {
        L2 = D2(function() {
          a2(exports.unstable_now());
        }, b2);
      }
      exports.unstable_IdlePriority = 5;
      exports.unstable_ImmediatePriority = 1;
      exports.unstable_LowPriority = 4;
      exports.unstable_NormalPriority = 3;
      exports.unstable_Profiling = null;
      exports.unstable_UserBlockingPriority = 2;
      exports.unstable_cancelCallback = function(a2) {
        a2.callback = null;
      };
      exports.unstable_continueExecution = function() {
        A2 || z2 || (A2 = true, I2(J));
      };
      exports.unstable_forceFrameRate = function(a2) {
        0 > a2 || 125 < a2 ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a2 ? Math.floor(1e3 / a2) : 5;
      };
      exports.unstable_getCurrentPriorityLevel = function() {
        return y2;
      };
      exports.unstable_getFirstCallbackNode = function() {
        return h2(r2);
      };
      exports.unstable_next = function(a2) {
        switch (y2) {
          case 1:
          case 2:
          case 3:
            var b2 = 3;
            break;
          default:
            b2 = y2;
        }
        var c2 = y2;
        y2 = b2;
        try {
          return a2();
        } finally {
          y2 = c2;
        }
      };
      exports.unstable_pauseExecution = function() {
      };
      exports.unstable_requestPaint = function() {
      };
      exports.unstable_runWithPriority = function(a2, b2) {
        switch (a2) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            a2 = 3;
        }
        var c2 = y2;
        y2 = a2;
        try {
          return b2();
        } finally {
          y2 = c2;
        }
      };
      exports.unstable_scheduleCallback = function(a2, b2, c2) {
        var d2 = exports.unstable_now();
        "object" === typeof c2 && null !== c2 ? (c2 = c2.delay, c2 = "number" === typeof c2 && 0 < c2 ? d2 + c2 : d2) : c2 = d2;
        switch (a2) {
          case 1:
            var e = -1;
            break;
          case 2:
            e = 250;
            break;
          case 5:
            e = 1073741823;
            break;
          case 4:
            e = 1e4;
            break;
          default:
            e = 5e3;
        }
        e = c2 + e;
        a2 = { id: u2++, callback: b2, priorityLevel: a2, startTime: c2, expirationTime: e, sortIndex: -1 };
        c2 > d2 ? (a2.sortIndex = c2, f2(t2, a2), null === h2(r2) && a2 === h2(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K(H2, c2 - d2))) : (a2.sortIndex = e, f2(r2, a2), A2 || z2 || (A2 = true, I2(J)));
        return a2;
      };
      exports.unstable_shouldYield = M2;
      exports.unstable_wrapCallback = function(a2) {
        var b2 = y2;
        return function() {
          var c2 = y2;
          y2 = b2;
          try {
            return a2.apply(this, arguments);
          } finally {
            y2 = c2;
          }
        };
      };
    }
  });

  // node_modules/scheduler/index.js
  var require_scheduler = __commonJS({
    "node_modules/scheduler/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_scheduler_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/react-dom/cjs/react-dom.production.min.js
  var require_react_dom_production_min = __commonJS({
    "node_modules/react-dom/cjs/react-dom.production.min.js"(exports) {
      "use strict";
      var aa = require_react();
      var ca = require_scheduler();
      function p2(a2) {
        for (var b2 = "https://reactjs.org/docs/error-decoder.html?invariant=" + a2, c2 = 1; c2 < arguments.length; c2++)
          b2 += "&args[]=" + encodeURIComponent(arguments[c2]);
        return "Minified React error #" + a2 + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var da = /* @__PURE__ */ new Set();
      var ea = {};
      function fa(a2, b2) {
        ha(a2, b2);
        ha(a2 + "Capture", b2);
      }
      function ha(a2, b2) {
        ea[a2] = b2;
        for (a2 = 0; a2 < b2.length; a2++)
          da.add(b2[a2]);
      }
      var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
      var ja = Object.prototype.hasOwnProperty;
      var ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
      var la = {};
      var ma = {};
      function oa(a2) {
        if (ja.call(ma, a2))
          return true;
        if (ja.call(la, a2))
          return false;
        if (ka.test(a2))
          return ma[a2] = true;
        la[a2] = true;
        return false;
      }
      function pa(a2, b2, c2, d2) {
        if (null !== c2 && 0 === c2.type)
          return false;
        switch (typeof b2) {
          case "function":
          case "symbol":
            return true;
          case "boolean":
            if (d2)
              return false;
            if (null !== c2)
              return !c2.acceptsBooleans;
            a2 = a2.toLowerCase().slice(0, 5);
            return "data-" !== a2 && "aria-" !== a2;
          default:
            return false;
        }
      }
      function qa(a2, b2, c2, d2) {
        if (null === b2 || "undefined" === typeof b2 || pa(a2, b2, c2, d2))
          return true;
        if (d2)
          return false;
        if (null !== c2)
          switch (c2.type) {
            case 3:
              return !b2;
            case 4:
              return false === b2;
            case 5:
              return isNaN(b2);
            case 6:
              return isNaN(b2) || 1 > b2;
          }
        return false;
      }
      function v2(a2, b2, c2, d2, e, f2, g2) {
        this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
        this.attributeName = d2;
        this.attributeNamespace = e;
        this.mustUseProperty = c2;
        this.propertyName = a2;
        this.type = b2;
        this.sanitizeURL = f2;
        this.removeEmptyString = g2;
      }
      var z2 = {};
      "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a2) {
        z2[a2] = new v2(a2, 0, false, a2, null, false, false);
      });
      [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a2) {
        var b2 = a2[0];
        z2[b2] = new v2(b2, 1, false, a2[1], null, false, false);
      });
      ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a2) {
        z2[a2] = new v2(a2, 2, false, a2.toLowerCase(), null, false, false);
      });
      ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a2) {
        z2[a2] = new v2(a2, 2, false, a2, null, false, false);
      });
      "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a2) {
        z2[a2] = new v2(a2, 3, false, a2.toLowerCase(), null, false, false);
      });
      ["checked", "multiple", "muted", "selected"].forEach(function(a2) {
        z2[a2] = new v2(a2, 3, true, a2, null, false, false);
      });
      ["capture", "download"].forEach(function(a2) {
        z2[a2] = new v2(a2, 4, false, a2, null, false, false);
      });
      ["cols", "rows", "size", "span"].forEach(function(a2) {
        z2[a2] = new v2(a2, 6, false, a2, null, false, false);
      });
      ["rowSpan", "start"].forEach(function(a2) {
        z2[a2] = new v2(a2, 5, false, a2.toLowerCase(), null, false, false);
      });
      var ra = /[\-:]([a-z])/g;
      function sa(a2) {
        return a2[1].toUpperCase();
      }
      "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a2) {
        var b2 = a2.replace(
          ra,
          sa
        );
        z2[b2] = new v2(b2, 1, false, a2, null, false, false);
      });
      "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a2) {
        var b2 = a2.replace(ra, sa);
        z2[b2] = new v2(b2, 1, false, a2, "http://www.w3.org/1999/xlink", false, false);
      });
      ["xml:base", "xml:lang", "xml:space"].forEach(function(a2) {
        var b2 = a2.replace(ra, sa);
        z2[b2] = new v2(b2, 1, false, a2, "http://www.w3.org/XML/1998/namespace", false, false);
      });
      ["tabIndex", "crossOrigin"].forEach(function(a2) {
        z2[a2] = new v2(a2, 1, false, a2.toLowerCase(), null, false, false);
      });
      z2.xlinkHref = new v2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
      ["src", "href", "action", "formAction"].forEach(function(a2) {
        z2[a2] = new v2(a2, 1, false, a2.toLowerCase(), null, true, true);
      });
      function ta(a2, b2, c2, d2) {
        var e = z2.hasOwnProperty(b2) ? z2[b2] : null;
        if (null !== e ? 0 !== e.type : d2 || !(2 < b2.length) || "o" !== b2[0] && "O" !== b2[0] || "n" !== b2[1] && "N" !== b2[1])
          qa(b2, c2, e, d2) && (c2 = null), d2 || null === e ? oa(b2) && (null === c2 ? a2.removeAttribute(b2) : a2.setAttribute(b2, "" + c2)) : e.mustUseProperty ? a2[e.propertyName] = null === c2 ? 3 === e.type ? false : "" : c2 : (b2 = e.attributeName, d2 = e.attributeNamespace, null === c2 ? a2.removeAttribute(b2) : (e = e.type, c2 = 3 === e || 4 === e && true === c2 ? "" : "" + c2, d2 ? a2.setAttributeNS(d2, b2, c2) : a2.setAttribute(b2, c2)));
      }
      var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      var va = Symbol.for("react.element");
      var wa = Symbol.for("react.portal");
      var ya = Symbol.for("react.fragment");
      var za = Symbol.for("react.strict_mode");
      var Aa = Symbol.for("react.profiler");
      var Ba = Symbol.for("react.provider");
      var Ca = Symbol.for("react.context");
      var Da = Symbol.for("react.forward_ref");
      var Ea = Symbol.for("react.suspense");
      var Fa = Symbol.for("react.suspense_list");
      var Ga = Symbol.for("react.memo");
      var Ha = Symbol.for("react.lazy");
      Symbol.for("react.scope");
      Symbol.for("react.debug_trace_mode");
      var Ia = Symbol.for("react.offscreen");
      Symbol.for("react.legacy_hidden");
      Symbol.for("react.cache");
      Symbol.for("react.tracing_marker");
      var Ja = Symbol.iterator;
      function Ka(a2) {
        if (null === a2 || "object" !== typeof a2)
          return null;
        a2 = Ja && a2[Ja] || a2["@@iterator"];
        return "function" === typeof a2 ? a2 : null;
      }
      var A2 = Object.assign;
      var La;
      function Ma(a2) {
        if (void 0 === La)
          try {
            throw Error();
          } catch (c2) {
            var b2 = c2.stack.trim().match(/\n( *(at )?)/);
            La = b2 && b2[1] || "";
          }
        return "\n" + La + a2;
      }
      var Na = false;
      function Oa(a2, b2) {
        if (!a2 || Na)
          return "";
        Na = true;
        var c2 = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
          if (b2)
            if (b2 = function() {
              throw Error();
            }, Object.defineProperty(b2.prototype, "props", { set: function() {
              throw Error();
            } }), "object" === typeof Reflect && Reflect.construct) {
              try {
                Reflect.construct(b2, []);
              } catch (l2) {
                var d2 = l2;
              }
              Reflect.construct(a2, [], b2);
            } else {
              try {
                b2.call();
              } catch (l2) {
                d2 = l2;
              }
              a2.call(b2.prototype);
            }
          else {
            try {
              throw Error();
            } catch (l2) {
              d2 = l2;
            }
            a2();
          }
        } catch (l2) {
          if (l2 && d2 && "string" === typeof l2.stack) {
            for (var e = l2.stack.split("\n"), f2 = d2.stack.split("\n"), g2 = e.length - 1, h2 = f2.length - 1; 1 <= g2 && 0 <= h2 && e[g2] !== f2[h2]; )
              h2--;
            for (; 1 <= g2 && 0 <= h2; g2--, h2--)
              if (e[g2] !== f2[h2]) {
                if (1 !== g2 || 1 !== h2) {
                  do
                    if (g2--, h2--, 0 > h2 || e[g2] !== f2[h2]) {
                      var k2 = "\n" + e[g2].replace(" at new ", " at ");
                      a2.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a2.displayName));
                      return k2;
                    }
                  while (1 <= g2 && 0 <= h2);
                }
                break;
              }
          }
        } finally {
          Na = false, Error.prepareStackTrace = c2;
        }
        return (a2 = a2 ? a2.displayName || a2.name : "") ? Ma(a2) : "";
      }
      function Pa(a2) {
        switch (a2.tag) {
          case 5:
            return Ma(a2.type);
          case 16:
            return Ma("Lazy");
          case 13:
            return Ma("Suspense");
          case 19:
            return Ma("SuspenseList");
          case 0:
          case 2:
          case 15:
            return a2 = Oa(a2.type, false), a2;
          case 11:
            return a2 = Oa(a2.type.render, false), a2;
          case 1:
            return a2 = Oa(a2.type, true), a2;
          default:
            return "";
        }
      }
      function Qa(a2) {
        if (null == a2)
          return null;
        if ("function" === typeof a2)
          return a2.displayName || a2.name || null;
        if ("string" === typeof a2)
          return a2;
        switch (a2) {
          case ya:
            return "Fragment";
          case wa:
            return "Portal";
          case Aa:
            return "Profiler";
          case za:
            return "StrictMode";
          case Ea:
            return "Suspense";
          case Fa:
            return "SuspenseList";
        }
        if ("object" === typeof a2)
          switch (a2.$$typeof) {
            case Ca:
              return (a2.displayName || "Context") + ".Consumer";
            case Ba:
              return (a2._context.displayName || "Context") + ".Provider";
            case Da:
              var b2 = a2.render;
              a2 = a2.displayName;
              a2 || (a2 = b2.displayName || b2.name || "", a2 = "" !== a2 ? "ForwardRef(" + a2 + ")" : "ForwardRef");
              return a2;
            case Ga:
              return b2 = a2.displayName || null, null !== b2 ? b2 : Qa(a2.type) || "Memo";
            case Ha:
              b2 = a2._payload;
              a2 = a2._init;
              try {
                return Qa(a2(b2));
              } catch (c2) {
              }
          }
        return null;
      }
      function Ra(a2) {
        var b2 = a2.type;
        switch (a2.tag) {
          case 24:
            return "Cache";
          case 9:
            return (b2.displayName || "Context") + ".Consumer";
          case 10:
            return (b2._context.displayName || "Context") + ".Provider";
          case 18:
            return "DehydratedFragment";
          case 11:
            return a2 = b2.render, a2 = a2.displayName || a2.name || "", b2.displayName || ("" !== a2 ? "ForwardRef(" + a2 + ")" : "ForwardRef");
          case 7:
            return "Fragment";
          case 5:
            return b2;
          case 4:
            return "Portal";
          case 3:
            return "Root";
          case 6:
            return "Text";
          case 16:
            return Qa(b2);
          case 8:
            return b2 === za ? "StrictMode" : "Mode";
          case 22:
            return "Offscreen";
          case 12:
            return "Profiler";
          case 21:
            return "Scope";
          case 13:
            return "Suspense";
          case 19:
            return "SuspenseList";
          case 25:
            return "TracingMarker";
          case 1:
          case 0:
          case 17:
          case 2:
          case 14:
          case 15:
            if ("function" === typeof b2)
              return b2.displayName || b2.name || null;
            if ("string" === typeof b2)
              return b2;
        }
        return null;
      }
      function Sa(a2) {
        switch (typeof a2) {
          case "boolean":
          case "number":
          case "string":
          case "undefined":
            return a2;
          case "object":
            return a2;
          default:
            return "";
        }
      }
      function Ta(a2) {
        var b2 = a2.type;
        return (a2 = a2.nodeName) && "input" === a2.toLowerCase() && ("checkbox" === b2 || "radio" === b2);
      }
      function Ua(a2) {
        var b2 = Ta(a2) ? "checked" : "value", c2 = Object.getOwnPropertyDescriptor(a2.constructor.prototype, b2), d2 = "" + a2[b2];
        if (!a2.hasOwnProperty(b2) && "undefined" !== typeof c2 && "function" === typeof c2.get && "function" === typeof c2.set) {
          var e = c2.get, f2 = c2.set;
          Object.defineProperty(a2, b2, { configurable: true, get: function() {
            return e.call(this);
          }, set: function(a3) {
            d2 = "" + a3;
            f2.call(this, a3);
          } });
          Object.defineProperty(a2, b2, { enumerable: c2.enumerable });
          return { getValue: function() {
            return d2;
          }, setValue: function(a3) {
            d2 = "" + a3;
          }, stopTracking: function() {
            a2._valueTracker = null;
            delete a2[b2];
          } };
        }
      }
      function Va(a2) {
        a2._valueTracker || (a2._valueTracker = Ua(a2));
      }
      function Wa(a2) {
        if (!a2)
          return false;
        var b2 = a2._valueTracker;
        if (!b2)
          return true;
        var c2 = b2.getValue();
        var d2 = "";
        a2 && (d2 = Ta(a2) ? a2.checked ? "true" : "false" : a2.value);
        a2 = d2;
        return a2 !== c2 ? (b2.setValue(a2), true) : false;
      }
      function Xa(a2) {
        a2 = a2 || ("undefined" !== typeof document ? document : void 0);
        if ("undefined" === typeof a2)
          return null;
        try {
          return a2.activeElement || a2.body;
        } catch (b2) {
          return a2.body;
        }
      }
      function Ya(a2, b2) {
        var c2 = b2.checked;
        return A2({}, b2, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c2 ? c2 : a2._wrapperState.initialChecked });
      }
      function Za(a2, b2) {
        var c2 = null == b2.defaultValue ? "" : b2.defaultValue, d2 = null != b2.checked ? b2.checked : b2.defaultChecked;
        c2 = Sa(null != b2.value ? b2.value : c2);
        a2._wrapperState = { initialChecked: d2, initialValue: c2, controlled: "checkbox" === b2.type || "radio" === b2.type ? null != b2.checked : null != b2.value };
      }
      function ab(a2, b2) {
        b2 = b2.checked;
        null != b2 && ta(a2, "checked", b2, false);
      }
      function bb(a2, b2) {
        ab(a2, b2);
        var c2 = Sa(b2.value), d2 = b2.type;
        if (null != c2)
          if ("number" === d2) {
            if (0 === c2 && "" === a2.value || a2.value != c2)
              a2.value = "" + c2;
          } else
            a2.value !== "" + c2 && (a2.value = "" + c2);
        else if ("submit" === d2 || "reset" === d2) {
          a2.removeAttribute("value");
          return;
        }
        b2.hasOwnProperty("value") ? cb(a2, b2.type, c2) : b2.hasOwnProperty("defaultValue") && cb(a2, b2.type, Sa(b2.defaultValue));
        null == b2.checked && null != b2.defaultChecked && (a2.defaultChecked = !!b2.defaultChecked);
      }
      function db(a2, b2, c2) {
        if (b2.hasOwnProperty("value") || b2.hasOwnProperty("defaultValue")) {
          var d2 = b2.type;
          if (!("submit" !== d2 && "reset" !== d2 || void 0 !== b2.value && null !== b2.value))
            return;
          b2 = "" + a2._wrapperState.initialValue;
          c2 || b2 === a2.value || (a2.value = b2);
          a2.defaultValue = b2;
        }
        c2 = a2.name;
        "" !== c2 && (a2.name = "");
        a2.defaultChecked = !!a2._wrapperState.initialChecked;
        "" !== c2 && (a2.name = c2);
      }
      function cb(a2, b2, c2) {
        if ("number" !== b2 || Xa(a2.ownerDocument) !== a2)
          null == c2 ? a2.defaultValue = "" + a2._wrapperState.initialValue : a2.defaultValue !== "" + c2 && (a2.defaultValue = "" + c2);
      }
      var eb = Array.isArray;
      function fb(a2, b2, c2, d2) {
        a2 = a2.options;
        if (b2) {
          b2 = {};
          for (var e = 0; e < c2.length; e++)
            b2["$" + c2[e]] = true;
          for (c2 = 0; c2 < a2.length; c2++)
            e = b2.hasOwnProperty("$" + a2[c2].value), a2[c2].selected !== e && (a2[c2].selected = e), e && d2 && (a2[c2].defaultSelected = true);
        } else {
          c2 = "" + Sa(c2);
          b2 = null;
          for (e = 0; e < a2.length; e++) {
            if (a2[e].value === c2) {
              a2[e].selected = true;
              d2 && (a2[e].defaultSelected = true);
              return;
            }
            null !== b2 || a2[e].disabled || (b2 = a2[e]);
          }
          null !== b2 && (b2.selected = true);
        }
      }
      function gb(a2, b2) {
        if (null != b2.dangerouslySetInnerHTML)
          throw Error(p2(91));
        return A2({}, b2, { value: void 0, defaultValue: void 0, children: "" + a2._wrapperState.initialValue });
      }
      function hb(a2, b2) {
        var c2 = b2.value;
        if (null == c2) {
          c2 = b2.children;
          b2 = b2.defaultValue;
          if (null != c2) {
            if (null != b2)
              throw Error(p2(92));
            if (eb(c2)) {
              if (1 < c2.length)
                throw Error(p2(93));
              c2 = c2[0];
            }
            b2 = c2;
          }
          null == b2 && (b2 = "");
          c2 = b2;
        }
        a2._wrapperState = { initialValue: Sa(c2) };
      }
      function ib(a2, b2) {
        var c2 = Sa(b2.value), d2 = Sa(b2.defaultValue);
        null != c2 && (c2 = "" + c2, c2 !== a2.value && (a2.value = c2), null == b2.defaultValue && a2.defaultValue !== c2 && (a2.defaultValue = c2));
        null != d2 && (a2.defaultValue = "" + d2);
      }
      function jb(a2) {
        var b2 = a2.textContent;
        b2 === a2._wrapperState.initialValue && "" !== b2 && null !== b2 && (a2.value = b2);
      }
      function kb(a2) {
        switch (a2) {
          case "svg":
            return "http://www.w3.org/2000/svg";
          case "math":
            return "http://www.w3.org/1998/Math/MathML";
          default:
            return "http://www.w3.org/1999/xhtml";
        }
      }
      function lb(a2, b2) {
        return null == a2 || "http://www.w3.org/1999/xhtml" === a2 ? kb(b2) : "http://www.w3.org/2000/svg" === a2 && "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : a2;
      }
      var mb;
      var nb = function(a2) {
        return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b2, c2, d2, e) {
          MSApp.execUnsafeLocalFunction(function() {
            return a2(b2, c2, d2, e);
          });
        } : a2;
      }(function(a2, b2) {
        if ("http://www.w3.org/2000/svg" !== a2.namespaceURI || "innerHTML" in a2)
          a2.innerHTML = b2;
        else {
          mb = mb || document.createElement("div");
          mb.innerHTML = "<svg>" + b2.valueOf().toString() + "</svg>";
          for (b2 = mb.firstChild; a2.firstChild; )
            a2.removeChild(a2.firstChild);
          for (; b2.firstChild; )
            a2.appendChild(b2.firstChild);
        }
      });
      function ob(a2, b2) {
        if (b2) {
          var c2 = a2.firstChild;
          if (c2 && c2 === a2.lastChild && 3 === c2.nodeType) {
            c2.nodeValue = b2;
            return;
          }
        }
        a2.textContent = b2;
      }
      var pb = {
        animationIterationCount: true,
        aspectRatio: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        columns: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridArea: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowSpan: true,
        gridRowStart: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnSpan: true,
        gridColumnStart: true,
        fontWeight: true,
        lineClamp: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeDasharray: true,
        strokeDashoffset: true,
        strokeMiterlimit: true,
        strokeOpacity: true,
        strokeWidth: true
      };
      var qb = ["Webkit", "ms", "Moz", "O"];
      Object.keys(pb).forEach(function(a2) {
        qb.forEach(function(b2) {
          b2 = b2 + a2.charAt(0).toUpperCase() + a2.substring(1);
          pb[b2] = pb[a2];
        });
      });
      function rb(a2, b2, c2) {
        return null == b2 || "boolean" === typeof b2 || "" === b2 ? "" : c2 || "number" !== typeof b2 || 0 === b2 || pb.hasOwnProperty(a2) && pb[a2] ? ("" + b2).trim() : b2 + "px";
      }
      function sb(a2, b2) {
        a2 = a2.style;
        for (var c2 in b2)
          if (b2.hasOwnProperty(c2)) {
            var d2 = 0 === c2.indexOf("--"), e = rb(c2, b2[c2], d2);
            "float" === c2 && (c2 = "cssFloat");
            d2 ? a2.setProperty(c2, e) : a2[c2] = e;
          }
      }
      var tb = A2({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
      function ub(a2, b2) {
        if (b2) {
          if (tb[a2] && (null != b2.children || null != b2.dangerouslySetInnerHTML))
            throw Error(p2(137, a2));
          if (null != b2.dangerouslySetInnerHTML) {
            if (null != b2.children)
              throw Error(p2(60));
            if ("object" !== typeof b2.dangerouslySetInnerHTML || !("__html" in b2.dangerouslySetInnerHTML))
              throw Error(p2(61));
          }
          if (null != b2.style && "object" !== typeof b2.style)
            throw Error(p2(62));
        }
      }
      function vb(a2, b2) {
        if (-1 === a2.indexOf("-"))
          return "string" === typeof b2.is;
        switch (a2) {
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return false;
          default:
            return true;
        }
      }
      var wb = null;
      function xb(a2) {
        a2 = a2.target || a2.srcElement || window;
        a2.correspondingUseElement && (a2 = a2.correspondingUseElement);
        return 3 === a2.nodeType ? a2.parentNode : a2;
      }
      var yb = null;
      var zb = null;
      var Ab = null;
      function Bb(a2) {
        if (a2 = Cb(a2)) {
          if ("function" !== typeof yb)
            throw Error(p2(280));
          var b2 = a2.stateNode;
          b2 && (b2 = Db(b2), yb(a2.stateNode, a2.type, b2));
        }
      }
      function Eb(a2) {
        zb ? Ab ? Ab.push(a2) : Ab = [a2] : zb = a2;
      }
      function Fb() {
        if (zb) {
          var a2 = zb, b2 = Ab;
          Ab = zb = null;
          Bb(a2);
          if (b2)
            for (a2 = 0; a2 < b2.length; a2++)
              Bb(b2[a2]);
        }
      }
      function Gb(a2, b2) {
        return a2(b2);
      }
      function Hb() {
      }
      var Ib = false;
      function Jb(a2, b2, c2) {
        if (Ib)
          return a2(b2, c2);
        Ib = true;
        try {
          return Gb(a2, b2, c2);
        } finally {
          if (Ib = false, null !== zb || null !== Ab)
            Hb(), Fb();
        }
      }
      function Kb(a2, b2) {
        var c2 = a2.stateNode;
        if (null === c2)
          return null;
        var d2 = Db(c2);
        if (null === d2)
          return null;
        c2 = d2[b2];
        a:
          switch (b2) {
            case "onClick":
            case "onClickCapture":
            case "onDoubleClick":
            case "onDoubleClickCapture":
            case "onMouseDown":
            case "onMouseDownCapture":
            case "onMouseMove":
            case "onMouseMoveCapture":
            case "onMouseUp":
            case "onMouseUpCapture":
            case "onMouseEnter":
              (d2 = !d2.disabled) || (a2 = a2.type, d2 = !("button" === a2 || "input" === a2 || "select" === a2 || "textarea" === a2));
              a2 = !d2;
              break a;
            default:
              a2 = false;
          }
        if (a2)
          return null;
        if (c2 && "function" !== typeof c2)
          throw Error(p2(231, b2, typeof c2));
        return c2;
      }
      var Lb = false;
      if (ia)
        try {
          Mb = {};
          Object.defineProperty(Mb, "passive", { get: function() {
            Lb = true;
          } });
          window.addEventListener("test", Mb, Mb);
          window.removeEventListener("test", Mb, Mb);
        } catch (a2) {
          Lb = false;
        }
      var Mb;
      function Nb(a2, b2, c2, d2, e, f2, g2, h2, k2) {
        var l2 = Array.prototype.slice.call(arguments, 3);
        try {
          b2.apply(c2, l2);
        } catch (m) {
          this.onError(m);
        }
      }
      var Ob = false;
      var Pb = null;
      var Qb = false;
      var Rb = null;
      var Sb = { onError: function(a2) {
        Ob = true;
        Pb = a2;
      } };
      function Tb(a2, b2, c2, d2, e, f2, g2, h2, k2) {
        Ob = false;
        Pb = null;
        Nb.apply(Sb, arguments);
      }
      function Ub(a2, b2, c2, d2, e, f2, g2, h2, k2) {
        Tb.apply(this, arguments);
        if (Ob) {
          if (Ob) {
            var l2 = Pb;
            Ob = false;
            Pb = null;
          } else
            throw Error(p2(198));
          Qb || (Qb = true, Rb = l2);
        }
      }
      function Vb(a2) {
        var b2 = a2, c2 = a2;
        if (a2.alternate)
          for (; b2.return; )
            b2 = b2.return;
        else {
          a2 = b2;
          do
            b2 = a2, 0 !== (b2.flags & 4098) && (c2 = b2.return), a2 = b2.return;
          while (a2);
        }
        return 3 === b2.tag ? c2 : null;
      }
      function Wb(a2) {
        if (13 === a2.tag) {
          var b2 = a2.memoizedState;
          null === b2 && (a2 = a2.alternate, null !== a2 && (b2 = a2.memoizedState));
          if (null !== b2)
            return b2.dehydrated;
        }
        return null;
      }
      function Xb(a2) {
        if (Vb(a2) !== a2)
          throw Error(p2(188));
      }
      function Yb(a2) {
        var b2 = a2.alternate;
        if (!b2) {
          b2 = Vb(a2);
          if (null === b2)
            throw Error(p2(188));
          return b2 !== a2 ? null : a2;
        }
        for (var c2 = a2, d2 = b2; ; ) {
          var e = c2.return;
          if (null === e)
            break;
          var f2 = e.alternate;
          if (null === f2) {
            d2 = e.return;
            if (null !== d2) {
              c2 = d2;
              continue;
            }
            break;
          }
          if (e.child === f2.child) {
            for (f2 = e.child; f2; ) {
              if (f2 === c2)
                return Xb(e), a2;
              if (f2 === d2)
                return Xb(e), b2;
              f2 = f2.sibling;
            }
            throw Error(p2(188));
          }
          if (c2.return !== d2.return)
            c2 = e, d2 = f2;
          else {
            for (var g2 = false, h2 = e.child; h2; ) {
              if (h2 === c2) {
                g2 = true;
                c2 = e;
                d2 = f2;
                break;
              }
              if (h2 === d2) {
                g2 = true;
                d2 = e;
                c2 = f2;
                break;
              }
              h2 = h2.sibling;
            }
            if (!g2) {
              for (h2 = f2.child; h2; ) {
                if (h2 === c2) {
                  g2 = true;
                  c2 = f2;
                  d2 = e;
                  break;
                }
                if (h2 === d2) {
                  g2 = true;
                  d2 = f2;
                  c2 = e;
                  break;
                }
                h2 = h2.sibling;
              }
              if (!g2)
                throw Error(p2(189));
            }
          }
          if (c2.alternate !== d2)
            throw Error(p2(190));
        }
        if (3 !== c2.tag)
          throw Error(p2(188));
        return c2.stateNode.current === c2 ? a2 : b2;
      }
      function Zb(a2) {
        a2 = Yb(a2);
        return null !== a2 ? $b(a2) : null;
      }
      function $b(a2) {
        if (5 === a2.tag || 6 === a2.tag)
          return a2;
        for (a2 = a2.child; null !== a2; ) {
          var b2 = $b(a2);
          if (null !== b2)
            return b2;
          a2 = a2.sibling;
        }
        return null;
      }
      var ac = ca.unstable_scheduleCallback;
      var bc = ca.unstable_cancelCallback;
      var cc = ca.unstable_shouldYield;
      var dc = ca.unstable_requestPaint;
      var B2 = ca.unstable_now;
      var ec = ca.unstable_getCurrentPriorityLevel;
      var fc = ca.unstable_ImmediatePriority;
      var gc = ca.unstable_UserBlockingPriority;
      var hc = ca.unstable_NormalPriority;
      var ic = ca.unstable_LowPriority;
      var jc = ca.unstable_IdlePriority;
      var kc = null;
      var lc = null;
      function mc(a2) {
        if (lc && "function" === typeof lc.onCommitFiberRoot)
          try {
            lc.onCommitFiberRoot(kc, a2, void 0, 128 === (a2.current.flags & 128));
          } catch (b2) {
          }
      }
      var oc = Math.clz32 ? Math.clz32 : nc;
      var pc = Math.log;
      var qc = Math.LN2;
      function nc(a2) {
        a2 >>>= 0;
        return 0 === a2 ? 32 : 31 - (pc(a2) / qc | 0) | 0;
      }
      var rc = 64;
      var sc = 4194304;
      function tc(a2) {
        switch (a2 & -a2) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 4:
            return 4;
          case 8:
            return 8;
          case 16:
            return 16;
          case 32:
            return 32;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return a2 & 4194240;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            return a2 & 130023424;
          case 134217728:
            return 134217728;
          case 268435456:
            return 268435456;
          case 536870912:
            return 536870912;
          case 1073741824:
            return 1073741824;
          default:
            return a2;
        }
      }
      function uc(a2, b2) {
        var c2 = a2.pendingLanes;
        if (0 === c2)
          return 0;
        var d2 = 0, e = a2.suspendedLanes, f2 = a2.pingedLanes, g2 = c2 & 268435455;
        if (0 !== g2) {
          var h2 = g2 & ~e;
          0 !== h2 ? d2 = tc(h2) : (f2 &= g2, 0 !== f2 && (d2 = tc(f2)));
        } else
          g2 = c2 & ~e, 0 !== g2 ? d2 = tc(g2) : 0 !== f2 && (d2 = tc(f2));
        if (0 === d2)
          return 0;
        if (0 !== b2 && b2 !== d2 && 0 === (b2 & e) && (e = d2 & -d2, f2 = b2 & -b2, e >= f2 || 16 === e && 0 !== (f2 & 4194240)))
          return b2;
        0 !== (d2 & 4) && (d2 |= c2 & 16);
        b2 = a2.entangledLanes;
        if (0 !== b2)
          for (a2 = a2.entanglements, b2 &= d2; 0 < b2; )
            c2 = 31 - oc(b2), e = 1 << c2, d2 |= a2[c2], b2 &= ~e;
        return d2;
      }
      function vc(a2, b2) {
        switch (a2) {
          case 1:
          case 2:
          case 4:
            return b2 + 250;
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return b2 + 5e3;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            return -1;
          case 134217728:
          case 268435456:
          case 536870912:
          case 1073741824:
            return -1;
          default:
            return -1;
        }
      }
      function wc(a2, b2) {
        for (var c2 = a2.suspendedLanes, d2 = a2.pingedLanes, e = a2.expirationTimes, f2 = a2.pendingLanes; 0 < f2; ) {
          var g2 = 31 - oc(f2), h2 = 1 << g2, k2 = e[g2];
          if (-1 === k2) {
            if (0 === (h2 & c2) || 0 !== (h2 & d2))
              e[g2] = vc(h2, b2);
          } else
            k2 <= b2 && (a2.expiredLanes |= h2);
          f2 &= ~h2;
        }
      }
      function xc(a2) {
        a2 = a2.pendingLanes & -1073741825;
        return 0 !== a2 ? a2 : a2 & 1073741824 ? 1073741824 : 0;
      }
      function yc() {
        var a2 = rc;
        rc <<= 1;
        0 === (rc & 4194240) && (rc = 64);
        return a2;
      }
      function zc(a2) {
        for (var b2 = [], c2 = 0; 31 > c2; c2++)
          b2.push(a2);
        return b2;
      }
      function Ac(a2, b2, c2) {
        a2.pendingLanes |= b2;
        536870912 !== b2 && (a2.suspendedLanes = 0, a2.pingedLanes = 0);
        a2 = a2.eventTimes;
        b2 = 31 - oc(b2);
        a2[b2] = c2;
      }
      function Bc(a2, b2) {
        var c2 = a2.pendingLanes & ~b2;
        a2.pendingLanes = b2;
        a2.suspendedLanes = 0;
        a2.pingedLanes = 0;
        a2.expiredLanes &= b2;
        a2.mutableReadLanes &= b2;
        a2.entangledLanes &= b2;
        b2 = a2.entanglements;
        var d2 = a2.eventTimes;
        for (a2 = a2.expirationTimes; 0 < c2; ) {
          var e = 31 - oc(c2), f2 = 1 << e;
          b2[e] = 0;
          d2[e] = -1;
          a2[e] = -1;
          c2 &= ~f2;
        }
      }
      function Cc(a2, b2) {
        var c2 = a2.entangledLanes |= b2;
        for (a2 = a2.entanglements; c2; ) {
          var d2 = 31 - oc(c2), e = 1 << d2;
          e & b2 | a2[d2] & b2 && (a2[d2] |= b2);
          c2 &= ~e;
        }
      }
      var C = 0;
      function Dc(a2) {
        a2 &= -a2;
        return 1 < a2 ? 4 < a2 ? 0 !== (a2 & 268435455) ? 16 : 536870912 : 4 : 1;
      }
      var Ec;
      var Fc;
      var Gc;
      var Hc;
      var Ic;
      var Jc = false;
      var Kc = [];
      var Lc = null;
      var Mc = null;
      var Nc = null;
      var Oc = /* @__PURE__ */ new Map();
      var Pc = /* @__PURE__ */ new Map();
      var Qc = [];
      var Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
      function Sc(a2, b2) {
        switch (a2) {
          case "focusin":
          case "focusout":
            Lc = null;
            break;
          case "dragenter":
          case "dragleave":
            Mc = null;
            break;
          case "mouseover":
          case "mouseout":
            Nc = null;
            break;
          case "pointerover":
          case "pointerout":
            Oc.delete(b2.pointerId);
            break;
          case "gotpointercapture":
          case "lostpointercapture":
            Pc.delete(b2.pointerId);
        }
      }
      function Tc(a2, b2, c2, d2, e, f2) {
        if (null === a2 || a2.nativeEvent !== f2)
          return a2 = { blockedOn: b2, domEventName: c2, eventSystemFlags: d2, nativeEvent: f2, targetContainers: [e] }, null !== b2 && (b2 = Cb(b2), null !== b2 && Fc(b2)), a2;
        a2.eventSystemFlags |= d2;
        b2 = a2.targetContainers;
        null !== e && -1 === b2.indexOf(e) && b2.push(e);
        return a2;
      }
      function Uc(a2, b2, c2, d2, e) {
        switch (b2) {
          case "focusin":
            return Lc = Tc(Lc, a2, b2, c2, d2, e), true;
          case "dragenter":
            return Mc = Tc(Mc, a2, b2, c2, d2, e), true;
          case "mouseover":
            return Nc = Tc(Nc, a2, b2, c2, d2, e), true;
          case "pointerover":
            var f2 = e.pointerId;
            Oc.set(f2, Tc(Oc.get(f2) || null, a2, b2, c2, d2, e));
            return true;
          case "gotpointercapture":
            return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a2, b2, c2, d2, e)), true;
        }
        return false;
      }
      function Vc(a2) {
        var b2 = Wc(a2.target);
        if (null !== b2) {
          var c2 = Vb(b2);
          if (null !== c2) {
            if (b2 = c2.tag, 13 === b2) {
              if (b2 = Wb(c2), null !== b2) {
                a2.blockedOn = b2;
                Ic(a2.priority, function() {
                  Gc(c2);
                });
                return;
              }
            } else if (3 === b2 && c2.stateNode.current.memoizedState.isDehydrated) {
              a2.blockedOn = 3 === c2.tag ? c2.stateNode.containerInfo : null;
              return;
            }
          }
        }
        a2.blockedOn = null;
      }
      function Xc(a2) {
        if (null !== a2.blockedOn)
          return false;
        for (var b2 = a2.targetContainers; 0 < b2.length; ) {
          var c2 = Yc(a2.domEventName, a2.eventSystemFlags, b2[0], a2.nativeEvent);
          if (null === c2) {
            c2 = a2.nativeEvent;
            var d2 = new c2.constructor(c2.type, c2);
            wb = d2;
            c2.target.dispatchEvent(d2);
            wb = null;
          } else
            return b2 = Cb(c2), null !== b2 && Fc(b2), a2.blockedOn = c2, false;
          b2.shift();
        }
        return true;
      }
      function Zc(a2, b2, c2) {
        Xc(a2) && c2.delete(b2);
      }
      function $c() {
        Jc = false;
        null !== Lc && Xc(Lc) && (Lc = null);
        null !== Mc && Xc(Mc) && (Mc = null);
        null !== Nc && Xc(Nc) && (Nc = null);
        Oc.forEach(Zc);
        Pc.forEach(Zc);
      }
      function ad(a2, b2) {
        a2.blockedOn === b2 && (a2.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
      }
      function bd(a2) {
        function b2(b3) {
          return ad(b3, a2);
        }
        if (0 < Kc.length) {
          ad(Kc[0], a2);
          for (var c2 = 1; c2 < Kc.length; c2++) {
            var d2 = Kc[c2];
            d2.blockedOn === a2 && (d2.blockedOn = null);
          }
        }
        null !== Lc && ad(Lc, a2);
        null !== Mc && ad(Mc, a2);
        null !== Nc && ad(Nc, a2);
        Oc.forEach(b2);
        Pc.forEach(b2);
        for (c2 = 0; c2 < Qc.length; c2++)
          d2 = Qc[c2], d2.blockedOn === a2 && (d2.blockedOn = null);
        for (; 0 < Qc.length && (c2 = Qc[0], null === c2.blockedOn); )
          Vc(c2), null === c2.blockedOn && Qc.shift();
      }
      var cd = ua.ReactCurrentBatchConfig;
      var dd = true;
      function ed(a2, b2, c2, d2) {
        var e = C, f2 = cd.transition;
        cd.transition = null;
        try {
          C = 1, fd(a2, b2, c2, d2);
        } finally {
          C = e, cd.transition = f2;
        }
      }
      function gd(a2, b2, c2, d2) {
        var e = C, f2 = cd.transition;
        cd.transition = null;
        try {
          C = 4, fd(a2, b2, c2, d2);
        } finally {
          C = e, cd.transition = f2;
        }
      }
      function fd(a2, b2, c2, d2) {
        if (dd) {
          var e = Yc(a2, b2, c2, d2);
          if (null === e)
            hd(a2, b2, d2, id, c2), Sc(a2, d2);
          else if (Uc(e, a2, b2, c2, d2))
            d2.stopPropagation();
          else if (Sc(a2, d2), b2 & 4 && -1 < Rc.indexOf(a2)) {
            for (; null !== e; ) {
              var f2 = Cb(e);
              null !== f2 && Ec(f2);
              f2 = Yc(a2, b2, c2, d2);
              null === f2 && hd(a2, b2, d2, id, c2);
              if (f2 === e)
                break;
              e = f2;
            }
            null !== e && d2.stopPropagation();
          } else
            hd(a2, b2, d2, null, c2);
        }
      }
      var id = null;
      function Yc(a2, b2, c2, d2) {
        id = null;
        a2 = xb(d2);
        a2 = Wc(a2);
        if (null !== a2)
          if (b2 = Vb(a2), null === b2)
            a2 = null;
          else if (c2 = b2.tag, 13 === c2) {
            a2 = Wb(b2);
            if (null !== a2)
              return a2;
            a2 = null;
          } else if (3 === c2) {
            if (b2.stateNode.current.memoizedState.isDehydrated)
              return 3 === b2.tag ? b2.stateNode.containerInfo : null;
            a2 = null;
          } else
            b2 !== a2 && (a2 = null);
        id = a2;
        return null;
      }
      function jd(a2) {
        switch (a2) {
          case "cancel":
          case "click":
          case "close":
          case "contextmenu":
          case "copy":
          case "cut":
          case "auxclick":
          case "dblclick":
          case "dragend":
          case "dragstart":
          case "drop":
          case "focusin":
          case "focusout":
          case "input":
          case "invalid":
          case "keydown":
          case "keypress":
          case "keyup":
          case "mousedown":
          case "mouseup":
          case "paste":
          case "pause":
          case "play":
          case "pointercancel":
          case "pointerdown":
          case "pointerup":
          case "ratechange":
          case "reset":
          case "resize":
          case "seeked":
          case "submit":
          case "touchcancel":
          case "touchend":
          case "touchstart":
          case "volumechange":
          case "change":
          case "selectionchange":
          case "textInput":
          case "compositionstart":
          case "compositionend":
          case "compositionupdate":
          case "beforeblur":
          case "afterblur":
          case "beforeinput":
          case "blur":
          case "fullscreenchange":
          case "focus":
          case "hashchange":
          case "popstate":
          case "select":
          case "selectstart":
            return 1;
          case "drag":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "mousemove":
          case "mouseout":
          case "mouseover":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "scroll":
          case "toggle":
          case "touchmove":
          case "wheel":
          case "mouseenter":
          case "mouseleave":
          case "pointerenter":
          case "pointerleave":
            return 4;
          case "message":
            switch (ec()) {
              case fc:
                return 1;
              case gc:
                return 4;
              case hc:
              case ic:
                return 16;
              case jc:
                return 536870912;
              default:
                return 16;
            }
          default:
            return 16;
        }
      }
      var kd = null;
      var ld = null;
      var md = null;
      function nd() {
        if (md)
          return md;
        var a2, b2 = ld, c2 = b2.length, d2, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
        for (a2 = 0; a2 < c2 && b2[a2] === e[a2]; a2++)
          ;
        var g2 = c2 - a2;
        for (d2 = 1; d2 <= g2 && b2[c2 - d2] === e[f2 - d2]; d2++)
          ;
        return md = e.slice(a2, 1 < d2 ? 1 - d2 : void 0);
      }
      function od(a2) {
        var b2 = a2.keyCode;
        "charCode" in a2 ? (a2 = a2.charCode, 0 === a2 && 13 === b2 && (a2 = 13)) : a2 = b2;
        10 === a2 && (a2 = 13);
        return 32 <= a2 || 13 === a2 ? a2 : 0;
      }
      function pd() {
        return true;
      }
      function qd() {
        return false;
      }
      function rd(a2) {
        function b2(b3, d2, e, f2, g2) {
          this._reactName = b3;
          this._targetInst = e;
          this.type = d2;
          this.nativeEvent = f2;
          this.target = g2;
          this.currentTarget = null;
          for (var c2 in a2)
            a2.hasOwnProperty(c2) && (b3 = a2[c2], this[c2] = b3 ? b3(f2) : f2[c2]);
          this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
          this.isPropagationStopped = qd;
          return this;
        }
        A2(b2.prototype, { preventDefault: function() {
          this.defaultPrevented = true;
          var a3 = this.nativeEvent;
          a3 && (a3.preventDefault ? a3.preventDefault() : "unknown" !== typeof a3.returnValue && (a3.returnValue = false), this.isDefaultPrevented = pd);
        }, stopPropagation: function() {
          var a3 = this.nativeEvent;
          a3 && (a3.stopPropagation ? a3.stopPropagation() : "unknown" !== typeof a3.cancelBubble && (a3.cancelBubble = true), this.isPropagationStopped = pd);
        }, persist: function() {
        }, isPersistent: pd });
        return b2;
      }
      var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a2) {
        return a2.timeStamp || Date.now();
      }, defaultPrevented: 0, isTrusted: 0 };
      var td = rd(sd);
      var ud = A2({}, sd, { view: 0, detail: 0 });
      var vd = rd(ud);
      var wd;
      var xd;
      var yd;
      var Ad = A2({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a2) {
        return void 0 === a2.relatedTarget ? a2.fromElement === a2.srcElement ? a2.toElement : a2.fromElement : a2.relatedTarget;
      }, movementX: function(a2) {
        if ("movementX" in a2)
          return a2.movementX;
        a2 !== yd && (yd && "mousemove" === a2.type ? (wd = a2.screenX - yd.screenX, xd = a2.screenY - yd.screenY) : xd = wd = 0, yd = a2);
        return wd;
      }, movementY: function(a2) {
        return "movementY" in a2 ? a2.movementY : xd;
      } });
      var Bd = rd(Ad);
      var Cd = A2({}, Ad, { dataTransfer: 0 });
      var Dd = rd(Cd);
      var Ed = A2({}, ud, { relatedTarget: 0 });
      var Fd = rd(Ed);
      var Gd = A2({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 });
      var Hd = rd(Gd);
      var Id = A2({}, sd, { clipboardData: function(a2) {
        return "clipboardData" in a2 ? a2.clipboardData : window.clipboardData;
      } });
      var Jd = rd(Id);
      var Kd = A2({}, sd, { data: 0 });
      var Ld = rd(Kd);
      var Md = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
      };
      var Nd = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
      };
      var Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
      function Pd(a2) {
        var b2 = this.nativeEvent;
        return b2.getModifierState ? b2.getModifierState(a2) : (a2 = Od[a2]) ? !!b2[a2] : false;
      }
      function zd() {
        return Pd;
      }
      var Qd = A2({}, ud, { key: function(a2) {
        if (a2.key) {
          var b2 = Md[a2.key] || a2.key;
          if ("Unidentified" !== b2)
            return b2;
        }
        return "keypress" === a2.type ? (a2 = od(a2), 13 === a2 ? "Enter" : String.fromCharCode(a2)) : "keydown" === a2.type || "keyup" === a2.type ? Nd[a2.keyCode] || "Unidentified" : "";
      }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a2) {
        return "keypress" === a2.type ? od(a2) : 0;
      }, keyCode: function(a2) {
        return "keydown" === a2.type || "keyup" === a2.type ? a2.keyCode : 0;
      }, which: function(a2) {
        return "keypress" === a2.type ? od(a2) : "keydown" === a2.type || "keyup" === a2.type ? a2.keyCode : 0;
      } });
      var Rd = rd(Qd);
      var Sd = A2({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 });
      var Td = rd(Sd);
      var Ud = A2({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd });
      var Vd = rd(Ud);
      var Wd = A2({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 });
      var Xd = rd(Wd);
      var Yd = A2({}, Ad, {
        deltaX: function(a2) {
          return "deltaX" in a2 ? a2.deltaX : "wheelDeltaX" in a2 ? -a2.wheelDeltaX : 0;
        },
        deltaY: function(a2) {
          return "deltaY" in a2 ? a2.deltaY : "wheelDeltaY" in a2 ? -a2.wheelDeltaY : "wheelDelta" in a2 ? -a2.wheelDelta : 0;
        },
        deltaZ: 0,
        deltaMode: 0
      });
      var Zd = rd(Yd);
      var $d = [9, 13, 27, 32];
      var ae = ia && "CompositionEvent" in window;
      var be = null;
      ia && "documentMode" in document && (be = document.documentMode);
      var ce = ia && "TextEvent" in window && !be;
      var de = ia && (!ae || be && 8 < be && 11 >= be);
      var ee = String.fromCharCode(32);
      var fe = false;
      function ge(a2, b2) {
        switch (a2) {
          case "keyup":
            return -1 !== $d.indexOf(b2.keyCode);
          case "keydown":
            return 229 !== b2.keyCode;
          case "keypress":
          case "mousedown":
          case "focusout":
            return true;
          default:
            return false;
        }
      }
      function he(a2) {
        a2 = a2.detail;
        return "object" === typeof a2 && "data" in a2 ? a2.data : null;
      }
      var ie = false;
      function je(a2, b2) {
        switch (a2) {
          case "compositionend":
            return he(b2);
          case "keypress":
            if (32 !== b2.which)
              return null;
            fe = true;
            return ee;
          case "textInput":
            return a2 = b2.data, a2 === ee && fe ? null : a2;
          default:
            return null;
        }
      }
      function ke(a2, b2) {
        if (ie)
          return "compositionend" === a2 || !ae && ge(a2, b2) ? (a2 = nd(), md = ld = kd = null, ie = false, a2) : null;
        switch (a2) {
          case "paste":
            return null;
          case "keypress":
            if (!(b2.ctrlKey || b2.altKey || b2.metaKey) || b2.ctrlKey && b2.altKey) {
              if (b2.char && 1 < b2.char.length)
                return b2.char;
              if (b2.which)
                return String.fromCharCode(b2.which);
            }
            return null;
          case "compositionend":
            return de && "ko" !== b2.locale ? null : b2.data;
          default:
            return null;
        }
      }
      var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
      function me(a2) {
        var b2 = a2 && a2.nodeName && a2.nodeName.toLowerCase();
        return "input" === b2 ? !!le[a2.type] : "textarea" === b2 ? true : false;
      }
      function ne(a2, b2, c2, d2) {
        Eb(d2);
        b2 = oe(b2, "onChange");
        0 < b2.length && (c2 = new td("onChange", "change", null, c2, d2), a2.push({ event: c2, listeners: b2 }));
      }
      var pe = null;
      var qe = null;
      function re(a2) {
        se(a2, 0);
      }
      function te(a2) {
        var b2 = ue(a2);
        if (Wa(b2))
          return a2;
      }
      function ve(a2, b2) {
        if ("change" === a2)
          return b2;
      }
      var we = false;
      if (ia) {
        if (ia) {
          ye = "oninput" in document;
          if (!ye) {
            ze = document.createElement("div");
            ze.setAttribute("oninput", "return;");
            ye = "function" === typeof ze.oninput;
          }
          xe = ye;
        } else
          xe = false;
        we = xe && (!document.documentMode || 9 < document.documentMode);
      }
      var xe;
      var ye;
      var ze;
      function Ae() {
        pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
      }
      function Be(a2) {
        if ("value" === a2.propertyName && te(qe)) {
          var b2 = [];
          ne(b2, qe, a2, xb(a2));
          Jb(re, b2);
        }
      }
      function Ce(a2, b2, c2) {
        "focusin" === a2 ? (Ae(), pe = b2, qe = c2, pe.attachEvent("onpropertychange", Be)) : "focusout" === a2 && Ae();
      }
      function De(a2) {
        if ("selectionchange" === a2 || "keyup" === a2 || "keydown" === a2)
          return te(qe);
      }
      function Ee(a2, b2) {
        if ("click" === a2)
          return te(b2);
      }
      function Fe(a2, b2) {
        if ("input" === a2 || "change" === a2)
          return te(b2);
      }
      function Ge(a2, b2) {
        return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
      }
      var He = "function" === typeof Object.is ? Object.is : Ge;
      function Ie(a2, b2) {
        if (He(a2, b2))
          return true;
        if ("object" !== typeof a2 || null === a2 || "object" !== typeof b2 || null === b2)
          return false;
        var c2 = Object.keys(a2), d2 = Object.keys(b2);
        if (c2.length !== d2.length)
          return false;
        for (d2 = 0; d2 < c2.length; d2++) {
          var e = c2[d2];
          if (!ja.call(b2, e) || !He(a2[e], b2[e]))
            return false;
        }
        return true;
      }
      function Je(a2) {
        for (; a2 && a2.firstChild; )
          a2 = a2.firstChild;
        return a2;
      }
      function Ke(a2, b2) {
        var c2 = Je(a2);
        a2 = 0;
        for (var d2; c2; ) {
          if (3 === c2.nodeType) {
            d2 = a2 + c2.textContent.length;
            if (a2 <= b2 && d2 >= b2)
              return { node: c2, offset: b2 - a2 };
            a2 = d2;
          }
          a: {
            for (; c2; ) {
              if (c2.nextSibling) {
                c2 = c2.nextSibling;
                break a;
              }
              c2 = c2.parentNode;
            }
            c2 = void 0;
          }
          c2 = Je(c2);
        }
      }
      function Le(a2, b2) {
        return a2 && b2 ? a2 === b2 ? true : a2 && 3 === a2.nodeType ? false : b2 && 3 === b2.nodeType ? Le(a2, b2.parentNode) : "contains" in a2 ? a2.contains(b2) : a2.compareDocumentPosition ? !!(a2.compareDocumentPosition(b2) & 16) : false : false;
      }
      function Me() {
        for (var a2 = window, b2 = Xa(); b2 instanceof a2.HTMLIFrameElement; ) {
          try {
            var c2 = "string" === typeof b2.contentWindow.location.href;
          } catch (d2) {
            c2 = false;
          }
          if (c2)
            a2 = b2.contentWindow;
          else
            break;
          b2 = Xa(a2.document);
        }
        return b2;
      }
      function Ne(a2) {
        var b2 = a2 && a2.nodeName && a2.nodeName.toLowerCase();
        return b2 && ("input" === b2 && ("text" === a2.type || "search" === a2.type || "tel" === a2.type || "url" === a2.type || "password" === a2.type) || "textarea" === b2 || "true" === a2.contentEditable);
      }
      function Oe(a2) {
        var b2 = Me(), c2 = a2.focusedElem, d2 = a2.selectionRange;
        if (b2 !== c2 && c2 && c2.ownerDocument && Le(c2.ownerDocument.documentElement, c2)) {
          if (null !== d2 && Ne(c2)) {
            if (b2 = d2.start, a2 = d2.end, void 0 === a2 && (a2 = b2), "selectionStart" in c2)
              c2.selectionStart = b2, c2.selectionEnd = Math.min(a2, c2.value.length);
            else if (a2 = (b2 = c2.ownerDocument || document) && b2.defaultView || window, a2.getSelection) {
              a2 = a2.getSelection();
              var e = c2.textContent.length, f2 = Math.min(d2.start, e);
              d2 = void 0 === d2.end ? f2 : Math.min(d2.end, e);
              !a2.extend && f2 > d2 && (e = d2, d2 = f2, f2 = e);
              e = Ke(c2, f2);
              var g2 = Ke(
                c2,
                d2
              );
              e && g2 && (1 !== a2.rangeCount || a2.anchorNode !== e.node || a2.anchorOffset !== e.offset || a2.focusNode !== g2.node || a2.focusOffset !== g2.offset) && (b2 = b2.createRange(), b2.setStart(e.node, e.offset), a2.removeAllRanges(), f2 > d2 ? (a2.addRange(b2), a2.extend(g2.node, g2.offset)) : (b2.setEnd(g2.node, g2.offset), a2.addRange(b2)));
            }
          }
          b2 = [];
          for (a2 = c2; a2 = a2.parentNode; )
            1 === a2.nodeType && b2.push({ element: a2, left: a2.scrollLeft, top: a2.scrollTop });
          "function" === typeof c2.focus && c2.focus();
          for (c2 = 0; c2 < b2.length; c2++)
            a2 = b2[c2], a2.element.scrollLeft = a2.left, a2.element.scrollTop = a2.top;
        }
      }
      var Pe = ia && "documentMode" in document && 11 >= document.documentMode;
      var Qe = null;
      var Re = null;
      var Se = null;
      var Te = false;
      function Ue(a2, b2, c2) {
        var d2 = c2.window === c2 ? c2.document : 9 === c2.nodeType ? c2 : c2.ownerDocument;
        Te || null == Qe || Qe !== Xa(d2) || (d2 = Qe, "selectionStart" in d2 && Ne(d2) ? d2 = { start: d2.selectionStart, end: d2.selectionEnd } : (d2 = (d2.ownerDocument && d2.ownerDocument.defaultView || window).getSelection(), d2 = { anchorNode: d2.anchorNode, anchorOffset: d2.anchorOffset, focusNode: d2.focusNode, focusOffset: d2.focusOffset }), Se && Ie(Se, d2) || (Se = d2, d2 = oe(Re, "onSelect"), 0 < d2.length && (b2 = new td("onSelect", "select", null, b2, c2), a2.push({ event: b2, listeners: d2 }), b2.target = Qe)));
      }
      function Ve(a2, b2) {
        var c2 = {};
        c2[a2.toLowerCase()] = b2.toLowerCase();
        c2["Webkit" + a2] = "webkit" + b2;
        c2["Moz" + a2] = "moz" + b2;
        return c2;
      }
      var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") };
      var Xe = {};
      var Ye = {};
      ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
      function Ze(a2) {
        if (Xe[a2])
          return Xe[a2];
        if (!We[a2])
          return a2;
        var b2 = We[a2], c2;
        for (c2 in b2)
          if (b2.hasOwnProperty(c2) && c2 in Ye)
            return Xe[a2] = b2[c2];
        return a2;
      }
      var $e = Ze("animationend");
      var af = Ze("animationiteration");
      var bf = Ze("animationstart");
      var cf = Ze("transitionend");
      var df = /* @__PURE__ */ new Map();
      var ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
      function ff(a2, b2) {
        df.set(a2, b2);
        fa(b2, [a2]);
      }
      for (gf = 0; gf < ef.length; gf++) {
        hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
        ff(jf, "on" + kf);
      }
      var hf;
      var jf;
      var kf;
      var gf;
      ff($e, "onAnimationEnd");
      ff(af, "onAnimationIteration");
      ff(bf, "onAnimationStart");
      ff("dblclick", "onDoubleClick");
      ff("focusin", "onFocus");
      ff("focusout", "onBlur");
      ff(cf, "onTransitionEnd");
      ha("onMouseEnter", ["mouseout", "mouseover"]);
      ha("onMouseLeave", ["mouseout", "mouseover"]);
      ha("onPointerEnter", ["pointerout", "pointerover"]);
      ha("onPointerLeave", ["pointerout", "pointerover"]);
      fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
      fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
      fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
      fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
      fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
      fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
      var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ");
      var mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
      function nf(a2, b2, c2) {
        var d2 = a2.type || "unknown-event";
        a2.currentTarget = c2;
        Ub(d2, b2, void 0, a2);
        a2.currentTarget = null;
      }
      function se(a2, b2) {
        b2 = 0 !== (b2 & 4);
        for (var c2 = 0; c2 < a2.length; c2++) {
          var d2 = a2[c2], e = d2.event;
          d2 = d2.listeners;
          a: {
            var f2 = void 0;
            if (b2)
              for (var g2 = d2.length - 1; 0 <= g2; g2--) {
                var h2 = d2[g2], k2 = h2.instance, l2 = h2.currentTarget;
                h2 = h2.listener;
                if (k2 !== f2 && e.isPropagationStopped())
                  break a;
                nf(e, h2, l2);
                f2 = k2;
              }
            else
              for (g2 = 0; g2 < d2.length; g2++) {
                h2 = d2[g2];
                k2 = h2.instance;
                l2 = h2.currentTarget;
                h2 = h2.listener;
                if (k2 !== f2 && e.isPropagationStopped())
                  break a;
                nf(e, h2, l2);
                f2 = k2;
              }
          }
        }
        if (Qb)
          throw a2 = Rb, Qb = false, Rb = null, a2;
      }
      function D2(a2, b2) {
        var c2 = b2[of];
        void 0 === c2 && (c2 = b2[of] = /* @__PURE__ */ new Set());
        var d2 = a2 + "__bubble";
        c2.has(d2) || (pf(b2, a2, 2, false), c2.add(d2));
      }
      function qf(a2, b2, c2) {
        var d2 = 0;
        b2 && (d2 |= 4);
        pf(c2, a2, d2, b2);
      }
      var rf = "_reactListening" + Math.random().toString(36).slice(2);
      function sf(a2) {
        if (!a2[rf]) {
          a2[rf] = true;
          da.forEach(function(b3) {
            "selectionchange" !== b3 && (mf.has(b3) || qf(b3, false, a2), qf(b3, true, a2));
          });
          var b2 = 9 === a2.nodeType ? a2 : a2.ownerDocument;
          null === b2 || b2[rf] || (b2[rf] = true, qf("selectionchange", false, b2));
        }
      }
      function pf(a2, b2, c2, d2) {
        switch (jd(b2)) {
          case 1:
            var e = ed;
            break;
          case 4:
            e = gd;
            break;
          default:
            e = fd;
        }
        c2 = e.bind(null, b2, c2, a2);
        e = void 0;
        !Lb || "touchstart" !== b2 && "touchmove" !== b2 && "wheel" !== b2 || (e = true);
        d2 ? void 0 !== e ? a2.addEventListener(b2, c2, { capture: true, passive: e }) : a2.addEventListener(b2, c2, true) : void 0 !== e ? a2.addEventListener(b2, c2, { passive: e }) : a2.addEventListener(b2, c2, false);
      }
      function hd(a2, b2, c2, d2, e) {
        var f2 = d2;
        if (0 === (b2 & 1) && 0 === (b2 & 2) && null !== d2)
          a:
            for (; ; ) {
              if (null === d2)
                return;
              var g2 = d2.tag;
              if (3 === g2 || 4 === g2) {
                var h2 = d2.stateNode.containerInfo;
                if (h2 === e || 8 === h2.nodeType && h2.parentNode === e)
                  break;
                if (4 === g2)
                  for (g2 = d2.return; null !== g2; ) {
                    var k2 = g2.tag;
                    if (3 === k2 || 4 === k2) {
                      if (k2 = g2.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e)
                        return;
                    }
                    g2 = g2.return;
                  }
                for (; null !== h2; ) {
                  g2 = Wc(h2);
                  if (null === g2)
                    return;
                  k2 = g2.tag;
                  if (5 === k2 || 6 === k2) {
                    d2 = f2 = g2;
                    continue a;
                  }
                  h2 = h2.parentNode;
                }
              }
              d2 = d2.return;
            }
        Jb(function() {
          var d3 = f2, e2 = xb(c2), g3 = [];
          a: {
            var h3 = df.get(a2);
            if (void 0 !== h3) {
              var k3 = td, n2 = a2;
              switch (a2) {
                case "keypress":
                  if (0 === od(c2))
                    break a;
                case "keydown":
                case "keyup":
                  k3 = Rd;
                  break;
                case "focusin":
                  n2 = "focus";
                  k3 = Fd;
                  break;
                case "focusout":
                  n2 = "blur";
                  k3 = Fd;
                  break;
                case "beforeblur":
                case "afterblur":
                  k3 = Fd;
                  break;
                case "click":
                  if (2 === c2.button)
                    break a;
                case "auxclick":
                case "dblclick":
                case "mousedown":
                case "mousemove":
                case "mouseup":
                case "mouseout":
                case "mouseover":
                case "contextmenu":
                  k3 = Bd;
                  break;
                case "drag":
                case "dragend":
                case "dragenter":
                case "dragexit":
                case "dragleave":
                case "dragover":
                case "dragstart":
                case "drop":
                  k3 = Dd;
                  break;
                case "touchcancel":
                case "touchend":
                case "touchmove":
                case "touchstart":
                  k3 = Vd;
                  break;
                case $e:
                case af:
                case bf:
                  k3 = Hd;
                  break;
                case cf:
                  k3 = Xd;
                  break;
                case "scroll":
                  k3 = vd;
                  break;
                case "wheel":
                  k3 = Zd;
                  break;
                case "copy":
                case "cut":
                case "paste":
                  k3 = Jd;
                  break;
                case "gotpointercapture":
                case "lostpointercapture":
                case "pointercancel":
                case "pointerdown":
                case "pointermove":
                case "pointerout":
                case "pointerover":
                case "pointerup":
                  k3 = Td;
              }
              var t2 = 0 !== (b2 & 4), J = !t2 && "scroll" === a2, x2 = t2 ? null !== h3 ? h3 + "Capture" : null : h3;
              t2 = [];
              for (var w2 = d3, u2; null !== w2; ) {
                u2 = w2;
                var F2 = u2.stateNode;
                5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
                if (J)
                  break;
                w2 = w2.return;
              }
              0 < t2.length && (h3 = new k3(h3, n2, null, c2, e2), g3.push({ event: h3, listeners: t2 }));
            }
          }
          if (0 === (b2 & 7)) {
            a: {
              h3 = "mouseover" === a2 || "pointerover" === a2;
              k3 = "mouseout" === a2 || "pointerout" === a2;
              if (h3 && c2 !== wb && (n2 = c2.relatedTarget || c2.fromElement) && (Wc(n2) || n2[uf]))
                break a;
              if (k3 || h3) {
                h3 = e2.window === e2 ? e2 : (h3 = e2.ownerDocument) ? h3.defaultView || h3.parentWindow : window;
                if (k3) {
                  if (n2 = c2.relatedTarget || c2.toElement, k3 = d3, n2 = n2 ? Wc(n2) : null, null !== n2 && (J = Vb(n2), n2 !== J || 5 !== n2.tag && 6 !== n2.tag))
                    n2 = null;
                } else
                  k3 = null, n2 = d3;
                if (k3 !== n2) {
                  t2 = Bd;
                  F2 = "onMouseLeave";
                  x2 = "onMouseEnter";
                  w2 = "mouse";
                  if ("pointerout" === a2 || "pointerover" === a2)
                    t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
                  J = null == k3 ? h3 : ue(k3);
                  u2 = null == n2 ? h3 : ue(n2);
                  h3 = new t2(F2, w2 + "leave", k3, c2, e2);
                  h3.target = J;
                  h3.relatedTarget = u2;
                  F2 = null;
                  Wc(e2) === d3 && (t2 = new t2(x2, w2 + "enter", n2, c2, e2), t2.target = u2, t2.relatedTarget = J, F2 = t2);
                  J = F2;
                  if (k3 && n2)
                    b: {
                      t2 = k3;
                      x2 = n2;
                      w2 = 0;
                      for (u2 = t2; u2; u2 = vf(u2))
                        w2++;
                      u2 = 0;
                      for (F2 = x2; F2; F2 = vf(F2))
                        u2++;
                      for (; 0 < w2 - u2; )
                        t2 = vf(t2), w2--;
                      for (; 0 < u2 - w2; )
                        x2 = vf(x2), u2--;
                      for (; w2--; ) {
                        if (t2 === x2 || null !== x2 && t2 === x2.alternate)
                          break b;
                        t2 = vf(t2);
                        x2 = vf(x2);
                      }
                      t2 = null;
                    }
                  else
                    t2 = null;
                  null !== k3 && wf(g3, h3, k3, t2, false);
                  null !== n2 && null !== J && wf(g3, J, n2, t2, true);
                }
              }
            }
            a: {
              h3 = d3 ? ue(d3) : window;
              k3 = h3.nodeName && h3.nodeName.toLowerCase();
              if ("select" === k3 || "input" === k3 && "file" === h3.type)
                var na = ve;
              else if (me(h3))
                if (we)
                  na = Fe;
                else {
                  na = De;
                  var xa = Ce;
                }
              else
                (k3 = h3.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h3.type || "radio" === h3.type) && (na = Ee);
              if (na && (na = na(a2, d3))) {
                ne(g3, na, c2, e2);
                break a;
              }
              xa && xa(a2, h3, d3);
              "focusout" === a2 && (xa = h3._wrapperState) && xa.controlled && "number" === h3.type && cb(h3, "number", h3.value);
            }
            xa = d3 ? ue(d3) : window;
            switch (a2) {
              case "focusin":
                if (me(xa) || "true" === xa.contentEditable)
                  Qe = xa, Re = d3, Se = null;
                break;
              case "focusout":
                Se = Re = Qe = null;
                break;
              case "mousedown":
                Te = true;
                break;
              case "contextmenu":
              case "mouseup":
              case "dragend":
                Te = false;
                Ue(g3, c2, e2);
                break;
              case "selectionchange":
                if (Pe)
                  break;
              case "keydown":
              case "keyup":
                Ue(g3, c2, e2);
            }
            var $a;
            if (ae)
              b: {
                switch (a2) {
                  case "compositionstart":
                    var ba = "onCompositionStart";
                    break b;
                  case "compositionend":
                    ba = "onCompositionEnd";
                    break b;
                  case "compositionupdate":
                    ba = "onCompositionUpdate";
                    break b;
                }
                ba = void 0;
              }
            else
              ie ? ge(a2, c2) && (ba = "onCompositionEnd") : "keydown" === a2 && 229 === c2.keyCode && (ba = "onCompositionStart");
            ba && (de && "ko" !== c2.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d3, ba), 0 < xa.length && (ba = new Ld(ba, a2, null, c2, e2), g3.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c2), null !== $a && (ba.data = $a))));
            if ($a = ce ? je(a2, c2) : ke(a2, c2))
              d3 = oe(d3, "onBeforeInput"), 0 < d3.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c2, e2), g3.push({ event: e2, listeners: d3 }), e2.data = $a);
          }
          se(g3, b2);
        });
      }
      function tf(a2, b2, c2) {
        return { instance: a2, listener: b2, currentTarget: c2 };
      }
      function oe(a2, b2) {
        for (var c2 = b2 + "Capture", d2 = []; null !== a2; ) {
          var e = a2, f2 = e.stateNode;
          5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a2, c2), null != f2 && d2.unshift(tf(a2, f2, e)), f2 = Kb(a2, b2), null != f2 && d2.push(tf(a2, f2, e)));
          a2 = a2.return;
        }
        return d2;
      }
      function vf(a2) {
        if (null === a2)
          return null;
        do
          a2 = a2.return;
        while (a2 && 5 !== a2.tag);
        return a2 ? a2 : null;
      }
      function wf(a2, b2, c2, d2, e) {
        for (var f2 = b2._reactName, g2 = []; null !== c2 && c2 !== d2; ) {
          var h2 = c2, k2 = h2.alternate, l2 = h2.stateNode;
          if (null !== k2 && k2 === d2)
            break;
          5 === h2.tag && null !== l2 && (h2 = l2, e ? (k2 = Kb(c2, f2), null != k2 && g2.unshift(tf(c2, k2, h2))) : e || (k2 = Kb(c2, f2), null != k2 && g2.push(tf(c2, k2, h2))));
          c2 = c2.return;
        }
        0 !== g2.length && a2.push({ event: b2, listeners: g2 });
      }
      var xf = /\r\n?/g;
      var yf = /\u0000|\uFFFD/g;
      function zf(a2) {
        return ("string" === typeof a2 ? a2 : "" + a2).replace(xf, "\n").replace(yf, "");
      }
      function Af(a2, b2, c2) {
        b2 = zf(b2);
        if (zf(a2) !== b2 && c2)
          throw Error(p2(425));
      }
      function Bf() {
      }
      var Cf = null;
      var Df = null;
      function Ef(a2, b2) {
        return "textarea" === a2 || "noscript" === a2 || "string" === typeof b2.children || "number" === typeof b2.children || "object" === typeof b2.dangerouslySetInnerHTML && null !== b2.dangerouslySetInnerHTML && null != b2.dangerouslySetInnerHTML.__html;
      }
      var Ff = "function" === typeof setTimeout ? setTimeout : void 0;
      var Gf = "function" === typeof clearTimeout ? clearTimeout : void 0;
      var Hf = "function" === typeof Promise ? Promise : void 0;
      var Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a2) {
        return Hf.resolve(null).then(a2).catch(If);
      } : Ff;
      function If(a2) {
        setTimeout(function() {
          throw a2;
        });
      }
      function Kf(a2, b2) {
        var c2 = b2, d2 = 0;
        do {
          var e = c2.nextSibling;
          a2.removeChild(c2);
          if (e && 8 === e.nodeType)
            if (c2 = e.data, "/$" === c2) {
              if (0 === d2) {
                a2.removeChild(e);
                bd(b2);
                return;
              }
              d2--;
            } else
              "$" !== c2 && "$?" !== c2 && "$!" !== c2 || d2++;
          c2 = e;
        } while (c2);
        bd(b2);
      }
      function Lf(a2) {
        for (; null != a2; a2 = a2.nextSibling) {
          var b2 = a2.nodeType;
          if (1 === b2 || 3 === b2)
            break;
          if (8 === b2) {
            b2 = a2.data;
            if ("$" === b2 || "$!" === b2 || "$?" === b2)
              break;
            if ("/$" === b2)
              return null;
          }
        }
        return a2;
      }
      function Mf(a2) {
        a2 = a2.previousSibling;
        for (var b2 = 0; a2; ) {
          if (8 === a2.nodeType) {
            var c2 = a2.data;
            if ("$" === c2 || "$!" === c2 || "$?" === c2) {
              if (0 === b2)
                return a2;
              b2--;
            } else
              "/$" === c2 && b2++;
          }
          a2 = a2.previousSibling;
        }
        return null;
      }
      var Nf = Math.random().toString(36).slice(2);
      var Of = "__reactFiber$" + Nf;
      var Pf = "__reactProps$" + Nf;
      var uf = "__reactContainer$" + Nf;
      var of = "__reactEvents$" + Nf;
      var Qf = "__reactListeners$" + Nf;
      var Rf = "__reactHandles$" + Nf;
      function Wc(a2) {
        var b2 = a2[Of];
        if (b2)
          return b2;
        for (var c2 = a2.parentNode; c2; ) {
          if (b2 = c2[uf] || c2[Of]) {
            c2 = b2.alternate;
            if (null !== b2.child || null !== c2 && null !== c2.child)
              for (a2 = Mf(a2); null !== a2; ) {
                if (c2 = a2[Of])
                  return c2;
                a2 = Mf(a2);
              }
            return b2;
          }
          a2 = c2;
          c2 = a2.parentNode;
        }
        return null;
      }
      function Cb(a2) {
        a2 = a2[Of] || a2[uf];
        return !a2 || 5 !== a2.tag && 6 !== a2.tag && 13 !== a2.tag && 3 !== a2.tag ? null : a2;
      }
      function ue(a2) {
        if (5 === a2.tag || 6 === a2.tag)
          return a2.stateNode;
        throw Error(p2(33));
      }
      function Db(a2) {
        return a2[Pf] || null;
      }
      var Sf = [];
      var Tf = -1;
      function Uf(a2) {
        return { current: a2 };
      }
      function E2(a2) {
        0 > Tf || (a2.current = Sf[Tf], Sf[Tf] = null, Tf--);
      }
      function G2(a2, b2) {
        Tf++;
        Sf[Tf] = a2.current;
        a2.current = b2;
      }
      var Vf = {};
      var H2 = Uf(Vf);
      var Wf = Uf(false);
      var Xf = Vf;
      function Yf(a2, b2) {
        var c2 = a2.type.contextTypes;
        if (!c2)
          return Vf;
        var d2 = a2.stateNode;
        if (d2 && d2.__reactInternalMemoizedUnmaskedChildContext === b2)
          return d2.__reactInternalMemoizedMaskedChildContext;
        var e = {}, f2;
        for (f2 in c2)
          e[f2] = b2[f2];
        d2 && (a2 = a2.stateNode, a2.__reactInternalMemoizedUnmaskedChildContext = b2, a2.__reactInternalMemoizedMaskedChildContext = e);
        return e;
      }
      function Zf(a2) {
        a2 = a2.childContextTypes;
        return null !== a2 && void 0 !== a2;
      }
      function $f() {
        E2(Wf);
        E2(H2);
      }
      function ag(a2, b2, c2) {
        if (H2.current !== Vf)
          throw Error(p2(168));
        G2(H2, b2);
        G2(Wf, c2);
      }
      function bg(a2, b2, c2) {
        var d2 = a2.stateNode;
        b2 = b2.childContextTypes;
        if ("function" !== typeof d2.getChildContext)
          return c2;
        d2 = d2.getChildContext();
        for (var e in d2)
          if (!(e in b2))
            throw Error(p2(108, Ra(a2) || "Unknown", e));
        return A2({}, c2, d2);
      }
      function cg(a2) {
        a2 = (a2 = a2.stateNode) && a2.__reactInternalMemoizedMergedChildContext || Vf;
        Xf = H2.current;
        G2(H2, a2);
        G2(Wf, Wf.current);
        return true;
      }
      function dg(a2, b2, c2) {
        var d2 = a2.stateNode;
        if (!d2)
          throw Error(p2(169));
        c2 ? (a2 = bg(a2, b2, Xf), d2.__reactInternalMemoizedMergedChildContext = a2, E2(Wf), E2(H2), G2(H2, a2)) : E2(Wf);
        G2(Wf, c2);
      }
      var eg = null;
      var fg = false;
      var gg = false;
      function hg(a2) {
        null === eg ? eg = [a2] : eg.push(a2);
      }
      function ig(a2) {
        fg = true;
        hg(a2);
      }
      function jg() {
        if (!gg && null !== eg) {
          gg = true;
          var a2 = 0, b2 = C;
          try {
            var c2 = eg;
            for (C = 1; a2 < c2.length; a2++) {
              var d2 = c2[a2];
              do
                d2 = d2(true);
              while (null !== d2);
            }
            eg = null;
            fg = false;
          } catch (e) {
            throw null !== eg && (eg = eg.slice(a2 + 1)), ac(fc, jg), e;
          } finally {
            C = b2, gg = false;
          }
        }
        return null;
      }
      var kg = [];
      var lg = 0;
      var mg = null;
      var ng = 0;
      var og = [];
      var pg = 0;
      var qg = null;
      var rg = 1;
      var sg = "";
      function tg(a2, b2) {
        kg[lg++] = ng;
        kg[lg++] = mg;
        mg = a2;
        ng = b2;
      }
      function ug(a2, b2, c2) {
        og[pg++] = rg;
        og[pg++] = sg;
        og[pg++] = qg;
        qg = a2;
        var d2 = rg;
        a2 = sg;
        var e = 32 - oc(d2) - 1;
        d2 &= ~(1 << e);
        c2 += 1;
        var f2 = 32 - oc(b2) + e;
        if (30 < f2) {
          var g2 = e - e % 5;
          f2 = (d2 & (1 << g2) - 1).toString(32);
          d2 >>= g2;
          e -= g2;
          rg = 1 << 32 - oc(b2) + e | c2 << e | d2;
          sg = f2 + a2;
        } else
          rg = 1 << f2 | c2 << e | d2, sg = a2;
      }
      function vg(a2) {
        null !== a2.return && (tg(a2, 1), ug(a2, 1, 0));
      }
      function wg(a2) {
        for (; a2 === mg; )
          mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
        for (; a2 === qg; )
          qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
      }
      var xg = null;
      var yg = null;
      var I2 = false;
      var zg = null;
      function Ag(a2, b2) {
        var c2 = Bg(5, null, null, 0);
        c2.elementType = "DELETED";
        c2.stateNode = b2;
        c2.return = a2;
        b2 = a2.deletions;
        null === b2 ? (a2.deletions = [c2], a2.flags |= 16) : b2.push(c2);
      }
      function Cg(a2, b2) {
        switch (a2.tag) {
          case 5:
            var c2 = a2.type;
            b2 = 1 !== b2.nodeType || c2.toLowerCase() !== b2.nodeName.toLowerCase() ? null : b2;
            return null !== b2 ? (a2.stateNode = b2, xg = a2, yg = Lf(b2.firstChild), true) : false;
          case 6:
            return b2 = "" === a2.pendingProps || 3 !== b2.nodeType ? null : b2, null !== b2 ? (a2.stateNode = b2, xg = a2, yg = null, true) : false;
          case 13:
            return b2 = 8 !== b2.nodeType ? null : b2, null !== b2 ? (c2 = null !== qg ? { id: rg, overflow: sg } : null, a2.memoizedState = { dehydrated: b2, treeContext: c2, retryLane: 1073741824 }, c2 = Bg(18, null, null, 0), c2.stateNode = b2, c2.return = a2, a2.child = c2, xg = a2, yg = null, true) : false;
          default:
            return false;
        }
      }
      function Dg(a2) {
        return 0 !== (a2.mode & 1) && 0 === (a2.flags & 128);
      }
      function Eg(a2) {
        if (I2) {
          var b2 = yg;
          if (b2) {
            var c2 = b2;
            if (!Cg(a2, b2)) {
              if (Dg(a2))
                throw Error(p2(418));
              b2 = Lf(c2.nextSibling);
              var d2 = xg;
              b2 && Cg(a2, b2) ? Ag(d2, c2) : (a2.flags = a2.flags & -4097 | 2, I2 = false, xg = a2);
            }
          } else {
            if (Dg(a2))
              throw Error(p2(418));
            a2.flags = a2.flags & -4097 | 2;
            I2 = false;
            xg = a2;
          }
        }
      }
      function Fg(a2) {
        for (a2 = a2.return; null !== a2 && 5 !== a2.tag && 3 !== a2.tag && 13 !== a2.tag; )
          a2 = a2.return;
        xg = a2;
      }
      function Gg(a2) {
        if (a2 !== xg)
          return false;
        if (!I2)
          return Fg(a2), I2 = true, false;
        var b2;
        (b2 = 3 !== a2.tag) && !(b2 = 5 !== a2.tag) && (b2 = a2.type, b2 = "head" !== b2 && "body" !== b2 && !Ef(a2.type, a2.memoizedProps));
        if (b2 && (b2 = yg)) {
          if (Dg(a2))
            throw Hg(), Error(p2(418));
          for (; b2; )
            Ag(a2, b2), b2 = Lf(b2.nextSibling);
        }
        Fg(a2);
        if (13 === a2.tag) {
          a2 = a2.memoizedState;
          a2 = null !== a2 ? a2.dehydrated : null;
          if (!a2)
            throw Error(p2(317));
          a: {
            a2 = a2.nextSibling;
            for (b2 = 0; a2; ) {
              if (8 === a2.nodeType) {
                var c2 = a2.data;
                if ("/$" === c2) {
                  if (0 === b2) {
                    yg = Lf(a2.nextSibling);
                    break a;
                  }
                  b2--;
                } else
                  "$" !== c2 && "$!" !== c2 && "$?" !== c2 || b2++;
              }
              a2 = a2.nextSibling;
            }
            yg = null;
          }
        } else
          yg = xg ? Lf(a2.stateNode.nextSibling) : null;
        return true;
      }
      function Hg() {
        for (var a2 = yg; a2; )
          a2 = Lf(a2.nextSibling);
      }
      function Ig() {
        yg = xg = null;
        I2 = false;
      }
      function Jg(a2) {
        null === zg ? zg = [a2] : zg.push(a2);
      }
      var Kg = ua.ReactCurrentBatchConfig;
      function Lg(a2, b2) {
        if (a2 && a2.defaultProps) {
          b2 = A2({}, b2);
          a2 = a2.defaultProps;
          for (var c2 in a2)
            void 0 === b2[c2] && (b2[c2] = a2[c2]);
          return b2;
        }
        return b2;
      }
      var Mg = Uf(null);
      var Ng = null;
      var Og = null;
      var Pg = null;
      function Qg() {
        Pg = Og = Ng = null;
      }
      function Rg(a2) {
        var b2 = Mg.current;
        E2(Mg);
        a2._currentValue = b2;
      }
      function Sg(a2, b2, c2) {
        for (; null !== a2; ) {
          var d2 = a2.alternate;
          (a2.childLanes & b2) !== b2 ? (a2.childLanes |= b2, null !== d2 && (d2.childLanes |= b2)) : null !== d2 && (d2.childLanes & b2) !== b2 && (d2.childLanes |= b2);
          if (a2 === c2)
            break;
          a2 = a2.return;
        }
      }
      function Tg(a2, b2) {
        Ng = a2;
        Pg = Og = null;
        a2 = a2.dependencies;
        null !== a2 && null !== a2.firstContext && (0 !== (a2.lanes & b2) && (Ug = true), a2.firstContext = null);
      }
      function Vg(a2) {
        var b2 = a2._currentValue;
        if (Pg !== a2)
          if (a2 = { context: a2, memoizedValue: b2, next: null }, null === Og) {
            if (null === Ng)
              throw Error(p2(308));
            Og = a2;
            Ng.dependencies = { lanes: 0, firstContext: a2 };
          } else
            Og = Og.next = a2;
        return b2;
      }
      var Wg = null;
      function Xg(a2) {
        null === Wg ? Wg = [a2] : Wg.push(a2);
      }
      function Yg(a2, b2, c2, d2) {
        var e = b2.interleaved;
        null === e ? (c2.next = c2, Xg(b2)) : (c2.next = e.next, e.next = c2);
        b2.interleaved = c2;
        return Zg(a2, d2);
      }
      function Zg(a2, b2) {
        a2.lanes |= b2;
        var c2 = a2.alternate;
        null !== c2 && (c2.lanes |= b2);
        c2 = a2;
        for (a2 = a2.return; null !== a2; )
          a2.childLanes |= b2, c2 = a2.alternate, null !== c2 && (c2.childLanes |= b2), c2 = a2, a2 = a2.return;
        return 3 === c2.tag ? c2.stateNode : null;
      }
      var $g = false;
      function ah(a2) {
        a2.updateQueue = { baseState: a2.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
      }
      function bh(a2, b2) {
        a2 = a2.updateQueue;
        b2.updateQueue === a2 && (b2.updateQueue = { baseState: a2.baseState, firstBaseUpdate: a2.firstBaseUpdate, lastBaseUpdate: a2.lastBaseUpdate, shared: a2.shared, effects: a2.effects });
      }
      function ch(a2, b2) {
        return { eventTime: a2, lane: b2, tag: 0, payload: null, callback: null, next: null };
      }
      function dh(a2, b2, c2) {
        var d2 = a2.updateQueue;
        if (null === d2)
          return null;
        d2 = d2.shared;
        if (0 !== (K & 2)) {
          var e = d2.pending;
          null === e ? b2.next = b2 : (b2.next = e.next, e.next = b2);
          d2.pending = b2;
          return Zg(a2, c2);
        }
        e = d2.interleaved;
        null === e ? (b2.next = b2, Xg(d2)) : (b2.next = e.next, e.next = b2);
        d2.interleaved = b2;
        return Zg(a2, c2);
      }
      function eh(a2, b2, c2) {
        b2 = b2.updateQueue;
        if (null !== b2 && (b2 = b2.shared, 0 !== (c2 & 4194240))) {
          var d2 = b2.lanes;
          d2 &= a2.pendingLanes;
          c2 |= d2;
          b2.lanes = c2;
          Cc(a2, c2);
        }
      }
      function fh(a2, b2) {
        var c2 = a2.updateQueue, d2 = a2.alternate;
        if (null !== d2 && (d2 = d2.updateQueue, c2 === d2)) {
          var e = null, f2 = null;
          c2 = c2.firstBaseUpdate;
          if (null !== c2) {
            do {
              var g2 = { eventTime: c2.eventTime, lane: c2.lane, tag: c2.tag, payload: c2.payload, callback: c2.callback, next: null };
              null === f2 ? e = f2 = g2 : f2 = f2.next = g2;
              c2 = c2.next;
            } while (null !== c2);
            null === f2 ? e = f2 = b2 : f2 = f2.next = b2;
          } else
            e = f2 = b2;
          c2 = { baseState: d2.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d2.shared, effects: d2.effects };
          a2.updateQueue = c2;
          return;
        }
        a2 = c2.lastBaseUpdate;
        null === a2 ? c2.firstBaseUpdate = b2 : a2.next = b2;
        c2.lastBaseUpdate = b2;
      }
      function gh(a2, b2, c2, d2) {
        var e = a2.updateQueue;
        $g = false;
        var f2 = e.firstBaseUpdate, g2 = e.lastBaseUpdate, h2 = e.shared.pending;
        if (null !== h2) {
          e.shared.pending = null;
          var k2 = h2, l2 = k2.next;
          k2.next = null;
          null === g2 ? f2 = l2 : g2.next = l2;
          g2 = k2;
          var m = a2.alternate;
          null !== m && (m = m.updateQueue, h2 = m.lastBaseUpdate, h2 !== g2 && (null === h2 ? m.firstBaseUpdate = l2 : h2.next = l2, m.lastBaseUpdate = k2));
        }
        if (null !== f2) {
          var q2 = e.baseState;
          g2 = 0;
          m = l2 = k2 = null;
          h2 = f2;
          do {
            var r2 = h2.lane, y2 = h2.eventTime;
            if ((d2 & r2) === r2) {
              null !== m && (m = m.next = {
                eventTime: y2,
                lane: 0,
                tag: h2.tag,
                payload: h2.payload,
                callback: h2.callback,
                next: null
              });
              a: {
                var n2 = a2, t2 = h2;
                r2 = b2;
                y2 = c2;
                switch (t2.tag) {
                  case 1:
                    n2 = t2.payload;
                    if ("function" === typeof n2) {
                      q2 = n2.call(y2, q2, r2);
                      break a;
                    }
                    q2 = n2;
                    break a;
                  case 3:
                    n2.flags = n2.flags & -65537 | 128;
                  case 0:
                    n2 = t2.payload;
                    r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
                    if (null === r2 || void 0 === r2)
                      break a;
                    q2 = A2({}, q2, r2);
                    break a;
                  case 2:
                    $g = true;
                }
              }
              null !== h2.callback && 0 !== h2.lane && (a2.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h2] : r2.push(h2));
            } else
              y2 = { eventTime: y2, lane: r2, tag: h2.tag, payload: h2.payload, callback: h2.callback, next: null }, null === m ? (l2 = m = y2, k2 = q2) : m = m.next = y2, g2 |= r2;
            h2 = h2.next;
            if (null === h2)
              if (h2 = e.shared.pending, null === h2)
                break;
              else
                r2 = h2, h2 = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
          } while (1);
          null === m && (k2 = q2);
          e.baseState = k2;
          e.firstBaseUpdate = l2;
          e.lastBaseUpdate = m;
          b2 = e.shared.interleaved;
          if (null !== b2) {
            e = b2;
            do
              g2 |= e.lane, e = e.next;
            while (e !== b2);
          } else
            null === f2 && (e.shared.lanes = 0);
          hh |= g2;
          a2.lanes = g2;
          a2.memoizedState = q2;
        }
      }
      function ih(a2, b2, c2) {
        a2 = b2.effects;
        b2.effects = null;
        if (null !== a2)
          for (b2 = 0; b2 < a2.length; b2++) {
            var d2 = a2[b2], e = d2.callback;
            if (null !== e) {
              d2.callback = null;
              d2 = c2;
              if ("function" !== typeof e)
                throw Error(p2(191, e));
              e.call(d2);
            }
          }
      }
      var jh = new aa.Component().refs;
      function kh(a2, b2, c2, d2) {
        b2 = a2.memoizedState;
        c2 = c2(d2, b2);
        c2 = null === c2 || void 0 === c2 ? b2 : A2({}, b2, c2);
        a2.memoizedState = c2;
        0 === a2.lanes && (a2.updateQueue.baseState = c2);
      }
      var nh = { isMounted: function(a2) {
        return (a2 = a2._reactInternals) ? Vb(a2) === a2 : false;
      }, enqueueSetState: function(a2, b2, c2) {
        a2 = a2._reactInternals;
        var d2 = L2(), e = lh(a2), f2 = ch(d2, e);
        f2.payload = b2;
        void 0 !== c2 && null !== c2 && (f2.callback = c2);
        b2 = dh(a2, f2, e);
        null !== b2 && (mh(b2, a2, e, d2), eh(b2, a2, e));
      }, enqueueReplaceState: function(a2, b2, c2) {
        a2 = a2._reactInternals;
        var d2 = L2(), e = lh(a2), f2 = ch(d2, e);
        f2.tag = 1;
        f2.payload = b2;
        void 0 !== c2 && null !== c2 && (f2.callback = c2);
        b2 = dh(a2, f2, e);
        null !== b2 && (mh(b2, a2, e, d2), eh(b2, a2, e));
      }, enqueueForceUpdate: function(a2, b2) {
        a2 = a2._reactInternals;
        var c2 = L2(), d2 = lh(a2), e = ch(c2, d2);
        e.tag = 2;
        void 0 !== b2 && null !== b2 && (e.callback = b2);
        b2 = dh(a2, e, d2);
        null !== b2 && (mh(b2, a2, d2, c2), eh(b2, a2, d2));
      } };
      function oh(a2, b2, c2, d2, e, f2, g2) {
        a2 = a2.stateNode;
        return "function" === typeof a2.shouldComponentUpdate ? a2.shouldComponentUpdate(d2, f2, g2) : b2.prototype && b2.prototype.isPureReactComponent ? !Ie(c2, d2) || !Ie(e, f2) : true;
      }
      function ph(a2, b2, c2) {
        var d2 = false, e = Vf;
        var f2 = b2.contextType;
        "object" === typeof f2 && null !== f2 ? f2 = Vg(f2) : (e = Zf(b2) ? Xf : H2.current, d2 = b2.contextTypes, f2 = (d2 = null !== d2 && void 0 !== d2) ? Yf(a2, e) : Vf);
        b2 = new b2(c2, f2);
        a2.memoizedState = null !== b2.state && void 0 !== b2.state ? b2.state : null;
        b2.updater = nh;
        a2.stateNode = b2;
        b2._reactInternals = a2;
        d2 && (a2 = a2.stateNode, a2.__reactInternalMemoizedUnmaskedChildContext = e, a2.__reactInternalMemoizedMaskedChildContext = f2);
        return b2;
      }
      function qh(a2, b2, c2, d2) {
        a2 = b2.state;
        "function" === typeof b2.componentWillReceiveProps && b2.componentWillReceiveProps(c2, d2);
        "function" === typeof b2.UNSAFE_componentWillReceiveProps && b2.UNSAFE_componentWillReceiveProps(c2, d2);
        b2.state !== a2 && nh.enqueueReplaceState(b2, b2.state, null);
      }
      function rh(a2, b2, c2, d2) {
        var e = a2.stateNode;
        e.props = c2;
        e.state = a2.memoizedState;
        e.refs = jh;
        ah(a2);
        var f2 = b2.contextType;
        "object" === typeof f2 && null !== f2 ? e.context = Vg(f2) : (f2 = Zf(b2) ? Xf : H2.current, e.context = Yf(a2, f2));
        e.state = a2.memoizedState;
        f2 = b2.getDerivedStateFromProps;
        "function" === typeof f2 && (kh(a2, b2, f2, c2), e.state = a2.memoizedState);
        "function" === typeof b2.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b2 = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b2 !== e.state && nh.enqueueReplaceState(e, e.state, null), gh(a2, c2, e, d2), e.state = a2.memoizedState);
        "function" === typeof e.componentDidMount && (a2.flags |= 4194308);
      }
      function sh(a2, b2, c2) {
        a2 = c2.ref;
        if (null !== a2 && "function" !== typeof a2 && "object" !== typeof a2) {
          if (c2._owner) {
            c2 = c2._owner;
            if (c2) {
              if (1 !== c2.tag)
                throw Error(p2(309));
              var d2 = c2.stateNode;
            }
            if (!d2)
              throw Error(p2(147, a2));
            var e = d2, f2 = "" + a2;
            if (null !== b2 && null !== b2.ref && "function" === typeof b2.ref && b2.ref._stringRef === f2)
              return b2.ref;
            b2 = function(a3) {
              var b3 = e.refs;
              b3 === jh && (b3 = e.refs = {});
              null === a3 ? delete b3[f2] : b3[f2] = a3;
            };
            b2._stringRef = f2;
            return b2;
          }
          if ("string" !== typeof a2)
            throw Error(p2(284));
          if (!c2._owner)
            throw Error(p2(290, a2));
        }
        return a2;
      }
      function th(a2, b2) {
        a2 = Object.prototype.toString.call(b2);
        throw Error(p2(31, "[object Object]" === a2 ? "object with keys {" + Object.keys(b2).join(", ") + "}" : a2));
      }
      function uh(a2) {
        var b2 = a2._init;
        return b2(a2._payload);
      }
      function vh(a2) {
        function b2(b3, c3) {
          if (a2) {
            var d3 = b3.deletions;
            null === d3 ? (b3.deletions = [c3], b3.flags |= 16) : d3.push(c3);
          }
        }
        function c2(c3, d3) {
          if (!a2)
            return null;
          for (; null !== d3; )
            b2(c3, d3), d3 = d3.sibling;
          return null;
        }
        function d2(a3, b3) {
          for (a3 = /* @__PURE__ */ new Map(); null !== b3; )
            null !== b3.key ? a3.set(b3.key, b3) : a3.set(b3.index, b3), b3 = b3.sibling;
          return a3;
        }
        function e(a3, b3) {
          a3 = wh(a3, b3);
          a3.index = 0;
          a3.sibling = null;
          return a3;
        }
        function f2(b3, c3, d3) {
          b3.index = d3;
          if (!a2)
            return b3.flags |= 1048576, c3;
          d3 = b3.alternate;
          if (null !== d3)
            return d3 = d3.index, d3 < c3 ? (b3.flags |= 2, c3) : d3;
          b3.flags |= 2;
          return c3;
        }
        function g2(b3) {
          a2 && null === b3.alternate && (b3.flags |= 2);
          return b3;
        }
        function h2(a3, b3, c3, d3) {
          if (null === b3 || 6 !== b3.tag)
            return b3 = xh(c3, a3.mode, d3), b3.return = a3, b3;
          b3 = e(b3, c3);
          b3.return = a3;
          return b3;
        }
        function k2(a3, b3, c3, d3) {
          var f3 = c3.type;
          if (f3 === ya)
            return m(a3, b3, c3.props.children, d3, c3.key);
          if (null !== b3 && (b3.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && uh(f3) === b3.type))
            return d3 = e(b3, c3.props), d3.ref = sh(a3, b3, c3), d3.return = a3, d3;
          d3 = yh(c3.type, c3.key, c3.props, null, a3.mode, d3);
          d3.ref = sh(a3, b3, c3);
          d3.return = a3;
          return d3;
        }
        function l2(a3, b3, c3, d3) {
          if (null === b3 || 4 !== b3.tag || b3.stateNode.containerInfo !== c3.containerInfo || b3.stateNode.implementation !== c3.implementation)
            return b3 = zh(c3, a3.mode, d3), b3.return = a3, b3;
          b3 = e(b3, c3.children || []);
          b3.return = a3;
          return b3;
        }
        function m(a3, b3, c3, d3, f3) {
          if (null === b3 || 7 !== b3.tag)
            return b3 = Ah(c3, a3.mode, d3, f3), b3.return = a3, b3;
          b3 = e(b3, c3);
          b3.return = a3;
          return b3;
        }
        function q2(a3, b3, c3) {
          if ("string" === typeof b3 && "" !== b3 || "number" === typeof b3)
            return b3 = xh("" + b3, a3.mode, c3), b3.return = a3, b3;
          if ("object" === typeof b3 && null !== b3) {
            switch (b3.$$typeof) {
              case va:
                return c3 = yh(b3.type, b3.key, b3.props, null, a3.mode, c3), c3.ref = sh(a3, null, b3), c3.return = a3, c3;
              case wa:
                return b3 = zh(b3, a3.mode, c3), b3.return = a3, b3;
              case Ha:
                var d3 = b3._init;
                return q2(a3, d3(b3._payload), c3);
            }
            if (eb(b3) || Ka(b3))
              return b3 = Ah(b3, a3.mode, c3, null), b3.return = a3, b3;
            th(a3, b3);
          }
          return null;
        }
        function r2(a3, b3, c3, d3) {
          var e2 = null !== b3 ? b3.key : null;
          if ("string" === typeof c3 && "" !== c3 || "number" === typeof c3)
            return null !== e2 ? null : h2(a3, b3, "" + c3, d3);
          if ("object" === typeof c3 && null !== c3) {
            switch (c3.$$typeof) {
              case va:
                return c3.key === e2 ? k2(a3, b3, c3, d3) : null;
              case wa:
                return c3.key === e2 ? l2(a3, b3, c3, d3) : null;
              case Ha:
                return e2 = c3._init, r2(
                  a3,
                  b3,
                  e2(c3._payload),
                  d3
                );
            }
            if (eb(c3) || Ka(c3))
              return null !== e2 ? null : m(a3, b3, c3, d3, null);
            th(a3, c3);
          }
          return null;
        }
        function y2(a3, b3, c3, d3, e2) {
          if ("string" === typeof d3 && "" !== d3 || "number" === typeof d3)
            return a3 = a3.get(c3) || null, h2(b3, a3, "" + d3, e2);
          if ("object" === typeof d3 && null !== d3) {
            switch (d3.$$typeof) {
              case va:
                return a3 = a3.get(null === d3.key ? c3 : d3.key) || null, k2(b3, a3, d3, e2);
              case wa:
                return a3 = a3.get(null === d3.key ? c3 : d3.key) || null, l2(b3, a3, d3, e2);
              case Ha:
                var f3 = d3._init;
                return y2(a3, b3, c3, f3(d3._payload), e2);
            }
            if (eb(d3) || Ka(d3))
              return a3 = a3.get(c3) || null, m(b3, a3, d3, e2, null);
            th(b3, d3);
          }
          return null;
        }
        function n2(e2, g3, h3, k3) {
          for (var l3 = null, m2 = null, u2 = g3, w2 = g3 = 0, x2 = null; null !== u2 && w2 < h3.length; w2++) {
            u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
            var n3 = r2(e2, u2, h3[w2], k3);
            if (null === n3) {
              null === u2 && (u2 = x2);
              break;
            }
            a2 && u2 && null === n3.alternate && b2(e2, u2);
            g3 = f2(n3, g3, w2);
            null === m2 ? l3 = n3 : m2.sibling = n3;
            m2 = n3;
            u2 = x2;
          }
          if (w2 === h3.length)
            return c2(e2, u2), I2 && tg(e2, w2), l3;
          if (null === u2) {
            for (; w2 < h3.length; w2++)
              u2 = q2(e2, h3[w2], k3), null !== u2 && (g3 = f2(u2, g3, w2), null === m2 ? l3 = u2 : m2.sibling = u2, m2 = u2);
            I2 && tg(e2, w2);
            return l3;
          }
          for (u2 = d2(e2, u2); w2 < h3.length; w2++)
            x2 = y2(u2, e2, w2, h3[w2], k3), null !== x2 && (a2 && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g3 = f2(x2, g3, w2), null === m2 ? l3 = x2 : m2.sibling = x2, m2 = x2);
          a2 && u2.forEach(function(a3) {
            return b2(e2, a3);
          });
          I2 && tg(e2, w2);
          return l3;
        }
        function t2(e2, g3, h3, k3) {
          var l3 = Ka(h3);
          if ("function" !== typeof l3)
            throw Error(p2(150));
          h3 = l3.call(h3);
          if (null == h3)
            throw Error(p2(151));
          for (var u2 = l3 = null, m2 = g3, w2 = g3 = 0, x2 = null, n3 = h3.next(); null !== m2 && !n3.done; w2++, n3 = h3.next()) {
            m2.index > w2 ? (x2 = m2, m2 = null) : x2 = m2.sibling;
            var t3 = r2(e2, m2, n3.value, k3);
            if (null === t3) {
              null === m2 && (m2 = x2);
              break;
            }
            a2 && m2 && null === t3.alternate && b2(e2, m2);
            g3 = f2(t3, g3, w2);
            null === u2 ? l3 = t3 : u2.sibling = t3;
            u2 = t3;
            m2 = x2;
          }
          if (n3.done)
            return c2(
              e2,
              m2
            ), I2 && tg(e2, w2), l3;
          if (null === m2) {
            for (; !n3.done; w2++, n3 = h3.next())
              n3 = q2(e2, n3.value, k3), null !== n3 && (g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
            I2 && tg(e2, w2);
            return l3;
          }
          for (m2 = d2(e2, m2); !n3.done; w2++, n3 = h3.next())
            n3 = y2(m2, e2, w2, n3.value, k3), null !== n3 && (a2 && null !== n3.alternate && m2.delete(null === n3.key ? w2 : n3.key), g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
          a2 && m2.forEach(function(a3) {
            return b2(e2, a3);
          });
          I2 && tg(e2, w2);
          return l3;
        }
        function J(a3, d3, f3, h3) {
          "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
          if ("object" === typeof f3 && null !== f3) {
            switch (f3.$$typeof) {
              case va:
                a: {
                  for (var k3 = f3.key, l3 = d3; null !== l3; ) {
                    if (l3.key === k3) {
                      k3 = f3.type;
                      if (k3 === ya) {
                        if (7 === l3.tag) {
                          c2(a3, l3.sibling);
                          d3 = e(l3, f3.props.children);
                          d3.return = a3;
                          a3 = d3;
                          break a;
                        }
                      } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && uh(k3) === l3.type) {
                        c2(a3, l3.sibling);
                        d3 = e(l3, f3.props);
                        d3.ref = sh(a3, l3, f3);
                        d3.return = a3;
                        a3 = d3;
                        break a;
                      }
                      c2(a3, l3);
                      break;
                    } else
                      b2(a3, l3);
                    l3 = l3.sibling;
                  }
                  f3.type === ya ? (d3 = Ah(f3.props.children, a3.mode, h3, f3.key), d3.return = a3, a3 = d3) : (h3 = yh(f3.type, f3.key, f3.props, null, a3.mode, h3), h3.ref = sh(a3, d3, f3), h3.return = a3, a3 = h3);
                }
                return g2(a3);
              case wa:
                a: {
                  for (l3 = f3.key; null !== d3; ) {
                    if (d3.key === l3)
                      if (4 === d3.tag && d3.stateNode.containerInfo === f3.containerInfo && d3.stateNode.implementation === f3.implementation) {
                        c2(a3, d3.sibling);
                        d3 = e(d3, f3.children || []);
                        d3.return = a3;
                        a3 = d3;
                        break a;
                      } else {
                        c2(a3, d3);
                        break;
                      }
                    else
                      b2(a3, d3);
                    d3 = d3.sibling;
                  }
                  d3 = zh(f3, a3.mode, h3);
                  d3.return = a3;
                  a3 = d3;
                }
                return g2(a3);
              case Ha:
                return l3 = f3._init, J(a3, d3, l3(f3._payload), h3);
            }
            if (eb(f3))
              return n2(a3, d3, f3, h3);
            if (Ka(f3))
              return t2(a3, d3, f3, h3);
            th(a3, f3);
          }
          return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d3 && 6 === d3.tag ? (c2(a3, d3.sibling), d3 = e(d3, f3), d3.return = a3, a3 = d3) : (c2(a3, d3), d3 = xh(f3, a3.mode, h3), d3.return = a3, a3 = d3), g2(a3)) : c2(a3, d3);
        }
        return J;
      }
      var Bh = vh(true);
      var Ch = vh(false);
      var Dh = {};
      var Eh = Uf(Dh);
      var Fh = Uf(Dh);
      var Gh = Uf(Dh);
      function Hh(a2) {
        if (a2 === Dh)
          throw Error(p2(174));
        return a2;
      }
      function Ih(a2, b2) {
        G2(Gh, b2);
        G2(Fh, a2);
        G2(Eh, Dh);
        a2 = b2.nodeType;
        switch (a2) {
          case 9:
          case 11:
            b2 = (b2 = b2.documentElement) ? b2.namespaceURI : lb(null, "");
            break;
          default:
            a2 = 8 === a2 ? b2.parentNode : b2, b2 = a2.namespaceURI || null, a2 = a2.tagName, b2 = lb(b2, a2);
        }
        E2(Eh);
        G2(Eh, b2);
      }
      function Jh() {
        E2(Eh);
        E2(Fh);
        E2(Gh);
      }
      function Kh(a2) {
        Hh(Gh.current);
        var b2 = Hh(Eh.current);
        var c2 = lb(b2, a2.type);
        b2 !== c2 && (G2(Fh, a2), G2(Eh, c2));
      }
      function Lh(a2) {
        Fh.current === a2 && (E2(Eh), E2(Fh));
      }
      var M2 = Uf(0);
      function Mh(a2) {
        for (var b2 = a2; null !== b2; ) {
          if (13 === b2.tag) {
            var c2 = b2.memoizedState;
            if (null !== c2 && (c2 = c2.dehydrated, null === c2 || "$?" === c2.data || "$!" === c2.data))
              return b2;
          } else if (19 === b2.tag && void 0 !== b2.memoizedProps.revealOrder) {
            if (0 !== (b2.flags & 128))
              return b2;
          } else if (null !== b2.child) {
            b2.child.return = b2;
            b2 = b2.child;
            continue;
          }
          if (b2 === a2)
            break;
          for (; null === b2.sibling; ) {
            if (null === b2.return || b2.return === a2)
              return null;
            b2 = b2.return;
          }
          b2.sibling.return = b2.return;
          b2 = b2.sibling;
        }
        return null;
      }
      var Nh = [];
      function Oh() {
        for (var a2 = 0; a2 < Nh.length; a2++)
          Nh[a2]._workInProgressVersionPrimary = null;
        Nh.length = 0;
      }
      var Ph = ua.ReactCurrentDispatcher;
      var Qh = ua.ReactCurrentBatchConfig;
      var Rh = 0;
      var N = null;
      var O2 = null;
      var P2 = null;
      var Sh = false;
      var Th = false;
      var Uh = 0;
      var Vh = 0;
      function Q2() {
        throw Error(p2(321));
      }
      function Wh(a2, b2) {
        if (null === b2)
          return false;
        for (var c2 = 0; c2 < b2.length && c2 < a2.length; c2++)
          if (!He(a2[c2], b2[c2]))
            return false;
        return true;
      }
      function Xh(a2, b2, c2, d2, e, f2) {
        Rh = f2;
        N = b2;
        b2.memoizedState = null;
        b2.updateQueue = null;
        b2.lanes = 0;
        Ph.current = null === a2 || null === a2.memoizedState ? Yh : Zh;
        a2 = c2(d2, e);
        if (Th) {
          f2 = 0;
          do {
            Th = false;
            Uh = 0;
            if (25 <= f2)
              throw Error(p2(301));
            f2 += 1;
            P2 = O2 = null;
            b2.updateQueue = null;
            Ph.current = $h;
            a2 = c2(d2, e);
          } while (Th);
        }
        Ph.current = ai;
        b2 = null !== O2 && null !== O2.next;
        Rh = 0;
        P2 = O2 = N = null;
        Sh = false;
        if (b2)
          throw Error(p2(300));
        return a2;
      }
      function bi() {
        var a2 = 0 !== Uh;
        Uh = 0;
        return a2;
      }
      function ci() {
        var a2 = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
        null === P2 ? N.memoizedState = P2 = a2 : P2 = P2.next = a2;
        return P2;
      }
      function di() {
        if (null === O2) {
          var a2 = N.alternate;
          a2 = null !== a2 ? a2.memoizedState : null;
        } else
          a2 = O2.next;
        var b2 = null === P2 ? N.memoizedState : P2.next;
        if (null !== b2)
          P2 = b2, O2 = a2;
        else {
          if (null === a2)
            throw Error(p2(310));
          O2 = a2;
          a2 = { memoizedState: O2.memoizedState, baseState: O2.baseState, baseQueue: O2.baseQueue, queue: O2.queue, next: null };
          null === P2 ? N.memoizedState = P2 = a2 : P2 = P2.next = a2;
        }
        return P2;
      }
      function ei(a2, b2) {
        return "function" === typeof b2 ? b2(a2) : b2;
      }
      function fi(a2) {
        var b2 = di(), c2 = b2.queue;
        if (null === c2)
          throw Error(p2(311));
        c2.lastRenderedReducer = a2;
        var d2 = O2, e = d2.baseQueue, f2 = c2.pending;
        if (null !== f2) {
          if (null !== e) {
            var g2 = e.next;
            e.next = f2.next;
            f2.next = g2;
          }
          d2.baseQueue = e = f2;
          c2.pending = null;
        }
        if (null !== e) {
          f2 = e.next;
          d2 = d2.baseState;
          var h2 = g2 = null, k2 = null, l2 = f2;
          do {
            var m = l2.lane;
            if ((Rh & m) === m)
              null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d2 = l2.hasEagerState ? l2.eagerState : a2(d2, l2.action);
            else {
              var q2 = {
                lane: m,
                action: l2.action,
                hasEagerState: l2.hasEagerState,
                eagerState: l2.eagerState,
                next: null
              };
              null === k2 ? (h2 = k2 = q2, g2 = d2) : k2 = k2.next = q2;
              N.lanes |= m;
              hh |= m;
            }
            l2 = l2.next;
          } while (null !== l2 && l2 !== f2);
          null === k2 ? g2 = d2 : k2.next = h2;
          He(d2, b2.memoizedState) || (Ug = true);
          b2.memoizedState = d2;
          b2.baseState = g2;
          b2.baseQueue = k2;
          c2.lastRenderedState = d2;
        }
        a2 = c2.interleaved;
        if (null !== a2) {
          e = a2;
          do
            f2 = e.lane, N.lanes |= f2, hh |= f2, e = e.next;
          while (e !== a2);
        } else
          null === e && (c2.lanes = 0);
        return [b2.memoizedState, c2.dispatch];
      }
      function gi(a2) {
        var b2 = di(), c2 = b2.queue;
        if (null === c2)
          throw Error(p2(311));
        c2.lastRenderedReducer = a2;
        var d2 = c2.dispatch, e = c2.pending, f2 = b2.memoizedState;
        if (null !== e) {
          c2.pending = null;
          var g2 = e = e.next;
          do
            f2 = a2(f2, g2.action), g2 = g2.next;
          while (g2 !== e);
          He(f2, b2.memoizedState) || (Ug = true);
          b2.memoizedState = f2;
          null === b2.baseQueue && (b2.baseState = f2);
          c2.lastRenderedState = f2;
        }
        return [f2, d2];
      }
      function hi() {
      }
      function ii(a2, b2) {
        var c2 = N, d2 = di(), e = b2(), f2 = !He(d2.memoizedState, e);
        f2 && (d2.memoizedState = e, Ug = true);
        d2 = d2.queue;
        ji(ki.bind(null, c2, d2, a2), [a2]);
        if (d2.getSnapshot !== b2 || f2 || null !== P2 && P2.memoizedState.tag & 1) {
          c2.flags |= 2048;
          li(9, mi.bind(null, c2, d2, e, b2), void 0, null);
          if (null === R2)
            throw Error(p2(349));
          0 !== (Rh & 30) || ni(c2, b2, e);
        }
        return e;
      }
      function ni(a2, b2, c2) {
        a2.flags |= 16384;
        a2 = { getSnapshot: b2, value: c2 };
        b2 = N.updateQueue;
        null === b2 ? (b2 = { lastEffect: null, stores: null }, N.updateQueue = b2, b2.stores = [a2]) : (c2 = b2.stores, null === c2 ? b2.stores = [a2] : c2.push(a2));
      }
      function mi(a2, b2, c2, d2) {
        b2.value = c2;
        b2.getSnapshot = d2;
        oi(b2) && pi(a2);
      }
      function ki(a2, b2, c2) {
        return c2(function() {
          oi(b2) && pi(a2);
        });
      }
      function oi(a2) {
        var b2 = a2.getSnapshot;
        a2 = a2.value;
        try {
          var c2 = b2();
          return !He(a2, c2);
        } catch (d2) {
          return true;
        }
      }
      function pi(a2) {
        var b2 = Zg(a2, 1);
        null !== b2 && mh(b2, a2, 1, -1);
      }
      function qi(a2) {
        var b2 = ci();
        "function" === typeof a2 && (a2 = a2());
        b2.memoizedState = b2.baseState = a2;
        a2 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ei, lastRenderedState: a2 };
        b2.queue = a2;
        a2 = a2.dispatch = ri.bind(null, N, a2);
        return [b2.memoizedState, a2];
      }
      function li(a2, b2, c2, d2) {
        a2 = { tag: a2, create: b2, destroy: c2, deps: d2, next: null };
        b2 = N.updateQueue;
        null === b2 ? (b2 = { lastEffect: null, stores: null }, N.updateQueue = b2, b2.lastEffect = a2.next = a2) : (c2 = b2.lastEffect, null === c2 ? b2.lastEffect = a2.next = a2 : (d2 = c2.next, c2.next = a2, a2.next = d2, b2.lastEffect = a2));
        return a2;
      }
      function si() {
        return di().memoizedState;
      }
      function ti(a2, b2, c2, d2) {
        var e = ci();
        N.flags |= a2;
        e.memoizedState = li(1 | b2, c2, void 0, void 0 === d2 ? null : d2);
      }
      function ui(a2, b2, c2, d2) {
        var e = di();
        d2 = void 0 === d2 ? null : d2;
        var f2 = void 0;
        if (null !== O2) {
          var g2 = O2.memoizedState;
          f2 = g2.destroy;
          if (null !== d2 && Wh(d2, g2.deps)) {
            e.memoizedState = li(b2, c2, f2, d2);
            return;
          }
        }
        N.flags |= a2;
        e.memoizedState = li(1 | b2, c2, f2, d2);
      }
      function vi(a2, b2) {
        return ti(8390656, 8, a2, b2);
      }
      function ji(a2, b2) {
        return ui(2048, 8, a2, b2);
      }
      function wi(a2, b2) {
        return ui(4, 2, a2, b2);
      }
      function xi(a2, b2) {
        return ui(4, 4, a2, b2);
      }
      function yi(a2, b2) {
        if ("function" === typeof b2)
          return a2 = a2(), b2(a2), function() {
            b2(null);
          };
        if (null !== b2 && void 0 !== b2)
          return a2 = a2(), b2.current = a2, function() {
            b2.current = null;
          };
      }
      function zi(a2, b2, c2) {
        c2 = null !== c2 && void 0 !== c2 ? c2.concat([a2]) : null;
        return ui(4, 4, yi.bind(null, b2, a2), c2);
      }
      function Ai() {
      }
      function Bi(a2, b2) {
        var c2 = di();
        b2 = void 0 === b2 ? null : b2;
        var d2 = c2.memoizedState;
        if (null !== d2 && null !== b2 && Wh(b2, d2[1]))
          return d2[0];
        c2.memoizedState = [a2, b2];
        return a2;
      }
      function Ci(a2, b2) {
        var c2 = di();
        b2 = void 0 === b2 ? null : b2;
        var d2 = c2.memoizedState;
        if (null !== d2 && null !== b2 && Wh(b2, d2[1]))
          return d2[0];
        a2 = a2();
        c2.memoizedState = [a2, b2];
        return a2;
      }
      function Di(a2, b2, c2) {
        if (0 === (Rh & 21))
          return a2.baseState && (a2.baseState = false, Ug = true), a2.memoizedState = c2;
        He(c2, b2) || (c2 = yc(), N.lanes |= c2, hh |= c2, a2.baseState = true);
        return b2;
      }
      function Ei(a2, b2) {
        var c2 = C;
        C = 0 !== c2 && 4 > c2 ? c2 : 4;
        a2(true);
        var d2 = Qh.transition;
        Qh.transition = {};
        try {
          a2(false), b2();
        } finally {
          C = c2, Qh.transition = d2;
        }
      }
      function Fi() {
        return di().memoizedState;
      }
      function Gi(a2, b2, c2) {
        var d2 = lh(a2);
        c2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
        if (Hi(a2))
          Ii(b2, c2);
        else if (c2 = Yg(a2, b2, c2, d2), null !== c2) {
          var e = L2();
          mh(c2, a2, d2, e);
          Ji(c2, b2, d2);
        }
      }
      function ri(a2, b2, c2) {
        var d2 = lh(a2), e = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
        if (Hi(a2))
          Ii(b2, e);
        else {
          var f2 = a2.alternate;
          if (0 === a2.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b2.lastRenderedReducer, null !== f2))
            try {
              var g2 = b2.lastRenderedState, h2 = f2(g2, c2);
              e.hasEagerState = true;
              e.eagerState = h2;
              if (He(h2, g2)) {
                var k2 = b2.interleaved;
                null === k2 ? (e.next = e, Xg(b2)) : (e.next = k2.next, k2.next = e);
                b2.interleaved = e;
                return;
              }
            } catch (l2) {
            } finally {
            }
          c2 = Yg(a2, b2, e, d2);
          null !== c2 && (e = L2(), mh(c2, a2, d2, e), Ji(c2, b2, d2));
        }
      }
      function Hi(a2) {
        var b2 = a2.alternate;
        return a2 === N || null !== b2 && b2 === N;
      }
      function Ii(a2, b2) {
        Th = Sh = true;
        var c2 = a2.pending;
        null === c2 ? b2.next = b2 : (b2.next = c2.next, c2.next = b2);
        a2.pending = b2;
      }
      function Ji(a2, b2, c2) {
        if (0 !== (c2 & 4194240)) {
          var d2 = b2.lanes;
          d2 &= a2.pendingLanes;
          c2 |= d2;
          b2.lanes = c2;
          Cc(a2, c2);
        }
      }
      var ai = { readContext: Vg, useCallback: Q2, useContext: Q2, useEffect: Q2, useImperativeHandle: Q2, useInsertionEffect: Q2, useLayoutEffect: Q2, useMemo: Q2, useReducer: Q2, useRef: Q2, useState: Q2, useDebugValue: Q2, useDeferredValue: Q2, useTransition: Q2, useMutableSource: Q2, useSyncExternalStore: Q2, useId: Q2, unstable_isNewReconciler: false };
      var Yh = { readContext: Vg, useCallback: function(a2, b2) {
        ci().memoizedState = [a2, void 0 === b2 ? null : b2];
        return a2;
      }, useContext: Vg, useEffect: vi, useImperativeHandle: function(a2, b2, c2) {
        c2 = null !== c2 && void 0 !== c2 ? c2.concat([a2]) : null;
        return ti(
          4194308,
          4,
          yi.bind(null, b2, a2),
          c2
        );
      }, useLayoutEffect: function(a2, b2) {
        return ti(4194308, 4, a2, b2);
      }, useInsertionEffect: function(a2, b2) {
        return ti(4, 2, a2, b2);
      }, useMemo: function(a2, b2) {
        var c2 = ci();
        b2 = void 0 === b2 ? null : b2;
        a2 = a2();
        c2.memoizedState = [a2, b2];
        return a2;
      }, useReducer: function(a2, b2, c2) {
        var d2 = ci();
        b2 = void 0 !== c2 ? c2(b2) : b2;
        d2.memoizedState = d2.baseState = b2;
        a2 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a2, lastRenderedState: b2 };
        d2.queue = a2;
        a2 = a2.dispatch = Gi.bind(null, N, a2);
        return [d2.memoizedState, a2];
      }, useRef: function(a2) {
        var b2 = ci();
        a2 = { current: a2 };
        return b2.memoizedState = a2;
      }, useState: qi, useDebugValue: Ai, useDeferredValue: function(a2) {
        return ci().memoizedState = a2;
      }, useTransition: function() {
        var a2 = qi(false), b2 = a2[0];
        a2 = Ei.bind(null, a2[1]);
        ci().memoizedState = a2;
        return [b2, a2];
      }, useMutableSource: function() {
      }, useSyncExternalStore: function(a2, b2, c2) {
        var d2 = N, e = ci();
        if (I2) {
          if (void 0 === c2)
            throw Error(p2(407));
          c2 = c2();
        } else {
          c2 = b2();
          if (null === R2)
            throw Error(p2(349));
          0 !== (Rh & 30) || ni(d2, b2, c2);
        }
        e.memoizedState = c2;
        var f2 = { value: c2, getSnapshot: b2 };
        e.queue = f2;
        vi(ki.bind(
          null,
          d2,
          f2,
          a2
        ), [a2]);
        d2.flags |= 2048;
        li(9, mi.bind(null, d2, f2, c2, b2), void 0, null);
        return c2;
      }, useId: function() {
        var a2 = ci(), b2 = R2.identifierPrefix;
        if (I2) {
          var c2 = sg;
          var d2 = rg;
          c2 = (d2 & ~(1 << 32 - oc(d2) - 1)).toString(32) + c2;
          b2 = ":" + b2 + "R" + c2;
          c2 = Uh++;
          0 < c2 && (b2 += "H" + c2.toString(32));
          b2 += ":";
        } else
          c2 = Vh++, b2 = ":" + b2 + "r" + c2.toString(32) + ":";
        return a2.memoizedState = b2;
      }, unstable_isNewReconciler: false };
      var Zh = {
        readContext: Vg,
        useCallback: Bi,
        useContext: Vg,
        useEffect: ji,
        useImperativeHandle: zi,
        useInsertionEffect: wi,
        useLayoutEffect: xi,
        useMemo: Ci,
        useReducer: fi,
        useRef: si,
        useState: function() {
          return fi(ei);
        },
        useDebugValue: Ai,
        useDeferredValue: function(a2) {
          var b2 = di();
          return Di(b2, O2.memoizedState, a2);
        },
        useTransition: function() {
          var a2 = fi(ei)[0], b2 = di().memoizedState;
          return [a2, b2];
        },
        useMutableSource: hi,
        useSyncExternalStore: ii,
        useId: Fi,
        unstable_isNewReconciler: false
      };
      var $h = { readContext: Vg, useCallback: Bi, useContext: Vg, useEffect: ji, useImperativeHandle: zi, useInsertionEffect: wi, useLayoutEffect: xi, useMemo: Ci, useReducer: gi, useRef: si, useState: function() {
        return gi(ei);
      }, useDebugValue: Ai, useDeferredValue: function(a2) {
        var b2 = di();
        return null === O2 ? b2.memoizedState = a2 : Di(b2, O2.memoizedState, a2);
      }, useTransition: function() {
        var a2 = gi(ei)[0], b2 = di().memoizedState;
        return [a2, b2];
      }, useMutableSource: hi, useSyncExternalStore: ii, useId: Fi, unstable_isNewReconciler: false };
      function Ki(a2, b2) {
        try {
          var c2 = "", d2 = b2;
          do
            c2 += Pa(d2), d2 = d2.return;
          while (d2);
          var e = c2;
        } catch (f2) {
          e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
        }
        return { value: a2, source: b2, stack: e, digest: null };
      }
      function Li(a2, b2, c2) {
        return { value: a2, source: null, stack: null != c2 ? c2 : null, digest: null != b2 ? b2 : null };
      }
      function Mi(a2, b2) {
        try {
          console.error(b2.value);
        } catch (c2) {
          setTimeout(function() {
            throw c2;
          });
        }
      }
      var Ni = "function" === typeof WeakMap ? WeakMap : Map;
      function Oi(a2, b2, c2) {
        c2 = ch(-1, c2);
        c2.tag = 3;
        c2.payload = { element: null };
        var d2 = b2.value;
        c2.callback = function() {
          Pi || (Pi = true, Qi = d2);
          Mi(a2, b2);
        };
        return c2;
      }
      function Ri(a2, b2, c2) {
        c2 = ch(-1, c2);
        c2.tag = 3;
        var d2 = a2.type.getDerivedStateFromError;
        if ("function" === typeof d2) {
          var e = b2.value;
          c2.payload = function() {
            return d2(e);
          };
          c2.callback = function() {
            Mi(a2, b2);
          };
        }
        var f2 = a2.stateNode;
        null !== f2 && "function" === typeof f2.componentDidCatch && (c2.callback = function() {
          Mi(a2, b2);
          "function" !== typeof d2 && (null === Si ? Si = /* @__PURE__ */ new Set([this]) : Si.add(this));
          var c3 = b2.stack;
          this.componentDidCatch(b2.value, { componentStack: null !== c3 ? c3 : "" });
        });
        return c2;
      }
      function Ti(a2, b2, c2) {
        var d2 = a2.pingCache;
        if (null === d2) {
          d2 = a2.pingCache = new Ni();
          var e = /* @__PURE__ */ new Set();
          d2.set(b2, e);
        } else
          e = d2.get(b2), void 0 === e && (e = /* @__PURE__ */ new Set(), d2.set(b2, e));
        e.has(c2) || (e.add(c2), a2 = Ui.bind(null, a2, b2, c2), b2.then(a2, a2));
      }
      function Vi(a2) {
        do {
          var b2;
          if (b2 = 13 === a2.tag)
            b2 = a2.memoizedState, b2 = null !== b2 ? null !== b2.dehydrated ? true : false : true;
          if (b2)
            return a2;
          a2 = a2.return;
        } while (null !== a2);
        return null;
      }
      function Wi(a2, b2, c2, d2, e) {
        if (0 === (a2.mode & 1))
          return a2 === b2 ? a2.flags |= 65536 : (a2.flags |= 128, c2.flags |= 131072, c2.flags &= -52805, 1 === c2.tag && (null === c2.alternate ? c2.tag = 17 : (b2 = ch(-1, 1), b2.tag = 2, dh(c2, b2, 1))), c2.lanes |= 1), a2;
        a2.flags |= 65536;
        a2.lanes = e;
        return a2;
      }
      var Xi = ua.ReactCurrentOwner;
      var Ug = false;
      function Yi(a2, b2, c2, d2) {
        b2.child = null === a2 ? Ch(b2, null, c2, d2) : Bh(b2, a2.child, c2, d2);
      }
      function Zi(a2, b2, c2, d2, e) {
        c2 = c2.render;
        var f2 = b2.ref;
        Tg(b2, e);
        d2 = Xh(a2, b2, c2, d2, f2, e);
        c2 = bi();
        if (null !== a2 && !Ug)
          return b2.updateQueue = a2.updateQueue, b2.flags &= -2053, a2.lanes &= ~e, $i(a2, b2, e);
        I2 && c2 && vg(b2);
        b2.flags |= 1;
        Yi(a2, b2, d2, e);
        return b2.child;
      }
      function aj(a2, b2, c2, d2, e) {
        if (null === a2) {
          var f2 = c2.type;
          if ("function" === typeof f2 && !bj(f2) && void 0 === f2.defaultProps && null === c2.compare && void 0 === c2.defaultProps)
            return b2.tag = 15, b2.type = f2, cj(a2, b2, f2, d2, e);
          a2 = yh(c2.type, null, d2, b2, b2.mode, e);
          a2.ref = b2.ref;
          a2.return = b2;
          return b2.child = a2;
        }
        f2 = a2.child;
        if (0 === (a2.lanes & e)) {
          var g2 = f2.memoizedProps;
          c2 = c2.compare;
          c2 = null !== c2 ? c2 : Ie;
          if (c2(g2, d2) && a2.ref === b2.ref)
            return $i(a2, b2, e);
        }
        b2.flags |= 1;
        a2 = wh(f2, d2);
        a2.ref = b2.ref;
        a2.return = b2;
        return b2.child = a2;
      }
      function cj(a2, b2, c2, d2, e) {
        if (null !== a2) {
          var f2 = a2.memoizedProps;
          if (Ie(f2, d2) && a2.ref === b2.ref)
            if (Ug = false, b2.pendingProps = d2 = f2, 0 !== (a2.lanes & e))
              0 !== (a2.flags & 131072) && (Ug = true);
            else
              return b2.lanes = a2.lanes, $i(a2, b2, e);
        }
        return dj(a2, b2, c2, d2, e);
      }
      function ej(a2, b2, c2) {
        var d2 = b2.pendingProps, e = d2.children, f2 = null !== a2 ? a2.memoizedState : null;
        if ("hidden" === d2.mode)
          if (0 === (b2.mode & 1))
            b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G2(fj, gj), gj |= c2;
          else {
            if (0 === (c2 & 1073741824))
              return a2 = null !== f2 ? f2.baseLanes | c2 : c2, b2.lanes = b2.childLanes = 1073741824, b2.memoizedState = { baseLanes: a2, cachePool: null, transitions: null }, b2.updateQueue = null, G2(fj, gj), gj |= a2, null;
            b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
            d2 = null !== f2 ? f2.baseLanes : c2;
            G2(fj, gj);
            gj |= d2;
          }
        else
          null !== f2 ? (d2 = f2.baseLanes | c2, b2.memoizedState = null) : d2 = c2, G2(fj, gj), gj |= d2;
        Yi(a2, b2, e, c2);
        return b2.child;
      }
      function hj(a2, b2) {
        var c2 = b2.ref;
        if (null === a2 && null !== c2 || null !== a2 && a2.ref !== c2)
          b2.flags |= 512, b2.flags |= 2097152;
      }
      function dj(a2, b2, c2, d2, e) {
        var f2 = Zf(c2) ? Xf : H2.current;
        f2 = Yf(b2, f2);
        Tg(b2, e);
        c2 = Xh(a2, b2, c2, d2, f2, e);
        d2 = bi();
        if (null !== a2 && !Ug)
          return b2.updateQueue = a2.updateQueue, b2.flags &= -2053, a2.lanes &= ~e, $i(a2, b2, e);
        I2 && d2 && vg(b2);
        b2.flags |= 1;
        Yi(a2, b2, c2, e);
        return b2.child;
      }
      function ij(a2, b2, c2, d2, e) {
        if (Zf(c2)) {
          var f2 = true;
          cg(b2);
        } else
          f2 = false;
        Tg(b2, e);
        if (null === b2.stateNode)
          jj(a2, b2), ph(b2, c2, d2), rh(b2, c2, d2, e), d2 = true;
        else if (null === a2) {
          var g2 = b2.stateNode, h2 = b2.memoizedProps;
          g2.props = h2;
          var k2 = g2.context, l2 = c2.contextType;
          "object" === typeof l2 && null !== l2 ? l2 = Vg(l2) : (l2 = Zf(c2) ? Xf : H2.current, l2 = Yf(b2, l2));
          var m = c2.getDerivedStateFromProps, q2 = "function" === typeof m || "function" === typeof g2.getSnapshotBeforeUpdate;
          q2 || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== d2 || k2 !== l2) && qh(b2, g2, d2, l2);
          $g = false;
          var r2 = b2.memoizedState;
          g2.state = r2;
          gh(b2, d2, g2, e);
          k2 = b2.memoizedState;
          h2 !== d2 || r2 !== k2 || Wf.current || $g ? ("function" === typeof m && (kh(b2, c2, m, d2), k2 = b2.memoizedState), (h2 = $g || oh(b2, c2, h2, d2, r2, k2, l2)) ? (q2 || "function" !== typeof g2.UNSAFE_componentWillMount && "function" !== typeof g2.componentWillMount || ("function" === typeof g2.componentWillMount && g2.componentWillMount(), "function" === typeof g2.UNSAFE_componentWillMount && g2.UNSAFE_componentWillMount()), "function" === typeof g2.componentDidMount && (b2.flags |= 4194308)) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), b2.memoizedProps = d2, b2.memoizedState = k2), g2.props = d2, g2.state = k2, g2.context = l2, d2 = h2) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), d2 = false);
        } else {
          g2 = b2.stateNode;
          bh(a2, b2);
          h2 = b2.memoizedProps;
          l2 = b2.type === b2.elementType ? h2 : Lg(b2.type, h2);
          g2.props = l2;
          q2 = b2.pendingProps;
          r2 = g2.context;
          k2 = c2.contextType;
          "object" === typeof k2 && null !== k2 ? k2 = Vg(k2) : (k2 = Zf(c2) ? Xf : H2.current, k2 = Yf(b2, k2));
          var y2 = c2.getDerivedStateFromProps;
          (m = "function" === typeof y2 || "function" === typeof g2.getSnapshotBeforeUpdate) || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== q2 || r2 !== k2) && qh(b2, g2, d2, k2);
          $g = false;
          r2 = b2.memoizedState;
          g2.state = r2;
          gh(b2, d2, g2, e);
          var n2 = b2.memoizedState;
          h2 !== q2 || r2 !== n2 || Wf.current || $g ? ("function" === typeof y2 && (kh(b2, c2, y2, d2), n2 = b2.memoizedState), (l2 = $g || oh(b2, c2, l2, d2, r2, n2, k2) || false) ? (m || "function" !== typeof g2.UNSAFE_componentWillUpdate && "function" !== typeof g2.componentWillUpdate || ("function" === typeof g2.componentWillUpdate && g2.componentWillUpdate(d2, n2, k2), "function" === typeof g2.UNSAFE_componentWillUpdate && g2.UNSAFE_componentWillUpdate(d2, n2, k2)), "function" === typeof g2.componentDidUpdate && (b2.flags |= 4), "function" === typeof g2.getSnapshotBeforeUpdate && (b2.flags |= 1024)) : ("function" !== typeof g2.componentDidUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 1024), b2.memoizedProps = d2, b2.memoizedState = n2), g2.props = d2, g2.state = n2, g2.context = k2, d2 = l2) : ("function" !== typeof g2.componentDidUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 1024), d2 = false);
        }
        return kj(a2, b2, c2, d2, f2, e);
      }
      function kj(a2, b2, c2, d2, e, f2) {
        hj(a2, b2);
        var g2 = 0 !== (b2.flags & 128);
        if (!d2 && !g2)
          return e && dg(b2, c2, false), $i(a2, b2, f2);
        d2 = b2.stateNode;
        Xi.current = b2;
        var h2 = g2 && "function" !== typeof c2.getDerivedStateFromError ? null : d2.render();
        b2.flags |= 1;
        null !== a2 && g2 ? (b2.child = Bh(b2, a2.child, null, f2), b2.child = Bh(b2, null, h2, f2)) : Yi(a2, b2, h2, f2);
        b2.memoizedState = d2.state;
        e && dg(b2, c2, true);
        return b2.child;
      }
      function lj(a2) {
        var b2 = a2.stateNode;
        b2.pendingContext ? ag(a2, b2.pendingContext, b2.pendingContext !== b2.context) : b2.context && ag(a2, b2.context, false);
        Ih(a2, b2.containerInfo);
      }
      function mj(a2, b2, c2, d2, e) {
        Ig();
        Jg(e);
        b2.flags |= 256;
        Yi(a2, b2, c2, d2);
        return b2.child;
      }
      var nj = { dehydrated: null, treeContext: null, retryLane: 0 };
      function oj(a2) {
        return { baseLanes: a2, cachePool: null, transitions: null };
      }
      function pj(a2, b2, c2) {
        var d2 = b2.pendingProps, e = M2.current, f2 = false, g2 = 0 !== (b2.flags & 128), h2;
        (h2 = g2) || (h2 = null !== a2 && null === a2.memoizedState ? false : 0 !== (e & 2));
        if (h2)
          f2 = true, b2.flags &= -129;
        else if (null === a2 || null !== a2.memoizedState)
          e |= 1;
        G2(M2, e & 1);
        if (null === a2) {
          Eg(b2);
          a2 = b2.memoizedState;
          if (null !== a2 && (a2 = a2.dehydrated, null !== a2))
            return 0 === (b2.mode & 1) ? b2.lanes = 1 : "$!" === a2.data ? b2.lanes = 8 : b2.lanes = 1073741824, null;
          g2 = d2.children;
          a2 = d2.fallback;
          return f2 ? (d2 = b2.mode, f2 = b2.child, g2 = { mode: "hidden", children: g2 }, 0 === (d2 & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g2) : f2 = qj(g2, d2, 0, null), a2 = Ah(a2, d2, c2, null), f2.return = b2, a2.return = b2, f2.sibling = a2, b2.child = f2, b2.child.memoizedState = oj(c2), b2.memoizedState = nj, a2) : rj(b2, g2);
        }
        e = a2.memoizedState;
        if (null !== e && (h2 = e.dehydrated, null !== h2))
          return sj(a2, b2, g2, d2, h2, e, c2);
        if (f2) {
          f2 = d2.fallback;
          g2 = b2.mode;
          e = a2.child;
          h2 = e.sibling;
          var k2 = { mode: "hidden", children: d2.children };
          0 === (g2 & 1) && b2.child !== e ? (d2 = b2.child, d2.childLanes = 0, d2.pendingProps = k2, b2.deletions = null) : (d2 = wh(e, k2), d2.subtreeFlags = e.subtreeFlags & 14680064);
          null !== h2 ? f2 = wh(h2, f2) : (f2 = Ah(f2, g2, c2, null), f2.flags |= 2);
          f2.return = b2;
          d2.return = b2;
          d2.sibling = f2;
          b2.child = d2;
          d2 = f2;
          f2 = b2.child;
          g2 = a2.child.memoizedState;
          g2 = null === g2 ? oj(c2) : { baseLanes: g2.baseLanes | c2, cachePool: null, transitions: g2.transitions };
          f2.memoizedState = g2;
          f2.childLanes = a2.childLanes & ~c2;
          b2.memoizedState = nj;
          return d2;
        }
        f2 = a2.child;
        a2 = f2.sibling;
        d2 = wh(f2, { mode: "visible", children: d2.children });
        0 === (b2.mode & 1) && (d2.lanes = c2);
        d2.return = b2;
        d2.sibling = null;
        null !== a2 && (c2 = b2.deletions, null === c2 ? (b2.deletions = [a2], b2.flags |= 16) : c2.push(a2));
        b2.child = d2;
        b2.memoizedState = null;
        return d2;
      }
      function rj(a2, b2) {
        b2 = qj({ mode: "visible", children: b2 }, a2.mode, 0, null);
        b2.return = a2;
        return a2.child = b2;
      }
      function tj(a2, b2, c2, d2) {
        null !== d2 && Jg(d2);
        Bh(b2, a2.child, null, c2);
        a2 = rj(b2, b2.pendingProps.children);
        a2.flags |= 2;
        b2.memoizedState = null;
        return a2;
      }
      function sj(a2, b2, c2, d2, e, f2, g2) {
        if (c2) {
          if (b2.flags & 256)
            return b2.flags &= -257, d2 = Li(Error(p2(422))), tj(a2, b2, g2, d2);
          if (null !== b2.memoizedState)
            return b2.child = a2.child, b2.flags |= 128, null;
          f2 = d2.fallback;
          e = b2.mode;
          d2 = qj({ mode: "visible", children: d2.children }, e, 0, null);
          f2 = Ah(f2, e, g2, null);
          f2.flags |= 2;
          d2.return = b2;
          f2.return = b2;
          d2.sibling = f2;
          b2.child = d2;
          0 !== (b2.mode & 1) && Bh(b2, a2.child, null, g2);
          b2.child.memoizedState = oj(g2);
          b2.memoizedState = nj;
          return f2;
        }
        if (0 === (b2.mode & 1))
          return tj(a2, b2, g2, null);
        if ("$!" === e.data) {
          d2 = e.nextSibling && e.nextSibling.dataset;
          if (d2)
            var h2 = d2.dgst;
          d2 = h2;
          f2 = Error(p2(419));
          d2 = Li(f2, d2, void 0);
          return tj(a2, b2, g2, d2);
        }
        h2 = 0 !== (g2 & a2.childLanes);
        if (Ug || h2) {
          d2 = R2;
          if (null !== d2) {
            switch (g2 & -g2) {
              case 4:
                e = 2;
                break;
              case 16:
                e = 8;
                break;
              case 64:
              case 128:
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
              case 4194304:
              case 8388608:
              case 16777216:
              case 33554432:
              case 67108864:
                e = 32;
                break;
              case 536870912:
                e = 268435456;
                break;
              default:
                e = 0;
            }
            e = 0 !== (e & (d2.suspendedLanes | g2)) ? 0 : e;
            0 !== e && e !== f2.retryLane && (f2.retryLane = e, Zg(a2, e), mh(d2, a2, e, -1));
          }
          uj();
          d2 = Li(Error(p2(421)));
          return tj(a2, b2, g2, d2);
        }
        if ("$?" === e.data)
          return b2.flags |= 128, b2.child = a2.child, b2 = vj.bind(null, a2), e._reactRetry = b2, null;
        a2 = f2.treeContext;
        yg = Lf(e.nextSibling);
        xg = b2;
        I2 = true;
        zg = null;
        null !== a2 && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a2.id, sg = a2.overflow, qg = b2);
        b2 = rj(b2, d2.children);
        b2.flags |= 4096;
        return b2;
      }
      function wj(a2, b2, c2) {
        a2.lanes |= b2;
        var d2 = a2.alternate;
        null !== d2 && (d2.lanes |= b2);
        Sg(a2.return, b2, c2);
      }
      function xj(a2, b2, c2, d2, e) {
        var f2 = a2.memoizedState;
        null === f2 ? a2.memoizedState = { isBackwards: b2, rendering: null, renderingStartTime: 0, last: d2, tail: c2, tailMode: e } : (f2.isBackwards = b2, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d2, f2.tail = c2, f2.tailMode = e);
      }
      function yj(a2, b2, c2) {
        var d2 = b2.pendingProps, e = d2.revealOrder, f2 = d2.tail;
        Yi(a2, b2, d2.children, c2);
        d2 = M2.current;
        if (0 !== (d2 & 2))
          d2 = d2 & 1 | 2, b2.flags |= 128;
        else {
          if (null !== a2 && 0 !== (a2.flags & 128))
            a:
              for (a2 = b2.child; null !== a2; ) {
                if (13 === a2.tag)
                  null !== a2.memoizedState && wj(a2, c2, b2);
                else if (19 === a2.tag)
                  wj(a2, c2, b2);
                else if (null !== a2.child) {
                  a2.child.return = a2;
                  a2 = a2.child;
                  continue;
                }
                if (a2 === b2)
                  break a;
                for (; null === a2.sibling; ) {
                  if (null === a2.return || a2.return === b2)
                    break a;
                  a2 = a2.return;
                }
                a2.sibling.return = a2.return;
                a2 = a2.sibling;
              }
          d2 &= 1;
        }
        G2(M2, d2);
        if (0 === (b2.mode & 1))
          b2.memoizedState = null;
        else
          switch (e) {
            case "forwards":
              c2 = b2.child;
              for (e = null; null !== c2; )
                a2 = c2.alternate, null !== a2 && null === Mh(a2) && (e = c2), c2 = c2.sibling;
              c2 = e;
              null === c2 ? (e = b2.child, b2.child = null) : (e = c2.sibling, c2.sibling = null);
              xj(b2, false, e, c2, f2);
              break;
            case "backwards":
              c2 = null;
              e = b2.child;
              for (b2.child = null; null !== e; ) {
                a2 = e.alternate;
                if (null !== a2 && null === Mh(a2)) {
                  b2.child = e;
                  break;
                }
                a2 = e.sibling;
                e.sibling = c2;
                c2 = e;
                e = a2;
              }
              xj(b2, true, c2, null, f2);
              break;
            case "together":
              xj(b2, false, null, null, void 0);
              break;
            default:
              b2.memoizedState = null;
          }
        return b2.child;
      }
      function jj(a2, b2) {
        0 === (b2.mode & 1) && null !== a2 && (a2.alternate = null, b2.alternate = null, b2.flags |= 2);
      }
      function $i(a2, b2, c2) {
        null !== a2 && (b2.dependencies = a2.dependencies);
        hh |= b2.lanes;
        if (0 === (c2 & b2.childLanes))
          return null;
        if (null !== a2 && b2.child !== a2.child)
          throw Error(p2(153));
        if (null !== b2.child) {
          a2 = b2.child;
          c2 = wh(a2, a2.pendingProps);
          b2.child = c2;
          for (c2.return = b2; null !== a2.sibling; )
            a2 = a2.sibling, c2 = c2.sibling = wh(a2, a2.pendingProps), c2.return = b2;
          c2.sibling = null;
        }
        return b2.child;
      }
      function zj(a2, b2, c2) {
        switch (b2.tag) {
          case 3:
            lj(b2);
            Ig();
            break;
          case 5:
            Kh(b2);
            break;
          case 1:
            Zf(b2.type) && cg(b2);
            break;
          case 4:
            Ih(b2, b2.stateNode.containerInfo);
            break;
          case 10:
            var d2 = b2.type._context, e = b2.memoizedProps.value;
            G2(Mg, d2._currentValue);
            d2._currentValue = e;
            break;
          case 13:
            d2 = b2.memoizedState;
            if (null !== d2) {
              if (null !== d2.dehydrated)
                return G2(M2, M2.current & 1), b2.flags |= 128, null;
              if (0 !== (c2 & b2.child.childLanes))
                return pj(a2, b2, c2);
              G2(M2, M2.current & 1);
              a2 = $i(a2, b2, c2);
              return null !== a2 ? a2.sibling : null;
            }
            G2(M2, M2.current & 1);
            break;
          case 19:
            d2 = 0 !== (c2 & b2.childLanes);
            if (0 !== (a2.flags & 128)) {
              if (d2)
                return yj(a2, b2, c2);
              b2.flags |= 128;
            }
            e = b2.memoizedState;
            null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
            G2(M2, M2.current);
            if (d2)
              break;
            else
              return null;
          case 22:
          case 23:
            return b2.lanes = 0, ej(a2, b2, c2);
        }
        return $i(a2, b2, c2);
      }
      var Aj;
      var Bj;
      var Cj;
      var Dj;
      Aj = function(a2, b2) {
        for (var c2 = b2.child; null !== c2; ) {
          if (5 === c2.tag || 6 === c2.tag)
            a2.appendChild(c2.stateNode);
          else if (4 !== c2.tag && null !== c2.child) {
            c2.child.return = c2;
            c2 = c2.child;
            continue;
          }
          if (c2 === b2)
            break;
          for (; null === c2.sibling; ) {
            if (null === c2.return || c2.return === b2)
              return;
            c2 = c2.return;
          }
          c2.sibling.return = c2.return;
          c2 = c2.sibling;
        }
      };
      Bj = function() {
      };
      Cj = function(a2, b2, c2, d2) {
        var e = a2.memoizedProps;
        if (e !== d2) {
          a2 = b2.stateNode;
          Hh(Eh.current);
          var f2 = null;
          switch (c2) {
            case "input":
              e = Ya(a2, e);
              d2 = Ya(a2, d2);
              f2 = [];
              break;
            case "select":
              e = A2({}, e, { value: void 0 });
              d2 = A2({}, d2, { value: void 0 });
              f2 = [];
              break;
            case "textarea":
              e = gb(a2, e);
              d2 = gb(a2, d2);
              f2 = [];
              break;
            default:
              "function" !== typeof e.onClick && "function" === typeof d2.onClick && (a2.onclick = Bf);
          }
          ub(c2, d2);
          var g2;
          c2 = null;
          for (l2 in e)
            if (!d2.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2])
              if ("style" === l2) {
                var h2 = e[l2];
                for (g2 in h2)
                  h2.hasOwnProperty(g2) && (c2 || (c2 = {}), c2[g2] = "");
              } else
                "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
          for (l2 in d2) {
            var k2 = d2[l2];
            h2 = null != e ? e[l2] : void 0;
            if (d2.hasOwnProperty(l2) && k2 !== h2 && (null != k2 || null != h2))
              if ("style" === l2)
                if (h2) {
                  for (g2 in h2)
                    !h2.hasOwnProperty(g2) || k2 && k2.hasOwnProperty(g2) || (c2 || (c2 = {}), c2[g2] = "");
                  for (g2 in k2)
                    k2.hasOwnProperty(g2) && h2[g2] !== k2[g2] && (c2 || (c2 = {}), c2[g2] = k2[g2]);
                } else
                  c2 || (f2 || (f2 = []), f2.push(
                    l2,
                    c2
                  )), c2 = k2;
              else
                "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h2 = h2 ? h2.__html : void 0, null != k2 && h2 !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D2("scroll", a2), f2 || h2 === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
          }
          c2 && (f2 = f2 || []).push("style", c2);
          var l2 = f2;
          if (b2.updateQueue = l2)
            b2.flags |= 4;
        }
      };
      Dj = function(a2, b2, c2, d2) {
        c2 !== d2 && (b2.flags |= 4);
      };
      function Ej(a2, b2) {
        if (!I2)
          switch (a2.tailMode) {
            case "hidden":
              b2 = a2.tail;
              for (var c2 = null; null !== b2; )
                null !== b2.alternate && (c2 = b2), b2 = b2.sibling;
              null === c2 ? a2.tail = null : c2.sibling = null;
              break;
            case "collapsed":
              c2 = a2.tail;
              for (var d2 = null; null !== c2; )
                null !== c2.alternate && (d2 = c2), c2 = c2.sibling;
              null === d2 ? b2 || null === a2.tail ? a2.tail = null : a2.tail.sibling = null : d2.sibling = null;
          }
      }
      function S2(a2) {
        var b2 = null !== a2.alternate && a2.alternate.child === a2.child, c2 = 0, d2 = 0;
        if (b2)
          for (var e = a2.child; null !== e; )
            c2 |= e.lanes | e.childLanes, d2 |= e.subtreeFlags & 14680064, d2 |= e.flags & 14680064, e.return = a2, e = e.sibling;
        else
          for (e = a2.child; null !== e; )
            c2 |= e.lanes | e.childLanes, d2 |= e.subtreeFlags, d2 |= e.flags, e.return = a2, e = e.sibling;
        a2.subtreeFlags |= d2;
        a2.childLanes = c2;
        return b2;
      }
      function Fj(a2, b2, c2) {
        var d2 = b2.pendingProps;
        wg(b2);
        switch (b2.tag) {
          case 2:
          case 16:
          case 15:
          case 0:
          case 11:
          case 7:
          case 8:
          case 12:
          case 9:
          case 14:
            return S2(b2), null;
          case 1:
            return Zf(b2.type) && $f(), S2(b2), null;
          case 3:
            d2 = b2.stateNode;
            Jh();
            E2(Wf);
            E2(H2);
            Oh();
            d2.pendingContext && (d2.context = d2.pendingContext, d2.pendingContext = null);
            if (null === a2 || null === a2.child)
              Gg(b2) ? b2.flags |= 4 : null === a2 || a2.memoizedState.isDehydrated && 0 === (b2.flags & 256) || (b2.flags |= 1024, null !== zg && (Gj(zg), zg = null));
            Bj(a2, b2);
            S2(b2);
            return null;
          case 5:
            Lh(b2);
            var e = Hh(Gh.current);
            c2 = b2.type;
            if (null !== a2 && null != b2.stateNode)
              Cj(a2, b2, c2, d2, e), a2.ref !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
            else {
              if (!d2) {
                if (null === b2.stateNode)
                  throw Error(p2(166));
                S2(b2);
                return null;
              }
              a2 = Hh(Eh.current);
              if (Gg(b2)) {
                d2 = b2.stateNode;
                c2 = b2.type;
                var f2 = b2.memoizedProps;
                d2[Of] = b2;
                d2[Pf] = f2;
                a2 = 0 !== (b2.mode & 1);
                switch (c2) {
                  case "dialog":
                    D2("cancel", d2);
                    D2("close", d2);
                    break;
                  case "iframe":
                  case "object":
                  case "embed":
                    D2("load", d2);
                    break;
                  case "video":
                  case "audio":
                    for (e = 0; e < lf.length; e++)
                      D2(lf[e], d2);
                    break;
                  case "source":
                    D2("error", d2);
                    break;
                  case "img":
                  case "image":
                  case "link":
                    D2(
                      "error",
                      d2
                    );
                    D2("load", d2);
                    break;
                  case "details":
                    D2("toggle", d2);
                    break;
                  case "input":
                    Za(d2, f2);
                    D2("invalid", d2);
                    break;
                  case "select":
                    d2._wrapperState = { wasMultiple: !!f2.multiple };
                    D2("invalid", d2);
                    break;
                  case "textarea":
                    hb(d2, f2), D2("invalid", d2);
                }
                ub(c2, f2);
                e = null;
                for (var g2 in f2)
                  if (f2.hasOwnProperty(g2)) {
                    var h2 = f2[g2];
                    "children" === g2 ? "string" === typeof h2 ? d2.textContent !== h2 && (true !== f2.suppressHydrationWarning && Af(d2.textContent, h2, a2), e = ["children", h2]) : "number" === typeof h2 && d2.textContent !== "" + h2 && (true !== f2.suppressHydrationWarning && Af(
                      d2.textContent,
                      h2,
                      a2
                    ), e = ["children", "" + h2]) : ea.hasOwnProperty(g2) && null != h2 && "onScroll" === g2 && D2("scroll", d2);
                  }
                switch (c2) {
                  case "input":
                    Va(d2);
                    db(d2, f2, true);
                    break;
                  case "textarea":
                    Va(d2);
                    jb(d2);
                    break;
                  case "select":
                  case "option":
                    break;
                  default:
                    "function" === typeof f2.onClick && (d2.onclick = Bf);
                }
                d2 = e;
                b2.updateQueue = d2;
                null !== d2 && (b2.flags |= 4);
              } else {
                g2 = 9 === e.nodeType ? e : e.ownerDocument;
                "http://www.w3.org/1999/xhtml" === a2 && (a2 = kb(c2));
                "http://www.w3.org/1999/xhtml" === a2 ? "script" === c2 ? (a2 = g2.createElement("div"), a2.innerHTML = "<script><\/script>", a2 = a2.removeChild(a2.firstChild)) : "string" === typeof d2.is ? a2 = g2.createElement(c2, { is: d2.is }) : (a2 = g2.createElement(c2), "select" === c2 && (g2 = a2, d2.multiple ? g2.multiple = true : d2.size && (g2.size = d2.size))) : a2 = g2.createElementNS(a2, c2);
                a2[Of] = b2;
                a2[Pf] = d2;
                Aj(a2, b2, false, false);
                b2.stateNode = a2;
                a: {
                  g2 = vb(c2, d2);
                  switch (c2) {
                    case "dialog":
                      D2("cancel", a2);
                      D2("close", a2);
                      e = d2;
                      break;
                    case "iframe":
                    case "object":
                    case "embed":
                      D2("load", a2);
                      e = d2;
                      break;
                    case "video":
                    case "audio":
                      for (e = 0; e < lf.length; e++)
                        D2(lf[e], a2);
                      e = d2;
                      break;
                    case "source":
                      D2("error", a2);
                      e = d2;
                      break;
                    case "img":
                    case "image":
                    case "link":
                      D2(
                        "error",
                        a2
                      );
                      D2("load", a2);
                      e = d2;
                      break;
                    case "details":
                      D2("toggle", a2);
                      e = d2;
                      break;
                    case "input":
                      Za(a2, d2);
                      e = Ya(a2, d2);
                      D2("invalid", a2);
                      break;
                    case "option":
                      e = d2;
                      break;
                    case "select":
                      a2._wrapperState = { wasMultiple: !!d2.multiple };
                      e = A2({}, d2, { value: void 0 });
                      D2("invalid", a2);
                      break;
                    case "textarea":
                      hb(a2, d2);
                      e = gb(a2, d2);
                      D2("invalid", a2);
                      break;
                    default:
                      e = d2;
                  }
                  ub(c2, e);
                  h2 = e;
                  for (f2 in h2)
                    if (h2.hasOwnProperty(f2)) {
                      var k2 = h2[f2];
                      "style" === f2 ? sb(a2, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a2, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c2 || "" !== k2) && ob(a2, k2) : "number" === typeof k2 && ob(a2, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D2("scroll", a2) : null != k2 && ta(a2, f2, k2, g2));
                    }
                  switch (c2) {
                    case "input":
                      Va(a2);
                      db(a2, d2, false);
                      break;
                    case "textarea":
                      Va(a2);
                      jb(a2);
                      break;
                    case "option":
                      null != d2.value && a2.setAttribute("value", "" + Sa(d2.value));
                      break;
                    case "select":
                      a2.multiple = !!d2.multiple;
                      f2 = d2.value;
                      null != f2 ? fb(a2, !!d2.multiple, f2, false) : null != d2.defaultValue && fb(
                        a2,
                        !!d2.multiple,
                        d2.defaultValue,
                        true
                      );
                      break;
                    default:
                      "function" === typeof e.onClick && (a2.onclick = Bf);
                  }
                  switch (c2) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      d2 = !!d2.autoFocus;
                      break a;
                    case "img":
                      d2 = true;
                      break a;
                    default:
                      d2 = false;
                  }
                }
                d2 && (b2.flags |= 4);
              }
              null !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
            }
            S2(b2);
            return null;
          case 6:
            if (a2 && null != b2.stateNode)
              Dj(a2, b2, a2.memoizedProps, d2);
            else {
              if ("string" !== typeof d2 && null === b2.stateNode)
                throw Error(p2(166));
              c2 = Hh(Gh.current);
              Hh(Eh.current);
              if (Gg(b2)) {
                d2 = b2.stateNode;
                c2 = b2.memoizedProps;
                d2[Of] = b2;
                if (f2 = d2.nodeValue !== c2) {
                  if (a2 = xg, null !== a2)
                    switch (a2.tag) {
                      case 3:
                        Af(d2.nodeValue, c2, 0 !== (a2.mode & 1));
                        break;
                      case 5:
                        true !== a2.memoizedProps.suppressHydrationWarning && Af(d2.nodeValue, c2, 0 !== (a2.mode & 1));
                    }
                }
                f2 && (b2.flags |= 4);
              } else
                d2 = (9 === c2.nodeType ? c2 : c2.ownerDocument).createTextNode(d2), d2[Of] = b2, b2.stateNode = d2;
            }
            S2(b2);
            return null;
          case 13:
            E2(M2);
            d2 = b2.memoizedState;
            if (null === a2 || null !== a2.memoizedState && null !== a2.memoizedState.dehydrated) {
              if (I2 && null !== yg && 0 !== (b2.mode & 1) && 0 === (b2.flags & 128))
                Hg(), Ig(), b2.flags |= 98560, f2 = false;
              else if (f2 = Gg(b2), null !== d2 && null !== d2.dehydrated) {
                if (null === a2) {
                  if (!f2)
                    throw Error(p2(318));
                  f2 = b2.memoizedState;
                  f2 = null !== f2 ? f2.dehydrated : null;
                  if (!f2)
                    throw Error(p2(317));
                  f2[Of] = b2;
                } else
                  Ig(), 0 === (b2.flags & 128) && (b2.memoizedState = null), b2.flags |= 4;
                S2(b2);
                f2 = false;
              } else
                null !== zg && (Gj(zg), zg = null), f2 = true;
              if (!f2)
                return b2.flags & 65536 ? b2 : null;
            }
            if (0 !== (b2.flags & 128))
              return b2.lanes = c2, b2;
            d2 = null !== d2;
            d2 !== (null !== a2 && null !== a2.memoizedState) && d2 && (b2.child.flags |= 8192, 0 !== (b2.mode & 1) && (null === a2 || 0 !== (M2.current & 1) ? 0 === T2 && (T2 = 3) : uj()));
            null !== b2.updateQueue && (b2.flags |= 4);
            S2(b2);
            return null;
          case 4:
            return Jh(), Bj(a2, b2), null === a2 && sf(b2.stateNode.containerInfo), S2(b2), null;
          case 10:
            return Rg(b2.type._context), S2(b2), null;
          case 17:
            return Zf(b2.type) && $f(), S2(b2), null;
          case 19:
            E2(M2);
            f2 = b2.memoizedState;
            if (null === f2)
              return S2(b2), null;
            d2 = 0 !== (b2.flags & 128);
            g2 = f2.rendering;
            if (null === g2)
              if (d2)
                Ej(f2, false);
              else {
                if (0 !== T2 || null !== a2 && 0 !== (a2.flags & 128))
                  for (a2 = b2.child; null !== a2; ) {
                    g2 = Mh(a2);
                    if (null !== g2) {
                      b2.flags |= 128;
                      Ej(f2, false);
                      d2 = g2.updateQueue;
                      null !== d2 && (b2.updateQueue = d2, b2.flags |= 4);
                      b2.subtreeFlags = 0;
                      d2 = c2;
                      for (c2 = b2.child; null !== c2; )
                        f2 = c2, a2 = d2, f2.flags &= 14680066, g2 = f2.alternate, null === g2 ? (f2.childLanes = 0, f2.lanes = a2, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g2.childLanes, f2.lanes = g2.lanes, f2.child = g2.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g2.memoizedProps, f2.memoizedState = g2.memoizedState, f2.updateQueue = g2.updateQueue, f2.type = g2.type, a2 = g2.dependencies, f2.dependencies = null === a2 ? null : { lanes: a2.lanes, firstContext: a2.firstContext }), c2 = c2.sibling;
                      G2(M2, M2.current & 1 | 2);
                      return b2.child;
                    }
                    a2 = a2.sibling;
                  }
                null !== f2.tail && B2() > Hj && (b2.flags |= 128, d2 = true, Ej(f2, false), b2.lanes = 4194304);
              }
            else {
              if (!d2)
                if (a2 = Mh(g2), null !== a2) {
                  if (b2.flags |= 128, d2 = true, c2 = a2.updateQueue, null !== c2 && (b2.updateQueue = c2, b2.flags |= 4), Ej(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g2.alternate && !I2)
                    return S2(b2), null;
                } else
                  2 * B2() - f2.renderingStartTime > Hj && 1073741824 !== c2 && (b2.flags |= 128, d2 = true, Ej(f2, false), b2.lanes = 4194304);
              f2.isBackwards ? (g2.sibling = b2.child, b2.child = g2) : (c2 = f2.last, null !== c2 ? c2.sibling = g2 : b2.child = g2, f2.last = g2);
            }
            if (null !== f2.tail)
              return b2 = f2.tail, f2.rendering = b2, f2.tail = b2.sibling, f2.renderingStartTime = B2(), b2.sibling = null, c2 = M2.current, G2(M2, d2 ? c2 & 1 | 2 : c2 & 1), b2;
            S2(b2);
            return null;
          case 22:
          case 23:
            return Ij(), d2 = null !== b2.memoizedState, null !== a2 && null !== a2.memoizedState !== d2 && (b2.flags |= 8192), d2 && 0 !== (b2.mode & 1) ? 0 !== (gj & 1073741824) && (S2(b2), b2.subtreeFlags & 6 && (b2.flags |= 8192)) : S2(b2), null;
          case 24:
            return null;
          case 25:
            return null;
        }
        throw Error(p2(156, b2.tag));
      }
      function Jj(a2, b2) {
        wg(b2);
        switch (b2.tag) {
          case 1:
            return Zf(b2.type) && $f(), a2 = b2.flags, a2 & 65536 ? (b2.flags = a2 & -65537 | 128, b2) : null;
          case 3:
            return Jh(), E2(Wf), E2(H2), Oh(), a2 = b2.flags, 0 !== (a2 & 65536) && 0 === (a2 & 128) ? (b2.flags = a2 & -65537 | 128, b2) : null;
          case 5:
            return Lh(b2), null;
          case 13:
            E2(M2);
            a2 = b2.memoizedState;
            if (null !== a2 && null !== a2.dehydrated) {
              if (null === b2.alternate)
                throw Error(p2(340));
              Ig();
            }
            a2 = b2.flags;
            return a2 & 65536 ? (b2.flags = a2 & -65537 | 128, b2) : null;
          case 19:
            return E2(M2), null;
          case 4:
            return Jh(), null;
          case 10:
            return Rg(b2.type._context), null;
          case 22:
          case 23:
            return Ij(), null;
          case 24:
            return null;
          default:
            return null;
        }
      }
      var Kj = false;
      var U2 = false;
      var Lj = "function" === typeof WeakSet ? WeakSet : Set;
      var V = null;
      function Mj(a2, b2) {
        var c2 = a2.ref;
        if (null !== c2)
          if ("function" === typeof c2)
            try {
              c2(null);
            } catch (d2) {
              W2(a2, b2, d2);
            }
          else
            c2.current = null;
      }
      function Nj(a2, b2, c2) {
        try {
          c2();
        } catch (d2) {
          W2(a2, b2, d2);
        }
      }
      var Oj = false;
      function Pj(a2, b2) {
        Cf = dd;
        a2 = Me();
        if (Ne(a2)) {
          if ("selectionStart" in a2)
            var c2 = { start: a2.selectionStart, end: a2.selectionEnd };
          else
            a: {
              c2 = (c2 = a2.ownerDocument) && c2.defaultView || window;
              var d2 = c2.getSelection && c2.getSelection();
              if (d2 && 0 !== d2.rangeCount) {
                c2 = d2.anchorNode;
                var e = d2.anchorOffset, f2 = d2.focusNode;
                d2 = d2.focusOffset;
                try {
                  c2.nodeType, f2.nodeType;
                } catch (F2) {
                  c2 = null;
                  break a;
                }
                var g2 = 0, h2 = -1, k2 = -1, l2 = 0, m = 0, q2 = a2, r2 = null;
                b:
                  for (; ; ) {
                    for (var y2; ; ) {
                      q2 !== c2 || 0 !== e && 3 !== q2.nodeType || (h2 = g2 + e);
                      q2 !== f2 || 0 !== d2 && 3 !== q2.nodeType || (k2 = g2 + d2);
                      3 === q2.nodeType && (g2 += q2.nodeValue.length);
                      if (null === (y2 = q2.firstChild))
                        break;
                      r2 = q2;
                      q2 = y2;
                    }
                    for (; ; ) {
                      if (q2 === a2)
                        break b;
                      r2 === c2 && ++l2 === e && (h2 = g2);
                      r2 === f2 && ++m === d2 && (k2 = g2);
                      if (null !== (y2 = q2.nextSibling))
                        break;
                      q2 = r2;
                      r2 = q2.parentNode;
                    }
                    q2 = y2;
                  }
                c2 = -1 === h2 || -1 === k2 ? null : { start: h2, end: k2 };
              } else
                c2 = null;
            }
          c2 = c2 || { start: 0, end: 0 };
        } else
          c2 = null;
        Df = { focusedElem: a2, selectionRange: c2 };
        dd = false;
        for (V = b2; null !== V; )
          if (b2 = V, a2 = b2.child, 0 !== (b2.subtreeFlags & 1028) && null !== a2)
            a2.return = b2, V = a2;
          else
            for (; null !== V; ) {
              b2 = V;
              try {
                var n2 = b2.alternate;
                if (0 !== (b2.flags & 1024))
                  switch (b2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      break;
                    case 1:
                      if (null !== n2) {
                        var t2 = n2.memoizedProps, J = n2.memoizedState, x2 = b2.stateNode, w2 = x2.getSnapshotBeforeUpdate(b2.elementType === b2.type ? t2 : Lg(b2.type, t2), J);
                        x2.__reactInternalSnapshotBeforeUpdate = w2;
                      }
                      break;
                    case 3:
                      var u2 = b2.stateNode.containerInfo;
                      1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
                      break;
                    case 5:
                    case 6:
                    case 4:
                    case 17:
                      break;
                    default:
                      throw Error(p2(163));
                  }
              } catch (F2) {
                W2(b2, b2.return, F2);
              }
              a2 = b2.sibling;
              if (null !== a2) {
                a2.return = b2.return;
                V = a2;
                break;
              }
              V = b2.return;
            }
        n2 = Oj;
        Oj = false;
        return n2;
      }
      function Qj(a2, b2, c2) {
        var d2 = b2.updateQueue;
        d2 = null !== d2 ? d2.lastEffect : null;
        if (null !== d2) {
          var e = d2 = d2.next;
          do {
            if ((e.tag & a2) === a2) {
              var f2 = e.destroy;
              e.destroy = void 0;
              void 0 !== f2 && Nj(b2, c2, f2);
            }
            e = e.next;
          } while (e !== d2);
        }
      }
      function Rj(a2, b2) {
        b2 = b2.updateQueue;
        b2 = null !== b2 ? b2.lastEffect : null;
        if (null !== b2) {
          var c2 = b2 = b2.next;
          do {
            if ((c2.tag & a2) === a2) {
              var d2 = c2.create;
              c2.destroy = d2();
            }
            c2 = c2.next;
          } while (c2 !== b2);
        }
      }
      function Sj(a2) {
        var b2 = a2.ref;
        if (null !== b2) {
          var c2 = a2.stateNode;
          switch (a2.tag) {
            case 5:
              a2 = c2;
              break;
            default:
              a2 = c2;
          }
          "function" === typeof b2 ? b2(a2) : b2.current = a2;
        }
      }
      function Tj(a2) {
        var b2 = a2.alternate;
        null !== b2 && (a2.alternate = null, Tj(b2));
        a2.child = null;
        a2.deletions = null;
        a2.sibling = null;
        5 === a2.tag && (b2 = a2.stateNode, null !== b2 && (delete b2[Of], delete b2[Pf], delete b2[of], delete b2[Qf], delete b2[Rf]));
        a2.stateNode = null;
        a2.return = null;
        a2.dependencies = null;
        a2.memoizedProps = null;
        a2.memoizedState = null;
        a2.pendingProps = null;
        a2.stateNode = null;
        a2.updateQueue = null;
      }
      function Uj(a2) {
        return 5 === a2.tag || 3 === a2.tag || 4 === a2.tag;
      }
      function Vj(a2) {
        a:
          for (; ; ) {
            for (; null === a2.sibling; ) {
              if (null === a2.return || Uj(a2.return))
                return null;
              a2 = a2.return;
            }
            a2.sibling.return = a2.return;
            for (a2 = a2.sibling; 5 !== a2.tag && 6 !== a2.tag && 18 !== a2.tag; ) {
              if (a2.flags & 2)
                continue a;
              if (null === a2.child || 4 === a2.tag)
                continue a;
              else
                a2.child.return = a2, a2 = a2.child;
            }
            if (!(a2.flags & 2))
              return a2.stateNode;
          }
      }
      function Wj(a2, b2, c2) {
        var d2 = a2.tag;
        if (5 === d2 || 6 === d2)
          a2 = a2.stateNode, b2 ? 8 === c2.nodeType ? c2.parentNode.insertBefore(a2, b2) : c2.insertBefore(a2, b2) : (8 === c2.nodeType ? (b2 = c2.parentNode, b2.insertBefore(a2, c2)) : (b2 = c2, b2.appendChild(a2)), c2 = c2._reactRootContainer, null !== c2 && void 0 !== c2 || null !== b2.onclick || (b2.onclick = Bf));
        else if (4 !== d2 && (a2 = a2.child, null !== a2))
          for (Wj(a2, b2, c2), a2 = a2.sibling; null !== a2; )
            Wj(a2, b2, c2), a2 = a2.sibling;
      }
      function Xj(a2, b2, c2) {
        var d2 = a2.tag;
        if (5 === d2 || 6 === d2)
          a2 = a2.stateNode, b2 ? c2.insertBefore(a2, b2) : c2.appendChild(a2);
        else if (4 !== d2 && (a2 = a2.child, null !== a2))
          for (Xj(a2, b2, c2), a2 = a2.sibling; null !== a2; )
            Xj(a2, b2, c2), a2 = a2.sibling;
      }
      var X2 = null;
      var Yj = false;
      function Zj(a2, b2, c2) {
        for (c2 = c2.child; null !== c2; )
          ak(a2, b2, c2), c2 = c2.sibling;
      }
      function ak(a2, b2, c2) {
        if (lc && "function" === typeof lc.onCommitFiberUnmount)
          try {
            lc.onCommitFiberUnmount(kc, c2);
          } catch (h2) {
          }
        switch (c2.tag) {
          case 5:
            U2 || Mj(c2, b2);
          case 6:
            var d2 = X2, e = Yj;
            X2 = null;
            Zj(a2, b2, c2);
            X2 = d2;
            Yj = e;
            null !== X2 && (Yj ? (a2 = X2, c2 = c2.stateNode, 8 === a2.nodeType ? a2.parentNode.removeChild(c2) : a2.removeChild(c2)) : X2.removeChild(c2.stateNode));
            break;
          case 18:
            null !== X2 && (Yj ? (a2 = X2, c2 = c2.stateNode, 8 === a2.nodeType ? Kf(a2.parentNode, c2) : 1 === a2.nodeType && Kf(a2, c2), bd(a2)) : Kf(X2, c2.stateNode));
            break;
          case 4:
            d2 = X2;
            e = Yj;
            X2 = c2.stateNode.containerInfo;
            Yj = true;
            Zj(a2, b2, c2);
            X2 = d2;
            Yj = e;
            break;
          case 0:
          case 11:
          case 14:
          case 15:
            if (!U2 && (d2 = c2.updateQueue, null !== d2 && (d2 = d2.lastEffect, null !== d2))) {
              e = d2 = d2.next;
              do {
                var f2 = e, g2 = f2.destroy;
                f2 = f2.tag;
                void 0 !== g2 && (0 !== (f2 & 2) ? Nj(c2, b2, g2) : 0 !== (f2 & 4) && Nj(c2, b2, g2));
                e = e.next;
              } while (e !== d2);
            }
            Zj(a2, b2, c2);
            break;
          case 1:
            if (!U2 && (Mj(c2, b2), d2 = c2.stateNode, "function" === typeof d2.componentWillUnmount))
              try {
                d2.props = c2.memoizedProps, d2.state = c2.memoizedState, d2.componentWillUnmount();
              } catch (h2) {
                W2(c2, b2, h2);
              }
            Zj(a2, b2, c2);
            break;
          case 21:
            Zj(a2, b2, c2);
            break;
          case 22:
            c2.mode & 1 ? (U2 = (d2 = U2) || null !== c2.memoizedState, Zj(a2, b2, c2), U2 = d2) : Zj(a2, b2, c2);
            break;
          default:
            Zj(a2, b2, c2);
        }
      }
      function bk(a2) {
        var b2 = a2.updateQueue;
        if (null !== b2) {
          a2.updateQueue = null;
          var c2 = a2.stateNode;
          null === c2 && (c2 = a2.stateNode = new Lj());
          b2.forEach(function(b3) {
            var d2 = ck.bind(null, a2, b3);
            c2.has(b3) || (c2.add(b3), b3.then(d2, d2));
          });
        }
      }
      function dk(a2, b2) {
        var c2 = b2.deletions;
        if (null !== c2)
          for (var d2 = 0; d2 < c2.length; d2++) {
            var e = c2[d2];
            try {
              var f2 = a2, g2 = b2, h2 = g2;
              a:
                for (; null !== h2; ) {
                  switch (h2.tag) {
                    case 5:
                      X2 = h2.stateNode;
                      Yj = false;
                      break a;
                    case 3:
                      X2 = h2.stateNode.containerInfo;
                      Yj = true;
                      break a;
                    case 4:
                      X2 = h2.stateNode.containerInfo;
                      Yj = true;
                      break a;
                  }
                  h2 = h2.return;
                }
              if (null === X2)
                throw Error(p2(160));
              ak(f2, g2, e);
              X2 = null;
              Yj = false;
              var k2 = e.alternate;
              null !== k2 && (k2.return = null);
              e.return = null;
            } catch (l2) {
              W2(e, b2, l2);
            }
          }
        if (b2.subtreeFlags & 12854)
          for (b2 = b2.child; null !== b2; )
            ek(b2, a2), b2 = b2.sibling;
      }
      function ek(a2, b2) {
        var c2 = a2.alternate, d2 = a2.flags;
        switch (a2.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            dk(b2, a2);
            fk(a2);
            if (d2 & 4) {
              try {
                Qj(3, a2, a2.return), Rj(3, a2);
              } catch (t2) {
                W2(a2, a2.return, t2);
              }
              try {
                Qj(5, a2, a2.return);
              } catch (t2) {
                W2(a2, a2.return, t2);
              }
            }
            break;
          case 1:
            dk(b2, a2);
            fk(a2);
            d2 & 512 && null !== c2 && Mj(c2, c2.return);
            break;
          case 5:
            dk(b2, a2);
            fk(a2);
            d2 & 512 && null !== c2 && Mj(c2, c2.return);
            if (a2.flags & 32) {
              var e = a2.stateNode;
              try {
                ob(e, "");
              } catch (t2) {
                W2(a2, a2.return, t2);
              }
            }
            if (d2 & 4 && (e = a2.stateNode, null != e)) {
              var f2 = a2.memoizedProps, g2 = null !== c2 ? c2.memoizedProps : f2, h2 = a2.type, k2 = a2.updateQueue;
              a2.updateQueue = null;
              if (null !== k2)
                try {
                  "input" === h2 && "radio" === f2.type && null != f2.name && ab(e, f2);
                  vb(h2, g2);
                  var l2 = vb(h2, f2);
                  for (g2 = 0; g2 < k2.length; g2 += 2) {
                    var m = k2[g2], q2 = k2[g2 + 1];
                    "style" === m ? sb(e, q2) : "dangerouslySetInnerHTML" === m ? nb(e, q2) : "children" === m ? ob(e, q2) : ta(e, m, q2, l2);
                  }
                  switch (h2) {
                    case "input":
                      bb(e, f2);
                      break;
                    case "textarea":
                      ib(e, f2);
                      break;
                    case "select":
                      var r2 = e._wrapperState.wasMultiple;
                      e._wrapperState.wasMultiple = !!f2.multiple;
                      var y2 = f2.value;
                      null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                        e,
                        !!f2.multiple,
                        f2.defaultValue,
                        true
                      ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
                  }
                  e[Pf] = f2;
                } catch (t2) {
                  W2(a2, a2.return, t2);
                }
            }
            break;
          case 6:
            dk(b2, a2);
            fk(a2);
            if (d2 & 4) {
              if (null === a2.stateNode)
                throw Error(p2(162));
              e = a2.stateNode;
              f2 = a2.memoizedProps;
              try {
                e.nodeValue = f2;
              } catch (t2) {
                W2(a2, a2.return, t2);
              }
            }
            break;
          case 3:
            dk(b2, a2);
            fk(a2);
            if (d2 & 4 && null !== c2 && c2.memoizedState.isDehydrated)
              try {
                bd(b2.containerInfo);
              } catch (t2) {
                W2(a2, a2.return, t2);
              }
            break;
          case 4:
            dk(b2, a2);
            fk(a2);
            break;
          case 13:
            dk(b2, a2);
            fk(a2);
            e = a2.child;
            e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (gk = B2()));
            d2 & 4 && bk(a2);
            break;
          case 22:
            m = null !== c2 && null !== c2.memoizedState;
            a2.mode & 1 ? (U2 = (l2 = U2) || m, dk(b2, a2), U2 = l2) : dk(b2, a2);
            fk(a2);
            if (d2 & 8192) {
              l2 = null !== a2.memoizedState;
              if ((a2.stateNode.isHidden = l2) && !m && 0 !== (a2.mode & 1))
                for (V = a2, m = a2.child; null !== m; ) {
                  for (q2 = V = m; null !== V; ) {
                    r2 = V;
                    y2 = r2.child;
                    switch (r2.tag) {
                      case 0:
                      case 11:
                      case 14:
                      case 15:
                        Qj(4, r2, r2.return);
                        break;
                      case 1:
                        Mj(r2, r2.return);
                        var n2 = r2.stateNode;
                        if ("function" === typeof n2.componentWillUnmount) {
                          d2 = r2;
                          c2 = r2.return;
                          try {
                            b2 = d2, n2.props = b2.memoizedProps, n2.state = b2.memoizedState, n2.componentWillUnmount();
                          } catch (t2) {
                            W2(d2, c2, t2);
                          }
                        }
                        break;
                      case 5:
                        Mj(r2, r2.return);
                        break;
                      case 22:
                        if (null !== r2.memoizedState) {
                          hk(q2);
                          continue;
                        }
                    }
                    null !== y2 ? (y2.return = r2, V = y2) : hk(q2);
                  }
                  m = m.sibling;
                }
              a:
                for (m = null, q2 = a2; ; ) {
                  if (5 === q2.tag) {
                    if (null === m) {
                      m = q2;
                      try {
                        e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h2 = q2.stateNode, k2 = q2.memoizedProps.style, g2 = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h2.style.display = rb("display", g2));
                      } catch (t2) {
                        W2(a2, a2.return, t2);
                      }
                    }
                  } else if (6 === q2.tag) {
                    if (null === m)
                      try {
                        q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
                      } catch (t2) {
                        W2(a2, a2.return, t2);
                      }
                  } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a2) && null !== q2.child) {
                    q2.child.return = q2;
                    q2 = q2.child;
                    continue;
                  }
                  if (q2 === a2)
                    break a;
                  for (; null === q2.sibling; ) {
                    if (null === q2.return || q2.return === a2)
                      break a;
                    m === q2 && (m = null);
                    q2 = q2.return;
                  }
                  m === q2 && (m = null);
                  q2.sibling.return = q2.return;
                  q2 = q2.sibling;
                }
            }
            break;
          case 19:
            dk(b2, a2);
            fk(a2);
            d2 & 4 && bk(a2);
            break;
          case 21:
            break;
          default:
            dk(
              b2,
              a2
            ), fk(a2);
        }
      }
      function fk(a2) {
        var b2 = a2.flags;
        if (b2 & 2) {
          try {
            a: {
              for (var c2 = a2.return; null !== c2; ) {
                if (Uj(c2)) {
                  var d2 = c2;
                  break a;
                }
                c2 = c2.return;
              }
              throw Error(p2(160));
            }
            switch (d2.tag) {
              case 5:
                var e = d2.stateNode;
                d2.flags & 32 && (ob(e, ""), d2.flags &= -33);
                var f2 = Vj(a2);
                Xj(a2, f2, e);
                break;
              case 3:
              case 4:
                var g2 = d2.stateNode.containerInfo, h2 = Vj(a2);
                Wj(a2, h2, g2);
                break;
              default:
                throw Error(p2(161));
            }
          } catch (k2) {
            W2(a2, a2.return, k2);
          }
          a2.flags &= -3;
        }
        b2 & 4096 && (a2.flags &= -4097);
      }
      function ik(a2, b2, c2) {
        V = a2;
        jk(a2, b2, c2);
      }
      function jk(a2, b2, c2) {
        for (var d2 = 0 !== (a2.mode & 1); null !== V; ) {
          var e = V, f2 = e.child;
          if (22 === e.tag && d2) {
            var g2 = null !== e.memoizedState || Kj;
            if (!g2) {
              var h2 = e.alternate, k2 = null !== h2 && null !== h2.memoizedState || U2;
              h2 = Kj;
              var l2 = U2;
              Kj = g2;
              if ((U2 = k2) && !l2)
                for (V = e; null !== V; )
                  g2 = V, k2 = g2.child, 22 === g2.tag && null !== g2.memoizedState ? kk(e) : null !== k2 ? (k2.return = g2, V = k2) : kk(e);
              for (; null !== f2; )
                V = f2, jk(f2, b2, c2), f2 = f2.sibling;
              V = e;
              Kj = h2;
              U2 = l2;
            }
            lk(a2, b2, c2);
          } else
            0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : lk(a2, b2, c2);
        }
      }
      function lk(a2) {
        for (; null !== V; ) {
          var b2 = V;
          if (0 !== (b2.flags & 8772)) {
            var c2 = b2.alternate;
            try {
              if (0 !== (b2.flags & 8772))
                switch (b2.tag) {
                  case 0:
                  case 11:
                  case 15:
                    U2 || Rj(5, b2);
                    break;
                  case 1:
                    var d2 = b2.stateNode;
                    if (b2.flags & 4 && !U2)
                      if (null === c2)
                        d2.componentDidMount();
                      else {
                        var e = b2.elementType === b2.type ? c2.memoizedProps : Lg(b2.type, c2.memoizedProps);
                        d2.componentDidUpdate(e, c2.memoizedState, d2.__reactInternalSnapshotBeforeUpdate);
                      }
                    var f2 = b2.updateQueue;
                    null !== f2 && ih(b2, f2, d2);
                    break;
                  case 3:
                    var g2 = b2.updateQueue;
                    if (null !== g2) {
                      c2 = null;
                      if (null !== b2.child)
                        switch (b2.child.tag) {
                          case 5:
                            c2 = b2.child.stateNode;
                            break;
                          case 1:
                            c2 = b2.child.stateNode;
                        }
                      ih(b2, g2, c2);
                    }
                    break;
                  case 5:
                    var h2 = b2.stateNode;
                    if (null === c2 && b2.flags & 4) {
                      c2 = h2;
                      var k2 = b2.memoizedProps;
                      switch (b2.type) {
                        case "button":
                        case "input":
                        case "select":
                        case "textarea":
                          k2.autoFocus && c2.focus();
                          break;
                        case "img":
                          k2.src && (c2.src = k2.src);
                      }
                    }
                    break;
                  case 6:
                    break;
                  case 4:
                    break;
                  case 12:
                    break;
                  case 13:
                    if (null === b2.memoizedState) {
                      var l2 = b2.alternate;
                      if (null !== l2) {
                        var m = l2.memoizedState;
                        if (null !== m) {
                          var q2 = m.dehydrated;
                          null !== q2 && bd(q2);
                        }
                      }
                    }
                    break;
                  case 19:
                  case 17:
                  case 21:
                  case 22:
                  case 23:
                  case 25:
                    break;
                  default:
                    throw Error(p2(163));
                }
              U2 || b2.flags & 512 && Sj(b2);
            } catch (r2) {
              W2(b2, b2.return, r2);
            }
          }
          if (b2 === a2) {
            V = null;
            break;
          }
          c2 = b2.sibling;
          if (null !== c2) {
            c2.return = b2.return;
            V = c2;
            break;
          }
          V = b2.return;
        }
      }
      function hk(a2) {
        for (; null !== V; ) {
          var b2 = V;
          if (b2 === a2) {
            V = null;
            break;
          }
          var c2 = b2.sibling;
          if (null !== c2) {
            c2.return = b2.return;
            V = c2;
            break;
          }
          V = b2.return;
        }
      }
      function kk(a2) {
        for (; null !== V; ) {
          var b2 = V;
          try {
            switch (b2.tag) {
              case 0:
              case 11:
              case 15:
                var c2 = b2.return;
                try {
                  Rj(4, b2);
                } catch (k2) {
                  W2(b2, c2, k2);
                }
                break;
              case 1:
                var d2 = b2.stateNode;
                if ("function" === typeof d2.componentDidMount) {
                  var e = b2.return;
                  try {
                    d2.componentDidMount();
                  } catch (k2) {
                    W2(b2, e, k2);
                  }
                }
                var f2 = b2.return;
                try {
                  Sj(b2);
                } catch (k2) {
                  W2(b2, f2, k2);
                }
                break;
              case 5:
                var g2 = b2.return;
                try {
                  Sj(b2);
                } catch (k2) {
                  W2(b2, g2, k2);
                }
            }
          } catch (k2) {
            W2(b2, b2.return, k2);
          }
          if (b2 === a2) {
            V = null;
            break;
          }
          var h2 = b2.sibling;
          if (null !== h2) {
            h2.return = b2.return;
            V = h2;
            break;
          }
          V = b2.return;
        }
      }
      var mk = Math.ceil;
      var nk = ua.ReactCurrentDispatcher;
      var ok = ua.ReactCurrentOwner;
      var pk = ua.ReactCurrentBatchConfig;
      var K = 0;
      var R2 = null;
      var Y = null;
      var Z2 = 0;
      var gj = 0;
      var fj = Uf(0);
      var T2 = 0;
      var qk = null;
      var hh = 0;
      var rk = 0;
      var sk = 0;
      var tk = null;
      var uk = null;
      var gk = 0;
      var Hj = Infinity;
      var vk = null;
      var Pi = false;
      var Qi = null;
      var Si = null;
      var wk = false;
      var xk = null;
      var yk = 0;
      var zk = 0;
      var Ak = null;
      var Bk = -1;
      var Ck = 0;
      function L2() {
        return 0 !== (K & 6) ? B2() : -1 !== Bk ? Bk : Bk = B2();
      }
      function lh(a2) {
        if (0 === (a2.mode & 1))
          return 1;
        if (0 !== (K & 2) && 0 !== Z2)
          return Z2 & -Z2;
        if (null !== Kg.transition)
          return 0 === Ck && (Ck = yc()), Ck;
        a2 = C;
        if (0 !== a2)
          return a2;
        a2 = window.event;
        a2 = void 0 === a2 ? 16 : jd(a2.type);
        return a2;
      }
      function mh(a2, b2, c2, d2) {
        if (50 < zk)
          throw zk = 0, Ak = null, Error(p2(185));
        Ac(a2, c2, d2);
        if (0 === (K & 2) || a2 !== R2)
          a2 === R2 && (0 === (K & 2) && (rk |= c2), 4 === T2 && Dk(a2, Z2)), Ek(a2, d2), 1 === c2 && 0 === K && 0 === (b2.mode & 1) && (Hj = B2() + 500, fg && jg());
      }
      function Ek(a2, b2) {
        var c2 = a2.callbackNode;
        wc(a2, b2);
        var d2 = uc(a2, a2 === R2 ? Z2 : 0);
        if (0 === d2)
          null !== c2 && bc(c2), a2.callbackNode = null, a2.callbackPriority = 0;
        else if (b2 = d2 & -d2, a2.callbackPriority !== b2) {
          null != c2 && bc(c2);
          if (1 === b2)
            0 === a2.tag ? ig(Fk.bind(null, a2)) : hg(Fk.bind(null, a2)), Jf(function() {
              0 === (K & 6) && jg();
            }), c2 = null;
          else {
            switch (Dc(d2)) {
              case 1:
                c2 = fc;
                break;
              case 4:
                c2 = gc;
                break;
              case 16:
                c2 = hc;
                break;
              case 536870912:
                c2 = jc;
                break;
              default:
                c2 = hc;
            }
            c2 = Gk(c2, Hk.bind(null, a2));
          }
          a2.callbackPriority = b2;
          a2.callbackNode = c2;
        }
      }
      function Hk(a2, b2) {
        Bk = -1;
        Ck = 0;
        if (0 !== (K & 6))
          throw Error(p2(327));
        var c2 = a2.callbackNode;
        if (Ik() && a2.callbackNode !== c2)
          return null;
        var d2 = uc(a2, a2 === R2 ? Z2 : 0);
        if (0 === d2)
          return null;
        if (0 !== (d2 & 30) || 0 !== (d2 & a2.expiredLanes) || b2)
          b2 = Jk(a2, d2);
        else {
          b2 = d2;
          var e = K;
          K |= 2;
          var f2 = Kk();
          if (R2 !== a2 || Z2 !== b2)
            vk = null, Hj = B2() + 500, Lk(a2, b2);
          do
            try {
              Mk();
              break;
            } catch (h2) {
              Nk(a2, h2);
            }
          while (1);
          Qg();
          nk.current = f2;
          K = e;
          null !== Y ? b2 = 0 : (R2 = null, Z2 = 0, b2 = T2);
        }
        if (0 !== b2) {
          2 === b2 && (e = xc(a2), 0 !== e && (d2 = e, b2 = Ok(a2, e)));
          if (1 === b2)
            throw c2 = qk, Lk(a2, 0), Dk(a2, d2), Ek(a2, B2()), c2;
          if (6 === b2)
            Dk(a2, d2);
          else {
            e = a2.current.alternate;
            if (0 === (d2 & 30) && !Pk(e) && (b2 = Jk(a2, d2), 2 === b2 && (f2 = xc(a2), 0 !== f2 && (d2 = f2, b2 = Ok(a2, f2))), 1 === b2))
              throw c2 = qk, Lk(a2, 0), Dk(a2, d2), Ek(a2, B2()), c2;
            a2.finishedWork = e;
            a2.finishedLanes = d2;
            switch (b2) {
              case 0:
              case 1:
                throw Error(p2(345));
              case 2:
                Qk(a2, uk, vk);
                break;
              case 3:
                Dk(a2, d2);
                if ((d2 & 130023424) === d2 && (b2 = gk + 500 - B2(), 10 < b2)) {
                  if (0 !== uc(a2, 0))
                    break;
                  e = a2.suspendedLanes;
                  if ((e & d2) !== d2) {
                    L2();
                    a2.pingedLanes |= a2.suspendedLanes & e;
                    break;
                  }
                  a2.timeoutHandle = Ff(Qk.bind(null, a2, uk, vk), b2);
                  break;
                }
                Qk(a2, uk, vk);
                break;
              case 4:
                Dk(a2, d2);
                if ((d2 & 4194240) === d2)
                  break;
                b2 = a2.eventTimes;
                for (e = -1; 0 < d2; ) {
                  var g2 = 31 - oc(d2);
                  f2 = 1 << g2;
                  g2 = b2[g2];
                  g2 > e && (e = g2);
                  d2 &= ~f2;
                }
                d2 = e;
                d2 = B2() - d2;
                d2 = (120 > d2 ? 120 : 480 > d2 ? 480 : 1080 > d2 ? 1080 : 1920 > d2 ? 1920 : 3e3 > d2 ? 3e3 : 4320 > d2 ? 4320 : 1960 * mk(d2 / 1960)) - d2;
                if (10 < d2) {
                  a2.timeoutHandle = Ff(Qk.bind(null, a2, uk, vk), d2);
                  break;
                }
                Qk(a2, uk, vk);
                break;
              case 5:
                Qk(a2, uk, vk);
                break;
              default:
                throw Error(p2(329));
            }
          }
        }
        Ek(a2, B2());
        return a2.callbackNode === c2 ? Hk.bind(null, a2) : null;
      }
      function Ok(a2, b2) {
        var c2 = tk;
        a2.current.memoizedState.isDehydrated && (Lk(a2, b2).flags |= 256);
        a2 = Jk(a2, b2);
        2 !== a2 && (b2 = uk, uk = c2, null !== b2 && Gj(b2));
        return a2;
      }
      function Gj(a2) {
        null === uk ? uk = a2 : uk.push.apply(uk, a2);
      }
      function Pk(a2) {
        for (var b2 = a2; ; ) {
          if (b2.flags & 16384) {
            var c2 = b2.updateQueue;
            if (null !== c2 && (c2 = c2.stores, null !== c2))
              for (var d2 = 0; d2 < c2.length; d2++) {
                var e = c2[d2], f2 = e.getSnapshot;
                e = e.value;
                try {
                  if (!He(f2(), e))
                    return false;
                } catch (g2) {
                  return false;
                }
              }
          }
          c2 = b2.child;
          if (b2.subtreeFlags & 16384 && null !== c2)
            c2.return = b2, b2 = c2;
          else {
            if (b2 === a2)
              break;
            for (; null === b2.sibling; ) {
              if (null === b2.return || b2.return === a2)
                return true;
              b2 = b2.return;
            }
            b2.sibling.return = b2.return;
            b2 = b2.sibling;
          }
        }
        return true;
      }
      function Dk(a2, b2) {
        b2 &= ~sk;
        b2 &= ~rk;
        a2.suspendedLanes |= b2;
        a2.pingedLanes &= ~b2;
        for (a2 = a2.expirationTimes; 0 < b2; ) {
          var c2 = 31 - oc(b2), d2 = 1 << c2;
          a2[c2] = -1;
          b2 &= ~d2;
        }
      }
      function Fk(a2) {
        if (0 !== (K & 6))
          throw Error(p2(327));
        Ik();
        var b2 = uc(a2, 0);
        if (0 === (b2 & 1))
          return Ek(a2, B2()), null;
        var c2 = Jk(a2, b2);
        if (0 !== a2.tag && 2 === c2) {
          var d2 = xc(a2);
          0 !== d2 && (b2 = d2, c2 = Ok(a2, d2));
        }
        if (1 === c2)
          throw c2 = qk, Lk(a2, 0), Dk(a2, b2), Ek(a2, B2()), c2;
        if (6 === c2)
          throw Error(p2(345));
        a2.finishedWork = a2.current.alternate;
        a2.finishedLanes = b2;
        Qk(a2, uk, vk);
        Ek(a2, B2());
        return null;
      }
      function Rk(a2, b2) {
        var c2 = K;
        K |= 1;
        try {
          return a2(b2);
        } finally {
          K = c2, 0 === K && (Hj = B2() + 500, fg && jg());
        }
      }
      function Sk(a2) {
        null !== xk && 0 === xk.tag && 0 === (K & 6) && Ik();
        var b2 = K;
        K |= 1;
        var c2 = pk.transition, d2 = C;
        try {
          if (pk.transition = null, C = 1, a2)
            return a2();
        } finally {
          C = d2, pk.transition = c2, K = b2, 0 === (K & 6) && jg();
        }
      }
      function Ij() {
        gj = fj.current;
        E2(fj);
      }
      function Lk(a2, b2) {
        a2.finishedWork = null;
        a2.finishedLanes = 0;
        var c2 = a2.timeoutHandle;
        -1 !== c2 && (a2.timeoutHandle = -1, Gf(c2));
        if (null !== Y)
          for (c2 = Y.return; null !== c2; ) {
            var d2 = c2;
            wg(d2);
            switch (d2.tag) {
              case 1:
                d2 = d2.type.childContextTypes;
                null !== d2 && void 0 !== d2 && $f();
                break;
              case 3:
                Jh();
                E2(Wf);
                E2(H2);
                Oh();
                break;
              case 5:
                Lh(d2);
                break;
              case 4:
                Jh();
                break;
              case 13:
                E2(M2);
                break;
              case 19:
                E2(M2);
                break;
              case 10:
                Rg(d2.type._context);
                break;
              case 22:
              case 23:
                Ij();
            }
            c2 = c2.return;
          }
        R2 = a2;
        Y = a2 = wh(a2.current, null);
        Z2 = gj = b2;
        T2 = 0;
        qk = null;
        sk = rk = hh = 0;
        uk = tk = null;
        if (null !== Wg) {
          for (b2 = 0; b2 < Wg.length; b2++)
            if (c2 = Wg[b2], d2 = c2.interleaved, null !== d2) {
              c2.interleaved = null;
              var e = d2.next, f2 = c2.pending;
              if (null !== f2) {
                var g2 = f2.next;
                f2.next = e;
                d2.next = g2;
              }
              c2.pending = d2;
            }
          Wg = null;
        }
        return a2;
      }
      function Nk(a2, b2) {
        do {
          var c2 = Y;
          try {
            Qg();
            Ph.current = ai;
            if (Sh) {
              for (var d2 = N.memoizedState; null !== d2; ) {
                var e = d2.queue;
                null !== e && (e.pending = null);
                d2 = d2.next;
              }
              Sh = false;
            }
            Rh = 0;
            P2 = O2 = N = null;
            Th = false;
            Uh = 0;
            ok.current = null;
            if (null === c2 || null === c2.return) {
              T2 = 1;
              qk = b2;
              Y = null;
              break;
            }
            a: {
              var f2 = a2, g2 = c2.return, h2 = c2, k2 = b2;
              b2 = Z2;
              h2.flags |= 32768;
              if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
                var l2 = k2, m = h2, q2 = m.tag;
                if (0 === (m.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
                  var r2 = m.alternate;
                  r2 ? (m.updateQueue = r2.updateQueue, m.memoizedState = r2.memoizedState, m.lanes = r2.lanes) : (m.updateQueue = null, m.memoizedState = null);
                }
                var y2 = Vi(g2);
                if (null !== y2) {
                  y2.flags &= -257;
                  Wi(y2, g2, h2, f2, b2);
                  y2.mode & 1 && Ti(f2, l2, b2);
                  b2 = y2;
                  k2 = l2;
                  var n2 = b2.updateQueue;
                  if (null === n2) {
                    var t2 = /* @__PURE__ */ new Set();
                    t2.add(k2);
                    b2.updateQueue = t2;
                  } else
                    n2.add(k2);
                  break a;
                } else {
                  if (0 === (b2 & 1)) {
                    Ti(f2, l2, b2);
                    uj();
                    break a;
                  }
                  k2 = Error(p2(426));
                }
              } else if (I2 && h2.mode & 1) {
                var J = Vi(g2);
                if (null !== J) {
                  0 === (J.flags & 65536) && (J.flags |= 256);
                  Wi(J, g2, h2, f2, b2);
                  Jg(Ki(k2, h2));
                  break a;
                }
              }
              f2 = k2 = Ki(k2, h2);
              4 !== T2 && (T2 = 2);
              null === tk ? tk = [f2] : tk.push(f2);
              f2 = g2;
              do {
                switch (f2.tag) {
                  case 3:
                    f2.flags |= 65536;
                    b2 &= -b2;
                    f2.lanes |= b2;
                    var x2 = Oi(f2, k2, b2);
                    fh(f2, x2);
                    break a;
                  case 1:
                    h2 = k2;
                    var w2 = f2.type, u2 = f2.stateNode;
                    if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Si || !Si.has(u2)))) {
                      f2.flags |= 65536;
                      b2 &= -b2;
                      f2.lanes |= b2;
                      var F2 = Ri(f2, h2, b2);
                      fh(f2, F2);
                      break a;
                    }
                }
                f2 = f2.return;
              } while (null !== f2);
            }
            Tk(c2);
          } catch (na) {
            b2 = na;
            Y === c2 && null !== c2 && (Y = c2 = c2.return);
            continue;
          }
          break;
        } while (1);
      }
      function Kk() {
        var a2 = nk.current;
        nk.current = ai;
        return null === a2 ? ai : a2;
      }
      function uj() {
        if (0 === T2 || 3 === T2 || 2 === T2)
          T2 = 4;
        null === R2 || 0 === (hh & 268435455) && 0 === (rk & 268435455) || Dk(R2, Z2);
      }
      function Jk(a2, b2) {
        var c2 = K;
        K |= 2;
        var d2 = Kk();
        if (R2 !== a2 || Z2 !== b2)
          vk = null, Lk(a2, b2);
        do
          try {
            Uk();
            break;
          } catch (e) {
            Nk(a2, e);
          }
        while (1);
        Qg();
        K = c2;
        nk.current = d2;
        if (null !== Y)
          throw Error(p2(261));
        R2 = null;
        Z2 = 0;
        return T2;
      }
      function Uk() {
        for (; null !== Y; )
          Vk(Y);
      }
      function Mk() {
        for (; null !== Y && !cc(); )
          Vk(Y);
      }
      function Vk(a2) {
        var b2 = Wk(a2.alternate, a2, gj);
        a2.memoizedProps = a2.pendingProps;
        null === b2 ? Tk(a2) : Y = b2;
        ok.current = null;
      }
      function Tk(a2) {
        var b2 = a2;
        do {
          var c2 = b2.alternate;
          a2 = b2.return;
          if (0 === (b2.flags & 32768)) {
            if (c2 = Fj(c2, b2, gj), null !== c2) {
              Y = c2;
              return;
            }
          } else {
            c2 = Jj(c2, b2);
            if (null !== c2) {
              c2.flags &= 32767;
              Y = c2;
              return;
            }
            if (null !== a2)
              a2.flags |= 32768, a2.subtreeFlags = 0, a2.deletions = null;
            else {
              T2 = 6;
              Y = null;
              return;
            }
          }
          b2 = b2.sibling;
          if (null !== b2) {
            Y = b2;
            return;
          }
          Y = b2 = a2;
        } while (null !== b2);
        0 === T2 && (T2 = 5);
      }
      function Qk(a2, b2, c2) {
        var d2 = C, e = pk.transition;
        try {
          pk.transition = null, C = 1, Xk(a2, b2, c2, d2);
        } finally {
          pk.transition = e, C = d2;
        }
        return null;
      }
      function Xk(a2, b2, c2, d2) {
        do
          Ik();
        while (null !== xk);
        if (0 !== (K & 6))
          throw Error(p2(327));
        c2 = a2.finishedWork;
        var e = a2.finishedLanes;
        if (null === c2)
          return null;
        a2.finishedWork = null;
        a2.finishedLanes = 0;
        if (c2 === a2.current)
          throw Error(p2(177));
        a2.callbackNode = null;
        a2.callbackPriority = 0;
        var f2 = c2.lanes | c2.childLanes;
        Bc(a2, f2);
        a2 === R2 && (Y = R2 = null, Z2 = 0);
        0 === (c2.subtreeFlags & 2064) && 0 === (c2.flags & 2064) || wk || (wk = true, Gk(hc, function() {
          Ik();
          return null;
        }));
        f2 = 0 !== (c2.flags & 15990);
        if (0 !== (c2.subtreeFlags & 15990) || f2) {
          f2 = pk.transition;
          pk.transition = null;
          var g2 = C;
          C = 1;
          var h2 = K;
          K |= 4;
          ok.current = null;
          Pj(a2, c2);
          ek(c2, a2);
          Oe(Df);
          dd = !!Cf;
          Df = Cf = null;
          a2.current = c2;
          ik(c2, a2, e);
          dc();
          K = h2;
          C = g2;
          pk.transition = f2;
        } else
          a2.current = c2;
        wk && (wk = false, xk = a2, yk = e);
        f2 = a2.pendingLanes;
        0 === f2 && (Si = null);
        mc(c2.stateNode, d2);
        Ek(a2, B2());
        if (null !== b2)
          for (d2 = a2.onRecoverableError, c2 = 0; c2 < b2.length; c2++)
            e = b2[c2], d2(e.value, { componentStack: e.stack, digest: e.digest });
        if (Pi)
          throw Pi = false, a2 = Qi, Qi = null, a2;
        0 !== (yk & 1) && 0 !== a2.tag && Ik();
        f2 = a2.pendingLanes;
        0 !== (f2 & 1) ? a2 === Ak ? zk++ : (zk = 0, Ak = a2) : zk = 0;
        jg();
        return null;
      }
      function Ik() {
        if (null !== xk) {
          var a2 = Dc(yk), b2 = pk.transition, c2 = C;
          try {
            pk.transition = null;
            C = 16 > a2 ? 16 : a2;
            if (null === xk)
              var d2 = false;
            else {
              a2 = xk;
              xk = null;
              yk = 0;
              if (0 !== (K & 6))
                throw Error(p2(331));
              var e = K;
              K |= 4;
              for (V = a2.current; null !== V; ) {
                var f2 = V, g2 = f2.child;
                if (0 !== (V.flags & 16)) {
                  var h2 = f2.deletions;
                  if (null !== h2) {
                    for (var k2 = 0; k2 < h2.length; k2++) {
                      var l2 = h2[k2];
                      for (V = l2; null !== V; ) {
                        var m = V;
                        switch (m.tag) {
                          case 0:
                          case 11:
                          case 15:
                            Qj(8, m, f2);
                        }
                        var q2 = m.child;
                        if (null !== q2)
                          q2.return = m, V = q2;
                        else
                          for (; null !== V; ) {
                            m = V;
                            var r2 = m.sibling, y2 = m.return;
                            Tj(m);
                            if (m === l2) {
                              V = null;
                              break;
                            }
                            if (null !== r2) {
                              r2.return = y2;
                              V = r2;
                              break;
                            }
                            V = y2;
                          }
                      }
                    }
                    var n2 = f2.alternate;
                    if (null !== n2) {
                      var t2 = n2.child;
                      if (null !== t2) {
                        n2.child = null;
                        do {
                          var J = t2.sibling;
                          t2.sibling = null;
                          t2 = J;
                        } while (null !== t2);
                      }
                    }
                    V = f2;
                  }
                }
                if (0 !== (f2.subtreeFlags & 2064) && null !== g2)
                  g2.return = f2, V = g2;
                else
                  b:
                    for (; null !== V; ) {
                      f2 = V;
                      if (0 !== (f2.flags & 2048))
                        switch (f2.tag) {
                          case 0:
                          case 11:
                          case 15:
                            Qj(9, f2, f2.return);
                        }
                      var x2 = f2.sibling;
                      if (null !== x2) {
                        x2.return = f2.return;
                        V = x2;
                        break b;
                      }
                      V = f2.return;
                    }
              }
              var w2 = a2.current;
              for (V = w2; null !== V; ) {
                g2 = V;
                var u2 = g2.child;
                if (0 !== (g2.subtreeFlags & 2064) && null !== u2)
                  u2.return = g2, V = u2;
                else
                  b:
                    for (g2 = w2; null !== V; ) {
                      h2 = V;
                      if (0 !== (h2.flags & 2048))
                        try {
                          switch (h2.tag) {
                            case 0:
                            case 11:
                            case 15:
                              Rj(9, h2);
                          }
                        } catch (na) {
                          W2(h2, h2.return, na);
                        }
                      if (h2 === g2) {
                        V = null;
                        break b;
                      }
                      var F2 = h2.sibling;
                      if (null !== F2) {
                        F2.return = h2.return;
                        V = F2;
                        break b;
                      }
                      V = h2.return;
                    }
              }
              K = e;
              jg();
              if (lc && "function" === typeof lc.onPostCommitFiberRoot)
                try {
                  lc.onPostCommitFiberRoot(kc, a2);
                } catch (na) {
                }
              d2 = true;
            }
            return d2;
          } finally {
            C = c2, pk.transition = b2;
          }
        }
        return false;
      }
      function Yk(a2, b2, c2) {
        b2 = Ki(c2, b2);
        b2 = Oi(a2, b2, 1);
        a2 = dh(a2, b2, 1);
        b2 = L2();
        null !== a2 && (Ac(a2, 1, b2), Ek(a2, b2));
      }
      function W2(a2, b2, c2) {
        if (3 === a2.tag)
          Yk(a2, a2, c2);
        else
          for (; null !== b2; ) {
            if (3 === b2.tag) {
              Yk(b2, a2, c2);
              break;
            } else if (1 === b2.tag) {
              var d2 = b2.stateNode;
              if ("function" === typeof b2.type.getDerivedStateFromError || "function" === typeof d2.componentDidCatch && (null === Si || !Si.has(d2))) {
                a2 = Ki(c2, a2);
                a2 = Ri(b2, a2, 1);
                b2 = dh(b2, a2, 1);
                a2 = L2();
                null !== b2 && (Ac(b2, 1, a2), Ek(b2, a2));
                break;
              }
            }
            b2 = b2.return;
          }
      }
      function Ui(a2, b2, c2) {
        var d2 = a2.pingCache;
        null !== d2 && d2.delete(b2);
        b2 = L2();
        a2.pingedLanes |= a2.suspendedLanes & c2;
        R2 === a2 && (Z2 & c2) === c2 && (4 === T2 || 3 === T2 && (Z2 & 130023424) === Z2 && 500 > B2() - gk ? Lk(a2, 0) : sk |= c2);
        Ek(a2, b2);
      }
      function Zk(a2, b2) {
        0 === b2 && (0 === (a2.mode & 1) ? b2 = 1 : (b2 = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
        var c2 = L2();
        a2 = Zg(a2, b2);
        null !== a2 && (Ac(a2, b2, c2), Ek(a2, c2));
      }
      function vj(a2) {
        var b2 = a2.memoizedState, c2 = 0;
        null !== b2 && (c2 = b2.retryLane);
        Zk(a2, c2);
      }
      function ck(a2, b2) {
        var c2 = 0;
        switch (a2.tag) {
          case 13:
            var d2 = a2.stateNode;
            var e = a2.memoizedState;
            null !== e && (c2 = e.retryLane);
            break;
          case 19:
            d2 = a2.stateNode;
            break;
          default:
            throw Error(p2(314));
        }
        null !== d2 && d2.delete(b2);
        Zk(a2, c2);
      }
      var Wk;
      Wk = function(a2, b2, c2) {
        if (null !== a2)
          if (a2.memoizedProps !== b2.pendingProps || Wf.current)
            Ug = true;
          else {
            if (0 === (a2.lanes & c2) && 0 === (b2.flags & 128))
              return Ug = false, zj(a2, b2, c2);
            Ug = 0 !== (a2.flags & 131072) ? true : false;
          }
        else
          Ug = false, I2 && 0 !== (b2.flags & 1048576) && ug(b2, ng, b2.index);
        b2.lanes = 0;
        switch (b2.tag) {
          case 2:
            var d2 = b2.type;
            jj(a2, b2);
            a2 = b2.pendingProps;
            var e = Yf(b2, H2.current);
            Tg(b2, c2);
            e = Xh(null, b2, d2, a2, e, c2);
            var f2 = bi();
            b2.flags |= 1;
            "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b2.tag = 1, b2.memoizedState = null, b2.updateQueue = null, Zf(d2) ? (f2 = true, cg(b2)) : f2 = false, b2.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, ah(b2), e.updater = nh, b2.stateNode = e, e._reactInternals = b2, rh(b2, d2, a2, c2), b2 = kj(null, b2, d2, true, f2, c2)) : (b2.tag = 0, I2 && f2 && vg(b2), Yi(null, b2, e, c2), b2 = b2.child);
            return b2;
          case 16:
            d2 = b2.elementType;
            a: {
              jj(a2, b2);
              a2 = b2.pendingProps;
              e = d2._init;
              d2 = e(d2._payload);
              b2.type = d2;
              e = b2.tag = $k(d2);
              a2 = Lg(d2, a2);
              switch (e) {
                case 0:
                  b2 = dj(null, b2, d2, a2, c2);
                  break a;
                case 1:
                  b2 = ij(null, b2, d2, a2, c2);
                  break a;
                case 11:
                  b2 = Zi(null, b2, d2, a2, c2);
                  break a;
                case 14:
                  b2 = aj(null, b2, d2, Lg(d2.type, a2), c2);
                  break a;
              }
              throw Error(p2(
                306,
                d2,
                ""
              ));
            }
            return b2;
          case 0:
            return d2 = b2.type, e = b2.pendingProps, e = b2.elementType === d2 ? e : Lg(d2, e), dj(a2, b2, d2, e, c2);
          case 1:
            return d2 = b2.type, e = b2.pendingProps, e = b2.elementType === d2 ? e : Lg(d2, e), ij(a2, b2, d2, e, c2);
          case 3:
            a: {
              lj(b2);
              if (null === a2)
                throw Error(p2(387));
              d2 = b2.pendingProps;
              f2 = b2.memoizedState;
              e = f2.element;
              bh(a2, b2);
              gh(b2, d2, null, c2);
              var g2 = b2.memoizedState;
              d2 = g2.element;
              if (f2.isDehydrated)
                if (f2 = { element: d2, isDehydrated: false, cache: g2.cache, pendingSuspenseBoundaries: g2.pendingSuspenseBoundaries, transitions: g2.transitions }, b2.updateQueue.baseState = f2, b2.memoizedState = f2, b2.flags & 256) {
                  e = Ki(Error(p2(423)), b2);
                  b2 = mj(a2, b2, d2, c2, e);
                  break a;
                } else if (d2 !== e) {
                  e = Ki(Error(p2(424)), b2);
                  b2 = mj(a2, b2, d2, c2, e);
                  break a;
                } else
                  for (yg = Lf(b2.stateNode.containerInfo.firstChild), xg = b2, I2 = true, zg = null, c2 = Ch(b2, null, d2, c2), b2.child = c2; c2; )
                    c2.flags = c2.flags & -3 | 4096, c2 = c2.sibling;
              else {
                Ig();
                if (d2 === e) {
                  b2 = $i(a2, b2, c2);
                  break a;
                }
                Yi(a2, b2, d2, c2);
              }
              b2 = b2.child;
            }
            return b2;
          case 5:
            return Kh(b2), null === a2 && Eg(b2), d2 = b2.type, e = b2.pendingProps, f2 = null !== a2 ? a2.memoizedProps : null, g2 = e.children, Ef(d2, e) ? g2 = null : null !== f2 && Ef(d2, f2) && (b2.flags |= 32), hj(a2, b2), Yi(a2, b2, g2, c2), b2.child;
          case 6:
            return null === a2 && Eg(b2), null;
          case 13:
            return pj(a2, b2, c2);
          case 4:
            return Ih(b2, b2.stateNode.containerInfo), d2 = b2.pendingProps, null === a2 ? b2.child = Bh(b2, null, d2, c2) : Yi(a2, b2, d2, c2), b2.child;
          case 11:
            return d2 = b2.type, e = b2.pendingProps, e = b2.elementType === d2 ? e : Lg(d2, e), Zi(a2, b2, d2, e, c2);
          case 7:
            return Yi(a2, b2, b2.pendingProps, c2), b2.child;
          case 8:
            return Yi(a2, b2, b2.pendingProps.children, c2), b2.child;
          case 12:
            return Yi(a2, b2, b2.pendingProps.children, c2), b2.child;
          case 10:
            a: {
              d2 = b2.type._context;
              e = b2.pendingProps;
              f2 = b2.memoizedProps;
              g2 = e.value;
              G2(Mg, d2._currentValue);
              d2._currentValue = g2;
              if (null !== f2)
                if (He(f2.value, g2)) {
                  if (f2.children === e.children && !Wf.current) {
                    b2 = $i(a2, b2, c2);
                    break a;
                  }
                } else
                  for (f2 = b2.child, null !== f2 && (f2.return = b2); null !== f2; ) {
                    var h2 = f2.dependencies;
                    if (null !== h2) {
                      g2 = f2.child;
                      for (var k2 = h2.firstContext; null !== k2; ) {
                        if (k2.context === d2) {
                          if (1 === f2.tag) {
                            k2 = ch(-1, c2 & -c2);
                            k2.tag = 2;
                            var l2 = f2.updateQueue;
                            if (null !== l2) {
                              l2 = l2.shared;
                              var m = l2.pending;
                              null === m ? k2.next = k2 : (k2.next = m.next, m.next = k2);
                              l2.pending = k2;
                            }
                          }
                          f2.lanes |= c2;
                          k2 = f2.alternate;
                          null !== k2 && (k2.lanes |= c2);
                          Sg(
                            f2.return,
                            c2,
                            b2
                          );
                          h2.lanes |= c2;
                          break;
                        }
                        k2 = k2.next;
                      }
                    } else if (10 === f2.tag)
                      g2 = f2.type === b2.type ? null : f2.child;
                    else if (18 === f2.tag) {
                      g2 = f2.return;
                      if (null === g2)
                        throw Error(p2(341));
                      g2.lanes |= c2;
                      h2 = g2.alternate;
                      null !== h2 && (h2.lanes |= c2);
                      Sg(g2, c2, b2);
                      g2 = f2.sibling;
                    } else
                      g2 = f2.child;
                    if (null !== g2)
                      g2.return = f2;
                    else
                      for (g2 = f2; null !== g2; ) {
                        if (g2 === b2) {
                          g2 = null;
                          break;
                        }
                        f2 = g2.sibling;
                        if (null !== f2) {
                          f2.return = g2.return;
                          g2 = f2;
                          break;
                        }
                        g2 = g2.return;
                      }
                    f2 = g2;
                  }
              Yi(a2, b2, e.children, c2);
              b2 = b2.child;
            }
            return b2;
          case 9:
            return e = b2.type, d2 = b2.pendingProps.children, Tg(b2, c2), e = Vg(e), d2 = d2(e), b2.flags |= 1, Yi(a2, b2, d2, c2), b2.child;
          case 14:
            return d2 = b2.type, e = Lg(d2, b2.pendingProps), e = Lg(d2.type, e), aj(a2, b2, d2, e, c2);
          case 15:
            return cj(a2, b2, b2.type, b2.pendingProps, c2);
          case 17:
            return d2 = b2.type, e = b2.pendingProps, e = b2.elementType === d2 ? e : Lg(d2, e), jj(a2, b2), b2.tag = 1, Zf(d2) ? (a2 = true, cg(b2)) : a2 = false, Tg(b2, c2), ph(b2, d2, e), rh(b2, d2, e, c2), kj(null, b2, d2, true, a2, c2);
          case 19:
            return yj(a2, b2, c2);
          case 22:
            return ej(a2, b2, c2);
        }
        throw Error(p2(156, b2.tag));
      };
      function Gk(a2, b2) {
        return ac(a2, b2);
      }
      function al(a2, b2, c2, d2) {
        this.tag = a2;
        this.key = c2;
        this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
        this.index = 0;
        this.ref = null;
        this.pendingProps = b2;
        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
        this.mode = d2;
        this.subtreeFlags = this.flags = 0;
        this.deletions = null;
        this.childLanes = this.lanes = 0;
        this.alternate = null;
      }
      function Bg(a2, b2, c2, d2) {
        return new al(a2, b2, c2, d2);
      }
      function bj(a2) {
        a2 = a2.prototype;
        return !(!a2 || !a2.isReactComponent);
      }
      function $k(a2) {
        if ("function" === typeof a2)
          return bj(a2) ? 1 : 0;
        if (void 0 !== a2 && null !== a2) {
          a2 = a2.$$typeof;
          if (a2 === Da)
            return 11;
          if (a2 === Ga)
            return 14;
        }
        return 2;
      }
      function wh(a2, b2) {
        var c2 = a2.alternate;
        null === c2 ? (c2 = Bg(a2.tag, b2, a2.key, a2.mode), c2.elementType = a2.elementType, c2.type = a2.type, c2.stateNode = a2.stateNode, c2.alternate = a2, a2.alternate = c2) : (c2.pendingProps = b2, c2.type = a2.type, c2.flags = 0, c2.subtreeFlags = 0, c2.deletions = null);
        c2.flags = a2.flags & 14680064;
        c2.childLanes = a2.childLanes;
        c2.lanes = a2.lanes;
        c2.child = a2.child;
        c2.memoizedProps = a2.memoizedProps;
        c2.memoizedState = a2.memoizedState;
        c2.updateQueue = a2.updateQueue;
        b2 = a2.dependencies;
        c2.dependencies = null === b2 ? null : { lanes: b2.lanes, firstContext: b2.firstContext };
        c2.sibling = a2.sibling;
        c2.index = a2.index;
        c2.ref = a2.ref;
        return c2;
      }
      function yh(a2, b2, c2, d2, e, f2) {
        var g2 = 2;
        d2 = a2;
        if ("function" === typeof a2)
          bj(a2) && (g2 = 1);
        else if ("string" === typeof a2)
          g2 = 5;
        else
          a:
            switch (a2) {
              case ya:
                return Ah(c2.children, e, f2, b2);
              case za:
                g2 = 8;
                e |= 8;
                break;
              case Aa:
                return a2 = Bg(12, c2, b2, e | 2), a2.elementType = Aa, a2.lanes = f2, a2;
              case Ea:
                return a2 = Bg(13, c2, b2, e), a2.elementType = Ea, a2.lanes = f2, a2;
              case Fa:
                return a2 = Bg(19, c2, b2, e), a2.elementType = Fa, a2.lanes = f2, a2;
              case Ia:
                return qj(c2, e, f2, b2);
              default:
                if ("object" === typeof a2 && null !== a2)
                  switch (a2.$$typeof) {
                    case Ba:
                      g2 = 10;
                      break a;
                    case Ca:
                      g2 = 9;
                      break a;
                    case Da:
                      g2 = 11;
                      break a;
                    case Ga:
                      g2 = 14;
                      break a;
                    case Ha:
                      g2 = 16;
                      d2 = null;
                      break a;
                  }
                throw Error(p2(130, null == a2 ? a2 : typeof a2, ""));
            }
        b2 = Bg(g2, c2, b2, e);
        b2.elementType = a2;
        b2.type = d2;
        b2.lanes = f2;
        return b2;
      }
      function Ah(a2, b2, c2, d2) {
        a2 = Bg(7, a2, d2, b2);
        a2.lanes = c2;
        return a2;
      }
      function qj(a2, b2, c2, d2) {
        a2 = Bg(22, a2, d2, b2);
        a2.elementType = Ia;
        a2.lanes = c2;
        a2.stateNode = { isHidden: false };
        return a2;
      }
      function xh(a2, b2, c2) {
        a2 = Bg(6, a2, null, b2);
        a2.lanes = c2;
        return a2;
      }
      function zh(a2, b2, c2) {
        b2 = Bg(4, null !== a2.children ? a2.children : [], a2.key, b2);
        b2.lanes = c2;
        b2.stateNode = { containerInfo: a2.containerInfo, pendingChildren: null, implementation: a2.implementation };
        return b2;
      }
      function bl(a2, b2, c2, d2, e) {
        this.tag = b2;
        this.containerInfo = a2;
        this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
        this.timeoutHandle = -1;
        this.callbackNode = this.pendingContext = this.context = null;
        this.callbackPriority = 0;
        this.eventTimes = zc(0);
        this.expirationTimes = zc(-1);
        this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
        this.entanglements = zc(0);
        this.identifierPrefix = d2;
        this.onRecoverableError = e;
        this.mutableSourceEagerHydrationData = null;
      }
      function cl(a2, b2, c2, d2, e, f2, g2, h2, k2) {
        a2 = new bl(a2, b2, c2, h2, k2);
        1 === b2 ? (b2 = 1, true === f2 && (b2 |= 8)) : b2 = 0;
        f2 = Bg(3, null, null, b2);
        a2.current = f2;
        f2.stateNode = a2;
        f2.memoizedState = { element: d2, isDehydrated: c2, cache: null, transitions: null, pendingSuspenseBoundaries: null };
        ah(f2);
        return a2;
      }
      function dl(a2, b2, c2) {
        var d2 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return { $$typeof: wa, key: null == d2 ? null : "" + d2, children: a2, containerInfo: b2, implementation: c2 };
      }
      function el(a2) {
        if (!a2)
          return Vf;
        a2 = a2._reactInternals;
        a: {
          if (Vb(a2) !== a2 || 1 !== a2.tag)
            throw Error(p2(170));
          var b2 = a2;
          do {
            switch (b2.tag) {
              case 3:
                b2 = b2.stateNode.context;
                break a;
              case 1:
                if (Zf(b2.type)) {
                  b2 = b2.stateNode.__reactInternalMemoizedMergedChildContext;
                  break a;
                }
            }
            b2 = b2.return;
          } while (null !== b2);
          throw Error(p2(171));
        }
        if (1 === a2.tag) {
          var c2 = a2.type;
          if (Zf(c2))
            return bg(a2, c2, b2);
        }
        return b2;
      }
      function fl(a2, b2, c2, d2, e, f2, g2, h2, k2) {
        a2 = cl(c2, d2, true, a2, e, f2, g2, h2, k2);
        a2.context = el(null);
        c2 = a2.current;
        d2 = L2();
        e = lh(c2);
        f2 = ch(d2, e);
        f2.callback = void 0 !== b2 && null !== b2 ? b2 : null;
        dh(c2, f2, e);
        a2.current.lanes = e;
        Ac(a2, e, d2);
        Ek(a2, d2);
        return a2;
      }
      function gl(a2, b2, c2, d2) {
        var e = b2.current, f2 = L2(), g2 = lh(e);
        c2 = el(c2);
        null === b2.context ? b2.context = c2 : b2.pendingContext = c2;
        b2 = ch(f2, g2);
        b2.payload = { element: a2 };
        d2 = void 0 === d2 ? null : d2;
        null !== d2 && (b2.callback = d2);
        a2 = dh(e, b2, g2);
        null !== a2 && (mh(a2, e, g2, f2), eh(a2, e, g2));
        return g2;
      }
      function hl(a2) {
        a2 = a2.current;
        if (!a2.child)
          return null;
        switch (a2.child.tag) {
          case 5:
            return a2.child.stateNode;
          default:
            return a2.child.stateNode;
        }
      }
      function il(a2, b2) {
        a2 = a2.memoizedState;
        if (null !== a2 && null !== a2.dehydrated) {
          var c2 = a2.retryLane;
          a2.retryLane = 0 !== c2 && c2 < b2 ? c2 : b2;
        }
      }
      function jl(a2, b2) {
        il(a2, b2);
        (a2 = a2.alternate) && il(a2, b2);
      }
      function kl() {
        return null;
      }
      var ll = "function" === typeof reportError ? reportError : function(a2) {
        console.error(a2);
      };
      function ml(a2) {
        this._internalRoot = a2;
      }
      nl.prototype.render = ml.prototype.render = function(a2) {
        var b2 = this._internalRoot;
        if (null === b2)
          throw Error(p2(409));
        gl(a2, b2, null, null);
      };
      nl.prototype.unmount = ml.prototype.unmount = function() {
        var a2 = this._internalRoot;
        if (null !== a2) {
          this._internalRoot = null;
          var b2 = a2.containerInfo;
          Sk(function() {
            gl(null, a2, null, null);
          });
          b2[uf] = null;
        }
      };
      function nl(a2) {
        this._internalRoot = a2;
      }
      nl.prototype.unstable_scheduleHydration = function(a2) {
        if (a2) {
          var b2 = Hc();
          a2 = { blockedOn: null, target: a2, priority: b2 };
          for (var c2 = 0; c2 < Qc.length && 0 !== b2 && b2 < Qc[c2].priority; c2++)
            ;
          Qc.splice(c2, 0, a2);
          0 === c2 && Vc(a2);
        }
      };
      function ol(a2) {
        return !(!a2 || 1 !== a2.nodeType && 9 !== a2.nodeType && 11 !== a2.nodeType);
      }
      function pl(a2) {
        return !(!a2 || 1 !== a2.nodeType && 9 !== a2.nodeType && 11 !== a2.nodeType && (8 !== a2.nodeType || " react-mount-point-unstable " !== a2.nodeValue));
      }
      function ql() {
      }
      function rl(a2, b2, c2, d2, e) {
        if (e) {
          if ("function" === typeof d2) {
            var f2 = d2;
            d2 = function() {
              var a3 = hl(g2);
              f2.call(a3);
            };
          }
          var g2 = fl(b2, d2, a2, 0, null, false, false, "", ql);
          a2._reactRootContainer = g2;
          a2[uf] = g2.current;
          sf(8 === a2.nodeType ? a2.parentNode : a2);
          Sk();
          return g2;
        }
        for (; e = a2.lastChild; )
          a2.removeChild(e);
        if ("function" === typeof d2) {
          var h2 = d2;
          d2 = function() {
            var a3 = hl(k2);
            h2.call(a3);
          };
        }
        var k2 = cl(a2, 0, false, null, null, false, false, "", ql);
        a2._reactRootContainer = k2;
        a2[uf] = k2.current;
        sf(8 === a2.nodeType ? a2.parentNode : a2);
        Sk(function() {
          gl(b2, k2, c2, d2);
        });
        return k2;
      }
      function sl(a2, b2, c2, d2, e) {
        var f2 = c2._reactRootContainer;
        if (f2) {
          var g2 = f2;
          if ("function" === typeof e) {
            var h2 = e;
            e = function() {
              var a3 = hl(g2);
              h2.call(a3);
            };
          }
          gl(b2, g2, a2, e);
        } else
          g2 = rl(c2, b2, a2, e, d2);
        return hl(g2);
      }
      Ec = function(a2) {
        switch (a2.tag) {
          case 3:
            var b2 = a2.stateNode;
            if (b2.current.memoizedState.isDehydrated) {
              var c2 = tc(b2.pendingLanes);
              0 !== c2 && (Cc(b2, c2 | 1), Ek(b2, B2()), 0 === (K & 6) && (Hj = B2() + 500, jg()));
            }
            break;
          case 13:
            Sk(function() {
              var b3 = Zg(a2, 1);
              if (null !== b3) {
                var c3 = L2();
                mh(b3, a2, 1, c3);
              }
            }), jl(a2, 1);
        }
      };
      Fc = function(a2) {
        if (13 === a2.tag) {
          var b2 = Zg(a2, 134217728);
          if (null !== b2) {
            var c2 = L2();
            mh(b2, a2, 134217728, c2);
          }
          jl(a2, 134217728);
        }
      };
      Gc = function(a2) {
        if (13 === a2.tag) {
          var b2 = lh(a2), c2 = Zg(a2, b2);
          if (null !== c2) {
            var d2 = L2();
            mh(c2, a2, b2, d2);
          }
          jl(a2, b2);
        }
      };
      Hc = function() {
        return C;
      };
      Ic = function(a2, b2) {
        var c2 = C;
        try {
          return C = a2, b2();
        } finally {
          C = c2;
        }
      };
      yb = function(a2, b2, c2) {
        switch (b2) {
          case "input":
            bb(a2, c2);
            b2 = c2.name;
            if ("radio" === c2.type && null != b2) {
              for (c2 = a2; c2.parentNode; )
                c2 = c2.parentNode;
              c2 = c2.querySelectorAll("input[name=" + JSON.stringify("" + b2) + '][type="radio"]');
              for (b2 = 0; b2 < c2.length; b2++) {
                var d2 = c2[b2];
                if (d2 !== a2 && d2.form === a2.form) {
                  var e = Db(d2);
                  if (!e)
                    throw Error(p2(90));
                  Wa(d2);
                  bb(d2, e);
                }
              }
            }
            break;
          case "textarea":
            ib(a2, c2);
            break;
          case "select":
            b2 = c2.value, null != b2 && fb(a2, !!c2.multiple, b2, false);
        }
      };
      Gb = Rk;
      Hb = Sk;
      var tl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Rk] };
      var ul = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" };
      var vl = { bundleType: ul.bundleType, version: ul.version, rendererPackageName: ul.rendererPackageName, rendererConfig: ul.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a2) {
        a2 = Zb(a2);
        return null === a2 ? null : a2.stateNode;
      }, findFiberByHostInstance: ul.findFiberByHostInstance || kl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
      if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
        wl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!wl.isDisabled && wl.supportsFiber)
          try {
            kc = wl.inject(vl), lc = wl;
          } catch (a2) {
          }
      }
      var wl;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tl;
      exports.createPortal = function(a2, b2) {
        var c2 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        if (!ol(b2))
          throw Error(p2(200));
        return dl(a2, b2, null, c2);
      };
      exports.createRoot = function(a2, b2) {
        if (!ol(a2))
          throw Error(p2(299));
        var c2 = false, d2 = "", e = ll;
        null !== b2 && void 0 !== b2 && (true === b2.unstable_strictMode && (c2 = true), void 0 !== b2.identifierPrefix && (d2 = b2.identifierPrefix), void 0 !== b2.onRecoverableError && (e = b2.onRecoverableError));
        b2 = cl(a2, 1, false, null, null, c2, false, d2, e);
        a2[uf] = b2.current;
        sf(8 === a2.nodeType ? a2.parentNode : a2);
        return new ml(b2);
      };
      exports.findDOMNode = function(a2) {
        if (null == a2)
          return null;
        if (1 === a2.nodeType)
          return a2;
        var b2 = a2._reactInternals;
        if (void 0 === b2) {
          if ("function" === typeof a2.render)
            throw Error(p2(188));
          a2 = Object.keys(a2).join(",");
          throw Error(p2(268, a2));
        }
        a2 = Zb(b2);
        a2 = null === a2 ? null : a2.stateNode;
        return a2;
      };
      exports.flushSync = function(a2) {
        return Sk(a2);
      };
      exports.hydrate = function(a2, b2, c2) {
        if (!pl(b2))
          throw Error(p2(200));
        return sl(null, a2, b2, true, c2);
      };
      exports.hydrateRoot = function(a2, b2, c2) {
        if (!ol(a2))
          throw Error(p2(405));
        var d2 = null != c2 && c2.hydratedSources || null, e = false, f2 = "", g2 = ll;
        null !== c2 && void 0 !== c2 && (true === c2.unstable_strictMode && (e = true), void 0 !== c2.identifierPrefix && (f2 = c2.identifierPrefix), void 0 !== c2.onRecoverableError && (g2 = c2.onRecoverableError));
        b2 = fl(b2, null, a2, 1, null != c2 ? c2 : null, e, false, f2, g2);
        a2[uf] = b2.current;
        sf(a2);
        if (d2)
          for (a2 = 0; a2 < d2.length; a2++)
            c2 = d2[a2], e = c2._getVersion, e = e(c2._source), null == b2.mutableSourceEagerHydrationData ? b2.mutableSourceEagerHydrationData = [c2, e] : b2.mutableSourceEagerHydrationData.push(
              c2,
              e
            );
        return new nl(b2);
      };
      exports.render = function(a2, b2, c2) {
        if (!pl(b2))
          throw Error(p2(200));
        return sl(null, a2, b2, false, c2);
      };
      exports.unmountComponentAtNode = function(a2) {
        if (!pl(a2))
          throw Error(p2(40));
        return a2._reactRootContainer ? (Sk(function() {
          sl(null, null, a2, false, function() {
            a2._reactRootContainer = null;
            a2[uf] = null;
          });
        }), true) : false;
      };
      exports.unstable_batchedUpdates = Rk;
      exports.unstable_renderSubtreeIntoContainer = function(a2, b2, c2, d2) {
        if (!pl(c2))
          throw Error(p2(200));
        if (null == a2 || void 0 === a2._reactInternals)
          throw Error(p2(38));
        return sl(a2, b2, c2, false, d2);
      };
      exports.version = "18.2.0-next-9e3b772b8-20220608";
    }
  });

  // node_modules/react-dom/index.js
  var require_react_dom = __commonJS({
    "node_modules/react-dom/index.js"(exports, module) {
      "use strict";
      function checkDCE() {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
          return;
        }
        if (false) {
          throw new Error("^_^");
        }
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
        } catch (err) {
          console.error(err);
        }
      }
      if (true) {
        checkDCE();
        module.exports = require_react_dom_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // src/util/EventEmitter.ts
  var EventEmitter;
  var init_EventEmitter = __esm({
    "src/util/EventEmitter.ts"() {
      "use strict";
      EventEmitter = class {
        event = {};
        getEventLength(name) {
          const temp = this.event[name];
          return temp && temp.length || 0;
        }
        on(name, callback) {
          this.event[name] = this.event[name] || [];
          this.event[name].push(callback);
          return () => this.off(name, callback);
        }
        emitAsync(name, data) {
          const list = this.event[name];
          if (!list || list.length <= 0) {
            return;
          }
          for (const item of list) {
            window.requestAnimationFrame(() => {
              item(data);
            });
          }
        }
        emit(name, data) {
          const list = this.event[name];
          if (!list || list.length <= 0) {
            return;
          }
          for (const item of list) {
            item(data);
          }
        }
        off(name, callback) {
          const result = [];
          const events = this.event[name];
          if (events && callback) {
            for (const item of events) {
              if (item !== callback && item._ !== callback) {
                result.push(item);
              }
            }
          }
          if (result.length) {
            this.event[name] = result;
          } else {
            delete this.event[name];
          }
        }
        offAll() {
          this.event = {};
        }
        once(name, callback) {
          const listener = (data) => {
            this.off(name, listener);
            callback(data);
          };
          listener._ = callback;
          return this.on(name, listener);
        }
      };
    }
  });

  // src/util/dpr.ts
  function dpr(data = window.devicePixelRatio) {
    return Math.max(Math.floor(data || 1), 1);
  }
  function npx(px) {
    return Math.floor(px * dpr());
  }
  function thinLineWidth() {
    return dpr() - 0.5;
  }
  function npxLine(px) {
    const n2 = npx(px);
    return Math.max(0.5, n2 - 0.5);
  }
  var init_dpr = __esm({
    "src/util/dpr.ts"() {
      "use strict";
    }
  });

  // src/util/style.ts
  function makeFont(fontStyle = "normal", fontWeight = "normal", fontSize = 12, fontFamily = DEFAULT_FONT_FAMILY) {
    return `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily},${MUST_FONT_FAMILY}`;
  }
  var DEFAULT_FONT_SIZE, DEFAULT_FONT_COLOR, ERROR_FORMULA_COLOR, MUST_FONT_FAMILY, DEFAULT_FONT_FAMILY, FONT_SIZE_LIST, FONT_FAMILY_LIST, DEFAULT_FONT_CONFIG;
  var init_style = __esm({
    "src/util/style.ts"() {
      "use strict";
      init_dpr();
      DEFAULT_FONT_SIZE = 11;
      DEFAULT_FONT_COLOR = "#333333";
      ERROR_FORMULA_COLOR = "#ff0000";
      MUST_FONT_FAMILY = "sans-serif";
      DEFAULT_FONT_FAMILY = "\u5B8B\u4F53";
      FONT_SIZE_LIST = [
        6,
        8,
        9,
        10,
        DEFAULT_FONT_SIZE,
        12,
        14,
        16,
        18,
        20,
        22,
        24,
        26,
        28,
        36,
        48,
        72
      ];
      FONT_FAMILY_LIST = [
        DEFAULT_FONT_FAMILY,
        "Times New Roman",
        "Arial",
        "Tahoma",
        "Verdana",
        "\u5FAE\u8F6F\u96C5\u9ED1",
        "\u9ED1\u4F53",
        "\u6977\u4F53",
        "\u4EFF\u5B8B",
        "\u65B0\u5B8B\u4F53",
        "\u534E\u6587\u65B0\u9B4F",
        "\u534E\u6587\u884C\u6977",
        "\u534E\u6587\u96B6\u4E66",
        "\u82F9\u65B9"
      ];
      DEFAULT_FONT_CONFIG = makeFont(
        void 0,
        "500",
        npx(DEFAULT_FONT_SIZE)
      );
    }
  });

  // src/util/assert.ts
  function assert(condition, message = "assert error", env = "production") {
    if (!condition) {
      if (env === "production") {
        console.error(message);
        return;
      }
      throw new Error(message);
    }
  }
  var init_assert = __esm({
    "src/util/assert.ts"() {
      "use strict";
    }
  });

  // src/util/cell.ts
  function isLetter(char) {
    return char >= "a" && char <= "z" || char >= "A" && char <= "Z";
  }
  var CELL_HEIGHT, CELL_WIDTH, ROW_TITLE_HEIGHT, COL_TITLE_WIDTH, DEFAULT_ACTIVE_CELL;
  var init_cell = __esm({
    "src/util/cell.ts"() {
      "use strict";
      CELL_HEIGHT = 20;
      CELL_WIDTH = 68;
      ROW_TITLE_HEIGHT = 20;
      COL_TITLE_WIDTH = 34;
      DEFAULT_ACTIVE_CELL = { row: 0, col: 0 };
    }
  });

  // src/util/constant.ts
  var SHEET_NAME_PREFIX, STYLE_ID_PREFIX, DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT, DEBUG_COLOR_LIST, MAX_PARAMS_COUNT;
  var init_constant = __esm({
    "src/util/constant.ts"() {
      "use strict";
      SHEET_NAME_PREFIX = "Sheet";
      STYLE_ID_PREFIX = "style";
      DEFAULT_ROW_COUNT = 200;
      DEFAULT_COL_COUNT = 30;
      DEBUG_COLOR_LIST = [
        "#0000CC",
        "#0000FF",
        "#0033CC",
        "#0033FF",
        "#0066CC",
        "#0066FF",
        "#0099CC",
        "#0099FF",
        "#00CC00",
        "#00CC33",
        "#00CC66",
        "#00CC99",
        "#00CCCC",
        "#00CCFF",
        "#3300CC",
        "#3300FF",
        "#3333CC",
        "#3333FF",
        "#3366CC",
        "#3366FF",
        "#3399CC",
        "#3399FF",
        "#33CC00",
        "#33CC33",
        "#33CC66",
        "#33CC99",
        "#33CCCC",
        "#33CCFF",
        "#6600CC",
        "#6600FF",
        "#6633CC",
        "#6633FF",
        "#66CC00",
        "#66CC33",
        "#9900CC",
        "#9900FF",
        "#9933CC",
        "#9933FF",
        "#99CC00",
        "#99CC33",
        "#CC0000",
        "#CC0033",
        "#CC0066",
        "#CC0099",
        "#CC00CC",
        "#CC00FF",
        "#CC3300",
        "#CC3333",
        "#CC3366",
        "#CC3399",
        "#CC33CC",
        "#CC33FF",
        "#CC6600",
        "#CC6633",
        "#CC9900",
        "#CC9933",
        "#CCCC00",
        "#CCCC33",
        "#FF0000",
        "#FF0033",
        "#FF0066",
        "#FF0099",
        "#FF00CC",
        "#FF00FF",
        "#FF3300",
        "#FF3333",
        "#FF3366",
        "#FF3399",
        "#FF33CC",
        "#FF33FF",
        "#FF6600",
        "#FF6633",
        "#FF9900",
        "#FF9933",
        "#FFCC00",
        "#FFCC33"
      ];
      MAX_PARAMS_COUNT = 256;
    }
  });

  // src/util/util.ts
  function isNumber(value) {
    if (typeof value === "number" && !window.isNaN(value)) {
      return true;
    }
    if (typeof value !== "string") {
      return false;
    }
    const temp = parseFloat(value);
    return !window.isNaN(temp) && temp === Number(value);
  }
  function parseNumber(value) {
    if (isNumber(value)) {
      return Number(value);
    }
    return 0;
  }
  function parseNumberArray(list) {
    const result = [];
    for (let i2 = 0; i2 < list.length; i2++) {
      const temp = parseNumber(list[i2]);
      if (!window.isNaN(temp)) {
        result.push(temp);
      }
    }
    return result;
  }
  function getListMaxNum(list = [], prefix = "") {
    const idList = list.map((item) => {
      if (isNumber(item) || prefix.length === 0) {
        return parseInt(item, 10);
      }
      return parseInt(
        item.includes(prefix) ? item.slice(prefix.length) : item,
        10
      );
    }).filter((v2) => !isNaN(v2));
    return Math.max(Math.max(...idList), 0);
  }
  function getDefaultSheetInfo(list = []) {
    const sheetNum = getListMaxNum(
      list.map((item) => item.name),
      SHEET_NAME_PREFIX
    );
    const sheetId = getListMaxNum(list.map((item) => item.sheetId)) + 1;
    return {
      name: `${SHEET_NAME_PREFIX}${sheetNum + 1}`,
      sheetId: String(sheetId)
    };
  }
  var isString;
  var init_util = __esm({
    "src/util/util.ts"() {
      "use strict";
      init_constant();
      isString = (value) => {
        return typeof value === "string";
      };
    }
  });

  // src/util/convert.ts
  function columnNameToInt(columnName = "") {
    const temp = columnName.toUpperCase();
    let num = 0;
    for (let i2 = 0; i2 < temp.length; i2++) {
      num = temp.charCodeAt(i2) - 64 + num * 26;
    }
    return num - 1;
  }
  function intToColumnName(temp) {
    const num = temp + 1;
    let columnName = "";
    let dividend = Math.floor(Math.abs(num));
    let rest;
    while (dividend > 0) {
      rest = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + rest) + columnName;
      dividend = Math.floor((dividend - rest) / 26);
    }
    return columnName.toUpperCase();
  }
  function rowLabelToInt(label) {
    let result = parseInt(label, 10);
    if (window.isNaN(result)) {
      result = -1;
    } else {
      result = Math.max(result - 1, -1);
    }
    return result;
  }
  var init_convert = __esm({
    "src/util/convert.ts"() {
      "use strict";
    }
  });

  // src/util/editor.ts
  var EDITOR_DEFAULT_POSITION;
  var init_editor = __esm({
    "src/util/editor.ts"() {
      "use strict";
      init_cell();
      EDITOR_DEFAULT_POSITION = {
        left: -999,
        top: -999,
        value: "",
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        row: 0,
        col: 0,
        style: {}
      };
    }
  });

  // src/util/interaction.ts
  var DOUBLE_CLICK_TIME;
  var init_interaction = __esm({
    "src/util/interaction.ts"() {
      "use strict";
      DOUBLE_CLICK_TIME = 300;
    }
  });

  // src/util/designPattern.ts
  var init_designPattern = __esm({
    "src/util/designPattern.ts"() {
      "use strict";
      init_assert();
    }
  });

  // src/util/classnames.ts
  function classnames(...rest) {
    let result = "";
    for (const temp of rest) {
      if (typeof temp === "string" && temp) {
        result += `${temp} `;
      }
      if (typeof temp === "object") {
        for (const key of Object.keys(temp)) {
          if (temp[key]) {
            result += `${key} `;
          }
        }
      }
    }
    return result.trim();
  }
  var init_classnames = __esm({
    "src/util/classnames.ts"() {
      "use strict";
    }
  });

  // src/util/error.ts
  function outputError() {
    fetch("/buildError.txt").then((res) => {
      if (res.status === 404) {
        return "";
      }
      return res.text();
    }).then((data) => {
      if (cache.has(data)) {
        return;
      }
      if (data) {
        cache.add(data);
        console.error(data);
      }
    }).catch(console.error);
  }
  function handleBuildError(controller2) {
    if (true) {
      return () => {
        console.log("off");
      };
    }
    window.controller = controller2;
    outputError();
    return () => {
      console.log("off");
    };
  }
  var cache;
  var init_error = __esm({
    "src/util/error.ts"() {
      "use strict";
      cache = /* @__PURE__ */ new Set();
    }
  });

  // src/util/range.ts
  function isSheet(range) {
    return isRow(range) && isCol(range);
  }
  function isRow(range) {
    return range.col === range.rowCount && range.rowCount === 0;
  }
  function isCol(range) {
    return range.row === range.colCount && range.colCount === 0;
  }
  var Range;
  var init_range = __esm({
    "src/util/range.ts"() {
      "use strict";
      Range = class {
        row = 0;
        col = 0;
        colCount = 0;
        rowCount = 0;
        sheetId = "";
        constructor(row, col, rowCount, colCount, sheetId) {
          this.row = row;
          this.col = col;
          this.colCount = colCount;
          this.rowCount = rowCount;
          this.sheetId = sheetId;
        }
        isValid() {
          return this.row >= 0 && this.col >= 0 && this.colCount >= 0 && this.rowCount >= 0;
        }
        static makeRange(range) {
          return new Range(
            range.row,
            range.col,
            range.rowCount,
            range.colCount,
            range.sheetId
          );
        }
      };
    }
  });

  // src/util/reference.ts
  function parseCell(ref) {
    if (typeof ref !== "string" || !ref) {
      return null;
    }
    const realRef = ref.trim();
    let [sheetName, other = ""] = realRef.split("!");
    if (!realRef.includes("!")) {
      sheetName = "";
      other = realRef;
    }
    let i2 = 0;
    let rowText = "";
    let colText = "";
    if (other[i2] === "$") {
      i2++;
    }
    while (isCharacter(other[i2])) {
      colText += other[i2++];
    }
    if (other[i2] === "$") {
      i2++;
    }
    while (isNum(other[i2])) {
      rowText += other[i2++];
    }
    if (i2 !== other.length) {
      return null;
    }
    if (!rowText && !colText) {
      return null;
    }
    let rowCount = 1;
    let colCount = 1;
    let row = 0;
    let col = 0;
    if (rowText === "") {
      colCount = 0;
      rowCount = DEFAULT_ROW_COUNT;
    } else {
      row = rowLabelToInt(rowText);
    }
    if (colText === "") {
      colCount = DEFAULT_COL_COUNT;
      rowCount = 0;
    } else {
      col = columnNameToInt(colText);
    }
    if (row === -1 || col === -1) {
      return null;
    }
    const range = new Range(row, col, rowCount, colCount, sheetName);
    return range;
  }
  function parseReference(text) {
    const [cell1, cell2] = text.split(":");
    const startCell = parseCell(cell1);
    if (!startCell) {
      return null;
    }
    const endCell = parseCell(cell2);
    if (!endCell) {
      return startCell;
    }
    const rowCount = endCell.row - startCell.row + 1;
    const colCount = endCell.col - startCell.col + 1;
    return new Range(
      startCell.row,
      startCell.col,
      rowCount,
      colCount,
      endCell.sheetId
    );
  }
  var isCharacter, isNum;
  var init_reference = __esm({
    "src/util/reference.ts"() {
      "use strict";
      init_convert();
      init_range();
      init_constant();
      isCharacter = (char) => char >= "a" && char <= "z" || char >= "A" && char <= "Z";
      isNum = (char) => char >= "0" && char <= "9";
    }
  });

  // src/lodash/isEmpty.ts
  function isEmpty(value) {
    const temp = value || {};
    return [Object, Array].includes(temp.constructor) && !Object.entries(temp).length;
  }
  var init_isEmpty = __esm({
    "src/lodash/isEmpty.ts"() {
      "use strict";
    }
  });

  // src/lodash/noop.ts
  function noop(...args) {
    console.log(args);
  }
  var init_noop = __esm({
    "src/lodash/noop.ts"() {
      "use strict";
    }
  });

  // src/lodash/pick.ts
  function pick(object, keys) {
    const result = keys.reduce((res, key) => {
      if (object && key in object) {
        res[key] = object[key];
      }
      return res;
    }, {});
    return result;
  }
  var init_pick = __esm({
    "src/lodash/pick.ts"() {
      "use strict";
    }
  });

  // src/lodash/randomInt.ts
  function randomInt(min, max) {
    const t1 = Math.min(min, max);
    const t2 = Math.max(min, max);
    return Math.floor(t1 + Math.random() * (t2 - t1 + 1));
  }
  var init_randomInt = __esm({
    "src/lodash/randomInt.ts"() {
      "use strict";
    }
  });

  // src/lodash/isNil.ts
  function isNil(value) {
    return value == null;
  }
  var init_isNil = __esm({
    "src/lodash/isNil.ts"() {
      "use strict";
    }
  });

  // src/lodash/get.ts
  function get(obj, path, defaultValue) {
    const result = obj == null ? void 0 : path.replace(/\[/g, ".").replace(/\]/g, "").split(".").reduce((res, key) => {
      return res == null ? res : res[key];
    }, obj);
    return result === void 0 ? defaultValue : result;
  }
  var init_get = __esm({
    "src/lodash/get.ts"() {
      "use strict";
    }
  });

  // src/lodash/setWith.ts
  function setWith(obj, path, value) {
    if (obj == null || typeof obj !== "object") {
      return obj;
    }
    path.replace(/\[/g, ".").replace(/\]/g, "").split(".").reduce((res, key, index, arr) => {
      if (index === arr.length - 1) {
        res[key] = value;
      } else {
        if (res[key] == null) {
          res[key] = {};
        }
      }
      return res[key];
    }, obj);
    return obj;
  }
  var init_setWith = __esm({
    "src/lodash/setWith.ts"() {
      "use strict";
    }
  });

  // src/lodash/index.ts
  var init_lodash = __esm({
    "src/lodash/index.ts"() {
      "use strict";
      init_isEmpty();
      init_noop();
      init_pick();
      init_randomInt();
      init_isNil();
      init_get();
      init_setWith();
    }
  });

  // src/util/debug.ts
  var _Debug, Debug, storeLog, controllerLog, canvasLog, modelLog, utilLog, interactionLog, containersLog, historyLog;
  var init_debug = __esm({
    "src/util/debug.ts"() {
      "use strict";
      init_lodash();
      init_assert();
      init_constant();
      _Debug = class {
        namespace;
        constructor(namespace) {
          this.namespace = namespace;
        }
        init = () => {
          this.setColor();
          return this.log;
        };
        log = (...rest) => {
          if (!this.enable()) {
            return;
          }
          const { namespace } = this;
          const color2 = _Debug.colorMap.get(namespace);
          const result = [`%c ${namespace}:`, `color:${color2};`, ...rest];
          console.log(...result);
        };
        getRandomColor = () => {
          const index = randomInt(0, DEBUG_COLOR_LIST.length - 1);
          assert(index >= 0 && index < DEBUG_COLOR_LIST.length, String(index));
          return DEBUG_COLOR_LIST[index];
        };
        enable() {
          return this.checkEnable() && _Debug.enableMap.get(this.namespace) !== false;
        }
        checkEnable(storage = window.localStorage) {
          return storage.getItem("debug") === "*";
        }
        setColor() {
          if (!_Debug.colorMap.has(this.namespace)) {
            _Debug.colorMap.set(this.namespace, this.getRandomColor());
          }
        }
      };
      Debug = _Debug;
      __publicField(Debug, "colorMap", /* @__PURE__ */ new Map());
      __publicField(Debug, "enableMap", /* @__PURE__ */ new Map([
        ["model", false],
        ["store", true],
        ["interaction", false],
        ["history", false],
        ["canvas", false],
        ["controller", true],
        ["containers", true]
      ]));
      storeLog = new Debug("store").init();
      controllerLog = new Debug("controller").init();
      canvasLog = new Debug("canvas").init();
      modelLog = new Debug("model").init();
      utilLog = new Debug("util").init();
      interactionLog = new Debug("interaction").init();
      containersLog = new Debug("containers").init();
      historyLog = new Debug("history").init();
    }
  });

  // src/util/isSupportFontFamily.ts
  function SupportFontFamilyFactory(defaultFont = MUST_FONT_FAMILY) {
    if (false) {
      return {
        isSupportFontFamily: () => true
      };
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    assert(ctx !== null);
    const getImageData = function(font) {
      const width = 50;
      canvas.width = width;
      canvas.height = width;
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.textBaseline = "middle";
      ctx.clearRect(0, 0, width, width);
      ctx.font = `${width}px ${font},${defaultFont}`;
      ctx.fillText("\u5B8Ba", width / 2, width / 2);
      const imageData = ctx.getImageData(0, 0, width, width).data;
      return imageData.join("");
    };
    const defaultImageData = getImageData(defaultFont);
    const isSupportFontFamily2 = (fontFamily) => {
      if (typeof fontFamily != "string") {
        return false;
      }
      if (fontFamily.toLowerCase() == defaultFont.toLowerCase()) {
        return true;
      }
      return defaultImageData !== getImageData(fontFamily);
    };
    return {
      isSupportFontFamily: isSupportFontFamily2
    };
  }
  var isSupportFontFamily;
  var init_isSupportFontFamily = __esm({
    "src/util/isSupportFontFamily.ts"() {
      "use strict";
      init_assert();
      init_style();
      ({ isSupportFontFamily } = SupportFontFamilyFactory());
    }
  });

  // src/util/parseError.ts
  function parseError(type) {
    if (FORMULA_ERRORS.some((item) => item === type)) {
      return type;
    }
    return null;
  }
  var FORMULA_ERRORS;
  var init_parseError = __esm({
    "src/util/parseError.ts"() {
      "use strict";
      FORMULA_ERRORS = [
        "#ERROR!",
        "#DIV/0!",
        "#NAME?",
        "#N/A",
        "#NULL!",
        "#NUM!",
        "#REF!",
        "#VALUE!"
      ];
    }
  });

  // src/util/index.ts
  var init_util2 = __esm({
    "src/util/index.ts"() {
      "use strict";
      init_EventEmitter();
      init_style();
      init_dpr();
      init_assert();
      init_cell();
      init_util();
      init_convert();
      init_editor();
      init_interaction();
      init_constant();
      init_designPattern();
      init_classnames();
      init_error();
      init_range();
      init_reference();
      init_debug();
      init_isSupportFontFamily();
      init_parseError();
    }
  });

  // src/components/Button/index.tsx
  var import_react, Button;
  var init_Button = __esm({
    "src/components/Button/index.tsx"() {
      "use strict";
      import_react = __toESM(require_react());
      init_util2();
      init_lodash();
      Button = (0, import_react.memo)((props) => {
        const {
          children,
          style = {},
          className = "",
          onClick = noop,
          disabled = false,
          active = false,
          type = "normal"
        } = props;
        return /* @__PURE__ */ import_react.default.createElement("div", {
          onClick,
          style,
          className: classnames("button-wrapper", className, {
            disabled,
            active,
            circle: type === "circle"
          })
        }, children);
      });
      Button.displayName = "Button";
    }
  });

  // src/components/Github/index.tsx
  var import_react2, pathStyle, Github;
  var init_Github = __esm({
    "src/components/Github/index.tsx"() {
      "use strict";
      import_react2 = __toESM(require_react());
      pathStyle = {
        transformOrigin: "130px 106px"
      };
      Github = (0, import_react2.memo)(() => {
        return /* @__PURE__ */ import_react2.default.createElement("a", {
          href: "https://github.com/nusr/excel",
          "aria-label": "View source on Github",
          target: "_blank",
          rel: "noreferrer"
        }, /* @__PURE__ */ import_react2.default.createElement("svg", {
          className: "github-wrapper",
          viewBox: "0 0 250 250",
          "aria-hidden": "true"
        }, /* @__PURE__ */ import_react2.default.createElement("path", {
          d: "M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"
        }), /* @__PURE__ */ import_react2.default.createElement("path", {
          d: "M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2",
          fill: "currentColor",
          style: pathStyle
        }), /* @__PURE__ */ import_react2.default.createElement("path", {
          d: "M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z",
          fill: "currentColor"
        })));
      });
      Github.displayName = "Github";
    }
  });

  // src/components/BaseIcon/index.tsx
  var import_react3, BaseIcon;
  var init_BaseIcon = __esm({
    "src/components/BaseIcon/index.tsx"() {
      "use strict";
      import_react3 = __toESM(require_react());
      init_util2();
      BaseIcon = (0, import_react3.memo)((props) => {
        const { className = "", name } = props;
        return /* @__PURE__ */ import_react3.default.createElement("svg", {
          className: classnames("icon-wrapper", className),
          "aria-hidden": "true"
        }, /* @__PURE__ */ import_react3.default.createElement("use", {
          xlinkHref: `#icon-${name}`
        }));
      });
      BaseIcon.displayName = "BaseIcon";
    }
  });

  // src/components/Select/index.tsx
  var import_react4, Select;
  var init_Select = __esm({
    "src/components/Select/index.tsx"() {
      "use strict";
      import_react4 = __toESM(require_react());
      init_util2();
      Select = import_react4.default.memo((props) => {
        const {
          data,
          value: activeValue,
          style = {},
          onChange,
          getItemStyle = () => ({})
        } = props;
        const handleChange = (0, import_react4.useCallback)(
          (event) => {
            const { value } = event.target;
            onChange(value);
          },
          [onChange]
        );
        return /* @__PURE__ */ import_react4.default.createElement("select", {
          onChange: handleChange,
          value: activeValue,
          style
        }, data.map((item) => {
          const value = typeof item === "object" ? item.value : item;
          const label = typeof item === "object" ? item.label : item;
          const disabled = typeof item === "object" ? item.disabled : false;
          const itemStyle = getItemStyle(value);
          return /* @__PURE__ */ import_react4.default.createElement("option", {
            key: value,
            value,
            style: itemStyle,
            className: classnames("select-item", { disabled })
          }, label);
        }));
      });
      Select.displayName = "Select";
    }
  });

  // src/components/ColorPicker/index.tsx
  var import_react5, COLOR_LIST, ColorPicker;
  var init_ColorPicker = __esm({
    "src/components/ColorPicker/index.tsx"() {
      "use strict";
      import_react5 = __toESM(require_react());
      COLOR_LIST = [
        "#4D4D4D",
        "#999999",
        "#FFFFFF",
        "#F44E3B",
        "#FE9200",
        "#FCDC00",
        "#DBDF00",
        "#A4DD00",
        "#68CCCA",
        "#73D8FF",
        "#AEA1FF",
        "#FDA1FF",
        "#333333",
        "#808080",
        "#cccccc",
        "#D33115",
        "#E27300",
        "#FCC400",
        "#B0BC00",
        "#68BC00",
        "#16A5A5",
        "#009CE0",
        "#7B64FF",
        "#FA28FF",
        "#000000",
        "#666666",
        "#B3B3B3",
        "#9F0500",
        "#C45100",
        "#FB9E00",
        "#808900",
        "#194D33",
        "#0C797D",
        "#0062B1",
        "#653294",
        "#AB149E"
      ];
      ColorPicker = import_react5.default.memo(
        (props) => {
          const { color: color2, style = {}, children, onChange } = props;
          const [visible, setVisible] = (0, import_react5.useState)(false);
          const toggleColorPicker = (0, import_react5.useCallback)(() => {
            setVisible((v2) => !v2);
          }, []);
          const handleBlur = (0, import_react5.useCallback)(() => {
            setVisible(false);
          }, []);
          return /* @__PURE__ */ import_react5.default.createElement("div", {
            className: "relative",
            onBlur: handleBlur,
            style
          }, /* @__PURE__ */ import_react5.default.createElement("div", {
            className: "color-picker-trigger",
            style: { color: color2 },
            onClick: toggleColorPicker
          }, children), visible ? /* @__PURE__ */ import_react5.default.createElement("div", {
            className: "color-picker-wrapper"
          }, /* @__PURE__ */ import_react5.default.createElement("div", {
            className: "color-picker-list"
          }, COLOR_LIST.map((item) => /* @__PURE__ */ import_react5.default.createElement("div", {
            className: "color-picker-item",
            style: { backgroundColor: item },
            key: item,
            onClick: () => {
              onChange(item);
              setVisible(false);
            }
          })))) : null);
        }
      );
      ColorPicker.displayName = "ColorPicker";
    }
  });

  // src/components/Lazy/index.tsx
  var import_react6, Lazy;
  var init_Lazy = __esm({
    "src/components/Lazy/index.tsx"() {
      "use strict";
      import_react6 = __toESM(require_react());
      Lazy = (0, import_react6.memo)(({ children }) => {
        return /* @__PURE__ */ import_react6.default.createElement(import_react6.Suspense, {
          fallback: null
        }, children);
      });
      Lazy.displayName = "Lazy";
    }
  });

  // src/components/ErrorBoundary/index.tsx
  var import_react7, ErrorBoundary;
  var init_ErrorBoundary = __esm({
    "src/components/ErrorBoundary/index.tsx"() {
      "use strict";
      import_react7 = __toESM(require_react());
      ErrorBoundary = class extends import_react7.default.Component {
        constructor(props) {
          super(props);
          this.state = { error: null };
        }
        static getDerivedStateFromError(error) {
          return { error };
        }
        render() {
          const { error } = this.state;
          if (error) {
            return /* @__PURE__ */ import_react7.default.createElement("div", null, /* @__PURE__ */ import_react7.default.createElement("div", null, error.message), /* @__PURE__ */ import_react7.default.createElement("div", null, error.stack));
          }
          return this.props.children;
        }
      };
    }
  });

  // src/components/index.ts
  var init_components = __esm({
    "src/components/index.ts"() {
      "use strict";
      init_Button();
      init_Github();
      init_BaseIcon();
      init_Select();
      init_ColorPicker();
      init_Lazy();
      init_ErrorBoundary();
    }
  });

  // node_modules/immer/dist/immer.esm.mjs
  function n(n2) {
    for (var r2 = arguments.length, t2 = Array(r2 > 1 ? r2 - 1 : 0), e = 1; e < r2; e++)
      t2[e - 1] = arguments[e];
    if (false) {
      var i2 = Y[n2], o2 = i2 ? "function" == typeof i2 ? i2.apply(null, t2) : i2 : "unknown error nr: " + n2;
      throw Error("[Immer] " + o2);
    }
    throw Error("[Immer] minified error nr: " + n2 + (t2.length ? " " + t2.map(function(n3) {
      return "'" + n3 + "'";
    }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf");
  }
  function r(n2) {
    return !!n2 && !!n2[Q];
  }
  function t(n2) {
    var r2;
    return !!n2 && (function(n3) {
      if (!n3 || "object" != typeof n3)
        return false;
      var r3 = Object.getPrototypeOf(n3);
      if (null === r3)
        return true;
      var t2 = Object.hasOwnProperty.call(r3, "constructor") && r3.constructor;
      return t2 === Object || "function" == typeof t2 && Function.toString.call(t2) === Z;
    }(n2) || Array.isArray(n2) || !!n2[L] || !!(null === (r2 = n2.constructor) || void 0 === r2 ? void 0 : r2[L]) || s(n2) || v(n2));
  }
  function i(n2, r2, t2) {
    void 0 === t2 && (t2 = false), 0 === o(n2) ? (t2 ? Object.keys : nn)(n2).forEach(function(e) {
      t2 && "symbol" == typeof e || r2(e, n2[e], n2);
    }) : n2.forEach(function(t3, e) {
      return r2(e, t3, n2);
    });
  }
  function o(n2) {
    var r2 = n2[Q];
    return r2 ? r2.i > 3 ? r2.i - 4 : r2.i : Array.isArray(n2) ? 1 : s(n2) ? 2 : v(n2) ? 3 : 0;
  }
  function u(n2, r2) {
    return 2 === o(n2) ? n2.has(r2) : Object.prototype.hasOwnProperty.call(n2, r2);
  }
  function a(n2, r2) {
    return 2 === o(n2) ? n2.get(r2) : n2[r2];
  }
  function f(n2, r2, t2) {
    var e = o(n2);
    2 === e ? n2.set(r2, t2) : 3 === e ? (n2.delete(r2), n2.add(t2)) : n2[r2] = t2;
  }
  function c(n2, r2) {
    return n2 === r2 ? 0 !== n2 || 1 / n2 == 1 / r2 : n2 != n2 && r2 != r2;
  }
  function s(n2) {
    return X && n2 instanceof Map;
  }
  function v(n2) {
    return q && n2 instanceof Set;
  }
  function p(n2) {
    return n2.o || n2.t;
  }
  function l(n2) {
    if (Array.isArray(n2))
      return Array.prototype.slice.call(n2);
    var r2 = rn(n2);
    delete r2[Q];
    for (var t2 = nn(r2), e = 0; e < t2.length; e++) {
      var i2 = t2[e], o2 = r2[i2];
      false === o2.writable && (o2.writable = true, o2.configurable = true), (o2.get || o2.set) && (r2[i2] = { configurable: true, writable: true, enumerable: o2.enumerable, value: n2[i2] });
    }
    return Object.create(Object.getPrototypeOf(n2), r2);
  }
  function d(n2, e) {
    return void 0 === e && (e = false), y(n2) || r(n2) || !t(n2) ? n2 : (o(n2) > 1 && (n2.set = n2.add = n2.clear = n2.delete = h), Object.freeze(n2), e && i(n2, function(n3, r2) {
      return d(r2, true);
    }, true), n2);
  }
  function h() {
    n(2);
  }
  function y(n2) {
    return null == n2 || "object" != typeof n2 || Object.isFrozen(n2);
  }
  function b(r2) {
    var t2 = tn[r2];
    return t2 || n(18, r2), t2;
  }
  function _() {
    return true, U;
  }
  function j(n2, r2) {
    r2 && (b("Patches"), n2.u = [], n2.s = [], n2.v = r2);
  }
  function O(n2) {
    g(n2), n2.p.forEach(S), n2.p = null;
  }
  function g(n2) {
    n2 === U && (U = n2.l);
  }
  function w(n2) {
    return U = { p: [], l: U, h: n2, m: true, _: 0 };
  }
  function S(n2) {
    var r2 = n2[Q];
    0 === r2.i || 1 === r2.i ? r2.j() : r2.O = true;
  }
  function P(r2, e) {
    e._ = e.p.length;
    var i2 = e.p[0], o2 = void 0 !== r2 && r2 !== i2;
    return e.h.g || b("ES5").S(e, r2, o2), o2 ? (i2[Q].P && (O(e), n(4)), t(r2) && (r2 = M(e, r2), e.l || x(e, r2)), e.u && b("Patches").M(i2[Q].t, r2, e.u, e.s)) : r2 = M(e, i2, []), O(e), e.u && e.v(e.u, e.s), r2 !== H ? r2 : void 0;
  }
  function M(n2, r2, t2) {
    if (y(r2))
      return r2;
    var e = r2[Q];
    if (!e)
      return i(r2, function(i2, o3) {
        return A(n2, e, r2, i2, o3, t2);
      }, true), r2;
    if (e.A !== n2)
      return r2;
    if (!e.P)
      return x(n2, e.t, true), e.t;
    if (!e.I) {
      e.I = true, e.A._--;
      var o2 = 4 === e.i || 5 === e.i ? e.o = l(e.k) : e.o;
      i(3 === e.i ? new Set(o2) : o2, function(r3, i2) {
        return A(n2, e, o2, r3, i2, t2);
      }), x(n2, o2, false), t2 && n2.u && b("Patches").R(e, t2, n2.u, n2.s);
    }
    return e.o;
  }
  function A(e, i2, o2, a2, c2, s2) {
    if (false, r(c2)) {
      var v2 = M(e, c2, s2 && i2 && 3 !== i2.i && !u(i2.D, a2) ? s2.concat(a2) : void 0);
      if (f(o2, a2, v2), !r(v2))
        return;
      e.m = false;
    }
    if (t(c2) && !y(c2)) {
      if (!e.h.F && e._ < 1)
        return;
      M(e, c2), i2 && i2.A.l || x(e, c2);
    }
  }
  function x(n2, r2, t2) {
    void 0 === t2 && (t2 = false), n2.h.F && n2.m && d(r2, t2);
  }
  function z(n2, r2) {
    var t2 = n2[Q];
    return (t2 ? p(t2) : n2)[r2];
  }
  function I(n2, r2) {
    if (r2 in n2)
      for (var t2 = Object.getPrototypeOf(n2); t2; ) {
        var e = Object.getOwnPropertyDescriptor(t2, r2);
        if (e)
          return e;
        t2 = Object.getPrototypeOf(t2);
      }
  }
  function k(n2) {
    n2.P || (n2.P = true, n2.l && k(n2.l));
  }
  function E(n2) {
    n2.o || (n2.o = l(n2.t));
  }
  function R(n2, r2, t2) {
    var e = s(r2) ? b("MapSet").N(r2, t2) : v(r2) ? b("MapSet").T(r2, t2) : n2.g ? function(n3, r3) {
      var t3 = Array.isArray(n3), e2 = { i: t3 ? 1 : 0, A: r3 ? r3.A : _(), P: false, I: false, D: {}, l: r3, t: n3, k: null, o: null, j: null, C: false }, i2 = e2, o2 = en;
      t3 && (i2 = [e2], o2 = on);
      var u2 = Proxy.revocable(i2, o2), a2 = u2.revoke, f2 = u2.proxy;
      return e2.k = f2, e2.j = a2, f2;
    }(r2, t2) : b("ES5").J(r2, t2);
    return (t2 ? t2.A : _()).p.push(e), e;
  }
  function D(e) {
    return r(e) || n(22, e), function n2(r2) {
      if (!t(r2))
        return r2;
      var e2, u2 = r2[Q], c2 = o(r2);
      if (u2) {
        if (!u2.P && (u2.i < 4 || !b("ES5").K(u2)))
          return u2.t;
        u2.I = true, e2 = F(r2, c2), u2.I = false;
      } else
        e2 = F(r2, c2);
      return i(e2, function(r3, t2) {
        u2 && a(u2.t, r3) === t2 || f(e2, r3, n2(t2));
      }), 3 === c2 ? new Set(e2) : e2;
    }(e);
  }
  function F(n2, r2) {
    switch (r2) {
      case 2:
        return new Map(n2);
      case 3:
        return Array.from(n2);
    }
    return l(n2);
  }
  var G, U, W, X, q, B, H, L, Q, Z, nn, rn, tn, en, on, un, an, fn, cn, sn, vn, pn, ln, dn, immer_esm_default;
  var init_immer_esm = __esm({
    "node_modules/immer/dist/immer.esm.mjs"() {
      W = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x");
      X = "undefined" != typeof Map;
      q = "undefined" != typeof Set;
      B = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect;
      H = W ? Symbol.for("immer-nothing") : ((G = {})["immer-nothing"] = true, G);
      L = W ? Symbol.for("immer-draftable") : "__$immer_draftable";
      Q = W ? Symbol.for("immer-state") : "__$immer_state";
      Z = "" + Object.prototype.constructor;
      nn = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function(n2) {
        return Object.getOwnPropertyNames(n2).concat(Object.getOwnPropertySymbols(n2));
      } : Object.getOwnPropertyNames;
      rn = Object.getOwnPropertyDescriptors || function(n2) {
        var r2 = {};
        return nn(n2).forEach(function(t2) {
          r2[t2] = Object.getOwnPropertyDescriptor(n2, t2);
        }), r2;
      };
      tn = {};
      en = { get: function(n2, r2) {
        if (r2 === Q)
          return n2;
        var e = p(n2);
        if (!u(e, r2))
          return function(n3, r3, t2) {
            var e2, i3 = I(r3, t2);
            return i3 ? "value" in i3 ? i3.value : null === (e2 = i3.get) || void 0 === e2 ? void 0 : e2.call(n3.k) : void 0;
          }(n2, e, r2);
        var i2 = e[r2];
        return n2.I || !t(i2) ? i2 : i2 === z(n2.t, r2) ? (E(n2), n2.o[r2] = R(n2.A.h, i2, n2)) : i2;
      }, has: function(n2, r2) {
        return r2 in p(n2);
      }, ownKeys: function(n2) {
        return Reflect.ownKeys(p(n2));
      }, set: function(n2, r2, t2) {
        var e = I(p(n2), r2);
        if (null == e ? void 0 : e.set)
          return e.set.call(n2.k, t2), true;
        if (!n2.P) {
          var i2 = z(p(n2), r2), o2 = null == i2 ? void 0 : i2[Q];
          if (o2 && o2.t === t2)
            return n2.o[r2] = t2, n2.D[r2] = false, true;
          if (c(t2, i2) && (void 0 !== t2 || u(n2.t, r2)))
            return true;
          E(n2), k(n2);
        }
        return n2.o[r2] === t2 && "number" != typeof t2 && (void 0 !== t2 || r2 in n2.o) || (n2.o[r2] = t2, n2.D[r2] = true, true);
      }, deleteProperty: function(n2, r2) {
        return void 0 !== z(n2.t, r2) || r2 in n2.t ? (n2.D[r2] = false, E(n2), k(n2)) : delete n2.D[r2], n2.o && delete n2.o[r2], true;
      }, getOwnPropertyDescriptor: function(n2, r2) {
        var t2 = p(n2), e = Reflect.getOwnPropertyDescriptor(t2, r2);
        return e ? { writable: true, configurable: 1 !== n2.i || "length" !== r2, enumerable: e.enumerable, value: t2[r2] } : e;
      }, defineProperty: function() {
        n(11);
      }, getPrototypeOf: function(n2) {
        return Object.getPrototypeOf(n2.t);
      }, setPrototypeOf: function() {
        n(12);
      } };
      on = {};
      i(en, function(n2, r2) {
        on[n2] = function() {
          return arguments[0] = arguments[0][0], r2.apply(this, arguments);
        };
      }), on.deleteProperty = function(r2, t2) {
        return false, on.set.call(this, r2, t2, void 0);
      }, on.set = function(r2, t2, e) {
        return false, en.set.call(this, r2[0], t2, e, r2[0]);
      };
      un = function() {
        function e(r2) {
          var e2 = this;
          this.g = B, this.F = true, this.produce = function(r3, i3, o2) {
            if ("function" == typeof r3 && "function" != typeof i3) {
              var u2 = i3;
              i3 = r3;
              var a2 = e2;
              return function(n2) {
                var r4 = this;
                void 0 === n2 && (n2 = u2);
                for (var t2 = arguments.length, e3 = Array(t2 > 1 ? t2 - 1 : 0), o3 = 1; o3 < t2; o3++)
                  e3[o3 - 1] = arguments[o3];
                return a2.produce(n2, function(n3) {
                  var t3;
                  return (t3 = i3).call.apply(t3, [r4, n3].concat(e3));
                });
              };
            }
            var f2;
            if ("function" != typeof i3 && n(6), void 0 !== o2 && "function" != typeof o2 && n(7), t(r3)) {
              var c2 = w(e2), s2 = R(e2, r3, void 0), v2 = true;
              try {
                f2 = i3(s2), v2 = false;
              } finally {
                v2 ? O(c2) : g(c2);
              }
              return "undefined" != typeof Promise && f2 instanceof Promise ? f2.then(function(n2) {
                return j(c2, o2), P(n2, c2);
              }, function(n2) {
                throw O(c2), n2;
              }) : (j(c2, o2), P(f2, c2));
            }
            if (!r3 || "object" != typeof r3) {
              if (void 0 === (f2 = i3(r3)) && (f2 = r3), f2 === H && (f2 = void 0), e2.F && d(f2, true), o2) {
                var p2 = [], l2 = [];
                b("Patches").M(r3, f2, p2, l2), o2(p2, l2);
              }
              return f2;
            }
            n(21, r3);
          }, this.produceWithPatches = function(n2, r3) {
            if ("function" == typeof n2)
              return function(r4) {
                for (var t3 = arguments.length, i4 = Array(t3 > 1 ? t3 - 1 : 0), o3 = 1; o3 < t3; o3++)
                  i4[o3 - 1] = arguments[o3];
                return e2.produceWithPatches(r4, function(r5) {
                  return n2.apply(void 0, [r5].concat(i4));
                });
              };
            var t2, i3, o2 = e2.produce(n2, r3, function(n3, r4) {
              t2 = n3, i3 = r4;
            });
            return "undefined" != typeof Promise && o2 instanceof Promise ? o2.then(function(n3) {
              return [n3, t2, i3];
            }) : [o2, t2, i3];
          }, "boolean" == typeof (null == r2 ? void 0 : r2.useProxies) && this.setUseProxies(r2.useProxies), "boolean" == typeof (null == r2 ? void 0 : r2.autoFreeze) && this.setAutoFreeze(r2.autoFreeze);
        }
        var i2 = e.prototype;
        return i2.createDraft = function(e2) {
          t(e2) || n(8), r(e2) && (e2 = D(e2));
          var i3 = w(this), o2 = R(this, e2, void 0);
          return o2[Q].C = true, g(i3), o2;
        }, i2.finishDraft = function(r2, t2) {
          var e2 = r2 && r2[Q];
          var i3 = e2.A;
          return j(i3, t2), P(void 0, i3);
        }, i2.setAutoFreeze = function(n2) {
          this.F = n2;
        }, i2.setUseProxies = function(r2) {
          r2 && !B && n(20), this.g = r2;
        }, i2.applyPatches = function(n2, t2) {
          var e2;
          for (e2 = t2.length - 1; e2 >= 0; e2--) {
            var i3 = t2[e2];
            if (0 === i3.path.length && "replace" === i3.op) {
              n2 = i3.value;
              break;
            }
          }
          e2 > -1 && (t2 = t2.slice(e2 + 1));
          var o2 = b("Patches").$;
          return r(n2) ? o2(n2, t2) : this.produce(n2, function(n3) {
            return o2(n3, t2);
          });
        }, e;
      }();
      an = new un();
      fn = an.produce;
      cn = an.produceWithPatches.bind(an);
      sn = an.setAutoFreeze.bind(an);
      vn = an.setUseProxies.bind(an);
      pn = an.applyPatches.bind(an);
      ln = an.createDraft.bind(an);
      dn = an.finishDraft.bind(an);
      immer_esm_default = fn;
    }
  });

  // src/store/reducer.ts
  var initialState, reducer;
  var init_reducer = __esm({
    "src/store/reducer.ts"() {
      "use strict";
      init_util2();
      initialState = {
        activeCell: { ...EDITOR_DEFAULT_POSITION },
        currentSheetId: "",
        sheetList: [],
        editCellValue: "",
        canRedo: false,
        canUndo: false,
        isCellEditing: false
      };
      reducer = (state, action) => {
        storeLog(action.type, action);
        switch (action.type) {
          case "CHANGE_Edit_CELL_VALUE":
            state.editCellValue = action.payload;
            break;
          case "CHANGE_ACTIVE_CELL":
            state.activeCell = action.payload;
            break;
          case "RESET":
            state = initialState;
            break;
          case "SET_CURRENT_SHEET_ID":
            state.currentSheetId = action.payload;
            break;
          case "SET_SHEET_LIST":
            state.sheetList = action.payload;
            break;
          case "BATCH":
            state = {
              ...state,
              ...action.payload
            };
            break;
          default:
            break;
        }
        return state;
      };
    }
  });

  // src/types/store.ts
  var init_store = __esm({
    "src/types/store.ts"() {
      "use strict";
    }
  });

  // src/types/model.ts
  var init_model = __esm({
    "src/types/model.ts"() {
      "use strict";
    }
  });

  // src/types/controller.ts
  var init_controller = __esm({
    "src/types/controller.ts"() {
      "use strict";
    }
  });

  // src/types/event.ts
  var init_event = __esm({
    "src/types/event.ts"() {
      "use strict";
    }
  });

  // src/types/scroll.ts
  var init_scroll = __esm({
    "src/types/scroll.ts"() {
      "use strict";
    }
  });

  // src/types/range.ts
  var init_range2 = __esm({
    "src/types/range.ts"() {
      "use strict";
    }
  });

  // src/types/parser.ts
  var init_parser = __esm({
    "src/types/parser.ts"() {
      "use strict";
    }
  });

  // src/types/formula.ts
  var init_formula = __esm({
    "src/types/formula.ts"() {
      "use strict";
    }
  });

  // src/types/icons.ts
  var init_icons = __esm({
    "src/types/icons.ts"() {
      "use strict";
    }
  });

  // src/types/index.ts
  var init_types = __esm({
    "src/types/index.ts"() {
      "use strict";
      init_store();
      init_model();
      init_controller();
      init_event();
      init_model();
      init_scroll();
      init_range2();
      init_parser();
      init_formula();
      init_icons();
    }
  });

  // src/parser/token.ts
  var Token;
  var init_token = __esm({
    "src/parser/token.ts"() {
      "use strict";
      Token = class {
        type;
        value;
        constructor(type, value) {
          this.type = type;
          this.value = value;
        }
        error() {
          return `type:${this.type},value:${this.value}`;
        }
      };
    }
  });

  // src/parser/error.ts
  var CustomError;
  var init_error2 = __esm({
    "src/parser/error.ts"() {
      "use strict";
      CustomError = class extends Error {
        value;
        constructor(value) {
          super(value);
          this.value = value;
        }
      };
    }
  });

  // src/parser/scanner.ts
  var emptyData, identifierMap, Scanner;
  var init_scanner = __esm({
    "src/parser/scanner.ts"() {
      "use strict";
      init_types();
      init_token();
      init_util2();
      init_error2();
      emptyData = "";
      identifierMap = /* @__PURE__ */ new Map([
        ["TRUE", 17 /* TRUE */],
        ["FALSE", 18 /* FALSE */]
      ]);
      Scanner = class {
        list;
        current = 0;
        start = 0;
        tokens = [];
        constructor(source) {
          this.list = [...source];
        }
        scan() {
          while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
          }
          this.tokens.push(new Token(30 /* EOF */, ""));
          if (this.tokens.length > 0 && this.tokens[0].type === 0 /* EQUAL */) {
            this.tokens.shift();
          }
          return this.tokens;
        }
        peek() {
          if (this.isAtEnd()) {
            return emptyData;
          }
          return this.list[this.current];
        }
        previous() {
          return this.list[this.current - 1];
        }
        match(text) {
          if (this.peek() !== text) {
            return false;
          }
          this.next();
          return true;
        }
        next() {
          if (this.isAtEnd()) {
            return emptyData;
          }
          return this.list[this.current++];
        }
        isAtEnd() {
          return this.current >= this.list.length;
        }
        addToken(type) {
          let text = this.list.slice(this.start, this.current).join("");
          let realType = type;
          if (type === 14 /* IDENTIFIER */) {
            const temp = identifierMap.get(text.toUpperCase());
            if (temp) {
              text = text.toUpperCase();
              realType = temp;
            }
          }
          this.tokens.push(new Token(realType, text));
        }
        string(end) {
          while (!this.isAtEnd() && this.peek() !== end) {
            this.next();
          }
          if (this.peek() !== end) {
            throw new CustomError("#VALUE!");
          } else {
            this.next();
          }
          const text = this.list.slice(this.start + 1, this.current - 1).join("");
          this.tokens.push(new Token(15 /* STRING */, text));
        }
        number() {
          while (!this.isAtEnd() && this.isDigit(this.peek())) {
            this.next();
          }
          if (this.match(".")) {
            while (!this.isAtEnd() && this.isDigit(this.peek())) {
              this.next();
            }
          }
          this.addToken(16 /* NUMBER */);
        }
        isDigit(char) {
          return char >= "0" && char <= "9";
        }
        isLetter(char) {
          return isLetter(char);
        }
        identifier() {
          while (!this.isAtEnd() && this.isLetter(this.peek())) {
            this.next();
          }
          if (this.match("$")) {
            if (this.isDigit(this.peek())) {
              while (!this.isAtEnd() && this.isDigit(this.peek())) {
                this.next();
              }
              this.addToken(27 /* MIXED_CELL */);
            } else {
              throw new CustomError("#REF!");
            }
          } else if (this.isDigit(this.peek())) {
            while (!this.isAtEnd() && this.isDigit(this.peek())) {
              this.next();
            }
            this.addToken(29 /* RELATIVE_CELL */);
          } else {
            this.addToken(14 /* IDENTIFIER */);
          }
        }
        scanToken() {
          const c2 = this.next();
          switch (c2) {
            case "(":
              this.addToken(22 /* LEFT_BRACKET */);
              break;
            case ")":
              this.addToken(23 /* RIGHT_BRACKET */);
              break;
            case ",":
              this.addToken(21 /* COMMA */);
              break;
            case ":":
              this.addToken(20 /* COLON */);
              break;
            case "=":
              this.addToken(0 /* EQUAL */);
              break;
            case "<":
              if (this.match(">")) {
                this.addToken(1 /* NOT_EQUAL */);
              } else if (this.match("=")) {
                this.addToken(12 /* LESS_EQUAL */);
              } else {
                this.addToken(11 /* LESS */);
              }
              break;
            case ">":
              if (this.match("=")) {
                this.addToken(8 /* GREATER_EQUAL */);
              } else {
                this.addToken(7 /* GREATER */);
              }
              break;
            case "+":
              this.addToken(2 /* PLUS */);
              break;
            case "-":
              this.addToken(3 /* MINUS */);
              break;
            case "*":
              this.addToken(4 /* STAR */);
              break;
            case "/":
              this.addToken(5 /* SLASH */);
              break;
            case "^":
              this.addToken(6 /* EXPONENT */);
              break;
            case "&":
              this.addToken(9 /* CONCATENATE */);
              break;
            case "%":
              this.addToken(10 /* PERCENT */);
              break;
            case '"':
              this.string(c2);
              break;
            case ";":
              this.addToken(26 /* SEMICOLON */);
              break;
            case "{":
              this.addToken(24 /* lEFT_BRACE */);
              break;
            case "}":
              this.addToken(25 /* RIGHT_BRACE */);
              break;
            case " ":
            case "\r":
            case "	":
            case "\n":
              break;
            case "$":
              while (!this.isAtEnd() && this.isLetter(this.peek())) {
                this.next();
              }
              const isLetter2 = this.isLetter(this.previous());
              if (isLetter2) {
                if (this.isDigit(this.peek())) {
                  while (!this.isAtEnd() && this.isDigit(this.peek())) {
                    this.next();
                  }
                  this.addToken(27 /* MIXED_CELL */);
                } else if (this.match("$")) {
                  if (this.isDigit(this.peek())) {
                    while (!this.isAtEnd() && this.isDigit(this.peek())) {
                      this.next();
                    }
                    this.addToken(28 /* ABSOLUTE_CELL */);
                  } else {
                    throw new CustomError("#REF!");
                  }
                } else {
                  this.addToken(28 /* ABSOLUTE_CELL */);
                }
              } else {
                while (!this.isAtEnd() && this.isDigit(this.peek())) {
                  this.next();
                }
                if (this.isDigit(this.previous())) {
                  this.addToken(28 /* ABSOLUTE_CELL */);
                } else {
                  throw new CustomError("#REF!");
                }
              }
              break;
            case "#":
              while (!this.isAtEnd() && this.isLetter(this.peek())) {
                this.next();
              }
              if (this.peek() === "!" || this.peek() === "?") {
                this.next();
              }
              this.addToken(13 /* ERROR */);
              break;
            default:
              if (this.isDigit(c2)) {
                this.number();
              } else if (this.isLetter(c2)) {
                this.identifier();
              }
              break;
          }
        }
      };
    }
  });

  // src/parser/expression.ts
  var BinaryExpression, UnaryExpression, LiteralExpression, CellExpression, CallExpression, ErrorExpression, CellRangeExpression, GroupExpression, DefineNameExpression;
  var init_expression = __esm({
    "src/parser/expression.ts"() {
      "use strict";
      BinaryExpression = class {
        left;
        right;
        operator;
        constructor(left, operator, right) {
          this.left = left;
          this.operator = operator;
          this.right = right;
        }
        accept(visitor) {
          return visitor.visitBinaryExpression(this);
        }
        toString() {
          return "";
        }
      };
      UnaryExpression = class {
        right;
        operator;
        constructor(operator, right) {
          this.operator = operator;
          this.right = right;
        }
        accept(visitor) {
          return visitor.visitUnaryExpression(this);
        }
        toString() {
          return "";
        }
      };
      LiteralExpression = class {
        value;
        constructor(value) {
          this.value = value;
        }
        accept(visitor) {
          return visitor.visitLiteralExpression(this);
        }
        toString() {
          return "";
        }
      };
      CellExpression = class {
        value;
        constructor(value) {
          this.value = value;
        }
        accept(visitor) {
          return visitor.visitCellExpression(this);
        }
        toString() {
          return "";
        }
      };
      CallExpression = class {
        name;
        params;
        constructor(name, params) {
          this.name = name;
          this.params = params;
        }
        accept(visitor) {
          return visitor.visitCallExpression(this);
        }
        toString() {
          return "";
        }
      };
      ErrorExpression = class {
        value;
        constructor(value) {
          this.value = value;
        }
        accept(visitor) {
          return visitor.visitCellExpression(this);
        }
        toString() {
          return "";
        }
      };
      CellRangeExpression = class {
        left;
        right;
        operator;
        constructor(left, operator, right) {
          this.left = left;
          this.operator = operator;
          this.right = right;
        }
        accept(visitor) {
          return visitor.visitCellRangeExpression(this);
        }
        toString() {
          return "";
        }
      };
      GroupExpression = class {
        value;
        constructor(value) {
          this.value = value;
        }
        accept(visitor) {
          return visitor.visitGroupExpression(this);
        }
        toString() {
          return "";
        }
      };
      DefineNameExpression = class {
        value;
        constructor(value) {
          this.value = value;
        }
        accept(visitor) {
          return visitor.visitDefineNameExpression(this);
        }
        toString() {
          return "";
        }
      };
    }
  });

  // src/parser/parser.ts
  var Parser;
  var init_parser2 = __esm({
    "src/parser/parser.ts"() {
      "use strict";
      init_types();
      init_token();
      init_expression();
      init_expression();
      init_util2();
      init_error2();
      Parser = class {
        tokens;
        current = 0;
        constructor(tokens) {
          this.tokens = tokens;
        }
        parse() {
          const result = [];
          while (!this.isAtEnd()) {
            result.push(this.expression());
          }
          return result;
        }
        expression() {
          return this.equality();
        }
        equality() {
          let expr = this.comparison();
          while (this.match(0 /* EQUAL */, 1 /* NOT_EQUAL */)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new BinaryExpression(expr, operator, right);
          }
          return expr;
        }
        comparison() {
          let expr = this.term();
          while (this.match(
            7 /* GREATER */,
            8 /* GREATER_EQUAL */,
            11 /* LESS */,
            12 /* LESS_EQUAL */
          )) {
            const operator = this.previous();
            const right = this.term();
            expr = new BinaryExpression(expr, operator, right);
          }
          return expr;
        }
        term() {
          let expr = this.factor();
          while (this.match(2 /* PLUS */, 3 /* MINUS */)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new BinaryExpression(expr, operator, right);
          }
          return expr;
        }
        factor() {
          let expr = this.expo();
          while (this.match(5 /* SLASH */, 4 /* STAR */)) {
            const operator = this.previous();
            const right = this.expo();
            expr = new BinaryExpression(expr, operator, right);
          }
          return expr;
        }
        expo() {
          let expr = this.concatenate();
          while (this.match(6 /* EXPONENT */)) {
            const operator = this.previous();
            const right = this.expo();
            expr = new BinaryExpression(expr, operator, right);
          }
          return expr;
        }
        concatenate() {
          let expr = this.unary();
          while (this.match(9 /* CONCATENATE */)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new BinaryExpression(expr, operator, right);
          }
          return expr;
        }
        unary() {
          if (this.match(2 /* PLUS */, 3 /* MINUS */)) {
            const operator = this.previous();
            const right = this.unary();
            return new UnaryExpression(operator, right);
          }
          return this.spread();
        }
        convertToCellExpression(expr) {
          if (expr instanceof CellExpression) {
            return expr;
          }
          if (expr instanceof LiteralExpression) {
            if (expr.value.type === 16 /* NUMBER */) {
              return new CellExpression(
                new Token(29 /* RELATIVE_CELL */, expr.value.value)
              );
            }
          }
          if (expr instanceof DefineNameExpression) {
            if (expr.value.value.split("").every((v2) => isLetter(v2))) {
              return new CellExpression(
                new Token(29 /* RELATIVE_CELL */, expr.value.value)
              );
            }
          }
          throw new CustomError("#REF!");
        }
        spread() {
          let expr = this.primary();
          while (this.match(20 /* COLON */)) {
            const operator = this.previous();
            const right = this.primary();
            expr = new CellRangeExpression(
              this.convertToCellExpression(expr),
              operator,
              this.convertToCellExpression(right)
            );
          }
          return expr;
        }
        primary() {
          if (this.match(16 /* NUMBER */)) {
            return new LiteralExpression(this.previous());
          }
          if (this.match(15 /* STRING */)) {
            return new LiteralExpression(this.previous());
          }
          if (this.match(17 /* TRUE */)) {
            return new LiteralExpression(this.previous());
          }
          if (this.match(18 /* FALSE */)) {
            return new LiteralExpression(this.previous());
          }
          if (this.match(
            27 /* MIXED_CELL */,
            29 /* RELATIVE_CELL */,
            28 /* ABSOLUTE_CELL */
          )) {
            return new CellExpression(this.previous());
          }
          if (this.match(13 /* ERROR */)) {
            return new ErrorExpression(this.previous());
          }
          if (this.match(14 /* IDENTIFIER */)) {
            const name = this.previous();
            if (this.match(22 /* LEFT_BRACKET */)) {
              const params = [];
              if (!this.check(23 /* RIGHT_BRACKET */)) {
                do {
                  params.push(this.expression());
                } while (this.match(21 /* COMMA */));
              }
              this.expect(23 /* RIGHT_BRACKET */);
              return new CallExpression(name, params);
            } else {
              return new DefineNameExpression(name);
            }
          }
          if (this.match(22 /* LEFT_BRACKET */)) {
            const value = this.expression();
            this.expect(23 /* RIGHT_BRACKET */);
            return new GroupExpression(value);
          }
          throw new CustomError("#ERROR!");
        }
        match(...types) {
          const type = this.peek().type;
          if (types.includes(type)) {
            this.next();
            return true;
          }
          return false;
        }
        previous() {
          return this.tokens[this.current - 1];
        }
        check(type) {
          return this.peek().type === type;
        }
        expect(type) {
          if (this.check(type)) {
            this.next();
            return this.previous();
          } else {
            throw new CustomError("#ERROR!");
          }
        }
        next() {
          this.current++;
        }
        isAtEnd() {
          return this.peek().type === 30 /* EOF */;
        }
        peek() {
          if (this.current < this.tokens.length) {
            return this.tokens[this.current];
          }
          return new Token(30 /* EOF */, "");
        }
      };
    }
  });

  // src/formula/text.ts
  var T, LOWER, CHAR, CODE, LEN, UNICHAR, UNICODE, UPPER, TRIM, textFormulas, text_default;
  var init_text = __esm({
    "src/formula/text.ts"() {
      "use strict";
      T = (value) => {
        return typeof value === "string" ? value : "";
      };
      LOWER = (value) => value.toLowerCase();
      CHAR = (value) => String.fromCharCode(value);
      CODE = (value) => value.charCodeAt(0);
      LEN = (value) => value.length;
      UNICHAR = CHAR;
      UNICODE = CODE;
      UPPER = (value) => value.toUpperCase();
      TRIM = (value) => value.replace(/ +/g, " ").trim();
      textFormulas = {
        ASC: null,
        BAHTTEXT: null,
        CONCATENATE: null,
        CLEAN: null,
        DBCS: null,
        DOLLAR: null,
        EXACT: null,
        FIND: null,
        FIXED: null,
        HTML2TEXT: null,
        LEFT: null,
        MID: null,
        NUMBERVALUE: null,
        PRONETIC: null,
        PROPER: null,
        REGEXEXTRACT: null,
        REGEXMATCH: null,
        REGREPLACE: null,
        REPLACE: null,
        REPT: null,
        RIGHT: null,
        SEARCH: null,
        SPLIT: null,
        SUBSTITUTE: null,
        TEXT: null,
        VALUE: null,
        CHAR: {
          func: CHAR,
          options: {
            paramsType: "string",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "string"
          }
        },
        CODE: {
          func: CODE,
          options: {
            paramsType: "string",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        UNICHAR: {
          func: UNICHAR,
          options: {
            paramsType: "string",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "string"
          }
        },
        UNICODE: {
          func: UNICODE,
          options: {
            paramsType: "string",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        LEN: {
          func: LEN,
          options: {
            paramsType: "string",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        LOWER: {
          func: LOWER,
          options: {
            paramsType: "string",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "string"
          }
        },
        UPPER: {
          func: UPPER,
          options: {
            paramsType: "string",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "string"
          }
        },
        TRIM: {
          func: TRIM,
          options: {
            paramsType: "string",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "string"
          }
        },
        T: {
          func: T,
          options: {
            paramsType: "any",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "string"
          }
        }
      };
      text_default = textFormulas;
    }
  });

  // src/formula/math.ts
  var ABS, ACOS, ACOSH, ACOT, ACOTH, ASIN, ASINH, ATAN, ATANH, COS, COT, EXP, INT, PI, SIN, SUM, formulas, math_default;
  var init_math = __esm({
    "src/formula/math.ts"() {
      "use strict";
      init_util2();
      ABS = (data) => {
        return Math.abs(data);
      };
      ACOS = (data) => {
        return Math.acos(data);
      };
      ACOSH = (data) => {
        return Math.log(data + Math.sqrt(data * data - 1));
      };
      ACOT = (data) => {
        return Math.atan(1 / data);
      };
      ACOTH = (data) => {
        return 0.5 * Math.log((data + 1) / (data - 1));
      };
      ASIN = (data) => {
        return Math.asin(data);
      };
      ASINH = (data) => {
        return Math.log(data + Math.sqrt(data * data + 1));
      };
      ATAN = (data) => Math.atan(data);
      ATANH = (data) => Math.log((1 + data) / (data + 1)) / 2;
      COS = (data) => Math.cos(data);
      COT = (data) => 1 / Math.tan(data);
      EXP = (data) => Math.exp(data);
      INT = (data) => Math.floor(data);
      PI = () => Math.PI;
      SIN = (data) => Math.sin(data);
      SUM = (...rest) => {
        const list = parseNumberArray(rest);
        return list.reduce((sum, cur) => sum + cur, 0);
      };
      formulas = {
        ABS: {
          func: ABS,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        ACOS: {
          func: ACOS,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        ACOSH: {
          func: ACOSH,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        ACOT: {
          func: ACOT,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        ACOTH: {
          func: ACOTH,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        ASIN: {
          func: ASIN,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        ASINH: {
          func: ASINH,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        ATAN: {
          func: ATAN,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        ATANH: {
          func: ATANH,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        COT: {
          func: COT,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        COS: {
          func: COS,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        EXP: {
          func: EXP,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        INT: {
          func: INT,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        PI: {
          func: PI,
          options: {
            paramsType: "any",
            minParamsCount: 0,
            maxParamsCount: 0,
            resultType: "number"
          }
        },
        E: {
          func: INT,
          options: {
            paramsType: "any",
            minParamsCount: 0,
            maxParamsCount: 0,
            resultType: "number"
          }
        },
        SIN: {
          func: SIN,
          options: {
            paramsType: "number",
            minParamsCount: 1,
            maxParamsCount: 1,
            resultType: "number"
          }
        },
        SUM: {
          func: SUM,
          options: {
            paramsType: "any",
            minParamsCount: 1,
            maxParamsCount: MAX_PARAMS_COUNT,
            resultType: "number"
          }
        }
      };
      math_default = formulas;
    }
  });

  // src/formula/index.ts
  function handleFormula() {
    if (true) {
      return;
    }
    const temp = JSON.stringify(formulas2);
    fetch(`/formula?data=${encodeURIComponent(temp)}`);
  }
  var formulas2, formula_default;
  var init_formula2 = __esm({
    "src/formula/index.ts"() {
      "use strict";
      init_text();
      init_math();
      formulas2 = {
        ...text_default,
        ...math_default
      };
      formula_default = formulas2;
      handleFormula();
    }
  });

  // src/parser/interpreter.ts
  var Interpreter;
  var init_interpreter = __esm({
    "src/parser/interpreter.ts"() {
      "use strict";
      init_util2();
      init_types();
      init_error2();
      Interpreter = class {
        expressions;
        functionMap;
        cellDataMap;
        variableMap;
        constructor(expressions, functionMap, cellDataMap, variableMap) {
          this.expressions = expressions;
          this.functionMap = functionMap;
          this.cellDataMap = cellDataMap;
          this.variableMap = variableMap;
        }
        interpret() {
          const result = [];
          for (const item of this.expressions) {
            result.push(this.evaluate(item));
          }
          return result;
        }
        checkNumber(value) {
          if (typeof value !== "number") {
            throw new CustomError("#VALUE!");
          }
        }
        visitBinaryExpression(data) {
          const left = this.evaluate(data.left);
          const right = this.evaluate(data.right);
          switch (data.operator.type) {
            case 3 /* MINUS */:
              this.checkNumber(left);
              this.checkNumber(right);
              return left - right;
            case 2 /* PLUS */:
              this.checkNumber(left);
              this.checkNumber(right);
              return left + right;
            case 5 /* SLASH */:
              this.checkNumber(left);
              this.checkNumber(right);
              if (right === 0) {
                throw new CustomError("#DIV/0!");
              }
              return left / right;
            case 4 /* STAR */:
              this.checkNumber(left);
              this.checkNumber(right);
              return left * right;
            case 6 /* EXPONENT */:
              this.checkNumber(left);
              this.checkNumber(right);
              return Math.pow(left, right);
            case 0 /* EQUAL */:
              return left === right;
            case 1 /* NOT_EQUAL */:
              return left !== right;
            case 7 /* GREATER */:
              return left > right;
            case 8 /* GREATER_EQUAL */:
              return left >= right;
            case 11 /* LESS */:
              return left < right;
            case 12 /* LESS_EQUAL */:
              return left <= right;
            case 9 /* CONCATENATE */:
              return `${left}${right}`;
            default:
              throw new CustomError("#VALUE!");
          }
        }
        visitCallExpression(expr) {
          const callee = this.functionMap.get(expr.name.value);
          if (callee && typeof callee === "function") {
            const params = [];
            for (const item of expr.params) {
              const t2 = this.evaluate(item);
              if (t2 instanceof Range) {
                const { row, col, rowCount, colCount, sheetId } = t2;
                for (let r2 = row, endRow = row + rowCount; r2 < endRow; r2++) {
                  for (let c2 = col, endCol = col + colCount; c2 < endCol; c2++) {
                    params.push(this.cellDataMap.get(r2, c2, sheetId));
                  }
                }
              } else {
                params.push(t2);
              }
            }
            return callee(...params);
          }
          throw new CustomError("#NAME?");
        }
        visitCellExpression(data) {
          const t2 = parseCell(data.value.value);
          if (t2 === null) {
            throw new CustomError("#REF!");
          }
          return this.cellDataMap.get(t2.row, t2.col, t2.sheetId);
        }
        visitErrorExpression(data) {
          throw new CustomError(data.value.value);
        }
        visitLiteralExpression(expr) {
          const { type, value } = expr.value;
          switch (type) {
            case 15 /* STRING */:
              return value;
            case 16 /* NUMBER */:
              return parseFloat(value);
            case 17 /* TRUE */:
              return true;
            case 18 /* FALSE */:
              return false;
            default:
              throw new CustomError("#ERROR!");
          }
        }
        visitDefineNameExpression(expr) {
          if (!this.variableMap.has(expr.value.value)) {
            throw new CustomError("#NAME?");
          }
          const result = this.variableMap.get(expr.value.value);
          return result;
        }
        visitUnaryExpression(data) {
          const value = this.evaluate(data.right);
          switch (data.operator.type) {
            case 3 /* MINUS */:
              return -value;
            case 2 /* PLUS */:
              return value;
            default:
              throw new CustomError("#VALUE!");
          }
        }
        visitCellRangeExpression(expr) {
          switch (expr.operator.type) {
            case 20 /* COLON */: {
              const result = parseReference(
                `${expr.left.value.value}:${expr.right.value.value}`
              );
              if (result === null) {
                throw new CustomError("#REF!");
              }
              return result;
            }
            default:
              throw new CustomError("#REF!");
          }
        }
        visitGroupExpression(expr) {
          return this.evaluate(expr.value);
        }
        evaluate(expr) {
          return expr.accept(this);
        }
      };
    }
  });

  // src/parser/eval.ts
  function parseFormula(source, cellData = new CellDataMapImpl(), variableMap = new VariableMapImpl()) {
    const func = new FunctionMapImpl();
    const list = Object.keys(formula_default);
    for (const key of list) {
      func.set(key, (...args) => {
        const item = formula_default[key];
        if (item === null) {
          throw new CustomError("#NAME?");
        }
        const { func: func2, options } = item;
        const { paramsType, minParamsCount, maxParamsCount, resultType } = options;
        if (paramsType === "number") {
          if (!args.every(isNumber)) {
            throw new CustomError("#VALUE!");
          }
        } else if (paramsType === "string") {
          if (!args.every(isString)) {
            throw new CustomError("#VALUE!");
          }
        }
        if (args.length > maxParamsCount || args.length < minParamsCount) {
          throw new CustomError("#VALUE!");
        }
        const result = func2(...args);
        if (resultType === "number") {
          if (!isNumber(result)) {
            throw new CustomError("#NUM!");
          }
        } else if (resultType === "string") {
          if (!isString(result)) {
            throw new CustomError("#NUM!");
          }
        }
        return result;
      });
    }
    return interpret(source, func, cellData, variableMap);
  }
  function interpret(source, func, cellData, variableMap) {
    try {
      const list = new Scanner(source).scan();
      const expressions = new Parser(list).parse();
      const result = new Interpreter(
        expressions,
        func,
        cellData,
        variableMap
      ).interpret();
      return {
        result: result[0],
        error: null
      };
    } catch (error) {
      if (error instanceof CustomError) {
        return {
          result: null,
          error: error.value
        };
      }
    }
    return {
      result: null,
      error: "#ERROR!"
    };
  }
  var FunctionMapImpl, CellDataMapImpl, VariableMapImpl;
  var init_eval = __esm({
    "src/parser/eval.ts"() {
      "use strict";
      init_scanner();
      init_parser2();
      init_formula2();
      init_interpreter();
      init_error2();
      init_util2();
      FunctionMapImpl = class {
        map = /* @__PURE__ */ new Map();
        set(name, value) {
          this.map.set(name.toLowerCase(), value);
        }
        get(name) {
          return this.map.get(name.toLowerCase());
        }
      };
      CellDataMapImpl = class {
        map = /* @__PURE__ */ new Map();
        getKey(row, col, sheetId = "") {
          const key = `${row}_${col}_${sheetId}`;
          return key;
        }
        set(row, col, sheetId, value) {
          const key = this.getKey(row, col, sheetId);
          this.map.set(key, value);
        }
        get(row, col, sheetId = "") {
          const key = this.getKey(row, col, sheetId);
          return this.map.get(key);
        }
      };
      VariableMapImpl = class {
        map = /* @__PURE__ */ new Map();
        set(name, value) {
          this.map.set(name, value);
        }
        get(name) {
          return this.map.get(name);
        }
        has(name) {
          return this.map.has(name);
        }
      };
    }
  });

  // src/parser/index.ts
  var init_parser3 = __esm({
    "src/parser/index.ts"() {
      "use strict";
      init_eval();
    }
  });

  // src/model/Model.ts
  var Model;
  var init_Model = __esm({
    "src/model/Model.ts"() {
      "use strict";
      init_lodash();
      init_util2();
      init_parser3();
      Model = class {
        currentSheetId = "";
        workbook = [];
        worksheets = {};
        styles = {};
        mergeCells = [];
        controller;
        constructor(controller2) {
          this.controller = controller2;
        }
        setActiveCell(row, col) {
          const index = this.workbook.findIndex(
            (v2) => v2.sheetId === this.currentSheetId
          );
          if (index >= 0) {
            const tempList = Array.from(this.workbook);
            const activeCell = `${intToColumnName(col)}${row + 1}`;
            tempList.splice(index, 1, { ...this.workbook[index], activeCell });
            this.workbook = tempList;
          }
          this.modelChange();
        }
        addSheet() {
          const item = getDefaultSheetInfo(this.workbook);
          this.workbook = [
            ...this.workbook,
            { ...item, colCount: DEFAULT_COL_COUNT, rowCount: DEFAULT_ROW_COUNT }
          ];
          this.currentSheetId = item.sheetId;
          this.modelChange();
        }
        getSheetInfo(id = this.currentSheetId) {
          const item = this.workbook.find((item2) => item2.sheetId === id);
          assert(item !== void 0);
          return item;
        }
        modelChange(isRecovering = false) {
          modelLog("modelChange", isRecovering);
          if (!isRecovering) {
            this.controller.history.onChange(this.toJSON());
          }
        }
        getCellsContent() {
          const sheetData = this.worksheets[this.currentSheetId];
          if (isEmpty(sheetData)) {
            return [];
          }
          const result = [];
          const rowKeys = Object.keys(sheetData);
          for (const rowKey of rowKeys) {
            const colKeys = Object.keys(sheetData[rowKey]);
            for (const colKey of colKeys) {
              const row = Number(rowKey);
              const col = Number(colKey);
              result.push({
                row,
                col
              });
            }
          }
          return result;
        }
        fromJSON(json) {
          modelLog("fromJSON", json);
          const {
            worksheets = {},
            workbook = [],
            styles = {},
            mergeCells = []
          } = json;
          this.worksheets = worksheets;
          this.workbook = workbook;
          this.styles = styles;
          this.currentSheetId = workbook[0].sheetId || this.currentSheetId;
          this.mergeCells = mergeCells;
          this.modelChange(true);
        }
        toJSON() {
          const { worksheets, styles, workbook, mergeCells } = this;
          return {
            workbook,
            styles,
            worksheets,
            mergeCells
          };
        }
        computeFormula = (formula) => {
          const result = parseFormula(formula, {
            get: (row, col, sheetId) => {
              const temp = this.queryCell(row, col, sheetId);
              return temp.value;
            },
            set: () => {
            }
          });
          return result.error ? result.error : result.result;
        };
        setCellValue(value, range) {
          const { row, col } = range;
          const configPath = `worksheets[${range.sheetId || this.currentSheetId}][${row}][${col}]`;
          setWith(this, `${configPath}.value`, value);
        }
        setCellFormula(formula, range) {
          const { row, col } = range;
          const configPath = `worksheets[${range.sheetId || this.currentSheetId}][${row}][${col}]`;
          setWith(this, `${configPath}.formula`, formula);
        }
        setCellValues(value, ranges) {
          const [range] = ranges;
          if (value.startsWith("=")) {
            const formula = value.slice(1);
            this.setCellFormula(formula, range);
          } else {
            this.setCellFormula("", range);
            this.setCellValue(value, range);
          }
          this.modelChange();
        }
        setCellStyle(style, ranges) {
          const [range] = ranges;
          const { row, col, rowCount, colCount } = range;
          for (let r2 = row, endRow = row + rowCount; r2 < endRow; r2++) {
            for (let c2 = col, endCol = col + colCount; c2 < endCol; c2++) {
              const stylePath = `worksheets[${this.currentSheetId}][${r2}][${c2}].style`;
              const oldStyleId = get(this, stylePath, "");
              if (oldStyleId) {
                const oldStyle = this.styles[oldStyleId];
                if (isEmpty(oldStyle)) {
                  this.styles[oldStyleId] = { ...style };
                } else {
                  this.styles[oldStyleId] = {
                    ...oldStyle,
                    ...style
                  };
                }
              } else {
                const styleNum = getListMaxNum(
                  Object.keys(this.styles),
                  STYLE_ID_PREFIX
                );
                const styleId = `${STYLE_ID_PREFIX}${styleNum + 1}`;
                this.styles[styleId] = { ...style };
                setWith(this, stylePath, styleId);
              }
            }
          }
          this.modelChange();
        }
        queryCell = (row, col, sheetId = "") => {
          const realSheetId = sheetId || this.currentSheetId;
          const cellData = get(
            this,
            `worksheets[${realSheetId}][${row}][${col}]`,
            {}
          );
          const { style } = cellData;
          let temp = void 0;
          if (style && this.styles[style]) {
            temp = this.styles[style];
          }
          return { ...cellData, style: temp };
        };
      };
    }
  });

  // src/model/mockModel.ts
  var MOCK_MODEL;
  var init_mockModel = __esm({
    "src/model/mockModel.ts"() {
      "use strict";
      init_util2();
      MOCK_MODEL = {
        workbook: [
          {
            sheetId: "Sheet1",
            name: "Sheet1",
            activeCell: "B2",
            colCount: DEFAULT_COL_COUNT,
            rowCount: DEFAULT_ROW_COUNT
          },
          {
            sheetId: "2",
            name: "test",
            colCount: DEFAULT_COL_COUNT,
            rowCount: DEFAULT_ROW_COUNT,
            activeCell: "F5"
          }
        ],
        worksheets: {
          Sheet1: {
            "0": {
              "0": {
                value: "",
                formula: "SUM(1, sum(1,2))",
                style: "1"
              },
              "1": {
                value: "",
                formula: "SUM(1,4)"
              },
              "2": {
                value: "",
                formula: "SUM(A1)",
                style: "2"
              },
              "3": {
                value: "\u8D85\u5927\u5B57",
                style: "3"
              }
            },
            "3": {
              0: {
                style: "style1"
              },
              1: {
                style: "style1"
              },
              2: {
                style: "style1"
              },
              3: {
                style: "style1"
              }
            },
            "4": {
              0: {
                style: "style1"
              },
              1: {
                style: "style1"
              },
              2: {
                style: "style1"
              },
              3: {
                style: "style1"
              }
            }
          }
        },
        styles: {
          "1": {
            fontColor: "#ff0000"
          },
          "2": {},
          style1: {
            fillColor: "red"
          },
          "3": {}
        },
        mergeCells: ["D2:E3"]
      };
    }
  });

  // src/model/index.tsx
  var init_model2 = __esm({
    "src/model/index.tsx"() {
      "use strict";
      init_Model();
      init_mockModel();
    }
  });

  // src/controller/Scroll.ts
  var Scroll;
  var init_Scroll = __esm({
    "src/controller/Scroll.ts"() {
      "use strict";
      Scroll = class {
        x = 0;
        y = 0;
        rowIndex = 0;
        colIndex = 0;
        controller;
        constructor(controller2) {
          this.controller = controller2;
        }
      };
    }
  });

  // src/controller/History.ts
  var History;
  var init_History = __esm({
    "src/controller/History.ts"() {
      "use strict";
      init_util2();
      History = class {
        undoList = [];
        redoList = [];
        constructor() {
          this.reset();
        }
        reset() {
          this.undoList = [];
          this.redoList = [];
        }
        onChange(sheetData) {
          this.addUndoData(sheetData);
          this.redoList = [];
        }
        addUndoData(sheetData) {
          this.undoList.push(JSON.stringify(sheetData));
          historyLog("addUndoData", this.undoList);
        }
        addRedoData(sheetData) {
          this.redoList.push(JSON.stringify(sheetData));
          historyLog("addRedoData", this.redoList);
        }
        getUndoData() {
          const temp = this.undoList.pop();
          return temp ? JSON.parse(temp) : temp;
        }
        getRedoData() {
          const temp = this.redoList.pop();
          return temp ? JSON.parse(temp) : temp;
        }
        canRedo() {
          return this.redoList.length > 0;
        }
        canUndo() {
          return this.undoList.length > 0;
        }
        redo(sheetData) {
          return new Promise((resolve, reject) => {
            historyLog("redo");
            if (this.canRedo()) {
              this.addUndoData(sheetData);
              resolve(this.getRedoData());
              historyLog("redo success");
            }
            reject();
          });
        }
        undo(sheetData) {
          return new Promise((resolve, reject) => {
            historyLog("undo");
            if (this.canUndo()) {
              this.addRedoData(sheetData);
              const temp = this.getUndoData();
              resolve(temp);
              historyLog("undo success", temp);
            }
            reject();
          });
        }
      };
    }
  });

  // src/controller/Controller.ts
  var Controller;
  var init_Controller = __esm({
    "src/controller/Controller.ts"() {
      "use strict";
      init_lodash();
      init_model2();
      init_Scroll();
      init_util2();
      init_History();
      Controller = class extends EventEmitter {
        scroll = new Scroll(this);
        model = new Model(this);
        ranges = [];
        isCellEditing = false;
        changeSet = /* @__PURE__ */ new Set();
        renderController = null;
        history = new History();
        hooks = {};
        constructor() {
          super();
          this.ranges = [
            new Range(
              DEFAULT_ACTIVE_CELL.row,
              DEFAULT_ACTIVE_CELL.col,
              1,
              1,
              this.model.currentSheetId
            )
          ];
          this.addSheet();
        }
        setHooks(hooks) {
          this.hooks = hooks;
        }
        setRenderController(renderController) {
          this.renderController = renderController;
        }
        emitChange() {
          controllerLog("emitChange", this.changeSet);
          this.emit("change", { changeSet: this.changeSet });
          this.changeSet = /* @__PURE__ */ new Set();
        }
        queryActiveCell() {
          const { activeCell } = this.model.getSheetInfo();
          if (!activeCell) {
            return { ...DEFAULT_ACTIVE_CELL };
          }
          const result = parseReference(activeCell);
          assert(!!result);
          const { row, col } = result;
          return { row, col };
        }
        setActiveCell(row = -1, col = -1, colCount = 1, rowCount = 1) {
          this.changeSet.add("selectionChange");
          let position = { ...DEFAULT_ACTIVE_CELL };
          if (row === col && row === -1) {
            position = this.queryActiveCell();
          } else {
            position = { row, col };
          }
          this.model.setActiveCell(position.row, position.col);
          this.ranges = [
            new Range(
              position.row,
              position.col,
              colCount,
              rowCount,
              this.model.currentSheetId
            )
          ];
          this.emitChange();
        }
        setCurrentSheetId(id) {
          if (id === this.model.currentSheetId) {
            return;
          }
          this.model.currentSheetId = id;
          this.setActiveCell();
          this.changeSet.add("contentChange");
          this.emitChange();
        }
        addSheet() {
          this.model.addSheet();
          this.setActiveCell(0, 0);
          this.changeSet.add("contentChange");
          this.emitChange();
        }
        selectAll(row, col) {
          this.setActiveCell(row, col, 0, 0);
          controllerLog("selectAll");
        }
        selectCol(row, col) {
          const sheetInfo = this.model.getSheetInfo();
          this.setActiveCell(row, col, sheetInfo.rowCount, 0);
          controllerLog("selectCol");
        }
        selectRow(row, col) {
          const sheetInfo = this.model.getSheetInfo();
          this.setActiveCell(row, col, 0, sheetInfo.colCount);
          controllerLog("selectRow");
        }
        setCellEditing(value) {
          this.isCellEditing = value;
        }
        getCellEditing() {
          return this.isCellEditing;
        }
        quitEditing() {
          controllerLog("quitEditing");
          if (this.hooks) {
            this.hooks.blur();
          }
          this.setCellEditing(false);
        }
        enterEditing() {
          controllerLog("enterEditing");
          if (this.hooks) {
            this.hooks.focus();
            this.setCellEditing(true);
            this.emitChange();
          }
        }
        loadJSON(json) {
          const { model } = this;
          controllerLog("loadJSON", json);
          model.fromJSON(json);
          this.setActiveCell();
          this.changeSet.add("contentChange");
          this.emitChange();
        }
        toJSON() {
          return this.model.toJSON();
        }
        updateSelection(row, col) {
          const { model } = this;
          const activeCell = this.queryActiveCell();
          if (activeCell.row === row && activeCell.col === col) {
            return;
          }
          const colCount = Math.abs(col - activeCell.col) + 1;
          const rowCount = Math.abs(row - activeCell.row) + 1;
          const temp = new Range(
            Math.min(activeCell.row, row),
            Math.min(activeCell.col, col),
            rowCount,
            colCount,
            model.currentSheetId
          );
          this.ranges = [temp];
          controllerLog("updateSelection", temp);
          this.changeSet.add("selectionChange");
          this.emitChange();
        }
        windowResize() {
          this.changeSet.add("contentChange");
          this.emitChange();
        }
        setCellValue(data, value) {
          controllerLog("setCellValue", value);
          const temp = [
            new Range(data.row, data.col, 1, 1, this.model.currentSheetId)
          ];
          this.model.setCellValues(value, temp);
          this.changeSet.add("contentChange");
          this.emitChange();
        }
        setCellStyle(style, ranges = this.ranges) {
          if (isEmpty(style)) {
            return;
          }
          this.model.setCellStyle(style, ranges);
          this.changeSet.add("contentChange");
          this.emitChange();
        }
        queryCell = (data) => {
          const { row, col } = data;
          const { model } = this;
          const { value, formula, style } = model.queryCell(row, col);
          let realValue = value;
          if (formula) {
            realValue = model.computeFormula(formula);
            if (realValue !== value) {
              model.setCellValue(
                realValue,
                new Range(row, col, 1, 1, model.currentSheetId)
              );
            }
          }
          return {
            value: realValue,
            row,
            col,
            formula,
            style
          };
        };
        canRedo() {
          return this.history.canRedo();
        }
        canUndo() {
          return this.history.canUndo();
        }
        undo = async () => {
          const result = await this.history.undo(this.model.toJSON());
          if (result) {
            this.model.fromJSON(result);
            this.emitChange();
          }
        };
        redo = async () => {
          const result = await this.history.redo(this.model.toJSON());
          if (result) {
            this.model.fromJSON(result);
            this.emitChange();
          }
        };
      };
    }
  });

  // src/controller/index.ts
  var init_controller2 = __esm({
    "src/controller/index.ts"() {
      "use strict";
      init_Controller();
    }
  });

  // src/store/store.tsx
  function useCustomReducer(reducer2, initialState2) {
    const cachedReducer = (0, import_react8.useMemo)(() => immer_esm_default(reducer2), [reducer2]);
    return (0, import_react8.useReducer)(cachedReducer, initialState2);
  }
  function useSelector(pickStr) {
    const cache2 = (0, import_react8.useContext)(storeContext);
    return pick(cache2, pickStr);
  }
  var import_react8, controller, constantContext, storeContext, StoreProvider, useDispatch, useController;
  var init_store2 = __esm({
    "src/store/store.tsx"() {
      "use strict";
      import_react8 = __toESM(require_react());
      init_lodash();
      init_immer_esm();
      init_reducer();
      init_controller2();
      controller = new Controller();
      constantContext = import_react8.default.createContext({
        controller,
        dispatch: (action) => action
      });
      storeContext = import_react8.default.createContext(initialState);
      StoreProvider = (0, import_react8.memo)((props) => {
        const { children } = props;
        const [state, dispatch] = useCustomReducer(reducer, initialState);
        const constantState = (0, import_react8.useMemo)(() => {
          return { dispatch, controller };
        }, [dispatch]);
        return /* @__PURE__ */ import_react8.default.createElement(constantContext.Provider, {
          value: constantState
        }, /* @__PURE__ */ import_react8.default.createElement(storeContext.Provider, {
          value: state
        }, children));
      });
      StoreProvider.displayName = "StoreProvider";
      useDispatch = () => {
        const temp = (0, import_react8.useContext)(constantContext);
        return temp.dispatch;
      };
      useController = () => {
        const temp = (0, import_react8.useContext)(constantContext);
        return temp.controller;
      };
    }
  });

  // src/store/index.tsx
  var init_store3 = __esm({
    "src/store/index.tsx"() {
      "use strict";
      init_store2();
    }
  });

  // src/theme/size.ts
  var size, size_default;
  var init_size = __esm({
    "src/theme/size.ts"() {
      "use strict";
      init_util2();
      size = {
        smallFont: "10px",
        font: "12px",
        largeFont: "14px",
        padding: "12px",
        fontFamily: `${DEFAULT_FONT_FAMILY},${MUST_FONT_FAMILY}`,
        lineHeight: "1.5",
        mediumPadding: "8px",
        borderRadius: "4px",
        tinyPadding: "4px"
      };
      size_default = size;
    }
  });

  // src/theme/color.ts
  var color, color_default;
  var init_color = __esm({
    "src/theme/color.ts"() {
      "use strict";
      init_util2();
      color = {
        primaryColor: "#217346",
        buttonActiveColor: "rgb(198,198,198)",
        selectionColor: "rgba(198,198,198,0.6)",
        backgroundColor: "#e6e6e6",
        white: "#ffffff",
        black: "#000000",
        gridStrokeColor: "#d4d4d4",
        triangleFillColor: "#b4b4b4",
        contentColor: DEFAULT_FONT_COLOR,
        borderColor: "#cccccc",
        activeBorderColor: "#808080",
        disabledColor: "#ccc"
      };
      color_default = color;
    }
  });

  // src/theme/index.ts
  var theme, theme_default;
  var init_theme = __esm({
    "src/theme/index.ts"() {
      "use strict";
      init_size();
      init_color();
      theme = {
        ...size_default,
        ...color_default
      };
      theme_default = theme;
    }
  });

  // src/hooks/useTheme.ts
  function useTheme() {
    (0, import_react9.useEffect)(() => {
      for (const key of Object.keys(theme_default)) {
        document.documentElement.style.setProperty(
          `--${key}`,
          String(theme_default[key] || "")
        );
      }
    }, []);
  }
  var import_react9;
  var init_useTheme = __esm({
    "src/hooks/useTheme.ts"() {
      "use strict";
      import_react9 = __toESM(require_react());
      init_theme();
    }
  });

  // src/hooks/useFontFamily.ts
  function useFontFamily() {
    const [fontFamilyList, setFontFamilyList] = (0, import_react10.useState)([]);
    (0, import_react10.useEffect)(() => {
      const list = FONT_FAMILY_LIST.map((v2) => {
        const disabled = !isSupportFontFamily(v2);
        return { label: v2, value: v2, disabled };
      });
      setFontFamilyList(list);
    }, []);
    return [fontFamilyList, setFontFamilyList];
  }
  var import_react10;
  var init_useFontFamily = __esm({
    "src/hooks/useFontFamily.ts"() {
      "use strict";
      import_react10 = __toESM(require_react());
      init_util2();
    }
  });

  // src/hooks/index.ts
  var init_hooks = __esm({
    "src/hooks/index.ts"() {
      "use strict";
      init_useTheme();
      init_useFontFamily();
    }
  });

  // src/containers/canvas/CellEditor/index.tsx
  function getEditorStyle(style) {
    if (isEmpty(style)) {
      return {};
    }
    const font = makeFont(
      style?.isItalic ? "italic" : "normal",
      style?.isBold ? "bold" : "500",
      style?.fontSize || DEFAULT_FONT_SIZE,
      style?.fontFamily
    );
    return {
      backgroundColor: style?.fillColor || "#fff",
      color: style?.fontColor || DEFAULT_FONT_COLOR,
      font
    };
  }
  var import_react11, CellEditorContainer;
  var init_CellEditor = __esm({
    "src/containers/canvas/CellEditor/index.tsx"() {
      "use strict";
      import_react11 = __toESM(require_react());
      init_lodash();
      init_store3();
      init_util2();
      CellEditorContainer = (0, import_react11.memo)(
        (0, import_react11.forwardRef)((_2, ref) => {
          const dispatch = useDispatch();
          const controller2 = useController();
          const inputRef = (0, import_react11.useRef)(null);
          const { activeCell, editCellValue, isCellEditing } = useSelector([
            "activeCell",
            "editCellValue",
            "isCellEditing"
          ]);
          const style = (0, import_react11.useMemo)(() => {
            const otherStyle = getEditorStyle(activeCell.style);
            const temp = pick(activeCell, [
              "top",
              "left",
              "width",
              "height"
            ]);
            return {
              ...temp,
              ...otherStyle,
              display: isCellEditing ? "inline-block" : "none"
            };
          }, [activeCell, isCellEditing]);
          const initValue = (0, import_react11.useMemo)(() => {
            const temp = String(activeCell.value || "");
            return temp;
          }, [activeCell]);
          (0, import_react11.useImperativeHandle)(
            ref,
            () => ({
              focus: () => {
                inputRef.current?.focus();
              }
            }),
            []
          );
          (0, import_react11.useEffect)(() => {
            const handleKeyDown = () => {
              if (isCellEditing) {
                return;
              }
              dispatch({
                type: "BATCH",
                payload: { isCellEditing: true, editCellValue: initValue }
              });
              inputRef.current?.focus();
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => {
              window.removeEventListener("keydown", handleKeyDown);
            };
          }, [initValue, dispatch, isCellEditing]);
          const onChange = (0, import_react11.useCallback)(
            (event) => {
              const { value } = event.currentTarget;
              dispatch({ type: "CHANGE_Edit_CELL_VALUE", payload: value });
            },
            [dispatch]
          );
          const setCellValue = (0, import_react11.useCallback)(() => {
            controller2.setCellValue(controller2.queryActiveCell(), editCellValue);
            controller2.setCellEditing(false);
            dispatch({
              type: "BATCH",
              payload: { isCellEditing: false, editCellValue: "" }
            });
            inputRef.current?.blur();
          }, [controller2, editCellValue, dispatch]);
          const onInputEnter = (0, import_react11.useCallback)(() => {
            inputRef.current?.blur();
            controller2.setActiveCell(activeCell.row + 1, activeCell.col);
          }, [activeCell, controller2]);
          const onInputTab = (0, import_react11.useCallback)(() => {
            inputRef.current?.blur();
            controller2.setActiveCell(activeCell.row, activeCell.col + 1);
          }, [activeCell, controller2]);
          const onBlur = (0, import_react11.useCallback)(() => {
            containersLog("onBlur");
            setCellValue();
          }, [setCellValue]);
          const onKeyDown = (0, import_react11.useCallback)(
            (event) => {
              const { key } = event;
              if (key === "Enter") {
                onInputEnter();
              } else if (key === "Tab") {
                onInputTab();
              }
            },
            [onInputEnter, onInputTab]
          );
          return /* @__PURE__ */ import_react11.default.createElement("input", {
            className: "base-editor cell-editor",
            value: isCellEditing ? editCellValue : initValue,
            style,
            ref: inputRef,
            id: "cell-editor",
            onChange,
            onKeyDown,
            onBlur
          });
        })
      );
      CellEditorContainer.displayName = "CellEditorContainer";
    }
  });

  // src/canvas/Base.ts
  var Base;
  var init_Base = __esm({
    "src/canvas/Base.ts"() {
      "use strict";
      init_util2();
      Base = class {
        canvas;
        ctx;
        controller;
        constructor({ controller: controller2, name = "Base" }) {
          this.controller = controller2;
          this.canvas = document.createElement("canvas");
          this.canvas.id = name;
          this.canvas.style.display = "none";
          document.body.appendChild(this.canvas);
          const ctx = this.canvas.getContext("2d");
          assert(!!ctx);
          this.ctx = ctx;
          const size2 = dpr();
          this.ctx.scale(size2, size2);
        }
      };
    }
  });

  // src/canvas/util.ts
  function measureText(ctx, char) {
    const mapKey = `${char}__${ctx.font}`;
    let temp = measureTextMap.get(mapKey);
    if (!temp) {
      const metrics = ctx.measureText(char);
      measureTextMap.set(mapKey, metrics);
      temp = metrics;
    }
    return temp;
  }
  function fillRect(ctx, x2, y2, width, height) {
    ctx.fillRect(npx(x2) - 0.5, npx(y2) - 0.5, npx(width), npx(height));
  }
  function strokeRect(ctx, x2, y2, width, height) {
    ctx.strokeRect(npx(x2) - 0.5, npx(y2) - 0.5, npx(width), npx(height));
  }
  function getFontSizeHeight(ctx, char) {
    const { actualBoundingBoxDescent, actualBoundingBoxAscent } = measureText(
      ctx,
      char
    );
    const result = actualBoundingBoxDescent + actualBoundingBoxAscent;
    return Math.ceil(result);
  }
  function fillText(ctx, text, x2, y2) {
    ctx.fillText(text, npx(x2), npx(y2));
  }
  function fillWrapText(ctx, text, x2, y2, cellWidth, lineHeight) {
    let line = "";
    const textList = text.split("");
    let testWidth = 0;
    const realCellWidth = cellWidth * 2;
    let wrapHeight = lineHeight;
    for (let i2 = 0; i2 < textList.length; i2++) {
      const char = textList[i2];
      const { width } = measureText(ctx, char);
      if (testWidth + width > realCellWidth) {
        fillText(ctx, line, x2, y2);
        line = char;
        y2 += lineHeight;
        testWidth = width;
        wrapHeight += lineHeight;
      } else {
        testWidth += width;
        line = line + char;
      }
    }
    return wrapHeight;
  }
  function fillTexts(ctx, text, x2, y2, cellWidth) {
    let line = "";
    const textList = text.split("");
    let testWidth = 0;
    const realCellWidth = cellWidth * 2;
    let textWidth = 0;
    for (let i2 = 0; i2 < textList.length; i2++) {
      const char = textList[i2];
      const { width } = measureText(ctx, char);
      if (testWidth + width > realCellWidth) {
        if (i2 === 0) {
          textWidth = width;
          line = char;
        }
        break;
      } else {
        testWidth += width;
        line = line + char;
      }
    }
    fillText(ctx, line, x2, y2);
    return textWidth;
  }
  function renderCell(canvas, cellInfo) {
    const ctx = canvas.getContext("2d");
    assert(!!ctx);
    const { style, value, left, top, width, height } = cellInfo;
    const isNum2 = isNumber(value);
    let font = DEFAULT_FONT_CONFIG;
    let fillStyle = DEFAULT_FONT_COLOR;
    if (!isEmpty(style)) {
      const fontSize = npx(style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE);
      font = makeFont(
        style?.isItalic ? "italic" : "normal",
        style?.isBold ? "bold" : "500",
        fontSize,
        style?.fontFamily
      );
      fillStyle = style?.fontColor || DEFAULT_FONT_COLOR;
      if (style?.fillColor) {
        ctx.fillStyle = style?.fillColor;
        fillRect(ctx, left, top, width, height);
      }
    }
    let text = String(value);
    if (parseError(value)) {
      fillStyle = ERROR_FORMULA_COLOR;
    } else if (typeof value === "boolean" || ["TRUE", "FALSE"].includes(text.toUpperCase())) {
      text = text.toUpperCase();
    } else if (isNil(value)) {
      text = "";
    }
    ctx.textAlign = isNum2 ? "right" : "left";
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.textBaseline = "middle";
    const x2 = left + (isNum2 ? width : 0);
    const result = {};
    const fontSizeHeight = getFontSizeHeight(ctx, text[0]);
    const textHeight = Math.max(
      fontSizeHeight,
      getStyle("lineHeight", canvas),
      getStyle("lineHeight")
    );
    if (style?.wrapText === 1 /* AUTO_WRAP */) {
      const y2 = top;
      result.wrapHeight = fillWrapText(ctx, text, x2, y2, width, textHeight);
    } else {
      const y2 = Math.floor(top + height / 2);
      result.textWidth = fillTexts(ctx, text, x2, y2, width);
    }
    return {
      ...result,
      fontSizeHeight: textHeight
    };
  }
  function drawLines(ctx, pointList) {
    assert(pointList.length > 0);
    ctx.beginPath();
    for (let i2 = 0; i2 < pointList.length; i2 += 2) {
      const first = pointList[i2];
      const second = pointList[i2 + 1];
      ctx.moveTo(npxLine(first[0]), npxLine(first[1]));
      ctx.lineTo(npxLine(second[0]), npxLine(second[1]));
    }
    ctx.stroke();
  }
  function resizeCanvas(canvas, width, height) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = npx(width);
    canvas.height = npx(height);
  }
  var getStyle, measureTextMap;
  var init_util3 = __esm({
    "src/canvas/util.ts"() {
      "use strict";
      init_util2();
      init_lodash();
      init_types();
      getStyle = (key, dom = document.body) => {
        return parseInt(window.getComputedStyle(dom)[key]);
      };
      measureTextMap = /* @__PURE__ */ new Map();
    }
  });

  // src/canvas/constant.ts
  var HEADER_STYLE;
  var init_constant2 = __esm({
    "src/canvas/constant.ts"() {
      "use strict";
      init_util2();
      init_theme();
      HEADER_STYLE = {
        textAlign: "center",
        textBaseline: "middle",
        font: DEFAULT_FONT_CONFIG,
        fillStyle: theme_default.black,
        lineWidth: thinLineWidth(),
        strokeStyle: theme_default.gridStrokeColor
      };
    }
  });

  // src/canvas/Content.ts
  var Content;
  var init_Content = __esm({
    "src/canvas/Content.ts"() {
      "use strict";
      init_lodash();
      init_util2();
      init_Base();
      init_theme();
      init_util3();
      init_constant2();
      Content = class extends Base {
        render(width, height) {
          resizeCanvas(this.canvas, width, height);
          this.renderGrid();
          this.renderRowsHeader();
          this.renderColsHeader();
          this.renderTriangle();
          this.renderContent();
        }
        renderContent() {
          const { controller: controller2 } = this;
          const { model, renderController } = controller2;
          const data = model.getCellsContent();
          if (isEmpty(data) || !renderController) {
            return;
          }
          this.ctx.save();
          for (const item of data) {
            const { row, col } = item;
            const result = renderController.queryCell(row, col);
            const cellInfo = this.controller.queryCell(item);
            const {
              wrapHeight = 0,
              fontSizeHeight = 0,
              textWidth = 0
            } = renderCell(this.canvas, {
              ...cellInfo,
              ...result
            });
            const height = Math.max(wrapHeight, fontSizeHeight);
            if (height > result.height) {
              console.log("height", height);
              renderController.setRowHeight(row, height);
            }
            if (textWidth > result.width) {
              console.log("col", textWidth);
              renderController.setRowHeight(col, textWidth);
            }
          }
          this.ctx.restore();
        }
        renderTriangle() {
          const { renderController } = this.controller;
          if (!renderController) {
            return;
          }
          const config = renderController.getHeaderSize();
          const offset = 2;
          const path = new Path2D();
          path.moveTo(npx(config.width / 2 - offset), npx(config.height - offset));
          path.lineTo(npx(config.width - offset), npx(config.height - offset));
          path.lineTo(npx(config.width - offset), npx(offset));
          this.ctx.save();
          this.ctx.fillStyle = theme_default.backgroundColor;
          fillRect(this.ctx, 0, 0, config.width, config.height);
          this.ctx.fillStyle = theme_default.triangleFillColor;
          this.ctx.fill(path);
          this.ctx.restore();
        }
        renderGrid() {
          const { scroll, model, renderController } = this.controller;
          if (!renderController) {
            return;
          }
          const { rowIndex, colIndex } = scroll;
          const { rowCount, colCount } = model.getSheetInfo();
          const config = renderController.getHeaderSize();
          const { width, height } = renderController.getDrawSize();
          const lineWidth = thinLineWidth();
          this.ctx.save();
          this.ctx.fillStyle = theme_default.white;
          this.ctx.lineWidth = lineWidth;
          this.ctx.strokeStyle = theme_default.gridStrokeColor;
          this.ctx.translate(npx(config.width), npx(config.height));
          const pointList = [];
          let y2 = 0;
          let x2 = 0;
          for (let i2 = rowIndex; i2 <= rowCount; i2++) {
            pointList.push([0, y2], [width, y2]);
            y2 += renderController.getRowHeight(i2);
            if (y2 > height) {
              break;
            }
          }
          for (let i2 = colIndex; i2 <= colCount; i2++) {
            pointList.push([x2, 0], [x2, y2]);
            x2 += renderController.getColWidth(i2);
            if (x2 > width) {
              break;
            }
          }
          pointList.push([0, height], [width, height], [width, 0], [width, height]);
          drawLines(this.ctx, pointList);
          this.ctx.restore();
        }
        fillRowText(row, rowWidth, y2) {
          this.ctx.fillStyle = theme_default.black;
          fillText(this.ctx, String(row), rowWidth / 2, y2);
        }
        fillColText(colText, x2, colHeight) {
          this.ctx.fillStyle = theme_default.black;
          fillText(this.ctx, colText, x2, colHeight / 2 + dpr());
        }
        renderRowsHeader() {
          const { scroll, model, renderController } = this.controller;
          if (!renderController) {
            return;
          }
          const { rowIndex } = scroll;
          const { rowCount } = model.getSheetInfo();
          const config = renderController.getHeaderSize();
          const { height } = renderController.getDrawSize();
          this.ctx.save();
          this.ctx.fillStyle = theme_default.backgroundColor;
          fillRect(this.ctx, 0, config.height, config.width, height);
          Object.assign(this.ctx, HEADER_STYLE);
          const pointList = [];
          let y2 = config.height;
          let i2 = rowIndex;
          for (; i2 < rowCount; i2++) {
            const rowHeight = renderController.getRowHeight(i2);
            let temp = y2;
            if (i2 === rowIndex) {
              temp += thinLineWidth() / 2;
            }
            pointList.push([0, temp], [config.width, temp]);
            this.fillRowText(i2 + 1, config.width, temp + rowHeight / 2);
            y2 += rowHeight;
            if (y2 > height) {
              break;
            }
          }
          this.fillRowText(
            i2 + 1,
            config.width,
            y2 + renderController.getRowHeight(i2) / 2
          );
          pointList.push([0, y2], [config.width, y2], [0, 0], [0, y2]);
          drawLines(this.ctx, pointList);
          this.ctx.restore();
        }
        renderColsHeader() {
          const { scroll, model, renderController } = this.controller;
          if (!renderController) {
            return;
          }
          const { colIndex } = scroll;
          const { colCount } = model.getSheetInfo();
          const config = renderController.getHeaderSize();
          const { width } = renderController.getDrawSize();
          const pointList = [];
          this.ctx.save();
          this.ctx.fillStyle = theme_default.backgroundColor;
          fillRect(this.ctx, config.width, 0, width, config.height);
          Object.assign(this.ctx, HEADER_STYLE);
          let x2 = config.width;
          let i2 = colIndex;
          for (; i2 < colCount; i2++) {
            const colWidth = renderController.getColWidth(i2);
            let temp = x2;
            if (i2 === colIndex) {
              temp += thinLineWidth() / 2;
            }
            pointList.push([temp, 0], [temp, config.height]);
            this.fillColText(intToColumnName(i2), temp + colWidth / 2, config.height);
            x2 += colWidth;
            if (x2 > width) {
              break;
            }
          }
          this.fillColText(
            intToColumnName(i2),
            x2 + renderController.getColWidth(i2) / 2,
            config.height
          );
          pointList.push([x2, 0], [x2, config.height], [0, 0], [x2, 0]);
          drawLines(this.ctx, pointList);
          this.ctx.restore();
        }
      };
    }
  });

  // src/canvas/Selection.ts
  var Selection;
  var init_Selection = __esm({
    "src/canvas/Selection.ts"() {
      "use strict";
      init_util2();
      init_theme();
      init_Base();
      init_util3();
      Selection = class extends Base {
        renderFillRect(fillStyle, data) {
          this.ctx.fillStyle = fillStyle;
          this.ctx.lineWidth = dpr();
          const temp = npxLine(0.5);
          fillRect(
            this.ctx,
            data.left + temp,
            data.top + temp,
            data.width - temp,
            data.height - temp
          );
        }
        renderSelectedRange() {
          const { controller: controller2 } = this;
          const { renderController } = controller2;
          if (!renderController) {
            return;
          }
          const { ranges } = controller2;
          const [range] = ranges;
          const size2 = renderController.getHeaderSize();
          this.ctx.fillStyle = theme_default.selectionColor;
          const pointList = [];
          if (isSheet(range)) {
            const canvasSize = renderController.getCanvasSize();
            fillRect(this.ctx, size2.width, 0, canvasSize.width, size2.height);
            fillRect(this.ctx, 0, size2.height, size2.width, canvasSize.height);
            return;
          }
          const top = renderController.queryCell(0, range.col);
          const left = renderController.queryCell(range.row, 0);
          let width = 0;
          let height = 0;
          for (let c2 = range.col, end = range.col + range.colCount; c2 < end; c2++) {
            width += renderController.getColWidth(c2);
          }
          for (let r2 = range.row, end = range.row + range.rowCount; r2 < end; r2++) {
            height += renderController.getRowHeight(r2);
          }
          fillRect(this.ctx, top.left, 0, width, size2.height);
          fillRect(this.ctx, 0, left.top, size2.width, height);
          this.ctx.strokeStyle = theme_default.primaryColor;
          this.ctx.lineWidth = dpr();
          pointList.push([top.left, size2.height], [top.left + width, size2.height]);
          pointList.push([size2.width, left.top], [size2.width, left.top + height]);
          drawLines(this.ctx, pointList);
        }
        render(width, height, selectAll) {
          resizeCanvas(this.canvas, width, height);
          const { controller: controller2 } = this;
          const { renderController } = controller2;
          if (!renderController) {
            return;
          }
          this.renderSelectedRange();
          if (!selectAll) {
            return;
          }
          const cellData = controller2.queryCell(controller2.queryActiveCell());
          const activeCell = renderController.queryCell(cellData.row, cellData.col);
          const activeCellFillColor = cellData.style?.fillColor || theme_default.white;
          this.renderFillRect(theme_default.selectionColor, selectAll);
          this.renderFillRect(activeCellFillColor, activeCell);
          renderCell(this.canvas, { ...cellData, ...activeCell });
        }
      };
    }
  });

  // src/canvas/Main.ts
  var Main;
  var init_Main = __esm({
    "src/canvas/Main.ts"() {
      "use strict";
      init_util2();
      init_Content();
      init_theme();
      init_Selection();
      init_util3();
      Main = class {
        canvas;
        ctx;
        controller;
        content;
        selection;
        constructor(controller2, canvas) {
          this.controller = controller2;
          this.canvas = canvas;
          const ctx = canvas.getContext("2d");
          assert(!!ctx);
          this.ctx = ctx;
          const size2 = dpr();
          this.ctx.scale(size2, size2);
          this.content = new Content({
            controller: controller2,
            name: "Content"
          });
          this.selection = new Selection({
            controller: controller2,
            name: "Selection"
          });
          const checkChange = (params) => {
            this.render(params);
            if (this.controller.renderController?.isChanged) {
              this.controller.renderController.isChanged = false;
              this.render({
                changeSet: /* @__PURE__ */ new Set(["contentChange", "selectionChange"])
              });
            }
          };
          this.controller.on("change", checkChange);
          checkChange({ changeSet: /* @__PURE__ */ new Set(["contentChange"]) });
        }
        getSelection(activeCell) {
          const { controller: controller2 } = this;
          const { ranges, renderController } = controller2;
          const [range] = ranges;
          if (range.rowCount === range.colCount && range.rowCount === 1 || !renderController) {
            return null;
          }
          const drawSize = renderController.getDrawSize();
          if (isSheet(range)) {
            return {
              ...drawSize,
              left: activeCell.left,
              top: activeCell.top
            };
          }
          if (isCol(range)) {
            const width2 = renderController.getColWidth(range.col);
            return {
              left: activeCell.left,
              top: activeCell.top,
              width: width2,
              height: drawSize.height
            };
          }
          if (isRow(range)) {
            const height2 = renderController.getRowHeight(range.row);
            return {
              left: activeCell.left,
              top: activeCell.top,
              width: drawSize.width,
              height: height2
            };
          }
          const endCellRow = range.row + range.rowCount - 1;
          const endCellCol = range.col + range.colCount - 1;
          assert(endCellRow >= 0 && endCellCol >= 0);
          const endCell = renderController.queryCell(endCellRow, endCellCol);
          const width = endCell.left + endCell.width - activeCell.left;
          const height = endCell.top + endCell.height - activeCell.top;
          assert(width >= 0 && height >= 0);
          return {
            left: activeCell.left,
            top: activeCell.top,
            width,
            height
          };
        }
        render = ({ changeSet }) => {
          const { renderController } = this.controller;
          if (!renderController) {
            return;
          }
          if (renderController.isRendering) {
            console.log("isRendering");
            return;
          }
          renderController.isChanged = false;
          renderController.isRendering = true;
          const isContentChange = changeSet.has("contentChange");
          const { width, height } = renderController.getCanvasSize();
          resizeCanvas(this.canvas, width, height);
          if (isContentChange) {
            canvasLog("render content");
            this.content.render(width, height);
          }
          const [range] = this.controller.ranges;
          const activeCell = renderController.queryCell(range.row, range.col);
          const selectAll = this.getSelection(activeCell);
          this.selection.render(width, height, selectAll);
          canvasLog("render selection");
          this.ctx.drawImage(this.content.canvas, 0, 0);
          this.ctx.drawImage(this.selection.canvas, 0, 0);
          this.ctx.strokeStyle = theme_default.primaryColor;
          this.ctx.lineWidth = dpr();
          const line = selectAll ? selectAll : activeCell;
          strokeRect(this.ctx, line.left, line.top, line.width, line.height);
          renderController.isRendering = false;
        };
      };
    }
  });

  // src/canvas/Controller.ts
  var Controller2;
  var init_Controller2 = __esm({
    "src/canvas/Controller.ts"() {
      "use strict";
      init_util2();
      Controller2 = class {
        canvas;
        rowMap = /* @__PURE__ */ new Map([]);
        colMap = /* @__PURE__ */ new Map([]);
        isChanged = false;
        isRendering = false;
        constructor(canvas) {
          this.canvas = canvas;
          this.isChanged = false;
        }
        getHeaderSize() {
          return { width: COL_TITLE_WIDTH, height: ROW_TITLE_HEIGHT };
        }
        getColWidth(col) {
          return this.colMap.get(col) || CELL_WIDTH;
        }
        setColWidth(col, width) {
          this.colMap.set(col, width);
          if (this.isRendering) {
            this.isChanged = true;
          }
        }
        getRowHeight(row) {
          return this.rowMap.get(row) || CELL_HEIGHT;
        }
        setRowHeight(row, height) {
          this.rowMap.set(row, height);
          if (this.isRendering) {
            this.isChanged = true;
          }
        }
        getCellSize(row, col) {
          return { width: this.getColWidth(col), height: this.getRowHeight(row) };
        }
        getHitInfo(event) {
          const { pageX, pageY } = event;
          const size2 = this.canvas.getBoundingClientRect();
          const x2 = pageX - size2.left;
          const y2 = pageY - size2.top;
          const config = this.getHeaderSize();
          let resultX = config.width;
          let resultY = config.height;
          let row = 0;
          let col = 0;
          while (resultX + this.getColWidth(col) <= x2) {
            resultX += this.getColWidth(col);
            col++;
          }
          while (resultY + this.getRowHeight(row) <= y2) {
            resultY += this.getRowHeight(row);
            row++;
          }
          const cellSize = this.getCellSize(row, col);
          return { ...cellSize, row, col, pageY, pageX, x: x2, y: y2 };
        }
        queryCell(row, col) {
          const config = this.getHeaderSize();
          let resultX = config.width;
          let resultY = config.height;
          let r2 = 0;
          let c2 = 0;
          while (c2 < col) {
            resultX += this.getColWidth(c2);
            c2++;
          }
          while (r2 < row) {
            resultY += this.getRowHeight(r2);
            r2++;
          }
          const cellSize = this.getCellSize(row, col);
          return { ...cellSize, top: resultY, left: resultX };
        }
        getCanvasSize() {
          const size2 = this.canvas.parentElement?.getBoundingClientRect();
          return {
            width: size2?.width || 0,
            height: size2?.height || 0
          };
        }
        getDrawSize() {
          const config = this.getHeaderSize();
          const size2 = this.getCanvasSize();
          const width = size2.width - config.width;
          const height = size2.height - config.height;
          return {
            width,
            height
          };
        }
      };
    }
  });

  // src/canvas/index.ts
  var init_canvas = __esm({
    "src/canvas/index.ts"() {
      "use strict";
      init_Main();
      init_Controller2();
    }
  });

  // src/interaction/Interaction.ts
  var Interaction;
  var init_Interaction = __esm({
    "src/interaction/Interaction.ts"() {
      "use strict";
      init_util2();
      Interaction = class {
        canvas;
        controller;
        lastTimeStamp = 0;
        canvasRect;
        constructor(controller2, canvas) {
          this.canvas = canvas;
          this.canvasRect = this.canvas.getBoundingClientRect();
          this.controller = controller2;
          this.addEvents();
        }
        addEvents() {
          const { canvas } = this;
          canvas.addEventListener("mousedown", this.mouseDown);
          canvas.addEventListener("mousemove", this.mouseMove);
          canvas.addEventListener("mouseup", this.mouseUp);
          window.addEventListener("resize", this.resize);
        }
        removeEvents() {
          const { canvas } = this;
          canvas.removeEventListener("mousedown", this.mouseDown);
          canvas.removeEventListener("mousemove", this.mouseMove);
          canvas.removeEventListener("mouseup", this.mouseUp);
          window.removeEventListener("resize", this.resize);
        }
        mouseDown = (event) => {
          const { timeStamp, clientX, clientY } = event;
          const { controller: controller2 } = this;
          const { renderController } = controller2;
          if (!renderController) {
            return;
          }
          const { width, height } = renderController.getHeaderSize();
          const x2 = clientX - this.canvasRect.left;
          const y2 = clientY - this.canvasRect.top;
          const position = renderController.getHitInfo(event);
          if (width > x2 && height > y2) {
            controller2.selectAll(position.row, position.col);
            return;
          }
          if (width > x2 && height <= y2) {
            controller2.selectRow(position.row, position.col);
            return;
          }
          if (width <= x2 && height > y2) {
            controller2.selectCol(position.row, position.col);
            return;
          }
          const activeCell = controller2.queryActiveCell();
          const check = activeCell.row >= 0 && activeCell.row === position.row && activeCell.col === position.col;
          if (!check) {
            controller2.quitEditing();
            controller2.setActiveCell(position.row, position.col);
          }
          const delay = timeStamp - this.lastTimeStamp;
          if (delay < DOUBLE_CLICK_TIME) {
            controller2.enterEditing();
          }
          this.lastTimeStamp = timeStamp;
        };
        mouseMove = (event) => {
          const { clientX, clientY } = event;
          const { controller: controller2 } = this;
          const { renderController } = controller2;
          if (!renderController) {
            return;
          }
          const { width, height } = renderController.getHeaderSize();
          const x2 = clientX - this.canvasRect.left;
          const y2 = clientY - this.canvasRect.top;
          const checkMove = x2 > width && y2 > height && event.buttons === 1;
          if (checkMove) {
            const position = renderController.getHitInfo(event);
            interactionLog("mouseMove", position);
            controller2.updateSelection(position.row, position.col);
          }
        };
        mouseUp = () => {
        };
        resize = () => {
          this.controller.windowResize();
        };
      };
    }
  });

  // src/interaction/index.ts
  var init_interaction2 = __esm({
    "src/interaction/index.ts"() {
      "use strict";
      init_Interaction();
    }
  });

  // src/containers/canvas/index.tsx
  var import_react12, CanvasContainer;
  var init_canvas2 = __esm({
    "src/containers/canvas/index.tsx"() {
      "use strict";
      import_react12 = __toESM(require_react());
      init_CellEditor();
      init_canvas();
      init_interaction2();
      init_store3();
      CanvasContainer = (0, import_react12.memo)(() => {
        const controller2 = useController();
        const canvasRef = (0, import_react12.useRef)(null);
        const ref = (0, import_react12.useRef)({
          focus: () => 0
        });
        (0, import_react12.useEffect)(() => {
          if (!canvasRef.current) {
            return;
          }
          const canvasDom = canvasRef.current;
          const renderController = new Controller2(canvasDom);
          controller2.setRenderController(renderController);
          new Main(controller2, canvasDom);
          const interaction = new Interaction(controller2, canvasDom);
          controller2.setHooks({
            focus: ref.current.focus,
            blur: () => {
              const dom = document.activeElement;
              if (dom && dom.tagName === "INPUT") {
                dom.blur();
              }
            }
          });
          return () => {
            interaction.removeEvents();
          };
        }, [controller2]);
        const onContextMenu = (0, import_react12.useCallback)(
          (event) => {
            event.stopPropagation();
            event.preventDefault();
          },
          []
        );
        return /* @__PURE__ */ import_react12.default.createElement("div", {
          className: "relative canvas-container",
          id: "main-canvas"
        }, /* @__PURE__ */ import_react12.default.createElement("canvas", {
          className: "full",
          ref: canvasRef,
          onContextMenu
        }), /* @__PURE__ */ import_react12.default.createElement(CellEditorContainer, {
          ref
        }));
      });
      CanvasContainer.displayName = "CanvasContainer";
    }
  });

  // src/containers/FormulaBar/FormulaEditor.tsx
  var import_react13, FormulaEditor;
  var init_FormulaEditor = __esm({
    "src/containers/FormulaBar/FormulaEditor.tsx"() {
      "use strict";
      import_react13 = __toESM(require_react());
      init_store3();
      init_util2();
      FormulaEditor = (0, import_react13.memo)(() => {
        const controller2 = useController();
        const { activeCell, editCellValue, isCellEditing } = useSelector([
          "activeCell",
          "editCellValue",
          "isCellEditing"
        ]);
        const dispatch = useDispatch();
        const inputRef = (0, import_react13.useRef)(null);
        const initValue = (0, import_react13.useMemo)(() => {
          const temp = String(activeCell.value || "");
          return (activeCell.formula ? `=${activeCell.formula}` : "") || temp;
        }, [activeCell]);
        const onFocus = (0, import_react13.useCallback)(() => {
          dispatch({
            type: "BATCH",
            payload: { isCellEditing: true, editCellValue: initValue }
          });
        }, [initValue, dispatch]);
        const onChange = (0, import_react13.useCallback)(
          (event) => {
            const { value } = event.currentTarget;
            dispatch({ type: "CHANGE_Edit_CELL_VALUE", payload: value });
          },
          [dispatch]
        );
        const handleKeyDown = (0, import_react13.useCallback)(
          (event) => {
            const { key } = event;
            if (key === "Enter") {
              inputRef.current?.blur();
              controller2.setActiveCell(activeCell.row + 1, activeCell.col);
            }
          },
          [activeCell, controller2]
        );
        const onBlur = (0, import_react13.useCallback)(() => {
          containersLog("FormulaEditor onBlur");
          controller2.setCellValue(controller2.queryActiveCell(), editCellValue);
          controller2.setCellEditing(false);
          dispatch({
            type: "BATCH",
            payload: { isCellEditing: false, editCellValue: "" }
          });
        }, [controller2, editCellValue, dispatch]);
        return /* @__PURE__ */ import_react13.default.createElement("input", {
          className: "base-editor",
          value: isCellEditing ? editCellValue : initValue,
          ref: inputRef,
          onFocus,
          onChange,
          onKeyDown: handleKeyDown,
          onBlur
        });
      });
      FormulaEditor.displayName = "FormulaEditor";
    }
  });

  // src/containers/FormulaBar/index.tsx
  var import_react14, FormulaBar;
  var init_FormulaBar = __esm({
    "src/containers/FormulaBar/index.tsx"() {
      "use strict";
      import_react14 = __toESM(require_react());
      init_store3();
      init_FormulaEditor();
      init_util2();
      FormulaBar = (0, import_react14.memo)(() => {
        const { activeCell } = useSelector(["activeCell"]);
        const { row, col } = activeCell;
        const text = (0, import_react14.useMemo)(() => {
          return `${intToColumnName(col)}${row + 1}`;
        }, [row, col]);
        return /* @__PURE__ */ import_react14.default.createElement("div", {
          className: "formula-bar-wrapper",
          id: "formula-bar-container"
        }, /* @__PURE__ */ import_react14.default.createElement("div", {
          className: "formula-bar-name"
        }, text), /* @__PURE__ */ import_react14.default.createElement("div", {
          className: "formula-bar-editor-wrapper"
        }, /* @__PURE__ */ import_react14.default.createElement(FormulaEditor, null)));
      });
      FormulaBar.displayName = "FormulaBar";
    }
  });

  // src/containers/Toolbar/index.tsx
  var import_react15, colorPickerStyle, ToolbarContainer;
  var init_Toolbar = __esm({
    "src/containers/Toolbar/index.tsx"() {
      "use strict";
      import_react15 = __toESM(require_react());
      init_components();
      init_store3();
      init_types();
      init_util2();
      init_hooks();
      colorPickerStyle = { marginLeft: 8 };
      ToolbarContainer = (0, import_react15.memo)(() => {
        const [fontFamilyList] = useFontFamily();
        const controller2 = useController();
        const { activeCell, canRedo, canUndo } = useSelector([
          "activeCell",
          "canRedo",
          "canUndo"
        ]);
        const { style = {} } = activeCell;
        const {
          isBold,
          isItalic,
          fontSize = DEFAULT_FONT_SIZE,
          fontColor = DEFAULT_FONT_COLOR,
          fillColor,
          fontFamily,
          wrapText
        } = style;
        const setCellStyle = (0, import_react15.useCallback)(
          (value) => {
            controller2.setCellStyle(value);
          },
          [controller2]
        );
        const handleFontSize = (0, import_react15.useCallback)(
          (value) => {
            if (isNumber(value)) {
              const realValue = parseFloat(value);
              setCellStyle({ fontSize: realValue });
            }
          },
          [setCellStyle]
        );
        const getItemStyle = (0, import_react15.useCallback)((value) => {
          return { fontFamily: String(value) };
        }, []);
        return /* @__PURE__ */ import_react15.default.createElement("div", {
          className: "toolbar-wrapper",
          id: "tool-bar-container"
        }, /* @__PURE__ */ import_react15.default.createElement(Button, {
          disabled: !canUndo,
          onClick: controller2.undo
        }, /* @__PURE__ */ import_react15.default.createElement(BaseIcon, {
          name: "undo"
        })), /* @__PURE__ */ import_react15.default.createElement(Button, {
          disabled: !canRedo,
          onClick: controller2.redo
        }, /* @__PURE__ */ import_react15.default.createElement(BaseIcon, {
          name: "redo"
        })), /* @__PURE__ */ import_react15.default.createElement(Button, {
          active: isBold,
          onClick: () => setCellStyle({ isBold: !isBold })
        }, /* @__PURE__ */ import_react15.default.createElement(BaseIcon, {
          name: "bold"
        })), /* @__PURE__ */ import_react15.default.createElement(Button, {
          active: isItalic,
          onClick: () => setCellStyle({ isItalic: !isItalic })
        }, /* @__PURE__ */ import_react15.default.createElement(BaseIcon, {
          name: "italic"
        })), /* @__PURE__ */ import_react15.default.createElement(Button, {
          active: wrapText === 1 /* AUTO_WRAP */,
          onClick: () => setCellStyle({ wrapText: 1 /* AUTO_WRAP */ })
        }, "Wrap Text"), /* @__PURE__ */ import_react15.default.createElement(Select, {
          data: fontFamilyList,
          style: colorPickerStyle,
          value: fontFamily || DEFAULT_FONT_FAMILY,
          onChange: (item) => setCellStyle({ fontFamily: item }),
          getItemStyle
        }), /* @__PURE__ */ import_react15.default.createElement(Select, {
          data: FONT_SIZE_LIST,
          value: fontSize,
          style: colorPickerStyle,
          onChange: handleFontSize
        }), /* @__PURE__ */ import_react15.default.createElement(ColorPicker, {
          color: fontColor,
          style: colorPickerStyle,
          onChange: (color2) => setCellStyle({ fontColor: color2 })
        }, /* @__PURE__ */ import_react15.default.createElement(BaseIcon, {
          name: "fontColor"
        })), /* @__PURE__ */ import_react15.default.createElement(ColorPicker, {
          color: fillColor || "",
          style: colorPickerStyle,
          onChange: (color2) => setCellStyle({ fillColor: color2 })
        }, /* @__PURE__ */ import_react15.default.createElement(BaseIcon, {
          name: "fillColor"
        })), /* @__PURE__ */ import_react15.default.createElement(Github, null));
      });
      ToolbarContainer.displayName = "ToolbarContainer";
    }
  });

  // src/containers/SheetBar/index.tsx
  var import_react16, addButtonStyle, SheetBarContainer;
  var init_SheetBar = __esm({
    "src/containers/SheetBar/index.tsx"() {
      "use strict";
      import_react16 = __toESM(require_react());
      init_util2();
      init_components();
      init_store3();
      init_theme();
      addButtonStyle = {
        backgroundColor: theme_default.buttonActiveColor
      };
      SheetBarContainer = (0, import_react16.memo)(() => {
        const controller2 = useController();
        const { currentSheetId, sheetList = [] } = useSelector([
          "currentSheetId",
          "sheetList"
        ]);
        const handleClickSheet = (0, import_react16.useCallback)(
          (item) => {
            controller2.setCurrentSheetId(item.sheetId);
          },
          [controller2]
        );
        const handleAddSheet = (0, import_react16.useCallback)(() => {
          controller2.addSheet();
        }, [controller2]);
        return /* @__PURE__ */ import_react16.default.createElement("div", {
          className: "sheet-bar-wrapper",
          id: "sheet-bar-container"
        }, /* @__PURE__ */ import_react16.default.createElement("div", {
          className: "sheet-bar-list "
        }, sheetList.map((item) => /* @__PURE__ */ import_react16.default.createElement("div", {
          key: item.sheetId,
          onMouseDown: () => handleClickSheet(item),
          className: classnames("sheet-bar-item", {
            active: currentSheetId === item.sheetId
          })
        }, item.name))), /* @__PURE__ */ import_react16.default.createElement("div", {
          style: { marginLeft: 20 }
        }, /* @__PURE__ */ import_react16.default.createElement(Button, {
          style: addButtonStyle,
          type: "circle",
          onClick: handleAddSheet
        }, /* @__PURE__ */ import_react16.default.createElement(BaseIcon, {
          name: "plus"
        }))));
      });
      SheetBarContainer.displayName = "SheetBarContainer";
    }
  });

  // src/containers/index.ts
  var init_containers = __esm({
    "src/containers/index.ts"() {
      "use strict";
      init_canvas2();
      init_FormulaBar();
      init_Toolbar();
      init_SheetBar();
    }
  });

  // src/entry/lazyLoad/CanvasContainer.ts
  var CanvasContainer_exports = {};
  __export(CanvasContainer_exports, {
    default: () => CanvasContainer
  });
  var init_CanvasContainer = __esm({
    "src/entry/lazyLoad/CanvasContainer.ts"() {
      "use strict";
      init_containers();
    }
  });

  // src/entry/lazyLoad/ToolbarContainer.ts
  var ToolbarContainer_exports = {};
  __export(ToolbarContainer_exports, {
    default: () => ToolbarContainer
  });
  var init_ToolbarContainer = __esm({
    "src/entry/lazyLoad/ToolbarContainer.ts"() {
      "use strict";
      init_containers();
    }
  });

  // src/entry/lazyLoad/SheetBarContainer.ts
  var SheetBarContainer_exports = {};
  __export(SheetBarContainer_exports, {
    default: () => SheetBarContainer
  });
  var init_SheetBarContainer = __esm({
    "src/entry/lazyLoad/SheetBarContainer.ts"() {
      "use strict";
      init_containers();
    }
  });

  // src/entry/lazyLoad/FormulaBar.ts
  var FormulaBar_exports = {};
  __export(FormulaBar_exports, {
    default: () => FormulaBar
  });
  var init_FormulaBar2 = __esm({
    "src/entry/lazyLoad/FormulaBar.ts"() {
      "use strict";
      init_containers();
    }
  });

  // src/index.tsx
  var import_react_dom = __toESM(require_react_dom());
  var import_react18 = __toESM(require_react());

  // src/entry/App.tsx
  var import_react17 = __toESM(require_react());
  init_components();
  init_store3();
  init_model2();
  init_util2();
  init_hooks();
  var AsyncCanvasContainer = import_react17.default.lazy(
    () => Promise.resolve().then(() => (init_CanvasContainer(), CanvasContainer_exports))
  );
  var AsyncToolbarContainer = import_react17.default.lazy(
    () => Promise.resolve().then(() => (init_ToolbarContainer(), ToolbarContainer_exports))
  );
  var AsyncSheetBarContainer = import_react17.default.lazy(
    () => Promise.resolve().then(() => (init_SheetBarContainer(), SheetBarContainer_exports))
  );
  var AsyncFormulaBar = import_react17.default.lazy(() => Promise.resolve().then(() => (init_FormulaBar2(), FormulaBar_exports)));
  var App = import_react17.default.memo(() => {
    const controller2 = useController();
    const dispatch = useDispatch();
    useTheme();
    (0, import_react17.useEffect)(() => {
      controller2.on("change", (data) => {
        const { changeSet } = data;
        const state = {
          canRedo: controller2.canRedo(),
          canUndo: controller2.canUndo()
        };
        if (changeSet.has("contentChange")) {
          const { workbook, currentSheetId } = controller2.model;
          state.sheetList = workbook;
          state.currentSheetId = currentSheetId;
        }
        const cell = controller2.queryCell(controller2.queryActiveCell());
        const { isCellEditing, renderController } = controller2;
        if (renderController) {
          const config = renderController.queryCell(cell.row, cell.col);
          state.activeCell = { ...cell, ...config };
        }
        state.isCellEditing = isCellEditing;
        if (isCellEditing) {
          const editCellValue = (cell.formula ? `=${cell.formula}` : "") || String(cell.value || "");
          state.editCellValue = editCellValue;
        } else {
          state.editCellValue = "";
        }
        dispatch({ type: "BATCH", payload: state });
      });
      controller2.loadJSON(MOCK_MODEL);
      const offError = handleBuildError(controller2);
      return () => {
        offError();
      };
    }, [dispatch, controller2]);
    return /* @__PURE__ */ import_react17.default.createElement("div", {
      className: "app-container",
      id: "AppContainer"
    }, /* @__PURE__ */ import_react17.default.createElement(Lazy, null, /* @__PURE__ */ import_react17.default.createElement(AsyncToolbarContainer, null)), /* @__PURE__ */ import_react17.default.createElement(Lazy, null, /* @__PURE__ */ import_react17.default.createElement(AsyncFormulaBar, null)), /* @__PURE__ */ import_react17.default.createElement(Lazy, null, /* @__PURE__ */ import_react17.default.createElement(AsyncCanvasContainer, null)), /* @__PURE__ */ import_react17.default.createElement(Lazy, null, /* @__PURE__ */ import_react17.default.createElement(AsyncSheetBarContainer, null)));
  });
  App.displayName = "APP";

  // src/index.tsx
  init_components();
  init_store3();
  import_react_dom.default.render(
    /* @__PURE__ */ import_react18.default.createElement(import_react18.default.StrictMode, null, /* @__PURE__ */ import_react18.default.createElement(ErrorBoundary, null, /* @__PURE__ */ import_react18.default.createElement(StoreProvider, null, /* @__PURE__ */ import_react18.default.createElement(App, null)))),
    document.getElementById("root")
  );
})();
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

    for(var key in __export__) {
            exports[key] = __export__[key]
        }
    }));
