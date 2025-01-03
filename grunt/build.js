﻿module.exports = (grunt) => {
    //#region [ Registration ]

    grunt.registerTask("build", build);
    grunt.registerTask("clean", clean);
    grunt.registerTask("patchversion", patchversion);

    //#endregion


    //#region [ Tasks ]

    /**
     * Build task.
     *
     * @param {string} configuration Build konfigurácia.
     */
    function build(configuration) {
        const name = grunt.config("package").name;
        const version = grunt.config("package").version;
        const config = configuration.toUpperCase();

        grunt.log.writeln(`Building ${name} v${version} ${config}`);
        //grunt.config("configuration", "release");

        // List of tasks
        const tasks = [
            "clean:wwwroot",
            "copy:dependencies",
            "rename:dependencies",
            "jshint",
            "less",
            "cssmin",
            "concat:components"
        ];

        // Set up dynamic parameters
        switch (config) {
            case "DEBUG":
                break;
            case "RELEASE":
                //grunt.config("jshint.options.debug", false);

                tasks.push("uglify:release");
                break;
            default:
                grunt.fail.fatal(`Unknown build configuration '${configuration.toUpperCase()}'.`);
                break;
        }

        // Run tasks
        grunt.task.run.apply(grunt.task, tasks);
    }


    /**
     * Clean task.
     */
    function clean() {
        grunt.log.writeln("Cleaning");

        // List of tasks
        const tasks = [
            "clean:wwwroot"
        ];

        // Run tasks
        grunt.task.run.apply(grunt.task, tasks);
    }  


    /**
     * Patch version task.
     */
    function patchversion() {
        grunt.log.writeln("Patching version");

        // List of tasks
        const tasks = [
            "version:project:patch"
        ];

        // Run tasks
        grunt.task.run.apply(grunt.task, tasks);
    } 

    //#endregion
};