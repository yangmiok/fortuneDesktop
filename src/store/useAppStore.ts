import { create } from 'zustand';
import {
  AppState,
  AppActions,
  UserPreferences,
  BirthInfo,
  ValidationErrors,
  CalculationType,
  DisplayResult,
  DisplayResultInputItem
} from '../types';
import { DEFAULT_PREFERENCES, DEFAULT_BIRTH_INFO, DEFAULT_CALCULATION_TYPE } from '../constants';

interface AppStore extends AppState, AppActions {}

const typeLabelMap: Record<CalculationType, string> = {
  bazi: '四柱八字',
  ziwei: '紫微斗数',
  liuyao: '六爻预测',
  qimen: '奇门遁甲',
  fengshui: '风水堪舆',
  physiognomy: '手相面相'
};

const formatDateTime = () =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());

const getBaseInputSummary = (data: BirthInfo): DisplayResultInputItem[] => {
  const items: DisplayResultInputItem[] = [];

  if (data.year && data.month && data.day) {
    items.push({
      label: '测算时间',
      value: `${data.year}年${data.month}月${data.day}日`
    });
  }

  if (data.hour !== undefined && data.hour !== null) {
    items.push({
      label: '时辰',
      value: data.hour === -1 ? '不详' : `${data.hour}时`
    });
  }

  if (data.country || data.province || data.city) {
    items.push({
      label: '地点',
      value: [data.country, data.province, data.city].filter(Boolean).join(' / ')
    });
  }

  return items;
};

const buildMockResult = (type: CalculationType, data: BirthInfo): DisplayResult => {
  const question = data.questionText?.trim() || '当前关注事项';
  const location = [data.country, data.province, data.city].filter(Boolean).join(' / ') || '未填写';
  const generatedAt = formatDateTime();
  const title = `${typeLabelMap[type]}测算结果`;

  const resultMap: Record<CalculationType, Omit<DisplayResult, 'id' | 'type' | 'generatedAt' | 'title'>> = {
    bazi: {
      subtitle: '命局结构初判',
      summary: '整体气场偏稳，节奏宜先定方向再求突破，短期看重选择与执行的一致性。',
      highlights: ['先稳主线', '人和为先', '节奏渐进'],
      metrics: [
        { label: '整体走势', value: '稳中有升' },
        { label: '关键窗口', value: '未来 2-4 周' },
        { label: '核心主题', value: '定方向' },
        { label: '行动建议', value: '先整后进' }
      ],
      sections: [
        { title: '核心判断', content: '这段时间更适合把已有资源收束整合，不宜频繁改方向。先把眼前最重要的一件事打透，结果会比同时铺开更好。' },
        { title: '机会落点', content: '贵人和机会多半出现在熟悉的人脉与既有合作里，越是看起来普通的联络，越可能带来真正的推进。' },
        { title: '需要留意', content: '近期容易因为节奏着急而提前下判断，建议把决策点再往后放一小步，给信息完整汇集的时间。' }
      ],
      suggestions: ['把近期目标压缩成一个主目标', '重要事项尽量在上午完成决定', '先确认资源和边界，再做承诺'],
      notes: ['当前为结果页样式测试数据', '后续接入 API 后会替换为真实测算文本'],
      inputSummary: getBaseInputSummary(data)
    },
    ziwei: {
      subtitle: '命盘格局速览',
      summary: '命盘呈现出先观势、后出手更有利的特征，适合先看清局面再做阶段性布局。',
      highlights: ['先看局势', '重判断力', '适合布局'],
      metrics: [
        { label: '命盘类型', value: data.chartType === 'earth' ? '地盘' : '天盘' },
        { label: '历法', value: data.calendarType === 'lunar' ? '阴历' : '阳历' },
        { label: '主线判断', value: '先守后攻' },
        { label: '近期运势', value: '平稳偏强' }
      ],
      sections: [
        { title: '核心判断', content: '现在更适合通过观察、筛选和判断来积累优势，而不是急于求成。把握关键节点会比持续用力更有效。' },
        { title: '人事关系', content: '与上级、长辈或关键决策者的沟通会直接影响结果，表达方式比内容本身还重要。' },
        { title: '行动建议', content: '适合用阶段性复盘来修正方向，先求结构正确，再求速度。' }
      ],
      suggestions: ['关键沟通提前准备三种表达版本', '把近期选择按轻重缓急排序', '避免情绪状态下做最终决定'],
      notes: ['当前为结果页样式测试数据', '后续接入 API 后会替换为真实测算文本'],
      inputSummary: [
        ...getBaseInputSummary(data),
        { label: '性别', value: data.gender === 'female' ? '女' : '男' },
        { label: '命盘', value: data.chartType === 'earth' ? '地盘' : '天盘' },
        { label: '历法', value: data.calendarType === 'lunar' ? '阴历' : '阳历' }
      ]
    },
    liuyao: {
      subtitle: '即时占断速览',
      summary: `围绕“${question}”这件事，当前象意显示先有波折后有转机，关键在于沟通节奏和信息是否对齐。`,
      highlights: ['先曲后顺', '重沟通', '结果可期'],
      metrics: [
        { label: '起卦方式', value: data.divinationMethod === 'coins' ? '铜钱起卦' : data.divinationMethod === 'number' ? '数字起卦' : '时间起卦' },
        { label: '事情进展', value: '可推进' },
        { label: '结果时间', value: '短期可见' },
        { label: '关键动作', value: '补信息' }
      ],
      sections: [
        { title: '核心判断', content: '这件事不是没有结果，而是中间会有一段等待或反复确认的过程。只要关键条件不变，最终仍有推进空间。' },
        { title: '阻力来源', content: '眼下的阻力更像流程与人之间的节奏差，并非本质否定。把关键问题讲透，比反复催促更有效。' },
        { title: '占断建议', content: '先确认对方真实顾虑，再决定是否继续加码投入，会比单边努力更省力。' }
      ],
      suggestions: ['把问题拆成一个核心判断点', '优先拿到对方明确反馈', '先求落地，再求完美'],
      notes: ['当前为结果页样式测试数据', '后续接入 API 后会替换为真实测算文本'],
      inputSummary: [
        { label: '占问主题', value: question },
        { label: '起卦地点', value: location },
        { label: '性别', value: data.gender === 'female' ? '女' : '男' }
      ]
    },
    qimen: {
      subtitle: '时局与方位判断',
      summary: `围绕“${question}”来看，当前更适合边观察边行动，重点不是猛冲，而是找准切入时机。`,
      highlights: ['择时而动', '以静制动', '方向重要'],
      metrics: [
        { label: '时局状态', value: '先观后动' },
        { label: '适合策略', value: '迂回推进' },
        { label: '成事概率', value: '中上' },
        { label: '重点关注', value: '时机与方向' }
      ],
      sections: [
        { title: '核心判断', content: '目前局势不适合正面硬推，更适合以观察、借力和调整角度的方式切入。动得巧，比动得快更重要。' },
        { title: '优势所在', content: '你当前的优势在于判断和应变，只要不被表面节奏带偏，后续仍有较好的回转空间。' },
        { title: '布局建议', content: '先确认最有利的时间点和合作点，再集中资源发力。分散推进会削弱整体效果。' }
      ],
      suggestions: ['先判断最佳推进窗口', '把不必要的动作先减掉', '保留弹性，不急着一次性定死'],
      notes: ['当前为结果页样式测试数据', '后续接入 API 后会替换为真实测算文本'],
      inputSummary: [
        ...getBaseInputSummary(data),
        { label: '占问主题', value: question }
      ]
    },
    fengshui: {
      subtitle: '空间格局初判',
      summary: '从当前上传环境来看，空间气场重点在于动线、采光与主次关系的整理，先改善基础感受会比先上摆件更有效。',
      highlights: ['先理动线', '重采光', '先调基础'],
      metrics: [
        { label: '图片数量', value: `${data.fengshuiImages?.length ?? 0} 张` },
        { label: '观察重点', value: '动线格局' },
        { label: '调整优先级', value: '高' },
        { label: '建议方向', value: '先减后补' }
      ],
      sections: [
        { title: '核心判断', content: '居家风水首先看整体秩序感与气流路线。如果入口、主要活动区和休息区之间关系清晰，整体感受会明显更顺。' },
        { title: '优先观察', content: '建议重点看入户门、客厅主视角、卧室床位和阳台采光面，这几处通常最能影响整体场域感受。' },
        { title: '调整建议', content: '先做减法，处理遮挡、堆积、杂乱和光线受阻的问题，再考虑装饰和补充性布局。' }
      ],
      suggestions: ['优先上传主空间全景照', '补充门口与床位视角', '先处理明显拥堵或遮挡区域'],
      notes: ['当前为结果页样式测试数据', '后续接入 API 后会替换为真实勘舆结果'],
      inputSummary: [
        ...getBaseInputSummary(data),
        { label: '空间位置', value: location },
        { label: '图片素材', value: `${data.fengshuiImages?.length ?? 0} 张居家照片` }
      ]
    },
    physiognomy: {
      subtitle: '图像特征测试结果',
      summary: '当前结果页已具备图像分析的承接结构，后续接入图片识别与测算 API 后，会直接在这里展示正式解读。',
      highlights: ['图像承接', '结构完整', '便于扩展'],
      metrics: [
        { label: '分析方向', value: data.physiognomyMode === 'palm' ? '仅手相' : data.physiognomyMode === 'face' ? '仅面相' : '手相 + 面相' },
        { label: '手掌图片', value: `${data.palmImages?.length ?? 0} 张` },
        { label: '面部图片', value: `${data.faceImages?.length ?? 0} 张` },
        { label: '当前状态', value: '等待 API 接入' }
      ],
      sections: [
        { title: '核心判断', content: '结果页已经按图像类测算场景设计完成，后续会重点承接面部、掌纹、左右手差异等更细分的分析内容。' },
        { title: '展示方向', content: '后续适合展示整体气质判断、阶段运势侧重、优势特征和需要留意的细节。' },
        { title: '后续建议', content: '等 API 接入后，可以继续增加图片对比、重点特征标记和分段解读模块。' }
      ],
      suggestions: ['保持图片清晰无遮挡', '左右手与正脸图尽量同时提供', '补充关注重点便于输出更聚焦'],
      notes: ['当前为结果页样式测试数据', '后续接入 API 后会替换为真实图像解读'],
      inputSummary: [
        { label: '分析方向', value: data.physiognomyMode === 'palm' ? '仅手相' : data.physiognomyMode === 'face' ? '仅面相' : '手相 + 面相' },
        { label: '性别', value: data.gender === 'female' ? '女' : '男' },
        { label: '年龄', value: data.age ? `${data.age} 岁` : '未填写' }
      ]
    }
  };

  const base = resultMap[type];

  return {
    id: `${type}-${Date.now()}`,
    type,
    title,
    generatedAt,
    ...base
  };
};

export const useAppStore = create<AppStore>((set) => ({
  // 初始状态
  ui: {
    sidebarCollapsed: false,
    activeMenu: DEFAULT_CALCULATION_TYPE,
    activeTab: DEFAULT_CALCULATION_TYPE,
    currentView: 'form',
    loading: false,
    theme: 'light'
  },
  
  user: {
    preferences: DEFAULT_PREFERENCES,
    recentCalculations: []
  },
  
  form: {
    currentData: DEFAULT_BIRTH_INFO,
    validationErrors: {},
    isSubmitting: false
  },
  
  results: {
    current: null,
    history: [],
    loading: false,
    error: null
  },

  // UI操作
  toggleSidebar: () => set((state) => ({
    ui: {
      ...state.ui,
      sidebarCollapsed: !state.ui.sidebarCollapsed
    }
  })),

  setActiveMenu: (menu: string) => set((state) => ({
    ui: {
      ...state.ui,
      activeMenu: menu
    }
  })),

  setActiveTab: (tab: string) => set((state) => ({
    ui: {
      ...state.ui,
      activeTab: tab
    }
  })),

  setCurrentView: (view: 'form' | 'result') => set((state) => ({
    ui: {
      ...state.ui,
      currentView: view
    }
  })),

  setLoading: (loading: boolean) => set((state) => ({
    ui: {
      ...state.ui,
      loading
    }
  })),

  // 表单操作
  updateFormData: (data: Partial<BirthInfo>) => set((state) => ({
    form: {
      ...state.form,
      currentData: {
        ...state.form.currentData,
        ...data
      }
    }
  })),

  setValidationErrors: (errors: ValidationErrors) => set((state) => ({
    form: {
      ...state.form,
      validationErrors: errors
    }
  })),

  clearForm: () => set((state) => ({
    form: {
      ...state.form,
      currentData: DEFAULT_BIRTH_INFO,
      validationErrors: {},
      isSubmitting: false
    }
  })),

  // 计算操作 (暂时为空实现)
  submitCalculation: async (type: string, data: BirthInfo) => {
    set((state) => ({
      form: { ...state.form, isSubmitting: true },
      results: { ...state.results, current: null, loading: true, error: null }
    }));

    try {
      // TODO: 实现实际的计算逻辑
      console.log('提交计算:', type, data);
      
      // 模拟计算延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResult = buildMockResult(type as CalculationType, data);
      
      set((state) => ({
        form: { ...state.form, isSubmitting: false },
        results: {
          ...state.results,
          current: mockResult,
          history: [mockResult, ...state.results.history].slice(0, 12),
          loading: false
        }
      }));
    } catch (error) {
      set((state) => ({
        form: { ...state.form, isSubmitting: false },
        results: { 
          ...state.results, 
          loading: false, 
          error: error instanceof Error ? error.message : '计算失败'
        }
      }));
    }
  },

  loadCalculationHistory: async () => {
    try {
      // TODO: 实现历史记录加载
      console.log('加载计算历史');
    } catch (error) {
      console.error('加载历史记录失败:', error);
    }
  },

  deleteCalculation: async (id: string) => {
    try {
      // TODO: 实现删除计算记录
      console.log('删除计算记录:', id);
    } catch (error) {
      console.error('删除记录失败:', error);
    }
  },

  // 用户偏好操作
  updatePreferences: async (prefs: Partial<UserPreferences>) => {
    try {
      set((state) => ({
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...prefs
          }
        }
      }));
      
      // TODO: 保存到本地存储
      console.log('更新用户偏好:', prefs);
    } catch (error) {
      console.error('更新偏好失败:', error);
    }
  }
}));
