module.exports = (grunt) => {
    //#region [ Configuration ]

    grunt.config("less", {
        options: {
            paths: ["less"],
            strictMath: false,
            customFunctions: {
                rem: (less, fontsize) => {
                    if (less.functions.functionRegistry.get("ispixel")) {
                        return fontsize.value / 16 + "rem";
                    }
                }
            }
        },
        src: {
            files: {
                "wwwroot/css/index.css": "less/index.less",
                "wwwroot/css/knockoutjs.materialcomponents.css": "less/knockoutjs.materialcomponents.less"
            }
        }
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-less");

    //#endregion
};