var S = MehrinehStore;
var V = MEHRINEH_VIDEOS;
var I = Mh.I;
var TN = ["رایگان", "سطح ۱", "سطح ۲"];
var d = document.getElementById("vd");
document.getElementById("vids").innerHTML = V.map(function (v) {
    var lk = v.tier > S.tier();
    return '<button class="card" data-v="'
        + v.id
        + '" style="text-align:right;font:inherit;cursor:pointer;padding:0">'
        + Mh.photo(v.img.replace("assets/img/", ""), "play").replace("</div>", '<div class="lock" style="background:rgba(20,32,26,' + (lk ? '.55' : '.15') + ')">' + I(lk ? "lock" : "play") + '</div></div>')
        + '<div class="bd"><h3>'
        + v.title
        + '</h3><div class="row"><span class="tag">'
        + v.min
        + '</span><span class="tag '
        + (v.tier ? 'y' : 'g')
        + '">'
        + TN[v.tier]
        + '</span></div></div></button>';
}).join("");
Mh.icons();
document.getElementById("vids").onclick = function (e) {
    var b = e.target.closest("[data-v]");
    if (!b)
        return;
    var v = V.filter(function (x) {
        return x.id == b.dataset.v;
    })[0];
    document.getElementById("vt").textContent = v.title;
    document.getElementById("vb").innerHTML = v.tier > S.tier() ? '<p>این فیلم مخصوص '
        + TN[v.tier]
        + ' است.</p><a class="btn" href="'
        + (S.user() ? "pricing.html" : "auth.html")
        + '">'
        + (S.user() ? "دیدن اشتراک‌ها" : "ورود یا ثبت‌نام")
        + '</a>' : (v.src ? '<video controls style="width:100%" src="' + v.src + '"></video>' : '<p>فایل این فیلم هنوز اضافه نشده است (data/content.js).</p>');
    d.showModal();
};
d.addEventListener("click", function (e) {
    if (e.target == d || e.target.hasAttribute("data-close"))
        d.close();
});
