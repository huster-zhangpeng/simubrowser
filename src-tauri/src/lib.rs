use gateway::ForwardServer;
use tauri::Url;
use tracing::info;

mod common;

pub enum RunEvent {
    OnResume,
    OnPause,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    common::init().await;
    info!("Tauri app started");

    let _ = ForwardServer::serve("127.0.0.1:5380".parse().unwrap()).await;

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(mobile)]
            {
                use gateway::LOCALHOST;
                use tauri::async_runtime;
                use tauri::ipc::Channel;
                use tauri_plugin_app_events::AppEventsExt;
                use tracing::error;

                let app_handle = app.handle();

                let _ = app_handle.plugin(tauri_plugin_app_events::init());

                let (tx, mut rx) = tokio::sync::mpsc::channel(1);

                async_runtime::spawn({
                    async move {
                        while let Some(event) = rx.recv().await {
                            match event {
                                RunEvent::OnResume => {
                                    info!("[fff] app resumed");
                                    match LOCALHOST.get() {
                                        Some(localhost) => {
                                            localhost.resume_network().await;
                                        }
                                        None => {
                                            error!("localhost should be initialized");
                                        }
                                    }
                                }
                                RunEvent::OnPause => {
                                    info!("[fff] app paused");
                                }
                            }
                        }
                    }
                });

                let tx_clone = tx.clone();
                app_handle
                    .app_events()
                    .set_resume_handler(Channel::new(move |_| {
                        async_runtime::block_on(async {
                            match tx_clone.send(RunEvent::OnResume).await {
                                Ok(()) => {
                                    info!("send resume event");
                                }
                                Err(e) => {
                                    error!("failed to send resume event: {:?}", e);
                                }
                            };
                        });
                        Ok(())
                    }))?;

                let tx_clone = tx.clone();
                app_handle
                    .app_events()
                    .set_pause_handler(Channel::new(move |_| {
                        async_runtime::block_on(async {
                            match tx_clone.send(RunEvent::OnPause).await {
                                Ok(()) => {
                                    info!("send pause event");
                                }
                                Err(e) => {
                                    error!("failed to send pause event: {:?}", e);
                                }
                            };
                        });
                        Ok(())
                    }))?;
            }

            let win_builder =
                tauri::WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::App("/".into()))
                    .proxy_url(Url::parse("http://127.0.0.1:5380")?);

            #[cfg(target_os = "macos")]
            let win_builder = win_builder.title("阡陌").inner_size(800.0, 600.0).center();

            let _main_window = win_builder.build().expect("failed to build window");

            info!("window created");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
