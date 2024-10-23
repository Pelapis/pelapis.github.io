use std::thread;

use charming::component::Grid;
use charming::element::{
    AreaStyle, AxisLabel, AxisPointer, AxisPointerType, Formatter, ItemStyle, Label, LineStyle,
    Symbol, Tooltip, Trigger,
};
use charming::{
    component::{Axis, Title},
    element::AxisType,
    series::Line,
    Chart, WasmRenderer,
};
use leptos::*;
use leptos_router::*;
use rand::random;
use serde::{Deserialize, Serialize};

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
    let stock = create_rw_signal(1);
    let paths = vec![
        "data/data_index.csv".to_string(),
        "data/data_maotai.csv".to_string(),
        "data/data_mengjie.csv".to_string(),
    ];
    let path = move || paths[stock.get()].clone();
    let resource = create_resource(path, |path| async move {
        // 读取并计算数据
        let data = compute_data(path).await.unwrap();
        // 生成图表
        let chart = chart(data);
        // 渲染图表
        let renderer = WasmRenderer::new(900, 600);
        renderer.render("chart", &chart).unwrap();
    });

    // 创建新线程
    /*     let handle = thread::spawn(move || {
        let resource = create_resource(path, |path| async move {
            // 读取并计算数据
            let data = compute_data(path).await.unwrap();
            // 生成图表
            let chart = chart(data);
            // 渲染图表
            let renderer = WasmRenderer::new(900, 600);
            renderer.render("chart", &chart).unwrap();
        });
    }); */

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
    /*       <figure>
            <div class="plot">"收益对持有期曲线图"</div>
            <figcaption>"低水平组🙁（正确率0.45）"</figcaption>
          </figure> */
          <figure>
            <div class="plot" id="chart">{
                match resource.get() {
                    None => "正在计算数据...",
                    Some(_) => "收益对持有期曲线图",
                }
            }</div>
            <figcaption>"中水平组😐（正确率0.5）"</figcaption>
          </figure>
    /*       <figure>
            <div class="plot">"收益对持有期曲线图"</div>
            <figcaption>"高水平组😄（正确率0.55）"</figcaption>
          </figure> */
        </main>
        <footer>
          <p>
            Made by <strong>"Cavendish"</strong>. The source code is on
            <a href="https://github.com/Pelapis/invest-simulation">GitHub</a>.
          </p>
          // 链接到贪吃蛇小游戏
          <a href="/snake">"贪吃蛇🐍小游戏"</a>
        </footer>
        <script type="module" src="index.js"></script>
        }
}

#[component]
fn Snake() -> impl IntoView {
    view! {
        <div>
            <h1>{"Snake"}</h1>
            <a href="/">{"Home"}</a>
        </div>
    }
}

fn chart(data: Vec<DataItem>) -> Chart {
    let base = -data
        .iter()
        .fold(f64::INFINITY, |min, val| f64::floor(f64::min(min, val.l)));

    Chart::new()
      .title(
          Title::new()
              .text("Confidence Band")
              .subtext("Example in MetricsGraphics.js")
              .left("center"),
      )
      .tooltip(
          Tooltip::new()
              .trigger(Trigger::Axis)
              .axis_pointer(
                  AxisPointer::new().type_(AxisPointerType::Cross).label(
                      Label::new()
                          .background_color("#ccc")
                          .border_color("#aaa")
                          .border_width(1)
                          .shadow_blur(0)
                          .shadow_offset_x(0)
                          .shadow_offset_y(0)
                          .color("#222"),
                  ),
              )
              .formatter(
                  Formatter::Function(
                      format!("function (params) {{ return (params[2].name + '<br />' + ((params[2].value - {}) * 100).toFixed(1) + '%'); }}", base
                  ).into())
              ),
      )
      .grid(Grid::new().left("3%").right("4%").bottom("3%").contain_label(true))
      .x_axis(
          Axis::new()
              .type_(AxisType::Category)
              .data(data.iter().map(|x| x.date.clone()).collect())
              .boundary_gap(false)
      )
      .y_axis(
          Axis::new()
              .axis_label(AxisLabel::new().formatter(
                  Formatter::Function(format!("function (val) {{ return (val - {}) * 100 + '%'; }}", base).into()))
              )
              .axis_pointer(
                  AxisPointer::new().label(
                      Label::new().formatter(
                          Formatter::Function(format!("function (params) {{ return ((params.value - {}) * 100).toFixed(1) + '%'; }}", base).into())
                      )
                  )
              ).split_number(3)
      )
      .series(
          Line::new()
              .name("L")
              .data(data.iter().map(|x| x.l + base).collect())
              .line_style(LineStyle::new().opacity(0))
              .stack("confidence-band")
              .symbol(Symbol::None)
      )
      .series(
          Line::new()
              .name("U")
              .data(data.iter().map(|x| x.u - x.l).collect())
              .line_style(LineStyle::new().opacity(0))
              .area_style(AreaStyle::new().color("#ccc"))
              .stack("confidence-band")
              .symbol(Symbol::None)
      )
      .series(
          Line::new()
              .data(data.iter().map(|x| x.value + base).collect())
              .item_style(ItemStyle::new().color("#333"))
              .show_symbol(false))
}

#[derive(Clone, Serialize, Deserialize)]
struct DataItem {
    date: String,
    value: f64,
    l: f64,
    u: f64,
}

async fn compute_data(path: String) -> Result<Vec<DataItem>, Box<dyn std::error::Error>> {
    let investor_count: usize = 100;
    let trading_cost: f64 = 0.001;
    let level: f64 = 0.5;
    let participation: f64 = 0.5;
    let days = vec![1, 2, 3, 5, 10, 21, 63, 250, 1250, 2500];
    let day_names = vec![
        "1天", "2天", "3天", "1周", "2周", "1月", "1季度", "1年", "5年", "10年",
    ];

    // 数据预处理
    let text = reqwest::get(&path).await?.text().await?; // 读取数据
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
        let adjusted_return: Vec<f64> = (0..hold_count)
            .map(|i| {
                return_vector[i * hold_day..return_vector.len().min((i + 1) * hold_day)]
                    .iter()
                    .product()
            })
            .collect();
        // 生成需要的随机数
        let random_matrix: Vec<Vec<f64>> = (0..investor_count)
            .map(|_| (0..hold_count).map(|_| random::<f64>()).collect())
            .collect();
        // 计算各投资者的最终收益率
        let mut investor_returns: Vec<f64> = (0..investor_count)
            .map(|i| {
                adjusted_return
                    .iter()
                    .zip(random_matrix[i].iter())
                    .fold(1., |acc, (&e, &r)| {
                        let growing = e > 1.;
                        let win = r < level;
                        let participating = r < participation;
                        if growing == win && participating {
                            acc * e * (1. - trading_cost)
                        } else {
                            acc
                        }
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

    Ok(data)
}
