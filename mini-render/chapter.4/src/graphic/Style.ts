export interface CommonStyle {
    fill?: string;       // 填充颜色
    stroke?: string;     // 描边颜色
    lineWidth?: number;  // 线宽
    opacity?: number;    // 透明度 0-1
    shadowBlur?: number;
    shadowColor?: string;

    // 文本相关
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string; // 'bold', 'normal'

    // 对齐
    textAlign?: CanvasTextAlign; // 'left' | 'right' | 'center' | 'start' | 'end'
    textBaseline?: CanvasTextBaseline; // 'top' | 'middle' | 'bottom' ...
}