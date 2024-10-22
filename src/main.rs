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

    let mut stock = create_rw_signal(0);

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
    <h1>{move || stock.get()}</h1>
    <main id="figures">
      <figure>
        <div class="plot">"收益对持有期曲线图"</div>
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
