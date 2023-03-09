export function checkIsMacDevice() {
    return window.navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
}