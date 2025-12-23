    // =====================
// 天気アニメーション
// =====================
let WEATHER_ANIM = {
  type: null,
  canvas: null,
  ctx: null,
  particles: [],
  rafId: null,
  width: 0,
  height: 0,
};

function initWeatherAnimationCanvas() {
  const canvas = document.getElementById('weather-animation');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WEATHER_ANIM.width = canvas.width;
    WEATHER_ANIM.height = canvas.height;
  };
  resize();
  window.addEventListener('resize', resize);

  WEATHER_ANIM.canvas = canvas;
  WEATHER_ANIM.ctx = ctx;
}

/**
 * 天気に応じたパーティクルの初期化
 */
function createWeatherParticles(type) {
  const count =
    type === 'Rain' || type === 'Drizzle'
      ? 120
      : type === 'Snow'
      ? 80
      : 60;

  const w = WEATHER_ANIM.width;
  const h = WEATHER_ANIM.height;
  const particles = [];

  for (let i = 0; i < count; i++) {
    if (type === 'Rain' || type === 'Drizzle') {
      // 雨：落ちてくる線
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speedY: 4 + Math.random() * 6,
        length: 10 + Math.random() * 15,
        opacity: 0.2 + Math.random() * 0.4,
      });
    } else if (type === 'Snow') {
      // 雪：ゆっくり落ちる丸
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 1 + Math.random() * 2,
        speedY: 0.5 + Math.random() * 1.5,
        drift: (Math.random() - 0.5) * 0.5,
        opacity: 0.5 + Math.random() * 0.5,
      });
    } else {
      // 晴れ・曇り・その他：ふわふわ光る粒
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 1 + Math.random() * 2,
        speedY: -0.2 - Math.random() * 0.8,
        opacity: 0.15 + Math.random() * 0.25,
      });
    }
  }

  WEATHER_ANIM.particles = particles;
}

/**
 * 天気種別からアニメ用のタイプを決定
 */
function normalizeWeatherType(main) {
  if (!main) return 'Default';
  if (main === 'Rain' || main === 'Drizzle') return 'Rain';
  if (main === 'Snow') return 'Snow';
  if (main === 'Thunderstorm') return 'Rain'; // 雷は強めの雨として扱う
  if (main === 'Mist' || main === 'Fog' || main === 'Haze' || main === 'Smoke')
    return 'Clouds';
  if (main === 'Clear') return 'Clear';
  if (main === 'Clouds') return 'Clouds';
  return 'Default';
}

/**
 * 天気に応じてアニメーションを開始
 */
function setWeatherAnimation(main) {
  const canvas = document.getElementById('weather-animation');
  if (!canvas) return;

  if (!WEATHER_ANIM.ctx) {
    initWeatherAnimationCanvas();
  }

  const type = normalizeWeatherType(main);

  // 同じタイプなら何もしない
  if (WEATHER_ANIM.type === type && WEATHER_ANIM.rafId != null) {
    return;
  }

  // 既存ループ停止
  if (WEATHER_ANIM.rafId != null) {
    cancelAnimationFrame(WEATHER_ANIM.rafId);
    WEATHER_ANIM.rafId = null;
  }

  WEATHER_ANIM.type = type;
  createWeatherParticles(type);
  animateWeather();
}

/**
 * メインループ
 */
function animateWeather() {
  const { ctx, width: w, height: h, particles, type } = WEATHER_ANIM;
  if (!ctx || !w || !h || !particles.length) return;

  ctx.clearRect(0, 0, w, h);

  // 少し暗めのオーバーレイで雰囲気出してもOK（薄めに）
  // ctx.fillStyle = 'rgba(0,0,0,0.05)';
  // ctx.fillRect(0, 0, w, h);

  if (type === 'Rain') {
    ctx.strokeStyle = 'rgba(200, 220, 255, 0.4)';
    ctx.lineWidth = 1.2;
    for (const p of particles) {
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + p.length);
      ctx.stroke();

      p.y += p.speedY;
      if (p.y > h) {
        p.y = -p.length;
        p.x = Math.random() * w;
      }
    }
  } else if (type === 'Snow') {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (const p of particles) {
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      p.y += p.speedY;
      p.x += p.drift;

      if (p.y > h + 5) {
        p.y = -10;
        p.x = Math.random() * w;
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
    }
  } else {
    // Clear / Clouds / Default: 上にふわっと上がる粒
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (const p of particles) {
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      p.y += p.speedY;
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
    }
  }

  ctx.globalAlpha = 1;
  WEATHER_ANIM.rafId = requestAnimationFrame(animateWeather);
}
