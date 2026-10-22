var S = MehrinehStore;
var P = MEHRINEH_PLANS;
var I = Mh.I;
var u = S.user();
document.getElementById("plans").innerHTML = P.map(function (p) {
    var n = MEHRINEH_LESSONS.filter(function (l) {
        return l.tier == p.tier;
    }).length;
    return '<div class="card plan'
        + (p.tier == 1 ? ' top1' : '')
        + '"><h3>'
        + p.name
        + (p.tier == 1 ? ' <span class="tag o">پیشنهادی</span>' : '')
        + '</h3><div class="price">'
        + p.price
        + ' <small>'
        + p.per
        + '</small></div><ul>'
        + p.items.concat([S.fa(n) + " آموزش اختصاصی"]).map(function (t) {
        return '<li>' + I("check") + t + '</li>';
    }).join("")
        + '</ul><button class="btn ft '
        + (p.tier ? '' : 'l')
        + '" data-t="'
        + p.tier
        + '">'
        + (p.tier ? "خرید اشتراک" : "شروع رایگان")
        + '</button></div>';
}).join("");
Mh.icons();
document.getElementById("plans").onclick = function (e) {
    var b = e.target.closest("[data-t]");
    if (!b)
        return;
    var t = +b.dataset.t;
    var m = document.getElementById("pm");
    m.className = "msg show";
    if (!t) {
        location.href = "lessons.html";
        return;
    }
    if (!u) {
        location.href = "auth.html";
        return;
    }
    var target = u;
    if (u.role == "admin") {
        m.textContent = "مدیر کل نیازی به خرید ندارد.";
        return;
    }
    if (u.role == "guardian") {
        target = S.byId(u.links[0]);
        if (!target) {
            m.className = "msg show err";
            m.textContent = "ابتدا از پنل خود، سالمند را با کد اضافه کنید.";
            return;
        }
    }
    S.buy(target.id, t);
    m.textContent = "اشتراک «" + P[t].name + "» برای " + target.name + " فعال شد. (پرداخت نمایشی)";
};
