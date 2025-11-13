// ページ切り替え処理
function changePage(page) {
    document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
    document.getElementById(page).style.display = "block";
    localStorage.setItem("last_page", page);
  }
  
  // 前回開いていたページを復元
  function restoreFromParam() {
    const page = localStorage.getItem("last_page");
    if (page) changePage(page);
  }
  
  // カラーピッカー設定
  function setupColorPicker() {
    const picker = document.getElementById("colorPicker");
    if (!picker) return;
    const saved = localStorage.getItem("theme_color");
    if (saved) {
      document.documentElement.style.setProperty("--accent", saved);
      picker.value = saved;
    }
    picker.addEventListener("input", e => {
      const color = e.target.value;
      document.documentElement.style.setProperty("--accent", color);
      localStorage.setItem("theme_color", color);
    });
  }
  
  // UIイベント初期化
  function bindControlEvents() {
    const playBtn = document.getElementById("playBtn");
    if (playBtn) playBtn.addEventListener("click", () => playWeatherOnSpotify());
    const listBtn = document.getElementById("listBtn");
    if (listBtn) listBtn.addEventListener("click", () => renderUserPlaylists());
  }
  
  // 初期化
  window.addEventListener("DOMContentLoaded", () => {
    setupColorPicker();
    restoreFromParam();
    bindControlEvents();
  });
  