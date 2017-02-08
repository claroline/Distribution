// Outputs JSON data for all translation units suitable for weblate import.
// See https://docs.weblate.org/en/latest/admin/management.html#import-json
//
// Note: core-platform component must be created beforehand.

const glob = require('glob')
const path = require('path')

const packageDir = `${__dirname}/../../../..`

glob(`${packageDir}/*/*/Resources/translations/*.en.json`, (er, files) => {
  const components = []

  files.forEach(file => {
    const parsed = path.parse(file)
    const type = parsed.dir.split('/').slice(0, -3).pop()
    const bundle = parsed.dir.split('/').slice(0, -2).pop()
    const domain = parsed.name.split('.')[0]
    const componentName = `${bundle}-${domain}`

    if (componentName !== 'core-platform') {
      components.push({
        name: `${bundle}-${domain}`,
        repository_url: `weblate://project/core-platform`,
        vcs: 'github',
        branch: 'translations',
        file_format: 'json',
        filemask: `${type}/${bundle}/${domain}.*.json`,
        template: `${type}/${bundle}/${domain}.en.json`
      })
    }
  })

  console.log(JSON.stringify(components, null, 2))
})
