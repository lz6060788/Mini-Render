import { init } from '@/core/MiniRender';
import { Group } from '@/graphic/Group';
import { Rect } from '@/graphic/shape/Rect';
import { Text } from '@/graphic/Text';

window.onload = () => {
    // 1. 初始化引擎
    const dom = document.getElementById('main')!;
    const miniRender = init(dom);

    // --- 配置数据 ---
    const data = [120, 200, 150, 80, 70, 110, 130];
    const categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // --- 图表布局配置 ---
    const chartConfig = {
        x: 50,          // 图表左边距
        y: 50,          // 图表上边距
        width: 500,     // 绘图区宽度
        height: 300,    // 绘图区高度
        barWidth: 30,   // 柱子宽度
        barColor: '#5470C6', // 默认颜色
        hoverColor: '#91CC75' // 高亮颜色
    };

    const chartGroup = new Group({
        position: [chartConfig.x, chartConfig.y]
    });
    miniRender.add(chartGroup); // <--- 先把 Group 挂载上去！

    const yAxis = new Rect({
        shape: {
            x: 0, 
            y: 0, 
            width: 1, 
            height: chartConfig.height
        },
        style: { fill: '#333' }
    });

    const xAxis = new Rect({
        shape: {
            x: 0, 
            y: chartConfig.height, 
            width: chartConfig.width, 
            height: 1
        },
        style: { fill: '#333' }
    });

    chartGroup.add(yAxis);
    chartGroup.add(xAxis);

    const tooltip = new Text({
        style: {
            text: '',
            fill: '#000',
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
            textBaseline: 'bottom'
        },
        z: 10,       // 保证在最上层
        invisible: true, // 初始隐藏
        silent: true // 关键：让 Tooltip 不阻挡鼠标，防止闪烁
    });
    chartGroup.add(tooltip);


    const step = chartConfig.width / data.length;
    const maxVal = Math.max(...data);

    data.forEach((value, index) => {
        const finalHeight = (value / maxVal) * (chartConfig.height - 40);
        const finalX = index * step + (step - chartConfig.barWidth) / 2;
        const finalY = chartConfig.height - finalHeight;

        const bar = new Rect({
            shape: {
                x: finalX,
                y: chartConfig.height,
                width: chartConfig.barWidth,
                height: 0
            },
            style: { fill: chartConfig.barColor }
        });
        chartGroup.add(bar);
        bar.animateTo(
            {
                shape: {
                    y: finalY,
                    height: finalHeight
                }
            },
            1000,
            'cubicOut',
            index * 100
        );

        const label = new Text({
            style: {
                text: categories[index],
                fill: '#666',
                fontSize: 12,
                textAlign: 'center',
                textBaseline: 'top'
            },
            position: [finalX + chartConfig.barWidth / 2, chartConfig.height + 10],
            silent: true
        });
        chartGroup.add(label);

        bar.on('mouseover', () => {
            bar.style.fill = chartConfig.hoverColor;

            tooltip.invisible = false;
            tooltip.style.text = `${value}`;
            tooltip.x = finalX + chartConfig.barWidth / 2;
            tooltip.y = finalY - 5;

            miniRender.refresh();
        });

        bar.on('mouseout', () => {
            bar.style.fill = chartConfig.barColor;
            tooltip.invisible = true;
            miniRender.refresh();
        });
    });

    // 将整个图表组添加到引擎
    miniRender.add(chartGroup);

    // 渲染第一帧
    miniRender.refresh();
}