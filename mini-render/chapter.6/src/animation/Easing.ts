type EasingFunc = (t: number) => number;

export const Easing = {
    linear: (t: number) => t,

    // 二次缓动
    quadraticIn: (t: number) => t * t,
    quadraticOut: (t: number) => t * (2 - t),

    // 三次缓动 (常用，自然)
    cubicIn: (t: number) => t * t * t,
    cubicOut: (t: number) => --t * t * t + 1,

    // 弹性缓动
    elasticOut: (t: number) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 :
            Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
};

export type EasingType = keyof typeof Easing;