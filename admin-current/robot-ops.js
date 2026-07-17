(function createRobotOpsModule(global) {
  "use strict";

  const filterOptions = {
    version: ["全部", "R版", "Z版", "AGV版"],
    deviceScope: ["全部设备", "当前异常（全部）", "网络异常", "电机异常", "扬声器异常", "麦克风异常", "推流异常", "系统异常"],
    broadcast: ["全部", "开播", "未开播"],
    hours: ["all", 1, 3, 6, 12, 24],
  };

  const opsAssets = {
    idleLandscape: "./assets/robot-ops/humanoid-host-landscape.jpg",
    portrait: "./assets/robot-ops/humanoid-host-portrait.jpg",
  };

  const recordedVideoSources = new Set(["recorded_manual", "recorded_auto", "recovering"]);

  const seedDevices = [
    device("DT-LIVE-001", "星栖", "Z版", "直播", "在线", "正常", "正常", "正常", "正常", "云紫", "2026-07-10 18:59:48"),
    device("DT-LIVE-002", "知鹤", "R版", "直播", "在线", "正常", "正常", "正常", "正常", "海蓝", "2026-07-10 18:59:42"),
    device("DT-LIVE-003", "小暖", "Z版", "直播", "异常", "正常", "正常", "正常", "3号电机异常", "霓虹", "2026-07-10 18:59:36", "3号电机异常"),
    device("DT-LIVE-004", "柳如春", "R版", "直播", "异常", "网络异常", "正常", "正常", "正常", "暖橙", "2026-07-10 18:59:31", "网络连接中断"),
    device("DT-LIVE-005", "云涵", "Z版", "直播", "异常", "正常", "未检测", "正常", "正常", "薄荷", "2026-07-10 18:59:24", "麦克风状态未上报"),
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

  const prototypeStartedAt = new Date();

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
    previousViewMode: "grid",
    fullscreen: false,
    selectedDeviceId: "",
    focusReturnKey: "",
    lastRefresh: new Date(),
    dataConnection: global.navigator?.onLine === false ? "disconnected" : "connected",
    channelContextId: global.phase2State?.snapshot().currentChannelId || "channel-weishi",
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
    const at = new Date(prototypeStartedAt.getTime() - minutesAgo * 60 * 1000);
    const sequence = Number(String(id).match(/(\d+)$/)?.[1] || 1);
    const resolved = minutesAgo > 30;
    const durationSeconds = 90 + ((sequence * 97) % 1100);
    return {
      id,
      deviceId,
      severity,
      type,
      message,
      at: at.toISOString(),
      resolved,
      resolvedAt: resolved ? new Date(at.getTime() + durationSeconds * 1000).toISOString() : "",
    };
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
    return new Date(prototypeStartedAt.getTime() - Number(item.minutesAgo || 0) * 60 * 1000);
  }

  function alertDurationSeconds(item) {
    const startedAt = alertTimestamp(item).getTime();
    const endedAt = item.resolvedAt ? new Date(item.resolvedAt).getTime() : Date.now();
    return Math.max(1, Math.round((endedAt - startedAt) / 1000));
  }

  function alertAgeMinutes(item) {
    return Math.max(0, (Date.now() - alertTimestamp(item).getTime()) / 60000);
  }

  function formatClock(date, withDate = false) {
    const pad = (value) => String(value).padStart(2, "0");
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    return withDate ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${time}` : time;
  }

  function alertListTime(date) {
    const pad = (value) => String(value).padStart(2, "0");
    return {
      clock: `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
      day: `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    };
  }

  function prototypeVideoSource(item, currentMode) {
    if (currentMode !== "live") return currentMode;
    const sequence = Number(robotSequenceId(item.id));
    return sequence > 14 && sequence % 13 === 4 && item.onlineState !== "离线" ? "recorded_manual" : "live";
  }

  function broadcastStateFor(item) {
    if (item.id === "DT-LIVE-001") return "未开播";
    const sequence = Number(robotSequenceId(item.id));
    if (sequence > 14 && sequence % 7 === 0) return "未开播";
    return "开播";
  }

  function effectiveVideoSourceFor(item, broadcastState, connectionState) {
    if (broadcastState === "未开播") return "none";
    if (connectionState === "disconnected") return "recorded_auto";
    return item.videoSource || "live";
  }

  function isRecordedVideoSource(videoSource) {
    return recordedVideoSources.has(videoSource);
  }

  function formatDuration(totalSeconds) {
    const pad = (value) => String(value).padStart(2, "0");
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(totalSeconds % 60)}`;
  }

  function broadcastRuntimeFor(item) {
    const sequence = Number(robotSequenceId(item.id)) || 1;
    const scripts = ["晚间互动场", "美妆好物专场", "科普小课堂", "国风文化讲解", "宠物日常互动", "产品讲解专场"];
    const stages = ["开场互动", "主题讲解", "知识问答", "产品讲解", "弹幕互动"];
    if (item.broadcastState === "未开播") {
      const scriptBinding = global.robotOpsScriptBindingFor?.(item.id, item.name) || item.scriptBinding || null;
      const hasBoundScript = Boolean(scriptBinding?.name);
      return hasBoundScript
        ? {
            duration: "",
            script: scriptBinding.name,
            stage: scriptBinding.stage || "开场准备",
            hasBoundScript: true,
          }
        : { duration: "", script: "暂无脚本信息", stage: "", hasBoundScript: false };
    }
    return {
      duration: formatDuration(1800 + ((sequence * 173) % 7200)),
      script: isRecordedVideoSource(item.videoSource) ? "时尚穿搭录播" : scripts[sequence % scripts.length],
      stage: isRecordedVideoSource(item.videoSource) ? "录播内容播放" : stages[sequence % stages.length],
      hasBoundScript: true,
    };
  }

  function enrichBroadcastState(item) {
    const connectionState = item.connectionState || (item.onlineState === "离线" ? "disconnected" : "connected");
    const broadcastState = broadcastStateFor(item);
    const videoSource = effectiveVideoSourceFor(item, broadcastState, connectionState);
    const normalized = { ...item, connectionState, broadcastState, videoSource };
    const enriched = { ...normalized, ...broadcastRuntimeFor(normalized) };
    const deviceState = deviceStateFor({ ...enriched, connectionState });
    return { ...enriched, connectionState, deviceState, onlineState: deviceState };
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
      const next = { ...item, channelId: room?.channelId || "channel-weishi", currentAlert: video.faultType, videoSource };
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
      .map((item) => ({
        id: item.id,
        deviceId: item.robotId,
        severity: item.severity,
        type: item.type,
        message: item.message,
        at: item.at,
        resolved: Boolean(item.resolved),
        resolvedAt: item.resolvedAt || "",
        phase2: true,
      }));
    return [...phase2Alerts, ...alerts]
      .filter((item) => allowedDeviceIds.has(item.deviceId))
      .sort((a, b) => alertTimestamp(b) - alertTimestamp(a));
  }

  function baseAlerts() {
    const alertType = selectedAlertType();
    return allAlerts()
      .filter((item) => state.filters.hours === "all" || alertAgeMinutes(item) <= state.filters.hours * 60)
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
    const values = healthValuesFor(item);
    if (scope === "当前异常（全部）") return Boolean(String(item.currentAlert || "").trim());
    const label = scope.replace("异常", "");
    if (Object.hasOwn(values, label)) return values[label] === "异常";
    return true;
  }

  function rerender() {
    if (typeof global.renderApp === "function") global.renderApp();
  }

  function setFilter(key, value) {
    if (!Object.hasOwn(state.filters, key)) return;
    state.filters[key] = key === "hours" ? (value === "all" ? "all" : Number(value)) : value;
    if (key !== "hours") state.selectedDeviceId = "";
    rerender();
  }

  function setView(mode) {
    state.viewMode = mode === "list" ? "list" : "grid";
    rerender();
  }

  function toggleFullscreen(enabled = !state.fullscreen) {
    const nextFullscreen = Boolean(enabled);
    if (nextFullscreen && !state.fullscreen) {
      state.previousViewMode = state.viewMode;
      state.viewMode = "grid";
    } else if (!nextFullscreen && state.fullscreen) {
      state.viewMode = state.previousViewMode || "grid";
    }
    state.fullscreen = nextFullscreen;
    rerender();
  }

  function applyRealtimeUpdate(event) {
    const nextChannelId = global.phase2State?.snapshot().currentChannelId || state.channelContextId;
    if (nextChannelId !== state.channelContextId) {
      state.channelContextId = nextChannelId;
      state.selectedDeviceId = "";
    }
    if (event?.detail?.connectionState) state.dataConnection = event.detail.connectionState;
    else state.dataConnection = "connected";
    state.lastRefresh = new Date();
    if (global.location.hash !== "#robot-ops") return;
    rerenderPreservingDrawerContext();
  }

  function rerenderPreservingDrawerContext() {
    const drawerBody = document.querySelector(".ops-drawer-body");
    const scrollTop = drawerBody?.scrollTop || 0;
    const focusKey = document.activeElement?.getAttribute?.("data-ops-drawer-focus") || "";
    const drawerWasFocused = document.activeElement?.classList?.contains("ops-drawer");
    rerender();
    global.requestAnimationFrame(() => {
      const nextBody = document.querySelector(".ops-drawer-body");
      if (nextBody) nextBody.scrollTop = scrollTop;
      if (focusKey) document.querySelector(`[data-ops-drawer-focus="${focusKey}"]`)?.focus();
      else if (drawerWasFocused) document.querySelector(".ops-drawer")?.focus();
    });
  }

  function setDataConnection(connectionState) {
    const nextState = connectionState === "disconnected" ? "disconnected" : "connected";
    if (state.dataConnection === nextState) return;
    state.dataConnection = nextState;
    if (global.location.hash === "#robot-ops") rerenderPreservingDrawerContext();
  }

  function openDevice(deviceId) {
    state.focusReturnKey = document.activeElement?.getAttribute?.("data-ops-focus-return") || `device-${deviceId}`;
    state.selectedDeviceId = deviceId;
    rerender();
    global.requestAnimationFrame(() => document.querySelector(".ops-drawer")?.focus());
  }

  function closeDevice() {
    const focusReturnKey = state.focusReturnKey;
    state.selectedDeviceId = "";
    rerender();
    global.requestAnimationFrame(() => {
      const focusTarget = focusReturnKey ? document.querySelector(`[data-ops-focus-return="${focusReturnKey}"]`) : null;
      (focusTarget || document.querySelector(".ops-monitor-panel"))?.focus();
    });
  }

  function locateAlert(alertId) {
    const item = baseAlerts().find((entry) => entry.id === alertId);
    if (!item) return;
    state.focusReturnKey = document.activeElement?.getAttribute?.("data-ops-focus-return") || `alert-${alertId}`;
    state.selectedDeviceId = item.deviceId;
    rerender();
    global.requestAnimationFrame(() => document.querySelector(".ops-drawer")?.focus());
  }

  function statusTone(value) {
    if (["正常", "在线", "开播"].includes(value)) return "ok";
    if (["异常"].includes(value) || ["异常", "中断", "失败"].some((keyword) => String(value).includes(keyword))) return "danger";
    if (["离线", "未检测", "未开播"].includes(value)) return "muted";
    return "warning";
  }

  function deviceStateFor(item) {
    const connectionState = item.connectionState || (item.onlineState === "离线" ? "disconnected" : "connected");
    if (connectionState === "disconnected") return "离线";
    return String(item.currentAlert || "").trim() ? "异常" : "在线";
  }

  function liveRoomAvailabilityRank(item) {
    return { "在线": 0, "异常": 1, "离线": 2 }[item.onlineState] ?? 1;
  }

  function binaryHealthStatus(item, label, value) {
    if (item.onlineState === "离线") return "异常";
    const componentFault = String(item.currentAlert || "").includes(label);
    if (componentFault) return "异常";
    if (label === "推流" && item.broadcastState === "未开播") return "正常";
    return String(value || "").trim() === "正常" ? "正常" : "异常";
  }

  function healthValuesFor(item) {
    return {
      网络: binaryHealthStatus(item, "网络", networkStatusFor(item)),
      推流: binaryHealthStatus(item, "推流", streamStatusFor(item)),
      麦克风: binaryHealthStatus(item, "麦克风", item.microphone),
      扬声器: binaryHealthStatus(item, "扬声器", item.speaker),
      电机: binaryHealthStatus(item, "电机", item.motor),
      系统: binaryHealthStatus(item, "系统", systemStatusFor(item)),
    };
  }

  function statusText(item, label, value, icon) {
    const displayValue = binaryHealthStatus(item, label, value);
    const tone = statusTone(displayValue);
    const resolvedIcon = healthIconName(icon, displayValue);
    return `<span class="ops-status-item ${tone}" title="${escapeHtml(label)}：${escapeHtml(displayValue)}" aria-label="${escapeHtml(label)}：${escapeHtml(displayValue)}">${opsIcon(resolvedIcon, "", "ops-status-icon")}<span>${escapeHtml(label)}</span><strong>${escapeHtml(displayValue)}</strong></span>`;
  }

  function healthIconName(icon, value) {
    const tone = statusTone(value);
    if (icon === "wifi" && String(value).includes("离线")) return "wifi-off";
    if (tone !== "danger") return icon;
    if (icon === "wifi") return String(value).includes("中断") ? "wifi-off" : "wifi-low";
    return { "radio-tower": "radio-off", mic: "mic-off", "volume-2": "volume-x" }[icon] || icon;
  }

  function systemStatusFor(item) {
    if (item.onlineState === "离线") return "离线";
    const currentAlert = String(item.currentAlert || "");
    return ["系统", "服务", "磁盘", "内存", "重启", "心跳"].some((keyword) => currentAlert.includes(keyword)) ? "系统异常" : "正常";
  }

  function streamStatusFor(item) {
    const currentAlert = String(item.currentAlert || "");
    if (item.onlineState === "离线") return "未检测";
    if (item.broadcastState === "未开播") return "未检测";
    if (currentAlert.includes("推流") && ["中断", "失败"].some((keyword) => currentAlert.includes(keyword))) return "推流中断";
    return item.stream;
  }

  function networkStatusFor(item) {
    const currentAlert = String(item.currentAlert || "");
    if (item.onlineState === "离线") return "离线";
    if (currentAlert.includes("网络") && ["中断", "失败"].some((keyword) => currentAlert.includes(keyword))) return "网络中断";
    return item.network;
  }

  function statusIconName(value) {
    if (["正常", "在线", "开播"].includes(value)) return "circle-check";
    if (["离线", "未检测", "未开播"].includes(value)) return "circle-off";
    return "circle-alert";
  }

  function motorStatuses(item) {
    const abnormalNumbers = new Set([...String(item.motor || "").matchAll(/(\d+)号/g)].map((match) => Number(match[1])));
    const overallStatus = binaryHealthStatus(item, "电机", item.motor);
    const locationKnown = overallStatus === "正常" || abnormalNumbers.size > 0;
    return Array.from({ length: 15 }, (_, index) => ({
      number: index + 1,
      tone: overallStatus === "正常" ? "ok" : locationKnown ? (abnormalNumbers.has(index + 1) ? "danger" : "ok") : "neutral",
    }));
  }

  function renderMotorStatusGrid(item) {
    const motors = motorStatuses(item);
    const overallStatus = binaryHealthStatus(item, "电机", item.motor);
    const hasUnknownLocation = overallStatus === "异常" && motors.every((motor) => motor.tone === "neutral");
    return `<section class="ops-motor-detail"><div class="ops-motor-detail-head"><div><h3>${opsIcon("cog")}电机状态</h3>${hasUnknownLocation ? `<p class="ops-motor-location-note">异常位置未上报</p>` : ""}</div><div class="ops-motor-legend"><span class="${statusTone(overallStatus)}">${overallStatus}</span></div></div><div class="ops-motor-grid">${motors.map((motor) => {
      const result = motor.tone === "danger" ? "异常" : motor.tone === "ok" ? "正常" : "异常位置未上报";
      const motorLabel = `${motor.number}号电机：${result}`;
      return `<span class="ops-motor-dot ${motor.tone}" role="img" aria-label="${motorLabel}" title="${motorLabel}">${motor.number}</span>`;
    }).join("")}</div></section>`;
  }

  function videoSourceLabel(mode) {
    return { live: "实时画面", recorded_manual: "人工录播", recorded_auto: "故障自动转录播", recovering: "故障自动转录播", none: "画面未开启" }[mode] || "画面未开启";
  }

  function broadcastSourceLabel(item) {
    return item.broadcastState === "未开播" ? "画面未开启" : videoSourceLabel(item.videoSource);
  }

  function broadcastTone(item) {
    if (item.broadcastState !== "开播") return "idle";
    return isRecordedVideoSource(item.videoSource) ? "recorded" : "live";
  }

  function enterLiveRoom(deviceId) {
    const room = global.phase2State?.roomForRobot(deviceId);
    if (!room) return;
    state.selectedDeviceId = "";
    state.focusReturnKey = "";
    global.changeLiveDashboardRoom?.(room.id);
    global.navigate?.("live-dashboard");
  }

  function viewScript(deviceId) {
    const item = deviceById(deviceId);
    state.selectedDeviceId = "";
    state.focusReturnKey = "";
    rerender();
    global.requestAnimationFrame(() => global.openRobotScriptsFromOps?.(deviceId, item?.name || ""));
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
    return `<label class="ops-device-scope" title="按机器人当前状态筛选画面和列表"><span>设备范围${opsHandoffMark("设备范围规则", "可选全部设备、当前异常（全部）以及网络、电机、扬声器、麦克风、推流、系统异常。当前异常按存在当前有效告警的机器人去重；选择具体异常类型时，告警列表同步查询该类型的历史告警。", "new")}</span><select aria-label="设备范围" onchange="robotOps.setFilter('deviceScope', this.value)">${optionMarkup(filterOptions.deviceScope, state.filters.deviceScope)}</select></label>`;
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
    const connectionMessage = state.dataConnection === "disconnected"
      ? `<span class="ops-data-connection danger" role="status">${opsIcon("wifi-off")}数据连接异常，正在显示最后一次数据</span>`
      : "";
    return `<div class="ops-top-controls"><div class="ops-scope-controls">${renderChannelScope()}${renderDeviceScope()}</div>${connectionMessage}</div>`;
  }

  function renderOpsHeader(title, attributes = "") {
    const layoutMark = opsHandoffMark("运维页品牌头部", "页面顶部左侧将DeepTouch品牌字标与页面标题组成一个标题组，中间使用竖线分隔；右侧紧凑展示当前渠道和设备范围。标题区使用独立底板与下方指标区分区。1220px及以下时筛选位于第二层。页面运行数据保持实时订阅，不展示任何刷新相关控件。", "info");
    return `<header class="ops-hero" ${attributes}><div class="ops-title-block"><div class="ops-brand"><img src="./assets/deeptouch-wordmark.jpg" alt="DeepTouch" /></div><span class="ops-title-divider" aria-hidden="true"></span><h1>${escapeHtml(title)}${layoutMark}</h1></div>${renderTopControls()}</header>`;
  }

  function renderMetrics(deviceList) {
    const connected = deviceList.filter((item) => item.connectionState === "connected").length;
    const offline = deviceList.filter((item) => item.connectionState === "disconnected").length;
    const live = deviceList.filter((item) => item.broadcastState === "开播" && !isRecordedVideoSource(item.videoSource)).length;
    const recorded = deviceList.filter((item) => item.broadcastState === "开播" && isRecordedVideoSource(item.videoSource)).length;
    const abnormal = deviceList.filter((item) => String(item.currentAlert || "").trim()).length;
    return `
      <section class="ops-metrics" aria-label="核心指标">
        ${metricCard("总设备", deviceList.length, "violet", "bot", opsHandoffMark("核心指标口径", "总设备、已连接、离线设备、直播中、录播中和当前异常均按当前渠道全部直播机器人计算，不随设备范围、开播状态或告警时间变化。已连接与离线设备之和等于总设备；直播中只统计开播且使用实时画面的设备，录播中只统计开播且使用人工录播或故障自动转录播的设备；当前异常按存在当前有效告警的机器人去重统计，可与连接、离线和画面状态重叠。所有指标仅展示，不可点击筛选。", "info"))}
        ${metricCard("已连接", connected, "green", "wifi")}
        ${metricCard("离线设备", offline, "gray", "wifi-off")}
        ${metricCard("直播中", live, "blue", "radio-tower")}
        ${metricCard("录播中", recorded, "amber", "videotape")}
        ${metricCard("当前异常", abnormal, "red", "triangle-alert")}
      </section>`;
  }

  function metricCard(title, value, tone, icon, annotation = "") {
    return `<article class="ops-panel ops-metric ${tone}"><div class="ops-metric-icon"><i class="ops-metric-glyph" style="--ops-icon: url('./assets/icons/${icon}.svg')" aria-hidden="true"></i></div><div><span>${title}${annotation}</span><strong>${value}</strong></div></article>`;
  }

  function renderBroadcastFilter(list) {
    return `<div class="ops-broadcast-filter" role="group" aria-label="开播状态">${filterOptions.broadcast.map((value) => `<button class="${state.filters.broadcast === value ? "active" : ""}" type="button" aria-pressed="${state.filters.broadcast === value}" onclick="robotOps.setFilter('broadcast', '${value}')"><span>${value}</span></button>`).join("")}</div>`;
  }

  function renderDeviceGrid(list, highlightedIds) {
    if (!list.length) return emptyState("当前没有匹配的机器人", "请切换设备范围查看其他机器人。");
    return `<div class="ops-device-grid">${list.map((item) => renderDeviceCard(item, highlightedIds.has(item.id))).join("")}</div>`;
  }

  function renderDeviceCard(item, highlighted) {
    const tone = broadcastTone(item);
    const visualLabel = item.broadcastState === "开播"
      ? (isRecordedVideoSource(item.videoSource) ? "REC" : "LIVE")
      : item.onlineState === "离线" ? "离线" : "未开播";
    const conciseAria = `查看 ${displayRobotId(item.id)} ${item.name}详情，运行状态${item.onlineState}，画面状态${visualLabel}，版本${item.version}${item.script ? `，脚本${item.script}` : ""}${item.stage ? `，阶段${item.stage}` : ""}`;
    const identity = `${displayRobotId(item.id)}-${item.name}`;
    return `
      <button class="ops-device-card ${item.onlineState === "离线" ? "offline" : ""} broadcast-${tone} ${highlighted ? "highlighted" : ""}" data-ops-device="${escapeHtml(item.id)}" data-ops-focus-return="device-${escapeHtml(item.id)}" type="button" aria-label="${escapeHtml(conciseAria)}" onclick="robotOps.openDevice('${escapeHtml(item.id)}')">
        <div class="ops-device-main">
          <div class="ops-feed scene-${escapeHtml(item.scene)}">
            ${renderFeedVisual(item)}
            <div class="ops-card-topline">
              <div class="ops-card-identity ${statusTone(item.onlineState)}">
                <span class="ops-presence-dot" aria-hidden="true"></span>
                <span class="ops-card-identity-copy">
                  <strong title="${escapeHtml(identity)}">${escapeHtml(identity)}</strong>
                  <small class="ops-card-version">${escapeHtml(item.version)}</small>
                </span>
              </div>
              <span class="ops-feed-live state-${tone}">${visualLabel}</span>
            </div>
            ${renderRuntime(item)}
          </div>
        </div>
      </button>`;
  }

  function renderFeedVisual(item) {
    const visualState = item.broadcastState === "开播"
      ? (isRecordedVideoSource(item.videoSource) ? "recorded" : "live")
      : item.onlineState === "离线" ? "offline" : "idle";
    const source = visualState === "recorded"
      ? item.recordingPosterUrl || item.livePreviewUrl || item.liveRoomImageUrl || item.avatarUrl || opsAssets.idleLandscape
      : visualState === "idle" || visualState === "offline"
        ? item.avatarUrl || opsAssets.portrait
        : item.livePreviewUrl || item.liveRoomImageUrl || item.avatarUrl || opsAssets.idleLandscape;
    return `<img class="ops-room-visual state-${visualState}" src="${escapeHtml(source)}" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${opsAssets.portrait}'" />`;
  }

  function renderRuntime(item) {
    const isIdle = item.broadcastState === "未开播";
    const showStage = Boolean(item.stage);
    const showDuration = !isIdle && Boolean(item.duration);
    return `<div class="ops-live-runtime ${isIdle ? "idle" : ""} ${showStage ? "" : "no-stage"}">
      <span class="ops-runtime-copy">
        <strong title="${escapeHtml(item.script || "暂无脚本信息")}">${escapeHtml(item.script || "暂无脚本信息")}</strong>
        ${showStage ? `<small title="${escapeHtml(item.stage)}">${escapeHtml(item.stage)}</small>` : ""}
      </span>
      ${showDuration ? `<time datetime="${escapeHtml(item.duration)}" title="直播时长 ${escapeHtml(item.duration)}">${escapeHtml(item.duration)}</time>` : ""}
    </div>`;
  }

  function renderDeviceTable(list, highlightedIds) {
    if (!list.length) return emptyState("当前筛选条件下没有匹配的机器人", "请调整筛选条件后重试。");
    return `<div class="ops-table-wrap"><table class="ops-table"><thead><tr><th>机器人编号 / 名称</th><th>版本</th><th>开播状态</th><th>画面来源</th><th title="机器人整体运行结论">运行状态</th><th>最后上报</th></tr></thead><tbody>
      ${list.map((item) => {
        const deviceId = escapeHtml(item.id);
        const rowLabel = `查看 ${displayRobotId(item.id)} ${item.name}详情，版本${item.version}，开播状态${item.broadcastState}，画面来源${broadcastSourceLabel(item)}，运行状态${item.onlineState}，最后上报${item.lastReportedAt}`;
        return `<tr class="ops-device-row ${highlightedIds.has(item.id) ? "highlighted" : ""}" tabindex="0" role="button" aria-label="${escapeHtml(rowLabel)}" title="点击查看机器人详情" data-ops-focus-return="device-${deviceId}" onclick="robotOps.openDevice('${deviceId}')" onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); robotOps.openDevice('${deviceId}'); }"><td><strong>${escapeHtml(displayRobotId(item.id))}</strong><small>${escapeHtml(item.name)}</small></td><td>${escapeHtml(item.version)}</td><td>${statusPill(item.broadcastState)}</td><td>${escapeHtml(broadcastSourceLabel(item))}</td><td>${statusPill(item.onlineState)}</td><td>${escapeHtml(item.lastReportedAt)}</td></tr>`;
      }).join("")}
    </tbody></table></div>`;
  }

  function statusPill(value) {
    return `<span class="ops-status-pill ${statusTone(value)}">${opsIcon(statusIconName(value))}<span>${escapeHtml(value)}</span></span>`;
  }

  function renderAlerts(list) {
    return `<aside class="ops-panel ops-alert-panel">
      <div class="ops-section-head ops-alert-head"><div><h3>${opsIcon("triangle-alert")}告警列表${opsHandoffMark("告警列表字段与规则", "字段为RBTID、名称、异常情况和上报时间。按上报时间倒序展示；名称过长单行省略，异常情况完整展示。标题右侧可筛选全部或近1、3、6、12、24小时。点击告警直接打开设备详情，不改变当前筛选与视图。", "info")}</h3><span>${list.length} 条</span></div><label class="ops-alert-time-filter"><select aria-label="上报时间筛选" onchange="robotOps.setFilter('hours', this.value)">${filterOptions.hours.map((value) => `<option value="${value}" ${value === state.filters.hours ? "selected" : ""}>${value === "all" ? "全部" : `近${value}小时`}</option>`).join("")}</select></label></div>
      <div class="ops-alert-columns"><span>RBTID</span><span>名称</span><span>异常情况</span><span>上报时间</span></div>
      <div class="ops-alert-list">
        ${list.length ? list.map((item) => {
          const linkedDevice = deviceById(item.deviceId);
          const occurredAt = alertTimestamp(item);
          const occurredTime = alertListTime(occurredAt);
          return `<button class="ops-alert-row" data-ops-focus-return="alert-${escapeHtml(item.id)}" type="button" onclick="robotOps.locateAlert('${escapeHtml(item.id)}')"><span title="${escapeHtml(item.deviceId)}">${escapeHtml(displayRobotId(item.deviceId))}</span><span class="ops-alert-device-name" title="${escapeHtml(linkedDevice?.name || "-")}">${escapeHtml(linkedDevice?.name || "-")}</span><strong title="${escapeHtml(item.message)}">${escapeHtml(item.message)}</strong><time datetime="${escapeHtml(occurredAt.toISOString())}" title="${escapeHtml(formatClock(occurredAt, true))}"><span class="ops-alert-time-clock">${occurredTime.clock}</span> <small>${occurredTime.day}</small></time></button>`;
        }).join("") : emptyState("暂无告警", "当前设备范围和时间条件下没有告警记录。", true)}
      </div>
    </aside>`;
  }

  function renderDrawer() {
    if (!state.selectedDeviceId) return "";
    const item = baseDevices().find((entry) => entry.id === state.selectedDeviceId) || deviceById(state.selectedDeviceId);
    if (!item) return "";
    const recentAlerts = allAlerts().filter((entry) => entry.deviceId === item.id).slice(0, 6);
    const title = `${displayRobotId(item.id)}-${item.name}`;
    const alertTime = (entry) => {
      const value = alertListTime(alertTimestamp(entry));
      return `${value.day} ${value.clock}`;
    };
    return `<div class="ops-drawer-backdrop" onclick="robotOps.closeDevice()">
      <aside class="ops-drawer" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="ops-drawer-title" onclick="event.stopPropagation()">
        <div class="ops-drawer-head"><div class="ops-drawer-title ${statusTone(item.onlineState)}"><span class="ops-presence-dot" aria-hidden="true"></span><strong id="ops-drawer-title" title="${escapeHtml(title)}">${escapeHtml(title)}</strong>${opsHandoffMark("设备详情字段", "详情标题以状态灯、RBT编号和机器人名称识别设备。身份概览不重复展示运行状态；六项健康状态集中在详情中，最近告警固定展示该机器人最新6条，每条包含上报时间、异常情况和持续时长。", "new")}</div><button type="button" aria-label="关闭" data-ops-drawer-focus="close" onclick="robotOps.closeDevice()">${opsIcon("x")}</button></div>
        <div class="ops-drawer-body">
          <section class="ops-detail-summary">
            <div class="ops-detail-avatar"><img class="ops-detail-portrait" src="${escapeHtml(item.portraitUrl || item.avatarUrl || opsAssets.portrait)}" alt="${escapeHtml(item.name)}头像" onerror="this.onerror=null;this.src='${opsAssets.portrait}'" /></div>
            <div class="ops-detail-summary-content">
              <div class="ops-detail-summary-grid">
                ${detailItem("机器人版本", item.version)}
                ${detailItem("最后上报", item.lastReportedAt)}
                ${detailItem("开播状态", item.broadcastState, true)}
                ${detailItem("画面来源", broadcastSourceLabel(item))}
                ${detailItem("直播时长", item.duration || "—")}
              </div>
              ${item.currentAlert ? `<div class="ops-current-fault" role="status">${opsIcon("triangle-alert")}<span>当前故障</span><strong>${escapeHtml(item.currentAlert)}</strong></div>` : ""}
            </div>
          </section>
          <div class="ops-detail-overview">
            ${detailGroup("脚本执行", [detailItem("当前脚本", item.script || "暂无脚本信息"), ...(item.stage ? [detailItem("当前阶段", item.stage)] : [])], "detail-content", "scroll-text")}
            ${detailGroup("设备连接", [detailStatusItem(item, "网络", networkStatusFor(item), "wifi"), detailStatusItem(item, "推流", streamStatusFor(item), "radio-tower"), detailStatusItem(item, "麦克风", item.microphone, "mic"), detailStatusItem(item, "扬声器", item.speaker, "volume-2"), detailStatusItem(item, "系统", systemStatusFor(item), "cpu")], "detail-status", "cable")}
          </div>
          ${renderMotorStatusGrid(item)}
          <section class="ops-detail-alerts"><div class="ops-section-head"><div><h3>${opsIcon("triangle-alert")}最近告警</h3></div></div>
            ${recentAlerts.length ? recentAlerts.map((entry) => `<div class="ops-detail-alert-row"><time datetime="${escapeHtml(alertTimestamp(entry).toISOString())}" title="${escapeHtml(formatClock(alertTimestamp(entry), true))}">${escapeHtml(alertTime(entry))}</time><strong title="${escapeHtml(entry.message)}">${escapeHtml(entry.message)}</strong><span class="ops-detail-alert-duration">${formatDuration(alertDurationSeconds(entry))}</span></div>`).join("") : emptyState("暂无告警记录", "", true, "circle-check")}
          </section>
        </div>
        <div class="ops-detail-actions"><button class="ops-button ops-enter-live" data-ops-drawer-focus="live-dashboard" type="button" onclick="robotOps.enterLiveRoom('${escapeHtml(item.id)}')">${opsIcon("monitor-up")}查看直播数据大屏${opsHandoffMark("运维详情跳转规则", "查看直播数据大屏始终可用：开播时展示当前直播数据，未开播展示历史记录，没有历史记录时展示空数据；查看脚本进入当前机器人的脚本执行管理，未配置脚本时展示空状态。", "info")}</button><button class="ops-button ghost ops-view-script" data-ops-drawer-focus="script" type="button" onclick="robotOps.viewScript('${escapeHtml(item.id)}')">${opsIcon("scroll-text")}查看脚本</button></div>
      </aside>
    </div>`;
  }

  function detailItem(label, value, colored = false) {
    return `<div class="ops-detail-field"><span>${label}</span>${colored ? statusPill(value) : `<strong title="${escapeHtml(value)}">${escapeHtml(value)}</strong>`}</div>`;
  }

  function detailStatusItem(item, label, value, icon) {
    const displayValue = binaryHealthStatus(item, label, value);
    return `<div class="ops-detail-field ops-detail-status-field ${statusTone(displayValue)}">${opsIcon(healthIconName(icon, displayValue), "", "ops-detail-status-icon")}<div><span>${escapeHtml(label)}</span>${statusPill(displayValue)}</div></div>`;
  }

  function detailGroup(title, items, kind = "detail-compact", icon = "cpu") {
    return `<section class="ops-detail-group"><div class="ops-detail-group-title"><h3>${opsIcon(icon)}${escapeHtml(title)}</h3></div><div class="ops-detail-group-grid ${kind}">${items.join("")}</div></section>`;
  }

  function emptyState(title, description, compact = false, icon = "monitor-off") {
    return `<div class="ops-empty ${compact ? "compact" : ""}">${opsIcon(icon, "", "ops-empty-icon")}<strong>${escapeHtml(title)}</strong>${description ? `<small>${escapeHtml(description)}</small>` : ""}</div>`;
  }

  function render() {
    const metricDeviceList = baseDevices();
    const scopeDeviceList = scopedDevices();
    const deviceList = visibleDevices();
    const monitorList = deviceList;
    const alertList = visibleAlerts();
    const highlightedIds = state.selectedDeviceId ? new Set([state.selectedDeviceId]) : new Set();
    const backgroundAttributes = state.selectedDeviceId ? 'inert aria-hidden="true"' : "";
    const monitorPanel = `<article class="ops-panel ops-monitor-panel" tabindex="-1">
          <div class="ops-section-head ops-monitor-head"><div class="ops-monitor-heading"><div><h3>${opsIcon("monitor-play")}直播画面监控${opsHandoffMark("画面范围与视图规则", "开播状态可选全部、开播和未开播，与顶部设备范围取交集，只影响画面、列表和全屏监控。画面、列表与全屏使用同一结果集，切换后保留筛选条件。", "new")}${opsHandoffMark("机器人画面卡片字段", "每张卡片使用2:3竖屏直播画面。左上展示状态灯、RBT编号、名称和版本，右上按开播和画面来源展示LIVE或REC；离线开播继续显示REC并以离线状态灯体现设备身份，离线未开播显示离线，已连接未开播显示未开播。底部直接叠加脚本、阶段和直播时长，不展示六项设备状态。未开播有绑定脚本时保留脚本与阶段，无脚本时仅显示暂无脚本信息，两种情况均隐藏时长。", "info")}</h3></div>${renderBroadcastFilter(scopeDeviceList)}</div><div class="ops-view-switch"><button class="${state.viewMode === "grid" ? "active" : ""}" type="button" onclick="robotOps.setView('grid')">${opsIcon("layout-grid")}画面视图</button><button class="${state.viewMode === "list" ? "active" : ""}" type="button" onclick="robotOps.setView('list')">${opsIcon("list")}列表视图</button><button class="${state.fullscreen ? "active" : ""}" type="button" onclick="robotOps.toggleFullscreen(${state.fullscreen ? "false" : "true"})">${opsIcon("maximize-2")}${state.fullscreen ? "退出全屏" : "全屏监控"}</button></div></div>
          <div class="ops-monitor-content">${state.viewMode === "grid" ? renderDeviceGrid(monitorList, highlightedIds) : renderDeviceTable(monitorList, highlightedIds)}</div>
        </article>`;
    if (state.fullscreen) {
      return `<div class="robot-ops-page fullscreen-monitor">
        ${renderOpsHeader("直播间画面墙", backgroundAttributes)}
        <section class="ops-monitor-layout only-monitor" ${backgroundAttributes}>${monitorPanel}</section>
        ${renderDrawer()}
      </div>`;
    }
    return `<div class="robot-ops-page ops-fixed-layout">
      <section class="ops-fixed-top" ${backgroundAttributes}>
        ${renderOpsHeader("机器人直播运维监控")}
        ${renderMetrics(metricDeviceList)}
      </section>
      <section class="ops-fixed-middle" ${backgroundAttributes}>
        <section class="ops-monitor-layout">
          ${monitorPanel}
          ${renderAlerts(alertList)}
        </section>
      </section>
      ${renderDrawer()}
    </div>`;
  }

  function handleDrawerKeyboard(event) {
    if (!state.selectedDeviceId) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDevice();
      return;
    }
    if (event.key !== "Tab") return;
    const drawer = document.querySelector(".ops-drawer");
    if (!drawer) return;
    const focusable = [...drawer.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) {
      event.preventDefault();
      drawer.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable.at(-1);
    if (document.activeElement === drawer) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!drawer.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }

  global.addEventListener("keydown", handleDrawerKeyboard);
  global.addEventListener("offline", () => setDataConnection("disconnected"));
  global.addEventListener("online", () => setDataConnection("connected"));

  const api = { render, setFilter, setView, toggleFullscreen, openDevice, closeDevice, locateAlert, enterLiveRoom, viewScript };
  global.robotOps = api;
  global.renderRobotOpsPage = render;
  global.addEventListener("phase2-state-changed", applyRealtimeUpdate);
})(window);
