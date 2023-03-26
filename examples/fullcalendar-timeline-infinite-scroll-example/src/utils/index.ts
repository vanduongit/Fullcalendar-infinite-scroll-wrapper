export function checkIsMacDevice() {
    return window.navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
}

export type ThrottledFunction<T extends (...args: any) => any> = (
    ...args: Parameters<T>
) => ReturnType<T>;

export function throttle<T extends (...args: any) => any>(
    func: T,
    limit: number
): ThrottledFunction<T> {
    let inThrottle: boolean;
    let lastResult: ReturnType<T>;

    return function throttleReturn(this: any, ...params): ReturnType<T> {
        const args = params;
        const context = this as any;

        if (!inThrottle) {
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
            }, limit);

            lastResult = func.apply(context, args as any);
        }

        return lastResult;
    };
}
