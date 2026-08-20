// ===== 申込み導線リンク設定 =====
// ここのURLを差し替えるだけで、サイト全体のボタンが更新されます。
const LINKS = {
  line: "https://lin.ee/t8ldPA5",  // まゆみんち公式LINE
  instagram: "https://www.instagram.com/oideyo_mayuminchi",  // Instagram
};

document.querySelectorAll("[data-link]").forEach((el) => {
  const key = el.getAttribute("data-link");
  if (LINKS[key] && LINKS[key] !== "#") {
    el.setAttribute("href", LINKS[key]);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  }
});

// ===== モバイルメニュー =====
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
if (navToggle && nav) {
  navToggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

// ===== 営業カレンダー =====
// その日に出るメニューは曜日で決まる（月＝マフィン／ビビンパ丼、水＝お惣菜パン／豚丼、金＝お惣菜／Mayuデリ弁当）
const OPEN_WEEKDAYS = { 1: "米粉マフィン／ビビンパ丼", 3: "お惣菜パン／豚丼", 5: "お惣菜／Mayuデリ弁当" };

// 月ごとの実際の営業日（日にちの配列）。ここに指定した月は、この日にちだけが営業日になります。
// 例："2026-09": [2, 4, 7, 9, 14, 16, 18, 25, 28, 30]
// まだ指定していない月は、月・水・金をすべて営業日として仮表示します（予定が決まったらここに追加してください）。
const OPEN_DATES_BY_MONTH = {
  "2026-09": [2, 4, 7, 9, 14, 16, 18, 25, 28, 30],
};

// 臨時休業（本来は営業日だが休む日）は"YYYY-MM-DD"で追加してください。
const CLOSED_DATES = ["2026-08-10", "2026-08-12", "2026-08-14", "2026-08-28"];

const calMonthEl = document.getElementById("calMonth");
const calGridEl = document.getElementById("calGrid");
const calPrevBtn = document.getElementById("calPrev");
const calNextBtn = document.getElementById("calNext");

if (calMonthEl && calGridEl) {
  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  const toDateKey = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  function renderCalendar() {
    calMonthEl.textContent = `${viewYear}年 ${viewMonth + 1}月`;
    calGridEl.innerHTML = "";

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "cal-day empty";
      calGridEl.appendChild(empty);
    }

    const monthKey = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
    const monthOpenDays = OPEN_DATES_BY_MONTH[monthKey];

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement("div");
      const weekday = new Date(viewYear, viewMonth, d).getDay();
      const dateKey = toDateKey(viewYear, viewMonth, d);
      const isClosedOverride = CLOSED_DATES.includes(dateKey);
      const isWeekdayCandidate = !!OPEN_WEEKDAYS[weekday];
      const isOpen = monthOpenDays
        ? monthOpenDays.includes(d) && !isClosedOverride
        : isWeekdayCandidate && !isClosedOverride;

      cell.className = "cal-day " + (isOpen ? "is-open" : "is-closed");
      if (
        viewYear === today.getFullYear() &&
        viewMonth === today.getMonth() &&
        d === today.getDate()
      ) {
        cell.classList.add("is-today");
      }

      const num = document.createElement("span");
      num.className = "num";
      num.textContent = d;
      cell.appendChild(num);

      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = isOpen ? OPEN_WEEKDAYS[weekday] : isClosedOverride ? "臨時休業" : "定休日";
      cell.appendChild(tag);

      calGridEl.appendChild(cell);
    }
  }

  calPrevBtn?.addEventListener("click", () => {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    renderCalendar();
  });
  calNextBtn?.addEventListener("click", () => {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    renderCalendar();
  });

  renderCalendar();
}

// ===== スクロールで表示 =====
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}
