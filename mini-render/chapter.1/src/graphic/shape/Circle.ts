import { Displayable } from '../Displayable';

interface CircleShape {
    cx?: number;
    cy?: number;
    r?: number;
}

export class Circle extends Displayable {

    // 图形特有的几何属性
    shape: CircleShape;

    constructor(opts?: { shape?: CircleShape, style?: any, z?: number }) {
        super();
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
}