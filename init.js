const opml = process.argv.pop()

process.argv.pop() // remove init.js

process.argv.push('init')
process.argv.push(opml)

console.log(process.argv, 'args')

require('./cmd/feeds')
