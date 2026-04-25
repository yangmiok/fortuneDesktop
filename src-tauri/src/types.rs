// Rust类型定义，对应前端TypeScript类型

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BirthInfo {
    pub year: i32,
    pub month: i32,
    pub day: i32,
    pub hour: i32,
    pub minute: i32,
    pub country: String,
    pub province: String,
    pub city: String,
    pub longitude: Option<f64>,
    pub latitude: Option<f64>,
    pub timezone: Option<String>,
    pub lunar_year: Option<i32>,
    pub lunar_month: Option<i32>,
    pub lunar_day: Option<i32>,
    pub lunar_hour: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CalculationType {
    #[serde(rename = "bazi")]
    BaZi,
    #[serde(rename = "ziwei")]
    ZiWei,
    #[serde(rename = "liuyao")]
    LiuYao,
    #[serde(rename = "qimen")]
    QiMen,
    #[serde(rename = "fengshui")]
    FengShui,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaseCalculationResult {
    pub id: String,
    pub calculation_type: CalculationType,
    pub birth_info: BirthInfo,
    pub timestamp: DateTime<Utc>,
    pub version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaZiPillars {
    pub year: BaZiPillar,
    pub month: BaZiPillar,
    pub day: BaZiPillar,
    pub hour: BaZiPillar,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaZiPillar {
    pub heavenly: String,
    pub earthly: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaZiElements {
    pub wood: i32,
    pub fire: i32,
    pub earth: i32,
    pub metal: i32,
    pub water: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaZiAnalysis {
    pub personality: String,
    pub career: String,
    pub wealth: String,
    pub health: String,
    pub relationship: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaZiResultData {
    pub pillars: BaZiPillars,
    pub elements: BaZiElements,
    pub useful_god: String,
    pub avoid_god: String,
    pub analysis: BaZiAnalysis,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaZiResult {
    #[serde(flatten)]
    pub base: BaseCalculationResult,
    pub result: BaZiResultData,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserPreferences {
    pub ui: UiPreferences,
    pub defaults: DefaultPreferences,
    pub privacy: PrivacyPreferences,
    pub window: WindowPreferences,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UiPreferences {
    pub theme: String,
    pub language: String,
    pub font_size: String,
    pub sidebar_collapsed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DefaultPreferences {
    pub country: String,
    pub province: String,
    pub city: String,
    pub calculation_type: CalculationType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrivacyPreferences {
    pub save_history: bool,
    pub encrypt_data: bool,
    pub auto_cleanup: bool,
    pub cleanup_days: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowPreferences {
    pub width: i32,
    pub height: i32,
    pub x: i32,
    pub y: i32,
    pub maximized: bool,
}

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("无效的出生信息: {message}")]
    InvalidBirthInfo { message: String },
    
    #[error("计算引擎内部错误: {message}")]
    InternalError { message: String },
    
    #[error("不支持的计算类型: {calculation_type}")]
    UnsupportedCalculationType { calculation_type: String },
    
    #[error("数据库操作失败: {message}")]
    DatabaseError { message: String },
    
    #[error("文件系统错误: {message}")]
    FileSystemError { message: String },
}

impl AppError {
    pub fn to_user_friendly_message(&self) -> String {
        match self {
            AppError::InvalidBirthInfo { message } => {
                format!("输入信息有误：{}", message)
            }
            AppError::InternalError { .. } => {
                "计算过程中出现错误，请稍后重试".to_string()
            }
            AppError::UnsupportedCalculationType { calculation_type } => {
                format!("暂不支持{}类型的计算", calculation_type)
            }
            AppError::DatabaseError { .. } => {
                "数据保存失败，请检查存储空间并重试".to_string()
            }
            AppError::FileSystemError { .. } => {
                "文件操作失败，请检查权限设置".to_string()
            }
        }
    }
}