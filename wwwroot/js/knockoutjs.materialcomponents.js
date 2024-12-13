/*!
 * knockoutjs.materialcomponents v1.0.34
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
 * @param {string} template Template name.
 */
utils.register = function (name, Model, template = "template") {
    register[Model.name] = Model;
    ko.components.register(name, {
        template: Model[template],
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


//#region [ Constructor ]

/**
 * Creates instance of the circular progress component.
 * 
 * @param {object} args Arguments. 
 */
const CircularProgress = function(args) {
    console.debug("CircularProgress()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_circular-progress_" + utils.guid());
    this.label = ko.isObservable(args.label) ? args.label : ko.observable(args.label || "");
    this.isOpen = ko.isObservable(args.isOpen) ? args.isOpen : ko.observable(typeof(args.isOpen) === "boolean" ? args.isOpen : true);
    this.isDeterminate = ko.isObservable(args.isDeterminate) ? args.isDeterminate : ko.observable(typeof(args.isDeterminate) === "boolean" ? args.isDeterminate : true);
    this.progress = ko.isObservable(args.progress) ? args.progress : ko.observable(typeof(args.progress) === "number" ? args.progress : 0);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    this._isOpenChangedSubscribe = null;
    this._isDeterminateChangedSubscribe = null;
    this._progressChangedSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
CircularProgress.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.circularProgress.MDCCircularProgress(root);

    this._isOpenChangedSubscribe = this.isOpen.subscribe(this._isOpenChanged, this);
    this._isDeterminateChangedSubscribe = this.isDeterminate.subscribe(this._isDeterminateChanged, this);
    this._progressChangedSubscribe = this.progress.subscribe(this._progressChanged, this);

    this.isOpen.valueHasMutated();
    this.isDeterminate.valueHasMutated();
    this.progress.valueHasMutated();
};


/**
 * Dispose.
 */
CircularProgress.prototype.dispose = function () {
    console.log("~CircularProgress()");

    this._isOpenChangedSubscribe.dispose();
    this._isDeterminateChangedSubscribe.dispose();
    this._progressChangedSubscribe.dispose();
    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the isOpen property change event.
 * 
 * @param {boolean} value If set to true, progress is visible.
 **/
CircularProgress.prototype._isOpenChanged = function (value) {
    this.mdcComponent[value ? "open" : "close"]();
};


/**
 * Handles the isDeterminate property change event.
 * 
 * @param {boolean} value If set to true, progress is determinate.
 **/
CircularProgress.prototype._isDeterminateChanged = function (value) {
    this.mdcComponent.determinate = value;
};


/**
 * Handles the progress property change event.
 * 
 * @param {boolean} value Progress value between [0, 1].
 **/
CircularProgress.prototype._progressChanged = function (value) {
    this.mdcComponent.progress = value;
};

//#endregion


//#region [ Template ]

CircularProgress.template =
`<div class="mdc-circular-progress" style="width:48px;height:48px;" role="progressbar" aria-valuemin="0" aria-valuemax="1"
    data-bind="attr: { id: id, 'aria-label': label }, class: classes">
    <div class="mdc-circular-progress__determinate-container">
        <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle class="mdc-circular-progress__determinate-track" cx="24" cy="24" r="18" stroke-width="4"/>
            <circle class="mdc-circular-progress__determinate-circle" cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="113.097" stroke-width="4"/>
        </svg>
    </div>
    <div class="mdc-circular-progress__indeterminate-container">
        <div class="mdc-circular-progress__spinner-layer">
            <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
                <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
                </svg>
            </div>
            <div class="mdc-circular-progress__gap-patch">
                <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.2"/>
                </svg>
            </div>
            <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
                <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
                </svg>
            </div>
        </div>
    </div>
</div>`;

CircularProgress.templateMedium =
`<div class="mdc-circular-progress" style="width:36px;height:36px;" role="progressbar" aria-valuemin="0" aria-valuemax="1"
    data-bind="attr: { id: id, 'aria-label': label }, class: classes">
    <div class="mdc-circular-progress__determinate-container">
        <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle class="mdc-circular-progress__determinate-track" cx="16" cy="16" r="12.5" stroke-width="3"/>
            <circle class="mdc-circular-progress__determinate-circle" cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="78.54" stroke-width="3"/>
        </svg>
    </div>
    <div class="mdc-circular-progress__indeterminate-container">
        <div class="mdc-circular-progress__spinner-layer">
            <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
                <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="3"/>
                </svg>
            </div>
            <div class="mdc-circular-progress__gap-patch">
                <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="2.4"/>
                </svg>
            </div>
            <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
                <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="3"/>
                </svg>
            </div>
        </div>
    </div>
</div>`;

CircularProgress.templateSmall =
`<div class="mdc-circular-progress" style="width:24px;height:24px;" role="progressbar" aria-valuemin="0" aria-valuemax="1"
    data-bind="attr: { id: id, 'aria-label': label }, class: classes">
    <div class="mdc-circular-progress__determinate-container">
        <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle class="mdc-circular-progress__determinate-track" cx="12" cy="12" r="8.75" stroke-width="2.5"/>
            <circle class="mdc-circular-progress__determinate-circle" cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="54.978" stroke-width="2.5"/>
        </svg>
    </div>
    <div class="mdc-circular-progress__indeterminate-container">
        <div class="mdc-circular-progress__spinner-layer">
            <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
                <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5"/>
                </svg>
            </div>
            <div class="mdc-circular-progress__gap-patch">
                <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2"/>
                </svg>
            </div>
            <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
                <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5"/>
                </svg>
            </div>
        </div>
    </div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-circular-progress", CircularProgress);
utils.register("mat-circular-progress-medium", CircularProgress, "templateMedium");
utils.register("mat-circular-progress-small", CircularProgress, "templateSmall");

//#endregion


//#region [ Constructor ]

/**
 * Creates instance of the linear progress component.
 * 
 * @param {object} args Arguments. 
 */
const LinearProgress = function(args) {
    console.debug("LinearProgress()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_linear-progress_" + utils.guid());
    this.label = ko.isObservable(args.label) ? args.label : ko.observable(args.label || "");
    this.isOpen = ko.isObservable(args.isOpen) ? args.isOpen : ko.observable(typeof(args.isOpen) === "boolean" ? args.isOpen : true);
    this.isDeterminate = ko.isObservable(args.isDeterminate) ? args.isDeterminate : ko.observable(typeof(args.isDeterminate) === "boolean" ? args.isDeterminate : true);
    this.progress = ko.isObservable(args.progress) ? args.progress : ko.observable(typeof(args.progress) === "number" ? args.progress : 0);
    this.buffer = ko.isObservable(args.buffer) ? args.buffer : ko.observable(typeof(args.buffer) === "number" ? args.buffer : 0);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    this._isOpenChangedSubscribe = null;
    this._isDeterminateChangedSubscribe = null;
    this._progressChangedSubscribe = null;
    this._bufferChangedSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
LinearProgress.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.linearProgress.MDCLinearProgress(root);

    this._isOpenChangedSubscribe = this.isOpen.subscribe(this._isOpenChanged, this);
    this._isDeterminateChangedSubscribe = this.isDeterminate.subscribe(this._isDeterminateChanged, this);
    this._progressChangedSubscribe = this.progress.subscribe(this._progressChanged, this);
    this._bufferChangedSubscribe = this.buffer.subscribe(this._bufferChanged, this);

    this.isOpen.valueHasMutated();
    this.isDeterminate.valueHasMutated();
    this.progress.valueHasMutated();
    this.buffer.valueHasMutated();
};


/**
 * Dispose.
 */
LinearProgress.prototype.dispose = function () {
    console.log("~LinearProgress()");

    this._isOpenChangedSubscribe.dispose();
    this._isDeterminateChangedSubscribe.dispose();
    this._progressChangedSubscribe.dispose();
    this._bufferChangedSubscribe.dispose();
    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the isOpen property change event.
 * 
 * @param {boolean} value If set to true, progress is visible.
 **/
LinearProgress.prototype._isOpenChanged = function (value) {
    this.mdcComponent[value ? "open" : "close"]();
};


/**
 * Handles the isDeterminate property change event.
 * 
 * @param {boolean} value If set to true, progress is determinate.
 **/
LinearProgress.prototype._isDeterminateChanged = function (value) {
    this.mdcComponent.determinate = value;
};


/**
 * Handles the progress property change event.
 * 
 * @param {boolean} value Progress value between [0, 1].
 **/
LinearProgress.prototype._progressChanged = function (value) {
    this.mdcComponent.progress = value;
};


/**
 * Handles the buffer property change event.
 * 
 * @param {boolean} value Buffer value between [0, 1].
 **/
LinearProgress.prototype._bufferChanged = function (value) {
    this.mdcComponent.buffer = value;
};

//#endregion


//#region [ Template ]

LinearProgress.template =
`<div role="progressbar" class="mdc-linear-progress" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0"
    data-bind="attr: { id: id, 'aria-label': label }, class: classes">
    <div class="mdc-linear-progress__buffer">
        <div class="mdc-linear-progress__buffer-bar"></div>
        <div class="mdc-linear-progress__buffer-dots"></div>
    </div>
    <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
    </div>
    <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
    </div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-linear-progress", LinearProgress);

//#endregion


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
    this.anchor = args.anchor || null;

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
    this.anchor = node.parentElement.querySelector(this.anchor);
    if(!this.anchor) {
        console.warn("RichTooltip : Missing anchor element for tooltip '%s'.", this.id());
        return;
    }

    // The tooltip can be hidden from the screenreader by annotating the anchor element
    // with data-tooltip-id instead of aria-describedby
    this.anchor.setAttribute("data-tooltip-id", this.id());
    this.anchor.setAttribute("aria-haspopup", "dialog");
    this.anchor.setAttribute("aria-expanded", "false");

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
    
    if (!this.anchor) {
        return;
    }

    this._showDelayChangedSubscribe.dispose();
    this._hideDelayChangedSubscribe.dispose();
    this.mdcComponent.destroy();
    this.anchor.removeAttribute("data-tooltip-id");
    this.anchor.removeAttribute("aria-haspopup");
    this.anchor.removeAttribute("aria-expanded");
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
    // Check for the supplied callback function
    if (typeof (this.onClick) !== "function") {
        console.debug("Button : _onClick(): Callback for the 'click' event is not defined.");
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
    // Check for the supplied callback function
    if (typeof (this.onClick) !== "function") {
        console.debug("Fab : _onClick(): Callback for the 'click' event is not defined.");
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


//#region [ Constructor ]

/**
 * Creates instance of the switch component.
 * 
 * @param {object} args Arguments. 
 */
const Switch = function(args) {
    console.debug("Switch()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_switch_" + utils.guid());
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isChecked = ko.isObservable(args.isChecked) ? args.isChecked : ko.observable(typeof(args.isChecked) === "boolean" ? args.isChecked : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    this._isEnabledChangedSubscribe = null;
    this._isCheckedChangedSubscribe = null;

    this._observer = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
Switch.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.switchControl.MDCSwitch(root);

    this._isEnabledChangedSubscribe = this.isEnabled.subscribe(this._isEnabledChanged, this);
    this._isCheckedChangedSubscribe = this.isChecked.subscribe(this._isCheckedChanged, this);

    this.isEnabled.valueHasMutated();
    this.isChecked.valueHasMutated();
    
    this._observer = new MutationObserver(this._onObserve.bind(this));
    this._observer.observe(root, { 
        attributes: true,
        attributeFilter: ["aria-checked"],
        attributeOldValue: true
    });
};


/**
 * Dispose.
 */
Switch.prototype.dispose = function () {
    console.log("~Switch()");
    
    this._observer.disconnect();
    this._isEnabledChangedSubscribe.dispose();
    this._isCheckedChangedSubscribe.dispose();
    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Callback function when DOM changes occur.
 * 
 * @param {array} mutations List of mutations.
 */
Switch.prototype._onObserve = function (mutations) {
    mutations.forEach((mutation) => {
        if (mutation.type !== "attributes") {
            return;
        }

        this._isCheckedChangedSubscribe.dispose();
        this.isChecked(mutation.target.getAttribute("aria-checked") === "true");
        this._isCheckedChangedSubscribe = this.isChecked.subscribe(this._isCheckedChanged, this);
    });
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the isChecked property change event.
 * 
 * @param {number} value Specify wether the switch is checked or not.
 **/
Switch.prototype._isCheckedChanged = function (value) {
    this.mdcComponent.selected = value;
};


/**
 * Handles the isChecked property change event.
 * 
 * @param {number} value Specify wether the switch is checked or not.
 **/
Switch.prototype._isEnabledChanged = function (value) {
    this.mdcComponent.disabled = !value;
};

//#endregion


//#region [ Template ]

Switch.template =
`<button id="basic-switch" class="mdc-switch mdc-switch--unselected" type="button" role="switch" aria-checked="false"
         data-bind="attr: { id: id }, class: classes">
    <div class="mdc-switch__track"></div>
    <div class="mdc-switch__handle-track">
        <div class="mdc-switch__handle">
            <div class="mdc-switch__shadow">
                <div class="mdc-elevation-overlay"></div>
            </div>
            <div class="mdc-switch__ripple"></div>
            <div class="mdc-switch__icons">
                <svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24">
                    <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
                </svg>
                <svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24">
                    <path d="M20 13H4v-2h16v2z" />
                </svg>
            </div>
        </div>
    </div>
    <span class="mdc-switch__focus-ring-wrapper">
        <div class="mdc-switch__focus-ring"></div>
    </span>
</button>`;

//#endregion


//#region [ Registration ]

utils.register("mat-switch", Switch);

//#endregion
}));