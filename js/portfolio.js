/**
 * circles - v0.0.5 - 2014-05-30
 *
 * Copyright (c) 2014 lugolabs
 * Licensed
 */
(function () {
    var l = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
            setTimeout(a, 1E3 / 60)
        }, f = window.Circles = function (a) {
        this._el = document.getElementById(a.id);
        if (null !== this._el) {
            this._radius = a.radius || 10;
            this._duration = void 0 === a.duration ? 500 : a.duration;
            this._value = 0;
            this._maxValue = a.maxValue || 100;
            this._text = void 0 === a.text ? function (a) {
                    return this.htmlifyNumber(a)
                } : a.text;
            this._strokeWidth =
                a.width || 10;
            this._colors = a.colors || ["#EEE", "#F00"];
            this._textContainer = this._wrapContainer = this._movingPath = this._svg = null;
            this._wrpClass = a.wrpClass || "circles-wrp";
            this._textClass = a.textClass || "circles-text";
            var b = Math.PI / 180 * 270;
            this._start = -Math.PI / 180 * 90;
            this._startPrecise = this._precise(this._start);
            this._circ = b - this._start;
            this._generate().update(a.value || 0)
        }
    };
    f.prototype = {
        VERSION: "0.0.5", _generate: function () {
            this._svgSize = 2 * this._radius;
            this._radiusAdjusted = this._radius - this._strokeWidth / 2;
            this._generateSvg()._generateText()._generateWrapper();
            this._el.innerHTML = "";
            this._el.appendChild(this._wrapContainer);
            return this
        }, _setPercentage: function (a) {
            this._movingPath.setAttribute("d", this._calculatePath(a, !0));
            this._textContainer.innerHTML = this._getText(this.getValueFromPercent(a))
        }, _generateWrapper: function () {
            this._wrapContainer = document.createElement("div");
            this._wrapContainer.className = this._wrpClass;
            this._wrapContainer.style.position = "relative";
            this._wrapContainer.style.display = "inline-block";
            this._wrapContainer.appendChild(this._svg);
            this._wrapContainer.appendChild(this._textContainer);
            return this
        }, _generateText: function () {
            this._textContainer = document.createElement("div");
            this._textContainer.className = this._textClass;
            var a = {
                position: "absolute",
                top: 0,
                left: 0,
                textAlign: "center",
                width: "100%",
                fontSize: .7 * this._radius + "px",
                height: this._svgSize + "px",
                lineHeight: this._svgSize + "px"
            }, b;
            for (b in a)this._textContainer.style[b] = a[b];
            this._textContainer.innerHTML = this._getText(0);
            return this
        }, _getText: function (a) {
            if (!this._text)return "";
            void 0 === a && (a = this._value);
            a = parseFloat(a.toFixed(2));
            return "function" === typeof this._text ? this._text.call(this, a) : this._text
        }, _generateSvg: function () {
            this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this._svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            this._svg.setAttribute("width", this._svgSize);
            this._svg.setAttribute("height", this._svgSize);
            this._generatePath(100, !1, this._colors[0])._generatePath(1, !0, this._colors[1]);
            this._movingPath = this._svg.getElementsByTagName("path")[1];
            return this
        }, _generatePath: function (a, b, d) {
            var c = document.createElementNS("http://www.w3.org/2000/svg",
                "path");
            c.setAttribute("fill", "transparent");
            c.setAttribute("stroke", d);
            c.setAttribute("stroke-width", this._strokeWidth);
            c.setAttribute("d", this._calculatePath(a, b));
            this._svg.appendChild(c);
            return this
        }, _calculatePath: function (a, b) {
            var d = this._precise(this._start + a / 100 * this._circ);
            return this._arc(d, b)
        }, _arc: function (a, b) {
            var d = a - .001, c = a - this._startPrecise < Math.PI ? 0 : 1;
            return ["M", this._radius + this._radiusAdjusted * Math.cos(this._startPrecise), this._radius + this._radiusAdjusted * Math.sin(this._startPrecise),
                "A", this._radiusAdjusted, this._radiusAdjusted, 0, c, 1, this._radius + this._radiusAdjusted * Math.cos(d), this._radius + this._radiusAdjusted * Math.sin(d), b ? "" : "Z"].join(" ")
        }, _precise: function (a) {
            return Math.round(1E3 * a) / 1E3
        }, htmlifyNumber: function (a, b, d) {
            b = b || "circles-integer";
            d = d || "circles-decimals";
            a = (a + "").split(".");
            b = '<span class="' + b + '">' + a[0] + "</span>";
            1 < a.length && (b += '.<span class="' + d + '">' + a[1].substring(0, 2) + "</span>");
            return b
        }, updateRadius: function (a) {
            this._radius = a;
            return this._generate().update(!0)
        },
        updateWidth: function (a) {
            this._strokeWidth = a;
            return this._generate().update(!0)
        }, updateColors: function (a) {
            this._colors = a;
            var b = this._svg.getElementsByTagName("path");
            b[0].setAttribute("stroke", a[0]);
            b[1].setAttribute("stroke", a[1]);
            return this
        }, getPercent: function () {
            return 100 * this._value / this._maxValue
        }, getValueFromPercent: function (a) {
            return this._maxValue * a / 100
        }, getValue: function () {
            return this._value
        }, getMaxValue: function () {
            return this._maxValue
        }, update: function (a, b) {
            if (!0 === a)return this._setPercentage(this.getPercent()),
                this;
            if (this._value == a || isNaN(a))return this;
            void 0 === b && (b = this._duration);
            var d = this, c = d.getPercent(), g = 1, e, h, f, k;
            this._value = Math.min(this._maxValue, Math.max(0, a));
            if (!b)return this._setPercentage(this.getPercent()), this;
            e = d.getPercent();
            h = e > c;
            g += e % 1;
            f = Math.floor(Math.abs(e - c) / g);
            k = b / f;
            (function m(a) {
                c = h ? c + g : c - g;
                if (h && c >= e || !h && c <= e) l(function () {
                    d._setPercentage(e)
                }); else {
                    l(function () {
                        d._setPercentage(c)
                    });
                    var b = Date.now();
                    a = b - a;
                    a >= k ? m(b) : setTimeout(function () {
                            m(Date.now())
                        }, k - a)
                }
            })(Date.now());
            return this
        }
    };
    f.create = function (a) {
        return new f(a)
    }
})();

//Generated by CoffeeScript 1.6.2
/*!
 jQuery Waypoints - v2.0.5
 Copyright (c) 2011-2014 Caleb Troughton
 Licensed under the MIT license.
 https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
 */
(function () {
    var t = [].indexOf || function (t) {
            for (var e = 0, n = this.length; e < n; e++) {
                if (e in this && this[e] === t)return e
            }
            return -1
        }, e = [].slice;
    (function (t, e) {
        if (typeof define === "function" && define.amd) {
            return define("waypoints", ["jquery"], function (n) {
                return e(n, t)
            })
        } else {
            return e(t.jQuery, t)
        }
    })(window, function (n, r) {
        var i, o, l, s, f, u, c, a, h, d, p, y, v, w, g, m;
        i = n(r);
        a = t.call(r, "ontouchstart") >= 0;
        s = {horizontal: {}, vertical: {}};
        f = 1;
        c = {};
        u = "waypoints-context-id";
        p = "resize.waypoints";
        y = "scroll.waypoints";
        v = 1;
        w = "waypoints-waypoint-ids";
        g = "waypoint";
        m = "waypoints";
        o = function () {
            function t(t) {
                var e = this;
                this.$element = t;
                this.element = t[0];
                this.didResize = false;
                this.didScroll = false;
                this.id = "context" + f++;
                this.oldScroll = {x: t.scrollLeft(), y: t.scrollTop()};
                this.waypoints = {horizontal: {}, vertical: {}};
                this.element[u] = this.id;
                c[this.id] = this;
                t.bind(y, function () {
                    var t;
                    if (!(e.didScroll || a)) {
                        e.didScroll = true;
                        t = function () {
                            e.doScroll();
                            return e.didScroll = false
                        };
                        return r.setTimeout(t, n[m].settings.scrollThrottle)
                    }
                });
                t.bind(p, function () {
                    var t;
                    if (!e.didResize) {
                        e.didResize = true;
                        t = function () {
                            n[m]("refresh");
                            return e.didResize = false
                        };
                        return r.setTimeout(t, n[m].settings.resizeThrottle)
                    }
                })
            }

            t.prototype.doScroll = function () {
                var t, e = this;
                t = {
                    horizontal: {
                        newScroll: this.$element.scrollLeft(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left"
                    },
                    vertical: {
                        newScroll: this.$element.scrollTop(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up"
                    }
                };
                if (a && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
                    n[m]("refresh")
                }
                n.each(t, function (t, r) {
                    var i, o, l;
                    l = [];
                    o = r.newScroll > r.oldScroll;
                    i = o ? r.forward : r.backward;
                    n.each(e.waypoints[t], function (t, e) {
                        var n, i;
                        if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
                            return l.push(e)
                        } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
                            return l.push(e)
                        }
                    });
                    l.sort(function (t, e) {
                        return t.offset - e.offset
                    });
                    if (!o) {
                        l.reverse()
                    }
                    return n.each(l, function (t, e) {
                        if (e.options.continuous || t === l.length - 1) {
                            return e.trigger([i])
                        }
                    })
                });
                return this.oldScroll = {x: t.horizontal.newScroll, y: t.vertical.newScroll}
            };
            t.prototype.refresh = function () {
                var t, e, r, i = this;
                r = n.isWindow(this.element);
                e = this.$element.offset();
                this.doScroll();
                t = {
                    horizontal: {
                        contextOffset: r ? 0 : e.left,
                        contextScroll: r ? 0 : this.oldScroll.x,
                        contextDimension: this.$element.width(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left",
                        offsetProp: "left"
                    },
                    vertical: {
                        contextOffset: r ? 0 : e.top,
                        contextScroll: r ? 0 : this.oldScroll.y,
                        contextDimension: r ? n[m]("viewportHeight") : this.$element.height(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up",
                        offsetProp: "top"
                    }
                };
                return n.each(t, function (t, e) {
                    return n.each(i.waypoints[t], function (t, r) {
                        var i, o, l, s, f;
                        i = r.options.offset;
                        l = r.offset;
                        o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
                        if (n.isFunction(i)) {
                            i = i.apply(r.element)
                        } else if (typeof i === "string") {
                            i = parseFloat(i);
                            if (r.options.offset.indexOf("%") > -1) {
                                i = Math.ceil(e.contextDimension * i / 100)
                            }
                        }
                        r.offset = o - e.contextOffset + e.contextScroll - i;
                        if (r.options.onlyOnScroll && l != null || !r.enabled) {
                            return
                        }
                        if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
                            return r.trigger([e.backward])
                        } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
                            return r.trigger([e.forward])
                        } else if (l === null && e.oldScroll >= r.offset) {
                            return r.trigger([e.forward])
                        }
                    })
                })
            };
            t.prototype.checkEmpty = function () {
                if (n.isEmptyObject(this.waypoints.horizontal) && n.isEmptyObject(this.waypoints.vertical)) {
                    this.$element.unbind([p, y].join(" "));
                    return delete c[this.id]
                }
            };
            return t
        }();
        l = function () {
            function t(t, e, r) {
                var i, o;
                if (r.offset === "bottom-in-view") {
                    r.offset = function () {
                        var t;
                        t = n[m]("viewportHeight");
                        if (!n.isWindow(e.element)) {
                            t = e.$element.height()
                        }
                        return t - n(this).outerHeight()
                    }
                }
                this.$element = t;
                this.element = t[0];
                this.axis = r.horizontal ? "horizontal" : "vertical";
                this.callback = r.handler;
                this.context = e;
                this.enabled = r.enabled;
                this.id = "waypoints" + v++;
                this.offset = null;
                this.options = r;
                e.waypoints[this.axis][this.id] = this;
                s[this.axis][this.id] = this;
                i = (o = this.element[w]) != null ? o : [];
                i.push(this.id);
                this.element[w] = i
            }

            t.prototype.trigger = function (t) {
                if (!this.enabled) {
                    return
                }
                if (this.callback != null) {
                    this.callback.apply(this.element, t)
                }
                if (this.options.triggerOnce) {
                    return this.destroy()
                }
            };
            t.prototype.disable = function () {
                return this.enabled = false
            };
            t.prototype.enable = function () {
                this.context.refresh();
                return this.enabled = true
            };
            t.prototype.destroy = function () {
                delete s[this.axis][this.id];
                delete this.context.waypoints[this.axis][this.id];
                return this.context.checkEmpty()
            };
            t.getWaypointsByElement = function (t) {
                var e, r;
                r = t[w];
                if (!r) {
                    return []
                }
                e = n.extend({}, s.horizontal, s.vertical);
                return n.map(r, function (t) {
                    return e[t]
                })
            };
            return t
        }();
        d = {
            init: function (t, e) {
                var r;
                e = n.extend({}, n.fn[g].defaults, e);
                if ((r = e.handler) == null) {
                    e.handler = t
                }
                this.each(function () {
                    var t, r, i, s;
                    t = n(this);
                    i = (s = e.context) != null ? s : n.fn[g].defaults.context;
                    if (!n.isWindow(i)) {
                        i = t.closest(i)
                    }
                    i = n(i);
                    r = c[i[0][u]];
                    if (!r) {
                        r = new o(i)
                    }
                    return new l(t, r, e)
                });
                n[m]("refresh");
                return this
            }, disable: function () {
                return d._invoke.call(this, "disable")
            }, enable: function () {
                return d._invoke.call(this, "enable")
            }, destroy: function () {
                return d._invoke.call(this, "destroy")
            }, prev: function (t, e) {
                return d._traverse.call(this, t, e, function (t, e, n) {
                    if (e > 0) {
                        return t.push(n[e - 1])
                    }
                })
            }, next: function (t, e) {
                return d._traverse.call(this, t, e, function (t, e, n) {
                    if (e < n.length - 1) {
                        return t.push(n[e + 1])
                    }
                })
            }, _traverse: function (t, e, i) {
                var o, l;
                if (t == null) {
                    t = "vertical"
                }
                if (e == null) {
                    e = r
                }
                l = h.aggregate(e);
                o = [];
                this.each(function () {
                    var e;
                    e = n.inArray(this, l[t]);
                    return i(o, e, l[t])
                });
                return this.pushStack(o)
            }, _invoke: function (t) {
                this.each(function () {
                    var e;
                    e = l.getWaypointsByElement(this);
                    return n.each(e, function (e, n) {
                        n[t]();
                        return true
                    })
                });
                return this
            }
        };
        n.fn[g] = function () {
            var t, r;
            r = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (d[r]) {
                return d[r].apply(this, t)
            } else if (n.isFunction(r)) {
                return d.init.apply(this, arguments)
            } else if (n.isPlainObject(r)) {
                return d.init.apply(this, [null, r])
            } else if (!r) {
                return n.error("jQuery Waypoints needs a callback function or handler option.")
            } else {
                return n.error("The " + r + " method does not exist in jQuery Waypoints.")
            }
        };
        n.fn[g].defaults = {
            context: r,
            continuous: true,
            enabled: true,
            horizontal: false,
            offset: 0,
            triggerOnce: false
        };
        h = {
            refresh: function () {
                return n.each(c, function (t, e) {
                    return e.refresh()
                })
            }, viewportHeight: function () {
                var t;
                return (t = r.innerHeight) != null ? t : i.height()
            }, aggregate: function (t) {
                var e, r, i;
                e = s;
                if (t) {
                    e = (i = c[n(t)[0][u]]) != null ? i.waypoints : void 0
                }
                if (!e) {
                    return []
                }
                r = {horizontal: [], vertical: []};
                n.each(r, function (t, i) {
                    n.each(e[t], function (t, e) {
                        return i.push(e)
                    });
                    i.sort(function (t, e) {
                        return t.offset - e.offset
                    });
                    r[t] = n.map(i, function (t) {
                        return t.element
                    });
                    return r[t] = n.unique(r[t])
                });
                return r
            }, above: function (t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "vertical", function (t, e) {
                    return e.offset <= t.oldScroll.y
                })
            }, below: function (t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "vertical", function (t, e) {
                    return e.offset > t.oldScroll.y
                })
            }, left: function (t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "horizontal", function (t, e) {
                    return e.offset <= t.oldScroll.x
                })
            }, right: function (t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "horizontal", function (t, e) {
                    return e.offset > t.oldScroll.x
                })
            }, enable: function () {
                return h._invoke("enable")
            }, disable: function () {
                return h._invoke("disable")
            }, destroy: function () {
                return h._invoke("destroy")
            }, extendFn: function (t, e) {
                return d[t] = e
            }, _invoke: function (t) {
                var e;
                e = n.extend({}, s.vertical, s.horizontal);
                return n.each(e, function (e, n) {
                    n[t]();
                    return true
                })
            }, _filter: function (t, e, r) {
                var i, o;
                i = c[n(t)[0][u]];
                if (!i) {
                    return []
                }
                o = [];
                n.each(i.waypoints[e], function (t, e) {
                    if (r(i, e)) {
                        return o.push(e)
                    }
                });
                o.sort(function (t, e) {
                    return t.offset - e.offset
                });
                return n.map(o, function (t) {
                    return t.element
                })
            }
        };
        n[m] = function () {
            var t, n;
            n = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (h[n]) {
                return h[n].apply(null, t)
            } else {
                return h.aggregate.call(null, n)
            }
        };
        n[m].settings = {resizeThrottle: 100, scrollThrottle: 30};
        return i.on("load.waypoints", function () {
            return n[m]("refresh")
        })
    })
}).call(this);


/**!
 * MixItUp v2.1.7
 *
 * @copyright Copyright 2014 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://mixitup.kunkalabs.com
 *
 * @license   Commercial use requires a commercial license.
 *            https://mixitup.kunkalabs.com/licenses/
 *
 *            Non-commercial use permitted under terms of CC-BY-NC license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */
!function (a, b) {
    a.MixItUp = function () {
        var b = this;
        b._execAction("_constructor", 0), a.extend(b, {
            selectors: {target: ".mix", filter: ".filter", sort: ".sort"},
            animation: {
                enable: !0,
                effects: "fade scale",
                duration: 600,
                easing: "ease",
                perspectiveDistance: "3000",
                perspectiveOrigin: "50% 50%",
                queue: !0,
                queueLimit: 1,
                animateChangeLayout: !1,
                animateResizeContainer: !0,
                animateResizeTargets: !1,
                staggerSequence: !1,
                reverseOut: !1
            },
            callbacks: {onMixLoad: !1, onMixStart: !1, onMixBusy: !1, onMixEnd: !1, onMixFail: !1, _user: !1},
            controls: {enable: !0, live: !1, toggleFilterButtons: !1, toggleLogic: "or", activeClass: "active"},
            layout: {display: "inline-block", containerClass: "", containerClassFail: "fail"},
            load: {filter: "all", sort: !1},
            _$body: null,
            _$container: null,
            _$targets: null,
            _$parent: null,
            _$sortButtons: null,
            _$filterButtons: null,
            _suckMode: !1,
            _mixing: !1,
            _sorting: !1,
            _clicking: !1,
            _loading: !0,
            _changingLayout: !1,
            _changingClass: !1,
            _changingDisplay: !1,
            _origOrder: [],
            _startOrder: [],
            _newOrder: [],
            _activeFilter: null,
            _toggleArray: [],
            _toggleString: "",
            _activeSort: "default:asc",
            _newSort: null,
            _startHeight: null,
            _newHeight: null,
            _incPadding: !0,
            _newDisplay: null,
            _newClass: null,
            _targetsBound: 0,
            _targetsDone: 0,
            _queue: [],
            _$show: a(),
            _$hide: a()
        }), b._execAction("_constructor", 1)
    }, a.MixItUp.prototype = {
        constructor: a.MixItUp,
        _instances: {},
        _handled: {_filter: {}, _sort: {}},
        _bound: {_filter: {}, _sort: {}},
        _actions: {},
        _filters: {},
        extend: function (b) {
            for (var c in b)a.MixItUp.prototype[c] = b[c]
        },
        addAction: function (b, c, d, e) {
            a.MixItUp.prototype._addHook("_actions", b, c, d, e)
        },
        addFilter: function (b, c, d, e) {
            a.MixItUp.prototype._addHook("_filters", b, c, d, e)
        },
        _addHook: function (b, c, d, e, f) {
            var g = a.MixItUp.prototype[b], h = {};
            f = 1 === f || "post" === f ? "post" : "pre", h[c] = {}, h[c][f] = {}, h[c][f][d] = e, a.extend(!0, g, h)
        },
        _init: function (b, c) {
            var d = this;
            if (d._execAction("_init", 0, arguments), c && a.extend(!0, d, c), d._$body = a("body"), d._domNode = b, d._$container = a(b), d._$container.addClass(d.layout.containerClass), d._id = b.id, d._platformDetect(), d._brake = d._getPrefixedCSS("transition", "none"), d._refresh(!0), d._$parent = d._$targets.parent().length ? d._$targets.parent() : d._$container, d.load.sort && (d._newSort = d._parseSort(d.load.sort), d._newSortString = d.load.sort, d._activeSort = d.load.sort, d._sort(), d._printSort()), d._activeFilter = "all" === d.load.filter ? d.selectors.target : "none" === d.load.filter ? "" : d.load.filter, d.controls.enable && d._bindHandlers(), d.controls.toggleFilterButtons) {
                d._buildToggleArray();
                for (var e = 0; e < d._toggleArray.length; e++)d._updateControls({
                    filter: d._toggleArray[e],
                    sort: d._activeSort
                }, !0)
            } else d.controls.enable && d._updateControls({filter: d._activeFilter, sort: d._activeSort});
            d._filter(), d._init = !0, d._$container.data("mixItUp", d), d._execAction("_init", 1, arguments), d._buildState(), d._$targets.css(d._brake), d._goMix(d.animation.enable)
        },
        _platformDetect: function () {
            var a = this, c = ["Webkit", "Moz", "O", "ms"], d = ["webkit", "moz"], e = window.navigator.appVersion.match(/Chrome\/(\d+)\./) || !1, f = "undefined" != typeof InstallTrigger, g = function (a) {
                for (var b = 0; b < c.length; b++)if (c[b] + "Transition" in a.style)return {
                    prefix: "-" + c[b].toLowerCase() + "-",
                    vendor: c[b]
                };
                return "transition" in a.style ? "" : !1
            }, h = g(a._domNode);
            a._execAction("_platformDetect", 0), a._chrome = e ? parseInt(e[1], 10) : !1, a._ff = f ? parseInt(window.navigator.userAgent.match(/rv:([^)]+)\)/)[1]) : !1, a._prefix = h.prefix, a._vendor = h.vendor, a._suckMode = window.atob && a._prefix ? !1 : !0, a._suckMode && (a.animation.enable = !1), a._ff && a._ff <= 4 && (a.animation.enable = !1);
            for (var i = 0; i < d.length && !window.requestAnimationFrame; i++)window.requestAnimationFrame = window[d[i] + "RequestAnimationFrame"];
            "function" != typeof Object.getPrototypeOf && (Object.getPrototypeOf = "object" == typeof"test".__proto__ ? function (a) {
                    return a.__proto__
                } : function (a) {
                    return a.constructor.prototype
                }), a._domNode.nextElementSibling === b && Object.defineProperty(Element.prototype, "nextElementSibling", {
                get: function () {
                    for (var a = this.nextSibling; a;) {
                        if (1 === a.nodeType)return a;
                        a = a.nextSibling
                    }
                    return null
                }
            }), a._execAction("_platformDetect", 1)
        },
        _refresh: function (a, c) {
            var d = this;
            d._execAction("_refresh", 0, arguments), d._$targets = d._$container.find(d.selectors.target);
            for (var e = 0; e < d._$targets.length; e++) {
                var f = d._$targets[e];
                if (f.dataset === b || c) {
                    f.dataset = {};
                    for (var g = 0; g < f.attributes.length; g++) {
                        var h = f.attributes[g], i = h.name, j = h.value;
                        if (i.indexOf("data-") > -1) {
                            var k = d._helpers._camelCase(i.substring(5, i.length));
                            f.dataset[k] = j
                        }
                    }
                }
                f.mixParent === b && (f.mixParent = d._id)
            }
            if (d._$targets.length && a || !d._origOrder.length && d._$targets.length) {
                d._origOrder = [];
                for (var e = 0; e < d._$targets.length; e++) {
                    var f = d._$targets[e];
                    d._origOrder.push(f)
                }
            }
            d._execAction("_refresh", 1, arguments)
        },
        _bindHandlers: function () {
            var c = this, d = a.MixItUp.prototype._bound._filter, e = a.MixItUp.prototype._bound._sort;
            c._execAction("_bindHandlers", 0), c.controls.live ? c._$body.on("click.mixItUp." + c._id, c.selectors.sort, function () {
                    c._processClick(a(this), "sort")
                }).on("click.mixItUp." + c._id, c.selectors.filter, function () {
                    c._processClick(a(this), "filter")
                }) : (c._$sortButtons = a(c.selectors.sort), c._$filterButtons = a(c.selectors.filter), c._$sortButtons.on("click.mixItUp." + c._id, function () {
                    c._processClick(a(this), "sort")
                }), c._$filterButtons.on("click.mixItUp." + c._id, function () {
                    c._processClick(a(this), "filter")
                })), d[c.selectors.filter] = d[c.selectors.filter] === b ? 1 : d[c.selectors.filter] + 1, e[c.selectors.sort] = e[c.selectors.sort] === b ? 1 : e[c.selectors.sort] + 1, c._execAction("_bindHandlers", 1)
        },
        _processClick: function (c, d) {
            var e = this, f = function (c, d, f) {
                var g = a.MixItUp.prototype;
                g._handled["_" + d][e.selectors[d]] = g._handled["_" + d][e.selectors[d]] === b ? 1 : g._handled["_" + d][e.selectors[d]] + 1, g._handled["_" + d][e.selectors[d]] === g._bound["_" + d][e.selectors[d]] && (c[(f ? "remove" : "add") + "Class"](e.controls.activeClass), delete g._handled["_" + d][e.selectors[d]])
            };
            if (e._execAction("_processClick", 0, arguments), !e._mixing || e.animation.queue && e._queue.length < e.animation.queueLimit) {
                if (e._clicking = !0, "sort" === d) {
                    var g = c.attr("data-sort");
                    (!c.hasClass(e.controls.activeClass) || g.indexOf("random") > -1) && (a(e.selectors.sort).removeClass(e.controls.activeClass), f(c, d), e.sort(g))
                }
                if ("filter" === d) {
                    var h, i = c.attr("data-filter"), j = "or" === e.controls.toggleLogic ? "," : "";
                    e.controls.toggleFilterButtons ? (e._buildToggleArray(), c.hasClass(e.controls.activeClass) ? (f(c, d, !0), h = e._toggleArray.indexOf(i), e._toggleArray.splice(h, 1)) : (f(c, d), e._toggleArray.push(i)), e._toggleArray = a.grep(e._toggleArray, function (a) {
                            return a
                        }), e._toggleString = e._toggleArray.join(j), e.filter(e._toggleString)) : c.hasClass(e.controls.activeClass) || (a(e.selectors.filter).removeClass(e.controls.activeClass), f(c, d), e.filter(i))
                }
                e._execAction("_processClick", 1, arguments)
            } else"function" == typeof e.callbacks.onMixBusy && e.callbacks.onMixBusy.call(e._domNode, e._state, e), e._execAction("_processClickBusy", 1, arguments)
        },
        _buildToggleArray: function () {
            var a = this, b = a._activeFilter.replace(/\s/g, "");
            if (a._execAction("_buildToggleArray", 0, arguments), "or" === a.controls.toggleLogic) a._toggleArray = b.split(","); else {
                a._toggleArray = b.split("."), !a._toggleArray[0] && a._toggleArray.shift();
                for (var c, d = 0; c = a._toggleArray[d]; d++)a._toggleArray[d] = "." + c
            }
            a._execAction("_buildToggleArray", 1, arguments)
        },
        _updateControls: function (c, d) {
            var e = this, f = {filter: c.filter, sort: c.sort}, g = function (a, b) {
                d && "filter" === h && "none" !== f.filter && "" !== f.filter ? a.filter(b).addClass(e.controls.activeClass) : a.removeClass(e.controls.activeClass).filter(b).addClass(e.controls.activeClass)
            }, h = "filter", i = null;
            e._execAction("_updateControls", 0, arguments), c.filter === b && (f.filter = e._activeFilter), c.sort === b && (f.sort = e._activeSort), f.filter === e.selectors.target && (f.filter = "all");
            for (var j = 0; 2 > j; j++)i = e.controls.live ? a(e.selectors[h]) : e["_$" + h + "Buttons"], i && g(i, "[data-" + h + '="' + f[h] + '"]'), h = "sort";
            e._execAction("_updateControls", 1, arguments)
        },
        _filter: function () {
            var b = this;
            b._execAction("_filter", 0);
            for (var c = 0; c < b._$targets.length; c++) {
                var d = a(b._$targets[c]);
                d.is(b._activeFilter) ? b._$show = b._$show.add(d) : b._$hide = b._$hide.add(d)
            }
            b._execAction("_filter", 1)
        },
        _sort: function () {
            var a = this, b = function (a) {
                for (var b = a.slice(), c = b.length, d = c; d--;) {
                    var e = parseInt(Math.random() * c), f = b[d];
                    b[d] = b[e], b[e] = f
                }
                return b
            };
            a._execAction("_sort", 0), a._startOrder = [];
            for (var c = 0; c < a._$targets.length; c++) {
                var d = a._$targets[c];
                a._startOrder.push(d)
            }
            switch (a._newSort[0].sortBy) {
                case"default":
                    a._newOrder = a._origOrder;
                    break;
                case"random":
                    a._newOrder = b(a._startOrder);
                    break;
                case"custom":
                    a._newOrder = a._newSort[0].order;
                    break;
                default:
                    a._newOrder = a._startOrder.concat().sort(function (b, c) {
                        return a._compare(b, c)
                    })
            }
            a._execAction("_sort", 1)
        },
        _compare: function (a, b, c) {
            c = c ? c : 0;
            var d = this, e = d._newSort[c].order, f = function (a) {
                return a.dataset[d._newSort[c].sortBy] || 0
            }, g = isNaN(1 * f(a)) ? f(a).toLowerCase() : 1 * f(a), h = isNaN(1 * f(b)) ? f(b).toLowerCase() : 1 * f(b);
            return h > g ? "asc" === e ? -1 : 1 : g > h ? "asc" === e ? 1 : -1 : g === h && d._newSort.length > c + 1 ? d._compare(a, b, c + 1) : 0
        },
        _printSort: function (a) {
            var b = this, c = a ? b._startOrder : b._newOrder, d = b._$parent[0].querySelectorAll(b.selectors.target), e = d.length ? d[d.length - 1].nextElementSibling : null, f = document.createDocumentFragment();
            b._execAction("_printSort", 0, arguments);
            for (var g = 0; g < d.length; g++) {
                var h = d[g], i = h.nextSibling;
                "absolute" !== h.style.position && (i && "#text" === i.nodeName && b._$parent[0].removeChild(i), b._$parent[0].removeChild(h))
            }
            for (var g = 0; g < c.length; g++) {
                var j = c[g];
                if ("default" !== b._newSort[0].sortBy || "desc" !== b._newSort[0].order || a) f.appendChild(j), f.appendChild(document.createTextNode(" ")); else {
                    var k = f.firstChild;
                    f.insertBefore(j, k), f.insertBefore(document.createTextNode(" "), j)
                }
            }
            e ? b._$parent[0].insertBefore(f, e) : b._$parent[0].appendChild(f), b._execAction("_printSort", 1, arguments)
        },
        _parseSort: function (a) {
            for (var b = this, c = "string" == typeof a ? a.split(" ") : [a], d = [], e = 0; e < c.length; e++) {
                var f = "string" == typeof a ? c[e].split(":") : ["custom", c[e]], g = {
                    sortBy: b._helpers._camelCase(f[0]),
                    order: f[1] || "asc"
                };
                if (d.push(g), "default" === g.sortBy || "random" === g.sortBy)break
            }
            return b._execFilter("_parseSort", d, arguments)
        },
        _parseEffects: function () {
            var a = this, b = {opacity: "", transformIn: "", transformOut: "", filter: ""}, c = function (b, c) {
                if (a.animation.effects.indexOf(b) > -1) {
                    if (c) {
                        var d = a.animation.effects.indexOf(b + "(");
                        if (d > -1) {
                            var e = a.animation.effects.substring(d), f = /\(([^)]+)\)/.exec(e), g = f[1];
                            return {val: g}
                        }
                    }
                    return !0
                }
                return !1
            }, d = function (a, b) {
                return b ? "-" === a.charAt(0) ? a.substr(1, a.length) : "-" + a : a
            }, e = function (a, e) {
                for (var f = [["scale", ".01"], ["translateX", "20px"], ["translateY", "20px"], ["translateZ", "20px"], ["rotateX", "90deg"], ["rotateY", "90deg"], ["rotateZ", "180deg"]], g = 0; g < f.length; g++) {
                    var h = f[g][0], i = f[g][1], j = e && "scale" !== h;
                    b[a] += c(h) ? h + "(" + d(c(h, !0).val || i, j) + ") " : ""
                }
            };
            return b.opacity = c("fade") ? c("fade", !0).val || "0" : "1", e("transformIn"), a.animation.reverseOut ? e("transformOut", !0) : b.transformOut = b.transformIn, b.transition = {}, b.transition = a._getPrefixedCSS("transition", "all " + a.animation.duration + "ms " + a.animation.easing + ", opacity " + a.animation.duration + "ms linear"), a.animation.stagger = c("stagger") ? !0 : !1, a.animation.staggerDuration = parseInt(c("stagger") ? c("stagger", !0).val ? c("stagger", !0).val : 100 : 100), a._execFilter("_parseEffects", b)
        },
        _buildState: function (a) {
            var b = this, c = {};
            return b._execAction("_buildState", 0), c = {
                activeFilter: "" === b._activeFilter ? "none" : b._activeFilter,
                activeSort: a && b._newSortString ? b._newSortString : b._activeSort,
                fail: !b._$show.length && "" !== b._activeFilter,
                $targets: b._$targets,
                $show: b._$show,
                $hide: b._$hide,
                totalTargets: b._$targets.length,
                totalShow: b._$show.length,
                totalHide: b._$hide.length,
                display: a && b._newDisplay ? b._newDisplay : b.layout.display
            }, a ? b._execFilter("_buildState", c) : (b._state = c, b._execAction("_buildState", 1), void 0)
        },
        _goMix: function (a) {
            var b = this, c = function () {
                b._chrome && 31 === b._chrome && f(b._$parent[0]), b._setInter(), d()
            }, d = function () {
                var a = window.pageYOffset, c = window.pageXOffset;
                document.documentElement.scrollHeight, b._getInterMixData(), b._setFinal(), b._getFinalMixData(), window.pageYOffset !== a && window.scrollTo(c, a), b._prepTargets(), window.requestAnimationFrame ? requestAnimationFrame(e) : setTimeout(function () {
                        e()
                    }, 20)
            }, e = function () {
                b._animateTargets(), 0 === b._targetsBound && b._cleanUp()
            }, f = function (a) {
                var b = a.parentElement, c = document.createElement("div"), d = document.createDocumentFragment();
                b.insertBefore(c, a), d.appendChild(a), b.replaceChild(a, c)
            }, g = b._buildState(!0);
            b._execAction("_goMix", 0, arguments), !b.animation.duration && (a = !1), b._mixing = !0, b._$container.removeClass(b.layout.containerClassFail), "function" == typeof b.callbacks.onMixStart && b.callbacks.onMixStart.call(b._domNode, b._state, g, b), b._$container.trigger("mixStart", [b._state, g, b]), b._getOrigMixData(), a && !b._suckMode ? window.requestAnimationFrame ? requestAnimationFrame(c) : c() : b._cleanUp(), b._execAction("_goMix", 1, arguments)
        },
        _getTargetData: function (a, b) {
            var c, d = this;
            a.dataset[b + "PosX"] = a.offsetLeft, a.dataset[b + "PosY"] = a.offsetTop, d.animation.animateResizeTargets && (c = window.getComputedStyle(a), a.dataset[b + "MarginBottom"] = parseInt(c.marginBottom), a.dataset[b + "MarginRight"] = parseInt(c.marginRight), a.dataset[b + "Width"] = a.offsetWidth, a.dataset[b + "Height"] = a.offsetHeight)
        },
        _getOrigMixData: function () {
            var a = this, b = a._suckMode ? {boxSizing: ""} : window.getComputedStyle(a._$parent[0]), c = b.boxSizing || b[a._vendor + "BoxSizing"];
            a._incPadding = "border-box" === c, a._execAction("_getOrigMixData", 0), !a._suckMode && (a.effects = a._parseEffects()), a._$toHide = a._$hide.filter(":visible"), a._$toShow = a._$show.filter(":hidden"), a._$pre = a._$targets.filter(":visible"), a._startHeight = a._incPadding ? a._$parent.outerHeight() : a._$parent.height();
            for (var d = 0; d < a._$pre.length; d++) {
                var e = a._$pre[d];
                a._getTargetData(e, "orig")
            }
            a._execAction("_getOrigMixData", 1)
        },
        _setInter: function () {
            var a = this;
            a._execAction("_setInter", 0), a._changingLayout && a.animation.animateChangeLayout ? (a._$toShow.css("display", a._newDisplay), a._changingClass && a._$container.removeClass(a.layout.containerClass).addClass(a._newClass)) : a._$toShow.css("display", a.layout.display), a._execAction("_setInter", 1)
        },
        _getInterMixData: function () {
            var a = this;
            a._execAction("_getInterMixData", 0);
            for (var b = 0; b < a._$toShow.length; b++) {
                var c = a._$toShow[b];
                a._getTargetData(c, "inter")
            }
            for (var b = 0; b < a._$pre.length; b++) {
                var c = a._$pre[b];
                a._getTargetData(c, "inter")
            }
            a._execAction("_getInterMixData", 1)
        },
        _setFinal: function () {
            var a = this;
            a._execAction("_setFinal", 0), a._sorting && a._printSort(), a._$toHide.removeStyle("display"), a._changingLayout && a.animation.animateChangeLayout && a._$pre.css("display", a._newDisplay), a._execAction("_setFinal", 1)
        },
        _getFinalMixData: function () {
            var a = this;
            a._execAction("_getFinalMixData", 0);
            for (var b = 0; b < a._$toShow.length; b++) {
                var c = a._$toShow[b];
                a._getTargetData(c, "final")
            }
            for (var b = 0; b < a._$pre.length; b++) {
                var c = a._$pre[b];
                a._getTargetData(c, "final")
            }
            a._newHeight = a._incPadding ? a._$parent.outerHeight() : a._$parent.height(), a._sorting && a._printSort(!0), a._$toShow.removeStyle("display"), a._$pre.css("display", a.layout.display), a._changingClass && a.animation.animateChangeLayout && a._$container.removeClass(a._newClass).addClass(a.layout.containerClass), a._execAction("_getFinalMixData", 1)
        },
        _prepTargets: function () {
            var b = this, c = {
                _in: b._getPrefixedCSS("transform", b.effects.transformIn),
                _out: b._getPrefixedCSS("transform", b.effects.transformOut)
            };
            b._execAction("_prepTargets", 0), b.animation.animateResizeContainer && b._$parent.css("height", b._startHeight + "px");
            for (var d = 0; d < b._$toShow.length; d++) {
                var e = b._$toShow[d], f = a(e);
                e.style.opacity = b.effects.opacity, e.style.display = b._changingLayout && b.animation.animateChangeLayout ? b._newDisplay : b.layout.display, f.css(c._in), b.animation.animateResizeTargets && (e.style.width = e.dataset.finalWidth + "px", e.style.height = e.dataset.finalHeight + "px", e.style.marginRight = -(e.dataset.finalWidth - e.dataset.interWidth) + 1 * e.dataset.finalMarginRight + "px", e.style.marginBottom = -(e.dataset.finalHeight - e.dataset.interHeight) + 1 * e.dataset.finalMarginBottom + "px")
            }
            for (var d = 0; d < b._$pre.length; d++) {
                var e = b._$pre[d], f = a(e), g = {
                    x: e.dataset.origPosX - e.dataset.interPosX,
                    y: e.dataset.origPosY - e.dataset.interPosY
                }, c = b._getPrefixedCSS("transform", "translate(" + g.x + "px," + g.y + "px)");
                f.css(c), b.animation.animateResizeTargets && (e.style.width = e.dataset.origWidth + "px", e.style.height = e.dataset.origHeight + "px", e.dataset.origWidth - e.dataset.finalWidth && (e.style.marginRight = -(e.dataset.origWidth - e.dataset.interWidth) + 1 * e.dataset.origMarginRight + "px"), e.dataset.origHeight - e.dataset.finalHeight && (e.style.marginBottom = -(e.dataset.origHeight - e.dataset.interHeight) + 1 * e.dataset.origMarginBottom + "px"))
            }
            b._execAction("_prepTargets", 1)
        },
        _animateTargets: function () {
            var b = this;
            b._execAction("_animateTargets", 0), b._targetsDone = 0, b._targetsBound = 0, b._$parent.css(b._getPrefixedCSS("perspective", b.animation.perspectiveDistance + "px")).css(b._getPrefixedCSS("perspective-origin", b.animation.perspectiveOrigin)), b.animation.animateResizeContainer && b._$parent.css(b._getPrefixedCSS("transition", "height " + b.animation.duration + "ms ease")).css("height", b._newHeight + "px");
            for (var c = 0; c < b._$toShow.length; c++) {
                var d = b._$toShow[c], e = a(d), f = {
                    x: d.dataset.finalPosX - d.dataset.interPosX,
                    y: d.dataset.finalPosY - d.dataset.interPosY
                }, g = b._getDelay(c), h = {};
                d.style.opacity = "";
                for (var i = 0; 2 > i; i++) {
                    var j = 0 === i ? j = b._prefix : "";
                    b._ff && b._ff <= 20 && (h[j + "transition-property"] = "all", h[j + "transition-timing-function"] = b.animation.easing + "ms", h[j + "transition-duration"] = b.animation.duration + "ms"), h[j + "transition-delay"] = g + "ms", h[j + "transform"] = "translate(" + f.x + "px," + f.y + "px)"
                }
                (b.effects.transform || b.effects.opacity) && b._bindTargetDone(e), b._ff && b._ff <= 20 ? e.css(h) : e.css(b.effects.transition).css(h)
            }
            for (var c = 0; c < b._$pre.length; c++) {
                var d = b._$pre[c], e = a(d), f = {
                    x: d.dataset.finalPosX - d.dataset.interPosX,
                    y: d.dataset.finalPosY - d.dataset.interPosY
                }, g = b._getDelay(c);
                (d.dataset.finalPosX !== d.dataset.origPosX || d.dataset.finalPosY !== d.dataset.origPosY) && b._bindTargetDone(e), e.css(b._getPrefixedCSS("transition", "all " + b.animation.duration + "ms " + b.animation.easing + " " + g + "ms")), e.css(b._getPrefixedCSS("transform", "translate(" + f.x + "px," + f.y + "px)")), b.animation.animateResizeTargets && (d.dataset.origWidth - d.dataset.finalWidth && 1 * d.dataset.finalWidth && (d.style.width = d.dataset.finalWidth + "px", d.style.marginRight = -(d.dataset.finalWidth - d.dataset.interWidth) + 1 * d.dataset.finalMarginRight + "px"), d.dataset.origHeight - d.dataset.finalHeight && 1 * d.dataset.finalHeight && (d.style.height = d.dataset.finalHeight + "px", d.style.marginBottom = -(d.dataset.finalHeight - d.dataset.interHeight) + 1 * d.dataset.finalMarginBottom + "px"))
            }
            b._changingClass && b._$container.removeClass(b.layout.containerClass).addClass(b._newClass);
            for (var c = 0; c < b._$toHide.length; c++) {
                for (var d = b._$toHide[c], e = a(d), g = b._getDelay(c), k = {}, i = 0; 2 > i; i++) {
                    var j = 0 === i ? j = b._prefix : "";
                    k[j + "transition-delay"] = g + "ms", k[j + "transform"] = b.effects.transformOut, k.opacity = b.effects.opacity
                }
                e.css(b.effects.transition).css(k), (b.effects.transform || b.effects.opacity) && b._bindTargetDone(e)
            }
            b._execAction("_animateTargets", 1)
        },
        _bindTargetDone: function (b) {
            var c = this, d = b[0];
            c._execAction("_bindTargetDone", 0, arguments), d.dataset.bound || (d.dataset.bound = !0, c._targetsBound++, b.on("webkitTransitionEnd.mixItUp transitionend.mixItUp", function (e) {
                (e.originalEvent.propertyName.indexOf("transform") > -1 || e.originalEvent.propertyName.indexOf("opacity") > -1) && a(e.originalEvent.target).is(c.selectors.target) && (b.off(".mixItUp"), delete d.dataset.bound, c._targetDone())
            })), c._execAction("_bindTargetDone", 1, arguments)
        },
        _targetDone: function () {
            var a = this;
            a._execAction("_targetDone", 0), a._targetsDone++, a._targetsDone === a._targetsBound && a._cleanUp(), a._execAction("_targetDone", 1)
        },
        _cleanUp: function () {
            var b = this, c = b.animation.animateResizeTargets ? "transform opacity width height margin-bottom margin-right" : "transform opacity";
            unBrake = function () {
                b._$targets.removeStyle("transition", b._prefix)
            }, b._execAction("_cleanUp", 0), b._changingLayout ? b._$show.css("display", b._newDisplay) : b._$show.css("display", b.layout.display), b._$targets.css(b._brake), b._$targets.removeStyle(c, b._prefix).removeAttr("data-inter-pos-x data-inter-pos-y data-final-pos-x data-final-pos-y data-orig-pos-x data-orig-pos-y data-orig-height data-orig-width data-final-height data-final-width data-inter-width data-inter-height data-orig-margin-right data-orig-margin-bottom data-inter-margin-right data-inter-margin-bottom data-final-margin-right data-final-margin-bottom"), b._$hide.removeStyle("display"), b._$parent.removeStyle("height transition perspective-distance perspective perspective-origin-x perspective-origin-y perspective-origin perspectiveOrigin", b._prefix), b._sorting && (b._printSort(), b._activeSort = b._newSortString, b._sorting = !1), b._changingLayout && (b._changingDisplay && (b.layout.display = b._newDisplay, b._changingDisplay = !1), b._changingClass && (b._$parent.removeClass(b.layout.containerClass).addClass(b._newClass), b.layout.containerClass = b._newClass, b._changingClass = !1), b._changingLayout = !1), b._refresh(), b._buildState(), b._state.fail && b._$container.addClass(b.layout.containerClassFail), b._$show = a(), b._$hide = a(), window.requestAnimationFrame && requestAnimationFrame(unBrake), b._mixing = !1, "function" == typeof b.callbacks._user && b.callbacks._user.call(b._domNode, b._state, b), "function" == typeof b.callbacks.onMixEnd && b.callbacks.onMixEnd.call(b._domNode, b._state, b), b._$container.trigger("mixEnd", [b._state, b]), b._state.fail && ("function" == typeof b.callbacks.onMixFail && b.callbacks.onMixFail.call(b._domNode, b._state, b), b._$container.trigger("mixFail", [b._state, b])), b._loading && ("function" == typeof b.callbacks.onMixLoad && b.callbacks.onMixLoad.call(b._domNode, b._state, b), b._$container.trigger("mixLoad", [b._state, b])), b._queue.length && (b._execAction("_queue", 0), b.multiMix(b._queue[0][0], b._queue[0][1], b._queue[0][2]), b._queue.splice(0, 1)), b._execAction("_cleanUp", 1), b._loading = !1
        },
        _getPrefixedCSS: function (a, b, c) {
            var d = this, e = {};
            for (i = 0; 2 > i; i++) {
                var f = 0 === i ? d._prefix : "";
                e[f + a] = c ? f + b : b
            }
            return d._execFilter("_getPrefixedCSS", e, arguments)
        },
        _getDelay: function (a) {
            var b = this, c = "function" == typeof b.animation.staggerSequence ? b.animation.staggerSequence.call(b._domNode, a, b._state) : a, d = b.animation.stagger ? c * b.animation.staggerDuration : 0;
            return b._execFilter("_getDelay", d, arguments)
        },
        _parseMultiMixArgs: function (a) {
            for (var b = this, c = {
                command: null,
                animate: b.animation.enable,
                callback: null
            }, d = 0; d < a.length; d++) {
                var e = a[d];
                null !== e && ("object" == typeof e || "string" == typeof e ? c.command = e : "boolean" == typeof e ? c.animate = e : "function" == typeof e && (c.callback = e))
            }
            return b._execFilter("_parseMultiMixArgs", c, arguments)
        },
        _parseInsertArgs: function (b) {
            for (var c = this, d = {
                index: 0,
                $object: a(),
                multiMix: {filter: c._state.activeFilter},
                callback: null
            }, e = 0; e < b.length; e++) {
                var f = b[e];
                "number" == typeof f ? d.index = f : "object" == typeof f && f instanceof a ? d.$object = f : "object" == typeof f && c._helpers._isElement(f) ? d.$object = a(f) : "object" == typeof f && null !== f ? d.multiMix = f : "boolean" != typeof f || f ? "function" == typeof f && (d.callback = f) : d.multiMix = !1
            }
            return c._execFilter("_parseInsertArgs", d, arguments)
        },
        _execAction: function (a, b, c) {
            var d = this, e = b ? "post" : "pre";
            if (!d._actions.isEmptyObject && d._actions.hasOwnProperty(a))for (var f in d._actions[a][e])d._actions[a][e][f].call(d, c)
        },
        _execFilter: function (a, b, c) {
            var d = this;
            if (d._filters.isEmptyObject || !d._filters.hasOwnProperty(a))return b;
            for (var e in d._filters[a])return d._filters[a][e].call(d, c)
        },
        _helpers: {
            _camelCase: function (a) {
                return a.replace(/-([a-z])/g, function (a) {
                    return a[1].toUpperCase()
                })
            }, _isElement: function (a) {
                return window.HTMLElement ? a instanceof HTMLElement : null !== a && 1 === a.nodeType && "string" === a.nodeName
            }
        },
        isMixing: function () {
            var a = this;
            return a._execFilter("isMixing", a._mixing)
        },
        filter: function () {
            var a = this, b = a._parseMultiMixArgs(arguments);
            a._clicking && (a._toggleString = ""), a.multiMix({filter: b.command}, b.animate, b.callback)
        },
        sort: function () {
            var a = this, b = a._parseMultiMixArgs(arguments);
            a.multiMix({sort: b.command}, b.animate, b.callback)
        },
        changeLayout: function () {
            var a = this, b = a._parseMultiMixArgs(arguments);
            a.multiMix({changeLayout: b.command}, b.animate, b.callback)
        },
        multiMix: function () {
            var a = this, c = a._parseMultiMixArgs(arguments);
            if (a._execAction("multiMix", 0, arguments), a._mixing) a.animation.queue && a._queue.length < a.animation.queueLimit ? (a._queue.push(arguments), a.controls.enable && !a._clicking && a._updateControls(c.command), a._execAction("multiMixQueue", 1, arguments)) : ("function" == typeof a.callbacks.onMixBusy && a.callbacks.onMixBusy.call(a._domNode, a._state, a), a._$container.trigger("mixBusy", [a._state, a]), a._execAction("multiMixBusy", 1, arguments)); else {
                a.controls.enable && !a._clicking && (a.controls.toggleFilterButtons && a._buildToggleArray(), a._updateControls(c.command, a.controls.toggleFilterButtons)), a._queue.length < 2 && (a._clicking = !1), delete a.callbacks._user, c.callback && (a.callbacks._user = c.callback);
                var d = c.command.sort, e = c.command.filter, f = c.command.changeLayout;
                a._refresh(), d && (a._newSort = a._parseSort(d), a._newSortString = d, a._sorting = !0, a._sort()), e !== b && (e = "all" === e ? a.selectors.target : e, a._activeFilter = e), a._filter(), f && (a._newDisplay = "string" == typeof f ? f : f.display || a.layout.display, a._newClass = f.containerClass || "", (a._newDisplay !== a.layout.display || a._newClass !== a.layout.containerClass) && (a._changingLayout = !0, a._changingClass = a._newClass !== a.layout.containerClass, a._changingDisplay = a._newDisplay !== a.layout.display)), a._$targets.css(a._brake), a._goMix(c.animate ^ a.animation.enable ? c.animate : a.animation.enable), a._execAction("multiMix", 1, arguments)
            }
        },
        insert: function () {
            var a = this, b = a._parseInsertArgs(arguments), c = "function" == typeof b.callback ? b.callback : null, d = document.createDocumentFragment(), e = function () {
                return a._refresh(), a._$targets.length ? b.index < a._$targets.length || !a._$targets.length ? a._$targets[b.index] : a._$targets[a._$targets.length - 1].nextElementSibling : a._$parent[0].children[0]
            }();
            if (a._execAction("insert", 0, arguments), b.$object) {
                for (var f = 0; f < b.$object.length; f++) {
                    var g = b.$object[f];
                    d.appendChild(g), d.appendChild(document.createTextNode(" "))
                }
                a._$parent[0].insertBefore(d, e)
            }
            a._execAction("insert", 1, arguments), "object" == typeof b.multiMix && a.multiMix(b.multiMix, c)
        },
        prepend: function () {
            var a = this, b = a._parseInsertArgs(arguments);
            a.insert(0, b.$object, b.multiMix, b.callback)
        },
        append: function () {
            var a = this, b = a._parseInsertArgs(arguments);
            a.insert(a._state.totalTargets, b.$object, b.multiMix, b.callback)
        },
        getOption: function (a) {
            var c = this, d = function (a, c) {
                for (var d = c.split("."), e = d.pop(), f = d.length, g = 1, h = d[0] || c; (a = a[h]) && f > g;)h = d[g], g++;
                return a !== b ? a[e] !== b ? a[e] : a : void 0
            };
            return a ? c._execFilter("getOption", d(c, a), arguments) : c
        },
        setOptions: function (b) {
            var c = this;
            c._execAction("setOptions", 0, arguments), "object" == typeof b && a.extend(!0, c, b), c._execAction("setOptions", 1, arguments)
        },
        getState: function () {
            var a = this;
            return a._execFilter("getState", a._state, a)
        },
        forceRefresh: function () {
            var a = this;
            a._refresh(!1, !0)
        },
        destroy: function (b) {
            var c = this;
            c._execAction("destroy", 0, arguments), c._$body.add(a(c.selectors.sort)).add(a(c.selectors.filter)).off(".mixItUp");
            for (var d = 0; d < c._$targets.length; d++) {
                var e = c._$targets[d];
                b && (e.style.display = ""), delete e.mixParent
            }
            c._execAction("destroy", 1, arguments), delete a.MixItUp.prototype._instances[c._id]
        }
    }, a.fn.mixItUp = function () {
        var c, d = arguments, e = [], f = function (b, c) {
            var d = new a.MixItUp, e = function () {
                return ("00000" + (16777216 * Math.random() << 0).toString(16)).substr(-6).toUpperCase()
            };
            d._execAction("_instantiate", 0, arguments), b.id = b.id ? b.id : "MixItUp" + e(), d._instances[b.id] || (d._instances[b.id] = d, d._init(b, c)), d._execAction("_instantiate", 1, arguments)
        };
        return c = this.each(function () {
            if (d && "string" == typeof d[0]) {
                var c = a.MixItUp.prototype._instances[this.id];
                if ("isLoaded" === d[0]) e.push(c ? !0 : !1); else {
                    var g = c[d[0]](d[1], d[2], d[3]);
                    g !== b && e.push(g)
                }
            } else f(this, d[0])
        }), e.length ? e.length > 1 ? e : e[0] : c
    }, a.fn.removeStyle = function (c, d) {
        return d = d ? d : "", this.each(function () {
            for (var e = this, f = c.split(" "), g = 0; g < f.length; g++)for (var h = 0; 4 > h; h++) {
                switch (h) {
                    case 0:
                        var i = f[g];
                        break;
                    case 1:
                        var i = a.MixItUp.prototype._helpers._camelCase(i);
                        break;
                    case 2:
                        var i = d + f[g];
                        break;
                    case 3:
                        var i = a.MixItUp.prototype._helpers._camelCase(d + f[g])
                }
                if (e.style[i] !== b && "unknown" != typeof e.style[i] && e.style[i].length > 0 && (e.style[i] = ""), !d && 1 === h)break
            }
            e.attributes && e.attributes.style && e.attributes.style !== b && "" === e.attributes.style.value && e.attributes.removeNamedItem("style")
        })
    }
}(jQuery);

(function ($) {
    $.fn.countTo = function (options) {
        options = options || {};

        return $(this).each(function () {
            // set options for current element
            var settings = $.extend({}, $.fn.countTo.defaults, {
                from: $(this).data('from'),
                to: $(this).data('to'),
                speed: $(this).data('speed'),
                refreshInterval: $(this).data('refresh-interval'),
                decimals: $(this).data('decimals')
            }, options);

            // how many times to update the value, and how much to increment the value on each update
            var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;

            // references & variables that will change with each update
            var self = this,
                $self = $(this),
                loopCount = 0,
                value = settings.from,
                data = $self.data('countTo') || {};

            $self.data('countTo', data);

            // if an existing interval can be found, clear it first
            if (data.interval) {
                clearInterval(data.interval);
            }
            data.interval = setInterval(updateTimer, settings.refreshInterval);

            // initialize the element with the starting value
            render(value);

            function updateTimer() {
                value += increment;
                loopCount++;

                render(value);

                if (typeof(settings.onUpdate) == 'function') {
                    settings.onUpdate.call(self, value);
                }

                if (loopCount >= loops) {
                    // remove the interval
                    $self.removeData('countTo');
                    clearInterval(data.interval);
                    value = settings.to;

                    if (typeof(settings.onComplete) == 'function') {
                        settings.onComplete.call(self, value);
                    }
                }
            }

            function render(value) {
                var formattedValue = settings.formatter.call(self, value, settings);
                $self.text(formattedValue);
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0,               // the number the element should start at
        to: 0,                 // the number the element should end at
        speed: 1000,           // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,           // the number of decimal places to show
        formatter: formatter,  // handler for formatting the value before rendering
        onUpdate: null,        // callback method for every time the element is updated
        onComplete: null       // callback method for when the element finishes updating
    };

    function formatter(value, settings) {
        return value.toFixed(settings.decimals);
    }
}(jQuery));


"function" !== typeof Object.create && (Object.create = function (f) {
    function g() {
    }

    g.prototype = f;
    return new g
});
(function (f, g, k) {
    var l = {
        init: function (a, b) {
            this.$elem = f(b);
            this.options = f.extend({}, f.fn.owlCarousel.options, this.$elem.data(), a);
            this.userOptions = a;
            this.loadContent()
        }, loadContent: function () {
            function a(a) {
                var d, e = "";
                if ("function" === typeof b.options.jsonSuccess) b.options.jsonSuccess.apply(this, [a]); else {
                    for (d in a.owl)a.owl.hasOwnProperty(d) && (e += a.owl[d].item);
                    b.$elem.html(e)
                }
                b.logIn()
            }

            var b = this, e;
            "function" === typeof b.options.beforeInit && b.options.beforeInit.apply(this, [b.$elem]);
            "string" === typeof b.options.jsonPath ?
                (e = b.options.jsonPath, f.getJSON(e, a)) : b.logIn()
        }, logIn: function () {
            this.$elem.data("owl-originalStyles", this.$elem.attr("style"));
            this.$elem.data("owl-originalClasses", this.$elem.attr("class"));
            this.$elem.css({opacity: 0});
            this.orignalItems = this.options.items;
            this.checkBrowser();
            this.wrapperWidth = 0;
            this.checkVisible = null;
            this.setVars()
        }, setVars: function () {
            if (0 === this.$elem.children().length)return !1;
            this.baseClass();
            this.eventTypes();
            this.$userItems = this.$elem.children();
            this.itemsAmount = this.$userItems.length;
            this.wrapItems();
            this.$owlItems = this.$elem.find(".owl-item");
            this.$owlWrapper = this.$elem.find(".owl-wrapper");
            this.playDirection = "next";
            this.prevItem = 0;
            this.prevArr = [0];
            this.currentItem = 0;
            this.customEvents();
            this.onStartup()
        }, onStartup: function () {
            this.updateItems();
            this.calculateAll();
            this.buildControls();
            this.updateControls();
            this.response();
            this.moveEvents();
            this.stopOnHover();
            this.owlStatus();
            !1 !== this.options.transitionStyle && this.transitionTypes(this.options.transitionStyle);
            !0 === this.options.autoPlay &&
            (this.options.autoPlay = 5E3);
            this.play();
            this.$elem.find(".owl-wrapper").css("display", "block");
            this.$elem.is(":visible") ? this.$elem.css("opacity", 1) : this.watchVisibility();
            this.onstartup = !1;
            this.eachMoveUpdate();
            "function" === typeof this.options.afterInit && this.options.afterInit.apply(this, [this.$elem])
        }, eachMoveUpdate: function () {
            !0 === this.options.lazyLoad && this.lazyLoad();
            !0 === this.options.autoHeight && this.autoHeight();
            this.onVisibleItems();
            "function" === typeof this.options.afterAction && this.options.afterAction.apply(this,
                [this.$elem])
        }, updateVars: function () {
            "function" === typeof this.options.beforeUpdate && this.options.beforeUpdate.apply(this, [this.$elem]);
            this.watchVisibility();
            this.updateItems();
            this.calculateAll();
            this.updatePosition();
            this.updateControls();
            this.eachMoveUpdate();
            "function" === typeof this.options.afterUpdate && this.options.afterUpdate.apply(this, [this.$elem])
        }, reload: function () {
            var a = this;
            g.setTimeout(function () {
                a.updateVars()
            }, 0)
        }, watchVisibility: function () {
            var a = this;
            if (!1 === a.$elem.is(":visible")) a.$elem.css({opacity: 0}),
                g.clearInterval(a.autoPlayInterval), g.clearInterval(a.checkVisible); else return !1;
            a.checkVisible = g.setInterval(function () {
                a.$elem.is(":visible") && (a.reload(), a.$elem.animate({opacity: 1}, 200), g.clearInterval(a.checkVisible))
            }, 500)
        }, wrapItems: function () {
            this.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>');
            this.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">');
            this.wrapperOuter = this.$elem.find(".owl-wrapper-outer");
            this.$elem.css("display", "block")
        },
        baseClass: function () {
            var a = this.$elem.hasClass(this.options.baseClass), b = this.$elem.hasClass(this.options.theme);
            a || this.$elem.addClass(this.options.baseClass);
            b || this.$elem.addClass(this.options.theme)
        }, updateItems: function () {
            var a, b;
            if (!1 === this.options.responsive)return !1;
            if (!0 === this.options.singleItem)return this.options.items = this.orignalItems = 1, this.options.itemsCustom = !1, this.options.itemsDesktop = !1, this.options.itemsDesktopSmall = !1, this.options.itemsTablet = !1, this.options.itemsTabletSmall = !1, this.options.itemsMobile = !1;
            a = f(this.options.responsiveBaseWidth).width();
            a > (this.options.itemsDesktop[0] || this.orignalItems) && (this.options.items = this.orignalItems);
            if (!1 !== this.options.itemsCustom)for (this.options.itemsCustom.sort(function (a, b) {
                return a[0] - b[0]
            }), b = 0; b < this.options.itemsCustom.length; b += 1)this.options.itemsCustom[b][0] <= a && (this.options.items = this.options.itemsCustom[b][1]); else a <= this.options.itemsDesktop[0] && !1 !== this.options.itemsDesktop && (this.options.items = this.options.itemsDesktop[1]),
            a <= this.options.itemsDesktopSmall[0] && !1 !== this.options.itemsDesktopSmall && (this.options.items = this.options.itemsDesktopSmall[1]), a <= this.options.itemsTablet[0] && !1 !== this.options.itemsTablet && (this.options.items = this.options.itemsTablet[1]), a <= this.options.itemsTabletSmall[0] && !1 !== this.options.itemsTabletSmall && (this.options.items = this.options.itemsTabletSmall[1]), a <= this.options.itemsMobile[0] && !1 !== this.options.itemsMobile && (this.options.items = this.options.itemsMobile[1]);
            this.options.items > this.itemsAmount &&
            !0 === this.options.itemsScaleUp && (this.options.items = this.itemsAmount)
        }, response: function () {
            var a = this, b, e;
            if (!0 !== a.options.responsive)return !1;
            e = f(g).width();
            a.resizer = function () {
                f(g).width() !== e && (!1 !== a.options.autoPlay && g.clearInterval(a.autoPlayInterval), g.clearTimeout(b), b = g.setTimeout(function () {
                    e = f(g).width();
                    a.updateVars()
                }, a.options.responsiveRefreshRate))
            };
            f(g).resize(a.resizer)
        }, updatePosition: function () {
            this.jumpTo(this.currentItem);
            !1 !== this.options.autoPlay && this.checkAp()
        }, appendItemsSizes: function () {
            var a =
                this, b = 0, e = a.itemsAmount - a.options.items;
            a.$owlItems.each(function (c) {
                var d = f(this);
                d.css({width: a.itemWidth}).data("owl-item", Number(c));
                if (0 === c % a.options.items || c === e) c > e || (b += 1);
                d.data("owl-roundPages", b)
            })
        }, appendWrapperSizes: function () {
            this.$owlWrapper.css({width: this.$owlItems.length * this.itemWidth * 2, left: 0});
            this.appendItemsSizes()
        }, calculateAll: function () {
            this.calculateWidth();
            this.appendWrapperSizes();
            this.loops();
            this.max()
        }, calculateWidth: function () {
            this.itemWidth = Math.round(this.$elem.width() /
                this.options.items)
        }, max: function () {
            var a = -1 * (this.itemsAmount * this.itemWidth - this.options.items * this.itemWidth);
            this.options.items > this.itemsAmount ? this.maximumPixels = a = this.maximumItem = 0 : (this.maximumItem = this.itemsAmount - this.options.items, this.maximumPixels = a);
            return a
        }, min: function () {
            return 0
        }, loops: function () {
            var a = 0, b = 0, e, c;
            this.positionsInArray = [0];
            this.pagesInArray = [];
            for (e = 0; e < this.itemsAmount; e += 1)b += this.itemWidth, this.positionsInArray.push(-b), !0 === this.options.scrollPerPage && (c = f(this.$owlItems[e]),
                c = c.data("owl-roundPages"), c !== a && (this.pagesInArray[a] = this.positionsInArray[e], a = c))
        }, buildControls: function () {
            if (!0 === this.options.navigation || !0 === this.options.pagination) this.owlControls = f('<div class="owl-controls"/>').toggleClass("clickable", !this.browser.isTouch).appendTo(this.$elem);
            !0 === this.options.pagination && this.buildPagination();
            !0 === this.options.navigation && this.buildButtons()
        }, buildButtons: function () {
            var a = this, b = f('<div class="owl-buttons"/>');
            a.owlControls.append(b);
            a.buttonPrev =
                f("<div/>", {"class": "owl-prev", html: a.options.navigationText[0] || ""});
            a.buttonNext = f("<div/>", {"class": "owl-next", html: a.options.navigationText[1] || ""});
            b.append(a.buttonPrev).append(a.buttonNext);
            b.on("touchstart.owlControls mousedown.owlControls", 'div[class^="owl"]', function (a) {
                a.preventDefault()
            });
            b.on("touchend.owlControls mouseup.owlControls", 'div[class^="owl"]', function (b) {
                b.preventDefault();
                f(this).hasClass("owl-next") ? a.next() : a.prev()
            })
        }, buildPagination: function () {
            var a = this;
            a.paginationWrapper =
                f('<div class="owl-pagination"/>');
            a.owlControls.append(a.paginationWrapper);
            a.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (b) {
                b.preventDefault();
                Number(f(this).data("owl-page")) !== a.currentItem && a.goTo(Number(f(this).data("owl-page")), !0)
            })
        }, updatePagination: function () {
            var a, b, e, c, d, g;
            if (!1 === this.options.pagination)return !1;
            this.paginationWrapper.html("");
            a = 0;
            b = this.itemsAmount - this.itemsAmount % this.options.items;
            for (c = 0; c < this.itemsAmount; c += 1)0 === c % this.options.items &&
            (a += 1, b === c && (e = this.itemsAmount - this.options.items), d = f("<div/>", {"class": "owl-page"}), g = f("<span></span>", {
                text: !0 === this.options.paginationNumbers ? a : "",
                "class": !0 === this.options.paginationNumbers ? "owl-numbers" : ""
            }), d.append(g), d.data("owl-page", b === c ? e : c), d.data("owl-roundPages", a), this.paginationWrapper.append(d));
            this.checkPagination()
        }, checkPagination: function () {
            var a = this;
            if (!1 === a.options.pagination)return !1;
            a.paginationWrapper.find(".owl-page").each(function () {
                f(this).data("owl-roundPages") ===
                f(a.$owlItems[a.currentItem]).data("owl-roundPages") && (a.paginationWrapper.find(".owl-page").removeClass("active"), f(this).addClass("active"))
            })
        }, checkNavigation: function () {
            if (!1 === this.options.navigation)return !1;
            !1 === this.options.rewindNav && (0 === this.currentItem && 0 === this.maximumItem ? (this.buttonPrev.addClass("disabled"), this.buttonNext.addClass("disabled")) : 0 === this.currentItem && 0 !== this.maximumItem ? (this.buttonPrev.addClass("disabled"), this.buttonNext.removeClass("disabled")) : this.currentItem ===
                    this.maximumItem ? (this.buttonPrev.removeClass("disabled"), this.buttonNext.addClass("disabled")) : 0 !== this.currentItem && this.currentItem !== this.maximumItem && (this.buttonPrev.removeClass("disabled"), this.buttonNext.removeClass("disabled")))
        }, updateControls: function () {
            this.updatePagination();
            this.checkNavigation();
            this.owlControls && (this.options.items >= this.itemsAmount ? this.owlControls.hide() : this.owlControls.show())
        }, destroyControls: function () {
            this.owlControls && this.owlControls.remove()
        }, next: function (a) {
            if (this.isTransition)return !1;
            this.currentItem += !0 === this.options.scrollPerPage ? this.options.items : 1;
            if (this.currentItem > this.maximumItem + (!0 === this.options.scrollPerPage ? this.options.items - 1 : 0))if (!0 === this.options.rewindNav) this.currentItem = 0, a = "rewind"; else return this.currentItem = this.maximumItem, !1;
            this.goTo(this.currentItem, a)
        }, prev: function (a) {
            if (this.isTransition)return !1;
            this.currentItem = !0 === this.options.scrollPerPage && 0 < this.currentItem && this.currentItem < this.options.items ? 0 : this.currentItem - (!0 === this.options.scrollPerPage ?
                    this.options.items : 1);
            if (0 > this.currentItem)if (!0 === this.options.rewindNav) this.currentItem = this.maximumItem, a = "rewind"; else return this.currentItem = 0, !1;
            this.goTo(this.currentItem, a)
        }, goTo: function (a, b, e) {
            var c = this;
            if (c.isTransition)return !1;
            "function" === typeof c.options.beforeMove && c.options.beforeMove.apply(this, [c.$elem]);
            a >= c.maximumItem ? a = c.maximumItem : 0 >= a && (a = 0);
            c.currentItem = c.owl.currentItem = a;
            if (!1 !== c.options.transitionStyle && "drag" !== e && 1 === c.options.items && !0 === c.browser.support3d)return c.swapSpeed(0),
                !0 === c.browser.support3d ? c.transition3d(c.positionsInArray[a]) : c.css2slide(c.positionsInArray[a], 1), c.afterGo(), c.singleItemTransition(), !1;
            a = c.positionsInArray[a];
            !0 === c.browser.support3d ? (c.isCss3Finish = !1, !0 === b ? (c.swapSpeed("paginationSpeed"), g.setTimeout(function () {
                        c.isCss3Finish = !0
                    }, c.options.paginationSpeed)) : "rewind" === b ? (c.swapSpeed(c.options.rewindSpeed), g.setTimeout(function () {
                            c.isCss3Finish = !0
                        }, c.options.rewindSpeed)) : (c.swapSpeed("slideSpeed"), g.setTimeout(function () {
                                c.isCss3Finish = !0
                            },
                            c.options.slideSpeed)), c.transition3d(a)) : !0 === b ? c.css2slide(a, c.options.paginationSpeed) : "rewind" === b ? c.css2slide(a, c.options.rewindSpeed) : c.css2slide(a, c.options.slideSpeed);
            c.afterGo()
        }, jumpTo: function (a) {
            "function" === typeof this.options.beforeMove && this.options.beforeMove.apply(this, [this.$elem]);
            a >= this.maximumItem || -1 === a ? a = this.maximumItem : 0 >= a && (a = 0);
            this.swapSpeed(0);
            !0 === this.browser.support3d ? this.transition3d(this.positionsInArray[a]) : this.css2slide(this.positionsInArray[a], 1);
            this.currentItem =
                this.owl.currentItem = a;
            this.afterGo()
        }, afterGo: function () {
            this.prevArr.push(this.currentItem);
            this.prevItem = this.owl.prevItem = this.prevArr[this.prevArr.length - 2];
            this.prevArr.shift(0);
            this.prevItem !== this.currentItem && (this.checkPagination(), this.checkNavigation(), this.eachMoveUpdate(), !1 !== this.options.autoPlay && this.checkAp());
            "function" === typeof this.options.afterMove && this.prevItem !== this.currentItem && this.options.afterMove.apply(this, [this.$elem])
        }, stop: function () {
            this.apStatus = "stop";
            g.clearInterval(this.autoPlayInterval)
        },
        checkAp: function () {
            "stop" !== this.apStatus && this.play()
        }, play: function () {
            var a = this;
            a.apStatus = "play";
            if (!1 === a.options.autoPlay)return !1;
            g.clearInterval(a.autoPlayInterval);
            a.autoPlayInterval = g.setInterval(function () {
                a.next(!0)
            }, a.options.autoPlay)
        }, swapSpeed: function (a) {
            "slideSpeed" === a ? this.$owlWrapper.css(this.addCssSpeed(this.options.slideSpeed)) : "paginationSpeed" === a ? this.$owlWrapper.css(this.addCssSpeed(this.options.paginationSpeed)) : "string" !== typeof a && this.$owlWrapper.css(this.addCssSpeed(a))
        },
        addCssSpeed: function (a) {
            return {
                "-webkit-transition": "all " + a + "ms ease",
                "-moz-transition": "all " + a + "ms ease",
                "-o-transition": "all " + a + "ms ease",
                transition: "all " + a + "ms ease"
            }
        }, removeTransition: function () {
            return {"-webkit-transition": "", "-moz-transition": "", "-o-transition": "", transition: ""}
        }, doTranslate: function (a) {
            return {
                "-webkit-transform": "translate3d(" + a + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + a + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + a + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" +
                a + "px, 0px, 0px)",
                transform: "translate3d(" + a + "px, 0px,0px)"
            }
        }, transition3d: function (a) {
            this.$owlWrapper.css(this.doTranslate(a))
        }, css2move: function (a) {
            this.$owlWrapper.css({left: a})
        }, css2slide: function (a, b) {
            var e = this;
            e.isCssFinish = !1;
            e.$owlWrapper.stop(!0, !0).animate({left: a}, {
                duration: b || e.options.slideSpeed, complete: function () {
                    e.isCssFinish = !0
                }
            })
        }, checkBrowser: function () {
            var a = k.createElement("div");
            a.style.cssText = "  -moz-transform:translate3d(0px, 0px, 0px); -ms-transform:translate3d(0px, 0px, 0px); -o-transform:translate3d(0px, 0px, 0px); -webkit-transform:translate3d(0px, 0px, 0px); transform:translate3d(0px, 0px, 0px)";
            a = a.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g);
            this.browser = {
                support3d: null !== a && 1 === a.length,
                isTouch: "ontouchstart" in g || g.navigator.msMaxTouchPoints
            }
        }, moveEvents: function () {
            if (!1 !== this.options.mouseDrag || !1 !== this.options.touchDrag) this.gestures(), this.disabledEvents()
        }, eventTypes: function () {
            var a = ["s", "e", "x"];
            this.ev_types = {};
            !0 === this.options.mouseDrag && !0 === this.options.touchDrag ? a = ["touchstart.owl mousedown.owl", "touchmove.owl mousemove.owl", "touchend.owl touchcancel.owl mouseup.owl"] :
                !1 === this.options.mouseDrag && !0 === this.options.touchDrag ? a = ["touchstart.owl", "touchmove.owl", "touchend.owl touchcancel.owl"] : !0 === this.options.mouseDrag && !1 === this.options.touchDrag && (a = ["mousedown.owl", "mousemove.owl", "mouseup.owl"]);
            this.ev_types.start = a[0];
            this.ev_types.move = a[1];
            this.ev_types.end = a[2]
        }, disabledEvents: function () {
            this.$elem.on("dragstart.owl", function (a) {
                a.preventDefault()
            });
            this.$elem.on("mousedown.disableTextSelect", function (a) {
                return f(a.target).is("input, textarea, select, option")
            })
        },
        gestures: function () {
            function a(a) {
                if (void 0 !== a.touches)return {x: a.touches[0].pageX, y: a.touches[0].pageY};
                if (void 0 === a.touches) {
                    if (void 0 !== a.pageX)return {x: a.pageX, y: a.pageY};
                    if (void 0 === a.pageX)return {x: a.clientX, y: a.clientY}
                }
            }

            function b(a) {
                "on" === a ? (f(k).on(d.ev_types.move, e), f(k).on(d.ev_types.end, c)) : "off" === a && (f(k).off(d.ev_types.move), f(k).off(d.ev_types.end))
            }

            function e(b) {
                b = b.originalEvent || b || g.event;
                d.newPosX = a(b).x - h.offsetX;
                d.newPosY = a(b).y - h.offsetY;
                d.newRelativeX = d.newPosX - h.relativePos;
                "function" === typeof d.options.startDragging && !0 !== h.dragging && 0 !== d.newRelativeX && (h.dragging = !0, d.options.startDragging.apply(d, [d.$elem]));
                (8 < d.newRelativeX || -8 > d.newRelativeX) && !0 === d.browser.isTouch && (void 0 !== b.preventDefault ? b.preventDefault() : b.returnValue = !1, h.sliding = !0);
                (10 < d.newPosY || -10 > d.newPosY) && !1 === h.sliding && f(k).off("touchmove.owl");
                d.newPosX = Math.max(Math.min(d.newPosX, d.newRelativeX / 5), d.maximumPixels + d.newRelativeX / 5);
                !0 === d.browser.support3d ? d.transition3d(d.newPosX) : d.css2move(d.newPosX)
            }

            function c(a) {
                a = a.originalEvent || a || g.event;
                var c;
                a.target = a.target || a.srcElement;
                h.dragging = !1;
                !0 !== d.browser.isTouch && d.$owlWrapper.removeClass("grabbing");
                d.dragDirection = 0 > d.newRelativeX ? d.owl.dragDirection = "left" : d.owl.dragDirection = "right";
                0 !== d.newRelativeX && (c = d.getNewPosition(), d.goTo(c, !1, "drag"), h.targetElement === a.target && !0 !== d.browser.isTouch && (f(a.target).on("click.disable", function (a) {
                    a.stopImmediatePropagation();
                    a.stopPropagation();
                    a.preventDefault();
                    f(a.target).off("click.disable")
                }),
                    a = f._data(a.target, "events").click, c = a.pop(), a.splice(0, 0, c)));
                b("off")
            }

            var d = this, h = {
                offsetX: 0,
                offsetY: 0,
                baseElWidth: 0,
                relativePos: 0,
                position: null,
                minSwipe: null,
                maxSwipe: null,
                sliding: null,
                dargging: null,
                targetElement: null
            };
            d.isCssFinish = !0;
            d.$elem.on(d.ev_types.start, ".owl-wrapper", function (c) {
                c = c.originalEvent || c || g.event;
                var e;
                if (3 === c.which)return !1;
                if (!(d.itemsAmount <= d.options.items)) {
                    if (!1 === d.isCssFinish && !d.options.dragBeforeAnimFinish || !1 === d.isCss3Finish && !d.options.dragBeforeAnimFinish)return !1;
                    !1 !== d.options.autoPlay && g.clearInterval(d.autoPlayInterval);
                    !0 === d.browser.isTouch || d.$owlWrapper.hasClass("grabbing") || d.$owlWrapper.addClass("grabbing");
                    d.newPosX = 0;
                    d.newRelativeX = 0;
                    f(this).css(d.removeTransition());
                    e = f(this).position();
                    h.relativePos = e.left;
                    h.offsetX = a(c).x - e.left;
                    h.offsetY = a(c).y - e.top;
                    b("on");
                    h.sliding = !1;
                    h.targetElement = c.target || c.srcElement
                }
            })
        }, getNewPosition: function () {
            var a = this.closestItem();
            a > this.maximumItem ? a = this.currentItem = this.maximumItem : 0 <= this.newPosX && (this.currentItem =
                    a = 0);
            return a
        }, closestItem: function () {
            var a = this, b = !0 === a.options.scrollPerPage ? a.pagesInArray : a.positionsInArray, e = a.newPosX, c = null;
            f.each(b, function (d, g) {
                e - a.itemWidth / 20 > b[d + 1] && e - a.itemWidth / 20 < g && "left" === a.moveDirection() ? (c = g, a.currentItem = !0 === a.options.scrollPerPage ? f.inArray(c, a.positionsInArray) : d) : e + a.itemWidth / 20 < g && e + a.itemWidth / 20 > (b[d + 1] || b[d] - a.itemWidth) && "right" === a.moveDirection() && (!0 === a.options.scrollPerPage ? (c = b[d + 1] || b[b.length - 1], a.currentItem = f.inArray(c, a.positionsInArray)) :
                        (c = b[d + 1], a.currentItem = d + 1))
            });
            return a.currentItem
        }, moveDirection: function () {
            var a;
            0 > this.newRelativeX ? (a = "right", this.playDirection = "next") : (a = "left", this.playDirection = "prev");
            return a
        }, customEvents: function () {
            var a = this;
            a.$elem.on("owl.next", function () {
                a.next()
            });
            a.$elem.on("owl.prev", function () {
                a.prev()
            });
            a.$elem.on("owl.play", function (b, e) {
                a.options.autoPlay = e;
                a.play();
                a.hoverStatus = "play"
            });
            a.$elem.on("owl.stop", function () {
                a.stop();
                a.hoverStatus = "stop"
            });
            a.$elem.on("owl.goTo", function (b, e) {
                a.goTo(e)
            });
            a.$elem.on("owl.jumpTo", function (b, e) {
                a.jumpTo(e)
            })
        }, stopOnHover: function () {
            var a = this;
            !0 === a.options.stopOnHover && !0 !== a.browser.isTouch && !1 !== a.options.autoPlay && (a.$elem.on("mouseover", function () {
                a.stop()
            }), a.$elem.on("mouseout", function () {
                "stop" !== a.hoverStatus && a.play()
            }))
        }, lazyLoad: function () {
            var a, b, e, c, d;
            if (!1 === this.options.lazyLoad)return !1;
            for (a = 0; a < this.itemsAmount; a += 1)b = f(this.$owlItems[a]), "loaded" !== b.data("owl-loaded") && (e = b.data("owl-item"), c = b.find(".lazyOwl"), "string" !== typeof c.data("src") ?
                b.data("owl-loaded", "loaded") : (void 0 === b.data("owl-loaded") && (c.hide(), b.addClass("loading").data("owl-loaded", "checked")), (d = !0 === this.options.lazyFollow ? e >= this.currentItem : !0) && e < this.currentItem + this.options.items && c.length && this.lazyPreload(b, c)))
        }, lazyPreload: function (a, b) {
            function e() {
                a.data("owl-loaded", "loaded").removeClass("loading");
                b.removeAttr("data-src");
                "fade" === d.options.lazyEffect ? b.fadeIn(400) : b.show();
                "function" === typeof d.options.afterLazyLoad && d.options.afterLazyLoad.apply(this,
                    [d.$elem])
            }

            function c() {
                f += 1;
                d.completeImg(b.get(0)) || !0 === k ? e() : 100 >= f ? g.setTimeout(c, 100) : e()
            }

            var d = this, f = 0, k;
            "DIV" === b.prop("tagName") ? (b.css("background-image", "url(" + b.data("src") + ")"), k = !0) : b[0].src = b.data("src");
            c()
        }, autoHeight: function () {
            function a() {
                var a = f(e.$owlItems[e.currentItem]).height();
                e.wrapperOuter.css("height", a + "px");
                e.wrapperOuter.hasClass("autoHeight") || g.setTimeout(function () {
                    e.wrapperOuter.addClass("autoHeight")
                }, 0)
            }

            function b() {
                d += 1;
                e.completeImg(c.get(0)) ? a() : 100 >= d ? g.setTimeout(b,
                            100) : e.wrapperOuter.css("height", "")
            }

            var e = this, c = f(e.$owlItems[e.currentItem]).find("img"), d;
            void 0 !== c.get(0) ? (d = 0, b()) : a()
        }, completeImg: function (a) {
            return !a.complete || "undefined" !== typeof a.naturalWidth && 0 === a.naturalWidth ? !1 : !0
        }, onVisibleItems: function () {
            var a;
            !0 === this.options.addClassActive && this.$owlItems.removeClass("active");
            this.visibleItems = [];
            for (a = this.currentItem; a < this.currentItem + this.options.items; a += 1)this.visibleItems.push(a), !0 === this.options.addClassActive && f(this.$owlItems[a]).addClass("active");
            this.owl.visibleItems = this.visibleItems
        }, transitionTypes: function (a) {
            this.outClass = "owl-" + a + "-out";
            this.inClass = "owl-" + a + "-in"
        }, singleItemTransition: function () {
            var a = this, b = a.outClass, e = a.inClass, c = a.$owlItems.eq(a.currentItem), d = a.$owlItems.eq(a.prevItem), f = Math.abs(a.positionsInArray[a.currentItem]) + a.positionsInArray[a.prevItem], g = Math.abs(a.positionsInArray[a.currentItem]) + a.itemWidth / 2;
            a.isTransition = !0;
            a.$owlWrapper.addClass("owl-origin").css({
                "-webkit-transform-origin": g + "px", "-moz-perspective-origin": g +
                "px", "perspective-origin": g + "px"
            });
            d.css({
                position: "relative",
                left: f + "px"
            }).addClass(b).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend", function () {
                a.endPrev = !0;
                d.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");
                a.clearTransStyle(d, b)
            });
            c.addClass(e).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend", function () {
                a.endCurrent = !0;
                c.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");
                a.clearTransStyle(c, e)
            })
        }, clearTransStyle: function (a,
                                      b) {
            a.css({position: "", left: ""}).removeClass(b);
            this.endPrev && this.endCurrent && (this.$owlWrapper.removeClass("owl-origin"), this.isTransition = this.endCurrent = this.endPrev = !1)
        }, owlStatus: function () {
            this.owl = {
                userOptions: this.userOptions,
                baseElement: this.$elem,
                userItems: this.$userItems,
                owlItems: this.$owlItems,
                currentItem: this.currentItem,
                prevItem: this.prevItem,
                visibleItems: this.visibleItems,
                isTouch: this.browser.isTouch,
                browser: this.browser,
                dragDirection: this.dragDirection
            }
        }, clearEvents: function () {
            this.$elem.off(".owl owl mousedown.disableTextSelect");
            f(k).off(".owl owl");
            f(g).off("resize", this.resizer)
        }, unWrap: function () {
            0 !== this.$elem.children().length && (this.$owlWrapper.unwrap(), this.$userItems.unwrap().unwrap(), this.owlControls && this.owlControls.remove());
            this.clearEvents();
            this.$elem.attr("style", this.$elem.data("owl-originalStyles") || "").attr("class", this.$elem.data("owl-originalClasses"))
        }, destroy: function () {
            this.stop();
            g.clearInterval(this.checkVisible);
            this.unWrap();
            this.$elem.removeData()
        }, reinit: function (a) {
            a = f.extend({}, this.userOptions,
                a);
            this.unWrap();
            this.init(a, this.$elem)
        }, addItem: function (a, b) {
            var e;
            if (!a)return !1;
            if (0 === this.$elem.children().length)return this.$elem.append(a), this.setVars(), !1;
            this.unWrap();
            e = void 0 === b || -1 === b ? -1 : b;
            e >= this.$userItems.length || -1 === e ? this.$userItems.eq(-1).after(a) : this.$userItems.eq(e).before(a);
            this.setVars()
        }, removeItem: function (a) {
            if (0 === this.$elem.children().length)return !1;
            a = void 0 === a || -1 === a ? -1 : a;
            this.unWrap();
            this.$userItems.eq(a).remove();
            this.setVars()
        }
    };
    f.fn.owlCarousel = function (a) {
        return this.each(function () {
            if (!0 ===
                f(this).data("owl-init"))return !1;
            f(this).data("owl-init", !0);
            var b = Object.create(l);
            b.init(a, this);
            f.data(this, "owlCarousel", b)
        })
    };
    f.fn.owlCarousel.options = {
        items: 5,
        itemsCustom: !1,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 3],
        itemsTablet: [768, 2],
        itemsTabletSmall: !1,
        itemsMobile: [479, 1],
        singleItem: !1,
        itemsScaleUp: !1,
        slideSpeed: 200,
        paginationSpeed: 800,
        rewindSpeed: 1E3,
        autoPlay: !1,
        stopOnHover: !1,
        navigation: !1,
        navigationText: ["prev", "next"],
        rewindNav: !0,
        scrollPerPage: !1,
        pagination: !0,
        paginationNumbers: !1,
        responsive: !0,
        responsiveRefreshRate: 200,
        responsiveBaseWidth: g,
        baseClass: "owl-carousel",
        theme: "owl-theme",
        lazyLoad: !1,
        lazyFollow: !0,
        lazyEffect: "fade",
        autoHeight: !1,
        jsonPath: !1,
        jsonSuccess: !1,
        dragBeforeAnimFinish: !0,
        mouseDrag: !0,
        touchDrag: !0,
        addClassActive: !1,
        transitionStyle: !1,
        beforeUpdate: !1,
        afterUpdate: !1,
        beforeInit: !1,
        afterInit: !1,
        beforeMove: !1,
        afterMove: !1,
        afterAction: !1,
        startDragging: !1,
        afterLazyLoad: !1
    }
})(jQuery, window, document);

/**
 * Man.js
 */

/**
 * Loader
 */
if (typeof Pace != 'undefined') {
    Pace.on('hide', function () {
        $(".overlay").fadeOut(500, function () {
            $(this).remove();
        });
    });
}


/**
 * Colors
 */
$(document).ready(function () {
    $.each($("[data-bgcolor]"), function () {
        $(this).css("background-color", $(this).attr("data-bgcolor"));
    });
    $.each($("[data-color]"), function () {
        $(this).css("color", $(this).attr("data-color"));
    });
});

/**
 * Scrolling
 */
$("[data-scroll-target]").click(function (e) {
    e.preventDefault();
    $("html,body").animate({scrollTop: $($(this).attr("data-scroll-target")).position().top}, 500);
});

/**
 *  Tooltip
 */

$('[title]').filter("[data-toggle='tooltip']").tooltip({
    trigger: 'hover focus',
    html: $(this).attr('title'),
    container: 'body',
});

/**
 *  Float Lebel Setting
 */
$("input,textarea,select").keyup(function () {
    if ($(this).val().trim() != "")
        $("label[for='" + $(this).attr('id') + "']").addClass('active');
    else
        $("label[for='" + $(this).attr('id') + "']").removeClass('active');
}).blur(function () {
    if ($(this).val().trim() != "")
        $("label[for='" + $(this).attr('id') + "']").addClass('active');
    else
        $("label[for='" + $(this).attr('id') + "']").removeClass('active');
});