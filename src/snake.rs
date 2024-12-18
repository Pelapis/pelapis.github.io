use crate::Route;
use dioxus::{prelude::*, web::WebEventExt};
use gloo::events::EventListener;
use gloo::timers::future::sleep;
use gloo::{dialogs::alert, utils::window};
use rand::random;
use std::time::Duration;
use web_sys::KeyboardEvent;
use web_sys::{wasm_bindgen::JsCast, CanvasRenderingContext2d, HtmlCanvasElement};

// 设定画布的宽高，以及网格的行列数
const WIDTH: u32 = 380 * 2;
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
    let mut canvas: Signal<Option<std::rc::Rc<MountedData>>> = use_signal(move || None);

    let world = use_memo(move || {
        let mut world: Vec<Vec<WorldStates>> =
            vec![vec![WorldStates::None; CELL_COUNT as usize]; CELL_COUNT as usize];
        for (x, y) in snake().iter() {
            world[*x as usize][*y as usize] = WorldStates::Snake;
        }
        let (x, y) = food();
        world[x as usize][y as usize] = WorldStates::Food;
        world
    });

    let _ = use_effect(move || {
        let canvas = canvas()
            .expect("canvas is not mounted")
            .as_web_event()
            .dyn_into::<HtmlCanvasElement>()
            .expect("canvas is not HtmlCanvasElement");
        let ctx = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<CanvasRenderingContext2d>()
            .expect("Failed to convert to CanvasRenderingContext2d");

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

    let _ = use_future(move || async move {
        loop {
            let mut new_snake = snake();
            let head = new_snake[0];
            let mut will_hit_wall = false;
            let new_head = match current_direction() {
                Directions::Up => {
                    if head.1 == 0 {
                        will_hit_wall = true
                    }
                    (head.0, (head.1 + CELL_COUNT - 1) % CELL_COUNT)
                }
                Directions::Down => {
                    if head.1 == CELL_COUNT - 1 {
                        will_hit_wall = true
                    }
                    (head.0, (head.1 + 1) % CELL_COUNT)
                }
                Directions::Left => {
                    if head.0 == 0 {
                        will_hit_wall = true
                    }
                    ((head.0 + CELL_COUNT - 1) % CELL_COUNT, head.1)
                }
                Directions::Right => {
                    if head.0 == CELL_COUNT - 1 {
                        will_hit_wall = true
                    }
                    ((head.0 + 1) % CELL_COUNT, head.1)
                }
            };

            // 判断是否撞到蛇身或墙壁
            for (x, y) in new_snake.iter() {
                if new_head == (*x, *y) || will_hit_wall {
                    alert(format!("游戏结束！您的得分是：{}！", snake().len() - 3).as_str());
                    navigator().push(Route::Home {});
                    return;
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

            // 设定定时器的间隔时间
            let duration = Duration::from_millis(900 / snake().len() as u64 + 100);
            sleep(duration).await;
        }
    });

    EventListener::new(&window(), "keydown", move |event| {
        let key = event.dyn_ref::<KeyboardEvent>().unwrap().key();
        if key == "ArrowUp" || key == "ArrowDown" || key == "ArrowLeft" || key == "ArrowRight" {
            event.prevent_default();
        }
        let new_direction = match key.as_str() {
            "ArrowUp" | "w" => Directions::Up,
            "ArrowDown" | "s" => Directions::Down,
            "ArrowLeft" | "a" => Directions::Left,
            "ArrowRight" | "d" => Directions::Right,
            _ => return,
        };
        if new_direction != current_direction().reverse() {
            current_direction.set(new_direction);
        }
    })
    .forget();

    rsx! {
        body {
            ontouchend: move |event| async move {
                let touch = event
                    .data()
                    .touches_changed()
                    .get(0)
                    .unwrap()
                    .client_coordinates()
                    .to_tuple();
                let origin = canvas()
                    .expect("canvas is not mounted")
                    .get_client_rect()
                    .await
                    .unwrap()
                    .origin;
                let x = touch.0 - origin.x;
                let y = touch.1 - origin.y;
                let direction = match (y > x, x + y > HEIGHT as f64 / 2.) {
                    (false, false) => Directions::Up,
                    (true, false) => Directions::Left,
                    (true, true) => Directions::Down,
                    (false, true) => Directions::Right,
                };
                if direction != current_direction() && direction != current_direction().reverse()
                {
                    current_direction.set(direction);
                }
            },
            header {
                h1 { "贪吃蛇" }
            }
            main {
                h3 { "得分：{snake().len() - 3}" }
                canvas {
                    style: format!("width: {}px; height: {}px;", WIDTH / 2, HEIGHT / 2),
                    width: WIDTH as f64,
                    height: HEIGHT as f64,
                    onmounted: move |element| async move {
                        canvas.set(Some(element.data()));
                    }
                }
                h6 { "手机：点击画面上下左右" }
                h6 { "电脑：W A S D 键或上下左右键" }
            }
            footer {
                "Made by Cavendish. Back to  "
                Link { to: Route::Home {}, "Home" }
                "."
            }
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
