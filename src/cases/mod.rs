pub mod invest;
pub use invest::Invest;

use dioxus::prelude::*;

#[component]
pub fn Cases() -> Element {
    rsx! {
        header {
            h1 { "案例集" }
        }
        nav {
            button {
                a { href: "/cases/invest", "投资模拟" }
            }
        }
    }
}
