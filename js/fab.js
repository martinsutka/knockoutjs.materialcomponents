//#region [ Constructor ]

/**
 * Creates instance of the fab component.
 * 
 * @param {object} args Arguments. 
 */
const Fab = function(args) {
    console.debug("Fab()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_fab_" + utils.guid());
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.iconPosition = ko.isObservable(args.iconPosition) ? args.iconPosition : ko.observable(args.iconPosition || Fab.ICON_POSITION.start);
    this.text = ko.isObservable(args.text) ? args.text : ko.observable(args.text || "");
    this.type = ko.isObservable(args.type) ? args.type : ko.observable(args.type || Fab.TYPE.regular);
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isFocused = ko.isObservable(args.isFocused) ? args.isFocused : ko.observable(typeof(args.isFocused) === "boolean" ? args.isFocused : false);
    this.isLoading = ko.isObservable(args.isLoading) ? args.isLoading : ko.observable(typeof(args.isLoading) === "boolean" ? args.isLoading : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    this.onClick = ko.isObservable(args.onClick) ? args.onClick : ko.observable(typeof(args.onClick) === "function" ? args.onClick : null);
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
Fab.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.ripple.MDCRipple(root);
};


/**
 * Dispose.
 */
Fab.prototype.dispose = function () {
    console.log("~Fab()");

    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the click event.
 * 
 * @param {object} e Event arguments.
 **/
Fab.prototype._onClick = function (e) {
    const click = this.onClick();

    // Check for the supplied callback function
    if (typeof (click) !== "function") {
        console.debug("Fab : _onClick(): Callback for the 'click' event is not defined.");
        return;
    }

    // Call the function
    const p = click();

    // Check if it is a promise
    if (p instanceof Promise) {
        this.isFocused(false);
        this.isEnabled(false);
        this.isLoading(true);
        p.then(() => {
            this.isLoading(false);
            this.isEnabled(true);
        });
    }
};

//#endregion


//#region [ Enums ]

/**
 * Fab types.
 */
Fab.TYPE = {
    regular: 0,
    mini: 1,
    extended: 2
};


/**
 * Icon positions.
 */
Fab.ICON_POSITION = {
    start: 0,
    end: 1
};

//#endregion


//#region [ Template ]

Fab.template =
`<button class="mdc-fab"
         data-bind="css: {
            'mdc-fab--mini': type() === ${Fab.TYPE.mini},
            'mdc-fab--extended': type() === ${Fab.TYPE.extended}
         }, attr: { id: id }, enable: isEnabled, hasFocus: isFocused, class: classes, click: _onClick">
    <span class="mdc-fab__ripple"></span>
    <span class="mdc-fab__focus-ring"></span>
    <i class="mdc-fab__icon material-icons"
       data-bind="text: icon, visible: icon().length && iconPosition() === ${Fab.ICON_POSITION.start}, style: { visibility: isLoading() ? 'hidden' : 'visible' }"></i>
    <span class="mdc-fab__touch"></span>
    <span class="mdc-fab__label" data-bind="text: text, visible: type() === ${Fab.TYPE.extended}"></span>
    <i class="mdc-fab__icon material-icons"
       data-bind="text: icon, visible: icon().length && iconPosition() === ${Fab.ICON_POSITION.end}, style: { visibility: isLoading() ? 'hidden' : 'visible' }"></i>
    <mat-circular-progress-small params="isDeterminate: false,
                                         isOpen: isLoading,
                                         classes: type() === ${Fab.TYPE.mini} ? 'mdc-circular-progress--fab-mini' : 
                                                  type() === ${Fab.TYPE.extended} && iconPosition() === ${Fab.ICON_POSITION.start} ? 'mdc-circular-progress--fab-extended-start' : 
                                                  type() === ${Fab.TYPE.extended} && iconPosition() === ${Fab.ICON_POSITION.end} ? 'mdc-circular-progress--fab-extended-end' : 'mdc-circular-progress--fab'"></mat-circular-progress-small>
</button>`;

//#endregion


//#region [ Registration ]

utils.register("mat-fab", Fab);

//#endregion