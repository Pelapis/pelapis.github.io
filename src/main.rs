#![allow(non_snake_case)]

use dioxus::prelude::*;
use tracing::Level;

fn main() {
    // Init logger
    dioxus_logger::init(Level::INFO).expect("failed to init logger");
    launch(App);
}

#[component]
fn App() -> Element {
    rsx! {
        link { href: "daisyui_full.min.css", rel: "stylesheet" }
        header {
            h1 { class: "btn btn-ghost text-xl place-self-center text-center",
                "Investment Simulation Plots"
            }
        }
        header { class: "navbar bg-base-300 justify-center",
            p { "CSI300 Index, Maotai and Mengjie" }
        }
        div { role: "tablist", class: "tabs tabs-boxed",
            button { "Index" }
            button { "Maotai" }
            button { "Mengjie" }
        }
        main { id: "figures",
            figure {
                div { class: "plot", "收益对持有期曲线图" }
                figcaption { "低水平组🙁（正确率0.45）" }
            }
            figure {
                div { class: "plot", "收益对持有期曲线图" }
                figcaption { "中水平组😐（正确率0.5）" }
            }
            figure {
                div { class: "plot", "收益对持有期曲线图" }
                figcaption { "高水平组😄（正确率0.55）" }
            }
        }
        footer { class: "footer footer-center p-4 bg-base-300 text-base-content",
            p {
                span {
                    "Made by "
                    strong { "Cavendish" }
                    ". The source code is on "
                    a { href: "https://github.com/Pelapis/invest-simulation", "GitHub." }
                }
            }
            a { href: "snake/index.html", "贪吃蛇🐍小游戏" }
        }
    }
}
