use wasm_bindgen::JsCast;



// 定义蛇结构
struct Snake {
    body: Vec<i32>,
    head_direction: Direction,
}

impl Snake {
    fn update_snake(&mut self, world: &Vec<bool>, food: &mut Vec<i32>) {
        let new_head = Self::update_body(&self.body[0], &self.head_direction);
        match world[new_head as usize] {
            false => {
                self.body.pop();
                self.body.insert(0, new_head);
            }
            true => {
                for i in food.iter_mut() {
                    if i == &new_head {
                        *i = gen_one_food(&world);
                        self.body.insert(0, new_head);
                        return;
                    }
                }
                // 碰到自己，游戏结束
                web_sys::window()
                    .unwrap()
                    .alert_with_message(
                        format!("游戏结束！您的得分是：{}！", self.body.len()).as_str(),
                    )
                    .unwrap();
                // 刷新页面
                web_sys::window().unwrap().location().reload().unwrap();
            }
        }
    }
}
