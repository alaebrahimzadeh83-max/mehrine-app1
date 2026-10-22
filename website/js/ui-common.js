/* رابط مشترک همه‌ی صفحه‌ها: نوبار، فوتر، آیکن‌ها، دانلود اپ و تنظیم خوانایی */
(function () {
    var S = window.MehrinehStore;
    var R = document.documentElement;
    var prefs = S.prefs();
    var user = S.user();
    var APP = window.MEHRINEH_APP;

    /* ---------- تنظیمات ذخیره‌شده‌ی خوانایی ---------- */
    if (prefs.size)
        R.setAttribute("data-size", prefs.size);
    if (prefs.contrast)
        R.setAttribute("data-contrast", prefs.contrast);

    /* ---------- آیکن‌های آنلاین (Lucide) ---------- */
    var Mh = (window.Mh = {
        I: function (name, cls) {
            return '<i data-lucide="' + name + '" class="i ' + (cls || "") + '"></i>';
        },
        icons: function () {
            if (window.lucide)
                lucide.createIcons();
        },
        photo: function (file, icon) {
            return '<div class="ph">' + Mh.I(icon || "image") +
                '<img src="assets/img/'
                    + file
                    + '" alt="" loading="lazy" onerror="this.remove()"></div>';
        }
    });
    var I = Mh.I;
    var lib = document.createElement("script");
    lib.src = "https://cdn.jsdelivr.net/npm/lucide@0.469.0/dist/umd/lucide.min.js";
    lib.onload = Mh.icons;
    document.head.appendChild(lib);

    /* ---------- منوی اصلی: [آدرس، عنوان] ---------- */
    var page = location.pathname.split("/").pop() || "index.html";
    var LINKS = [
        ["index.html", "خانه"],
        ["lessons.html", "آموزش‌ها"],
        ["videos.html", "فیلم‌ها"],
        ["blog.html", "وبلاگ"],
        ["pricing.html", "اشتراک‌ها"],
        ["contact.html", "تماس"]
    ];
    var linksHTML = LINKS.map(function (l) {
        var cur = l[0] == page ? ' aria-current="page"' : "";
        return '<li><a href="' + l[0] + '"' + cur + ">" + l[1] + "</a></li>";
    }).join("");

    /* ---------- نوبار ---------- */
    var accountBtn = user
        ? '<a class="btn sm" href="dashboard.html">' + I("layout-dashboard") + "پنل من</a>"
        : '<a class="btn sm" href="auth.html">ورود / ثبت‌نام</a>';
    var header = document.createElement("header");
    header.className = "top";
    header.innerHTML = `
    <div class="wrap nav">
      <a class="brand" href="index.html"><b>${I("leaf")}</b>مهرینه</a>
      <ul class="links" id="menu">${linksHTML}</ul>
      <div class="tools">
        <button class="btn ic hide-m" data-act="size" aria-label="تغییر اندازه‌ی نوشته">${I("a-large-small")}</button>
        <button class="btn ic hide-m" data-act="contrast" aria-label="کنتراست بالا">${I("contrast")}</button>
        <button class="btn o sm" data-act="app">${I("smartphone")}<span class="hide-xs">دانلود اپلیکیشن</span></button>
        ${accountBtn}
        <button class="btn ic menu" aria-label="منو" aria-expanded="false">${I("menu")}</button>
      </div>
    </div>`;
    document.body.prepend(header);

    /* ---------- فوتر ---------- */
    var footer = document.createElement("footer");
    footer.className = "foot";
    footer.innerHTML = `
    <div class="wrap">
      <div class="fg">
        <div>
          <a class="brand" href="index.html"><b>${I("leaf")}</b>مهرینه</a>
          <p style="margin-top:1rem">آموزش دیجیتال برای سالمندان، با همراهی خانواده.</p>
        </div>
        <div>
          <h4>سایت</h4>
          <ul>
            <li><a href="lessons.html">آموزش‌ها</a></li>
            <li><a href="videos.html">فیلم‌ها</a></li>
            <li><a href="blog.html">وبلاگ</a></li>
          </ul>
        </div>
        <div>
          <h4>حساب</h4>
          <ul>
            <li><a href="auth.html">ورود / ثبت‌نام</a></li>
            <li><a href="dashboard.html">پنل من</a></li>
            <li><a href="pricing.html">اشتراک‌ها</a></li>
            <li><a href="#" data-act="app">دانلود اپلیکیشن</a></li>
          </ul>
        </div>
        <div>
          <h4>پشتیبانی</h4>
          <ul>
            <li><a href="contact.html">تماس با ما</a></li>
            <li><a href="contact.html#privacy">حریم خصوصی</a></li>
          </ul>
        </div>
      </div>
      <div class="fb">© <span data-year>۱۴۰۵</span> مهرینه · نسخه‌ی آزمایشی</div>
    </div>`;
    document.body.appendChild(footer);

    /* ---------- پنجره‌ی دانلود اپلیکیشن (لینک‌ها در js/config.js) ---------- */
    var storeBtns = APP.stores.map(function (s) {
        if (!s.url) {
            return '<button class="btn l" disabled>' + I(s.icon) + s.name + " (به‌زودی)</button>";
        }
        return '<a class="btn" href="'
            + s.url
            + '" target="_blank" rel="noopener">'
            + I(s.icon)
            + s.name
            + "</a>";
    }).join("");
    var appDialog = document.createElement("dialog");
    appDialog.innerHTML = `
    <h3>${APP.title}</h3>
    <p>${APP.text}</p>
    <div class="grid" style="gap:.6rem">${storeBtns}</div>
    <p style="margin:1rem 0 0"><button class="btn l sm" data-close>بستن</button></p>`;
    document.body.appendChild(appDialog);
    appDialog.addEventListener("click", function (e) {
        if (e.target == appDialog || e.target.hasAttribute("data-close"))
            appDialog.close();
    });

    /* ---------- سال فوتر ---------- */
    document.querySelectorAll("[data-year]").forEach(function (el) {
        try {
            el.textContent = new Intl.DateTimeFormat("fa-IR", {
                year: "numeric"
            }).format(new Date());
        }
        catch (x) {
        }
    });

    /* ---------- کلیک‌ها: منوی موبایل، اندازه‌ی نوشته، کنتراست، اپ ---------- */
    var sizes = ["", "lg", "xl"];
    document.addEventListener("click", function (e) {
        var b = e.target.closest("[data-act],.menu");
        if (!b)
            return;
        if (b.classList.contains("menu")) {
            var open = document.getElementById("menu").classList.toggle("open");
            b.setAttribute("aria-expanded", open);
            return;
        }
        if (b.dataset.act == "app") {
            e.preventDefault();
            appDialog.showModal();
            Mh.icons();
        }
        if (b.dataset.act == "size") {
            var next = (sizes.indexOf(R.getAttribute("data-size") || "") + 1) % 3;
            if (next)
                R.setAttribute("data-size", sizes[next]);
            else
                R.removeAttribute("data-size");
            S.setPref("size", sizes[next]);
        }
        if (b.dataset.act == "contrast") {
            var on = R.getAttribute("data-contrast") == "high";
            if (on)
                R.removeAttribute("data-contrast");
            else
                R.setAttribute("data-contrast", "high");
            S.setPref("contrast", on ? "" : "high");
        }
    });

    /* ---------- فرم‌های نمایشی (بدون ارسال واقعی) ---------- */
    document.querySelectorAll("form[data-demo]").forEach(function (f) {
        f.addEventListener("submit", function (e) {
            e.preventDefault();
            var m = f.querySelector(".msg");
            if (m)
                m.classList.add("show");
            f.reset();
        });
    });
})();
