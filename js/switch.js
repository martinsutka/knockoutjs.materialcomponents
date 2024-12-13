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