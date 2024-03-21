const plotter = new Worker("plotter.js", { type: "module" });

// 点击后设置图片
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", async () => {
    // 按钮设置为激活状态
    const active_button = document.querySelector("button.active");
    if (active_button) {
      active_button.classList.remove("active");
    }
    button.classList.add("active");
    // 对应的图片显示加载中
    const figures = document.querySelectorAll(".plot");
    figures.forEach((figure) => {
      figure.innerHTML = "<p>正在加载...</p>";
    });
    // 发送消息给Worker
    const name = button.innerText.toLowerCase(); // 获取按钮内部文本
    const response = await fetch(`data/data_${name}.csv`);
    const data = await response.text();
    plotter.postMessage({ data });
    // 从Worker接收数据
    plotter.onmessage = (event) => {
      let x = event.data.x;
      let plot_data = event.data.plot_data;
      // 把图片更改为绘制的图像
      figures.forEach((figure, index) => {
        figure.innerHTML = "";
        console.log("开始更新第" + index + "个图像");
        // 用绘图包绘制图像
        plot(figure, x, plot_data[index]);
      });
      console.log("图像更新完成");
    };
  });
});
// 默认点击第一个按钮
document.querySelector("button:nth-child(1)").click();

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
