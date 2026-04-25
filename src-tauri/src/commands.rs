// Tauri命令定义

use crate::types::*;
use chrono::Utc;
use uuid::Uuid;

// 验证出生信息
#[tauri::command]
pub async fn validate_birth_info(birth_info: BirthInfo) -> Result<bool, String> {
    // 基本验证逻辑
    if birth_info.year < 1900 || birth_info.year > 2100 {
        return Err("年份必须在1900-2100之间".to_string());
    }
    
    if birth_info.month < 1 || birth_info.month > 12 {
        return Err("月份必须在1-12之间".to_string());
    }
    
    if birth_info.day < 1 || birth_info.day > 31 {
        return Err("日期必须在1-31之间".to_string());
    }
    
    if birth_info.hour < 0 || birth_info.hour > 23 {
        return Err("小时必须在0-23之间".to_string());
    }
    
    if birth_info.minute < 0 || birth_info.minute > 59 {
        return Err("分钟必须在0-59之间".to_string());
    }
    
    // 验证日期有效性
    if !is_valid_date(birth_info.year, birth_info.month, birth_info.day) {
        return Err("无效的日期".to_string());
    }
    
    Ok(true)
}

// 八字计算命令 (暂时返回模拟数据)
#[tauri::command]
pub async fn calculate_bazi(birth_info: BirthInfo) -> Result<BaZiResult, String> {
    // 验证输入
    validate_birth_info(birth_info.clone()).await?;
    
    // 创建模拟的八字结果
    let result = BaZiResult {
        base: BaseCalculationResult {
            id: Uuid::new_v4().to_string(),
            calculation_type: CalculationType::BaZi,
            birth_info: birth_info.clone(),
            timestamp: Utc::now(),
            version: "1.0.0".to_string(),
        },
        result: BaZiResultData {
            pillars: BaZiPillars {
                year: BaZiPillar {
                    heavenly: "甲".to_string(),
                    earthly: "子".to_string(),
                },
                month: BaZiPillar {
                    heavenly: "乙".to_string(),
                    earthly: "丑".to_string(),
                },
                day: BaZiPillar {
                    heavenly: "丙".to_string(),
                    earthly: "寅".to_string(),
                },
                hour: BaZiPillar {
                    heavenly: "丁".to_string(),
                    earthly: "卯".to_string(),
                },
            },
            elements: BaZiElements {
                wood: 2,
                fire: 1,
                earth: 2,
                metal: 1,
                water: 2,
            },
            useful_god: "水".to_string(),
            avoid_god: "火".to_string(),
            analysis: BaZiAnalysis {
                personality: "性格温和，善于思考，具有很强的直觉力。".to_string(),
                career: "适合从事文化、教育、咨询等行业。".to_string(),
                wealth: "财运平稳，需要通过努力获得财富。".to_string(),
                health: "注意肾脏和泌尿系统的保养。".to_string(),
                relationship: "感情丰富，容易获得异性好感。".to_string(),
            },
        },
    };
    
    Ok(result)
}

// 获取用户偏好设置
#[tauri::command]
pub async fn get_user_preferences() -> Result<UserPreferences, String> {
    // 返回默认偏好设置
    Ok(UserPreferences {
        ui: UiPreferences {
            theme: "light".to_string(),
            language: "zh-CN".to_string(),
            font_size: "medium".to_string(),
            sidebar_collapsed: false,
        },
        defaults: DefaultPreferences {
            country: "中国".to_string(),
            province: "北京市".to_string(),
            city: "朝阳区".to_string(),
            calculation_type: CalculationType::BaZi,
        },
        privacy: PrivacyPreferences {
            save_history: true,
            encrypt_data: true,
            auto_cleanup: false,
            cleanup_days: 30,
        },
        window: WindowPreferences {
            width: 1200,
            height: 800,
            x: 0,
            y: 0,
            maximized: false,
        },
    })
}

// 保存用户偏好设置
#[tauri::command]
pub async fn save_user_preferences(preferences: UserPreferences) -> Result<(), String> {
    // 这里应该保存到数据库或配置文件
    // 暂时只返回成功
    println!("保存用户偏好设置: {:?}", preferences);
    Ok(())
}

// 获取应用信息
#[tauri::command]
pub async fn get_app_info() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "name": "正统命理·精准测算",
        "version": "1.0.0",
        "description": "传统文化智慧·科学测算分析"
    }))
}

// 辅助函数：验证日期有效性
fn is_valid_date(year: i32, month: i32, day: i32) -> bool {
    if month < 1 || month > 12 {
        return false;
    }
    
    let days_in_month = match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 => {
            if is_leap_year(year) {
                29
            } else {
                28
            }
        }
        _ => return false,
    };
    
    day >= 1 && day <= days_in_month
}

// 辅助函数：判断闰年
fn is_leap_year(year: i32) -> bool {
    (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}