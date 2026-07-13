const seededLiveDashboardRooms = [
  { id: "106176", name: "微视中国", title: "文旅狮子正在直播", host: "苏玥", viewers: 126 },
  { id: "106188", name: "国风好物", title: "国风好物专场", host: "小暖", viewers: 89 },
  { id: "106203", name: "星球生活", title: "机器人生活方式直播", host: "星栖", viewers: 54 },
  { id: "206176", name: "国风文旅", title: "非遗文化讲解直播", host: "绛央", viewers: 77 },
  { id: "206188", name: "国风文旅", title: "古城夜游与民俗讲解", host: "青禾", viewers: 126 },
];

const liveDashboardState = {
  roomId: "106176",
  range: "1分钟",
  audience: "年龄",
  preview: "视频",
  funnelRange: "整场",
  tick: 0,
  updatedAt: new Date(),
};

let liveDashboardTimer = null;
let liveRecordingSelection = "";
let liveRecordingRange = { start: "", end: "" };
let liveRoomSwitchFilters = { keyword: "", status: "全部" };
let liveRoomSwitchPage = 1;
const liveRoomSwitchPageSize = 10;
const liveRoomSessionUsers = ["金老师的小脑斧", "婚旅世界", "微视戏剧", "南方游客", "岭南生活家", "漫游小队", "国潮选品官", "城市旅人"];

const liveDashboardProducts = [
  { name: "非遗手作醒狮香囊", clicks: 86, sales: 12, amount: "¥1,548" },
  { name: "岭南风物礼盒", clicks: 62, sales: 5, amount: "¥945" },
  { name: "醒狮文创帆布袋", clicks: 37, sales: 3, amount: "¥267" },
  { name: "广彩杯碟套装", clicks: 24, sales: 2, amount: "¥198" },
  { name: "城市漫游明信片", clicks: 18, sales: 1, amount: "¥49" },
];

const liveDashboardAudience = {
  年龄: [
    ["18–23岁", 16],
    ["24–30岁", 32],
    ["31–40岁", 29],
    ["41–50岁", 17],
    ["50岁以上", 6],
  ],
  性别: [
    ["女性", 68],
    ["男性", 30],
    ["未知", 2],
  ],
  区域: [
    ["广东", 36],
    ["广西", 18],
    ["湖南", 15],
    ["浙江", 12],
    ["其他", 19],
  ],
};

const liveDashboardComments = [
  ["小羊不迷路", "这个醒狮香囊有其他颜色吗？"],
  ["海边的风", "主播讲得很清楚，已经下单啦"],
  ["南方游客", "礼盒什么时候发货？"],
  ["小橘子", "想看一下帆布袋的细节"],
];

function currentLiveDashboardRoom() {
  const rooms = availableLiveDashboardRooms();
  const room = rooms.find((item) => item.id === liveDashboardState.roomId) || rooms[0] || allLiveDashboardRooms()[0] || seededLiveDashboardRooms[0];
  if (room.id !== liveDashboardState.roomId) liveDashboardState.roomId = room.id;
  return room;
}

function allLiveDashboardRooms() {
  const seeded = new Map(seededLiveDashboardRooms.map((room) => [room.id, room]));
  const channels = window.phase2State?.channels || [];
  return Object.entries(window.phase2State?.rooms || {}).map(([id, room], index) => {
    const known = seeded.get(id);
    const base = known || (() => {
      const channel = channels.find((item) => item.id === room.channelId);
      return {
        id,
        name: channel?.name || "微视中国",
        title: room.title || "直播好物专场",
        host: room.host || room.robotName,
        viewers: room.viewers || 42 + ((index * 17) % 180),
      };
    })();
    return { ...base, ...liveRoomSessionData(base, index) };
  });
}

function liveRoomSessionData(room, index) {
  const date = index < 36 ? "2026-07-13" : "2026-07-12";
  const hour = String(13 + ((index * 3) % 7)).padStart(2, "0");
  const minute = String((index * 7 + 4) % 60).padStart(2, "0");
  const endMinute = String((Number(minute) + 22) % 60).padStart(2, "0");
  const status = room.status || (index % 6 === 5 ? "已结束" : "直播中");
  return {
    userNickname: room.userNickname || liveRoomSessionUsers[index % liveRoomSessionUsers.length],
    userId: room.userId || `11${String(499672 + index * 91).padStart(7, "0")}`,
    startedAt: room.startedAt || `${date} ${hour}:${minute}:06`,
    status,
    endedAt: room.endedAt || (status === "已结束" ? `${date} ${hour}:${endMinute}:42` : "--"),
  };
}

function availableLiveDashboardRooms() {
  const channelId = window.phase2State?.snapshot().currentChannelId || "channel-weishi";
  const rooms = allLiveDashboardRooms();
  if (window.phase2State?.isPlatformChannel?.()) return rooms;
  return rooms.filter((room) => (phase2State.rooms[room.id]?.channelId || "channel-weishi") === channelId);
}

function liveDashboardRoomStatus(room) {
  return room.status || "直播中";
}

function filteredLiveDashboardRooms() {
  const keyword = liveRoomSwitchFilters.keyword.trim().toLowerCase();
  return availableLiveDashboardRooms().filter((room) => {
    const matchesStatus = liveRoomSwitchFilters.status === "全部" || liveDashboardRoomStatus(room) === liveRoomSwitchFilters.status;
    return matchesStatus && (!keyword || room.title.toLowerCase().includes(keyword));
  });
}

function pagedLiveDashboardRooms(rooms) {
  const totalPages = Math.max(1, Math.ceil(rooms.length / liveRoomSwitchPageSize));
  liveRoomSwitchPage = Math.min(Math.max(liveRoomSwitchPage, 1), totalPages);
  const start = (liveRoomSwitchPage - 1) * liveRoomSwitchPageSize;
  return rooms.slice(start, start + liveRoomSwitchPageSize);
}

function liveRoomSwitchPagination(total) {
  const totalPages = Math.max(1, Math.ceil(total / liveRoomSwitchPageSize));
  const pageNumbers = Array.from({ length: Math.min(totalPages, 6) }, (_, index) => index + 1);
  return `<div class="live-room-switch-pagination"><span>共 ${total} 条</span><div><button type="button" ${liveRoomSwitchPage === 1 ? "disabled" : ""} onclick="setLiveRoomSwitchPage(${liveRoomSwitchPage - 1})">‹</button>${pageNumbers.map((page) => `<button type="button" class="${page === liveRoomSwitchPage ? "active" : ""}" onclick="setLiveRoomSwitchPage(${page})">${page}</button>`).join("")}${totalPages > 6 ? `<span>…</span><button type="button" onclick="setLiveRoomSwitchPage(${totalPages})">${totalPages}</button>` : ""}<button type="button" ${liveRoomSwitchPage === totalPages ? "disabled" : ""} onclick="setLiveRoomSwitchPage(${liveRoomSwitchPage + 1})">›</button></div></div>`;
}

function currentLiveVideoState() {
  return window.phase2State
    ? phase2State.videoState(liveDashboardState.roomId)
    : { mode: "live", recordingId: "", faultType: "", recovering: false };
}

function liveVideoModeLabel(mode) {
  return {
    live: "实时画面",
    recorded_manual: "人工录播",
    recorded_auto: "故障自动录播",
    recovering: "恢复检测中",
  }[mode] || "实时画面";
}

function escapeLiveHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function liveHandoffMark(title, body, tone = "new") {
  return typeof window.handoffMark === "function" ? window.handoffMark(title, body, tone) : "";
}

function liveDashboardPanel(title, body, className = "", actions = "") {
  return `
    <section class="live-data-panel ${className}">
      <header class="live-panel-header">
        <h3><i></i>${title}</h3>
        ${actions}
      </header>
      <div class="live-panel-body">${body}</div>
    </section>
  `;
}

function liveDashboardTabs(items, active, handler, className = "") {
  return `
    <div class="live-compact-tabs ${className}">
      ${items.map((item) => `<button class="${item === active ? "active" : ""}" type="button" onclick="${handler}('${item}')">${item}</button>`).join("")}
    </div>
  `;
}

function liveDashboardMetric(label, value, sub = "", tone = "") {
  return `
    <div class="live-kpi ${tone}">
      <span>${label}</span>
      <strong>${value}</strong>
      ${sub ? `<small>${sub}</small>` : ""}
    </div>
  `;
}

function renderLiveDashboardFunnel() {
  const steps = [
    ["直播间曝光人数", 3942, ""],
    ["直播间进入人数", 738, "18.72%"],
    ["商品点击人数", 227, "30.76%"],
    ["下单人数", 21, "9.25%"],
    ["支付成功人数", 18, "85.71%"],
  ];
  const body = `
    <div class="live-funnel-list">
      ${steps.map(([label, value, rate], index) => `
        <div class="live-funnel-step">
          <b style="width:${98 - index * 12}%">${Number(value).toLocaleString()}</b>
          <span>${label}</span>
          ${rate ? `<small>${rate}</small>` : ""}
        </div>
      `).join("")}
    </div>
  `;
  return liveDashboardPanel(
    "流量转化",
    body,
    "live-funnel-panel",
    liveDashboardTabs(["整场", "半小时", "一小时"], liveDashboardState.funnelRange, "setLiveDashboardFunnelRange"),
  );
}

function renderLiveDashboardProducts() {
  const body = `
    <div class="live-product-list">
      ${liveDashboardProducts.map((product, index) => `
        <div class="live-product-row">
          <b>${index + 1}</b>
          <div><span>${product.name}</span><small>点击 ${product.clicks} · 成交 ${product.sales}</small></div>
          <strong>${product.amount}</strong>
        </div>
      `).join("")}
    </div>
  `;
  return liveDashboardPanel("商品销售Top5", body, "live-products-panel");
}

function renderLiveDashboardHero(room, viewers, gmv) {
  const body = `
    <div class="live-gmv"><strong>¥ ${gmv.toLocaleString()}</strong><span>千次观看成交金额 ¥${Math.round(gmv / 3.94)}</span></div>
    <div class="live-metric-grid">
      ${liveDashboardMetric("当前在线人数", viewers)}
      ${liveDashboardMetric("累计在线人数", 738 + liveDashboardState.tick * 2)}
      ${liveDashboardMetric("每分钟在线人数", "12")}
      ${liveDashboardMetric("人均观看时长", "4m 16s")}
      ${liveDashboardMetric("新增粉丝人数", `+${42 + liveDashboardState.tick}`)}
      ${liveDashboardMetric("商品点击率", "30.76%")}
      ${liveDashboardMetric("商品转化率", "9.25%")}
      ${liveDashboardMetric("成交订单数", "18")}
      ${liveDashboardMetric("累计曝光次数", (3942 + liveDashboardState.tick * 6).toLocaleString())}
    </div>
  `;
  return liveDashboardPanel("直播间成交金额", body, "live-hero-panel");
}

function renderLiveDashboardSummary(viewers, gmv) {
  return `
    <div class="live-summary-grid">
      <div class="live-summary-card"><i class="blue">人</i>${liveDashboardMetric("实时在线人数", viewers, `最高 ${viewers + 18}`)}</div>
      <div class="live-summary-card"><i class="amber">¥</i>${liveDashboardMetric("实时销售额(GMV)", `¥ ${gmv.toLocaleString()}`, "订单数 18", "amber")}</div>
      <div class="live-summary-card"><i class="yellow">粉</i>${liveDashboardMetric("新增粉丝", `+${42 + liveDashboardState.tick}`, "总粉丝 1.8万")}</div>
      <div class="live-summary-card"><i class="green">互</i>${liveDashboardMetric("互动率", "12.84%", "点赞 436 · 评论 72")}</div>
    </div>
  `;
}

function renderLiveDashboardTrend() {
  const actions = liveDashboardTabs(["整场", "1小时", "10分钟", "5分钟", "1分钟"], liveDashboardState.range, "setLiveDashboardRange", "live-range-tabs");
  const body = `
    <div class="live-chart-legend"><span class="blue">曝光次数</span><span class="green">在线人数</span><span class="amber">商品点击人数</span></div>
    <canvas id="liveTrendCanvas" class="live-trend-canvas" aria-label="直播综合趋势图"></canvas>
  `;
  return liveDashboardPanel("综合趋势", body, "live-trend-panel", actions);
}

function renderLiveDashboardPreview(room, viewers) {
  const source = currentLiveVideoState();
  const sourceLabel = liveVideoModeLabel(source.mode);
  const selectedRecording = window.phase2State ? phase2State.recordingById(source.recordingId) : null;
  const actions = liveDashboardTabs(["视频", "评论"], liveDashboardState.preview, "setLiveDashboardPreview");
  const body = liveDashboardState.preview === "视频"
    ? `
      <div class="live-preview-media">
        <img src="./assets/live-dashboard-host.webp" alt="${room.host}直播画面" />
        <span class="live-preview-status ${source.mode !== "live" ? "recorded" : ""}">${sourceLabel} · ${viewers}人</span>
        <div class="live-preview-caption"><strong>${room.host}</strong><small>${selectedRecording ? `正在播放 ${escapeLiveHtml(selectedRecording.name)}` : source.mode === "recovering" ? "设备已恢复，等待人工确认" : "机器人主播 · 正在讲解醒狮香囊"}</small></div>
      </div>
    `
    : `
      <div class="live-comment-list">
        ${liveDashboardComments.map(([name, text], index) => `
          <div><i class="tone-${index}">${name.slice(0, 1)}</i><p><strong>${name}</strong><span>${text}</span></p></div>
        `).join("")}
      </div>
    `;
  return liveDashboardPanel(sourceLabel, body, "live-preview-panel", actions);
}

function renderLiveDashboardAudience() {
  const data = liveDashboardAudience[liveDashboardState.audience];
  const body = `
    ${liveDashboardTabs(["年龄", "性别", "区域"], liveDashboardState.audience, "setLiveDashboardAudience", "live-audience-tabs")}
    <div class="live-audience-bars">
      ${data.map(([label, value]) => `
        <div><span>${label}</span><i><b style="width:${value}%"></b></i><strong>${value}%</strong></div>
      `).join("")}
    </div>
  `;
  return liveDashboardPanel("观看用户画像", body, "live-audience-panel");
}

function renderLiveDashboardRegions() {
  const regions = liveDashboardAudience.区域.slice(0, 4);
  const body = `
    <div class="live-region-layout">
      <div class="live-region-ring"><span>Top5</span></div>
      <div class="live-region-list">
        ${regions.map(([label, value], index) => `<div><i class="region-${index}"></i><span>${label}</span><strong>${value}%</strong></div>`).join("")}
      </div>
    </div>
  `;
  return liveDashboardPanel("观众地域分布 (Top5)", body, "live-region-panel");
}

function renderLiveDashboardMarketing(gmv) {
  const body = `
    <div class="live-report-cover"><b>直播带货优化建议报告</b><span>基于本场实时数据生成的智能诊断策略</span></div>
    <div class="live-report-card">
      <h4>核心数据概览</h4>
      <div class="live-report-grid">
        <div><b>${738 + liveDashboardState.tick * 2}</b><span>累计观看</span></div>
        <div><b>20分${24 + liveDashboardState.tick}秒</b><span>直播时长</span></div>
        <div><b>¥${gmv.toLocaleString()}</b><span>GMV/成交额</span></div>
        <div><b>227</b><span>商品点击</span></div>
      </div>
    </div>
    <div class="live-report-card live-suggestion-card">
      <h4>数据可视化分析</h4>
      <p>商品点击率高于同类场次均值，建议在未来 8 分钟增加醒狮香囊讲解频次并发放限时券。</p>
      <button type="button" onclick="toast('已生成完整优化建议（原型演示）')">查看完整建议 ›</button>
    </div>
  `;
  return liveDashboardPanel("营销", body, "live-marketing-panel");
}

function renderLiveDashboardPage() {
  const room = currentLiveDashboardRoom();
  const viewers = room.viewers + liveDashboardState.tick;
  const gmv = 2860 + liveDashboardState.tick * 39;
  const videoSource = currentLiveVideoState();
  const sourceLabel = liveVideoModeLabel(videoSource.mode);
  return `
    <div class="commerce-dashboard">
      <header class="live-dashboard-head">
        <div class="live-room-selector">
          <span><b>${room.name}</b>｜直播数据大屏</span>
          <small>直播ID ${room.id}</small>
        </div>
        <div class="live-session-status">
          <img src="./assets/live-dashboard-host.webp" alt="${room.host}头像" />
          <div><strong><span>直播中</span>${room.title}</strong><small>场次 19:21–20:21　用户ID 11495443</small></div>
          <i></i>
          <div class="live-duration"><small>总时长</small><b>00:20:${String(24 + liveDashboardState.tick).padStart(2, "0")}</b></div>
          <button class="live-source-switch mode-${videoSource.mode}" type="button" onclick="openLiveRecordingModal()"><small>当前画面</small><b>${sourceLabel}${liveHandoffMark("直播画面来源切换", "本次新增实时画面和录播画面切换入口，可人工选择最近72小时录屏或本地上传视频作为兜底画面。", "new")}</b></button>
        </div>
        <div class="live-head-actions">
          <button type="button" onclick="openLiveRoomSwitchModal()">切换直播间</button>
          <button type="button" onclick="openLiveFaultModal()">演示故障${liveHandoffMark("故障自动切录播", "选择网络、电机、扬声器、推流或系统故障后，会同步产生告警、操作日志和故障自动录播状态。", "new")}</button>
          ${videoSource.faultType && !videoSource.recovering ? `<button type="button" onclick="phase2State.recoverFault('${room.id}')">模拟恢复</button>` : ""}
          ${videoSource.recovering ? `<button class="danger" type="button" onclick="phase2State.confirmRecovery('${room.id}')">确认恢复</button>` : ""}
          <button type="button" onclick="openLiveOperationLogs()">操作日志${liveHandoffMark("直播控制操作日志", "记录人工切换、故障自动切换、恢复检测和确认恢复等直播控制动作。", "info")}</button>
          <button type="button" onclick="refreshLiveDashboard()">刷新</button>
          <button type="button" onclick="toggleLiveDashboardFullscreen()">全屏</button>
        </div>
      </header>

      <div class="live-dashboard-grid">
        <aside class="live-left-rail">
          ${renderLiveDashboardFunnel()}
          ${renderLiveDashboardProducts()}
        </aside>

        <section class="live-center-stage">
          ${renderLiveDashboardHero(room, viewers, gmv)}
          ${renderLiveDashboardSummary(viewers, gmv)}
          <div class="live-lower-grid">
            ${renderLiveDashboardTrend()}
            ${renderLiveDashboardPreview(room, viewers)}
          </div>
        </section>

        <aside class="live-right-rail">
          ${renderLiveDashboardAudience()}
          ${renderLiveDashboardRegions()}
          ${renderLiveDashboardMarketing(gmv)}
        </aside>
      </div>

      <footer class="live-dashboard-footer">
        <span><i></i>数据每 5 秒自动刷新</span>
        <span>最近更新 ${liveDashboardState.updatedAt.toLocaleTimeString("zh-CN", { hour12: false })}</span>
        <span>原型数据 · 非真实经营数据</span>
      </footer>
    </div>
  `;
}

function mountLiveDashboard() {
  drawLiveDashboardTrend();
  if (!liveDashboardTimer) {
    liveDashboardTimer = window.setInterval(() => {
      if (typeof activePage === "undefined" || activePage !== "live-dashboard") return;
      liveDashboardState.tick = (liveDashboardState.tick + 1) % 12;
      liveDashboardState.updatedAt = new Date();
      renderApp();
    }, 5000);
  }
}

function drawLiveDashboardTrend() {
  const canvas = document.getElementById("liveTrendCanvas");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  const width = rect.width;
  const height = rect.height;
  const left = 42;
  const right = width - 14;
  const top = 18;
  const bottom = height - 26;
  context.clearRect(0, 0, width, height);
  context.strokeStyle = "#1b4969";
  context.lineWidth = 1;
  context.fillStyle = "#66869d";
  context.font = '10px "PingFang SC", sans-serif';
  for (let index = 0; index <= 4; index += 1) {
    const y = top + ((bottom - top) * index) / 4;
    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(right, y);
    context.stroke();
    context.fillText(String(280 - index * 70), 8, y + 3);
  }
  const labels = liveDashboardState.range === "1分钟"
    ? ["19:59:00", "19:59:12", "19:59:24", "19:59:36", "19:59:48", "20:00:00"]
    : ["19:00", "19:12", "19:24", "19:36", "19:48", "20:00"];
  labels.forEach((label, index) => {
    const x = left + ((right - left) * index) / (labels.length - 1);
    context.fillText(label, x - 18, height - 8);
  });
  const datasets = [
    { color: "#3da5ff", values: [246, 247, 249, 252, 254, 258 + liveDashboardState.tick * 2] },
    { color: "#2bd66f", values: [118, 119, 120, 120, 122, 126 + liveDashboardState.tick] },
    { color: "#f7a928", values: [52, 53, 54, 55, 56, 58 + Math.floor(liveDashboardState.tick / 2)] },
  ];
  datasets.forEach((dataset) => {
    context.strokeStyle = dataset.color;
    context.lineWidth = 2;
    context.beginPath();
    dataset.values.forEach((value, index) => {
      const x = left + ((right - left) * index) / (dataset.values.length - 1);
      const y = bottom - (value / 280) * (bottom - top);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
  });
}

function changeLiveDashboardRoom(roomId) {
  if (!availableLiveDashboardRooms().some((room) => room.id === roomId)) {
    window.toast?.("当前渠道无权查看该直播间");
    return;
  }
  liveDashboardState.roomId = roomId;
  liveDashboardState.tick = 0;
  liveDashboardState.updatedAt = new Date();
  renderApp();
}

function openLiveRoomSwitchModal() {
  const rooms = filteredLiveDashboardRooms();
  const pageRooms = pagedLiveDashboardRooms(rooms);
  openModal(`
    <div class="modal large live-room-switch-modal">
      <div class="modal-header"><div class="modal-title">选择直播间</div><button class="modal-close" type="button" aria-label="关闭" onclick="closeModal()">×</button></div>
      <div class="modal-body">
        <div class="live-room-switch-toolbar">
          <input id="liveRoomSwitchKeyword" class="input" type="search" value="${escapeLiveHtml(liveRoomSwitchFilters.keyword)}" placeholder="搜索直播间标题">
          <select class="input" onchange="setLiveRoomSwitchStatus(this.value)">
            ${[["全部", "状态"], ["直播中", "直播中"], ["已结束", "已结束"]].map(([value, label]) => `<option value="${value}" ${liveRoomSwitchFilters.status === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
          <button class="btn" type="button" onclick="searchLiveRoomSwitch()">搜索</button>
        </div>
        <div class="table-wrap live-room-switch-table"><table class="data-table"><thead><tr><th>ID</th><th>开播时间</th><th>用户昵称</th><th>用户ID</th><th>直播间标题</th><th>状态</th><th>关播时间</th><th>操作</th></tr></thead><tbody>
          ${pageRooms.length ? pageRooms.map((item) => `<tr><td>${escapeLiveHtml(item.id)}</td><td>${escapeLiveHtml(item.startedAt)}</td><td>${escapeLiveHtml(item.userNickname)}</td><td>${escapeLiveHtml(item.userId)}</td><td>${escapeLiveHtml(item.title)}</td><td><span class="live-room-status ${item.status === "已结束" ? "ended" : ""}">${escapeLiveHtml(item.status)}</span></td><td>${escapeLiveHtml(item.endedAt)}</td><td><button class="btn small" type="button" onclick="selectLiveDashboardRoom('${item.id}')">选择</button></td></tr>`).join("") : '<tr><td colspan="8" class="live-room-switch-empty">未找到匹配的直播间</td></tr>'}
        </tbody></table></div>
        ${liveRoomSwitchPagination(rooms.length)}
      </div>
    </div>`);
}

function searchLiveRoomSwitch() {
  liveRoomSwitchFilters.keyword = document.getElementById("liveRoomSwitchKeyword")?.value || "";
  liveRoomSwitchPage = 1;
  openLiveRoomSwitchModal();
}

function setLiveRoomSwitchStatus(status) {
  liveRoomSwitchFilters.status = status;
  liveRoomSwitchPage = 1;
  openLiveRoomSwitchModal();
}

function setLiveRoomSwitchPage(page) {
  liveRoomSwitchPage = page;
  openLiveRoomSwitchModal();
}

function selectLiveDashboardRoom(roomId) {
  closeModal();
  changeLiveDashboardRoom(roomId);
}

function setLiveDashboardRange(range) {
  liveDashboardState.range = range;
  renderApp();
}

function setLiveDashboardAudience(type) {
  liveDashboardState.audience = type;
  renderApp();
}

function setLiveDashboardPreview(type) {
  liveDashboardState.preview = type;
  renderApp();
}

function setLiveDashboardFunnelRange(range) {
  liveDashboardState.funnelRange = range;
  renderApp();
}

function refreshLiveDashboard() {
  liveDashboardState.tick = (liveDashboardState.tick + 3) % 12;
  liveDashboardState.updatedAt = new Date();
  renderApp();
  toast("大屏数据已刷新");
}

async function toggleLiveDashboardFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    toast("当前浏览器不支持全屏预览");
  }
}

function openLiveRecordingModal() {
  const room = currentLiveDashboardRoom();
  const source = currentLiveVideoState();
  const now = new Date();
  if (!liveRecordingRange.start || !liveRecordingRange.end) {
    liveRecordingRange = {
      start: new Date(now.getTime() - 72 * 3600000).toISOString().slice(0, 16),
      end: now.toISOString().slice(0, 16),
    };
  }
  const recordings = filteredLiveRecordings(room.id);
  if (!liveRecordingSelection) liveRecordingSelection = source.recordingId || recordings[0]?.id || "";
  if (liveRecordingSelection && !recordings.some((item) => item.id === liveRecordingSelection)) liveRecordingSelection = recordings[0]?.id || "";
  const selected = phase2State.recordingById(liveRecordingSelection);
  openModal(`
    <div class="modal large live-recording-modal">
      <div class="modal-header"><div class="modal-title">切换实时画面 / 录播画面</div><button class="modal-close" onclick="closeModal()">×</button></div>
      <div class="modal-body">
        <div class="live-source-current"><span>当前画面状态</span><strong class="mode-${source.mode}">${liveVideoModeLabel(source.mode)}</strong>${source.faultType ? `<em>${escapeLiveHtml(source.faultType)}</em>` : ""}</div>
        <div class="live-recording-toolbar">
          <label><span>开始时间</span><input class="input" type="datetime-local" value="${liveRecordingRange.start}" onchange="setLiveRecordingRange('start', this.value)"></label>
          <label><span>结束时间</span><input class="input" type="datetime-local" value="${liveRecordingRange.end}" onchange="setLiveRecordingRange('end', this.value)"></label>
          <label class="btn secondary live-upload-button">上传录屏<input type="file" accept="video/*" onchange="handleLiveRecordingUpload(this)"></label>
        </div>
        <div class="live-recording-layout">
          <div class="live-recording-list">
            <div class="live-recording-list-head"><strong>最近72小时录屏${liveHandoffMark("最近72小时录屏池", "录播弹层按开始和结束时间筛选最近72小时录屏，24小时内资源优先标识并支持本地上传预览。", "info")}</strong><span>${recordings.length} 个文件</span></div>
            ${recordings.length ? recordings.map((item) => `
              <button class="live-recording-row ${item.id === liveRecordingSelection ? "selected" : ""}" type="button" onclick="selectLiveRecording('${item.id}')">
                <span class="live-recording-radio"></span>
                <div><strong>${escapeLiveHtml(item.name)}</strong><small>${new Date(item.startAt).toLocaleString("zh-CN", { hour12: false })} · ${escapeLiveHtml(item.duration)}</small></div>
                ${phase2State.isRecent24(item) ? `<i>24小时优先</i>` : `<i class="muted">72小时内</i>`}
                ${item.source === "upload" ? `<em>本地上传</em>` : ""}
              </button>`).join("") : `<div class="live-recording-empty">最近72小时暂无录屏文件</div>`}
          </div>
          <aside class="live-recording-preview">
            <div class="live-recording-preview-screen">${selected?.objectUrl ? `<video src="${escapeLiveHtml(selected.objectUrl)}" controls></video>` : `<span>▶</span><strong>${selected ? escapeLiveHtml(selected.name) : "请选择录屏文件"}</strong>`}</div>
            ${selected ? `<dl><div><dt>录制时间</dt><dd>${new Date(selected.startAt).toLocaleString("zh-CN", { hour12: false })}</dd></div><div><dt>时长</dt><dd>${escapeLiveHtml(selected.duration)}</dd></div><div><dt>关联机器人</dt><dd>${escapeLiveHtml(selected.robotId)}</dd></div></dl><div class="live-preview-actions"><button class="btn secondary" onclick="previewLiveRecording('${selected.id}')">预览</button><button class="btn secondary" onclick="downloadLiveRecording('${selected.id}')">下载</button></div>` : ""}
          </aside>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="phase2State.switchToLive('${room.id}');closeModal()">切回实时画面</button><button class="btn secondary" onclick="closeModal()">取消</button><button class="btn" ${selected ? "" : "disabled"} onclick="confirmLiveRecordingSwitch()">确认切换录播</button></div>
    </div>`);
}

function filteredLiveRecordings(roomId) {
  const start = new Date(liveRecordingRange.start || 0).getTime();
  const end = new Date(liveRecordingRange.end || Date.now()).getTime();
  return phase2State.recordingsFor(roomId).filter((item) => {
    const time = new Date(item.startAt).getTime();
    return time >= start && time <= end;
  });
}

function setLiveRecordingRange(key, value) {
  liveRecordingRange[key] = value;
  openLiveRecordingModal();
}

function selectLiveRecording(recordingId) {
  liveRecordingSelection = recordingId;
  openLiveRecordingModal();
}

function handleLiveRecordingUpload(input) {
  const file = input.files?.[0];
  if (!file) return;
  const item = phase2State.uploadRecording(liveDashboardState.roomId, file.name, URL.createObjectURL(file));
  if (item) liveRecordingSelection = item.id;
  openLiveRecordingModal();
}

function previewLiveRecording(recordingId) {
  liveRecordingSelection = recordingId;
  openLiveRecordingModal();
}

function confirmLiveRecordingSwitch() {
  if (!liveRecordingSelection) return;
  if (phase2State.switchToRecording(liveDashboardState.roomId, liveRecordingSelection, false)) closeModal();
}

function downloadLiveRecording(recordingId) {
  const item = phase2State.recordingById(recordingId);
  if (!item) return;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([`原型录屏文件：${item.name}`], { type: "video/mp4" }));
  link.download = item.name;
  link.click();
  URL.revokeObjectURL(link.href);
  toast("录屏文件已开始下载");
}

function openLiveFaultModal() {
  const room = currentLiveDashboardRoom();
  openModal(`
    <div class="modal live-fault-modal">
      <div class="modal-header"><div class="modal-title">演示机器人故障</div><button class="modal-close" onclick="closeModal()">×</button></div>
      <div class="modal-body"><p class="live-fault-tip">选择故障后将同步产生告警、操作日志和运维大屏状态，并尝试自动选择最近24小时录屏。${liveHandoffMark("故障联动范围", "故障演示会同时影响直播数据大屏、机器人运维告警、画面来源和操作日志，用于验证异常兜底闭环。", "info")}</p><div class="live-fault-grid">
        ${["网络异常", "电机异常", "扬声器异常", "推流异常", "系统异常"].map((type) => `<button type="button" onclick="phase2State.triggerFault('${room.id}','${type}');closeModal()"><strong>${type}</strong><span>${type === "电机异常" || type === "系统异常" ? "高风险 · 恢复需人工确认" : "恢复后可自动切回"}</span></button>`).join("")}
      </div></div>
      <div class="modal-footer"><button class="btn secondary" onclick="closeModal()">取消</button></div>
    </div>`);
}

function openLiveOperationLogs() {
  const room = currentLiveDashboardRoom();
  const logs = phase2State.snapshot().logs.filter((item) => item.roomId === room.id);
  openModal(`
    <div class="modal large live-log-modal">
      <div class="modal-header"><div class="modal-title">画面切换操作日志 · ${room.id}</div><button class="modal-close" onclick="closeModal()">×</button></div>
      <div class="modal-body"><div class="table-wrap"><table class="data-table"><thead><tr><th>时间</th><th>机器人</th><th>操作</th><th>详情</th><th>操作人</th></tr></thead><tbody>${logs.length ? logs.map((item) => `<tr><td>${new Date(item.at).toLocaleString("zh-CN", { hour12: false })}</td><td>${escapeLiveHtml(item.robotId)}</td><td>${escapeLiveHtml(item.action)}</td><td>${escapeLiveHtml(item.detail)}</td><td>${escapeLiveHtml(item.operator)}</td></tr>`).join("") : `<tr><td colspan="5">暂无操作日志</td></tr>`}</tbody></table></div></div>
      <div class="modal-footer"><button class="btn" onclick="closeModal()">关闭</button></div>
    </div>`);
}
