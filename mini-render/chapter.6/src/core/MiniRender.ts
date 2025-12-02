import { Storage } from '../storage/Storage';
import { Painter } from '../painter/Painter';
import { Element } from '../graphic/Element';
import { Handler } from '../handler/Handler';
import { Animation } from '../animation/Animation';
import { Animator } from '../animation/Animator';

export class MiniRender {
    storage: Storage;
    painter: Painter;
    handler: Handler;
    animation: Animation;

    constructor(dom: HTMLElement) {
        this.storage = new Storage();
        this.painter = new Painter(dom, this.storage);
        // 初始化交互系统
        this.handler = new Handler(this.storage, this.painter, dom);
        this.animation = new Animation();
        this.animation.onFrame = () => {
            this.painter.refresh();
        };
    }

    /**
     * 添加图形元素
     */
    add(el: Element) {
        this._propagateRender(el, this);

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

    // addAnimator 方法现在是给内部用的，或者作为高级 API 保留
    addAnimator(animator: Animator) {
        this.animation.add(animator);
    }

    private _propagateRender(el: Element, miniRender: any) {
        el.miniRender = miniRender;
        if ((el as any).isGroup) {
            const children = (el as any).children;
            for (let i = 0; i < children.length; i++) {
                this._propagateRender(children[i], miniRender);
            }
        }
    }
}

/**
 * 工厂函数
 */
export function init(dom: HTMLElement) {
    return new MiniRender(dom);
}