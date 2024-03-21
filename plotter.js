import * as wasm from "./pkg/rust.js";

self.addEventListener("message", async (event) => {
  const data = event.data.data;
  // 实例化wasm
  await wasm.default();
  const return_vector = wasm.DataReader.return_vector_from_string(data);
  const data_generator = wasm.DataGenerator.new(return_vector, 1000, 0.0);
  const x = Array.from({ length: 2500 }, (_, i) => i + 1);
  let plot_data = [0.45, 0.5, 0.55].map((level) =>
    x.map((i) => {
      let plot_data = data_generator.plot_data(level, i, 1.0);
      return {
        mean: plot_data.mean,
        percentile10: plot_data.percentile10,
        percentile90: plot_data.percentile90,
      };
    }),
  );
  // 发送数据给主线程
  self.postMessage({ x, plot_data });
});
