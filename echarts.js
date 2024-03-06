// 导入wasm函数
import * as wasm from "./pkg/rust.js";

function plot(chartDom, x, y_mean, y_upper, y_lower) {
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    legend: {
      data: ["y", "y_upper", "y_lower"],
    },
    xAxis: {
      type: "log",
      scale: false,
    },
    yAxis: {
      type: 'value'
    },
    dataset: {
      source: {
        "x": x,
        "y": y_mean,
        "y_upper": y_upper,
        "y_lower": y_lower,
      },
    },
    series: [
      {
        type: "line",
        encode: {
          x: "x",
          y: "y",
        },
      },
      {
        type: "line",
        encode: {
          x: "x",
          y: "y_upper",
        },
        areaStyle: {
          color: "#ccc"
        },
        showSymbol: false,
      },
      {
        type: "line",
        encode: {
          x: "x",
          y: "y_lower",
        },
        areaStyle: {
          color: "rgba(255, 255, 255, 1)",
          opacity: 1,
        },
        showSymbol: false,
      },
    ],
  };

  myChart.setOption(option);
  // 使图表自适应窗口大小
  window.addEventListener('resize', function () {
    myChart.resize();
  });
}

(async () => {
  // 实例化wasm
  await wasm.default();
  // 点击后设置图片
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", async () => {
      const active_button = document.querySelector("button.active");
      if (active_button) {
        active_button.classList.remove("active");
      }
      button.classList.add("active");
      // 获取button内部文本
      const name = button.innerText.toLowerCase();
      // 用一个已经定义的异步函数getData来获取数据
      const resp = await fetch(`data/data_${name}.csv`);
      const data = await resp.text();
      const return_vector = wasm.DataReader.return_vector_from_string(data);
      const data_generator = wasm.DataGenerator.new(return_vector, 1000, 0.0);
      const x = Array.from({ length: 2500 }, (_, i) => i + 1);
      const x_log = x.map((i) => Math.log(i));
      // 获取DOM对象
      const figures = document.querySelectorAll("figure div");
      for (let key = 0; key < figures.length; key++) {
        figures[key].innerHTML = "";
        const level = (key - 1) * 0.05 + 0.5;
        const y = x.map((i) => data_generator.plot_data(level, i, 1.0));
        const y_mean = y.map((i) => i[0]);
        // 计算95%置信区间
        const y_upper = y.map((i) => i[0] + 1.96 * i[1]);
        const y_lower = y.map((i) => i[0] - 1.96 * i[1]);
        // 用echarts绘制图像
        plot(figures[key], x, y_mean, y_upper, y_lower);
      }
    });
  });
  // 默认显示项
  document.querySelector("button:nth-child(1)").click();
})();
