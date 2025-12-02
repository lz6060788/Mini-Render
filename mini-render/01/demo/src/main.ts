import { Circle } from '../../src/graphic/shape/Circle';

// 1. 模拟一个 Canvas
const canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d')!;

// 2. 创建一个圆
const circle = new Circle({
    shape: { cx: 0, cy: 0, r: 50 }, // 圆心在 0,0
    style: { fill: 'red' }
});

// 3. 设置变换属性
circle.x = 200;      // 移到 x=200
circle.y = 200;      // 移到 y=200
circle.scaleX = 2;   // 宽度放大 2 倍
circle.rotation = Math.PI / 4; // 旋转 45 度

// 4. 手动更新矩阵 (正常这是由 ZRender 系统做的)
circle.updateTransform();

console.log('Global Matrix:', circle.globalTransform);
// 预期：tx=200, ty=200, 且 a,b,c,d 有值（因为有缩放和旋转）

// 5. 手动绘制 (正常这是由 Painter 做的)
// 清空画布
ctx.clearRect(0, 0, 500, 500);
// 绘制
circle.brush(ctx);

// 如果一切正常，你应该在屏幕 (200, 200) 处看到一个旋转且压扁的红色椭圆。