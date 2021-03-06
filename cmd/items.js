require('console.table')
const items = require('../models/items')

const command = process.argv[2]

let run = null

if (command === 'list') {
  run = items.list()
    .then(result => {
      const output = result.map(item => {
        return {
          title: item.title,
          date: item.date
        }
      })
      console.table(output)
      console.log(`Found ${output.length} items`)
    })
}

if (command === 'debug') {
  run = items.list()
    .then(result => {
      console.log(result)
    })
}

if (command === 'clear') {
  run = items.clear()
    .then(() => {
      console.log('Items database is cleared')
    })
}

if (run == null) {
  run = Promise.reject(new Error('Found no corresponding command'))
}

run
.catch(err => {
  console.log(err)

  console.log(`Here is the list of available commands:

      list : get the list of feeds in db
      clear : clear the list of feeds
      `)
})
