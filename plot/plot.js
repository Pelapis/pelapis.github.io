// 导入wasm函数

document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
        const active_button = document.querySelector("button.active");
        if (active_button) {
            active_button.classList.remove("active");
        }
        button.classList.add("active");
        // 获取button内部文本
        let name = button.innerText;
        // 更改图片说明
        document.querySelector("figcaption").innerText = `10 years investment simulation of ${name}`;
        // 变成小写
        name = name.toLowerCase();
        // 更改图片链接
        const url = `https://raw.githubusercontent.com/Pelapis/invest-simulation/main/plots/py/${name}.png`;
        document.querySelector("img").src = url;

        /* // 用一个已经定义的异步函数getData来获取数据
        data = getData(name);
        // 用echarts绘制图像
        drawChart(data); */
    });
});
document.querySelector("button").click();
