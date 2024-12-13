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