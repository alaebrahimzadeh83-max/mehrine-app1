var S = MehrinehStore;
var I = Mh.I;
var fa = S.fa;
var L = MEHRINEH_LESSONS;
var P = MEHRINEH_PLANS;
var u = S.user();
var D = document.getElementById("dash");

function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
        return "&#" + c.charCodeAt(0) + ";";
    });
}

function kpi(n, t) {
    return '<div class="kpi"><b>' + n + '</b><span>' + t + '</span></div>';
}

function prog(x) {
    return L.map(function (l) {
        var d = x.done[l.id];
        var pc = d ? 100 : Math.round((x.pos[l.id] || 0) / l.steps.length * 100);
        return '<tr><td>'
            + l.title
            + '</td><td style="width:35%"><div class="bar"><i style="width:'
            + pc
            + '%"></i></div></td><td>'
            + (d ? "انجام شد" : l.tier > x.plan ? "قفل" : fa(pc) + "٪")
            + '</td></tr>';
    }).join("");
}

function head(t, s) {
    return '<div class="row" style="justify-content:space-between;margin-bottom:1.5rem"><div><h1 style="font-size:2rem;margin:0">'
        + t
        + '</h1><p style="margin:0">'
        + s
        + '</p></div><button class="btn l sm" id="out">'
        + I("log-out")
        + 'خروج</button></div>';
}

function elder() {
    var g = S.users().filter(function (x) {
        return x.links && x.links.indexOf(u.id) > -1;
    });
    return head("سلام، " + esc(u.name), "پنل سالمند")
        + '<div class="kpis">'
        + kpi(fa(S.doneCount(u)), "آموزش کامل‌شده")
        + kpi(P[u.plan || 0].name, "اشتراک فعلی")
        + kpi(u.code, "کد خانواده")
        + kpi(fa(g.length), "قیم متصل")
        + '</div>' +
        '<div class="grid g2" style="margin:1.5rem 0"><div class="card bd"><h3>اشتراک</h3><p>سطح بالاتر، آموزش‌های بیشتری باز می‌کند.</p><a class="btn" href="pricing.html">دیدن اشتراک‌ها</a></div><div class="card bd"><h3>اجازه‌ی گزارش</h3><p>اگر روشن باشد، قیم‌هایتان پیشرفت را می‌بینند.</p><label class="row"><input type="checkbox" id="sh" '
            + (u.share ? "checked" : "")
            + ' style="width:24px;height:24px;accent-color:var(--g)"> گزارش برای قیم فعال باشد</label></div></div>' +
        '<h2>پیشرفت من</h2><div class="scroll"><table>'
            + prog(u)
            + '</table></div><p style="margin-top:1.5rem"><a class="btn o" href="lessons.html">ادامه‌ی آموزش</a></p>';
}

function guardian() {
    var E = u.links.map(S.byId).filter(Boolean);
    return head("سلام، " + esc(u.name), "پنل قیم")
        + '<div class="kpis">'
        + kpi(fa(E.length), "سالمند متصل")
        + kpi(fa(E.filter(function (e) {
        return e.plan;
    }).length), "دارای اشتراک") + kpi(fa(E.reduce(function (a, e) {
        return a + S.doneCount(e);
    }, 0)), "آموزش کامل‌شده") + '</div>' +
        '<form id="lk" class="row" style="margin:1.5rem 0;align-items:end"><div class="field" style="margin:0"><label for="cd">افزودن سالمند با کد</label><input class="input" id="cd" placeholder="MH-1234"></div><button class="btn">افزودن</button></form><div class="msg err" id="gm" role="alert"></div>' +
        (E.length ? E.map(function (e) {
            return '<div class="card bd" style="margin-bottom:1.2rem"><div class="row" style="justify-content:space-between"><h3>'
                + esc(e.name)
                + '</h3><span class="tag '
                + (e.plan ? 'y' : '')
                + '">'
                + P[e.plan || 0].name
                + '</span></div>' +
                (e.share ? '<div class="scroll"><table>'
                    + prog(e)
                    + '</table></div>' : '<p>'
                    + I("eye-off")
                    + ' این سالمند هنوز اجازه‌ی نمایش گزارش را نداده است.</p>') +
                '<div class="row"><select class="input" style="width:auto" data-s="'
                    + e.id
                    + '"><option value="1">خانوادگی</option><option value="2">ویژه</option></select><button class="btn sm" data-b="'
                    + e.id
                    + '">خرید اشتراک برای او</button></div></div>';
        }).join("") : '<p>هنوز سالمندی اضافه نکرده‌اید.</p>');
}

function admin() {
    var U = S.users();
    var el = U.filter(function (x) {
        return x.role == "elder";
    });
    var gu = U.filter(function (x) {
        return x.role == "guardian";
    });
    var pay = S.payments();
    var rev = pay.reduce(function (a, p) {
        return a + p.amount;
    }, 0);
    var RN = {
        elder: "سالمند", guardian: "قیم", admin: "مدیر"
    };
    return head("مدیریت کل", "پنل مدیر")
        + '<div class="kpis">'
        + kpi(fa(el.length), "سالمند")
        + kpi(fa(gu.length), "قیم")
        + kpi(fa(el.filter(function (e) {
        return e.plan;
    }).length), "اشتراک فعال") + kpi(S.money(rev), "درآمد (نمایشی)") + '</div>' +
        '<h2 style="margin-top:2rem">کاربران</h2><div class="scroll"><table><tr><th>نام</th><th>نقش</th><th>موبایل</th><th>اشتراک</th><th>آموزش</th></tr>'
            + U.map(function (x) {
        return '<tr><td>'
            + esc(x.name)
            + '</td><td>'
            + RN[x.role]
            + '</td><td>'
            + fa(x.phone)
            + '</td><td>'
            + P[x.plan || 0].name
            + '</td><td>'
            + fa(S.doneCount(x))
            + '</td></tr>';
    }).join("") + '</table></div>' +
        '<h2 style="margin-top:2rem">خریدها</h2>'
            + (pay.length ? '<div class="scroll"><table><tr><th>برای</th><th>سطح</th><th>مبلغ</th><th>تاریخ</th></tr>' + pay.map(function (p) {
        var t = S.byId(p.to);
        return '<tr><td>'
            + esc(t ? t.name : "-")
            + '</td><td>'
            + P[p.tier].name
            + '</td><td>'
            + S.money(p.amount)
            + '</td><td>'
            + new Date(p.at).toLocaleDateString("fa-IR")
            + '</td></tr>';
    }).join("") + '</table></div>' : '<p>هنوز خریدی ثبت نشده است.</p>');
}

function draw() {
    u = S.user();
    if (!u) {
        D.innerHTML = '<div style="text-align:center;padding:3rem 0"><h1>ابتدا وارد شوید</h1><a class="btn" href="auth.html">ورود / ثبت‌نام</a></div>';
        return;
    }
    D.innerHTML = u.role == "admin" ? admin() : u.role == "guardian" ? guardian() : elder();
    Mh.icons();
    var o = document.getElementById("out");
    o && (o.onclick = function () {
        S.logout();
        location.href = "index.html";
    });
    var sh = document.getElementById("sh");
    sh && (sh.onchange = function () {
        S.update(u.id, function (x) {
            x.share = sh.checked;
        });
    });
    var lk = document.getElementById("lk");
    lk && (lk.onsubmit = function (e) {
        e.preventDefault();
        var r = S.link(document.getElementById("cd").value);
        if (r.err) {
            var m = document.getElementById("gm");
            m.textContent = r.err;
            m.classList.add("show");
        }
        else
            draw();
    });
    D.onclick = function (e) {
        var b = e.target.closest("[data-b]");
        if (!b)
            return;
        S.buy(b.dataset.b, +D.querySelector('[data-s="' + b.dataset.b + '"]').value);
        draw();
    };
}
draw();
