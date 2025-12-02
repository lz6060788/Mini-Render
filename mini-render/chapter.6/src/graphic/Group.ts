import { Element } from './Element';

export class Group extends Element {
    readonly isGroup = true;

    // 子节点列表
    children: Element[] = [];

    /**
     * 添加子节点
     */
    add(child: Element) {
        if (child && child !== this && child.parent !== this) {
            this.children.push(child);
            child.parent = this; // 建立父子链接

            if (this.miniRender) {
                // 递归设置子树
                this._propagateRender(child, this.miniRender);
            }
        }
    }

    /**
     * 移除子节点
     */
    remove(child: Element) {
        const idx = this.children.indexOf(child);
        if (idx >= 0) {
            this.children.splice(idx, 1);
            child.parent = null;
        }
    }

    /**
     * 辅助方法：递归向下传递 miniRender 引用
     */
    private _propagateRender(el: Element, miniRender: any) {
        el.miniRender = miniRender;
        if ((el as Group).isGroup) {
            const children = (el as Group).children;
            for (let i = 0; i < children.length; i++) {
                this._propagateRender(children[i], miniRender);
            }
        }
    }
}