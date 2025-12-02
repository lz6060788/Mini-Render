type EventHandler = (...args: any[]) => void;

export class Eventful {
    private _handlers: { [event: string]: EventHandler[] } = {};

    on(event: string, handler: EventHandler): this {
        if (!this._handlers[event]) {
            this._handlers[event] = [];
        }
        this._handlers[event].push(handler);
        return this;
    }

    off(event?: string, handler?: EventHandler): this {
        // 简化实现：清空指定事件或全部
        if (event && !handler) {
            this._handlers[event] = [];
        } else if (!event) {
            this._handlers = {};
        }
        // 完整实现还需要处理移除特定 handler，这里略过
        return this;
    }

    trigger(event: string, ...args: any[]): this {
        const handlers = this._handlers[event];
        if (handlers) {
            handlers.forEach(h => h.apply(this, args));
        }
        return this;
    }
}