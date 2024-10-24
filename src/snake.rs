use std::time::Duration;

use html::canvas;
use leptos::*;
use rand::random;
use wasm_bindgen::JsCast;
use web_sys::CanvasRenderingContext2d;

// 设定画布的宽高，以及网格的行列数
const WIDTH: u32 = 500;
const HEIGHT: u32 = 500;
const CELL_COUNT: usize = 25;

#[component]
pub fn Snake() -> impl IntoView {
    // 创建蛇、食物、按键、方向和世界等状态
    let pressed_key = create_rw_signal(Directions::None);
    let snake = create_rw_signal(vec![
        (CELL_COUNT / 2, CELL_COUNT - 3),
        (CELL_COUNT / 2, CELL_COUNT - 2),
        (CELL_COUNT / 2, CELL_COUNT - 1),
    ]);
    let food = create_rw_signal((
        random::<usize>() % CELL_COUNT,
        random::<usize>() % CELL_COUNT,
    ));
    let current_direction = create_rw_signal(Directions::Up);
    let world = move || {
        let mut world = vec![vec![WorldStates::None; CELL_COUNT as usize]; CELL_COUNT as usize];
        for (x, y) in snake.get().iter() {
            world[*x as usize][*y as usize] = WorldStates::Snake;
        }
        let (x, y) = food.get();
        world[x as usize][y as usize] = WorldStates::Food;
        world
    };

    // 创建画布和画笔
    let canvas = canvas();
    canvas.set_width(WIDTH);
    canvas.set_height(HEIGHT);
    let ctx: CanvasRenderingContext2d = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into()
        .expect("转换为canvas context2d失败");

    // 创建定时器，每隔一段时间移动蛇
    set_interval(
        move || {
            let mut new_snake = snake.get();
            let head = new_snake[0];
            let new_head = match current_direction.get() {
                Directions::Up => (head.0, (head.1 + CELL_COUNT - 1) % CELL_COUNT),
                Directions::Down => (head.0, (head.1 + 1) % CELL_COUNT),
                Directions::Left => ((head.0 + CELL_COUNT - 1) % CELL_COUNT, head.1),
                Directions::Right => ((head.0 + 1) % CELL_COUNT, head.1),
                _ => (0, 0),
            };
            new_snake.insert(0, new_head);
            if new_head == food.get() {
                food.set((
                    random::<usize>() % CELL_COUNT,
                    random::<usize>() % CELL_COUNT,
                ));
            } else {
                new_snake.pop();
            }
            snake.set(new_snake);
        },
        Duration::from_millis(100),
    );

    // 渲染画布
    create_effect(move |_| {
        let world = world();

        // 画出网格
        ctx.clear_rect(0.0, 0.0, WIDTH as f64, HEIGHT as f64);
        ctx.begin_path();
        ctx.set_stroke_style_str("gray");
        for i in 0..=CELL_COUNT {
            ctx.move_to(i as f64 * WIDTH as f64 / CELL_COUNT as f64, 0.0);
            ctx.line_to(i as f64 * WIDTH as f64 / CELL_COUNT as f64, HEIGHT as f64);
        }
        for i in 0..=CELL_COUNT {
            ctx.move_to(0.0, i as f64 * HEIGHT as f64 / CELL_COUNT as f64);
            ctx.line_to(WIDTH as f64, i as f64 * HEIGHT as f64 / CELL_COUNT as f64);
        }
        ctx.stroke();

        // 画出蛇和食物
        for x in 0..CELL_COUNT {
            for y in 0..CELL_COUNT {
                match world[x][y] {
                    WorldStates::Snake => {
                        ctx.set_fill_style_str("black");
                        ctx.fill_rect(
                            x as f64 * WIDTH as f64 / CELL_COUNT as f64,
                            y as f64 * HEIGHT as f64 / CELL_COUNT as f64,
                            WIDTH as f64 / CELL_COUNT as f64,
                            HEIGHT as f64 / CELL_COUNT as f64,
                        );
                    }
                    WorldStates::Food => {
                        ctx.set_fill_style_str("red");
                        ctx.fill_rect(
                            x as f64 * WIDTH as f64 / CELL_COUNT as f64,
                            y as f64 * HEIGHT as f64 / CELL_COUNT as f64,
                            WIDTH as f64 / CELL_COUNT as f64,
                            HEIGHT as f64 / CELL_COUNT as f64,
                        );
                    }
                    _ => {}
                }
            }
        }
    });

    // 返回HTML视图
    view! {
        <div
            on: keydown=move |event| {
                let key = event.key();
                match key.as_str() {
                    "ArrowUp" | "w" => current_direction.set(Directions::Up),
                    "ArrowDown" | "s" => current_direction.set(Directions::Down),
                    "ArrowLeft" | "a" => current_direction.set(Directions::Left),
                    "ArrowRight" | "d" => current_direction.set(Directions::Right),
                    _ => {}
                };
            }
            on: click=move |event| {
                let click_x = event.offset_x() as f64;
                let click_y = event.offset_y() as f64;
                // 写出对角线方程，判断点击的位置
                match (click_y > click_x, click_y > HEIGHT as f64 - click_x) {
                    (false, false) => current_direction.set(Directions::Up),
                    (true, false) => current_direction.set(Directions::Left),
                    (true, true) => current_direction.set(Directions::Down),
                    (false, true) => current_direction.set(Directions::Right),
                }
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
enum Directions {
    Up,
    Down,
    Left,
    Right,
    None,
}

#[derive(Clone)]
enum WorldStates {
    None,
    Snake,
    Food,
}
