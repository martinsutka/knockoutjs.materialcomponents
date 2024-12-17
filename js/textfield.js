//#region [ Constructor ]

/**
 * Creates instance of the text field component.
 * 
 * @param {object} args Arguments. 
 */
const TextField = function(args) {
    console.debug("TextField()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_textfield_" + utils.guid());
    this.text = ko.isObservable(args.text) ? args.text : ko.observable(args.text || "");
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.iconPosition = ko.isObservable(args.iconPosition) ? args.iconPosition : ko.observable(args.iconPosition || TextField.ICON_POSITION.start);
    this.note = ko.isObservable(args.note) ? args.note : ko.observable(args.note || "");
    this.isNotePersistent = ko.isObservable(args.isNotePersistent) ? args.isNotePersistent : ko.observable(typeof(args.isNotePersistent) === "boolean" ? args.isNotePersistent : false);
    this.value = ko.isObservable(args.value) ? args.value : ko.observable(args.value || "");
    this.pattern = ko.isObservable(args.pattern) ? args.pattern : ko.observable(args.pattern || null);
    this.type = ko.isObservable(args.type) ? args.type : ko.observable(args.type || TextField.TYPE.text);
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isRequired = ko.isObservable(args.isRequired) ? args.isRequired : ko.observable(typeof(args.isRequired) === "boolean" ? args.isRequired : false);
    this.isReadonly = ko.isObservable(args.isReadonly) ? args.isReadonly : ko.observable(typeof(args.isReadonly) === "boolean" ? args.isReadonly : false);
    this.isAutoSelect = ko.isObservable(args.isAutoSelect) ? args.isAutoSelect : ko.observable(typeof(args.isAutoSelect) === "boolean" ? args.isAutoSelect : false);
    this.prefix = ko.isObservable(args.prefix) ? args.prefix : ko.observable(args.prefix || "");
    this.suffix = ko.isObservable(args.suffix) ? args.suffix : ko.observable(args.suffix || "");
    this.min = ko.isObservable(args.min) ? args.min : ko.observable(typeof(args.min) === "number" ? args.min : null);
    this.max = ko.isObservable(args.max) ? args.max : ko.observable(typeof(args.max) === "number" ? args.max : null);
    this.step = ko.isObservable(args.step) ? args.step : ko.observable(typeof(args.step) === "number" ? args.step : null);
    this.minLength = ko.isObservable(args.minLength) ? args.minLength : ko.observable(typeof(args.minLength) === "number" ? args.minLength : null);
    this.maxLength = ko.isObservable(args.maxLength) ? args.maxLength : ko.observable(typeof(args.maxLength) === "number" ? args.maxLength : null);
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
TextField.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.children[0];
    const helper = node.children[1];

    node.replaceWith(root);
    root.after(helper);

    if (this.isAutoSelect()) {
        const input = root.querySelector("input");
        input.addEventListener("focus", function() {
            if (typeof (this.select) === "function") {
                this.select();
            }
        });
    }

    this.mdcComponent = new mdc.textField.MDCTextField(root);
};


/**
 * Dispose.
 */
TextField.prototype.dispose = function () {
    console.log("~TextField()");

    this.mdcComponent.destroy();
};

//#endregion


//#region [ Enums ]

/**
 * Text field types.
 */
TextField.TYPE = {
    text: "text",
    number: "number",
    color: "color",
    date: "date",
    time: "time",
    email: "email",
    password: "password"
};


/**
 * Icon positions.
 */
TextField.ICON_POSITION = {
    start: 0,
    end: 1
};

//#endregion


//#region [ Template ]

TextField.template =
`<label class="mdc-text-field mdc-text-field--outlined"
        data-bind="class: classes,
                   attr: { 
                        id: id,
                        'data-value': value
                   },
                   css: {
                        'mdc-text-field--no-label': !text().length,
                        'mdc-text-field--with-leading-icon': icon().length && iconPosition() === ${TextField.ICON_POSITION.start},
                        'mdc-text-field--with-trailing-icon': icon().length && iconPosition() === ${TextField.ICON_POSITION.end}
                   }">
    <span class="mdc-notched-outline">
        <span class="mdc-notched-outline__leading"></span>
        <!-- ko if: text().length -->
        <span class="mdc-notched-outline__notch">
            <span class="mdc-floating-label" data-bind="text: text"></span>
        </span>
        <!-- /ko -->
        <span class="mdc-notched-outline__trailing"></span>
    </span>
    <!-- ko if: prefix().length -->
        <span class="mdc-text-field__affix mdc-text-field__affix--prefix" data-bind="text: prefix"></span>
    <!-- /ko -->
    <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" tabindex="0" role="button"
       data-bind="text: icon, visible: icon().length && iconPosition() === ${TextField.ICON_POSITION.start}"></i>
    <input class="mdc-text-field__input"
           data-bind="textInput: value,
                      attr: { type: type, min: min, max: max, step: step, required: isRequired, minlength: minLength, maxlength: maxLength, readonly: isReadonly, pattern: pattern },
                      enable: isEnabled,
                      css: {
                        'mdc-text-field__input--text': type() === '${TextField.TYPE.text}',
                        'mdc-text-field__input--number': type() === '${TextField.TYPE.number}',
                        'mdc-text-field__input--color': type() === '${TextField.TYPE.color}',
                        'mdc-text-field__input--date': type() === '${TextField.TYPE.date}',
                        'mdc-text-field__input--time': type() === '${TextField.TYPE.time}',
                        'mdc-text-field__input--email': type() === '${TextField.TYPE.email}',
                        'mdc-text-field__input--password': type() === '${TextField.TYPE.password}'
                      }" />
    <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button"
       data-bind="text: icon, visible: icon().length && iconPosition() === ${TextField.ICON_POSITION.end}"></i>
    <!-- ko if: suffix().length -->
        <span class="mdc-text-field__affix mdc-text-field__affix--suffix" data-bind="text: suffix"></span>
    <!-- /ko -->
</label>
<div class="mdc-text-field-helper-line" data-bind="visible: note().length">
    <div class="mdc-text-field-helper-text" aria-hidden="true"
         data-bind="text: note,
                    css: {
                        'mdc-text-field-helper-text--persistent': isNotePersistent
                    }"></div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-text-field", TextField);

//#endregion