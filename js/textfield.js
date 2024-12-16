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
    this.value = ko.isObservable(args.value) ? args.value : ko.observable(args.value || "");
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
    const root = node.firstElementChild;
    node.replaceWith(root);

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
//#endregion


//#region [ Template ]

TextField.template =
`<label class="mdc-text-field mdc-text-field--outlined"
        data-bind="attr: { id: id }, class: classes">
    <span class="mdc-notched-outline mdc-notched-outline--upgraded">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
            <span class="mdc-floating-label" data-bind="text: text"></span>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
    </span>
    <input type="text" class="mdc-text-field__input"
           data-bind="textInput: value" />
</label>`;

//#endregion


//#region [ Registration ]

utils.register("mat-text-field", TextField);

//#endregion