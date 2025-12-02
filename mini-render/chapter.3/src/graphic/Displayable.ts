import { Element, ElementProps } from './Element';
import { CommonStyle } from './Style';

export interface DisplayableProps extends ElementProps {
    style?: any;
    z?: number;
    zLevel?: number;
    invisible?: boolean;
}

export abstract class Displayable extends Element {

    style: CommonStyle = {};

    // 绘制顺序，类似于 CSS z-index
    z: number = 0;

    // 层级，不同的 zLevel 会被绘制在不同的 Canvas 实例上 (Layer)
    zLevel: number = 0;

    invisible: boolean = false;

    constructor(opts?: DisplayableProps) {
        super(opts); // 关键！把 opts 传给 Element 处理 position/rotation

        if (opts) {
            if (opts.style) this.style = opts.style;
            if (opts.z != null) this.z = opts.z;
            if (opts.zLevel != null) this.zLevel = opts.zLevel;
            if (opts.invisible != null) this.invisible = opts.invisible;
        }
    }

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

    /**
     * 判断点是否在图形内
     * @param x 全局 x
     * @param y 全局 y
     */
    contain(x: number, y: number): boolean {
        // 1. 转换为局部坐标
        const local = this.globalToLocal(x, y);
        console.log('x', x, 'y', y)
        console.log('local', local)
        // 2. 调用具体形状的几何判断
        return this.containLocal(local[0], local[1]);
    }

    /**
     * 具体形状实现这个方法，判断局部坐标是否在路径内
     */
    abstract containLocal(x: number, y: number): boolean;
}