/* فهرست آموزش‌ها، قفل سطح اشتراک و شبیه‌ساز گوشی */
(function () {
    var S = MehrinehStore;
    var L = MEHRINEH_LESSONS;
    var fa = S.fa;
    var I = Mh.I;
    var $ = function (i) {
        return document.getElementById(i);
    };
    var grid = $("lesson-grid");
    var pl = $("player");
    var cur;
    var idx = 0;
    var cat = "all";
    var list = null;
    var TN = ["رایگان", "سطح ۱ · خانوادگی", "سطح ۲ · ویژه"];

    function card(l) {
        var lk = l.tier > S.tier();
        var pc = S.percent(l);
        return '<a class="card" href="#player" data-id="'
            + l.id
            + '"><div class="ph">'
            + I(l.icon)
            + '<img src="assets/img/lesson-'
            + l.id
            + '.jpg" alt="" loading="lazy" onerror="this.remove()">'
            + (lk ? '<div class="lock">' + I("lock") + '</div>' : '')
            + '</div><div class="bd"><h3>'
            + l.title
            + '</h3><p>'
            + l.summary
            + '</p><div class="bar" style="margin:.6rem 0"><i style="width:'
            + pc
            + '%"></i></div><div class="row"><span class="tag">'
            + fa(l.steps.length)
            + ' گام</span><span class="tag">'
            + fa(l.minutes)
            + ' دقیقه</span><span class="tag '
            + (l.tier ? 'y' : 'g')
            + '">'
            + TN[l.tier]
            + '</span>'
            + (S.isDone(l.id) ? '<span class="tag">' + I("check") + 'انجام شد</span>' : '')
            + '</div></div></a>';
    }

    function render() {
        var a = (list || L).filter(function (l) {
            return cat == "all" || l.cat == cat;
        });
        grid.innerHTML = a.length ? a.map(card).join("") : "<p>آموزشی پیدا نشد.</p>";
        $("done-count").textContent = fa(S.doneCount());
        Mh.icons();
    }
    document.querySelectorAll("[data-cat]").forEach(function (b) {
        b.onclick = function () {
            document.querySelectorAll("[data-cat]").forEach(function (x) {
                x.setAttribute("aria-pressed", x == b);
            });
            cat = b.dataset.cat;
            render();
        };
    });
    var pf = $("profile-form");
    pf.onsubmit = function (e) {
        e.preventDefault();
        var d = new FormData(pf);
        list = S.recommend(L, {
            level: d.get("level"), interest: d.get("interest")
        });
        cat = "all";
        render();
        var m = $("profile-msg");
        m.textContent = list.length ? fa(list.length)
            + " آموزش برای شما پیدا شد." : "موردی پیدا نشد.";
        m.classList.add("show");
        if (!list.length) {
            list = null;
            render();
        }
    };

    function open(id) {
        var l = L.filter(function (x) {
            return x.id == id;
        })[0];
        if (!l)
            return;
        if (l.tier > S.tier()) {
            $("lock-t").textContent = "این آموزش مخصوص «" + TN[l.tier] + "» است";
            $("lock-go").href = S.user() ? "pricing.html" : "auth.html";
            $("lock-go").textContent = S.user() ? "دیدن اشتراک‌ها" : "ورود یا ثبت‌نام";
            $("lock-d").showModal();
            return;
        }
        cur = l;
        idx = Math.min(S.position(id), l.steps.length - 1);
        $("done-box").hidden = true;
        $("step-area").hidden = false;
        pl.classList.add("show");
        show();
        pl.scrollIntoView({
            behavior: "smooth"
        });
    }
    grid.onclick = function (e) {
        var a = e.target.closest("[data-id]");
        if (a) {
            e.preventDefault();
            open(a.dataset.id);
        }
    };

    function scr() {
        var s = cur.steps[idx];
        return cur.sim ? cur.sim[idx] : {
            hd: cur.title, p: s.text, ic: s.icon, opts: ["check|انجام دادم"], ok: 0
        };
    }

    function show() {
        var s = cur.steps[idx];
        var n = cur.steps.length;
        var c = scr();
        $("p-title").textContent = cur.title;
        $("p-count").textContent = "گام " + fa(idx + 1) + " از " + fa(n);
        $("p-step-title").textContent = s.title;
        $("p-text").textContent = s.text;
        $("p-tip").hidden = !s.tip;
        $("p-tip").innerHTML = s.tip ? I("lightbulb") + "<span>" + s.tip + "</span>" : "";
        $("p-warn").hidden = !s.warn;
        $("p-warn").innerHTML = s.warn ? I("triangle-alert") + "<span>" + s.warn + "</span>" : "";
        $("p-dots").innerHTML = cur.steps.map(function (_, i) {
            return '<i class="' + (i <= idx ? 'on' : '') + '"></i>';
        }).join("");
        $("p-prev").disabled = !idx;
        $("p-skip").innerHTML = idx == n - 1 ? "پایان" : "گام بعد";
        var o = c.opts.map(function (t, i) {
            var q = t.split("|");
            return '<button class="sbtn" data-o="' + i + '">' + I(q[0]) + q[1] + '</button>';
        }).join("");
        $("sim").innerHTML = '<div class="hd">'
            + I("smartphone")
            + c.hd
            + '</div><div class="bd">'
            + (c.pin ? '<div class="pin">' + I("map-pin") + '</div>' : '')
            + (c.ic ? '<div class="big">' + I(c.ic) + '</div>' : '')
            + '<p>'
            + c.p
            + '</p>'
            + o
            + '<div class="hint" id="hint" role="status"></div></div>';
        S.setPosition(cur.id, idx);
        Mh.icons();
    }
    $("sim").onclick = function (e) {
        var b = e.target.closest("[data-o]");
        if (!b)
            return;
        var c = scr();
        if (+b.dataset.o == c.ok)
            next();
        else {
            b.classList.add("bad");
            $("hint").textContent = c.hint || "یک بار دیگر امتحان کنید.";
            setTimeout(function () {
                b.classList.remove("bad");
            }, 400);
        }
    };

    function next() {
        if (idx < cur.steps.length - 1) {
            idx++;
            show();
        }
        else {
            S.markDone(cur.id);
            $("step-area").hidden = true;
            $("done-box").hidden = false;
            $("done-title").textContent = "آفرین! «" + cur.title + "» را تمام کردید";
            render();
        }
    }
    $("p-prev").onclick = function () {
        if (idx) {
            idx--;
            show();
        }
    };
    $("p-skip").onclick = next;
    $("p-close").onclick = function () {
        pl.classList.remove("show");
        render();
        grid.scrollIntoView();
    };
    $("again").onclick = function () {
        idx = 0;
        $("done-box").hidden = true;
        $("step-area").hidden = false;
        show();
    };
    $("p-help").onclick = function () {
        $("help-dialog").showModal();
    };
    document.querySelectorAll("dialog").forEach(function (d) {
        d.addEventListener("click", function (e) {
            if (e.target == d || e.target.hasAttribute("data-close"))
                d.close();
        });
    });
    render();
    var q = new URLSearchParams(location.search).get("lesson");
    if (q)
        open(q);
})();
