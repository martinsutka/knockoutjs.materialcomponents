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