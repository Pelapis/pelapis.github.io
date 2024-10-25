mod snake;

use charming::{
    component::{Axis, Grid, Title},
    element::{AreaStyle, AxisLabel, AxisPointer, AxisType, ItemStyle, Label, LineStyle, Symbol},
    series::Line,
    Chart, ChartResize, WasmRenderer,
};
use ev::resize;
use gloo::net::http::Request;
use leptos::*;
use leptos_router::*;
use rand::random;
use serde::{Deserialize, Serialize};
use snake::Snake;
use web_sys::HtmlDivElement;

fn main() {
    mount_to_body(move || view! { <App /> });
}

#[component]
fn App() -> impl IntoView {
    view! {
        <Router>
            <Routes>
                <Route path="/" view=Home />
                <Route path="/snake" view=Snake />
            </Routes>
        </Router>
    }
}

#[component]
fn Home() -> impl IntoView {
    let stock = create_rw_signal(0);
    let width: RwSignal<u32> = create_rw_signal(900);
    let height: RwSignal<u32> = create_rw_signal(600);
    let chart_node = create_node_ref();

    let paths = vec![
        "data/data_index.csv".to_string(),
        "data/data_maotai.csv".to_string(),
        "data/data_mengjie.csv".to_string(),
    ];
    let path = move || paths[stock.get()].clone();

    let data_resource = create_resource(path, move |path| async move {
        // 读取并计算数据
        let data = compute_data(path).await.unwrap();
        // 生成图表
        let chart = chart(data.clone());
        // 渲染图表
        let renderer = WasmRenderer::new_opt(None, None);
        let _this_echarts = renderer.render("chart", &chart).unwrap();
        data
    });

    let _plot_resource = create_resource(
        move || (width.get(), height.get()),
        move |(width, height)| async move {
            let data = data_resource.get().unwrap();
            let chart = chart(data);
            let renderer = WasmRenderer::new_opt(None, None);
            let this_echarts = renderer.render("chart", &chart).unwrap();
            WasmRenderer::resize_chart(
                &this_echarts,
                ChartResize::new(width, height, false, Option::None),
            );
        },
    );

    window_event_listener(resize, move |_| {
        let node: &HtmlDivElement = &(*chart_node.get().unwrap());
        width.set(node.client_width().try_into().unwrap());
        height.set(node.client_height().try_into().unwrap());
    });

    view! {
    <header>
      <h1>"Investment Simulation Plots"</h1>
      <p>"CSI300 Index, Maotai and Mengjie"</p>
    </header>
    <aside>
      <button
        on:click={move |_| stock.set(0)}
        class={move || if stock.get() == 0 { "active" } else { "" }}
      >"Index"</button>
      <button
        on:click={move |_| stock.set(1)}
        class={move || if stock.get() == 1 { "active" } else { "" }}
      >"Maotai"</button>
      <button
        on:click={move |_| stock.set(2)}
        class={move || if stock.get() == 2 { "active" } else { "" }}
      >"Mengjie"</button>
    </aside>
    <main id="figures">
      <figure>
        <div class="plot" id="chart" node_ref=chart_node>{ move ||
            match data_resource.get() {
                None => view! { "正在计算数据..." },
                Some(_) => view! { "正在渲染图表..." },
            }
        }</div>
        <figcaption>"中水平组😐（正确率0.5）"</figcaption>
      </figure>
    </main>
    <footer>
      <p>
        Made by <strong>" Cavendish"</strong>. The source code is on 
        <a href="https://github.com/Pelapis/invest-simulation">" GitHub"</a>.
      </p>
      // 链接到贪吃蛇小游戏
      <a href="/snake">"贪吃蛇🐍小游戏"</a>
    </footer>
    <script type="module" src="index.js"></script>
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
        let percentile90 = investor_returns[(investor_count as f64 * 0.9 - 1.).ceil() as usize];
        data[i].value = mean;
        data[i].l = percentile10;
        data[i].u = percentile90;
        data[i].date = day_names[i].to_string();
    }

    gloo::console::log!(format!("{:?}", data));
    Ok(data)
}
