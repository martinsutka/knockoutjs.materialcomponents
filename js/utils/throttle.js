/**
 * Takes input func and makes it throttled.
 * 
 * @param {function} func Callback function.
 * @param {number} delay Delay in milliseconds.
 * 
 * @returns New throttled function.
 */
ko.materialcomponents.utils.throttle = function (func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        func(...args);
    };
};