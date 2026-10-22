var P = MEHRINEH_POSTS;
var b = document.getElementById("blog");
var q = new URLSearchParams(location.search).get("post");
var p = P.filter(function (x) {
    return x.id == q;
})[0];
if (p) {
    b.className = "";
    b.style.maxWidth = "720px";
    b.innerHTML = '<a href="blog.html">بازگشت به وبلاگ</a><h2 style="margin-top:1rem">'
        + p.title
        + '</h2><p>'
        + p.date
        + ' · '
        + MehrinehStore.fa(p.min)
        + ' دقیقه مطالعه</p>'
        + Mh.photo(p.img.replace("assets/img/", ""), "image").replace('class="ph"', 'class="ph" style="margin:1rem 0"')
        + p.body.map(function (t) {
        return '<p class="lead" style="color:var(--ink)">' + t + '</p>';
    }).join("");
}
else
    b.innerHTML = P.map(function (p) {
        return '<a class="card" href="blog.html?post='
            + p.id
            + '">'
            + Mh.photo(p.img.replace("assets/img/", ""))
            + '<div class="bd"><span class="tag">'
            + p.date
            + '</span><h3>'
            + p.title
            + '</h3><p>'
            + p.body[0]
            + '</p></div></a>';
    }).join("");
Mh.icons();
