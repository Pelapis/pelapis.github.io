// 导入wasm函数

document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
        const active = document.querySelector('.active');
        if (active) {
            active.classList.remove('active');
        }
        button.classList.add('active');
        // 获取button内部文本
        let name = button.innerText;
        // 变成小写
        name = name.toLowerCase();
        console.log(name);
        // 更改图片说明
        document.querySelector("figcaption").innerText = `10 years investment simulation of ${name}`;
        // 更改图片链接
        const url = `https://raw.githubusercontent.com/Pelapis/invest-simulation/4797be2b9d79f8e0133475afaba49515608b5b5b/plots/py/${name}.png`;
        document.querySelector("img").src = url;
        // 重新加载图片
        document.querySelector("img").src = url;
        // 刷新图片
        document.querySelector("img").src = url;

        // // 用一个已经定义的异步函数getData来获取数据
        // data = getData(name);
        // // 用echarts绘制图像
        // drawChart(data);
    });
});
