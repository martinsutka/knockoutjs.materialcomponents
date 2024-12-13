module.exports = (grunt) => {
    //#region [ Configuration ]

    grunt.config("concat", {
        components: {
            options: {
                separator: "\n\n\n",
                banner: "/*!\n * <%= package.name %> v<%= package.version %>\n" +
                        " * <%= grunt.template.today('yyyy-mm-dd') %>\n" +
                        " */\n\n" +
                        "(function (root, factory) {\n" +
                        "    if (typeof define === 'function' && define.amd) {\n" +
                        "        define('knockoutjs.materialcomponents', ['knockout', 'material-components-web'], factory);\n" +
                        "    }\n" +
                        "    else {\n" +
                        "        factory(root.ko, root.mdc);\n" +
                        "    }\n" +
                        "}(typeof self !== 'undefined' ? self : this, (ko, mdc) => {\n",
                footer: "\n}));"
            },
            src: [
                "js/utils/global.js",
                "js/utils/guid.js",
                "js/utils/throttle.js"
                // "js/icon.js",
                // "js/tooltip.js",
                // "js/rich-tooltip.js",
                // "js/linear-progress.js",
                // "js/circular-progress.js",
                // "js/button.js",
                // "js/icon-button.js",
                // "js/fab.js",
                // "js/chip.js",
                // "js/switch.js",
                // "js/checkbox.js",
                // "js/radio.js",
                // "js/slider.js",
                // "js/range-slider.js",
                // "js/tab.js",
                // "js/tab-bar.js"
            ],
            dest: "wwwroot/js/knockoutjs.materialcomponents.js"
        }
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-concat");

    //#endregion
};