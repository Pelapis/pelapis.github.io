#![allow(non_snake_case)]

mod snake;

use dioxus::prelude::*;
use gloo::net::http::Request;
use plotters::prelude::*;
use plotters_canvas::CanvasBackend;
use rand::random;
use serde::{Deserialize, Serialize};
use snake::Snake;

const DAYS: [(usize, &str); 10] = [
    (1, "1天"),
    (2, "2天"),
    (3, "3天"),
    (5, "1周"),
    (10, "2周"),
    (21, "1月"),
    (63, "1季"),
    (250, "1年"),
    (1250, "5年"),
    (2500, "10年"),
];

#[derive(Clone, Routable, Debug, PartialEq)]
enum Route {
    #[route("/")]
    Home {},
    #[route("/snake")]
    Snake {},
}

fn main() {
    launch(move || {
        rsx! {
            document::Stylesheet { href: asset!("/assets/style.css") }
            Router::<Route> {}
        }
    });
}

#[component]
fn Home() -> Element {
    let mut stock = use_signal(move || 0);

    rsx! {
        header {
            h1 { "投资模拟" }
            p { "沪深300指数，贵州茅台 和 梦洁股份" }
        }
        nav {
            button {
                onclick: move |_| stock.set(0),
                class: if stock() == 0 { "active" } else { "" },
                "沪深300"
            }
            button {
                onclick: move |_| stock.set(1),
                class: if stock() == 1 { "active" } else { "" },
                "贵州茅台"
            }
            button {
                onclick: move |_| stock.set(2),
                class: if stock() == 2 { "active" } else { "" },
                "梦洁股份"
            }
        }
        main { id: "figures",
            Chart { stock }
            figcaption { "中水平组😐（正确率0.5）" }
        }
        footer {
            p {
                "Made by "
                strong { "Cavendish" }
                ". The source code is on "
                a { href: "https://github.com/Pelapis/invest-simulation", "GitHub" }
                "."
            }
            // 链接到贪吃蛇小游戏
            Link { to: Route::Snake {}, "贪吃蛇🐍小游戏" }
        }
    }
}

#[component]
fn Chart(stock: Signal<usize>) -> Element {
    let plot_resource = use_resource(move || async move {
        let paths = vec![
            "assets/data/data_index.csv".to_string(),
            "assets/data/data_maotai.csv".to_string(),
            "assets/data/data_mengjie.csv".to_string(),
        ];
        let data = compute_data(paths[stock()].clone()).await.unwrap();

        let draw_area = CanvasBackend::new("chart").unwrap().into_drawing_area();
        draw_area.fill(&WHITE).unwrap();
        let mut chart = ChartBuilder::on(&draw_area)
            .caption("收益-持有期曲线图", ("sans-serif", 40).into_font())
            .margin_right(40)
            .x_label_area_size(60)
            .y_label_area_size(80)
            .build_cartesian_2d(0usize..9, -1.0..12.0)
            .unwrap();
        chart
            .configure_mesh()
            .label_style(("sans-serif", 24).into_font())
            .x_label_formatter(&|x| DAYS[*x].1.to_string())
            .draw()
            .unwrap();

        // 绘制曲线
        chart
            .draw_series(LineSeries::new(
                data.iter().enumerate().map(|(i, item)| (i, item.value)),
                BLACK.stroke_width(3),
            ))
            .unwrap();

        // 绘制误差区间
        let points = data
            .iter()
            .enumerate()
            .map(|(i, item)| (i, item.low))
            .chain(data.iter().enumerate().rev().map(|(i, item)| (i, item.up)))
            .collect::<Vec<_>>();
        let polygon = Polygon::new(points, &BLACK.mix(0.2));
        chart.plotting_area().draw(&polygon).unwrap();

        draw_area.present().unwrap();
    });

    rsx! {
        canvas {
            class: "plot",
            id: "chart",
            width: 800 * 2,
            height: 600 * 2,
            match plot_resource() {
                None => "正在计算数据...",
                Some(_) => { "计算完成，正在绘制图表..." },
            }
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
struct DataItem {
    date: String,
    value: f64,
    low: f64,
    up: f64,
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

    // 数据预处理
    let text = request_data(path).await;
    let return_vector: Vec<f64> = text
        .lines()
        .filter_map(|line| line.split(',').nth(2)?.parse::<f64>().ok())
        .collect();

    // 计算数据
    let data: Vec<DataItem> = DAYS
        .iter()
        .map(|(hold_day, day_name)| {
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
            investor_returns.sort_by(|a, b| a.partial_cmp(b).unwrap());
            let mean: f64 = investor_returns.iter().sum::<f64>() / investor_count as f64;
            let percentile10 = investor_returns[investor_count / 10];
            let percentile90 = investor_returns[investor_count * 9 / 10];

            DataItem {
                date: day_name.to_string(),
                value: mean,
                low: percentile10,
                up: percentile90,
            }
        })
        .collect();

    Ok(data)
}
