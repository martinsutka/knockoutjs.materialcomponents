//#region [ Constructor ]

/**
 * Creates instance of the tab component.
 * 
 * @param {object} args Arguments. 
 */
const Tab = function(args) {
    console.debug("Tab()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_tab_" + utils.guid());
    this.text = ko.isObservable(args.text) ? args.text : ko.observable(args.text || "");
    this.icon = ko.isObservable(args.icon) ? args.icon : ko.observable(args.icon || "");
    this.indicator = ko.isObservable(args.indicator) ? args.indicator : ko.observable(args.indicator || Tab.INDICATOR.default);
    this.isActive = ko.isObservable(args.isActive) ? args.isActive : ko.observable(typeof(args.isActive) === "boolean" ? args.isActive : false);
    this.isStacked = ko.isObservable(args.isStacked) ? args.isStacked : ko.observable(typeof(args.isStacked) === "boolean" ? args.isStacked : false);
    this.isMinWidth = ko.isObservable(args.isMinWidth) ? args.isMinWidth : ko.observable(typeof(args.isMinWidth) === "boolean" ? args.isMinWidth : false);
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");

    if (ko.isObservableArray(args.tabs)) {
        args.tabs.push(this);
    }

    this.onClick = ko.isObservable(args.onClick) ? args.onClick : ko.observable(typeof(args.onClick) === "function" ? args.onClick : null);
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
Tab.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.tab.MDCTab(root);
    this.mdcComponent.listen("MDCTab:interacted", utils.throttle(this._onMdcComponentInteracted.bind(this), 100));
};


/**
 * Dispose.
 */
Tab.prototype.dispose = function () {
    console.log("~Tab()");

    this.mdcComponent.destroy();
};

//#endregion


//#region [ Event Handlers ]

/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
Tab.prototype._onMdcComponentInteracted = function(e) {
    // Check for the supplied callback function
    const click = this.onClick();
    if (typeof (click) !== "function") {
        console.debug("Tab : _onClick(): Callback for the 'click' event is not defined.");
        return;
    }

    click(this);
};

//#endregion


//#region [ Enums ]

/**
 * Tab indicator.
 */
Tab.INDICATOR = {
    default: 0,
    onlyContent: 1
};

//#endregion


//#region [ Template ]

Tab.template =
`<button class="mdc-tab" role="tab"
         data-bind="css: {
                        'mdc-tab--active': isActive(),
                        'mdc-tab--stacked': isStacked(),
                        'mdc-tab--min-width': isMinWidth()
                    }, 
                    attr: { 
                        id: id, 
                        'aria-selected': isActive() ? true : false 
                    },
                    class: classes">
    <span class="mdc-tab__content">
        <i class="mdc-tab__icon material-icons" aria-hidden="true"
           data-bind="text: icon, visible: icon().length"></i>
        <span class="mdc-tab__text-label" data-bind="text: text"></span>
        <!-- ko if: indicator() === ${Tab.INDICATOR.onlyContent} -->
        <span class="mdc-tab-indicator",
              data-bind="css: { 'mdc-tab-indicator--active': isActive() }">
            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
        </span>
        <!-- /ko -->        
    </span>
    <!-- ko if: indicator() === ${Tab.INDICATOR.default} -->
    <span class="mdc-tab-indicator",
          data-bind="css: { 'mdc-tab-indicator--active': isActive() }">
        <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
    </span>
    <!-- /ko -->
    <span class="mdc-tab__ripple"></span>
    <div class="mdc-tab__focus-ring"></div>
</button>`;

//#endregion


//#region [ Registration ]

utils.register("mat-tab", Tab);

//#endregion