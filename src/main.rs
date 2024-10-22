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
    let action = create_action(|_input: &()| async {
        let chart = Chart::new()
            .title(Title::new().text("Demo: Leptos + Charming"))
            .x_axis(
                Axis::new()
                    .type_(AxisType::Category)
                    .data(vec!["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
            )
            .y_axis(Axis::new().type_(AxisType::Value))
            .series(Line::new().data(vec![150, 230, 224, 218, 135, 147, 260]));

        let renderer = WasmRenderer::new(600, 400);
        renderer.render("chart", &chart).unwrap();
    });
    create_effect(move |_| {
        if stock.get() == 0 {
            action.dispatch(());
        };
    });
    // 获取数据

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
        <div class="plot"
          id="chart"
        >"收益对持有期曲线图"</div>
        <figcaption>"低水平组🙁（正确率0.45）"</figcaption>
      </figure>
      <figure>
        <div class="plot">"收益对持有期曲线图"</div>
        <figcaption>"中水平组😐（正确率0.5）"</figcaption>
      </figure>
      <figure>
        <div class="plot">"收益对持有期曲线图"</div>
        <figcaption>"高水平组😄（正确率0.55）"</figcaption>
      </figure>
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

pub fn chart(data: Vec<DataItem>) -> Chart {

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
              .data(data.iter().map(|x| x.day.to_string()).collect())
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

struct DataItem {
  day: i32,
  value: f64,
  l: f64,
  u: f64,
}