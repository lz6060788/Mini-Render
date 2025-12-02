import { init } from '@/core/MiniRender';
import { Group } from '@/graphic/Group';
import { Rect } from '@/graphic/shape/Rect';
import { Text } from '@/graphic/Text';

window.onload = () => {
    const zr = init(document.getElementById('main')!);

    // --- 示例 1: 创建一个简单的按钮 (Group + Rect + Text) ---

    const button = new Group({
        position: [100, 100], // 按钮整体位置
        // scale: [1.5, 1.5]     // 测试父级缩放对文本点击是否有效
    });

    // 1. 按钮背景
    const bg = new Rect({
        shape: {
            x: 0,
            y: 0,
            width: 120,
            height: 40,
            r: 10 // 圆角
        },
        style: {
            fill: '#409EFF',
            stroke: '#000',
            lineWidth: 1
        }
    });

    // 2. 按钮文字
    const label = new Text({
        style: {
            text: 'Hello World',
            fill: '#fff',
            fontSize: 16,
            textAlign: 'center',       // 水平居中
            textBaseline: 'middle'     // 垂直居中
        },
        // 将文字放到按钮中心
        position: [60, 20], // 120/2, 40/2
        z: 1 // 确保文字在背景上面
    });

    button.add(bg);
    button.add(label);
    zr.add(button);

    // --- 交互测试 ---

    // 点击背景变色
    bg.on('click', () => {
        console.log('Background clicked');
        bg.style.fill = bg.style.fill === '#409EFF' ? '#67C23A' : '#409EFF';
        zr.refresh();
    });
    // 点击文字变色
    label.on('click', () => {
        console.log('Text clicked');
        label.style.fill = label.style.fill === '#fff' ? '#000' : '#fff';
        zr.refresh();
    });
    // --- 动画测试 ---
    // 让按钮慢慢旋转，测试 Rect 和 Text 的点击区域是否跟着旋转
    let angle = 0;
    function loop() {
        // angle += 0.01;
        button.rotation = angle;

        // 如果想要看旋转效果，取消下面注释
        zr.refresh();
        requestAnimationFrame(loop);
    }
    loop();
}