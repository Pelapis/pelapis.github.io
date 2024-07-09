#![allow(non_snake_case)]

use dioxus::prelude::*;
use tracing::Level;

fn main() {
    // Init logger
    dioxus_logger::init(Level::INFO).expect("failed to init logger");
    launch(App);
}

#[component]
fn Example() -> Element {
    // Build cool things ✌️
    rsx! {
        link { rel: "stylesheet", href: "main.css" }
        img { src: "header.svg", id: "header" }
        div { id: "links",
            a { target: "_blank", href: "https://dioxuslabs.com/learn/0.5/", "📚 Learn Dioxus" }
            a { target: "_blank", href: "https://dioxuslabs.com/awesome", "🚀 Awesome Dioxus" }
            a {
                target: "_blank",
                href: "https://github.com/dioxus-community/",
                "📡 Community Libraries"
            }
            a {
                target: "_blank",
                href: "https://github.com/DioxusLabs/dioxus-std",
                "⚙️ Dioxus Standard Library"
            }
            a {
                target: "_blank",
                href: "https://marketplace.visualstudio.com/items?itemName=DioxusLabs.dioxus",
                "💫 VSCode Extension"
            }
            a { target: "_blank", href: "https://discord.gg/XgGxMSkvUM", "👋 Community Discord" }
        }
    }
}

#[component]
fn App() -> Element {
    rsx! {
            head {
                class: "navbar bg-base-300 justify-center",
                meta { charset: "UTF-8" }
                meta {
                    content: "width=device-width, initial-scale=1.0",
                    name: "viewport"
                }
                title { "主页" }
                link { href: "style.css", rel: "stylesheet" }
                script { src: "highcharts.js" }
                script { src: "highcharts-more.js" }
            }
            body {
                header {
                    h1 { "Investment Simulation Plots" }
                    p { "CSI300 Index, Maotai and Mengjie" }
                }
                aside {
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
                footer {
                    class: "footer footer-center p-4 bg-base-300 text-base-content",
                    p {
                        "\n        Made by "
                        strong { "Cavendish" }
                        ". The source code is on\n        "
                        a { href: "https://github.com/Pelapis/invest-simulation",
                            "GitHub"
                        }
                        ".\n      "
                    }
                    a { href: "snake/index.html", "贪吃蛇🐍小游戏" }
                }
                Example {}
                script { src: "index.js", r#type: "module" }
            }
    }
}
