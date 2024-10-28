use dioxus::prelude::*;
use crate::Route;

#[component]
pub fn Snake() -> Element {
    rsx! {
        header {
            h1 { "贪吃蛇" }
        }
        h3 { "得分：" }
        main {}
        h6 { "手机：点击画面上下左右" }
        h6 { "电脑：W A S D 键或上下左右键" }
        footer {
            "Made by Cavendish. Back to  " Link { to: Route::Home {}, "Home" } "."
        }
    }
}
