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