import * as matrix from '../utils/matrix';
import { MatrixArray, Point } from '../utils/types';

// 用一个简单的 GUID 生成器
let idBase = 0;

export interface ElementProps {
    position?: Point; // [x, y]
    rotation?: number;
    scale?: Point;    // [sx, sy]
    origin?: Point;   // [ox, oy]
}

export abstract class Element {
    id: string;

    // --- 变换属性 (Transform Props) ---
    x: number = 0;
    y: number = 0;
    scaleX: number = 1;
    scaleY: number = 1;
    originX: number = 0;
    originY: number = 0;
    rotation: number = 0; // 弧度制

    // --- 矩阵状态 (Matrix State) ---
    // 局部变换矩阵 (相对于父级)
    localTransform: MatrixArray = matrix.create();
    // 全局变换矩阵 (相对于 Canvas 左上角)
    globalTransform: MatrixArray = matrix.create();

    parent: Element | null = null;

    constructor(opts?: ElementProps) {
        this.id = `el_${idBase++}`;
        if (opts) {
            this.attr(opts);
        }
    }

    /**
     * 核心方法：更新变换矩阵
     * 递归更新：通常由渲染器从根节点开始调用
     */
    updateTransform() {
        // 1. 根据属性计算局部矩阵
        // 优化：如果没有任何变换，保持单位矩阵 (此处省略优化，直接计算)
        matrix.compose(
            this.localTransform,
            this.x, this.y,
            this.scaleX, this.scaleY,
            this.rotation
        );

        // 2. 计算全局矩阵
        const parentTransform = this.parent && this.parent.globalTransform;

        if (parentTransform) {
            // 有父级：全局 = 父级全局 * 自身局部
            matrix.mul(this.globalTransform, parentTransform, this.localTransform);
        } else {
            // 无父级：全局 = 自身局部
            // 注意：这里需要拷贝，防止引用错乱
            for(let i = 0; i < 6; i++) {
                this.globalTransform[i] = this.localTransform[i];
            }
        }
    }

    attr(opts: ElementProps) {
        if (opts.position) {
            this.x = opts.position[0];
            this.y = opts.position[1];
        }
        if (opts.rotation != null) {
            this.rotation = opts.rotation;
        }
        if (opts.scale) {
            this.scaleX = opts.scale[0];
            this.scaleY = opts.scale[1];
        }
        if (opts.origin) {
            this.originX = opts.origin[0];
            this.originY = opts.origin[1];
        }
    }
}