// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod types;
mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            validate_birth_info,
            calculate_bazi,
            get_user_preferences,
            save_user_preferences,
            get_app_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
