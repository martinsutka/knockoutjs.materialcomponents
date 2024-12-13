//#region [ Constructor ]

/**
 * Creates instance of the button component.
 * 
 * @param {object} args Arguments. 
 */
const IconButton = function(args) {
    console.debug("IconButton()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_icon-button_" + utils.guid());
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isFocused = ko.isObservable(args.isFocused) ? args.isFocused : ko.observable(typeof(args.isFocused) === "boolean" ? args.isFocused : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");
    this.isLoading = ko.observable(false);

    this.onClick = args.onClick;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
IconButton.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.ripple.MDCRipple(root);
    this.mdcComponent.unbounded = true;
};


/**
 * Dispose.
 */
IconButton.prototype.dispose = function () {
    console.log("~IconButton()");

    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the click event.
 * 
 * @param {object} e Event arguments.
 **/
IconButton.prototype._onClick = function (e) {
    // Check for the supplied callback function
    if (typeof (this.onClick) !== "function") {
        console.debug("IconButton : _onClick(): Callback for the 'click' event is not defined.");
        return;
    }

    // Call the function
    const p = this.onClick();

    // Check if it is a promise
    if ((typeof(p) === "object") && (typeof(p.then) === "function")) {
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


//#region [ Templates ]

IconButton.template =
`<button class="mdc-icon-button"
    data-bind="attr: { id: id }, enable: isEnabled, hasFocus: isFocused, class: classes, click: _onClick">
    <span class="mdc-icon-button__ripple"></span>
    <span class="mdc-icon-button__focus-ring"></span>
    <i class="material-icons"
        data-bind="text: icon, style: { visibility: isLoading() ? 'hidden' : 'visible' }"></i>
    <mat-circular-progress-small params="isDeterminate: false, isOpen: isLoading, classes: 'mdc-circular-progress--icon-button'"></mat-circular-progress-small>
</button>`;

//#endregion


//#region [ Registration ]

utils.register("mat-icon-button", IconButton);

//#endregion