// バッテリー情報を取得して表示
navigator.getBattery().then(battery => {
    const el = document.getElementById("battery");
    if (!el) return;
    function update() {
      el.textContent = `Battery: ${(battery.level * 100).toFixed(0)}%`;
    }
    battery.addEventListener("levelchange", update);
    update();
  });
  