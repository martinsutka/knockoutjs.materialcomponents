//#region [ Constructor ]

/**
 * Creates instance of the tooltip component.
 * 
 * @param {object} args Arguments. 
 */
const Tooltip = function(args) {
    console.debug("Tooltip()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_tooltip_" + utils.guid());
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");
    this.data = ko.isObservable(args.data) ? args.data : ko.observable(args.data || "");
    this.showDelay = ko.isObservable(args.showDelay) ? args.showDelay : ko.observable(typeof(args.showDelay) === "number" ? args.showDelay : Tooltip.SHOW_DELAY);
    this.hideDelay = ko.isObservable(args.hideDelay) ? args.hideDelay : ko.observable(typeof(args.hideDelay) === "number" ? args.hideDelay : Tooltip.HIDE_DELAY);
    this.xPosition = ko.isObservable(args.xPosition) ? args.xPosition : ko.observable(args.xPosition || Tooltip.X_POSITION.DETECTED);
    this.yPosition = ko.isObservable(args.yPosition) ? args.yPosition : ko.observable(args.yPosition || Tooltip.Y_POSITION.DETECTED);
    this.anchor = args.anchor || null;

    this._showDelayChangedSubscribe = null;
    this._hideDelayChangedSubscribe = null;
    this._positionChangedSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
Tooltip.prototype.koDescendantsComplete = function (node) {
    // Find the anchor element within parent
    this.anchor = node.parentElement.querySelector(this.anchor);
    if(!this.anchor) {
        console.warn("Tooltip : Missing anchor element for tooltip '%s'.", this.id());
        return;
    }

    // Set the aria-describedby attribute to the id for of the tooltip
    // to designate an element as being the anchor element for a particular tooltip
    this.anchor.setAttribute("aria-describedby", this.id());
    
    // Move the tooltip to the body element
    global.document.body.append(node);

    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    //this.mdcComponent = new mdc.tooltip.MDCTooltip(node.querySelector(".mdc-tooltip"));
    this.mdcComponent = new mdc.tooltip.MDCTooltip(root);

    this._showDelayChangedSubscribe = this.showDelay.subscribe(this._showDelayChanged, this);
    this._hideDelayChangedSubscribe = this.hideDelay.subscribe(this._hideDelayChanged, this);
    this._positionChangedSubscribe = ko.computed(this._positionChanged, this).extend({ deferred: true });

    this.showDelay.valueHasMutated();
    this.hideDelay.valueHasMutated();
    this.xPosition.valueHasMutated();
    this.yPosition.valueHasMutated();
};


/**
 * Dispose.
 */
Tooltip.prototype.dispose = function () {
    console.log("~Tooltip()");
    
    if (!this.anchor) {
        return;
    }

    this._showDelayChangedSubscribe.dispose();
    this._hideDelayChangedSubscribe.dispose();
    this._positionChangedSubscribe.dispose();
    this.mdcComponent.destroy();
    this.anchor.removeAttribute("aria-describedby");
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the showDelay property change event.
 * 
 * @param {number} value Specify the delay prior in ms to a tooltip being shown.
 **/
Tooltip.prototype._showDelayChanged = function (value) {
    this.mdcComponent.setShowDelay(value);
};


/**
 * Handles the hideDelay property change event.
 * 
 * @param {number} value Specify the delay in ms prior to a tooltip being hidden.
 **/
Tooltip.prototype._hideDelayChanged = function (value) {
    this.mdcComponent.setHideDelay(value);
};


/**
 * Handles the x and y position property change event.
 **/
Tooltip.prototype._positionChanged = function () {
    const x = this.xPosition();
    const y = this.yPosition();

    // Use "isInitial" to determine whether computed is being evaluated first time
    if (ko.computedContext.isInitial()) {
        return;
    }

    this.mdcComponent.setTooltipPosition({xPos: x, yPos: y});
};


//#endregion


//#region [ Enums ]

/**
 * Possible tooltip positioning relative to its anchor element.
 */
Tooltip.X_POSITION = {
    DETECTED: 0,
    START: 1,
    CENTER: 2,
    END: 3,
    SIDE_START: 4,
    SIDE_END: 5
};


/**
 * Possible tooltip positioning relative to its anchor element.
 */
Tooltip.Y_POSITION = {
    DETECTED: 0,
    ABOVE: 1,
    BELOW: 2,
    SIDE: 3
};


/**
 * Default show delay.
 */
Tooltip.SHOW_DELAY = 500;


/**
 * Default hide delay.
 */
Tooltip.HIDE_DELAY = 600;

//#endregion


//#region [ Template ]

Tooltip.template =
`<div class="mdc-tooltip" role="tooltip" aria-hidden="true"
    data-bind="attr: { id: id }, class: classes">
    <div class="mdc-tooltip__surface mdc-tooltip__surface-animation">
        <span class="mdc-tooltip__label" data-bind="template: { nodes: $componentTemplateNodes, data: data }"><span>
    </div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-tooltip", Tooltip);

//#endregion