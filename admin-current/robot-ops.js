(function createRobotOpsModule(global) {
  "use strict";

  const filterOptions = {
    version: ["全部", "R版", "Z版", "AGV版"],
    deviceScope: ["全部设备", "当前异常（全部）", "网络异常", "电机异常", "扬声器异常", "麦克风异常", "推流异常", "系统异常"],
    broadcast: ["全部", "直播中", "录播中", "未开播"],
    hours: [1, 3, 6, 12, 24],
  };

  const opsAssets = {
    idleLandscape: "./assets/robot-ops/humanoid-host-landscape.jpg",
    portrait: "./assets/robot-ops/humanoid-host-portrait.jpg",
  };

  const seedDevices = [
    device("DT-LIVE-001", "星栖", "Z版", "直播", "在线", "正常", "正常", "正常", "正常", "云紫", "2026-07-10 18:59:48"),
    device("DT-LIVE-002", "知鹤", "R版", "直播", "在线", "正常", "正常", "正常", "正常", "海蓝", "2026-07-10 18:59:42"),
    device("DT-LIVE-003", "小暖", "Z版", "直播", "异常", "正常", "正常", "正常", "3号电机异常", "霓虹", "2026-07-10 18:59:36", "3号电机异常"),
    device("DT-LIVE-004", "柳如春", "R版", "直播", "异常", "网络异常", "正常", "正常", "正常", "暖橙", "2026-07-10 18:59:31", "网络连接中断"),
    device("DT-LIVE-005", "云涵", "Z版", "直播", "在线", "正常", "未检测", "正常", "正常", "薄荷", "2026-07-10 18:59:24"),
    device("DT-LIVE-006", "东哥外卖", "AGV版", "直播", "离线", "离线", "未检测", "未检测", "未检测", "深空", "2026-07-10 18:52:10", "设备离线"),
    device("DT-LIVE-007", "若琳", "Z版", "直播", "异常", "正常", "正常", "扬声器异常", "正常", "青绿", "2026-07-10 18:59:08", "扬声器无输出"),
    device("DT-LIVE-008", "小兰", "R版", "直播", "异常", "正常", "正常", "正常", "正常", "莓红", "2026-07-10 18:58:55", "推流异常"),
    device("DT-LIVE-009", "鲁博士", "Z版", "直播", "在线", "正常", "正常", "正常", "正常", "紫晶", "2026-07-10 18:58:39"),
    device("DT-LIVE-010", "关帝圣君", "AGV版", "直播", "在线", "正常", "正常", "正常", "正常", "金棕", "2026-07-10 18:58:21"),
    device("DT-LIVE-011", "AI萌宠", "R版", "直播", "异常", "正常", "麦克风异常", "正常", "正常", "靛蓝", "2026-07-10 18:58:02", "麦克风无输入"),
    device("DT-LIVE-012", "关羽", "Z版", "直播", "离线", "离线", "未检测", "未检测", "未检测", "银灰", "2026-07-10 18:48:43", "设备离线"),
    device("GFWL-001", "绛央", "AGV版", "直播", "在线", "正常", "正常", "正常", "正常", "金棕", "2026-07-10 18:59:52"),
    device("GFWL-002", "青禾", "Z版", "直播", "在线", "正常", "正常", "正常", "正常", "青绿", "2026-07-11 09:26:18"),
  ];

  const devices = buildDevicePool();
  global.phase2State?.registerLiveRooms?.(devices);

  const alerts = [
    alert("ALT-001", "DT-LIVE-003", 4, "严重", "电机异常", "3号电机异常"),
    alert("ALT-002", "DT-LIVE-006", 7, "严重", "系统异常", "设备心跳中断，设备离线"),
    alert("ALT-003", "DT-LIVE-004", 10, "高", "网络异常", "网络连接中断"),
    alert("ALT-004", "DT-LIVE-008", 14, "高", "推流异常", "直播推流异常中断"),
    alert("ALT-005", "DT-LIVE-011", 19, "中", "麦克风异常", "麦克风无输入"),
    alert("ALT-006", "DT-LIVE-007", 25, "中", "扬声器异常", "扬声器无输出"),
    alert("ALT-007", "DT-LIVE-012", 34, "高", "系统异常", "设备离线"),
    alert("ALT-008", "DT-LIVE-003", 48, "中", "电机异常", "3号电机温度过高"),
    alert("ALT-009", "DT-LIVE-004", 64, "中", "网络异常", "网络延迟过高"),
    alert("ALT-010", "DT-LIVE-008", 78, "高", "推流异常", "推流帧率低于阈值"),
    alert("ALT-011", "DT-LIVE-011", 92, "中", "麦克风异常", "麦克风输入音量过低"),
    alert("ALT-012", "DT-LIVE-003", 110, "高", "电机异常", "2号电机响应超时"),
    alert("ALT-013", "DT-LIVE-006", 132, "严重", "系统异常", "设备异常重启"),
    alert("ALT-014", "DT-LIVE-004", 156, "中", "网络异常", "网络丢包率过高"),
    alert("ALT-015", "DT-LIVE-007", 181, "中", "扬声器异常", "扬声器输出音量异常"),
    alert("ALT-016", "DT-LIVE-008", 207, "高", "推流异常", "推流服务连接失败"),
    alert("ALT-017", "DT-LIVE-003", 239, "中", "电机异常", "1号电机电流波动"),
    alert("ALT-018", "DT-LIVE-011", 276, "中", "麦克风异常", "麦克风检测异常"),
    alert("ALT-019", "DT-LIVE-004", 314, "高", "网络异常", "网络连接短暂中断"),
    alert("ALT-020", "DT-LIVE-009", 351, "低", "系统异常", "运行内存占用过高"),
    alert("ALT-021", "DT-LIVE-003", 398, "高", "电机异常", "4号电机校准失败"),
    alert("ALT-022", "DT-LIVE-008", 446, "中", "推流异常", "推流码率异常"),
    alert("ALT-023", "DT-LIVE-007", 503, "中", "扬声器异常", "扬声器检测失败"),
    alert("ALT-024", "DT-LIVE-004", 571, "中", "网络异常", "网络延迟过高"),
    alert("ALT-025", "DT-LIVE-006", 642, "严重", "系统异常", "设备服务异常退出"),
    alert("ALT-026", "DT-LIVE-003", 721, "中", "电机异常", "3号电机阻力异常"),
    alert("ALT-027", "DT-LIVE-011", 809, "中", "麦克风异常", "麦克风输入中断"),
    alert("ALT-028", "DT-LIVE-008", 903, "高", "推流异常", "推流认证失效"),
    alert("ALT-029", "DT-LIVE-004", 1015, "中", "网络异常", "网络抖动明显"),
    alert("ALT-030", "DT-LIVE-003", 1136, "高", "电机异常", "2号电机异常停转"),
    alert("ALT-031", "DT-LIVE-009", 1260, "低", "系统异常", "磁盘空间不足"),
    alert("ALT-032", "DT-LIVE-007", 1374, "中", "扬声器异常", "音频设备初始化失败"),
  ];

  const state = {
    filters: { channel: "channel-weishi", deviceScope: "全部设备", broadcast: "全部", hours: 6 },
    viewMode: "grid",
    fullscreen: false,
    selectedDeviceId: "",
    lastRefresh: new Date(),
  };

  function device(id, name, version, _mode, onlineState, network, microphone, speaker, motor, scene, lastReportedAt, currentAlert = "") {
    const stream = onlineState === "离线" ? "未检测" : currentAlert.includes("推流") ? "推流异常" : "正常";
    return { id, name, type: "直播", version, mode: "直播", onlineState, network, microphone, speaker, motor, stream, scene, lastReportedAt, currentAlert };
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
      const alertType = ["", "网络连接波动", "麦克风无输入", "3号电机异常", "扬声器异常"][index % 5];
      const network = onlineState === "离线" ? "离线" : alertType.includes("网络") ? "网络异常" : "正常";
      const microphone = onlineState === "离线" ? "未检测" : alertType.includes("麦克风") ? "麦克风异常" : "正常";
      const speaker = onlineState === "离线" ? "未检测" : alertType.includes("扬声器") ? "扬声器异常" : "正常";
      const motor = onlineState === "离线" ? "未检测" : alertType.includes("电机") ? "3号电机异常" : "正常";
      return device(`DT-LIVE-${number}`, name, version, "直播", onlineState, network, microphone, speaker, motor, scenes[index % scenes.length], `2026-07-10 18:${String(58 - (index % 50)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}`, alertType);
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

  function opsIcon(name, label = "", className = "ops-icon") {
    const accessibility = label ? `role="img" aria-label="${escapeHtml(label)}"` : 'aria-hidden="true"';
    return `<i class="${escapeHtml(className)}" style="--ops-icon: url('./assets/icons/${escapeHtml(name)}.svg')" ${accessibility}></i>`;
  }

  function deviceById(id) {
    return devices.find((item) => item.id === id);
  }

  function alertTimestamp(item) {
    if (item.at) return new Date(item.at);
    return new Date(state.lastRefresh.getTime() - item.minutesAgo * 60 * 1000);
  }

  function alertDurationSeconds(item) {
    const ageSeconds = Math.max(1, Math.round(item.minutesAgo * 60));
    if (item.phase2) return ageSeconds;
    const sequence = Number(String(item.id).match(/(\d+)$/)?.[1] || 1);
    return Math.min(ageSeconds, 90 + ((sequence * 97) % 1100));
  }

  function formatClock(date, withDate = false) {
    const pad = (value) => String(value).padStart(2, "0");
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    return withDate ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${time}` : time;
  }

  function prototypeVideoSource(item, currentMode) {
    if (currentMode !== "live") return currentMode;
    const sequence = Number(robotSequenceId(item.id));
    return sequence > 14 && sequence % 13 === 4 && item.onlineState !== "离线" ? "recorded_manual" : "live";
  }

  function broadcastStateFor(item) {
    if (["recorded_manual", "recorded_auto", "recovering"].includes(item.videoSource)) return "录播中";
    const sequence = Number(robotSequenceId(item.id));
    if (item.onlineState === "离线" || (sequence > 14 && sequence % 7 === 0)) return "未开播";
    return "直播中";
  }

  function formatDuration(totalSeconds) {
    const pad = (value) => String(value).padStart(2, "0");
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(totalSeconds % 60)}`;
  }

  function broadcastRuntimeFor(item) {
    if (item.broadcastState === "未开播") return { duration: "00:00:00", script: "未运行", stage: "等待开播" };
    const sequence = Number(robotSequenceId(item.id)) || 1;
    const scripts = ["晚间互动场", "美妆好物专场", "科普小课堂", "国风文化讲解", "宠物日常互动", "产品讲解专场"];
    const stages = ["开场互动", "主题讲解", "知识问答", "产品讲解", "弹幕互动"];
    return {
      duration: formatDuration(1800 + ((sequence * 173) % 7200)),
      script: item.broadcastState === "录播中" ? "时尚穿搭录播" : scripts[sequence % scripts.length],
      stage: item.broadcastState === "录播中" ? "录播内容播放" : stages[sequence % stages.length],
    };
  }

  function enrichBroadcastState(item) {
    const broadcastState = broadcastStateFor(item);
    return { ...item, broadcastState, ...broadcastRuntimeFor({ ...item, broadcastState }) };
  }

  function baseDevices() {
    const currentChannelId = global.phase2State?.snapshot().currentChannelId || "channel-weishi";
    const isPlatform = global.phase2State?.isPlatformChannel?.();
    const selectedChannelId = isPlatform ? state.filters.channel : currentChannelId;
    return devices.map((item) => {
      const room = global.phase2State?.roomForRobot(item.id);
      const video = room ? global.phase2State.videoState(room.id) : null;
      const videoSource = prototypeVideoSource(item, video?.mode || "live");
      if (!video?.faultType) return enrichBroadcastState({ ...item, channelId: room?.channelId || "channel-weishi", videoSource });
      const next = { ...item, channelId: room?.channelId || "channel-weishi", onlineState: "异常", currentAlert: video.faultType, videoSource };
      if (video.faultType === "网络异常") next.network = "网络异常";
      if (video.faultType === "麦克风异常") next.microphone = "麦克风异常";
      if (video.faultType === "扬声器异常") next.speaker = "扬声器异常";
      if (video.faultType === "电机异常") next.motor = "电机异常";
      if (video.faultType === "推流异常") next.stream = "推流异常";
      return enrichBroadcastState(next);
    }).filter((item) => {
      if (selectedChannelId !== "全部" && item.channelId !== selectedChannelId) return false;
      return true;
    }).sort((a, b) => liveRoomAvailabilityRank(a) - liveRoomAvailabilityRank(b));
  }

  function selectedAlertType() {
    return filterOptions.deviceScope.includes(state.filters.deviceScope) && !["全部设备", "当前异常（全部）"].includes(state.filters.deviceScope)
      ? state.filters.deviceScope
      : "全部类型";
  }

  function allAlerts() {
    const allowedDeviceIds = new Set(baseDevices().map((item) => item.id));
    const phase2Alerts = (global.phase2State?.snapshot().alerts || [])
      .filter((item) => !item.resolved)
      .map((item) => ({
        id: item.id,
        deviceId: item.robotId,
        minutesAgo: Math.max(0, (Date.now() - new Date(item.at).getTime()) / 60000),
        severity: item.severity,
        type: item.type,
        message: item.message,
        at: item.at,
        phase2: true,
      }));
    return [...phase2Alerts, ...alerts]
      .filter((item) => allowedDeviceIds.has(item.deviceId))
      .sort((a, b) => a.minutesAgo - b.minutesAgo);
  }

  function baseAlerts() {
    const alertType = selectedAlertType();
    return allAlerts()
      .filter((item) => item.minutesAgo <= state.filters.hours * 60)
      .filter((item) => alertType === "全部类型" || item.type === alertType);
  }

  function visibleAlerts() {
    return baseAlerts();
  }

  function scopedDevices() {
    const list = baseDevices();
    return state.filters.deviceScope === "全部设备" ? list : list.filter((item) => deviceMatchesScope(item, state.filters.deviceScope));
  }

  function visibleDevices() {
    const list = scopedDevices();
    return state.filters.broadcast === "全部" ? list : list.filter((item) => item.broadcastState === state.filters.broadcast);
  }

  function deviceMatchesScope(item, scope) {
    const currentAlert = String(item.currentAlert || "");
    const componentAbnormal = [item.network, item.microphone, item.speaker, item.motor, item.stream].some((value) => String(value).includes("异常"));
    if (scope === "当前异常（全部）") return item.onlineState !== "在线" || componentAbnormal || Boolean(currentAlert);
    if (scope === "网络异常") return String(item.network).includes("异常") || currentAlert.includes("网络");
    if (scope === "电机异常") return String(item.motor).includes("异常") || currentAlert.includes("电机");
    if (scope === "扬声器异常") return String(item.speaker).includes("异常") || currentAlert.includes("扬声器");
    if (scope === "麦克风异常") return String(item.microphone).includes("异常") || currentAlert.includes("麦克风");
    if (scope === "推流异常") return String(item.stream).includes("异常") || currentAlert.includes("推流");
    if (scope === "系统异常") return item.onlineState === "离线" || ["系统", "设备", "服务"].some((keyword) => currentAlert.includes(keyword));
    return true;
  }

  function rerender() {
    if (typeof global.renderApp === "function") global.renderApp();
  }

  function setFilter(key, value) {
    if (!Object.hasOwn(state.filters, key)) return;
    state.filters[key] = key === "hours" ? Number(value) : value;
    state.selectedDeviceId = "";
    rerender();
  }

  function setView(mode) {
    state.viewMode = mode === "list" ? "list" : "grid";
    rerender();
  }

  function toggleFullscreen(enabled = !state.fullscreen) {
    state.fullscreen = Boolean(enabled);
    state.viewMode = "grid";
    rerender();
  }

  function applyRealtimeUpdate() {
    state.lastRefresh = new Date();
    if (global.location.hash === "#robot-ops") rerender();
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
    state.selectedDeviceId = item.deviceId;
    rerender();
  }

  function statusTone(value) {
    if (["正常", "在线", "直播中"].includes(value)) return "ok";
    if (["异常"].includes(value) || String(value).includes("异常")) return "danger";
    if (["离线", "未检测", "未开播"].includes(value)) return "muted";
    return "warning";
  }

  function liveRoomAvailabilityRank(item) {
    return { "在线": 0, "异常": 1, "离线": 2 }[item.onlineState] ?? 1;
  }

  function conciseStatus(value) {
    if (value === "正常") return "正常";
    if (value === "离线") return "离线";
    if (value === "未检测") return "未检测";
    return String(value).includes("异常") ? "异常" : value;
  }

  function statusText(label, value, icon) {
    const conciseValue = conciseStatus(value);
    return `<span class="ops-status-item ${statusTone(value)}" title="${escapeHtml(label)}：${escapeHtml(value)}" aria-label="${escapeHtml(label)}：${escapeHtml(value)}">${opsIcon(icon, "", "ops-status-icon")}<strong>${escapeHtml(conciseValue)}</strong></span>`;
  }

  function audioStatus(item) {
    const values = [item.microphone, item.speaker];
    if (values.some((value) => statusTone(value) === "danger")) return "音频异常";
    if (values.every((value) => value === "正常")) return "正常";
    if (values.some((value) => value === "离线")) return "离线";
    return "未检测";
  }

  function motorStatuses(item) {
    const abnormalNumber = Number(String(item.motor).match(/(\d+)号/)?.[1] || 0);
    const unavailable = ["离线", "未检测"].includes(item.motor);
    return Array.from({ length: 15 }, (_, index) => ({
      number: index + 1,
      tone: unavailable ? "muted" : abnormalNumber === index + 1 ? "danger" : "ok",
    }));
  }

  function renderMotorStatusGrid(item) {
    return `<section class="ops-motor-detail"><div class="ops-motor-detail-head"><div><h3>${opsIcon("cog")}电机状态</h3></div><div class="ops-motor-legend"><span class="ok">正常</span><span class="danger">异常</span>${["离线", "未检测"].includes(item.motor) ? `<span class="muted">未检测</span>` : ""}</div></div><div class="ops-motor-grid">${motorStatuses(item).map((motor) => `<span class="ops-motor-dot ${motor.tone}" title="${motor.number}号电机：${motor.tone === "danger" ? "异常" : motor.tone === "muted" ? "未检测" : "正常"}">${motor.number}</span>`).join("")}</div></section>`;
  }

  function videoSourceLabel(mode) {
    return { live: "实时画面", recorded_manual: "人工录播", recorded_auto: "故障自动录播", recovering: "恢复检测中" }[mode] || "实时画面";
  }

  function broadcastSourceLabel(item) {
    return item.broadcastState === "未开播" ? "画面未开启" : videoSourceLabel(item.videoSource);
  }

  function broadcastTone(item) {
    return item.broadcastState === "直播中" ? "live" : item.broadcastState === "录播中" ? "recorded" : "idle";
  }

  function enterLiveRoom(deviceId) {
    const room = global.phase2State?.roomForRobot(deviceId);
    if (!room) return;
    global.changeLiveDashboardRoom?.(room.id);
    global.navigate?.("live-dashboard");
  }

  function viewScript(deviceId) {
    const item = deviceById(deviceId);
    global.openRobotScriptsFromOps?.(deviceId, item?.name || "");
  }

  function optionMarkup(values, selected) {
    return values.map((value) => `<option value="${escapeHtml(value)}" ${String(value) === String(selected) ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
  }

  function robotSequenceId(deviceId) {
    return String(deviceId || "-").match(/(\d+)$/)?.[1] || String(deviceId || "-");
  }

  function displayRobotId(deviceId) {
    return `RBT${robotSequenceId(deviceId)}`;
  }

  function channelFilterOptions() {
    const channels = global.phase2State?.channels || [];
    const currentChannelId = global.phase2State?.snapshot().currentChannelId || "channel-weishi";
    if (!global.phase2State?.isPlatformChannel?.()) return channels.filter((item) => item.id === currentChannelId);
    return [{ id: "全部", name: "全部渠道" }, ...channels];
  }

  function channelOptionMarkup(values, selected) {
    return values.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === selected ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("");
  }

  function renderDeviceScope() {
    return `<label class="ops-device-scope" title="按机器人当前状态筛选画面和列表"><span>设备范围${opsHandoffMark("设备范围规则", "可选全部设备、当前异常（全部）以及网络、电机、扬声器、麦克风、推流、系统异常。按机器人当前状态筛选画面视图、列表视图和全屏监控；选择具体异常类型时，告警列表同步查询该类型的历史告警。", "new")}</span><select aria-label="设备范围" onchange="robotOps.setFilter('deviceScope', this.value)">${optionMarkup(filterOptions.deviceScope, state.filters.deviceScope)}</select></label>`;
  }

  function renderChannelScope() {
    const currentChannelId = global.phase2State?.snapshot().currentChannelId || "channel-weishi";
    const selectedChannelId = global.phase2State?.isPlatformChannel?.() ? state.filters.channel : currentChannelId;
    const scopeMark = opsHandoffMark("运维数据范围与渠道", "页面只展示有实体硬件且机器人类型为直播的机器人。平台用户可切换渠道；客户用户固定展示自身渠道及其可见设备。", "new");
    if (global.phase2State?.isPlatformChannel?.()) {
      return `<label class="ops-channel-scope"><span>当前渠道${scopeMark}</span><select onchange="robotOps.setFilter('channel', this.value)">${channelOptionMarkup(channelFilterOptions(), selectedChannelId)}</select></label>`;
    }
    const channelName = (global.phase2State?.channels || []).find((item) => item.id === currentChannelId)?.name || "当前渠道";
    return `<span class="ops-channel-readonly">当前渠道${scopeMark}：${escapeHtml(channelName)}</span>`;
  }

  function renderTopControls() {
    return `<div class="ops-top-controls"><div class="ops-scope-controls">${renderChannelScope()}${renderDeviceScope()}</div></div>`;
  }

  function renderOpsHeader(title) {
    const layoutMark = opsHandoffMark("运维页品牌头部", "页面顶部左侧将DeepTouch品牌字标与页面标题组成一个标题组，中间使用竖线分隔；右侧紧凑展示当前渠道和设备范围。标题区使用独立底板与下方指标区分区。1220px及以下时筛选位于第二层。页面运行数据保持实时订阅，不展示任何刷新相关控件。", "info");
    return `<header class="ops-hero"><div class="ops-title-block"><div class="ops-brand"><img src="./assets/deeptouch-wordmark.jpg" alt="DeepTouch" /></div><span class="ops-title-divider" aria-hidden="true"></span><h1>${escapeHtml(title)}${layoutMark}</h1></div>${renderTopControls()}</header>`;
  }

  function renderMetrics(deviceList) {
    const online = deviceList.filter((item) => item.onlineState !== "离线").length;
    const offline = deviceList.filter((item) => item.onlineState === "离线").length;
    const live = deviceList.filter((item) => item.broadcastState === "直播中").length;
    const recorded = deviceList.filter((item) => item.broadcastState === "录播中").length;
    const abnormal = deviceList.filter((item) => item.onlineState !== "离线" && deviceMatchesScope(item, "当前异常（全部）")).length;
    return `
      <section class="ops-metrics" aria-label="核心指标">
        ${metricCard("总设备数", deviceList.length, "violet", "bot", opsHandoffMark("核心指标口径", "总设备、在线、离线、直播中、录播中和异常设备均按当前渠道全部直播机器人计算，不随设备范围、开播状态或告警时间变化。在线设备包含仍保持连接但存在健康异常的设备，因此在线与离线之和等于总设备；异常设备用于表达当前健康异常。所有指标仅展示，不可点击筛选。", "info"))}
        ${metricCard("在线设备", online, "green", "wifi")}
        ${metricCard("离线设备", offline, "gray", "wifi-off")}
        ${metricCard("直播中", live, "blue", "radio-tower")}
        ${metricCard("录播中", recorded, "amber", "video")}
        ${metricCard("异常设备", abnormal, "red", "triangle-alert")}
      </section>`;
  }

  function metricCard(title, value, tone, icon, annotation = "") {
    return `<article class="ops-panel ops-metric ${tone}"><div class="ops-metric-icon"><i class="ops-metric-glyph" style="--ops-icon: url('./assets/icons/${icon}.svg')" aria-hidden="true"></i></div><div><span>${title}${annotation}</span><strong>${value}</strong></div></article>`;
  }

  function renderBroadcastFilter(list) {
    return `<div class="ops-broadcast-filter" role="group" aria-label="直播画面状态">${filterOptions.broadcast.map((value) => `<button class="${state.filters.broadcast === value ? "active" : ""}" type="button" aria-pressed="${state.filters.broadcast === value}" onclick="robotOps.setFilter('broadcast', '${value}')"><span>${value}</span></button>`).join("")}</div>`;
  }

  function renderDeviceGrid(list, highlightedIds) {
    if (!list.length) return emptyState("当前没有匹配的机器人", "请切换设备范围查看其他机器人。");
    return `<div class="ops-device-grid">${list.map((item) => renderDeviceCard(item, highlightedIds.has(item.id))).join("")}</div>`;
  }

  function renderDeviceCard(item, highlighted) {
    const tone = broadcastTone(item);
    const conciseAria = `查看 ${displayRobotId(item.id)} ${item.name}详情，${item.onlineState}，${item.broadcastState}`;
    return `
      <button class="ops-device-card ${item.onlineState === "离线" ? "offline" : ""} broadcast-${tone} ${highlighted ? "highlighted" : ""}" data-ops-device="${escapeHtml(item.id)}" type="button" aria-label="${escapeHtml(conciseAria)}" onclick="robotOps.openDevice('${escapeHtml(item.id)}')">
        <div class="ops-device-head"><strong>${escapeHtml(displayRobotId(item.id))}</strong><span class="ops-online-badge ${statusTone(item.onlineState)}">${escapeHtml(item.onlineState)}</span></div>
        <div class="ops-device-main">
          <div class="ops-feed scene-${escapeHtml(item.scene)}">
            ${renderFeedVisual(item)}
            <span class="ops-feed-live state-${tone}">${item.onlineState === "离线" ? "画面中断" : item.broadcastState === "直播中" ? "LIVE" : item.broadcastState === "录播中" ? "REC" : "未开播"}</span>
            ${item.currentAlert && !(item.onlineState === "离线" && item.currentAlert === "设备离线") ? `<span class="ops-alert-badge">${escapeHtml(item.currentAlert)}</span>` : ""}
            <span class="ops-feed-identity"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.version)}</small></span>
          </div>
          <div class="ops-device-info">
            ${renderRuntime(item)}
          </div>
        </div>
        <div class="ops-status-row compact">
          ${statusText("网络", item.network, "wifi")}
          ${statusText("推流", item.stream, "radio-tower")}
          ${statusText("音频", audioStatus(item), "mic")}
          ${statusText("电机", item.motor, "cog")}
        </div>
      </button>`;
  }

  function renderFeedVisual(item) {
    if (item.broadcastState !== "未开播" || item.onlineState === "离线") return robotArtwork(item.version, item.id);
    const source = item.avatarUrl || item.liveRoomImageUrl || opsAssets.idleLandscape;
    return `<img class="ops-idle-portrait" src="${escapeHtml(source)}" alt="" onerror="this.onerror=null;this.src='${opsAssets.idleLandscape}'" />`;
  }

  function renderRuntime(item) {
    if (item.broadcastState === "未开播") return `<div class="ops-live-runtime idle"><span><em>运行任务</em><strong>暂无运行任务</strong></span></div>`;
    return `<div class="ops-live-runtime"><span><em>直播时长</em><strong>${escapeHtml(item.duration)}</strong></span><span><em>当前脚本</em><strong title="${escapeHtml(item.script)}">${escapeHtml(item.script)}</strong></span><span><em>当前阶段</em><strong title="${escapeHtml(item.stage)}">${escapeHtml(item.stage)}</strong></span></div>`;
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
    return `<div class="ops-table-wrap"><table class="ops-table"><thead><tr><th>机器人ID / 名称</th><th>版本</th><th>开播状态</th><th>画面来源</th><th>连接状态</th><th>网络状态</th><th>麦克风</th><th>扬声器</th><th>电机</th><th>推流</th><th>当前告警</th><th>最后上报</th><th>操作</th></tr></thead><tbody>
      ${list.map((item) => `<tr class="${highlightedIds.has(item.id) ? "highlighted" : ""}"><td><strong>${escapeHtml(displayRobotId(item.id))}</strong><small>${escapeHtml(item.name)}</small></td><td>${escapeHtml(item.version)}</td><td>${statusPill(item.broadcastState)}</td><td>${broadcastSourceLabel(item)}</td><td>${statusPill(item.onlineState)}</td><td>${statusPill(item.network)}</td><td>${statusPill(item.microphone)}</td><td>${statusPill(item.speaker)}</td><td>${statusPill(item.motor)}</td><td>${statusPill(item.stream)}</td><td>${item.currentAlert ? `<span class="ops-alert-text">${escapeHtml(item.currentAlert)}</span>` : "—"}</td><td>${escapeHtml(item.lastReportedAt)}</td><td><button class="ops-link" type="button" onclick="robotOps.openDevice('${escapeHtml(item.id)}')">查看详情</button></td></tr>`).join("")}
    </tbody></table></div>`;
  }

  function statusPill(value) {
    return `<span class="ops-status-pill ${statusTone(value)}">${escapeHtml(value)}</span>`;
  }

  function renderAlerts(list) {
    return `<aside class="ops-panel ops-alert-panel">
      <div class="ops-section-head"><div><h3>${opsIcon("triangle-alert")}告警列表${opsHandoffMark("告警列表字段与规则", "字段包括机器人ID、机器人名称、异常情况、持续时长和时间，ID显示为RBT加数字序号。按发生时间倒序展示；名称过长单行省略，异常情况必须完整换行。时间可选近1、3、6、12、24小时。点击告警直接打开设备详情，不改变当前筛选与视图。", "info")}</h3><span>${list.length} 条</span></div></div>
      <div class="ops-alert-columns"><span>机器人ID</span><span>机器人名称</span><span>异常情况</span><span>持续时长</span><label class="ops-alert-time-filter"><select aria-label="告警时间" onchange="robotOps.setFilter('hours', this.value)">${filterOptions.hours.map((value) => `<option value="${value}" ${value === state.filters.hours ? "selected" : ""}>近${value}小时</option>`).join("")}</select></label></div>
      <div class="ops-alert-list">
        ${list.length ? list.map((item) => {
          const linkedDevice = deviceById(item.deviceId);
          return `<button class="ops-alert-row severity-${escapeHtml(item.severity)}" type="button" onclick="robotOps.locateAlert('${escapeHtml(item.id)}')"><span title="${escapeHtml(item.deviceId)}">${escapeHtml(displayRobotId(item.deviceId))}</span><span class="ops-alert-device-name" title="${escapeHtml(linkedDevice?.name || "-")}">${escapeHtml(linkedDevice?.name || "-")}</span><strong title="${escapeHtml(item.message)}">${escapeHtml(item.message)}</strong><span class="ops-alert-duration">${formatDuration(alertDurationSeconds(item))}</span><time>${formatClock(alertTimestamp(item))}</time></button>`;
        }).join("") : emptyState("暂无告警", "当前设备范围和时间条件下没有告警记录。", true)}
      </div>
    </aside>`;
  }

  function renderDrawer() {
    if (!state.selectedDeviceId) return "";
    const item = baseDevices().find((entry) => entry.id === state.selectedDeviceId) || deviceById(state.selectedDeviceId);
    if (!item) return "";
    const recentAlerts = allAlerts().filter((entry) => entry.deviceId === item.id).slice(0, 6);
    return `<div class="ops-drawer-backdrop" onclick="robotOps.closeDevice()">
      <aside class="ops-drawer" role="dialog" aria-modal="true" aria-label="机器人运维详情" onclick="event.stopPropagation()">
        <div class="ops-drawer-head"><strong>${opsIcon("monitor-cog")}机器人详情${opsHandoffMark("设备详情字段", "详情ID显示为RBT加数字序号。顶部概览区左侧按3:4比例展示头像，右侧合并机器人名称、基础信息和直播运行；下方按脚本执行、设备连接分组展示。电机状态独立展示1至15号圆形编号；最近告警固定展示该机器人最新6条，不继承页面筛选。", "new")}</strong><button type="button" aria-label="关闭" onclick="robotOps.closeDevice()">${opsIcon("x")}</button></div>
        <section class="ops-detail-summary">
          <div class="ops-detail-avatar"><img class="ops-detail-portrait" src="${escapeHtml(item.portraitUrl || item.avatarUrl || opsAssets.portrait)}" alt="${escapeHtml(item.name)}头像" onerror="this.onerror=null;this.src='${opsAssets.portrait}'" /></div>
          <div class="ops-detail-summary-content">
            <div class="ops-detail-summary-identity"><div><h2>${escapeHtml(item.name)}</h2><small>${escapeHtml(displayRobotId(item.id))}</small></div>${statusPill(item.onlineState)}</div>
            <div class="ops-detail-summary-grid">
              ${detailItem("机器人版本", item.version)}
              ${detailItem("最后上报", item.lastReportedAt)}
              ${detailItem("开播状态", item.broadcastState, true)}
              ${detailItem("画面来源", broadcastSourceLabel(item))}
              ${detailItem("直播时长", item.duration)}
            </div>
          </div>
        </section>
        <div class="ops-detail-overview">
          ${detailGroup("脚本执行", [detailItem("当前脚本", item.script), detailItem("当前阶段", item.stage)], "detail-content", "scroll-text")}
          ${detailGroup("设备连接", [detailItem("网络", item.network, true), detailItem("推流", item.stream, true), detailItem("麦克风", item.microphone, true), detailItem("扬声器", item.speaker, true)], "detail-status", "cpu")}
        </div>
        ${renderMotorStatusGrid(item)}
        <section class="ops-detail-alerts"><div class="ops-section-head"><div><h3>${opsIcon("triangle-alert")}最近告警</h3></div></div>
          ${recentAlerts.length ? recentAlerts.map((entry) => `<div class="ops-detail-alert-row"><span class="ops-presence warning"></span><div><strong>${escapeHtml(entry.message)}</strong><small>${escapeHtml(entry.type)} · ${formatClock(alertTimestamp(entry), true)}</small></div></div>`).join("") : emptyState("暂无告警记录", "", true)}
        </section><div class="ops-detail-actions"><button class="ops-button ops-enter-live" type="button" onclick="robotOps.enterLiveRoom('${escapeHtml(item.id)}')">${opsIcon("monitor-cog")}查看直播数据大屏${opsHandoffMark("运维详情跳转规则", "查看直播数据大屏始终可用：直播中展示实时数据，未开播展示历史记录，没有历史记录时展示空数据；查看脚本进入当前机器人的脚本执行管理，未配置脚本时展示空状态。", "info")}</button><button class="ops-button ghost ops-view-script" type="button" onclick="robotOps.viewScript('${escapeHtml(item.id)}')">${opsIcon("scroll-text")}查看脚本</button></div>
      </aside>
    </div>`;
  }

  function detailItem(label, value, colored = false) {
    return `<div class="ops-detail-field"><span>${label}</span>${colored ? statusPill(value) : `<strong title="${escapeHtml(value)}">${escapeHtml(value)}</strong>`}</div>`;
  }

  function detailGroup(title, items, kind = "detail-compact", icon = "cpu") {
    return `<section class="ops-detail-group"><div class="ops-detail-group-title"><h3>${opsIcon(icon)}${escapeHtml(title)}</h3></div><div class="ops-detail-group-grid ${kind}">${items.join("")}</div></section>`;
  }

  function emptyState(title, description, compact = false) {
    return `<div class="ops-empty ${compact ? "compact" : ""}">${opsIcon("monitor-cog", "", "ops-empty-icon")}<strong>${escapeHtml(title)}</strong>${description ? `<small>${escapeHtml(description)}</small>` : ""}</div>`;
  }

  function render() {
    const metricDeviceList = baseDevices();
    const scopeDeviceList = scopedDevices();
    const deviceList = visibleDevices();
    const monitorList = deviceList;
    const alertList = visibleAlerts();
    const highlightedIds = state.selectedDeviceId ? new Set([state.selectedDeviceId]) : new Set();
    const monitorPanel = `<article class="ops-panel ops-monitor-panel">
          <div class="ops-section-head ops-monitor-head"><div class="ops-monitor-heading"><div><h3>直播画面监控${opsHandoffMark("画面范围与视图规则", "开播状态可选全部、直播中、录播中和未开播，与顶部设备范围取交集，只影响画面、列表和全屏监控。画面、列表与全屏使用同一结果集，切换后保留筛选条件。", "new")}${opsHandoffMark("机器人画面卡片字段", "画面卡片展示RBT编号、名称、版本、唯一画面状态、在线状态、当前具体告警、运行信息以及网络、推流、音频和电机四类健康图标。未开播且设备未离线时优先展示头像，没有头像时使用统一占位图；未开播只展示暂无运行任务。", "info")}</h3></div>${renderBroadcastFilter(scopeDeviceList)}</div><div class="ops-view-switch"><button class="${state.viewMode === "grid" ? "active" : ""}" type="button" onclick="robotOps.setView('grid')">${opsIcon("layout-grid")}画面视图</button><button class="${state.viewMode === "list" ? "active" : ""}" type="button" onclick="robotOps.setView('list')">${opsIcon("list")}列表视图</button><button class="${state.fullscreen ? "active" : ""}" type="button" onclick="robotOps.toggleFullscreen(${state.fullscreen ? "false" : "true"})">${opsIcon("maximize-2")}${state.fullscreen ? "退出全屏" : "全屏监控"}</button></div></div>
          <div class="ops-monitor-content">${state.viewMode === "grid" ? renderDeviceGrid(monitorList, highlightedIds) : renderDeviceTable(monitorList, highlightedIds)}</div>
        </article>`;
    if (state.fullscreen) {
      return `<div class="robot-ops-page fullscreen-monitor">
        ${renderOpsHeader("直播间画面墙")}
        <section class="ops-monitor-layout only-monitor">${monitorPanel}</section>
        ${renderDrawer()}
      </div>`;
    }
    return `<div class="robot-ops-page ops-fixed-layout">
      <section class="ops-fixed-top">
        ${renderOpsHeader("机器人直播运维监控")}
        ${renderMetrics(metricDeviceList)}
      </section>
      <section class="ops-fixed-middle">
        <section class="ops-monitor-layout">
          ${monitorPanel}
          ${renderAlerts(alertList)}
        </section>
      </section>
      ${renderDrawer()}
    </div>`;
  }

  const api = { render, setFilter, setView, toggleFullscreen, openDevice, closeDevice, locateAlert, enterLiveRoom, viewScript };
  global.robotOps = api;
  global.renderRobotOpsPage = render;
  global.addEventListener("phase2-state-changed", applyRealtimeUpdate);
})(window);
