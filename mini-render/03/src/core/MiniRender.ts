import { Storage } from '../storage/Storage';
import { Painter } from '../painter/Painter';
import { Element } from '../graphic/Element';
import { Handler } from '../handler/Handler';

export class MiniRender {
    storage: Storage;
    painter: Painter;
    handler: Handler;

    constructor(dom: HTMLElement) {
        this.storage = new Storage();
        this.painter = new Painter(dom, this.storage);
        // 初始化交互系统
        this.handler = new Handler(this.storage, this.painter, dom);
    }

    /**
     * 添加图形元素
     */
    add(el: Element) {
        this.storage.addRoot(el);
        this.refresh(); // 暂时：每次添加都立即刷新
    }

    /**
     * 触发重绘
     */
    refresh() {
        // 在真实 ZRender 中，这里会使用 requestAnimationFrame 进行防抖
        this.painter.refresh();
    }
}

/**
 * 工厂函数
 */
export function init(dom: HTMLElement) {
    return new MiniRender(dom);
}