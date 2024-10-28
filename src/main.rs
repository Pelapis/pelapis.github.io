#![allow(non_snake_case)]

mod snake;

use charming::{
    component::{Axis, Grid, Title},
    element::{AreaStyle, AxisLabel, AxisPointer, AxisType, ItemStyle, Label, LineStyle, Symbol},
    series::Line,
    Chart, ChartResize, WasmRenderer,
};
use dioxus::prelude::*;
use gloo::net::http::Request;
use rand::random;
use serde::{Deserialize, Serialize};
use snake::Snake;

#[derive(Clone, Routable, Debug, PartialEq)]
enum Route {
    #[route("/")]
    Home {},
    #[route("/snake")]
    Snake {},
}

fn main() {
    launch(App);
}

fn App() -> Element {
    rsx! {
        Router::<Route> {}
    }
}

#[component]
fn Home() -> Element {
    let mut stock = use_signal(move || 0);

    let paths = vec![
        "data/data_index.csv".to_string(),
        "data/data_maotai.csv".to_string(),
        "data/data_mengjie.csv".to_string(),
    ];

    let data_resource = use_resource(move || {
        let path = paths[stock()].clone();
        // 读取并计算数据
        async { compute_data(path).await.unwrap() }
    });

    rsx! {
        document::Link { rel: "stylesheet", href: "style.css" }
        document::Script { src: "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js" }
        document::Script { src: "https://cdn.jsdelivr.net/npm/echarts-gl@2.0.8/dist/echarts-gl.min.js" }
        header {
            h1 { "投资模拟" }
            p { "沪深300指数，贵州茅台 和 梦洁股份" }
        }
        aside {
            button { onclick: move |_| stock.set(0), class: if *stock.read() == 0 { "active" } else { "" },
                "沪深300"
            }
            button { onclick: move |_| stock.set(1), class: if *stock.read() == 1 { "active" } else { "" },
                "贵州茅台"
            }
            button { onclick: move |_| stock.set(2), class: if *stock.read() == 2 { "active" } else { "" },
                "梦洁股份"
            }
        }
        main { id: "figures",
            figure {
                div { class: "plot", id: "chart", onresize: move |ev| {
                        // 响应性调整图表大小
                        let (w, h) = ev.data().get_content_box_size().unwrap().to_tuple();
                        if let Some(data) = data_resource() {
                            let chart = chart(data);
                            let renderer = WasmRenderer::new_opt(None, None);
                            let echarts = renderer.render("chart", &chart).unwrap();
                            WasmRenderer::resize_chart(
                                &echarts,
                                ChartResize::new(w as u32, h as u32, false, Option::None),
                            );
                        }
                    },
                    match data_resource() {
                        None => "正在计算数据...",
                        Some(data) => {
                            let chart = chart(data);
                            let renderer = WasmRenderer::new_opt(None, None);
                            renderer.render("chart", &chart).unwrap();
                            "计算完成，正在绘制图表..."
                        },
                    }
                }
                figcaption { "中水平组😐（正确率0.5）" }
            }
        }
        footer {
            p {
                "Made by " strong { "Cavendish" } ". The source code is on "
                a { href: "https://github.com/Pelapis/invest-simulation", "GitHub" } "."
            }
            // 链接到贪吃蛇小游戏
            Link { to: Route::Snake {}, "贪吃蛇🐍小游戏" }
        }
    }
}

fn chart(data: Vec<DataItem>) -> Chart {
    /* let base = -data
    .iter()
    .fold(f64::INFINITY, |min, val| f64::floor(f64::min(min, val.l))); */
    let base = 0.;

    Chart::new()
        .title(Title::new().text("收益-持有期曲线图").left("center"))
        .grid(
            Grid::new()
                .left("3%")
                .right("4%")
                .bottom("3%")
                .contain_label(true),
        )
        .x_axis(
            Axis::new()
                .type_(AxisType::Category)
                .data(data.iter().map(|x| x.date.clone()).collect())
                .boundary_gap(false),
        )
        .y_axis(
            Axis::new()
                .axis_label(AxisLabel::new())
                .axis_pointer(AxisPointer::new().label(Label::new()))
                .split_number(3),
        )
        .series(
            Line::new()
                .name("L")
                .data(data.iter().map(|x| x.l + base).collect())
                .line_style(LineStyle::new().opacity(0))
                .stack("confidence-band")
                .symbol(Symbol::None),
        )
        .series(
            Line::new()
                .name("U")
                .data(data.iter().map(|x| x.u - x.l).collect())
                .line_style(LineStyle::new().opacity(0))
                .area_style(AreaStyle::new().color("#ccc"))
                .stack("confidence-band")
                .symbol(Symbol::None),
        )
        .series(
            Line::new()
                .data(data.iter().map(|x| x.value + base).collect())
                .item_style(ItemStyle::new().color("#333"))
                .show_symbol(false),
        )
}

#[derive(Clone, Serialize, Deserialize, Debug)]
struct DataItem {
    date: String,
    value: f64,
    l: f64,
    u: f64,
}

async fn request_data(path: String) -> String {
    Request::get(&path)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap()
}

async fn compute_data(path: String) -> Result<Vec<DataItem>, Box<dyn std::error::Error>> {
    let investor_count: usize = 100;
    let trading_cost: f64 = 0.001;
    let level: f64 = 0.5;
    let participation: f64 = 0.5;
    let days = vec![1, 2, 3, 5, 10, 21, 63, 250, 1250, 2500];
    let day_names = vec![
        "1天", "2天", "3天", "1周", "2周", "1月", "1季", "1年", "5年", "10年",
    ];

    // 数据预处理
    let text = request_data(path).await;
    let return_vector: Vec<f64> = text
        .lines()
        .filter_map(|line| line.split(',').nth(2)?.parse::<f64>().ok())
        .collect();

    let mut data: Vec<DataItem> = vec![
        DataItem {
            date: String::new(),
            value: 0.,
            l: 0.,
            u: 0.,
        };
        days.len()
    ];

    for (i, hold_day) in days.iter().enumerate() {
        let hold_count = return_vector.len().div_ceil(*hold_day);
        let adjusted_returns: Vec<f64> = (0..hold_count)
            .map(|j| {
                return_vector[j * hold_day..return_vector.len().min((j + 1) * hold_day)]
                    .iter()
                    .product()
            })
            .collect();

        // 计算各投资者的最终收益率
        let mut investor_returns: Vec<f64> = (0..investor_count)
            .map(|_| {
                adjusted_returns.iter().fold(1., |acc, &this_return| {
                    let is_growing = this_return > 1.;
                    let will_win = level > random::<f64>();
                    let will_participate = participation > random::<f64>();
                    if (is_growing == will_win) && will_participate {
                        return acc * this_return * (1. - trading_cost);
                    }
                    acc
                })
            })
            .collect();

        // 计算统计学特征，只保留一个数值
        let mean = investor_returns.iter().sum::<f64>() / investor_count as f64;
        investor_returns.sort_by(|a, b| a.partial_cmp(b).unwrap());
        let percentile10 = investor_returns[(investor_count as f64 * 0.1 - 1.).ceil() as usize];
        let percentile90 = investor_returns[(investor_count as f64 * 0.8 - 1.).ceil() as usize];
        data[i].value = mean;
        data[i].l = percentile10;
        data[i].u = percentile90;
        data[i].date = day_names[i].to_string();
    }

    Ok(data)
}
