var b = document.getElementById("home-lessons");
b.innerHTML = MEHRINEH_LESSONS.filter(function (l) {
    return !l.tier;
}).slice(0, 4).map(function (l) {
    return '<a class="card" href="lessons.html?lesson='
        + l.id
        + '"><div class="ph"><i data-lucide="'
        + l.icon
        + '" class="i"></i><img src="assets/img/lesson-'
        + l.id
        + '.jpg" alt="" onerror="this.remove()"></div><div class="bd"><h3>'
        + l.title
        + '</h3><span class="tag">'
        + MehrinehStore.fa(l.minutes)
        + ' دقیقه</span></div></a>';
}).join("");
Mh.icons();
