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
    this.style = ko.isObservable(args.style) ? args.style : ko.observable(args.style || TextField.STYLE.outlined);
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.iconPosition = ko.isObservable(args.iconPosition) ? args.iconPosition : ko.observable(args.iconPosition || TextField.ICON_POSITION.start);
    this.note = ko.isObservable(args.note) ? args.note : ko.observable(args.note || "");
    this.error = ko.isObservable(args.error) ? args.error : ko.observable(args.error || "");
    this.isNotePersistent = ko.isObservable(args.isNotePersistent) ? args.isNotePersistent : ko.observable(typeof(args.isNotePersistent) === "boolean" ? args.isNotePersistent : false);
    this.value = ko.isObservable(args.value) ? args.value : ko.observable(args.value || "");
    this.pattern = ko.isObservable(args.pattern) ? args.pattern : ko.observable(args.pattern || null);
    this.type = ko.isObservable(args.type) ? args.type : ko.observable(args.type || TextField.TYPE.text);
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isRequired = ko.isObservable(args.isRequired) ? args.isRequired : ko.observable(typeof(args.isRequired) === "boolean" ? args.isRequired : false);
    this.isReadonly = ko.isObservable(args.isReadonly) ? args.isReadonly : ko.observable(typeof(args.isReadonly) === "boolean" ? args.isReadonly : false);
    this.isAutoSelect = ko.isObservable(args.isAutoSelect) ? args.isAutoSelect : ko.observable(typeof(args.isAutoSelect) === "boolean" ? args.isAutoSelect : false);
    this.isMultiline = ko.isObservable(args.isMultiline) ? args.isMultiline : ko.observable(typeof(args.isMultiline) === "boolean" ? args.isMultiline : false);
    this.showCounter = ko.isObservable(args.showCounter) ? args.showCounter : ko.observable(typeof(args.showCounter) === "boolean" ? args.showCounter : false);
    this.prefix = ko.isObservable(args.prefix) ? args.prefix : ko.observable(args.prefix || "");
    this.suffix = ko.isObservable(args.suffix) ? args.suffix : ko.observable(args.suffix || "");
    this.min = ko.isObservable(args.min) ? args.min : ko.observable(typeof(args.min) === "number" ? args.min : null);
    this.max = ko.isObservable(args.max) ? args.max : ko.observable(typeof(args.max) === "number" ? args.max : null);
    this.step = ko.isObservable(args.step) ? args.step : ko.observable(typeof(args.step) === "number" ? args.step : null);
    this.minLength = ko.isObservable(args.minLength) ? args.minLength : ko.observable(typeof(args.minLength) === "number" ? args.minLength : null);
    this.maxLength = ko.isObservable(args.maxLength) ? args.maxLength : ko.observable(typeof(args.maxLength) === "number" ? args.maxLength : null);
    this.rows = ko.isObservable(args.rows) ? args.rows : ko.observable(typeof(args.rows) === "number" ? args.rows : 8);
    this.cols = ko.isObservable(args.cols) ? args.cols : ko.observable(typeof(args.cols) === "number" ? args.cols : 40);
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

    root.querySelector("input").addEventListener("focus", this._onFocus);

    this.mdcComponent = new mdc.textField.MDCTextField(root);
    if (this.value() || (typeof(this.value()) === "number")) {
        setTimeout(() => this.mdcComponent.value = this.value(), 1);
    }
};


/**
 * Dispose.
 */
TextField.prototype.dispose = function () {
    console.log("~TextField()");

    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

TextField.prototype._onFocus = function(e) {
    const isAutoSelect = ko.dataFor(this.parentElement).isAutoSelect();

    if (!isAutoSelect) {
        return;
    }

    if (typeof (this.select) === "function") {
        this.select();
    }
};

//#endregion


//#region [ Enums ]

/**
 * Text field types.
 */
TextField.STYLE = {
    outlined: 0,
    filled: 1
};

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
`<label class="mdc-text-field"
        data-bind="class: classes,
                   attr: { 
                        id: id,
                        'data-value': value
                   },
                   css: {
                        'mdc-text-field--outlined': style() === ${TextField.STYLE.outlined},
                        'mdc-text-field--filled': style() === ${TextField.STYLE.filled},
                        'mdc-text-field--textarea': isMultiline,
                        'mdc-text-field--no-label': !text().length,
                        'mdc-text-field--invalid': error().length,
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
    <!-- ko ifnot: isMultiline -->
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
    <!-- /ko -->
    <!-- ko if: isMultiline -->
    <span class="mdc-text-field__resizer">
        <textarea class="mdc-text-field__input" rows="8" cols="40"
                  data-bind="textInput: value,
                             attr: { rows: rows, cols: cols, required: isRequired, minlength: minLength, maxlength: maxLength, readonly: isReadonly }"></textarea>
    </span>    
    <!-- /ko -->
    <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button"
       data-bind="text: icon, visible: icon().length && iconPosition() === ${TextField.ICON_POSITION.end}"></i>
    <!-- ko if: suffix().length -->
        <span class="mdc-text-field__affix mdc-text-field__affix--suffix" data-bind="text: suffix"></span>
    <!-- /ko -->
    <!-- ko if: style() === ${TextField.STYLE.filled} -->
        <span class="mdc-line-ripple"></span>
    <!-- /ko -->
</label>
<div class="mdc-text-field-helper-line" data-bind="visible: note().length || error().length || showCounter()">
    <div class="mdc-text-field-helper-text" aria-hidden="true"
         data-bind="text: note, visible: note().length,
                    css: {
                        'mdc-text-field-helper-text--persistent': isNotePersistent
                    }"></div>
    <!-- ko if: showCounter --><div class="mdc-text-field-character-counter"></div><!-- /ko -->
    <div class="mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg" aria-hidden="true"
         data-bind="text: error, visible: error().length"></div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-text-field", TextField);

//#endregion