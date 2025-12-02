import { Storage } from '../storage/Storage';
import { Painter } from '../painter/Painter';
import { Displayable } from '../graphic/Displayable';

export class Handler {
    storage: Storage;
    painter: Painter;
    dom: HTMLElement;

    // 状态缓存：记录当前正悬停的元素
    private _hovered: Displayable | null = null;

    constructor(storage: Storage, painter: Painter, dom: HTMLElement) {
        this.storage = storage;
        this.painter = painter;
        this.dom = dom;

        // 初始化 DOM 监听
        this._initDomEvents();
    }

    private _initDomEvents() {
        // 简单的监听 click 事件作为示例
        this.dom.addEventListener('click', (e) => {
            this._clickHandler(e);
        });
        this.dom.addEventListener('mousemove', this._mouseMoveHandler.bind(this));

        // 实际 MiniRender 还有 mousedown, mouseup, mousemove 等复杂逻辑
    }

    /**
     * 辅助方法：获取相对于 Canvas 左上角的坐标
     */
    private _getEventPoint(e: MouseEvent) {
        const rect = this.dom.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - this.dom.clientLeft) * window.devicePixelRatio,
            y: (e.clientY - rect.top - this.dom.clientTop) * window.devicePixelRatio
        };
    }

    private _clickHandler(e: MouseEvent) {
        const { x, y } = this._getEventPoint(e);

        const target = this._findHover(x, y);

        if (target) {
            target.trigger('click', { target: target, event: e });
        }
    }

    /**
     * 核心：处理鼠标移动，计算 Hover 状态
     */
    private _mouseMoveHandler(e: MouseEvent) {
        const { x, y } = this._getEventPoint(e);
        const target = this._findHover(x, y);
        const lastHovered = this._hovered;

        // 如果鼠标下的元素变了
        if (target !== lastHovered) {

            // 1. 处理移出 (MouseOut)
            // 如果之前有悬停元素，说明从那个元素出来了
            if (lastHovered) {
                lastHovered.trigger('mouseout', { target: lastHovered, event: e });
            }

            // 2. 处理移入 (MouseOver)
            // 如果当前有元素，说明进入了这个元素
            if (target) {
                target.trigger('mouseover', { target: target, event: e });
            }

            // 3. 更新状态
            this._hovered = target;
        }

        // 4. 处理鼠标移动 (MouseMove)
        // 即使目标没变，也可以触发 move 事件
        if (target) {
            target.trigger('mousemove', { target, event: e });
        }

        // 5. 设置光标样式 (UX 优化)
        if (target) {
            this.dom.style.cursor = 'pointer';
        } else {
            this.dom.style.cursor = 'default';
        }
    }

    private _findHover(x: number, y: number): Displayable | null {
        const list = this.storage.getDisplayList();


        for (let i = list.length - 1; i >= 0; i--) {
            const el = list[i];

            if (el.invisible || el.silent) continue;

            // 碰撞检测
            if (el.contain(x, y)) {
                return el;
            }
        }
        return null;
    }
}