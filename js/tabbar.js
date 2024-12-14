//#region [ Constructor ]

/**
 * Creates instance of the tab bar component.
 * 
 * @param {object} args Arguments. 
 */
const TabBar = function(args) {
    console.debug("TabBar()");

    this.mdcComponent = null;

    this.id = ko.isObservable(args.id) ? args.id : ko.observable(args.id || "_tab-bar_" + utils.guid());
    this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");
    this.isFocusedWhenActivate = ko.isObservable(args.isFocusedWhenActivate) ? args.isFocusedWhenActivate : ko.observable(typeof(args.isFocusedWhenActivate) === "boolean" ? args.isFocusedWhenActivate : true);
    this.isAutomaticallyActivated = ko.isObservable(args.isAutomaticallyActivated) ? args.isAutomaticallyActivated : ko.observable(typeof(args.isAutomaticallyActivated) === "boolean" ? args.isAutomaticallyActivated : true);
    this.tabs = ko.observableArray();
    this.activeTab = ko.isObservable(args.activeTab) ? args.activeTab : ko.observable(["string", "number"].includes(typeof(args.activeTab)) ? args.activeTab : null);

    this._isFocusedWhenActivateSubscribe = null;
    this._isAutomaticallyActivatedSubscribe = null;
    this._activeTabSubscribe = null;
};

//#endregion


//#region [ Methods : Public ]

/**
 * Direct method to receive a descendantsComplete notification.
 * Knockout will call it with the component’s node once all descendants are bound.
 * 
 * @param {element} node Html element. 
 */
TabBar.prototype.koDescendantsComplete = function (node) {
    // Replace custom element placehoder
    const root = node.firstElementChild;
    node.replaceWith(root);

    this.mdcComponent = new mdc.tabBar.MDCTabBar(root);
    this.mdcComponent.listen("MDCTabBar:activated", this._onMdcComponentActivated.bind(this));

    this._isFocusedWhenActivateSubscribe = this.isFocusedWhenActivate.subscribe(this._isFocusedWhenActivateChanged, this);
    this._isAutomaticallyActivatedSubscribe = this.isAutomaticallyActivated.subscribe(this._isAutomaticallyActivatedChanged, this);
    this._activeTabSubscribe = this.activeTab.subscribe(this._activeTabChanged, this);

    this.isFocusedWhenActivate.valueHasMutated();
    this.isAutomaticallyActivated.valueHasMutated();
    this.activeTab.valueHasMutated();
};


/**
 * Dispose.
 */
TabBar.prototype.dispose = function () {
    console.log("~TabBar()");

    this._isFocusedWhenActivateSubscribe.dispose();
    this._isAutomaticallyActivatedSubscribe.dispose();
    this._activeTabSubscribe.dispose();
    this.mdcComponent.destroy();
};

//#endregion


//#endregion [ Event Handlers ]

/**
 * Handles click/tap/enter event.
 * 
 * @param {object} e Event arguments. 
 */
TabBar.prototype._onMdcComponentActivated = function(e) {
    this.tabs().forEach((tab, index) => tab.isActive(index === e.detail.index));
};


/**
 * Handles the isFocusedWhenActivate property change event.
 * 
 * @param {number} value Whether tabs focus themselves when activated.
 **/
TabBar.prototype._isFocusedWhenActivateChanged = function (value) {
    this.mdcComponent.focusOnActivate = value;
};


/**
 * Handles the isAutomaticallyActivated property change event.
 * 
 * @param {number} value Automatic (true) activates as soon as a tab is focused with arrow keys; manual (false) activates only when the user presses space/enter.
 **/
TabBar.prototype._isAutomaticallyActivatedChanged = function (value) {
    this.mdcComponent.useAutomaticActivation = value;
};


/**
 * Handles the activeTab property change event.
 * 
 * @param {number} value Index or Id of the tab which should be activated.
 **/
TabBar.prototype._activeTabChanged = function (value) {
    if(value === null) {
        this.tabs().forEach((tab) => tab.isActive(false));
        return;
    }

    // Store the index of the tab
    let index = value;

    // Activate by id
    if (typeof(value) === "string") {
        index = this.tabs().findIndex((tab) => tab.id() === value);
    }

    // Activate by index
    if ((typeof(index) === "number") && (index >= 0)) {
        this._activeTabSubscribe.dispose();
        this.mdcComponent.activateTab(index);
        this._activeTabSubscribe = this.activeTab.subscribe(this._activeTabChanged, this);
        return;
    }
};

//#endregion


//#region [ Template ]

TabBar.template =
`<div class="mdc-tab-bar" role="tablist"
    data-bind="attr: { id: id }, class: classes">
    <div class="mdc-tab-scroller">
        <div class="mdc-tab-scroller__scroll-area">
            <div class="mdc-tab-scroller__scroll-content"
                 data-bind="template: { nodes: $componentTemplateNodes, data: { tabs: tabs } }">
            </div>
        </div>
    </div>
</div>`;

//#endregion


//#region [ Registration ]

utils.register("mat-tab-bar", TabBar);

//#endregion