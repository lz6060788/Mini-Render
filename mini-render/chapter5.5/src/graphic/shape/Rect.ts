import { Displayable, DisplayableProps } from '../Displayable';

export interface RectShape {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    r?: number; // 圆角半径 (简单起见，暂只支持统一圆角)
}

interface RectProps extends DisplayableProps {
    shape?: RectShape;
}

export class Rect extends Displayable {
    shape: Required<RectShape>; // 确保内部使用时都有值

    constructor(opts?: RectProps) {
        super(opts);
        this.shape = {
            x: 0, y: 0, width: 0, height: 0, r: 0,
            ...opts?.shape
        };
    }

    buildPath(ctx: CanvasRenderingContext2D) {
        const shape = this.shape;
        const x = shape.x;
        const y = shape.y;
        const width = shape.width;
        const height = shape.height;
        const r = shape.r;

        if (!r) {
            // 普通矩形
            ctx.rect(x, y, width, height);
        } else {
            // 圆角矩形 (使用 arcTo 或者 roundRect)
            // 这里使用通用的 arcTo 模拟
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + width - r, y);
            ctx.arcTo(x + width, y, x + width, y + r, r);
            ctx.lineTo(x + width, y + height - r);
            ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
            ctx.lineTo(x + r, y + height);
            ctx.arcTo(x, y + height, x, y + height - r, r);
            ctx.lineTo(x, y + r);
            ctx.arcTo(x, y, x + r, y, r);
            ctx.closePath();
        }
    }

    /**
     * 矩形的包含检测
     */
    containLocal(x: number, y: number): boolean {
        const shape = this.shape;
        console.log('Click Logic:', x, y, 'Rect Bounds:', this.shape.x, this.shape.width);
        // 简单矩形检测
        // 如果要做圆角检测比较复杂，通常这里简化为矩形包围盒
        return x >= shape.x && x <= shape.x + shape.width &&
               y >= shape.y && y <= shape.y + shape.height;
    }
}