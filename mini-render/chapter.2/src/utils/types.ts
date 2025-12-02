export type Point = [number, number];

// 3x2 仿射变换矩阵
// index: [0, 1, 2, 3, 4, 5] -> [a, b, c, d, tx, ty]
// 数学表示:
// | a c tx |
// | b d ty |
// | 0 0 1  |
export type MatrixArray = Float32Array | number[];

// 包围盒
export interface BoundingRect {
    x: number;
    y: number;
    width: number;
    height: number;
}