module.exports = (grunt) => {
    //#region [ Configuration ]

    grunt.config("jshint", {
        options: {
            debug: true,
            esversion: 6,
            globals: {
                define: true,
                require: true
            }
        },
        src: [
            "gruntfile.js",
            "grunt/**/*.js",
            "js/**/*.js",
            "!js/libs/*.js"
        ]
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-contrib-jshint");

    //#endregion
};