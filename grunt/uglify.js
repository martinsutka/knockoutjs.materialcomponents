module.exports = (grunt) => {
    //#region [ Configuration ]

    grunt.config("uglify", {
        release: {
            options: {
                sourceMap: false
            },
            files: {
                "wwwroot/js/knockoutjs.materialcomponents.min.js": [
                    "wwwroot/js/knockoutjs.materialcomponents.js"
                ]
            }
        }
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-uglify");

    //#endregion
};