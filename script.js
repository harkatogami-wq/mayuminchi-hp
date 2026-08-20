// ===== 申込み導線リンク設定 =====
// ここのURLを差し替えるだけで、サイト全体のボタンが更新されます。
const LINKS = {
  line: "https://lin.ee/t8ldPA5",  // まゆみんち公式LINE
  instagram: "https://www.instagram.com/oideyo_mayuminchi",  // Instagram
  googleMap: "https://maps.app.goo.gl/UnhLveZgzyFLobJq7",  // Googleビジネスプロフィール（口コミ・地図）
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
// スマホの狭いマスに収まる短縮表示（曜日ごと）
const OPEN_WEEKDAYS_SHORT = { 1: "マフィン", 3: "豚丼", 5: "お惣菜" };

// 月ごとの実際の営業日（日にちの配列）。ここに指定した月は、この日にちだけが営業日になります。
// 例："2026-09": [2, 4, 7, 9, 14, 16, 18, 25, 28, 30]
// まだ指定していない月は、月・水・金をすべて営業日として仮表示します（予定が決まったらここに追加してください）。
const OPEN_DATES_BY_MONTH = {
  "2026-09": [2, 4, 7, 9, 14, 16, 18, 25, 28, 30],
};

// 臨時休業（本来は営業日だが休む日）は"YYYY-MM-DD"で追加してください。
const CLOSED_DATES = ["2026-08-10", "2026-08-12", "2026-08-14", "2026-08-28"];

// 貸切スペースでのイベント。
// title: イベントのお知らせ欄に出す正式名称／calLabel: カレンダーのマスに収まる短い名前(4〜5文字が目安)
// regularOpen: その日にまゆみんちの通常営業（テイクアウト等）も一緒に行うか
const EVENTS = [
  {
    date: "2026-09-08",
    title: "米粉の抹茶ケーキレッスン（満席）",
    calLabel: "抹茶ケーキ",
    host: "宮尾みつみ",
    time: "10:30〜",
    link: "https://lin.ee/93ksoYY",
    regularOpen: false,
  },
  {
    date: "2026-09-16",
    title: "米粉パン販売",
    calLabel: "パン販売",
    host: "宮尾みつみ",
    time: "",
    link: "https://lin.ee/93ksoYY",
    regularOpen: true,
  },
  {
    date: "2026-09-29",
    title: "Half & First Birthday Day（1歳・6ヶ月の記念日イベント）",
    calLabel: "バースデー会",
    host: "とがみ はるか × いでさわ まりこ",
    time: "10:00〜11:30 1歳の記念日／13:00〜14:30 6ヶ月の記念日",
    link: "https://half-first-birthday-lp.pages.dev",
    regularOpen: false,
  },
];
const EVENTS_BY_DATE = Object.fromEntries(EVENTS.map((e) => [e.date, e]));

const calMonthEl = document.getElementById("calMonth");
const calGridEl = document.getElementById("calGrid");
const calPrevBtn = document.getElementById("calPrev");
const calNextBtn = document.getElementById("calNext");
const eventListEl = document.getElementById("eventList");

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
      const weekday = new Date(viewYear, viewMonth, d).getDay();
      const dateKey = toDateKey(viewYear, viewMonth, d);
      const event = EVENTS_BY_DATE[dateKey];
      const isClosedOverride = CLOSED_DATES.includes(dateKey);
      const isWeekdayCandidate = !!OPEN_WEEKDAYS[weekday];
      let isOpen = monthOpenDays
        ? monthOpenDays.includes(d) && !isClosedOverride
        : isWeekdayCandidate && !isClosedOverride;
      if (event && !event.regularOpen) isOpen = false;

      const cell = document.createElement(event?.link ? "a" : "div");
      if (event?.link) {
        cell.href = event.link;
        cell.target = "_blank";
        cell.rel = "noopener";
      }
      cell.className =
        "cal-day " + (isOpen ? "is-open " : "is-closed ") + (event ? "is-event" : "");
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
      tag.className = "tag tag-full";
      tag.textContent = event
        ? event.calLabel || "イベント"
        : isOpen
        ? OPEN_WEEKDAYS[weekday]
        : isClosedOverride
        ? "臨時休業"
        : "定休日";
      cell.appendChild(tag);

      const tagShort = document.createElement("span");
      tagShort.className = "tag tag-short";
      tagShort.textContent = event
        ? event.calLabel || "イベント"
        : isOpen
        ? OPEN_WEEKDAYS_SHORT[weekday]
        : isClosedOverride
        ? "休業"
        : "休み";
      cell.appendChild(tagShort);

      calGridEl.appendChild(cell);
    }
  }

  function renderEventList() {
    if (!eventListEl) return;
    const upcoming = EVENTS.filter((e) => e.date >= toDateKey(today.getFullYear(), today.getMonth(), today.getDate()))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!upcoming.length) {
      eventListEl.innerHTML = '<p class="event-empty">現在、開催予定のイベントはありません。</p>';
      return;
    }

    eventListEl.innerHTML = "";
    upcoming.forEach((e) => {
      const [y, m, d] = e.date.split("-").map(Number);
      const weekdayLabel = ["日", "月", "火", "水", "木", "金", "土"][new Date(y, m - 1, d).getDay()];
      const card = document.createElement(e.link ? "a" : "div");
      card.className = "event-card";
      if (e.link) {
        card.href = e.link;
        card.target = "_blank";
        card.rel = "noopener";
      }
      card.innerHTML = `
        <span class="ev-date">${y}.${m}.${d}（${weekdayLabel}）</span>
        <h4 class="ev-title">${e.title}</h4>
        <p class="ev-meta">主催：${e.host}${e.time ? "<br>" + e.time : ""}</p>
        ${e.link ? '<span class="ev-link">詳細を見る →</span>' : ""}
      `;
      eventListEl.appendChild(card);
    });
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
  renderEventList();
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
