// 核心数据类型定义

export interface BirthInfo {
  // 基本时间信息
  year: number;          // 年份
  month: number;         // 月份 (1-12)
  day: number;           // 日期 (1-31)
  hour: number;          // 小时 (0-23)
  minute: number;        // 分钟 (0-59)
  
  // 地理位置信息
  country: string;       // 国家
  province: string;      // 省份/州
  city: string;          // 城市
  longitude?: number;    // 经度 (可选)
  latitude?: number;     // 纬度 (可选)
  timezone?: string;     // 时区 (可选)
  
  // 农历信息 (计算得出)
  lunarYear?: number;
  lunarMonth?: number;
  lunarDay?: number;
  lunarHour?: number;

  // 紫微斗数扩展信息
  chartType?: 'heaven' | 'earth';
  calendarType?: 'lunar' | 'solar';

  // 六爻扩展信息
  divinationMethod?: 'time' | 'number' | 'coins';
  questionText?: string;

  // 手相面相扩展信息
  gender?: 'male' | 'female';
  age?: number;
  physiognomyMode?: 'palm' | 'face' | 'both';
  palmSide?: 'left' | 'right' | 'both';
  palmImages?: Array<{
    name: string;
    url: string;
  }>;
  faceImages?: Array<{
    name: string;
    url: string;
  }>;
  analysisNotes?: string;
}

export type CalculationType = 'bazi' | 'ziwei' | 'liuyao' | 'qimen' | 'fengshui' | 'physiognomy';

export interface BaseCalculationResult {
  id: string;
  type: CalculationType;
  birthInfo: BirthInfo;
  timestamp: Date;
  version: string;       // 计算引擎版本
}

// 八字计算结果
export interface BaZiResult extends BaseCalculationResult {
  type: 'bazi';
  result: {
    // 四柱信息
    pillars: {
      year: { heavenly: string; earthly: string; };
      month: { heavenly: string; earthly: string; };
      day: { heavenly: string; earthly: string; };
      hour: { heavenly: string; earthly: string; };
    };
    
    // 五行分析
    elements: {
      wood: number;
      fire: number;
      earth: number;
      metal: number;
      water: number;
    };
    
    // 用神分析
    usefulGod: string;
    avoidGod: string;
    
    // 综合分析
    analysis: {
      personality: string;
      career: string;
      wealth: string;
      health: string;
      relationship: string;
    };
  };
}

// 紫微斗数结果
export interface ZiWeiResult extends BaseCalculationResult {
  type: 'ziwei';
  result: {
    // 命盘信息
    chart: {
      palaces: Array<{
        name: string;
        position: number;
        mainStars: string[];
        minorStars: string[];
        brightness: string;
      }>;
    };
    
    // 主星分析
    mainStarAnalysis: {
      lifePalace: string;
      careerPalace: string;
      wealthPalace: string;
      healthPalace: string;
    };
  };
}

export type CalculationResult = BaZiResult | ZiWeiResult;

// 表单验证错误
export interface ValidationErrors {
  [key: string]: string;
}

// 用户偏好设置
export interface UserPreferences {
  // 界面设置
  ui: {
    theme: 'light' | 'dark';
    language: 'zh-CN' | 'zh-TW' | 'en';
    fontSize: 'small' | 'medium' | 'large';
    sidebarCollapsed: boolean;
  };
  
  // 默认值设置
  defaults: {
    country: string;
    province: string;
    city: string;
    calculationType: CalculationType;
  };
  
  // 隐私设置
  privacy: {
    saveHistory: boolean;
    encryptData: boolean;
    autoCleanup: boolean;
    cleanupDays: number;
  };
  
  // 窗口设置
  window: {
    width: number;
    height: number;
    x: number;
    y: number;
    maximized: boolean;
  };
}

// 应用状态接口
export interface AppState {
  // 用户界面状态
  ui: {
    sidebarCollapsed: boolean;
    activeMenu: string;
    activeTab: string;
    loading: boolean;
    theme: 'light' | 'dark';
  };
  
  // 用户数据状态
  user: {
    preferences: UserPreferences;
    recentCalculations: CalculationResult[];
  };
  
  // 表单状态
  form: {
    currentData: Partial<BirthInfo>;
    validationErrors: ValidationErrors;
    isSubmitting: boolean;
  };
  
  // 计算结果状态
  results: {
    current: CalculationResult | null;
    history: CalculationResult[];
    loading: boolean;
    error: string | null;
  };
}

// 应用操作接口
export interface AppActions {
  // UI操作
  toggleSidebar: () => void;
  setActiveMenu: (menu: string) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  
  // 表单操作
  updateFormData: (data: Partial<BirthInfo>) => void;
  setValidationErrors: (errors: ValidationErrors) => void;
  clearForm: () => void;
  
  // 计算操作
  submitCalculation: (type: string, data: BirthInfo) => Promise<void>;
  loadCalculationHistory: () => Promise<void>;
  deleteCalculation: (id: string) => Promise<void>;
  
  // 用户偏好操作
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

// 组件Props接口
export interface LayoutProps {
  children: React.ReactNode;
}

export interface InputFormProps {
  onSubmit: (data: BirthInfo) => void;
  loading: boolean;
  initialData?: Partial<BirthInfo>;
}

export interface ResultDisplayProps {
  result: CalculationResult | null;
  loading: boolean;
  error?: string;
}

// 错误类型
export enum InputErrorType {
  INVALID_DATE = 'invalid_date',
  MISSING_REQUIRED_FIELD = 'missing_required_field',
  INVALID_TIME_FORMAT = 'invalid_time_format',
  INCONSISTENT_LOCATION = 'inconsistent_location'
}

export interface InputError {
  type: InputErrorType;
  field: string;
  message: string;
  suggestion?: string;
}
