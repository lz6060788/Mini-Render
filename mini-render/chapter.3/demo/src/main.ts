import { init } from '@/core/MiniRender';
import { Group } from '@/graphic/Group';
import { Circle } from '@/graphic/shape/Circle';

window.onload = () => {
    
    const miniRender = init(document.getElementById('main')!);
    
    const group = new Group({ position: [200, 200] });
    
    // 一个红色的圆
    const circle = new Circle({
        shape: { r: 50 },
        style: { fill: '#F00' }
    });
    
    // 绑定点击事件！
    circle.on('click', () => {
        console.log('Circle Clicked!');
        // 点击变色
        if (circle.style.fill === '#F00') {
            circle.style.fill = '#00F'; // 变蓝
        } else {
            circle.style.fill = '#F00'; // 变红
        }
        miniRender.refresh(); // 记得手动刷新
    });
    
    group.add(circle);
    miniRender.add(group);
    
    // 动画：让它旋转，测试旋转后的点击检测是否准确
    let angle = 0;
    function loop() {
        angle += 0.01;
        group.rotation = angle;
        // 手动更新 Group 属性，Painter 会在 refresh 时计算矩阵
        
        // 如果想要点击生效，不需要一直 refresh，但为了看动画：
        miniRender.refresh();
        requestAnimationFrame(loop);
    }
    loop();
}