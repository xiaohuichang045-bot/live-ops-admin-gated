(function createRobotOpsModule(global) {
  "use strict";

  const filterOptions = {
    version: ["全部", "R版", "Z版", "AGV版"],
    onlineState: ["全部", "在线", "离线", "异常"],
    alertType: ["全部", "网络异常", "电机异常", "音频异常", "推流异常", "系统异常"],
    hours: [1, 3, 6, 12, 24],
  };

  const seedDevices = [
    device("DT-LIVE-001", "星栖", "Z版", "直播", "在线", "正常", "正常", "正常", "正常", "云紫", "2026-07-10 18:59:48"),
    device("DT-LIVE-002", "知鹤", "R版", "对话", "在线", "正常", "正常", "正常", "正常", "海蓝", "2026-07-10 18:59:42"),
    device("DT-LIVE-003", "小暖", "Z版", "直播", "异常", "正常", "正常", "正常", "3号电机异常", "霓虹", "2026-07-10 18:59:36", "3号电机异常"),
    device("DT-LIVE-004", "柳如春", "R版", "直播", "异常", "网络异常", "正常", "正常", "正常", "暖橙", "2026-07-10 18:59:31", "网络连接中断"),
    device("DT-LIVE-005", "云涵", "Z版", "对话", "在线", "正常", "未检测", "正常", "正常", "薄荷", "2026-07-10 18:59:24"),
    device("DT-LIVE-006", "东哥外卖", "AGV版", "直播", "离线", "离线", "未检测", "未检测", "未检测", "深空", "2026-07-10 18:52:10", "设备离线"),
    device("DT-LIVE-007", "若琳", "Z版", "直播", "异常", "正常", "正常", "扬声器异常", "正常", "青绿", "2026-07-10 18:59:08", "扬声器无输出"),
    device("DT-LIVE-008", "小兰", "R版", "直播", "异常", "正常", "正常", "正常", "正常", "莓红", "2026-07-10 18:58:55", "推流异常"),
    device("DT-LIVE-009", "鲁博士", "Z版", "对话", "在线", "正常", "正常", "正常", "正常", "紫晶", "2026-07-10 18:58:39"),
    device("DT-LIVE-010", "关帝圣君", "AGV版", "直播", "在线", "正常", "正常", "正常", "正常", "金棕", "2026-07-10 18:58:21"),
    device("DT-LIVE-011", "AI萌宠", "R版", "直播", "异常", "正常", "麦克风异常", "正常", "正常", "靛蓝", "2026-07-10 18:58:02", "麦克风无输入"),
    device("DT-LIVE-012", "关羽", "Z版", "对话", "离线", "离线", "未检测", "未检测", "未检测", "银灰", "2026-07-10 18:48:43", "设备离线"),
    device("GFWL-001", "绛央", "AGV版", "直播", "在线", "正常", "正常", "正常", "正常", "金棕", "2026-07-10 18:59:52"),
    device("GFWL-002", "青禾", "Z版", "直播", "在线", "正常", "正常", "正常", "正常", "青绿", "2026-07-11 09:26:18"),
  ];

  const devices = buildDevicePool();

  const alerts = [
    alert("ALT-001", "DT-LIVE-003", 4, "严重", "电机异常", "3号电机异常"),
    alert("ALT-002", "DT-LIVE-006", 7, "严重", "系统异常", "设备心跳中断，设备离线"),
    alert("ALT-003", "DT-LIVE-004", 10, "高", "网络异常", "网络连接中断"),
    alert("ALT-004", "DT-LIVE-008", 14, "高", "推流异常", "直播推流异常中断"),
    alert("ALT-005", "DT-LIVE-011", 19, "中", "音频异常", "麦克风无输入"),
    alert("ALT-006", "DT-LIVE-007", 25, "中", "音频异常", "扬声器无输出"),
    alert("ALT-007", "DT-LIVE-012", 34, "高", "系统异常", "设备离线"),
    alert("ALT-008", "DT-LIVE-003", 48, "中", "电机异常", "3号电机温度过高"),
    alert("ALT-009", "DT-LIVE-004", 64, "中", "网络异常", "网络延迟过高"),
    alert("ALT-010", "DT-LIVE-008", 78, "高", "推流异常", "推流帧率低于阈值"),
    alert("ALT-011", "DT-LIVE-011", 92, "中", "音频异常", "麦克风输入音量过低"),
    alert("ALT-012", "DT-LIVE-003", 110, "高", "电机异常", "2号电机响应超时"),
    alert("ALT-013", "DT-LIVE-006", 132, "严重", "系统异常", "设备异常重启"),
    alert("ALT-014", "DT-LIVE-004", 156, "中", "网络异常", "网络丢包率过高"),
    alert("ALT-015", "DT-LIVE-007", 181, "中", "音频异常", "扬声器输出音量异常"),
    alert("ALT-016", "DT-LIVE-008", 207, "高", "推流异常", "推流服务连接失败"),
    alert("ALT-017", "DT-LIVE-003", 239, "中", "电机异常", "1号电机电流波动"),
    alert("ALT-018", "DT-LIVE-011", 276, "中", "音频异常", "麦克风检测异常"),
    alert("ALT-019", "DT-LIVE-004", 314, "高", "网络异常", "网络连接短暂中断"),
    alert("ALT-020", "DT-LIVE-009", 351, "低", "系统异常", "运行内存占用过高"),
    alert("ALT-021", "DT-LIVE-003", 398, "高", "电机异常", "4号电机校准失败"),
    alert("ALT-022", "DT-LIVE-008", 446, "中", "推流异常", "推流码率异常"),
    alert("ALT-023", "DT-LIVE-007", 503, "中", "音频异常", "扬声器检测失败"),
    alert("ALT-024", "DT-LIVE-004", 571, "中", "网络异常", "网络延迟过高"),
    alert("ALT-025", "DT-LIVE-006", 642, "严重", "系统异常", "设备服务异常退出"),
    alert("ALT-026", "DT-LIVE-003", 721, "中", "电机异常", "3号电机阻力异常"),
    alert("ALT-027", "DT-LIVE-011", 809, "中", "音频异常", "麦克风输入中断"),
    alert("ALT-028", "DT-LIVE-008", 903, "高", "推流异常", "推流认证失效"),
    alert("ALT-029", "DT-LIVE-004", 1015, "中", "网络异常", "网络抖动明显"),
    alert("ALT-030", "DT-LIVE-003", 1136, "高", "电机异常", "2号电机异常停转"),
    alert("ALT-031", "DT-LIVE-009", 1260, "低", "系统异常", "磁盘空间不足"),
    alert("ALT-032", "DT-LIVE-007", 1374, "中", "音频异常", "音频设备初始化失败"),
  ];

  const state = {
    filters: { version: "全部", onlineState: "全部", alertType: "全部", hours: 6 },
    viewMode: "grid",
    page: 1,
    pageSize: 12,
    fullscreen: false,
    selectedHour: null,
    selectedDeviceId: "",
    autoRefresh: true,
    lastRefresh: new Date(),
    refreshTimer: null,
  };

  function device(id, name, version, mode, onlineState, network, microphone, speaker, motor, scene, lastReportedAt, currentAlert = "") {
    return { id, name, type: "直播", version, mode, onlineState, network, microphone, speaker, motor, scene, lastReportedAt, currentAlert };
  }

  function buildDevicePool() {
    const names = ["清岚", "松月", "云栖", "青荷", "景明", "知夏", "星澜", "暮雨", "南枝", "禾风", "映雪", "若竹", "望舒", "云岫", "明棠", "春和", "晴川", "竹影", "沐白", "知微", "遥光", "初霁", "栖迟", "凝香", "予安", "照夜", "听澜", "溪亭", "书简", "向晚", "清越", "眠云", "时雨", "乐知", "安禾", "星回", "棠溪", "远山"];
    const versions = ["R版", "Z版", "AGV版"];
    const scenes = ["云紫", "海蓝", "霓虹", "暖橙", "薄荷", "深空", "青绿", "莓红", "紫晶", "金棕", "靛蓝", "银灰"];
    const states = ["在线", "在线", "在线", "异常", "离线"];
    const generated = names.map((name, index) => {
      const number = String(seedDevices.length + index + 1).padStart(3, "0");
      const version = versions[index % versions.length];
      const onlineState = states[index % states.length];
      const alertType = ["", "网络连接波动", "麦克风无输入", "扬声器异常", "3号电机异常"][index % 5];
      const network = onlineState === "离线" ? "离线" : alertType.includes("网络") ? "网络异常" : "正常";
      const microphone = onlineState === "离线" ? "未检测" : alertType.includes("麦克风") ? "麦克风异常" : "正常";
      const speaker = onlineState === "离线" ? "未检测" : alertType.includes("扬声器") ? "扬声器异常" : "正常";
      const motor = onlineState === "离线" ? "未检测" : alertType.includes("电机") ? "3号电机异常" : "正常";
      return device(`DT-LIVE-${number}`, name, version, version === "AGV版" ? "导览" : "直播", onlineState, network, microphone, speaker, motor, scenes[index % scenes.length], `2026-07-10 18:${String(58 - (index % 50)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}`, alertType);
    });
    return [...seedDevices, ...generated].slice(0, 52);
  }

  function alert(id, deviceId, minutesAgo, severity, type, message) {
    return { id, deviceId, minutesAgo, severity, type, message, resolved: false };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function opsHandoffMark(title, body, tone = "new") {
    return typeof global.handoffMark === "function" ? global.handoffMark(title, body, tone) : "";
  }

  function deviceById(id) {
    return devices.find((item) => item.id === id);
  }

  function severityRank(item) {
    if (item.severity === "严重") return 0;
    const linkedDevice = deviceById(item.deviceId);
    if (linkedDevice?.onlineState === "离线") return 1;
    return { 电机异常: 2, 网络异常: 3, 音频异常: 4, 推流异常: 5, 系统异常: 6 }[item.type] ?? 7;
  }

  function alertTimestamp(item) {
    if (item.at) return new Date(item.at);
    return new Date(state.lastRefresh.getTime() - item.minutesAgo * 60 * 1000);
  }

  function formatClock(date, withDate = false) {
    const pad = (value) => String(value).padStart(2, "0");
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    return withDate ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${time}` : time;
  }

  function baseDevices() {
    const channelId = global.phase2State?.snapshot().currentChannelId || "channel-weishi";
    return devices.map((item) => {
      const room = global.phase2State?.roomForRobot(item.id);
      const video = room ? global.phase2State.videoState(room.id) : null;
      if (!video?.faultType) return { ...item, channelId: room?.channelId || "channel-weishi", videoSource: video?.mode || "live" };
      const next = { ...item, channelId: room?.channelId || "channel-weishi", onlineState: "异常", currentAlert: video.faultType, videoSource: video.mode };
      if (video.faultType === "网络异常") next.network = "网络异常";
      if (video.faultType === "扬声器异常") next.speaker = "扬声器异常";
      if (video.faultType === "电机异常") next.motor = "电机异常";
      return next;
    }).filter((item) => {
      if (item.channelId !== channelId) return false;
      const versionMatch = state.filters.version === "全部" || item.version === state.filters.version;
      const onlineMatch = state.filters.onlineState === "全部" || item.onlineState === state.filters.onlineState;
      return versionMatch && onlineMatch;
    });
  }

  function baseAlerts() {
    const allowedDeviceIds = new Set(baseDevices().map((item) => item.id));
    const phase2Alerts = (global.phase2State?.snapshot().alerts || [])
      .filter((item) => !item.resolved)
      .map((item) => ({
        id: item.id,
        deviceId: item.robotId,
        minutesAgo: Math.max(0, (Date.now() - new Date(item.at).getTime()) / 60000),
        severity: item.severity,
        type: item.type === "扬声器异常" ? "音频异常" : item.type,
        message: item.message,
        at: item.at,
        phase2: true,
      }));
    return [...phase2Alerts, ...alerts]
      .filter((item) => item.minutesAgo <= state.filters.hours * 60)
      .filter((item) => state.filters.alertType === "全部" || item.type === state.filters.alertType)
      .filter((item) => allowedDeviceIds.has(item.deviceId))
      .sort((a, b) => severityRank(a) - severityRank(b) || a.minutesAgo - b.minutesAgo);
  }

  function visibleAlerts() {
    const list = baseAlerts();
    if (state.selectedHour === null) return list;
    return list.filter((item) => Math.floor(item.minutesAgo / 60) === state.selectedHour);
  }

  function visibleDevices() {
    const list = baseDevices();
    const shouldFilterByAlerts = state.filters.alertType !== "全部" || state.selectedHour !== null;
    if (!shouldFilterByAlerts) return list;
    const deviceIds = new Set(visibleAlerts().map((item) => item.deviceId));
    return list.filter((item) => deviceIds.has(item.id));
  }

  function ensureRefreshTimer() {
    if (state.refreshTimer) global.clearInterval(state.refreshTimer);
    state.refreshTimer = null;
    if (!state.autoRefresh) return;
    state.refreshTimer = global.setInterval(() => {
      state.lastRefresh = new Date();
      if (global.location?.hash === "#robot-ops" && typeof global.renderApp === "function") global.renderApp();
    }, 10000);
  }

  function rerender() {
    if (typeof global.renderApp === "function") global.renderApp();
  }

  function setFilter(key, value) {
    if (!Object.hasOwn(state.filters, key)) return;
    state.filters[key] = key === "hours" ? Number(value) : value;
    state.page = 1;
    state.selectedHour = null;
    state.selectedDeviceId = "";
    rerender();
  }

  function resetFilters() {
    state.filters = { version: "全部", onlineState: "全部", alertType: "全部", hours: 6 };
    state.page = 1;
    state.selectedHour = null;
    state.selectedDeviceId = "";
    rerender();
  }

  function setView(mode) {
    state.viewMode = mode === "list" ? "list" : "grid";
    state.page = 1;
    rerender();
  }

  function setPage(page) {
    state.page = Math.max(1, Number(page) || 1);
    rerender();
  }

  function toggleFullscreen(enabled = !state.fullscreen) {
    state.fullscreen = Boolean(enabled);
    state.viewMode = "grid";
    rerender();
  }

  function refreshNow() {
    state.lastRefresh = new Date();
    rerender();
    if (typeof global.toast === "function") global.toast("运维数据已刷新");
  }

  function setAutoRefresh(enabled) {
    state.autoRefresh = Boolean(enabled);
    ensureRefreshTimer();
    rerender();
  }

  function openDevice(deviceId) {
    state.selectedDeviceId = deviceId;
    rerender();
  }

  function closeDevice() {
    state.selectedDeviceId = "";
    rerender();
  }

  function locateAlert(alertId) {
    const item = baseAlerts().find((entry) => entry.id === alertId);
    if (!item) return;
    state.viewMode = "grid";
    state.page = pageForDevice(item.deviceId, visibleDevices());
    state.selectedDeviceId = item.deviceId;
    rerender();
    global.requestAnimationFrame?.(() => {
      document.querySelector(`[data-ops-device="${item.deviceId}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function toggleHour(hourOffset) {
    state.selectedHour = state.selectedHour === hourOffset ? null : hourOffset;
    state.page = 1;
    state.selectedDeviceId = "";
    rerender();
  }

  function clearTrendSelection() {
    state.selectedHour = null;
    state.page = 1;
    rerender();
  }

  function pageForDevice(deviceId, list) {
    const index = list.findIndex((item) => item.id === deviceId);
    return index < 0 ? 1 : Math.floor(index / state.pageSize) + 1;
  }

  function statusTone(value) {
    if (["正常", "在线"].includes(value)) return "ok";
    if (["异常"].includes(value) || String(value).includes("异常")) return "danger";
    if (["离线", "未检测"].includes(value)) return "muted";
    return "warning";
  }

  function statusIcon(label, value, symbol) {
    return `<span class="ops-status-item ${statusTone(value)}" title="${escapeHtml(label)}：${escapeHtml(value)}"><span aria-hidden="true">${symbol}</span><span>${escapeHtml(value)}</span></span>`;
  }

  function videoSourceLabel(mode) {
    return { live: "实时画面", recorded_manual: "人工录播", recorded_auto: "故障自动录播", recovering: "恢复检测中" }[mode] || "实时画面";
  }

  function enterLiveRoom(deviceId) {
    const room = global.phase2State?.roomForRobot(deviceId);
    if (!room) {
      global.toast?.("该机器人当前未绑定直播间");
      return;
    }
    global.changeLiveDashboardRoom?.(room.id);
    global.navigate?.("live-dashboard");
  }

  function optionMarkup(values, selected) {
    return values.map((value) => `<option value="${escapeHtml(value)}" ${String(value) === String(selected) ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
  }

  function renderFilters() {
    return `
      <div class="ops-filterbar" aria-label="运维筛选条件">
        <label class="ops-filter ops-filter-fixed"><span>机器人类型</span><strong>直播</strong></label>
        <label class="ops-filter"><span>机器人版本${opsHandoffMark("机器人运维筛选", "机器人运维新增版本、在线状态、告警类型和时间范围筛选，支持按当前渠道查看直播机器人。", "new")}</span><select onchange="robotOps.setFilter('version', this.value)">${optionMarkup(filterOptions.version, state.filters.version)}</select></label>
        <label class="ops-filter"><span>在线状态</span><select onchange="robotOps.setFilter('onlineState', this.value)">${optionMarkup(filterOptions.onlineState, state.filters.onlineState)}</select></label>
        <label class="ops-filter"><span>告警类型</span><select onchange="robotOps.setFilter('alertType', this.value)">${optionMarkup(filterOptions.alertType, state.filters.alertType)}</select></label>
        <label class="ops-filter"><span>时间范围</span><select onchange="robotOps.setFilter('hours', this.value)">${filterOptions.hours.map((value) => `<option value="${value}" ${value === state.filters.hours ? "selected" : ""}>最近${value}小时</option>`).join("")}</select></label>
        <button class="ops-button ghost" type="button" onclick="robotOps.resetFilters()">重置筛选</button>
      </div>`;
  }

  function renderMetrics(deviceList, alertList) {
    const online = deviceList.filter((item) => item.onlineState === "在线").length;
    const offline = deviceList.filter((item) => item.onlineState === "离线").length;
    const abnormal = deviceList.filter((item) => item.onlineState === "异常").length;
    const versions = filterOptions.version.slice(1).map((version) => ({ version, count: deviceList.filter((item) => item.version === version).length }));
    const total = Math.max(deviceList.length, 1);
    return `
      <section class="ops-metrics" aria-label="核心指标">
        ${metricCard("总设备数", deviceList.length, "筛选范围内直播机器人", "violet", "▣")}
        ${metricCard("在线设备", online, `在线率 ${deviceList.length ? ((online / deviceList.length) * 100).toFixed(1) : "0.0"}%`, "green", "⌁")}
        ${metricCard("离线设备", offline, `异常设备 ${abnormal} 台`, "gray", "◉")}
        ${metricCard("异常告警", alertList.length, state.selectedHour === null ? `近 ${state.filters.hours} 小时` : selectedHourLabel(), "red", "!")}
        <article class="ops-panel ops-version-card">
          <div class="ops-panel-title">设备类型分布</div>
          <div class="ops-version-body">
            <div class="ops-donut" style="--r:${versions[0].count / total * 360}deg;--z:${(versions[0].count + versions[1].count) / total * 360}deg" aria-label="版本分布图"></div>
            <div class="ops-version-list">
              ${versions.map((item, index) => `<div class="ops-version-row"><span class="ops-version-dot v${index}"></span><span>${item.version}</span><span class="ops-version-track"><i style="width:${(item.count / total) * 100}%"></i></span><strong>${item.count}</strong><small>${deviceList.length ? ((item.count / deviceList.length) * 100).toFixed(1) : "0.0"}%</small></div>`).join("")}
            </div>
          </div>
        </article>
      </section>`;
  }

  function metricCard(title, value, note, tone, icon) {
    return `<article class="ops-panel ops-metric ${tone}"><div class="ops-metric-icon">${icon}</div><div><span>${title}</span><strong>${value}</strong><small>${note}</small></div></article>`;
  }

  function renderDeviceGrid(list, highlightedIds) {
    if (!list.length) return emptyState("当前筛选条件下没有匹配的机器人", "请调整版本、状态、告警类型或时间范围。");
    return `<div class="ops-device-grid">${list.map((item) => renderDeviceCard(item, highlightedIds.has(item.id))).join("")}</div>`;
  }

  function pageCountFor(list) {
    return Math.max(1, Math.ceil(list.length / state.pageSize));
  }

  function normalizePage(list) {
    const totalPages = pageCountFor(list);
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;
    return totalPages;
  }

  function pagedDevices(list) {
    normalizePage(list);
    const start = (state.page - 1) * state.pageSize;
    return list.slice(start, start + state.pageSize);
  }

  function renderPagination(list) {
    if (state.viewMode !== "grid" || list.length <= state.pageSize) return "";
    const totalPages = normalizePage(list);
    const start = (state.page - 1) * state.pageSize + 1;
    const end = Math.min(state.page * state.pageSize, list.length);
    return `<div class="ops-pagination" aria-label="直播间分页">
      <span>第 ${state.page} / ${totalPages} 页 · 当前 ${start}-${end} / 共 ${list.length} 个直播间</span>
      <div>
        <button class="ops-button ghost" type="button" ${state.page <= 1 ? "disabled" : ""} onclick="robotOps.setPage(${state.page - 1})">上一页</button>
        <button class="ops-button ghost" type="button" ${state.page >= totalPages ? "disabled" : ""} onclick="robotOps.setPage(${state.page + 1})">下一页</button>
      </div>
    </div>`;
  }

  function renderDeviceCard(item, highlighted) {
    return `
      <button class="ops-device-card ${item.onlineState === "离线" ? "offline" : ""} ${highlighted ? "highlighted" : ""}" data-ops-device="${escapeHtml(item.id)}" type="button" onclick="robotOps.openDevice('${escapeHtml(item.id)}')">
        <div class="ops-device-head"><span class="ops-presence ${statusTone(item.onlineState)}"></span><strong>${escapeHtml(item.id)}</strong><span class="ops-online-badge ${statusTone(item.onlineState)}">${escapeHtml(item.onlineState)}</span></div>
        <div class="ops-feed scene-${escapeHtml(item.scene)}">
          ${robotArtwork(item.version, item.id)}
          <span class="ops-feed-live">${item.onlineState === "离线" ? "画面中断" : "LIVE"}</span>
          ${item.currentAlert ? `<span class="ops-alert-badge">${escapeHtml(item.currentAlert)}</span>` : ""}
          <span class="ops-source-badge mode-${escapeHtml(item.videoSource || "live")}">${videoSourceLabel(item.videoSource)}</span>
        </div>
        <div class="ops-device-meta"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.version)} · ${escapeHtml(item.mode)}</span></div>
        <div class="ops-status-row compact">
          ${statusIcon("联网", item.network, "⌁")}
          ${statusIcon("麦克风", item.microphone, "♩")}
          ${statusIcon("扬声器", item.speaker, "◖")}
          ${statusIcon("电机", item.motor, "⚙")}
        </div>
      </button>`;
  }

  function robotArtwork(version, id) {
    const suffix = escapeHtml(id.slice(-2));
    const agv = version === "AGV版";
    return `<svg class="ops-robot-art" viewBox="0 0 240 140" aria-hidden="true">
      <defs><linearGradient id="body-${suffix}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fbff"/><stop offset="1" stop-color="#8393b3"/></linearGradient></defs>
      ${agv ? `<ellipse cx="120" cy="112" rx="62" ry="20" fill="#25344f"/><rect x="77" y="72" width="86" height="40" rx="17" fill="url(#body-${suffix})"/>` : `<path d="M79 138c3-35 19-55 41-55s38 20 41 55" fill="url(#body-${suffix})"/><path d="M92 95 62 128M148 95l30 33" stroke="#dfe7f4" stroke-width="17" stroke-linecap="round"/>`}
      <rect x="91" y="29" width="58" height="58" rx="24" fill="url(#body-${suffix})"/>
      <rect x="99" y="39" width="42" height="32" rx="14" fill="#08111f"/>
      <circle cx="112" cy="55" r="4" fill="#70f3ff"/><circle cx="130" cy="55" r="4" fill="#70f3ff"/>
      <circle cx="120" cy="104" r="10" fill="#273955" stroke="#85f2ff" stroke-width="3"/>
    </svg>`;
  }

  function renderDeviceTable(list, highlightedIds) {
    if (!list.length) return emptyState("当前筛选条件下没有匹配的机器人", "请调整筛选条件后重试。");
    return `<div class="ops-table-wrap"><table class="ops-table"><thead><tr><th>机器人ID / 名称</th><th>版本</th><th>模式</th><th>画面来源</th><th>在线</th><th>联网</th><th>麦克风</th><th>扬声器</th><th>电机</th><th>当前告警</th><th>最后上报</th><th>操作</th></tr></thead><tbody>
      ${list.map((item) => `<tr class="${highlightedIds.has(item.id) ? "highlighted" : ""}"><td><strong>${escapeHtml(item.id)}</strong><small>${escapeHtml(item.name)}</small></td><td>${escapeHtml(item.version)}</td><td>${escapeHtml(item.mode)}</td><td>${videoSourceLabel(item.videoSource)}</td><td>${statusPill(item.onlineState)}</td><td>${statusPill(item.network)}</td><td>${statusPill(item.microphone)}</td><td>${statusPill(item.speaker)}</td><td>${statusPill(item.motor)}</td><td>${item.currentAlert ? `<span class="ops-alert-text">${escapeHtml(item.currentAlert)}</span>` : "—"}</td><td>${escapeHtml(item.lastReportedAt)}</td><td><button class="ops-link" type="button" onclick="robotOps.openDevice('${escapeHtml(item.id)}')">查看详情</button></td></tr>`).join("")}
    </tbody></table></div>`;
  }

  function statusPill(value) {
    return `<span class="ops-status-pill ${statusTone(value)}">${escapeHtml(value)}</span>`;
  }

  function renderAlerts(list) {
    return `<aside class="ops-panel ops-alert-panel">
      <div class="ops-section-head"><div><h3>实时告警${opsHandoffMark("运维告警联动", "直播大屏触发故障后会同步进入机器人运维告警列表，并按严重程度优先展示。", "info")}</h3><span>${list.length} 条告警</span></div><span class="ops-priority-note">严重优先</span></div>
      <div class="ops-alert-columns"><span>机器人ID</span><span>版本</span><span>异常情况</span><span>时间</span></div>
      <div class="ops-alert-list">
        ${list.length ? list.map((item) => {
          const linkedDevice = deviceById(item.deviceId);
          return `<button class="ops-alert-row severity-${escapeHtml(item.severity)}" type="button" onclick="robotOps.locateAlert('${escapeHtml(item.id)}')"><span><i></i>${escapeHtml(item.deviceId)}</span><span>${escapeHtml(linkedDevice?.version || "-")}</span><strong>${escapeHtml(item.message)}</strong><time>${formatClock(alertTimestamp(item))}</time></button>`;
        }).join("") : emptyState("暂无告警", "当前筛选范围内设备运行正常。", true)}
      </div>
    </aside>`;
  }

  function buildTrend() {
    const hours = state.filters.hours;
    const source = baseAlerts();
    return Array.from({ length: hours }, (_, position) => {
      const offset = hours - 1 - position;
      const bucket = source.filter((item) => Math.floor(item.minutesAgo / 60) === offset);
      return {
        offset,
        label: hourLabel(offset),
        total: bucket.length,
        network: bucket.filter((item) => item.type === "网络异常").length,
        motor: bucket.filter((item) => item.type === "电机异常").length,
      };
    });
  }

  function hourLabel(offset) {
    const date = new Date(state.lastRefresh.getTime() - offset * 60 * 60 * 1000);
    return `${String(date.getHours()).padStart(2, "0")}:00`;
  }

  function selectedHourLabel() {
    return state.selectedHour === null ? "" : `${hourLabel(state.selectedHour)} 时段`;
  }

  function renderTrend() {
    const points = buildTrend();
    const width = 760;
    const height = 220;
    const left = 38;
    const right = 18;
    const top = 18;
    const bottom = 40;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const maxValue = Math.max(4, ...points.map((item) => item.total));
    const x = (index) => left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
    const y = (value) => top + plotHeight - (value / maxValue) * plotHeight;
    const polyline = (key) => points.map((item, index) => `${x(index).toFixed(1)},${y(item[key]).toFixed(1)}`).join(" ");
    const labelEvery = Math.max(1, Math.ceil(points.length / 8));
    const selected = state.selectedHour;
    const sourceAlerts = baseAlerts();
    const networkCount = sourceAlerts.filter((item) => item.type === "网络异常").length;
    const motorCount = sourceAlerts.filter((item) => item.type === "电机异常").length;
    return `<section class="ops-trend-grid">
      <article class="ops-panel ops-trend-panel">
        <div class="ops-section-head"><div><h3>告警趋势分析</h3><span>近 ${state.filters.hours} 小时 · 按小时聚合</span></div><div class="ops-legend"><span class="total">告警总数</span><span class="network">网络异常</span><span class="motor">电机异常</span></div></div>
        <svg class="ops-trend-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="告警趋势图">
          ${[0, 1, 2, 3, 4].map((step) => { const value = Math.round((maxValue / 4) * step); const py = y(value); return `<g><line x1="${left}" x2="${width - right}" y1="${py}" y2="${py}"/><text x="4" y="${py + 4}">${value}</text></g>`; }).join("")}
          ${selected !== null ? (() => { const index = points.findIndex((item) => item.offset === selected); if (index < 0) return ""; const bandWidth = Math.max(18, plotWidth / Math.max(points.length, 2)); return `<rect class="ops-selected-band" x="${x(index) - bandWidth / 2}" y="${top}" width="${bandWidth}" height="${plotHeight}"/>`; })() : ""}
          <polyline class="ops-line total" points="${polyline("total")}"/>
          <polyline class="ops-line network" points="${polyline("network")}"/>
          <polyline class="ops-line motor" points="${polyline("motor")}"/>
          ${points.map((item, index) => `<g class="ops-chart-point ${selected === item.offset ? "selected" : ""}" role="button" tabindex="0" onclick="robotOps.toggleHour(${item.offset})"><rect x="${x(index) - Math.max(9, plotWidth / points.length / 2)}" y="${top}" width="${Math.max(18, plotWidth / points.length)}" height="${plotHeight}" fill="transparent"/><circle class="total" cx="${x(index)}" cy="${y(item.total)}" r="4"/><circle class="network" cx="${x(index)}" cy="${y(item.network)}" r="3"/><circle class="motor" cx="${x(index)}" cy="${y(item.motor)}" r="3"/>${index % labelEvery === 0 || index === points.length - 1 ? `<text x="${x(index)}" y="${height - 13}" text-anchor="middle">${item.label}</text>` : ""}</g>`).join("")}
        </svg>
      </article>
      <aside class="ops-panel ops-trend-summary">
        <div class="ops-section-head"><div><h3>趋势汇总</h3><span>近 ${state.filters.hours} 小时</span></div></div>
        <div class="ops-summary-cards">
          ${summaryCard("告警总数", sourceAlerts.length, "red")}
          ${summaryCard("网络异常", networkCount, "blue")}
          ${summaryCard("电机异常", motorCount, "amber")}
        </div>
      </aside>
    </section>`;
  }

  function summaryCard(label, value, tone) {
    return `<div class="ops-summary-card ${tone}"><span>${label}</span><strong>${value}</strong><small>当前筛选范围</small><i></i></div>`;
  }

  function renderDrawer() {
    if (!state.selectedDeviceId) return "";
    const item = baseDevices().find((entry) => entry.id === state.selectedDeviceId) || deviceById(state.selectedDeviceId);
    if (!item) return "";
    const recentAlerts = baseAlerts().filter((entry) => entry.deviceId === item.id).sort((a, b) => a.minutesAgo - b.minutesAgo).slice(0, 6);
    return `<div class="ops-drawer-backdrop" onclick="robotOps.closeDevice()">
      <aside class="ops-drawer" role="dialog" aria-modal="true" aria-label="机器人运维详情" onclick="event.stopPropagation()">
        <div class="ops-drawer-head"><div><span>直播间数据详情${opsHandoffMark("设备详情抽屉", "点击机器人画面或列表行打开详情抽屉，集中查看画面来源、网络、麦克风、扬声器、电机和最近告警。", "new")}</span><h2>${escapeHtml(item.name)} <small>${escapeHtml(item.id)}</small></h2></div><button type="button" aria-label="关闭" onclick="robotOps.closeDevice()">×</button></div>
        <div class="ops-detail-feed scene-${escapeHtml(item.scene)}">${robotArtwork(item.version, item.id)}<span>${item.onlineState === "离线" ? "实时画面不可用" : "当前直播画面"}</span></div>
        <div class="ops-detail-grid">
          ${detailItem("机器人版本", item.version)}${detailItem("在线状态", item.onlineState, true)}${detailItem("机器人模式", item.mode)}${detailItem("画面来源", videoSourceLabel(item.videoSource))}${detailItem("联网状态", item.network, true)}${detailItem("麦克风", item.microphone, true)}${detailItem("扬声器", item.speaker, true)}${detailItem("电机状态", item.motor, true)}${detailItem("最后上报", item.lastReportedAt)}
        </div>
        <section class="ops-detail-alerts"><div class="ops-section-head"><div><h3>最近告警记录</h3><span>${recentAlerts.length} 条</span></div></div>
          ${recentAlerts.length ? recentAlerts.map((entry) => `<div class="ops-detail-alert-row"><span class="ops-presence ${entry.severity === "严重" ? "danger" : "warning"}"></span><div><strong>${escapeHtml(entry.message)}</strong><small>${escapeHtml(entry.type)} · ${formatClock(alertTimestamp(entry), true)}</small></div><em>${escapeHtml(entry.severity)}</em></div>`).join("") : emptyState("暂无历史告警", "该设备当前运行正常。", true)}
        </section><div class="ops-detail-actions"><button class="ops-button ops-enter-live" type="button" onclick="robotOps.enterLiveRoom('${escapeHtml(item.id)}')">进入直播间</button><button class="ops-button ghost ops-view-script" type="button">查看脚本</button></div>
      </aside>
    </div>`;
  }

  function detailItem(label, value, colored = false) {
    return `<div><span>${label}</span>${colored ? statusPill(value) : `<strong>${escapeHtml(value)}</strong>`}</div>`;
  }

  function emptyState(title, description, compact = false) {
    return `<div class="ops-empty ${compact ? "compact" : ""}"><span>◇</span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small></div>`;
  }

  function render() {
    ensureRefreshTimer();
    const deviceList = visibleDevices();
    const monitorList = state.viewMode === "grid" ? pagedDevices(deviceList) : deviceList;
    const alertList = visibleAlerts();
    const highlightedIds = state.selectedDeviceId
      ? new Set([state.selectedDeviceId])
      : state.selectedHour !== null
        ? new Set(alertList.map((item) => item.deviceId))
        : new Set();
    const monitorPanel = `<article class="ops-panel ops-monitor-panel">
          <div class="ops-section-head"><div><h3>直播画面监控${opsHandoffMark("机器人运维画面墙", "本次新增画面视图和列表视图，筛选条件在视图切换时保持，支持50路直播间分页值守。", "new")}</h3><span>${deviceList.length} 个直播间${state.viewMode === "grid" ? ` · 每页 ${state.pageSize} 个` : " · 列表滚动查看"}</span></div><div class="ops-view-switch"><button class="${state.viewMode === "grid" ? "active" : ""}" type="button" onclick="robotOps.setView('grid')">▦ 画面视图</button><button class="${state.viewMode === "list" ? "active" : ""}" type="button" onclick="robotOps.setView('list')">☷ 列表视图</button><button class="${state.fullscreen ? "active" : ""}" type="button" onclick="robotOps.toggleFullscreen(${state.fullscreen ? "false" : "true"})">${state.fullscreen ? "退出全屏" : "全屏监控"}</button></div></div>
          <div class="ops-monitor-content">${state.viewMode === "grid" ? renderDeviceGrid(monitorList, highlightedIds) : renderDeviceTable(monitorList, highlightedIds)}</div>
          ${renderPagination(deviceList)}
          <div class="ops-status-legend"><span>${statusIcon("联网", "正常", "⌁")} 联网</span><span>${statusIcon("麦克风", "正常", "♩")} 麦克风</span><span>${statusIcon("扬声器", "正常", "◖")} 扬声器</span><span>${statusIcon("电机", "正常", "⚙")} 电机</span><span><i class="ops-presence ok"></i>在线</span><span><i class="ops-presence muted"></i>离线</span><span><i class="ops-presence warning"></i>告警</span></div>
        </article>`;
    if (state.fullscreen) {
      return `<div class="robot-ops-page fullscreen-monitor">
        <header class="ops-hero">
          <div><span class="ops-kicker">FULLSCREEN MONITOR</span><h1>直播间画面墙</h1><p>50 路直播间按页值守，筛选条件和告警联动保持有效</p></div>
          <div class="ops-refresh"><span>最后刷新 ${formatClock(state.lastRefresh, true)}</span><button class="ops-button ghost" type="button" onclick="robotOps.toggleFullscreen(false)">退出全屏</button></div>
        </header>
        ${renderFilters()}
        ${state.selectedHour !== null ? `<div class="ops-linked-filter"><span>已联动：${selectedHourLabel()}</span><button type="button" onclick="robotOps.clearTrendSelection()">清除联动 ×</button></div>` : ""}
        <section class="ops-monitor-layout only-monitor">${monitorPanel}</section>
        ${renderDrawer()}
      </div>`;
    }
    return `<div class="robot-ops-page">
      <header class="ops-hero">
        <div><span class="ops-kicker">ROBOT LIVE OPERATIONS</span><h1>机器人直播运维监控</h1><p>集中查看直播机器人画面、设备状态与实时告警</p></div>
        <div class="ops-refresh"><span>最后刷新 ${formatClock(state.lastRefresh, true)}</span><label><input type="checkbox" ${state.autoRefresh ? "checked" : ""} onchange="robotOps.setAutoRefresh(this.checked)"><i></i>自动刷新 10s</label><button class="ops-button" type="button" onclick="robotOps.refreshNow()">立即刷新</button></div>
      </header>
      ${renderFilters()}
      ${state.selectedHour !== null ? `<div class="ops-linked-filter"><span>已联动：${selectedHourLabel()}</span><button type="button" onclick="robotOps.clearTrendSelection()">清除联动 ×</button></div>` : ""}
      ${renderMetrics(deviceList, alertList)}
      <section class="ops-monitor-layout">
        ${monitorPanel}
        ${renderAlerts(alertList)}
      </section>
      ${renderTrend()}
      ${renderDrawer()}
    </div>`;
  }

  const api = { render, setFilter, resetFilters, setView, setPage, toggleFullscreen, refreshNow, setAutoRefresh, openDevice, closeDevice, locateAlert, toggleHour, clearTrendSelection, enterLiveRoom };
  global.robotOps = api;
  global.renderRobotOpsPage = render;
})(window);
