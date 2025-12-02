import { init } from '@/core/MiniRender';
import { Group } from '@/graphic/Group';
import { Rect } from '@/graphic/shape/Rect';
import { Text } from '@/graphic/Text';

window.onload = () => {
    const miniRender = init(document.getElementById('main')!);

    // 创建 5 个卡片
    for (let i = 0; i < 5; i++) {
        const x = 50 + i * 110;
        const y = 100;
    
        // --- 创建矩形 ---
        const rect = new Rect({
            shape: { x: x, y: y, width: 100, height: 100, r: 5 },
            style: {
                fill: '#FFF',
                stroke: '#999',
                lineWidth: 2
            }
        });
    
        // --- 创建文本 ---
        const text = new Text({
            style: {
                text: `Card ${i + 1}`,
                fill: '#666',
                fontSize: 14,
                textAlign: 'center',
                textBaseline: 'middle'
            },
            position: [x + 50, y + 50],
            z: 1,
            silent: true,
        });
    
        // --- 绑定交互事件 ---
        
        // 1. 移入高亮
        rect.on('mouseover', () => {
            console.log(`Mouse Over Rect ${i}`);
            
            // 变色
            rect.style.fill = '#E6F7FF'; // 浅蓝背景
            rect.style.stroke = '#1890FF'; // 深蓝边框
            
            // 放大动画效果（这里手动改 scale）
            // 稍微放大一点，注意 scale 是以 origin 为中心的
            // 我们还没有实现自动计算中心，所以这里手动设
            rect.origin = [x + 50, y + 50]; 
            rect.scale = [1.1, 1.1];
    
            miniRender.refresh();
        });
    
        // 2. 移出恢复
        rect.on('mouseout', () => {
            console.log(`Mouse Out Rect ${i}`);
            
            // 恢复颜色
            rect.style.fill = '#FFF';
            rect.style.stroke = '#999';
            
            // 恢复大小
            rect.scale = [1, 1];
    
            miniRender.refresh();
        });
    
        miniRender.add(rect);
        miniRender.add(text);
    }
    
    // 简单的提示
    const tip = new Text({
        style: {
            text: 'Try Hovering on the cards!',
            fill: '#333',
            fontSize: 18,
        },
        position: [50, 30]
    });
    miniRender.add(tip);
    
    // 渲染
    miniRender.refresh();
}