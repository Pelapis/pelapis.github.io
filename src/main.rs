mod cases;
mod games;
mod home;
use cases::{Cases, Invest};
use games::{Games, Snake};
use home::Home;

use dioxus::prelude::*;

fn main() {
    dioxus::LaunchBuilder::new()
        // // Set the server config only if we are building the server target
        // .with_cfg(server_only! {
        //     ServeConfig::builder()
        //         // Enable incremental rendering
        //         .incremental(
        //             IncrementalRendererConfig::new()
        //                 // Store static files in the public directory where other static assets like wasm are stored
        //                 .static_dir(
        //                     std::env::current_exe()
        //                         .unwrap()
        //                         .parent()
        //                         .unwrap()
        //                         .join("public")
        //                 )
        //                 // Don't clear the public folder on every build. The public folder has other files including the wasm
        //                 // binary and static assets required for the app to run
        //                 .clear_cache(false)
        //         )
        //         .enable_out_of_order_streaming()
        // })
        .launch(Layout);
}

#[component]
fn Layout() -> Element {
    rsx! {
        document::Title { "个人主页" }
        document::Stylesheet { href: "/assets/tailwind.css" }

        div { class: "navbar bg-base-100 shadow-sm",
            div { class: "navbar-start" }
            div { class: "navbar-center",
                a { class: "btn btn-ghost text-xl", href: "/", "个人主页" }
            }
            div { class: "navbar-end" }
        }

        div { class: "flex flex-row",
            ul { class: "menu bg-base-200 rounded-box w-56",
                li {
                    a { href: "/",
                        svg {
                            xmlns: "http://www.w3.org/2000/svg",
                            "viewBox": "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            class: "h-5 w-5",
                            path {
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                "stroke-linecap": "round",
                                d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                            }
                        }
                        "主页"
                    }
                }
                li {
                    a { href: "/cases",
                        svg {
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            stroke: "currentColor",
                            "viewBox": "0 0 24 24",
                            class: "h-5 w-5",
                            path {
                                "stroke-width": "2",
                                "stroke-linejoin": "round",
                                "stroke-linecap": "round",
                                d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                            }
                        }
                        "案例集"
                    }
                }
                li {
                    a { href: "/games",
                        svg {
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            stroke: "currentColor",
                            "viewBox": "0 0 24 24",
                            class: "h-5 w-5",
                            path {
                                "stroke-linecap": "round",
                                d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                                "stroke-width": "2",
                                "stroke-linejoin": "round",
                            }
                        }
                        "游戏集"
                    }
                }
            }
            Router::<Route> {}
        }
    }
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

// #[server(endpoint = "static_routes")]
// async fn static_routes() -> Result<Vec<String>, ServerFnError> {
//     // The `Routable` trait has a `static_routes` method that returns all static routes in the enum
//     Ok(Route::static_routes()
//         .iter()
//         .map(ToString::to_string)
//         .collect())
// }
