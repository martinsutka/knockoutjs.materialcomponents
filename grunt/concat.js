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
                "js/utils/throttle.js",
                "js/utils/register.js",
                "js/icon.js",
                "js/circularprogress.js",
                "js/linearprogress.js",
                "js/tooltip.js",
                "js/richtooltip.js",
                "js/iconbutton.js",
                "js/button.js",
                "js/fab.js",
                "js/switch.js",
                "js/chip.js",
                "js/slider.js",
                "js/rangeslider.js",
                "js/tab.js",
                "js/tabbar.js",
                "js/checkbox.js",
                "js/radio.js"
            ],
            dest: "wwwroot/js/knockoutjs.materialcomponents.js"
        }
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-concat");

    //#endregion
};