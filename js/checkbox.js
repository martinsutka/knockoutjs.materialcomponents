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
    this.note = ko.isObservable(args.note) ? args.note : ko.observable(args.note || "");
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
    this._isCheckedChangedSubscribe = this.isChecked.subscribe(this._isCheckedChanged, this);

    this.isIndeterminate.valueHasMutated();
    this.isChecked.valueHasMutated();
};


/**
 * Dispose.
 */
Checkbox.prototype.dispose = function () {
    console.log("~Checkbox()");

    this._isIndeterminateChangedSubscribe.dispose();
    this._isCheckedChangedSubscribe.dispose();
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


/**
 * Handles the isChecked property change event.
 * 
 * @param {boolean} value If set to true, the checkbox is checked.
 **/
Checkbox.prototype._isCheckedChanged = function (value) {
    if (Array.isArray(value)) {
        this.mdcComponent.checked = value.includes(this.value());
        return;
    }

    this.mdcComponent.checked = value;
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
    <label class="mdc-checkbox__label"
           data-bind="visible: text().length,
                      attr: { for: id() + '_input' },
                      css: {
                        'mdc-checkbox__label--note': note().length
                      }">
        <span data-bind="text: text"></span>
        <small class="mdc-checkbox__note" data-bind="text: note, visible: note().length"></small>
    </label>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-checkbox", Checkbox);

//#endregion