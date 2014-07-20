util = require 'util'
module.exports = (grunt)=>
	aliasify = (aliases)->
		aliasArray = [];
		aliases = if util.isArray(aliases) then aliases else [aliases];
		aliases.forEach (alias)->
			grunt.file.expandMapping(alias.src, alias.dest, {cwd: alias.cwd}).forEach (file)->
				expose = file.dest.substr(0, file.dest.lastIndexOf('.'));
				aliasArray.push('./' + file.src[0] + ':' + expose);
		return aliasArray;

	grunt.initConfig(
		pkg: grunt.file.readJSON 'package.json'
		browserify:
			source:
				dest: 'public/index.js'
				src:[]            
				options:
					alias: ['src/index.js:mixfill']
		uglify:
			shims:
				files:[
					cwd:'server/polyfills'
					expand:true
					src:["*.js"]
					dest:'server/min/'
				]
				
	)
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks "grunt-browserify"