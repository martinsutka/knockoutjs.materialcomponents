module.exports = (grunt) => {
    //#region [ Configuration ]

    grunt.config("copy", {
        dependencies: {
            files: [{
                expand: true,
                flatten: true,
                cwd: "node_modules/",
                src: [
                    "material-components-web/dist/material-components-web.min.js",
                    "knockout/build/output/knockout-latest.js"
                ],
                dest: "wwwroot/js/libs/",
                filter: "isFile"
            }, {
                src: "node_modules/material-components-web/dist/material-components-web.min.css",
                dest: "wwwroot/css/material-components-web.min.css"
            }, {
                src: "js/libs/highlight.min.js",
                dest: "wwwroot/js/libs/highlight.min.js"
            }, {
                src: "js/libs/highlight.xml.min.js",
                dest: "wwwroot/js/libs/highlight.xml.min.js"
            }, {
                src: "css/highlight.min.css",
                dest: "wwwroot/css/highlight.min.css"
            }]
        }
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-copy");

    //#endregion
};