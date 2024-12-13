//#region [ Constructor ]

/**
 * Creates instance of the range slider component.
 * 
 * @param {object} args Arguments. 
 */
const RangeSlider = function(args) {
    console.debug("RangeSlider()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_rangeslider_" + utils.guid());
    this.name = ko.isObservable(args.name) ? args.name : ko.observable(args.name || "");
    this.minRange = ko.isObservable(args.minRange) ? args.minRange : ko.observable(typeof(args.minRange) === "number" ? args.minRange : 10);
    this.min = ko.isObservable(args.min) ? args.min : ko.observable(typeof(args.min) === "object" ? args.min : { start: 0, end: 100 });
    this.max = ko.isObservable(args.max) ? args.max : ko.observable(typeof(args.max) === "object" ? args.max : { start: 0, end: 100 });
    this.value = ko.isObservable(args.value) ? args.value : ko.observable(args.value instanceof Array ? args.value : [0, 0]);
    this.isEnabled = ko.isObservable(args.isEnabled) ? args.isEnabled : ko.observable(typeof(args.isEnabled) === "boolean" ? args.isEnabled : true);
    this.isDiscrete = ko.isObservable(args.isDiscrete) ? args.isDiscrete : ko.observable(typeof(args.isDiscrete) === "boolean" ? args.isDiscrete : false);
    this.showTickMarks = ko.isObservable(args.showTickMarks) ? args.showTickMarks : ko.observable(typeof(args.showTickMarks) === "boolean" ? args.showTickMarks : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    this._valueChangedSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
RangeSlider.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.slider.MDCSlider(root);
    this.mdcComponent.listen("MDCSlider:change", this._onMdcComponentChange.bind(this));

    this._valueChangedSubscribe = this.value.subscribe(this._valueChanged, this);

    this.value.valueHasMutated();
};


/**
 * Dispose.
 */
RangeSlider.prototype.dispose = function () {
    console.log("~RangeSlider()");

    this._valueChangedSubscribe.dispose();
    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles the isIndeterminate property change event.
 * 
 * @param {boolean} value If set to true, the checkbox is indeterminate.
 **/
RangeSlider.prototype._valueChanged = function (value) {
    this.mdcComponent.setValueStart(value[0]);
    this.mdcComponent.setValue(value[1]);
};


/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
RangeSlider.prototype._onMdcComponentChange = function(e) {
    this._valueChangedSubscribe.dispose();
    const val = this.value();
    val[e.detail.thumb === 1 ? 0 : 1] = e.detail.value;
    this.value(val);
    this._valueChangedSubscribe = this.value.subscribe(this._valueChanged, this);
};


//#endregion


//#region [ Template ]

RangeSlider.template =
`<div class="mdc-slider mdc-slider--range"
      data-bind="css: {
        'mdc-slider--disabled': !isEnabled(),
        'mdc-slider--discrete': isDiscrete,
        'mdc-slider--tick-marks': isDiscrete() && showTickMarks()
    }, attr: { id: id, 'data-min-range': minRange }, class: classes">
    <div class="mdc-slider__track">
        <div class="mdc-slider__track--inactive"></div>
        <div class="mdc-slider__track--active">
            <div class="mdc-slider__track--active_fill"></div>
        </div>
        <!-- ko if: isDiscrete() && showTickMarks() -->
        <div class="mdc-slider__tick-marks" data-bind="foreach: Array.from({length: max() - min()}, (_, i) => i + 1)">
            <div class="mdc-slider__tick-mark--active"></div>
        </div>
        <!-- /ko -->
    </div>
    <div class="mdc-slider__thumb">
        <!-- ko if: isDiscrete -->
        <div class="mdc-slider__value-indicator-container" aria-hidden="true">
            <div class="mdc-slider__value-indicator">
                <span class="mdc-slider__value-indicator-text"></span>
            </div>
        </div>
        <!-- /ko -->
        <div class="mdc-slider__thumb-knob"></div>
        <input class="mdc-slider__input" type="range"
               data-bind="attr: { id: id() + '_input-start', name: 'rangeStart', enable: isEnabled, min: min().start, max: max().start, value: value()[0] }" />
    </div>
    <div class="mdc-slider__thumb">
        <!-- ko if: isDiscrete -->
        <div class="mdc-slider__value-indicator-container" aria-hidden="true">
            <div class="mdc-slider__value-indicator">
                <span class="mdc-slider__value-indicator-text"></span>
            </div>
        </div>
        <!-- /ko -->
        <div class="mdc-slider__thumb-knob"></div>
        <input class="mdc-slider__input" type="range"
               data-bind="attr: { id: id() + '_input-end', name: 'rangeEnd', enable: isEnabled, min: min().end, max: max().end, value: value()[1] }" />
    </div>    
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-range-slider", RangeSlider);

//#endregion