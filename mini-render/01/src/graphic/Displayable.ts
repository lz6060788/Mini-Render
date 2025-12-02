import { Element } from './Element';
import { CommonStyle } from './Style';

export abstract class Displayable extends Element {

    style: CommonStyle = {};

    // 绘制顺序，类似于 CSS z-index
    z: number = 0;

    // 层级，不同的 zLevel 会被绘制在不同的 Canvas 实例上 (Layer)
    zLevel: number = 0;

    /**
     * 绘制入口
     * @param ctx 原生 CanvasContext
     */
    brush(ctx: CanvasRenderingContext2D) {
        const style = this.style;

        // 1. 保存当前 Context 状态
        ctx.save();

        // 2. 应用样式
        if (style.fill) ctx.fillStyle = style.fill;
        if (style.stroke) ctx.strokeStyle = style.stroke;
        if (style.lineWidth) ctx.lineWidth = style.lineWidth;
        // ... 其他样式应用

        // 3. 应用变换 (关键！)
        // setTransform(a, b, c, d, e, f)
        // 使用 globalTransform，这样 Canvas 原点就变到了图形的坐标系下
        const m = this.globalTransform;
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);

        // 4. 开始路径
        ctx.beginPath();

        // 5. 调用具体形状的路径构建逻辑
        this.buildPath(ctx);

        // 6. 绘制
        ctx.closePath(); // 可选
        if (style.fill) ctx.fill();
        if (style.stroke) ctx.stroke();

        // 7. 恢复 Context 状态 (弹出 save 的状态)
        ctx.restore();
    }

    /**
     * 抽象方法：由子类实现具体的路径
     * 例如 Circle 会调用 ctx.arc
     */
    abstract buildPath(ctx: CanvasRenderingContext2D): void;
}