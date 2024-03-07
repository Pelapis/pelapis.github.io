// 导入wasm函数
import * as wasm from "./pkg/rust.js";
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
      // 获取DOM对象
      const figures = document.querySelectorAll("figure div");
      for (let key = 0; key < figures.length; key++) {
        figures[key].innerHTML = "";
        const level = (key - 1) * 0.05 + 0.5;
        const plot_data = x.map((i) => data_generator.plot_data(level, i, 1.0));
        console.log(`打印一下：${plot_data[0].mean}`);
        // 用绘图包绘制图像
        plot(figures[key], x, plot_data);
      }
    });
  });
  // 默认点击第一个按钮
  document.querySelector("button:nth-child(1)").click();
})().catch(console.log("Promise Rejected"));

// Highcharts
function plot(chartDom, x, plot_data) {
  const interval = plot_data.map((i, index) => [
    x[index],
    i.percentile10,
    i.percentile90,
  ]);
  const mean = plot_data.map((i, index) => [x[index], i.mean]);

  Highcharts.chart(chartDom, {
    title: {
      text: "Mean and 90% Confidence Interval",
    },
    xAxis: { type: "logarithmic" },
    yAxis: {},
    tooltip: {
      crosshairs: true,
      shared: true,
    },
    series: [
      {
        name: "Mean",
        data: mean,
        zIndex: 1,
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: Highcharts.getOptions().colors[0],
        },
      },
      {
        name: "90% Interval",
        data: interval,
        type: "arearange",
        lineWidth: 0,
        linkedTo: ":previous",
        color: Highcharts.getOptions().colors[0],
        fillOpacity: 0.3,
        zIndex: 0,
        marker: {
          enabled: false,
        },
      },
    ],
    credits: { enabled: false },
  });
}

/* // G2
function plot(chartDom, x, plot_data) {
  const chart = new G2.Chart({
    container: chartDom,
    autoFit: true,
  });

  chart
    .data(x.map((i, index) => ({
      x: i,
      y_mean: plot_data[index].mean,
      y_upper: plot_data[index].percentile90,
      y_lower: plot_data[index].percentile10,
    })))
    .axis({ x: {}, y: {} })
    .scale({ x: { type: 'log' } })
    .interaction({ tooltip: { mount: 'body', } })

  chart.area()
    .encode({
      x: 'x',
      y: ['y_lower', 'y_upper'],
      shape: 'smooth',
    })
    .style({
      fillOpacity: 0.65,
      fill: '#64b5f6',
      lineWidth: 1,
    })

  chart.line()
    .encode({
      x: 'x',
      y: 'y_mean',
      color: '#FF6B3B',
      shape: 'smooth',
    })

  chart.render();
}
 */

// Echarts
/* function plot(chartDom, x, y_mean, y_upper, y_lower) {
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
 */
