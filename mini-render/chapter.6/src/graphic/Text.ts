import { Displayable, DisplayableProps } from './Displayable';

// 默认字体
const DEFAULT_FONT_FAMILY = 'sans-serif';

export class Text extends Displayable {
    constructor(opts?: DisplayableProps) {
        super(opts);
    }

    /**
     * 重写 brush，因为文本不是 Path
     */
    brush(ctx: CanvasRenderingContext2D) {
        const style = this.style;
        if (!style.text) return;

        ctx.save();

        // 1. 设置常规样式
        if (style.fill) ctx.fillStyle = style.fill;
        if (style.stroke) ctx.strokeStyle = style.stroke;
        if (style.opacity != null) ctx.globalAlpha = style.opacity;

        // 2. 设置字体样式
        const fontSize = style.fontSize || 12;
        const fontFamily = style.fontFamily || DEFAULT_FONT_FAMILY;
        const fontWeight = style.fontWeight || '';
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`.trim();

        ctx.textAlign = style.textAlign || 'left';
        ctx.textBaseline = style.textBaseline || 'alphabetic';

        // 3. 应用变换
        const m = this.globalTransform;
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);

        // 4. 绘制文本
        // 这里的 0, 0 是相对于 Text 元素自身的原点
        if (style.stroke) ctx.strokeText(style.text, 0, 0);
        if (style.fill) ctx.fillText(style.text, 0, 0);

        ctx.restore();
    }

    // 文本不需要 buildPath，因为我们在 brush 里直接画了
    buildPath(ctx: CanvasRenderingContext2D) {}

    /**
     * 文本的碰撞检测
     * 难点：计算文本的包围盒
     */
    containLocal(x: number, y: number): boolean {
        const style = this.style;
        if (!style.text) return false;

        // 借用一个辅助 canvas 来测量文本宽度（或者用全局单一实例）
        // 在真实项目中，应该缓存 measureText 的结果
        const ctx = document.createElement('canvas').getContext('2d')!;
        const fontSize = style.fontSize || 12;
        const fontFamily = style.fontFamily || DEFAULT_FONT_FAMILY;
        const fontWeight = style.fontWeight || '';
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`.trim();

        // 1. 计算宽
        const width = ctx.measureText(style.text).width;
        // 2. 估算高 (Canvas API 不直接提供高度，通常用 fontSize 估算)
        const height = fontSize;

        // 3. 根据对齐方式计算左上角 (Bounding Box 的 x, y)
        // 默认原点在 (0,0)
        let bx = 0;
        let by = 0;

        // 水平对齐修正
        const align = style.textAlign || 'left';
        if (align === 'center') {
            bx -= width / 2;
        } else if (align === 'right' || align === 'end') {
            bx -= width;
        }

        // 垂直对齐修正
        const baseline = style.textBaseline || 'alphabetic';
        if (baseline === 'top') {
            by = 0;
        } else if (baseline === 'middle') {
            by -= height / 2;
        } else if (baseline === 'bottom') {
            by -= height;
        } else {
            // alphabetic (基线) 大概在 bottom 偏上一点，这里简单按 bottom 处理或忽略
            by -= height; 
        }

        // 4. 判断点是否在矩形内
        return x >= bx && x <= bx + width &&
               y >= by && y <= by + height;
    }
}