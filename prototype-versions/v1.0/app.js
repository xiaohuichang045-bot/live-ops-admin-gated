const pages = [
  { key: "changelog", label: "更新日志" },
  { key: "products", label: "虚拟直播商品" },
  { key: "rooms", label: "管理直播间" },
  { key: "flow", label: "脚本管理" },
  { key: "maps", label: "展览地图管理" },
  { key: "robots", label: "机器人管理" },
  { key: "skills", label: "技能管理" },
  { key: "shows", label: "表演管理" },
];

let activePage = initialPageKey();
let visitedTabs = [activePage];
let skillKeywords = ["发货", "讲解戒指"];
let skillEventTriggers = [];
let perfUnits = [];
let scriptFlowView = initialFlowView();
let selectedScriptId = "SCRIPT-001";
let selectedAnchorType = "commerce";
let selectedStageId = "commerce-04";
let selectedRoomRoleValue = "RBT008-导购讲解-柳如春";
let selectedRoomScriptId = "";
let draggingStageIndex = null;
let draggingShowIndex = null;
let draggingRobotResource = null;
let scriptProductModalSelection = [];
let scriptProductFilters = { shop: "全部店铺", status: "全部状态", binding: "全部" };
let selectedShowIdsInPicker = [];
let stageShowPickerFilters = { keyword: "", owner: "全部归属" };
let batchRobotPreview = null;
let batchRobotResult = null;
let robotEditorTab = "role";
let selectedRobotId = "142";
let selectedMapId = "MAP-B2";
let draggingIdleShowIndex = null;
let draggingPerfUnitIndex = null;
let handoffMode = initialHandoffMode();
const handoffTimestamp = "2026-06-01 00:00";
const handoffAnnotationProjectUrl = "handoff-annotations.json";
const handoffAnnotationStorageKey = "liveAdminV1HandoffAnnotations";
const handoffAnnotationProjectCacheKey = "liveAdminV1HandoffProjectAnnotations";
const handoffPanelPositionStorageKey = "liveAdminV1HandoffPanelPosition";
let handoffProjectAnnotations = initialHandoffProjectAnnotations();
let handoffLocalAnnotations = initialHandoffAnnotations();
let handoffAnnotations = mergeHandoffAnnotationSources();
const handoffAnnotationDefaults = {};
let handoffPlacementMode = false;
let handoffPlacementScope = "auto";
let handoffFloatingPanelPosition = initialHandoffPanelPosition();
let handoffFloatingPanelDrag = null;
let activeHandoffKey = "";
let handoffVisibleAnnotations = [];
let handoffSummaryCapturePage = "";
const handoffPageSummaryCache = {};
const featureListStorageKey = "liveAdminV1FeatureListRows";
let featureListRows = initialFeatureListRows();
let featureListFilters = { keyword: "", client: "全部端", module1: "全部模块", phase: "全部阶段", priority: "全部优先级" };

const executionLogicOptions = [
  ["loop-count", "顺序执行"],
  ["random", "随机执行"],
  ["loop-duration", "顺序执行指定时长"],
];
const loopDurationMinuteOptions = [1, 3, 5, 10, 15, 30, 60];
const languageOptions = ["中文", "日语", "德语", "韩语", "美式英语", "阿拉伯语", "俄语", "意大利语", "法语", "英式英语"];

const robots = [
  { id: "RBT002", mode: "导览", name: "东哥外卖", status: "正常", voice: "轻松的向导（普通话）", model: "百炼", version: "AGV机器人", year: "2026", scripts: 1, keywords: 1, executableScriptId: "SCRIPT-005", avatar: "东", avatarClass: "avatar-a", skillIds: [18, "U-SKILL-01", 47, 49], showIds: [133, "U-SHOW-02", 134, 121, 122, 123, 85], idleShowIds: [133, 121, 133], idleInterval: "00:00:30" },
  { id: "142", mode: "直播", name: "小暖", status: "异常", voice: "傲慢的小姐（傲慢）", model: "百炼", version: "R版-机器头", year: "2026", scripts: 1, keywords: 1, executableScriptId: "SCRIPT-001", avatar: "暖", avatarClass: "avatar-b", skillIds: [18, "U-SKILL-02"], showIds: [141, "U-SHOW-01", 140, 139], idleShowIds: [141], idleInterval: "00:01:00" },
  { id: "140", mode: "表演", name: "小兰", status: "异常", voice: "傲慢的小姐（傲慢）", model: "百炼", version: "Z版-机器人", year: "2026", scripts: 1, keywords: 0, executableScriptId: "SCRIPT-004", avatar: "兰", avatarClass: "avatar-c", skillIds: [15], showIds: [134, 85], idleShowIds: [85], idleInterval: "00:00:45" },
  { id: "139", mode: "直播", name: "若琳-测试-阿哲", status: "异常", voice: "无拘无束的年轻男性（普通话）", model: "百炼", version: "R版-机器头", year: "2026", scripts: 0, keywords: 0, executableScriptId: "", avatar: "哲", avatarClass: "avatar-d", skillIds: [], showIds: [], idleShowIds: [], idleInterval: "00:01:00" },
  { id: "138", mode: "表演", name: "鲁博士", status: "异常", voice: "富有戏剧性的说书人（普通话）", model: "百炼", version: "Z版-机器人", year: "2026", scripts: 1, keywords: 1, executableScriptId: "SCRIPT-002", avatar: "鲁", avatarClass: "avatar-a", skillIds: [74], showIds: [74, 141], idleShowIds: [141], idleInterval: "00:00:50" },
  { id: "137", mode: "直播", name: "关羽-测试4", status: "异常", voice: "富有抒情性的嗓音（普通话）", model: "百炼", version: "R版-机器头", year: "2026", scripts: 0, keywords: 0, executableScriptId: "", avatar: "羽", avatarClass: "avatar-c", skillIds: [], showIds: [133, 134], idleShowIds: [], idleInterval: "00:01:00" },
  { id: "136", mode: "直播", name: "关羽-测试3", status: "异常", voice: "富有抒情性的嗓音（普通话）", model: "百炼", version: "R版-机器头", year: "2026", scripts: 0, keywords: 0, executableScriptId: "", avatar: "关", avatarClass: "avatar-d", skillIds: [], showIds: [], idleShowIds: [], idleInterval: "00:01:00" },
  { id: "114", mode: "表演", name: "丽芬", status: "异常", voice: "傲慢的小姐（傲慢）", model: "百炼", version: "Z版-机器人", year: "2026", scripts: 0, keywords: 0, executableScriptId: "", avatar: "丽", avatarClass: "avatar-b", skillIds: [], showIds: [], idleShowIds: [], idleInterval: "00:01:00" },
  { id: "110", mode: "直播", name: "AI-萌宠", status: "异常", voice: "可爱的小精灵（普通话）", model: "百炼", version: "R版-机器头", year: "2026", scripts: 0, keywords: 0, executableScriptId: "", avatar: "萌", avatarClass: "avatar-a", skillIds: [], showIds: [], idleShowIds: [], idleInterval: "00:01:00" },
  { id: "109", mode: "表演", name: "关帝圣君", status: "异常", voice: "富有抒情性的嗓音（普通话）", model: "百炼", version: "Z版-机器人", year: "2026", scripts: 0, keywords: 0, executableScriptId: "", avatar: "帝", avatarClass: "avatar-c", skillIds: [], showIds: [], idleShowIds: [], idleInterval: "00:01:00" },
];

const robotVersionOptions = ["R版-机器头", "Z版-机器人", "AGV机器人"];

const robotBatchFieldGroups = [
  {
    group: "角色信息",
    fields: [
      { name: "机器人名称", required: true, unique: true, desc: "对应创建机器人页「角色设定」里的名称", sample: "云涵-导购机器人" },
      { name: "所属地区", desc: "机器人所属运营地区", options: ["华东", "华南", "华北"], sample: "华东" },
      { name: "出生年月", desc: "格式建议 YYYY-MM", sample: "2001-05" },
      { name: "学历", desc: "人设学历描述", sample: "本科" },
      { name: "星座", desc: "人设星座", sample: "双子座" },
      { name: "身高", desc: "人设身高，建议填写厘米", sample: "168" },
      { name: "体重", desc: "人设体重，建议填写公斤", sample: "50" },
      { name: "肤色", desc: "人设肤色", sample: "自然肤色" },
      { name: "爱好", desc: "多个爱好用英文逗号分隔", sample: "阅读,直播,穿搭" },
      { name: "功能", desc: "机器人能力说明", sample: "导购讲解、商品答疑、互动促单" },
    ],
  },
  {
    group: "提示词设定",
    fields: [
      { name: "职业模型预设", desc: "机器人职业、人设和职责提示词", sample: "你是一个专业的珠宝导购主播" },
      { name: "对话风格描述", desc: "机器人对话语气和互动特征", sample: "亲切、耐心、擅长解释参数" },
      { name: "机主信息描述", desc: "机器人需要了解的机主或品牌信息", sample: "品牌主打轻奢日常珠宝" },
    ],
  },
  {
    group: "头像素材",
    fields: [
      { name: "方形头像", required: true, desc: "填写图片 URL 或素材文件 ID", sample: "asset_avatar_yunhan" },
      { name: "竖图头像", desc: "填写图片 URL 或素材文件 ID", sample: "asset_portrait_yunhan" },
      { name: "直播间形象照", desc: "填写图片 URL 或素材文件 ID", sample: "asset_live_yunhan" },
    ],
  },
  {
    group: "语种配置",
    fields: [
      { name: "语种模式", required: true, desc: "单语种或多语种", options: ["单语种", "多语种"], sample: "单语种" },
      { name: "主语种", required: true, desc: "默认主语种", options: ["中文", "英文", "日语"], sample: "中文" },
      { name: "方言", desc: "单语种下可选方言", options: ["中文", "粤语", "四川话"], sample: "中文" },
      { name: "多语种列表", desc: "多语种模式下填写，多个语种用英文逗号分隔", sample: "" },
    ],
  },
  {
    group: "音色配置",
    fields: [
      { name: "选择音色", required: true, desc: "来自系统音色库", options: voiceOptions(), sample: "637-干练的播客主持人（普通话）" },
      { name: "情绪", desc: "默认自动", options: ["自动", "愤怒", "恐惧", "快乐", "中性", "悲伤", "惊讶"], sample: "自动" },
      { name: "语速", desc: "数字，默认 1", type: "number", sample: "1" },
      { name: "语调", desc: "数字，默认 1", type: "number", sample: "1" },
      { name: "音量", desc: "0-100，默认 100", type: "number", min: 0, max: 100, sample: "100" },
      { name: "测试文本", desc: "用于合成试听", sample: "欢迎来到直播间" },
    ],
  },
  {
    group: "大模型配置",
    fields: [
      { name: "大模型厂商", required: true, desc: "选择模型服务商", options: ["百炼", "豆包", "天翼"], sample: "百炼" },
      { name: "绑定智能体", desc: "大模型厂商为百炼时必填", options: agentOptions(), sample: "RAG109 四位一体" },
    ],
  },
  {
    group: "硬件信息",
    fields: [
      { name: "机器人型号", required: true, desc: "来自机器人型号配置", options: robotVersionOptions, sample: "R版-机器头" },
      { name: "机器人版本", required: true, desc: "来自机器人版本配置", options: robotVersionOptions, sample: "R版-机器头" },
      { name: "机器人年份", required: true, desc: "根据创建年份自动获取", options: ["2026"], sample: "2026" },
      { name: "机器人编码", required: true, unique: true, desc: "对应设备管理里的机器人编码，全局唯一", sample: "RBT200" },
      { name: "场景类型", required: true, desc: "聊天或电商", options: ["聊天", "电商"], sample: "电商" },
      { name: "应用场景", desc: "当前 MVP 四类场景", options: ["情感陪伴", "语音娱乐", "企业服务", "导购"], sample: "导购" },
    ],
  },
  {
    group: "护照信息",
    fields: [
      { name: "护照编号", desc: "选填", sample: "P-RBT200" },
      { name: "护照有效期", desc: "格式建议 YYYY-MM-DD", sample: "2027-12-31" },
    ],
  },
  {
    group: "售卖与租赁",
    fields: [
      { name: "领养状态", desc: "开启或关闭", options: ["开启", "关闭"], sample: "关闭" },
      { name: "领养价格", required: true, desc: "金额，单位元", type: "number", min: 0, sample: "9999" },
      { name: "领养定金", required: true, desc: "金额，单位元", type: "number", min: 0, sample: "999" },
      { name: "租赁状态", desc: "开启或关闭", options: ["开启", "关闭"], sample: "开启" },
      { name: "租赁价格", desc: "金额，单位元/天", type: "number", min: 0, sample: "299" },
      { name: "租赁押金", desc: "金额，单位元", type: "number", min: 0, sample: "1000" },
    ],
  },
  {
    group: "运行配置",
    fields: [
      { name: "开机时间", desc: "格式建议 HH:mm", sample: "09:00" },
      { name: "关机时间", desc: "格式建议 HH:mm", sample: "22:00" },
    ],
  },
  {
    group: "交互配置",
    fields: [
      { name: "交互模式", required: true, desc: "机器人当前交互方式", options: ["直播模式", "对话模式", "按钮模式"], sample: "直播模式" },
      { name: "轮播话术", desc: "开启或关闭", options: ["开启", "关闭"], sample: "开启" },
      { name: "话术间隔", required: true, desc: "轮播话术间隔，单位秒", type: "number", min: 1, sample: "200" },
      { name: "唤醒词", desc: "多个词用英文逗号分隔", sample: "小央小央,星辰星辰" },
      { name: "灵敏度", desc: "低、中、高", options: ["低", "中", "高"], sample: "中" },
      { name: "唤醒垫词", desc: "多个词用英文逗号分隔", sample: "hello,hi,hey" },
      { name: "回答垫词", desc: "多个词用英文逗号分隔", sample: "ok,好的,明白了" },
    ],
  },
  {
    group: "动作配置",
    fields: [
      { name: "闲时动作", desc: "来自动作库", options: ["挥手", "点头", "站姿待机"], sample: "挥手" },
      { name: "讲话时动作", desc: "来自动作库", options: ["轻微点头", "挥舞左手", "抬起右手"], sample: "轻微点头" },
    ],
  },
];

const roles = [
  { value: "RBT002-东哥外卖", id: "RBT002", account: "11484402", name: "东哥外卖", scene: "B2艺术馆导览", templateName: "导览模板", version: "AGV机器人", cover: "东", avatarClass: "avatar-a" },
  { value: "RBT005-娱乐艺术-云涵", id: "RBT005", account: "11485812", name: "云涵", scene: "娱乐艺术-云涵", templateName: "才艺主播模板", version: "Z版-机器人", cover: "云", avatarClass: "avatar-b" },
  { value: "RBT008-导购讲解-柳如春", id: "RBT008", account: "11486173", name: "柳如春", scene: "导购讲解-柳如春", templateName: "带货主播模板", version: "R版-机器头", cover: "柳", avatarClass: "avatar-c" },
  { value: "RBT003 智能体应用-测", id: "RBT003", account: "11485202", name: "智能体应用-测", scene: "智能体应用测试", templateName: "聊天主播模板", version: "R版-机器头", cover: "测", avatarClass: "avatar-d" },
];

const exhibitionMaps = [
  {
    id: "MAP-B2",
    venueName: "B2艺术馆机器人展厅",
    exhibitionName: "Deep Touch 未来已来 人形机器人展",
    mapName: "B2艺术馆",
    boundRobotId: "RBT002",
    enabled: true,
    points: ["AGV_HOME", "AGV_P1", "AGV_P2", "AGV_P3"],
    exhibits: [
      { id: 1, image: "人", name: "IMG_4348", desc: "", script: "", point: "AGV_P1" },
      { id: 2, image: "形", name: "IMG_4349", desc: "", script: "", point: "AGV_P2" },
      { id: 3, image: "未", name: "IMG_4336", desc: "", script: "", point: "AGV_P3" },
      { id: 4, image: "来", name: "IMG_4337", desc: "", script: "", point: "" },
      { id: 5, image: "展", name: "IMG_4352", desc: "", script: "", point: "" },
    ],
  },
];

const products = [
  { id: "516754", shop: "观野", title: "精致轻奢珠宝首饰 日常通勤气质配饰送礼佳品", category: "珠宝首饰>钻戒", price: "999.00", slash: "0.00", stock: 50, status: "已上架", image: "戒", imageClass: "product-a", video: false, copy: "直播间的姐妹们，把目光锁定在这个戒指上，这就是..." },
  { id: "516749", shop: "青绣优选", title: "催眠纤体及督导服务", category: "其它>从心瘦课程", price: "699.00", slash: "1299.00", stock: 995, status: "未上架", image: "课", imageClass: "product-b", video: false, copy: "暂无文案" },
  { id: "516605", shop: "轻蝉官方旗舰店", title: "洗发水清爽控油顺滑蓬松持久保湿香氛祛屑舒缓滋养", category: "个护>护理精华", price: "138.00", slash: "0.00", stock: 50, status: "已上架", image: "洗", imageClass: "product-c", video: true, copy: "各位直播间的朋友们，今天给大家介绍一款超棒的洗..." },
  { id: "516604", shop: "轻蝉官方旗舰店", title: "沐浴露去痘沐浴露不紧绷水杨酸净肤舒爽持久留香", category: "个护>护理精华", price: "128.00", slash: "0.00", stock: 50, status: "已上架", image: "沐", imageClass: "product-b", video: true, copy: "给大家介绍一款超好用的沐浴露，一起焕新净肤..." },
  { id: "516603", shop: "轻蝉官方旗舰店", title: "足霜嫩足霜尿素脚部干裂VE足霜手足皲裂膏脚跟干裂", category: "个护>护理精华", price: "118.00", slash: "0.00", stock: 50, status: "已上架", image: "足", imageClass: "product-d", video: false, copy: "各位观众朋友们，今天给大家介绍一款超好用的足霜..." },
  { id: "516602", shop: "轻蝉官方旗舰店", title: "轻蝉烟酰胺身体乳润体乳香水身体乳薄款香氛水润亮肤多效润泽柔亮", category: "个护>护理精华", price: "139.00", slash: "0.00", stock: 50, status: "已上架", image: "乳", imageClass: "product-c", video: true, copy: "直播间的朋友们，今天给大家介绍一款超好用的轻蝉..." },
  { id: "516590", shop: "云家电旗舰店", title: "一级能效空气循环扇 静音送风智能遥控家用款", category: "家电>空气循环扇", price: "329.00", slash: "499.00", stock: 120, status: "已上架", image: "扇", imageClass: "product-a", video: true, copy: "这款循环扇主打安静、省电和大角度送风..." },
  { id: "516588", shop: "旧品测试店", title: "旧款料理机测试商品 已删除不可继续绑定", category: "家电>厨房电器", price: "199.00", slash: "299.00", stock: 0, status: "已删除", image: "旧", imageClass: "product-d", video: false, copy: "历史商品，仅用于展示异常绑定状态。" },
];

const rooms = [
  { seq: 4, id: "106113", status: "直播中", start: "2026-05-25 00:00:00", end: "2026-06-24 00:00:00", type: "机器人", account: "RBT008", roomId: "11486173", role: "柳如春", cover: "柳", avatarClass: "avatar-b", live: true },
  { seq: 5, id: "106112", status: "直播中", start: "2026-05-25 00:00:00", end: "2026-06-24 00:00:00", type: "机器人", account: "RBT005", roomId: "11485812", role: "云涵", cover: "云", avatarClass: "avatar-a", live: true },
  { seq: 8, id: "106094", status: "已结束", start: "2026-04-21 00:00:00", end: "2026-05-20 00:00:00", type: "机器人", account: "RBT005", roomId: "11485812", role: "云涵", cover: "云", avatarClass: "avatar-a", live: false },
  { seq: 9, id: "106093", status: "已结束", start: "2026-04-21 00:00:00", end: "2026-05-20 00:00:00", type: "机器人", account: "RBT008", roomId: "11486173", role: "柳如春", cover: "柳", avatarClass: "avatar-b", live: false },
  { seq: 10, id: "106080", status: "已结束", start: "2026-04-08 00:00:00", end: "2026-04-21 10:45:20", type: "机器人", account: "RBT008", roomId: "11486173", role: "柳如春", cover: "柳", avatarClass: "avatar-b", live: false },
];

const anchorTemplates = [
  {
    id: "chat",
    name: "聊天主播",
    goal: "陪伴、互动、停留",
    templateName: "聊天主播模板",
    stages: ["开场欢迎", "粉丝互动", "直播主题介绍", "话题引入", "话题展开", "弹幕互动", "观点回应", "自由聊天", "感谢互动", "冷场自播", "下播总结"],
    stageTypes: ["开场", "互动", "主题介绍", "话题引入", "话题展开", "互动", "回应", "聊天", "互动", "自播", "收尾"],
  },
  {
    id: "talent",
    name: "才艺主播",
    goal: "表演、点播、礼物、氛围",
    templateName: "才艺主播模板",
    stages: ["开场欢迎", "粉丝互动", "节目预告", "才艺预告", "才艺表演", "弹幕互动", "感谢互动", "点歌 / 点节目", "冷场自播", "下播总结"],
    stageTypes: ["开场", "互动", "预告", "才艺预告", "才艺", "互动", "礼物反馈", "点播", "自播", "收尾"],
  },
  {
    id: "commerce",
    name: "带货主播",
    goal: "商品讲解、商品答疑承接、转化",
    templateName: "带货主播模板",
    stages: ["开场欢迎", "粉丝互动", "商品总览", "商品讲解", "商品答疑", "转化引导", "商品切换 / 下一品", "全场优惠提醒", "冷场自播", "下播总结"],
    stageTypes: ["开场", "互动", "商品总览", "商品讲解", "商品答疑", "转化", "商品切换", "优惠提醒", "自播", "收尾"],
    active: true,
  },
];

const stageOrders = {
  chat: buildTemplateStages("chat", ["3m", "5m", "8m"]),
  talent: buildTemplateStages("talent", ["3m", "5m", "10m"]),
  commerce: buildScriptStages("commerce", [
    ["开场欢迎", "普通流程", "流程优先", "已配置"],
    ["粉丝互动", "真人互动", "互动优先", "已配置"],
    ["商品总览", "普通流程", "流程优先", "已配置"],
    ["商品讲解", "普通流程", "流程优先", "编辑中", [141, 140, 139, 138]],
    ["商品答疑", "真人互动", "互动优先", "已配置", []],
    ["转化引导", "普通流程", "流程优先", "已配置", []],
    ["商品切换 / 下一品", "普通流程", "流程优先", "已配置", []],
    ["全场优惠提醒", "普通流程", "流程优先", "已配置"],
    ["冷场自播", "普通流程", "互动优先", "已配置"],
    ["下播总结", "普通流程", "流程优先", "已配置"],
  ]),
  tour: buildScriptStages("tour", [
    ["AGV_开场欢迎", "普通流程", "流程优先", "已配置", [85]],
    ["AGV_导览路线说明", "普通流程", "流程优先", "已配置", [121]],
    ["AGV_安全秩序提醒", "普通流程", "流程优先", "已配置"],
    ["AGV_前往点位一", "普通流程", "流程优先", "编辑中", [], "AGV_P1", "移动中执行"],
    ["AGV_点位一讲解", "普通流程", "流程优先", "已配置", [85], "AGV_P1", "到达后执行"],
    ["AGV_点位二讲解", "普通流程", "流程优先", "已配置", [121], "AGV_P2", "到达后执行"],
    ["AGV_点位三讲解", "普通流程", "流程优先", "已配置", [122], "AGV_P3", "到达后执行"],
    ["AGV_自由问答", "真人互动", "互动优先", "已配置", [], "", "到达后执行"],
    ["AGV_导览总结", "普通流程", "流程优先", "已配置", [123], "AGV_HOME", "到达后执行"],
  ]),
  drama: buildScriptStages("drama", [
    ["开场准备", "等待", "流程优先", "已配置"],
    ["开场亮相", "普通流程", "流程优先", "已配置", [133]],
    ["剧情铺垫", "普通流程", "流程优先", "已配置"],
    ["等待衔接", "等待", "流程优先", "编辑中"],
    ["角色表演", "普通流程", "流程优先", "已配置", [134]],
    ["等待衔接", "等待", "流程优先", "已配置"],
    ["情节推进", "普通流程", "流程优先", "已配置"],
    ["高潮段落", "普通流程", "流程优先", "已配置"],
    ["线下互动", "真人互动", "互动优先", "已配置"],
    ["结尾收束", "普通流程", "流程优先", "已配置"],
    ["谢幕退场", "普通流程", "流程优先", "已配置"],
  ]),
  activity: buildScriptStages("activity", [
    ["欢迎到场", "普通流程", "流程优先", "已配置", [133]],
    ["活动介绍", "普通流程", "流程优先", "已配置"],
    ["品牌 / 主题介绍", "普通流程", "流程优先", "已配置"],
    ["核心环节说明", "普通流程", "流程优先", "编辑中"],
    ["现场互动", "真人互动", "互动优先", "已配置"],
    ["活动收尾", "普通流程", "流程优先", "已配置"],
  ]),
};

const performanceUnits = [
  { name: "卖点介绍01", script: "这款产品主打节能静音，适合家庭日常使用，低噪运行……", action: "点头", expression: "微笑", endBy: "话术播完", interruptible: true },
  { name: "参数说明02", script: "这款产品的功率是2200W，能效等级一级，容量是……", action: "抬手", expression: "认真", endBy: "话术播完", interruptible: true },
  { name: "场景说明03", script: "放在客厅、卧室都很合适，尤其适合小户型家庭……", action: "挥手", expression: "微笑", endBy: "话术播完", interruptible: true },
  { name: "购买引导04", script: "现在下单还有平台补贴和赠品，点击下方小黄车……", action: "抬手", expression: "微笑", endBy: "话术播完", interruptible: true },
];

const skills = [
  { id: 18, name: "巍峨馆一欢迎语", category: "表演", owner: "公共模板", trigger: "欢迎大家, 欢迎", result: "关羽-巍峨馆一欢迎语", status: true, created: "2026-02-05 19:39:01" },
  { id: 47, name: "AGV_P4", category: "动作", owner: "公共模板", trigger: "点位4", result: "AGV_MOVE_p4", status: true, created: "2026-04-21 14:09:57" },
  { id: 49, name: "AGV_P1", category: "动作", owner: "公共模板", trigger: "点位1", result: "AGV_MOVE_p1", status: true, created: "2026-04-21 15:15:53" },
  { id: 52, name: "AGV_HOME", category: "动作", owner: "公共模板", trigger: "复位, 充电", result: "AGV_MOVE_HOME", status: true, created: "2026-04-21 19:41:48" },
  { id: 78, name: "发货回复", category: "表演", owner: "公共模板", trigger: "发货", result: "发货回复", status: true, created: "2026-05-26 14:25:25" },
  { id: 77, name: "讲解戒指1", category: "表演", owner: "公共模板", trigger: "讲解戒指1", result: "戒指1", status: true, created: "2026-05-26 14:01:44" },
  { id: 76, name: "迎宾5", category: "表演", owner: "公共模板", trigger: "迎宾5", result: "关羽-迎宾5", status: true, created: "2026-05-18 14:02:19" },
  { id: 75, name: "迎宾4", category: "表演", owner: "公共模板", trigger: "迎宾4", result: "关羽-迎宾4", status: true, created: "2026-05-18 14:02:06" },
  { id: 74, name: "四位一体讲解", category: "表演", owner: "公共模板", trigger: "四位一体", result: "四位一体讲解", status: true, created: "2026-05-13 14:18:20" },
  { id: 73, name: "大屏PPT⑦", category: "表演", owner: "公共模板", trigger: "大屏PPT⑦", result: "大屏PPT⑦", status: true, created: "2026-05-12 16:22:05" },
];

const shows = [
  { id: 133, name: "关羽-迎宾4", owner: "公共模板", units: 1, status: true, created: "2026-05-18 14:00:44" },
  { id: 121, name: "关羽-迎宾1", owner: "公共模板", units: 1, status: true, created: "2026-05-09 21:14:42" },
  { id: 122, name: "关羽-迎宾2", owner: "公共模板", units: 1, status: true, created: "2026-05-09 21:15:42" },
  { id: 123, name: "关羽-迎宾3", owner: "公共模板", units: 1, status: true, created: "2026-05-09 21:16:10" },
  { id: 85, name: "关羽-巍峨馆一欢迎语", owner: "公共模板", units: 1, status: true, created: "2026-02-06 17:44:48" },
  { id: 141, name: "发货回复", owner: "公共模板", units: 1, status: true, created: "2026-05-26 14:27:18" },
  { id: 140, name: "戒指1", owner: "公共模板", units: 1, status: true, created: "2026-05-26 14:00:50" },
  { id: 139, name: "2026526小暖直播第1场片段5 -结尾・情绪收束+下播预告", owner: "公共模板", units: 6, status: true, created: "2026-05-26 10:51:42" },
  { id: 138, name: "2026526小暖直播第1场片段4 -实用建议+互动引导", owner: "公共模板", units: 5, status: true, created: "2026-05-26 10:45:54" },
  { id: 137, name: "2026526小暖直播第1场片段3 -深度共情+温柔金句", owner: "公共模板", units: 3, status: true, created: "2026-05-26 10:43:22" },
  { id: 136, name: "2026526小暖直播第1场片段2-话题引入・共情痛点", owner: "公共模板", units: 3, status: true, created: "2026-05-26 10:39:23" },
  { id: 135, name: "2026526小暖直播第1场片段1-直播-开场", owner: "公共模板", units: 5, status: true, created: "2026-05-25 18:04:41" },
  { id: 134, name: "关羽-迎宾5", owner: "公共模板", units: 1, status: true, created: "2026-05-18 14:01:24" },
];

const userRobotShows = [
  { id: "U-SHOW-01", name: "柳如春-专属欢迎语", owner: "用户模板", units: 2, created: "2026-05-29 10:12:00" },
  { id: "U-SHOW-02", name: "B2展厅-点位讲解补充", owner: "用户模板", units: 3, created: "2026-05-29 10:18:00" },
];

const userRobotSkills = [
  { id: "U-SKILL-01", name: "B2展厅问路回复", category: "表演", owner: "用户模板", trigger: "怎么走, 去哪里", created: "2026-05-29 10:22:00" },
  { id: "U-SKILL-02", name: "导览暂停确认", category: "动作", owner: "用户模板", trigger: "暂停, 等一下", created: "2026-05-29 10:25:00" },
];

const scriptFlowScripts = [
  { id: "SCRIPT-001", name: "618家电专场带货脚本", type: "直播", anchorType: "commerce", templateName: "带货主播模板", robotId: "RBT008", robotName: "柳如春", duration: 60, offAirNotice: 5, stageCount: 8, showCount: 4, status: "已发布", isTemplate: false, updated: "2026-05-27 14:18" },
  { id: "SCRIPT-002", name: "云涵才艺点播直播脚本", type: "直播", anchorType: "talent", templateName: "才艺主播模板", robotId: "RBT005", robotName: "云涵", duration: 45, offAirNotice: 3, stageCount: 10, showCount: 5, status: "已发布", isTemplate: false, updated: "2026-05-26 18:30" },
  { id: "SCRIPT-003", name: "小暖陪伴活动脚本", type: "活动", anchorType: "chat", templateName: "活动模板", robotId: "RBT003", robotName: "智能体应用-测", duration: 40, offAirNotice: 5, stageCount: 6, showCount: 3, status: "草稿", isTemplate: false, updated: "2026-05-25 21:05" },
  { id: "SCRIPT-004", name: "云涵节日暖场剧目脚本", type: "剧目", anchorType: "talent", templateName: "剧目模板", robotId: "RBT005", robotName: "云涵", duration: 30, offAirNotice: 3, stageCount: 11, showCount: 6, status: "已发布", isTemplate: false, updated: "2026-05-25 19:20" },
  { id: "SCRIPT-005", name: "B2艺术馆导览脚本", type: "导览", anchorType: "tour", templateName: "导览模板", robotId: "RBT002", robotName: "东哥外卖", mapId: "MAP-B2", duration: 50, offAirNotice: 3, stageCount: 9, showCount: 5, status: "已发布", isTemplate: false, updated: "2026-05-29 10:32" },
];

const scriptProductBindings = {
  "SCRIPT-001": {
    scriptProductIds: ["516754", "516749", "516605", "516604", "516603", "516602"],
    primaryProductId: "516754",
    productOrder: ["516754", "516605", "516604", "516603", "516602", "516749"],
    stageProductBindings: {
      "commerce-02": ["516754", "516749", "516605", "516604", "516603", "516602"],
      "commerce-03": ["516754"],
      "commerce-04": ["516754", "516605", "516604", "516602"],
      "commerce-05": ["516754", "516605"],
      "commerce-06": ["516605"],
    },
  },
  "SCRIPT-002": {
    scriptProductIds: [],
    primaryProductId: "",
    productOrder: [],
    stageProductBindings: {},
  },
  "SCRIPT-003": {
    scriptProductIds: [],
    primaryProductId: "",
    productOrder: [],
    stageProductBindings: {},
  },
};

function renderApp() {
  document.body.classList.toggle("handoff-enabled", handoffMode);
  document.getElementById("app").classList.toggle("handoff-enabled", handoffMode);
  const handoffToggle = document.getElementById("handoffToggle");
  if (handoffToggle) {
    handoffToggle.classList.toggle("active", handoffMode);
    handoffToggle.textContent = handoffMode ? "隐藏标注" : "交付标注";
  }
  renderSideNav();
  renderTabs();
  document.getElementById("breadcrumbPage").textContent = currentPage().label;
  const content = document.getElementById("content");
  const renderers = pageRenderers();
  content.innerHTML = `${renderHandoffManagerBar()}${renderers[activePage]()}`;
  mountPlacedHandoffAnnotations();
  syncBusinessModalHandoffToggle();
}

function pageRenderers() {
  return {
    changelog: renderChangelogPage,
    products: renderProductPage,
    rooms: renderRoomPage,
    flow: renderScriptFlowPage,
    maps: renderMapPage,
    robots: renderRobotPage,
    skills: renderSkillPage,
    shows: renderShowPage,
  };
}

function currentPage() {
  return pages.find((page) => page.key === activePage) || pages[0];
}

function initialPageKey() {
  const hash = typeof window !== "undefined" && window.location ? window.location.hash.replace("#", "") : "";
  if (hash === "flow-edit") return "flow";
  return pages.some((page) => page.key === hash) ? hash : "robots";
}

function initialFlowView() {
  const hash = typeof window !== "undefined" && window.location ? window.location.hash.replace("#", "") : "";
  return hash === "flow-edit" ? "edit" : "list";
}

function initialHandoffMode() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search || "");
  if (params.has("handoff")) return params.get("handoff") === "1";
  return window.localStorage?.getItem("liveAdminV1HandoffMode") === "1";
}

function initialHandoffPanelPosition() {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage?.getItem(handoffPanelPositionStorageKey);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    const left = Number(parsed.left);
    const top = Number(parsed.top);
    if (Number.isFinite(left) && Number.isFinite(top)) return { left, top };
  } catch {
    window.localStorage?.removeItem(handoffPanelPositionStorageKey);
  }
  return null;
}

function saveHandoffPanelPosition() {
  if (typeof window === "undefined") return;
  if (!handoffFloatingPanelPosition) {
    window.localStorage?.removeItem(handoffPanelPositionStorageKey);
    return;
  }
  window.localStorage?.setItem(handoffPanelPositionStorageKey, JSON.stringify(handoffFloatingPanelPosition));
}

function toggleHandoffMode() {
  handoffMode = !handoffMode;
  if (!handoffMode) {
    activeHandoffKey = "";
    stopHandoffPlacement();
    closeHandoffModal();
  }
  if (typeof window !== "undefined") window.localStorage?.setItem("liveAdminV1HandoffMode", handoffMode ? "1" : "0");
  renderApp();
}

function initialHandoffAnnotations() {
  if (typeof window === "undefined") return {};
  try {
    const saved = window.localStorage?.getItem(handoffAnnotationStorageKey);
    if (saved) return parseHandoffAnnotationPayload(JSON.parse(saved));
  } catch {
    window.localStorage?.removeItem(handoffAnnotationStorageKey);
  }
  return {};
}

function initialHandoffProjectAnnotations() {
  if (typeof window === "undefined") return {};
  try {
    const saved = window.localStorage?.getItem(handoffAnnotationProjectCacheKey);
    if (saved) return parseHandoffAnnotationPayload(JSON.parse(saved));
  } catch {
    window.localStorage?.removeItem(handoffAnnotationProjectCacheKey);
  }
  return {};
}

function parseHandoffAnnotationPayload(payload) {
  if (!payload || typeof payload !== "object") return {};
  const annotationMap = payload.annotations && typeof payload.annotations === "object" ? payload.annotations : payload;
  return normalizeHandoffAnnotationMap(annotationMap);
}

function normalizeHandoffAnnotationMap(annotationMap) {
  const normalized = {};
  Object.entries(annotationMap || {}).forEach(([rawKey, item]) => {
    const key = cleanCell(rawKey);
    const annotation = normalizeHandoffAnnotationItem(item);
    if (key && annotation) normalized[key] = annotation;
  });
  return normalized;
}

function normalizeHandoffAnnotationItem(item) {
  if (!item || typeof item !== "object") return null;
  const title = cleanCell(item.title);
  const body = cleanCell(item.body);
  const deleted = Boolean(item.deleted);
  if (!title && !body && !deleted) return null;
  return {
    ...item,
    title,
    body,
    tone: ["new", "changed", "info"].includes(item.tone) ? item.tone : "new",
    custom: Boolean(item.custom),
    target: cleanCell(item.target),
    deleted,
    savedAt: cleanCell(item.savedAt) || formatLocalTimestamp(new Date()),
  };
}

function mergeHandoffAnnotationSources() {
  return {
    ...handoffProjectAnnotations,
    ...handoffLocalAnnotations,
  };
}

function refreshHandoffAnnotationsFromSources() {
  handoffAnnotations = mergeHandoffAnnotationSources();
}

function buildHandoffAnnotationsPayload(annotationMap = handoffAnnotations, source = "project-json") {
  return {
    version: 1,
    updatedAt: formatLocalTimestamp(new Date()),
    source,
    annotations: normalizeHandoffAnnotationMap(annotationMap),
  };
}

function saveHandoffProjectCache() {
  if (typeof window === "undefined") return;
  const keys = Object.keys(handoffProjectAnnotations);
  if (!keys.length) {
    window.localStorage?.removeItem(handoffAnnotationProjectCacheKey);
    return;
  }
  window.localStorage?.setItem(
    handoffAnnotationProjectCacheKey,
    JSON.stringify(buildHandoffAnnotationsPayload(handoffProjectAnnotations, "project-cache")),
  );
}

function handoffAnnotationKey(title, body) {
  return `${title}::${body}`.replace(/\s+/g, " ").trim();
}

function getHandoffAnnotation(title, body, tone = "new") {
  const key = handoffAnnotationKey(title, body);
  handoffAnnotationDefaults[key] = { title, body, tone, custom: false, savedAt: handoffTimestamp };
  const saved = handoffAnnotations[key];
  if (saved?.deleted) return null;
  return {
    key,
    title: saved?.title ?? title,
    body: saved?.body ?? body,
    tone: saved?.tone ?? tone,
    savedAt: saved?.savedAt ?? handoffTimestamp,
    custom: false,
  };
}

function customHandoffAnnotations() {
  return Object.entries(handoffAnnotations)
    .filter(([, item]) => item?.custom && !item.deleted)
    .map(([key, item]) => ({ key, ...item, custom: true }));
}

function customHandoffAnnotationsForTarget(target) {
  const targetPage = handoffTargetPage(target);
  return customHandoffAnnotations().filter((item) => {
    const itemTarget = cleanCell(item.target);
    if (itemTarget === target) return true;
    if (target.startsWith("page:")) return handoffTargetPage(itemTarget) === targetPage;
    if (target.startsWith("modal:")) return itemTarget === target;
    return false;
  });
}

function saveHandoffAnnotations() {
  if (typeof window === "undefined") return;
  refreshHandoffAnnotationsFromSources();
  const keys = Object.keys(handoffLocalAnnotations);
  if (!keys.length) {
    window.localStorage?.removeItem(handoffAnnotationStorageKey);
    return;
  }
  window.localStorage?.setItem(
    handoffAnnotationStorageKey,
    JSON.stringify(buildHandoffAnnotationsPayload(handoffLocalAnnotations, "browser-draft")),
  );
}

async function loadProjectHandoffAnnotations() {
  if (typeof window === "undefined" || typeof fetch === "undefined") return;
  try {
    const response = await fetch(`${handoffAnnotationProjectUrl}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    handoffProjectAnnotations = parseHandoffAnnotationPayload(payload);
    saveHandoffProjectCache();
    refreshHandoffAnnotationsFromSources();
    renderApp();
    if (handoffMode) mountPlacedHandoffAnnotations();
  } catch {
    // Opening the prototype directly through file:// may block JSON fetch.
    // The cached project JSON or manual import still keeps annotations usable.
  }
}

function handoffAnnotationsJsonText() {
  return `${JSON.stringify(buildHandoffAnnotationsPayload(handoffAnnotations, "project-json"), null, 2)}\n`;
}

function downloadHandoffAnnotationsJson(jsonText = handoffAnnotationsJsonText()) {
  const blob = new Blob([jsonText], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = handoffAnnotationProjectUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function persistHandoffAnnotationsJson() {
  const jsonText = handoffAnnotationsJsonText();
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: handoffAnnotationProjectUrl,
        types: [
          {
            description: "交付标注 JSON",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(jsonText);
      await writable.close();
      toast("已固化全部标注到 handoff-annotations.json，可提交到 git");
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  downloadHandoffAnnotationsJson(jsonText);
  toast("已下载全部标注 JSON，请放回项目根目录后提交");
}

function triggerHandoffAnnotationImport() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json,.json";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      handoffProjectAnnotations = parseHandoffAnnotationPayload(payload);
      saveHandoffProjectCache();
      refreshHandoffAnnotationsFromSources();
      renderApp();
      if (handoffMode) mountPlacedHandoffAnnotations();
      toast("已载入 handoff-annotations.json");
    } catch {
      toast("JSON 文件解析失败");
    }
  });
  input.click();
}

function handoffMark(title, body, tone = "new") {
  if (!handoffMode) return "";
  const annotation = getHandoffAnnotation(title, body, tone);
  if (!annotation) return "";
  rememberHandoffSummary(handoffSummaryCapturePage || activePage, annotation);
  return `<span class="handoff-anchor" data-handoff-key="${escapeHtml(annotation.key)}" aria-hidden="true"></span>`;
}

function handoffNote(text, title = "", body = "", tone = "info", color = "blue") {
  if (!handoffMode) return "";
  return title && body ? handoffMark(title, body, tone) : "";
}

function renderSideNav() {
  if (handoffMode) refreshHandoffPageSummaryCache();
  document.getElementById("sideNav").innerHTML = pages
    .map(
      (page) => {
        const count = handoffMode ? handoffPageSummaryCount(page.key) : 0;
        return `
          <div class="side-item-wrap">
            <button class="side-item ${activePage === page.key ? "active" : ""}" type="button" onclick="navigate('${page.key}')">
              <span class="doc-icon"></span>
              <span>${page.label}</span>
            </button>
            ${
              handoffMode && count
                ? `<button class="handoff-menu-count" type="button" onclick="event.stopPropagation();openHandoffPanel('${escapeJs(page.key)}')" title="${escapeHtml(page.label)}：${count} 条标注">${count > 99 ? "99+" : String(count).padStart(2, "0")}</button>`
                : ""
            }
          </div>
        `;
      },
    )
    .join("");
}

function renderHandoffManagerBar() {
  return "";
}

function rememberHandoffSummary(pageKey, item) {
  if (!handoffMode || !pageKey || !item || item.deleted) return;
  const normalizedPage = pages.some((page) => page.key === pageKey) ? pageKey : activePage;
  if (!handoffPageSummaryCache[normalizedPage]) handoffPageSummaryCache[normalizedPage] = new Map();
  handoffPageSummaryCache[normalizedPage].set(item.key, { ...item, pageKey: normalizedPage });
}

function refreshHandoffPageSummaryCache() {
  Object.keys(handoffPageSummaryCache).forEach((key) => delete handoffPageSummaryCache[key]);
  const snapshot = snapshotHandoffSummaryState();
  pages.forEach((page) => captureHandoffPageSummary(page.key));
  restoreHandoffSummaryState(snapshot);

  customHandoffAnnotations().forEach((item) => {
    rememberHandoffSummary(handoffTargetPage(item.target) || activePage, item);
  });
}

function snapshotHandoffSummaryState() {
  return {
    activePage,
    scriptFlowView,
    robotEditorTab,
    perfUnits: perfUnits.map((item) => ({ ...item })),
    skillKeywords: [...skillKeywords],
    skillEventTriggers: skillEventTriggers.map((item) => ({ ...item })),
    selectedShowIdsInPicker: [...selectedShowIdsInPicker],
    stageShowPickerFilters: { ...stageShowPickerFilters },
    handoffSummaryCapturePage,
  };
}

function restoreHandoffSummaryState(snapshot) {
  activePage = snapshot.activePage;
  scriptFlowView = snapshot.scriptFlowView;
  robotEditorTab = snapshot.robotEditorTab;
  perfUnits = snapshot.perfUnits.map((item) => ({ ...item }));
  skillKeywords = [...snapshot.skillKeywords];
  skillEventTriggers = snapshot.skillEventTriggers.map((item) => ({ ...item }));
  selectedShowIdsInPicker = [...snapshot.selectedShowIdsInPicker];
  stageShowPickerFilters = { ...snapshot.stageShowPickerFilters };
  handoffSummaryCapturePage = snapshot.handoffSummaryCapturePage;
}

function captureHandoffPageSummary(pageKey) {
  const pageSnapshot = snapshotHandoffSummaryState();
  activePage = pageKey;
  handoffSummaryCapturePage = pageKey;
  try {
    handoffSummaryRenderers(pageKey).forEach((render) => {
      try {
        render();
      } catch {
        // A page summary should never break the business page render.
      }
    });
  } finally {
    restoreHandoffSummaryState(pageSnapshot);
  }
}

function handoffSummaryRenderers(pageKey) {
  const renderers = pageRenderers();
  const baseRenderer = renderers[pageKey] ? [renderers[pageKey]] : [];
  const summaryRenderers = {
    flow: [
      () => {
        scriptFlowView = "list";
        return renderScriptFlowPage();
      },
      () => {
        scriptFlowView = "edit";
        return renderScriptFlowPage();
      },
      captureStageShowPickerSummary,
      captureShowEditorSummary,
    ],
    maps: [renderMapPage, captureMapPointsSummary],
    robots: [renderRobotPage, captureRobotEditorSummary, captureSkillEditorSummary, captureShowEditorSummary],
    skills: [renderSkillPage, captureSkillEditorSummary],
    shows: [renderShowPage, captureShowEditorSummary],
  };
  return summaryRenderers[pageKey] || baseRenderer;
}

function handoffSummaryMark(title, body, tone = "new", pageKey = handoffSummaryCapturePage || activePage) {
  const annotation = getHandoffAnnotation(title, body, tone);
  if (annotation) rememberHandoffSummary(pageKey, annotation);
}

function captureMapPointsSummary() {
  handoffSummaryMark("点位列表字段", "旧版列名为点位名称；本次更名为点位列表，显示系统AGV_点位ID。", "changed");
  handoffSummaryMark("点位名称维护", "新增点位名称列，支持为每个点位编辑可读名称。");
}

function captureStageShowPickerSummary() {
  handoffSummaryMark("表演来源归属", "去掉旧版来源筛选，按归属区分表演来源：公共模板展示表演管理大库全部内容，用户模板自动跟随当前脚本绑定机器人的表演清单。", "changed");
}

function captureRobotEditorSummary() {
  const robot = robots.find((item) => item.id === selectedRobotId) || robots[0];
  if (!robot) return;
  handoffSummaryMark("机器人脚本管理页签", "机器人编辑页新增脚本管理页签，用于查看已下发脚本、设置当前执行脚本和移除脚本。");
  ["role", "device", "skills", "shows", "scripts", "idle", "actions", "vision", "materials"].forEach((tab) => {
    robotEditorTab = tab;
    robotEditorContent(robot, tab);
  });
}

function captureSkillEditorSummary() {
  handoffSummaryMark("直播间事件触发规则", "技能可由关键词或直播间事件触发，二者满足任一即可保存。", "info");
  handoffSummaryMark("直播间事件类型", "事件类型枚举：不配置、点赞、关注、送礼物；送礼物需继续选择礼物档位。", "info");
  handoffSummaryMark("礼物档位选择", "礼物档位枚举：基础礼物、中档礼物、高价值礼物；只选择档位，不做价格区间校验。", "info");
}

function captureShowEditorSummary() {
  perfUnits = [
    { text: "各位贵宾大家好！我在这里好好给大家讲讲我们心符科技的四位一体产品体系哦。", action: "挥舞左手", end: "文本结束", repeat: 1, wait: 0 },
  ];
  showModalHtml("四位一体讲解", true);
}

function handoffPageSummaryItems(pageKey) {
  const merged = new Map(handoffPageSummaryCache[pageKey] ? Array.from(handoffPageSummaryCache[pageKey].entries()) : []);
  handoffVisibleAnnotations
    .filter((record) => record.pageKey === pageKey)
    .forEach((record) => {
      merged.set(record.item.key, { ...record.item, pageKey });
    });
  return Array.from(merged.values());
}

function handoffPageSummaryCount(pageKey) {
  return handoffPageSummaryItems(pageKey).length;
}

function handoffPageForKey(rawKey) {
  for (const page of pages) {
    if (handoffPageSummaryCache[page.key]?.has(rawKey)) return page.key;
  }
  const currentRecord = handoffVisibleAnnotations.find((record) => record.item.key === rawKey);
  return currentRecord?.pageKey || "";
}

function handoffTargetPage(target, visited = new Set()) {
  const text = cleanCell(target);
  if (!text || text === "page") return activePage;
  if (visited.has(text)) return "";
  visited.add(text);

  let match = text.match(/^(?:page|modal):([^:]+)$/);
  if (match) return pages.some((page) => page.key === match[1]) ? match[1] : "";

  match = text.match(/^(?:selector|modal-selector):([^:]+):/);
  if (match) return pages.some((page) => page.key === match[1]) ? match[1] : "";

  const referenced = handoffAnnotations[text] || handoffAnnotationDefaults[text];
  if (referenced?.target) return handoffTargetPage(referenced.target, visited);
  return handoffPageForKey(text);
}

function customHandoffAnnotationsForPage(pageKey) {
  return customHandoffAnnotations().filter((item) => handoffTargetPage(item.target) === pageKey);
}

function pageHandoffTarget() {
  return `page:${activePage}`;
}

function modalHandoffTarget() {
  return `modal:${activePage}`;
}

function renderInlineCustomHandoffMark(item) {
  return `<span class="handoff-anchor custom" data-handoff-key="${escapeHtml(item.key)}" aria-hidden="true"></span>`;
}

function renderCustomHandoffAnnotation(item) {
  return `
    <div class="flow-note blue custom-handoff-note">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.body)}</span>
      <em>保存：${escapeHtml(displayHandoffSavedAt(item.savedAt))}</em>
      <button class="link" type="button" onclick="openHandoffAnnotationDetail('${escapeJs(item.key)}')">查看</button>
      <button class="link" type="button" onclick="openHandoffAnnotationModal('${escapeJs(item.key)}')">编辑</button>
      <button class="link danger" type="button" onclick="deleteHandoffAnnotation('${escapeJs(item.key)}')">删除</button>
    </div>
  `;
}

function startHandoffPlacement(scope = "auto") {
  handoffPlacementMode = true;
  handoffPlacementScope = scope;
  document.body?.classList.add("handoff-placing");
  toast(scope === "modal" ? "点击弹层中要添加标注的位置" : "点击页面或弹层中要添加标注的位置");
  mountPlacedHandoffAnnotations();
}

function stopHandoffPlacement() {
  handoffPlacementMode = false;
  document.body?.classList.remove("handoff-placing");
  mountPlacedHandoffAnnotations();
}

function handleHandoffPlacementClick(event) {
  if (!handoffMode || !handoffPlacementMode) return;
  if (event.target.closest("#handoffModalRoot, #handoffOverlayRoot, .handoff-floating-panel, .handoff-overlay-badge")) return;

  const modalRoot = document.querySelector("#modalRoot .modal");
  const pageRoot = document.getElementById("content");
  const clickedInModal = Boolean(modalRoot?.contains(event.target));
  const clickedInPage = Boolean(pageRoot?.contains(event.target));
  const isModalScope = handoffPlacementScope === "modal" || (handoffPlacementScope === "auto" && clickedInModal);
  const root = isModalScope ? modalRoot : pageRoot;
  if (handoffPlacementScope === "modal" && !clickedInModal) return;
  if (handoffPlacementScope === "page" && !clickedInPage) return;
  if (handoffPlacementScope === "auto" && !clickedInModal && !clickedInPage) return;
  if (!root || !root.contains(event.target)) return;

  event.preventDefault();
  event.stopPropagation();
  const targetElement = event.target.closest("button, input, select, textarea, label, th, td, h1, h2, h3, strong, p, span, div") || event.target;
  const path = cssPathWithin(targetElement, root);
  if (!path) {
    toast("这个位置暂时不能挂标注，换一个具体元素试试");
    return;
  }
  const target = `${isModalScope ? "modal-selector" : "selector"}:${activePage}:${path}`;
  stopHandoffPlacement();
  openHandoffAnnotationModal("", target);
}

function cssPathWithin(element, root) {
  const parts = [];
  let node = element;
  while (node && node !== root && node.nodeType === 1) {
    const tag = node.tagName.toLowerCase();
    const siblings = Array.from(node.parentElement?.children || []).filter((item) => item.tagName === node.tagName);
    const index = siblings.indexOf(node) + 1;
    parts.unshift(`${tag}:nth-of-type(${Math.max(index, 1)})`);
    node = node.parentElement;
  }
  return parts.join(" > ");
}

function mountPlacedHandoffAnnotations() {
  const root = ensureHandoffOverlayRoot();
  if (!root) return;
  root.innerHTML = "";
  if (!handoffMode) return;
  handoffVisibleAnnotations = collectVisibleHandoffAnnotations();
  if (activeHandoffKey && !handoffVisibleAnnotations.some((record) => record.item.key === activeHandoffKey)) {
    activeHandoffKey = "";
  }

  const panel = renderHandoffFloatingPanel();
  root.appendChild(panel);
  positionHandoffFloatingPanel(panel);
  const avoidRects = handoffAvoidRects(panel, handoffVisibleAnnotations);
  const placedRects = [];
  handoffVisibleAnnotations
    .filter((record) => record.rect)
    .forEach((record) => {
      const position = chooseHandoffPinPosition(record.rect, placedRects, avoidRects);
      if (!position) return;
      addHandoffOverlayBadge(root, record, position);
      placedRects.push({ left: position.left, top: position.top, right: position.left + 26, bottom: position.top + 26 });
    });
}

function ensureHandoffOverlayRoot() {
  if (typeof document === "undefined") return null;
  let root = document.getElementById("handoffOverlayRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "handoffOverlayRoot";
    document.body.appendChild(root);
  }
  return root;
}

function renderHandoffFloatingPanel() {
  const panel = document.createElement("div");
  panel.className = "handoff-floating-panel";
  panel.innerHTML = `
    <div class="handoff-compact-actions">
      <button class="handoff-panel-drag-handle" type="button" title="拖拽移动" aria-label="拖拽移动" onpointerdown="startHandoffPanelDrag(event)">⋮⋮</button>
      <button class="btn secondary small" type="button" onclick="openHandoffPanel()">列表</button>
      <button class="btn secondary small ${handoffPlacementMode ? "active" : ""}" type="button" onclick="startHandoffPlacement('auto')">定位新增</button>
      <button class="btn secondary small" type="button" onclick="persistHandoffAnnotationsJson()">固化全部标注</button>
      <button class="btn secondary small" type="button" onclick="triggerHandoffAnnotationImport()">导入JSON</button>
      <button class="btn secondary small" type="button" onclick="resetHandoffAnnotations()">恢复项目标注</button>
    </div>
    ${handoffPlacementMode ? '<div class="handoff-placement-tip">定位中，点击目标位置</div>' : ""}
  `;
  return panel;
}

function renderHandoffPanelListItem(record) {
  const item = record.item;
  const savedAt = displayHandoffSavedAt(item.savedAt);
  return `
    <button class="handoff-list-item handoff-panel-list-item ${item.tone || "new"} ${item.custom ? "custom" : ""}" type="button" onclick="openHandoffAnnotationDetail('${escapeJs(item.key)}')">
      <span class="handoff-list-index">${String(record.index).padStart(2, "0")}</span>
      <span class="handoff-list-copy">
        <strong>${escapeHtml(item.title)}</strong>
        <em>保存：${escapeHtml(savedAt)}</em>
      </span>
    </button>
  `;
}

function renderHandoffSummaryListItem(item, pageKey) {
  const page = pages.find((entry) => entry.key === pageKey) || currentPage();
  const savedAt = displayHandoffSavedAt(item.savedAt);
  return `
    <button class="handoff-list-item handoff-summary-list-item ${item.tone || "new"} ${item.custom ? "custom" : ""}" type="button" onclick="openHandoffSummaryItem('${escapeJs(pageKey)}', '${escapeJs(item.key)}')">
      <span class="handoff-list-dot" aria-hidden="true"></span>
      <span class="handoff-list-copy">
        <strong>${escapeHtml(item.title)}</strong>
        <em>${escapeHtml(page.label)} · 保存：${escapeHtml(savedAt)}</em>
      </span>
    </button>
  `;
}

function renderHandoffSummaryGroup(page, items, selectedPageKey) {
  return `
    <section class="handoff-summary-group ${page.key === selectedPageKey ? "active" : ""}">
      <div class="handoff-summary-head">
        <strong>${escapeHtml(page.label)}</strong>
        <span>${items.length} 条</span>
      </div>
      <div class="handoff-panel-list">
        ${items.map((item) => renderHandoffSummaryListItem(item, page.key)).join("")}
      </div>
    </section>
  `;
}

function openHandoffPanel(selectedPageKey = activePage) {
  refreshHandoffPageSummaryCache();
  const selectedPage = pages.find((page) => page.key === selectedPageKey) || currentPage();
  const groups = pages
    .map((page) => ({ page, items: handoffPageSummaryItems(page.key) }))
    .filter((group) => group.page.key === selectedPage.key && group.items.length);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  openHandoffModal(`
    <div class="modal medium handoff-panel-modal">
      <div class="modal-header">
        <div class="modal-title">${escapeHtml(selectedPage.label)}标注列表${total ? `（${total}）` : ""}</div>
        <button class="modal-close" onclick="closeHandoffModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="handoff-summary-list">
          ${groups.length ? groups.map((group) => renderHandoffSummaryGroup(group.page, group.items, selectedPageKey)).join("") : '<div class="empty">暂无交付标注</div>'}
        </div>
      </div>
    </div>
  `);
}

function openHandoffSummaryItem(pageKey, rawKey) {
  if (pageKey && pageKey !== activePage && pages.some((page) => page.key === pageKey)) {
    activePage = pageKey;
    if (!visitedTabs.includes(pageKey)) visitedTabs.push(pageKey);
    if (typeof window !== "undefined" && window.location) window.location.hash = pageKey;
    renderApp();
  }
  openHandoffAnnotationDetail(rawKey);
}

function usableRect(element) {
  if (!isElementVisibleForHandoff(element)) return null;
  if (!element?.getClientRects?.().length) return null;
  const rect = element?.getBoundingClientRect?.();
  if (!rect) return null;
  if (rect.width || rect.height) return rect;
  const range = document.createRange();
  range.selectNode(element);
  const rangeRect = range.getBoundingClientRect();
  range.detach();
  return rangeRect.width || rangeRect.height ? rangeRect : rect;
}

function isElementVisibleForHandoff(element) {
  if (!element || element.nodeType !== 1) return false;
  let node = element;
  while (node && node.nodeType === 1) {
    const style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    node = node.parentElement;
  }
  return true;
}

function handoffAnnotationScopes() {
  const modalRoot = document.querySelector("#modalRoot .modal");
  if (modalRoot) return [{ root: modalRoot, type: "modal", pageKey: activePage }];
  const pageRoot = document.getElementById("content");
  return pageRoot ? [{ root: pageRoot, type: "page", pageKey: activePage }] : [];
}

function handoffScopedAnchors(scopes = handoffAnnotationScopes()) {
  return scopes.flatMap((scope) =>
    Array.from(scope.root.querySelectorAll(".handoff-anchor[data-handoff-key]")).map((anchor) => ({ anchor, scope })),
  );
}

function handoffAnchorRect(anchor) {
  const host = handoffAnchorHost(anchor);
  const positionHost = handoffAnchorPositionHost(host);
  const hostRect = positionHost ? handoffElementPreciseRect(positionHost) : null;
  return hostRect || usableRect(anchor);
}

function handoffAnchorHost(anchor) {
  if (!anchor) return null;
  const hostSelector = [
    "button",
    "label",
    "th",
    "td",
    "h1",
    "h2",
    "h3",
    "strong",
    "span:not(.handoff-anchor)",
    ".event-trigger-title",
    ".event-trigger-desc",
    ".event-trigger-empty",
    ".form-label",
    ".flow-card-head",
    ".robot-resource-head",
    ".flow-note",
    ".flow-subtext",
    ".upload-hint",
  ].join(", ");
  return anchor.parentElement?.closest(hostSelector) || null;
}

function handoffAnchorPositionHost(host) {
  if (!host) return null;
  return host.closest(".flow-card-head, .robot-resource-head, .flow-note") || host;
}

function handoffElementPreciseRect(element) {
  if (!element) return null;
  if (element.matches?.(".form-label, .event-trigger-title, .event-trigger-desc, h1, h2, h3, strong, span:not(.handoff-anchor)")) {
    const textRect = handoffTextContentRect(element);
    if (textRect) return textRect;
  }
  return usableRect(element);
}

function handoffTextContentRect(element) {
  if (!isElementVisibleForHandoff(element)) return null;
  const range = document.createRange();
  range.selectNodeContents(element);
  const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 1 && rect.height > 1);
  const rect = rects[0] || range.getBoundingClientRect();
  range.detach();
  if (!rect || rect.width <= 1 || rect.height <= 1) return null;
  return rect;
}

function handoffTargetRect(target, visited = new Set(), scopes = handoffAnnotationScopes()) {
  if (!target || visited.has(target)) return null;
  visited.add(target);
  const match = String(target).match(/^(selector|modal-selector):([^:]+):(.+)$/);
  if (match && match[2] === activePage) {
    const scopeType = match[1] === "modal-selector" ? "modal" : "page";
    const root = scopes.find((scope) => scope.type === scopeType)?.root;
    const element = root?.querySelector(match[3]);
    return element ? usableRect(element) : null;
  }
  const anchor = handoffScopedAnchors(scopes).find((record) => record.anchor.dataset.handoffKey === target)?.anchor;
  if (anchor) return handoffAnchorRect(anchor);
  const referenced = handoffAnnotations[target] || handoffAnnotationDefaults[target];
  if (referenced?.target) return handoffTargetRect(referenced.target, visited, scopes);
  return null;
}

function collectVisibleHandoffAnnotations() {
  const positionedRecords = [];
  const scopes = handoffAnnotationScopes();
  let order = 0;
  const pushRecord = (item, rect = null, scope = null) => {
    if (!item || item.deleted) return;
    if (!rect) return;
    positionedRecords.push({ item, rect, order: order++, pageKey: scope?.pageKey || activePage, scopeType: scope?.type || "page" });
  };

  handoffScopedAnchors(scopes).forEach(({ anchor, scope }) => {
    const item = resolveHandoffAnnotation(anchor.dataset.handoffKey);
    const rect = handoffAnchorRect(anchor);
    if (item && rect) pushRecord(item, rect, scope);
  });

  customHandoffAnnotations().forEach((item) => {
    const target = String(item.target || "");
    if (!target || target === "page" || target === pageHandoffTarget() || target === modalHandoffTarget()) return;
    if (target.startsWith("page:") || target.startsWith("modal:")) return;
    if (handoffTargetPage(target) !== activePage) return;
    const rect = handoffTargetRect(target, new Set(), scopes);
    if (rect) pushRecord(item, rect, scopes[0]);
  });

  positionedRecords.forEach((record, index) => {
    record.index = index + 1;
  });
  return positionedRecords.filter((record) => isHandoffRectVisible(record.rect));
}

function isHandoffRectVisible(rect) {
  if (!rect) return false;
  return rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth;
}

function handoffAvoidRects(panel, records = []) {
  const scopes = handoffAnnotationScopes();
  const controlSelector = "button, input, select, textarea, a, .btn, .link, .stage-delete, .black-dot, .switch-button, [role='button']";
  const contentSelector = [
    ".form-label",
    ".event-trigger-title",
    ".event-trigger-desc",
    ".event-trigger-empty",
    ".keyword-box",
    ".radio-line",
    ".upload-hint",
    ".flow-subtext",
    ".section-title",
    ".modal-title",
    ".tag",
    ".mini-tag",
  ].join(", ");
  const scopedAvoidElements = scopes.flatMap((scope) => Array.from(scope.root.querySelectorAll(`${controlSelector}, ${contentSelector}`)));
  const items = [panel, ...document.querySelectorAll("#handoffModalRoot .modal, #modalRoot .modal-header, #modalRoot .modal-footer"), ...scopedAvoidElements];
  const rects = items
    .map((node) => handoffElementPreciseRect(node))
    .filter((rect) => rect && isHandoffRectVisible(rect))
    .map((rect) => expandHandoffRect(rect, 8));
  records
    .map((record) => record.rect)
    .filter((rect) => rect && isHandoffRectVisible(rect))
    .forEach((rect) => rects.push(expandHandoffRect(rect, 8)));
  return rects;
}

function expandHandoffRect(rect, amount) {
  return {
    left: rect.left - amount,
    top: rect.top - amount,
    right: rect.right + amount,
    bottom: rect.bottom + amount,
  };
}

function chooseHandoffPinPosition(anchorRect, placedRects, avoidRects) {
  const candidates = [...handoffPinCandidates(anchorRect), ...handoffGridCandidates(anchorRect)];
  const seen = new Set();
  for (const candidate of candidates) {
    const position = clampHandoffPinPosition(candidate.left, candidate.top);
    const key = `${Math.round(position.left)}:${Math.round(position.top)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (isHandoffPinPositionFree(position, placedRects, avoidRects)) return position;
  }
  return null;
}

function handoffPinCandidates(rect) {
  const size = 26;
  const gap = 8;
  const step = size + gap;
  const candidates = [];
  for (let ring = 0; ring <= 8; ring++) {
    const offset = ring * step;
    candidates.push(
      { left: rect.right + gap, top: rect.top + offset },
      { left: rect.right + gap, top: rect.top - offset },
      { left: rect.left - size - gap, top: rect.top + offset },
      { left: rect.left - size - gap, top: rect.top - offset },
      { left: rect.left + offset, top: rect.bottom + gap },
      { left: rect.left + offset, top: rect.top - size - gap },
      { left: rect.right - size - offset, top: rect.bottom + gap },
      { left: rect.right - size - offset, top: rect.top - size - gap },
    );
  }
  return candidates;
}

function handoffGridCandidates(rect) {
  const size = 26;
  const gap = 8;
  const step = size + gap;
  const margin = 8;
  const anchorX = rect.left + rect.width / 2;
  const anchorY = rect.top + rect.height / 2;
  const candidates = [];
  for (let top = margin; top <= window.innerHeight - size - margin; top += step) {
    for (let left = margin; left <= window.innerWidth - size - margin; left += step) {
      const centerX = left + size / 2;
      const centerY = top + size / 2;
      candidates.push({ left, top, distance: (centerX - anchorX) ** 2 + (centerY - anchorY) ** 2 });
    }
  }
  return candidates.sort((a, b) => a.distance - b.distance);
}

function clampHandoffPinPosition(left, top) {
  const size = 26;
  const margin = 8;
  return {
    left: Math.min(Math.max(left, margin), window.innerWidth - size - margin),
    top: Math.min(Math.max(top, margin), window.innerHeight - size - margin),
  };
}

function positionHandoffFloatingPanel(panel) {
  if (!panel || !handoffFloatingPanelPosition) return;
  const next = clampHandoffPanelPosition(handoffFloatingPanelPosition, panel);
  handoffFloatingPanelPosition = next;
  panel.style.left = `${next.left}px`;
  panel.style.top = `${next.top}px`;
  panel.style.right = "auto";
  panel.style.bottom = "auto";
  saveHandoffPanelPosition();
}

function clampHandoffPanelPosition(position, panel = document.querySelector(".handoff-floating-panel")) {
  const margin = 8;
  const rect = panel?.getBoundingClientRect?.();
  const width = rect?.width || 260;
  const height = rect?.height || 58;
  return {
    left: Math.min(Math.max(position.left, margin), Math.max(margin, window.innerWidth - width - margin)),
    top: Math.min(Math.max(position.top, margin), Math.max(margin, window.innerHeight - height - margin)),
  };
}

function startHandoffPanelDrag(event) {
  if (event.button !== undefined && event.button !== 0) return;
  const panel = event.currentTarget.closest(".handoff-floating-panel");
  if (!panel) return;
  const rect = panel.getBoundingClientRect();
  handoffFloatingPanelDrag = {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  };
  panel.classList.add("dragging");
  document.body?.classList.add("handoff-panel-dragging");
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
  event.stopPropagation();
}

function handleHandoffPanelDrag(event) {
  if (!handoffFloatingPanelDrag) return;
  const panel = document.querySelector(".handoff-floating-panel");
  if (!panel) return;
  const next = clampHandoffPanelPosition(
    {
      left: event.clientX - handoffFloatingPanelDrag.offsetX,
      top: event.clientY - handoffFloatingPanelDrag.offsetY,
    },
    panel,
  );
  handoffFloatingPanelPosition = next;
  panel.style.left = `${next.left}px`;
  panel.style.top = `${next.top}px`;
  panel.style.right = "auto";
  panel.style.bottom = "auto";
  event.preventDefault();
}

function stopHandoffPanelDrag() {
  if (!handoffFloatingPanelDrag) return;
  handoffFloatingPanelDrag = null;
  document.querySelector(".handoff-floating-panel")?.classList.remove("dragging");
  document.body?.classList.remove("handoff-panel-dragging");
  saveHandoffPanelPosition();
}

function isHandoffPinPositionFree(position, placedRects, avoidRects) {
  const size = 26;
  const rect = { left: position.left, top: position.top, right: position.left + size, bottom: position.top + size };
  return !placedRects.some((placed) => handoffRectsOverlap(rect, placed, 5)) && !avoidRects.some((avoid) => handoffRectsOverlap(rect, avoid, 0));
}

function handoffRectsOverlap(a, b, padding = 0) {
  return a.left < b.right + padding && a.right > b.left - padding && a.top < b.bottom + padding && a.bottom > b.top - padding;
}

function focusHandoffAnnotation(rawKey, openDetail = false) {
  activeHandoffKey = rawKey;
  if (handoffMode) mountPlacedHandoffAnnotations();
  if (openDetail) openHandoffAnnotationDetail(rawKey);
}

function addHandoffOverlayBadge(root, record, position) {
  const item = record.item;
  const button = document.createElement("button");
  button.className = `handoff-overlay-badge ${item.tone || "new"} ${item.custom ? "custom" : ""} ${item.key === activeHandoffKey ? "active" : ""}`;
  button.type = "button";
  button.dataset.handoffKey = item.key;
  const savedAt = displayHandoffSavedAt(item.savedAt);
  button.title = `${item.title} | 保存：${savedAt}`;
  button.innerHTML = `<span class="handoff-pin-index">${String(record.index).padStart(2, "0")}</span>`;
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    activeHandoffKey = item.key;
    mountPlacedHandoffAnnotations();
    openHandoffAnnotationDetail(item.key);
  });
  button.style.left = `${position.left}px`;
  button.style.top = `${position.top}px`;
  root.appendChild(button);
}

function renderTabs() {
  const labels = visitedTabs.map((key) => pages.find((page) => page.key === key)).filter(Boolean);
  document.getElementById("tabbar").innerHTML = `
    <button class="tab" type="button" onclick="toast('首页为占位标签')">首页</button>
    ${labels
      .map(
        (page) => `
        <button class="tab ${page.key === activePage ? "active" : ""}" type="button" onclick="navigate('${page.key}')">
          ${page.label}<span class="close">×</span>
        </button>
      `,
      )
      .join("")}
  `;
}

function navigate(pageKey) {
  activePage = pageKey;
  if (pageKey === "flow") scriptFlowView = "list";
  if (!visitedTabs.includes(pageKey)) visitedTabs.push(pageKey);
  if (typeof window !== "undefined" && window.location) window.location.hash = pageKey;
  renderApp();
}

function toggleSidebar() {
  document.getElementById("app").classList.toggle("sidebar-collapsed");
}

function initialFeatureListRows() {
  const fallback = (typeof window !== "undefined" && window.liveAdminFeatureList?.rows) || [];
  if (typeof window === "undefined") return fallback.map(normalizeFeatureRow).filter(isActiveFeatureRow);
  try {
    const saved = window.localStorage?.getItem(featureListStorageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.map(normalizeFeatureRow).filter(isActiveFeatureRow);
    }
  } catch {
    window.localStorage?.removeItem(featureListStorageKey);
  }
  return fallback.map(normalizeFeatureRow).filter(isActiveFeatureRow);
}

function normalizeFeatureRow(row = {}, index = 0) {
  const id = cleanCell(row.id) || `FL-${String(index + 1).padStart(3, "0")}`;
  return {
    key: cleanCell(row.key) || `${id}-${index}`,
    id,
    client: cleanCell(row.client),
    module1: cleanCell(row.module1),
    module2: cleanCell(row.module2),
    point: cleanCell(row.point),
    desc: cleanCell(row.desc),
    phase: cleanCell(row.phase) || "直播前",
    priority: cleanCell(row.priority) || "P0",
    owner: cleanCell(row.owner) || "待定",
    parent: cleanCell(row.parent),
  };
}

function isActiveFeatureRow(row) {
  const retiredLiveEventFeatureIds = new Set(["FL-119", "FL-124", "FL-165", "FL-166"]);
  return !retiredLiveEventFeatureIds.has(row.id);
}

function saveFeatureListRows() {
  if (typeof window === "undefined") return;
  window.localStorage?.setItem(featureListStorageKey, JSON.stringify(featureListRows));
}

function featureOptions(field, fallback) {
  const values = Array.from(new Set(featureListRows.map((row) => cleanCell(row[field])).filter(Boolean)));
  return values.length ? values : fallback;
}

function filteredFeatureRows() {
  const keyword = featureListFilters.keyword.trim().toLowerCase();
  return featureListRows.filter((row) => {
    const matchesKeyword =
      !keyword ||
      [row.id, row.client, row.module1, row.module2, row.point, row.desc, row.phase, row.priority, row.owner, row.parent]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    const matchesClient = featureListFilters.client === "全部端" || row.client === featureListFilters.client;
    const matchesModule = featureListFilters.module1 === "全部模块" || row.module1 === featureListFilters.module1;
    const matchesPhase = featureListFilters.phase === "全部阶段" || row.phase === featureListFilters.phase;
    const matchesPriority = featureListFilters.priority === "全部优先级" || row.priority === featureListFilters.priority;
    return matchesKeyword && matchesClient && matchesModule && matchesPhase && matchesPriority;
  });
}

function renderChangelogPage() {
  const rows = filteredFeatureRows();
  const moduleCount = new Set(featureListRows.map((row) => row.module1).filter(Boolean)).size;
  const backendCount = featureListRows.filter((row) => row.client === "服务器").length;
  const robotCount = featureListRows.filter((row) => row.client === "机器人").length;
  return `
    <div class="changelog-page">
      <section class="changelog-head">
        <div>
          <h1>更新日志 / 功能清单</h1>
          <p>这里可以直接编辑、删除和新增功能点；改动会自动保存在当前浏览器。</p>
        </div>
        <div class="changelog-actions">
          <button class="btn secondary" type="button" onclick="resetFeatureListRows()">恢复初始清单</button>
          <button class="btn secondary" type="button" onclick="downloadFeatureListCsv()">导出CSV</button>
          <button class="btn" type="button" onclick="downloadFeatureListExcel()">导出Excel</button>
        </div>
      </section>

      <section class="feature-summary-grid">
        ${summaryCard("当前功能点", featureListRows.length, "blue")}
        ${summaryCard("覆盖模块", moduleCount, "green")}
        ${summaryCard("机器人端", robotCount, "gray")}
        ${summaryCard("服务器侧", backendCount, "red")}
      </section>

      <section class="changelog-log">
        <div class="log-line">
          <strong>2026-06-02</strong>
          <span>按运营后台原型标注和功能表头整理为可编辑功能清单，当前默认保留 ${featureListRows.length} 条。</span>
        </div>
        <div class="log-line">
          <strong>2026-06-01</strong>
          <span>新增脚本管理、机器人批量创建、机器人脚本页签、表演执行逻辑、直播间事件触发、展览点位列表管理等交付标注。</span>
        </div>
      </section>

      <div class="toolbar feature-toolbar">
        <div class="filters">
          <input class="input w-220" value="${escapeHtml(featureListFilters.keyword)}" placeholder="搜索功能ID / 模块 / 描述" oninput="setFeatureListFilter('keyword', this.value)" />
          ${featureFilterSelect("client", "全部端", featureOptions("client", ["运营后台", "机器人", "服务器"]))}
          ${featureFilterSelect("module1", "全部模块", featureOptions("module1", []))}
          ${featureFilterSelect("phase", "全部阶段", featureOptions("phase", ["直播前", "直播中", "直播后"]))}
          ${featureFilterSelect("priority", "全部优先级", featureOptions("priority", ["P0", "P1"]))}
        </div>
        <button class="btn" type="button" onclick="addFeatureRow()">＋ 新增功能点</button>
      </div>

      <div class="table-wrap feature-table-wrap">
        <table class="data-table feature-table">
          <thead>
            <tr>
              <th>功能ID</th>
              <th>端</th>
              <th>一级模块</th>
              <th>二级模块</th>
              <th>功能点</th>
              <th>功能描述</th>
              <th>所属阶段</th>
              <th>优先级</th>
              <th>负责人</th>${handoffMark("功能清单列结构", "旧版功能清单表格含父记录列；本次调整为10列，移除父记录列并调整各列宽度。", "changed")}
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows.map((row) => renderFeatureRow(row)).join("")
                : `<tr><td colspan="10">当前筛选没有匹配功能点。</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function featureFilterSelect(field, allLabel, options) {
  return `
    <select class="select w-150" onchange="setFeatureListFilter('${field}', this.value)">
      <option ${featureListFilters[field] === allLabel ? "selected" : ""}>${allLabel}</option>
      ${options.map((option) => `<option value="${escapeHtml(option)}" ${featureListFilters[field] === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
    </select>
  `;
}

function renderFeatureRow(row) {
  return `
    <tr>
      <td>${featureTextInput(row.key, "id", row.id, "feature-id-input")}</td>
      <td>${featureSelect(row.key, "client", row.client, ["运营后台", "机器人", "服务器"])}</td>
      <td>${featureTextInput(row.key, "module1", row.module1)}</td>
      <td>${featureTextInput(row.key, "module2", row.module2)}</td>
      <td>${featureTextInput(row.key, "point", row.point)}</td>
      <td>${featureTextarea(row.key, "desc", row.desc)}</td>
      <td>${featureSelect(row.key, "phase", row.phase, ["直播前", "直播中", "直播后"])}</td>
      <td>${featureSelect(row.key, "priority", row.priority, ["P0", "P1", "P2"])}</td>
      <td>${featureTextInput(row.key, "owner", row.owner, "feature-owner-input")}</td>
      <td class="feature-row-actions">
        <button class="link" type="button" onclick="duplicateFeatureRow('${escapeJs(row.key)}')">复制</button>
        <button class="link danger" type="button" onclick="deleteFeatureRow('${escapeJs(row.key)}')">删除</button>
      </td>
    </tr>
  `;
}

function featureTextInput(rowId, field, value, className = "") {
  return `<input class="feature-cell-input ${className}" value="${escapeHtml(value)}" oninput="updateFeatureRow('${escapeJs(rowId)}', '${field}', this.value)" />`;
}

function featureTextarea(rowId, field, value) {
  return `<textarea class="feature-cell-textarea" oninput="updateFeatureRow('${escapeJs(rowId)}', '${field}', this.value)">${escapeHtml(value)}</textarea>`;
}

function featureSelect(rowId, field, value, options) {
  const merged = Array.from(new Set([value, ...options].filter(Boolean)));
  return `
    <select class="feature-cell-select" onchange="updateFeatureRow('${escapeJs(rowId)}', '${field}', this.value)">
      ${merged.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
    </select>
  `;
}

function setFeatureListFilter(field, value) {
  featureListFilters[field] = value;
  renderApp();
}

function updateFeatureRow(rowKey, field, value) {
  const row = featureListRows.find((item) => item.key === rowKey);
  if (!row) return;
  row[field] = value;
  saveFeatureListRows();
}

function nextFeatureId() {
  const max = featureListRows.reduce((highest, row) => {
    const match = String(row.id || "").match(/FL-(\d+)/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `FL-${String(max + 1).padStart(3, "0")}`;
}

function addFeatureRow() {
  const row = normalizeFeatureRow({
    key: `custom-${Date.now()}`,
    id: nextFeatureId(),
    client: "运营后台",
    module1: "",
    module2: "",
    point: "",
    desc: "",
    phase: "直播前",
    priority: "P0",
    owner: "待定",
  });
  featureListRows.unshift(row);
  saveFeatureListRows();
  renderApp();
  toast("已新增功能点");
}

function duplicateFeatureRow(rowId) {
  const row = featureListRows.find((item) => item.key === rowId);
  if (!row) return;
  const index = featureListRows.indexOf(row);
  const copy = { ...row, key: `copy-${Date.now()}`, id: nextFeatureId(), point: `${row.point} - 副本` };
  featureListRows.splice(index + 1, 0, copy);
  saveFeatureListRows();
  renderApp();
  toast("已复制功能点");
}

function deleteFeatureRow(rowId) {
  featureListRows = featureListRows.filter((row) => row.key !== rowId);
  saveFeatureListRows();
  renderApp();
  toast("已删除功能点");
}

function resetFeatureListRows() {
  featureListRows = ((typeof window !== "undefined" && window.liveAdminFeatureList?.rows) || []).map(normalizeFeatureRow);
  saveFeatureListRows();
  renderApp();
  toast("已恢复初始清单");
}

function featureExportRows() {
  return [
    ["功能ID", "端", "一级模块", "二级模块", "功能点", "功能描述", "所属阶段", "优先级", "负责人 (人员 )"],
    ...featureListRows.map((row) => [row.id, row.client, row.module1, row.module2, row.point, row.desc, row.phase, row.priority, row.owner]),
  ];
}

function downloadFeatureListCsv() {
  const content = "\ufeff" + featureExportRows().map((row) => row.map(csvCell).join(",")).join("\n");
  downloadBlob(content, "直播运营后台_功能清单.csv", "text/csv;charset=utf-8");
}

function downloadFeatureListExcel() {
  const rows = featureExportRows();
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, "Microsoft YaHei", sans-serif; }
          table { border-collapse: collapse; }
          th, td { border: 1px solid #cfd8e3; padding: 8px; mso-number-format:"\\@"; vertical-align: top; }
          th { background: #eef5ff; font-weight: 700; }
        </style>
      </head>
      <body>
        <table>
          ${rows.map((row, index) => `<tr>${row.map((cell) => `<${index === 0 ? "th" : "td"}>${escapeHtml(cell)}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}
        </table>
      </body>
    </html>
  `;
  downloadBlob("\ufeff" + html, "直播运营后台_功能清单.xls", "application/vnd.ms-excel;charset=utf-8");
}

function resolveHandoffAnnotation(rawKey) {
  const item = handoffAnnotations[rawKey] || handoffAnnotationDefaults[rawKey];
  if (!item || item.deleted) return null;
  return { key: rawKey, ...item };
}

function openHandoffAnnotationDetail(rawKey) {
  activeHandoffKey = rawKey;
  if (handoffMode) mountPlacedHandoffAnnotations();
  const item = resolveHandoffAnnotation(rawKey);
  if (!item) {
    toast("标注不存在或已删除");
    return;
  }
  openHandoffModal(`
    <div class="modal medium handoff-detail-modal">
      <div class="modal-header">
        <div class="modal-title">交付标注详情</div>
        <button class="modal-close" onclick="closeHandoffModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="handoff-detail-card ${item.tone || "new"}">
          <div class="handoff-detail-top">
            <strong>${escapeHtml(item.title)}</strong>
            <span>保存：${escapeHtml(displayHandoffSavedAt(item.savedAt))}</span>
          </div>
          <p>${escapeHtml(item.body)}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeHandoffModal()">关闭</button>
        <button class="btn secondary" onclick="openHandoffAnnotationModal('${escapeJs(rawKey)}')">编辑</button>
        <button class="btn secondary danger-text" onclick="deleteHandoffAnnotation('${escapeJs(rawKey)}')">删除</button>
        <button class="btn" onclick="openHandoffAnnotationModal('', '${escapeJs(rawKey)}')">在此处新增</button>
      </div>
    </div>
  `);
}

function openHandoffAnnotationModal(rawKey = "", target = "") {
  const isEdit = Boolean(rawKey);
  const item = isEdit ? handoffAnnotations[rawKey] || handoffAnnotationDefaults[rawKey] : null;
  const title = item?.title || "";
  const body = item?.body || "";
  const tone = item?.tone || "new";
  const targetValue = target || item?.target || pageHandoffTarget();
  openHandoffModal(`
    <div class="modal medium">
      <div class="modal-header">
        <div class="modal-title">${isEdit ? "编辑交付标注" : "新增交付标注"}</div>
        <button class="modal-close" onclick="closeHandoffModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="form-section">
          <div class="form-row"><div class="form-label required">标注标题</div><div><input id="handoffEditTitle" class="input" value="${escapeHtml(title)}" placeholder="例如：机器人版本选项" /></div></div>
          <div class="form-row top"><div class="form-label required">标注说明</div><div><textarea id="handoffEditBody" class="textarea" placeholder="写清楚开发和验收需要理解的内容">${escapeHtml(body)}</textarea></div></div>
          <div class="form-row"><div class="form-label">标注类型</div><div>
            <select id="handoffEditTone" class="select">
              <option value="new" ${tone === "new" ? "selected" : ""}>新增</option>
              <option value="changed" ${tone === "changed" ? "selected" : ""}>调整</option>
              <option value="info" ${tone === "info" ? "selected" : ""}>规则/逻辑说明</option>
            </select>
          </div></div>
          <input id="handoffEditTarget" type="hidden" value="${escapeHtml(targetValue)}" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeHandoffModal()">取消</button>
        <button class="btn" onclick="saveHandoffAnnotation('${escapeJs(rawKey)}')">保存</button>
      </div>
    </div>
  `);
}

function saveHandoffAnnotation(rawKey = "") {
  const title = cleanCell(document.getElementById("handoffEditTitle")?.value);
  const body = cleanCell(document.getElementById("handoffEditBody")?.value);
  const tone = cleanCell(document.getElementById("handoffEditTone")?.value) || "new";
  const target = cleanCell(document.getElementById("handoffEditTarget")?.value) || pageHandoffTarget();
  if (!title || !body) {
    toast("标注标题和说明都要填写");
    return;
  }
  const key = rawKey || `custom::${Date.now()}`;
  const existing = handoffLocalAnnotations[key] || handoffAnnotations[key] || {};
  const savedAt = formatLocalTimestamp(new Date());
  handoffLocalAnnotations[key] = {
    ...existing,
    title,
    body,
    tone,
    custom: rawKey ? Boolean(existing.custom) : true,
    target: rawKey ? existing.target || target : target,
    deleted: false,
    savedAt,
  };
  saveHandoffAnnotations();
  closeHandoffModal();
  renderApp();
  mountPlacedHandoffAnnotations();
  toast("标注已保存");
}

function deleteHandoffAnnotation(rawKey) {
  const existing = handoffLocalAnnotations[rawKey] || handoffAnnotations[rawKey] || {};
  handoffLocalAnnotations[rawKey] = { ...existing, deleted: true, savedAt: formatLocalTimestamp() };
  if (activeHandoffKey === rawKey) activeHandoffKey = "";
  saveHandoffAnnotations();
  closeHandoffModal();
  renderApp();
  mountPlacedHandoffAnnotations();
  toast("标注已删除");
}

function resetHandoffAnnotations() {
  handoffLocalAnnotations = {};
  activeHandoffKey = "";
  saveHandoffAnnotations();
  closeHandoffModal();
  renderApp();
  toast("已清空本地草稿，恢复项目标注");
}

function formatLocalTimestamp(date = new Date()) {
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function displayHandoffSavedAt(value) {
  const text = cleanCell(value) || handoffTimestamp;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${text} 00:00`;
  return text;
}

function renderProductPage() {
  return `
    <div class="toolbar">
      <div class="filters">
        <label class="field-inline">选择优购商城店铺
          <select class="select w-180"><option>微视优购</option><option>轻蝉官方旗舰店</option><option>观野</option></select>
        </label>
        <input class="input w-220" placeholder="输入商品ID或商品名称搜" />
        <button class="btn" type="button" onclick="toast('已按商品条件查询')">查询</button>
      </div>
      <div class="filters">
        <span>操作：</span>
        <button class="btn danger" type="button" onclick="toast('已将勾选商品移除列表')">从列表中移除商品</button>
      </div>
    </div>
    ${handoffNote("技能管理大库只显示公共模板；用户模板在机器人管理的技能管理页签中维护。礼物触发仅选择档位，不做价格区间校验。")}
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>序号</th>
            <th>商品ID</th>
            <th>店铺</th>
            <th>图片</th>
            <th>商品标题</th>
            <th>商品分类</th>
            <th>商品价格(元)</th>
            <th>划线价格(元)</th>
            <th>库存</th>
            <th>讲解视频</th>
            <th>讲解文案</th>
            <th>商品状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (item, index) => `
              <tr>
                <td><input type="checkbox" /></td>
                <td>${index + 1}</td>
                <td>${item.id}</td>
                <td>${item.shop}</td>
                <td><div class="product-img ${item.imageClass}">${item.image}</div></td>
                <td class="left">${item.title}</td>
                <td>${item.category}</td>
                <td class="price">${item.price}</td>
                <td class="price">${item.slash}</td>
                <td>${item.stock}</td>
                <td>${item.video ? '<button class="link">◎ 预览视频</button><br />' : ""}<button class="link">↥ 点击上传</button></td>
                <td class="left">${item.copy}<br /><button class="link">编辑</button></td>
                <td><span class="mini-tag ${productStatusClass(item)}">${item.status}</span></td>
                <td><button class="btn danger small" type="button" onclick="toast('商品已移除')">移除商品</button></td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderRoomPage() {
  return `
    <div class="toolbar">
      <div class="filters">
        <label class="field-inline">开播时间
          <input class="input w-180" placeholder="开始日期    ~    结束日期" />
        </label>
        <input class="input w-260" placeholder="输入直播账号ID或昵称搜索" />
        <select class="select w-180"><option>全部</option><option>直播中</option><option>已结束</option><option>未开始</option></select>
        <button class="btn" type="button" onclick="toast('已查询直播间')">查询</button>
        <button class="btn" type="button" onclick="openRoomModal()">+ 创建虚拟直播间</button>
      </div>
    </div>
    <h3 style="margin:0 0 20px 6px;color:#111;font-size:18px;">未开始: 3</h3>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>直播ID</th>
            <th>直播状态</th>
            <th>开关播时间</th>
            <th>类型</th>
            <th>开播账号ID</th>
            <th>开播角色</th>
            <th>拉流转推</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${rooms
            .map(
              (room) => `
              <tr>
                <td>${room.seq}</td>
                <td>${room.id}</td>
                <td>
                  <div class="${room.live ? "status-green" : ""}">${room.status}</div>
                  <div class="nowrap"><button class="link">${room.live ? "隐藏" : "隐藏"}</button> <span class="switch ${room.live ? "on" : ""}"></span> 显示</div>
                </td>
                <td class="left">开播：${room.start}<br />关播：${room.end}</td>
                <td>🤖${room.type}<br /><span class="tag">聊天</span></td>
                <td><strong>${room.account}</strong><br />${room.roomId}</td>
                <td><div class="avatar-img ${room.avatarClass}">${room.cover}</div><br />${room.role}</td>
                <td><button class="link">编辑</button></td>
                <td class="nowrap">
                  <button class="link">管理直播间</button>
                  <button class="link" onclick="openScriptEditor('SCRIPT-001')">脚本流程编排</button>
                  <button class="link">复制直播间地址</button>
                  ${room.live ? '<button class="link danger">立即下播</button>' : '<button class="link green">重新开播</button><button class="link danger">删除</button>'}
                </td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    ${pagination(110, 11)}
  `;
}

function renderMapPage() {
  return `
    <div class="toolbar">
      <div class="filters">
        <input class="input w-220" placeholder="输入展馆ID或展馆名搜索" />
        <button class="btn" type="button" onclick="toast('已查询展览地图')">⌕ 查询</button>
        <button class="btn" type="button" onclick="openMapModal()">＋ 创建展览地图</button>
      </div>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>序号</th><th>ID</th><th>展馆</th><th>展览</th><th>展品管理</th><th>展览地图</th><th>展览点位</th><th>是否启用</th><th>绑定机器人</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${exhibitionMaps
            .map(
              (map, index) => {
                const robot = robots.find((item) => item.id === map.boundRobotId);
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${map.id}</td>
                    <td>${map.venueName}</td>
                    <td>${map.exhibitionName}</td>
                    <td>${map.exhibits.length}个 <button class="link" onclick="openExhibitManager('${map.id}')">维护</button></td>
                    <td><button class="link" onclick="toast('地图图片上传入口')">上传</button></td>
                    <td>${map.points.length}个 <button class="link" onclick="openMapPointsModal('${map.id}')">点位列表</button>${handoffMark("点位列表管理", "旧版为上传点位；本次改为点位列表管理，AGV_HOME为系统必有不可删除，新增点位自动按AGV_P1递增，支持编辑点位名称。", "changed")}</td>
                    <td><span class="switch on"></span></td>
                    <td><span class="mini-tag green">已绑定</span> ${robot ? `${robot.id} ${robot.name}` : "未绑定"}</td>
                    <td><button class="link" onclick="openMapModal('${map.id}')">编辑</button> <button class="link danger">删除</button></td>
                  </tr>
                `;
              },
            )
            .join("")}
        </tbody>
      </table>
    </div>
    ${pagination(1, 1)}
  `;
}

function openMapModal(mapId = "") {
  const map = exhibitionMaps.find((item) => item.id === mapId) || exhibitionMaps[0];
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">${mapId ? "编辑展览地图" : "创建展览地图"}</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="form-section">
          ${mapFormInput("展馆名称", map.venueName, true)}
          ${mapFormInput("展览名称", map.exhibitionName, true)}
          ${mapFormInput("地图名称", map.mapName, true)}
          <div class="form-row"><div class="form-label">绑定机器人</div><div><select class="select">${robots.map((robot) => `<option ${robot.id === map.boundRobotId ? "selected" : ""}>${robot.id} / ${robot.name} / ${robot.version}</option>`).join("")}</select></div></div>
          ${handoffNote("导览脚本会读取这里绑定的地图与点位列表；AGV_HOME 为必有点位，不支持更改。")}
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="closeModal()">取消</button><button class="btn" onclick="closeModal();toast('展览地图已保存')">确定</button></div>
    </div>
  `);
}

function mapFormInput(label, value, required = false) {
  return `<div class="form-row"><div class="form-label ${required ? "required" : ""}">${label}</div><div><input class="input" value="${value}" /></div></div>`;
}

function openMapPointsModal(mapId) {
  const map = exhibitionMaps.find((item) => item.id === mapId) || exhibitionMaps[0];
  openModal(`
    <div class="modal medium">
      <div class="modal-header"><div class="modal-title">维护点位列表</div><button class="modal-close" onclick="closeModal()">×</button></div>
      <div class="modal-body">
        <div class="table-wrap">
          <table class="data-table compact-table map-points-table">
            <thead><tr><th>序号</th><th>点位列表${handoffMark("点位列表字段", "旧版列名为点位名称；本次更名为点位列表，显示系统AGV_点位ID。", "changed")}</th><th>点位名称${handoffMark("点位名称维护", "新增点位名称列，支持为每个点位编辑可读名称。")}</th><th><button class="black-dot" onclick="addMapPoint('${map.id}')">＋</button></th></tr></thead>
            <tbody>${map.points.map((point, index) => {
              const isHome = point === "AGV_HOME";
              return `<tr>
                <td>${index + 1}</td>
                <td><span class="map-point-id">${point}</span></td>
                <td><input class="input map-point-name-input" value="" placeholder="${isHome ? "系统默认" : "输入点位名称"}" ${isHome ? "readonly" : ""} /></td>
                <td>${isHome ? '<span class="mini-tag gray">锁定</span>' : `<button class="black-dot" onclick="removeMapPoint('${map.id}', ${index})">−</button>`}</td>
              </tr>`;
            }).join("")}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="closeModal()">取消</button><button class="btn" onclick="closeModal();toast('点位列表已保存')">保存</button></div>
    </div>
  `);
}

function renumberMapPoints(map) {
  let counter = 1;
  for (let i = 0; i < map.points.length; i++) {
    if (map.points[i] !== "AGV_HOME") {
      map.points[i] = `AGV_P${counter++}`;
    }
  }
}

function addMapPoint(mapId) {
  const map = exhibitionMaps.find((item) => item.id === mapId);
  if (!map) return;
  map.points.push("AGV_P_NEW");
  renumberMapPoints(map);
  const lastPoint = map.points[map.points.length - 1];
  openMapPointsModal(mapId);
  toast(`已新增点位 ${lastPoint}`);
}

function removeMapPoint(mapId, index) {
  const map = exhibitionMaps.find((item) => item.id === mapId);
  if (!map) return;
  if (map.points[index] === "AGV_HOME") { toast("AGV_HOME 为系统必有点位，不可删除"); return; }
  map.points.splice(index, 1);
  renumberMapPoints(map);
  openMapPointsModal(mapId);
  toast("已删除点位，序号已重排");
}

function openExhibitManager(mapId) {
  const map = exhibitionMaps.find((item) => item.id === mapId) || exhibitionMaps[0];
  openModal(`
    <div class="modal full">
      <div class="modal-header"><div class="modal-title">展品管理</div><button class="modal-close" onclick="closeModal()">×</button></div>
      <div class="modal-body">
        <div class="toolbar">
          <div class="filters"><input class="input w-220" placeholder="输入展品名称搜索" /><button class="btn">⌕ 查询</button></div>
          <button class="btn" onclick="toast('批量上传展品图片')">批量上传展品图片</button>
        </div>
        <div class="upload-hint">只能上传jpg/png文件，且不超过5MB，文件名称作为展品名称</div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>序号</th><th>展品图</th><th>展品名称</th><th>展品描述</th><th>讲解文案</th><th>地图点位</th><th>操作</th></tr></thead>
            <tbody>${map.exhibits.map((item, index) => `<tr><td>${index + 1}</td><td><div class="product-img product-a">${item.image}</div></td><td>${item.name}</td><td class="left">${item.desc || ""}</td><td class="left">${item.script || ""}</td><td><select class="select w-220"><option>选择点位</option>${map.points.map((point) => `<option ${point === item.point ? "selected" : ""}>${point}</option>`).join("")}</select></td><td><button class="link" onclick="openExhibitEditor('${map.id}', ${item.id})">编辑</button> <button class="link danger">删除</button></td></tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="closeModal()">关闭</button></div>
    </div>
  `);
}

function openExhibitEditor(mapId, exhibitId) {
  const map = exhibitionMaps.find((item) => item.id === mapId) || exhibitionMaps[0];
  const item = map.exhibits.find((exhibit) => exhibit.id === exhibitId) || map.exhibits[0];
  openModal(`
    <div class="modal full">
      <div class="modal-header"><div class="modal-title">编辑展品</div><button class="modal-close" onclick="openExhibitManager('${map.id}')">×</button></div>
      <div class="modal-body">
        <div class="exhibit-edit-layout">
          <div class="exhibit-preview"><strong>展品图</strong><div class="cover-img ${item.id % 2 ? "avatar-a" : "avatar-b"}">${item.image}</div><button class="btn">重新上传</button></div>
          <div class="exhibit-form">
            ${mapFormInput("展品名称", item.name, true)}
            <div class="form-row top"><div class="form-label">展品描述</div><div><textarea class="textarea" placeholder="输入展品描述...">${item.desc}</textarea></div></div>
            <div class="form-row top"><div class="form-label">讲解文案</div><div><textarea class="textarea" placeholder="输入讲解文案...">${item.script}</textarea><button class="btn small" style="margin-top:12px;">AI生成音频</button></div></div>
            <div class="form-row"><div class="form-label">地图点位</div><div><select class="select w-260">${map.points.map((point) => `<option ${point === item.point ? "selected" : ""}>${point}</option>`).join("")}</select></div></div>
          </div>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="openExhibitManager('${map.id}')">取消</button><button class="btn" onclick="openExhibitManager('${map.id}');toast('展品已保存')">保存</button></div>
    </div>
  `);
}

function renderScriptFlowPage() {
  const anchor = currentAnchorTemplate();
  const stages = currentStages();
  const stage = currentStage();
  const script = currentScript();
  const isOfflineStage = stage.type === "线下互动";
  const isLiveScript = script.type === "直播";

  if (scriptFlowView === "list") return renderScriptFlowList();

  return `
    <div class="flow-page">
      ${renderTaskInfoBar(anchor, script)}

      <section class="flow-workbench">
        ${renderStageTimeline(stages)}
        <main class="flow-main ${isOfflineStage ? "offline-only" : ""}">
          ${renderStageBaseCard(anchor, stage)}
          ${renderPerformanceCard(stage)}
        </main>
      </section>

	      <div class="flow-bottom-bar">
	        <div class="flow-save-time">◷ ${script.isTemplate ? "模板脚本：仅查看" : "最近保存：2分钟前"}</div>
	        <div class="flow-bottom-actions">
	          <button class="btn" type="button" ${script.isTemplate ? "disabled" : ""} onclick="saveAndDeployScript()">保存并下发机器人${handoffMark("保存并下发机器人", "保存脚本草稿并同步到绑定机器人，机器人当前执行脚本会切换为本脚本。")}</button>
	        </div>
	      </div>
    </div>
  `;
}

function renderScriptFlowList() {
  return `
    <div class="flow-page">
      ${handoffNote("脚本管理为本次新增菜单，覆盖脚本列表、脚本编辑、阶段时间线、阶段表演配置、商品/地图/机器人关联。", "新增菜单", "旧版后台无脚本管理；开发交付时需按新业务模块整体实现。", "new")}
      <div class="toolbar flow-list-toolbar">
        <div class="filters">
          <input class="input w-220" placeholder="搜索脚本名称 / ID" />
          <select class="select w-150"><option>全部类型</option><option>直播</option><option>导览</option><option>剧目</option><option>活动</option></select>
          <select class="select w-150"><option>全部状态</option><option>草稿</option><option>已发布</option></select>
          <button class="btn" type="button" onclick="toast('已查询脚本')">查询</button>
        </div>
        <button class="btn" type="button" onclick="toast('已创建空白脚本草稿')">新建空白脚本</button>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>脚本ID</th>
              <th>脚本名称</th>
              <th>脚本类型</th>
	              <th>主播类型</th>
	              <th>所属机器人</th>
	              <th>阶段数</th>
	              <th>绑定表演</th>
	              <th>状态</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${scriptFlowScripts
              .filter((script) => !script.isTemplate)
              .map(
                (script) => `
                <tr>
                  <td>${script.id}</td>
	                  <td class="left"><strong>${script.name}</strong></td>
	                  <td>${script.type}</td>
	                  <td>${anchorName(script.anchorType)}</td>
	                  <td class="robot-cell"><strong>${script.robotId}</strong><span>${script.robotName}</span></td>
	                  <td>${script.stageCount}</td>
	                  <td>${script.showCount}</td>
	                  <td><span class="mini-tag ${script.status === "已发布" ? "green" : "orange"}">${script.status}</span></td>
	                  <td>${script.updated}</td>
	                  <td class="nowrap">
	                    <button class="link" type="button" onclick="copyScript('${script.id}')">复制</button>
	                    <button class="link" type="button" onclick="openScriptEditor('${script.id}')">编辑</button>
	                    <button class="link danger" type="button" onclick="deleteScript('${script.id}')">删除</button>
	                  </td>
	                </tr>
              `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTaskInfoBar(anchor, script) {
  const productSummary = scriptProductSummary(script.id);
  const isLiveScript = script.type === "直播";
  const isCommerceLive = isLiveScript && selectedAnchorType === "commerce";
  const isTourScript = script.type === "导览";
  const selectedRole = roles.find((role) => role.id === script.robotId);
  const map = exhibitionMaps.find((item) => item.id === (script.mapId || selectedMapId));
  const versionWarning = isTourScript && selectedRole && selectedRole.version !== "AGV机器人";
  const disabled = script.isTemplate ? "disabled" : "";
  return `
    <section class="flow-info-strip compact stable ${script.isTemplate ? "view-only" : ""} ${isLiveScript ? "live-script" : "generic-script"} ${isTourScript ? "tour-script" : ""}">
      <label class="flow-info-control meta-name">
        <span>脚本名称${handoffMark("脚本名称检索", "脚本名称同步展示在脚本列表、机器人下发记录和直播间脚本选择器，需支持按名称检索。", "info")}</span>
        <input class="input" value="${script.name}" ${disabled} oninput="updateScriptField('name', this.value)" />
      </label>
      <label class="flow-info-control meta-type">
        <span>脚本类型${handoffMark("脚本类型工作区", "脚本类型决定页面工作区：直播展示主播类型和商品关联；导览展示地图/点位；剧目/活动使用线下流程配置。", "info")}</span>
        <select class="select" ${disabled} onchange="changeScriptType(this.value)">
          ${["直播", "导览", "剧目", "活动"].map((item) => `<option ${item === script.type ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </label>
      <label class="flow-info-control meta-anchor live-slot ${isLiveScript ? "" : "ghost-field"}">
        <span>主播类型${handoffMark("主播类型模板", "直播脚本通过主播类型带入默认阶段模板和阶段默认配置。", "info")}</span>
        <select class="select" ${disabled} onchange="changeAnchorType(this.value)">
          ${anchorTemplates.map((item) => `<option value="${item.id}" ${item.id === selectedAnchorType ? "selected" : ""}>${item.name}</option>`).join("")}
        </select>
      </label>
      <label class="flow-info-control meta-robot">
        <span>绑定机器人${handoffMark("绑定机器人下发目标", "保存并下发时写入机器人当前执行脚本；导览脚本仅允许绑定 AGV 机器人。", "info")}</span>
        <select class="select" ${disabled} onchange="updateScriptRobot(this.value)">
          ${roles.map((role) => `<option value="${role.id}" ${role.id === script.robotId ? "selected" : ""}>${role.id} / ${role.name} / ${role.version}</option>`).join("")}
        </select>
      </label>
      <div class="flow-info-control meta-product live-slot ${isCommerceLive ? "" : "ghost-field"}">
        <span>关联商品${handoffMark("直播商品池关联", "带货直播脚本需要先建立商品池；阶段内再按单选或多选规则绑定适用商品。", "info")}</span>
        <button class="product-bind-entry" type="button" ${disabled} onclick="openScriptProductsModal()">
          ${productSummary.total}个
          ${productSummary.primary ? `<em title="${productSummary.primary.title}">主推 ${productSummary.primary.title.slice(0, 10)}</em>` : "<em>未设置</em>"}
        </button>
      </div>
      <div class="flow-info-control meta-product ${isTourScript ? "" : "ghost-field"}">
        <span>关联地图${handoffMark("导览地图关联", "导览脚本关联地图后，阶段名称和适用点位从地图点位列表中选择。", "info")}</span>
        <button class="product-bind-entry map-bind-entry" type="button" ${disabled} onclick="openScriptMapPicker()">
          ${map ? map.mapName : "未关联"}
          <em>${map ? `${map.points.length} 个点位` : "请选择"}</em>
        </button>
      </div>
    </section>
  `;
}

function renderAnchorTemplateSelector(anchor) {
  return `
    <section class="flow-card template-selector">
      <div class="flow-card-head">
        <div>
          <h2>主播类型与流程模板</h2>
          <p>当前绑定：${anchor.name} / ${anchor.templateName}</p>
        </div>
        <div class="template-fields">
          <label>主播类型
            <select class="select" onchange="changeAnchorType(this.value)">
              ${anchorTemplates.map((item) => `<option value="${item.id}" ${item.id === selectedAnchorType ? "selected" : ""}>${item.name}</option>`).join("")}
            </select>
          </label>
          <label>流程模板
            <select class="select" onchange="changeAnchorType(this.value)">
              ${anchorTemplates.map((item) => `<option value="${item.id}" ${item.id === selectedAnchorType ? "selected" : ""}>${item.templateName}</option>`).join("")}
            </select>
          </label>
        </div>
      </div>
      ${handoffNote("模板说明：根据主播类型自动生成默认流程阶段和阶段默认配置。切换主播类型将重新生成默认阶段。")}
    </section>
  `;
}

function renderStageTimeline(stages) {
  return `
    <aside class="flow-card stage-panel">
      <div class="flow-card-head tight">
        <h2>阶段时间线${handoffMark("阶段时间线编排", "左侧阶段支持选中编辑、拖拽排序、新增和删除；当前阶段在右侧同步展示配置表单。", "info")}</h2>
        <div class="stage-head-actions">
          <button class="stage-icon-button" type="button" aria-label="新增阶段" title="新增阶段" onclick="addStage()"><span class="stage-plus-icon">+</span></button>
        </div>
      </div>
      <div class="stage-list">
        ${handoffMark("阶段类型标签显示", "阶段类型为真人互动或等待时在卡片显示类型标签，便于开发和运营快速识别特殊工作区。", "info")}
        ${stages.map((stage, index) => renderTimelineStageItem(stage, index)).join("")}
      </div>
    </aside>
  `;
}

function renderTimelineStageItem(stage, index) {
  const active = stage.id === selectedStageId;
  const stageType = stage.type || "普通流程";
  const emphasis = stageType === "真人互动" || stageType === "等待";
  const typeTag = emphasis ? `<span class="mini-tag ${stageType === "真人互动" ? "cyan" : "orange"}">${stageType}</span>` : "";
  return `
    <div
      class="stage-item ${active ? "active" : ""} ${emphasis ? "focus-stage" : "muted-stage"}"
      draggable="true"
      onclick="selectStage('${stage.id}')"
      ondragstart="startStageDrag(${index})"
      ondragover="event.preventDefault()"
      ondrop="dropStage(${index})"
    >
      <span class="stage-drag" title="拖拽排序">⋮⋮</span>
      <span class="stage-dot">${stage.order}</span>
      <span class="stage-body">
        <span class="stage-top">
          <strong>${stage.name || "未命名阶段"}</strong>
          <span class="stage-actions">
            <button class="stage-delete" type="button" aria-label="删除阶段" onclick="event.stopPropagation();deleteStage(${index})">×</button>
          </span>
        </span>
        ${typeTag ? `<span class="stage-tags">${typeTag}</span>` : ""}
      </span>
    </div>
  `;
}

function renderStageBaseCard(anchor, stage) {
  const script = currentScript();
  const typeOptions = ["普通流程", "真人互动", "等待"];
  const nameField =
    script.type === "导览"
      ? agvNameField(stage)
      : textField(`阶段名称${handoffMark("阶段名称同步", "阶段名称展示在时间线、阶段配置和下发后的执行明细中。", "info")}`, stage.name || "", `updateStageField('${stage.id}', 'name', this.value)`);
  const productField = renderStageProductField(anchor, stage);
  const pointField = renderStagePointField(stage);
  const specialConfig = renderStageSpecialConfig(stage);
  return `
    <section class="flow-card">
      <div class="flow-card-head"><h2>A. 阶段基础信息${handoffMark("阶段基础信息范围", "维护阶段名称、阶段类型、模式，以及直播商品或导览点位等业务上下文。", "info")}</h2></div>
      <div class="form-compact-grid stage-base-grid">
        ${nameField}
        ${selectField(`阶段类型${handoffMark("阶段类型工作区", "普通流程：配置表演和等待；真人互动：配置互动时长/对话模式；等待：配置等待时长，机器人只听不说。", "info")}`, stage.type || "普通流程", typeOptions, `updateStageType('${stage.id}', this.value)`)}
        ${stageModeField(stage)}
      </div>
      ${productField}
      ${pointField}
      ${specialConfig}
    </section>
  `;
}

function renderPerformanceCard(stage) {
  const boundShowIds = stageBoundShowIds(stage);
  const allShows = allAvailableShows();
  const boundShows = boundShowIds.map((id) => allShows.find((show) => String(show.id) === String(id))).filter(Boolean);
  return `
    <section class="flow-card">
      <div class="flow-card-head">
        <div>
          <h2>B. 阶段流程配置${handoffMark("阶段表演绑定", "阶段可绑定一个或多个表演，支持拖拽排序、编辑源表演、解除绑定和配置表演后等待秒数。", "info")}</h2>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn small" type="button" onclick="openStageShowPicker()">绑定表演</button>${handoffMark("阶段绑定已有表演", "阶段表演拆分为绑定表演和新增表演两个入口。绑定表演从公共模板大库和机器人表演清单中选择已有表演。")}
          <button class="btn small secondary" type="button" onclick="openStageNewShow()">＋ 新增</button>${handoffMark("阶段内新建表演", "新增表演直接在阶段内创建并保存到当前机器人表演清单，不跳转页面。")}
        </div>
      </div>
      <div class="form-compact-grid two performance-logic-row">
        ${showExecutionLogicField(stage)}
        ${currentScript().type === "导览" ? selectField("执行时机", stage.executionTiming || "到达后执行", ["到达后执行", "移动中执行"], `updateStageField('${stage.id}', 'executionTiming', this.value)`) : ""}
      </div>
      <div class="bound-show-list">
        ${
          boundShows.length
            ? boundShows
          .map(
            (show, index) => `
            <div
              class="bound-show-row"
              draggable="true"
              ondragstart="startStageShowDrag(${index})"
              ondragover="event.preventDefault()"
              ondrop="dropStageShow(${index})"
            >
              <div class="bound-order" title="拖拽排序">⋮⋮</div>
              <div class="bound-show-main">
                <button class="show-title-button" type="button" onclick="openShowViewModal('${show.name}')">${show.name}</button>
                <span>演出ID：${show.id}　归属：${show.owner}　单元：${show.units}</span>
              </div>
              <label class="bound-wait-field">
                <span>等待</span>
                <div class="number-field tiny"><input class="input" type="number" min="0" value="${stageShowWait(stage, show.id)}" oninput="updateStageShowWait('${stage.id}', '${show.id}', this.value)" /><em>秒</em></div>
              </label>
              <div class="bound-actions">
                <button class="link" type="button" onclick="editShowSource('${show.name}')">编辑源</button>${handoffMark("表演源编辑返回", "编辑表演源保存后停留在当前脚本编辑页面，不再跳转到表演管理大库。", "changed")}
                <button class="link danger" type="button" onclick="removeStageShow(${show.id})">解除</button>
              </div>
            </div>
          `,
          )
          .join("")
            : `<div class="bound-show-empty"><button class="btn secondary small" type="button" onclick="openStageShowPicker()">绑定表演</button></div>`
        }
      </div>
    </section>
  `;
}

function agvNameField(stage) {
  const suffix = (stage.name || "AGV_").replace(/^AGV_/, "");
  return `
    <label class="field-block">
      <span>阶段名称${handoffMark("导览规则", "导览阶段名称固定使用 AGV_ 前缀，便于和地图点位及机器人移动指令对齐。", "info")}</span>
      <div class="agv-name-input"><strong>AGV_</strong><input class="input" value="${suffix}" oninput="updateStageField('${stage.id}', 'name', 'AGV_' + this.value.replace(/^AGV_/, ''))" /></div>
    </label>
  `;
}

function currentScriptMap() {
  const script = currentScript();
  return exhibitionMaps.find((item) => item.id === (script.mapId || selectedMapId)) || exhibitionMaps[0];
}

function renderStagePointField(stage) {
  if (currentScript().type !== "导览") return "";
  const map = currentScriptMap();
  const point = stage.point || map.points[1] || "AGV_HOME";
  return `
    <div class="stage-product-field">
      <div class="stage-product-head">
        <div><strong>适用点位${handoffMark("导览规则", "每个导览阶段绑定一个地图点位，数据源来自当前脚本关联地图。", "info")}</strong><span class="mini-tag gray">单选</span></div>
        <button class="link" type="button" onclick="openMapPointsModal('${map.id}')">点位列表</button>
      </div>
      <select class="select stage-product-select" onchange="updateStageField('${stage.id}', 'point', this.value);renderApp()">
        ${map.points.map((item) => `<option ${item === point ? "selected" : ""}>${item}</option>`).join("")}
      </select>
      <div class="flow-subtext">数据源来自「展览地图管理」中的当前地图点位列表。</div>
    </div>
  `;
}

function renderStageSpecialConfig(stage) {
  if (stage.type === "真人互动") {
    return `
      <div class="stage-special-config">
        ${numberField("互动时长", stage.interactionDuration || "3", "分钟", `updateStageField('${stage.id}', 'interactionDuration', this.value)`)}
        ${stage.name === "等待衔接" ? "" : selectField("对话模式", stage.dialogueMode || "自然对话", ["自然对话", "按钮对话"], `updateStageField('${stage.id}', 'dialogueMode', this.value)`)}
      </div>
    `;
  }
  if (stage.type === "等待") {
    return `
      <div class="stage-special-config">
        ${numberField("等待时长", stage.waitDuration || "3", "分钟", `updateStageField('${stage.id}', 'waitDuration', this.value)`)}
        <div class="flow-note orange">等待阶段默认流程优先，机器人只听不说，不需要配置对话模式。</div>
      </div>
    `;
  }
  return "";
}

function openScriptMapPicker() {
  const script = currentScript();
  openModal(`
    <div class="modal medium">
      <div class="modal-header"><div class="modal-title">关联地图</div><button class="modal-close" onclick="closeModal()">×</button></div>
      <div class="modal-body">
        <div class="table-wrap">
          <table class="data-table compact-table">
            <thead><tr><th>选择</th><th>地图名称</th><th>展馆名称</th><th>展览名称</th><th>点位数</th></tr></thead>
            <tbody>${exhibitionMaps.map((map) => `<tr onclick="selectScriptMap('${map.id}')"><td><input type="radio" ${script.mapId === map.id ? "checked" : ""} /></td><td>${map.mapName}</td><td>${map.venueName}</td><td>${map.exhibitionName}</td><td>${map.points.length}</td></tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="closeModal()">取消</button><button class="btn" onclick="closeModal();renderApp()">确定</button></div>
    </div>
  `);
}

function selectScriptMap(mapId) {
  currentScript().mapId = mapId;
  selectedMapId = mapId;
  toast("地图已关联，阶段点位列表已更新");
  openScriptMapPicker();
}

function renderRobotPage() {
  return `
    <div class="toolbar">
      <div class="filters">
        <input class="input w-180" placeholder="机器人ID/名称" />
        <select class="select w-120"><option>机器人类型</option><option>直播</option><option>表演</option><option>AGV</option></select>
        <select class="select w-120"><option>场景类型</option><option>聊天</option><option>电商</option></select>
        <select class="select w-120"><option>状态</option><option>正常</option><option>异常</option></select>
        <button class="btn" type="button" onclick="toast('已查询机器人')">⌕ 查询</button>
        <button class="btn" type="button" onclick="openCreateRobot('role')">＋ 创建机器人</button>
        <button class="btn secondary" type="button" onclick="openBatchCreateRobot()">批量创建机器人</button>${handoffMark("机器人批量创建", "机器人管理新增批量创建机器人：支持下载模板、上传解析、预览、确认导入和结果报告。")}
      </div>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Robot ID</th>
            <th>模式</th>
            <th>头像</th>
            <th>名称</th>
            <th>状态</th>
            <th>音色</th>
            <th>大模型</th>
            <th>版本</th>
            <th>直播话术</th>
            <th>关键词回复话术</th>
            <th>是否启用</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${robots
            .map(
              (robot) => `
              <tr>
                <td><button class="link" type="button" onclick="openRobotEditor('${robot.id}', 'role')">${robot.id}</button></td>
                <td><span class="tag">${robot.mode}</span></td>
                <td><div class="avatar-img ${robot.avatarClass}">${robot.avatar}</div></td>
                <td><strong>${robot.name}</strong></td>
                <td><span class="tag red">异常</span><br /><button class="link">查看详情</button></td>
                <td>${robot.voice}　🎧</td>
                <td>${robot.model}</td>
                <td>${robot.version}<br /><span class="mini-tag gray">${robot.year || "2026"}</span></td>
                <td>${robot.scripts}组<br /><button class="btn secondary small">设置</button></td>
                <td>${robot.keywords}组<br /><button class="btn ${robot.keywords ? "" : "secondary"} small">${robot.keywords ? "修改" : "设置"}</button></td>
                <td><span class="switch on"></span></td>
                <td class="nowrap robot-actions">
                  <button class="link" type="button" onclick="toast('已打开绑定用户')">绑定用户</button>
                  <details class="more-menu">
                    <summary>更多</summary>
                    <div class="more-menu-panel">
                      <button type="button" onclick="openRobotEditor('${robot.id}', 'role')">查看</button>
                      <button type="button" onclick="copyRobotWsAddress('${robot.id}')">复制WS地址</button>
                      <button type="button" onclick="openRobotEditor('${robot.id}', 'device')">配置参数</button>
                      <button type="button" onclick="openRobotWifiSettings('${robot.id}')">Wi-Fi设置</button>
                      <button class="danger" type="button" onclick="deleteRobot('${robot.id}')">删除</button>
                    </div>
                  </details>
                </td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    ${pagination(92, 10)}
  `;
}

function openBatchCreateRobot() {
  batchRobotPreview = null;
  batchRobotResult = null;
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">批量创建机器人</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="batch-create-steps">
          ${["下载模板", "填写配置", "上传解析", "导入预览", "确认导入", "生成结果"].map((step, index) => `<div class="batch-step ${index === 0 ? "active" : ""}"><span>${index + 1}</span>${step}</div>`).join("")}
        </div>
        <div class="batch-create-hero">
          <div>
            <h3>按「角色设定 + 设备管理」批量创建机器人</h3>
            <p>模板字段覆盖当前创建机器人弹窗中的人设、头像、语种、音色、大模型、硬件、售卖租赁、运行、交互和动作配置。导入对象统一叫机器人。</p>
          </div>
          <div class="batch-create-actions">
            <button class="btn" type="button" onclick="downloadBatchRobotTemplate()">下载模板</button>
            <button class="btn secondary" type="button" onclick="document.getElementById('robotBatchFileInput').click()">上传 Excel</button>
            <input id="robotBatchFileInput" type="file" accept=".xls,.xlsx,.csv,.txt" hidden onchange="handleRobotBatchFile(event)" />
          </div>
        </div>
        <div class="batch-create-grid">
          <div class="batch-create-card">
            <h4>模板内容</h4>
            <ul>
              <li>标准表头、字段说明、示例数据和必填标识。</li>
              <li>枚举字段列出可选项，方便运营按下拉值填写。</li>
              <li>头像字段填写图片 URL 或素材文件 ID。</li>
            </ul>
          </div>
          <div class="batch-create-card">
            <h4>导入校验</h4>
            <ul>
              <li>校验必填、字段格式、枚举值、图片素材引用。</li>
              <li>机器人名称和机器人编码做唯一性校验。</li>
              <li>预览拆成新增机器人、已存在机器人、异常数据。</li>
            </ul>
          </div>
          <div class="batch-create-card">
            <h4>覆盖规则</h4>
            <ul>
              <li>已存在机器人默认不覆盖。</li>
              <li>勾选后仅覆盖可编辑配置字段。</li>
              <li>历史直播任务、操作日志、导入记录不删除。</li>
            </ul>
          </div>
        </div>
        <div class="batch-template-preview">
          <div class="batch-template-title">模板字段预览</div>
          <div class="batch-template-groups">
            ${robotBatchFieldGroups
              .map(
                (group) => `
                <div class="batch-template-group">
                  <strong>${group.group}</strong>
                  <span>${group.fields.length} 个字段</span>
                </div>
              `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn secondary" onclick="buildDemoRobotPreview()">使用示例数据预览</button>
        <button class="btn" onclick="downloadBatchRobotTemplate()">下载模板</button>
      </div>
    </div>
  `);
}

function downloadBatchRobotTemplate() {
  const fields = getRobotBatchFields();
  const sampleRow = buildTemplateSampleRow();
  const instructionRows = fields
    .map(
      (field) => `
        <tr>
          <td>${escapeHtml(field.group)}</td>
          <td>${escapeHtml(field.name)}</td>
          <td>${field.required ? "是" : "否"}</td>
          <td>${field.unique ? "是" : "否"}</td>
          <td>${escapeHtml(field.desc || "")}</td>
          <td>${escapeHtml((field.options || []).join(" / "))}</td>
          <td>${escapeHtml(field.sample || "")}</td>
        </tr>
      `,
    )
    .join("");
  const headerCells = fields.map((field) => `<th>${escapeHtml(field.name)}</th>`).join("");
  const sampleCells = fields.map((field) => `<td>${escapeHtml(sampleRow[field.name] || "")}</td>`).join("");
  const blankCells = fields.map(() => "<td></td>").join("");
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, "Microsoft YaHei", sans-serif; }
          table { border-collapse: collapse; margin-bottom: 18px; }
          th, td { border: 1px solid #cfd8e3; padding: 8px; mso-number-format:"\\@"; }
          th { background: #eef5ff; font-weight: 700; }
          .title { font-size: 20px; font-weight: 700; margin: 12px 0; }
        </style>
      </head>
      <body>
        <div class="title">批量创建机器人模板</div>
        <table>
          <tr><th>字段分组</th><th>字段名称</th><th>必填</th><th>唯一</th><th>字段说明</th><th>枚举选项</th><th>示例数据</th></tr>
          ${instructionRows}
        </table>
        <div class="title">填写区</div>
        <table data-role="robot-entry">
          <tr>${headerCells}</tr>
          <tr>${sampleCells}</tr>
          <tr>${blankCells}</tr>
        </table>
      </body>
    </html>
  `;
  downloadBlob("\ufeff" + html, "批量创建机器人模板.xls", "application/vnd.ms-excel;charset=utf-8");
  toast("已生成批量创建机器人模板");
}

function downloadShowImportTemplate() {
  const headers = ["表演名称", "单元序号", "表演文本", "动作名称", "完整执行逻辑", "随机条数", "逻辑执行次数", "执行时长(分钟)", "结束依据", "单元执行次数", "等待时长(秒)"];
  const rows = [
    ["关羽-迎宾导入样例", "1", "欢迎大家来到直播间。", "挥舞左手", "顺序执行", "", "1", "", "文本结束", "1", "0"],
    ["关羽-迎宾导入样例", "2", "接下来我会为大家介绍今天的亮点。", "抬起右手", "随机执行", "1", "", "", "动作结束", "1", "1"],
    ["关羽-顺序讲解样例", "1", "请大家跟随我的节奏继续了解。", "点头", "顺序执行", "", "3", "", "全部结束", "1", "0"],
    ["关羽-定时讲解样例", "1", "下面进入定时讲解环节。", "站姿", "顺序执行指定时长", "", "", "5", "文本结束", "1", "0"],
  ];
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, "Microsoft YaHei", sans-serif; }
          table { border-collapse: collapse; }
          th, td { border: 1px solid #cfd8e3; padding: 8px; mso-number-format:"\\@"; }
          th { background: #eef5ff; font-weight: 700; }
        </style>
      </head>
      <body>
        <table data-role="show-import">
          <tr>${headers.map((item) => `<th>${escapeHtml(item)}</th>`).join("")}</tr>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
        </table>
      </body>
    </html>
  `;
  downloadBlob("\ufeff" + html, "完整表演批量导入模板.xls", "application/vnd.ms-excel;charset=utf-8");
  toast("已下载完整表演批量导入Excel模板");
}

function handleRobotBatchFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const isBinaryExcel = /\.xlsx$/i.test(file.name);
  file
    .text()
    .then((text) => {
      if (isBinaryExcel && !text.includes("data-role=\"robot-entry\"")) {
        toast("当前原型不解析二进制 xlsx，请接入后端解析服务或上传模板 xls/csv");
        return;
      }
      const rows = parseRobotImportText(text);
      if (!rows.length) {
        toast("未识别到可导入数据，请检查模板填写区");
        return;
      }
      batchRobotPreview = buildRobotImportPreview(rows);
      openBatchRobotPreview();
    })
    .catch(() => toast("文件读取失败，请重新上传"));
  event.target.value = "";
}

function buildDemoRobotPreview() {
  batchRobotPreview = buildRobotImportPreview([
    buildTemplateSampleRow(),
    {
      ...buildTemplateSampleRow(),
      "机器人名称": "小暖",
      "机器人编码": "142",
      "应用场景": "情感陪伴",
      "选择音色": "637-干练的播客主持人（普通话）",
    },
    {
      ...buildTemplateSampleRow(),
      "机器人名称": "",
      "机器人编码": "RBT201",
      "方形头像": "",
      "大模型厂商": "未知模型",
      "话术间隔": "abc",
    },
  ]);
  openBatchRobotPreview();
}

function openBatchRobotPreview() {
  if (!batchRobotPreview) {
    openBatchCreateRobot();
    return;
  }
  const preview = batchRobotPreview;
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">批量创建机器人 - 导入预览</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="batch-create-steps">
          ${["下载模板", "填写配置", "上传解析", "导入预览", "确认导入", "生成结果"].map((step, index) => `<div class="batch-step ${index === 3 ? "active" : ""}"><span>${index + 1}</span>${step}</div>`).join("")}
        </div>
        <div class="import-summary">
          ${summaryCard("新增机器人", preview.newRobots.length, "green")}
          ${summaryCard("已存在机器人", preview.existingRobots.length, "blue")}
          ${summaryCard("异常数据", preview.exceptions.length, "red")}
        </div>
        ${robotPreviewPanel("新增机器人列表", preview.newRobots, "new")}
        ${robotPreviewPanel("已存在机器人列表", preview.existingRobots, "existing")}
        ${robotPreviewPanel("异常数据列表", preview.exceptions, "error")}
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="openBatchCreateRobot()">返回</button>
        ${preview.exceptions.length ? `<button class="btn secondary" onclick="downloadRobotErrorReport()">下载错误报告</button>` : ""}
        <button class="btn" onclick="confirmBatchRobotImport()">确认导入</button>
      </div>
    </div>
  `);
}

function openBatchRobotResult() {
  const result = batchRobotResult || { created: 0, overwritten: 0, skipped: 0, failed: 0, errors: [] };
  openModal(`
    <div class="modal medium">
      <div class="modal-header">
        <div class="modal-title">批量创建机器人 - 导入结果</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="batch-create-steps">
          ${["下载模板", "填写配置", "上传解析", "导入预览", "确认导入", "生成结果"].map((step, index) => `<div class="batch-step ${index === 5 ? "active" : ""}"><span>${index + 1}</span>${step}</div>`).join("")}
        </div>
        <div class="import-summary">
          ${summaryCard("新增成功", result.created, "green")}
          ${summaryCard("覆盖成功", result.overwritten, "blue")}
          ${summaryCard("跳过覆盖", result.skipped, "gray")}
          ${summaryCard("失败数据", result.failed, "red")}
        </div>
        <div class="result-note">
          已存在机器人只有勾选后才覆盖；异常数据未导入。历史直播任务、操作日志和导入记录保持不变。
        </div>
        ${result.errors.length ? robotPreviewPanel("失败原因明细", result.errors, "error") : `<div class="empty-hint">没有失败数据</div>`}
      </div>
      <div class="modal-footer">
        ${result.errors.length ? `<button class="btn secondary" onclick="downloadRobotErrorReport()">下载错误报告</button>` : ""}
        <button class="btn" onclick="closeModal();renderApp()">完成</button>
      </div>
    </div>
  `);
}

function confirmBatchRobotImport() {
  if (!batchRobotPreview) return;
  const selectedOverwriteRows = new Set(
    Array.from(document.querySelectorAll("[data-overwrite-row]:checked")).map((input) => String(input.getAttribute("data-overwrite-row"))),
  );
  let created = 0;
  let overwritten = 0;
  batchRobotPreview.newRobots.forEach((item) => {
    robots.unshift(robotFromImportRow(item.row));
    created += 1;
  });
  batchRobotPreview.existingRobots.forEach((item) => {
    if (!selectedOverwriteRows.has(String(item.rowNumber))) return;
    const target = findExistingRobot(item.row);
    if (!target) return;
    applyRobotImportRow(target, item.row);
    overwritten += 1;
  });
  batchRobotResult = {
    created,
    overwritten,
    skipped: batchRobotPreview.existingRobots.length - overwritten,
    failed: batchRobotPreview.exceptions.length,
    errors: batchRobotPreview.exceptions,
  };
  openBatchRobotResult();
  toast("机器人导入已完成");
}

function robotPreviewPanel(title, items, type) {
  const emptyText = type === "error" ? "暂无异常数据" : type === "existing" ? "暂无已存在机器人" : "暂无新增机器人";
  if (!items.length) {
    return `<div class="preview-panel"><div class="preview-panel-title">${title}</div><div class="empty-hint">${emptyText}</div></div>`;
  }
  return `
    <div class="preview-panel">
      <div class="preview-panel-title">${title}</div>
      <div class="preview-table-wrap">
        <table class="data-table preview-table">
          <thead>
            <tr>
              ${type === "existing" ? "<th>覆盖</th>" : ""}
              <th>行号</th>
              <th>机器人名称</th>
              <th>机器人编码</th>
              <th>机器人型号</th>
              <th>应用场景</th>
              <th>音色</th>
              <th>大模型</th>
              <th>${type === "error" ? "错误原因" : "处理方式"}</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
                  <tr>
                    ${type === "existing" ? `<td><input type="checkbox" data-overwrite-row="${item.rowNumber}" /></td>` : ""}
                    <td>${item.rowNumber}</td>
                    <td>${escapeHtml(item.row["机器人名称"] || "-")}</td>
                    <td>${escapeHtml(item.row["机器人编码"] || "-")}</td>
                    <td>${escapeHtml(item.row["机器人型号"] || "-")}</td>
                    <td>${escapeHtml(item.row["应用场景"] || "-")}</td>
                    <td>${escapeHtml(item.row["选择音色"] || "-")}</td>
                    <td>${escapeHtml(item.row["大模型厂商"] || "-")}</td>
                    <td class="${type === "error" ? "error-cell" : ""}">${escapeHtml(type === "error" ? item.errors.join("；") : type === "existing" ? "勾选后覆盖" : "确认后创建")}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function buildRobotImportPreview(rows) {
  const normalizedRows = rows.map((row, index) => ({ ...row, __rowNumber: row.__rowNumber || index + 2 }));
  const nameCounts = countValues(normalizedRows, "机器人名称");
  const codeCounts = countValues(normalizedRows, "机器人编码");
  const preview = { newRobots: [], existingRobots: [], exceptions: [] };
  normalizedRows.forEach((row) => {
    const rowNumber = row.__rowNumber;
    const errors = validateRobotImportRow(row, nameCounts, codeCounts);
    const item = { rowNumber, row, errors };
    if (errors.length) {
      preview.exceptions.push(item);
    } else if (findExistingRobot(row)) {
      preview.existingRobots.push(item);
    } else {
      preview.newRobots.push(item);
    }
  });
  return preview;
}

function validateRobotImportRow(row, nameCounts, codeCounts) {
  const errors = [];
  getRobotBatchFields().forEach((field) => {
    const value = cleanCell(row[field.name]);
    if (field.required && !value) {
      errors.push(`${field.name}必填`);
    }
    if (value && field.options && !field.options.includes(value)) {
      errors.push(`${field.name}不在枚举范围内`);
    }
    if (value && field.type === "number") {
      const numberValue = Number(value);
      if (Number.isNaN(numberValue)) {
        errors.push(`${field.name}必须为数字`);
      } else {
        if (field.min !== undefined && numberValue < field.min) errors.push(`${field.name}不能小于${field.min}`);
        if (field.max !== undefined && numberValue > field.max) errors.push(`${field.name}不能大于${field.max}`);
      }
    }
  });
  if (cleanCell(row["大模型厂商"]) === "百炼" && !cleanCell(row["绑定智能体"])) {
    errors.push("百炼模型必须绑定智能体");
  }
  ["方形头像", "竖图头像", "直播间形象照"].forEach((fieldName) => {
    const value = cleanCell(row[fieldName]);
    if (value && !isAssetReference(value)) errors.push(`${fieldName}需填写图片URL或素材ID`);
  });
  const name = cleanCell(row["机器人名称"]);
  const code = cleanCell(row["机器人编码"]);
  if (name && nameCounts[name] > 1) errors.push("Excel内机器人名称重复");
  if (code && codeCounts[code] > 1) errors.push("Excel内机器人编码重复");
  return errors;
}

function parseRobotImportText(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.includes("data-role=\"robot-entry\"") || trimmed.includes("data-role='robot-entry'")) {
    const doc = new DOMParser().parseFromString(trimmed, "text/html");
    const table = doc.querySelector("[data-role='robot-entry'], [data-role=\"robot-entry\"]");
    if (!table) return [];
    const rows = Array.from(table.querySelectorAll("tr")).map((tr) => Array.from(tr.children).map((cell) => cleanCell(cell.textContent)));
    return rowsToObjects(rows);
  }
  const firstLine = trimmed.split(/\r?\n/)[0] || "";
  const delimiter = firstLine.includes("\t") ? "\t" : ",";
  const rows = trimmed
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => parseDelimitedLine(line, delimiter));
  return rowsToObjects(rows);
}

function rowsToObjects(rows) {
  const headers = (rows[0] || []).map((header) => cleanCell(header).replace(/^\ufeff/, ""));
  return rows
    .slice(1)
    .map((cells, index) => {
      const row = { __rowNumber: index + 2 };
      headers.forEach((header, cellIndex) => {
        row[header] = cleanCell(cells[cellIndex]);
      });
      return row;
    })
    .filter((row) => getRobotBatchFields().some((field) => cleanCell(row[field.name])));
}

function parseDelimitedLine(line, delimiter) {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function getRobotBatchFields() {
  return robotBatchFieldGroups.flatMap((group) => group.fields.map((field) => ({ ...field, group: group.group })));
}

function buildTemplateSampleRow() {
  return getRobotBatchFields().reduce((row, field) => {
    row[field.name] = field.sample || "";
    return row;
  }, {});
}

function findExistingRobot(row) {
  const name = cleanCell(row["机器人名称"]);
  const code = cleanCell(row["机器人编码"]);
  return robots.find((robot) => robot.name === name || robot.id === code || `RBT${robot.id}` === code || `RBT-${robot.id}` === code);
}

function robotFromImportRow(row) {
  const name = cleanCell(row["机器人名称"]) || "未命名机器人";
  const code = cleanCell(row["机器人编码"]) || `RBT${Date.now().toString().slice(-5)}`;
  return {
    id: code,
    mode: cleanCell(row["场景类型"]) || "对话",
    name,
    status: "正常",
    voice: cleanCell(row["选择音色"]) || "未配置",
    model: cleanCell(row["大模型厂商"]) || "未配置",
    version: cleanCell(row["机器人版本"]) || cleanCell(row["机器人型号"]) || "-",
    scripts: 0,
    keywords: 0,
    avatar: name.slice(0, 1),
    avatarClass: ["avatar-a", "avatar-b", "avatar-c", "avatar-d"][robots.length % 4],
  };
}

function applyRobotImportRow(robot, row) {
  const next = robotFromImportRow(row);
  robot.name = next.name;
  robot.mode = next.mode;
  robot.voice = next.voice;
  robot.model = next.model;
  robot.version = next.version;
  robot.avatar = next.avatar;
  robot.avatarClass = next.avatarClass;
}

function downloadRobotErrorReport() {
  const errors = batchRobotResult?.errors || batchRobotPreview?.exceptions || [];
  if (!errors.length) {
    toast("暂无错误报告");
    return;
  }
  const rows = [["行号", "机器人名称", "机器人编码", "错误原因"]].concat(
    errors.map((item) => [item.rowNumber, item.row["机器人名称"] || "", item.row["机器人编码"] || "", item.errors.join("；")]),
  );
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  downloadBlob("\ufeff" + csv, "批量创建机器人错误报告.csv", "text/csv;charset=utf-8");
  toast("错误报告已下载");
}

function summaryCard(label, value, tone) {
  return `<div class="summary-card ${tone}"><span>${label}</span><strong>${value}</strong></div>`;
}

function countValues(rows, fieldName) {
  return rows.reduce((counts, row) => {
    const value = cleanCell(row[fieldName]);
    if (value) counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function isAssetReference(value) {
  return /^https?:\/\//i.test(value) || /^[A-Za-z0-9_\-:./]{3,}$/.test(value);
}

function cleanCell(value) {
  return String(value ?? "").trim();
}

function csvCell(value) {
  const text = cleanCell(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return cleanCell(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJs(value) {
  return cleanCell(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "");
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function renderSkillPage() {
  return `
    <div class="toolbar">
      <div class="filters">
        <input class="input w-180" placeholder="ID/名称" />
        <select class="select w-120"><option>类型</option><option>动作</option><option>表演</option><option>视觉</option></select>
        <button class="btn" onclick="toast('已查询技能')">查询</button>
      </div>
      <div class="filters">
        <button class="btn" onclick="openSkillModal()">新增技能</button>
        <button class="btn" onclick="openBatchModal('skills')">批量下发</button>
      </div>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>技能名称</th>
            <th>类别</th>
            <th>归属</th>
            <th>触发条件</th>
            <th>触发结果</th>
            <th>状态</th>
            <th>创建日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${skills
            .map(
              (skill) => `
              <tr>
                <td>${skill.id}</td>
                <td class="left"><strong>${skill.name}</strong></td>
                <td>${skill.category}</td>
                <td>${skill.owner}</td>
                <td><span class="tag">${skill.trigger}</span></td>
                <td><span class="tag">${skill.result}</span></td>
                <td><span class="switch green on"></span></td>
                <td>${skill.created}</td>
                <td><button class="link" onclick="openSkillModal('${skill.name}')">编辑</button> | <button class="link">删除</button></td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    ${
      `${handoffMark("公共模板与用户模板边界", "公共模板仍在大库维护并可下发；用户模板不再混在大库里，进入机器人管理对应机器人的技能/表演清单维护。", "info")}${handoffMark("直播间事件触发入口", "新增直播间事件触发配置，编辑技能时可用直播间事件作为触发条件。")}`
    }
    ${pagination(78, 6)}
  `;
}

function renderShowPage() {
  const publicShows = shows.filter((show) => show.owner === "公共模板");
  return `
    <div class="toolbar">
      <div class="filters">
        <input class="input w-220" placeholder="⌕ ID/表演名称/用户昵称" />
        <select class="select w-180"><option>公共模板</option></select>
        <select class="select w-180"><option>状态</option><option>启用</option><option>停用</option></select>
        <button class="btn" onclick="toast('已查询表演')">查询</button>
        <button class="btn" onclick="openBatchModal('shows')">批量下发</button>
        <button class="btn secondary" onclick="openShowImportModal()">批量导入</button>${handoffMark("完整表演批量导入", "表演管理新增批量创建/批量导入完整表演，模板包含执行逻辑、随机条数、逻辑执行次数、执行时长等字段。")}
      </div>
      <button class="btn" onclick="openShowModal()">新增表演</button>
    </div>
    ${handoffNote("表演管理大库只维护公共模板；用户模板请到机器人管理的表演管理页签查看和配置。", "表演模板归属边界", "旧版公共模板和用户模板都在大库中维护；新版拆分为公共模板大库 + 机器人内用户模板。", "info")}
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>表演名称</th>
            <th>归属</th>
            <th>单元数量</th>
            <th>状态</th>
            <th>创建日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${publicShows
            .map(
              (show) => `
              <tr>
                <td>${show.id}</td>
                <td class="left"><strong>${show.name}</strong></td>
                <td>${show.owner}</td>
                <td>${show.units}</td>
                <td><span class="switch green on"></span></td>
                <td>${show.created}</td>
                <td><button class="link" onclick="openShowModal('${show.name}', true)">编辑</button> | <button class="link">删除</button></td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    ${pagination(141, 8)}
  `;
}

function pagination(total, last) {
  return `
    <div class="pagination">
      <span>共 ${total} 条</span>
      <select class="select w-120"><option>10条/页</option></select>
      <span class="page-box">‹</span>
      <span class="page-box active">1</span>
      <span class="page-box">2</span>
      <span class="page-box">3</span>
      <span class="page-box">4</span>
      <span class="page-box">5</span>
      <span class="page-box">6</span>
      <span>...</span>
      <span class="page-box">${last}</span>
      <span class="page-box">›</span>
      <span>前往</span>
      <input class="input" style="width:48px;height:30px;" value="1" />
      <span>页</span>
    </div>
  `;
}

function openCreateRobot(tab = "role") {
  const isRole = tab === "role";
  openModal(`
    <div class="modal full">
      <div class="modal-header">
        <div class="modal-title">创建机器人</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="modal-tabs">
          <button class="modal-tab ${isRole ? "active" : ""}" onclick="openCreateRobot('role')">角色设定</button>
          <button class="modal-tab ${!isRole ? "active" : ""}" onclick="openCreateRobot('device')">设备管理</button>
        </div>
        ${isRole ? roleSettingForm() : deviceForm()}
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="closeModal();toast('机器人创建信息已保存')">保存</button>
      </div>
    </div>
  `);
}

function openRobotEditor(robotId = selectedRobotId, tab = robotEditorTab) {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  selectedRobotId = robot.id;
  robotEditorTab = tab;
  const tabs = [
    ["role", "角色设定"],
    ["device", "设备管理"],
    ["skills", "技能清单"],
    ["shows", "表演清单"],
    ["scripts", "脚本管理"],
    ["idle", "闲时表演"],
    ["actions", "动作管理"],
    ["vision", "视觉管理"],
    ["materials", "素材管理"],
  ];
  openModal(`
    <div class="modal full">
      <div class="modal-header">
        <div class="modal-title">编辑机器人：${robot.id} / ${robot.name}</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="modal-tabs">
          ${tabs.map(([key, label]) => `<button class="modal-tab ${tab === key ? "active" : ""}" onclick="openRobotEditor('${robot.id}', '${key}')">${label}${key === "device" ? handoffMark("机器人版本选项", "设备管理页机器人版本下拉新增 R版-机器头、Z版-机器人、AGV机器人 三个选项。") : ""}${key === "scripts" ? handoffMark("机器人脚本管理页签", "机器人编辑页新增脚本管理页签，用于查看已下发脚本、设置当前执行脚本和移除脚本。") : ""}</button>`).join("")}
        </div>
        ${robotEditorContent(robot, tab)}
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="closeModal();toast('机器人配置已保存')">保存</button>
      </div>
    </div>
  `);
}

function copyRobotWsAddress(robotId) {
  const ws = `ws://robot-live.example.com/robots/${robotId}`;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(ws).catch(() => {});
  }
  toast(`已复制WS地址：${ws}`);
}

function deleteRobot(robotId) {
  const index = robots.findIndex((robot) => robot.id === robotId);
  if (index < 0) return;
  robots.splice(index, 1);
  toast("机器人已删除");
  renderApp();
}

function openRobotWifiSettings(robotId) {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  openModal(`
    <div class="modal medium">
      <div class="modal-header">
        <div class="modal-title">Wi-Fi设置：${robot.id} / ${robot.name}</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        ${formInput("Wi-Fi名称", "请输入SSID", true)}
        ${formInput("Wi-Fi密码", "请输入密码", true)}
        ${formSelect("连接模式", ["自动连接", "手动连接"])}
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="closeModal();toast('Wi-Fi设置已保存')">保存</button>
      </div>
    </div>
  `);
}

function robotEditorContent(robot, tab) {
  if (tab === "role") return roleSettingForm(robot);
  if (tab === "device") return deviceForm(robot);
  if (tab === "skills") return robotResourceTable(robot, "skills");
  if (tab === "shows") return robotResourceTable(robot, "shows");
  if (tab === "scripts") return robotScriptTable(robot);
  if (tab === "idle") return robotIdleShowTable(robot);
  if (tab === "actions") return staticResourceTable("动作管理", ["挥手", "点头", "站姿待机", "AGV_MOVE_HOME"], "动作资源先做静态展示");
  if (tab === "vision") return staticResourceTable("视觉管理", ["人脸识别", "观众距离检测", "展品识别"], "视觉能力先做静态展示");
  return staticResourceTable("素材管理", ["方形头像", "竖图头像", "导览展品图片", "直播间形象照"], "素材资源先做静态展示");
}

function roleSettingForm() {
  return `
    <div class="form-grid">
      <div>
        <div class="form-section">
          <h3 class="section-title">角色信息</h3>
          ${formInput("名称", "请输入角色名称", true)}
          ${formSelect("所属地区", ["请选择地区", "华东", "华南", "华北"])}
          ${formInput("出生年月", "请输入...")}
          ${formInput("学历", "请输入学历")}
          ${formInput("星座", "请输入星座")}
          ${formInput("身高", "请输入身高")}
          ${formInput("体重", "请输入体重")}
          ${formInput("肤色", "请输入肤色")}
          ${formInput("爱好", "请输入爱好")}
          ${formTextarea("功能", "请输入功能")}
        </div>
        <div class="form-section">
          <h3 class="section-title">提示词设定</h3>
          ${formTextarea("职业模型预设", "请输入..如：你是一个专业的心理咨询师xxxx")}
          ${formTextarea("对话风格描述", "机器人应该具备哪些特征?")}
          ${formTextarea("机主信息描述", "机器人还应该了解您的其他信息吗?")}
        </div>
        <div class="form-section">
          <h3 class="section-title">音色配置</h3>
          <div class="form-row"><div class="form-label required">选择音色</div><div><input class="input" list="voiceOptions" placeholder="请选择音色" value="" /><datalist id="voiceOptions">${voiceOptions().map((v) => `<option value="${v}"></option>`).join("")}</datalist></div></div>
          <div class="form-row"><div class="form-label">情绪</div><div><select class="select">${["自动", "愤怒", "恐惧", "快乐", "中性", "悲伤", "惊讶"].map((v) => `<option>${v}</option>`).join("")}</select></div></div>
          ${sliderRow("语速", 44, 1)}
          ${sliderRow("语调", 44, 1)}
          ${sliderRow("音量", 100, 100)}
          ${formInput("测试文本", "请输入测试文本")}
          <div class="form-row"><div></div><div><button class="btn small">合成</button></div></div>
        </div>
      </div>
      <div>
        <div class="form-section">
          <h3 class="section-title">角色头像</h3>
          <div class="upload-grid">
            <div class="upload-slot"><strong><span class="required-star"></span>方形头像</strong><div class="upload-box">＋</div></div>
            <div class="upload-slot"><strong>竖图头像</strong><div class="upload-box">＋</div><span class="upload-hint">推荐尺寸 432*576</span></div>
            <div class="upload-slot"><strong>直播间形象照</strong><div class="upload-box">＋</div><span class="upload-hint">推荐尺寸 496*608</span></div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="section-title">语种配置</h3>
          ${languageConfigForm()}
        </div>
        <div class="form-section">
          <h3 class="section-title">大模型配置</h3>
          <div class="form-row">
            <div class="form-label"></div>
            <div class="radio-line">
              <label><input name="modelProvider" type="radio" value="bailian" checked onchange="showModelPanel(this.value)" /> 百炼</label>
              <label><input name="modelProvider" type="radio" value="doubao" onchange="showModelPanel(this.value)" /> 豆包</label>
              <label><input name="modelProvider" type="radio" value="tianyi" onchange="showModelPanel(this.value)" /> 天翼</label>
            </div>
          </div>
          <div id="model-panel">
            ${bailianAgentField()}
          </div>
        </div>
      </div>
    </div>
  `;
}

function deviceForm(robot = null) {
  const currentRobot = robot || { version: "R版-机器头", year: "2026", executableScriptId: "SCRIPT-001", mode: "直播" };
  const executingScript = robotExecutingScript(currentRobot);
  return `
    <div class="form-grid">
      <div>
        <div class="form-section">
          <h3 class="section-title">硬件信息</h3>
          ${formSelect("机器人型号", ["请选择机器人型号", ...robotVersionOptions], true, currentRobot.version)}
          ${formSelect("机器人版本", ["请选择机器人版本", ...robotVersionOptions], true, currentRobot.version)}
          <div class="form-row"><div class="form-label required">机器人年份</div><div><input class="input" value="${currentRobot.year || "2026"}" readonly /><div class="upload-hint">根据创建年份自动获取，本原型按 2026 填充。</div></div></div>
          ${formInput("机器人编码", "请输入机器人编码", true)}
          ${radioRow("场景类型", ["聊天", "电商"], "sceneType", "聊天", true)}
          ${formSelect("应用场景", ["请选择领域", "情感陪伴", "语音娱乐", "企业服务", "导购"])}
        </div>
        <div class="form-section">
          <h3 class="section-title">护照信息</h3>
          ${formInput("护照编号", "请输入...")}
          ${formInput("护照有效期", "年 / 月 / 日")}
        </div>
        <div class="form-section">
          <h3 class="section-title">售卖与租赁</h3>
          <div class="form-row"><div class="form-label">领养状态</div><div><span class="switch"></span> <span style="color:red;">关闭领养(售卖)中</span></div></div>
          ${formInput("领养价格", "请输入...", true, "元")}
          ${formInput("领养定金", "请输入...", true, "元")}
          <div class="form-row"><div class="form-label">租赁状态</div><div><span class="switch"></span> <span style="color:red;">关闭租赁中</span></div></div>
          ${formInput("租赁价格", "请输入...", false, "元 / 天")}
          ${formInput("租赁押金", "请输入...", false, "元")}
        </div>
      </div>
      <div>
        <div class="form-section">
          <h3 class="section-title">运行配置</h3>
          ${formInput("开机时间", "◷ 请选择时间")}
          ${formInput("关机时间", "◷ 请选择时间")}
        </div>
        <div class="form-section">
          <h3 class="section-title">交互配置</h3>
		          ${radioRow("交互模式", ["直播模式", "对话模式", "按钮模式"], "interactionMode", currentRobot.mode === "直播" ? "直播模式" : "对话模式", true)}
		          <div class="form-row"><div class="form-label">当前执行脚本</div><div><strong>${executingScript ? executingScript.name : "未启用脚本"}</strong><div class="upload-hint">机器人当前执行哪个脚本，请到「脚本管理」页签使用执行开关设置。</div></div></div>
	          <div class="form-row"><div class="form-label">轮播话术</div><div><span>关闭</span> <span class="switch"></span> <span>开启</span></div></div>
          ${formInput("话术间隔", "200", true)}
          ${formTextarea("唤醒词", "如：用英文逗号隔开，如：小央小央，星辰星辰")}
          ${radioRow("灵敏度", ["低", "中", "高"], "sensitivity", "中")}
          ${formTextarea("唤醒垫词", "用英文逗号隔开，如：hello,hi,hey")}
          ${formTextarea("回答垫词", "用英文逗号隔开，如：ok,好的,明白了")}
        </div>
        <div class="form-section">
          <h3 class="section-title">动作配置</h3>
          ${formSelect("闲时动作", ["请选择闲时动作", "挥手", "点头", "站姿待机"])}
          ${formSelect("讲话时动作", ["请选择讲话时动作", "轻微点头", "挥舞左手", "抬起右手"])}
        </div>
      </div>
    </div>
  `;
}

function robotResourceTable(robot, type) {
  const isSkill = type === "skills";
  const source = robotResourceSource(type);
  const selectedIds = new Set(isSkill ? robot.skillIds || [] : robot.showIds || []);
  const selected = (isSkill ? robot.skillIds || [] : robot.showIds || [])
    .map((id) => source.find((item) => String(item.id) === String(id)))
    .filter(Boolean);
  return `
    <div class="robot-resource-layout">
      <div class="robot-resource-head">
        <strong>${isSkill ? "技能清单" : "表演清单"}：${selected.length}个</strong>
        <div class="filters">
          <input class="input w-180" placeholder="ID/名称" />
          <select class="select w-120"><option>全部来源</option><option>机器人自建</option><option>公共模板</option></select>${!isSkill ? handoffMark("表演来源筛选", "机器人表演清单新增来源筛选，用于区分机器人自建和公共模板。") : ""}
          <button class="btn small" type="button" onclick="openRobotLocalResourceModal('${robot.id}', '${type}')">＋ 新增${isSkill ? "技能" : "表演"}</button>${isSkill ? handoffMark("新增机器人自建技能", "机器人技能清单可直接新增机器人自建技能，编辑页与技能管理大库一致。") : handoffMark("新增机器人自建表演", "机器人表演清单新增表演入口，创建机器人自建表演。")}
          <button class="btn secondary small" type="button" onclick="openRobotResourcePicker('${robot.id}', '${type}')">绑定大库</button>${isSkill ? handoffMark("绑定公共模板技能", "机器人技能清单可从公共模板大库选择技能绑定到当前机器人，并拦截重复选择。") : handoffMark("绑定公共模板表演", "机器人表演清单新增绑定大库入口，从公共模板中选择表演绑定到当前机器人。")}
          ${!isSkill ? `<button class="btn secondary small" type="button" onclick="openShowImportModal()">批量导入</button>${handoffMark("表演批量导入", "机器人表演清单新增批量导入入口，同表演管理大库批量功能，支持模板下载和批量导入完整表演。")}` : ""}
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table compact-table">
          <thead>
            <tr>
              <th>排序</th><th>ID</th><th>${isSkill ? "技能名称" : "表演名称"}</th><th>来源</th><th>${isSkill ? "触发关键词" : "单元数量"}</th><th>创建时间</th><th>操作${!isSkill ? handoffMark("表演行内操作", "旧版操作列为新增/删除；新版已绑定表演行内改为编辑/移除。", "changed") : ""}</th>
            </tr>
          </thead>
          <tbody>
            ${
              selected.length
                ? selected
                    .map(
                      (item, index) => `
                        <tr draggable="true" ondragstart="startRobotResourceDrag('${type}', ${index})" ondragover="event.preventDefault()" ondrop="dropRobotResource('${robot.id}', '${type}', ${index})">
                          <td><span class="drag-handle">☰</span></td>
                          <td>${item.id}</td>
                          <td class="left"><strong>${item.name}</strong></td>
                          <td>${item.owner === "用户模板" ? "机器人自建" : "公共模板"}</td>
                          <td>${isSkill ? `<span class="tag">${item.trigger}</span>` : item.units}</td>
                          <td>${item.created}</td>
                          <td><button class="link" onclick="openRobotLocalResourceModal('${robot.id}', '${type}', '${item.id}')">编辑</button><button class="link danger" onclick="removeRobotResource('${robot.id}', '${type}', '${item.id}')">移除</button></td>
                        </tr>
                      `,
                    )
                    .join("")
                : `<tr><td colspan="7">暂无绑定数据</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
	  `;
}

function robotScriptTable(robot) {
  const scripts = robotAssignedScripts(robot);
  return `
    <div class="robot-resource-layout robot-script-layout">
      <div class="robot-resource-head">
        <strong>脚本清单：${scripts.length}个${handoffMark("机器人脚本管理页签", "机器人管理新增脚本管理页签，用于承接脚本管理页保存并下发到当前机器人的脚本。")}</strong>
        <span>执行开关同一时间只能打开一个；新下发脚本默认执行。${handoffMark("执行规则", "同一机器人同一时间只能有一个当前执行脚本；打开某个脚本后其他脚本自动关闭。", "info")}</span>
      </div>
      ${handoffNote("脚本来源于「脚本管理」保存并下发，不在机器人页签里新建脚本；这里负责查看、编辑跳转、设置执行和移除绑定。", "下发关系", "脚本管理负责创建/编辑/下发；机器人脚本管理页签展示该机器人已收到的脚本清单。", "info")}
      <div class="table-wrap">
        <table class="data-table compact-table">
          <thead>
            <tr>
              <th>脚本ID</th><th>脚本名称</th><th>脚本类型</th><th>场景</th><th>阶段数${handoffMark("脚本阶段数量", "展示脚本内阶段数量，来自脚本管理。", "info")}</th><th>绑定表演${handoffMark("脚本表演数量", "展示脚本已绑定表演数量，来自脚本编辑阶段配置。", "info")}</th><th>下发时间</th><th>执行${handoffMark("当前执行脚本开关", "新增当前执行脚本开关，打开后该脚本成为机器人当前执行脚本。")}</th><th>操作${handoffMark("脚本编辑与移除", "编辑跳转到脚本编辑页；移除只解除该机器人和脚本的绑定，不删除脚本本体。")}</th>
            </tr>
          </thead>
          <tbody>
            ${
              scripts.length
                ? scripts
                    .map((script) => {
                      const enabled = robot.executableScriptId === script.id;
                      return `
                        <tr>
                          <td>${script.id}</td>
                          <td class="left"><strong>${script.name}</strong></td>
                          <td>${script.type}</td>
                          <td>${script.type === "直播" ? anchorName(script.anchorType) : script.type}</td>
                          <td>${script.stageCount}</td>
                          <td>${script.showCount}</td>
                          <td>${script.updated}</td>
		                          <td><button class="switch-button ${enabled ? "on" : ""}" type="button" aria-label="切换执行脚本" onclick="toggleRobotExecutionScript('${robot.id}', '${script.id}')"><span></span></button></td>
	                          <td class="nowrap">
	                            <button class="link" type="button" onclick="openScriptEditor('${script.id}')">编辑</button>
	                            <button class="link danger" type="button" onclick="removeRobotScript('${robot.id}', '${script.id}')">移除</button>
	                          </td>
                        </tr>
                      `;
                    })
                    .join("")
                : `<tr><td colspan="9">暂无下发脚本，请先在脚本管理中保存并下发到当前机器人。${handoffMark("脚本清单空状态", "当机器人没有任何已下发脚本时展示该提示，引导去脚本管理下发。", "info")}</td></tr>`
            }
          </tbody>
        </table>
      </div>
      ${handoffNote("执行开关打开后，机器人将以该脚本作为当前执行脚本；打开一个脚本时，其他脚本会自动关闭。", "执行规则", "同一机器人同时只能启用一个当前执行脚本，开启新脚本会关闭其他脚本。", "info")}
    </div>
  `;
}

function radioRow(label, options, name, selected, required = false) {
  return `
    <div class="form-row">
      <div class="form-label ${required ? "required" : ""}">${label}</div>
      <div class="radio-line single-choice">
        ${options.map((option) => `<label><input type="radio" name="${name}" ${option === selected ? "checked" : ""} /> ${option}</label>`).join("")}
      </div>
    </div>
  `;
}

function languageConfigForm() {
  return `
    <div class="language-config">
      <label class="language-mode-row">
        <input type="radio" name="languageMode" checked />
        <strong>单语种</strong>
      </label>
      <div class="language-field">
        <select class="select">${languageOptions.map((item) => `<option ${item === "中文" ? "selected" : ""}>${item}</option>`).join("")}</select>
      </div>
      <div class="language-sub-label">方言</div>
      <div class="language-field">
        <div class="tag-select">
          <span class="keyword">中文<button type="button">×</button></span>
          <select class="select ghost-select">${languageOptions.map((item) => `<option>${item}</option>`).join("")}</select>
        </div>
      </div>
      <label class="language-mode-row">
        <input type="radio" name="languageMode" />
        <strong>多语种</strong>
      </label>
      <div class="language-field">
        <select class="select">${["请选择语种", ...languageOptions].map((item) => `<option>${item}</option>`).join("")}</select>
      </div>
    </div>
  `;
}

function robotResourceSource(type) {
  return type === "skills" ? [...skills, ...userRobotSkills] : [...shows, ...userRobotShows];
}

function startRobotResourceDrag(type, index) {
  draggingRobotResource = { type, index };
}

function dropRobotResource(robotId, type, index) {
  if (!draggingRobotResource || draggingRobotResource.type !== type || draggingRobotResource.index === index) return;
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  const key = type === "skills" ? "skillIds" : "showIds";
  const ids = robot[key] || [];
  const [moving] = ids.splice(draggingRobotResource.index, 1);
  ids.splice(index, 0, moving);
  draggingRobotResource = null;
  toast("清单顺序已调整");
  openRobotEditor(robot.id, type);
}

function openRobotLocalResourceModal(robotId, type, rawId = "") {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  const isSkill = type === "skills";
  const source = robotResourceSource(type);
  const item = source.find((row) => String(row.id) === String(rawId));
  if (isSkill) {
    openSkillModal(item?.name || "", robot.id, type);
    return;
  }
  openShowModal(item?.name || "", Boolean(item), robot.id, type);
}

function robotIdleShowTable(robot) {
  const selected = (robot.idleShowIds || []).map((id) => shows.find((show) => show.id === id)).filter(Boolean);
  const boundShows = shows.filter((show) => (robot.showIds || []).includes(show.id));
  return `
    <div class="robot-resource-layout">
      <div class="robot-resource-head idle-resource-head">
        <strong>已绑定闲时表演：${selected.length}个${handoffMark("闲时表演来源", "闲时表演只能从当前机器人表演清单已绑定表演中选择，可重复添加同一表演。", "info")}</strong>
        <div class="robot-resource-actions">
          <label class="field-inline">闲时表演间隔${handoffMark("闲时表演间隔", "闲时表演间隔配置在闲时表演页签右侧，控制两次闲时表演之间的等待时间。", "info")} <input class="input w-150" value="${robot.idleInterval || "00:01:00"}" /></label>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table compact-table">
          <thead><tr><th>排序</th><th>ID</th><th>表演名称</th><th>归属</th><th>单元数量</th><th><button class="circle-op-button add" type="button" aria-label="添加闲时表演" title="添加闲时表演" onclick="openRobotIdlePicker('${robot.id}')">＋</button></th></tr></thead>
          <tbody>
            ${
              selected.length
                ? selected.map((show, index) => `<tr draggable="true" ondragstart="startRobotIdleDrag(${index})" ondragover="event.preventDefault()" ondrop="dropRobotIdleShow('${robot.id}', ${index})"><td><span class="drag-handle">☰</span> ${index + 1}</td><td>${show.id}</td><td class="left"><strong>${show.name}</strong></td><td>${show.owner}</td><td>${show.units}</td><td class="nowrap"><button class="circle-op-button remove" type="button" aria-label="移除闲时表演" title="移除闲时表演" onclick="removeRobotIdleShow('${robot.id}', ${index})">−</button></td></tr>`).join("")
                : `<tr><td colspan="6">暂无闲时表演，先从表演管理中绑定表演。</td></tr>`
            }
          </tbody>
        </table>
      </div>
      <div class="flow-note orange">可选来源：${boundShows.map((show) => show.name).join("、") || "当前机器人暂未绑定表演"}</div>
    </div>
  `;
}

function staticResourceTable(title, rows, note) {
  return `
    <div class="robot-resource-layout">
      <div class="robot-resource-head"><strong>${title}</strong><span>${note}</span></div>
      <div class="table-wrap">
        <table class="data-table compact-table">
          <thead><tr><th>资源名称</th><th>归属</th><th>状态</th><th>说明</th></tr></thead>
          <tbody>${rows.map((row) => `<tr><td>${row}</td><td>当前机器人</td><td><span class="mini-tag green">可用</span></td><td>静态展示</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </div>
  `;
}

function openRobotResourcePicker(robotId, type) {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  const isSkill = type === "skills";
  const selectedIds = new Set(isSkill ? robot.skillIds || [] : robot.showIds || []);
  const source = isSkill ? skills : shows;
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">添加${isSkill ? "技能" : "表演"}到 ${robot.name}</div>
        <button class="modal-close" onclick="openRobotEditor('${robot.id}', '${type}')">×</button>
      </div>
      <div class="modal-body">
        <div class="table-wrap">
          <table class="data-table compact-table">
            <thead><tr><th>ID</th><th>${isSkill ? "技能名称" : "表演名称"}</th><th>归属</th><th>${isSkill ? "触发关键词" : "单元数量"}</th><th>创建时间</th><th>操作</th></tr></thead>
            <tbody>
              ${source
                .filter((item) => item.owner === "公共模板")
                .map((item) => {
                  const selected = selectedIds.has(item.id);
                  return `<tr><td>${item.id}</td><td class="left"><strong>${item.name}</strong></td><td>${item.owner}</td><td>${isSkill ? `<span class="tag">${item.trigger}</span>` : item.units}</td><td>${item.created}</td><td>${selected ? '<span class="mini-tag gray">已添加</span>' : `<button class="link" onclick="addRobotResource('${robot.id}', '${type}', '${item.id}')">添加</button>`}</td></tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn" onclick="openRobotEditor('${robot.id}', '${type}')">完成</button></div>
    </div>
  `);
}

function addRobotResource(robotId, type, rawId) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  const id = Number.isNaN(Number(rawId)) ? rawId : Number(rawId);
  const key = type === "skills" ? "skillIds" : "showIds";
  if (!Array.isArray(robot[key])) robot[key] = [];
  if (robot[key].includes(id)) {
    toast("不支持重复选择");
    return;
  }
  robot[key].push(id);
  toast("已添加，重复项会被拦截");
  openRobotResourcePicker(robot.id, type);
}

function removeRobotResource(robotId, type, rawId) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  const id = Number.isNaN(Number(rawId)) ? rawId : Number(rawId);
  const key = type === "skills" ? "skillIds" : "showIds";
  robot[key] = (robot[key] || []).filter((item) => item !== id);
  if (type === "shows") robot.idleShowIds = (robot.idleShowIds || []).filter((item) => item !== id);
  toast("已移除绑定");
  openRobotEditor(robot.id, type);
}

function openRobotIdlePicker(robotId) {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  const boundShows = shows.filter((show) => (robot.showIds || []).includes(show.id));
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">添加闲时表演</div>
        <button class="modal-close" onclick="openRobotEditor('${robot.id}', 'idle')">×</button>
      </div>
      <div class="modal-body">
        <div class="table-wrap">
          <table class="data-table compact-table">
            <thead><tr><th>ID</th><th>表演名称</th><th>归属</th><th>单元数量</th><th>操作</th></tr></thead>
            <tbody>${boundShows.map((show) => `<tr><td>${show.id}</td><td class="left"><strong>${show.name}</strong></td><td>${show.owner}</td><td>${show.units}</td><td><button class="link" onclick="addRobotIdleShow('${robot.id}', ${show.id})">添加</button></td></tr>`).join("") || `<tr><td colspan="5">请先在表演管理中为机器人绑定表演。</td></tr>`}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn" onclick="openRobotEditor('${robot.id}', 'idle')">完成</button></div>
    </div>
  `);
}

function addRobotIdleShow(robotId, showId) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  if (!Array.isArray(robot.idleShowIds)) robot.idleShowIds = [];
  robot.idleShowIds.push(showId);
  toast("已添加闲时表演，可重复选择");
  openRobotIdlePicker(robot.id);
}

function startRobotIdleDrag(index) {
  draggingIdleShowIndex = index;
}

function dropRobotIdleShow(robotId, index) {
  if (draggingIdleShowIndex === null || draggingIdleShowIndex === index) return;
  const robot = robots.find((item) => item.id === robotId);
  if (!robot || !Array.isArray(robot.idleShowIds)) return;
  const [moving] = robot.idleShowIds.splice(draggingIdleShowIndex, 1);
  robot.idleShowIds.splice(index, 0, moving);
  draggingIdleShowIndex = null;
  toast("闲时表演顺序已调整");
  openRobotEditor(robot.id, "idle");
}

function removeRobotIdleShow(robotId, index) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  robot.idleShowIds.splice(index, 1);
  toast("已移除闲时表演");
  openRobotEditor(robot.id, "idle");
}

function formInput(label, placeholder, required = false, suffix = "") {
  return `<div class="form-row"><div class="form-label ${required ? "required" : ""}">${label}</div><div style="display:flex;"><input class="input" placeholder="${placeholder}" />${suffix ? `<span class="stepper value" style="min-width:64px;">${suffix}</span>` : ""}</div></div>`;
}

function formTextarea(label, placeholder) {
  return `<div class="form-row top"><div class="form-label">${label}</div><div><textarea class="textarea" placeholder="${placeholder}"></textarea></div></div>`;
}

function formSelect(label, options, required = false, selected = "") {
  return `<div class="form-row"><div class="form-label ${required ? "required" : ""}">${label}</div><div><select class="select">${options.map((item) => `<option ${item === selected ? "selected" : ""}>${item}</option>`).join("")}</select></div></div>`;
}

function sliderRow(label, value, display) {
  return `
    <div class="form-row">
      <div class="form-label">${label}</div>
      <div class="slider-row">
        <input class="slider" type="range" value="${value}" />
        <button class="stepper">－</button>
        <div class="stepper value">${display}</div>
        <button class="stepper">＋</button>
      </div>
    </div>
  `;
}

function voiceOptions() {
  return ["637-干练的播客主持人（普通话）", "638-男性电台主持人（普通话）", "639-和蔼的大叔（普通话）", "640-低沉嗓音男性（普通话）", "641-轻松的向导（普通话）", "642-电台记者（普通话）", "643-冷静的主播（普通话）", "644-知识渊博的导师（普通话）"];
}

function agentOptions() {
  return ["RAG109 四位一体", "RAG003 智能体应用-测", "RAG004 云涵", "RAG005 刘雨馨", "RAG006 白小思", "RAG007 柳如春", "RAG008 薛娜", "RAG009 姜雅芳", "RAG010 丽娜"];
}

function bailianAgentField(selected = "") {
  return `
    <div class="model-agent-field">
      <div class="model-agent-label">绑定智能体</div>
      <select class="select model-agent-select ${selected ? "has-value" : ""}" onchange="this.classList.toggle('has-value', Boolean(this.value))">
        <option value="">请选择智能体</option>
        ${agentOptions().map((v) => `<option ${selected === v ? "selected" : ""}>${v}</option>`).join("")}
      </select>
    </div>
  `;
}

function showModelPanel(value) {
  const panel = document.getElementById("model-panel");
  if (!panel) return;
  if (value === "bailian") {
    panel.innerHTML = bailianAgentField();
  } else {
    panel.innerHTML = `<div class="agent-static">${value === "doubao" ? "豆包" : "天翼"}配置为静态占位，后续接入时补充应用 ID、密钥和知识库绑定。</div>`;
  }
}

function openRoomModal() {
  const selected = roles.find((role) => role.value === selectedRoomRoleValue) || roles[1];
  const availableScripts = roomAvailableScripts(selected);
  if (!selectedRoomScriptId || !availableScripts.some((script) => script.id === selectedRoomScriptId)) {
    selectedRoomScriptId = availableScripts[0]?.id || "";
  }
  const selectedScript = scriptFlowScripts.find((script) => script.id === selectedRoomScriptId);
  openModal(`
    <div class="modal full">
      <div class="modal-header">
        <div class="modal-title">创建虚拟带货直播间</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
	      <div class="modal-body">
	        <div class="form-section">
	          <div class="form-row"><div class="form-label required">选择推流方式</div><div class="radio-line"><label><input type="radio" checked /> 机器人</label><label><input type="radio" /> 数字人+图片背景</label><label><input type="radio" /> 商品虚拟讲解视频</label><label><input type="radio" /> 直播推流带货</label></div></div>
	          <div class="form-row"><div class="form-label">选择直播角色</div><div><select id="roomRoleSelect" class="select w-260" onchange="syncRoomRole()">${roles.map((role) => `<option value="${role.value}" ${role.value === selected.value ? "selected" : ""}>${role.value}</option>`).join("")}</select></div></div>
	          <div id="roleCard">${roleCard(selected)}</div>
	          <div class="form-row top">
	            <div class="form-label required">关联脚本</div>
	            <div>
	              <div id="roomScriptCard">${roomScriptCard(selectedScript, availableScripts.length)}</div>
	              <button class="btn secondary small" type="button" onclick="openRoomScriptPicker()">选择脚本</button>
	            </div>
	          </div>
	          <div class="form-row"><div class="form-label required">直播账号ID</div><div><input id="roomAccount" class="input" value="${selected.account}" /></div></div>
          <div class="form-row top"><div class="form-label">直播封面</div><div><div id="roomCover" class="cover-img ${selected.avatarClass}">${selected.cover}</div><div class="upload-hint" style="margin-top:10px;">(推荐尺寸：720x1280)</div></div></div>
          <div class="form-row top"><div class="form-label">直播间简介</div><div><textarea class="textarea" placeholder="请输入，30字以内..."></textarea><div style="text-align:right;color:#8b96a5;">0/30</div></div></div>
          <div class="form-row"><div class="form-label required">选择开播时间</div><div><span class="date-range"><input type="datetime-local" /><span>至</span><input type="datetime-local" /></span><div class="warning-strip">起止时间不能超过 7 天</div><div class="error-text">请选择开播时间</div></div></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="closeModal();toast('虚拟带货直播间已保存')">保存</button>
      </div>
    </div>
  `);
}

function roleCard(role) {
  return `
    <div class="role-card">
      <div class="cover-img ${role.avatarClass}">${role.cover}</div>
      <div>
        <p>ID: ${role.id}</p>
        <p>场景-名称: ${role.scene}</p>
        <p>角色场景:</p>
      </div>
    </div>
  `;
}

function syncRoomRole() {
  const value = document.getElementById("roomRoleSelect").value;
  selectedRoomRoleValue = value;
  const role = roles.find((item) => item.value === value) || roles[0];
  const scripts = roomAvailableScripts(role);
  selectedRoomScriptId = scripts[0]?.id || "";
  document.getElementById("roomAccount").value = role.account;
  document.getElementById("roleCard").innerHTML = roleCard(role);
  document.getElementById("roomCover").className = `cover-img ${role.avatarClass}`;
  document.getElementById("roomCover").textContent = role.cover;
  document.getElementById("roomScriptCard").innerHTML = roomScriptCard(scripts[0], scripts.length);
}

function roomScriptCard(script, count) {
  if (!script) {
    return `<div class="room-script-card empty">当前机器人模板暂无已发布脚本</div>`;
  }
  return `
    <div class="room-script-card">
      <strong>${script.id} / ${script.name}</strong>
      <span>${script.templateName} · ${script.type} · 已发布 · 可选 ${count} 个</span>
    </div>
  `;
}

function roomAvailableScripts(role) {
  return scriptFlowScripts.filter((script) => !script.isTemplate && script.status === "已发布" && script.templateName === role.templateName);
}

function robotAssignedScripts(robot) {
  return scriptFlowScripts.filter((script) => {
    if (script.isTemplate) return false;
    return script.robotId === robot.id || script.robotName === robot.name || script.id === robot.executableScriptId;
  });
}

function robotExecutingScript(robot) {
  return scriptFlowScripts.find((script) => script.id === robot.executableScriptId);
}

function toggleRobotExecutionScript(robotId, scriptId) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  if (robot.executableScriptId === scriptId) {
    robot.executableScriptId = "";
    toast("已关闭该脚本执行");
  } else {
    robot.executableScriptId = scriptId;
    toast("已设为当前执行脚本，其他脚本已自动关闭");
  }
  openRobotEditor(robot.id, "scripts");
}

function removeRobotScript(robotId, scriptId) {
  const robot = robots.find((item) => item.id === robotId);
  const script = scriptFlowScripts.find((item) => item.id === scriptId);
  if (!robot || !script) return;
  if (robot.executableScriptId === scriptId) robot.executableScriptId = "";
  if (script.robotId === robot.id) {
    script.robotId = "-";
    script.robotName = "未绑定";
  }
  robot.scripts = robotAssignedScripts(robot).length;
  toast("脚本已从当前机器人移除");
  openRobotEditor(robot.id, "scripts");
}

function openRoomScriptPicker() {
  const role = roles.find((item) => item.value === selectedRoomRoleValue) || roles[1];
  const scripts = roomAvailableScripts(role);
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">选择关联脚本</div>
        <button class="modal-close" onclick="openRoomModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="table-wrap">
          <table class="data-table compact-table">
            <thead>
              <tr><th>选择</th><th>脚本ID</th><th>脚本名称</th><th>类型</th><th>机器人模板</th><th>状态</th><th>更新时间</th></tr>
            </thead>
            <tbody>
              ${scripts
                .map(
                  (script) => `
                    <tr onclick="selectRoomScript('${script.id}')">
                      <td><input type="radio" name="roomScript" ${script.id === selectedRoomScriptId ? "checked" : ""} /></td>
                      <td>${script.id}</td>
                      <td class="left"><strong>${script.name}</strong></td>
                      <td>${script.type}</td>
                      <td>${script.templateName}</td>
                      <td><span class="mini-tag green">${script.status}</span></td>
                      <td>${script.updated}</td>
                    </tr>
                  `,
                )
                .join("") || `<tr><td colspan="7">暂无可绑定脚本</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="openRoomModal()">返回</button>
        <button class="btn" onclick="openRoomModal();toast('关联脚本已选择')">确定</button>
      </div>
    </div>
  `);
}

function selectRoomScript(scriptId) {
  selectedRoomScriptId = scriptId;
  openRoomModal();
  toast("关联脚本已选择");
}

function openSkillModal(name = "", returnRobotId = "", returnTab = "") {
  const closeAction = returnRobotId ? `openRobotEditor('${returnRobotId}', '${returnTab || "skills"}')` : "closeModal()";
  skillKeywords = name ? ["发货", "确认订单"] : [];
  skillEventTriggers = name ? [{ type: "gift", giftTier: "高价值礼物" }] : [{ type: "" }];
  openModal(`
    <div class="modal medium skill-edit-modal">
      <div class="modal-header">
        <div class="modal-title">${name ? "编辑技能" : "新增技能"}</div>
        <button class="modal-close" onclick="${closeAction}">×</button>
      </div>
      <div class="modal-body">
        <div class="form-section">
          ${formInput("技能名称", name || "", true)}
          <div class="form-row"><div class="form-label">归属</div><div class="radio-line"><label><input type="radio" checked disabled /> 公共模板</label><label><input type="radio" disabled /> 用户模板</label></div></div>
          ${formSelect("分类", ["动作", "表演", "视觉"])}
          <div class="form-row top"><div class="form-label">触发关键词</div><div><div id="keywordBox" class="keyword-box">${keywordHtml()}<input id="keywordInput" placeholder="关键词，输入后按回车添加" onkeydown="handleKeywordKey(event)" /></div></div></div>
	          <div class="form-row top">
	            <div class="form-label">直播间事件触发${handoffMark("直播间事件触发规则", "技能可由关键词或直播间事件触发，二者满足任一即可保存。", "info")}</div>
	            <div class="event-trigger-section">
	              <div class="event-trigger-header">
	                <div>
	                  <div class="event-trigger-title">直播间事件触发条件${handoffMark("直播间事件类型", "事件类型枚举：不配置、点赞、关注、送礼物；送礼物需继续选择礼物档位。", "info")}</div>
	                  <div class="event-trigger-desc">关键词和直播间事件满足其中一个即可保存。</div>
	                </div>
	              </div>
	              <div id="liveEventTriggerList">${liveEventTriggersHtml()}</div>
	            </div>
	          </div>
          <div class="form-row">
            <div class="form-label">触发内容</div>
            <div>
              <select class="select">
                <option>请选择已配置表演</option>
                ${shows.map((show) => `<option>${show.id} - ${show.name}</option>`).join("")}
              </select>
            </div>
          </div>
        </div>
	      </div>
	      <div class="modal-footer">
	        <button class="btn" onclick="saveSkillModal('${returnRobotId}', '${returnTab || "skills"}')">确定</button>
	        <button class="btn secondary" onclick="${closeAction}">取消</button>
	      </div>
    </div>
  `);
}

function keywordHtml() {
  return skillKeywords.map((word, index) => `<span class="keyword">${word}<button onclick="removeKeyword(${index})">×</button></span>`).join("");
}

function handleKeywordKey(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  const value = event.target.value.trim();
  if (!value) return;
  skillKeywords.push(value);
  refreshKeywords();
}

function removeKeyword(index) {
  skillKeywords.splice(index, 1);
  refreshKeywords();
}

function refreshKeywords() {
  const box = document.getElementById("keywordBox");
  if (!box) return;
  box.innerHTML = `${keywordHtml()}<input id="keywordInput" placeholder="关键词，输入后按回车添加" onkeydown="handleKeywordKey(event)" />`;
  document.getElementById("keywordInput").focus();
}

function liveEventTriggersHtml() {
  return liveEventTriggerRow(skillEventTriggers[0] || { type: "" }, 0);
}

function liveEventTriggerRow(trigger, index) {
  return `
    <div class="event-trigger-row">
	      <select class="select event-type-select" onchange="setLiveEventTriggerType(${index}, this.value)">
	        <option value="" ${!trigger.type ? "selected" : ""}>不配置</option>
	        <option value="like" ${trigger.type === "like" ? "selected" : ""}>点赞</option>
	        <option value="follow" ${trigger.type === "follow" ? "selected" : ""}>关注</option>
	        <option value="gift" ${trigger.type === "gift" ? "selected" : ""}>送礼物</option>
	      </select>
	      <div class="event-trigger-fields">${liveEventTriggerFields(trigger, index)}</div>
	    </div>
	  `;
}

function liveEventTriggerFields(trigger, index) {
  if (!trigger.type) {
    return `<span class="event-trigger-empty inline">未配置事件触发</span>`;
  }
  if (trigger.type === "follow") {
    return `
      <label class="compact-field">新增关注数量阈值
        <input class="input" type="number" min="1" value="${trigger.followThreshold || ""}" placeholder="例如 20" oninput="skillEventTriggers[${index}].followThreshold=this.value" />
      </label>
    `;
  }
  if (trigger.type === "like") {
    return `
      <label class="compact-field">点赞增量阈值
        <input class="input" type="number" min="1" value="${trigger.likeThreshold || ""}" placeholder="例如 500" oninput="skillEventTriggers[${index}].likeThreshold=this.value" />
      </label>
    `;
  }
  if (trigger.type !== "gift") return `<span class="event-trigger-empty inline">未配置事件触发</span>`;
	  return `
	    <label class="compact-field">礼物档位
	      <select class="select" onchange="skillEventTriggers[${index}].giftTier=this.value">
	        ${["基础礼物", "中档礼物", "高价值礼物"].map((tier) => `<option ${trigger.giftTier === tier ? "selected" : ""}>${tier}</option>`).join("")}
	      </select>
	    </label>${handoffMark("礼物档位选择", "礼物档位枚举：基础礼物、中档礼物、高价值礼物；只选择档位，不做价格区间校验。", "info")}
	  `;
}

function refreshLiveEventTriggers() {
  const list = document.getElementById("liveEventTriggerList");
  if (!list) return;
  list.innerHTML = liveEventTriggersHtml();
}

function addLiveEventTrigger() {
  skillEventTriggers = [{ type: "follow", followThreshold: 10 }];
  refreshLiveEventTriggers();
}

function removeLiveEventTrigger(index) {
  skillEventTriggers[index] = { type: "" };
  refreshLiveEventTriggers();
}

function setLiveEventTriggerType(index, type) {
  const defaults = {
    "": { type: "" },
    like: { type: "like", likeThreshold: 200 },
    follow: { type: "follow", followThreshold: 10 },
    gift: { type: "gift", giftTier: "基础礼物" },
  };
  skillEventTriggers[index] = defaults[type] || defaults[""];
  refreshLiveEventTriggers();
}

function saveSkillModal(returnRobotId = "", returnTab = "") {
  const hasKeyword = skillKeywords.length > 0 || Boolean(document.getElementById("keywordInput")?.value.trim());
  const hasEvent = Boolean(skillEventTriggers[0]?.type);
  if (!hasKeyword && !hasEvent) {
    toast("触发关键词或直播间事件触发至少填写一个");
    return;
  }
  if (returnRobotId) {
    openRobotEditor(returnRobotId, returnTab || "skills");
  } else {
    closeModal();
  }
  toast("技能已保存");
}

function openShowModal(name = "", edit = false, returnRobotId = "", returnTab = "") {
  perfUnits = edit
    ? [
        { text: "各位贵宾大家好！我在这里好好给大家讲讲我们心符科技的四位一体产品体系哦。", action: "挥舞左手", end: "文本结束", repeat: 1, wait: 0 },
        { text: "所以呀，我们就是出了至尊养老的理念，把科技普惠和人文回归结合起来。", action: "抬起右手", end: "文本结束", repeat: 1, wait: 1 },
        { text: "心链云桥平台呢，负责收集数据和云端联动，就像是整个系统的大脑。", action: "挥舞左手", end: "全部结束", repeat: 2, wait: 0 },
      ]
    : [{ text: "", action: "请选择动作", end: "文本结束", repeat: 1, wait: 0 }];
  openModal(showModalHtml(name || "四位一体讲解", edit, "edit", returnRobotId, returnTab));
}

function openShowImportModal() {
  openModal(`
    <div class="modal large">
      <div class="modal-header"><div class="modal-title">批量导入完整表演</div><button class="modal-close" onclick="closeModal()">×</button></div>
      <div class="modal-body">
        ${handoffNote("每一条表演可包含多条表演单元，导入字段包含表演名称、表演文本、动作名称、完整表演执行逻辑、随机条数、逻辑执行次数、执行时长、单元结束依据、单元执行次数和等待时长。")}
        <div class="table-wrap">
          <table class="data-table compact-table">
            <thead><tr><th>表演名称</th><th>单元序号</th><th>表演文本</th><th>动作名称</th><th>完整执行逻辑</th><th>随机条数</th><th>逻辑执行次数</th><th>执行时长(分钟)</th><th>结束依据</th><th>单元执行次数</th><th>等待时长</th></tr></thead>
            <tbody>
              <tr><td>关羽-迎宾导入样例</td><td>1</td><td class="left">欢迎大家来到直播间。</td><td>挥舞左手</td><td>顺序执行</td><td></td><td>1</td><td></td><td>文本结束</td><td>1</td><td>0秒</td></tr>
              <tr><td>关羽-迎宾导入样例</td><td>2</td><td class="left">接下来我会为大家介绍今天的亮点。</td><td>抬起右手</td><td>随机执行</td><td>1</td><td></td><td></td><td>动作结束</td><td>1</td><td>1秒</td></tr>
              <tr><td>关羽-顺序讲解样例</td><td>1</td><td class="left">请大家跟随我的节奏继续了解。</td><td>点头</td><td>顺序执行</td><td></td><td>3</td><td></td><td>全部结束</td><td>1</td><td>0秒</td></tr>
              <tr><td>关羽-定时讲解样例</td><td>1</td><td class="left">下面进入定时讲解环节。</td><td>站姿</td><td>顺序执行指定时长</td><td></td><td></td><td>5</td><td>文本结束</td><td>1</td><td>0秒</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="downloadShowImportTemplate()">下载模板</button><button class="btn" onclick="closeModal();toast('表演批量导入预览已生成')">上传并预览</button></div>
    </div>
  `);
}

function openShowViewModal(name) {
  perfUnits = [
    { text: "各位贵宾大家好！我在这里好好给大家讲讲我们心符科技的四位一体产品体系哦。", action: "挥舞左手", end: "文本结束", repeat: 1, wait: 0 },
    { text: "所以呀，我们就是出了至尊养老的理念，把科技普惠和人文回归结合起来。", action: "抬起右手", end: "文本结束", repeat: 1, wait: 1 },
    { text: "心链云桥平台呢，负责收集数据和云端联动，就像是整个系统的大脑。", action: "挥舞左手", end: "全部结束", repeat: 2, wait: 0 },
  ];
  openModal(showModalHtml(name, true, "view"));
}

function showModalHtml(name, edit, mode = "edit", returnRobotId = "", returnTab = "", customSaveAction = "", customCloseAction = "") {
  const closeAction = customCloseAction || (returnRobotId ? `openRobotEditor('${returnRobotId}', '${returnTab || "shows"}')` : "closeModal()");
  const saveAction = customSaveAction || (returnRobotId ? `openRobotEditor('${returnRobotId}', '${returnTab || "shows"}');toast('表演已保存')` : "closeModal();toast('表演已保存')");
  return `
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">${mode === "view" ? "查看表演" : edit ? "编辑表演" : "新增表演"}</div>
        <button class="modal-close" onclick="${closeAction}">×</button>
      </div>
      <div class="modal-body">
        <div class="performance-top-config">
          <div class="performance-name-field">
            <span class="form-label required">表演名称:</span>
            <input class="input" value="${edit ? name : ""}" />
          </div>
          <div class="performance-logic-field">
            <span class="form-label">完整表演执行逻辑:${handoffMark("完整表演执行方式", "选项枚举：顺序执行、随机执行、顺序执行指定时长。顺序执行需配置执行次数，默认 1 次。", "info")}</span>
            <select id="performanceLogicSelect" class="select" onchange="updatePerformanceLogicFields(this.value)">
              ${executionLogicOptions.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
            </select>
            <span id="performanceLogicExtra" class="performance-logic-extra"><label>执行次数 <input class="input performance-extra-input" type="number" min="1" value="1" /> 次</label></span>
          </div>
        </div>
        <div class="form-row"><div class="form-label">归属:</div><div class="radio-line"><label><input type="radio" checked disabled /> 公共模板</label><label><input type="radio" disabled /> 用户模板</label></div></div>
        <table class="performance-table">
          <thead>
            <tr>
              <th style="width:140px;">拖动排序 <button class="black-dot" onclick="addPerfUnit()">＋</button></th>
              <th>表演文本</th>
              <th>表演音频</th>
              <th>表演动作(组)</th>
              <th style="width:130px;">结束依据</th>
              <th style="width:110px;">执行次数${handoffMark("表演单元执行次数", "每条表演单元可配置执行次数；顺序执行会在表演整体层控制执行次数。", "info")}</th>
              <th style="width:130px;">等待时长(秒)${handoffMark("表演单元等待时长", "每条表演单元执行完成后可等待指定秒数，再进入下一条单元。", "info")}</th>
            </tr>
          </thead>
          <tbody id="perfUnitRows">${perfUnits.map((unit, index) => perfUnitRow(unit, index)).join("")}</tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="${saveAction}">确定</button>
        <button class="btn secondary" onclick="${closeAction}">取消</button>
      </div>
    </div>
  `;
}

function perfUnitRow(unit, index) {
  return `
    <tr draggable="true" ondragstart="startPerfUnitDrag(${index})" ondragover="event.preventDefault()" ondrop="dropPerfUnit(${index})">
      <td>
        <span class="drag-handle" title="拖拽排序">⋮⋮</span>
        <button class="black-dot" onclick="removePerfUnit(${index})">−</button>
      </td>
      <td>
        <textarea class="textarea" maxlength="200" oninput="perfUnits[${index}].text=this.value">${unit.text}</textarea>
        <div style="text-align:right;color:#9aa4b2;">${unit.text.length}/200</div>
      </td>
      <td>
        <button class="btn small">选择音频</button>
        <div style="margin-top:12px;">🔊 <input class="slider" type="range" value="60" style="width:160px;" /> 100</div>
      </td>
      <td>
        <select class="select w-150" onchange="perfUnits[${index}].action=this.value">
          ${["请选择动作", "挥舞左手", "抬起右手", "站姿", "点头", "比心"].map((item) => `<option ${unit.action === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
        <button class="btn small" style="margin-top:12px;" onclick="openActionPicker(${index})">编辑</button>
      </td>
      <td>
        <select class="select" onchange="perfUnits[${index}].end=this.value">
          ${["文本结束", "音频结束", "动作结束", "全部结束"].map((item) => `<option ${unit.end === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </td>
      <td>
        <input class="input unit-number-input" type="number" min="1" value="${unit.repeat ?? 1}" oninput="perfUnits[${index}].repeat=this.value" />
      </td>
      <td>
        <input class="input unit-number-input" type="number" min="0" value="${unit.wait ?? 0}" oninput="perfUnits[${index}].wait=this.value" />
      </td>
    </tr>
  `;
}

function refreshPerfUnits() {
  const rows = document.getElementById("perfUnitRows");
  if (rows) rows.innerHTML = perfUnits.map((unit, index) => perfUnitRow(unit, index)).join("");
}

function updatePerformanceLogicFields(value) {
  const extra = document.getElementById("performanceLogicExtra");
  if (!extra) return;
  if (value === "random") {
    extra.innerHTML = `<label>随机条数 <input class="input performance-extra-input" type="number" min="1" value="1" /> 条</label>`;
    return;
  }
  if (value === "loop-count") {
    extra.innerHTML = `<label>执行次数 <input class="input performance-extra-input" type="number" min="1" value="1" /> 次</label>`;
    return;
  }
  if (value === "loop-duration") {
    extra.innerHTML = `<label>执行时长 <select class="select performance-extra-input">${loopDurationMinuteOptions.map((minute) => `<option value="${minute}">${minute}</option>`).join("")}</select> 分钟</label>`;
    return;
  }
  extra.innerHTML = `<label>执行次数 <input class="input performance-extra-input" type="number" min="1" value="1" /> 次</label>`;
}

function addPerfUnit() {
  perfUnits.push({ text: "", action: "请选择动作", end: "文本结束", repeat: 1, wait: 0 });
  refreshPerfUnits();
}

function removePerfUnit(index) {
  if (perfUnits.length <= 1) {
    toast("至少保留一个表演单元");
    return;
  }
  perfUnits.splice(index, 1);
  refreshPerfUnits();
}

function movePerfUnit(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= perfUnits.length) return;
  const temp = perfUnits[index];
  perfUnits[index] = perfUnits[target];
  perfUnits[target] = temp;
  refreshPerfUnits();
}

function startPerfUnitDrag(index) {
  draggingPerfUnitIndex = index;
}

function dropPerfUnit(index) {
  if (draggingPerfUnitIndex === null || draggingPerfUnitIndex === index) return;
  const [moving] = perfUnits.splice(draggingPerfUnitIndex, 1);
  perfUnits.splice(index, 0, moving);
  draggingPerfUnitIndex = null;
  refreshPerfUnits();
  toast("表演单元顺序已调整");
}
function openActionPicker(index) {
  openModal(`
    <div class="modal medium">
      <div class="modal-header">
        <div class="modal-title">动作选择</div>
        <button class="modal-close" onclick="openShowModal('四位一体讲解', true)">×</button>
      </div>
      <div class="modal-body">
        <div class="batch-grid">
          <div>
            <div class="toolbar" style="margin-bottom:10px;">
              <strong>可选动作66</strong>
              <select class="select w-120"><option>选择姿势</option><option>站姿</option></select>
              <input class="input w-150" placeholder="ID/表演名称" />
            </div>
            <div class="batch-panel">
              ${["鲁博士-挥舞右手波浪状", "鲁博士-挥舞右手", "鲁博士-挥舞左手", "鲁博士-向前伸右手", "鲁博士-向前伸左手", "鲁博士-低头拾双手致谢"].map((name, i) => `<div class="batch-row" style="grid-template-columns:50px 1fr 80px 60px;"><span>${i + 1}</span><span>${name}</span><span>站姿</span><button class="link" onclick="perfUnits[${index}].action='${name.replace("鲁博士-", "")}';openShowModal('四位一体讲解', true)">添加</button></div>`).join("")}
            </div>
          </div>
          <div>
            <div class="toolbar" style="margin-bottom:10px;">
              <strong>已选动作1</strong>
              <button class="btn small">新增动作</button>
            </div>
            <div class="batch-panel">
              <div class="batch-row" style="grid-template-columns:50px 1fr 80px 60px;"><span>≡</span><span>${perfUnits[index]?.action || "挥舞左手"}</span><span>站姿</span><button class="link">删除</button></div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="openShowModal('四位一体讲解', true)">取消</button>
        <button class="btn" onclick="openShowModal('四位一体讲解', true)">保存</button>
      </div>
    </div>
  `);
}

function openBatchModal(type) {
  const isSkill = type === "skills";
  const left = isSkill ? skills : shows;
  const title = isSkill ? "已选技能" : "已选表演";
  const placeholder = isSkill ? "ID/技能名称" : "ID/表演名称";
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">${isSkill ? "技能批量下发" : "表演批量下发"}</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="batch-grid">
          <div>
            <div class="batch-panel-header">${title} (0)<input class="input" placeholder="${placeholder}" /></div>
            <div class="batch-panel">
              ${left
                .slice(0, 6)
                .map(
                  (item) => `
                  <div class="batch-row ${String(item.name).length > 24 ? "tall" : ""}">
                    <input type="checkbox" />
                    <span>${item.id}</span>
                    <span>${item.name}</span>
                    <span>${item.owner || item.category}</span>
                  </div>
                `,
                )
                .join("")}
            </div>
          </div>
          <div>
            <div class="batch-panel-header">已选机器人 (0)<input class="input" placeholder="搜索机器人" /></div>
            <div class="batch-panel">
              ${robots
                .slice(0, 8)
                .map(
                  (robot) => `
                  <div class="batch-row">
                    <input type="checkbox" />
                    <span>${robot.id}</span>
                    <span>${robot.name}</span>
                    <span>${robot.version}</span>
                  </div>
                `,
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="closeModal();toast('${isSkill ? "技能" : "表演"}已一键下发')">一键下发</button>
      </div>
    </div>
  `);
}

function buildTemplateStages(anchorId, durations) {
  const template = anchorTemplates.find((item) => item.id === anchorId);
  return (template?.stages || []).map((name, index) => {
    const order = String(index + 1).padStart(2, "0");
    return {
      id: `${anchorId}-${order}`,
      order,
      name,
      type: template?.stageTypes?.[index] || "阶段",
      templateName: template?.templateName || "阶段模板",
      min: durations[0],
      suggest: durations[1],
      max: durations[2],
      status: order === "03" ? "编辑中" : "已配置",
      active: order === "03",
    };
  });
}

function buildScriptStages(prefix, rows) {
  return rows.map(([name, type, priorityMode, status, boundShowIds = [], point = "", executionTiming = ""], index) => {
    const order = String(index + 1).padStart(2, "0");
    return {
      id: `${prefix}-${order}`,
      order,
      name,
      type,
      priorityMode,
      point,
      executionTiming,
      min: "2m",
      suggest: "5m",
      max: "10m",
      status,
      active: status === "编辑中",
      templateName: prefix === "tour" ? "导览模板" : prefix === "drama" ? "剧目模板" : prefix === "activity" ? "活动模板" : currentAnchorTemplate()?.templateName,
      interactionDuration: type === "真人互动" ? "3" : "",
      waitDuration: type === "等待" ? "3" : "",
      dialogueMode: type === "真人互动" ? "自然对话" : "",
      executionLogic: { mode: "loop-count", value: 1 },
      boundShowIds,
    };
  });
}

function currentAnchorTemplate() {
  return anchorTemplates.find((item) => item.id === selectedAnchorType) || anchorTemplates[2];
}

function currentScript() {
  return scriptFlowScripts.find((script) => script.id === selectedScriptId) || scriptFlowScripts[0];
}

function anchorName(anchorId) {
  const offlineNames = { tour: "导览", drama: "剧目", activity: "活动" };
  if (offlineNames[anchorId]) return offlineNames[anchorId];
  return (anchorTemplates.find((item) => item.id === anchorId) || anchorTemplates[2]).name;
}

function openScriptEditor(scriptId) {
  const script = scriptFlowScripts.find((item) => item.id === scriptId) || scriptFlowScripts[0];
  selectedScriptId = script.id;
  selectedAnchorType = script.anchorType;
  selectedStageId = (currentStages().find((stage) => stage.active) || currentStages()[0]).id;
  scriptFlowView = "edit";
  activePage = "flow";
  if (!visitedTabs.includes("flow")) visitedTabs.push("flow");
  if (typeof window !== "undefined" && window.location) window.location.hash = "flow";
  renderApp();
}

function saveAndDeployScript() {
  const script = currentScript();
  if (script.isTemplate) return;
  const robot = ensureScriptRobot(script);
  script.robotId = robot.id;
  script.robotName = robot.name;
  script.status = "已发布";
  script.updated = currentDateTimeText();
  robot.executableScriptId = script.id;
  robot.scripts = robotAssignedScripts(robot).length;
  toast("已保存并下发机器人，该脚本已设为当前执行脚本");
  scriptFlowView = "edit";
  renderApp();
}

function currentDateTimeText() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function ensureScriptRobot(script) {
  const existing = scriptDirectRobot(script);
  if (existing) return existing;
  const role = roles.find((item) => item.id === script.robotId || item.name === script.robotName) || roles[0];
  const robot = {
    id: role.id,
    mode: script.type === "导览" ? "导览" : script.type === "剧目" ? "表演" : "直播",
    name: role.name,
    status: "正常",
    voice: "默认音色",
    model: "百炼",
    version: role.version || "R版-机器头",
    year: "2026",
    scripts: 0,
    keywords: 0,
    executableScriptId: "",
    avatar: role.cover || role.name.slice(0, 1),
    avatarClass: role.avatarClass || "avatar-a",
    skillIds: [],
    showIds: [],
    idleShowIds: [],
    idleInterval: "00:01:00",
  };
  robots.unshift(robot);
  return robot;
}

function scriptDirectRobot(script) {
  return robots.find((item) => item.id === script.robotId || item.name === script.robotName);
}

function scriptTargetRobot(script) {
  return scriptDirectRobot(script) || robots.find((item) => item.executableScriptId === script.id);
}

function scriptTargetRobotLabel(script) {
  const robot = scriptDirectRobot(script);
  if (robot) return `${robot.id} / ${robot.name}`;
  const role = roles.find((item) => item.id === script.robotId || item.name === script.robotName);
  if (role) return `${role.id} / ${role.name}`;
  const executableRobot = robots.find((item) => item.executableScriptId === script.id);
  return executableRobot ? `${executableRobot.id} / ${executableRobot.name}` : `${script.robotId || "-"} / ${script.robotName || "未绑定"}`;
}

function updateScriptRobot(robotId) {
  const script = currentScript();
  const role = roles.find((item) => item.id === robotId);
  if (!role || script.isTemplate) return;
  if (script.type === "导览" && role.version !== "AGV机器人") {
    toast("导览脚本只能绑定 AGV机器人");
    renderApp();
    return;
  }
  script.robotId = role.id;
  script.robotName = role.name;
  script.templateName = role.templateName;
  toast(`脚本已绑定机器人 ${role.id} / ${role.name}`);
  renderApp();
}

function backToScriptList() {
  scriptFlowView = "list";
  renderApp();
}

function copyScript(scriptId) {
  const source = scriptFlowScripts.find((item) => item.id === scriptId);
  if (!source) return;
  const next = {
    ...source,
    id: `SCRIPT-${String(scriptFlowScripts.length + 1).padStart(3, "0")}`,
    name: `${source.name} 副本`,
    status: "草稿",
    updated: "2026-05-27 15:10",
  };
  scriptFlowScripts.unshift(next);
  toast("脚本已复制为草稿");
  renderApp();
}

function currentStages() {
  const script = currentScript();
  if (script.type === "导览") return stageOrders.tour;
  if (script.type === "剧目") return stageOrders.drama;
  if (script.type === "活动") return stageOrders.activity;
  return stageOrders[selectedAnchorType] || stageOrders.commerce;
}

function currentStage() {
  const stages = currentStages();
  return stages.find((stage) => stage.id === selectedStageId) || stages[0];
}

function updateScriptField(field, value) {
  const script = currentScript();
  script[field] = value;
}

function updateStageField(stageId, field, value) {
  const stage = currentStages().find((item) => item.id === stageId);
  if (!stage) return;
  stage[field] = value;
}

function stageBoundShowIds(stage = currentStage()) {
  if (!Array.isArray(stage.boundShowIds)) stage.boundShowIds = [];
  return stage.boundShowIds;
}

function stageShowWait(stage = currentStage(), showId) {
  if (!stage.showWaits) stage.showWaits = {};
  return stage.showWaits[showId] ?? 0;
}

function updateStageShowWait(stageId, showId, value) {
  const stage = currentStages().find((item) => item.id === stageId);
  if (!stage) return;
  if (!stage.showWaits) stage.showWaits = {};
  stage.showWaits[showId] = Math.max(0, Number(value || 0));
}

function stageExecutionLogic(stage = currentStage()) {
  if (!stage.executionLogic || stage.executionLogic.mode === "sequence") stage.executionLogic = { mode: "loop-count", value: 1 };
  return stage.executionLogic;
}

function stagePriorityMode(stage = currentStage()) {
  if (!stage.priorityMode) stage.priorityMode = stage.type === "真人互动" ? "互动优先" : "流程优先";
  return stage.priorityMode;
}

function updateStagePriorityMode(mode) {
  currentStage().priorityMode = mode;
  renderApp();
}

function updateStageType(stageId, type) {
  const stage = currentStages().find((item) => item.id === stageId);
  if (!stage) return;
  stage.type = type;
  if (type === "真人互动") {
    stage.priorityMode = "互动优先";
    stage.interactionDuration = stage.interactionDuration || "3";
    stage.dialogueMode = stage.dialogueMode || "自然对话";
  }
  if (type === "等待") {
    stage.priorityMode = "流程优先";
    stage.waitDuration = stage.waitDuration || "3";
    stage.dialogueMode = "";
  }
  renderApp();
}

function updateStageExecutionMode(mode) {
  const logic = stageExecutionLogic();
  logic.mode = mode;
  logic.value = 1;
  renderApp();
}

function updateStageExecutionValue(value) {
  stageExecutionLogic().value = value;
}

function deleteScript(scriptId) {
  const index = scriptFlowScripts.findIndex((script) => script.id === scriptId);
  if (index < 0) return;
  scriptFlowScripts.splice(index, 1);
  if (selectedScriptId === scriptId) {
    selectedScriptId = (scriptFlowScripts.find((script) => !script.isTemplate) || scriptFlowScripts[0])?.id || "";
  }
  toast("脚本已删除");
  renderApp();
}

function moveStageShow(index, direction) {
  const ids = stageBoundShowIds();
  const target = index + direction;
  if (target < 0 || target >= ids.length) return;
  const temp = ids[index];
  ids[index] = ids[target];
  ids[target] = temp;
  toast("表演顺序已调整");
  renderApp();
}

function startStageShowDrag(index) {
  draggingShowIndex = index;
}

function dropStageShow(index) {
  if (draggingShowIndex === null || draggingShowIndex === index) return;
  const ids = stageBoundShowIds();
  const [moving] = ids.splice(draggingShowIndex, 1);
  ids.splice(index, 0, moving);
  draggingShowIndex = null;
  toast("表演顺序已调整");
  renderApp();
}

function removeStageShow(showId) {
  const stage = currentStage();
  stage.boundShowIds = stageBoundShowIds(stage).filter((id) => String(id) !== String(showId));
  toast("表演已解除绑定");
  renderApp();
}

function openStageShowPicker() {
  selectedShowIdsInPicker = [];
  stageShowPickerFilters = { keyword: "", owner: "全部归属" };
  renderStageShowPicker();
}

function openStageNewShow() {
  perfUnits = [{ text: "", action: "请选择动作", end: "文本结束", repeat: 1, wait: 0 }];
  openModal(showModalHtml("", false, "edit", "", "", "closeModal();toast('表演已保存到机器人表演清单')", "closeModal()"));
}

function renderStageShowPicker() {
  const boundIds = stageBoundShowIds();
  const rows = filteredStageShows();
  openModal(`
    <div class="modal large stage-show-picker">
      <div class="modal-header">
        <div class="modal-title">选择表演</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="toolbar script-product-toolbar">
          <div class="filters">
            <input class="input w-260" placeholder="搜索表演ID / 名称" value="${stageShowPickerFilters.keyword}" oninput="setStageShowPickerFilter('keyword', this.value)" />
            <select class="select w-150" onchange="setStageShowPickerFilter('owner', this.value)">
              ${["全部归属", "公共模板", "用户模板"].map((owner) => `<option ${stageShowPickerFilters.owner === owner ? "selected" : ""}>${owner}</option>`).join("")}
            </select>${handoffMark("阶段表演来源归属", "去掉旧版来源筛选，按归属区分表演来源：公共模板展示表演管理大库全部内容，用户模板自动跟随当前脚本绑定机器人的表演清单。", "changed")}
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table stage-show-table">
            <thead>
              <tr>
                <th><input type="checkbox" onchange="selectAllStageShows(this.checked)" /></th>
                <th>序号</th>
                <th>表演ID</th>
                <th>表演名称</th>
                <th>归属</th>
                <th>单元数</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map((show, index) => {
                  const bound = boundIds.map(String).includes(String(show.id));
                  return `
                    <tr>
                      <td><input type="checkbox" ${selectedShowIdsInPicker.includes(show.id) ? "checked" : ""} ${bound ? "disabled" : ""} onchange="toggleStageShowSelection('${show.id}', this.checked)" /></td>
                      <td>${index + 1}</td>
                      <td>${show.id}</td>
                      <td class="left"><strong>${show.name}</strong></td>
                      <td>${show.owner}</td>
                      <td>${show.units}</td>
                      <td><span class="mini-tag ${show.status ? "green" : "gray"}">${show.status ? "已启用" : "停用"}</span></td>
                      <td>${show.created}</td>
                      <td>${bound ? '<span class="mini-tag gray">已绑定</span>' : `<button class="link" type="button" onclick="bindSingleStageShow('${show.id}')">绑定</button>`}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="bindSelectedStageShows()">绑定所选</button>
      </div>
    </div>
  `);
}

function filteredStageShows() {
  const keyword = stageShowPickerFilters.keyword.trim();
  return allAvailableShows().filter((show) => {
    const matchKeyword = !keyword || String(show.id).includes(keyword) || show.name.includes(keyword);
    const matchOwner = stageShowPickerFilters.owner === "全部归属" || show.owner === stageShowPickerFilters.owner;
    return matchKeyword && matchOwner;
  });
}

function allAvailableShows() {
  return [...shows, ...userRobotShows];
}

function setStageShowPickerFilter(key, value) {
  stageShowPickerFilters[key] = value;
  renderStageShowPicker();
}

function toggleStageShowSelection(showId, checked) {
  if (checked && !selectedShowIdsInPicker.includes(showId)) selectedShowIdsInPicker.push(showId);
  if (!checked) selectedShowIdsInPicker = selectedShowIdsInPicker.filter((id) => id !== showId);
}

function selectAllStageShows(checked) {
  const boundIds = stageBoundShowIds();
  selectedShowIdsInPicker = checked ? filteredStageShows().map((show) => show.id).filter((id) => !boundIds.map(String).includes(String(id))) : [];
  renderStageShowPicker();
}

function bindSingleStageShow(showId) {
  selectedShowIdsInPicker = [showId];
  bindSelectedStageShows();
}

function bindSelectedStageShows() {
  const ids = stageBoundShowIds();
  selectedShowIdsInPicker.forEach((id) => {
    if (!ids.map(String).includes(String(id))) ids.push(Number.isNaN(Number(id)) ? id : Number(id));
  });
  closeModal();
  toast("表演已绑定到当前阶段");
  renderApp();
}

function editShowSource(showName) {
  openShowModal(showName, true);
}

function currentScriptProductBinding(scriptId = selectedScriptId) {
  if (!scriptProductBindings[scriptId]) {
    scriptProductBindings[scriptId] = {
      scriptProductIds: [],
      primaryProductId: "",
      productOrder: [],
      stageProductBindings: {},
    };
  }
  const binding = scriptProductBindings[scriptId];
  binding.productOrder = [
    ...binding.productOrder.filter((id) => binding.scriptProductIds.includes(id)),
    ...binding.scriptProductIds.filter((id) => !binding.productOrder.includes(id)),
  ];
  if (binding.primaryProductId && !binding.scriptProductIds.includes(binding.primaryProductId)) {
    binding.primaryProductId = binding.productOrder[0] || "";
  }
  return binding;
}

function orderedScriptProducts(scriptId = selectedScriptId) {
  const binding = currentScriptProductBinding(scriptId);
  return binding.productOrder.map((id) => products.find((product) => product.id === id)).filter(Boolean);
}

function scriptProductSummary(scriptId = selectedScriptId) {
  const binding = currentScriptProductBinding(scriptId);
  const linked = orderedScriptProducts(scriptId);
  const primary = products.find((product) => product.id === binding.primaryProductId);
  return {
    total: binding.scriptProductIds.length,
    primary,
    abnormal: linked.filter((product) => !isProductAvailable(product)).length,
    unconfigured: unconfiguredScriptProductCount(scriptId),
  };
}

function unconfiguredScriptProductCount(scriptId = selectedScriptId) {
  const binding = currentScriptProductBinding(scriptId);
  const stageIds = Object.keys(binding.stageProductBindings).filter((id) => !id.endsWith("-02"));
  const configured = new Set(stageIds.flatMap((id) => binding.stageProductBindings[id] || []));
  return binding.scriptProductIds.filter((id) => !configured.has(id)).length;
}

function isProductAvailable(product) {
  return product && product.status === "已上架" && Number(product.stock) > 0;
}

function productStatusClass(product) {
  if (!product) return "gray";
  if (product.status === "已上架") return "green";
  if (product.status === "未上架") return "orange";
  return "red";
}

function stageProductMode(stage) {
  const name = stage?.name || "";
  if (name === "商品总览") return { type: "multi", defaultType: "all", label: "多选" };
  if (name === "商品讲解") return { type: "single", defaultType: "current", label: "单选" };
  if (name === "商品答疑") return { type: "multi", defaultType: "all", label: "多选" };
  if (name === "商品切换 / 下一品") return { type: "single", defaultType: "next", label: "单选" };
  if (name === "转化引导") return { type: "multi", defaultType: "primary", label: "多选" };
  return null;
}

function defaultStageProductIds(stage, mode, scriptId = selectedScriptId) {
  const binding = currentScriptProductBinding(scriptId);
  const order = binding.productOrder;
  if (!order.length) return [];
  if (mode.defaultType === "all") return [...order];
  if (mode.defaultType === "next") return order[1] ? [order[1]] : [order[0]];
  if (mode.defaultType === "primary") return [binding.primaryProductId || order[0], order[1]].filter(Boolean);
  return [order[0]];
}

function stageProductIds(stage) {
  const mode = stageProductMode(stage);
  if (!mode) return [];
  const binding = currentScriptProductBinding();
  const saved = binding.stageProductBindings[stage.id];
  if (saved) return saved.filter((id) => binding.scriptProductIds.includes(id));
  return defaultStageProductIds(stage, mode);
}

function renderStageProductField(anchor, stage) {
  const script = currentScript();
  const mode = script.type === "直播" && anchor.id === "commerce" ? stageProductMode(stage) : null;
  if (!mode) return "";
  const linked = orderedScriptProducts();
  const selectedIds = stageProductIds(stage);
  if (!linked.length) {
    return `
      <div class="stage-product-field empty">
        <div>
          <strong>适用商品${handoffMark("阶段商品池来源", "阶段商品只能从脚本顶部已关联商品池中选择，避免阶段引用未下发商品。", "info")}</strong>
          <span>当前脚本还没有关联商品，请先在顶部“关联商品”入口建立本场商品池。</span>
        </div>
        <button class="btn small" type="button" onclick="openScriptProductsModal()">去关联商品</button>
      </div>
    `;
  }
  const selectedTags = selectedIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean)
    .map((product) => `<span class="product-pill selected">${product.image} ${product.title.slice(0, 12)}</span>`)
    .join("");
  const control =
    mode.type === "single"
      ? `
        <select class="select stage-product-select" onchange="setStageProductBinding('${stage.id}', [this.value])">
          ${linked.map((product) => `<option value="${product.id}" ${selectedIds[0] === product.id ? "selected" : ""}>${product.id} - ${product.title}</option>`).join("")}
        </select>
      `
      : `
        <div class="stage-product-tags">
          ${linked
            .map((product) => {
              const selected = selectedIds.includes(product.id);
              return `<button class="product-pill ${selected ? "selected" : ""}" type="button" onclick="toggleStageProductBinding('${stage.id}', '${product.id}')">${product.image} ${product.title.slice(0, 10)}</button>`;
            })
            .join("")}
        </div>
      `;
  return `
    <div class="stage-product-field">
      <div class="stage-product-head">
        <div>
          <strong>适用商品${handoffMark("阶段商品选择规则", "商品讲解阶段为单选，商品答疑或互动阶段可按规则多选适用商品。", "info")}</strong>
          <span class="mini-tag gray">${mode.label}</span>
        </div>
        <button class="link" type="button" onclick="openScriptProductsModal()">管理商品池</button>
      </div>
      ${control}
      <div class="stage-product-selected">${selectedTags || '<span class="flow-subtext">暂未选择商品</span>'}</div>
    </div>
  `;
}

function setStageProductBinding(stageId, productIds) {
  const binding = currentScriptProductBinding();
  binding.stageProductBindings[stageId] = productIds.filter((id) => binding.scriptProductIds.includes(id));
  toast("阶段适用商品已更新");
  renderApp();
}

function toggleStageProductBinding(stageId, productId) {
  const binding = currentScriptProductBinding();
  const stage = currentStages().find((item) => item.id === stageId) || currentStage();
  const current = stageProductIds(stage);
  const next = current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId];
  binding.stageProductBindings[stageId] = next.filter((id) => binding.scriptProductIds.includes(id));
  toast("阶段适用商品已更新");
  renderApp();
}

function changeScriptType(type) {
  const script = currentScript();
  script.type = type;
  if (type === "直播") {
    selectedAnchorType = ["chat", "talent", "commerce"].includes(selectedAnchorType) ? selectedAnchorType : "commerce";
    script.anchorType = selectedAnchorType;
    script.templateName = currentAnchorTemplate().templateName;
  } else {
    selectedAnchorType = type === "导览" ? "tour" : type === "剧目" ? "drama" : "activity";
    script.anchorType = selectedAnchorType;
    script.templateName = `${type}模板`;
    if (type === "导览") script.mapId = script.mapId || selectedMapId;
  }
  selectedStageId = (currentStages().find((stage) => stage.active) || currentStages()[0]).id;
  toast(`已切换为${type}脚本，并带入默认阶段模板`);
  renderApp();
}

function changeAnchorType(anchorId) {
  selectedAnchorType = anchorId;
  const stages = currentStages();
  selectedStageId = (stages.find((stage) => stage.active) || stages[2] || stages[0]).id;
  toast("切换主播类型将重新生成默认阶段");
  renderApp();
}

function selectStage(stageId) {
  selectedStageId = stageId;
  renderApp();
}

function addStage() {
  const stages = currentStages();
  const nextOrder = String(stages.length + 1).padStart(2, "0");
  const isTour = currentScript().type === "导览";
  stages.push({
    id: `${selectedAnchorType}-${Date.now()}`,
    order: nextOrder,
    name: isTour ? "AGV_新阶段" : "",
    type: "普通流程",
    priorityMode: "流程优先",
    min: "",
    suggest: "",
    max: "",
    skip: "",
    executionLogic: { mode: "loop-count", value: 1 },
    boundShowIds: [],
    status: "待配置",
  });
  selectedStageId = stages[stages.length - 1].id;
  toast("已新增阶段");
  renderApp();
}

function addOfflineStage() {
  const stages = currentStages();
  const nextOrder = String(stages.length + 1).padStart(2, "0");
  const stage = {
    id: `${selectedAnchorType}-offline-${Date.now()}`,
    order: nextOrder,
    name: "线下互动",
    type: "线下互动",
    min: "2m",
    suggest: "3m",
    max: "5m",
    interactionDuration: "3",
    status: "待配置",
  };
  stages.push(stage);
  selectedStageId = stage.id;
  toast("已新增线下互动环节");
  renderApp();
}

function startStageDrag(index) {
  draggingStageIndex = index;
}

function dropStage(index) {
  if (draggingStageIndex === null || draggingStageIndex === index) return;
  reorderStage(draggingStageIndex, index);
  draggingStageIndex = null;
  toast("阶段顺序已调整");
  renderApp();
}

function moveStage(index, step) {
  const target = index + step;
  const stages = currentStages();
  if (target < 0 || target >= stages.length) return;
  reorderStage(index, target);
  toast("阶段顺序已调整");
  renderApp();
}

function deleteStage(index) {
  const stages = currentStages();
  if (stages.length <= 1) {
    toast("至少保留一个阶段");
    return;
  }
  const [removed] = stages.splice(index, 1);
  stages.forEach((stage, stageIndex) => {
    stage.order = String(stageIndex + 1).padStart(2, "0");
  });
  const binding = currentScriptProductBinding();
  if (removed?.id && binding.stageProductBindings[removed.id]) delete binding.stageProductBindings[removed.id];
  if (removed?.id === selectedStageId) selectedStageId = stages[Math.max(0, index - 1)]?.id || stages[0].id;
  toast("阶段已删除");
  renderApp();
}

function reorderStage(fromIndex, toIndex) {
  const stages = currentStages();
  const [moving] = stages.splice(fromIndex, 1);
  stages.splice(toIndex, 0, moving);
  stages.forEach((stage, index) => {
    stage.order = String(index + 1).padStart(2, "0");
  });
}

function openScriptProductsModal() {
  scriptProductModalSelection = [];
  renderScriptProductsModal();
}

function renderScriptProductsModal() {
  const script = currentScript();
  const summary = scriptProductSummary();
  const rows = filteredScriptProducts();
  openModal(`
    <div class="modal full script-product-modal">
      <div class="modal-header">
        <div class="modal-title">脚本关联商品</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="script-product-summary">
          <div>
            <strong>已关联 ${summary.total} 个商品 / 主推 ${summary.primary ? "1" : "0"} 个 / 未配置阶段 ${summary.unconfigured} 个</strong>
            <span class="sr-only">${script.name}</span>
          </div>
          <div class="script-product-actions">
            <button class="btn secondary small" type="button" onclick="batchJoinScriptProducts()">批量加入</button>
            <button class="btn secondary small" type="button" onclick="batchRemoveScriptProducts()">批量移除</button>
          </div>
        </div>
        <div class="toolbar script-product-toolbar">
          <div class="filters">
            <label class="field-inline">店铺
              <select class="select w-180" onchange="setScriptProductFilter('shop', this.value)">
                ${["全部店铺", ...Array.from(new Set(products.map((product) => product.shop)))].map((shop) => `<option ${scriptProductFilters.shop === shop ? "selected" : ""}>${shop}</option>`).join("")}
              </select>
            </label>
            <input class="input w-260" placeholder="输入商品ID或商品名称搜" value="${scriptProductFilters.keyword || ""}" oninput="setScriptProductFilter('keyword', this.value)" />
            <label class="field-inline">商品状态
              <select class="select w-150" onchange="setScriptProductFilter('status', this.value)">
                ${["全部状态", "已上架", "未上架", "已删除"].map((status) => `<option ${scriptProductFilters.status === status ? "selected" : ""}>${status}</option>`).join("")}
              </select>
            </label>
            <label class="field-inline">绑定状态
              <select class="select w-150" onchange="setScriptProductFilter('binding', this.value)">
                ${["全部", "已关联", "未关联"].map((status) => `<option ${scriptProductFilters.binding === status ? "selected" : ""}>${status}</option>`).join("")}
              </select>
            </label>
          </div>
        </div>
        <div class="table-wrap script-product-table-wrap">
          <table class="data-table script-product-table">
            <thead>
              <tr>
                <th><input type="checkbox" onchange="selectAllScriptProducts(this.checked)" /></th>
                <th>序号</th>
                <th>商品ID</th>
                <th>店铺</th>
                <th>图片</th>
                <th>商品标题</th>
                <th>分类</th>
                <th>价格</th>
                <th>库存</th>
                <th>讲解视频</th>
                <th>讲解文案</th>
                <th>商品状态</th>
                <th>脚本绑定状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((product, index) => scriptProductRow(product, index)).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="closeModal();renderApp();toast('脚本商品绑定已保存')">保存绑定</button>
      </div>
    </div>
  `);
}

function filteredScriptProducts() {
  const keyword = (scriptProductFilters.keyword || "").trim();
  const binding = currentScriptProductBinding();
  return products.filter((product) => {
    const matchShop = scriptProductFilters.shop === "全部店铺" || product.shop === scriptProductFilters.shop;
    const matchStatus = scriptProductFilters.status === "全部状态" || product.status === scriptProductFilters.status;
    const linked = binding.scriptProductIds.includes(product.id);
    const matchBinding = scriptProductFilters.binding === "全部" || (scriptProductFilters.binding === "已关联" ? linked : !linked);
    const matchKeyword = !keyword || product.id.includes(keyword) || product.title.includes(keyword);
    return matchShop && matchStatus && matchBinding && matchKeyword;
  });
}

function scriptProductRow(product, index) {
  const binding = currentScriptProductBinding();
  const linked = binding.scriptProductIds.includes(product.id);
  const primary = binding.primaryProductId === product.id;
  const available = isProductAvailable(product);
  const orderIndex = binding.productOrder.indexOf(product.id);
  const statusText = linked ? (primary ? "已关联 / 主推" : "已关联") : "未关联";
  const abnormal = linked && !available ? `<div class="flow-subtext danger">异常：${product.status}，请移除或替换</div>` : "";
  return `
    <tr>
      <td><input type="checkbox" ${scriptProductModalSelection.includes(product.id) ? "checked" : ""} onchange="toggleScriptProductSelection('${product.id}', this.checked)" /></td>
      <td>${linked ? orderIndex + 1 : index + 1}</td>
      <td>${product.id}</td>
      <td>${product.shop}</td>
      <td><div class="product-img ${product.imageClass}">${product.image}</div></td>
      <td class="left">${product.title}</td>
      <td>${product.category}</td>
      <td class="price">${product.price}</td>
      <td>${product.stock}</td>
      <td>${product.video ? '<button class="link">◎ 预览视频</button>' : '<span class="flow-subtext">未上传</span>'}</td>
      <td class="left">${product.copy}<br /><button class="link">编辑文案</button></td>
      <td><span class="mini-tag ${productStatusClass(product)}">${product.status}</span></td>
      <td><span class="mini-tag ${linked ? "blue" : "gray"}">${statusText}</span>${abnormal}</td>
      <td class="script-product-op">
        ${
          linked
            ? `
              <button class="link" type="button" onclick="setPrimaryScriptProduct('${product.id}')">设为主推</button>
              <button class="link" type="button" onclick="moveScriptProduct('${product.id}', -1)" ${orderIndex <= 0 ? "disabled" : ""}>上移</button>
              <button class="link" type="button" onclick="moveScriptProduct('${product.id}', 1)" ${orderIndex >= binding.productOrder.length - 1 ? "disabled" : ""}>下移</button>
              <button class="link danger" type="button" onclick="removeScriptProduct('${product.id}')">从脚本移除</button>
            `
            : `<button class="link ${available ? "" : "disabled"}" type="button" onclick="joinScriptProduct('${product.id}')" ${available ? "" : "disabled"}>${available ? "加入脚本" : "不可加入"}</button>`
        }
      </td>
    </tr>
  `;
}

function setScriptProductFilter(key, value) {
  scriptProductFilters[key] = value;
  renderScriptProductsModal();
}

function toggleScriptProductSelection(productId, checked) {
  if (checked && !scriptProductModalSelection.includes(productId)) scriptProductModalSelection.push(productId);
  if (!checked) scriptProductModalSelection = scriptProductModalSelection.filter((id) => id !== productId);
}

function selectAllScriptProducts(checked) {
  scriptProductModalSelection = checked ? filteredScriptProducts().map((product) => product.id) : [];
  renderScriptProductsModal();
}

function joinScriptProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!isProductAvailable(product)) {
    toast("未上架或已删除商品不能加入脚本");
    return;
  }
  const binding = currentScriptProductBinding();
  if (!binding.scriptProductIds.includes(productId)) binding.scriptProductIds.push(productId);
  if (!binding.productOrder.includes(productId)) binding.productOrder.push(productId);
  if (!binding.primaryProductId) binding.primaryProductId = productId;
  toast("商品已加入当前脚本");
  renderScriptProductsModal();
  renderApp();
}

function removeScriptProduct(productId) {
  const binding = currentScriptProductBinding();
  binding.scriptProductIds = binding.scriptProductIds.filter((id) => id !== productId);
  binding.productOrder = binding.productOrder.filter((id) => id !== productId);
  if (binding.primaryProductId === productId) binding.primaryProductId = binding.productOrder[0] || "";
  Object.keys(binding.stageProductBindings).forEach((stageId) => {
    binding.stageProductBindings[stageId] = binding.stageProductBindings[stageId].filter((id) => id !== productId);
  });
  toast("商品已从当前脚本移除");
  renderScriptProductsModal();
  renderApp();
}

function batchJoinScriptProducts() {
  if (!scriptProductModalSelection.length) {
    toast("请先勾选要加入的商品");
    return;
  }
  const eligibleIds = scriptProductModalSelection.filter((id) => isProductAvailable(products.find((product) => product.id === id)));
  eligibleIds.forEach(joinScriptProductWithoutRender);
  toast(`已批量加入 ${eligibleIds.length} 个商品`);
  renderScriptProductsModal();
  renderApp();
}

function joinScriptProductWithoutRender(productId) {
  const binding = currentScriptProductBinding();
  if (!binding.scriptProductIds.includes(productId)) binding.scriptProductIds.push(productId);
  if (!binding.productOrder.includes(productId)) binding.productOrder.push(productId);
  if (!binding.primaryProductId) binding.primaryProductId = productId;
}

function batchRemoveScriptProducts() {
  if (!scriptProductModalSelection.length) {
    toast("请先勾选要移除的商品");
    return;
  }
  const removeIds = [...scriptProductModalSelection];
  removeIds.forEach((id) => {
    const binding = currentScriptProductBinding();
    binding.scriptProductIds = binding.scriptProductIds.filter((productId) => productId !== id);
    binding.productOrder = binding.productOrder.filter((productId) => productId !== id);
    Object.keys(binding.stageProductBindings).forEach((stageId) => {
      binding.stageProductBindings[stageId] = binding.stageProductBindings[stageId].filter((productId) => productId !== id);
    });
  });
  const binding = currentScriptProductBinding();
  if (!binding.scriptProductIds.includes(binding.primaryProductId)) binding.primaryProductId = binding.productOrder[0] || "";
  scriptProductModalSelection = [];
  toast(`已批量移除 ${removeIds.length} 个商品`);
  renderScriptProductsModal();
  renderApp();
}

function setPrimaryScriptProduct(productId) {
  const binding = currentScriptProductBinding();
  if (!binding.scriptProductIds.includes(productId)) return;
  binding.primaryProductId = productId;
  toast("主推商品已更新");
  renderScriptProductsModal();
  renderApp();
}

function moveScriptProduct(productId, step) {
  const binding = currentScriptProductBinding();
  const index = binding.productOrder.indexOf(productId);
  const target = index + step;
  if (index < 0 || target < 0 || target >= binding.productOrder.length) return;
  const temp = binding.productOrder[index];
  binding.productOrder[index] = binding.productOrder[target];
  binding.productOrder[target] = temp;
  toast("讲解顺序已调整");
  renderScriptProductsModal();
  renderApp();
}

function flowInfoItem(icon, label, value, tone = "") {
  return `
    <div class="flow-info-item ${tone}">
      <span>${icon} ${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function readonlyField(label, value) {
  return `
    <label class="field-block">
      <span>${label}</span>
      <input class="input" value="${value}" readonly />
    </label>
  `;
}

function textField(label, value, oninput = "") {
  return `
    <label class="field-block">
      <span>${label}</span>
      <input class="input" value="${value}" ${oninput ? `oninput="${oninput}"` : ""} />
    </label>
  `;
}

function selectField(label, value, options, onchange = "") {
  return `
    <label class="field-block">
      <span>${label}</span>
      <select class="select" ${onchange ? `onchange="${onchange}"` : ""}>
        ${options.map((option) => `<option value="${option}" ${option === value ? "selected" : ""}>${option || "请选择"}</option>`).join("")}
      </select>
    </label>
  `;
}

function selectLikeField(label, value) {
  return `
    <label class="field-block">
      <span>${label}</span>
      <select class="select"><option>${value}</option></select>
    </label>
  `;
}

function numberField(label, value, suffix, oninput = "") {
  return `
    <label class="field-block">
      <span>${label}</span>
      <div class="number-field"><input value="${value}" type="number" ${oninput ? `oninput="${oninput}"` : ""} /><em>${suffix}</em></div>
    </label>
  `;
}

function stageModeField(stage) {
  const value = stagePriorityMode(stage);
  return `
    <label class="field-block stage-mode-field">
      <span>模式${handoffMark("阶段模式优先级", "流程优先按阶段编排执行；互动优先时优先响应真人互动和直播间事件。", "info")}</span>
      <select class="select" onchange="updateStagePriorityMode(this.value)">
        <option value="流程优先" ${value === "流程优先" || value === "flow" ? "selected" : ""}>流程优先</option>
        <option value="互动优先" ${value === "互动优先" || value === "interaction" ? "selected" : ""}>互动优先</option>
      </select>
    </label>
  `;
}

function showExecutionLogicField(stage) {
  const logic = stageExecutionLogic(stage);
  const extraLabel = logic.mode === "random" ? "随机条数" : logic.mode === "loop-duration" ? "执行时长" : "执行次数";
  const suffix = logic.mode === "random" ? "条" : "次";
  const valueControl =
    logic.mode === "loop-duration"
      ? `<select class="select" onchange="updateStageExecutionValue(this.value)">${loopDurationMinuteOptions.map((minute) => `<option value="${minute}" ${String(logic.value || 1) === String(minute) ? "selected" : ""}>${minute}</option>`).join("")}</select><em>分钟</em>`
      : `<input class="input" type="number" min="1" value="${logic.value || ""}" oninput="updateStageExecutionValue(this.value)" /><em>${suffix}</em>`;
  return `
    <div class="performance-logic-config">
      <label class="field-block">
        <span>完整表演执行逻辑${handoffMark("阶段完整表演逻辑", "脚本阶段绑定表演时新增完整执行逻辑，需与表演编辑页字段保持一致。")}</span>
        <select class="select" onchange="updateStageExecutionMode(this.value)">
          ${executionLogicOptions.map(([value, label]) => `<option value="${value}" ${logic.mode === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
      <label class="field-block compact">
        <span>${extraLabel}</span>
        <div class="number-field">${valueControl}</div>
      </label>
    </div>
  `;
}

function checkField(label, options) {
  return `
    <label class="field-block">
      <span>${label}</span>
      <div class="check-line">
        ${options.map((option) => `<label><input type="checkbox" checked /> ${option}</label>`).join("")}
      </div>
    </label>
  `;
}

function typeClass(type) {
  if (["开场", "总览", "预热"].includes(type)) return "blue";
  if (["讲解", "才艺", "聊天", "陪伴"].includes(type)) return "purple";
  if (["答疑", "互动", "点播"].includes(type)) return "cyan";
  if (["转化", "礼物"].includes(type)) return "orange";
  if (type === "自播") return "green";
  return "gray";
}

function openModal(html) {
  document.getElementById("modalRoot").innerHTML = `<div class="modal-backdrop ${handoffMode ? "handoff-enabled" : ""}">${html}</div>`;
  syncBusinessModalHandoffToggle();
  mountPlacedHandoffAnnotations();
}

function closeModal() {
  document.getElementById("modalRoot").innerHTML = "";
  if (handoffPlacementMode) stopHandoffPlacement();
  mountPlacedHandoffAnnotations();
}

function syncBusinessModalHandoffToggle() {
  const backdrop = document.querySelector("#modalRoot .modal-backdrop");
  const modal = document.querySelector("#modalRoot .modal");
  const header = modal?.querySelector(".modal-header");
  backdrop?.classList.toggle("handoff-enabled", handoffMode);
  if (!header) return;

  let button = header.querySelector(".modal-handoff-toggle");
  if (!button) {
    button = document.createElement("button");
    button.className = "btn secondary small modal-handoff-toggle";
    button.type = "button";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleHandoffMode();
    });
    const closeButton = header.querySelector(".modal-close");
    header.insertBefore(button, closeButton || null);
  }
  button.textContent = handoffMode ? "隐藏标注" : "显示标注";
}

function openHandoffModal(html) {
  document.getElementById("handoffModalRoot").innerHTML = `<div class="modal-backdrop handoff-editor-backdrop handoff-enabled">${html}</div>`;
  mountPlacedHandoffAnnotations();
}

function closeHandoffModal() {
  document.getElementById("handoffModalRoot").innerHTML = "";
  mountPlacedHandoffAnnotations();
}

function toast(message) {
  const toastEl = document.getElementById("toast");
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(toastEl.timer);
  toastEl.timer = window.setTimeout(() => toastEl.classList.remove("show"), 2200);
}

if (typeof document !== "undefined") {
  document.addEventListener("click", handleHandoffPlacementClick, true);
  document.addEventListener("pointermove", handleHandoffPanelDrag);
  document.addEventListener("pointerup", stopHandoffPanelDrag);
  document.addEventListener("pointercancel", stopHandoffPanelDrag);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && handoffPlacementMode) {
      stopHandoffPlacement();
      toast("已取消定位新增");
    }
  });
  window.addEventListener("resize", () => {
    if (handoffFloatingPanelPosition) {
      handoffFloatingPanelPosition = clampHandoffPanelPosition(handoffFloatingPanelPosition);
      saveHandoffPanelPosition();
    }
    if (handoffMode) mountPlacedHandoffAnnotations();
  });
  window.addEventListener(
    "scroll",
    () => {
      if (handoffMode) mountPlacedHandoffAnnotations();
    },
    true,
  );
}

renderApp();
loadProjectHandoffAnnotations();
