import { Easing, EasingType } from './Easing';

export class Animator {
    target: any;
    
    private _startState: any = {};
    private _endState: any;
    
    private _duration: number;
    private _easing: EasingType;
    
    private _startTime: number = 0;
    private _delay: number = 0;
    
    private _onUpdate?: () => void;
    private _onDone?: () => void;
    
    // 标记动画是否已结束
    isFinished: boolean = false;

    constructor(target: any, endState: any, duration: number, easing: EasingType = 'linear') {
        this.target = target;
        this._endState = endState;
        this._duration = duration;
        this._easing = easing;
    }

    start(time: number) {
        this._startTime = time + this._delay;
        // 核心：在开始瞬间，克隆当前状态作为起始状态
        this._startState = this._cloneState(this._endState, this.target);
    }

    /**
     * 每一帧调用此方法
     * @param globalTime 全局时间戳
     * @return boolean 是否有变化
     */
    step(globalTime: number): boolean {
        if (this.isFinished) return false;
        if (globalTime < this._startTime) return false; // 还没到 delay 时间

        // 1. 计算进度 (0 ~ 1)
        let p = (globalTime - this._startTime) / this._duration;
        if (p >= 1) {
            p = 1;
            this.isFinished = true;
        }

        // 2. 应用缓动
        const easingFunc = Easing[this._easing] || Easing.linear;
        const v = easingFunc(p);

        // 3. 执行插值
        this._interpolate(this.target, this._startState, this._endState, v);

        // 4. 回调
        if (this._onUpdate) this._onUpdate();
        if (this.isFinished && this._onDone) this._onDone();

        return true;
    }

    // API: 设置延迟
    delay(ms: number) {
        this._delay = ms;
        return this;
    }
    
    // API: 完成回调
    done(cb: () => void) {
        this._onDone = cb;
        return this;
    }
    
    // API: 更新回调
    update(cb: () => void) {
        this._onUpdate = cb;
        return this;
    }

    // --- 内部辅助方法 ---

    // 递归插值：将 start 到 end 的值设置给 target
    private _interpolate(target: any, start: any, end: any, p: number) {
        for (const key in end) {
            const sVal = start[key];
            const eVal = end[key];

            if (typeof eVal === 'number' && typeof sVal === 'number') {
                // 数字：直接计算
                target[key] = sVal + (eVal - sVal) * p;
            } else if (Array.isArray(eVal) && Array.isArray(sVal)) {
                // 数组：递归处理 (如 position: [x, y])
                if (!target[key]) target[key] = [];
                this._interpolate(target[key], sVal, eVal, p);
            } else if (typeof eVal === 'object' && eVal !== null) {
                // 对象：递归处理 (如 style: { ... })
                if (!target[key]) target[key] = {};
                this._interpolate(target[key], sVal, eVal, p);
            }
            // 颜色插值比较复杂（涉及字符串解析），Stage 4 暂不实现，直接跳变
        }
    }

    // 递归克隆状态：只克隆 endState 中有的属性
    private _cloneState(end: any, source: any) {
        const res: any = {};
        for (const key in end) {
            const val = source[key];
            if (typeof end[key] === 'object' && end[key] !== null && !Array.isArray(end[key])) {
                // 递归对象
                res[key] = this._cloneState(end[key], val);
            } else if (Array.isArray(end[key])) {
                // 拷贝数组
                res[key] = Array.from(val || []);
            } else {
                // 基本类型
                res[key] = val;
            }
        }
        return res;
    }
}