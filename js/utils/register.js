/**
 * Registers the input Model as knockout component.
 *
 * @param {string} name Component name.
 * @param {function} Model Component constructor.
 */
utils.register = function (name, Model) {
    register[Model.name] = Model;
    ko.components.register(name, {
        template: Model.template,
        viewModel: { 
            createViewModel: (params, componentInfo) => {
                params = params || {};
                params.element = componentInfo.element.querySelector ? componentInfo.element : componentInfo.element.parentElement || componentInfo.element.parentNode;
            
                return new Model(params);
            }
        }
    });
};