import { Storage } from '../storage/Storage';
import { Element } from '../graphic/Element';

export class Painter {
    private _dom: HTMLElement;
    private _storage: Storage;
    
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    
    private _width: number = 0;
    private _height: number = 0;

    constructor(dom: HTMLElement, storage: Storage) {
        this._dom = dom;
        this._storage = storage;

        // 1. 创建 Canvas
        this._canvas = document.createElement('canvas');
        // 简单的样式设置
        this._canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%';
        dom.appendChild(this._canvas);
        
        this._ctx = this._canvas.getContext('2d')!;

        // 初始化大小
        this.resize();
        
        // 监听窗口大小变化（简单版）
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // 获取容器宽高
        const width = this._dom.clientWidth;
        const height = this._dom.clientHeight;
        
        // 处理高清屏 (Retina)
        const dpr = window.devicePixelRatio || 1;
        
        this._canvas.width = width * dpr;
        this._canvas.height = height * dpr;
        
        // 缩放 Context，这样绘图时直接用逻辑坐标，不用管 dpr
        this._ctx.scale(dpr, dpr);

        this._width = width;
        this._height = height;
        
        // 大小变了，必须重绘
        this.refresh();
    }

    /**
     * 渲染入口
     */
    refresh() {
        const list = this._storage.getDisplayList();
        const ctx = this._ctx;
        const roots = this._storage.getRoots();

        // if (this._width === 0) this.resize();

        roots.forEach(el => this._updateElementTransform(el));

        // 1. 清空画布
        ctx.clearRect(0, 0, this._width, this._height);

        // 2. 遍历绘制
        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            
            // 优化：看不见的直接跳过
            // if (el.invisible) continue;

            // 4. 绘制
            el.brush(ctx);
        }
    }

    // 递归更新帮助函数
    private _updateElementTransform(el: Element) {
        el.updateTransform();
        // 如果是 Group，递归更新子节点
        if ((el as any).isGroup) {
            const children = (el as any).children;
            for (let i = 0; i < children.length; i++) {
                this._updateElementTransform(children[i]);
            }
        }
    }
}