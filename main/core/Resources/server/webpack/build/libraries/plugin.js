//var path = require('path')

/*
for (var name in this.commons) {
    //careful
    this.commons[name] = this.commons[name].map(common => path.join(__dirname, '..', common))
}*/

function CommonLibPlugin(commons) {
    this.commons = commons
}

CommonLibPlugin.prototype.apply = function(compiler) {
    var commons = this.commons
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin(['optimize-chunks', 'optimize-extracted-chunks'], function(chunks) {
            var libraries = []

            chunks.forEach(chunk => {
                chunk.modules.forEach(module => {
                    var parents = getParents(commons, module)
                    if (parents.length > 0)  {
                        var library = libraries.find(library => library.module === module)

                        if (!library) {
                            library = {
                                module: module,
                                dependencies: findLibDependencies(module),
                                chunks: [chunk],
                                parents: parents
                            }

                            libraries.push(library)
                        } else {
                            library.chunks.push(chunk)
                        }
                    }
                })
            })

            Object.keys(commons).forEach(name => {
                chunk = this.addChunk(name);
                chunk.entry = true
                chunk.initial = true
                chunk.common = true
                libraries.forEach(library => {
                    library.parents.forEach(parent => {
                        if (parent === name) {
                            chunk.addModule(library.module)
                            library.dependencies.forEach(dependency => {
                                chunk.addModule(dependency)
                            })
                        }
                    })
                })
            })

            chunks.forEach(chunk => {
                if (!chunk.common) {
                    libraries.forEach(library => {
                        library.dependencies.forEach(module => chunk.removeModule(module))
                        chunk.removeModule(library.module)
                    })
                }
            });
        })
    })

}

function findLibDependencies(module, dependencies) {
    dependencies = dependencies || []
    if (!module) return dependencies;

    module.dependencies.forEach((dependency, idx) => {
        if (dependency.module) {
            if (dependencies.indexOf(dependency.module) === -1) {
                dependencies.push(dependency.module)
                findLibDependencies(dependency.module, dependencies)
            }
        }
    })

    return dependencies
}

function getParents(commons, module) {
    var parents = []

    Object.keys(commons).forEach(key => {
        commons[key].forEach(library => {
            if (library === module.resource) {
                parents.push(key)
            }
        })
    })

    return parents
}

function displayModules(modules) {
    console.error('---------------------- DISPLAY ---------------------------')
    modules.forEach(module => console.error(module.resource))
}

module.exports = CommonLibPlugin
