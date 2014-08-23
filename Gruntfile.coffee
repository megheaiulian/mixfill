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

console.warn powerset([1,2,3])
module.exports = (grunt)=>
	shims = grunt.file.expand {cwd:'src/fills'},"*.js"
	shims = shims.map (file)->file.replace(".js",'')
	console.warn powerset(shims)
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
				dest: 'lib/index.js'
				src:[]            
				options:
					alias: ['src/index.js:mixfill']
		uglify:
			shims:
				files:[
					cwd:'src/fills'
					expand:true
					src:["*.js"]
					dest:'lib/fills/'
				]
			src:
				files:
					"lib/index.js":['lib/index.js']
				
	)
	grunt.registerTask 'default',['browserify']
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks "grunt-browserify"