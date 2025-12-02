import { Animator } from './Animator';

export class Animation {
    private _animators: Animator[] = [];
    private _isRunning: boolean = false;

    // 注入 MiniRender 的刷新方法
    onFrame?: () => void;

    add(animator: Animator) {
        this._animators.push(animator);
        // 自动启动 Animator
        animator.start(Date.now());
        
        if (!this._isRunning) {
            this._startLoop();
        }
    }

    private _startLoop() {
        this._isRunning = true;

        const step = () => {
            const time = Date.now();
            let hasChange = false;

            // 倒序遍历，方便删除
            for (let i = this._animators.length - 1; i >= 0; i--) {
                const anim = this._animators[i];
                const changed = anim.step(time);
                if (changed) hasChange = true;

                // 移除已完成的动画
                if (anim.isFinished) {
                    this._animators.splice(i, 1);
                }
            }

            // 如果有属性变化，触发外部重绘
            if (hasChange && this.onFrame) {
                this.onFrame();
            }

            if (this._animators.length > 0) {
                requestAnimationFrame(step);
            } else {
                this._isRunning = false;
            }
        };

        requestAnimationFrame(step);
    }
}