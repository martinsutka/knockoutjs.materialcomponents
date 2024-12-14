/*!
 * knockoutjs.materialcomponents v1.0.43
 * 2024-12-14
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


//#region [ Constructor ]

/**
 * Creates instance of the chip component.
 * 
 * @param {object} args Arguments. 
 */
const Chip = function(args) {
    console.debug("Chip()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_chip_" + utils.guid());
    this.text = ko.isObservable(args.text) ? args.text : ko.observable(args.text || "");
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.trailingIcon = ko.isObservable(args.trailingIcon) ? args.trailingIcon : ko.observable(args.trailingIcon || "");
    this.type = ko.isObservable(args.type) ? args.type : ko.observable(args.type || Chip.TYPE.regular);
    this.isChecked = ko.isObservable(args.isChecked) ? args.isChecked : ko.observable(typeof(args.isChecked) === "boolean" ? args.isChecked : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    this.onClick = args.onClick;
    this.onTrailClick = args.onTrailClick;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
Chip.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.chips.MDCChip(root);
    this.mdcComponent.listen("MDCChip:interaction", this._onMdcComponentInteraction.bind(this));
};


/**
 * Dispose.
 */
Chip.prototype.dispose = function () {
    console.log("~Chip()");

    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
Chip.prototype._onMdcComponentInteraction = function(e) {
    if ((this.type() === Chip.TYPE.filter) || (this.type() === Chip.TYPE.choice)){
        this.isChecked(!this.isChecked());
    }

    // Check for the supplied callback function
    if (typeof (this.onClick) !== "function") {
        console.debug("Chip : _onClick(): Callback for the 'click' event is not defined.");
        return;
    }

    this.onClick(this);
};


/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
Chip.prototype._onMdcComponentTrailingIconInteraction = function(vm, e) {
    e.stopPropagation();

    // Check for the supplied callback function
    if (typeof (this.onTrailClick) !== "function") {
        console.debug("Chip : _onMdcComponentTrailingIconInteraction(): Callback for the 'trailclick' event is not defined.");
        return;
    }

    this.onTrailClick(this);
};

//#endregion


//#region [ Enums ]

/**
 * Chip types.
 */
Chip.TYPE = {
    regular: 0,
    input: 1,
    filter: 2,
    choice: 3
};

//#endregion


//#region [ Template ]

Chip.template =
`<div class="mdc-chip" role="row"
      data-bind="css: { 'mdc-chip--selected': isChecked() }, 
                 attr: { id: id }, 
                 class: classes">
    <div class="mdc-chip__ripple"></div>
    <i class="material-icons mdc-chip__icon mdc-chip__icon--leading"
       data-bind="css: { 'mdc-chip__icon--leading-hidden': isChecked() }, 
                  text: icon, 
                  visible: icon().length"></i>
    <span class="mdc-chip__checkmark" data-bind="visible: type() === ${Chip.TYPE.filter}">
        <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
            <path class="mdc-chip__checkmark-path" fill="none" stroke="black" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
        </svg>
    </span>
    <span role="gridcell">
        <span tabindex="0" aria-checked="false" class="mdc-chip__primary-action"
              data-bind="attr: { 
                            role: type() === ${Chip.TYPE.filter} ? 'checkbox' :
                                  type() === ${Chip.TYPE.choice} ? 'radio' : 'button'
                         }">
            <span class="mdc-chip__text" data-bind="text: text"></span>
        </span>
    </span>
    <span role="gridcell" data-bind="visible: (type() === ${Chip.TYPE.input}) || ((type() === ${Chip.TYPE.filter}) && trailingIcon().length)">
        <i class="material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
           data-bind="text: trailingIcon() || 'clear', click: _onMdcComponentTrailingIconInteraction"></i>
    </span>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-chip", Chip);

//#endregion


//#region [ Constructor ]

/**
 * Creates instance of the slider component.
 * 
 * @param {object} args Arguments. 
 */
const Slider = function(args) {
    console.debug("Slider()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_slider_" + utils.guid());
    this.name = ko.isObservable(args.name) ? args.name : ko.observable(args.name || "");
    this.min = ko.isObservable(args.min) ? args.min : ko.observable(typeof(args.min) === "number" ? args.min : 0);
    this.max = ko.isObservable(args.max) ? args.max : ko.observable(typeof(args.max) === "number" ? args.max : 100);
    this.value = ko.isObservable(args.value) ? args.value : ko.observable(typeof(args.value) === "number" ? args.value : 0);
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isDiscrete = ko.isObservable(args.isDiscrete) ? args.isDiscrete : ko.observable(typeof(args.isDiscrete) === "boolean" ? args.isDiscrete : false);
    this.showTickMarks = ko.isObservable(args.showTickMarks) ? args.showTickMarks : ko.observable(typeof(args.showTickMarks) === "boolean" ? args.showTickMarks : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    this._valueChangedSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
Slider.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.slider.MDCSlider(root);
    this.mdcComponent.listen("MDCSlider:change", this._onMdcComponentChange.bind(this));

    this._valueChangedSubscribe = this.value.subscribe(this._valueChanged, this);
};


/**
 * Dispose.
 */
Slider.prototype.dispose = function () {
    console.log("~Slider()");

    this._valueChangedSubscribe.dispose();
    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the isIndeterminate property change event.
 * 
 * @param {boolean} value If set to true, the checkbox is indeterminate.
 **/
Slider.prototype._valueChanged = function (value) {
    this.mdcComponent.setValue(value);
};


/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
Slider.prototype._onMdcComponentChange = function(e) {
    this._valueChangedSubscribe.dispose();
    this.value(e.detail.value);
    this._valueChangedSubscribe = this.value.subscribe(this._valueChanged, this);
};


//#endregion


//#region [ Template ]

Slider.template =
`<div class="mdc-slider"
      data-bind="css: {
        'mdc-slider--disabled': !isEnabled(),
        'mdc-slider--discrete': isDiscrete,
        'mdc-slider--tick-marks': isDiscrete() && showTickMarks()
    }, attr: { id: id }, class: classes">
    <div class="mdc-slider__track">
        <div class="mdc-slider__track--inactive"></div>
        <div class="mdc-slider__track--active">
            <div class="mdc-slider__track--active_fill"></div>
        </div>
        <!-- ko if: isDiscrete() && showTickMarks() -->
        <div class="mdc-slider__tick-marks" data-bind="foreach: Array.from({length: max() - min()}, (_, i) => i + 1)">
            <div class="mdc-slider__tick-mark--active"></div>
        </div>
        <!-- /ko -->
    </div>
    <div class="mdc-slider__thumb">
        <!-- ko if: isDiscrete -->
        <div class="mdc-slider__value-indicator-container" aria-hidden="true">
            <div class="mdc-slider__value-indicator">
                <span class="mdc-slider__value-indicator-text"></span>
            </div>
        </div>
        <!-- /ko -->
        <div class="mdc-slider__thumb-knob"></div>
        <input class="mdc-slider__input" type="range"
               data-bind="attr: { id: id() + '_input', name: name, enable: isEnabled, min: min, max: max, value: value }" />
    </div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-slider", Slider);

//#endregion


//#region [ Constructor ]

/**
 * Creates instance of the range slider component.
 * 
 * @param {object} args Arguments. 
 */
const RangeSlider = function(args) {
    console.debug("RangeSlider()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_rangeslider_" + utils.guid());
    this.name = ko.isObservable(args.name) ? args.name : ko.observable(args.name || "");
    this.minRange = ko.isObservable(args.minRange) ? args.minRange : ko.observable(typeof(args.minRange) === "number" ? args.minRange : 10);
    this.min = ko.isObservable(args.min) ? args.min : ko.observable(typeof(args.min) === "object" ? args.min : { start: 0, end: 100 });
    this.max = ko.isObservable(args.max) ? args.max : ko.observable(typeof(args.max) === "object" ? args.max : { start: 0, end: 100 });
    this.value = ko.isObservable(args.value) ? args.value : ko.observable(args.value instanceof Array ? args.value : [0, 0]);
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isDiscrete = ko.isObservable(args.isDiscrete) ? args.isDiscrete : ko.observable(typeof(args.isDiscrete) === "boolean" ? args.isDiscrete : false);
    this.showTickMarks = ko.isObservable(args.showTickMarks) ? args.showTickMarks : ko.observable(typeof(args.showTickMarks) === "boolean" ? args.showTickMarks : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    this._valueChangedSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
RangeSlider.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.slider.MDCSlider(root);
    this.mdcComponent.listen("MDCSlider:change", this._onMdcComponentChange.bind(this));

    this._valueChangedSubscribe = this.value.subscribe(this._valueChanged, this);

    this.value.valueHasMutated();
};


/**
 * Dispose.
 */
RangeSlider.prototype.dispose = function () {
    console.log("~RangeSlider()");

    this._valueChangedSubscribe.dispose();
    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the isIndeterminate property change event.
 * 
 * @param {boolean} value If set to true, the checkbox is indeterminate.
 **/
RangeSlider.prototype._valueChanged = function (value) {
    this.mdcComponent.setValueStart(value[0]);
    this.mdcComponent.setValue(value[1]);
};


/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
RangeSlider.prototype._onMdcComponentChange = function(e) {
    this._valueChangedSubscribe.dispose();
    const val = this.value();
    val[e.detail.thumb === 1 ? 0 : 1] = e.detail.value;
    this.value(val);
    this._valueChangedSubscribe = this.value.subscribe(this._valueChanged, this);
};


//#endregion


//#region [ Template ]

RangeSlider.template =
`<div class="mdc-slider mdc-slider--range"
      data-bind="css: {
        'mdc-slider--disabled': !isEnabled(),
        'mdc-slider--discrete': isDiscrete,
        'mdc-slider--tick-marks': isDiscrete() && showTickMarks()
    }, attr: { id: id, 'data-min-range': minRange }, class: classes">
    <div class="mdc-slider__track">
        <div class="mdc-slider__track--inactive"></div>
        <div class="mdc-slider__track--active">
            <div class="mdc-slider__track--active_fill"></div>
        </div>
        <!-- ko if: isDiscrete() && showTickMarks() -->
        <div class="mdc-slider__tick-marks" data-bind="foreach: Array.from({length: max() - min()}, (_, i) => i + 1)">
            <div class="mdc-slider__tick-mark--active"></div>
        </div>
        <!-- /ko -->
    </div>
    <div class="mdc-slider__thumb">
        <!-- ko if: isDiscrete -->
        <div class="mdc-slider__value-indicator-container" aria-hidden="true">
            <div class="mdc-slider__value-indicator">
                <span class="mdc-slider__value-indicator-text"></span>
            </div>
        </div>
        <!-- /ko -->
        <div class="mdc-slider__thumb-knob"></div>
        <input class="mdc-slider__input" type="range"
               data-bind="attr: { id: id() + '_input-start', name: 'rangeStart', enable: isEnabled, min: min().start, max: max().start, value: value()[0] }" />
    </div>
    <div class="mdc-slider__thumb">
        <!-- ko if: isDiscrete -->
        <div class="mdc-slider__value-indicator-container" aria-hidden="true">
            <div class="mdc-slider__value-indicator">
                <span class="mdc-slider__value-indicator-text"></span>
            </div>
        </div>
        <!-- /ko -->
        <div class="mdc-slider__thumb-knob"></div>
        <input class="mdc-slider__input" type="range"
               data-bind="attr: { id: id() + '_input-end', name: 'rangeEnd', enable: isEnabled, min: min().end, max: max().end, value: value()[1] }" />
    </div>    
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-range-slider", RangeSlider);

//#endregion


//#region [ Constructor ]

/**
 * Creates instance of the tab component.
 * 
 * @param {object} args Arguments. 
 */
const Tab = function(args) {
    console.debug("Tab()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_tab_" + utils.guid());
    this.text = ko.isObservable(args.text) ? args.text : ko.observable(args.text || "");
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.indicator = ko.isObservable(args.indicator) ? args.indicator : ko.observable(args.indicator || Tab.INDICATOR.default);
    this.isActive = ko.isObservable(args.isActive) ? args.isActive : ko.observable(typeof(args.isActive) === "boolean" ? args.isActive : false);
    this.isStacked = ko.isObservable(args.isStacked) ? args.isStacked : ko.observable(typeof(args.isStacked) === "boolean" ? args.isStacked : false);
    this.isMinWidth = ko.isObservable(args.isMinWidth) ? args.isMinWidth : ko.observable(typeof(args.isMinWidth) === "boolean" ? args.isMinWidth : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    if (ko.isObservableArray(args.tabs)) {
        args.tabs.push(this);
    }

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
Tab.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.tab.MDCTab(root);
    this.mdcComponent.listen("MDCTab:interacted", utils.throttle(this._onMdcComponentInteracted.bind(this), 100));
};


/**
 * Dispose.
 */
Tab.prototype.dispose = function () {
    console.log("~Tab()");

    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
Tab.prototype._onMdcComponentInteracted = function(e) {
    // Check for the supplied callback function
    if (typeof (this.onClick) !== "function") {
        console.debug("Tab : _onClick(): Callback for the 'click' event is not defined.");
        return;
    }

    this.onClick(this);
};

//#endregion


//#region [ Enums ]

/**
 * Tab indicator.
 */
Tab.INDICATOR = {
    default: 0,
    onlyContent: 1
};

//#endregion


//#region [ Template ]

Tab.template =
`<button class="mdc-tab" role="tab"
         data-bind="css: {
                        'mdc-tab--active': isActive(),
                        'mdc-tab--stacked': isStacked(),
                        'mdc-tab--min-width': isMinWidth()
                    }, 
                    attr: { 
                        id: id, 
                        'aria-selected': isActive() ? true : false 
                    },
                    class: classes">
    <span class="mdc-tab__content">
        <i class="mdc-tab__icon material-icons" aria-hidden="true"
           data-bind="text: icon, visible: icon().length"></i>
        <span class="mdc-tab__text-label" data-bind="text: text"></span>
        <!-- ko if: indicator() === ${Tab.INDICATOR.onlyContent} -->
        <span class="mdc-tab-indicator",
              data-bind="css: { 'mdc-tab-indicator--active': isActive() }">
            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
        </span>
        <!-- /ko -->        
    </span>
    <!-- ko if: indicator() === ${Tab.INDICATOR.default} -->
    <span class="mdc-tab-indicator",
          data-bind="css: { 'mdc-tab-indicator--active': isActive() }">
        <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
    </span>
    <!-- /ko -->
    <span class="mdc-tab__ripple"></span>
    <div class="mdc-tab__focus-ring"></div>
</button>`;

//#endregion


//#region [ Registration ]

utils.register("mat-tab", Tab);

//#endregion


//#region [ Constructor ]

/**
 * Creates instance of the tab bar component.
 * 
 * @param {object} args Arguments. 
 */
const TabBar = function(args) {
    console.debug("TabBar()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_tab-bar_" + utils.guid());
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");
    this.isFocusedWhenActivate = ko.isObservable(args.isFocusedWhenActivate) ? args.isFocusedWhenActivate : ko.observable(typeof(args.isFocusedWhenActivate) === "boolean" ? args.isFocusedWhenActivate : true);
    this.isAutomaticallyActivated = ko.isObservable(args.isAutomaticallyActivated) ? args.isAutomaticallyActivated : ko.observable(typeof(args.isAutomaticallyActivated) === "boolean" ? args.isAutomaticallyActivated : true);
    this.tabs = ko.observableArray();
    this.activeTab = ko.isObservable(args.activeTab) ? args.activeTab : ko.observable(["string", "number"].includes(typeof(args.activeTab)) ? args.activeTab : null);

    this._isFocusedWhenActivateSubscribe = null;
    this._isAutomaticallyActivatedSubscribe = null;
    this._activeTabSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
TabBar.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.tabBar.MDCTabBar(root);
    this.mdcComponent.listen("MDCTabBar:activated", this._onMdcComponentActivated.bind(this));

    this._isFocusedWhenActivateSubscribe = this.isFocusedWhenActivate.subscribe(this._isFocusedWhenActivateChanged, this);
    this._isAutomaticallyActivatedSubscribe = this.isAutomaticallyActivated.subscribe(this._isAutomaticallyActivatedChanged, this);
    this._activeTabSubscribe = this.activeTab.subscribe(this._activeTabChanged, this);

    this.isFocusedWhenActivate.valueHasMutated();
    this.isAutomaticallyActivated.valueHasMutated();
    this.activeTab.valueHasMutated();
};


/**
 * Dispose.
 */
TabBar.prototype.dispose = function () {
    console.log("~TabBar()");

    this._isFocusedWhenActivateSubscribe.dispose();
    this._isAutomaticallyActivatedSubscribe.dispose();
    this._activeTabSubscribe.dispose();
    this.mdcComponent.destroy();
};

//#endregion


//#endregion [ Event Handlers ]

/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
TabBar.prototype._onMdcComponentActivated = function(e) {
    this.tabs().forEach((tab, index) => tab.isActive(index === e.detail.index));
};


/**
 * Handles the isFocusedWhenActivate property change event.
 * 
 * @param {number} value Whether tabs focus themselves when activated.
 **/
TabBar.prototype._isFocusedWhenActivateChanged = function (value) {
    this.mdcComponent.focusOnActivate = value;
};


/**
 * Handles the isAutomaticallyActivated property change event.
 * 
 * @param {number} value Automatic (true) activates as soon as a tab is focused with arrow keys; manual (false) activates only when the user presses space/enter.
 **/
TabBar.prototype._isAutomaticallyActivatedChanged = function (value) {
    this.mdcComponent.useAutomaticActivation = value;
};


/**
 * Handles the activeTab property change event.
 * 
 * @param {number} value Index or Id of the tab which should be activated.
 **/
TabBar.prototype._activeTabChanged = function (value) {
    if(value === null) {
        this.tabs().forEach((tab) => tab.isActive(false));
        return;
    }

    // Store the index of the tab
    let index = value;

    // Activate by id
    if (typeof(value) === "string") {
        index = this.tabs().findIndex((tab) => tab.id() === value);
    }

    // Activate by index
    if ((typeof(index) === "number") && (index >= 0)) {
        this._activeTabSubscribe.dispose();
        this.mdcComponent.activateTab(index);
        this._activeTabSubscribe = this.activeTab.subscribe(this._activeTabChanged, this);
        return;
    }
};

//#endregion


//#region [ Template ]

TabBar.template =
`<div class="mdc-tab-bar" role="tablist"
    data-bind="attr: { id: id }, class: classes">
    <div class="mdc-tab-scroller">
        <div class="mdc-tab-scroller__scroll-area">
            <div class="mdc-tab-scroller__scroll-content"
                 data-bind="template: { nodes: $componentTemplateNodes, data: { tabs: tabs } }">
            </div>
        </div>
    </div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-tab-bar", TabBar);

//#endregion


//#region [ Constructor ]

/**
 * Creates instance of the checkbox component.
 * 
 * @param {object} args Arguments. 
 */
const Checkbox = function(args) {
    console.debug("Checkbox()");

    this.mdcComponent = null;
    this.mdcComponentField = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_checkbox_" + utils.guid());
    this.text = ko.isObservable(args.text) ? args.text : ko.observable(args.text || "");
    this.value = ko.isObservable(args.value) ? args.value : ko.observable(args.value || "");
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isChecked = ko.isObservableArray(args.isChecked) ? args.isChecked : ko.isObservable(args.isChecked) ? args.isChecked : ko.observable(typeof(args.isChecked) === "boolean" ? args.isChecked : false);
    this.isIndeterminate  = ko.isObservable(args.isIndeterminate) ? args.isIndeterminate : ko.observable(typeof(args.isIndeterminate) === "boolean" ? args.isIndeterminate : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    this._isIndeterminateChangedSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
Checkbox.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.checkbox.MDCCheckbox(root.querySelector(".mdc-checkbox"));
    this.mdcComponentField = new mdc.formField.MDCFormField(root);
    this.mdcComponentField.input = this.mdcComponent;

    this._isIndeterminateChangedSubscribe = this.isIndeterminate.subscribe(this._isIndeterminateChanged, this);

    this.isIndeterminate.valueHasMutated();
};


/**
 * Dispose.
 */
Checkbox.prototype.dispose = function () {
    console.log("~Checkbox()");

    this._isIndeterminateChangedSubscribe.dispose();
    this.mdcComponentField.destroy();
    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the isIndeterminate property change event.
 * 
 * @param {boolean} value If set to true, the checkbox is indeterminate.
 **/
Checkbox.prototype._isIndeterminateChanged = function (value) {
    this.mdcComponent.indeterminate = value;
};

//#endregion


//#region [ Template ]

Checkbox.template =
`<div class="mdc-form-field"
      data-bind="attr: { id: id }, class: classes">
    <div class="mdc-checkbox mdc-checkbox--touch">
        <input type="checkbox" class="mdc-checkbox__native-control"
               data-bind="attr: { id: id() + '_input' }, enable: isEnabled, checkedValue: value, checked: isChecked" />
        <div class="mdc-checkbox__background">
            <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
            </svg>
            <div class="mdc-checkbox__mixedmark"></div>
        </div>
        <div class="mdc-checkbox__ripple"></div>
        <div class="mdc-checkbox__focus-ring"></div>
    </div>
    <label data-bind="text: text, visible: text().length, attr: { for: id() + '_input' }"></label>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-checkbox", Checkbox);

//#endregion
}));