// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod types;
mod commands;

use commands::*;
use tauri::{Manager, PhysicalSize, Size};

const MIN_WINDOW_WIDTH: u32 = 1080;
const MIN_WINDOW_HEIGHT: u32 = 720;

#[cfg(target_os = "macos")]
fn apply_macos_app_icon() {
    use objc2::{AllocAnyThread, MainThreadMarker};
    use objc2_app_kit::{NSApplication, NSImage};
    use objc2_foundation::NSData;

    let icon_bytes = include_bytes!(concat!(env!("CARGO_MANIFEST_DIR"), "/icons/icon.png"));
    let data = NSData::with_bytes(icon_bytes);

    if let Some(app_icon) = NSImage::initWithData(NSImage::alloc(), &data) {
        let mtm = unsafe { MainThreadMarker::new_unchecked() };
        let app = NSApplication::sharedApplication(mtm);
        unsafe { app.setApplicationIconImage(Some(&app_icon)) };
    }
}

fn configure_main_window(window: &tauri::WebviewWindow) -> tauri::Result<()> {
    window.set_decorations(true)?;
    window.set_resizable(true)?;
    window.set_maximizable(true)?;
    window.set_minimizable(true)?;
    window.set_min_size(Some(Size::Physical(PhysicalSize::new(
        MIN_WINDOW_WIDTH,
        MIN_WINDOW_HEIGHT,
    ))))?;

    if let Some(monitor) = window.current_monitor()? {
        let monitor_size = monitor.size();
        let width = ((monitor_size.width as f64) * 0.8).round() as u32;
        let height = ((monitor_size.height as f64) * 0.8).round() as u32;
        let width = width.max(MIN_WINDOW_WIDTH);
        let height = height.max(MIN_WINDOW_HEIGHT);

        window.set_size(Size::Physical(PhysicalSize::new(width, height)))?;
        window.center()?;
    }

    window.show()?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .setup(|app| {
            #[cfg(target_os = "macos")]
            apply_macos_app_icon();

            if let Some(window) = app.get_webview_window("main") {
                configure_main_window(&window)?;
            }

            Ok(())
        })
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
