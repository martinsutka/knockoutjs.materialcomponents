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

    this.onClick = ko.isObservable(args.onClick) ? args.onClick : ko.observable(typeof(args.onClick) === "function" ? args.onClick : null);
    this.onTrailClick = ko.isObservable(args.onTrailClick) ? args.onTrailClick : ko.observable(typeof(args.onTrailClick) === "function" ? args.onTrailClick : null);
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
    const click = this.onClick();
    if (typeof (click) !== "function") {
        console.debug("Chip : _onClick(): Callback for the 'click' event is not defined.");
        return;
    }

    click(this);
};


/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
Chip.prototype._onMdcComponentTrailingIconInteraction = function(vm, e) {
    e.stopPropagation();

    // Check for the supplied callback function
    const click = this.onTrailClick();
    if (typeof (click) !== "function") {
        console.debug("Chip : _onMdcComponentTrailingIconInteraction(): Callback for the 'trailclick' event is not defined.");
        return;
    }

    click(this);
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