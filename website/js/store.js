/* منطق: کاربران، نقش‌ها، اشتراک و پیشرفت. همه‌چیز در localStorage است (نسخه‌ی نمایشی بدون سرور). */
(function (w) {
    var K = "mehrineh:v2";
    var PRICE = [0, 199000, 499000];

    function rd() {
        try {
            return JSON.parse(localStorage.getItem(K)) || {};
        }
        catch (e) {
            return {};
        }
    }

    function wr(s) {
        try {
            localStorage.setItem(K, JSON.stringify(s));
        }
        catch (e) {
        }
    }

    function st() {
        var s = rd();
        s.users = s.users || [];
        s.done = s.done || {};
        s.pos = s.pos || {};
        s.prefs = s.prefs || {};
        s.pay = s.pay || [];
        if (!s.users.some(function (u) {
            return u.role == "admin";
        }))
            s.users.push({
                id: "u0", role: "admin", name: "مدیر کل", phone: "09000000000", pass: "admin123", plan: 2, done: {}, pos: {}, links: [], joined: Date.now()
            });
        return s;
    }

    function me(s) {
        return s.users.filter(function (u) {
            return u.id == s.session;
        })[0];
    }

    function bk(s) {
        return me(s) || s;
    }

    function en(x) {
        return String(x || "").replace(/[۰-۹]/g, function (d) {
            return "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
        }).replace(/\s/g, "");
    }
    var S = {
        fa: function (n) {
            return String(n).replace(/\d/g, function (d) {
                return "۰۱۲۳۴۵۶۷۸۹"[d];
            });
        },
        money: function (n) {
            return S.fa(String(n).replace(/\B(?=(\d{3})+$)/g, "٬")) + " تومان";
        },
        prefs: function () {
            return st().prefs;
        }, setPref: function (k, v) {
            var s = st();
            s.prefs[k] = v;
            wr(s);
        },
        user: function () {
            return me(st());
        }, tier: function () {
            var u = me(st());
            return u ? u.plan || 0 : 0;
        },
        users: function () {
            return st().users;
        }, payments: function () {
            return st().pay;
        },
        register: function (o) {
            var s = st();
            var p = en(o.phone);
            if (!o.name || o.name.trim().length < 2)
                return {
                    err: "نام را وارد کنید."
                };
            if (!/^09\d{9}$/.test(p))
                return {
                    err: "شماره‌ی موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد."
                };
            if ((o.pass || "").length < 6)
                return {
                    err: "رمز عبور دست‌کم ۶ نویسه باشد."
                };
            if (s.users.some(function (u) {
                return u.phone == p;
            }))
                return {
                    err: "با این شماره قبلاً ثبت‌نام شده است."
                };
            var u = {
                id: "u"
                    + Date.now(), role: o.role, name: o.name.trim(), phone: p, pass: o.pass, plan: 0, done: {}, pos: {}, links: [], share: false, joined: Date.now()
            };
            if (o.role == "elder")
                u.code = "MH-" + (1000 + Math.floor(Math.random() * 9000));
            if (o.role == "guardian" && o.code) {
                var e = s.users.filter(function (x) {
                    return x.code == o.code.trim().toUpperCase();
                })[0];
                if (!e)
                    return {
                        err: "کد سالمند پیدا نشد."
                    };
                u.links.push(e.id);
            }
            s.users.push(u);
            s.session = u.id;
            wr(s);
            return {
                ok: u
            };
        },
        login: function (phone, pass) {
            var s = st();
            var u = s.users.filter(function (x) {
                return x.phone == en(phone) && x.pass == pass;
            })[0];
            if (!u)
                return {
                    err: "شماره یا رمز عبور درست نیست."
                };
            s.session = u.id;
            wr(s);
            return {
                ok: u
            };
        },
        logout: function () {
            var s = st();
            delete s.session;
            wr(s);
        },
        update: function (id, fn) {
            var s = st();
            var u = s.users.filter(function (x) {
                return x.id == id;
            })[0];
            if (u) {
                fn(u);
                wr(s);
            }
        },
        link: function (code) {
            var s = st();
            var g = me(s);
            var e = s.users.filter(function (x) {
                return x.code == String(code).trim().toUpperCase();
            })[0];
            if (!g || g.role != "guardian")
                return {
                    err: "فقط قیم می‌تواند سالمند را اضافه کند."
                };
            if (!e)
                return {
                    err: "کد سالمند پیدا نشد."
                };
            if (g.links.indexOf(e.id) < 0)
                g.links.push(e.id);
            wr(s);
            return {
                ok: e
            };
        },
        byId: function (id) {
            return st().users.filter(function (x) {
                return x.id == id;
            })[0];
        },
        buy: function (target, tier) {
            var s = st();
            var by = me(s);
            var t = s.users.filter(function (x) {
                return x.id == target;
            })[0];
            if (!t || !by)
                return false;
            t.plan = tier;
            s.pay.push({
                by: by.id, to: t.id, tier: tier, amount: PRICE[tier], at: Date.now()
            });
            wr(s);
            return true;
        },
        position: function (id) {
            return bk(st()).pos[id] || 0;
        }, setPosition: function (id, i) {
            var s = st();
            bk(s).pos[id] = i;
            wr(s);
        },
        markDone: function (id) {
            var s = st();
            var b = bk(s);
            b.done[id] = true;
            b.pos[id] = 0;
            wr(s);
        }, isDone: function (id) {
            return !!bk(st()).done[id];
        },
        doneCount: function (u) {
            return Object.keys((u || bk(st())).done || {}).length;
        },
        percent: function (l) {
            return S.isDone(l.id) ? 100 : Math.round(S.position(l.id) / l.steps.length * 100);
        },
        recommend: function (L, p) {
            return L.filter(function (l) {
                return (p.level !== "beginner" || l.level === "آسان") && (!p.interest || p.interest === "all" || l.cat === p.interest);
            });
        }
    };
    w.MehrinehStore = S;
})(window);
