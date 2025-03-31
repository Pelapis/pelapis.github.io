use dioxus::prelude::*;

#[component]
pub fn Navbar(name: String) -> Element {
    rsx! {
        nav { class: "navbar container mx-auto px-4",
            div { class: "navbar-start",
                div { class: "dropdown",
                    label { tabindex: "0", class: "btn btn-ghost lg:hidden",
                        svg {
                            "viewBox": "0 0 24 24",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            stroke: "currentColor",
                            class: "h-5 w-5",
                            path {
                                "stroke-width": "2",
                                "stroke-linejoin": "round",
                                "stroke-linecap": "round",
                                d: "M4 6h16M4 12h8m-8 6h16",
                            }
                        }
                    }
                }
            }
            div { class: "navbar-center",
                h1 { class: "text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
                    "{name}"
                }
            }
            div { class: "navbar-end",
                div { id: "theme-toggle" }
            }
        }
    }
}
