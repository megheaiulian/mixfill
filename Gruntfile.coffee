util = require 'util'

powerset = (input)=>
	reducer = Array.prototype.reduce;
	fn1 = (powerset,item)->
		next = [item]
		fn2 = (powerset,item)->
			powerset.push item.concat(next)
			powerset
		powerset.reduce fn2,powerset
	reducer.call input, fn1, [[]]

module.exports = (grunt)=>
	shims = grunt.file.expand {cwd:'src/fills'},"*.js"
	shims = powerset(shims).slice(1);
	shims = shims.map (files)=>
		{
			dest: 'public/shims/'+files.map((file)->file.replace('.js','')).join('-')+".js"
			src: files.map (file)->"src/fills/#{file}"
		}

	grunt.initConfig(
		pkg: grunt.file.readJSON 'package.json'
		browserify:
			source:
				dest: 'lib/index.js'
				src:[]            
				options:
					alias: ['src/index.js:mixfill']
		uglify:
			fills:
				files:[
					cwd:'src/fills'
					expand:true
					src:["*.js"]
					dest:'lib/fills/'
				]
			all:
				files:shims
			src:
				files:
					"lib/index.js":['lib/index.js']
		concat:
			fills:
				files:[
					cwd 	: "src/fills"
					expand 	: true
					src 	: ['*.js']
					dest 	: 'lib/fills'
				]
			all:
				options:
					separator:';'
				files:shims
	)

	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks "grunt-browserify"
	grunt.loadNpmTasks 'grunt-contrib-concat'

	grunt.registerTask 'build', ['browserify','concat']
	grunt.registerTask 'release',['build','uglify']
	grunt.registerTask 'default',['build']