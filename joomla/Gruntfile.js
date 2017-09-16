module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        joomlaindexer: {
            your_target: ['administrator', 'components', 'language', 'modules', 'plugins', 'templates'],
            options: {
                filename: 'index.html',
                content: '<!DOCTYPE html><title></title>\n'
            }
        },
        joomla_packager: {
            options: {
                  'joomla': '.', 
                  'dest': './' + '<%= paths.package %>'       
                },
            extension: {
                options: {
                  'name': '<%= ext.name %>',
                  'type': '<%= ext.type %>',
                  'packageName': '<%= ext.packageName %>'
                }
            }
        },
        
    });

    grunt.loadNpmTasks('grunt-joomla-packager');
    grunt.loadNpmTasks('grunt-joomlaindexer');

    // load path from separate json file that is not synced with git
    grunt.config.set('paths', grunt.file.readJSON('paths.json'));
    // --> ext.json => e.g.
    // {
    //     "joomla": "D:\\xampp\\htdocs\\handball\\hb_joomla3\\",
    //     "package": "zzz_packages/"
    // }


    grunt.registerTask('default', ['joomlaindexer']);

    grunt.registerTask('package', 'Package Joomla extension', function(ext) {
        
        if (ext === undefined) {
            grunt.warn('Extension must be specified, like build:com_contact.');
        }
        // grunt.log.writeln('Build extension: ' + ext);
        if (/^(com|plg|lib|mod|tpl|lan)_.+?/.test(ext)) {
            
            var regMatch = ext.match(/^(com|plg|lib|mod|tpl|lan)_(.+)$/);

            var types = {
                'com':  'component',
                'plg':  'plugin',    
                'files':'files',     
                'lib':  'library',   
                'pkg':  'package',   
                'mod':  'module',    
                'tpl':  'template',  
                'lan':  'language',  
            };  
            var type = types[regMatch[1]]; 
            var name = regMatch[2];   

            grunt.log.writeln('Build extension: ' + ext + ' (type: ' + type + ', name: ' + name + ')');
            grunt.config.set('ext', {'packageName': ext, 'type': type, 'name': name });

            grunt.task.run('joomla_packager:extension');
        } else {
            grunt.warn(ext + ' is no Joomla! extension');
        }
        
    });

    // build package in MyJoomlaExtensions
    grunt.registerTask('build', 'Build Joomla extension', function(ext, build) {
        if (build === undefined) {
            grunt.log.writeln('Building patch (build:patch)');
            build = 'patch';
        }
        grunt.log.writeln('Build extension: ' + ext);

        grunt.task.run('package:' + ext);
        grunt.task.run('run-grunt:' + ext + ':' + build);
    });

    // run grunt file in extensions folder
    grunt.registerTask('run-grunt', 'Run grunt in Joomla extensions folder', function(ext, build) {
        
        grunt.log.writeln('Call run-grunt from local joomla (' + ext + ',' + build + ')');

        var paths = require('./paths.json');
        // console.log(paths);

        var cb = this.async();
        
        var child = grunt.util.spawn({
            grunt: true,
            args: ['build:' + build],
            opts: {
                cwd: paths.extensions + ext + '/Source/'
                }
        }, function(error, result, code) {
          cb();
        });

        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    });

};
