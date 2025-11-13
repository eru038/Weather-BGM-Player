// 天気データ取得
async function loadWeather() {
    const apiKey = "YOUR_OPENWEATHER_API_KEY"; // OpenWeather APIキーをここに
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=${apiKey}&units=metric&lang=ja`);
    const data = await res.json();
  
    const icon = document.getElementById("weatherIcon");
    const temp = document.getElementById("temperature");
    const cond = document.getElementById("condition");
  
    if (icon && data.weather) icon.textContent = data.weather[0].description;
    if (temp) temp.textContent = `${data.main.temp.toFixed(1)}℃`;
    if (cond) cond.textContent = data.name;
  
    // 背景変更
    const main = data.weather[0].main.toLowerCase();
    const bg = document.body;
    if (main.includes("rain")) bg.style.background = "linear-gradient(#4a6fa5, #1e2a3a)";
    else if (main.includes("cloud")) bg.style.background = "linear-gradient(#9ca3af, #6b7280)";
    else bg.style.background = "linear-gradient(#fcd34d, #fbbf24)";
  }
  