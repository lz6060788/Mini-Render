import { Displayable, DisplayableProps } from '../Displayable';

interface CircleShape {
    cx?: number;
    cy?: number;
    r?: number;
}

interface CircleProps extends DisplayableProps {
    shape?: { cx?: number, cy?: number, r?: number };
}

export class Circle extends Displayable {

    // 图形特有的几何属性
    shape: CircleShape;

    constructor(opts?: { shape?: CircleShape, style?: any, z?: number }) {
        super(opts);
        this.shape = { cx: 0, cy: 0, r: 0, ...opts?.shape };
        if (opts?.style) this.style = opts.style;
        if (opts?.z) this.z = opts.z;
    }

    buildPath(ctx: CanvasRenderingContext2D) {
        const shape = this.shape;
        // 直接调用 Canvas API
        // 注意：因为我们在 Displayable.brush 中已经做了 setTransform
        // 这里的 cx, cy 是相对于图形自身坐标系的位置
        ctx.arc(shape.cx!, shape.cy!, shape.r!, 0, Math.PI * 2);
    }

    containLocal(x: number, y: number): boolean {
        console.log('Click Logic:', x, y, 'Rect Bounds:', this.x, this.y, this.shape.r);
        // 圆形判断很简单：点到圆心的距离 < 半径
        // 注意：这里的 x,y 已经是经过逆变换的，所以是在圆没有被旋转缩放的坐标系下
        // 而 this.shape.cx/cy 也是在这个坐标系下
        const d2 = Math.pow(x - this.shape.cx!, 2) + Math.pow(y - this.shape.cy!, 2);
        return d2 <= this.shape.r! * this.shape.r!;
    }
}