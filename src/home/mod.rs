use dioxus::prelude::*;

#[component]
pub fn Home() -> Element {
    rsx! {
        div { class: "card bg-base-100 w-96 shadow-sm",
            div { class: "card-body items-center text-center",
                h2 { class: "card-title", "欢迎来到我的主页！" }
            }
        }
    }
}
