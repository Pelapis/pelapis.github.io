use dioxus::document::eval;
use dioxus::prelude::*;
use futures::FutureExt;

// 设定画布的宽高，以及网格的行列数
const WIDTH: u32 = 380 * 2;
const HEIGHT: u32 = WIDTH;
const CELL_COUNT: usize = 17;

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

async fn get_random_food(max_num: usize) -> (usize, usize) {
    let eval = eval(&format!(
        r#"
        const random1 = Math.floor(Math.random() * {max_num});
        const random2 = Math.floor(Math.random() * {max_num});
        return (random1, random2);
        "#
    ));
    eval.join().await.unwrap()
}

#[component]
pub fn Snake() -> Element {
    let mut snake = use_signal(move || {
        vec![
            (CELL_COUNT / 2, CELL_COUNT - 3),
            (CELL_COUNT / 2, CELL_COUNT - 2),
            (CELL_COUNT / 2, CELL_COUNT - 1),
        ]
    });
    let mut food = use_resource(|| get_random_food(CELL_COUNT));
    let mut current_direction = use_signal(move || Directions::Up);

    let world = use_resource(move || async move {
        let mut world: Vec<Vec<WorldStates>> =
            vec![vec![WorldStates::None; CELL_COUNT as usize]; CELL_COUNT as usize];
        for (x, y) in snake().iter() {
            world[*x as usize][*y as usize] = WorldStates::Snake;
        }

        loop {
            if let Some((x, y)) = *food.read_unchecked() {
                world[x as usize][y as usize] = WorldStates::Food;
                break;
            }
        }

        world
    });

    let _ = use_resource(move || async move {
        eval(
            r#"
            // 获取画布和上下文
            const canvas = document.querySelector('canvas');
            const ctx = canvas.getContext('2d');

            // 画出网格
            ctx.clearRect(0, 0, {WIDTH}, {HEIGHT});
            ctx.beginPath();
            ctx.strokeStyle = 'gray';
            for (let i = 0; i <= {CELL_COUNT}; i++) {
                ctx.moveTo(i * {WIDTH} / {CELL_COUNT}, 0);
                ctx.lineTo(i * {WIDTH} / {CELL_COUNT}, {HEIGHT});
            }
            for (let i = 0; i <= {CELL_COUNT}; i++) {
                ctx.moveTo(0, i * {HEIGHT} / {CELL_COUNT});
                ctx.lineTo({WIDTH}, i * {HEIGHT} / {CELL_COUNT});
            }
            ctx.stroke();
            "#,
        );

        loop {
            if let Some(world) = &*(world.read_unchecked()) {
                for x in 0..CELL_COUNT {
                    for y in 0..CELL_COUNT {
                        match world[x][y] {
                            WorldStates::Snake => {
                                eval("ctx.fillStyle = 'black';");
                            }
                            WorldStates::Food => {
                                eval("ctx.fillStyle = 'red';");
                            }
                            WorldStates::None => {
                                continue;
                            }
                        }
                        eval(
                            r#"
                            ctx.fillRect(
                                {x} * {WIDTH} / {CELL_COUNT},
                                {y} * {HEIGHT} / {CELL_COUNT},
                                {WIDTH} / {CELL_COUNT},
                                {HEIGHT} / {CELL_COUNT}
                            );
                            "#,
                        );
                    }
                }
                break;
            }
        }
        // 画出蛇和食物
    });

    use_future(move || async move {
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
                    eval(
                        r#"alert('游戏结束！您的得分是：' + (snake().length - 3) + '！');
                        // 重新定向到首页
                        location.href = '/games/snake';
                        "#,
                    );
                    return;
                }
            }

            new_snake.insert(0, new_head);

            loop {
                if let Some((x, y)) = *food.read_unchecked() {
                    if new_head == (x, y) {
                        food.restart();
                    } else {
                        new_snake.pop();
                    }
                    snake.set(new_snake);
                    break;
                }
            }

            // 设定定时器的间隔时间
            let _ = eval(
                r#"
                const duration = 900 / snake().length + 100;
                await new Promise((resolve) => setTimeout(resolve, duration));
                "#,
            )
            .await;
        }
    });

    let _ = use_resource(move || async move {
        let mut key_lis = eval(
            r#"
            // 添加键盘事件监听
            window.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault(); // 阻止默认事件
                }
                if (event.key === 'ArrowUp' || event.key === 'w') {
                    const new_direction = 'Up';
                } else if (event.key === 'ArrowDown' || event.key === 's') {
                    const new_direction = 'Down';
                } else if (event.key === 'ArrowLeft' || event.key === 'a') {
                    const new_direction = 'Left';
                } else if (event.key === 'ArrowRight' || event.key === 'd') {
                    const new_direction = 'Right';
                } else {
                    return;
                }

                dioxus.send(new_direction);

            });
            "#,
        );
        let mut mou_lis = eval(
            r#"
            // 获取canvas
            const canvas = document.querySelector('canvas');

            let HEIGHT = await dioxus.recv();

            // 添加触摸事件监听
            window.addEventListener('touchend', (event) => {
                const touch = event.changedTouches[0];
                const origin = canvas.getBoundingClientRect();
                const x = touch.clientX - origin.x;
                const y = touch.clientY - origin.y;
                if (y > x) {
                    if (x + y > HEIGHT / 2) {
                        const direction = 'Left';
                    } else {
                        const direction = 'Up';
                    }
                } else {
                    if (x + y > HEIGHT / 2) {
                        const direction = 'Down';
                    } else {
                        const direction = 'Right';
                    }
                }
                dioxus.send(direction);
            });
            "#,
        );
        mou_lis.send(HEIGHT).unwrap();

        loop {
            let new_direction = futures::select! {
                new_direction = key_lis.recv::<String>().fuse() => new_direction,
                new_direction = mou_lis.recv::<String>().fuse() => new_direction,
            }
            .unwrap();
            if new_direction != format!("{:?}", current_direction())
                && new_direction != format!("{:?}", current_direction().reverse())
            {
                current_direction.set(match new_direction.as_str() {
                    "Up" => Directions::Up,
                    "Down" => Directions::Down,
                    "Left" => Directions::Left,
                    "Right" => Directions::Right,
                    _ => current_direction(),
                });
            }
        }
    });

    rsx! {
        body {
            header {
                h1 { "贪吃蛇" }
            }
            main {
                h3 { "得分：{snake().len() - 3}" }
                canvas {
                    style: format!("width: {}px; height: {}px;", WIDTH / 2, HEIGHT / 2),
                    width: WIDTH as f64,
                    height: HEIGHT as f64,
                }
                h6 { "手机：点击画面上下左右" }
                h6 { "电脑：W A S D 键或上下左右键" }
            }
            footer { "Made by Cavendish." }
        }
    }
}
