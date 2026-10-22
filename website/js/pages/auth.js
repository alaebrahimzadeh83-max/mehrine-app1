var S = MehrinehStore;
var $ = function (i) {
    return document.getElementById(i);
};
var m = $("am");
document.querySelectorAll("[data-tab]").forEach(function (b) {
    b.onclick = function () {
        document.querySelectorAll("[data-tab]").forEach(function (x) {
            x.setAttribute("aria-selected", x == b);
        });
        $("reg").hidden = b.dataset.tab != "reg";
        $("log").hidden = b.dataset.tab != "log";
        m.classList.remove("show");
    };
});
$("reg").onchange = function () {
    $("cf").hidden = $("reg").role.value != "guardian";
};

function go(r) {
    if (r.err) {
        m.textContent = r.err;
        m.classList.add("show");
        return;
    }
    location.href = "dashboard.html";
}
$("reg").onsubmit = function (e) {
    e.preventDefault();
    var d = new FormData(this);
    go(S.register({
        role: d.get("role"), name: d.get("name"), phone: d.get("phone"), pass: d.get("pass"), code: d.get("code")
    }));
};
$("log").onsubmit = function (e) {
    e.preventDefault();
    var d = new FormData(this);
    go(S.login(d.get("phone"), d.get("pass")));
};
