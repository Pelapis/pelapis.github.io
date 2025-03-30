use dioxus::{document::eval, prelude::*};
use futures::{lock::Mutex, StreamExt};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};

#[component]
pub fn Invest() -> Element {
    let mut stock = use_signal(move || "沪深300".to_string());
    let mut freq_days = use_signal(move || 1);
    let mut accuracy = use_signal(move || 0.5);
    let mut cost = use_signal(move || 0.001);

    let script = r#"
        console.log("画图✍️！");
        const values = await dioxus.recv();
        console.log(values);
    "#;

    rsx! {
        script { src: "https://cdn.jsdelivr.net/npm/vega@5.30.0" }
        script { src: "https://cdn.jsdelivr.net/npm/vega-lite@5.21.0" }
        script { src: "https://cdn.jsdelivr.net/npm/vega-embed@6.26.0" }

        main { class: "flex flex-col items-center",
            h1 { class: "title", "投资模拟" }

            div { class: "flex flex-row flex-wrap justify-center",
                fieldset { class: "fieldset",
                    legend { class: "fieldset-legend", "股票" }
                    select {
                        class: "select",
                        onchange: move |e| stock.set(e.value()),
                        option { disabled: "false", selected: "false", "选择一只股票..." }
                        option { "沪深300" }
                        option { "贵州茅台" }
                        option { "梦洁股份" }
                    }
                }
                fieldset { class: "fieldset",
                    legend { class: "fieldset-legend", "持有天数" }
                    input {
                        onchange: move |e| freq_days.set(e.value().parse().unwrap()),
                        placeholder: "请输入交易频率天数",
                        class: "input",
                        r#type: "number",
                        min: "1",
                        max: "100",
                        step: "1",
                        value: "1",
                    }
                }
                fieldset { class: "fieldset",
                    legend { class: "fieldset-legend", "投资准确率" }
                    input {
                        onchange: move |e| accuracy.set(e.value().parse().unwrap()),
                        placeholder: "请输入投资准确率，0-1之间",
                        class: "input",
                        r#type: "number",
                        min: "0",
                        max: "1",
                        step: "0.01",
                        value: "0.5",
                    }
                }
                fieldset { class: "fieldset",
                    legend { class: "fieldset-legend", "交易成本" }
                    input {
                        onchange: move |e| cost.set(e.value().parse().unwrap()),
                        placeholder: "请输入交易成本，0-1之间",
                        class: "input",
                        r#type: "number",
                        min: "0",
                        max: "1",
                        step: "0.001",
                        value: "0.001",
                    }
                }
            }

            div { class: "flex justify-center",
                button {
                    class: "btn",
                    onclick: move |_| async move {
                        let eval = eval(script);
                        let data = compute_data(stock(), freq_days(), accuracy(), cost()).await.unwrap();
                        eval.send(data).unwrap();
                    },
                    "开始模拟"
                }
            }
            div { class: "flex justify-center",
                h1 { "stock: {stock}\n" }
                h1 { "freq_days: {freq_days}" }
                h1 { "accuracy: {accuracy}" }
                h1 { "cost: {cost}" }
            }
            div { id: "vis" }


            footer {
                p {
                    "Made by "
                    strong { "Cavendish" }
                    ". The source code is on "
                    a {
                        class: "link",
                        href: "https://github.com/Pelapis/invest-simulation",
                        "GitHub"
                    }
                    "."
                }
            }
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct Value {
    index: usize,
    mean: f64,
    low: f64,
    up: f64,
}

/// 从JavaScript中获取一个0-1之间的随机浮点数
async fn get_rand() -> f64 {
    let eval = eval("return Math.random()");
    let rand = eval
        .join::<f64>()
        .await
        .expect("从JavaScript获取随机数失败！");
    rand
}

/// 根据前日资产，是否持有，当日收益率，投资准确率更新资产和持有状态
async fn get_new_state(
    (asset, hold): (f64, bool),
    freq_days: usize,
    index: usize,
    data: Vec<f64>,
    accuracy: f64,
    cost: f64,
) -> (f64, bool) {
    let rate = data[index];
    let period_return = data[index..index + freq_days].iter().product::<f64>();
    if index % freq_days == 0 {
        let rand = get_rand().await;
        if (period_return > 1.) == (accuracy > rand) {
            return (asset * rate, true);
        } else {
            if hold {
                return (asset * (1. - cost), false);
            }
        }
    } else {
        if hold {
            return (asset * rate, true);
        }
    }
    return (asset, hold);
}

/// 根据股票名称，交易频率，交易准确率获取绘图数据
async fn compute_data(
    stock: String,
    freq_days: usize,
    accuracy: f64,
    cost: f64,
) -> Result<Vec<Value>, Box<dyn std::error::Error>> {
    // 数据路径字典
    let paths = [
        (
            "沪深300",
            "http://127.0.0.1:8080/assets/data/data_index.csv",
        ),
        ("贵州茅台", "assets/data/data_maotai.csv"),
        ("梦洁股份", "assets/data/data_mengjie.csv"),
    ]
    .into_iter()
    .collect::<HashMap<_, _>>();

    let path = paths.get(&*stock).unwrap().to_string();

    // 数据获取和预处理
    let data = reqwest::get(path).await?.text().await?;
    eval("console.log('运行了🏃！')");
    let data = data
        .lines()
        .filter_map(|line| line.split(',').nth(2)?.parse::<f64>().ok())
        .collect::<Vec<f64>>();

    let values = futures::stream::iter(0..data.len())
        .scan(
            Arc::new(Mutex::new(vec![(1., true); 100])),
            move |state, x| {
                let state = Arc::clone(state);
                let data = data.clone();

                async move {
                    // 1. 取出当前状态的所有权
                    let current_state = state.lock().await.clone();

                    // 2. 处理所有投资者状态
                    let new_state =
                        futures::stream::iter(current_state)
                            .then(|s| {
                                let data = data.clone();
                                async move {
                                    get_new_state(s, freq_days, x, data, accuracy, cost).await
                                }
                            })
                            .collect::<Vec<_>>()
                            .await;

                    // 3. 计算结果统计
                    let vs = new_state.iter().map(|(a, _)| *a).collect::<Vec<_>>();
                    let mean = vs.iter().sum::<f64>() / vs.len() as f64;
                    let low = *vs.iter().min_by(|a, b| a.partial_cmp(b).unwrap()).unwrap();
                    let up = *vs.iter().max_by(|a, b| a.partial_cmp(b).unwrap()).unwrap();

                    // 4. 写回新状态
                    *state.lock().await = new_state;

                    Some(Value {
                        index: x,
                        mean,
                        low,
                        up,
                    })
                }
            },
        )
        .collect::<Vec<_>>()
        .await;

    Ok(values)
}
