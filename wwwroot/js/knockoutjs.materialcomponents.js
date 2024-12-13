/*!
 * knockoutjs.materialcomponents v1.0.7
 * 2024-12-13
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('knockoutjs.materialcomponents', ['knockout', 'material-components-web'], factory);
    }
    else {
        factory(root.ko, root.mdc);
    }
}(typeof self !== 'undefined' ? self : this, (ko, mdc) => {
//#region [ Fields ]

const global = (function() { return this; })();
ko.materialcomponents = ko.materialcomponents || {};
ko.materialcomponents.utils = ko.materialcomponents.utils || {};

//#endregion


/**
 * Generates a random UUID.
 * 
 * @returns Randwom UUID string.
 */
ko.materialcomponents.utils.guid = function() {
    return global.crypto.randomUUID();
};


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
}));