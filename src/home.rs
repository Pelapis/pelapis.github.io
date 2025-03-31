use crate::components::Navbar;
use dioxus::prelude::*;

#[component]
pub fn Home() -> Element {
    let mut route = use_context::<Signal<i32>>();
    route.set(0);

    rsx! {
        Navbar { name: "主页" }

        div { class: "flex-1 hero",
            div { class: "hero-content text-center",
                div { class: "max-w-md",
                    h1 { class: "text-5xl font-bold", "欢迎来到我的主页！" }
                    p { class: "py-6", "这是一个个人主页。展示了案例集和小游戏。" }
                }
            }
        }
    }
}
