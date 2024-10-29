use crate::Route;
use dioxus::{prelude::*, web::WebEventExt};
use gloo::{dialogs::alert, events::EventListener, utils::window};
use rand::random;
use std::time::Duration;
use tokio::time::sleep;
use web_sys::{wasm_bindgen::JsCast, CanvasRenderingContext2d, HtmlCanvasElement};

// 设定画布的宽高，以及网格的行列数
const WIDTH: u32 = 380;
const HEIGHT: u32 = WIDTH;
const CELL_COUNT: usize = 17;

#[component]
pub fn Snake() -> Element {
    let mut snake = use_signal(move || {
        vec![
            (CELL_COUNT / 2, CELL_COUNT - 3),
            (CELL_COUNT / 2, CELL_COUNT - 2),
            (CELL_COUNT / 2, CELL_COUNT - 1),
        ]
    });
    let mut food = use_signal(move || {
        (
            random::<usize>() % CELL_COUNT,
            random::<usize>() % CELL_COUNT,
        )
    });
    let mut current_direction = use_signal(move || Directions::Up);
    let mut ctx: Signal<Option<CanvasRenderingContext2d>> = use_signal(move || None);
    let mut canvas_origin = use_signal(move || (0., 0.));

    let world = use_memo(move || {
        let mut world = vec![vec![WorldStates::None; CELL_COUNT as usize]; CELL_COUNT as usize];
        for (x, y) in snake().iter() {
            world[*x as usize][*y as usize] = WorldStates::Snake;
        }
        let (x, y) = food();
        world[x as usize][y as usize] = WorldStates::Food;
        world
    });

    let _ = use_future(move || async move {
        loop {
            // 根据蛇的长度决定定时器的间隔时间
            let duration = Duration::from_millis(500 - snake().len() as u64 * 10);
            sleep(duration).await;

            let mut new_snake = snake();
            let head = new_snake[0];
            let new_head = match current_direction() {
                Directions::Up => (head.0, (head.1 + CELL_COUNT - 1) % CELL_COUNT),
                Directions::Down => (head.0, (head.1 + 1) % CELL_COUNT),
                Directions::Left => ((head.0 + CELL_COUNT - 1) % CELL_COUNT, head.1),
                Directions::Right => ((head.0 + 1) % CELL_COUNT, head.1),
            };

            // 判断是否碰到蛇身
            for (x, y) in new_snake.iter() {
                if new_head == (*x, *y) {
                    alert(format!("游戏结束！您的得分是：{}！", new_snake.len()).as_str());
                    window().location().reload().unwrap();
                }
            }

            new_snake.insert(0, new_head);
            if new_head == food() {
                food.set((
                    random::<usize>() % CELL_COUNT,
                    random::<usize>() % CELL_COUNT,
                ));
            } else {
                new_snake.pop();
            }
            snake.set(new_snake);
        }
    });

    let _ = use_effect(move || {
        let ctx = &ctx().unwrap();

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
                match world()[x][y] {
                    WorldStates::Snake => {
                        ctx.set_fill_style_str("black");
                    }
                    WorldStates::Food => {
                        ctx.set_fill_style_str("red");
                    }
                    WorldStates::None => {
                        continue;
                    }
                }
                ctx.fill_rect(
                    x as f64 * WIDTH as f64 / CELL_COUNT as f64,
                    y as f64 * HEIGHT as f64 / CELL_COUNT as f64,
                    WIDTH as f64 / CELL_COUNT as f64,
                    HEIGHT as f64 / CELL_COUNT as f64,
                );
            }
        }
    });

    // 监听键盘事件
    let _ = EventListener::new(&window(), "keydown", move |event| {
        let event = event.unchecked_ref::<web_sys::KeyboardEvent>();
        let key = &*event.key();
        let new_direction = match key {
            "ArrowUp" | "w" | "W" => Directions::Up,
            "ArrowDown" | "s" | "S" => Directions::Down,
            "ArrowLeft" | "a" | "A" => Directions::Left,
            "ArrowRight" | "d" | "D" => Directions::Right,
            _ => return,
        };
        if new_direction != current_direction().reverse() {
            current_direction.set(new_direction);
        }
    });

    rsx! {
        header {
            h1 { "贪吃蛇" }
        }
        h3 { "得分：{snake().len() - 3}" }
        main { ontouchend: move |event| {
            let touch = event.data().touches_changed().get(0).unwrap().client_coordinates().to_tuple();

            let x = touch.0 - canvas_origin().0;
            let y = touch.1 - canvas_origin().1;

            // 利用对角线方程，判断点击的位置
            let direction = match (y > x, y > HEIGHT as f64 - x) {
                (false, false) => Directions::Up,
                (true, false) => Directions::Left,
                (true, true) => Directions::Down,
                (false, true) => Directions::Right,
            };

            if direction != current_direction() && direction != current_direction().reverse()  {
                current_direction.set(direction);
            }
        },
            canvas { onmounted: move |element| async move {
                canvas_origin.set(element.data().get_client_rect().await.unwrap().origin.to_tuple());
                let this_ctx: CanvasRenderingContext2d = element.as_web_event().unchecked_into::<HtmlCanvasElement>().get_context("2d").unwrap().unwrap().unchecked_into();
                ctx.set(Some(this_ctx));
            }, }
        }
        h6 { "手机：点击画面上下左右" }
        h6 { "电脑：W A S D 键或上下左右键" }
        footer {
            "Made by Cavendish. Back to  " Link { to: Route::Home {}, "Home" } "."
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
enum Directions {
    Up,
    Down,
    Left,
    Right,
}

impl Directions {
    fn reverse(&self) -> Directions {
        match self {
            Directions::Up => Directions::Down,
            Directions::Down => Directions::Up,
            Directions::Left => Directions::Right,
            Directions::Right => Directions::Left,
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
enum WorldStates {
    None,
    Snake,
    Food,
}
