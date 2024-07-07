
    html { lang: "zh-CN",
        head {
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
                p {
                    "\n        Made by "
                    strong { "Cavendish" }
                    ". The source code is on\n        "
                    a { href: "https://github.com/Pelapis/invest-simulation", "GitHub" }
                    ".\n      "
                }
                a { href: "snake/index.html", "贪吃蛇🐍小游戏" }
            }
            script { src: "index.js", r#type: "module" }
        }
    }