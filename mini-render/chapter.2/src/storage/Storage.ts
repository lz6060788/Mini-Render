import { Element } from '../graphic/Element';
import { Displayable } from '../graphic/Displayable';
import { Group } from '../graphic/Group';

// 类型守卫：判断是否为 Group
function isGroup(el: Element): el is Group {
    return (el as Group).isGroup;
}

// 类型守卫：判断是否为 Displayable
function isDisplayable(el: Element): el is Displayable {
    return el instanceof Displayable;
}

export class Storage {
    // 根节点列表 (Scene Graph 的入口)
    private _roots: Element[] = [];
    
    // 扁平化的渲染列表 (缓存结果)
    private _displayList: Displayable[] = [];

    // 标记列表是否脏了（需要重新遍历和排序）
    private _displayListDirty: boolean = true;

    addRoot(el: Element) {
        this._roots.push(el);
        this._displayListDirty = true;
    }

    /**
     * 核心方法：获取排序后的渲染列表
     * 逻辑：
     * 1. 深度优先遍历所有根节点
     * 2. 收集所有的 Displayable
     * 3. 按 zLevel 和 z 排序
     */
    getDisplayList(): Displayable[] {
        if (this._displayListDirty) {
            this._updateDisplayList();
            this._displayListDirty = false;
        }
        return this._displayList;
    }

    private _updateDisplayList() {
        const list: Displayable[] = [];

        // 1. 递归遍历 (DFS)
        const traverse = (el: Element) => {
            if (isDisplayable(el)) {
                list.push(el);
            }
            if (isGroup(el)) {
                for (let i = 0; i < el.children.length; i++) {
                    traverse(el.children[i]);
                }
            }
        };

        for (let i = 0; i < this._roots.length; i++) {
            traverse(this._roots[i]);
        }

        // 2. 排序
        // 优先级：zLevel (Canvas层) > z (同层叠加顺序) > 插入顺序
        list.sort((a, b) => {
            if (a.zLevel === b.zLevel) {
                return a.z - b.z;
            }
            return a.zLevel - b.zLevel;
        });

        this._displayList = list;
    }

    public getRoots(): Element[] {
        return this._roots;
    }
}