import { create } from 'zustand';
import { AppState, AppActions, UserPreferences, BirthInfo, ValidationErrors } from '../types';
import { DEFAULT_PREFERENCES, DEFAULT_BIRTH_INFO, DEFAULT_CALCULATION_TYPE } from '../constants';

interface AppStore extends AppState, AppActions {}

export const useAppStore = create<AppStore>((set) => ({
  // 初始状态
  ui: {
    sidebarCollapsed: false,
    activeMenu: DEFAULT_CALCULATION_TYPE,
    activeTab: DEFAULT_CALCULATION_TYPE,
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
      results: { ...state.results, loading: true, error: null }
    }));

    try {
      // TODO: 实现实际的计算逻辑
      console.log('提交计算:', type, data);
      
      // 模拟计算延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set((state) => ({
        form: { ...state.form, isSubmitting: false },
        results: { ...state.results, loading: false }
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
