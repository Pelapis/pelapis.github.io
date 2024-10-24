use html::canvas;
use leptos::*;
use wasm_bindgen::JsCast;
use web_sys::CanvasRenderingContext2d;

// 设定画布的宽高，以及网格的行列数
const WIDTH: u32 = 500;
const HEIGHT: u32 = 500;
const CELL_NUMBER: i32 = 25;

#[component]
pub fn Snake() -> impl IntoView {
    let pressed_key = create_rw_signal(Direction::None);
    let canvas = canvas();
    canvas.set_width(WIDTH);
    canvas.set_height(HEIGHT);
    let ctx: CanvasRenderingContext2d = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into()
        .expect("转换为canvas context2d失败");
    ctx.begin_path();
    ctx.set_stroke_style_str("black");

    // 画出竖线
    for i in (0..=CELL_NUMBER).map(|i| i * WIDTH as i32 / CELL_NUMBER) {
        ctx.move_to(i as f64, 0.0);
        ctx.line_to(i as f64, HEIGHT as f64);
    }
    // 画出横线
    for i in (0..=CELL_NUMBER).map(|i| i * HEIGHT as i32 / CELL_NUMBER) {
        ctx.move_to(0.0, i as f64);
        ctx.line_to(WIDTH as f64, i as f64);
    }

    ctx.stroke();

    view! {
        <div
            on: keydown=move |event| {
                let key = event.key();
                match key.as_str() {
                    "ArrowUp" | "w" => pressed_key.set(Direction::Up),
                    "ArrowDown" | "s" => pressed_key.set(Direction::Down),
                    "ArrowLeft" | "a" => pressed_key.set(Direction::Left),
                    "ArrowRight" | "d" => pressed_key.set(Direction::Right),
                    _ => {}
                };
            }
            on: click=move |event| {
                let touch = event;
                let client_x = touch.client_x() as f64;
                let client_y = touch.client_y() as f64;

            }
        >
            <header>
                <h1>"贪吃蛇"</h1>
            </header>
            <h1> { move || format!("{:?}", pressed_key.get()) } </h1>
            <main>
                {canvas}
            </main>
            <h6>"手机：点击画面上下左右"</h6>
            <h6>"电脑：上下左右键或wasd键"</h6>
            <footer>
                "Made by Cavendish. Back to " <a href="/">"Home"</a> "."
            </footer>
        </div>
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
enum Direction {
    Up,
    Down,
    Left,
    Right,
    None,
}
