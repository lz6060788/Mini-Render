import { Storage } from '../storage/Storage';
import { Painter } from '../painter/Painter';
import { Displayable } from '../graphic/Displayable';

export class Handler {
    storage: Storage;
    painter: Painter;
    dom: HTMLElement;

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

        // 实际 ZRender 还有 mousedown, mouseup, mousemove 等复杂逻辑
    }

    private _clickHandler(e: MouseEvent) {
        // 1. 获取相对于 Canvas 的坐标
        // getBoundingClientRect 包含了页面滚动和边框
        const rect = this.dom.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 2. 寻找被点击的图形
        const target = this._findHover(x, y);

        if (target) {
            // 3. 触发图形事件
            console.log('Clicked shape:', target.id);
            target.trigger('click', { target: target, event: e });
        } else {
            console.log('Clicked empty space');
        }
    }

    private _findHover(x: number, y: number): Displayable | null {
        const list = this.storage.getDisplayList();
        
        // 核心：逆序遍历！
        // 因为 displayList 是按渲染顺序排的（后面的盖在前面），
        // 所以我们检测点击时，要从最上面（数组末尾）开始查。
        for (let i = list.length - 1; i >= 0; i--) {
            const el = list[i];
            
            // 忽略不可见或不响应鼠标的元素
            if (el.invisible) continue; // 可以再加 ignoreMouse 等标志

            // 碰撞检测
            if (el.contain(x, y)) {
                return el;
            }
        }
        return null;
    }
}