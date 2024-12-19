//#region [ Constructor ]

/**
 * Creates instance of the radio component.
 * 
 * @param {object} args Arguments. 
 */
const Radio = function(args) {
    console.debug("Radio()");

    this.mdcComponent = null;
    this.mdcComponentField = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_radio_" + utils.guid());
    this.name = ko.isObservable(args.name) ? args.name : ko.observable(args.name || "");
    this.value = ko.isObservable(args.value) ? args.value : ko.observable(args.value || "");
    this.text = ko.isObservable(args.text) ? args.text : ko.observable(args.text || "");
    this.note = ko.isObservable(args.note) ? args.note : ko.observable(args.note || "");
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isChecked = ko.isObservable(args.isChecked) ? args.isChecked : ko.observable(typeof(args.isChecked) === "boolean" ? args.isChecked : false);
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
Radio.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.radio.MDCRadio(root.querySelector(".mdc-radio"));
    this.mdcComponentField = new mdc.formField.MDCFormField(root);
    this.mdcComponentField.input = this.mdcComponent;

    this._isCheckedChangedSubscribe = this.isChecked.subscribe(this._isCheckedChanged, this);

    this.isChecked.valueHasMutated();
};


/**
 * Dispose.
 */
Radio.prototype.dispose = function () {
    console.log("~Radio()");

    this._isCheckedChangedSubscribe.dispose();
    this.mdcComponentField.destroy();
    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the isChecked property change event.
 * 
 * @param {boolean} value If set to true, the checkbox is checked.
 **/
Radio.prototype._isCheckedChanged = function (value) {
    if (typeof(value) === "boolean") {
        this.mdcComponent.checked = value;
        return;
    }
    
    this.mdcComponent.checked = value == this.value();
};

//#endregion


//#region [ Template ]

Radio.template =
`<div class="mdc-form-field"
      data-bind="attr: { id: id }, class: classes">
    <div class="mdc-radio mdc-radio--touch">
        <input class="mdc-radio__native-control" type="radio"
               data-bind="attr: { id: id() + '_input', name: name }, checkedValue: value, enable: isEnabled, checked: isChecked"/>
        <div class="mdc-radio__background">
            <div class="mdc-radio__outer-circle"></div>
            <div class="mdc-radio__inner-circle"></div>
        </div>
        <div class="mdc-radio__ripple"></div>
        <div class="mdc-radio__focus-ring"></div>
    </div>
    <label class="mdc-radio__label"
           data-bind="visible: text().length,
                      attr: { for: id() + '_input' },
                      css: {
                        'mdc-checkbox__label--note': note().length
                      }">
        <span data-bind="text: text"></span>
        <small class="mdc-radio__note" data-bind="text: note, visible: note().length"></small>
    </label>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-radio", Radio);

//#endregion