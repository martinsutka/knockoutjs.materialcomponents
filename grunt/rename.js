module.exports = (grunt) => {
    //#region [ Configuration ]

    grunt.config("rename", {
        dependencies: {
            files: [
                { src: ["wwwroot/js/libs/knockout-latest.js"], dest: "wwwroot/js/libs/knockout.min.js" }
            ]
        }
    });

    //#endregion


    //#region [ Tasks ]

    grunt.loadNpmTasks("grunt-rename-util");

    //#endregion
};