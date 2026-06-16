/* Nhịp Sống 24h — minimal interactions: mobile nav + sidebar tabs */
(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".main-nav ul");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // ---- Sidebar tabs (Đọc nhiều / Mới nhất) ----
  const tabGroups = document.querySelectorAll("[data-tabs]");
  tabGroups.forEach(function (group) {
    const buttons = group.querySelectorAll("[role='tab']");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const targetId = btn.getAttribute("aria-controls");

        buttons.forEach(function (b) {
          const selected = b === btn;
          b.setAttribute("aria-selected", String(selected));
          const panel = document.getElementById(b.getAttribute("aria-controls"));
          if (panel) panel.hidden = !selected;
        });

        const target = document.getElementById(targetId);
        if (target) target.hidden = false;
      });
    });
  });

  // ---- Auto year in footer ----
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Highlight active menu item based on current URL ----
  const params = new URLSearchParams(window.location.search);
  const currentCat = params.get("cat");
  const navLinks = document.querySelectorAll(".main-nav [data-nav] a, .main-nav ul a");
  navLinks.forEach(function (link) {
    const href = link.getAttribute("href") || "";
    if (currentCat && href.indexOf("cat=" + currentCat) !== -1) {
      link.setAttribute("aria-current", "page");
    }
  });

  // ---- Data-driven rendering (needs window.ARTICLES from articles.js) ----
  const ALL = Array.isArray(window.ARTICLES) ? window.ARTICLES : [];

  const CATEGORIES = {
    "xa-hoi": "Xã hội",
    "the-gioi": "Thế giới",
    "kinh-doanh": "Kinh doanh",
    "the-thao": "Thể thao",
    "giai-tri": "Giải trí",
    "cong-nghe": "Công nghệ",
    "suc-khoe": "Sức khỏe",
    "giao-duc": "Giáo dục",
    "doi-song": "Đời sống",
  };

  const imgUrl = function (seed, w, h) {
    return "https://picsum.photos/seed/" + seed + "/" + w + "/" + h;
  };
  const articleHref = function (a) { return "article.html?id=" + a.id; };

  // ---- Sidebar rank lists: "Đọc nhiều" / "Mới nhất" ----
  function fillRank(selector, sorter) {
    const ul = document.querySelector(selector);
    if (!ul || !ALL.length) return;
    const items = ALL.slice().sort(sorter).slice(0, 6);
    ul.innerHTML = items
      .map(function (a) {
        return '<li><a href="' + articleHref(a) + '">' + a.title + "</a></li>";
      })
      .join("");
  }
  fillRank('[data-rank="read"]', function (a, b) {
    return parseInt(b.views.replace(/\D/g, ""), 10) - parseInt(a.views.replace(/\D/g, ""), 10);
  });
  fillRank('[data-rank="new"]', function (a, b) { return b.order - a.order; });

  // ---- Category page ----
  const catList = document.querySelector("[data-cat-list]");
  if (catList) {
    const catName = CATEGORIES[currentCat] || "Tin tức";
    document.title = catName + " - Nhịp Sống 24h";
    document.querySelectorAll("[data-cat-name]").forEach(function (el) {
      el.textContent = catName;
    });

    const inCat = ALL.filter(function (a) { return a.catSlug === currentCat; });
    const list = inCat.length ? inCat : ALL;

    // Featured = first article of category
    const lead = list[0];
    const leadEl = document.querySelector("[data-cat-lead]");
    if (lead && leadEl) {
      leadEl.innerHTML =
        '<a class="thumb" href="' + articleHref(lead) + '">' +
        '<img src="' + imgUrl(lead.img, 800, 450) + '" alt="" width="800" height="450" loading="eager" /></a>' +
        '<h3><a href="' + articleHref(lead) + '">' + lead.title + "</a></h3>" +
        '<p class="sapo">' + lead.sapo + "</p>";
    }

    catList.innerHTML = list
      .slice(lead ? 1 : 0)
      .map(function (a) {
        return (
          "<li>" +
          '<a class="thumb" href="' + articleHref(a) + '"><img src="' + imgUrl(a.img, 180, 135) +
          '" alt="" width="180" height="135" loading="lazy" /></a>' +
          '<div><h4><a href="' + articleHref(a) + '">' + a.title + "</a></h4>" +
          '<p class="sapo">' + a.sapo + "</p>" +
          '<div class="meta">' + a.cat + " · " + a.date + "</div></div>" +
          "</li>"
        );
      })
      .join("");
  }

  // ---- Article detail page ----
  const bodyEl = document.querySelector("[data-article-body]");
  if (bodyEl) {
    const id = params.get("id");
    const article = ALL.filter(function (a) { return a.id === id; })[0] || ALL[0];
    if (article) {
      document.title = article.title + " - Nhịp Sống 24h";

      const setText = function (sel, val) {
        const el = document.querySelector(sel);
        if (el) el.textContent = val;
      };
      setText("[data-article-cat]", article.cat);
      setText("[data-article-title]", article.title);
      setText("[data-article-sapo]", article.sapo);
      setText("[data-article-date]", article.date);
      setText("[data-article-author]", "Tác giả: " + article.author);
      setText("[data-article-views]", "👁 " + article.views);

      const crumbCat = document.querySelector("[data-crumb-cat]");
      if (crumbCat) {
        crumbCat.textContent = article.cat;
        crumbCat.setAttribute("href", "category.html?cat=" + article.catSlug);
      }

      const lead = document.querySelector("[data-article-lead]");
      if (lead) {
        lead.innerHTML =
          '<img src="' + imgUrl(article.img, 800, 450) + '" alt="' + article.title +
          '" width="800" height="450" loading="eager" />' +
          "<figcaption>" + article.title + " (ảnh minh họa).</figcaption>";
      }

      bodyEl.innerHTML = article.body.join("\n");

      const author = document.querySelector("[data-article-byline]");
      if (author) author.textContent = article.author;

      const tagsEl = document.querySelector("[data-article-tags]");
      if (tagsEl && article.tags) {
        tagsEl.innerHTML = article.tags
          .map(function (t) { return '<a href="#">' + t + "</a>"; })
          .join("");
      }

      // Related: same category first, then others
      const related = ALL
        .filter(function (a) { return a.id !== article.id; })
        .sort(function (a, b) {
          return (b.catSlug === article.catSlug) - (a.catSlug === article.catSlug);
        })
        .slice(0, 4);
      const relEl = document.querySelector("[data-related]");
      if (relEl) {
        relEl.innerHTML = related
          .map(function (a) {
            return (
              "<li>" +
              '<a class="thumb" href="' + articleHref(a) + '"><img src="' + imgUrl(a.img, 180, 135) +
              '" alt="" width="180" height="135" loading="lazy" /></a>' +
              '<div><h4><a href="' + articleHref(a) + '">' + a.title + "</a></h4>" +
              '<div class="meta">' + a.cat + " · " + a.date + "</div></div>" +
              "</li>"
            );
          })
          .join("");
      }
    }
  }
})();
