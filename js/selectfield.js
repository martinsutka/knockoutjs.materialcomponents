//#region [ Constructor ]

/**
 * Creates instance of the select field component.
 * 
 * @param {object} args Arguments. 
 */
const SelectField = function(args) {
    console.debug("SelectField()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_selectfield_" + utils.guid());
    this.text = ko.isObservable(args.text) ? args.text : ko.observable(args.text || "");
    this.options = ko.isObservableArray(args.options) ? args.options : ko.observableArray(Array.isArray(args.options) ? args.options : []);
    this.optionsText = ko.isObservable(args.optionsText) ? args.optionsText : ko.observable(args.optionsText || "text");
    this.optionsValue = ko.isObservable(args.optionsValue) ? args.optionsValue : ko.observable(args.optionsValue || "value");
    this.optionsCaption = ko.isObservable(args.optionsCaption) ? args.optionsCaption : ko.observable(args.optionsCaption || "");
    this.style = ko.isObservable(args.style) ? args.style : ko.observable(args.style || TextField.STYLE.outlined);
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.iconPosition = ko.isObservable(args.iconPosition) ? args.iconPosition : ko.observable(args.iconPosition || TextField.ICON_POSITION.start);
    this.note = ko.isObservable(args.note) ? args.note : ko.observable(args.note || "");
    this.error = ko.isObservable(args.error) ? args.error : ko.observable(args.error || "");
    this.isNotePersistent = ko.isObservable(args.isNotePersistent) ? args.isNotePersistent : ko.observable(typeof(args.isNotePersistent) === "boolean" ? args.isNotePersistent : false);
    this.value = ko.isObservable(args.value) ? args.value : ko.observable(args.value || "");
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isRequired = ko.isObservable(args.isRequired) ? args.isRequired : ko.observable(typeof(args.isRequired) === "boolean" ? args.isRequired : false);
    this.isReadonly = ko.isObservable(args.isReadonly) ? args.isReadonly : ko.observable(typeof(args.isReadonly) === "boolean" ? args.isReadonly : false);
    this.prefix = ko.isObservable(args.prefix) ? args.prefix : ko.observable(args.prefix || "");
    this.suffix = ko.isObservable(args.suffix) ? args.suffix : ko.observable(args.suffix || "");
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
SelectField.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.children[0];
    const helper = node.children[1];

    node.replaceWith(root);
    root.after(helper);

    this.mdcComponent = new mdc.textField.MDCTextField(root);
    if (this.value() || (typeof(this.value()) === "number")) {
        setTimeout(() => this.mdcComponent.value = this.value(), 1);
    }
};


/**
 * Dispose.
 */
SelectField.prototype.dispose = function () {
    console.log("~SelectField()");

    this.mdcComponent.destroy();
};

//#endregion


//#region [ Template ]

SelectField.template =
`<label class="mdc-text-field mdc-text-field--select"
        data-bind="class: classes,
                   attr: { 
                        id: id,
                        'data-value': value
                   },
                   css: {
                        'mdc-text-field--outlined': style() === ${TextField.STYLE.outlined},
                        'mdc-text-field--filled': style() === ${TextField.STYLE.filled},
                        'mdc-text-field--no-label': !text().length,
                        'mdc-text-field--with-leading-icon': icon().length && iconPosition() === ${TextField.ICON_POSITION.start},
                        'mdc-text-field--with-trailing-icon': icon().length && iconPosition() === ${TextField.ICON_POSITION.end}
                   }">
    <!-- ko if: style() === ${TextField.STYLE.outlined} -->
        <span class="mdc-notched-outline">
            <span class="mdc-notched-outline__leading"></span>
            <!-- ko if: text().length -->
            <span class="mdc-notched-outline__notch">
                <span class="mdc-floating-label" data-bind="text: text"></span>
            </span>
            <!-- /ko -->
            <span class="mdc-notched-outline__trailing"></span>
        </span>
    <!-- /ko -->
    <!-- ko if: style() === ${TextField.STYLE.filled} -->
        <span class="mdc-text-field__ripple"></span>
        <span class="mdc-floating-label" data-bind="text: text"></span>
    <!-- /ko -->    
    <!-- ko if: prefix().length -->
        <span class="mdc-text-field__affix mdc-text-field__affix--prefix" data-bind="text: prefix"></span>
    <!-- /ko -->
    <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" tabindex="0" role="button"
       data-bind="text: icon, visible: icon().length && iconPosition() === ${TextField.ICON_POSITION.start}"></i>
    <select class="mdc-text-field__input"
            data-bind="attr: { required: isRequired, readonly: isReadonly },
                       enable: isEnabled,
                       value: value,
                       options: options, 
                       optionsText: optionsText(),
                       optionsValue: optionsValue(),
                       optionsCaption: optionsCaption"></select>
    <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button"
       data-bind="text: icon, visible: icon().length && iconPosition() === ${TextField.ICON_POSITION.end}"></i>
    <!-- ko if: suffix().length -->
        <span class="mdc-text-field__affix mdc-text-field__affix--suffix" data-bind="text: suffix"></span>
    <!-- /ko -->
    <!-- ko if: style() === ${TextField.STYLE.filled} -->
        <span class="mdc-line-ripple"></span>
    <!-- /ko -->
</label>
<div class="mdc-text-field-helper-line" data-bind="visible: note().length || error().length">
    <div class="mdc-text-field-helper-text" aria-hidden="true"
         data-bind="text: note, visible: note().length,
                    css: {
                        'mdc-text-field-helper-text--persistent': isNotePersistent
                    }"></div>
    <div class="mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg" aria-hidden="true"
         data-bind="text: error, visible: error().length"></div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-select-field", SelectField);

//#endregion