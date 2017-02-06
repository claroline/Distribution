// Rewrites JSON translations files with proper pretty formatting if needed.

const glob = require('glob')
const fs = require('fs')

const packageDir = `${__dirname}/../../../..`

glob(`${packageDir}/*/*/Resources/translations/*.json`, (er, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')
    const decoded = JSON.parse(content)
    const prettified = JSON.stringify(decoded, null, 2)
    fs.writeFileSync(file, prettified)
  })
})
