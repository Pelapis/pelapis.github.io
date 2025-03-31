pub mod invest;
pub use invest::Invest;

use dioxus::prelude::*;

use crate::components::Navbar;

#[component]
pub fn Cases() -> Element {
    let mut route = use_context::<Signal<i32>>();
    route.set(1);

    rsx! {
        Navbar { name: "案例集" }

        ul { class: "list bg-base-100 rounded-box shadow-md",
            li { class: "list-row",
                div {
                    svg {
                        class: "size-10 rounded-box",
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "200",
                        height: "200",
                        "viewBox": "0 0 48 48",
                        g { fill: "#3F51B5",
                            circle { cx: "8", r: "3", cy: "38" }
                            circle { cy: "40", cx: "16", r: "3" }
                            circle { r: "3", cx: "24", cy: "33" }
                            circle { cy: "35", cx: "32", r: "3" }
                            circle { cy: "31", cx: "40", r: "3" }
                            path { d: "m39.1 29.2l-7.3 3.7l-8.3-2.1l-8 7l-7-1.7l-1 3.8l9 2.3l8-7l7.7 1.9l8.7-4.3z" }
                        }
                        g { fill: "#00BCD4",
                            circle { cx: "8", cy: "20", r: "3" }
                            circle { cx: "16", cy: "22", r: "3" }
                            circle { cx: "24", r: "3", cy: "15" }
                            circle { cy: "20", r: "3", cx: "32" }
                            circle { r: "3", cx: "40", cy: "8" }
                            path { d: "M38.3 6.9c-2.1 3.2-5.3 8-6.9 10.4c-1.2-.7-3.1-2-6.4-4l-1.3-.8l-8.3 7.3l-7-1.7l-1 3.9l9 2.3l7.7-6.7c2.6 1.6 5.8 3.6 6.5 4.1l.5.5l.9-.1c1.1-.1 1.1-.1 9.5-12.9l-3.2-2.3z" }
                        }
                    }
                }
                div { class: "self-center text-sm uppercase font-semibold", "投资模拟" }
                button {
                    class: "btn btn-square btn-ghost",
                    onclick: |_| {
                        navigator().push("/cases/invest");
                    },
                    svg {
                        xmlns: "http://www.w3.org/2000/svg",
                        "viewBox": "0 0 24 24",
                        class: "size-[1.2em]",
                        g {
                            stroke: "currentColor",
                            fill: "none",
                            "stroke-linejoin": "round",
                            "stroke-linecap": "round",
                            "stroke-width": "2",
                            path { d: "M6 3L20 12 6 21 6 3z" }
                        }
                    }
                }
            }
        }
    }
}
