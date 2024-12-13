module.exports = (grunt) => {
    //#region [ Configuration ]

    grunt.config("cssmin", {
        options: {
            advanced: false
        },
        build: {
            files: [{
                expand: true,
                cwd: "wwwroot/css",
                src: [
                    "knockoutjs.materialcomponents.css"
                ],
                dest: "wwwroot/css",
                ext: ".materialcomponents.min.css"
            }]
        }
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-cssmin");

    //#endregion
};