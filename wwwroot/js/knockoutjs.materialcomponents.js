/*!
 * knockoutjs.materialcomponents v1.0.19
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
const register = ko.materialcomponents = ko.materialcomponents || {};
const utils = ko.materialcomponents.utils = ko.materialcomponents.utils || {};

//#endregion


/**
 * Generates a random UUID.
 * 
 * @returns Randwom UUID string.
 */
utils.guid = function() {
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
utils.throttle = function (func, delay) {
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


/**
 * Registers the input Model as knockout component.
 *
 * @param {string} name Component name.
 * @param {function} Model Component constructor.
 */
utils.register = function (name, Model) {
    register[Model.name] = Model;
    ko.components.register(name, {
        template: Model.template,
        viewModel: { 
            createViewModel: (params, componentInfo) => {
                params = params || {};
                params.element = componentInfo.element.querySelector ? componentInfo.element : componentInfo.element.parentElement || componentInfo.element.parentNode;
            
                return new Model(params);
            }
        }
    });
};


//#region [ Constructor ]

/**
 * Creates instance of the icon component.
 * 
 * @param {object} args Arguments. 
 */
const Icon = function(args) {
    console.debug("Icon()");

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_icon_" + utils.guid());
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
Icon.prototype.koDescendantsComplete = function (node) {
    node.replaceWith(node.firstElementChild);
};


/**
 * Dispose.
 */
Icon.prototype.dispose = function () {
    console.log("~Icon()");
};

//#endregion


//#region [ Template ]

Icon.template = `<i class="material-icons" data-bind="text: icon, class: classes, attr: { id: id }"></i>`;

//#endregion


//#region [ Registration ]

utils.register("mat-icon", Icon);

//#endregion
}));