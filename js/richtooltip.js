//#region [ Constructor ]

/**
 * Creates instance of the tooltip component.
 * 
 * @param {object} args Arguments. 
 */
const RichTooltip = function(args) {
    console.debug("RichTooltip()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_rich-tooltip_" + utils.guid());
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");
    this.data = ko.isObservable(args.data) ? args.data : ko.observable(args.data || "");
    this.showDelay = ko.isObservable(args.showDelay) ? args.showDelay : ko.observable(typeof(args.showDelay) === "number" ? args.showDelay : Tooltip.SHOW_DELAY);
    this.hideDelay = ko.isObservable(args.hideDelay) ? args.hideDelay : ko.observable(typeof(args.hideDelay) === "number" ? args.hideDelay : Tooltip.HIDE_DELAY);
    this.isPersistent = ko.isObservable(args.isPersistent) ? args.isPersistent : ko.observable(typeof(args.isPersistent) === "boolean" ? args.isPersistent : false);
    this.anchor = ko.isObservable(args.anchor) ? args.anchor : ko.observable(args.anchor || null);
    this.anchorNode = null;

    this._showDelayChangedSubscribe = null;
    this._hideDelayChangedSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
RichTooltip.prototype.koDescendantsComplete = function (node) {
    // Find the anchor element within parent
    this.anchorNode = node.parentElement.querySelector(this.anchor());
    if(!this.anchorNode) {
        console.warn("RichTooltip : Missing anchor element for tooltip '%s'.", this.id());
        return;
    }

    // The tooltip can be hidden from the screenreader by annotating the anchor element
    // with data-tooltip-id instead of aria-describedby
    this.anchorNode.setAttribute("data-tooltip-id", this.id());
    this.anchorNode.setAttribute("aria-haspopup", "dialog");
    this.anchorNode.setAttribute("aria-expanded", "false");

    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.tooltip.MDCTooltip(root);

    this._showDelayChangedSubscribe = this.showDelay.subscribe(this._showDelayChanged, this);
    this._hideDelayChangedSubscribe = this.hideDelay.subscribe(this._hideDelayChanged, this);

    this.showDelay.valueHasMutated();
    this.hideDelay.valueHasMutated();
};


/**
 * Dispose.
 */
RichTooltip.prototype.dispose = function () {
    console.log("~RichTooltip()");
    
    if (!this.anchorNode) {
        return;
    }

    this._showDelayChangedSubscribe.dispose();
    this._hideDelayChangedSubscribe.dispose();
    this.mdcComponent.destroy();
    this.anchorNode.removeAttribute("data-tooltip-id");
    this.anchorNode.removeAttribute("aria-haspopup");
    this.anchorNode.removeAttribute("aria-expanded");
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the showDelay property change event.
 * 
 * @param {number} value Specify the delay prior in ms to a tooltip being shown.
 **/
RichTooltip.prototype._showDelayChanged = function (value) {
    this.mdcComponent.setShowDelay(value);
};


/**
 * Handles the hideDelay property change event.
 * 
 * @param {number} value Specify the delay in ms prior to a tooltip being hidden.
 **/
RichTooltip.prototype._hideDelayChanged = function (value) {
    this.mdcComponent.setHideDelay(value);
};


//#endregion


//#region [ Methods : Static ]

RichTooltip.template =
`<div class="mdc-tooltip mdc-tooltip--rich" role="dialog" aria-hidden="true"
      data-bind="attr: { 
        id: id,
        tabindex: isPersistent() ? -1 : 0,
        'data-mdc-tooltip-persistent': isPersistent
    }, class: classes">
    <div class="mdc-tooltip__surface mdc-tooltip__surface-animation"
         data-bind="template: { nodes: $componentTemplateNodes, data: data }">
    </div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-rich-tooltip", RichTooltip);

//#endregion