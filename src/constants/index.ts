// 应用常量定义

// 默认出生信息
export const DEFAULT_BIRTH_INFO = {
  year: 2006,
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  country: '中国',
  province: '北京市',
  city: '朝阳区'
};

// 时辰选项
export const TIME_PERIODS = [
  { value: 0, label: '子时 23-01' },
  { value: 2, label: '丑时 01-03' },
  { value: 4, label: '寅时 03-05' },
  { value: 6, label: '卯时 05-07' },
  { value: 8, label: '辰时 07-09' },
  { value: 10, label: '巳时 09-11' },
  { value: 12, label: '午时 11-13' },
  { value: 14, label: '未时 13-15' },
  { value: 16, label: '申时 15-17' },
  { value: 18, label: '酉时 17-19' },
  { value: 20, label: '戌时 19-21' },
  { value: 22, label: '亥时 21-23' }
];

// 年份选项 (1900-2100)
export const YEAR_OPTIONS = Array.from({ length: 201 }, (_, i) => ({
  value: 1900 + i,
  label: `${1900 + i}年`
}));

// 月份选项
export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}月`
}));

// 日期选项
export const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}日`
}));

// 省份城市数据
export const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  '中国': {
    '北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
    '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
    '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
    '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
    '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
    '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市']
  }
};

// 导航菜单项
export const NAVIGATION_ITEMS = [
  { key: 'home', label: '首页', icon: 'home' },
  { key: 'bazi', label: '八字测算', icon: 'calendar' },
  { key: 'ziwei', label: '紫微斗数', icon: 'star' },
  { key: 'liuyao', label: '六爻预测', icon: 'thunderbolt' },
  { key: 'qimen', label: '奇门遁甲', icon: 'compass' },
  { key: 'fengshui', label: '风水堪舆', icon: 'environment' },
  { key: 'business', label: '商务合作', icon: 'team' }
];

// 标签页配置
export const TAB_ITEMS = [
  { key: 'bazi', label: '四柱八字' },
  { key: 'ziwei', label: '紫微斗数' },
  { key: 'liuyao', label: '六爻预测' },
  { key: 'qimen', label: '奇门遁甲' },
  { key: 'fengshui', label: '风水堪舆' }
];

// 头部按钮配置
export const HEADER_BUTTONS = [
  { key: 'help', label: '使用帮助', icon: 'question-circle' },
  { key: 'records', label: '测算记录', icon: 'history' },
  { key: 'business', label: '商务合作', icon: 'team' }
];

// 应用信息
export const APP_INFO = {
  title: '正统命理·精准测算',
  subtitle: '传统文化智慧·科学测算分析',
  version: '1.0.0',
  author: '命理测算工作室'
};

// 默认用户偏好
export const DEFAULT_PREFERENCES = {
  ui: {
    theme: 'light' as const,
    language: 'zh-CN' as const,
    fontSize: 'medium' as const,
    sidebarCollapsed: false
  },
  defaults: {
    country: '中国',
    province: '北京市',
    city: '朝阳区',
    calculationType: 'bazi' as const
  },
  privacy: {
    saveHistory: true,
    encryptData: true,
    autoCleanup: false,
    cleanupDays: 30
  },
  window: {
    width: 1200,
    height: 800,
    x: 0,
    y: 0,
    maximized: false
  }
};

// 错误消息
export const ERROR_MESSAGES = {
  INVALID_DATE: '请输入有效的出生日期',
  MISSING_REQUIRED_FIELD: '此字段为必填项',
  INVALID_TIME_FORMAT: '时间格式不正确',
  INCONSISTENT_LOCATION: '位置信息不一致',
  CALCULATION_FAILED: '计算失败，请稍后重试',
  NETWORK_ERROR: '网络连接错误',
  STORAGE_ERROR: '数据存储失败'
};

// 成功消息
export const SUCCESS_MESSAGES = {
  CALCULATION_COMPLETE: '计算完成',
  DATA_SAVED: '数据保存成功',
  PREFERENCES_UPDATED: '设置已更新'
};
