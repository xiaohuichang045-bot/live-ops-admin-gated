const commercePages = [
  { key: "live-dashboard", label: "直播数据大屏", group: "商城管理" },
];

const virtualLivePages = [
  { key: "changelog", label: "更新日志" },
  { key: "products", label: "虚拟直播商品" },
  { key: "rooms", label: "管理直播间" },
  { key: "conversations", label: "历史对话" },
  { key: "agents", label: "智能体管理" },
  { key: "materials", label: "素材管理" },
  { key: "faces", label: "人脸管理" },
  { key: "actions", label: "动作管理2" },
  { key: "flow", label: "脚本管理" },
  { key: "maps", label: "展览地图管理" },
  { key: "robots", label: "机器人管理" },
  { key: "robot-ops", label: "机器人运维" },
  { key: "skills", label: "技能管理" },
  { key: "shows", label: "表演管理" },
];

const pages = [...commercePages, ...virtualLivePages];
const customerHiddenPageKeys = new Set(["agents", "faces"]);
const customerHiddenRobotBatchGroups = new Set(["大模型配置", "售卖与租赁"]);

let activePage = initialPageKey();
let visitedTabs = [activePage];
let skillKeywords = ["发货", "讲解戒指"];
let skillEventTriggers = [];
let perfUnits = [];
let performanceEditorContext = { name: "四位一体讲解", edit: true, returnRobotId: "", returnTab: "" };
let performanceEditorDraftName = "";
let highlightedInlineShowId = "";
const scriptInlineShows = [];
let robotScriptImportContext = { robotId: "", fileName: "", step: 0, sameName: "rename", includeMap: false, templateKind: "general", source: "robot" };
let scriptFlowView = initialFlowView();
let selectedScriptId = "SCRIPT-006";
let selectedAnchorType = "chat";
let selectedStageId = "health-chat-01";
let scriptPreviewState = { mode: "timeline", focusStageId: "", stepIndex: 0, eventScenario: "none" };
let scriptEditorReturnContext = { type: "script-list", label: "脚本列表" };
let selectedRoomRoleValue = "RBT008-导购讲解-柳如春";
let selectedRoomScriptId = "";
let roomModalDraft = { account: "" };
let productFilters = { shop: "全部店铺", keyword: "" };
let selectedProductIds = [];
let roomFilters = { keyword: "", status: "全部" };
let mapFilters = { keyword: "", channelId: "全部渠道" };
let robotFilters = { keyword: "", mode: "机器人类型", status: "状态" };
let scriptListFilters = { keyword: "", type: "全部类型", status: "全部状态" };
let skillFilters = { keyword: "", category: "类型", channelId: "全部渠道" };
let showFilters = { keyword: "", status: "状态", channelId: "全部渠道" };
let faceFilters = { keyword: "", source: "请选择来源", channelId: "全部渠道" };
let materialFilters = { keyword: "", tag: "", channelId: "全部渠道" };
let agentFilters = { keyword: "", channelId: "全部渠道" };
let singleActionFilters = { keyword: "", type: "全部类型", posture: "全部姿态", channelId: "全部渠道" };
let actionGroupFilters = { keyword: "", type: "动作类型", channelId: "全部渠道" };
let robotSingleActionFilters = { keyword: "", type: "全部类型", posture: "全部姿态" };
let conversationFilters = { time: "近7天", roomId: "", robotId: "", user: "", keyword: "" };
let draggingStageIndex = null;
let draggingShowIndex = null;
let draggingRobotResource = null;
let actionManagerTab = "single";
let actionGroupDraftItems = [];
let scriptProductModalSelection = [];
let scriptProductModalBackup = null;
let scriptProductFilters = { shop: "全部店铺", status: "全部状态", binding: "全部" };
let scriptMapPickerBackup = null;
let selectedShowIdsInPicker = [];
let robotResourcePickerSelection = [];
let stageShowPickerFilters = { keyword: "", owner: "全部归属" };
let batchRobotPreview = null;
let batchRobotResult = null;
let robotEditorTab = "role";
let createRobotDraft = null;
let robotEditorDrafts = {};
let robotActionTab = "single";
let selectedRobotId = "142";
let selectedMapId = "MAP-B2";
let draggingIdleShowIndex = null;
let draggingPerfUnitIndex = null;
let handoffMode = initialHandoffMode();
const handoffTimestamp = "2026-06-01 00:00";
const handoffAnnotationProjectUrl = "handoff-annotations.json";
const handoffAnnotationStorageKey = "liveAdminHandoffAnnotations";
const handoffAnnotationProjectCacheKey = "liveAdminHandoffProjectAnnotations";
const handoffPanelPositionStorageKey = "liveAdminHandoffPanelPosition";
const handoffFabPositionStorageKey = "liveAdminHandoffFabPosition";
if (typeof window !== "undefined") window.localStorage?.removeItem(handoffPanelPositionStorageKey);
let handoffProjectAnnotations = initialHandoffProjectAnnotations();
let handoffLocalAnnotations = initialHandoffAnnotations();
let handoffAnnotations = mergeHandoffAnnotationSources();
const handoffAnnotationDefaults = {};
const archivedHandoffAnnotationKeys = new Set([
  "点位列表字段::旧版列名为点位名称；本次更名为点位列表，显示系统AGV_点位ID。",
  "点位名称维护::新增点位名称列，支持为每个点位编辑可读名称。",
  "表演来源归属::去掉旧版来源筛选，按归属区分表演来源：公共模板展示表演管理大库全部内容，用户模板自动跟随当前脚本绑定机器人的表演清单。",
  "机器人脚本管理页签::机器人编辑页新增脚本管理页签，用于查看已下发脚本、设置当前执行脚本和移除脚本。",
  "直播间事件触发规则::技能可由关键词或直播间事件触发，二者满足任一即可保存。",
  "直播间事件类型::事件类型枚举：不配置、点赞、关注、送礼物；送礼物需继续选择礼物档位。",
  "礼物档位选择::礼物档位枚举：基础礼物、中档礼物、高价值礼物；只选择档位，不做价格区间校验。",
  "功能清单列结构::旧版功能清单表格含父记录列；本次调整为10列，移除父记录列并调整各列宽度。",
  "点位列表管理::旧版为上传点位；本次改为点位列表管理，AGV_HOME为系统必有不可删除，新增点位自动按AGV_P1递增，支持编辑点位名称。",
  "新增菜单::旧版后台无脚本管理；开发交付时需按新业务模块整体实现。",
  "脚本名称检索::脚本名称同步展示在脚本列表、机器人下发记录和直播间脚本选择器，需支持按名称检索。",
  "脚本类型工作区::脚本类型决定页面工作区：直播展示主播类型和商品关联；导览展示地图/点位；剧目/活动使用线下流程配置。",
  "主播类型模板::直播脚本通过主播类型带入默认阶段模板和阶段默认配置。",
  "绑定机器人下发目标::保存并下发时写入机器人当前执行脚本；导览脚本仅允许绑定 AGV 机器人。",
  "直播商品池关联::带货直播脚本需要先建立商品池；阶段内再按单选或多选规则绑定适用商品。",
  "导览地图关联::导览脚本关联地图后，阶段名称和适用点位从地图点位列表中选择。",
  "阶段时间线编排::左侧阶段支持选中编辑、拖拽排序、新增和删除；当前阶段在右侧同步展示配置表单。",
  "阶段类型标签显示::阶段类型为真人互动、弹幕互动或等待时在卡片显示类型标签，便于开发和运营快速识别特殊工作区。",
  "阶段名称同步::阶段名称展示在时间线、阶段配置和下发后的执行明细中。",
  "阶段基础信息范围::维护阶段名称、阶段类型、模式，以及直播商品或导览点位等业务上下文。",
  "阶段类型工作区::普通流程：配置表演和等待；真人互动：配置互动时长/对话模式；弹幕互动：由弹幕触发承接；等待：配置等待时长，机器人只听不说。",
  "阶段表演绑定::阶段可绑定一个或多个表演，支持拖拽排序、编辑源表演、解除绑定和配置表演后等待秒数。",
  "导览规则::导览阶段名称固定使用 AGV_ 前缀，便于和地图点位及机器人移动指令对齐。",
  "导览规则::每个导览阶段绑定一个地图点位，数据源来自当前脚本关联地图。",
  "机器人批量创建::机器人管理新增批量创建机器人：支持下载模板、上传解析、预览、确认导入和结果报告。",
  "公共模板与用户模板边界::公共模板仍在大库维护并可下发；用户模板不再混在大库里，进入机器人管理对应机器人的技能/表演清单维护。",
  "直播间事件触发入口::新增直播间事件触发配置，编辑技能时可用直播间事件作为触发条件。",
  "完整表演批量导入::表演管理新增批量创建/批量导入完整表演，模板包含执行逻辑、随机条数、逻辑执行次数、执行时长等字段。",
  "表演模板归属边界::旧版公共模板和用户模板都在大库中维护；新版拆分为公共模板大库 + 机器人内用户模板。",
  "机器人版本选项::设备管理页机器人版本下拉新增 R版-机器头、Z版-机器人、AGV机器人 三个选项。",
  "表演来源筛选::机器人表演清单新增来源筛选，用于区分机器人自建和公共模板。",
  "新增机器人自建技能::机器人技能清单可直接新增机器人自建技能，编辑页与技能管理大库一致。",
  "新增机器人自建表演::机器人表演清单新增表演入口，创建机器人自建表演。",
  "绑定公共模板技能::机器人技能清单可从公共模板大库选择技能绑定到当前机器人，并拦截重复选择。",
  "绑定公共模板表演::机器人表演清单新增绑定大库入口，从公共模板中选择表演绑定到当前机器人。",
  "表演批量导入::机器人表演清单新增批量导入入口，同表演管理大库批量功能，支持模板下载和批量导入完整表演。",
  "表演行内操作::旧版操作列为新增/删除；新版已绑定表演行内改为编辑/移除。",
  "机器人脚本管理页签::机器人管理新增脚本管理页签，用于承接脚本管理页保存并下发到当前机器人的脚本。",
  "二期脚本入口::新增、导入、模板下载和版本能力校验均在当前机器人上下文完成。",
  "脚本阶段数量::展示脚本内阶段数量，来自脚本管理。",
  "脚本表演数量::展示脚本已绑定表演数量，来自脚本编辑阶段配置。",
  "当前执行脚本开关::新增当前执行脚本开关，打开后该脚本成为机器人当前执行脚本。",
  "脚本编辑与移除::编辑跳转到脚本编辑页；移除只解除该机器人和脚本的绑定，不删除脚本本体。",
  "脚本清单空状态::当机器人没有任何已下发脚本时展示该提示，引导去脚本管理下发。",
  "执行规则::同一机器人同时只能启用一个当前执行脚本，开启新脚本会关闭其他脚本。",
  "闲时表演来源::闲时表演只能从当前机器人表演清单已绑定表演中选择，可重复添加同一表演。",
  "闲时表演间隔::闲时表演间隔配置在闲时表演页签右侧，控制两次闲时表演之间的等待时间。",
  "完整表演执行方式::选项枚举：顺序执行、随机执行、顺序执行指定时长。顺序执行需配置执行次数，默认 1 次。",
  "表演单元执行次数::每条表演单元可配置执行次数；顺序执行会在表演整体层控制执行次数。",
  "表演单元等待时长::每条表演单元执行完成后可等待指定秒数，再进入下一条单元。",
  "阶段表演来源归属::去掉旧版来源筛选，按归属区分表演来源：公共模板展示表演管理大库全部内容，用户模板自动跟随当前脚本绑定机器人的表演清单。",
  "阶段商品池来源::阶段商品只能从脚本顶部已关联商品池中选择，避免阶段引用未下发商品。",
  "阶段商品选择规则::商品讲解阶段为单选，商品答疑或互动阶段可按规则多选适用商品。",
  "阶段模式优先级::流程优先按阶段编排执行；互动优先时优先响应真人互动和直播间事件。",
  "阶段完整表演逻辑::脚本阶段绑定表演时新增完整执行逻辑，需与表演编辑页字段保持一致。",
]);
let handoffPlacementMode = false;
let handoffPlacementScope = "auto";
let handoffFabPosition = initialHandoffFabPosition();
let handoffFabDrag = null;
let handoffFabSuppressClick = false;
let handoffPanelOpen = handoffMode;
let handoffAdvancedOpen = false;
let activeHandoffKey = "";
let handoffVisibleAnnotations = [];
let handoffSummaryCapturePage = "";
const handoffPageSummaryCache = {};
const featureListStorageKey = "liveAdminFeatureListRows";
const businessStateStorageKey = "liveAdminBusinessStateV3";
const businessStateVersion = 3;
let featureListRows = initialFeatureListRows();
let featureListFilters = { keyword: "", client: "全部端", module1: "全部模块", phase: "全部阶段", priority: "全部优先级" };
let changelogView = "timeline";
let changelogStatusFilter = "全部版本";
let phase2FeatureFilters = { keyword: "", module: "全部模块", type: "全部变化", priority: "全部优先级" };
let prototypePreviewVersionId = "";
const paginationState = {};
const phase2FeatureRows = [
  ["直播数据大屏", "新增", "实时/录播画面切换", "在直播时长右侧提供画面来源切换，支持实时画面与录播画面互切。", "上一版本只有直播间管理和基础开播/下播操作，缺少直播异常兜底入口。", true],
  ["直播数据大屏", "新增", "故障自动切录播", "网络、电机、扬声器、麦克风、推流和系统异常触发时自动切换可用录播。", "上一版本不能按故障类型自动切换内容源。", true],
  ["直播数据大屏", "新增", "最近72小时录屏池", "系统保留最近72小时录屏，自动切换优先使用最近24小时可用录屏。", "上一版本没有录播素材池、时间筛选和24小时优先标识。", true],
  ["直播数据大屏", "新增", "人工选择录屏文件", "人工切换支持按时间区间筛选、选择文件、预览、下载和本地上传录屏。", "上一版本没有人工指定兜底画面的操作路径。", true],
  ["直播数据大屏", "新增", "恢复自检与切回实时", "异常恢复后进入自检流程，自检通过后可切回实时画面，高风险异常要求人工确认。", "上一版本缺少恢复检测、确认恢复和恢复通知规则。", true],
  ["直播数据大屏", "新增", "画面状态与操作日志", "明确展示当前实时/录播状态，并记录自动切换、人工切换、恢复实时等操作日志。", "上一版本没有直播控制动作审计。", false],
  ["脚本管理", "优化", "阶段-表演-表演单元默认展开", "脚本编辑页按阶段、表演、表演单元层级默认展开已保存内容。", "上一版本脚本编辑偏表单，已保存内容不便逐层检查。", true],
  ["脚本管理", "优化", "表演单元只读检查", "每个表演单元展示文本、动作或动作组、结束依据、执行次数和等待时长。", "上一版本表演内容检查粒度不足。", true],
  ["脚本管理", "新增", "脚本内新增表演", "新增表演进入独立编辑页，保存后返回原脚本原阶段并自动回显。", "上一版本新增表演主要进入表演大库，本版本支持脚本上下文内创建。", true],
  ["脚本管理", "新增", "脚本内表演隔离", "脚本内新增表演随当前脚本保存，不进入表演管理大库或其他机器人私有库。", "上一版本资源归属边界不清，本版本明确脚本内临时表演隔离。", true],
  ["脚本管理", "优化", "整场脚本预览", "脚本顶部提供只读预览页，完整展示脚本信息、阶段、绑定资源、表演和表演单元。", "上一版本缺少交付前整场验稿视图。", true],
  ["脚本管理", "优化", "预览导航联动", "整场预览支持左侧阶段导航与右侧内容滚动双向联动。", "上一版本无法快速定位和复核阶段内容。", false],
  ["机器人脚本", "新增", "机器人详情脚本管理Tab", "机器人详情页脚本管理Tab提供新增脚本、导入脚本和模板下载入口。", "上一版本机器人脚本页签只承接已下发清单。", true],
  ["机器人脚本", "新增", "当前机器人新增脚本", "从机器人详情新增脚本时自动绑定当前机器人，顶部只读展示机器人ID、名称、版本和渠道。", "上一版本新增脚本仍需要人工选择机器人上下文。", true],
  ["机器人脚本", "新增", "机器人脚本导入预览", "导入弹窗展示当前机器人信息、上传区域、格式说明、校验结果、导入预览和确认导入。", "上一版本没有机器人维度的脚本导入闭环。", true],
  ["机器人脚本", "新增", "按版本下载模板", "模板根据当前机器人版本生成，包含字段说明、示例数据、填写规则和能力限制提示。", "上一版本模板不区分机器人版本能力。", false],
  ["机器人脚本", "新增", "版本能力校验", "R/Z版阻断地图和导览配置，AGV机器人允许导览脚本和地图路线。", "上一版本机器人版本只是资料字段，本版本参与脚本能力判断。", true],
  ["机器人脚本", "新增", "导入与启用规则", "导入整体校验失败不落库；新增和导入默认不启用；同一机器人同一时间仅一个启用脚本。", "上一版本缺少同名、覆盖、启用冲突和默认启用边界。", true],
  ["机器人运维", "新增", "直播机器人数据范围", "运维大屏仅展示有实体硬件且机器人类型为直播的设备。", "上一版本机器人管理偏资料维护，没有独立运维值守范围。", true],
  ["机器人运维", "新增", "运维多条件筛选", "支持按机器人版本、在线状态、告警类型和时间范围筛选。", "上一版本缺少面向巡检的筛选入口。", true],
  ["机器人运维", "新增", "画面/列表/全屏视图", "支持画面视图、列表视图和全屏监控切换，并保留当前筛选条件。", "上一版本没有面向多设备的画面墙和列表切换。", true],
  ["机器人运维", "新增", "告警与设备详情", "告警按异常类型优先级展示；点击设备打开详情，查看画面来源、网络、麦克风、扬声器、电机、推流和最近告警。", "上一版本设备信息停留在配置字段，本版本增加运行状态查看。", true],
  ["机器人运维", "新增", "跨页跳转联动", "设备详情支持进入当前机器人直播数据大屏和脚本执行管理页面。", "上一版本运维、直播控制和脚本执行入口相互割裂。", false],
  ["渠道与资源", "新增", "三类数据归属", "统一区分渠道公共数据、机器人私有数据和平台下发资源。", "上一版本公共模板、机器人私有资源和平台资源边界较弱。", true],
  ["渠道与资源", "新增", "渠道级数据隔离", "大库默认展示当前渠道公共数据，机器人详情只展示当前机器人私有数据，跨渠道默认不可查看、引用或编辑。", "上一版本数据默认混在同一原型池。", true],
  ["渠道与资源", "新增", "平台与客户权限差异", "微视中国作为平台最高权限维护平台资源并下发；客户渠道隐藏人脸视觉和智能体等敏感能力。", "上一版本缺少平台运营和客户运营的身份差异。", true],
  ["渠道与资源", "调整", "地图与导览能力边界", "仅AGV或AGV+Z机器人可配置地图和导览路线，R/Z版新增、保存、导入时必须阻断。", "上一版本地图导览能力与机器人版本未强绑定。", true],
  ["动作与下发", "调整", "单一动作平台维护", "单一动作属于平台下发资源，微视中国可新增、编辑、删除、启停和批量下发。", "上一版客户侧可维护单一动作，本版本收敛为平台维护。", true],
  ["动作与下发", "调整", "客户侧单一动作只读", "客户渠道只能查看、搜索、筛选和引用已下发单一动作，不显示新增、编辑、删除、状态开关和批量下发。", "上一版本客户侧动作权限过宽。", true],
  ["动作与下发", "新增", "多动作组合客户可配", "多动作组合属于客户可配置资源，客户可新增、编辑、删除、搜索和引用动作组。", "上一版本动作管理偏单动作维护，本版本支持组合编排。", true],
  ["动作与下发", "新增", "动作组可用性校验", "动作组只能选择当前渠道可用且当前机器人版本支持的单一动作，保存和引用时校验不可用动作。", "上一版本组合内动作可用性缺少阻断规则。", true],
  ["动作与下发", "新增", "批量下发入口", "在资源大库批量下发中支持技能、表演、单一动作、动作组、素材、人脸等资源。", "上一版本缺少平台向渠道或机器人下发资源的统一入口。", true],
  ["动作与下发", "新增", "渠道/机器人下发范围", "先选渠道，再按渠道筛机器人，并可继续按机器人类型、版本筛选；支持下发到渠道或指定机器人。", "上一版本下发对象和机器人筛选路径不清。", true],
  ["动作与下发", "调整", "下发只读引用", "下发到渠道或机器人后作为只读引用使用，不生成渠道副本或机器人私有副本。", "上一版本容易把下发资源理解为复制资源。", true],
].map((row, index) => ({ id: `P2-${String(index + 1).padStart(3, "0")}`, module: row[0], type: row[1], point: row[2], desc: row[3], compare: row[4], focus: row[5] }));
const phase2ComparisonRows = [
  ["直播异常兜底", "上一版本只有直播间管理和基础开播/下播操作。", "本版本新增自动切录播、人工选择录屏、恢复自检、状态提示和操作日志。"],
  ["脚本编排验稿", "上一版本已有脚本管理和阶段配置，但表演内容检查和整场预览不足。", "本版本按阶段-表演-表演单元展开内容，支持脚本内新增表演和只读整场预览。"],
  ["机器人脚本管理", "上一版本机器人详情页脚本能力偏绑定查看。", "本版本补新增、导入、模板下载、版本能力校验、同名覆盖和唯一启用规则。"],
  ["机器人运维", "上一版本以机器人资料、技能、表演和脚本绑定为主。", "本版本新增运维大屏、设备告警、运行状态抽屉和直播大屏联动。"],
  ["渠道与平台下发", "上一版本公共模板、机器人私有资源和客户渠道边界较弱。", "本版本补平台/客户渠道、三类数据归属、客户敏感功能隐藏、单一动作平台维护和渠道/机器人下发。"],
];
const phase2FocusRows = [
  ["直播异常兜底", "把黑屏、卡死、推流异常等风险收敛为自动/人工切录播、恢复自检和日志留痕。"],
  ["脚本生产与验稿", "补齐脚本内表演、整场预览、模板下载、导入预览、同名覆盖和版本能力校验。"],
  ["机器人运维联动", "把直播机器人画面、在线状态、设备告警、详情抽屉和直播大屏跳转串起来。"],
  ["渠道隔离与平台下发", "明确平台资源、客户渠道、机器人私有资源、单一动作和多动作组合的权限边界。"],
];

function prototypeVersions() {
  const focusText = phase2FocusRows.map((row) => row[0]).join("、");
  return [
    {
      id: "v2.0",
      title: "V2.0 · 二期优化",
      date: "2026-07-13",
      status: "开发中",
      statusClass: "",
      current: true,
      featureView: "phase2",
      previewUrl: "./index.html?handoff=1#robots",
      annotationSource: "当前根目录 handoff-annotations.json",
      headline: "直播异常兜底、脚本验稿、机器人运维与平台下发",
      summaryItems: [
        "新增直播异常自动/人工切录播、恢复自检与操作日志",
        "优化脚本编辑展示、脚本内新增表演与整场预览",
        "补齐机器人详情脚本新增、导入、模板下载、版本能力校验和唯一启用",
        "新增机器人运维大屏、设备详情、告警筛选和直播大屏联动",
        "完善渠道隔离、单一动作平台维护、多动作组合和渠道/机器人下发",
      ],
      detail: `本版本共记录 ${phase2FeatureRows.length} 项新增与优化功能，本次开发重点是：${focusText}。`,
    },
    {
      id: "v1.0",
      title: "V1.0 · 上一版本",
      date: "2026-06-02",
      status: "已发布",
      statusClass: "released",
      current: false,
      featureView: "legacy",
      previewUrl: "./prototype-versions/v1.0/index.html?handoff=1#robots",
      annotationSource: "prototype-versions/v1.0/handoff-annotations.json",
      headline: "直播运营后台基础版",
      summaryItems: ["完成直播运营后台基础能力建设，覆盖直播间、机器人、脚本、资源与互动管理。"],
      detail: `保留上一版本 ${featureListRows.length} 条功能清单。`,
    },
  ];
}

let performanceEditorView = false;
let editingShowId = "";
let robotDetailView = false;
let robotDetailTab = "scripts";
let scriptImportPreview = null;
let batchDistributionDraft = null;
const resourceDistributions = [];

const executionLogicOptions = [
  ["loop-count", "顺序执行"],
  ["random", "随机执行"],
  ["loop-duration", "顺序执行指定时长"],
];
const loopDurationMinuteOptions = [1, 3, 5, 10, 15, 30, 60];
const languageOptions = ["中文", "日语", "德语", "韩语", "美式英语", "阿拉伯语", "俄语", "意大利语", "法语", "英式英语"];

const robots = [
  { id: "162", mode: "直播", name: "星栖", status: "正常", voice: "温柔的健康科普主播（普通话）", model: "百炼", version: "Z版-机器人", year: "2026", scripts: 1, keywords: 4, executableScriptId: "SCRIPT-006", avatar: "星", avatarClass: "avatar-b", skillIds: [], showIds: ["H-SHOW-OPEN-03", "H-SHOW-OPEN-02", "H-SHOW-OPEN-01", "H-SHOW-FAN-01", "H-SHOW-CONTENT-01", "H-SHOW-CONTENT-02", "H-SHOW-QA-01", "H-SHOW-HABIT-01", "H-SHOW-IDLE-01", "H-SHOW-RECAP-01", "H-SHOW-TRANSITION-01", "H-SHOW-CLOSE-01"], idleShowIds: ["H-SHOW-IDLE-01"], idleInterval: "00:00:45" },
  { id: "174", mode: "直播", name: "知鹤", status: "正常", voice: "清爽的带货讲解主播（普通话）", model: "百炼", version: "Z版-机器人", year: "2026", scripts: 1, keywords: 6, executableScriptId: "SCRIPT-007", avatar: "知", avatarClass: "avatar-a", skillIds: [], showIds: ["C-SHOW-OPEN-01", "C-SHOW-FAN-01", "C-SHOW-EGG-01", "C-SHOW-EGG-QA-01", "C-SHOW-CORN-01", "C-SHOW-CORN-QA-01", "C-SHOW-PEACH-01", "C-SHOW-PEACH-QA-01", "C-SHOW-OFFER-01", "C-SHOW-IDLE-01", "C-SHOW-CLOSE-01"], idleShowIds: ["C-SHOW-IDLE-01"], idleInterval: "00:00:40" },
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
  { value: "162-星栖", id: "162", account: "11486262", name: "星栖", scene: "轻健康科普与日常健康", templateName: "聊天主播模板", version: "Z版-机器人", cover: "星", avatarClass: "avatar-b" },
  { value: "174-知鹤", id: "174", account: "11486174", name: "知鹤", scene: "农产品带货直播", templateName: "带货主播模板", version: "Z版-机器人", cover: "知", avatarClass: "avatar-a" },
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
  { id: "700101", shop: "知鹤严选农场", title: "山林散养鲜鸡蛋 30枚装 新鲜现捡低腥味", category: "生鲜>禽蛋", price: "39.90", slash: "59.90", stock: 860, status: "已上架", image: "蛋", imageClass: "product-a", video: true, copy: "这款鸡蛋来自山林散养鸡群，当天分拣发货，蛋黄饱满，适合早餐、水煮蛋和宝宝辅食。" },
  { id: "700102", shop: "知鹤严选农场", title: "东北糯甜玉米 10根装 真空锁鲜即食代餐", category: "生鲜>玉米", price: "49.90", slash: "69.90", stock: 620, status: "已上架", image: "玉", imageClass: "product-b", video: true, copy: "这款玉米口感是糯中带甜，真空锁鲜，开袋加热就能吃，适合早餐、办公室加餐和控糖期主食替换。" },
  { id: "700103", shop: "知鹤严选农场", title: "高山脆甜桃 5斤装 当季采摘清甜多汁", category: "生鲜>时令水果", price: "59.90", slash: "89.90", stock: 430, status: "已上架", image: "桃", imageClass: "product-c", video: false, copy: "高山产区昼夜温差大，桃子脆甜多汁，收到后常温放一到两天口感更香。" },
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

const conversationSessions = [
  { id: "CONV-001", channelId: "channel-weishi", time: "2026-07-11 10:32:18", roomId: "106113", roomName: "柳如春健康直播间", robotId: "162", robotName: "星栖", user: "用户_8732", summary: "今天久坐后肩颈很累，有什么容易坚持的方法？", messages: [
    { time: "10:32:18", sender: "user", text: "今天久坐后肩颈很累，有什么容易坚持的方法？" },
    { time: "10:32:21", sender: "robot", text: "可以先从每坐四十分钟站起来一分钟开始，不需要一次做很多动作。" },
    { time: "10:32:40", sender: "user", text: "我经常忘记。" },
    { time: "10:32:43", sender: "robot", text: "可以设一个轻提醒，或者把喝水和起身绑在一起。" },
  ] },
  { id: "CONV-002", channelId: "channel-weishi", time: "2026-07-10 16:08:05", roomId: "106112", roomName: "知鹤助农直播间", robotId: "174", robotName: "知鹤", user: "小李爱早餐", summary: "糯甜玉米怎么加热口感更好？", messages: [
    { time: "16:08:05", sender: "user", text: "糯甜玉米怎么加热口感更好？" },
    { time: "16:08:09", sender: "robot", text: "想要更糯可以隔水蒸热，快速食用也可以用微波炉。" },
  ] },
  { id: "CONV-003", channelId: "channel-culture", time: "2026-07-11 09:14:26", roomId: "106080", roomName: "B2艺术馆导览", robotId: "RBT002", robotName: "东哥外卖", user: "游客_1024", summary: "请问艺术馆的主展厅怎么走？", messages: [
    { time: "09:14:26", sender: "user", text: "请问艺术馆的主展厅怎么走？" },
    { time: "09:14:29", sender: "robot", text: "从当前点位向前直行，经过第一个转角后向左，我也可以带您前往。" },
    { time: "09:14:38", sender: "user", text: "带我过去吧。" },
    { time: "09:14:40", sender: "robot", text: "好的，请跟我来，行进中请留意脚下。" },
  ] },
  { id: "CONV-004", channelId: "channel-culture", time: "2026-07-09 14:22:10", roomId: "106080", roomName: "B2艺术馆导览", robotId: "RBT002", robotName: "东哥外卖", user: "游客_6688", summary: "这件展品的创作背景是什么？", messages: [
    { time: "14:22:10", sender: "user", text: "这件展品的创作背景是什么？" },
    { time: "14:22:13", sender: "robot", text: "这件作品来自艺术家对城市日常记忆的长期观察。" },
  ] },
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
  "health-chat": applyStageWaits(
    buildScriptStages("health-chat", [
      ["开场欢迎", "普通流程", "流程优先", "编辑中", ["H-SHOW-OPEN-03", "H-SHOW-OPEN-02", "H-SHOW-OPEN-01"]],
      ["粉丝互动", "弹幕互动", "互动优先", "已配置", ["H-SHOW-FAN-01"]],
      ["内容", "普通流程", "流程优先", "已配置", ["H-SHOW-CONTENT-01", "H-SHOW-CONTENT-02"]],
      ["互动一：健康常识问答", "弹幕互动", "互动优先", "已配置", ["H-SHOW-QA-01"]],
      ["互动二：小习惯征集", "真人互动", "互动优先", "已配置", ["H-SHOW-HABIT-01"]],
      ["冷场自播", "普通流程", "互动优先", "已配置", ["H-SHOW-IDLE-01"]],
      ["中途复盘", "普通流程", "流程优先", "已配置", ["H-SHOW-RECAP-01"]],
      ["转场补充", "普通流程", "流程优先", "已配置", ["H-SHOW-TRANSITION-01"]],
      ["下播总结", "普通流程", "流程优先", "已配置", ["H-SHOW-CLOSE-01"]],
    ]),
    {
      "health-chat-01": { "H-SHOW-OPEN-03": 0, "H-SHOW-OPEN-02": 3, "H-SHOW-OPEN-01": 3 },
      "health-chat-02": { "H-SHOW-FAN-01": 8 },
      "health-chat-03": { "H-SHOW-CONTENT-01": 5, "H-SHOW-CONTENT-02": 6 },
      "health-chat-04": { "H-SHOW-QA-01": 10 },
      "health-chat-05": { "H-SHOW-HABIT-01": 12 },
      "health-chat-06": { "H-SHOW-IDLE-01": 15 },
      "health-chat-07": { "H-SHOW-RECAP-01": 8 },
      "health-chat-08": { "H-SHOW-TRANSITION-01": 6 },
      "health-chat-09": { "H-SHOW-CLOSE-01": 0 },
    },
  ),
  "commerce-full": applyStageWaits(
    buildScriptStages("commerce-full", [
      ["开场欢迎", "普通流程", "流程优先", "编辑中", ["C-SHOW-OPEN-01"]],
      ["粉丝互动", "弹幕互动", "互动优先", "已配置", ["C-SHOW-FAN-01"]],
      ["商品1鸡蛋", "普通流程", "流程优先", "已配置", ["C-SHOW-EGG-01"]],
      ["商品鸡蛋答疑", "弹幕互动", "互动优先", "已配置", ["C-SHOW-EGG-QA-01"]],
      ["商品2玉米讲解", "普通流程", "流程优先", "已配置", ["C-SHOW-CORN-01"]],
      ["商品2玉米答疑", "弹幕互动", "互动优先", "已配置", ["C-SHOW-CORN-QA-01"]],
      ["商品3桃子讲解", "普通流程", "流程优先", "已配置", ["C-SHOW-PEACH-01"]],
      ["商品3桃子答疑", "真人互动", "互动优先", "已配置", ["C-SHOW-PEACH-QA-01"]],
      ["全场优惠提醒", "普通流程", "流程优先", "已配置", ["C-SHOW-OFFER-01"]],
      ["冷场自播", "普通流程", "互动优先", "已配置", ["C-SHOW-IDLE-01"]],
      ["下播总结", "普通流程", "流程优先", "已配置", ["C-SHOW-CLOSE-01"]],
    ]),
    {
      "commerce-full-01": { "C-SHOW-OPEN-01": 0 },
      "commerce-full-02": { "C-SHOW-FAN-01": 8 },
      "commerce-full-03": { "C-SHOW-EGG-01": 6 },
      "commerce-full-04": { "C-SHOW-EGG-QA-01": 10 },
      "commerce-full-05": { "C-SHOW-CORN-01": 6 },
      "commerce-full-06": { "C-SHOW-CORN-QA-01": 10 },
      "commerce-full-07": { "C-SHOW-PEACH-01": 6 },
      "commerce-full-08": { "C-SHOW-PEACH-QA-01": 12 },
      "commerce-full-09": { "C-SHOW-OFFER-01": 8 },
      "commerce-full-10": { "C-SHOW-IDLE-01": 15 },
      "commerce-full-11": { "C-SHOW-CLOSE-01": 0 },
    },
  ),
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

const fallbackPerformanceUnits = [
  { script: "这款产品主打节能静音，适合家庭日常使用，低噪运行……", action: "点头", endBy: "文本结束", repeat: 1, wait: 0 },
  { script: "这款产品的功率是2200W，能效等级一级，容量是……", action: "抬手", endBy: "文本结束", repeat: 1, wait: 0 },
  { script: "放在客厅、卧室都很合适，尤其适合小户型家庭……", action: "挥手", endBy: "文本结束", repeat: 1, wait: 1 },
  { script: "现在下单还有平台补贴和赠品，点击下方小黄车……", action: "抬手", endBy: "文本结束", repeat: 1, wait: 0 },
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
  { id: 133, name: "关羽-迎宾4", owner: "公共模板", units: 1, status: true, created: "2026-05-18 14:00:44", unitList: [] },
  { id: 121, name: "关羽-迎宾1", owner: "公共模板", units: 1, status: true, created: "2026-05-09 21:14:42", unitList: [] },
  { id: 122, name: "关羽-迎宾2", owner: "公共模板", units: 1, status: true, created: "2026-05-09 21:15:42", unitList: [] },
  { id: 123, name: "关羽-迎宾3", owner: "公共模板", units: 1, status: true, created: "2026-05-09 21:16:10", unitList: [] },
  { id: 85, name: "关羽-巍峨馆一欢迎语", owner: "公共模板", units: 1, status: true, created: "2026-02-06 17:44:48", unitList: [] },
  { id: 141, name: "发货回复", owner: "公共模板", units: 1, status: true, created: "2026-05-26 14:27:18", unitList: [] },
  { id: 140, name: "戒指1", owner: "公共模板", units: 1, status: true, created: "2026-05-26 14:00:50", unitList: [] },
  { id: 139, name: "2026526小暖直播第1场片段5 -结尾・情绪收束+下播预告", owner: "公共模板", units: 6, status: true, created: "2026-05-26 10:51:42", unitList: [] },
  { id: 138, name: "2026526小暖直播第1场片段4 -实用建议+互动引导", owner: "公共模板", units: 5, status: true, created: "2026-05-26 10:45:54", unitList: [] },
  { id: 137, name: "2026526小暖直播第1场片段3 -深度共情+温柔金句", owner: "公共模板", units: 3, status: true, created: "2026-05-26 10:43:22", unitList: [] },
  { id: 136, name: "2026526小暖直播第1场片段2-话题引入・共情痛点", owner: "公共模板", units: 3, status: true, created: "2026-05-26 10:39:23", unitList: [] },
  { id: 135, name: "2026526小暖直播第1场片段1-直播-开场", owner: "公共模板", units: 5, status: true, created: "2026-05-25 18:04:41", unitList: [] },
  { id: 134, name: "关羽-迎宾5", owner: "公共模板", units: 1, status: true, created: "2026-05-18 14:01:24", unitList: [] },
];

const userRobotShows = [
  { id: "U-SHOW-01", name: "柳如春-专属欢迎语", owner: "用户模板", units: 2, created: "2026-05-29 10:12:00" },
  { id: "U-SHOW-02", name: "B2展厅-点位讲解补充", owner: "用户模板", units: 3, created: "2026-05-29 10:18:00" },
  { id: "H-SHOW-OPEN-03", robotId: "162", name: "开场话术_星栖_03", owner: "用户模板", units: 4, status: true, created: "2026-06-18 09:10:00", unitDetails: [
    mockUnit("晚上好，欢迎来到星栖的轻健康直播间。今天不制造焦虑，我们只聊几个能马上做的小习惯。", "微笑点头", "文本结束", 1, 0),
    mockUnit("如果你刚下班，先把肩膀放松一下，深呼吸两次，让身体知道今天的紧绷可以慢慢松开。", "双手下压", "文本结束", 1, 1),
    mockUnit("今晚的主题是日常健康：喝水、睡眠、久坐、饮食节奏，都会用很简单的话讲清楚。", "右手介绍", "文本结束", 1, 1),
    mockUnit("新来的朋友可以点个关注，后面我会做一个一分钟自测，看看你最需要先调整哪个习惯。", "挥手", "文本结束", 1, 3),
  ] },
  { id: "H-SHOW-OPEN-02", robotId: "162", name: "开场话术_星栖_02", owner: "用户模板", units: 3, status: true, created: "2026-06-18 09:12:00", unitDetails: [
    mockUnit("先给大家同步今天的直播节奏：前半段讲方法，后半段集中回答弹幕里的健康问题。", "左手提示", "文本结束", 1, 0),
    mockUnit("我们会避免夸张承诺，所有建议都以日常可执行为主，身体不舒服还是要及时找专业医生。", "轻微点头", "文本结束", 1, 1),
    mockUnit("现在可以在弹幕打一个数字：1 睡不好，2 久坐累，3 饮食乱，我会按大家最多的问题先讲。", "抬右手", "文本结束", 1, 3),
  ] },
  { id: "H-SHOW-OPEN-01", robotId: "162", name: "开场话术_星栖_01", owner: "用户模板", units: 3, status: true, created: "2026-06-18 09:14:00", unitDetails: [
    mockUnit("今天我们先从最容易忽略的作息讲起，不要求一步到位，只要比昨天稳定一点点就可以。", "微笑", "文本结束", 1, 0),
    mockUnit("如果你现在还在吃晚饭，先别急着刷屏，慢一点吃，给胃一点反应时间。", "双手前伸", "文本结束", 1, 1),
    mockUnit("直播间里有任何问题可以发出来，我会把高频问题放到互动阶段一起回答。", "点头", "文本结束", 1, 3),
  ] },
  { id: "H-SHOW-FAN-01", robotId: "162", name: "弹幕互动_健康状态签到", owner: "用户模板", units: 4, status: true, created: "2026-06-18 09:20:00", unitDetails: [
    mockUnit("我们先做一个健康状态签到：今天你是精神还不错，还是有点累？可以打“不错”或“累”。", "右手提问", "收到弹幕后结束", 1, 2),
    mockUnit("看到很多朋友说累，先别责怪自己。疲惫通常不是意志力差，而是恢复时间不够。", "点头", "文本结束", 1, 1),
    mockUnit("如果你今天喝水少，可以先给自己倒半杯水，不用一口气喝完，放在手边就算开始。", "抬手示意", "文本结束", 1, 1),
    mockUnit("我会选几个弹幕问题放到后面的健康常识问答，大家可以继续发。", "挥手", "文本结束", 1, 8),
  ] },
  { id: "H-SHOW-CONTENT-01", robotId: "162", name: "轻健康内容_喝水与疲劳", owner: "用户模板", units: 4, status: true, created: "2026-06-18 09:28:00", unitDetails: [
    mockUnit("第一个小习惯是喝水。很多人不是不懂喝水重要，而是忙起来就忘。", "右手介绍", "文本结束", 1, 0),
    mockUnit("更实用的方法是把喝水和固定动作绑定，比如到工位先喝两口，开会前喝两口。", "双手比划", "文本结束", 1, 1),
    mockUnit("不建议短时间猛灌水，身体更喜欢稳定、少量、多次的补充方式。", "轻微摇头", "文本结束", 1, 1),
    mockUnit("今天只要你能把水杯放到看得见的地方，这个习惯就已经开始了。", "点头", "文本结束", 1, 5),
  ] },
  { id: "H-SHOW-CONTENT-02", robotId: "162", name: "轻健康内容_久坐放松", owner: "用户模板", units: 4, status: true, created: "2026-06-18 09:33:00", unitDetails: [
    mockUnit("第二个小习惯是久坐后的恢复。不是非要运动半小时，先从一分钟开始。", "右手介绍", "文本结束", 1, 0),
    mockUnit("你可以每坐四五十分钟站起来，肩膀向后绕三圈，再让眼睛看远处十秒。", "肩部放松", "文本结束", 1, 1),
    mockUnit("这类动作看起来很小，但它能提醒身体从固定姿势里出来。", "点头", "文本结束", 1, 1),
    mockUnit("如果你现在方便，也可以跟着我做一次：肩膀放松，呼气，把下巴轻轻收回来。", "双手下压", "文本结束", 1, 6),
  ] },
  { id: "H-SHOW-QA-01", robotId: "162", name: "健康常识问答", owner: "用户模板", units: 4, status: true, created: "2026-06-18 09:40:00", unitDetails: [
    mockUnit("弹幕问：晚上几点睡才算健康？更关键的是规律，不是只盯着某一个绝对时间。", "右手回答", "文本结束", 1, 1),
    mockUnit("如果你长期两三点睡，第一步不是立刻十点睡，而是先把入睡时间提前十五分钟。", "点头", "文本结束", 1, 1),
    mockUnit("也有人问饭后能不能马上运动。一般建议先散步或轻活动，不要马上做高强度训练。", "左手提示", "文本结束", 1, 1),
    mockUnit("这些建议适合日常管理，如果已经有明确疾病或持续不适，要听医生的个性化方案。", "认真点头", "文本结束", 1, 10),
  ] },
  { id: "H-SHOW-HABIT-01", robotId: "162", name: "小习惯征集互动", owner: "用户模板", units: 3, status: true, created: "2026-06-18 09:48:00", unitDetails: [
    mockUnit("现在我们征集一个小习惯：你最近做过最容易坚持的一件健康小事是什么？", "右手提问", "收到弹幕后结束", 1, 2),
    mockUnit("我看到有人说睡前不刷短视频，有人说早上晒太阳十分钟，这些都很真实。", "微笑点头", "文本结束", 1, 1),
    mockUnit("如果你愿意，可以把这个习惯打在弹幕里，让直播间的朋友互相借鉴一下。", "挥手", "文本结束", 1, 12),
  ] },
  { id: "H-SHOW-IDLE-01", robotId: "162", name: "冷场自播_轻健康提醒", owner: "用户模板", units: 3, status: true, created: "2026-06-18 09:55:00", unitDetails: [
    mockUnit("直播间暂时安静一点也没关系，我再补一个容易执行的小提醒。", "微笑", "文本结束", 1, 0),
    mockUnit("如果你总是忘记休息，可以给手机设一个不刺耳的提醒，名字就叫站起来一分钟。", "右手提示", "文本结束", 1, 1),
    mockUnit("不要把健康计划做得太大，越容易开始，越容易坚持。", "点头", "文本结束", 1, 15),
  ] },
  { id: "H-SHOW-RECAP-01", robotId: "162", name: "中途复盘_三件小事", owner: "用户模板", units: 3, status: true, created: "2026-06-18 10:02:00", unitDetails: [
    mockUnit("我们中途复盘一下：第一，把水杯放到看得见的地方。", "右手计数", "文本结束", 1, 0),
    mockUnit("第二，久坐后站起来一分钟；第三，把睡觉时间先稳定下来。", "左手计数", "文本结束", 1, 1),
    mockUnit("这三件事不复杂，但都能帮身体减少一点点负担。", "点头", "文本结束", 1, 8),
  ] },
  { id: "H-SHOW-TRANSITION-01", robotId: "162", name: "转场补充_进入答疑", owner: "用户模板", units: 2, status: true, created: "2026-06-18 10:08:00", unitDetails: [
    mockUnit("接下来我会继续看弹幕，把大家问得最多的问题集中回答。", "右手提示", "文本结束", 1, 0),
    mockUnit("如果问题比较私人，我会尽量给通用方向，不会替代医生判断。", "认真点头", "文本结束", 1, 6),
  ] },
  { id: "H-SHOW-CLOSE-01", robotId: "162", name: "下播总结_温和收束", owner: "用户模板", units: 3, status: true, created: "2026-06-18 10:15:00", unitDetails: [
    mockUnit("今天的轻健康直播就到这里，最后再提醒一次：不要追求完美，坚持一个小动作就很好。", "微笑点头", "文本结束", 1, 0),
    mockUnit("今晚你可以只做一件事：把明天要喝的水杯放好，或者提前十五分钟放下手机。", "双手前伸", "文本结束", 1, 1),
    mockUnit("感谢大家陪伴星栖，我们下次继续聊更容易执行的日常健康方法。", "挥手", "文本结束", 1, 0),
  ] },
  { id: "C-SHOW-OPEN-01", robotId: "174", name: "助农-开场欢迎", owner: "用户模板", units: 3, status: true, created: "2026-06-19 11:00:00", unitDetails: [
    mockUnit("欢迎来到知鹤助农直播间，今天这场主要讲三款农产品：鲜鸡蛋、糯甜玉米和高山脆甜桃。", "挥手", "文本结束", 1, 0),
    mockUnit("我们会按商品顺序讲产地、口感、适合人群和到手保存方法，价格和库存以小黄车为准。", "右手介绍", "文本结束", 1, 1),
    mockUnit("新来的朋友可以先点关注，后面会有三品组合优惠和限时包邮提醒。", "抬右手", "文本结束", 1, 4),
  ] },
  { id: "C-SHOW-FAN-01", robotId: "174", name: "助农-粉丝互动", owner: "用户模板", units: 3, status: true, created: "2026-06-19 11:05:00", unitDetails: [
    mockUnit("先问一下大家，早餐更常吃鸡蛋、玉米，还是水果？可以在弹幕里打蛋、玉米、桃。", "右手提问", "收到弹幕后结束", 1, 2),
    mockUnit("看到很多朋友选玉米，等会儿我会重点讲真空玉米怎么加热口感更好。", "点头", "文本结束", 1, 1),
    mockUnit("想要组合装的朋友也可以先留言，我会在优惠提醒阶段统一说清楚。", "挥手", "文本结束", 1, 8),
  ] },
  { id: "C-SHOW-EGG-01", robotId: "174", name: "商品1鸡蛋讲解", owner: "用户模板", units: 4, status: true, created: "2026-06-19 11:10:00", unitDetails: [
    mockUnit("第一款是山林散养鲜鸡蛋，30枚一箱，当天分拣后发出。", "右手介绍", "文本结束", 1, 0),
    mockUnit("它的卖点不是夸张个头，而是蛋黄饱满、腥味轻，适合水煮蛋、蒸蛋和早餐搭配。", "双手展示", "文本结束", 1, 1),
    mockUnit("家里有老人小孩的，鸡蛋是很稳定的日常补充食材，做法也简单。", "点头", "文本结束", 1, 1),
    mockUnit("收到后建议放冰箱冷藏，先吃运输中有轻微晃动的，再吃外观完整的。", "左手提示", "文本结束", 1, 6),
  ] },
  { id: "C-SHOW-EGG-QA-01", robotId: "174", name: "商品鸡蛋答疑", owner: "用户模板", units: 3, status: true, created: "2026-06-19 11:16:00", unitDetails: [
    mockUnit("弹幕问是不是土鸡蛋。这里我们按商品页口径说，是山林散养鲜鸡蛋，不做超出详情页的承诺。", "认真点头", "文本结束", 1, 1),
    mockUnit("有人问破损怎么办，生鲜运输如果有明显破损，按平台售后规则拍照处理。", "右手提示", "文本结束", 1, 1),
    mockUnit("如果你一周吃得比较规律，30枚装比较适合家庭日常囤一箱。", "点头", "文本结束", 1, 10),
  ] },
  { id: "C-SHOW-CORN-01", robotId: "174", name: "商品2玉米讲解", owner: "用户模板", units: 4, status: true, created: "2026-06-19 11:24:00", unitDetails: [
    mockUnit("第二款是东北糯甜玉米，10根装，真空锁鲜。", "右手介绍", "文本结束", 1, 0),
    mockUnit("这款口感是糯中带甜，不是特别水的水果玉米，更适合当早餐或办公室加餐。", "双手展示", "文本结束", 1, 1),
    mockUnit("加热方式很简单，隔水蒸、微波、煮都可以，想要口感更糯建议蒸热。", "左手提示", "文本结束", 1, 1),
    mockUnit("如果你平时晚饭容易吃多，可以用一根玉米替代一部分主食，饱腹感会更稳定。", "点头", "文本结束", 1, 6),
  ] },
  { id: "C-SHOW-CORN-QA-01", robotId: "174", name: "商品2玉米答疑", owner: "用户模板", units: 3, status: true, created: "2026-06-19 11:30:00", unitDetails: [
    mockUnit("弹幕问能不能常温放。真空玉米也建议按商品包装说明保存，夏天尽量冷藏更稳妥。", "右手回答", "文本结束", 1, 1),
    mockUnit("问甜不甜的朋友注意，这款是糯甜型，甜度不会像水果糖那样冲，重点是糯香。", "点头", "文本结束", 1, 1),
    mockUnit("家里有老人小孩的，吃的时候注意完全加热，口感会更软糯。", "左手提示", "文本结束", 1, 10),
  ] },
  { id: "C-SHOW-PEACH-01", robotId: "174", name: "商品3桃子讲解", owner: "用户模板", units: 4, status: true, created: "2026-06-19 11:38:00", unitDetails: [
    mockUnit("第三款是高山脆甜桃，5斤装，当季采摘发货。", "右手介绍", "文本结束", 1, 0),
    mockUnit("高山产区昼夜温差大，桃子的香气和甜度会更稳定，口感偏脆甜。", "双手展示", "文本结束", 1, 1),
    mockUnit("收到后如果觉得还比较硬，可以常温放一到两天，香味会更明显。", "左手提示", "文本结束", 1, 1),
    mockUnit("喜欢脆口的朋友可以早点吃，喜欢更软一点的就放到果香出来再吃。", "点头", "文本结束", 1, 6),
  ] },
  { id: "C-SHOW-PEACH-QA-01", robotId: "174", name: "商品3桃子答疑", owner: "用户模板", units: 3, status: true, created: "2026-06-19 11:44:00", unitDetails: [
    mockUnit("弹幕问会不会坏果。生鲜运输存在个别磕碰风险，收到先检查，异常按平台售后处理。", "认真点头", "文本结束", 1, 1),
    mockUnit("桃子甜度会受成熟度影响，我们不做每一颗都完全一致的承诺，但会按产区标准发货。", "右手提示", "文本结束", 1, 1),
    mockUnit("如果你想做水果拼盘，这款桃子切块后很适合搭配酸奶或燕麦。", "微笑", "文本结束", 1, 12),
  ] },
  { id: "C-SHOW-OFFER-01", robotId: "174", name: "全场优惠提醒", owner: "用户模板", units: 3, status: true, created: "2026-06-19 11:52:00", unitDetails: [
    mockUnit("现在做一遍全场优惠提醒：鸡蛋、玉米、桃子都在小黄车前三位。", "右手提示", "文本结束", 1, 0),
    mockUnit("需要早餐组合的朋友可以优先看鸡蛋加玉米，需要家庭水果补充的可以看桃子。", "双手介绍", "文本结束", 1, 1),
    mockUnit("优惠和库存会实时变化，想要的朋友建议先领券再下单，避免库存变动。", "点头", "文本结束", 1, 8),
  ] },
  { id: "C-SHOW-IDLE-01", robotId: "174", name: "冷场自播_助农补充", owner: "用户模板", units: 2, status: true, created: "2026-06-19 11:58:00", unitDetails: [
    mockUnit("直播间安静的时候，我再补一句：今天这三款都偏日常刚需，不是只看热闹的商品。", "微笑", "文本结束", 1, 0),
    mockUnit("买生鲜最重要是看保存和消耗节奏，按家里人数选择，不建议盲目囤太多。", "认真点头", "文本结束", 1, 15),
  ] },
  { id: "C-SHOW-CLOSE-01", robotId: "174", name: "下播总结_知鹤", owner: "用户模板", units: 3, status: true, created: "2026-06-19 12:05:00", unitDetails: [
    mockUnit("今天知鹤的助农直播就先到这里，我们讲了鸡蛋、玉米和桃子的产地、吃法、保存方法。", "微笑点头", "文本结束", 1, 0),
    mockUnit("已经下单的朋友记得关注物流，生鲜到货后先检查外观，再按建议保存。", "右手提示", "文本结束", 1, 1),
    mockUnit("感谢大家支持农产品直播，我们下次继续带来更适合日常餐桌的好物。", "挥手", "文本结束", 1, 0),
  ] },
];

const userRobotSkills = [
  { id: "U-SKILL-01", robotId: "RBT002", name: "B2展厅问路回复", category: "表演", owner: "用户模板", scope: "robot-user-template", trigger: "怎么走, 去哪里", created: "2026-05-29 10:22:00" },
  { id: "U-SKILL-02", robotId: "142", name: "导览暂停确认", category: "动作", owner: "用户模板", scope: "robot-user-template", trigger: "暂停, 等一下", created: "2026-05-29 10:25:00" },
];

const actions = [
  { id: "ROT_LU_wave_right_hand_like_waves", seq: 69, name: "鲁博士-挥舞右手波浪状", desc: "讲解时候用", posture: "站姿", type: "站姿", duration: 10, status: true, created: "2026-05-15 15:52:12", owner: "公共模板", scope: "public" },
  { id: "ROT_LU_wave_right_hand", seq: 68, name: "鲁博士-挥舞右手", desc: "", posture: "站姿", type: "站姿", duration: 10, status: true, created: "2026-05-15 15:51:39", owner: "公共模板", scope: "public" },
  { id: "ROT_LU_wave_left_hand_like_waves", seq: 67, name: "鲁博士-挥舞左手波浪状", desc: "讲解时候用", posture: "站姿", type: "站姿", duration: 11, status: true, created: "2026-05-15 15:51:17", owner: "公共模板", scope: "public" },
  { id: "ROT_LU_wave_left_hand", seq: 66, name: "鲁博士-挥舞左手", desc: "", posture: "站姿", type: "站姿", duration: 12, status: true, created: "2026-05-15 15:50:35", owner: "公共模板", scope: "public" },
  { id: "ROT_LU_right_hand_move_forward", seq: 65, name: "鲁博士-向前伸右手", desc: "", posture: "站姿", type: "站姿", duration: 10, status: true, created: "2026-05-15 15:49:42", owner: "公共模板", scope: "public" },
  { id: "ROT_LU_left_hand_move_forward", seq: 64, name: "鲁博士-向前伸左手", desc: "", posture: "站姿", type: "站姿", duration: 10, status: true, created: "2026-05-15 15:49:07", owner: "公共模板", scope: "public" },
  { id: "ROT_LU_bow", seq: 63, name: "鲁博士-低头拾双手致敬", desc: "", posture: "站姿", type: "站姿", duration: 10, status: true, created: "2026-05-15 15:47:57", owner: "公共模板", scope: "public" },
  { id: "E_wave_right_hand", seq: 62, name: "抬右手", desc: "", posture: "站姿", type: "站姿", duration: 0, status: true, created: "2026-04-21 20:43:42", owner: "公共模板", scope: "public" },
  { id: "E_wave_left_hand", seq: 61, name: "抬左手", desc: "", posture: "站姿", type: "站姿", duration: 5, status: true, created: "2026-04-21 20:43:32", owner: "公共模板", scope: "public" },
  { id: "E_two_hands_move_forward", seq: 60, name: "往前抬双手", desc: "", posture: "站姿", type: "站姿", duration: 5, status: true, created: "2026-04-21 20:43:16", owner: "公共模板", scope: "public" },
];

const actionGroups = [
  { id: "shake_hands_and_bow", name: "握手和鞠躬", desc: "39测试", posture: "站姿", type: "站姿", duration: 19, created: "2026-02-06 14:27:34", owner: "公共模板", scope: "public", actionIds: ["ROT_LU_wave_right_hand", "ROT_LU_bow"] },
  { id: "left_and_two_hand", name: "先左手再双手", desc: "39 测试", posture: "站姿", type: "站姿", duration: 22, created: "2026-02-06 14:26:41", owner: "公共模板", scope: "public", actionIds: ["ROT_LU_wave_left_hand", "E_two_hands_move_forward"] },
];

const faces = [
  { id: 18, recognitionId: "xinfutech_18", avatar: "贾", avatarClass: "avatar-c", name: "贾立国", nickname: "老贾", birthday: "1990-06-15", zodiac: "双子座", gender: "男", job: "硬件工程师，我是爱笑的男孩运气不会差", created: "2026-06-04 17:20:50", source: "后台", owner: "公共模板", scope: "public" },
  { id: 19, recognitionId: "xinfutech_19", avatar: "王", avatarClass: "avatar-a", name: "王子龙", nickname: "王子龙", birthday: "1995-03-11", zodiac: "双鱼座", gender: "男", job: "结构工程师", created: "2026-06-04 17:21:26", source: "后台", owner: "公共模板", scope: "public" },
  { id: 20, recognitionId: "xinfutech_20", avatar: "邓", avatarClass: "avatar-b", name: "邓超", nickname: "超哥", birthday: "1988-03-06", zodiac: "双鱼座", gender: "男", job: "董事长助理，是张总的助理，爱机器人，更爱美女机器人，欢迎来论道", created: "2026-06-04 17:23:00", source: "后台", owner: "公共模板", scope: "public" },
  { id: 21, recognitionId: "xinfutech_21", avatar: "陈", avatarClass: "avatar-d", name: "陈子昂", nickname: "陈老师", birthday: "1993-08-01", zodiac: "狮子座", gender: "男", job: "程序员，我以前真的做过老师，喜欢上班，骑行，睡觉", created: "2026-06-04 17:24:16", source: "后台", owner: "公共模板", scope: "public" },
  { id: 22, recognitionId: "xinfutech_22", avatar: "高", avatarClass: "avatar-c", name: "高跃登", nickname: "老登", birthday: "1995-05-09", zodiac: "金牛座", gender: "男", job: "结构工程师，喜欢野外探险、骑行", created: "2026-06-04 17:25:20", source: "后台", owner: "公共模板", scope: "public" },
  { id: 23, recognitionId: "xinfutech_23", avatar: "赵", avatarClass: "avatar-b", name: "赵若琳", nickname: "小赵", birthday: "1996-07-07", zodiac: "巨蟹座", gender: "女", job: "程序员，公司唯一的女程序员", created: "2026-06-04 17:26:25", source: "后台", owner: "公共模板", scope: "public" },
  { id: 24, recognitionId: "xinfutech_24", avatar: "张", avatarClass: "avatar-a", name: "张嵩", nickname: "嵩哥", birthday: "1996-07-24", zodiac: "狮子座", gender: "男", job: "程序员，爱好是爱好，龙可是帝王之征啊", created: "2026-06-04 17:27:15", source: "后台", owner: "公共模板", scope: "public" },
  { id: 25, recognitionId: "xinfutech_25", avatar: "朱", avatarClass: "avatar-d", name: "朱迅", nickname: "朱迅", birthday: "1985-02-02", zodiac: "水瓶座", gender: "男", job: "结构工程师", created: "2026-06-04 17:27:57", source: "后台", owner: "公共模板", scope: "public" },
];

const materials = [
  { id: 104, fileName: "般若波罗蜜多心经.mp3", duration: "02:48", uploaded: "2026-04-28 18:26:48", tag: "佛乐", owner: "公共模板", scope: "public" },
  { id: 103, fileName: "039_第三十九签.mp3", duration: "01:01", uploaded: "2026-03-26 19:04:25", tag: "关羽", owner: "公共模板", scope: "public" },
  { id: 102, fileName: "091_第九十一签.mp3", duration: "01:01", uploaded: "2026-03-26 19:04:25", tag: "关羽", owner: "公共模板", scope: "public" },
  { id: 101, fileName: "001_第一签.mp3", duration: "00:50", uploaded: "2026-03-26 19:04:25", tag: "关羽", owner: "公共模板", scope: "public" },
  { id: 100, fileName: "086_第八十六签.mp3", duration: "00:57", uploaded: "2026-03-26 19:04:25", tag: "关羽", owner: "公共模板", scope: "public" },
  { id: 99, fileName: "031_第三十一签.mp3", duration: "00:51", uploaded: "2026-03-26 19:04:25", tag: "关羽", owner: "公共模板", scope: "public" },
  { id: 98, fileName: "078_第七十八签.mp3", duration: "00:55", uploaded: "2026-03-26 19:04:25", tag: "关羽", owner: "公共模板", scope: "public" },
  { id: 97, fileName: "076_第七十六签.mp3", duration: "01:12", uploaded: "2026-03-26 19:04:24", tag: "关羽", owner: "公共模板", scope: "public" },
  { id: 96, fileName: "041_第四十一签.mp3", duration: "01:12", uploaded: "2026-03-26 19:04:24", tag: "关羽", owner: "公共模板", scope: "public" },
  { id: 95, fileName: "034_第三十四签.mp3", duration: "00:48", uploaded: "2026-03-26 19:04:24", tag: "关羽", owner: "公共模板", scope: "public" },
];

const agents = [
  { seq: 1, id: "RAG112", name: "邓丽君", source: "阿里云百炼", appId: "2c933987e6be40d4862e6ed8fd2", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 1 },
  { seq: 2, id: "RAG110", name: "小兰-试衣模特", source: "阿里云百炼", appId: "81863a6ea4d74a7ca604c3b2", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 1 },
  { seq: 3, id: "RAG109", name: "四位一体", source: "阿里云百炼", appId: "0fd7a5a01dd44f8390a5410b", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 2 },
  { seq: 4, id: "RAG108", name: "深圳-管仲", source: "阿里云百炼", appId: "6284d735b6f04b8e99f13bb0", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 1 },
  { seq: 5, id: "RAG107", name: "谦成-测试-乐瑶", source: "阿里云百炼", appId: "38e2a944ed4f486f8aa8138d", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 1 },
  { seq: 6, id: "RAG106", name: "若琳-测试-阿哲", source: "阿里云百炼", appId: "973e62f53f814f8bb2950f", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 1 },
  { seq: 7, id: "RAG105", name: "关羽-公司测试", source: "阿里云百炼", appId: "395ec65d70df4f7290c8ed", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 3 },
  { seq: 8, id: "RAG104", name: "爱丽芬-电池展厅agv", source: "阿里云百炼", appId: "0cb83c2800bf4c31a86ff", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 1 },
  { seq: 9, id: "RAG103", name: "爱丽芬城堡", source: "阿里云百炼", appId: "dcaf31de58fb4b0ab93c7", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 1 },
  { seq: 10, id: "RAG102", name: "AI-萌宠", source: "阿里云百炼", appId: "f1c5b8edcd8140269bc4d", key: "sk-3abaf4b783444054be90625b", enabled: true, bound: 1 },
];

const userRobotActionGroups = [
  { id: "U-ACT-G-01", robotId: "142", name: "小暖-直播欢迎动作", desc: "开场欢迎动作组", posture: "站姿", type: "站姿", duration: 31, created: "2026-06-11 10:18:00", owner: "用户模板", scope: "robot-user-template", actionIds: ["ROT_LU_wave_right_hand_like_waves", "ROT_LU_wave_right_hand", "ROT_LU_wave_left_hand_like_waves"] },
];

const userRobotActions = [
  { id: "U-ACT-01", robotId: "142", seq: 1, name: "小暖-专属点头", desc: "当前机器人自建动作", posture: "站姿", type: "站姿", duration: 6, status: true, created: "2026-06-11 10:16:00", owner: "用户模板", scope: "robot-user-template" },
];

const userRobotFaces = [
  { id: "U-FACE-01", robotId: "142", recognitionId: "robot_142_guest_01", avatar: "客", avatarClass: "avatar-b", name: "小暖专属访客", nickname: "访客", birthday: "1998-10-02", zodiac: "天秤座", gender: "女", job: "机器人用户模板视觉资料", created: "2026-06-11 10:20:00", source: "机器人自建", owner: "用户模板", scope: "robot-user-template" },
];

const userRobotMaterials = [
  { id: "U-MAT-01", robotId: "142", fileName: "小暖专属欢迎音频.mp3", duration: "00:36", uploaded: "2026-06-11 10:22:00", tag: "欢迎", owner: "用户模板", scope: "robot-user-template" },
];

const scriptFlowScripts = [
  { id: "SCRIPT-006", name: "星栖｜轻健康科普与日常健康", type: "直播", anchorType: "chat", templateName: "聊天主播模板", robotId: "162", robotName: "星栖", stageKey: "health-chat", duration: 50, offAirNotice: 5, stageCount: 9, showCount: 12, status: "已发布", isTemplate: false, updated: "2026-06-18 10:20" },
  { id: "SCRIPT-007", name: "直播-带货主播-知鹤正式脚本", type: "直播", anchorType: "commerce", templateName: "带货主播模板", robotId: "174", robotName: "知鹤", stageKey: "commerce-full", duration: 65, offAirNotice: 5, stageCount: 11, showCount: 11, status: "已发布", isTemplate: false, updated: "2026-06-19 12:08" },
  { id: "SCRIPT-001", name: "618家电专场带货脚本", type: "直播", anchorType: "commerce", templateName: "带货主播模板", robotId: "RBT008", robotName: "柳如春", duration: 60, offAirNotice: 5, stageCount: 8, showCount: 4, status: "已发布", isTemplate: false, updated: "2026-05-27 14:18" },
  { id: "SCRIPT-002", name: "云涵才艺点播直播脚本", type: "直播", anchorType: "talent", templateName: "才艺主播模板", robotId: "RBT005", robotName: "云涵", duration: 45, offAirNotice: 3, stageCount: 10, showCount: 5, status: "已发布", isTemplate: false, updated: "2026-05-26 18:30" },
  { id: "SCRIPT-003", name: "小暖陪伴活动脚本", type: "活动", anchorType: "chat", templateName: "活动模板", robotId: "RBT003", robotName: "智能体应用-测", duration: 40, offAirNotice: 5, stageCount: 6, showCount: 3, status: "草稿", isTemplate: false, updated: "2026-05-25 21:05" },
  { id: "SCRIPT-004", name: "云涵节日暖场剧目脚本", type: "剧目", anchorType: "talent", templateName: "剧目模板", robotId: "RBT005", robotName: "云涵", duration: 30, offAirNotice: 3, stageCount: 11, showCount: 6, status: "已发布", isTemplate: false, updated: "2026-05-25 19:20" },
  { id: "SCRIPT-005", name: "B2艺术馆导览脚本", type: "导览", anchorType: "tour", templateName: "导览模板", robotId: "RBT002", robotName: "东哥外卖", mapId: "MAP-B2", duration: 50, offAirNotice: 3, stageCount: 9, showCount: 5, status: "已发布", isTemplate: false, updated: "2026-05-29 10:32" },
];

const scriptProductBindings = {
  "SCRIPT-006": {
    scriptProductIds: [],
    primaryProductId: "",
    productOrder: [],
    stageProductBindings: {},
  },
  "SCRIPT-007": {
    scriptProductIds: ["700101", "700102", "700103"],
    primaryProductId: "700101",
    productOrder: ["700101", "700102", "700103"],
    stageProductBindings: {
      "commerce-full-03": ["700101"],
      "commerce-full-04": ["700101"],
      "commerce-full-05": ["700102"],
      "commerce-full-06": ["700102"],
      "commerce-full-07": ["700103"],
      "commerce-full-08": ["700103"],
      "commerce-full-09": ["700101", "700102", "700103"],
    },
  },
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
  saveBusinessState();
  activePage = safePageKey(activePage);
  document.body.classList.toggle("handoff-enabled", handoffMode);
  document.getElementById("app").classList.toggle("handoff-enabled", handoffMode);
  renderSideNav();
  renderTabs();
  document.getElementById("breadcrumbModule").textContent = currentPage().group || "虚拟直播管理";
  document.getElementById("breadcrumbPage").textContent = currentPage().label;
  const content = document.getElementById("content");
  content.classList.toggle("live-dashboard-content", activePage === "live-dashboard");
  const renderers = pageRenderers();
  const renderPage = renderers[activePage] || renderers.robots;
  content.innerHTML = `${renderHandoffManagerBar()}${renderPage()}`;
  if (activePage === "live-dashboard" && typeof mountLiveDashboard === "function") mountLiveDashboard();
  mountPlacedHandoffAnnotations();
}

const customerResourceIds = {
  products: new Set(["700103", "800101", "800102"]),
  rooms: new Set(["106080", "206176", "206188"]),
  robots: new Set(["RBT002", "GFWL-001", "GFWL-002"]),
  skills: new Set(["47", "49", "52", "GFWL-SKILL-01", "GFWL-SKILL-02"]),
  shows: new Set(["133", "121", "122", "123", "85", "GFWL-SHOW-01", "GFWL-SHOW-02"]),
  actionGroups: new Set(["left_and_two_hand", "gufeng_welcome_group"]),
  faces: new Set(["18", "GFWL-FACE-01"]),
  materials: new Set(["104", "GFWL-MAT-01"]),
  agents: new Set(["RAG104", "GFWL-AGENT-01"]),
  maps: new Set(["MAP-B2", "MAP-GFCITY"]),
  scripts: new Set(["SCRIPT-005", "SCRIPT-008", "SCRIPT-009"]),
};

const resourceChannelOverrides = {
  products: {
    "700101": "channel-goods",
    "700102": "channel-goods",
    "700103": "channel-goods",
    "800101": "channel-culture",
    "800102": "channel-culture",
  },
  rooms: {
    "106112": "channel-goods",
    "106080": "channel-culture",
    "206176": "channel-culture",
    "206188": "channel-culture",
  },
  robots: {
    "174": "channel-goods",
    "142": "channel-life",
    "RBT002": "channel-culture",
    "GFWL-001": "channel-culture",
    "GFWL-002": "channel-culture",
  },
  scripts: {
    "SCRIPT-007": "channel-goods",
    "SCRIPT-001": "channel-life",
    "SCRIPT-005": "channel-culture",
    "SCRIPT-008": "channel-culture",
    "SCRIPT-009": "channel-culture",
  },
  skills: {
    "GFWL-SKILL-01": "channel-culture",
    "GFWL-SKILL-02": "channel-culture",
  },
  shows: {
    "GFWL-SHOW-01": "channel-culture",
    "GFWL-SHOW-02": "channel-culture",
  },
  actionGroups: {
    gufeng_welcome_group: "channel-culture",
  },
  faces: {
    "GFWL-FACE-01": "channel-culture",
    gufeng_guide_01: "channel-culture",
  },
  materials: {
    "GFWL-MAT-01": "channel-culture",
  },
  agents: {
    "GFWL-AGENT-01": "channel-culture",
  },
  maps: {
    "MAP-B2": "channel-culture",
    "MAP-GFCITY": "channel-culture",
  },
};

function isPlatformChannel() {
  return !window.phase2State || phase2State.isPlatformChannel();
}

function isCustomerChannel() {
  return Boolean(window.phase2State && phase2State.currentChannel().type === "customer");
}

function canShowAdvancedRobotConfig() {
  return !isCustomerChannel();
}

function isCustomerHiddenPage(pageKey) {
  return isCustomerChannel() && customerHiddenPageKeys.has(pageKey);
}

function visibleVirtualLivePages() {
  return virtualLivePages.filter((page) => !isCustomerHiddenPage(page.key));
}

function visiblePages() {
  return [...commercePages, ...visibleVirtualLivePages()];
}

function safePageKey(pageKey) {
  return isCustomerHiddenPage(pageKey) ? "robots" : pageKey;
}

function resourceChannelFilterValue(filters = {}) {
  return isPlatformChannel() ? (filters.channelId || "全部渠道") : currentChannelId();
}

function resourceChannelOptions() {
  const channels = window.phase2State?.channels || [{ id: "channel-weishi", name: "微视中国", type: "platform", roleLabel: "平台最高权限" }];
  if (!isPlatformChannel()) {
    const current = channels.find((channel) => channel.id === currentChannelId()) || channels[0];
    return [{ value: current.id, label: current.name }];
  }
  return [
    { value: "全部渠道", label: "全部渠道" },
    ...channels.map((channel) => ({ value: channel.id, label: channel.type === "platform" ? `${channel.name}（平台）` : channel.name })),
  ];
}

function resourceChannelFilterHtml(filters, setterName) {
  const value = resourceChannelFilterValue(filters);
  const disabled = isPlatformChannel() ? "" : "disabled";
  return `
    <select class="select w-180 resource-channel-filter" ${disabled} onchange="${setterName}('channelId', this.value)">
      ${resourceChannelOptions().map((channel) => `<option value="${escapeHtml(channel.value)}" ${value === channel.value ? "selected" : ""}>${escapeHtml(channel.label)}</option>`).join("")}
    </select>`;
}

function resourceVisibleInChannel(item, resourceType, idField, channelId) {
  const itemId = resourceIdentity(item, idField);
  if (resourceIsDistributedToChannel(resourceType, itemId, channelId)) return true;
  if (item.channelId) return item.channelId === channelId;
  const allowed = customerResourceIds[resourceType] || new Set();
  if (channelId === "channel-weishi") return !allowed.has(String(itemId));
  return allowed.has(String(itemId)) && resourceChannelId(resourceType, itemId) === channelId;
}

function visibleChannelResources(items, resourceType, idField = "id", channelId = currentChannelId()) {
  if (resourceType === "actions") return visiblePlatformActions({ items, channelId });
  if (isPlatformChannel() && channelId === "全部渠道") return items.filter((item) => (item.resourceScope || "channel_public") !== "robot_private");
  const targetChannelId = isPlatformChannel() ? channelId : currentChannelId();
  return items.filter((item) => resourceVisibleInChannel(item, resourceType, idField, targetChannelId));
}

function currentChannelId() {
  return phase2State?.snapshot().currentChannelId || "channel-weishi";
}

function resourceIdentity(item, idField = "id") {
  return String(item?.[idField] ?? item?.id ?? item?.recognitionId ?? "");
}

function resourceIsDistributedToChannel(resourceType, resourceId, channelId) {
  if (!resourceType || !resourceId || !channelId) return false;
  return resourceDistributions.some((item) => item.status === "active"
    && item.resourceType === resourceType
    && String(item.resourceId) === String(resourceId)
    && item.targetChannelId === channelId);
}

function resourceIsReadonlyDistribution(resourceType, item, idField = "id") {
  return isCustomerChannel() && resourceIsDistributedToChannel(resourceType, resourceIdentity(item, idField), currentChannelId());
}

function distributedResourceTag(resourceType, item, idField = "id") {
  return resourceIsReadonlyDistribution(resourceType, item, idField) ? '<span class="mini-tag blue">平台下发</span>' : "";
}

function robotAbilityScope(robot) {
  if (!robot) return "";
  if (robot.version === "AGV机器人" || robot.mode === "导览") return "tour";
  if (robot.mode === "表演") return "performance";
  return "live";
}

function platformActionChannelIds(action) {
  if (Array.isArray(action.channelIds) && action.channelIds.length) return action.channelIds;
  if (action.channelId) return [action.channelId];
  return ["channel-weishi"];
}

function platformActionSupportsRobot(action, robot) {
  if (!robot) return true;
  const versions = Array.isArray(action.supportedVersions) && action.supportedVersions.length ? action.supportedVersions : robotVersionOptions;
  const abilities = Array.isArray(action.abilityScope) && action.abilityScope.length ? action.abilityScope : ["live", "performance", "tour"];
  return versions.includes(robot.version) && abilities.includes(robotAbilityScope(robot));
}

function actionMatchesFilters(action, filters = singleActionFilters) {
  const keyword = (filters.keyword || "").trim().toLowerCase();
  const type = filters.type || "全部类型";
  const posture = filters.posture || "全部姿态";
  const haystack = [action.id, action.name, action.desc].join(" ").toLowerCase();
  return (!keyword || haystack.includes(keyword))
    && (type === "全部类型" || (action.type || action.posture) === type)
    && (posture === "全部姿态" || action.posture === posture);
}

function visiblePlatformActions({ robot = null, filters = null, items = actions, channelId = currentChannelId() } = {}) {
  const allChannels = isPlatformChannel() && channelId === "全部渠道";
  return items
    .filter((action) => (action.resourceScope || "platform_distributed") === "platform_distributed")
    .filter((action) => allChannels || platformActionChannelIds(action).includes(channelId))
    .filter((action) => platformActionSupportsRobot(action, robot))
    .filter((action) => !filters || actionMatchesFilters(action, filters));
}

function resourceChannelId(resourceType, id) {
  const collections = { products, rooms, robots, skills, shows, actionGroups, faces, materials, agents, maps: exhibitionMaps, scripts: scriptFlowScripts };
  const existing = collections[resourceType]?.find((item) => String(item.id) === String(id) || String(item.recognitionId) === String(id));
  const override = resourceChannelOverrides[resourceType]?.[String(id)] || (existing ? resourceChannelOverrides[resourceType]?.[String(existing.recognitionId)] : "");
  if (override) return override;
  if (existing?.channelId) return existing.channelId;
  if ((customerResourceIds[resourceType] || new Set()).has(String(id))) return "channel-culture";
  return phase2State?.snapshot().currentChannelId || "channel-weishi";
}

function initializeChannelMetadata() {
  const publicCollections = [
    [products, "products"], [rooms, "rooms"], [robots, "robots"], [skills, "skills"], [shows, "shows"],
    [actionGroups, "actionGroups"], [faces, "faces"], [materials, "materials"], [agents, "agents"],
    [exhibitionMaps, "maps"], [scriptFlowScripts, "scripts"],
  ];
  publicCollections.forEach(([items, type]) => items.forEach((item) => {
    if (!item.channelId) item.channelId = resourceChannelId(type, item.id);
    if (!item.resourceScope) item.resourceScope = "channel_public";
  }));
  actions.forEach((item) => {
    item.channelId = "channel-weishi";
    if (!Array.isArray(item.channelIds) || !item.channelIds.length) item.channelIds = ["channel-weishi", "channel-goods", "channel-life", "channel-culture"];
    if (!Array.isArray(item.supportedVersions) || !item.supportedVersions.length) item.supportedVersions = robotVersionOptions.slice();
    if (!Array.isArray(item.abilityScope) || !item.abilityScope.length) item.abilityScope = ["live", "performance", "tour"];
    item.scope = "platform_distributed";
    item.resourceScope = "platform_distributed";
  });
  [userRobotSkills, userRobotShows, userRobotActions, userRobotActionGroups, userRobotFaces, userRobotMaterials].forEach((items) => items.forEach((item) => {
    if (!item.robotId) item.robotId = "142";
    item.channelId = resourceChannelId("robots", item.robotId);
    item.resourceScope = "robot_private";
    if (!item.scope) item.scope = "robot-user-template";
  }));
  [products, rooms, robots, skills, shows, actionGroups, faces, materials, agents, exhibitionMaps, scriptFlowScripts].forEach((items) => items.forEach((item) => normalizeResourceMetadata(item)));
}

function normalizeResourceMetadata(item) {
  if (!item) return item;
  if (!item.channelId) item.channelId = phase2State?.snapshot().currentChannelId || "channel-weishi";
  if (!item.resourceScope) {
    if (item.scope === "robot-user-template" || item.robotId) item.resourceScope = "robot_private";
    else if (item.scope === "platform_distributed") item.resourceScope = "platform_distributed";
    else item.resourceScope = "channel_public";
  }
  return item;
}

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function replaceArray(target, source) {
  if (!Array.isArray(source)) return;
  target.splice(0, target.length, ...cloneState(source));
}

function replaceObject(target, source) {
  if (!source || typeof source !== "object") return;
  Object.keys(target).forEach((key) => delete target[key]);
  Object.assign(target, cloneState(source));
}

function businessCollectionsSnapshot() {
  return {
    products,
    rooms,
    robots,
    skills,
    shows,
    actionGroups,
    faces,
    materials,
    agents,
    exhibitionMaps,
    scriptFlowScripts,
    userRobotSkills,
    userRobotShows,
    userRobotActions,
    userRobotActionGroups,
    userRobotFaces,
    userRobotMaterials,
    scriptInlineShows,
    scriptProductBindings,
    resourceDistributions,
  };
}

function restoreBusinessCollections(payload = {}) {
  const collections = businessCollectionsSnapshot();
  Object.entries(collections).forEach(([key, target]) => {
    if (Array.isArray(target)) replaceArray(target, payload[key]);
    else replaceObject(target, payload[key]);
  });
  initializeChannelMetadata();
}

function saveBusinessState() {
  if (!window.localStorage || !window.businessStateReady) return;
  window.localStorage.setItem(businessStateStorageKey, JSON.stringify({ version: businessStateVersion, data: businessCollectionsSnapshot() }));
}

function loadBusinessState() {
  try {
    const parsed = JSON.parse(window.localStorage?.getItem(businessStateStorageKey) || "null");
    if (parsed?.version !== businessStateVersion || !parsed.data) return false;
    restoreBusinessCollections(parsed.data);
    return true;
  } catch (error) {
    console.warn("business state restore failed", error);
    return false;
  }
}

function resetPhase2BusinessData() {
  if (window.businessSeedState) restoreBusinessCollections(window.businessSeedState);
  window.localStorage?.removeItem(businessStateStorageKey);
  saveBusinessState();
}

function seedCustomerChannelData() {
  if (!robots.some((item) => item.id === "GFWL-001")) robots.push(
    { id: "GFWL-001", mode: "导览", name: "绛央", status: "正常", voice: "沉稳的文化讲解员（普通话）", model: "百炼", version: "AGV机器人", year: "2026", scripts: 1, keywords: 3, executableScriptId: "SCRIPT-008", avatar: "绛", avatarClass: "avatar-c", skillIds: ["GFWL-SKILL-01"], showIds: ["GFWL-SHOW-01"], idleShowIds: [], idleInterval: "00:00:45" },
    { id: "GFWL-002", mode: "直播", name: "青禾", status: "正常", voice: "清亮的文旅推介人（普通话）", model: "百炼", version: "Z版-机器人", year: "2026", scripts: 1, keywords: 4, executableScriptId: "SCRIPT-009", avatar: "青", avatarClass: "avatar-a", skillIds: ["GFWL-SKILL-02"], showIds: ["GFWL-SHOW-02"], idleShowIds: ["GFWL-SHOW-02"], idleInterval: "00:00:40" },
  );
  if (!products.some((item) => item.id === "800101")) products.push(
    { id: "800101", shop: "国风文旅优选", title: "非遗手作竹编茶具收纳篮", category: "文创>非遗手作", price: "129.00", slash: "169.00", stock: 86, status: "已上架", image: "竹", imageClass: "product-c", video: true, copy: "手工竹编纹理清晰，适合茶席收纳和文化伴手礼。" },
    { id: "800102", shop: "国风文旅优选", title: "古城夜游文化纪念票套装", category: "文旅>纪念品", price: "49.00", slash: "69.00", stock: 320, status: "已上架", image: "城", imageClass: "product-b", video: false, copy: "收录古城夜景与当地民俗故事的纪念票套装。" },
  );
  if (!rooms.some((item) => item.id === "206176")) rooms.push(
    { seq: 11, id: "206176", status: "直播中", start: "2026-07-11 08:30:00", end: "2026-07-11 20:00:00", type: "机器人", account: "GFWL-001", roomId: "GFWL-LIVE-01", role: "绛央", cover: "绛", avatarClass: "avatar-c", live: true },
    { seq: 12, id: "206188", status: "直播中", start: "2026-07-11 09:00:00", end: "2026-07-11 22:00:00", type: "机器人", account: "GFWL-002", roomId: "GFWL-LIVE-02", role: "青禾", cover: "青", avatarClass: "avatar-a", live: true },
  );
  if (!skills.some((item) => item.id === "GFWL-SKILL-01")) skills.push(
    { id: "GFWL-SKILL-01", name: "非遗展区导览", category: "表演", owner: "公共模板", trigger: "非遗展区,带我去", result: "非遗展区讲解", status: true, created: "2026-07-08 10:20:00" },
    { id: "GFWL-SKILL-02", name: "古城夜游咨询", category: "表演", owner: "公共模板", trigger: "夜游,演出时间", result: "夜游线路答疑", status: true, created: "2026-07-08 10:30:00" },
  );
  if (!shows.some((item) => item.id === "GFWL-SHOW-01")) shows.push(
    { id: "GFWL-SHOW-01", name: "非遗展区欢迎讲解", owner: "公共模板", units: 2, status: true, created: "2026-07-08 11:00:00", unitList: [] },
    { id: "GFWL-SHOW-02", name: "古城夜游开场", owner: "公共模板", units: 3, status: true, created: "2026-07-08 11:10:00", unitList: [] },
  );
  if (!actionGroups.some((item) => item.id === "gufeng_welcome_group")) actionGroups.push({ id: "gufeng_welcome_group", name: "国风迎宾动作组", desc: "客户渠道迎宾编排", posture: "站姿", type: "站姿", duration: 22, created: "2026-07-08 12:00:00", owner: "公共模板", scope: "public", actionIds: ["E_wave_right_hand", "ROT_LU_bow"] });
  if (!faces.some((item) => item.id === "GFWL-FACE-01")) faces.push({ id: "GFWL-FACE-01", recognitionId: "gufeng_guide_01", avatar: "馆", avatarClass: "avatar-c", name: "文化馆讲解员", nickname: "林老师", birthday: "1986-04-12", zodiac: "白羊座", gender: "男", job: "非遗文化讲解员", created: "2026-07-08 13:00:00", source: "后台", owner: "公共模板", scope: "public" });
  if (!materials.some((item) => item.id === "GFWL-MAT-01")) materials.push({ id: "GFWL-MAT-01", fileName: "古城夜游环境音.mp3", duration: "01:32", uploaded: "2026-07-08 14:00:00", tag: "文旅", owner: "公共模板", scope: "public" });
  if (!agents.some((item) => item.id === "GFWL-AGENT-01")) agents.push({ seq: 11, id: "GFWL-AGENT-01", name: "国风文旅知识助手", source: "阿里云百炼", appId: "gufengwenlv2026agent", key: "sk-gufeng-demo-key", enabled: true, bound: 2 });
  if (!exhibitionMaps.some((item) => item.id === "MAP-GFCITY")) exhibitionMaps.push({ id: "MAP-GFCITY", venueName: "古城文化馆", exhibitionName: "非遗与民俗常设展", mapName: "古城导览图", boundRobotId: "GFWL-001", enabled: true, points: ["AGV_HOME", "AGV_P1", "AGV_P2"], exhibits: [{ id: 1, image: "竹", name: "竹编工艺", desc: "非遗竹编展项", script: "SCRIPT-008", point: "AGV_P1" }] });
  if (!scriptFlowScripts.some((item) => item.id === "SCRIPT-008")) scriptFlowScripts.push(
    { id: "SCRIPT-008", name: "绛央｜非遗文化馆导览", type: "导览", anchorType: "tour", templateName: "导览模板", robotId: "GFWL-001", robotName: "绛央", mapId: "MAP-GFCITY", duration: 45, offAirNotice: 3, stageCount: 6, showCount: 4, status: "已发布", isTemplate: false, updated: "2026-07-09 16:30" },
    { id: "SCRIPT-009", name: "青禾｜古城夜游直播", type: "直播", anchorType: "chat", templateName: "聊天主播模板", robotId: "GFWL-002", robotName: "青禾", duration: 55, offAirNotice: 5, stageCount: 7, showCount: 5, status: "已发布", isTemplate: false, updated: "2026-07-09 17:10" },
  );
}

seedCustomerChannelData();
initializeChannelMetadata();
window.businessSeedState = cloneState(businessCollectionsSnapshot());
loadBusinessState();
initializeChannelMetadata();
window.businessStateReady = true;
window.resetPhase2BusinessData = resetPhase2BusinessData;

function onPhase2ChannelChanged() {
  conversationFilters = { time: "近7天", roomId: "", robotId: "", user: "", keyword: "" };
  robotDetailView = false;
  if (isCustomerHiddenPage(activePage)) {
    activePage = safePageKey(activePage);
  }
  visitedTabs = visitedTabs.filter((pageKey) => !isCustomerHiddenPage(pageKey));
  const firstRobot = visibleChannelResources(robots, "robots")[0];
  if (firstRobot) selectedRobotId = firstRobot.id;
  const firstScript = visibleChannelResources(scriptFlowScripts, "scripts").find((item) => !item.isTemplate);
  if (firstScript) selectedScriptId = firstScript.id;
}

function renderChannelAccessBanner() {
  if (["live-dashboard", "ops-dashboard"].includes(activePage) || !window.phase2State) return "";
  const channel = phase2State.currentChannel();
  return `<div class="channel-access-banner ${channel.type}"><strong>${escapeHtml(channel.name)}${handoffMark("渠道数据隔离边界", "本期统一三类数据：渠道公共数据、机器人私有数据、平台下发资源；大库按当前渠道展示，机器人详情只展示当前机器人私有数据。", "new")}</strong><span>${channel.type === "platform" ? "微视中国：平台最高权限，维护平台资源大库并向客户渠道下发。" : "客户渠道模拟：仅显示本渠道公共资源、本渠道机器人私有资源和平台已下发资源；平台下发资源只读。"}</span></div>`;
}

function pageRenderers() {
  return {
    "live-dashboard": window.renderLiveDashboardPage || (() => '<div class="empty-state">直播数据大屏资源正在加载，请稍后刷新。</div>'),
    changelog: renderChangelogPage,
    products: renderProductPage,
    rooms: renderRoomPage,
    conversations: renderConversationPage,
    agents: renderAgentPage,
    materials: renderMaterialPage,
    faces: renderFacePage,
    actions: renderActionPage,
    flow: renderScriptFlowPage,
    maps: renderMapPage,
    robots: renderRobotPage,
    "robot-ops": window.renderRobotOpsPage,
    skills: renderSkillPage,
    shows: renderShowPage,
  };
}

function currentPage() {
  activePage = safePageKey(activePage);
  return visiblePages().find((page) => page.key === activePage) || visiblePages()[0] || pages[0];
}

function initialPageKey() {
  const hash = typeof window !== "undefined" && window.location ? window.location.hash.replace("#", "") : "";
  if (["flow-edit", "flow-performance-edit", "flow-preview"].includes(hash)) return "flow";
  return pages.some((page) => page.key === hash) ? hash : "robots";
}

function initialFlowView() {
  const hash = typeof window !== "undefined" && window.location ? window.location.hash.replace("#", "") : "";
  if (hash === "flow-performance-edit") return "performance-edit";
  if (hash === "flow-preview") return "preview";
  return hash === "flow-edit" ? "edit" : "list";
}

function initialHandoffMode() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search || "");
  if (params.has("handoff")) return params.get("handoff") === "1";
  return window.localStorage?.getItem("handoffMode") === "1";
}

function initialHandoffFabPosition() {
  if (typeof window === "undefined") return null;
  try {
    const saved = JSON.parse(window.localStorage?.getItem(handoffFabPositionStorageKey) || "null");
    const top = Number(saved?.top);
    return Number.isFinite(top) ? { top } : null;
  } catch {
    window.localStorage?.removeItem(handoffFabPositionStorageKey);
    return null;
  }
}

function clampHandoffFabTop(top) {
  const size = 44;
  const margin = 12;
  return Math.min(Math.max(top, margin), Math.max(margin, window.innerHeight - size - margin));
}

function saveHandoffFabPosition() {
  if (typeof window === "undefined") return;
  if (!handoffFabPosition) {
    window.localStorage?.removeItem(handoffFabPositionStorageKey);
    return;
  }
  window.localStorage?.setItem(handoffFabPositionStorageKey, JSON.stringify(handoffFabPosition));
}

function applyHandoffFabPosition(control) {
  if (!control || !handoffFabPosition) return;
  const top = clampHandoffFabTop(handoffFabPosition.top);
  handoffFabPosition = { top };
  control.style.top = `${top}px`;
  control.style.bottom = "auto";
  control.style.transform = "none";
  syncHandoffFabPanelPlacement(control);
}

function handoffFabPanelPlacement() {
  if (!handoffFabPosition) return "center";
  return handoffFabPosition.top < window.innerHeight / 2 ? "below" : "above";
}

function syncHandoffFabPanelPlacement(control) {
  if (!control) return;
  control.classList.remove("panel-center", "panel-above", "panel-below");
  control.classList.add(`panel-${handoffFabPanelPlacement()}`);
}

function setHandoffMode(nextMode) {
  handoffMode = Boolean(nextMode);
  if (handoffMode) handoffPanelOpen = true;
  if (!handoffMode) {
    activeHandoffKey = "";
    stopHandoffPlacement();
    closeHandoffModal();
  }
  if (typeof window !== "undefined") window.localStorage?.setItem("handoffMode", handoffMode ? "1" : "0");
  renderApp();
}

function toggleHandoffMode() {
  setHandoffMode(!handoffMode);
}

function toggleHandoffPanel(event) {
  if (handoffFabSuppressClick) {
    handoffFabSuppressClick = false;
    event?.preventDefault();
    return;
  }
  handoffPanelOpen = !handoffPanelOpen;
  if (!handoffPanelOpen) handoffAdvancedOpen = false;
  mountPlacedHandoffAnnotations();
}

function closeHandoffPanel() {
  handoffPanelOpen = false;
  handoffAdvancedOpen = false;
  mountPlacedHandoffAnnotations();
}

function toggleHandoffAdvanced() {
  handoffAdvancedOpen = !handoffAdvancedOpen;
  mountPlacedHandoffAnnotations();
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
  if (archivedHandoffAnnotationKeys.has(key)) return null;
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
  const renderItems = (entries) => entries
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
  document.getElementById("shopNav").innerHTML = renderItems(commercePages);
  document.getElementById("sideNav").innerHTML = renderItems(visibleVirtualLivePages());
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
    agents: [renderAgentPage],
    materials: [renderMaterialPage],
    faces: [renderFacePage],
    actions: [renderActionPage],
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
  if (!handoffMode) {
    handoffMode = true;
    if (typeof window !== "undefined") window.localStorage?.setItem("handoffMode", "1");
  }
  handoffPanelOpen = false;
  handoffAdvancedOpen = false;
  handoffPlacementMode = true;
  handoffPlacementScope = scope;
  document.body?.classList.add("handoff-placing");
  renderApp();
  toast(scope === "modal" ? "点击弹层中要添加标注的位置" : "点击页面或弹层中要添加标注的位置");
}

function stopHandoffPlacement() {
  handoffPlacementMode = false;
  document.body?.classList.remove("handoff-placing");
  mountPlacedHandoffAnnotations();
}

function handleHandoffPlacementClick(event) {
  if (!handoffMode || !handoffPlacementMode) return;
  if (event.target.closest("#handoffModalRoot, #handoffOverlayRoot, .handoff-fab-control, .handoff-overlay-badge")) return;

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
  if (!handoffMode) {
    handoffVisibleAnnotations = [];
    const panel = renderHandoffFloatingPanel();
    root.appendChild(panel);
    applyHandoffFabPosition(panel);
    return;
  }
  handoffVisibleAnnotations = collectVisibleHandoffAnnotations();
  if (activeHandoffKey && !handoffVisibleAnnotations.some((record) => record.item.key === activeHandoffKey)) {
    activeHandoffKey = "";
  }
  const panel = renderHandoffFloatingPanel();
  root.appendChild(panel);
  applyHandoffFabPosition(panel);
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
  const count = handoffMode ? handoffVisibleAnnotations.length : 0;
  panel.className = `handoff-fab-control panel-${handoffFabPanelPlacement()} ${handoffPanelOpen ? "open" : ""} ${handoffMode ? "annotations-visible" : ""} ${handoffPlacementMode ? "placing" : ""}`;
  panel.innerHTML = `
    <button class="handoff-fab" type="button" title="交付标注" aria-label="交付标注" aria-expanded="${handoffPanelOpen}" aria-controls="handoffFabPanel" onpointerdown="startHandoffFabDrag(event)" onclick="toggleHandoffPanel(event)">
      <span aria-hidden="true">标</span>
      ${handoffMode && count ? `<b class="handoff-fab-count">${count > 99 ? "99+" : count}</b>` : ""}
    </button>
    <section id="handoffFabPanel" class="handoff-floating-panel" aria-label="交付标注工具">
      <header class="handoff-fab-head">
        <div><strong>交付标注</strong><span>${handoffMode ? `当前页 ${count} 条` : "标注已隐藏"}</span></div>
        <button class="handoff-fab-close" type="button" aria-label="关闭交付标注面板" onclick="closeHandoffPanel()">×</button>
      </header>
      <button class="handoff-fab-switch ${handoffMode ? "active" : ""}" type="button" role="switch" aria-checked="${handoffMode}" onclick="toggleHandoffMode()">
        <span>显示本页标注</span><i aria-hidden="true"></i>
      </button>
      ${handoffMode ? `<div class="handoff-fab-current-list"><div class="handoff-fab-list-title"><strong>当前页标注</strong><span>${count} 条</span></div>${count ? `<div class="handoff-panel-list">${handoffVisibleAnnotations.map((record) => renderHandoffPanelListItem(record)).join("")}</div>` : '<div class="handoff-visible-empty">当前页暂无交付标注</div>'}</div>` : ""}
      <div class="handoff-fab-actions"><button class="handoff-fab-action ${handoffPlacementMode ? "active" : ""}" type="button" onclick="startHandoffPlacement('auto')">定位新增</button></div>
      <div class="handoff-fab-more">
        <button class="handoff-fab-more-toggle" type="button" aria-expanded="${handoffAdvancedOpen}" onclick="toggleHandoffAdvanced()">更多管理 <span aria-hidden="true">${handoffAdvancedOpen ? "⌃" : "⌄"}</span></button>
        ${handoffAdvancedOpen ? `<div class="handoff-fab-more-actions"><button type="button" onclick="persistHandoffAnnotationsJson()">固化全部标注</button><button type="button" onclick="triggerHandoffAnnotationImport()">导入 JSON</button><button class="danger" type="button" onclick="confirmResetHandoffAnnotations()">恢复项目标注</button></div>` : ""}
      </div>
    </section>
  `;
  return panel;
}

function startHandoffFabDrag(event) {
  if (event.button !== undefined && event.button !== 0) return;
  const control = event.currentTarget.closest(".handoff-fab-control");
  if (!control) return;
  const rect = control.getBoundingClientRect();
  handoffFabDrag = {
    pointerId: event.pointerId,
    startY: event.clientY,
    offsetY: event.clientY - rect.top,
    moved: false,
  };
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function handleHandoffFabDrag(event) {
  if (!handoffFabDrag || event.pointerId !== handoffFabDrag.pointerId) return;
  const delta = event.clientY - handoffFabDrag.startY;
  if (Math.abs(delta) > 6) handoffFabDrag.moved = true;
  if (!handoffFabDrag.moved) return;
  const control = document.querySelector(".handoff-fab-control");
  if (!control) return;
  const top = clampHandoffFabTop(event.clientY - handoffFabDrag.offsetY);
  handoffFabPosition = { top };
  control.classList.add("dragging");
  control.style.top = `${top}px`;
  control.style.bottom = "auto";
  control.style.transform = "none";
  syncHandoffFabPanelPlacement(control);
  event.preventDefault();
}

function stopHandoffFabDrag(event) {
  if (!handoffFabDrag || (event?.pointerId !== undefined && event.pointerId !== handoffFabDrag.pointerId)) return;
  const moved = handoffFabDrag.moved;
  handoffFabDrag = null;
  document.querySelector(".handoff-fab-control")?.classList.remove("dragging");
  if (!moved) return;
  handoffFabSuppressClick = true;
  saveHandoffFabPosition();
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
    const nextPageKey = safePageKey(pageKey);
    activePage = nextPageKey;
    if (!visitedTabs.includes(nextPageKey)) visitedTabs.push(nextPageKey);
    if (typeof window !== "undefined" && window.location) window.location.hash = nextPageKey;
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
  const items = [panel, ...(panel.querySelectorAll?.(".handoff-floating-panel") || []), ...document.querySelectorAll("#handoffModalRoot .modal, #modalRoot .modal-header, #modalRoot .modal-footer"), ...scopedAvoidElements];
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
  const labels = visitedTabs
    .filter((key) => !isCustomerHiddenPage(key))
    .map((key) => pages.find((page) => page.key === key))
    .filter(Boolean);
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
  const nextPageKey = safePageKey(pageKey);
  activePage = nextPageKey;
  if (nextPageKey === "flow") { scriptFlowView = "list"; }
  if (nextPageKey !== "robots") { robotDetailView = false; robotDetailTab = "scripts"; }
  if (!visitedTabs.includes(nextPageKey)) visitedTabs.push(nextPageKey);
  if (typeof window !== "undefined" && window.location) window.location.hash = nextPageKey;
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
  if (changelogView === "phase2") return renderPhase2FeatureListPage();
  if (changelogView === "legacy") return renderLegacyFeatureListPage();
  if (changelogView === "prototype-preview") return renderPrototypeVersionPreviewPage();
  const versions = prototypeVersions();
  const visibleVersions = filteredPrototypeVersions(versions);
  const current = versions.find((version) => version.current) || versions[0];
  return `
    <div class="changelog-page">
      <section class="changelog-head changelog-hero changelog-clean-head">
        <div>
          <h1>更新日志</h1>
          <p>按版本查看交付记录；详细功能点可进入对应清单筛选与查看。</p>
          <div class="changelog-current-version">当前版本：${escapeHtml(current?.title || "-")}</div>
        </div>
        <div class="changelog-actions">
          <button class="btn" type="button" onclick="openChangelogFeatureList('phase2')">查看当前功能清单</button>
        </div>
      </section>
      <section class="changelog-toolbar changelog-clean-toolbar">
        <div>
          <strong>版本记录</strong>
          <span>${visibleVersions.length} / ${versions.length} 个版本</span>
        </div>
        <div class="changelog-status-tabs">
          ${["全部版本", "当前版本", "已发布"].map((status) => `<button class="${changelogStatusFilter === status ? "active" : ""}" type="button" onclick="setChangelogStatusFilter('${status}')">${status}</button>`).join("")}
        </div>
      </section>
      <div class="release-timeline">
        ${visibleVersions.length ? visibleVersions.map(renderPrototypeVersionCard).join("") : `<div class="empty-state">当前筛选下暂无版本记录</div>`}
      </div>
    </div>`;
}

function renderPrototypeVersionCard(version) {
  const featureCount = version.featureView === "phase2" ? phase2FeatureRows.length : featureListRows.length;
  const focusCount = version.featureView === "phase2" ? phase2FeatureRows.filter((row) => row.focus).length : featureListRows.filter((row) => row.priority === "高").length;
  const summary = version.summaryItems.slice(0, version.current ? 2 : 1).join("；");
  return `
    <article class="release-card release-card-clean ${version.current ? "current" : ""}">
      <div class="release-date-block">
        <strong>${escapeHtml(version.date)}</strong>
        <span class="${escapeHtml(version.statusClass)}">${escapeHtml(version.status)}</span>
      </div>
      <div class="release-main">
        <div class="release-card-head">
          <div>
            <h2>${escapeHtml(version.title)}</h2>
            <p class="release-headline">${escapeHtml(version.headline)}</p>
          </div>
        </div>
        <p class="release-summary-line">${escapeHtml(summary)}</p>
        <div class="release-card-meta">
          <span>${featureCount} 项功能</span>
          <span>${focusCount} 项重点</span>
        </div>
        <div class="release-actions">
          <button class="btn" type="button" onclick="openChangelogFeatureList('${escapeHtml(version.featureView)}')">${version.current ? "查看功能清单" : "查看历史清单"}</button>
          <button class="btn secondary" type="button" onclick="openPrototypeVersion('${escapeHtml(version.id)}')">查看该版本原型</button>
        </div>
      </div>
    </article>`;
}

function changelogStats(versions) {
  const current = versions.find((version) => version.current) || versions[0] || {};
  return {
    totalVersions: versions.length,
    currentTitle: current.id ? current.id.toUpperCase() : "-",
    currentFeatureCount: current.featureView === "phase2" ? phase2FeatureRows.length : featureListRows.length,
    annotationCount: Object.keys(handoffAnnotations).length,
  };
}

function filteredPrototypeVersions(versions) {
  if (changelogStatusFilter === "当前版本") return versions.filter((version) => version.current);
  if (changelogStatusFilter === "已发布") return versions.filter((version) => version.status === "已发布");
  return versions;
}

function setChangelogStatusFilter(status) {
  changelogStatusFilter = status;
  renderApp();
}

function openChangelogFeatureList(view) {
  changelogView = view;
  prototypePreviewVersionId = "";
  renderApp();
}

function openPrototypeVersion(versionId) {
  prototypePreviewVersionId = versionId;
  changelogView = "prototype-preview";
  renderApp();
}

function returnToChangelogTimeline() {
  changelogView = "timeline";
  prototypePreviewVersionId = "";
  renderApp();
}

function enableHandoffAnnotations() {
  setHandoffMode(true);
}

function filteredPhase2FeatureRows() {
  const keyword = phase2FeatureFilters.keyword.trim().toLowerCase();
  return phase2FeatureRows.filter((row) => {
    const matchesKeyword = !keyword || [row.id, row.module, row.type, row.point, row.desc, row.compare].join(" ").toLowerCase().includes(keyword);
    const matchesModule = phase2FeatureFilters.module === "全部模块" || row.module === phase2FeatureFilters.module;
    const matchesType = phase2FeatureFilters.type === "全部变化" || row.type === phase2FeatureFilters.type;
    const priority = row.focus ? "P0" : "P1";
    const matchesPriority = phase2FeatureFilters.priority === "全部优先级" || phase2FeatureFilters.priority === priority;
    return matchesKeyword && matchesModule && matchesType && matchesPriority;
  });
}

function setPhase2FeatureFilter(field, value) {
  phase2FeatureFilters[field] = value;
  renderApp();
}

function clearPhase2FeatureFilters() {
  phase2FeatureFilters = { keyword: "", module: "全部模块", type: "全部变化", priority: "全部优先级" };
  renderApp();
}

function phase2FeatureTypeClass(type) {
  if (type === "新增") return "green";
  if (type === "调整") return "blue";
  return "gray";
}

function openPhase2FeatureDrawer(featureId) {
  const row = phase2FeatureRows.find((item) => item.id === featureId);
  if (!row) return;
  document.getElementById("modalRoot").innerHTML = `
    <div class="phase2-feature-drawer-backdrop" onclick="if(event.target===this)closePhase2FeatureDrawer()">
      <aside class="phase2-feature-drawer" role="dialog" aria-modal="true" aria-label="功能点详情">
        <header class="phase2-feature-drawer-head">
          <div>
            <span class="phase2-feature-id">${escapeHtml(row.id)}</span>
            <h2>${escapeHtml(row.point)}</h2>
          </div>
          <button class="modal-close" type="button" aria-label="关闭详情" onclick="closePhase2FeatureDrawer()">×</button>
        </header>
        <div class="phase2-feature-drawer-body">
          <div class="phase2-feature-tags">
            <span>${escapeHtml(row.module)}</span>
            <span class="${phase2FeatureTypeClass(row.type)}">${escapeHtml(row.type)}</span>
            <span class="${row.focus ? "focus" : "neutral"}">${row.focus ? "P0" : "P1"}</span>
          </div>
          <section class="phase2-feature-detail-block">
            <h3>功能说明</h3>
            <p>${escapeHtml(row.desc)}</p>
          </section>
          <section class="phase2-feature-detail-block">
            <h3>相对上一版本</h3>
            <p>${escapeHtml(row.compare)}</p>
          </section>
        </div>
      </aside>
    </div>`;
}

function closePhase2FeatureDrawer() {
  document.getElementById("modalRoot").replaceChildren();
}

function renderPrototypeVersionPreviewPage() {
  const version = prototypeVersions().find((item) => item.id === prototypePreviewVersionId) || prototypeVersions()[0];
  return `
    <div class="changelog-page prototype-preview-page">
      <section class="changelog-head prototype-preview-head">
        <div>
          <button class="btn secondary compact" type="button" onclick="returnToChangelogTimeline()">← 返回更新日志</button>
          <h1>${escapeHtml(version.title)} 原型预览</h1>
          <p>${escapeHtml(version.date)} · ${escapeHtml(version.status)} · 默认打开交付标注，标注来自 ${escapeHtml(version.annotationSource)}。</p>
        </div>
        <div class="changelog-actions">
          <button class="btn secondary" type="button" onclick="openChangelogFeatureList('${escapeHtml(version.featureView)}')">查看功能清单</button>
        </div>
      </section>
      <section class="prototype-preview-shell">
        <iframe class="prototype-preview-frame" src="${escapeHtml(version.previewUrl)}" title="${escapeHtml(version.title)} 原型预览"></iframe>
      </section>
    </div>`;
}

function renderPhase2FeatureListPage() {
  const moduleOptions = ["全部模块", ...Array.from(new Set(phase2FeatureRows.map((row) => row.module)))];
  const rows = filteredPhase2FeatureRows();
  const hasActiveFilters = phase2FeatureFilters.keyword || phase2FeatureFilters.module !== "全部模块" || phase2FeatureFilters.type !== "全部变化" || phase2FeatureFilters.priority !== "全部优先级";
  return `
    <div class="changelog-page">
      <section class="changelog-head feature-list-head">
        <div>
          <button class="btn secondary compact" type="button" onclick="returnToChangelogTimeline()">← 返回更新日志</button>
          <h1>V2.0 二期优化功能清单</h1>
          <p>筛选后点击功能点，查看完整说明与相对上一版本的变化。</p>
        </div>
        <div class="changelog-actions">
          <button class="btn" type="button" onclick="openPrototypeVersion('v2.0')">查看当前原型</button>
        </div>
      </section>
      <section class="feature-list-toolbar phase2-feature-toolbar">
        <div>
          <strong>功能清单</strong>
          <span>当前显示 ${rows.length} / ${phase2FeatureRows.length} 项</span>
        </div>
        <div class="phase2-feature-filters">
          <input class="input phase2-feature-search" value="${escapeHtml(phase2FeatureFilters.keyword)}" placeholder="搜索功能 ID、模块或功能点" oninput="setPhase2FeatureFilter('keyword', this.value)" />
          <select class="select" onchange="setPhase2FeatureFilter('module', this.value)">${moduleOptions.map((moduleName) => `<option value="${escapeHtml(moduleName)}" ${phase2FeatureFilters.module === moduleName ? "selected" : ""}>${escapeHtml(moduleName)}</option>`).join("")}</select>
          <select class="select" onchange="setPhase2FeatureFilter('type', this.value)">${["全部变化", "新增", "优化", "调整"].map((type) => `<option value="${type}" ${phase2FeatureFilters.type === type ? "selected" : ""}>${type}</option>`).join("")}</select>
          <select class="select" onchange="setPhase2FeatureFilter('priority', this.value)">${["全部优先级", "P0", "P1"].map((priority) => `<option value="${priority}" ${phase2FeatureFilters.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}</select>
          ${hasActiveFilters ? `<button class="btn secondary phase2-filter-reset" type="button" onclick="clearPhase2FeatureFilters()">清空筛选</button>` : ""}
        </div>
      </section>
      <div class="table-wrap feature-table-wrap phase2-feature-table-wrap"><table class="data-table phase2-feature-table"><thead><tr><th>功能ID</th><th>模块</th><th>功能点</th><th>变化类型</th><th>优先级</th><th>功能描述</th><th>上一版本对比描述</th></tr></thead><tbody>${rows.length ? rows.map((row) => `<tr class="phase2-feature-row" tabindex="0" role="button" aria-label="查看 ${escapeHtml(row.point)} 详情" onclick="openPhase2FeatureDrawer('${row.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openPhase2FeatureDrawer('${row.id}')}\"><td>${row.id}</td><td>${row.module}</td><td class="left"><strong>${row.point}</strong><span class="phase2-row-hint">查看详情</span></td><td><span class="mini-tag ${phase2FeatureTypeClass(row.type)}">${row.type}</span></td><td><span class="mini-tag ${row.focus ? "red" : "gray"}">${row.focus ? "P0" : "P1"}</span></td><td class="left">${row.desc}</td><td class="left">${row.compare}</td></tr>`).join("") : `<tr><td colspan="7" class="phase2-feature-empty">当前筛选下没有功能点</td></tr>`}</tbody></table></div>
    </div>`;
}

function renderLegacyFeatureListPage() {
  const rows = filteredFeatureRows();
  const moduleCount = new Set(featureListRows.map((row) => row.module1).filter(Boolean)).size;
  const backendCount = featureListRows.filter((row) => row.client === "服务器").length;
  const robotCount = featureListRows.filter((row) => row.client === "机器人").length;
  return `
    <div class="changelog-page">
      <section class="changelog-head">
        <div>
          <button class="btn secondary compact" type="button" onclick="returnToChangelogTimeline()">← 返回更新日志</button>
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

function confirmResetHandoffAnnotations() {
  if (!window.confirm("恢复项目标注会清空本机新增、编辑和删除的标注草稿，是否继续？")) return;
  resetHandoffAnnotations();
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
  const shops = ["全部店铺", ...Array.from(new Set(visibleChannelResources(products, "products").map((item) => item.shop)))];
  const keyword = productFilters.keyword.trim().toLowerCase();
  const visibleProducts = visibleChannelResources(products, "products")
    .filter((item) => productFilters.shop === "全部店铺" || item.shop === productFilters.shop)
    .filter((item) => !keyword || [item.id, item.title, item.shop, item.category].join(" ").toLowerCase().includes(keyword));
  return `
    <div class="toolbar">
      <div class="filters">
        <label class="field-inline">选择优购商城店铺
          <select class="select w-180" onchange="setProductFilter('shop', this.value)">${shops.map((shop) => `<option ${productFilters.shop === shop ? "selected" : ""}>${escapeHtml(shop)}</option>`).join("")}</select>
        </label>
        <input class="input w-220" value="${escapeHtml(productFilters.keyword)}" placeholder="输入商品ID或商品名称搜" oninput="setProductFilter('keyword', this.value)" />
        <button class="btn" type="button" onclick="toast('已按商品条件查询')">查询</button>
      </div>
      <div class="filters">
        <span>操作：</span>
        <button class="btn danger" type="button" onclick="removeSelectedProducts()">从列表中移除商品</button>
      </div>
    </div>
    ${handoffNote("技能管理大库只显示公共模板；用户模板在机器人管理的技能管理页签中维护。礼物触发仅选择档位，不做价格区间校验。")}
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" onchange="selectAllProducts(this.checked)" /></th>
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
          ${visibleProducts
            .map(
              (item, index) => `
              <tr>
                <td><input type="checkbox" ${selectedProductIds.includes(String(item.id)) ? "checked" : ""} onchange="toggleProductSelection('${escapeJs(item.id)}', this.checked)" /></td>
                <td>${index + 1}</td>
                <td>${item.id}</td>
                <td>${item.shop}</td>
                <td><div class="product-img ${item.imageClass}">${item.image}</div></td>
                <td class="left">${item.title}</td>
                <td>${item.category}</td>
                <td class="price">${item.price}</td>
                <td class="price">${item.slash}</td>
                <td>${item.stock}</td>
                <td>${item.video ? `<button class="link" onclick="openProductVideoPreview('${escapeJs(item.id)}')">◎ 预览视频</button><br />` : ""}<button class="link" onclick="uploadProductVideo('${escapeJs(item.id)}')">↥ 点击上传</button></td>
                <td class="left">${item.copy}<br /><button class="link" onclick="editProductCopy('${escapeJs(item.id)}')">编辑</button></td>
                <td><span class="mini-tag ${productStatusClass(item)}">${item.status}</span></td>
                <td><button class="btn danger small" type="button" onclick="removeProduct('${escapeJs(item.id)}')">移除商品</button></td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function setProductFilter(key, value) {
  productFilters[key] = value;
  renderApp();
}

function toggleProductSelection(id, checked) {
  if (checked && !selectedProductIds.includes(id)) selectedProductIds.push(id);
  if (!checked) selectedProductIds = selectedProductIds.filter((item) => item !== id);
}

function selectAllProducts(checked) {
  selectedProductIds = checked ? visibleChannelResources(products, "products").map((item) => String(item.id)) : [];
  renderApp();
}

function removeProduct(id) {
  const index = products.findIndex((item) => String(item.id) === String(id));
  if (index >= 0) products.splice(index, 1);
  selectedProductIds = selectedProductIds.filter((item) => item !== String(id));
  toast("商品已移除");
  renderApp();
}

function removeSelectedProducts() {
  if (!selectedProductIds.length) {
    toast("请先勾选商品");
    return;
  }
  selectedProductIds.forEach((id) => {
    const index = products.findIndex((item) => String(item.id) === String(id));
    if (index >= 0) products.splice(index, 1);
  });
  const count = selectedProductIds.length;
  selectedProductIds = [];
  toast(`已移除 ${count} 个商品`);
  renderApp();
}

function openProductVideoPreview(id) {
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) return;
  openModal(`<div class="modal medium"><div class="modal-header"><div class="modal-title">讲解视频预览</div><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="video-preview-mock"><strong>${escapeHtml(product.title)}</strong><span>讲解视频 Mock 预览</span></div></div><div class="modal-footer"><button class="btn" onclick="closeModal()">关闭</button></div></div>`);
}

function uploadProductVideo(id) {
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) return;
  product.video = true;
  toast("讲解视频已上传");
  renderApp();
}

function editProductCopy(id) {
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) return;
  openModal(`<div class="modal medium"><div class="modal-header"><div class="modal-title">编辑讲解文案</div><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body">${formTextareaWithId("productCopyInput", "讲解文案", "请输入讲解文案", product.copy || "")}</div><div class="modal-footer"><button class="btn secondary" onclick="closeModal()">取消</button><button class="btn" onclick="saveProductCopy('${escapeJs(id)}')">保存</button></div></div>`);
}

function saveProductCopy(id) {
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) return;
  product.copy = cleanCell(document.getElementById("productCopyInput")?.value) || product.copy;
  closeModal();
  toast("讲解文案已保存");
  renderApp();
}

function renderRoomPage() {
  const keyword = roomFilters.keyword.trim().toLowerCase();
  const visibleRooms = visibleChannelResources(rooms, "rooms")
    .filter((room) => roomFilters.status === "全部" || room.status === roomFilters.status)
    .filter((room) => !keyword || [room.id, room.account, room.role, room.roomId].join(" ").toLowerCase().includes(keyword));
  return `
    <div class="toolbar">
      <div class="filters">
        <label class="field-inline">开播时间
          <input class="input w-180" placeholder="开始日期    ~    结束日期" />
        </label>
        <input class="input w-260" value="${escapeHtml(roomFilters.keyword)}" placeholder="输入直播账号ID或昵称搜索" oninput="setRoomFilter('keyword', this.value)" />
        <select class="select w-180" onchange="setRoomFilter('status', this.value)">${["全部", "直播中", "已结束", "未开始"].map((status) => `<option ${roomFilters.status === status ? "selected" : ""}>${status}</option>`).join("")}</select>
        <button class="btn" type="button" onclick="toast('已查询直播间')">查询</button>
        <button class="btn" type="button" onclick="openRoomModal(true)">+ 创建虚拟直播间</button>
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
          ${visibleRooms
            .map(
              (room) => `
              <tr>
                <td>${room.seq}</td>
                <td>${room.id}</td>
                <td>
                  <div class="${room.live ? "status-green" : ""}">${room.status}</div>
                  <div class="nowrap"><button class="link" onclick="toggleRoomVisible('${escapeJs(room.id)}')">${room.hidden ? "显示" : "隐藏"}</button> <span class="switch ${!room.hidden ? "on" : ""}"></span> 显示</div>
                </td>
                <td class="left">开播：${room.start}<br />关播：${room.end}</td>
                <td>🤖${room.type}<br /><span class="tag">聊天</span></td>
                <td><strong>${room.account}</strong><br />${room.roomId}</td>
                <td><div class="avatar-img ${room.avatarClass}">${room.cover}</div><br />${room.role}</td>
                <td><button class="link">编辑</button></td>
                <td class="nowrap">
                  <button class="link" onclick="openRoomManageModal('${escapeJs(room.id)}')">管理直播间</button>
                  <button class="link" onclick="openConversationPage({roomId:'${room.id}'})">查看历史对话</button>
                  <button class="link" onclick="openScriptEditor('${escapeJs(room.scriptId || "SCRIPT-001")}', { type: 'page', pageKey: 'rooms', label: '管理直播间' })">脚本流程编排</button>
                  <button class="link" onclick="copyRoomAddress('${escapeJs(room.id)}')">复制直播间地址</button>
                  ${room.live ? `<button class="link danger" onclick="stopRoomLive('${escapeJs(room.id)}')">立即下播</button>` : `<button class="link green" onclick="startRoomLive('${escapeJs(room.id)}')">重新开播</button><button class="link danger" onclick="deleteRoom('${escapeJs(room.id)}')">删除</button>`}
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

function setRoomFilter(key, value) {
  roomFilters[key] = value;
  renderApp();
}

function toggleRoomVisible(id) {
  const room = rooms.find((item) => String(item.id) === String(id));
  if (!room) return;
  room.hidden = !room.hidden;
  toast(room.hidden ? "直播间已隐藏" : "直播间已显示");
  renderApp();
}

function openRoomManageModal(id) {
  const room = rooms.find((item) => String(item.id) === String(id));
  if (!room) return;
  openModal(`<div class="modal medium"><div class="modal-header"><div class="modal-title">管理直播间</div><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-section"><div class="form-row"><span class="form-label">直播ID</span><strong>${escapeHtml(room.id)}</strong></div><div class="form-row"><span class="form-label">开播账号</span><span>${escapeHtml(room.account)}</span></div><div class="form-row"><span class="form-label">状态</span><span>${escapeHtml(room.status)}</span></div></div></div><div class="modal-footer"><button class="btn" onclick="closeModal()">关闭</button></div></div>`);
}

function copyRoomAddress(id) {
  const url = `https://live.example.com/rooms/${id}`;
  navigator.clipboard?.writeText(url).catch(() => {});
  toast("直播间地址已复制");
}

function startRoomLive(id) {
  const room = rooms.find((item) => String(item.id) === String(id));
  if (!room) return;
  room.live = true;
  room.status = "直播中";
  room.start = currentDateTimeText() + ":00";
  toast("直播间已开播");
  renderApp();
}

function stopRoomLive(id) {
  const room = rooms.find((item) => String(item.id) === String(id));
  if (!room) return;
  room.live = false;
  room.status = "已结束";
  room.end = currentDateTimeText() + ":00";
  toast("直播间已下播");
  renderApp();
}

function deleteRoom(id) {
  const index = rooms.findIndex((item) => String(item.id) === String(id));
  if (index >= 0) rooms.splice(index, 1);
  toast("直播间已删除");
  renderApp();
}

function openConversationPage(filters = {}) {
  conversationFilters = { ...conversationFilters, ...filters };
  navigate("conversations");
}

function setConversationFilter(field, value) {
  conversationFilters[field] = value;
  renderApp();
}

function filteredConversationSessions() {
  const channelId = phase2State?.snapshot().currentChannelId || "channel-weishi";
  const keyword = conversationFilters.keyword.trim().toLowerCase();
  return conversationSessions.filter((session) => session.channelId === channelId)
    .filter((session) => conversationInTimeRange(session, conversationFilters.time))
    .filter((session) => !conversationFilters.roomId || session.roomId === conversationFilters.roomId)
    .filter((session) => !conversationFilters.robotId || session.robotId === conversationFilters.robotId)
    .filter((session) => !conversationFilters.user || session.user.toLowerCase().includes(conversationFilters.user.toLowerCase()))
    .filter((session) => !keyword || [session.summary, session.user, ...session.messages.map((item) => item.text)].join(" ").toLowerCase().includes(keyword));
}

function conversationInTimeRange(session, range) {
  const time = new Date(session.time.replace(" ", "T")).getTime();
  const days = range === "近24小时" ? 1 : range === "近30天" ? 30 : 7;
  return Date.now() - time <= days * 24 * 3600000;
}

function renderConversationPage() {
  const channelId = phase2State?.snapshot().currentChannelId || "channel-weishi";
  const channelSessions = conversationSessions.filter((item) => item.channelId === channelId);
  const rows = filteredConversationSessions();
  const roomOptions = Array.from(new Map(channelSessions.map((item) => [item.roomId, item.roomName])).entries());
  const robotOptions = Array.from(new Map(channelSessions.map((item) => [item.robotId, item.robotName])).entries());
  return `<div class="conversation-page"><div class="toolbar"><div class="filters"><select class="select w-120" onchange="setConversationFilter('time',this.value)">${["近7天", "近24小时", "近30天"].map((time) => `<option ${conversationFilters.time === time ? "selected" : ""}>${time}</option>`).join("")}</select><select class="select w-180" onchange="setConversationFilter('roomId',this.value)"><option value="">全部直播间</option>${roomOptions.map(([id,name]) => `<option value="${id}" ${conversationFilters.roomId === id ? "selected" : ""}>${name}</option>`).join("")}</select><select class="select w-180" onchange="setConversationFilter('robotId',this.value)"><option value="">全部机器人</option>${robotOptions.map(([id,name]) => `<option value="${id}" ${conversationFilters.robotId === id ? "selected" : ""}>${name}</option>`).join("")}</select><input class="input w-150" value="${escapeHtml(conversationFilters.user)}" placeholder="用户" oninput="setConversationFilter('user',this.value)" /><input class="input w-220" value="${escapeHtml(conversationFilters.keyword)}" placeholder="关键词" oninput="setConversationFilter('keyword',this.value)" /><button class="btn" onclick="toast('已查询历史对话')">查询</button>${handoffMark("历史对话筛选", "本次新增历史对话复盘入口，支持按时间、直播间、机器人、用户和关键词过滤当前渠道会话。", "new")}</div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>时间</th><th>直播间</th><th>机器人</th><th>用户</th><th>消息摘要</th><th>消息数</th><th>操作</th></tr></thead><tbody>${rows.length ? rows.map((session) => `<tr><td>${session.time}</td><td>${session.roomName}<br/><span class="muted-text">${session.roomId}</span></td><td>${session.robotName}<br/><span class="muted-text">${session.robotId}</span></td><td>${session.user}</td><td class="left">${session.summary}</td><td>${session.messages.length}</td><td><button class="link" onclick="openConversationDrawer('${session.id}')">查看对话</button></td></tr>`).join("") : `<tr><td colspan="7">当前筛选没有对话记录。</td></tr>`}</tbody></table></div>${pagination(rows.length,1)}</div>`;
}

function openConversationDrawer(sessionId) {
  const session = conversationSessions.find((item) => item.id === sessionId);
  if (!session) return;
  document.getElementById("modalRoot").innerHTML = `<div class="conversation-drawer-backdrop" onclick="if(event.target===this)closeConversationDrawer()"><aside class="conversation-drawer"><div class="modal-header"><div><div class="modal-title">完整对话${handoffMark("会话时间线复盘", "查看对话打开右侧抽屉，按消息时间线复盘用户和机器人互动上下文。", "info")}</div><div class="muted-text">${session.roomName} · ${session.robotName} · ${session.user}</div></div><button class="modal-close" onclick="closeConversationDrawer()">×</button></div><div class="conversation-timeline">${session.messages.map((message) => `<div class="conversation-message ${message.sender}"><div class="message-meta">${message.sender === "robot" ? session.robotName : session.user} · ${message.time}</div><div class="message-bubble">${escapeHtml(message.text)}</div></div>`).join("")}</div></aside></div>`;
}

function closeConversationDrawer() { document.getElementById("modalRoot").replaceChildren(); }

function renderMapPage() {
  const keyword = mapFilters.keyword.trim().toLowerCase();
  const visibleMaps = visibleChannelResources(exhibitionMaps, "maps", "id", resourceChannelFilterValue(mapFilters))
    .filter((map) => !keyword || [map.id, map.venueName, map.exhibitionName, map.mapName].join(" ").toLowerCase().includes(keyword));
  return `
    <div class="toolbar">
      <div class="filters">
        ${resourceChannelFilterHtml(mapFilters, "setMapFilter")}
        <input class="input w-220" value="${escapeHtml(mapFilters.keyword)}" placeholder="输入展馆ID或展馆名搜索" oninput="setMapFilter('keyword', this.value)" />
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
          ${visibleMaps
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
                    <td><button class="switch-button ${map.enabled ? "on" : ""}" type="button" onclick="toggleMapEnabled('${escapeJs(map.id)}')"><span></span></button></td>
                    <td><span class="mini-tag green">已绑定</span> ${robot ? `${robot.id} ${robot.name}` : "未绑定"}</td>
                    <td><button class="link" onclick="openMapModal('${map.id}')">编辑</button> <button class="link danger" onclick="deleteMap('${escapeJs(map.id)}')">删除</button></td>
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

function setMapFilter(key, value) {
  mapFilters[key] = value;
  renderApp();
}

function toggleMapEnabled(id) {
  const map = exhibitionMaps.find((item) => item.id === id);
  if (!map) return;
  map.enabled = !map.enabled;
  toast(map.enabled ? "地图已启用" : "地图已停用");
  renderApp();
}

function deleteMap(id) {
  const index = exhibitionMaps.findIndex((item) => item.id === id);
  if (index >= 0) exhibitionMaps.splice(index, 1);
  toast("展览地图已删除");
  renderApp();
}

function openMapModal(mapId = "") {
  const map = exhibitionMaps.find((item) => item.id === mapId) || {
    id: "",
    venueName: "",
    exhibitionName: "",
    mapName: "",
    boundRobotId: visibleChannelResources(robots, "robots")[0]?.id || robots[0]?.id || "",
    points: ["AGV_HOME"],
    exhibits: [],
  };
  const robotOptions = visibleChannelResources(robots, "robots");
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">${mapId ? "编辑展览地图" : "创建展览地图"}</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="form-section">
          ${mapFormInput("mapVenueName", "展馆名称", map.venueName, true)}
          ${mapFormInput("mapExhibitionName", "展览名称", map.exhibitionName, true)}
          ${mapFormInput("mapName", "地图名称", map.mapName, true)}
          <div class="form-row"><div class="form-label">绑定机器人</div><div><select id="mapBoundRobotId" class="select">${robotOptions.map((robot) => `<option value="${escapeHtml(robot.id)}" ${robot.id === map.boundRobotId ? "selected" : ""}>${robot.id} / ${robot.name} / ${robot.version}</option>`).join("")}</select></div></div>
          ${handoffNote("导览脚本会读取这里绑定的地图与点位列表；AGV_HOME 为必有点位，不支持更改。")}
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="closeModal()">取消</button><button class="btn" onclick="saveMapModal('${escapeJs(mapId)}')">确定</button></div>
    </div>
  `);
}

function mapFormInput(id, label, value, required = false) {
  return `<div class="form-row"><div class="form-label ${required ? "required" : ""}">${label}</div><div><input id="${id}" class="input" value="${escapeHtml(value || "")}" /></div></div>`;
}

function saveMapModal(mapId = "") {
  const target = exhibitionMaps.find((item) => item.id === mapId);
  const next = target || {
    id: `MAP-${Date.now().toString().slice(-5)}`,
    points: ["AGV_HOME"],
    pointNames: { AGV_HOME: "系统默认" },
    exhibits: [],
    enabled: true,
    channelId: phase2State?.snapshot().currentChannelId || "channel-weishi",
    resourceScope: "channel_public",
  };
  next.venueName = cleanCell(document.getElementById("mapVenueName")?.value) || "未命名展馆";
  next.exhibitionName = cleanCell(document.getElementById("mapExhibitionName")?.value) || "未命名展览";
  next.mapName = cleanCell(document.getElementById("mapName")?.value) || "未命名地图";
  next.boundRobotId = cleanCell(document.getElementById("mapBoundRobotId")?.value);
  if (!Array.isArray(next.points) || !next.points.length) next.points = ["AGV_HOME"];
  if (!next.pointNames) next.pointNames = { AGV_HOME: "系统默认" };
  normalizeResourceMetadata(next);
  if (!target) exhibitionMaps.unshift(next);
  closeModal();
  toast("展览地图已保存");
  renderApp();
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
                <td><input class="input map-point-name-input" data-point="${escapeHtml(point)}" value="${escapeHtml(map.pointNames?.[point] || "")}" placeholder="${isHome ? "系统默认" : "输入点位名称"}" ${isHome ? "readonly" : ""} /></td>
                <td>${isHome ? '<span class="mini-tag gray">锁定</span>' : `<button class="black-dot" onclick="removeMapPoint('${map.id}', ${index})">−</button>`}</td>
              </tr>`;
            }).join("")}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="closeModal()">取消</button><button class="btn" onclick="saveMapPointNames('${escapeJs(map.id)}')">保存</button></div>
    </div>
  `);
}

function saveMapPointNames(mapId) {
  const map = exhibitionMaps.find((item) => item.id === mapId);
  if (!map) return;
  if (!map.pointNames) map.pointNames = {};
  document.querySelectorAll(".map-point-name-input").forEach((input) => {
    const point = input.dataset.point;
    if (point) map.pointNames[point] = cleanCell(input.value) || (point === "AGV_HOME" ? "系统默认" : "");
  });
  closeModal();
  toast("点位列表已保存");
  renderApp();
}

function renumberMapPoints(map) {
  const oldPoints = [...map.points];
  const oldNames = { ...(map.pointNames || {}) };
  let counter = 1;
  for (let i = 0; i < map.points.length; i++) {
    if (map.points[i] !== "AGV_HOME") {
      map.points[i] = `AGV_P${counter++}`;
    }
  }
  map.pointNames = map.points.reduce((names, point, index) => {
    names[point] = oldNames[oldPoints[index]] || (point === "AGV_HOME" ? "系统默认" : "");
    return names;
  }, {});
}

function addMapPoint(mapId) {
  const map = exhibitionMaps.find((item) => item.id === mapId);
  if (!map) return;
  map.points.push("AGV_P_NEW");
  if (!map.pointNames) map.pointNames = {};
  renumberMapPoints(map);
  const lastPoint = map.points[map.points.length - 1];
  openMapPointsModal(mapId);
  toast(`已新增点位 ${lastPoint}`);
}

function removeMapPoint(mapId, index) {
  const map = exhibitionMaps.find((item) => item.id === mapId);
  if (!map) return;
  if (map.points[index] === "AGV_HOME") { toast("AGV_HOME 为系统必有点位，不可删除"); return; }
  const removedPoint = map.points[index];
  map.points.splice(index, 1);
  if (map.pointNames) delete map.pointNames[removedPoint];
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
            <tbody>${map.exhibits.map((item, index) => `<tr><td>${index + 1}</td><td><div class="product-img product-a">${item.image}</div></td><td>${item.name}</td><td class="left">${item.desc || ""}</td><td class="left">${item.script || ""}</td><td><select class="select w-220"><option>选择点位</option>${map.points.map((point) => `<option ${point === item.point ? "selected" : ""}>${point}</option>`).join("")}</select></td><td><button class="link" onclick="openExhibitEditor('${map.id}', ${item.id})">编辑</button> <button class="link danger" onclick="deleteExhibit('${map.id}', ${item.id})">删除</button></td></tr>`).join("")}</tbody>
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
            ${mapFormInput("exhibitName", "展品名称", item.name, true)}
            <div class="form-row top"><div class="form-label">展品描述</div><div><textarea id="exhibitDesc" class="textarea" placeholder="输入展品描述...">${escapeHtml(item.desc || "")}</textarea></div></div>
            <div class="form-row top"><div class="form-label">讲解文案</div><div><textarea id="exhibitScript" class="textarea" placeholder="输入讲解文案...">${escapeHtml(item.script || "")}</textarea><button class="btn small" style="margin-top:12px;">AI生成音频</button></div></div>
            <div class="form-row"><div class="form-label">地图点位</div><div><select id="exhibitPoint" class="select w-260">${map.points.map((point) => `<option ${point === item.point ? "selected" : ""}>${point}</option>`).join("")}</select></div></div>
          </div>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="openExhibitManager('${map.id}')">取消</button><button class="btn" onclick="saveExhibitEditor('${map.id}', ${item.id})">保存</button></div>
    </div>
  `);
}

function saveExhibitEditor(mapId, exhibitId) {
  const map = exhibitionMaps.find((item) => item.id === mapId);
  const exhibit = map?.exhibits.find((item) => item.id === exhibitId);
  if (!map || !exhibit) return;
  exhibit.name = cleanCell(document.getElementById("exhibitName")?.value) || exhibit.name;
  exhibit.desc = cleanCell(document.getElementById("exhibitDesc")?.value);
  exhibit.script = cleanCell(document.getElementById("exhibitScript")?.value);
  exhibit.point = cleanCell(document.getElementById("exhibitPoint")?.value);
  openExhibitManager(map.id);
  toast("展品已保存");
}

function deleteExhibit(mapId, exhibitId) {
  const map = exhibitionMaps.find((item) => item.id === mapId);
  if (!map) return;
  map.exhibits = map.exhibits.filter((item) => item.id !== exhibitId);
  openExhibitManager(map.id);
  toast("展品已删除");
}

function renderScriptFlowPage() {
  const anchor = currentAnchorTemplate();
  const stages = currentStages();
  const stage = currentStage();
  const script = currentScript();
  const isOfflineStage = stage.type === "线下互动";
  const isLiveScript = script.type === "直播";

  if (scriptFlowView === "list") return renderScriptFlowList();
  if (scriptFlowView === "performance-edit") return renderInlinePerformanceEditorPage();
  if (scriptFlowView === "preview") return renderScriptPreviewPage();

  return `
    <div class="flow-page script-edit-page">
      ${renderScriptEditorReturnBar(script)}
      ${renderTaskInfoBar(anchor, script)}

      <section class="flow-workbench">
        ${renderStageTimeline(stages)}
        <main class="flow-main ${isOfflineStage ? "offline-only" : ""}">
          ${renderStageBaseCard(anchor, stage)}
          ${renderPerformanceCard(stage)}
        </main>
      </section>
      ${renderScriptEditorFixedActions(script)}
    </div>
  `;
}

function renderScriptEditorReturnBar(script) {
  return `
    <div class="script-editor-return-bar">
      <div class="script-editor-return-main">
        <button class="btn secondary" type="button" onclick="returnToScriptEditorSource()">← 返回${escapeHtml(scriptEditorReturnLabel())}</button>
        <div>
          <strong>${escapeHtml(script.name)}</strong>
          <span>${escapeHtml(script.type)} · ${escapeHtml(anchorName(script.anchorType))}</span>
        </div>
      </div>
      <button class="btn danger" type="button" onclick="openScriptPreview()">整场预览</button>${handoffMark("整场预览入口", "脚本编辑页新增整场预览，进入只读视图后按阶段展开表演和表演单元，便于交付前验稿。", "new")}
    </div>
  `;
}

function renderScriptEditorFixedActions(script) {
  const disabled = script.isTemplate ? "disabled" : "";
  return `
    <div class="script-editor-fixed-actions">
      <button class="btn" type="button" ${disabled} onclick="saveAndDeployScript()">保存并下发机器人</button>
    </div>
  `;
}

function renderScriptFlowList() {
  const keyword = scriptListFilters.keyword.trim().toLowerCase();
  const visibleScripts = visibleChannelResources(scriptFlowScripts, "scripts")
    .filter((script) => !script.isTemplate)
    .filter((script) => !keyword || [script.id, script.name, script.robotId, script.robotName].join(" ").toLowerCase().includes(keyword))
    .filter((script) => scriptListFilters.type === "全部类型" || script.type === scriptListFilters.type)
    .filter((script) => scriptListFilters.status === "全部状态" || script.status === scriptListFilters.status);
  return `
    <div class="flow-page">
      ${handoffNote("脚本管理为本次新增菜单，覆盖脚本列表、脚本编辑、阶段时间线、阶段表演配置、商品/地图/机器人关联。", "新增菜单", "旧版后台无脚本管理；开发交付时需按新业务模块整体实现。", "new")}
      <div class="toolbar flow-list-toolbar">
        <div class="filters">
          <input class="input w-220" value="${escapeHtml(scriptListFilters.keyword)}" placeholder="搜索脚本名称 / ID" oninput="setScriptListFilter('keyword', this.value)" />
          <select class="select w-150" onchange="setScriptListFilter('type', this.value)">${["全部类型", "直播", "导览", "剧目", "活动"].map((value) => `<option ${scriptListFilters.type === value ? "selected" : ""}>${value}</option>`).join("")}</select>
          <select class="select w-150" onchange="setScriptListFilter('status', this.value)">${["全部状态", "草稿", "已发布"].map((value) => `<option ${scriptListFilters.status === value ? "selected" : ""}>${value}</option>`).join("")}</select>
          <button class="btn" type="button" onclick="toast('已查询脚本')">查询</button>${handoffMark("脚本生产闭环", "本次二期标注聚焦脚本列表、脚本内表演、整场预览、模板导入和保存下发的生产闭环。", "new")}
        </div>
        <div class="toolbar-actions">
          <button class="btn secondary" type="button" onclick="openScriptListImport()">导入脚本</button>
          <button class="btn" type="button" onclick="createBlankScriptFromList()">新建空白脚本</button>
        </div>
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
            ${visibleScripts
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
	                    <button class="link" type="button" onclick="openScriptEditor('${script.id}', { type: 'script-list', label: '脚本列表' })">编辑</button>
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

function setScriptListFilter(key, value) {
  scriptListFilters[key] = value;
  renderApp();
}

function createBlankScriptFromList() {
  const robot = visibleChannelResources(robots, "robots")[0] || robots[0];
  createRobotBlankScript(robot.id, { type: "script-list", label: "脚本列表" });
}

function openScriptListImport() {
  openRobotScriptImport("");
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
        ${handoffMark("阶段类型标签显示", "阶段类型为真人互动、弹幕互动或等待时在卡片显示类型标签，便于开发和运营快速识别特殊工作区。", "info")}
        ${stages.map((stage, index) => renderTimelineStageItem(stage, index)).join("")}
      </div>
    </aside>
  `;
}

function renderTimelineStageItem(stage, index) {
  const active = stage.id === selectedStageId;
  const stageType = stage.type || "普通流程";
  const interactiveType = stageType === "真人互动" || stageType === "弹幕互动";
  const emphasis = interactiveType || stageType === "等待";
  const typeTag = emphasis ? `<span class="mini-tag ${interactiveType ? "green" : "orange"}">${stageType}</span>` : "";
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
  const typeOptions = ["普通流程", "真人互动", "弹幕互动", "等待"];
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
        ${selectField(`阶段类型${handoffMark("阶段类型工作区", "普通流程：配置表演和等待；真人互动：配置互动时长/对话模式；弹幕互动：由弹幕触发承接；等待：配置等待时长，机器人只听不说。", "info")}`, stage.type || "普通流程", typeOptions, `updateStageType('${stage.id}', this.value)`)}
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
        <h2>B. 阶段流程配置${handoffMark("阶段表演绑定", "阶段可绑定一个或多个表演，支持拖拽排序、编辑源表演、解除绑定和配置表演后等待秒数。", "info")}</h2>
        <div class="stage-content-actions">
          <button class="btn small" type="button" onclick="openStageShowPicker()">绑定表演</button>
          <button class="btn small secondary" type="button" onclick="openNewPerformanceEditor()">+ 新增</button>
        </div>
      </div>
      <div class="form-compact-grid two performance-logic-row">
        ${showExecutionLogicField(stage)}
        ${currentScript().type === "导览" ? selectField("执行时机", stage.executionTiming || "到达后执行", ["到达后执行", "移动中执行"], `updateStageField('${stage.id}', 'executionTiming', this.value)`) : ""}
      </div>
      <div class="bound-show-list">
        ${
          boundShows.length
            ? boundShows.map((show, index) => renderShowCard(show, index, stage)).join("")
            : `<div class="bound-show-empty"><button class="btn secondary small" type="button" onclick="openStageShowPicker()">绑定表演</button></div>`
        }
      </div>
      ${stageContentIssues(stage, boundShows).length ? `<div class="stage-content-issues">${stageContentIssues(stage, boundShows).map((issue) => `<span>${issue}</span>`).join("")}</div>` : ""}
    </section>
  `;
}

function renderShowCard(show, index, stage) {
  const units = showPreviewUnits(show, stage, index);
  const wait = stageShowWait(stage, show.id);
  const isHighlighted = String(show.id) === String(highlightedInlineShowId);
  return `
    <article class="perf-card ${isHighlighted ? "highlighted" : ""}"
      draggable="true"
      ondragstart="startStageShowDrag(${index})"
      ondragover="event.preventDefault()"
      ondrop="dropStageShow(${index})">
      <header class="perf-card-header">
        <div class="perf-card-drag" title="拖拽排序">⋮⋮</div>
        <div class="perf-card-info">
          <strong>${index + 1}. ${escapeHtml(show.name)}</strong>
          <span class="perf-card-meta">ID：${escapeHtml(show.id)} | 归属：${escapeHtml(show.owner)} | ${units.length} 个表演单元</span>
        </div>
        <label class="perf-card-wait">
          <span>表演后等待</span>
          <div class="number-field tiny">
            <input class="input" type="number" min="0" value="${wait}" oninput="updateStageShowWait('${stage.id}', '${show.id}', this.value)" /><em>秒</em>
          </div>
        </label>
        <div class="perf-card-actions">
          <button class="link" type="button" onclick="editShowInEditor('${escapeJs(String(show.id))}')">编辑</button>
          <button class="link danger" type="button" onclick="removeStageShow('${escapeJs(String(show.id))}')">解除</button>
        </div>
      </header>
      <div class="perf-unit-list">
        ${units.map((unit, unitIndex) => renderUnitCard(unit, index, unitIndex)).join("")}
      </div>
    </article>
  `;
}

function renderUnitCard(unit, showIndex, unitIndex) {
  return `
    <div class="perf-unit-card">
      <span class="perf-unit-index">${showIndex + 1}.${unitIndex + 1}</span>
      <div class="perf-unit-body">
        <div class="perf-unit-text">
          <span>表演文本</span>
          <strong>${escapeHtml(unit.text || unit.script || "未填写表演文本")}</strong>
        </div>
        <div class="perf-unit-meta-grid">
          <div class="perf-unit-meta"><span>动作</span><em>${escapeHtml(unit.action || "请选择动作")}</em></div>
          <div class="perf-unit-meta"><span>表情</span><em>${escapeHtml(unit.expression || "微笑")}</em></div>
          <div class="perf-unit-meta"><span>结束依据</span><em>${escapeHtml(unit.end || unit.endBy || "文本结束")}</em></div>
          <div class="perf-unit-meta"><span>执行次数</span><em>${escapeHtml(unit.repeat ?? 1)} 次</em></div>
          <div class="perf-unit-meta"><span>等待时长</span><em>${escapeHtml(unit.wait ?? 0)} 秒</em></div>
        </div>
      </div>
    </div>
  `;
}

function renderStageShowActions(show, index, stage) {
  const wait = stageShowWait(stage, show.id);
  return `
    <label class="perf-card-wait-inline">
      <span>表演后等待</span>
      <div class="number-field tiny"><input type="number" min="0" value="${wait}" oninput="updateStageShowWait('${stage.id}', '${show.id}', this.value)" /><em>秒</em></div>
    </label>
  `;
}

/* DEPRECATED: renderScriptEditorUnit replaced by renderUnitCard */
function renderScriptEditorUnit(unit, showIndex, unitIndex) {
  return renderUnitCard(unit, showIndex, unitIndex);
}

function stageContentStats(stage, boundShows) {
  const showCount = boundShows.length;
  const unitCount = boundShows.reduce((sum, show) => sum + Math.max(1, Number(show.units || 1)), 0);
  const waitTotal = boundShows.reduce((sum, show) => sum + Number(stageShowWait(stage, show.id) || 0), 0);
  const minutes = showCount ? Math.max(1, Math.ceil((unitCount * 40 + waitTotal) / 60)) : 0;
  return { showCount, unitCount, minutes };
}

function stageContentIssues(stage, boundShows) {
  const issues = [];
  if (!boundShows.length) issues.push("当前阶段还没有内容");
  if (currentScript().type === "直播" && selectedAnchorType === "commerce" && stageProductMode(stage) && !stageProductIds(stage).length) {
    issues.push("当前阶段未绑定适用商品");
  }
  const disabledCount = boundShows.filter((show) => !show.status).length;
  if (disabledCount) issues.push(`${disabledCount} 个表演处于停用状态`);
  return issues;
}

function stageShowPreviewUnits(show, index = 0) {
  const name = show.name || "未命名表演";
  const action = index % 2 ? "抬手讲解" : "点头讲解";
  return [`话术：${name.slice(0, 12)}`, `动作：${action}`, `音频：AI合成`];
}

function scriptUsedShows() {
  const allShows = allAvailableShows();
  const rows = [];
  currentStages().forEach((stage) => {
    stageBoundShowIds(stage).forEach((showId, index) => {
      const show = allShows.find((item) => String(item.id) === String(showId));
      if (!show) return;
      rows.push({
        show,
        stage,
        index,
        wait: stageShowWait(stage, show.id),
        issues: stageContentIssues(stage, [show]).filter((issue) => issue !== "当前阶段还没有内容"),
      });
    });
  });
  return rows;
}

function scriptContentStats() {
  const rows = scriptUsedShows();
  const usedIds = new Set(rows.map((row) => String(row.show.id)));
  const unitCount = rows.reduce((sum, row) => sum + Math.max(1, Number(row.show.units || 1)), 0);
  const issueStageCount = currentStages().filter((stage) => {
    const allShows = allAvailableShows();
    const boundShows = stageBoundShowIds(stage).map((id) => allShows.find((show) => String(show.id) === String(id))).filter(Boolean);
    return stageContentIssues(stage, boundShows).length;
  }).length;
  return { usedCount: usedIds.size, unitCount, issueStageCount, rowCount: rows.length };
}

function openScriptPreview(focusStageId = "") {
  const stages = currentStages();
  scriptPreviewState.mode = "timeline";
  scriptPreviewState.eventScenario = "none";
  scriptPreviewState.focusStageId = focusStageId || stages[0]?.id || selectedStageId || "";
  const steps = scriptPreviewSteps();
  const firstFocusedIndex = steps.findIndex((step) => step.stage.id === scriptPreviewState.focusStageId);
  if (focusStageId && firstFocusedIndex >= 0) scriptPreviewState.stepIndex = firstFocusedIndex;
  if (firstFocusedIndex < 0 && steps.length) scriptPreviewState.focusStageId = steps[0].stage.id;
  scriptPreviewState.stepIndex = clampPreviewStep(scriptPreviewState.stepIndex, steps);
  scriptFlowView = "preview";
  window.location.hash = "flow-preview";
  renderApp();
}

function closeScriptPreview() {
  scriptFlowView = "edit";
  window.location.hash = "flow-edit";
  renderApp();
}

function setupPreviewScrollLinkage() {
  const content = document.querySelector(".preview-main");
  const sidebar = document.querySelector(".preview-sidebar .preview-nav-list");
  if (!content || !sidebar) return;
  content.addEventListener("scroll", () => {
    const blocks = Array.from(content.querySelectorAll(".preview-stage-block[data-stage-id]"));
    if (!blocks.length) return;
    const contentRect = content.getBoundingClientRect();
    const activationLine = contentRect.top + Math.min(96, content.clientHeight * 0.18);
    const activeBlock = blocks.reduce((current, block) => {
      const marker = block.querySelector(".preview-show-list") || block;
      return marker.getBoundingClientRect().top <= activationLine ? block : current;
    }, blocks[0]);
    const stageId = activeBlock.dataset.stageId;
    if (!stageId || scriptPreviewState.focusStageId === stageId) return;
    scriptPreviewState.focusStageId = stageId;
    updatePreviewStageHighlight(stageId);
  });
}

function updatePreviewStageHighlight(stageId) {
  document.querySelectorAll(".preview-nav-item[data-stage-id]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.stageId === stageId);
  });
  const active = document.querySelector(`.preview-nav-item[data-stage-id="${stageId}"]`);
  active?.scrollIntoView({ block: "nearest" });
}

function scrollToPreviewStage(stageId) {
  const target = document.querySelector(`.preview-stage-block[data-stage-id="${cssEscape(stageId)}"]`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    scriptPreviewState.focusStageId = stageId;
    updatePreviewStageHighlight(stageId);
  }
}

function openScriptPreviewModal(focusStageId = "") {
  const stages = currentStages();
  scriptPreviewState.mode = "timeline";
  scriptPreviewState.eventScenario = "none";
  scriptPreviewState.focusStageId = focusStageId || stages[0]?.id || selectedStageId || "";
  const steps = scriptPreviewSteps();
  const firstFocusedIndex = steps.findIndex((step) => step.stage.id === scriptPreviewState.focusStageId);
  if (focusStageId && firstFocusedIndex >= 0) scriptPreviewState.stepIndex = firstFocusedIndex;
  if (firstFocusedIndex < 0 && steps.length) scriptPreviewState.focusStageId = steps[0].stage.id;
  scriptPreviewState.stepIndex = clampPreviewStep(scriptPreviewState.stepIndex, steps);
  scriptFlowView = "preview";
  window.location.hash = "flow-preview";
  renderApp();
}

function renderScriptPreviewPage() {
  const script = currentScript();
  const stages = currentStages();
  const stats = scriptContentStats();
  const focusId = scriptPreviewState.focusStageId || stages[0]?.id || "";
  return `<div class="flow-page script-preview-page">
    <div class="script-preview-page-head"><div><button class="link" type="button" onclick="closeScriptPreview()">‹ 返回脚本编辑</button><h1>整场脚本预览${handoffMark("脚本预览联动", "整场预览支持左侧阶段导航和右侧内容滚动双向联动，用于检查阶段、表演和表演单元是否完整。", "info")}</h1><p>所有阶段、资源、表演和表演单元默认展开，只读展示。左侧导航点击定位阶段，滚动右侧内容自动高亮左侧。</p></div><button class="btn" type="button" onclick="closeScriptPreview()">回到脚本编辑</button></div>
    <div class="script-modal-summary">
      <div><span>脚本</span><strong>${escapeHtml(script.name)}</strong></div><div><span>类型</span><strong>${escapeHtml(script.type)} / ${escapeHtml(anchorName(script.anchorType))}</strong></div><div><span>阶段</span><strong>${stages.length}</strong></div><div><span>预计时长</span><strong>${Math.max(1, Math.ceil(stats.unitCount * 40 / 60))} 分钟</strong></div><div><span>执行单元</span><strong>${stats.unitCount}</strong></div>
    </div>
    <div class="preview-workbench" id="previewWorkbench">
      <div class="preview-sidebar">
        <div class="preview-sidebar-title"><strong>阶段导航</strong><span>${stages.length} 个阶段</span></div>
        <div class="preview-nav-list">${stages.map((stage, index) => `
          <button class="preview-nav-item ${stage.id === focusId ? "active" : ""}" type="button" data-stage-id="${stage.id}" onclick="scrollToPreviewStage('${escapeJs(stage.id)}')">
            <strong>${index + 1}. ${escapeHtml(stage.name || "未命名阶段")}</strong>
            <span>${stageBoundShowIds(stage).length} 个表演</span>
            <em>${stage.type || "普通流程"}</em>
          </button>
        `).join("")}</div>
      </div>
      <div class="preview-main" data-mode="timeline" onscroll="syncScriptPreviewStageFromScroll(this)">
        ${stages.map((stage, index) => renderPreviewStageBlock(stage, index, stage.id === focusId)).join("")}
      </div>
    </div>
    <script>requestAnimationFrame(() => setupPreviewScrollLinkage())</script>
  </div>`;
}

function returnFromScriptPreview() {
  closeScriptPreview();
}

function renderScriptPreviewModal() {
  const script = currentScript();
  const stages = currentStages();
  const stats = scriptContentStats();
  const steps = scriptPreviewSteps();
  const currentStep = steps[scriptPreviewState.stepIndex] || steps[0];
  const focusId = scriptPreviewState.focusStageId || currentStep?.stage.id || selectedStageId || stages[0]?.id || "";
  const issues = scriptPreviewIssues();
  const currentStageIndex = stages.findIndex((stage) => stage.id === focusId);
  openModal(`
    <div class="modal xlarge script-preview-modal">
      <div class="modal-header">
        <div class="modal-title">整场脚本预览</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="script-modal-summary">
          <div><span>脚本</span><strong>${escapeHtml(script.name)}</strong></div>
          <div><span>类型</span><strong>${escapeHtml(script.type)} / ${escapeHtml(anchorName(script.anchorType))}</strong></div>
          <div><span>阶段</span><strong>${stages.length}</strong></div>
          <div><span>预计时长</span><strong>${Math.max(1, Math.ceil(stats.unitCount * 40 / 60))} 分钟</strong></div>
          <div><span>执行单元</span><strong>${steps.length}</strong></div>
        </div>
        <div class="script-preview-controls">
          <div class="preview-mode-switch">
            ${previewModeButton("timeline", "流程总览")}
            ${previewModeButton("run", "运行模拟")}
            ${previewModeButton("checks", "发布检查")}
          </div>
          <label class="preview-event-select">模拟事件
            <select class="select" onchange="setScriptPreviewEvent(this.value)">
              ${previewEventScenarios().map((item) => `<option value="${item.id}" ${item.id === scriptPreviewState.eventScenario ? "selected" : ""}>${item.name}</option>`).join("")}
            </select>
          </label>
          <div class="preview-step-actions">
            <button class="btn secondary small" type="button" onclick="shiftScriptPreviewStep(-1)">上一步</button>
            <button class="btn small" type="button" onclick="shiftScriptPreviewStep(1)">下一步</button>
          </div>
        </div>
        ${issues.length ? `<div class="preview-issue-strip">${issues.map((issue) => `<span>${escapeHtml(issue)}</span>`).join("")}</div>` : ""}
        <div class="script-preview-layout">
          <div class="preview-stage-nav">
            ${stages
              .map((stage, index) => renderPreviewStageNavButton(stage, index, focusId))
              .join("")}
          </div>
          <div class="preview-stage-content" data-mode="${scriptPreviewState.mode}" onscroll="syncScriptPreviewStageFromScroll(this)">
            ${scriptPreviewState.mode === "run" ? renderPreviewRunPanel(currentStep, currentStageIndex) : ""}
            ${scriptPreviewState.mode === "checks" ? renderPreviewChecksPanel(issues, steps) : ""}
            ${scriptPreviewState.mode === "timeline" ? stages.map((stage, index) => renderPreviewStageBlock(stage, index, stage.id === focusId)).join("") : ""}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">回到脚本编辑</button>
        <button class="btn" onclick="closeModal()">关闭预览</button>
      </div>
    </div>
  `);
}

function previewModeButton(mode, label) {
  return `<button class="${scriptPreviewState.mode === mode ? "active" : ""}" type="button" onclick="setScriptPreviewMode('${mode}')">${label}</button>`;
}

function renderPreviewStageNavButton(stage, index, focusId) {
  const showCount = stageBoundShowIds(stage).length;
  return `
    <button class="${stage.id === focusId ? "active" : ""}" type="button" data-stage-id="${stage.id}" onclick="focusScriptPreviewStage('${stage.id}')">
      <strong>${index + 1}. ${escapeHtml(stage.name || "未命名阶段")}</strong>
      <span>${showCount} 个表演 / ${stage.type || "普通流程"}</span>
      <em>${showCount ? "内容已展开" : "暂无表演"}</em>
    </button>
  `;
}

function renderPreviewStageBlock(stage, index, focused) {
  const allShows = allAvailableShows();
  const boundShows = stageBoundShowIds(stage).map((id) => allShows.find((show) => String(show.id) === String(id))).filter(Boolean);
  const productsInStage = stageProductIds(stage).map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const script = currentScript();
  const map = exhibitionMaps.find((item) => item.id === (script.mapId || selectedMapId));
  const mapLine = script.type === "导览" && map ? `<div class="preview-product-line"><span>地图：${escapeHtml(map.mapName)}</span><span>点位：${escapeHtml(stage.point || "AGV_HOME")}</span><span>执行时机：${escapeHtml(stage.executionTiming || "到达后执行")}</span></div>` : "";
  return `
    <section class="preview-stage-block ${focused ? "focused" : ""}" data-stage-id="${stage.id}">
      <div class="preview-stage-head">
        <div>
          <span>阶段 ${index + 1}</span>
          <strong>${escapeHtml(stage.name || "未命名阶段")}</strong>
        </div>
      </div>
      ${productsInStage.length ? `<div class="preview-product-line">${productsInStage.map((product) => `<span>${escapeHtml(product.image)} ${escapeHtml(product.title)}</span>`).join("")}</div>` : ""}
      ${mapLine}
      <div class="preview-show-list">
        ${
          boundShows.length
            ? boundShows.map((show, showIndex) => renderPreviewShowBlock(show, stage, showIndex)).join("")
            : `<div class="preview-empty">当前阶段没有表演内容</div>`
        }
      </div>
    </section>
  `;
}

function renderPreviewShowBlock(show, stage, index) {
  const wait = stageShowWait(stage, show.id);
  const units = showPreviewUnits(show, stage, index);
  return `
    <div class="preview-show-block">
      <div class="preview-show-title">
        <strong>${index + 1}. ${escapeHtml(show.name)}</strong>
        <span>${escapeHtml(show.owner)} / ${units.length} 单元${wait ? ` / 表演后等待 ${wait} 秒` : ""}</span>
      </div>
      <div class="preview-expanded-unit-list">
        ${units.map((unit, unitIndex) => renderPreviewUnitRow(unit, stage, show, index, unitIndex)).join("")}
      </div>
    </div>
  `;
}

function renderPreviewUnitRow(unit, stage, show, showIndex, unitIndex) {
  return `
    <div class="preview-unit-row">
      <div class="preview-unit-index">${showIndex + 1}.${unitIndex + 1}</div>
      <div class="preview-unit-script">
        <span>表演文本</span>
        <strong>${escapeHtml(unit.text || unit.script || "未填写表演文本")}</strong>
      </div>
      <div class="preview-unit-meta">
        <span>动作：${escapeHtml(unit.action || "请选择动作")}</span>
        <span>结束：${escapeHtml(unit.end || unit.endBy || "文本结束")}</span>
        <span>执行：${escapeHtml(unit.repeat ?? 1)} 次</span>
        <span>等待：${escapeHtml(unit.wait ?? 0)} 秒</span>
      </div>
    </div>
  `;
}

function showPreviewUnits(show, stage, showIndex = 0) {
  const explicitUnits = show.previewUnits || show.unitsData || show.performanceUnits || show.unitDetails;
  if (Array.isArray(explicitUnits) && explicitUnits.length) return explicitUnits.map(normalizePreviewUnit);
  const count = Math.max(1, Number(show.units || 1));
  return Array.from({ length: count }, (_, index) => fallbackPreviewUnit(show, stage, showIndex, index));
}

function normalizePreviewUnit(unit) {
  return {
    text: unit.text || unit.script || "",
    action: unit.action || unit.actionName || "请选择动作",
    end: unit.end || unit.endBy || "文本结束",
    repeat: unit.repeat ?? unit.count ?? 1,
    wait: unit.wait ?? unit.waitSeconds ?? 0,
  };
}

function fallbackPreviewUnit(show, stage, showIndex, unitIndex) {
  const sample = fallbackPerformanceUnits[(showIndex + unitIndex) % fallbackPerformanceUnits.length] || fallbackPerformanceUnits[0];
  const stageName = stage.name || "当前阶段";
  const showName = show.name || "未命名表演";
  return {
    text: unitIndex === 0 ? `${stageName}：${sample.script}` : `${showName} 第 ${unitIndex + 1} 个表演单元：${sample.script}`,
    action: sample.action || (unitIndex % 2 ? "抬手" : "点头"),
    end: sample.endBy || "文本结束",
    repeat: unitIndex === Math.max(1, Number(show.units || 1)) - 1 ? 1 : sample.repeat || 1,
    wait: unitIndex === Math.max(1, Number(show.units || 1)) - 1 ? stageShowWait(stage, show.id) : sample.wait || 0,
  };
}

function scriptPreviewSteps() {
  const allShows = allAvailableShows();
  const steps = [];
  currentStages().forEach((stage, stageIndex) => {
    const boundShows = stageBoundShowIds(stage).map((id) => allShows.find((show) => String(show.id) === String(id))).filter(Boolean);
    if (!boundShows.length) {
      return;
    }
    boundShows.forEach((show, showIndex) => {
      const wait = stageShowWait(stage, show.id);
      showPreviewUnits(show, stage, showIndex).forEach((unit, unitIndex) => {
        steps.push({
          stage,
          stageIndex,
          show,
          showIndex,
          unit,
          unitIndex,
          title: `${show.name} / 单元 ${unitIndex + 1}`,
          description: unit.text || unit.script || "未填写表演文本",
          meta: `${stage.name || "未命名阶段"} / ${showPreviewUnits(show, stage, showIndex).length} 单元${wait ? ` / 表演后等待 ${wait} 秒` : ""}`,
        });
      });
    });
  });
  return steps;
}

function scriptPreviewIssues() {
  return currentStages().flatMap((stage) => previewStageIssues(stage).map((issue) => `${stage.name || "未命名阶段"}：${issue}`));
}

function previewStageIssues(stage) {
  const allShows = allAvailableShows();
  const boundShows = stageBoundShowIds(stage).map((id) => allShows.find((show) => String(show.id) === String(id))).filter(Boolean);
  return stageContentIssues(stage, boundShows);
}

function previewStepIndexForShow(stageId, showId) {
  const index = scriptPreviewSteps().findIndex((step) => step.stage.id === stageId && String(step.show?.id || "") === String(showId));
  return Math.max(0, index);
}

function previewStepIndexForUnit(stageId, showId, unitIndex) {
  const index = scriptPreviewSteps().findIndex((step) => step.stage.id === stageId && String(step.show?.id || "") === String(showId) && Number(step.unitIndex) === Number(unitIndex));
  return Math.max(0, index);
}

function clampPreviewStep(index, steps = scriptPreviewSteps()) {
  if (!steps.length) return 0;
  return Math.min(Math.max(0, Number(index) || 0), steps.length - 1);
}

function setScriptPreviewMode(mode) {
  scriptPreviewState.mode = mode;
  if (mode === "timeline") scriptPreviewState.focusStageId = currentStages()[0]?.id || "";
  renderScriptPreviewModal();
}

function setScriptPreviewEvent(eventScenario) {
  scriptPreviewState.eventScenario = eventScenario;
  if (eventScenario !== "none") scriptPreviewState.mode = "run";
  renderScriptPreviewModal();
}

function setScriptPreviewStep(index) {
  const steps = scriptPreviewSteps();
  scriptPreviewState.stepIndex = clampPreviewStep(index, steps);
  scriptPreviewState.focusStageId = steps[scriptPreviewState.stepIndex]?.stage.id || scriptPreviewState.focusStageId;
  renderScriptPreviewModal();
}

function shiftScriptPreviewStep(delta) {
  setScriptPreviewStep(scriptPreviewState.stepIndex + delta);
}

function focusScriptPreviewStage(stageId) {
  scriptPreviewState.focusStageId = stageId;
  const modal = document.querySelector(".script-preview-modal");
  const content = modal?.querySelector(".preview-stage-content");
  const target = modal?.querySelector(`.preview-stage-block[data-stage-id="${cssEscape(stageId)}"]`);
  if (scriptPreviewState.mode === "timeline" && content && target) {
    setScriptPreviewNavFocus(stageId);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const index = scriptPreviewSteps().findIndex((step) => step.stage.id === stageId);
  if (index >= 0) scriptPreviewState.stepIndex = index;
  if (scriptFlowView === "preview") renderApp();
  else renderScriptPreviewModal();
}

function syncScriptPreviewStageFromScroll(container) {
  if (!container || container.dataset.mode !== "timeline") return;
  const blocks = Array.from(container.querySelectorAll(".preview-stage-block[data-stage-id]"));
  if (!blocks.length) return;
  const reachedBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 8;
  const containerRect = container.getBoundingClientRect();
  const activationLine = containerRect.top + Math.min(96, container.clientHeight * 0.18);
  const activeBlock = reachedBottom
    ? blocks[blocks.length - 1]
    : blocks.reduce((current, block) => {
        const marker = block.querySelector(".preview-show-list") || block;
        return marker.getBoundingClientRect().top <= activationLine ? block : current;
      }, blocks[0]);
  const stageId = activeBlock.dataset.stageId;
  if (!stageId || scriptPreviewState.focusStageId === stageId) return;
  scriptPreviewState.focusStageId = stageId;
  updatePreviewStageHighlight(stageId);
}

function setScriptPreviewNavFocus(stageId) {
  const modal = document.querySelector(".script-preview-modal");
  if (!modal) return;
  modal.querySelectorAll(".preview-stage-nav button[data-stage-id]").forEach((button) => {
    button.classList.toggle("active", button.dataset.stageId === stageId);
  });
  modal.querySelectorAll(".preview-stage-block[data-stage-id]").forEach((block) => {
    block.classList.toggle("focused", block.dataset.stageId === stageId);
  });
  const activeButton = modal.querySelector(`.preview-stage-nav button[data-stage-id="${cssEscape(stageId)}"]`);
  activeButton?.scrollIntoView({ block: "nearest" });
}

function cssEscape(value) {
  if (typeof CSS !== "undefined" && CSS.escape) return CSS.escape(String(value));
  return String(value).replace(/["\\]/g, "\\$&");
}

function previewEventScenarios() {
  return [
    { id: "none", name: "无事件", input: "按主流程连续执行。", handling: "不会插队，当前阶段播完后进入下一阶段。", recovery: "继续主流程" },
    { id: "comment", name: "普通弹幕咨询", input: "观众问：这个适合小户型吗？", handling: "进入互动或 FAQ 承接，低风险答案可自动播报。", recovery: "播完回复后回到被打断节点" },
    { id: "risk", name: "价格承诺风险", input: "观众问：是不是全网最低价？", handling: "停止自动承诺，标记中高风险，等待人工确认口径。", recovery: "人工确认后恢复当前商品讲解" },
    { id: "manual", name: "人工触发流程", input: "运营在控制台点击：立即讲解主推商品。", handling: "实时控制台插队触发指定阶段或表演，不改模板顺序。", recovery: "执行完成后回到主循环" },
    { id: "gift", name: "礼物 / 关注反馈", input: "用户关注或送出礼物。", handling: "触发感谢表演；若当前为高风险话术，先完成安全转场。", recovery: "短反馈后继续当前阶段" },
    { id: "offline", name: "线下语音打断", input: "现场人员对机器人说：先停一下。", handling: "停止当前播报，进入人工接管或线下互动阶段。", recovery: "人工点击恢复后从指定节点继续" },
  ];
}

function currentPreviewEvent() {
  return previewEventScenarios().find((item) => item.id === scriptPreviewState.eventScenario) || previewEventScenarios()[0];
}

function renderPreviewEventPanel() {
  const event = currentPreviewEvent();
  return `
    <section class="preview-event-panel ${event.id === "none" ? "idle" : "active"}">
      <div>
        <span>事件模拟</span>
        <strong>${escapeHtml(event.name)}</strong>
      </div>
      <p>${escapeHtml(event.input)}</p>
      <p><b>处理：</b>${escapeHtml(event.handling)}</p>
      <p><b>恢复：</b>${escapeHtml(event.recovery)}</p>
    </section>
  `;
}

function renderPreviewRunPanel(step, stageIndex) {
  if (!step) return `<section class="preview-player-card"><strong>暂无可预览步骤</strong></section>`;
  const steps = scriptPreviewSteps();
  const nextSteps = steps.slice(scriptPreviewState.stepIndex + 1, scriptPreviewState.stepIndex + 4);
  const stage = step.stage;
  const productsInStage = stageProductIds(stage).map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const visibleStageIndex = Number.isFinite(stageIndex) && stageIndex >= 0 ? stageIndex : step.stageIndex || 0;
  return `
    <section class="preview-player-card">
      <div class="preview-player-head">
        <div>
          <span>正在预览 ${scriptPreviewState.stepIndex + 1}/${steps.length}</span>
          <strong>${escapeHtml(step.title)}</strong>
        </div>
        <span class="mini-tag ${previewStageIssues(stage).length ? "orange" : "green"}">${previewStageIssues(stage).length ? "需检查" : "可发布"}</span>
      </div>
      <div class="preview-current-grid">
        <div><span>阶段</span><strong>${visibleStageIndex + 1}. ${escapeHtml(stage.name || "未命名阶段")}</strong></div>
        <div><span>表演</span><strong>${escapeHtml(step.show?.name || step.title)}</strong></div>
        <div><span>单元</span><strong>${step.show ? `第 ${Number(step.unitIndex || 0) + 1} 个表演单元` : "阶段占位"}</strong></div>
        <div><span>类型</span><strong>${escapeHtml(stage.type || "普通流程")}</strong></div>
      </div>
      ${productsInStage.length ? `<div class="preview-product-line compact">${productsInStage.map((product) => `<span>${escapeHtml(product.image)} ${escapeHtml(product.title)}</span>`).join("")}</div>` : ""}
      <div class="preview-script-text">
        <span>实际执行文本</span>
        <strong>${escapeHtml(step.description)}</strong>
        ${
          step.unit
            ? `<em>动作：${escapeHtml(step.unit.action || "请选择动作")}　结束：${escapeHtml(step.unit.end || "文本结束")}　执行：${escapeHtml(step.unit.repeat ?? 1)} 次　等待：${escapeHtml(step.unit.wait ?? 0)} 秒</em>`
            : `<em>${escapeHtml(currentPreviewEvent().recovery)}</em>`
        }
      </div>
      <div class="preview-next-queue">
        <strong>后续队列</strong>
        ${nextSteps.length ? nextSteps.map((item, index) => `<button type="button" onclick="setScriptPreviewStep(${scriptPreviewState.stepIndex + index + 1})">${scriptPreviewState.stepIndex + index + 2}. ${escapeHtml(item.title)}</button>`).join("") : "<span>已到流程末尾</span>"}
      </div>
    </section>
  `;
}

function renderPreviewChecksPanel(issues, steps) {
  const stageCount = currentStages().length;
  const contentStages = currentStages().filter((stage) => stageBoundShowIds(stage).length).length;
  const productsCovered = currentStages().filter((stage) => stageProductIds(stage).length).length;
  const event = currentPreviewEvent();
  const cards = [
    { label: "阶段内容覆盖", value: `${contentStages}/${stageCount}`, status: contentStages === stageCount ? "通过" : "需补齐", tone: contentStages === stageCount ? "green" : "orange" },
    { label: "商品绑定覆盖", value: `${productsCovered} 个阶段`, status: selectedAnchorType === "commerce" ? "需关注" : "非带货", tone: selectedAnchorType === "commerce" && productsCovered < 1 ? "orange" : "green" },
    { label: "执行单元", value: `${steps.length} 个`, status: steps.length ? "可预览" : "无单元", tone: steps.length ? "green" : "orange" },
    { label: "事件恢复", value: event.recovery, status: event.id === "none" ? "未模拟" : "已模拟", tone: event.id === "none" ? "gray" : "blue" },
  ];
  return `
    <section class="preview-check-panel">
      <div class="preview-check-grid">
        ${cards.map((card) => `<div class="preview-check-card"><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong><em class="${card.tone}">${escapeHtml(card.status)}</em></div>`).join("")}
      </div>
      <div class="preview-check-list">
        <strong>发布前检查项</strong>
        ${
          issues.length
            ? issues.map((issue) => `<button type="button" onclick="focusScriptPreviewStage('${escapeJs(currentStages().find((stage) => issue.startsWith(stage.name || "未命名阶段"))?.id || currentStages()[0]?.id || "")}')">${escapeHtml(issue)}</button>`).join("")
            : "<span>当前脚本主要内容检查通过，可以进入开播检查。</span>"
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
  const robot = scriptTargetRobot(script);
  if (robot && robot.version !== "AGV机器人") {
    toast(`${robot.version}不支持导览脚本或地图`);
    return;
  }
  if (!scriptMapPickerBackup || scriptMapPickerBackup.scriptId !== script.id) {
    scriptMapPickerBackup = { scriptId: script.id, mapId: script.mapId || "", selectedMapId };
  }
  const visibleMaps = visibleChannelResources(exhibitionMaps, "maps");
  openModal(`
    <div class="modal medium">
      <div class="modal-header"><div class="modal-title">关联地图</div><button class="modal-close" onclick="cancelScriptMapPicker()">×</button></div>
      <div class="modal-body">
        <div class="table-wrap">
          <table class="data-table compact-table">
            <thead><tr><th>选择</th><th>地图名称</th><th>展馆名称</th><th>展览名称</th><th>点位数</th></tr></thead>
            <tbody>${visibleMaps.map((map) => `<tr onclick="selectScriptMap('${map.id}')"><td><input type="radio" ${script.mapId === map.id ? "checked" : ""} /></td><td>${map.mapName}</td><td>${map.venueName}</td><td>${map.exhibitionName}</td><td>${map.points.length}</td></tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="cancelScriptMapPicker()">取消</button><button class="btn" onclick="confirmScriptMapPicker()">确定</button></div>
    </div>
  `);
}

function selectScriptMap(mapId) {
  currentScript().mapId = mapId;
  selectedMapId = mapId;
  toast("地图已关联，阶段点位列表已更新");
  openScriptMapPicker();
}

function cancelScriptMapPicker() {
  if (scriptMapPickerBackup) {
    const script = scriptFlowScripts.find((item) => item.id === scriptMapPickerBackup.scriptId);
    if (script) script.mapId = scriptMapPickerBackup.mapId;
    selectedMapId = scriptMapPickerBackup.selectedMapId;
    scriptMapPickerBackup = null;
  }
  closeModal();
  renderApp();
}

function confirmScriptMapPicker() {
  scriptMapPickerBackup = null;
  closeModal();
  renderApp();
}

function renderRobotPage() {
  const keyword = robotFilters.keyword.trim().toLowerCase();
  const showAdvancedConfig = canShowAdvancedRobotConfig();
  const visibleRobots = visibleChannelResources(robots, "robots")
    .filter((robot) => !keyword || [robot.id, robot.name].join(" ").toLowerCase().includes(keyword))
    .filter((robot) => robotFilters.mode === "机器人类型" || robot.mode === robotFilters.mode)
    .filter((robot) => robotFilters.status === "状态" || robot.status === robotFilters.status);
  return `
    <div class="toolbar">
      <div class="filters">
        <input class="input w-180" value="${escapeHtml(robotFilters.keyword)}" placeholder="机器人ID/名称" oninput="setRobotFilter('keyword', this.value)" />
        <select class="select w-120" onchange="setRobotFilter('mode', this.value)">${["机器人类型", "直播", "表演", "AGV", "导览"].map((value) => `<option ${robotFilters.mode === value ? "selected" : ""}>${value}</option>`).join("")}</select>
        <select class="select w-120"><option>场景类型</option><option>聊天</option><option>电商</option></select>
        <select class="select w-120" onchange="setRobotFilter('status', this.value)">${["状态", "正常", "异常"].map((value) => `<option ${robotFilters.status === value ? "selected" : ""}>${value}</option>`).join("")}</select>
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
            ${showAdvancedConfig ? "<th>大模型</th>" : ""}
            <th>版本</th>
            <th>直播话术</th>
            <th>关键词回复话术</th>
            <th>是否启用</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${visibleRobots
            .map(
              (robot) => `
              <tr>
                <td><button class="link" type="button" onclick="openRobotEditor('${robot.id}', 'role')">${robot.id}</button></td>
                <td><span class="tag">${robot.mode}</span></td>
                <td><div class="avatar-img ${robot.avatarClass}">${robot.avatar}</div></td>
                <td><strong>${robot.name}</strong></td>
                <td><span class="tag ${robot.status === "正常" ? "green" : "red"}">${robot.status}</span><br /><button class="link" onclick="openRobotEditor('${robot.id}', 'role')">查看详情</button></td>
                <td>${robot.voice}　🎧</td>
                ${showAdvancedConfig ? `<td>${robot.model}</td>` : ""}
                <td>${robot.version}<br /><span class="mini-tag gray">${robot.year || "2026"}</span></td>
                <td>${robot.scripts}组<br /><button class="btn secondary small" onclick="openRobotEditor('${robot.id}', 'scripts')">设置</button></td>
                <td>${robot.keywords}组<br /><button class="btn ${robot.keywords ? "" : "secondary"} small">${robot.keywords ? "修改" : "设置"}</button></td>
                <td><span class="switch on"></span></td>
                <td class="nowrap robot-actions">
                  <button class="link" type="button" onclick="toast('已打开绑定用户')">绑定用户</button>
                  <details class="more-menu">
                    <summary>更多</summary>
                    <div class="more-menu-panel">
                      <button type="button" onclick="openRobotEditor('${robot.id}', 'role')">编辑</button>
                      <button type="button" onclick="openRobotEditor('${robot.id}', 'role')">查看详情</button>
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

function setRobotFilter(key, value) {
  robotFilters[key] = value;
  renderApp();
}

function openBatchCreateRobot() {
  batchRobotPreview = null;
  batchRobotResult = null;
  const fieldGroups = robotBatchFieldGroupsForCurrentChannel();
  const templateScopeText = canShowAdvancedRobotConfig()
    ? "人设、头像、语种、音色、大模型、硬件、售卖租赁、运行、交互和动作配置"
    : "人设、头像、语种、音色、硬件、运行、交互和动作配置";
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
            <p>模板字段覆盖当前创建机器人弹窗中的${templateScopeText}。导入对象统一叫机器人。</p>
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
            ${fieldGroups
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
  const invalidRow = {
    ...buildTemplateSampleRow(),
    "机器人名称": "",
    "机器人编码": "RBT201",
    "方形头像": "",
    "话术间隔": "abc",
  };
  if (canShowAdvancedRobotConfig()) invalidRow["大模型厂商"] = "未知模型";
  batchRobotPreview = buildRobotImportPreview([
    buildTemplateSampleRow(),
    {
      ...buildTemplateSampleRow(),
      "机器人名称": "小暖",
      "机器人编码": "142",
      "应用场景": "情感陪伴",
      "选择音色": "637-干练的播客主持人（普通话）",
    },
    invalidRow,
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
  const showAdvancedConfig = canShowAdvancedRobotConfig();
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
              ${showAdvancedConfig ? "<th>大模型</th>" : ""}
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
                    ${showAdvancedConfig ? `<td>${escapeHtml(item.row["大模型厂商"] || "-")}</td>` : ""}
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
  if (canShowAdvancedRobotConfig() && cleanCell(row["大模型厂商"]) === "百炼" && !cleanCell(row["绑定智能体"])) {
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
  return robotBatchFieldGroupsForCurrentChannel().flatMap((group) => group.fields.map((field) => ({ ...field, group: group.group })));
}

function robotBatchFieldGroupsForCurrentChannel() {
  if (canShowAdvancedRobotConfig()) return robotBatchFieldGroups;
  return robotBatchFieldGroups.filter((group) => !customerHiddenRobotBatchGroups.has(group.group));
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
  const keyword = skillFilters.keyword.trim().toLowerCase();
  const visibleSkills = visibleChannelResources(skills, "skills", "id", resourceChannelFilterValue(skillFilters))
    .filter((skill) => !keyword || [skill.id, skill.name, skill.trigger].join(" ").toLowerCase().includes(keyword))
    .filter((skill) => skillFilters.category === "类型" || skill.category === skillFilters.category);
  return `
    <div class="toolbar">
      <div class="filters">
        ${resourceChannelFilterHtml(skillFilters, "setSkillFilter")}
        <input class="input w-180" value="${escapeHtml(skillFilters.keyword)}" placeholder="ID/名称" oninput="setSkillFilter('keyword', this.value)" />
        <select class="select w-120" onchange="setSkillFilter('category', this.value)">${["类型", "动作", "表演", "视觉"].map((value) => `<option ${skillFilters.category === value ? "selected" : ""}>${value}</option>`).join("")}</select>
        <button class="btn" onclick="toast('已查询技能')">查询</button>
      </div>
      <div class="filters">
        <button class="btn" onclick="openSkillModal()">新增技能</button>
        ${isPlatformChannel() ? `<button class="btn" onclick="openBatchModal('skills')">批量下发</button>` : ""}
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
          ${visibleSkills
            .map((skill) => {
              const readonly = resourceIsReadonlyDistribution("skills", skill);
              return `
              <tr>
                <td>${skill.id}</td>
                <td class="left"><strong>${skill.name}</strong> ${distributedResourceTag("skills", skill)}</td>
                <td>${skill.category}</td>
                <td>${skill.owner}</td>
                <td><span class="tag">${skill.trigger}</span></td>
                <td><span class="tag">${skill.result}</span></td>
                <td><button class="switch-button ${skill.status ? "on" : ""}" type="button" onclick="toggleSkillStatus('${escapeJs(skill.id)}')"><span></span></button></td>
                <td>${skill.created}</td>
                <td>${readonly ? '<span class="readonly-resource-note">已下发 · 只读</span>' : `<button class="link" onclick="openSkillModal('${skill.name}')">编辑</button> | <button class="link danger" onclick="deleteSkill('${escapeJs(skill.id)}')">删除</button>`}</td>
              </tr>
            `;
            })
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

function setSkillFilter(key, value) {
  skillFilters[key] = value;
  renderApp();
}

function toggleSkillStatus(id) {
  const skill = skills.find((item) => String(item.id) === String(id));
  if (!skill) return;
  skill.status = !skill.status;
  toast(skill.status ? "技能已启用" : "技能已停用");
  renderApp();
}

function deleteSkill(id) {
  const index = skills.findIndex((item) => String(item.id) === String(id));
  if (index >= 0) skills.splice(index, 1);
  robots.forEach((robot) => { robot.skillIds = (robot.skillIds || []).filter((item) => String(item) !== String(id)); });
  toast("技能已删除");
  renderApp();
}

function renderShowPage() {
  const keyword = showFilters.keyword.trim().toLowerCase();
  const publicShows = visibleChannelResources(shows.filter((show) => show.owner === "公共模板"), "shows", "id", resourceChannelFilterValue(showFilters))
    .filter((show) => !keyword || [show.id, show.name].join(" ").toLowerCase().includes(keyword))
    .filter((show) => showFilters.status === "状态" || (showFilters.status === "启用" ? show.status : !show.status));
  return `
    <div class="toolbar">
      <div class="filters">
        ${resourceChannelFilterHtml(showFilters, "setShowFilter")}
        <input class="input w-220" value="${escapeHtml(showFilters.keyword)}" placeholder="⌕ ID/表演名称/用户昵称" oninput="setShowFilter('keyword', this.value)" />
        <select class="select w-180"><option>公共模板</option></select>
        <select class="select w-180" onchange="setShowFilter('status', this.value)">${["状态", "启用", "停用"].map((value) => `<option ${showFilters.status === value ? "selected" : ""}>${value}</option>`).join("")}</select>
        <button class="btn" onclick="toast('已查询表演')">查询</button>
        ${isPlatformChannel() ? `<button class="btn" onclick="openBatchModal('shows')">批量下发</button>` : ""}
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
            .map((show) => {
              const readonly = resourceIsReadonlyDistribution("shows", show);
              return `
              <tr>
                <td>${show.id}</td>
                <td class="left"><strong>${show.name}</strong> ${distributedResourceTag("shows", show)}</td>
                <td>${show.owner}</td>
                <td>${show.units}</td>
                <td><button class="switch-button ${show.status ? "on" : ""}" type="button" onclick="toggleShowStatus('${escapeJs(show.id)}')"><span></span></button></td>
                <td>${show.created}</td>
                <td>${readonly ? '<span class="readonly-resource-note">已下发 · 只读</span>' : `<button class="link" onclick="openShowModal('${show.name}', true)">编辑</button> | <button class="link danger" onclick="deleteShow('${escapeJs(show.id)}')">删除</button>`}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
    ${pagination(141, 8)}
  `;
}

function setShowFilter(key, value) {
  showFilters[key] = value;
  renderApp();
}

function toggleShowStatus(id) {
  const show = shows.find((item) => String(item.id) === String(id));
  if (!show) return;
  show.status = !show.status;
  toast(show.status ? "表演已启用" : "表演已停用");
  renderApp();
}

function deleteShow(id) {
  const index = shows.findIndex((item) => String(item.id) === String(id));
  if (index >= 0) shows.splice(index, 1);
  robots.forEach((robot) => {
    robot.showIds = (robot.showIds || []).filter((item) => String(item) !== String(id));
    robot.idleShowIds = (robot.idleShowIds || []).filter((item) => String(item) !== String(id));
  });
  toast("表演已删除");
  renderApp();
}

function pagination(total, last) {
  const key = activePage;
  const state = paginationState[key] || { page: 1, pageSize: 10 };
  const pageCount = Math.max(1, Math.ceil(total / state.pageSize));
  state.page = Math.min(Math.max(1, state.page), pageCount);
  paginationState[key] = state;
  const pages = Array.from({ length: Math.min(pageCount, 6) }, (_, index) => index + 1);
  return `
    <div class="pagination">
      <span>共 ${total} 条</span>
      <select class="select w-120" onchange="setPaginationPageSize('${key}', this.value)">${[10, 20, 50].map((size) => `<option value="${size}" ${state.pageSize === size ? "selected" : ""}>${size}条/页</option>`).join("")}</select>
      <button class="page-box" type="button" ${state.page <= 1 ? "disabled" : ""} onclick="setPaginationPage('${key}', ${state.page - 1})">‹</button>
      ${pages.map((page) => `<button class="page-box ${state.page === page ? "active" : ""}" type="button" onclick="setPaginationPage('${key}', ${page})">${page}</button>`).join("")}
      ${pageCount > 6 ? `<span>...</span><button class="page-box ${state.page === pageCount ? "active" : ""}" type="button" onclick="setPaginationPage('${key}', ${pageCount})">${pageCount}</button>` : ""}
      <button class="page-box" type="button" ${state.page >= pageCount ? "disabled" : ""} onclick="setPaginationPage('${key}', ${state.page + 1})">›</button>
      <span>前往</span>
      <input class="input" style="width:48px;height:30px;" value="${state.page}" onkeydown="if(event.key==='Enter')setPaginationPage('${key}', this.value)" />
      <span>页</span>
    </div>
  `;
}

function setPaginationPage(key, value) {
  const state = paginationState[key] || { page: 1, pageSize: 10 };
  state.page = Math.max(1, Number(value) || 1);
  paginationState[key] = state;
  renderApp();
}

function setPaginationPageSize(key, value) {
  paginationState[key] = { page: 1, pageSize: Number(value) || 10 };
  renderApp();
}

function renderActionPage() {
  return `
    <div class="library-tabs">
      <button class="library-tab ${actionManagerTab === "single" ? "active" : ""}" onclick="actionManagerTab='single';renderApp()">单一动作</button>
      <button class="library-tab ${actionManagerTab === "group" ? "active" : ""}" onclick="actionManagerTab='group';renderApp()">多动作组合</button>
    </div>
    ${actionManagerTab === "single" ? renderSingleActionList() : renderActionGroupList()}
  `;
}

function renderSingleActionList() {
  const visibleActions = visiblePlatformActions({ filters: singleActionFilters, channelId: resourceChannelFilterValue(singleActionFilters) });
  const platform = isPlatformChannel();
  return `
    <div class="toolbar">
      <div class="filters">
        ${resourceChannelFilterHtml(singleActionFilters, "setSingleActionFilter")}
        <input class="input w-220" value="${escapeHtml(singleActionFilters.keyword)}" placeholder="ID/动作名称" oninput="setSingleActionFilter('keyword', this.value)" />
        <select class="select w-150" onchange="setSingleActionFilter('type', this.value)">${["全部类型", "站姿", "坐姿", "站坐通用"].map((value) => `<option ${singleActionFilters.type === value ? "selected" : ""}>${value}</option>`).join("")}</select>
        <select class="select w-150" onchange="setSingleActionFilter('posture', this.value)">${["全部姿态", "站姿", "坐姿", "站坐通用"].map((value) => `<option ${singleActionFilters.posture === value ? "selected" : ""}>${value}</option>`).join("")}</select>
        <button class="btn" onclick="toast('已按条件查询平台动作')">查询</button>
      </div>
      ${platform
        ? `<div class="toolbar-actions"><button class="btn" onclick="openActionModal()">＋ 新增动作</button><button class="btn secondary" onclick="openBatchModal('actions')">批量下发</button>${handoffMark("单一动作平台维护", "单一动作属于平台下发资源，微视中国可新增、编辑、删除、启停和批量下发；客户渠道只能查看、搜索、筛选和引用。", "changed")}${handoffMark("批量下发范围", "资源大库的批量下发支持技能、表演、单一动作、动作组、素材、人脸等资源；本期重点是单一动作。", "new")}</div>`
        : `<span class="readonly-resource-note">平台下发 · 只读资源${handoffMark("客户侧单一动作只读", "客户侧不展示单一动作新增、编辑、删除、上传、批量下发、状态开关和操作列；机器人详情中只能添加引用，不能改写资源本体。", "info")}</span>`}
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>序号</th><th>动作ID</th><th>动作名称</th><th>动作类型</th><th>动作描述</th><th>适用姿态</th><th>动作时长</th><th>状态</th>${platform ? "<th>操作</th>" : ""}</tr></thead>
        <tbody>
          ${visibleActions.map((action) => `
            <tr>
              <td>${action.seq || "-"}</td>
              <td class="break-word">${action.id}</td>
              <td><strong>${action.name}</strong></td>
              <td>${action.type || action.posture}</td>
              <td>${action.desc || ""}</td>
              <td>${action.posture}</td>
              <td>${action.duration}s</td>
              <td><button class="switch-button ${action.status ? "on" : ""}" ${platform ? `onclick="toggleActionStatus('${escapeJs(action.id)}')"` : "disabled"}><span></span></button></td>
              ${platform ? `<td class="nowrap"><button class="link" onclick="openActionModal('${escapeJs(action.id)}')">编辑</button> | <button class="link danger" onclick="deleteAction('${escapeJs(action.id)}')">删除</button></td>` : ""}
            </tr>
          `).join("")}
          ${visibleActions.length ? "" : `<tr><td colspan="${platform ? 9 : 8}">暂无符合条件的动作</td></tr>`}
        </tbody>
      </table>
    </div>
    ${pagination(visibleActions.length, 7)}
  `;
}

function setSingleActionFilter(key, value) {
  singleActionFilters[key] = value;
  renderApp();
}

function renderActionGroupList() {
  const keyword = actionGroupFilters.keyword.trim().toLowerCase();
  const visibleGroups = visibleChannelResources(actionGroups, "actionGroups", "id", resourceChannelFilterValue(actionGroupFilters))
    .filter((group) => !keyword || [group.id, group.name, group.desc].join(" ").toLowerCase().includes(keyword))
    .filter((group) => actionGroupFilters.type === "动作类型" || (group.type || group.posture) === actionGroupFilters.type);
  return `
    <div class="toolbar">
      <div class="filters">
        ${resourceChannelFilterHtml(actionGroupFilters, "setActionGroupFilter")}
        <input class="input w-220" value="${escapeHtml(actionGroupFilters.keyword)}" placeholder="ID/动作组名称" oninput="setActionGroupFilter('keyword', this.value)" />
        <select class="select w-150" onchange="setActionGroupFilter('type', this.value)">${["动作类型", "站姿", "坐姿", "站坐通用"].map((value) => `<option ${actionGroupFilters.type === value ? "selected" : ""}>${value}</option>`).join("")}</select>
        <button class="btn" onclick="openActionGroupModal()">＋ 新增动作组</button>${handoffMark("多动作组合编排", "动作管理保留多动作组合的新增、编辑、删除、排序和时间间隔配置，用于把平台单一动作编排成可复用组合。", "new")}
      </div>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>动作组ID</th><th>动作组名称</th><th>动作组描述</th><th>适用姿态</th><th>动作组时长</th><th>创建时间</th><th>操作</th></tr></thead>
        <tbody>
          ${visibleGroups.map((group) => `
            <tr>
              <td>${group.id}</td>
              <td><strong>${group.name}</strong></td>
              <td>${group.desc || ""}</td>
              <td>${group.posture}</td>
              <td>${group.duration}s</td>
              <td>${group.created}</td>
              <td class="nowrap"><button class="btn small" onclick="openActionGroupModal('${group.id}')">编辑</button> <button class="btn danger small" onclick="deleteActionGroup('${group.id}')">删除</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ${pagination(visibleGroups.length, 1)}
  `;
}

function setActionGroupFilter(key, value) {
  actionGroupFilters[key] = value;
  renderApp();
}

function renderFacePage() {
  const keyword = faceFilters.keyword.trim().toLowerCase();
  const visibleFaces = visibleChannelResources(faces, "faces", "recognitionId", resourceChannelFilterValue(faceFilters))
    .filter((face) => !keyword || [face.id, face.recognitionId, face.name, face.nickname].join(" ").toLowerCase().includes(keyword))
    .filter((face) => faceFilters.source === "请选择来源" || face.source === faceFilters.source);
  return `
    <div class="toolbar">
      <div class="filters">
        ${resourceChannelFilterHtml(faceFilters, "setFaceFilter")}
        <input class="input w-260" value="${escapeHtml(faceFilters.keyword)}" placeholder="输入名称、昵称或识别人ID" oninput="setFaceFilter('keyword', this.value)" />
        <select class="select w-150" onchange="setFaceFilter('source', this.value)">${["请选择来源", "后台", "机器人自建"].map((value) => `<option ${faceFilters.source === value ? "selected" : ""}>${value}</option>`).join("")}</select>
        <button class="btn" onclick="toast('已查询人脸')">⌕ 查询</button>
      </div>
      <button class="btn" onclick="openFaceModal()">新建</button>
    </div>
    <div class="table-wrap">
      <table class="data-table face-table">
        <thead><tr><th>ID</th><th>识别人ID</th><th>视觉文件</th><th>识别人名称</th><th>昵称</th><th>出生年月</th><th>星座</th><th>性别</th><th>职业</th><th>创建时间</th><th>来源</th><th>操作</th></tr></thead>
        <tbody>${visibleFaces.map((face) => faceRow(face, "library")).join("")}</tbody>
      </table>
    </div>
    ${pagination(visibleFaces.length, 2)}
  `;
}

function setFaceFilter(key, value) {
  faceFilters[key] = value;
  renderApp();
}

function faceRow(face, context = "library") {
  const actionsHtml = context === "library"
    ? `<button class="link" onclick="openFaceModal('${face.recognitionId}')">编辑</button> | <button class="link danger" onclick="deleteFace('${face.recognitionId}')">删除</button>`
    : "";
  return `
    <tr>
      <td>${face.id}</td>
      <td>${face.recognitionId}</td>
      <td><span class="avatar-img ${face.avatarClass || "avatar-a"}">${face.avatar || face.name?.slice(0, 1) || "人"}</span></td>
      <td>${face.name}</td>
      <td>${face.nickname || ""}</td>
      <td>${face.birthday || ""}</td>
      <td>${face.zodiac || ""}</td>
      <td>${face.gender || ""}</td>
      <td class="left">${face.job || ""}</td>
      <td>${face.created}</td>
      <td><span class="mini-tag green">${face.source || "后台"}</span></td>
      <td class="nowrap">${actionsHtml}</td>
    </tr>
  `;
}

function renderMaterialPage() {
  const keyword = materialFilters.keyword.trim().toLowerCase();
  const tag = materialFilters.tag.trim().toLowerCase();
  const visibleMaterials = visibleChannelResources(materials, "materials", "id", resourceChannelFilterValue(materialFilters))
    .filter((material) => !keyword || [material.id, material.fileName].join(" ").toLowerCase().includes(keyword))
    .filter((material) => !tag || String(material.tag || "").toLowerCase().includes(tag));
  return `
    <div class="toolbar">
      <div class="filters">
        ${resourceChannelFilterHtml(materialFilters, "setMaterialFilter")}
        <input class="input w-220" value="${escapeHtml(materialFilters.keyword)}" placeholder="⌕ 输入音频名称" oninput="setMaterialFilter('keyword', this.value)" />
        <input class="input w-220" value="${escapeHtml(materialFilters.tag)}" placeholder="⌕ 输入标签搜索" oninput="setMaterialFilter('tag', this.value)" />
        <button class="btn" onclick="toast('已查询素材')">查询</button>
      </div>
      <button class="btn" onclick="openMaterialModal()">上传音频</button>
    </div>
    <div class="table-wrap borderless-table">
      <table class="data-table material-table">
        <thead><tr><th>文件名称</th><th>试听</th><th>上传日期</th><th>标签</th><th>操作</th></tr></thead>
        <tbody>
          ${visibleMaterials.map((material) => `
            <tr>
              <td><strong>${material.fileName}</strong></td>
              <td>${audioPlayerHtml(material.duration)}</td>
              <td>${material.uploaded}</td>
              <td>${material.tag || ""}</td>
              <td><button class="btn danger small" onclick="deleteMaterial('${material.id}')">删除</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ${pagination(visibleMaterials.length, 9)}
  `;
}

function setMaterialFilter(key, value) {
  materialFilters[key] = value;
  renderApp();
}

function renderAgentPage() {
  const keyword = agentFilters.keyword.trim().toLowerCase();
  const visibleAgents = visibleChannelResources(agents, "agents", "id", resourceChannelFilterValue(agentFilters))
    .filter((agent) => !keyword || [agent.id, agent.name, agent.appId].join(" ").toLowerCase().includes(keyword));
  return `
    <div class="toolbar">
      <div class="filters">
        ${resourceChannelFilterHtml(agentFilters, "setAgentFilter")}
        <input class="input w-260" value="${escapeHtml(agentFilters.keyword)}" placeholder="⌕ 输入智能体id或名称搜索..." oninput="setAgentFilter('keyword', this.value)" />
      </div>
      <button class="btn" onclick="openAgentModal()">创建智能体</button>
    </div>
    <div class="table-wrap borderless-table">
      <table class="data-table">
        <thead><tr><th>序号</th><th>ID</th><th>智能体名称</th><th>来源</th><th>应用ID和key</th><th>是否启用</th><th>已绑定</th><th>操作</th></tr></thead>
        <tbody>
          ${visibleAgents.map((agent) => `
            <tr>
              <td>${agent.seq}</td>
              <td>${agent.id}</td>
              <td><strong>${agent.name}</strong></td>
              <td>${agent.source}</td>
              <td class="left">
                <div>应用ID:${maskText(agent.appId)} <button class="link" onclick="copyText('${agent.appId}')">▣</button></div>
                <div>key: ${maskText(agent.key)} <button class="link" onclick="copyText('${agent.key}')">▣</button></div>
              </td>
              <td><button class="switch-button ${agent.enabled ? "on" : ""}" onclick="toggleAgentStatus('${agent.id}')"><span></span></button></td>
              <td><button class="link" onclick="toast('已打开绑定机器人列表')">${agent.bound}个</button></td>
              <td class="nowrap"><button class="btn small" onclick="openAgentModal('${agent.id}')">编辑</button> <button class="btn danger small" onclick="deleteAgent('${agent.id}')">删除</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ${pagination(visibleAgents.length + 83, 10)}
  `;
}

function setAgentFilter(key, value) {
  agentFilters[key] = value;
  renderApp();
}

function audioPlayerHtml(duration = "01:00") {
  return `<div class="audio-player"><span>▶</span><span>■</span><span>00:00 / ${duration}</span><input type="range" value="0" /><span>▮))</span></div>`;
}

function maskText(value) {
  const text = cleanCell(value);
  if (text.length <= 12) return text;
  return `${text.slice(0, 10)}...`;
}

function copyText(value) {
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(value).catch(() => {});
  toast("已复制");
}

function toggleActionStatus(id) {
  if (!isPlatformChannel()) {
    toast("客户渠道只能查看平台下发动作");
    return;
  }
  const action = actions.find((item) => item.id === id);
  if (!action) return;
  action.status = !action.status;
  renderApp();
}

function toggleAgentStatus(id) {
  const agent = agents.find((item) => item.id === id);
  if (!agent) return;
  agent.enabled = !agent.enabled;
  renderApp();
}

function deleteAction(id) {
  if (!isPlatformChannel()) {
    toast("客户渠道只能查看平台下发动作");
    return;
  }
  const index = actions.findIndex((item) => item.id === id);
  if (index >= 0) actions.splice(index, 1);
  toast("动作已删除");
  renderApp();
}

function deleteActionGroup(id) {
  const referencedRobots = robots.filter((robot) => (robot.actionGroupIds || []).includes(id));
  if (referencedRobots.length) {
    toast(`该动作组已被 ${referencedRobots.length} 台机器人引用，请先解除引用`);
    return;
  }
  const index = actionGroups.findIndex((item) => item.id === id);
  if (index >= 0) actionGroups.splice(index, 1);
  robots.forEach((robot) => {
    robot.actionGroupIds = (robot.actionGroupIds || []).filter((item) => item !== id);
  });
  toast("动作组已删除");
  renderApp();
}

function deleteFace(recognitionId) {
  const index = faces.findIndex((item) => item.recognitionId === recognitionId);
  if (index >= 0) faces.splice(index, 1);
  toast("人脸已删除");
  renderApp();
}

function deleteMaterial(id) {
  const index = materials.findIndex((item) => String(item.id) === String(id));
  if (index >= 0) materials.splice(index, 1);
  toast("素材已删除");
  renderApp();
}

function deleteAgent(id) {
  const index = agents.findIndex((item) => item.id === id);
  if (index >= 0) agents.splice(index, 1);
  toast("智能体已删除");
  renderApp();
}

function openActionModal(actionId = "", returnRobotId = "", returnTab = "") {
  if (!isPlatformChannel()) {
    toast("客户渠道只能查看平台下发动作");
    return;
  }
  const action = actions.find((item) => item.id === actionId);
  const closeAction = returnRobotId
    ? robotResourceEditorCloseAction(returnRobotId, returnTab, "actions")
    : "closeModal()";
  openModal(`
    <div class="modal medium">
      <div class="modal-header"><div class="modal-title">${action ? "编辑动作" : "新增动作"}</div><button class="modal-close" onclick="${closeAction}">×</button></div>
      <div class="modal-body form-grid">
        <div class="form-row"><div class="form-label required">动作ID</div><div><input id="actionId" class="input" value="${escapeHtml(action?.id || `ACT-${Date.now().toString().slice(-5)}`)}" ${action ? "readonly" : ""} /></div></div>
        ${formInputWithId("actionName", "动作名称", "输入动作名称", true, action?.name || "")}
        ${formSelectWithId("actionType", "动作类型", ["站姿", "坐姿", "站坐通用"], true, action?.type || action?.posture || "站姿")}
        ${formSelectWithId("actionPosture", "适用姿态", ["站姿", "坐姿", "站坐通用"], true, action?.posture || "站姿")}
        ${formInputWithId("actionDuration", "动作时长", "输入秒数", true, action?.duration ?? 10, "秒")}
        ${formTextareaWithId("actionDesc", "动作描述", "说明动作适用场景", action?.desc || "")}
        <div class="form-row"><div class="form-label">启用状态</div><label class="checkbox-line"><input id="actionStatus" type="checkbox" ${action?.status !== false ? "checked" : ""} />启用</label></div>
        <div class="upload-hint">微视中国维护平台动作大库；客户渠道只能查看已下发动作。</div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="${closeAction}">取消</button><button class="btn" onclick="saveActionModal('${escapeJs(actionId)}', '${escapeJs(returnRobotId)}', '${escapeJs(returnTab || "actions")}')">保存</button></div>
    </div>
  `);
}

function saveActionModal(actionId = "", returnRobotId = "", returnTab = "") {
  if (!isPlatformChannel()) {
    toast("客户渠道只能查看平台下发动作");
    return;
  }
  const id = valueById("actionId", actionId);
  const name = valueById("actionName", "新建动作");
  const type = valueById("actionType", "站姿");
  const posture = valueById("actionPosture", type);
  const duration = Math.max(0, Number(valueById("actionDuration", "10")) || 0);
  const status = Boolean(document.getElementById("actionStatus")?.checked);
  if (!id) {
    toast("请填写动作ID");
    return;
  }
  const duplicate = actions.find((item) => item.id !== actionId && item.id === id);
  if (duplicate) {
    toast(`动作ID已存在：${id}`);
    return;
  }
  const target = actions.find((item) => item.id === actionId) || { id, created: formatLocalTimestamp(new Date()) };
  target.id = id;
  target.seq = target.seq || Math.max(0, ...actions.map((item) => Number(item.seq) || 0)) + 1;
  target.name = name || "新建动作";
  target.desc = valueById("actionDesc", "");
  target.type = type;
  target.posture = posture;
  target.duration = duration;
  target.status = status;
  target.owner = "公共模板";
  target.scope = "platform_distributed";
  target.resourceScope = "platform_distributed";
  target.channelId = "channel-weishi";
  if (!Array.isArray(target.channelIds) || !target.channelIds.length) target.channelIds = ["channel-weishi"];
  if (!Array.isArray(target.supportedVersions) || !target.supportedVersions.length) target.supportedVersions = robotVersionOptions.slice();
  if (!Array.isArray(target.abilityScope) || !target.abilityScope.length) target.abilityScope = ["live", "performance", "tour"];
  if (!actions.includes(target)) actions.unshift(target);
  closeModal();
  renderApp();
  toast(actionId ? "动作已保存" : "动作已新增到平台动作大库");
}

function openActionGroupModal(groupId = "", returnRobotId = "", returnTab = "") {
  const group = [...actionGroups, ...userRobotActionGroups].find((item) => item.id === groupId);
  actionGroupDraftItems = group
    ? (group.actionSequence || (group.actionIds || []).map((id) => id === "__delay__" ? { type: "delay", duration: 5 } : { type: "action", actionId: id })).map((item) => ({ ...item }))
    : [];
  renderActionGroupModal(groupId, returnRobotId, returnTab);
}

function renderActionGroupModal(groupId = "", returnRobotId = "", returnTab = "") {
  const group = [...actionGroups, ...userRobotActionGroups].find((item) => item.id === groupId);
  const closeAction = robotResourceEditorCloseAction(returnRobotId, returnTab, "actions");
  const total = actionGroupDraftDuration();
  const availableActions = actionGroupAvailableActions(returnRobotId);
  openModal(`
    <div class="modal xlarge">
      <div class="modal-header"><div class="modal-title">${group ? "编辑动作组" : "新增动作组"}</div><button class="modal-close" onclick="${closeAction}">×</button></div>
      <div class="modal-body">
        <div class="action-group-form">
          <div>
            ${formInputWithId("actionGroupId", "动作组ID", "请输入", true, group?.id || "")}
            ${radioRow("动作类型", ["站姿", "坐姿", "站坐通用"], "actionGroupType", group?.type || "站姿")}
          </div>
          <div>
            ${formInputWithId("actionGroupName", "动作组名称", "请输入", true, group?.name || "")}
            ${formInputWithId("actionGroupDesc", "动作组描述", "请输入", false, group?.desc || "")}
          </div>
        </div>
        <div class="dual-resource-grid">
          <div>
            <div class="resource-panel-head"><strong>可选平台动作（${availableActions.length}）${handoffMark("动作组可选动作范围", "动作组只能选择当前渠道已下发且兼容当前机器人版本和能力范围的单一动作。", "info")}</strong><span class="readonly-resource-note">已下发 · 兼容当前机器人</span></div>
            <div class="table-wrap resource-scroll">
              <table class="data-table compact-table action-mini-table">
                <tbody>${availableActions.length ? availableActions.slice(0, 8).map((action, index) => `<tr><td>${index + 1}</td><td class="break-word">${action.id}</td><td>${action.name}</td><td>${action.posture}</td><td>${action.duration}s</td><td><button class="btn small" onclick="addActionToGroupDraft('${action.id}', '${groupId}', '${returnRobotId}', '${returnTab}')">添加</button></td></tr>`).join("") : `<tr><td colspan="6">暂无当前渠道已下发且兼容的单一动作</td></tr>`}</tbody>
              </table>
            </div>
          </div>
          <div>
            <div class="resource-panel-head"><strong>已选动作（${actionGroupDraftItems.length}）</strong><span>动作组时长：<input class="input w-120" disabled value="${total}" /> s</span></div>
            <div class="table-wrap resource-scroll">
              <table class="data-table compact-table action-mini-table">
                <tbody>${actionGroupDraftItems.length ? actionGroupDraftItems.map((item, index) => actionGroupDraftRow(item, index, groupId, returnRobotId, returnTab)).join("") : `<tr><td colspan="6">暂无数据</td></tr>`}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="${closeAction}">取消</button><button class="btn" onclick="saveActionGroupModal('${groupId}', '${returnRobotId}', '${returnTab || "actions"}')">保存</button></div>
    </div>
  `);
}

function actionGroupAvailableActions(returnRobotId = "") {
  const robot = returnRobotId ? robots.find((item) => item.id === returnRobotId) : null;
  return visiblePlatformActions({ robot });
}

function platformActionById(actionId) {
  return actions.find((row) => row.id === actionId);
}

function actionGroupDraftRow(item, index, groupId, returnRobotId, returnTab) {
  if (item.type === "delay") {
    return `<tr><td><span class="drag-handle">☰</span></td><td class="left">延迟时间间隔</td><td></td><td><input class="input" style="width:76px" type="number" min="0" step="1" value="${item.duration || 5}" onchange="updateActionDelay(${index}, this.value, '${groupId}', '${returnRobotId}', '${returnTab}')" /> s</td><td><button class="btn danger small" onclick="removeActionGroupDraftItem(${index}, '${groupId}', '${returnRobotId}', '${returnTab}')">删除</button></td><td>${actionGroupOrderButtons(index, groupId, returnRobotId, returnTab)}</td></tr>`;
  }
  const action = platformActionById(item.actionId);
  return `<tr><td><span class="drag-handle">☰</span></td><td class="left">${action?.name || item.actionId}</td><td>${action?.posture || ""}</td><td>${action?.duration || 0}s</td><td><button class="btn danger small" onclick="removeActionGroupDraftItem(${index}, '${groupId}', '${returnRobotId}', '${returnTab}')">删除</button></td><td>${actionGroupOrderButtons(index, groupId, returnRobotId, returnTab)} <button class="btn small" onclick="insertActionDelay(${index}, '${groupId}', '${returnRobotId}', '${returnTab}')">插入间隔</button></td></tr>`;
}

function actionGroupOrderButtons(index, groupId, returnRobotId, returnTab) {
  return `<button class="btn secondary small" ${index === 0 ? "disabled" : ""} onclick="moveActionGroupDraftItem(${index}, -1, '${groupId}', '${returnRobotId}', '${returnTab}')">↑</button> <button class="btn secondary small" ${index === actionGroupDraftItems.length - 1 ? "disabled" : ""} onclick="moveActionGroupDraftItem(${index}, 1, '${groupId}', '${returnRobotId}', '${returnTab}')">↓</button>`;
}

function moveActionGroupDraftItem(index, offset, groupId = "", returnRobotId = "", returnTab = "") {
  const target = index + offset;
  if (target < 0 || target >= actionGroupDraftItems.length) return;
  [actionGroupDraftItems[index], actionGroupDraftItems[target]] = [actionGroupDraftItems[target], actionGroupDraftItems[index]];
  renderActionGroupModal(groupId, returnRobotId, returnTab);
}

function updateActionDelay(index, value, groupId = "", returnRobotId = "", returnTab = "") {
  if (actionGroupDraftItems[index]?.type === "delay") actionGroupDraftItems[index].duration = Math.max(0, Number(value) || 0);
  renderActionGroupModal(groupId, returnRobotId, returnTab);
}

function actionGroupDraftDuration() {
  return actionGroupDraftItems.reduce((total, item) => {
    if (item.type === "delay") return total + Number(item.duration || 5);
    const action = platformActionById(item.actionId);
    return total + Number(action?.duration || 0);
  }, 0);
}

function addActionToGroupDraft(actionId, groupId = "", returnRobotId = "", returnTab = "") {
  actionGroupDraftItems.push({ type: "action", actionId });
  renderActionGroupModal(groupId, returnRobotId, returnTab);
}

function insertActionDelay(index, groupId = "", returnRobotId = "", returnTab = "") {
  actionGroupDraftItems.splice(index + 1, 0, { type: "delay", duration: 5 });
  renderActionGroupModal(groupId, returnRobotId, returnTab);
}

function removeActionGroupDraftItem(index, groupId = "", returnRobotId = "", returnTab = "") {
  actionGroupDraftItems.splice(index, 1);
  renderActionGroupModal(groupId, returnRobotId, returnTab);
}

function saveActionGroupModal(groupId = "", returnRobotId = "", returnTab = "") {
  const id = cleanCell(document.getElementById("actionGroupId")?.value) || (returnRobotId ? `U-ACT-G-${String(userRobotActionGroups.length + 1).padStart(2, "0")}` : `action_group_${Date.now().toString().slice(-4)}`);
  const name = cleanCell(document.getElementById("actionGroupName")?.value) || "新建动作组";
  const type = document.querySelector("input[name='actionGroupType']:checked")?.parentElement?.textContent.trim() || "站姿";
  const source = returnRobotId ? userRobotActionGroups : actionGroups;
  const target = groupId ? [...actionGroups, ...userRobotActionGroups].find((item) => item.id === groupId) : null;
  const validationError = validateActionGroupDraft({ groupId, returnRobotId, name, source });
  if (validationError) {
    toast(validationError);
    return;
  }
  const next = target || { id, created: formatLocalTimestamp(new Date()), owner: returnRobotId ? "用户模板" : "公共模板", scope: returnRobotId ? "robot_private" : "channel_public", channelId: phase2State?.snapshot().currentChannelId || "channel-weishi", robotId: returnRobotId || undefined };
  next.id = target ? next.id : id;
  next.name = name;
  next.desc = cleanCell(document.getElementById("actionGroupDesc")?.value);
  next.type = type;
  next.posture = type;
  next.duration = actionGroupDraftDuration();
  next.actionIds = actionGroupDraftItems.map((item) => item.type === "delay" ? "__delay__" : item.actionId);
  next.actionSequence = actionGroupDraftItems.map((item) => ({ ...item }));
  normalizeResourceMetadata(next);
  if (!target) source.unshift(next);
  if (returnRobotId) {
    const robot = robots.find((item) => item.id === returnRobotId);
    if (robot) {
      if (!Array.isArray(robot.actionGroupIds)) robot.actionGroupIds = [];
      if (!robot.actionGroupIds.includes(next.id)) robot.actionGroupIds.push(next.id);
    }
    finishRobotResourceEditor(returnRobotId, returnTab, "actions");
  } else {
    closeModal();
    renderApp();
  }
  toast(returnRobotId ? "机器人用户模板动作组已保存" : "动作组已保存到公共大库");
}

function validateActionGroupDraft({ groupId = "", returnRobotId = "", name = "", source = [] } = {}) {
  const actionItems = actionGroupDraftItems.filter((item) => item.type === "action");
  if (!actionItems.length) return "动作组至少需要选择一个平台下发动作";
  const comparableSource = returnRobotId ? source.filter((item) => item.robotId === returnRobotId) : visibleChannelResources(source, "actionGroups");
  const duplicate = comparableSource.find((item) => item.id !== groupId && item.name === name);
  if (duplicate) return `动作组名称已存在：${name}`;
  const availableIds = new Set(actionGroupAvailableActions(returnRobotId).map((action) => action.id));
  const invalidIds = actionItems.map((item) => item.actionId).filter((id) => !availableIds.has(id));
  if (invalidIds.length) {
    const invalidNames = invalidIds.map((id) => platformActionById(id)?.name || id).join("、");
    return `当前动作组包含不可用或版本不兼容的动作：${invalidNames}`;
  }
  return "";
}

function openFaceModal(recognitionId = "", returnRobotId = "", returnTab = "") {
  const face = [...faces, ...userRobotFaces].find((item) => item.recognitionId === recognitionId);
  const closeAction = robotResourceEditorCloseAction(returnRobotId, returnTab, "vision");
  openModal(`
    <div class="modal large face-edit-modal">
      <div class="modal-header"><div class="modal-title">${face ? "编辑" : "新增"}</div><button class="modal-close" onclick="${closeAction}">×</button></div>
      <div class="modal-body">
        <div class="form-section">
          <div class="form-row top"><div class="form-label required">视觉文件</div><div class="face-upload-row">${face ? `<div class="face-preview ${face.avatarClass || "avatar-a"}">${face.avatar || face.name.slice(0, 1)}<span>✓</span></div>` : ""}${uploadBox("", "＋", false, "")}</div></div>
          ${formInputWithId("faceName", "识别人名称", "请输入识别人名称", true, face?.name || "")}
          ${formInputWithId("faceNickname", "昵称", "请输入昵称", false, face?.nickname || "")}
          ${formInputWithId("faceBirthday", "生日", "选择", false, face?.birthday || "")}
          ${formSelectWithId("faceZodiac", "星座", ["请选择星座", "双子座", "双鱼座", "狮子座", "金牛座", "巨蟹座", "天秤座"], false, face?.zodiac || "")}
          ${formSelectWithId("faceGender", "性别", ["请选择性别", "男", "女"], false, face?.gender || "")}
          ${formInputWithId("faceJob", "职业", "请输入职业", false, face?.job || "")}
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="${closeAction}">取消</button><button class="btn" onclick="saveFaceModal('${recognitionId}', '${returnRobotId}', '${returnTab || "vision"}')">确定</button></div>
    </div>
  `);
}

function saveFaceModal(recognitionId = "", returnRobotId = "", returnTab = "") {
  const collection = returnRobotId ? userRobotFaces : faces;
  const target = recognitionId ? [...faces, ...userRobotFaces].find((item) => item.recognitionId === recognitionId) : null;
  const name = cleanCell(document.getElementById("faceName")?.value) || "新识别人";
  const next = target || {
    id: returnRobotId ? `U-FACE-${String(userRobotFaces.length + 1).padStart(2, "0")}` : faces.length + 18,
    recognitionId: returnRobotId ? `robot_${returnRobotId}_${Date.now().toString().slice(-4)}` : `xinfutech_${faces.length + 18}`,
    avatar: name.slice(0, 1),
    avatarClass: ["avatar-a", "avatar-b", "avatar-c", "avatar-d"][collection.length % 4],
    created: formatLocalTimestamp(new Date()),
    source: returnRobotId ? "机器人自建" : "后台",
    owner: returnRobotId ? "用户模板" : "公共模板",
    scope: returnRobotId ? "robot-user-template" : "public",
    channelId: returnRobotId ? resourceChannelId("robots", returnRobotId) : phase2State?.snapshot().currentChannelId || "channel-weishi",
    resourceScope: returnRobotId ? "robot_private" : "channel_public",
    robotId: returnRobotId || undefined,
  };
  next.name = name;
  next.nickname = cleanCell(document.getElementById("faceNickname")?.value);
  next.birthday = cleanCell(document.getElementById("faceBirthday")?.value);
  next.zodiac = cleanCell(document.getElementById("faceZodiac")?.value);
  next.gender = cleanCell(document.getElementById("faceGender")?.value);
  next.job = cleanCell(document.getElementById("faceJob")?.value);
  normalizeResourceMetadata(next);
  if (!target) collection.unshift(next);
  if (returnRobotId) {
    bindRobotResourceId(returnRobotId, "vision", next.recognitionId);
    finishRobotResourceEditor(returnRobotId, returnTab, "vision");
  } else {
    closeModal();
    renderApp();
  }
  toast(returnRobotId ? "机器人用户模板视觉已保存" : "人脸已保存到公共大库");
}

function openMaterialModal(materialId = "", returnRobotId = "", returnTab = "") {
  const material = [...materials, ...userRobotMaterials].find((item) => String(item.id) === String(materialId));
  const closeAction = robotResourceEditorCloseAction(returnRobotId, returnTab, "materials");
  openModal(`
    <div class="modal medium">
      <div class="modal-header"><div class="modal-title">${material ? "编辑音频" : "上传音频"}</div><button class="modal-close" onclick="${closeAction}">×</button></div>
      <div class="modal-body">
        ${formInputWithId("materialTag", "标签", "", false, material?.tag || "")}
        ${formInputWithId("materialName", "文件名称", "请输入音频名称", false, material?.fileName || "")}
        ${uploadBox("", "将文件拖到此处，或点击上传", false, "")}
      </div>
      <div class="modal-footer"><button class="btn" onclick="saveMaterialModal('${materialId}', '${returnRobotId}', '${returnTab || "materials"}')">上传</button><button class="btn secondary" onclick="${closeAction}">取消</button></div>
    </div>
  `);
}

function saveMaterialModal(materialId = "", returnRobotId = "", returnTab = "") {
  const collection = returnRobotId ? userRobotMaterials : materials;
  const target = materialId ? [...materials, ...userRobotMaterials].find((item) => String(item.id) === String(materialId)) : null;
  const next = target || {
    id: returnRobotId ? `U-MAT-${String(userRobotMaterials.length + 1).padStart(2, "0")}` : Math.max(...materials.map((item) => Number(item.id) || 0)) + 1,
    duration: "01:00",
    uploaded: formatLocalTimestamp(new Date()),
    owner: returnRobotId ? "用户模板" : "公共模板",
    scope: returnRobotId ? "robot-user-template" : "public",
    channelId: returnRobotId ? resourceChannelId("robots", returnRobotId) : phase2State?.snapshot().currentChannelId || "channel-weishi",
    resourceScope: returnRobotId ? "robot_private" : "channel_public",
    robotId: returnRobotId || undefined,
  };
  next.fileName = cleanCell(document.getElementById("materialName")?.value) || "新上传音频.mp3";
  next.tag = cleanCell(document.getElementById("materialTag")?.value);
  normalizeResourceMetadata(next);
  if (!target) collection.unshift(next);
  if (returnRobotId) {
    bindRobotResourceId(returnRobotId, "materials", next.id);
    finishRobotResourceEditor(returnRobotId, returnTab, "materials");
  } else {
    closeModal();
    renderApp();
  }
  toast(returnRobotId ? "机器人用户模板素材已保存" : "素材已保存到公共大库");
}

function openAgentModal(agentId = "") {
  const agent = agents.find((item) => item.id === agentId);
  openModal(`
    <div class="modal medium">
      <div class="modal-header"><div class="modal-title">${agent ? "编辑" : "新增"}</div><button class="modal-close" onclick="closeModal()">×</button></div>
      <div class="modal-body">
        ${formInputWithId("agentName", "智能体名称", "", true, agent?.name || "")}
        ${formSelectWithId("agentSource", "智能体来源", ["阿里云百炼"], false, agent?.source || "阿里云百炼")}
        ${formInputWithId("agentAppId", "应用ID", "", true, agent?.appId || "")}
        ${formInputWithId("agentKey", "key", "", true, agent?.key || "")}
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="closeModal()">取消</button><button class="btn" onclick="saveAgentModal('${agentId}')">${agent ? "确认编辑" : "确认新增"}</button></div>
    </div>
  `);
}

function saveAgentModal(agentId = "") {
  const target = agents.find((item) => item.id === agentId);
  const next = target || { seq: agents.length + 1, id: `RAG${String(agents.length + 113).padStart(3, "0")}`, enabled: true, bound: 0, channelId: phase2State?.snapshot().currentChannelId || "channel-weishi", resourceScope: "channel_public" };
  next.name = cleanCell(document.getElementById("agentName")?.value) || "新智能体";
  next.source = cleanCell(document.getElementById("agentSource")?.value) || "阿里云百炼";
  next.appId = cleanCell(document.getElementById("agentAppId")?.value) || `app-${Date.now().toString().slice(-8)}`;
  next.key = cleanCell(document.getElementById("agentKey")?.value) || `sk-${Date.now().toString(16)}`;
  normalizeResourceMetadata(next);
  if (!target) agents.unshift(next);
  closeModal();
  renderApp();
  toast("智能体已保存");
}

function openResourceBatchDistribute(type) {
  openBatchDistributionModal(type);
}

function resourceBatchConfig(type) {
  const configs = {
    skills: { label: "技能", title: "技能批量下发", placeholder: "ID/技能名称", source: () => visibleChannelResources(skills, "skills"), bindField: "skillIds" },
    shows: { label: "表演", title: "表演批量下发", placeholder: "ID/表演名称", source: () => visibleChannelResources(shows, "shows").filter((show) => show.owner === "公共模板"), bindField: "showIds" },
    actions: { label: "动作", title: "动作批量下发", placeholder: "ID/动作名称", source: () => actions, bindField: "actionIds" },
    actionGroups: { label: "动作组", title: "动作组批量下发", placeholder: "ID/动作组名称", source: () => visibleChannelResources(actionGroups, "actionGroups"), bindField: "actionGroupIds" },
    faces: { label: "视觉", title: "视觉批量下发", placeholder: "名称/识别人ID", source: () => visibleChannelResources(faces, "faces", "recognitionId"), bindField: "faceIds", idField: "recognitionId" },
    materials: { label: "素材", title: "素材批量下发", placeholder: "音频名称/标签", source: () => visibleChannelResources(materials, "materials"), bindField: "materialIds" },
    agents: { label: "智能体", title: "智能体批量下发", placeholder: "ID/智能体名称", source: () => visibleChannelResources(agents, "agents"), bindField: "agentIds" },
  };
  return configs[type] || configs.skills;
}

function openBatchDistributionModal(type) {
  const config = resourceBatchConfig(type);
  const source = config.source();
  const customerChannels = distributionTargetChannels();
  batchDistributionDraft = {
    type,
    mode: "channel",
    resourceKeyword: "",
    robotKeyword: "",
    robotMode: "全部场景",
    robotVersion: "全部版本",
    selectedResourceIds: source.slice(0, 1).map((item) => resourceIdentity(item, config.idField)),
    selectedChannelIds: customerChannels.slice(0, 1).map((item) => item.id),
    selectedRobotIds: [],
  };
  renderBatchDistributionModal();
}

function distributionTargetChannels() {
  const channels = window.phase2State?.channels || [];
  const customerChannels = channels.filter((channel) => channel.type === "customer");
  return customerChannels.length ? customerChannels : channels.filter((channel) => channel.id !== currentChannelId());
}

function batchDistributionSource() {
  if (!batchDistributionDraft) return [];
  const config = resourceBatchConfig(batchDistributionDraft.type);
  const keyword = batchDistributionDraft.resourceKeyword.trim().toLowerCase();
  return config.source().filter((item) => {
    const text = [resourceIdentity(item, config.idField), item.name, item.fileName, item.owner, item.category, item.trigger, item.tag].join(" ").toLowerCase();
    return !keyword || text.includes(keyword);
  });
}

function batchDistributionRobots() {
  if (!batchDistributionDraft) return [];
  const keyword = batchDistributionDraft.robotKeyword.trim().toLowerCase();
  const channelIds = batchDistributionDraft.selectedChannelIds;
  return robots
    .filter((robot) => !channelIds.length || channelIds.includes(resourceChannelId("robots", robot.id)))
    .filter((robot) => batchDistributionDraft.robotMode === "全部场景" || robot.mode === batchDistributionDraft.robotMode)
    .filter((robot) => batchDistributionDraft.robotVersion === "全部版本" || robot.version === batchDistributionDraft.robotVersion)
    .filter((robot) => {
      const text = [robot.id, robot.name, robot.mode, robot.version].join(" ").toLowerCase();
      return !keyword || text.includes(keyword);
    });
}

function renderBatchDistributionModal() {
  if (!batchDistributionDraft) return;
  const config = resourceBatchConfig(batchDistributionDraft.type);
  const source = batchDistributionSource();
  const targetChannels = distributionTargetChannels();
  const targetRobots = batchDistributionRobots();
  const selectedResourceCount = batchDistributionDraft.selectedResourceIds.length;
  const selectedRobotCount = batchDistributionDraft.selectedRobotIds.length;
  const selectedChannelNames = targetChannels
    .filter((channel) => batchDistributionDraft.selectedChannelIds.includes(channel.id))
    .map((channel) => channel.name)
    .join("、") || "未选择渠道";
  openModal(`
    <div class="modal large distribution-modal">
      <div class="modal-header">
        <div class="modal-title">${config.title}${handoffMark("渠道与机器人下发", "下发时先选渠道，再按渠道筛机器人，并可按机器人类型和版本继续筛选；支持下发到渠道或指定机器人。", "new")}</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="distribution-grid">
          <div class="distribution-column">
            <div class="batch-panel">
              <div class="batch-panel-header">
                <span>选择${config.label}（${selectedResourceCount}）</span>
                <input class="input" value="${escapeHtml(batchDistributionDraft.resourceKeyword)}" placeholder="${config.placeholder}" oninput="setBatchDistributionField('resourceKeyword', this.value)" />
              </div>
              <div class="batch-panel distribution-list">
                ${source.length ? source.slice(0, 10).map((item) => {
                  const id = resourceIdentity(item, config.idField);
                  return `
                    <label class="batch-row distribution-row ${String(item.name || item.fileName || "").length > 24 ? "tall" : ""}">
                      <input type="checkbox" ${batchDistributionDraft.selectedResourceIds.includes(id) ? "checked" : ""} onchange="toggleBatchDistributionResource('${escapeJs(id)}', this.checked)" />
                      <span>${escapeHtml(id)}</span>
                      <span>${escapeHtml(item.name || item.fileName || "-")}</span>
                      <span>${escapeHtml(item.owner || item.category || item.posture || item.source || item.tag || "")}</span>
                    </label>
                  `;
                }).join("") : `<div class="empty-state compact">没有匹配的${config.label}</div>`}
              </div>
            </div>
          </div>
          <div class="distribution-column">
            <div class="distribution-card">
              <div class="distribution-section-title">下发方式</div>
              <div class="segmented-control">
                ${["channel", "robot"].map((mode) => `<button class="${batchDistributionDraft.mode === mode ? "active" : ""}" type="button" onclick="setBatchDistributionField('mode', '${mode}')">${mode === "channel" ? "下发到渠道" : "下发到指定机器人"}</button>`).join("")}
              </div>
            </div>
            <div class="distribution-card">
              <div class="distribution-section-title">目标渠道</div>
              <div class="distribution-channel-list">
                ${targetChannels.map((channel) => `
                  <label class="distribution-check">
                    <input type="checkbox" ${batchDistributionDraft.selectedChannelIds.includes(channel.id) ? "checked" : ""} onchange="toggleBatchDistributionChannel('${escapeJs(channel.id)}', this.checked)" />
                    <span><strong>${escapeHtml(channel.name)}</strong><em>${escapeHtml(channel.roleLabel || "客户渠道")}</em></span>
                  </label>
                `).join("")}
              </div>
            </div>
            <div class="distribution-card ${batchDistributionDraft.mode === "robot" ? "" : "muted"}">
              <div class="distribution-section-title">机器人筛选</div>
              <div class="distribution-filters">
                <input class="input" value="${escapeHtml(batchDistributionDraft.robotKeyword)}" placeholder="搜索机器人" oninput="setBatchDistributionField('robotKeyword', this.value)" />
                <select class="select" onchange="setBatchDistributionField('robotMode', this.value)">${["全部场景", "直播", "表演", "导览"].map((value) => `<option ${batchDistributionDraft.robotMode === value ? "selected" : ""}>${value}</option>`).join("")}</select>
                <select class="select" onchange="setBatchDistributionField('robotVersion', this.value)">${["全部版本", ...robotVersionOptions].map((value) => `<option ${batchDistributionDraft.robotVersion === value ? "selected" : ""}>${value}</option>`).join("")}</select>
              </div>
              <div class="distribution-robot-list">
                ${targetRobots.length ? targetRobots.slice(0, 8).map((robot) => `
                  <label class="batch-row distribution-row robot-row">
                    <input type="checkbox" ${batchDistributionDraft.mode === "robot" ? "" : "disabled"} ${batchDistributionDraft.selectedRobotIds.includes(String(robot.id)) ? "checked" : ""} onchange="toggleBatchDistributionRobot('${escapeJs(robot.id)}', this.checked)" />
                    <span>${escapeHtml(robot.id)}</span>
                    <span>${escapeHtml(robot.name)}</span>
                    <span>${escapeHtml(robot.version)}</span>
                  </label>
                `).join("") : `<div class="empty-state compact">当前渠道下没有匹配机器人</div>`}
              </div>
            </div>
          </div>
        </div>
        <div class="distribution-summary">
          <strong>下发预览</strong>
          <span>${selectedResourceCount} 个${config.label} · ${selectedChannelNames}${batchDistributionDraft.mode === "robot" ? ` · ${selectedRobotCount} 台机器人` : " · 渠道内可引用"}${handoffMark("下发只读引用", "下发到渠道或指定机器人后，资源在客户侧作为平台下发的只读引用使用，不生成渠道副本或机器人私有副本。", "info")}</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="saveBatchDistribution()">确认下发</button>
      </div>
    </div>
  `);
}

function setBatchDistributionField(key, value) {
  if (!batchDistributionDraft) return;
  batchDistributionDraft[key] = value;
  if (key === "mode" && value === "channel") batchDistributionDraft.selectedRobotIds = [];
  renderBatchDistributionModal();
}

function toggleBatchDistributionResource(resourceId, checked) {
  if (!batchDistributionDraft) return;
  toggleValue(batchDistributionDraft.selectedResourceIds, resourceId, checked);
  renderBatchDistributionModal();
}

function toggleBatchDistributionChannel(channelId, checked) {
  if (!batchDistributionDraft) return;
  toggleValue(batchDistributionDraft.selectedChannelIds, channelId, checked);
  const allowedChannels = new Set(batchDistributionDraft.selectedChannelIds);
  batchDistributionDraft.selectedRobotIds = batchDistributionDraft.selectedRobotIds.filter((robotId) => {
    const robot = robots.find((item) => String(item.id) === String(robotId));
    return robot && allowedChannels.has(resourceChannelId("robots", robot.id));
  });
  renderBatchDistributionModal();
}

function toggleBatchDistributionRobot(robotId, checked) {
  if (!batchDistributionDraft) return;
  toggleValue(batchDistributionDraft.selectedRobotIds, String(robotId), checked);
  renderBatchDistributionModal();
}

function toggleValue(values, value, checked) {
  const text = String(value);
  const exists = values.includes(text);
  if (checked && !exists) values.push(text);
  if (!checked && exists) values.splice(values.indexOf(text), 1);
}

function saveBatchDistribution() {
  if (!batchDistributionDraft) return;
  const config = resourceBatchConfig(batchDistributionDraft.type);
  const selectedResourceIds = [...new Set(batchDistributionDraft.selectedResourceIds)];
  const selectedChannelIds = [...new Set(batchDistributionDraft.selectedChannelIds)];
  const selectedRobotIds = batchDistributionDraft.mode === "robot" ? [...new Set(batchDistributionDraft.selectedRobotIds)] : [];
  if (!selectedResourceIds.length) {
    toast(`请至少选择一个${config.label}`);
    return;
  }
  if (!selectedChannelIds.length) {
    toast("请至少选择一个目标渠道");
    return;
  }
  if (batchDistributionDraft.mode === "robot" && !selectedRobotIds.length) {
    toast("请至少选择一台目标机器人");
    return;
  }
  selectedResourceIds.forEach((resourceId) => {
    selectedChannelIds.forEach((channelId) => {
      const channelRobotIds = selectedRobotIds.filter((robotId) => resourceChannelId("robots", robotId) === channelId);
      if (batchDistributionDraft.mode === "robot" && !channelRobotIds.length) return;
      upsertResourceDistribution({
        resourceType: batchDistributionDraft.type,
        resourceId,
        sourceChannelId: currentChannelId(),
        targetChannelId: channelId,
        targetRobotIds: channelRobotIds,
        targetType: batchDistributionDraft.mode,
      });
    });
  });
  applyRobotResourceBindings(batchDistributionDraft.type, selectedResourceIds, selectedRobotIds, config.bindField);
  applyChannelResourceVisibility(batchDistributionDraft.type, selectedResourceIds, selectedChannelIds);
  saveBusinessState();
  const resourceCount = selectedResourceIds.length;
  const targetCount = batchDistributionDraft.mode === "robot" ? selectedRobotIds.length : selectedChannelIds.length;
  batchDistributionDraft = null;
  closeModal();
  renderApp();
  toast(`${config.label}已下发：${resourceCount} 个资源，${targetCount} 个${selectedRobotIds.length ? "机器人" : "渠道"}`);
}

function upsertResourceDistribution(next) {
  const existing = resourceDistributions.find((item) => item.resourceType === next.resourceType
    && String(item.resourceId) === String(next.resourceId)
    && item.targetChannelId === next.targetChannelId
    && item.targetType === next.targetType);
  const payload = {
    ...next,
    id: existing?.id || `DIST-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    status: "active",
    deployedAt: formatLocalTimestamp(new Date()),
  };
  if (existing) Object.assign(existing, payload);
  else resourceDistributions.unshift(payload);
}

function applyRobotResourceBindings(resourceType, resourceIds, robotIds, bindField) {
  if (!bindField || !robotIds.length) return;
  robotIds.forEach((robotId) => {
    const robot = robots.find((item) => String(item.id) === String(robotId));
    if (!robot) return;
    if (!Array.isArray(robot[bindField])) robot[bindField] = [];
    resourceIds.forEach((resourceId) => {
      if (!robot[bindField].some((item) => String(item) === String(resourceId))) robot[bindField].push(resourceId);
    });
    if (resourceType === "skills") robot.keywords = robot[bindField].length;
    if (resourceType === "shows") robot.scripts = robotAssignedScripts(robot).length;
  });
}

function applyChannelResourceVisibility(resourceType, resourceIds, channelIds) {
  if (resourceType !== "actions") return;
  actions.forEach((action) => {
    if (!resourceIds.includes(String(action.id))) return;
    if (!Array.isArray(action.channelIds)) action.channelIds = [];
    channelIds.forEach((channelId) => {
      if (!action.channelIds.includes(channelId)) action.channelIds.push(channelId);
    });
  });
}

function formInputWithId(id, label, placeholder, required = false, value = "", suffix = "") {
  return `<div class="form-row"><div class="form-label ${required ? "required" : ""}">${label}</div><div style="display:flex;"><input id="${id}" class="input" placeholder="${placeholder}" value="${escapeHtml(value)}" />${suffix ? `<span class="stepper value" style="min-width:44px;">${suffix}</span>` : ""}</div></div>`;
}

function formTextareaWithId(id, label, placeholder, value = "") {
  return `<div class="form-row top"><div class="form-label">${label}</div><div><textarea id="${id}" class="textarea" placeholder="${placeholder}">${escapeHtml(value)}</textarea></div></div>`;
}

function formSelectWithId(id, label, options, required = false, selected = "") {
  return `<div class="form-row"><div class="form-label ${required ? "required" : ""}">${label}</div><div><select id="${id}" class="select">${options.map((item) => `<option ${item === selected ? "selected" : ""}>${item}</option>`).join("")}</select></div></div>`;
}

function uploadBox(label, text, required = false, hint = "") {
  return `
    <div class="${label ? "form-row top" : ""}">
      ${label ? `<div class="form-label ${required ? "required" : ""}">${label}</div>` : ""}
      <div>
        <div class="upload-drop"><div class="upload-cloud">☁</div><span>${text}</span></div>
        ${hint ? `<div class="upload-hint">${hint}</div>` : ""}
      </div>
    </div>
  `;
}

function newCreateRobotDraft() {
  const index = robots.length + 1;
  return {
    id: `RBT-${Date.now().toString().slice(-4)}`,
    mode: "直播",
    name: `新建机器人${index}`,
    voice: voiceOptions()[0] || "未配置",
    model: "百炼",
    version: "R版-机器头",
    year: "2026",
    wifiSsid: "",
    wifiPassword: "",
    wifiMode: "自动连接",
  };
}

function robotDraftFromRobot(robot) {
  return {
    id: robot.id,
    mode: robot.mode || "直播",
    name: robot.name || "",
    voice: robot.voice || "",
    model: robot.model || "百炼",
    version: robot.version || "R版-机器头",
    year: robot.year || "2026",
    wifiSsid: robot.wifiSsid || "",
    wifiPassword: robot.wifiPassword || "",
    wifiMode: robot.wifiMode || "自动连接",
  };
}

function valueById(id, fallback = "") {
  const node = document.getElementById(id);
  return node ? cleanCell(node.value) : fallback;
}

function checkedRadioValue(name, fallback = "") {
  const node = document.querySelector(`input[name="${name}"]:checked`);
  return node ? cleanCell(node.value || node.parentElement?.textContent || "") : fallback;
}

function captureRobotDraftFromDom(draft) {
  if (!draft) return draft;
  draft.name = valueById("robotRoleName", draft.name);
  draft.voice = valueById("robotRoleVoice", draft.voice);
  draft.id = valueById("robotDeviceCode", draft.id);
  draft.version = valueById("robotDeviceVersion", draft.version);
  draft.year = valueById("robotDeviceYear", draft.year);
  draft.mode = checkedRadioValue("robotInteractionType", draft.mode);
  draft.model = checkedRadioValue("modelProvider", draft.model) || draft.model;
  const modelMap = { bailian: "百炼", doubao: "豆包", tianyi: "天翼" };
  draft.model = modelMap[draft.model] || draft.model;
  return draft;
}

function applyRobotDraft(robot, draft, allowIdChange = false) {
  if (!robot || !draft) return;
  const name = cleanCell(draft.name) || robot.name || "未命名机器人";
  if (allowIdChange) robot.id = cleanCell(draft.id) || robot.id;
  robot.name = name;
  robot.mode = cleanCell(draft.mode) || "直播";
  robot.voice = cleanCell(draft.voice) || "未配置";
  robot.model = cleanCell(draft.model) || "百炼";
  robot.version = cleanCell(draft.version) || "R版-机器头";
  robot.year = cleanCell(draft.year) || "2026";
  robot.avatar = name.slice(0, 1) || "机";
  robot.scripts = robotAssignedScripts(robot).length;
}

function openCreateRobot(tab = "role") {
  if (!createRobotDraft) createRobotDraft = newCreateRobotDraft();
  createRobotDraft = captureRobotDraftFromDom(createRobotDraft);
  const isRole = tab === "role";
  openModal(`
    <div class="modal full">
      <div class="modal-header">
        <div class="modal-title">创建机器人</div>
        <button class="modal-close" onclick="cancelCreateRobot()">×</button>
      </div>
      <div class="modal-body">
        <div class="modal-tabs">
          <button class="modal-tab ${isRole ? "active" : ""}" onclick="switchCreateRobotTab('role')">角色设定</button>
          <button class="modal-tab ${!isRole ? "active" : ""}" onclick="switchCreateRobotTab('device')">设备管理</button>
        </div>
        ${isRole ? roleSettingForm(createRobotDraft) : deviceForm(createRobotDraft, true)}
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="cancelCreateRobot()">取消</button>
        <button class="btn" onclick="saveCreateRobot()">保存</button>
      </div>
    </div>
  `);
}

function switchCreateRobotTab(tab) {
  createRobotDraft = captureRobotDraftFromDom(createRobotDraft || newCreateRobotDraft());
  openCreateRobot(tab);
}

function cancelCreateRobot() {
  createRobotDraft = null;
  closeModal();
}

function saveCreateRobot() {
  createRobotDraft = captureRobotDraftFromDom(createRobotDraft || newCreateRobotDraft());
  const channelId = phase2State?.snapshot().currentChannelId || "channel-weishi";
  const nextIndex = robots.length + 1;
  const robotId = cleanCell(createRobotDraft.id) || `RBT-${Date.now().toString().slice(-4)}`;
  if (robots.some((item) => String(item.id) === String(robotId))) {
    toast("机器人编码已存在，请更换后再保存");
    return;
  }
  const robot = {
    id: robotId,
    mode: cleanCell(createRobotDraft.mode) || "直播",
    name: cleanCell(createRobotDraft.name) || `新建机器人${nextIndex}`,
    status: "正常",
    voice: cleanCell(createRobotDraft.voice) || "未配置",
    model: cleanCell(createRobotDraft.model) || "百炼",
    version: cleanCell(createRobotDraft.version) || "R版-机器头",
    year: cleanCell(createRobotDraft.year) || "2026",
    scripts: 0,
    keywords: 0,
    executableScriptId: "",
    avatar: (cleanCell(createRobotDraft.name) || "新").slice(0, 1),
    avatarClass: ["avatar-a", "avatar-b", "avatar-c", "avatar-d"][nextIndex % 4],
    skillIds: [],
    showIds: [],
    idleShowIds: [],
    idleInterval: "00:01:00",
    channelId,
    resourceScope: "channel_public",
  };
  robots.unshift(robot);
  createRobotDraft = null;
  closeModal();
  toast("机器人创建信息已保存");
  renderApp();
}

function openRobotEditor(robotId = selectedRobotId, tab = robotEditorTab) {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  if (!robotEditorDrafts[robot.id]) robotEditorDrafts[robot.id] = robotDraftFromRobot(robot);
  robotEditorDrafts[robot.id] = captureRobotDraftFromDom(robotEditorDrafts[robot.id]);
  const draft = robotEditorDrafts[robot.id];
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
        <div class="modal-title">编辑机器人：${robot.id} / ${escapeHtml(draft.name || robot.name)}</div>
        <button class="modal-close" onclick="cancelRobotEditor('${robot.id}')">×</button>
      </div>
      <div class="modal-body">
        <div class="modal-tabs">
          ${tabs.map(([key, label]) => `<button class="modal-tab ${tab === key ? "active" : ""}" onclick="switchRobotEditorTab('${robot.id}', '${key}')">${label}${key === "device" ? handoffMark("机器人版本选项", "设备管理页机器人版本下拉新增 R版-机器头、Z版-机器人、AGV机器人 三个选项。") : ""}${key === "scripts" ? handoffMark("机器人脚本管理页签", "机器人编辑页新增脚本管理页签，用于查看已下发脚本、设置当前执行脚本和移除脚本。") : ""}</button>`).join("")}
        </div>
        ${robotEditorContent(robot, tab, draft)}
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="cancelRobotEditor('${robot.id}')">取消</button>
        <button class="btn" onclick="saveRobotEditor('${robot.id}')">保存</button>
      </div>
    </div>
  `);
}

function switchRobotEditorTab(robotId, tab) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  if (!robotEditorDrafts[robot.id]) robotEditorDrafts[robot.id] = robotDraftFromRobot(robot);
  robotEditorDrafts[robot.id] = captureRobotDraftFromDom(robotEditorDrafts[robot.id]);
  openRobotEditor(robot.id, tab);
}

function cancelRobotEditor(robotId) {
  delete robotEditorDrafts[robotId];
  closeModal();
}

function saveRobotEditor(robotId) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  const draft = captureRobotDraftFromDom(robotEditorDrafts[robot.id] || robotDraftFromRobot(robot));
  applyRobotDraft(robot, draft);
  delete robotEditorDrafts[robot.id];
  closeModal();
  toast("机器人配置已保存");
  renderApp();
}

function returnToRobotTab(robotId, tab = robotEditorTab) {
  openRobotEditor(robotId, tab);
}

function robotResourcePickerReturnType(returnTab = "") {
  const value = String(returnTab || "");
  return value.startsWith("picker:") ? value.replace("picker:", "") : "";
}

function robotResourceEditorCloseAction(returnRobotId = "", returnTab = "", fallbackTab = "") {
  if (!returnRobotId) return "closeModal()";
  const pickerType = robotResourcePickerReturnType(returnTab);
  if (pickerType) return `openRobotResourcePicker('${escapeJs(returnRobotId)}', '${escapeJs(pickerType)}', false)`;
  return `returnToRobotTab('${escapeJs(returnRobotId)}', '${escapeJs(returnTab || fallbackTab)}')`;
}

function finishRobotResourceEditor(returnRobotId = "", returnTab = "", fallbackTab = "") {
  if (!returnRobotId) {
    closeModal();
    renderApp();
    return;
  }
  const pickerType = robotResourcePickerReturnType(returnTab);
  if (pickerType) {
    openRobotResourcePicker(returnRobotId, pickerType, false);
    return;
  }
  returnToRobotTab(returnRobotId, returnTab || fallbackTab);
}

function openRobotScriptEditor(scriptId, robotId = selectedRobotId) {
  closeModal();
  openScriptEditor(scriptId, { type: "robot", robotId, tab: "scripts", label: "机器人脚本页签" });
}

function nextScriptId() {
  const max = scriptFlowScripts.reduce((value, script) => Math.max(value, Number(String(script.id).match(/\d+/)?.[0] || 0)), 0);
  return `SCRIPT-${String(max + 1).padStart(3, "0")}`;
}

function createRobotBlankScript(robotId, returnContext = null) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  const script = {
    id: nextScriptId(),
    name: `${robot.name}-未命名脚本`,
    type: robot.version === "AGV机器人" ? "导览" : "直播",
    anchorType: robot.version === "AGV机器人" ? "tour" : "chat",
    templateName: "空白脚本",
    robotId: robot.id,
    robotName: robot.name,
    channelId: robot.channelId || resourceChannelId("robots", robot.id),
    duration: 30,
    offAirNotice: 3,
    stageCount: 1,
    showCount: 0,
    status: "草稿",
    isTemplate: false,
    updated: currentDateTimeText(),
  };
  scriptFlowScripts.unshift(script);
  closeModal();
  openScriptEditor(script.id, returnContext || { type: "robot", robotId: robot.id, tab: "scripts", label: "机器人脚本页签" });
  toast("已创建空白脚本并绑定当前机器人");
}

function scriptImportTemplates() {
  return [
    { kind: "agv", title: "AGV导览模板", type: "导览", anchorType: "tour", templateName: "AGV导览模板", description: "包含地图ID、点位ID、执行时机，适用于 AGV 机器人导览。" },
    { kind: "commerce", title: "带货主播模板", type: "直播", anchorType: "commerce", templateName: "带货主播模板", description: "包含商品绑定、主推商品、阶段商品讲解与答疑。" },
    { kind: "general", title: "通用主播模板", type: "直播", anchorType: "chat", templateName: "通用主播模板", description: "适用于聊天、才艺、剧目、活动等非导览非带货脚本。" },
  ];
}

function scriptImportTemplate(kind = "general") {
  return scriptImportTemplates().find((item) => item.kind === kind) || scriptImportTemplates()[2];
}

function defaultScriptImportTemplate(robot = null) {
  if (robot?.version === "AGV机器人") return "agv";
  return "general";
}

function downloadScriptImportTemplate(kind = "general") {
  const template = scriptImportTemplate(kind);
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const rows = [
    ["1_脚本基础信息", "脚本名称", "脚本类型", "主播类型"],
    ["示例", `${template.title}导入示例`, template.type, template.anchorType === "commerce" ? "带货主播" : template.anchorType === "tour" ? "导览" : "通用主播"],
    ["2_流程阶段", "阶段名称", "阶段类型", "执行时机"],
    ["示例阶段", template.kind === "agv" ? "AGV_点位讲解" : "开场欢迎", "普通流程", template.kind === "agv" ? "到达后执行" : "顺序执行"],
    ["3_表演单元", "表演名称", "文本", "动作", "结束依据", "执行次数", "等待时长"],
    ["示例单元", "开场欢迎", "欢迎来到直播间。", "微笑点头", "文本结束", "1", "0"],
  ];
  if (template.kind === "commerce") rows.push(["4_商品绑定", "商品ID", "主推商品"]);
  if (template.kind === "agv") rows.push(["4_地图导览", "地图ID", "点位ID", "执行时机"]);
  const content = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  downloadBlob("\ufeff" + content, `${template.title}_${date}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  toast(`${template.title}已下载`);
}

function downloadRobotScriptTemplate(robotId) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  downloadScriptImportTemplate(defaultScriptImportTemplate(robot));
}

function openRobotScriptImport(robotId = "") {
  const robot = robotId ? robots.find((item) => String(item.id) === String(robotId)) : null;
  const templateKind = defaultScriptImportTemplate(robot);
  robotScriptImportContext = { robotId: robotId || "", fileName: "", step: 0, sameName: "rename", includeMap: templateKind === "agv", templateKind, source: robotId ? "robot" : "script-list", error: "" };
  renderRobotScriptImport();
}

function renderRobotScriptImport() {
  const context = robotScriptImportContext;
  const robot = context.robotId ? robots.find((item) => item.id === context.robotId) : null;
  const templates = scriptImportTemplates();
  const template = scriptImportTemplate(context.templateKind);
  const robotOptions = visibleChannelResources(robots, "robots");
  const parsedName = (context.fileName || `${robot?.name || "脚本大库"}导入脚本.xlsx`).replace(/\.xlsx?$/i, "");
  const closeAction = robot ? `returnToRobotTab('${robot.id}','scripts')` : "closeModal();backToScriptList()";
  openModal(`<div class="modal large robot-script-import-modal">
    <div class="modal-header"><div class="modal-title">导入脚本${robot ? ` · ${robot.id} / ${robot.name}` : " · 脚本大库"}</div><button class="modal-close" onclick="${closeAction}">×</button></div>
    <div class="modal-body">
      <div class="robot-import-steps">${["上传文件", "解析校验", "导入预览", "确认导入"].map((label, index) => `<span class="${index <= context.step ? "active" : ""}"><i>${index + 1}</i>${label}</span>`).join("")}</div>
      ${context.error ? `<div class="robot-import-error">${escapeHtml(context.error)}</div>` : ""}
      ${context.step === 0 ? `<div class="script-import-template-grid">
          ${templates.map((item) => `<button class="script-import-template ${context.templateKind === item.kind ? "active" : ""}" type="button" onclick="setRobotScriptImportOption('templateKind','${item.kind}')"><strong>${item.title}</strong><span>${item.description}</span><em>${context.templateKind === item.kind ? "当前选择" : "点击选择"}</em></button>`).join("")}
        </div>
        <div class="robot-script-upload">
          <strong>上传 .xlsx 脚本文件${handoffMark("机器人脚本导入校验", "机器人脚本导入按目标机器人版本选择模板，R/Z 版阻断地图导览，AGV 机器人可继续导览脚本。", "new")}</strong>
          <p>当前模板：${template.title}。模板下载、文件上传、解析预览都在导入入口内完成。</p>
          ${robot ? `<div class="robot-import-lock">目标机器人：<strong>${robot.id} / ${robot.name} / ${robot.version}</strong></div>` : `<label class="robot-import-target">绑定机器人<select class="select" onchange="setRobotScriptImportOption('robotId', this.value)"><option value="">暂不绑定，导入为草稿</option>${robotOptions.map((item) => `<option value="${item.id}" ${item.id === context.robotId ? "selected" : ""}>${item.id} / ${item.name} / ${item.version}</option>`).join("")}</select></label>`}
          <div class="robot-import-actions"><button class="btn secondary" type="button" onclick="downloadScriptImportTemplate('${template.kind}')">下载${template.title}</button><label class="btn">选择文件<input type="file" accept=".xlsx,.xls" onchange="parseRobotScriptImport(this)"></label></div>
        </div>` : `
        <div class="robot-import-summary"><div><span>文件</span><strong>${escapeHtml(context.fileName)}</strong></div><div><span>目标机器人</span><strong>${robot ? `${robot.id} / ${robot.name}` : "暂不绑定"}</strong></div><div><span>模板</span><strong>${template.title}</strong></div><div><span>解析结果</span><strong class="success">基础信息 1 / 阶段 3 / 表演单元 6</strong></div></div>
        <div class="table-wrap"><table class="data-table compact-table"><thead><tr><th>脚本名称</th><th>类型</th><th>阶段</th><th>表演单元</th><th>商品</th><th>地图导览</th><th>校验结果</th></tr></thead><tbody><tr><td>${escapeHtml(parsedName)}</td><td>${template.type}</td><td>3</td><td>6</td><td>${template.kind === "commerce" ? 2 : 0}</td><td>${template.kind === "agv" ? "包含地图与点位" : "无"}</td><td><span class="mini-tag ${robot && template.kind === "agv" && robot.version !== "AGV机器人" ? "red" : "green"}">${robot && template.kind === "agv" && robot.version !== "AGV机器人" ? "版本能力阻断" : "可导入"}</span></td></tr></tbody></table></div>
        <div class="robot-import-options"><label>同名脚本处理<select class="select" onchange="setRobotScriptImportOption('sameName',this.value)"><option value="rename" ${context.sameName === "rename" ? "selected" : ""}>自动重命名</option><option value="overwrite" ${context.sameName === "overwrite" ? "selected" : ""}>覆盖同名脚本</option><option value="skip" ${context.sameName === "skip" ? "selected" : ""}>跳过</option></select></label></div>`}
    </div>
    <div class="modal-footer"><button class="btn secondary" onclick="${closeAction}">取消</button>${context.step > 0 ? `<button class="btn secondary" onclick="robotScriptImportContext.step=0;renderRobotScriptImport()">重新选择</button><button class="btn" onclick="confirmRobotScriptImport()">确认导入</button>` : ""}</div>
  </div>`);
}

function parseRobotScriptImport(input) {
  const file = input.files?.[0];
  if (!file) return;
  robotScriptImportContext.fileName = file.name;
  robotScriptImportContext.step = 2;
  robotScriptImportContext.error = "";
  renderRobotScriptImport();
}

function setRobotScriptImportOption(key, value) {
  robotScriptImportContext[key] = value;
  if (key === "templateKind") robotScriptImportContext.includeMap = value === "agv";
  if (key === "robotId") {
    const robot = robots.find((item) => item.id === value);
    if (robot && robot.version === "AGV机器人") {
      robotScriptImportContext.templateKind = "agv";
      robotScriptImportContext.includeMap = true;
    }
  }
  robotScriptImportContext.error = "";
  renderRobotScriptImport();
}

function confirmRobotScriptImport() {
  const context = robotScriptImportContext;
  const robot = context.robotId ? robots.find((item) => item.id === context.robotId) : null;
  const template = scriptImportTemplate(context.templateKind);
  if (!context.fileName) return;
  if (robot && template.kind === "agv" && robot.version !== "AGV机器人") {
    context.error = `${robot.version}不支持地图和导览配置，请删除导览内容或改用AGV机器人模板。`;
    renderRobotScriptImport();
    return;
  }
  const baseName = context.fileName.replace(/\.xlsx?$/i, "");
  const channelId = robot?.channelId || phase2State?.snapshot().currentChannelId || "channel-weishi";
  const candidateScripts = robot ? robotAssignedScripts(robot) : visibleChannelResources(scriptFlowScripts, "scripts").filter((item) => !item.isTemplate);
  const existing = candidateScripts.find((item) => item.name === baseName);
  if (context.sameName === "skip" && existing) {
    if (robot) returnToRobotTab(robot.id, "scripts");
    else { closeModal(); backToScriptList(); }
    toast("同名脚本已按规则跳过");
    return;
  }
  if (context.sameName === "skip" && !existing) {
    context.error = "当前范围不存在同名脚本，不能使用同名跳过。";
    renderRobotScriptImport();
    return;
  }
  if (robot && existing && context.sameName === "overwrite" && robot.executableScriptId === existing.id && !window.confirm("正在覆盖当前启用脚本，是否继续？")) return;
  const script = existing && context.sameName === "overwrite" ? existing : {
    id: nextScriptId(),
    isTemplate: false,
  };
  Object.assign(script, {
    name: existing && context.sameName === "rename" ? `${baseName}（导入）` : baseName,
    type: template.type,
    anchorType: template.anchorType,
    templateName: template.templateName,
    robotId: robot?.id || "",
    robotName: robot?.name || "",
    channelId,
    duration: 45,
    offAirNotice: 3,
    stageCount: 3,
    showCount: 6,
    status: "草稿",
    updated: currentDateTimeText(),
  });
  if (template.kind === "agv") script.mapId = script.mapId || selectedMapId;
  if (!existing || context.sameName !== "overwrite") scriptFlowScripts.unshift(script);
  if (robot) {
    robot.scripts = robotAssignedScripts(robot).length;
    returnToRobotTab(robot.id, "scripts");
    toast("脚本已导入并绑定当前机器人，保存并下发后才会启用");
    return;
  }
  closeModal();
  backToScriptList();
  toast("脚本已导入大库，后续可编辑后保存并下发机器人");
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

function openRobotWifiSettings(robotId, returnRobotId = "", returnTab = "") {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  const closeAction = returnRobotId ? `returnToRobotTab('${returnRobotId}', '${returnTab || "device"}')` : "closeModal()";
  openModal(`
    <div class="modal medium">
      <div class="modal-header">
        <div class="modal-title">Wi-Fi设置：${robot.id} / ${robot.name}</div>
        <button class="modal-close" onclick="${closeAction}">×</button>
      </div>
      <div class="modal-body">
        ${formInputWithId("robotWifiSsid", "Wi-Fi名称", "请输入SSID", true, robot.wifiSsid || "")}
        ${formInputWithId("robotWifiPassword", "Wi-Fi密码", "请输入密码", true, robot.wifiPassword || "")}
        ${formSelectWithId("robotWifiMode", "连接模式", ["自动连接", "手动连接"], false, robot.wifiMode || "自动连接")}
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="${closeAction}">取消</button>
        <button class="btn" onclick="saveRobotWifiSettings('${robot.id}', '${returnRobotId}', '${returnTab || "device"}')">保存</button>
      </div>
    </div>
  `);
}

function openRobotWifiFromEditor(robotId) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  if (!robotEditorDrafts[robot.id]) robotEditorDrafts[robot.id] = robotDraftFromRobot(robot);
  robotEditorDrafts[robot.id] = captureRobotDraftFromDom(robotEditorDrafts[robot.id]);
  openRobotWifiSettings(robot.id, robot.id, "device");
}

function saveRobotWifiSettings(robotId, returnRobotId = "", returnTab = "device") {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  robot.wifiSsid = valueById("robotWifiSsid", robot.wifiSsid || "");
  robot.wifiPassword = valueById("robotWifiPassword", robot.wifiPassword || "");
  robot.wifiMode = valueById("robotWifiMode", robot.wifiMode || "自动连接");
  toast("Wi-Fi设置已保存");
  if (returnRobotId) returnToRobotTab(returnRobotId, returnTab || "device");
  closeModal();
  renderApp();
}

function robotEditorContent(robot, tab, draft = null) {
  const editableRobot = draft || robot;
  if (tab === "role") return roleSettingForm(editableRobot);
  if (tab === "device") return deviceForm(editableRobot);
  if (tab === "skills") return robotResourceTable(robot, "skills");
  if (tab === "shows") return robotResourceTable(robot, "shows");
  if (tab === "scripts") return robotScriptTable(robot);
  if (tab === "idle") return robotIdleShowTable(robot);
  if (tab === "actions") return robotActionResourceTable(robot);
  if (tab === "vision") return robotManagedResourceTable(robot, "vision");
  return robotManagedResourceTable(robot, "materials");
}

function roleSettingForm(robot = {}) {
  const showAdvancedConfig = canShowAdvancedRobotConfig();
  const modelValue = robot.model === "豆包" ? "doubao" : robot.model === "天翼" ? "tianyi" : "bailian";
  return `
    <div class="form-grid">
      <div>
        <div class="form-section">
          <h3 class="section-title">角色信息</h3>
          ${formInputWithId("robotRoleName", "名称", "请输入角色名称", true, robot.name || "")}
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
          <div class="form-row"><div class="form-label required">选择音色</div><div><input id="robotRoleVoice" class="input" list="voiceOptions" placeholder="请选择音色" value="${escapeHtml(robot.voice || "")}" /><datalist id="voiceOptions">${voiceOptions().map((v) => `<option value="${v}"></option>`).join("")}</datalist></div></div>
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
        ${showAdvancedConfig ? `<div class="form-section">
          <h3 class="section-title">大模型配置</h3>
          <div class="form-row">
            <div class="form-label"></div>
            <div class="radio-line">
              <label><input name="modelProvider" type="radio" value="bailian" ${modelValue === "bailian" ? "checked" : ""} onchange="showModelPanel(this.value)" /> 百炼</label>
              <label><input name="modelProvider" type="radio" value="doubao" ${modelValue === "doubao" ? "checked" : ""} onchange="showModelPanel(this.value)" /> 豆包</label>
              <label><input name="modelProvider" type="radio" value="tianyi" ${modelValue === "tianyi" ? "checked" : ""} onchange="showModelPanel(this.value)" /> 天翼</label>
            </div>
          </div>
          <div id="model-panel">
            ${bailianAgentField()}
          </div>
        </div>` : ""}
      </div>
    </div>
  `;
}

function deviceForm(robot = null) {
  const currentRobot = robot || { id: "", version: "R版-机器头", year: "2026", executableScriptId: "SCRIPT-001", mode: "直播" };
  const showAdvancedConfig = canShowAdvancedRobotConfig();
  const wifiRobot = robots.some((item) => String(item.id) === String(currentRobot.id));
  return `
    <div class="form-grid">
      <div>
        <div class="form-section">
          <h3 class="section-title">硬件信息</h3>
          ${formSelectWithId("robotDeviceModel", "机器人型号", ["请选择机器人型号", ...robotVersionOptions], true, currentRobot.version)}
          ${formSelectWithId("robotDeviceVersion", "机器人版本", ["请选择机器人版本", ...robotVersionOptions], true, currentRobot.version)}
          <div class="form-row"><div class="form-label required">机器人年份</div><div><input id="robotDeviceYear" class="input" value="${escapeHtml(currentRobot.year || "2026")}" readonly /><div class="upload-hint">根据创建年份自动获取，本原型按 2026 填充。</div></div></div>
          ${formInputWithId("robotDeviceCode", "机器人编码", "请输入机器人编码", true, currentRobot.id || "")}
          ${radioRow("场景类型", ["聊天", "电商"], "sceneType", "聊天", true)}
          ${formSelect("应用场景", ["请选择领域", "情感陪伴", "语音娱乐", "企业服务", "导购"])}
        </div>
        <div class="form-section">
          <h3 class="section-title">护照信息</h3>
          ${formInput("护照编号", "请输入...")}
          ${formInput("护照有效期", "年 / 月 / 日")}
        </div>
        ${showAdvancedConfig ? `<div class="form-section">
          <h3 class="section-title">售卖与租赁</h3>
          <div class="form-row"><div class="form-label">领养状态</div><div><span class="switch"></span> <span style="color:red;">关闭领养(售卖)中</span></div></div>
          ${formInput("领养价格", "请输入...", true, "元")}
          ${formInput("领养定金", "请输入...", true, "元")}
          <div class="form-row"><div class="form-label">租赁状态</div><div><span class="switch"></span> <span style="color:red;">关闭租赁中</span></div></div>
          ${formInput("租赁价格", "请输入...", false, "元 / 天")}
          ${formInput("租赁押金", "请输入...", false, "元")}
        </div>` : ""}
      </div>
      <div>
        <div class="form-section">
          <h3 class="section-title">运行配置</h3>
          ${formInput("开机时间", "◷ 请选择时间")}
          ${formInput("关机时间", "◷ 请选择时间")}
          ${wifiRobot ? `<div class="form-row"><div class="form-label">网络配置</div><div><button class="btn secondary small" type="button" onclick="openRobotWifiFromEditor('${escapeJs(currentRobot.id)}')">Wi-Fi设置</button><div class="upload-hint">${escapeHtml(currentRobot.wifiSsid || "未配置 Wi-Fi")}</div></div></div>` : ""}
        </div>
        <div class="form-section">
          <h3 class="section-title">交互配置</h3>
          ${radioRow("机器人类型", ["直播", "表演", "导览"], "robotInteractionType", currentRobot.mode || "直播")}
          ${radioRow("交互模式", ["对话模式", "问答模式"], "interactionMode", "对话模式", true)}
          ${formTextarea("唤醒词", "如：用英文逗号隔开，如：小央小央，星辰星辰")}
          ${radioRow("灵敏度", ["低", "中", "高"], "sensitivity", "中")}
          ${formTextarea("唤醒垫词", "用英文逗号隔开，如：hello,hi,hey")}
          ${formTextarea("回答垫词", "用英文逗号隔开，如：ok,好的,明白了")}
        </div>
        <div class="form-section">
          <h3 class="section-title">动作配置</h3>
          ${formSelect("闲时动作", ["请选择闲时动作", ...actions.map((action) => action.name)])}
          ${formSelect("讲话时动作", ["请选择讲话时动作", ...actions.map((action) => action.name)])}
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
          ${!isSkill ? `<button class="btn secondary small" type="button" onclick="openShowImportModal('${robot.id}', '${type}')">批量导入</button>${handoffMark("表演批量导入", "机器人表演清单新增批量导入入口，同表演管理大库批量功能，支持模板下载和批量导入完整表演。")}` : ""}
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
        <strong>脚本清单：${scripts.length}个${handoffMark("机器人脚本页签二期入口", "机器人详情里的脚本页签承接本次二期脚本新增、导入、模板下载、版本能力校验和启用冲突确认。", "new")}</strong>
        <div class="robot-script-actions"><span>执行开关同一时间只能打开一个。${handoffMark("执行脚本切换规则", "同一机器人同一时间只能启用一个脚本；本期新增或导入后的脚本默认不启用，手动切换时提示确认。", "info")}</span><button class="btn secondary small" type="button" onclick="openRobotScriptImport('${robot.id}')">导入脚本</button><button class="btn small" type="button" onclick="createRobotBlankScript('${robot.id}')">新增脚本</button></div>
      </div>
      ${handoffNote("从机器人详情新增或导入的脚本自动绑定当前机器人；R版、Z版不可配置地图和导览，AGV机器人可继续。", "二期脚本入口", "新增、导入、模板下载和版本能力校验均在当前机器人上下文完成。", "changed")}
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
	                            <button class="link" type="button" onclick="openRobotScriptEditor('${script.id}', '${robot.id}')">编辑</button>
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
        ${options.map((option) => `<label><input type="radio" name="${name}" value="${escapeHtml(option)}" ${option === selected ? "checked" : ""} /> ${option}</label>`).join("")}
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
  if (type === "skills") return [...skills, ...userRobotSkills];
  if (type === "shows") return [...shows, ...userRobotShows];
  const config = robotResourceConfig(type);
  return config ? config.source() : [];
}

function startRobotResourceDrag(type, index) {
  draggingRobotResource = { type, index };
}

function dropRobotResource(robotId, type, index) {
  if (!draggingRobotResource || draggingRobotResource.type !== type || draggingRobotResource.index === index) return;
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  const key = robotResourceIdKey(type);
  const ids = robot[key] || [];
  const [moving] = ids.splice(draggingRobotResource.index, 1);
  ids.splice(index, 0, moving);
  draggingRobotResource = null;
  toast("清单顺序已调整");
  returnToRobotTab(robot.id, robotTabForResourceType(type));
}

function openRobotLocalResourceModal(robotId, type, rawId = "", returnMode = "") {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  const isSkill = type === "skills";
  const source = robotResourceSource(type);
  const config = robotResourceConfig(type);
  const item = source.find((row) => String(config?.itemId(row) ?? row.id) === String(rawId));
  const returnTab = returnMode === "picker" ? `picker:${type}` : robotTabForResourceType(type);
  if (isSkill) {
    openSkillModal(item?.name || "", robot.id, returnTab);
    return;
  }
  if (type === "actions") {
    openActionModal(item?.id || "", robot.id, returnTab);
    return;
  }
  if (type === "actionGroups") {
    openActionGroupModal(item?.id || "", robot.id, returnTab);
    return;
  }
  if (type === "vision") {
    openFaceModal(item?.recognitionId || "", robot.id, returnTab);
    return;
  }
  if (type === "materials") {
    openMaterialModal(item?.id || "", robot.id, returnTab);
    return;
  }
  openShowModal(item?.name || "", Boolean(item), robot.id, returnTab);
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

function openRobotResourcePicker(robotId, type, resetSelection = true) {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  const config = robotResourceConfig(type);
  const isSkill = type === "skills";
  const returnTab = robotTabForResourceType(type);
  const label = config?.label || (isSkill ? "技能" : "表演");
  const createLabel = config?.createLabel || `新增${label}`;
  const selectedIds = new Set(robotResourceIds(robot, type));
  const selectedIdTexts = Array.from(selectedIds).map(String);
  const source = config ? config.publicSource(robot) : isSkill ? skills : shows;
  const resourceType = type === "skills" ? "skills" : type === "shows" ? "shows" : type === "actions" ? "actions" : type === "actionGroups" ? "actionGroups" : type === "vision" ? "faces" : type;
  const rows = type === "actions"
    ? visiblePlatformActions({ robot, filters: robotSingleActionFilters, items: source })
    : visibleChannelResources(source.filter((item) => item.owner === "公共模板"), resourceType, type === "vision" ? "recognitionId" : "id");
  if (resetSelection) robotResourcePickerSelection = [];
  const selectableRows = rows.filter((item) => !selectedIdTexts.includes(String(config?.itemId(item) ?? item.id)));
  const allChecked = selectableRows.length > 0 && selectableRows.every((item) => robotResourcePickerSelection.includes(String(config?.itemId(item) ?? item.id)));
  const allowCreate = config?.allowCreate !== false;
  const pickerTitle = config?.pickerTitle || `绑定大库${label}`;
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">${pickerTitle}</div>
        <button class="modal-close" onclick="returnToRobotTab('${robot.id}', '${returnTab}')">×</button>
      </div>
      <div class="modal-body">
        <div class="toolbar"><div class="filters">${config?.pickerFilters ? config.pickerFilters(robot.id, type) : `<input class="input w-220" placeholder="ID/名称" />${type === "vision" ? `<select class="select w-150"><option>来源</option><option>后台</option></select>` : ""}`}${allowCreate ? `<button class="btn small" onclick="openRobotLocalResourceModal('${robot.id}', '${type}', '', 'picker')">＋ ${createLabel}</button>` : ""}</div><span class="muted-text">已选择 ${robotResourcePickerSelection.length} 个</span></div>
        <div class="table-wrap">
          <table class="data-table compact-table">
            ${config?.pickerHead ? config.pickerHead(robot.id, type, allChecked) : `<thead><tr><th><input type="checkbox" ${allChecked ? "checked" : ""} onchange="selectAllRobotResources('${robot.id}', '${type}', this.checked)" /></th><th>ID</th><th>${isSkill ? "技能名称" : "表演名称"}</th><th>归属</th><th>${isSkill ? "触发关键词" : "单元数量"}</th><th>创建时间</th><th>操作</th></tr></thead>`}
            <tbody>
              ${rows
                .map((item) => {
                  const itemId = config?.itemId(item) ?? item.id;
                  const selected = selectedIdTexts.includes(String(itemId));
                  const pending = robotResourcePickerSelection.includes(String(itemId));
                  const checkbox = `<input type="checkbox" ${selected ? "disabled" : ""} ${pending ? "checked" : ""} onchange="toggleRobotResourceSelection('${robot.id}', '${type}', '${escapeJs(itemId)}', this.checked)" />`;
                  const op = selected ? '<span class="mini-tag gray">已添加</span>' : pending ? '<span class="mini-tag green">待添加</span>' : `<button class="link" onclick="toggleRobotResourceSelection('${robot.id}', '${type}', '${escapeJs(itemId)}', true)">选择</button>`;
                  return config?.pickerRow ? config.pickerRow(item, op, checkbox) : `<tr><td>${checkbox}</td><td>${item.id}</td><td class="left"><strong>${item.name}</strong></td><td>${item.owner}</td><td>${isSkill ? `<span class="tag">${item.trigger}</span>` : item.units}</td><td>${item.created}</td><td>${op}</td></tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn secondary" onclick="returnToRobotTab('${robot.id}', '${returnTab}')">取消</button><button class="btn" onclick="saveRobotResourcePickerSelection('${robot.id}', '${type}')">确定添加</button></div>
    </div>
  `);
}

function toggleRobotResourceSelection(robotId, type, rawId, checked) {
  const id = String(rawId);
  if (checked && !robotResourcePickerSelection.includes(id)) robotResourcePickerSelection.push(id);
  if (!checked) robotResourcePickerSelection = robotResourcePickerSelection.filter((item) => item !== id);
  openRobotResourcePicker(robotId, type, false);
}

function selectAllRobotResources(robotId, type, checked) {
  const robot = robots.find((item) => item.id === robotId);
  const config = robotResourceConfig(type);
  const selectedIdTexts = robot && config ? robotResourceIds(robot, type).map(String) : [];
  const source = config ? config.publicSource(robot) : type === "skills" ? skills : shows;
  const resourceType = type === "skills" ? "skills" : type === "shows" ? "shows" : type === "actions" ? "actions" : type === "actionGroups" ? "actionGroups" : type === "vision" ? "faces" : type;
  robotResourcePickerSelection = checked
    ? (type === "actions" ? visiblePlatformActions({ robot, filters: robotSingleActionFilters, items: source }) : visibleChannelResources(source.filter((item) => item.owner === "公共模板"), resourceType, type === "vision" ? "recognitionId" : "id"))
        .map((item) => String(config?.itemId(item) ?? item.id))
        .filter((id) => !selectedIdTexts.includes(id))
    : [];
  openRobotResourcePicker(robotId, type, false);
}

function saveRobotResourcePickerSelection(robotId, type) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  const key = robotResourceIdKey(type);
  if (!Array.isArray(robot[key])) robot[key] = [];
  const before = robot[key].length;
  robotResourcePickerSelection.forEach((rawId) => {
    const id = normalizeRobotResourceId(type, rawId);
    if (!robot[key].includes(id)) robot[key].push(id);
  });
  const added = robot[key].length - before;
  robotResourcePickerSelection = [];
  toast(added ? `已添加 ${added} 个资源` : "请选择要添加的资源");
  if (added) returnToRobotTab(robot.id, robotTabForResourceType(type));
  else openRobotResourcePicker(robot.id, type, false);
}

function addRobotResource(robotId, type, rawId) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  const id = normalizeRobotResourceId(type, rawId);
  const key = robotResourceIdKey(type);
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
  const id = normalizeRobotResourceId(type, rawId);
  const key = robotResourceIdKey(type);
  robot[key] = (robot[key] || []).filter((item) => item !== id);
  if (type === "shows") robot.idleShowIds = (robot.idleShowIds || []).filter((item) => item !== id);
  toast("已移除绑定");
  returnToRobotTab(robot.id, robotTabForResourceType(type));
}

function robotTabForResourceType(type) {
  if (type === "actionGroups") return "actions";
  return type;
}

function robotActionResourceTable(robot) {
  const isSingle = robotActionTab === "single";
  const type = isSingle ? "actions" : "actionGroups";
  return `
    <div class="library-tabs compact-library-tabs">
      <button class="library-tab ${isSingle ? "active" : ""}" type="button" onclick="robotActionTab='single';returnToRobotTab('${robot.id}', 'actions')">单一动作</button>
      <button class="library-tab ${!isSingle ? "active" : ""}" type="button" onclick="robotActionTab='group';returnToRobotTab('${robot.id}', 'actions')">多动作组合</button>
    </div>
    ${robotManagedResourceTable(robot, type)}
  `;
}

function robotManagedResourceTable(robot, type) {
  const config = robotResourceConfig(type);
  const selected = type === "actions"
    ? robotSelectedResources(robot, type).filter((action) => actionMatchesFilters(action, robotSingleActionFilters))
    : robotSelectedResources(robot, type);
  const createLabel = config.createLabel || `新增${config.label}`;
  const allowCreate = config.allowCreate !== false;
  const pickerLabel = config.pickerButtonLabel || "绑定大库";
  const note = config.note || "新增资源会保存为当前机器人的用户模板；绑定大库只关联公共模板，不会改动大库资源。";
  const filtersHtml = config.resourceFilters ? config.resourceFilters(robot.id, type) : `<input class="input w-180" placeholder="ID/名称" />${config.filters}`;
  return `
    <div class="robot-resource-layout">
      <div class="robot-resource-head">
        <strong>${config.countLabel}：${selected.length}个</strong>
        <div class="filters">
          ${filtersHtml}
          ${allowCreate ? `<button class="btn small" type="button" onclick="openRobotLocalResourceModal('${robot.id}', '${type}')">＋ ${createLabel}</button>` : ""}
          <button class="btn secondary small" type="button" onclick="openRobotResourcePicker('${robot.id}', '${type}')">${pickerLabel}</button>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table compact-table ${config.tableClass || ""}">
          ${config.head(robot)}
          <tbody>
            ${selected.length ? selected.map((item, index) => config.row(robot, item, index)).join("") : `<tr><td colspan="${config.colspan}">暂无数据</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="flow-note blue">${note}</div>
    </div>
  `;
}

function robotSingleActionFilterControls(robotId = "", type = "actions", picker = false) {
  const typeOptions = ["全部类型", "站姿", "坐姿", "站坐通用"];
  const postureOptions = ["全部姿态", "站姿", "坐姿", "站坐通用"];
  return `
    <input class="input w-180" value="${escapeHtml(robotSingleActionFilters.keyword)}" placeholder="ID/名称" oninput="setRobotSingleActionFilter('keyword', this.value, '${robotId}', '${type}', ${picker})" />
    <select class="select w-120" onchange="setRobotSingleActionFilter('type', this.value, '${robotId}', '${type}', ${picker})">${typeOptions.map((value) => `<option ${robotSingleActionFilters.type === value ? "selected" : ""}>${value}</option>`).join("")}</select>
    <select class="select w-120" onchange="setRobotSingleActionFilter('posture', this.value, '${robotId}', '${type}', ${picker})">${postureOptions.map((value) => `<option ${robotSingleActionFilters.posture === value ? "selected" : ""}>${value}</option>`).join("")}</select>
  `;
}

function setRobotSingleActionFilter(key, value, robotId = "", type = "actions", picker = false) {
  robotSingleActionFilters[key] = value;
  if (picker && robotId) openRobotResourcePicker(robotId, type, false);
  else renderApp();
}

function robotResourceConfig(type) {
  const configs = {
    skills: {
      label: "技能",
      countLabel: "技能清单",
      idKey: "skillIds",
      source: () => [...skills, ...userRobotSkills],
      publicSource: () => skills,
      itemId: (item) => item.id,
    },
    shows: {
      label: "表演",
      countLabel: "表演清单",
      idKey: "showIds",
      source: () => [...shows, ...userRobotShows],
      publicSource: () => shows,
      itemId: (item) => item.id,
    },
    actions: {
      label: "动作",
      countLabel: "已下发动作清单",
      idKey: "actionIds",
      allowCreate: false,
      pickerButtonLabel: "添加已下发动作",
      pickerTitle: "添加已下发动作",
      note: "单一动作为平台下发只读资源；这里只能查看和添加引用，移除只解除当前机器人绑定。",
      filters: "",
      colspan: 8,
      source: () => actions,
      publicSource: () => actions,
      itemId: (item) => item.id,
      resourceFilters: (robotId, type) => robotSingleActionFilterControls(robotId, type, false),
      pickerFilters: (robotId, type) => robotSingleActionFilterControls(robotId, type, true),
      head: () => `<thead><tr><th>排序</th><th>ID</th><th>动作名称</th><th>动作描述</th><th>动作类型</th><th>适用姿态</th><th>动作时长（秒）</th><th>操作</th></tr></thead>`,
      row: (robot, item, index) => `<tr draggable="true" ondragstart="startRobotResourceDrag('actions', ${index})" ondragover="event.preventDefault()" ondrop="dropRobotResource('${robot.id}', 'actions', ${index})"><td><span class="drag-handle">☰</span></td><td>${item.id}</td><td>${item.name}</td><td>${item.desc || ""}</td><td>${item.type || item.posture}</td><td>${item.posture}</td><td>${item.duration}</td><td><button class="link danger" onclick="removeRobotResource('${robot.id}', 'actions', '${item.id}')">移除</button></td></tr>`,
      pickerHead: (robotId, type, allChecked) => `<thead><tr><th><input type="checkbox" ${allChecked ? "checked" : ""} onchange="selectAllRobotResources('${robotId}', '${type}', this.checked)" /></th><th>动作ID</th><th>动作名称</th><th>动作描述</th><th>适用姿态</th><th>动作时长</th><th>创建时间</th><th>操作</th></tr></thead>`,
      pickerRow: (item, op, checkbox) => `<tr><td>${checkbox}</td><td>${item.id}</td><td>${item.name}</td><td>${item.desc || ""}</td><td>${item.posture}</td><td>${item.duration}s</td><td>${item.created}</td><td>${op}</td></tr>`,
    },
    actionGroups: {
      label: "动作组",
      createLabel: "新增动作组",
      countLabel: "已绑定动作组",
      idKey: "actionGroupIds",
      filters: `<select class="select w-120"><option>姿态</option><option>站姿</option><option>坐姿</option></select><select class="select w-120"><option>启用</option><option>停用</option></select>`,
      colspan: 8,
      source: () => [...actionGroups, ...userRobotActionGroups],
      publicSource: () => actionGroups,
      itemId: (item) => item.id,
      head: () => `<thead><tr><th>排序</th><th>ID</th><th>动作组名称</th><th>动作组描述</th><th>动作类型</th><th>动作组时长（秒）</th><th>创建时间</th><th>操作</th></tr></thead>`,
      row: (robot, item, index) => `<tr draggable="true" ondragstart="startRobotResourceDrag('actionGroups', ${index})" ondragover="event.preventDefault()" ondrop="dropRobotResource('${robot.id}', 'actionGroups', ${index})"><td><span class="drag-handle">☰</span></td><td>${item.id}</td><td>${item.name}</td><td>${item.desc || ""}</td><td>${item.type || item.posture}</td><td>${item.duration}</td><td>${item.created}</td><td><button class="link" onclick="openRobotLocalResourceModal('${robot.id}', 'actionGroups', '${item.id}')">编辑</button><button class="link danger" onclick="removeRobotResource('${robot.id}', 'actionGroups', '${item.id}')">移除</button></td></tr>`,
      pickerHead: (robotId, type, allChecked) => `<thead><tr><th><input type="checkbox" ${allChecked ? "checked" : ""} onchange="selectAllRobotResources('${robotId}', '${type}', this.checked)" /></th><th>动作组ID</th><th>动作组名称</th><th>动作组描述</th><th>适用姿态</th><th>动作组时长</th><th>创建时间</th><th>操作</th></tr></thead>`,
      pickerRow: (item, op, checkbox) => `<tr><td>${checkbox}</td><td>${item.id}</td><td>${item.name}</td><td>${item.desc || ""}</td><td>${item.posture}</td><td>${item.duration}s</td><td>${item.created}</td><td>${op}</td></tr>`,
    },
    vision: {
      label: "视觉",
      createLabel: "新增视觉",
      countLabel: "已绑定视觉",
      idKey: "faceIds",
      filters: `<select class="select w-120"><option>来源</option><option>后台</option><option>机器人自建</option></select>`,
      colspan: 12,
      tableClass: "face-table",
      source: () => [...faces, ...userRobotFaces],
      publicSource: () => faces,
      itemId: (item) => item.recognitionId,
      head: () => `<thead><tr><th>排序</th><th>序号</th><th>识别人ID</th><th>视觉文件</th><th>识别人名称</th><th>昵称</th><th>出生年月</th><th>星座</th><th>性别</th><th>职业</th><th>创建时间</th><th>操作</th></tr></thead>`,
      row: (robot, item, index) => `<tr draggable="true" ondragstart="startRobotResourceDrag('vision', ${index})" ondragover="event.preventDefault()" ondrop="dropRobotResource('${robot.id}', 'vision', ${index})"><td><span class="drag-handle">☰</span></td><td>${index + 1}</td><td>${item.recognitionId}</td><td><span class="avatar-img ${item.avatarClass}">${item.avatar || item.name.slice(0, 1)}</span></td><td>${item.name}</td><td>${item.nickname || ""}</td><td>${item.birthday || ""}</td><td>${item.zodiac || ""}</td><td>${item.gender || ""}</td><td class="left">${item.job || ""}</td><td>${item.created}</td><td><button class="link" onclick="openRobotLocalResourceModal('${robot.id}', 'vision', '${item.recognitionId}')">编辑</button><button class="link danger" onclick="removeRobotResource('${robot.id}', 'vision', '${item.recognitionId}')">移除</button></td></tr>`,
      pickerHead: (robotId, type, allChecked) => `<thead><tr><th><input type="checkbox" ${allChecked ? "checked" : ""} onchange="selectAllRobotResources('${robotId}', '${type}', this.checked)" /></th><th>序号</th><th>识别人ID</th><th>视觉文件</th><th>识别人名称</th><th>昵称</th><th>出生年月</th><th>星座</th><th>性别</th><th>职业</th><th>创建时间</th><th>来源</th><th>操作</th></tr></thead>`,
      pickerRow: (item, op, checkbox) => `<tr><td>${checkbox}</td><td>${item.id}</td><td>${item.recognitionId}</td><td><span class="avatar-img ${item.avatarClass}">${item.avatar}</span></td><td>${item.name}</td><td>${item.nickname || ""}</td><td>${item.birthday || ""}</td><td>${item.zodiac || ""}</td><td>${item.gender || ""}</td><td class="left">${item.job || ""}</td><td>${item.created}</td><td>${item.source}</td><td>${op}</td></tr>`,
    },
    materials: {
      label: "素材",
      createLabel: "上传音频",
      countLabel: "已绑定素材",
      idKey: "materialIds",
      filters: "",
      colspan: 7,
      tableClass: "material-table",
      source: () => [...materials, ...userRobotMaterials],
      publicSource: () => materials,
      itemId: (item) => item.id,
      head: () => `<thead><tr><th>排序</th><th>ID</th><th>文件名称</th><th>试听</th><th>上传日期</th><th>标签</th><th>操作</th></tr></thead>`,
      row: (robot, item, index) => `<tr draggable="true" ondragstart="startRobotResourceDrag('materials', ${index})" ondragover="event.preventDefault()" ondrop="dropRobotResource('${robot.id}', 'materials', ${index})"><td><span class="drag-handle">☰</span></td><td>${item.id}</td><td>${item.fileName}</td><td>${audioPlayerHtml(item.duration)}</td><td>${item.uploaded}</td><td>${item.tag || ""}</td><td><button class="link" onclick="openRobotLocalResourceModal('${robot.id}', 'materials', '${item.id}')">编辑</button><button class="link danger" onclick="removeRobotResource('${robot.id}', 'materials', '${item.id}')">移除</button></td></tr>`,
      pickerHead: (robotId, type, allChecked) => `<thead><tr><th><input type="checkbox" ${allChecked ? "checked" : ""} onchange="selectAllRobotResources('${robotId}', '${type}', this.checked)" /></th><th>ID</th><th>文件名称</th><th>试听</th><th>上传日期</th><th>标签</th><th>操作</th></tr></thead>`,
      pickerRow: (item, op, checkbox) => `<tr><td>${checkbox}</td><td>${item.id}</td><td>${item.fileName}</td><td>${audioPlayerHtml(item.duration)}</td><td>${item.uploaded}</td><td>${item.tag || ""}</td><td>${op}</td></tr>`,
    },
  };
  return configs[type];
}

function robotResourceIdKey(type) {
  return robotResourceConfig(type)?.idKey || (type === "skills" ? "skillIds" : "showIds");
}

function robotResourceIds(robot, type) {
  const key = robotResourceIdKey(type);
  if (!Array.isArray(robot[key])) {
    const config = robotResourceConfig(type);
    const userItems = config ? config.source().filter((item) => item.robotId === robot.id && item.scope === "robot-user-template") : [];
    robot[key] = userItems.map((item) => config.itemId(item));
  }
  return robot[key] || [];
}

function robotSelectedResources(robot, type) {
  const config = robotResourceConfig(type);
  if (!config) return [];
  const baseSource = config.source().filter((item) => item.scope !== "robot-user-template" || item.robotId === robot.id);
  const source = type === "actions" ? visiblePlatformActions({ robot, items: baseSource }) : baseSource;
  return robotResourceIds(robot, type).map((id) => source.find((item) => String(config.itemId(item)) === String(id))).filter(Boolean);
}

function normalizeRobotResourceId(type, rawId) {
  if (type === "skills" || type === "shows" || type === "materials") {
    return Number.isNaN(Number(rawId)) ? rawId : Number(rawId);
  }
  return rawId;
}

function bindRobotResourceId(robotId, type, rawId) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  const key = robotResourceIdKey(type);
  const id = normalizeRobotResourceId(type, rawId);
  if (!Array.isArray(robot[key])) robot[key] = [];
  if (!robot[key].includes(id)) robot[key].push(id);
}

function openRobotIdlePicker(robotId) {
  const robot = robots.find((item) => item.id === robotId) || robots[0];
  const boundShows = shows.filter((show) => (robot.showIds || []).includes(show.id));
  openModal(`
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">添加闲时表演</div>
        <button class="modal-close" onclick="returnToRobotTab('${robot.id}', 'idle')">×</button>
      </div>
      <div class="modal-body">
        <div class="table-wrap">
          <table class="data-table compact-table">
            <thead><tr><th>ID</th><th>表演名称</th><th>归属</th><th>单元数量</th><th>操作</th></tr></thead>
            <tbody>${boundShows.map((show) => `<tr><td>${show.id}</td><td class="left"><strong>${show.name}</strong></td><td>${show.owner}</td><td>${show.units}</td><td><button class="link" onclick="addRobotIdleShow('${robot.id}', ${show.id})">添加</button></td></tr>`).join("") || `<tr><td colspan="5">请先在表演管理中为机器人绑定表演。</td></tr>`}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer"><button class="btn" onclick="returnToRobotTab('${robot.id}', 'idle')">完成</button></div>
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
  returnToRobotTab(robot.id, "idle");
}

function removeRobotIdleShow(robotId, index) {
  const robot = robots.find((item) => item.id === robotId);
  if (!robot) return;
  robot.idleShowIds.splice(index, 1);
  toast("已移除闲时表演");
  returnToRobotTab(robot.id, "idle");
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

function openRoomModal(resetDraft = false) {
  if (resetDraft) roomModalDraft = { account: "" };
  const selected = roles.find((role) => role.value === selectedRoomRoleValue) || roles[1];
  const availableScripts = roomAvailableScripts(selected);
  if (!selectedRoomScriptId || !availableScripts.some((script) => script.id === selectedRoomScriptId)) {
    selectedRoomScriptId = availableScripts[0]?.id || "";
  }
  const selectedScript = scriptFlowScripts.find((script) => script.id === selectedRoomScriptId);
  const accountValue = roomModalDraft.account || selected.account;
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
	          <div class="form-row"><div class="form-label required">直播账号ID</div><div><input id="roomAccount" class="input" value="${escapeHtml(accountValue)}" oninput="roomModalDraft.account=this.value" /></div></div>
          <div class="form-row top"><div class="form-label">直播封面</div><div><div id="roomCover" class="cover-img ${selected.avatarClass}">${selected.cover}</div><div class="upload-hint" style="margin-top:10px;">(推荐尺寸：720x1280)</div></div></div>
          <div class="form-row top"><div class="form-label">直播间简介</div><div><textarea class="textarea" placeholder="请输入，30字以内..."></textarea><div style="text-align:right;color:#8b96a5;">0/30</div></div></div>
          <div class="form-row"><div class="form-label required">选择开播时间</div><div><span class="date-range"><input type="datetime-local" /><span>至</span><input type="datetime-local" /></span><div class="warning-strip">起止时间不能超过 7 天</div><div class="error-text">请选择开播时间</div></div></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="saveRoomModal()">保存</button>
      </div>
    </div>
  `);
}

function saveRoomModal() {
  const role = roles.find((item) => item.value === selectedRoomRoleValue) || roles[1];
  const now = currentDateTimeText() + ":00";
  const room = {
    seq: Math.max(0, ...rooms.map((item) => Number(item.seq) || 0)) + 1,
    id: `ROOM-${Date.now().toString().slice(-5)}`,
    status: "未开始",
    start: now,
    end: now,
    type: "机器人",
    account: cleanCell(document.getElementById("roomAccount")?.value) || role.id,
    roomId: `LIVE-${Date.now().toString().slice(-5)}`,
    role: role.name,
    cover: role.cover,
    avatarClass: role.avatarClass,
    live: false,
    channelId: phase2State?.snapshot().currentChannelId || "channel-weishi",
    resourceScope: "channel_public",
    scriptId: selectedRoomScriptId,
  };
  rooms.unshift(room);
  roomModalDraft = { account: "" };
  closeModal();
  toast("虚拟带货直播间已保存");
  renderApp();
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
  roomModalDraft.account = role.account;
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
      <span>${script.templateName} · ${script.type} · 可选 ${count} 个</span>
    </div>
  `;
}

function roomAvailableScripts(role) {
  const channelId = phase2State?.snapshot().currentChannelId || "channel-weishi";
  return scriptFlowScripts.filter((script) => !script.isTemplate && script.templateName === role.templateName && (script.channelId || resourceChannelId("scripts", script.id)) === channelId);
}

function robotAssignedScripts(robot) {
  return scriptFlowScripts.filter((script) => {
    if (script.isTemplate) return false;
    return (script.channelId || resourceChannelId("scripts", script.id)) === (robot.channelId || resourceChannelId("robots", robot.id)) && (script.robotId === robot.id || script.robotName === robot.name || script.id === robot.executableScriptId);
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
    returnToRobotTab(robot.id, "scripts");
    return;
  }
  if (robot.executableScriptId) {
    const current = scriptFlowScripts.find((item) => item.id === robot.executableScriptId);
    const next = scriptFlowScripts.find((item) => item.id === scriptId);
    openModal(`<div class="modal medium"><div class="modal-header"><div class="modal-title">切换当前执行脚本</div><button class="modal-close" onclick="returnToRobotTab('${robot.id}','scripts')">×</button></div><div class="modal-body"><div class="confirm-copy">当前已启用“${escapeHtml(current?.name || robot.executableScriptId)}”。启用“${escapeHtml(next?.name || scriptId)}”后，原脚本将自动停用，是否继续？</div></div><div class="modal-footer"><button class="btn secondary" onclick="returnToRobotTab('${robot.id}','scripts')">取消</button><button class="btn" onclick="confirmRobotExecutionScript('${robot.id}','${scriptId}')">确认切换</button></div></div>`);
    return;
  }
  confirmRobotExecutionScript(robot.id, scriptId);
}

function confirmRobotExecutionScript(robotId, scriptId) {
  const robot = robots.find((item) => item.id === robotId);
  const script = scriptFlowScripts.find((item) => item.id === scriptId);
  if (!robot || !script) return;
  const error = validateScriptCapability(script, robot);
  if (error) {
    toast(error);
    returnToRobotTab(robot.id, "scripts");
    return;
  }
  robot.executableScriptId = scriptId;
  toast("已设为当前执行脚本，其他脚本已自动关闭");
  returnToRobotTab(robot.id, "scripts");
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
  returnToRobotTab(robot.id, "scripts");
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
              <tr><th>选择</th><th>脚本ID</th><th>脚本名称</th><th>类型</th><th>机器人模板</th><th>更新时间</th></tr>
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
                      <td>${script.updated}</td>
                    </tr>
                  `,
                )
                .join("") || `<tr><td colspan="6">暂无可绑定脚本</td></tr>`}
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
  const closeAction = robotResourceEditorCloseAction(returnRobotId, returnTab, "skills");
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
  const name = cleanCell(document.querySelector(".skill-edit-modal .form-section input.input")?.value) || "新建技能";
  const collection = returnRobotId ? userRobotSkills : skills;
  const target = collection.find((item) => item.name === name);
  const next = target || {
    id: returnRobotId ? `U-SKILL-${String(userRobotSkills.length + 1).padStart(2, "0")}` : `SKILL-${Date.now().toString().slice(-5)}`,
    created: formatLocalTimestamp(new Date()),
    owner: returnRobotId ? "用户模板" : "公共模板",
    scope: returnRobotId ? "robot-user-template" : "public",
    robotId: returnRobotId || undefined,
  };
  next.name = name;
  next.category = "表演";
  next.trigger = [...skillKeywords, cleanCell(document.getElementById("keywordInput")?.value)].filter(Boolean).join(", ") || "直播间事件";
  next.result = next.result || name;
  next.status = true;
  normalizeResourceMetadata(next);
  if (!target) collection.unshift(next);
  if (returnRobotId) bindRobotResourceId(returnRobotId, "skills", next.id);
  if (returnRobotId) {
    finishRobotResourceEditor(returnRobotId, returnTab, "skills");
  } else {
    closeModal();
    renderApp();
  }
  toast("技能已保存");
}

function openShowModal(name = "", edit = false, returnRobotId = "", returnTab = "") {
  performanceEditorContext = { name: name || "四位一体讲解", edit, returnRobotId, returnTab };
  performanceEditorDraftName = edit ? name : "";
  perfUnits = edit
    ? [
        { text: "各位贵宾大家好！我在这里好好给大家讲讲我们心符科技的四位一体产品体系哦。", action: "挥舞左手", end: "文本结束", repeat: 1, wait: 0 },
        { text: "所以呀，我们就是出了至尊养老的理念，把科技普惠和人文回归结合起来。", action: "抬起右手", end: "文本结束", repeat: 1, wait: 1 },
        { text: "心链云桥平台呢，负责收集数据和云端联动，就像是整个系统的大脑。", action: "挥舞左手", end: "全部结束", repeat: 2, wait: 0 },
      ]
    : [{ text: "", action: "请选择动作", end: "文本结束", repeat: 1, wait: 0 }];
  openModal(showModalHtml(name || "四位一体讲解", edit, "edit", returnRobotId, returnTab));
}

function openShowImportModal(returnRobotId = "", returnTab = "") {
  const closeAction = returnRobotId ? `returnToRobotTab('${returnRobotId}', '${returnTab || "shows"}')` : "closeModal()";
  openModal(`
    <div class="modal large">
      <div class="modal-header"><div class="modal-title">批量导入完整表演</div><button class="modal-close" onclick="${closeAction}">×</button></div>
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
      <div class="modal-footer"><button class="btn secondary" onclick="downloadShowImportTemplate()">下载模板</button><button class="btn" onclick="${closeAction};toast('表演批量导入预览已生成')">上传并预览</button></div>
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
  performanceEditorContext = { name: name || "四位一体讲解", edit, returnRobotId, returnTab };
  const draftName = performanceEditorDraftName || (edit ? name : "");
  const closeAction = customCloseAction || robotResourceEditorCloseAction(returnRobotId, returnTab, "shows");
  const saveAction = customSaveAction || `saveShowModal('${escapeJs(name)}', ${Boolean(edit)}, '${escapeJs(returnRobotId)}', '${escapeJs(returnTab || "shows")}')`;
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
            <input class="input" value="${escapeHtml(draftName)}" oninput="performanceEditorDraftName=this.value" />
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
          <tbody id="perfUnitRows">${perfUnits.map((unit, index) => perfUnitRow(unit, index, name, edit, returnRobotId, returnTab)).join("")}</tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="${saveAction}">确定</button>
        <button class="btn secondary" onclick="${closeAction}">取消</button>
      </div>
    </div>
  `;
}

function saveShowModal(name = "", edit = false, returnRobotId = "", returnTab = "shows") {
  const title = cleanCell(document.querySelector(".performance-name-field .input")?.value) || name || "新建表演";
  const collection = returnRobotId ? userRobotShows : shows;
  const target = edit ? collection.find((item) => item.name === name || item.name === title) : null;
  const next = target || {
    id: returnRobotId ? `U-SHOW-${String(userRobotShows.length + 1).padStart(2, "0")}` : `SHOW-${Date.now().toString().slice(-5)}`,
    owner: returnRobotId ? "用户模板" : "公共模板",
    scope: returnRobotId ? "robot-user-template" : "public",
    robotId: returnRobotId || undefined,
    created: formatLocalTimestamp(new Date()),
    status: true,
  };
  next.name = title;
  performanceEditorDraftName = title;
  next.units = perfUnits.length;
  next.unitDetails = perfUnits.map((unit) => ({ ...unit }));
  normalizeResourceMetadata(next);
  if (!target) collection.unshift(next);
  if (returnRobotId) {
    bindRobotResourceId(returnRobotId, "shows", next.id);
    finishRobotResourceEditor(returnRobotId, returnTab, "shows");
  } else {
    closeModal();
    renderApp();
  }
  toast("表演已保存");
}

function performanceActionOptions(unit) {
  const actionOptions = ["请选择动作", "挥舞左手", "抬起右手", "站姿", "点头", "比心"];
  if (unit?.action && !actionOptions.includes(unit.action)) actionOptions.splice(1, 0, unit.action);
  return actionOptions;
}

function perfUnitRow(unit, index, showName = "四位一体讲解", edit = true, returnRobotId = "", returnTab = "") {
  const actionOptions = performanceActionOptions(unit);
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
          ${actionOptions.map((item) => `<option ${unit.action === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
        <button class="btn small" style="margin-top:12px;" onclick="openActionPicker(${index}, '${escapeJs(showName)}', ${Boolean(edit)}, '${escapeJs(returnRobotId)}', '${escapeJs(returnTab)}')">编辑</button>
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
  if (scriptFlowView === "performance-edit") {
    renderApp();
    return;
  }
  const rows = document.getElementById("perfUnitRows");
  if (rows && document.getElementById("stagePerfName")) {
    rows.innerHTML = perfUnits.map((unit, index) => stagePerfUnitRow(unit, index)).join("");
    return;
  }
  const context = performanceEditorContext || {};
  if (rows) rows.innerHTML = perfUnits.map((unit, index) => perfUnitRow(unit, index, context.name, context.edit, context.returnRobotId, context.returnTab)).join("");
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

function restoreShowModalAfterActionPicker(showName = "四位一体讲解", edit = true, returnRobotId = "", returnTab = "") {
  openModal(showModalHtml(showName || "四位一体讲解", edit, "edit", returnRobotId, returnTab));
}

function restoreStageShowEditorAfterActionPicker() {
  const isEdit = Boolean(performanceEditorContext?.inlineShowId);
  openModal(stageShowEditorHtml(isEdit ? "编辑当前表演" : "新增表演", isEdit));
}

function openActionPicker(index, showName = "四位一体讲解", edit = true, returnRobotId = "", returnTab = "", returnMode = "") {
  const showAction = returnMode === "stage-modal"
    ? "restoreStageShowEditorAfterActionPicker()"
    : returnMode === "inline-page"
      ? "closeModal();renderApp()"
      : `restoreShowModalAfterActionPicker('${escapeJs(showName || "四位一体讲解")}', ${Boolean(edit)}, '${escapeJs(returnRobotId)}', '${escapeJs(returnTab)}')`;
  openModal(`
    <div class="modal medium">
      <div class="modal-header">
        <div class="modal-title">动作选择</div>
        <button class="modal-close" onclick="${showAction}">×</button>
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
              ${["鲁博士-挥舞右手波浪状", "鲁博士-挥舞右手", "鲁博士-挥舞左手", "鲁博士-向前伸右手", "鲁博士-向前伸左手", "鲁博士-低头拾双手致谢"].map((name, i) => `<div class="batch-row" style="grid-template-columns:50px 1fr 80px 60px;"><span>${i + 1}</span><span>${name}</span><span>站姿</span><button class="link" onclick="perfUnits[${index}].action='${name.replace("鲁博士-", "")}';${showAction}">添加</button></div>`).join("")}
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
        <button class="btn secondary" onclick="${showAction}">取消</button>
        <button class="btn" onclick="${showAction}">保存</button>
      </div>
    </div>
  `);
}

function openBatchModal(type) {
  openBatchDistributionModal(type);
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
      templateName: stageTemplateName(prefix),
      interactionDuration: type === "真人互动" ? "3" : "",
      waitDuration: type === "等待" ? "3" : "",
      dialogueMode: type === "真人互动" ? "自然对话" : "",
      executionLogic: { mode: "loop-count", value: 1 },
      boundShowIds,
    };
  });
}

function stageTemplateName(prefix) {
  const names = {
    tour: "导览模板",
    drama: "剧目模板",
    activity: "活动模板",
    "health-chat": "聊天主播模板",
    "commerce-full": "带货主播模板",
  };
  return names[prefix] || currentAnchorTemplate()?.templateName;
}

function applyStageWaits(stages, waitsByStage = {}) {
  stages.forEach((stage) => {
    stage.showWaits = waitsByStage[stage.id] || {};
  });
  return stages;
}

function mockUnit(text, action = "轻微点头", end = "文本结束", repeat = 1, wait = 0) {
  return { text, action, end, repeat, wait };
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

function normalizeScriptEditorReturnContext(context = null) {
  if (!context || typeof context !== "object") return { type: "script-list", label: "脚本列表" };
  if (context.type === "robot" && context.robotId) {
    return { type: "robot", robotId: String(context.robotId), tab: context.tab || "scripts", label: context.label || "机器人脚本页签" };
  }
  if (context.type === "page" && context.pageKey) {
    return { type: "page", pageKey: context.pageKey, label: context.label || currentPage().label || "来源页面" };
  }
  return { type: "script-list", label: context.label || "脚本列表" };
}

function scriptEditorReturnLabel(context = scriptEditorReturnContext) {
  return context?.label || (context?.type === "robot" ? "机器人脚本页签" : context?.type === "page" ? "来源页面" : "脚本列表");
}

function returnToScriptEditorSource() {
  const context = normalizeScriptEditorReturnContext(scriptEditorReturnContext);
  if (context.type === "robot") {
    activePage = "robots";
    if (!visitedTabs.includes("robots")) visitedTabs.push("robots");
    if (typeof window !== "undefined" && window.location) window.location.hash = "robots";
    renderApp();
    returnToRobotTab(context.robotId, context.tab || "scripts");
    return;
  }
  if (context.type === "page") {
    navigate(context.pageKey);
    return;
  }
  backToScriptList();
}

function openScriptEditor(scriptId, returnContext = scriptEditorReturnContext) {
  const script = scriptFlowScripts.find((item) => item.id === scriptId) || scriptFlowScripts[0];
  scriptEditorReturnContext = normalizeScriptEditorReturnContext(returnContext);
  selectedScriptId = script.id;
  selectedAnchorType = script.anchorType;
  selectedStageId = (currentStages().find((stage) => stage.active) || currentStages()[0]).id;
  scriptFlowView = "edit";
  activePage = "flow";
  if (!visitedTabs.includes("flow")) visitedTabs.push("flow");
  if (typeof window !== "undefined" && window.location) window.location.hash = "flow-edit";
  renderApp();
}

function saveAndDeployScript() {
  const script = currentScript();
  if (script.isTemplate) return;
  const robot = ensureScriptRobot(script);
  const error = validateScriptCapability(script, robot);
  if (error) {
    toast(error);
    return;
  }
  script.robotId = robot.id;
  script.robotName = robot.name;
  script.status = "已发布";
  script.updated = currentDateTimeText();
  robot.executableScriptId = script.id;
  robot.scripts = robotAssignedScripts(robot).length;
  const returnLabel = scriptEditorReturnLabel();
  returnToScriptEditorSource();
  toast(`已保存并下发机器人，已返回${returnLabel}`);
}

function validateScriptCapability(script, robot) {
  const isTour = script.type === "导览" || script.anchorType === "tour" || Boolean(script.mapId);
  if (isTour && robot.version !== "AGV机器人") return `${robot.version}不支持导览脚本或地图`;
  const binding = currentScriptProductBinding(script.id);
  const isCommerce = script.anchorType === "commerce" || script.templateName === "带货主播模板";
  if (isCommerce && !binding.scriptProductIds?.length) return "带货脚本必须先绑定商品";
  return "";
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
  if (typeof window !== "undefined" && window.location) window.location.hash = "flow";
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
  if (script.stageKey && stageOrders[script.stageKey]) return stageOrders[script.stageKey];
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
  if (!stage.priorityMode) stage.priorityMode = stage.type === "真人互动" || stage.type === "弹幕互动" ? "互动优先" : "流程优先";
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
  if (type === "真人互动" || type === "弹幕互动") {
    stage.priorityMode = "互动优先";
    stage.interactionDuration = type === "真人互动" ? stage.interactionDuration || "3" : "";
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
  performanceEditorContext = {
    name: "",
    edit: false,
    returnRobotId: "",
    returnTab: "",
    scriptId: selectedScriptId,
    stageId: selectedStageId,
    inlineShowId: "",
  };
  performanceEditorDraftName = "";
  perfUnits = [{ text: "", action: "请选择动作", end: "文本结束", repeat: 1, wait: 0 }];
  scriptFlowView = "performance-edit";
  window.location.hash = "flow-performance-edit";
  renderApp();
}

function editInlineStageShow(showId) {
  const show = scriptInlineShows.find((item) => String(item.id) === String(showId));
  if (!show) return;
  performanceEditorContext = {
    name: show.name,
    edit: true,
    returnRobotId: "",
    returnTab: "",
    scriptId: show.scriptId,
    stageId: show.stageId,
    inlineShowId: show.id,
  };
  performanceEditorDraftName = show.name;
  perfUnits = show.unitDetails.map((item) => ({ ...item }));
  scriptFlowView = "performance-edit";
  window.location.hash = "flow-performance-edit";
  renderApp();
}

function renderInlinePerformanceEditorPage() {
  const context = performanceEditorContext || {};
  return `
    <div class="flow-page inline-performance-page">
      <div class="inline-performance-head">
        <div><button class="link" type="button" onclick="cancelInlinePerformanceEditor()">‹ 返回脚本编辑</button><h1>${context.edit ? "编辑当前表演" : "新增脚本内表演"}</h1><p>保存后返回原脚本、原阶段；当前内容仅随脚本保存，不进入公共表演库或机器人私有表演库。</p></div>
        <div><button class="btn secondary" type="button" onclick="cancelInlinePerformanceEditor()">取消</button><button class="btn" type="button" onclick="saveInlineStageShow()">保存并返回脚本</button></div>
      </div>
      <section class="flow-card inline-performance-config">
        <div class="form-compact-grid two">
          <label class="compact-field"><span>表演名称 <em>*</em></span><input id="inlinePerformanceName" class="input" value="${escapeHtml(performanceEditorDraftName)}" oninput="performanceEditorDraftName=this.value" placeholder="请输入表演名称" /></label>
          <label class="compact-field"><span>完整表演执行逻辑</span><select class="select"><option>顺序执行</option><option>随机执行</option><option>顺序执行指定时长</option></select></label>
        </div>
      </section>
      <section class="flow-card">
        <div class="flow-card-head"><div><h2>表演单元</h2><p>至少保留一个单元；每个单元展示文本、动作、结束依据、执行次数和等待时长。</p></div><button class="btn small" type="button" onclick="addPerfUnit()">＋ 新增表演单元</button></div>
        <div class="inline-unit-editor-list">
          ${perfUnits.map((unit, index) => renderInlineUnitEditor(unit, index)).join("")}
        </div>
      </section>
    </div>`;
}

function renderInlineUnitEditor(unit, index) {
  const actionOptions = performanceActionOptions(unit);
  return `<article class="inline-unit-editor" draggable="true" ondragstart="startPerfUnitDrag(${index})" ondragover="event.preventDefault()" ondrop="dropPerfUnit(${index})">
    <header><span>${index + 1}</span><strong>表演单元 ${index + 1}</strong><button type="button" ${perfUnits.length <= 1 ? "disabled" : ""} onclick="removePerfUnit(${index})">删除</button></header>
    <div class="form-compact-grid two">
      <label class="compact-field wide"><span>表演文本 <em>*</em></span><textarea class="textarea" maxlength="200" oninput="perfUnits[${index}].text=this.value">${escapeHtml(unit.text)}</textarea></label>
      <label class="compact-field"><span>动作 / 动作组</span><select class="select" onchange="perfUnits[${index}].action=this.value">${actionOptions.map((item) => `<option ${unit.action === item ? "selected" : ""}>${item}</option>`).join("")}</select><button class="link" type="button" onclick="openActionPicker(${index}, '', false, '', '', 'inline-page')" style="margin-top:4px;">编辑</button></label>
      <label class="compact-field"><span>结束依据</span><select class="select" onchange="perfUnits[${index}].end=this.value">${["文本结束", "音频结束", "动作结束", "全部结束"].map((item) => `<option ${unit.end === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
      <label class="compact-field"><span>执行次数</span><input class="input" type="number" min="1" value="${unit.repeat ?? 1}" oninput="perfUnits[${index}].repeat=Number(this.value)" /></label>
      <label class="compact-field"><span>等待时长（秒）</span><input class="input" type="number" min="0" value="${unit.wait ?? 0}" oninput="perfUnits[${index}].wait=Number(this.value)" /></label>
    </div>
  </article>`;
}

function saveInlineStageShow() {
  const name = (document.getElementById("inlinePerformanceName")?.value || performanceEditorDraftName || "").trim();
  if (!name) return toast("请填写表演名称");
  if (!perfUnits.length || perfUnits.some((item) => !String(item.text || "").trim())) return toast("请填写所有表演单元文本");
  const context = performanceEditorContext || {};
  const stage = currentStages().find((item) => item.id === context.stageId) || currentStage();
  let show = scriptInlineShows.find((item) => String(item.id) === String(context.inlineShowId));
  if (show) {
    show.name = name;
    show.unitDetails = perfUnits.map((item) => ({ ...item }));
    show.units = show.unitDetails.length;
  } else {
    show = {
      id: `SCRIPT-INLINE-${Date.now()}`,
      scriptId: context.scriptId || selectedScriptId,
      stageId: context.stageId || selectedStageId,
      name,
      owner: "脚本内表演",
      origin: "script_inline",
      status: true,
      created: new Date().toLocaleString("zh-CN", { hour12: false }),
      units: perfUnits.length,
      unitDetails: perfUnits.map((item) => ({ ...item })),
    };
    scriptInlineShows.push(show);
    if (!stage.boundShowIds) stage.boundShowIds = [];
    stage.boundShowIds.push(show.id);
  }
  selectedStageId = stage.id;
  highlightedInlineShowId = show.id;
  scriptFlowView = "edit";
  window.location.hash = "flow-edit";
  toast("表演已保存并回显到原阶段");
  renderApp();
  window.requestAnimationFrame(() => document.querySelector(".expanded-show-card.highlighted")?.scrollIntoView({ behavior: "smooth", block: "center" }));
}

function cancelInlinePerformanceEditor() {
  selectedStageId = performanceEditorContext?.stageId || selectedStageId;
  scriptFlowView = "edit";
  window.location.hash = "flow-edit";
  renderApp();
}

function openNewPerformanceEditor() {
  performanceEditorView = true;
  performanceEditorDraftName = "";
  performanceEditorContext = {
    name: "",
    edit: false,
    returnRobotId: "",
    returnTab: "",
    scriptId: selectedScriptId,
    stageId: selectedStageId,
    inlineShowId: "",
  };
  perfUnits = [{ text: "", action: "请选择动作", end: "文本结束", repeat: 1, wait: 0 }];
  openModal(stageShowEditorHtml("新增表演", false));
}

function stageShowEditorHtml(title, isEdit) {
  const name = performanceEditorDraftName;
  return `
    <div class="modal large">
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="performance-top-config">
          <div class="performance-name-field">
            <span class="form-label required">表演名称:</span>
            <input class="input" id="stagePerfName" value="${escapeHtml(name)}" placeholder="请输入表演名称" />
          </div>
          <div class="performance-logic-field">
            <span class="form-label">完整表演执行逻辑:</span>
            <select id="performanceLogicSelect" class="select" onchange="updatePerformanceLogicFields(this.value)">
              ${executionLogicOptions.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
            </select>
            <span id="performanceLogicExtra" class="performance-logic-extra"><label>执行次数 <input class="input performance-extra-input" type="number" min="1" value="1" /> 次</label></span>
          </div>
        </div>
        <div class="form-row"><div class="form-label">归属:</div><div class="radio-line"><label><input type="radio" checked /> 脚本内表演</label></div></div>
        <table class="performance-table">
          <thead>
            <tr>
              <th style="width:140px;">拖动排序 <button class="black-dot" onclick="addPerfUnit()">＋</button></th>
              <th>表演文本</th>
              <th>表演音频</th>
              <th>表演动作(组)</th>
              <th style="width:130px;">结束依据</th>
              <th style="width:110px;">执行次数</th>
              <th style="width:130px;">等待时长(秒)</th>
            </tr>
          </thead>
          <tbody id="perfUnitRows">${perfUnits.map((unit, index) => stagePerfUnitRow(unit, index)).join("")}</tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="saveStagePerformanceFromModal()">确定</button>
        <button class="btn secondary" onclick="closeModal()">取消</button>
      </div>
    </div>
  `;
}

function stagePerfUnitRow(unit, index) {
  const actionOptions = performanceActionOptions(unit);
  return `
    <tr draggable="true" ondragstart="startPerfUnitDrag(${index})" ondragover="event.preventDefault()" ondrop="dropPerfUnit(${index})">
      <td>
        <span class="drag-handle" title="拖拽排序">⋮⋮</span>
        <button class="black-dot" onclick="removePerfUnit(${index})">−</button>
      </td>
      <td><textarea class="textarea" maxlength="200" oninput="perfUnits[${index}].text=this.value;refreshPerfUnits()">${escapeHtml(unit.text || "")}</textarea></td>
      <td><button class="btn secondary small" type="button" onclick="toast('选择音频')">选择音频</button><br /><input class="slider" type="range" min="0" max="100" value="80" /></td>
      <td>
        <select class="select" onchange="perfUnits[${index}].action=this.value">
          ${actionOptions.map((item) => `<option ${unit.action === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
        <button class="link" type="button" onclick="openActionPicker(${index}, '', false, '', '', 'stage-modal')" style="margin-top:4px;">编辑</button>
      </td>
      <td><select class="select" onchange="perfUnits[${index}].end=this.value">${["文本结束", "音频结束", "动作结束", "全部结束"].map((item) => `<option ${unit.end === item ? "selected" : ""}>${item}</option>`).join("")}</select></td>
      <td><input class="input unit-number-input" type="number" min="1" value="${unit.repeat ?? 1}" oninput="perfUnits[${index}].repeat=Number(this.value)" /></td>
      <td><input class="input unit-number-input" type="number" min="0" value="${unit.wait ?? 0}" oninput="perfUnits[${index}].wait=Number(this.value)" /></td>
    </tr>
  `;
}

function saveStagePerformanceFromModal() {
  const name = (document.getElementById("stagePerfName")?.value || performanceEditorDraftName || "").trim();
  if (!name) return toast("请填写表演名称");
  if (!perfUnits.length || perfUnits.some((item) => !String(item.text || "").trim())) return toast("请填写所有表演单元文本");
  const context = performanceEditorContext || {};
  const stage = currentStages().find((item) => item.id === context.stageId) || currentStage();
  let show = scriptInlineShows.find((item) => String(item.id) === String(context.inlineShowId));
  if (show) {
    show.name = name;
    show.unitDetails = perfUnits.map((item) => ({ ...item }));
    show.units = show.unitDetails.length;
  } else {
    show = {
      id: `SCRIPT-INLINE-${Date.now()}`,
      scriptId: context.scriptId || selectedScriptId,
      stageId: context.stageId || selectedStageId,
      name,
      owner: "脚本内表演",
      origin: "script_inline",
      status: true,
      created: new Date().toLocaleString("zh-CN", { hour12: false }),
      units: perfUnits.length,
      unitDetails: perfUnits.map((item) => ({ ...item })),
    };
    scriptInlineShows.push(show);
    if (!stage.boundShowIds) stage.boundShowIds = [];
    stage.boundShowIds.push(show.id);
  }
  selectedStageId = stage.id;
  highlightedInlineShowId = show.id;
  performanceEditorView = false;
  closeModal();
  toast("表演已保存并绑定到当前阶段");
  renderApp();
  window.requestAnimationFrame(() => document.querySelector(".perf-card.highlighted")?.scrollIntoView({ behavior: "smooth", block: "center" }));
}

function editShowInEditor(showId) {
  const allShows = allAvailableShows();
  const show = allShows.find((item) => String(item.id) === String(showId));
  if (!show) { toast("未找到该表演"); return; }
  if (show.origin === "script_inline") {
    editInlineStageShow(showId);
  } else {
    performanceEditorView = true;
    performanceEditorContext = {
      name: show.name,
      edit: true,
      returnRobotId: "",
      returnTab: "",
      scriptId: selectedScriptId,
      stageId: selectedStageId,
      inlineShowId: "",
      publicShowId: showId,
    };
    performanceEditorDraftName = show.name;
    perfUnits = showPreviewUnits(show, currentStage(), 0).map((item) => ({ ...item, expression: item.expression || "微笑" }));
    scriptFlowView = "performance-edit";
    window.location.hash = "flow-performance-edit";
    renderApp();
  }
}

function exitPerformanceEditor() {
  performanceEditorView = false;
  cancelInlinePerformanceEditor();
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
  const script = currentScript();
  const robot = scriptTargetRobot(script);
  const channelId = script.channelId || robot?.channelId || phase2State?.snapshot().currentChannelId || "channel-weishi";
  const publicShows = visibleChannelResources(shows, "shows").filter((show) => (show.channelId || resourceChannelId("shows", show.id)) === channelId);
  const robotShows = robot ? userRobotShows.filter((show) => show.robotId === robot.id) : [];
  return [...publicShows, ...robotShows, ...scriptInlineShows.filter((show) => show.scriptId === selectedScriptId)];
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
  if (!selectedShowIdsInPicker.length) {
    toast("请选择要绑定的表演");
    return;
  }
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
  if (/商品\d/.test(name) && name.includes("答疑")) return { type: "multi", defaultType: "all", label: "多选" };
  if (name === "商品鸡蛋答疑") return { type: "multi", defaultType: "all", label: "多选" };
  if (/商品\d/.test(name) || name.includes("商品1鸡蛋")) return { type: "single", defaultType: "current", label: "单选" };
  if (name === "全场优惠提醒") return { type: "multi", defaultType: "primary", label: "多选" };
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
  delete script.stageKey;
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
  const script = currentScript();
  script.anchorType = anchorId;
  script.templateName = currentAnchorTemplate().templateName;
  delete script.stageKey;
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
  scriptProductModalBackup = {
    scriptId: selectedScriptId,
    binding: cloneScriptProductBinding(currentScriptProductBinding()),
  };
  renderScriptProductsModal();
}

function cloneScriptProductBinding(binding) {
  return JSON.parse(JSON.stringify(binding));
}

function cancelScriptProductsModal() {
  if (scriptProductModalBackup) {
    scriptProductBindings[scriptProductModalBackup.scriptId] = cloneScriptProductBinding(scriptProductModalBackup.binding);
    scriptProductModalBackup = null;
  }
  scriptProductModalSelection = [];
  closeModal();
  renderApp();
}

function confirmScriptProductsModal() {
  scriptProductModalBackup = null;
  scriptProductModalSelection = [];
  closeModal();
  renderApp();
  toast("脚本商品绑定已保存");
}

function renderScriptProductsModal() {
  const script = currentScript();
  const summary = scriptProductSummary();
  const rows = filteredScriptProducts();
  openModal(`
    <div class="modal full script-product-modal">
      <div class="modal-header">
        <div class="modal-title">脚本关联商品</div>
        <button class="modal-close" onclick="cancelScriptProductsModal()">×</button>
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
        <button class="btn secondary" onclick="cancelScriptProductsModal()">取消</button>
        <button class="btn" onclick="confirmScriptProductsModal()">保存绑定</button>
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
  mountPlacedHandoffAnnotations();
}

function closeModal() {
  document.getElementById("modalRoot").innerHTML = "";
  if (handoffPlacementMode) stopHandoffPlacement();
  mountPlacedHandoffAnnotations();
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
  document.addEventListener("pointermove", handleHandoffFabDrag);
  document.addEventListener("pointerup", stopHandoffFabDrag);
  document.addEventListener("pointercancel", stopHandoffFabDrag);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && handoffPlacementMode) {
      stopHandoffPlacement();
      toast("已取消定位新增");
      return;
    }
    if (event.key === "Escape" && handoffPanelOpen) closeHandoffPanel();
  });
  window.addEventListener("resize", () => {
    if (handoffFabPosition) {
      handoffFabPosition = { top: clampHandoffFabTop(handoffFabPosition.top) };
      saveHandoffFabPosition();
    }
    mountPlacedHandoffAnnotations();
  });
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "");
    if (!["flow-edit", "flow-performance-edit", "flow-preview"].includes(hash)) return;
    activePage = "flow";
    scriptFlowView = hash === "flow-performance-edit" ? "performance-edit" : hash === "flow-preview" ? "preview" : "edit";
    renderApp();
  });
  window.addEventListener(
    "scroll",
    () => {
      if (handoffMode) mountPlacedHandoffAnnotations();
    },
    true,
  );
}

function openRobotDetail(robotId) {
  openRobotEditor(robotId, "role");
}

function closeRobotDetail() {
  robotDetailView = false;
  selectedRobotId = "142";
  robotDetailTab = "scripts";
  renderApp();
}

function switchRobotTab(tab) {
  robotDetailTab = tab;
  renderApp();
}

function robotScripts(robotId) {
  const robot = robots.find((r) => String(r.id) === String(robotId));
  if (!robot) return [];
  return scriptFlowScripts.filter((s) => String(s.robotId) === String(robotId) || String(s.id) === String(robot.executableScriptId));
}

function renderRobotDetailPage() {
  const robot = robots.find((r) => String(r.id) === String(selectedRobotId));
  if (!robot) { closeRobotDetail(); return ""; }
  const boundScripts = robotScripts(selectedRobotId);
  return `
    <div>
      <div class="toolbar">
        <div class="filters">
          <button class="link" type="button" onclick="closeRobotDetail()">‹ 返回机器人列表</button>
          <span style="color:#8a94a3;">|</span>
          <strong style="color:#1f2937;font-size:16px;">${escapeHtml(robot.name)}（ID: ${escapeHtml(robot.id)}）</strong>
          <span class="tag">${escapeHtml(robot.mode)}</span>
          <span class="mini-tag ${robot.status === "正常" ? "green" : "orange"}" style="margin-left:4px;">${escapeHtml(robot.status)}</span>
        </div>
        <div>
          <button class="btn secondary small" type="button" onclick="openConversationPage({robotId:'${escapeJs(robot.id)}'})">查看历史对话</button>
          <button class="btn secondary small" type="button" onclick="openRobotEditor('${escapeJs(robot.id)}', 'role')">编辑配置</button>
        </div>
      </div>
      <div class="robot-detail-tabs">
        <button class="robot-detail-tab ${robotDetailTab === "scripts" ? "active" : ""}" type="button" onclick="switchRobotTab('scripts')">脚本管理</button>
        <button class="robot-detail-tab ${robotDetailTab === "config" ? "active" : ""}" type="button" onclick="switchRobotTab('config')">基础配置</button>
        <button class="robot-detail-tab ${robotDetailTab === "history" ? "active" : ""}" type="button" onclick="switchRobotTab('history')">运行历史</button>
      </div>
      ${robotDetailTab === "scripts" ? renderRobotScriptTab(robot, boundScripts) : ""}
      ${robotDetailTab === "config" ? renderRobotConfigTab(robot) : ""}
      ${robotDetailTab === "history" ? renderRobotHistoryTab(robot) : ""}
    </div>
  `;
}

function renderRobotScriptTab(robot, boundScripts) {
  return `
    <div>
      <div class="toolbar" style="margin-bottom:16px;">
        <div class="filters">
          <input class="input w-180" placeholder="搜索脚本名称" />
          <button class="btn" type="button" onclick="toast('已查询脚本')">⌕ 查询</button>
          <button class="btn" type="button" onclick="createScriptForRobot('${escapeJs(String(robot.id))}')">＋ 新增脚本</button>
          <button class="btn secondary" type="button" onclick="openImportScriptModal('${escapeJs(String(robot.id))}')">导入脚本</button>
        </div>
      </div>
      ${boundScripts.length
        ? `<div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>脚本ID</th>
                <th>名称</th>
                <th>类型</th>
                <th>主播类型</th>
                <th>阶段数</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${boundScripts.map((script) => {
                const stageCount = (script.stages || []).length;
                const safeId = String(script.id).replace(/'/g, "\\'");
                return `
                <tr>
                  <td><button class="link" type="button" onclick="openScriptEditor('${safeId}', { type: 'robot', robotId: '${escapeJs(String(robot.id))}', tab: 'scripts', label: '机器人脚本页签' })">${escapeHtml(script.id)}</button></td>
                  <td><strong>${escapeHtml(script.name || "未命名脚本")}</strong></td>
                  <td><span class="tag">${escapeHtml(script.type || "直播")}</span></td>
                  <td>${escapeHtml(anchorName(script.anchorType || "education"))}</td>
                  <td>${stageCount}</td>
                  <td><span class="mini-tag green">正常</span></td>
                  <td>${escapeHtml(script.created || "—")}</td>
                  <td class="nowrap">
                    <button class="link" type="button" onclick="openScriptEditor('${safeId}', { type: 'robot', robotId: '${escapeJs(String(robot.id))}', tab: 'scripts', label: '机器人脚本页签' })">编辑</button>
                    <button class="link danger" type="button" onclick="toast('已解除绑定')">解除</button>
                  </td>
                </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>`
        : `<div style="padding:40px;text-align:center;color:#8a94a3;">
          <p style="font-size:20px;">暂无关联脚本</p>
          <p style="margin:12px 0 20px;">该机器人尚未绑定任何脚本，可以新增或导入脚本。</p>
          <button class="btn" type="button" onclick="createScriptForRobot('${escapeJs(String(robot.id))}')">＋ 新增脚本</button>
          <button class="btn secondary" style="margin-left:8px;" type="button" onclick="openImportScriptModal('${escapeJs(String(robot.id))}')">导入脚本</button>
        </div>`}
    </div>
  `;
}

function renderRobotConfigTab(robot) {
  const showAdvancedConfig = canShowAdvancedRobotConfig();
  return `
    <section style="max-width:640px;">
      <div class="form-grid" style="grid-template-columns:1fr;">
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <div class="form-row"><span class="form-label">机器人ID</span><span style="color:#1f2937;font-weight:600;">${escapeHtml(robot.id)}</span></div>
          <div class="form-row"><span class="form-label">名称</span><span style="color:#1f2937;">${escapeHtml(robot.name)}</span></div>
          <div class="form-row"><span class="form-label">模式</span><span class="tag">${escapeHtml(robot.mode)}</span></div>
          <div class="form-row"><span class="form-label">状态</span><span class="mini-tag ${robot.status === "正常" ? "green" : "orange"}">${escapeHtml(robot.status)}</span></div>
          <div class="form-row"><span class="form-label">音色</span><span>${escapeHtml(robot.voice)}</span></div>
        </div>
        <div class="form-section">
          <div class="section-title">技术配置</div>
          ${showAdvancedConfig ? `<div class="form-row"><span class="form-label">大模型</span><span>${escapeHtml(robot.model)}</span></div>` : ""}
          <div class="form-row"><span class="form-label">版本</span><span>${escapeHtml(robot.version)}（${escapeHtml(robot.year || "2026")}）</span></div>
          <div class="form-row"><span class="form-label">关联脚本</span><span>${robot.executableScriptId || "未设置"}</span></div>
          <div class="form-row"><span class="form-label">关联表演</span><span>${robot.showIds?.length || 0} 个</span></div>
          <div class="form-row"><span class="form-label">关联技能</span><span>${robot.skillIds?.length || 0} 个</span></div>
        </div>
      </div>
    </section>
  `;
}

function renderRobotHistoryTab(robot) {
  return `
    <div style="padding:40px;text-align:center;color:#8a94a3;">
      <p style="font-size:20px;">运行历史</p>
      <p style="margin:12px 0;">机器人 ${escapeHtml(robot.name)}（${escapeHtml(robot.id)}）的运行记录将在此展示。</p>
      <button class="btn secondary" type="button" onclick="toast('运行历史功能待上线')">查看历史记录</button>
    </div>
  `;
}

function createScriptForRobot(robotId) {
  createRobotBlankScript(String(robotId));
}

function openImportScriptModal(robotId) {
  openRobotScriptImport(String(robotId));
}

function downloadLegacyScriptImportTemplate() {
  toast("模板已下载（演示：模板包含脚本名称、类型、主播类型、阶段名称、表演单元等字段）");
}

function handleScriptImportFile(event, robotId) {
  const file = event.target?.files?.[0];
  if (!file) return;
  if (!/\.(xlsx?|xls)$/i.test(file.name)) { toast("请上传 .xlsx 或 .xls 文件"); return; }
  if (file.size > 10 * 1024 * 1024) { toast("文件大小不能超过 10MB"); return; }
  scriptImportPreview = buildScriptImportPreview(robotId);
  openImportScriptModal(robotId);
}

function buildScriptImportPreview(robotId) {
  const robot = robots.find((r) => String(r.id) === String(robotId));
  return {
    count: 1,
    totalStages: 3,
    robotId,
    robotName: robot?.name || "",
    preview: [{
      name: `${robot?.name || "机器人"} 导入脚本`,
      type: "直播",
      anchorType: "education",
      stages: [
        { name: "开场", type: "普通流程", units: 2 },
        { name: "正题", type: "普通流程", units: 3 },
        { name: "结尾", type: "普通流程", units: 1 },
      ],
    }],
  };
}

function openScriptImportPreview(data) {
  if (!data) return;
  const detail = data.preview?.[0];
  openModal(`
    <div class="modal medium">
      <div class="modal-header">
        <div class="modal-title">导入预览</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="import-preview-summary">
          <div><span>脚本数</span><strong>${data.count || 0}</strong></div>
          <div><span>阶段数</span><strong>${data.totalStages || 0}</strong></div>
        </div>
        ${detail ? `
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>脚本名称</th><th>类型</th><th>阶段</th><th>表演单元</th></tr></thead>
              <tbody>
                ${detail.stages.map((stage, i) => `<tr><td>${i === 0 ? escapeHtml(detail.name) : ""}</td><td>${i === 0 ? escapeHtml(detail.type) : ""}</td><td>${escapeHtml(stage.name)}（${escapeHtml(stage.type)}）</td><td>${stage.units} 个</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        ` : ""}
      </div>
      <div class="modal-footer">
        <button class="btn secondary" onclick="closeModal()">取消</button>
        <button class="btn" onclick="toast('已确认导入')">确认导入</button>
      </div>
    </div>
  `);
}

function confirmScriptImport(robotId) {
  const data = scriptImportPreview;
  if (!data) { toast("请先上传文件"); return; }
  const robot = robots.find((r) => String(r.id) === String(robotId));
  const demo = buildDemoScriptImport(data, robot);
  demo.channelId = robot?.channelId || resourceChannelId("robots", robotId);
  scriptFlowScripts.push(demo);
  if (robot) {
    robot.executableScriptId = demo.id;
    robot.scripts = (robot.scripts || 0) + 1;
  }
  scriptImportPreview = null;
  closeModal();
  toast(`脚本 ${escapeHtml(demo.id)} 已导入并绑定到 ${escapeHtml(robot?.name || robotId)}`);
  renderApp();
}

function buildDemoScriptImport(data, robot) {
  const scriptId = `SCRIPT-${String(scriptFlowScripts.length + 1).padStart(3, "0")}`;
  const preview = data.preview?.[0];
  return {
    id: scriptId,
    name: preview?.name || `${robot?.name || "机器人"} 导入脚本`,
    type: preview?.type || "直播",
    anchorType: preview?.anchorType || "education",
    robotId: String(robot?.id || data.robotId),
    robotName: robot?.name || "",
    templateName: "",
    duration: 30,
    offAirNotice: 5,
    stageCount: preview?.stages?.length || 1,
    showCount: 0,
    status: "可编辑",
    isTemplate: false,
    updated: new Date().toLocaleString("zh-CN", { hour12: false }),
    mapId: "",
  };
}

renderApp();
loadProjectHandoffAnnotations();
