import type { MatrixArray } from "./types";

// 创建单位矩阵
export function create(): MatrixArray {
    return [1, 0, 0, 1, 0, 0];
}

// 矩阵乘法: out = m1 * m2
// 用于计算 父级矩阵 * 子级局部矩阵 = 子级全局矩阵
export function mul(out: MatrixArray, m1: MatrixArray, m2: MatrixArray): MatrixArray {
    const out0 = m1[0] * m2[0] + m1[2] * m2[1];
    const out1 = m1[1] * m2[0] + m1[3] * m2[1];
    const out2 = m1[0] * m2[2] + m1[2] * m2[3];
    const out3 = m1[1] * m2[2] + m1[3] * m2[3];
    const out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
    const out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];

    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = out3;
    out[4] = out4;
    out[5] = out5;
    return out;
}

// 核心：将平移、缩放、旋转属性合成为一个矩阵
// 变换顺序：Translate -> Rotate -> Scale (标准顺序)
export function compose(
    out: MatrixArray,
    x: number, y: number,
    scaleX: number, scaleY: number,
    rotation: number
): MatrixArray {
    const sr = Math.sin(rotation);
    const cr = Math.cos(rotation);

    // 矩阵公式推导结果
    out[0] = cr * scaleX;
    out[1] = sr * scaleX;
    out[2] = -sr * scaleY;
    out[3] = cr * scaleY;
    out[4] = x;
    out[5] = y;

    return out;
}

// 克隆矩阵
export function clone(m: MatrixArray): MatrixArray {
    return Array.from(m); // 简易版
}

/**
 * 求逆矩阵
 * out = invert(a)
 */
export function invert(out: MatrixArray, a: MatrixArray): MatrixArray {
    const aa = a[0], ac = a[2], atx = a[4];
    const ab = a[1], ad = a[3], aty = a[5];

    // 计算行列式
    let det = aa * ad - ab * ac;
    if (!det) {
        // 行列式为0，无法求逆，返回 null 或 设为单位矩阵
        return [1, 0, 0, 1, 0, 0] as any; // 简单处理
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
}

