require('console.table')
const bb = require('bluebird')
const path = require('path')
const fs = require('fs')
const feeds = require('../models/feeds')
const items = require('../models/items')
const command = process.argv[2]

let run = null

if (command === 'list') {
  run = feeds.list()
    .then(result => {
      const output = result.map(item => {
        return {
          _id: item._id,
          title: item.title,
          url: item.url
        }
      })
      console.table(output)
      console.log(`Found ${output.length} feeds`)
    })
}

if (command === 'debug') {
  run = feeds.list()
    .then(result => {
      console.log(result)
    })
}

if (command === 'errors') {
  run = feeds.list()
    .then(result => {
      const output = result.filter(item => !item.status)
      console.log(output)
      console.log(`Found ${output.length} feeds in error`)
    })
}

if (command === 'clear') {
  run = feeds.clear()
    .then(() => {
      console.log('Feeds database is cleared')
    })
}

if (command === 'init') {
  let opmlfile = path.resolve(__dirname, '..', process.argv[3])
  console.log(`Resolved OPML file path: ${opmlfile}`)
  if (!fs.existsSync(opmlfile)) run = Promise.reject(new Error('Found no OPML file for the init command'))
  else {
    const opmlstring = fs.readFileSync(opmlfile, 'utf-8')
    run = feeds.parseOpml(opmlstring)
    .then(items => feeds.add(items))
    .then(count => console.log(`Done. Number of added items : ${count}`))
    .then(() => feeds.getNbDocs())
    .then(nb => console.log(`Total number of documents : ${nb}`))
  }
}

if (command === 'fetch') {
  let count = process.argv[3] ? process.argv[3] : 5

  // get the list of feeds sorted by update date
  run = feeds.list()
  .then(list => {
    return list.map(item => {
      let d = item.updateDate
      if (d == null) d = 0
      else d = new Date(d)
      item.updateDate = d
      return item
    })
  })
  .then(list => {
    // only keep the five first updated
    // TODO the sort should also be done with a proper view request
    list.sort((a, b) => a.updateDate < b.updateDate ? -1 : 1)
    return list.splice(0, count)
  })
  .then(list => {
    // for each feed, get its items and put them in db but without duplicates
    return bb.each(list, feed => {
      console.log(`Fetching ${feed.title}...`)
      return feeds.fetch(feed.feedUrl)
      .then(feeditems => {
        return items.add(feed._id, feeditems)
          .then(() => {
            feeds.update(feed._id, {
              updateDate: new Date(),
              status: true,
              message: ''
            })
          })
      })
      .catch(err => {
        console.log(err, 'error in fetch')
        feeds.update(feed._id, {
          updateDate: new Date(),
          status: false,
          message: err.message
        })
      })
    })
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
      errors : get the list of feeds in error
      init : init the list of feeds with a given opml file ex: ./feeds init ../data/feeds.opml
      fetch : Fetch the last count updated feeds ex: ./feeds fetch 5
      clear : clear the list of feeds
      `)
})
