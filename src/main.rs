mod cases;
mod components;
mod games;
mod home;
use cases::{Cases, Invest};
use games::{Games, Snake};
use home::Home;

use dioxus::prelude::*;

fn main() {
    let mut launch_builder = LaunchBuilder::new();
    // 如果启用 ssg feature，则使用静态生成
    if cfg!(feature = "ssg") {
        launch_builder = launch_builder.with_cfg(server_only! {
            ServeConfig::builder()
                .incremental(IncrementalRendererConfig::new().static_dir(std::env::current_exe().unwrap().parent().unwrap().join("public")).clear_cache(false))
                .enable_out_of_order_streaming()
        })
    }
    launch_builder.launch(Layout);
}

#[rustfmt::skip]
#[derive(Routable, Clone)]
enum Route {
    #[route("/")]
    Home {},
    #[nest("/cases")]
        #[route("/")]
        Cases {},
        #[route("/invest")]
        Invest {},
    #[end_nest]
    #[nest("/games")]
        #[route("/")]
        Games {},
        #[route("/snake")]
        Snake {},
}

#[component]
fn Layout() -> Element {
    let route = use_context_provider(|| Signal::new(0));
    let home_state = use_memo(move || if route() == 0 { "menu-active" } else { "" });
    let cases_state = use_memo(move || if route() == 1 { "menu-active" } else { "" });
    let games_state = use_memo(move || if route() == 2 { "menu-active" } else { "" });

    rsx! {
        // 网页head
        document::Title { "个人主页" }
        document::Stylesheet { href: "/assets/tailwind.css" }

        // 网页主体
        main { class: "flex flex-row h-screen",
            // 侧边栏上下居中
            ul { class: "menu bg-gray-100 rounded-box w-56 gap-2 justify-center",
                li {
                    a {
                        href: "/",
                        class: "flex items-center gap-3 hover:bg-primary/10 rounded-btn transition-colors {home_state}",
                        svg {
                            fill: "none",
                            "stroke-width": "2",
                            width: "24",
                            "stroke-linecap": "round",
                            "viewBox": "0 0 24 24",
                            "stroke-linejoin": "round",
                            stroke: "currentColor",
                            height: "24",
                            xmlns: "http://www.w3.org/2000/svg",
                            class: "icon icon-tabler icons-tabler-outline icon-tabler-home",
                            path {
                                fill: "none",
                                stroke: "none",
                                d: "M0 0h24v24H0z",
                            }
                            path { d: "M5 12l-2 0l9 -9l9 9l-2 0" }
                            path { d: "M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" }
                            path { d: "M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" }
                        }
                        span { class: "font-medium", "主页" }
                    }
                }
                li {
                    a {
                        href: "/cases",
                        class: "flex items-center gap-3 hover:bg-primary/10 rounded-btn transition-colors {cases_state}",
                        svg {
                            height: "24",
                            "stroke-width": "2",
                            "stroke-linejoin": "round",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            "stroke-linecap": "round",
                            width: "24",
                            "viewBox": "0 0 24 24",
                            stroke: "currentColor",
                            class: "icon icon-tabler icons-tabler-outline icon-tabler-briefcase",
                            path {
                                stroke: "none",
                                fill: "none",
                                d: "M0 0h24v24H0z",
                            }
                            path { d: "M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" }
                            path { d: "M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" }
                            path { d: "M12 12l0 .01" }
                            path { d: "M3 13a20 20 0 0 0 18 0" }
                        }
                        span { class: "font-medium", "案例集" }
                    }
                }
                li {
                    a {
                        href: "/games",
                        class: "flex items-center gap-3 hover:bg-primary/10 rounded-btn transition-colors {games_state}",
                        svg {
                            "stroke-width": "2",
                            "stroke-linecap": "round",
                            xmlns: "http://www.w3.org/2000/svg",
                            height: "24",
                            "viewBox": "0 0 24 24",
                            "stroke-linejoin": "round",
                            width: "24",
                            fill: "none",
                            stroke: "currentColor",
                            class: "icon icon-tabler icons-tabler-outline icon-tabler-device-gamepad-2",
                            path {
                                stroke: "none",
                                d: "M0 0h24v24H0z",
                                fill: "none",
                            }
                            path { d: "M12 5h3.5a5 5 0 0 1 0 10h-5.5l-4.015 4.227a2.3 2.3 0 0 1 -3.923 -2.035l1.634 -8.173a5 5 0 0 1 4.904 -4.019h3.4z" }
                            path { d: "M14 15l4.07 4.284a2.3 2.3 0 0 0 3.925 -2.023l-1.6 -8.232" }
                            path { d: "M8 9v2" }
                            path { d: "M7 10h2" }
                            path { d: "M14 10h2" }
                        }
                        span { class: "font-medium", "游戏集" }
                    }
                }
            }

            div { id: "主内容区", class: "flex-1 flex flex-col p-6 ", Router::<Route> {} }
        }
    }
}

// 如果 ssg feature 启用，则使用静态生成
#[cfg(feature = "ssg")]
#[server(endpoint = "static_routes")]
async fn static_routes() -> Result<Vec<String>, ServerFnError> {
    // The `Routable` trait has a `static_routes` method that returns all static routes in the enum
    Ok(Route::static_routes()
        .iter()
        .map(ToString::to_string)
        .collect())
}
