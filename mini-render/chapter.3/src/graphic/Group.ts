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
}