//#region [ Constructor ]

/**
 * Creates instance of the button component.
 * 
 * @param {object} args Arguments. 
 */
const Button = function(args) {
    console.debug("Button()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_button_" + utils.guid());
    this.text = ko.isObservable(args.text) ? args.text : ko.observable(args.text || "");
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.iconPosition = ko.isObservable(args.iconPosition) ? args.iconPosition : ko.observable(args.iconPosition || Button.ICON_POSITION.start);
    this.type = ko.isObservable(args.type) ? args.type : ko.observable(args.type || Button.TYPE.text);
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
Button.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.ripple.MDCRipple(root);
};


/**
 * Dispose.
 */
Button.prototype.dispose = function () {
    console.log("~Button()");

    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the click event.
 * 
 * @param {object} e Event arguments.
 **/
Button.prototype._onClick = function (e) {
    const click = this.onClick();

    // Check for the supplied callback function
    if (typeof (click) !== "function") {
        console.debug("Button : _onClick(): Callback for the 'click' event is not defined.");
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
 * Button types.
 */
Button.TYPE = {
    text: 0,
    outlined: 1,
    raised: 2
};


/**
 * Icon positions.
 */
Button.ICON_POSITION = {
    start: 0,
    end: 1
};

//#endregion


//#region [ Template ]

Button.template =
`<button class="mdc-button"
         data-bind="css: {
            'mdc-button--icon-leading': icon().length && iconPosition() === ${Button.ICON_POSITION.start},
            'mdc-button--icon-trailing': icon().length && iconPosition() === ${Button.ICON_POSITION.end},
            'mdc-button--outlined': type() === ${Button.TYPE.outlined},
            'mdc-button--raised': type() === ${Button.TYPE.raised}
        }, attr: { id: id }, enable: isEnabled, hasFocus: isFocused, class: classes, click: _onClick">
    <span class="mdc-button__ripple"></span>
    <span class="mdc-button__focus-ring"></span>
    <i class="material-icons mdc-button__icon" aria-hidden="true"
       data-bind="text: icon, visible: icon().length && iconPosition() === ${Button.ICON_POSITION.start}"></i>
    <span class="mdc-button__label" data-bind="text: text"></span>
    <i class="material-icons mdc-button__icon" aria-hidden="true"
       data-bind="text: icon, visible: icon().length && iconPosition() === ${Button.ICON_POSITION.end}"></i>
    <mat-linear-progress params="isDeterminate: false, isOpen: isLoading, classes: 'mdc-linear-progress--button'"></mat-linear-progress>
</button>`;

//#endregion


//#region [ Registration ]

utils.register("mat-button", Button);

//#endregion