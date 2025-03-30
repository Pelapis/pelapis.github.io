pub mod snake;
pub use snake::Snake;

use dioxus::prelude::*;

#[component]
pub fn Games() -> Element {
    rsx! {
        header {
            h1 { "游戏集" }
        }
        nav {
            button {
                a { href: "/games/snake", "贪吃蛇" }
            }
        }
    }
}
