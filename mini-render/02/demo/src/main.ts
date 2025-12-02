import { init } from '@/core/MiniRender';
import { Group } from '@/graphic/Group';
import { Circle } from '@/graphic/shape/Circle';

window.onload = () => {
    // 1. 初始化
    const container = document.getElementById('main')!;
    const zr = init(container);

    // 2. 创建一个 Group (当作太阳系中心)
    const sunGroup = new Group();
    sunGroup.x = 300;
    sunGroup.y = 300;

    // 3. 创建一个红色的太阳 (加入 Group)
    const sun = new Circle({
        shape: { r: 50 },
        style: { fill: '#F00' }
    });
    sunGroup.add(sun);

    // 4. 创建一个蓝色的地球 (加入 Group，相对太阳偏移)
    const earth = new Circle({
        shape: { r: 20 },
        style: { fill: '#00F' },
        position: [100, 0] // 距离太阳中心 100px
    });
    sunGroup.add(earth);

    // 5. 创建一个月亮 (加入地球 Group? 这里为了简单，我们让月亮单独在地球旁边)
    // 演示层级：我们把月亮直接加到 Group 里，但是 Z 设低一点
    const moon = new Circle({
        shape: { r: 10 },
        style: { fill: '#CCC' },
        position: [120, 0], // 在地球右边
        z: -1 // 放在最下面 (测试排序)
    });
    sunGroup.add(moon);

    // 6. 添加到 ZRender
    zr.add(sunGroup);

    // --- 动起来！(简单的动画循环) ---
    // 这验证了 Painter 的 refresh 和 Storage 的 updateTransform
    let angle = 0;
    function loop() {
        angle += 0.02;

        // 旋转整个太阳系
        sunGroup.rotation = angle;

        // 自转地球 (修改属性，标记 dirty)
        // 注意：Mini-ZR 还没实现 dirty 标记，我们需要手动调 refresh

        zr.refresh();
        requestAnimationFrame(loop);
    }

    loop();
}