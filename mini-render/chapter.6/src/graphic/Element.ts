import * as matrix from '../utils/matrix';
import { MatrixArray, Point } from '../utils/types';
import { Eventful } from '../core/Eventful';
import { Animator } from '../animation/Animator';
import { EasingType } from '../animation/Easing';

// 用一个简单的 GUID 生成器
let idBase = 0;

export interface ElementProps {
    position?: Point; // [x, y]
    rotation?: number;
    scale?: Point;    // [sx, sy]
    origin?: Point;   // [ox, oy]
}

export abstract class Element extends Eventful {
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

    animators: Animator[] = [];

    miniRender: any = null; 

    // 辅助矩阵，避免重复创建对象 (GC优化)
    private static _invertMat: MatrixArray = matrix.create();

    constructor(opts?: ElementProps) {
        super();
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

    /**
     * 将全局坐标转换到当前元素的局部坐标系
     * @param x 全局 x
     * @param y 全局 y
     * @return [localX, localY]
     */
    globalToLocal(x: number, y: number): Point {
        const m = this.globalTransform;
        // 计算逆矩阵
        // 注意：这里用简单的静态变量缓存逆矩阵，非线程安全但JS是单线程所以OK
        const inv = Element._invertMat;
        matrix.invert(inv, m);

        // 应用逆变换: x' = a*x + c*y + tx
        const lx = inv[0] * x + inv[2] * y + inv[4];
        const ly = inv[1] * x + inv[3] * y + inv[5];
        
        return [lx, ly];
    }

    /**
     * 创建动画对象
     */
    animateTo(targetState: any, duration: number, easing: EasingType = 'linear', delay: number = 0) {
        const animator = new Animator(this, targetState, duration, easing);
        if (delay > 0) animator.delay(delay);

        this.animators.push(animator);

        if (this.miniRender) {
            this.miniRender.animation.add(animator);
        }

        return animator; // 依然返回，以便链式调用 .done() 等
    }
}