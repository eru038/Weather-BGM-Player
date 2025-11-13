// Spotifyログイン処理
async function ensureLoggedIn() {
    let token = localStorage.getItem("spotify_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    return token;
  }
  
  // プレミアム判定
  let IS_PREMIUM = false;
  
  // デバイス確認
  async function ensureActiveDevice(token) {
    const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    if (!data.devices || data.devices.length === 0) {
      alert("Spotifyデバイスがアクティブではありません。Spotifyを開いてください。");
      return null;
    }
    return data.devices[0].id;
  }
  
  // 天気に応じてプレイリスト検索・再生
  async function playWeatherOnSpotify() {
    const token = await ensureLoggedIn();
    const q = document.getElementById("weatherIcon")?.textContent || "pop";
    const search = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=playlist&limit=1`, {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await search.json();
    if (!data.playlists.items.length) return alert("プレイリストが見つかりません。");
    const playlist = data.playlists.items[0];
  
    if (!IS_PREMIUM) {
      window.open(playlist.external_urls.spotify, "_blank");
      return;
    }
  
    const deviceId = await ensureActiveDevice(token);
    if (!deviceId) return;
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ context_uri: playlist.uri })
    });
  }
  
  // プレイリスト再生
  async function playSpotifyPlaylist(uri) {
    const token = await ensureLoggedIn();
    const deviceId = await ensureActiveDevice(token);
    if (!deviceId) return;
  
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ context_uri: uri })
    });
  }
  
  // プレイリスト一覧表示
  async function renderUserPlaylists() {
    const token = await ensureLoggedIn();
    const res = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    const list = document.getElementById("playlistList");
    if (!list) return;
  
    list.innerHTML = "";
    data.items.forEach(p => {
      const div = document.createElement("div");
      div.className = "playlist-card";
      div.innerHTML = `
        <img src="${p.images[0]?.url || ""}" alt="">
        <p>${p.name}</p>
        <button onclick="playSpotifyPlaylist('${p.uri}')">再生</button>
        <button onclick="renderTracksForPlaylist('${p.id}')">曲一覧</button>
      `;
      list.appendChild(div);
    });
  }
  
  // プレイリスト内の曲を表示
  async function renderTracksForPlaylist(playlistId) {
    const token = await ensureLoggedIn();
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: "Bearer " + token }
    });
  
    const data = await res.json();
    const list = document.getElementById("playlistList");
    if (!list) return;
  
    const tracksContainer = document.createElement("div");
    tracksContainer.className = "track-list";
    tracksContainer.innerHTML = `<h3>トラック一覧</h3>`;
  
    data.items.forEach(item => {
      const t = item.track;
      if (!t) return;
  
      const div = document.createElement("div");
      div.className = "track-item";
      div.innerHTML = `
        <img src="${t.album.images[0]?.url || ""}" alt="" width="50">
        <p>${t.name} - ${t.artists.map(a => a.name).join(", ")}</p>
        <button onclick="playSpotifyPlaylist('${t.uri}')">再生</button>
        <button onclick="window.open('${t.external_urls.spotify}', '_blank')">Spotifyで開く</button>
      `;
      tracksContainer.appendChild(div);
    });
  
    list.innerHTML = "";
    list.appendChild(tracksContainer);
  }
  