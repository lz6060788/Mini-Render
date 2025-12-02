import { Storage } from '../storage/Storage';
import { Painter } from '../painter/Painter';
import { Element } from '../graphic/Element';

export class MiniRender {
    storage: Storage;
    painter: Painter;

    constructor(dom: HTMLElement) {
        this.storage = new Storage();
        this.painter = new Painter(dom, this.storage);
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
        // 在真实 MiniRender 中，这里会使用 requestAnimationFrame 进行防抖
        this.painter.refresh();
    }
}

/**
 * 工厂函数
 */
export function init(dom: HTMLElement) {
    return new MiniRender(dom);
}