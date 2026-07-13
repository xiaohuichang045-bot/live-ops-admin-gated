(function createPhase2State(global) {
  "use strict";

  const storageKey = "liveAdminPhase2StateV1";
  const channels = [
    { id: "channel-weishi", name: "微视中国", type: "platform", authority: "platform_admin", level: 100, roleLabel: "平台渠道 · 最高权限" },
    { id: "channel-culture", name: "国风文旅", type: "customer", authority: "tenant_admin", level: 10, parentId: "channel-weishi", roleLabel: "客户渠道" },
  ];
  const rooms = {
    "106176": { robotId: "DT-LIVE-001", robotName: "星栖", channelId: "channel-weishi" },
    "106188": { robotId: "DT-LIVE-002", robotName: "知鹤", channelId: "channel-weishi" },
    "106203": { robotId: "DT-LIVE-003", robotName: "小暖", channelId: "channel-weishi" },
    "206176": { robotId: "GFWL-001", robotName: "绛央", channelId: "channel-culture" },
    "206188": { robotId: "GFWL-002", robotName: "青禾", channelId: "channel-culture" },
  };
  const highRiskFaults = new Set(["电机异常", "系统异常"]);

  function hoursAgo(hours) {
    return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  }

  function seedRecordings() {
    return [
      recording("REC-106176-01", "106176", 2, "00:32:18"),
      recording("REC-106176-02", "106176", 9, "00:28:44"),
      recording("REC-106176-03", "106176", 29, "00:41:03"),
      recording("REC-106188-01", "106188", 3, "00:24:10"),
      recording("REC-106188-02", "106188", 18, "00:36:52"),
      recording("REC-106203-01", "106203", 31, "00:19:35"),
      recording("REC-206176-01", "206176", 6, "00:27:09"),
      recording("REC-206188-01", "206188", 4, "00:34:12"),
      recording("REC-206188-02", "206188", 21, "00:25:47"),
    ];
  }

  function recording(id, roomId, ageHours, duration) {
    const room = rooms[roomId];
    return {
      id,
      roomId,
      robotId: room.robotId,
      channelId: room.channelId,
      name: `${room.robotName}-${new Date(Date.now() - ageHours * 3600000).toLocaleString("zh-CN", { hour12: false }).replaceAll("/", "-").replaceAll(":", "")}.mp4`,
      startAt: hoursAgo(ageHours),
      duration,
      source: "auto",
      available: true,
    };
  }

  function initialState() {
    return {
      version: 1,
      currentChannelId: "channel-weishi",
      recordings: seedRecordings(),
      videoStates: Object.fromEntries(
        Object.keys(rooms).map((roomId) => [roomId, { mode: "live", recordingId: "", faultType: "", recovering: false }]),
      ),
      alerts: [],
      logs: [],
    };
  }

  function load() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(storageKey) || "null");
      if (parsed?.version === 1) return parsed;
    } catch (error) {
      console.warn("phase2 state restore failed", error);
    }
    return initialState();
  }

  let state = load();

  function save() {
    global.localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function refresh(message) {
    save();
    if (message && typeof global.toast === "function") global.toast(message);
    if (typeof global.renderApp === "function") global.renderApp();
  }

  function currentChannel() {
    return channels.find((item) => item.id === state.currentChannelId) || channels[0];
  }

  function isPlatformChannel() {
    return currentChannel().type === "platform";
  }

  function canManageChannel(channelId) {
    return isPlatformChannel() || state.currentChannelId === channelId;
  }

  function setChannel(channelId) {
    if (!channels.some((item) => item.id === channelId)) return;
    state.currentChannelId = channelId;
    document.getElementById("modalRoot")?.replaceChildren();
    if (typeof global.onPhase2ChannelChanged === "function") global.onPhase2ChannelChanged(channelId);
    refresh(`已切换到${currentChannel().name}`);
  }

  function roomInfo(roomId) {
    return rooms[roomId] || rooms["106176"];
  }

  function roomForRobot(robotId) {
    const entry = Object.entries(rooms).find(([, room]) => room.robotId === robotId);
    return entry ? { id: entry[0], ...entry[1] } : null;
  }

  function videoState(roomId) {
    if (!state.videoStates[roomId]) state.videoStates[roomId] = { mode: "live", recordingId: "", faultType: "", recovering: false };
    return state.videoStates[roomId];
  }

  function recordingsFor(roomId) {
    const channelId = roomInfo(roomId).channelId;
    const cutoff = Date.now() - 72 * 3600000;
    return state.recordings
      .filter((item) => item.roomId === roomId && item.channelId === channelId)
      .filter((item) => new Date(item.startAt).getTime() >= cutoff)
      .sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
  }

  function recordingById(id) {
    return state.recordings.find((item) => item.id === id);
  }

  function isRecent24(recordingItem) {
    return Date.now() - new Date(recordingItem.startAt).getTime() <= 24 * 3600000;
  }

  function addAlert(roomId, type, message, severity = "高") {
    const room = roomInfo(roomId);
    const alert = {
      id: `P2-ALT-${Date.now()}`,
      roomId,
      robotId: room.robotId,
      channelId: room.channelId,
      type,
      severity,
      message,
      at: new Date().toISOString(),
      resolved: false,
    };
    state.alerts.unshift(alert);
    return alert;
  }

  function addLog(roomId, action, detail, operator = "系统") {
    const room = roomInfo(roomId);
    state.logs.unshift({
      id: `P2-LOG-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      roomId,
      robotId: room.robotId,
      channelId: room.channelId,
      action,
      detail,
      operator,
      at: new Date().toISOString(),
    });
    state.logs = state.logs.slice(0, 100);
  }

  function switchToRecording(roomId, recordingId, automatic = false) {
    const item = recordingById(recordingId);
    if (!item || item.roomId !== roomId || !item.available) {
      addAlert(roomId, "录播切换失败", "选择的录屏不可用，当前仍保持实时画面", "中");
      refresh("录屏不可用，未切换画面");
      return false;
    }
    const target = videoState(roomId);
    target.mode = automatic ? "recorded_auto" : "recorded_manual";
    target.recordingId = recordingId;
    target.recovering = false;
    addLog(roomId, automatic ? "自动切换录播" : "人工切换录播", `已切换至 ${item.name}`, automatic ? "系统" : "运营人员");
    refresh(automatic ? "故障触发，已自动切换录播画面" : "已切换为录播画面");
    return true;
  }

  function switchToLive(roomId, operator = "运营人员") {
    const target = videoState(roomId);
    target.mode = "live";
    target.recordingId = "";
    target.faultType = "";
    target.recovering = false;
    state.alerts.forEach((item) => {
      if (item.roomId === roomId && !item.resolved) item.resolved = true;
    });
    addLog(roomId, "恢复实时画面", "已切回实时直播画面", operator);
    refresh("已恢复实时画面");
  }

  function triggerFault(roomId, type) {
    const target = videoState(roomId);
    const room = roomInfo(roomId);
    target.faultType = type;
    target.recovering = false;
    addAlert(roomId, type, `机器人 ${room.robotId} 触发${type}`, highRiskFaults.has(type) ? "严重" : "高");
    addAlert(roomId, "录播切换通知", `故障触发后开始检查 ${room.robotId} 最近24小时录屏`, "中");
    addLog(roomId, "触发故障", `${type}告警已推送`);
    const recent = recordingsFor(roomId).filter((item) => item.available && isRecent24(item));
    if (!recent.length) {
      addAlert(roomId, "录播切换失败", "最近24小时无可用录屏，当前仍保持实时画面", "高");
      addLog(roomId, "自动切换失败", "最近24小时无可用录屏");
      refresh("故障已告警，但最近24小时无可用录屏");
      return false;
    }
    return switchToRecording(roomId, recent[0].id, true);
  }

  function recoverFault(roomId) {
    const target = videoState(roomId);
    if (!target.faultType) return;
    if (highRiskFaults.has(target.faultType)) {
      target.mode = "recovering";
      target.recovering = true;
      addLog(roomId, "恢复检测中", `${target.faultType}已恢复，等待人工确认`);
      refresh("高风险故障已恢复，请人工确认切回实时画面");
      return;
    }
    addLog(roomId, "自检通过", `${target.faultType}恢复正常，自动切回实时画面`);
    switchToLive(roomId, "系统");
  }

  function confirmRecovery(roomId) {
    const target = videoState(roomId);
    if (!target.recovering) return;
    switchToLive(roomId, "运营人员");
  }

  function uploadRecording(roomId, fileName, objectUrl = "") {
    if (!fileName) return null;
    const room = roomInfo(roomId);
    const item = {
      id: `UPLOAD-${Date.now()}`,
      roomId,
      robotId: room.robotId,
      channelId: room.channelId,
      name: fileName,
      startAt: new Date().toISOString(),
      duration: "本地文件",
      source: "upload",
      objectUrl,
      available: true,
    };
    state.recordings.unshift(item);
    addLog(roomId, "上传录屏", `已选择本地文件 ${fileName}`, "运营人员");
    refresh("本地录屏已加入选择列表");
    return item;
  }

  function reset() {
    if (typeof global.resetPhase2BusinessData === "function") global.resetPhase2BusinessData();
    state = initialState();
    refresh("二期演示数据已重置");
  }

  function snapshot() {
    return state;
  }

  global.phase2State = {
    channels,
    rooms,
    snapshot,
    currentChannel,
    isPlatformChannel,
    canManageChannel,
    setChannel,
    roomInfo,
    roomForRobot,
    videoState,
    recordingsFor,
    recordingById,
    isRecent24,
    switchToRecording,
    switchToLive,
    triggerFault,
    recoverFault,
    confirmRecovery,
    uploadRecording,
    reset,
  };
})(window);
