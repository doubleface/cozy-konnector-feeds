const {cozyClient, log} = require('cozy-konnector-libs')
const bb = require('bluebird')

class Items {
  clear () {
    // get all the items and delete them 1 by one
    return this.list()
      .then(list => {
        log('info', `Clearing ${list.length} items`)
        bb.each(list, doc => cozyClient.data.delete('io.cozy.feeditems', doc))
      })
  }

  // expected :
  // feedid as String
  // list as array of {title, link, date, image, enclosures, meta}
  add (feedId, list) {
    log('info', `Adding ${list.length} items to ${feedId}`)
    let updatedCount = 0

    return this.list(feedId)
    // create an object indexed by link
    .then(list => {
      return list.reduce((memo, doc) => {
        memo[doc.link] = doc
        return memo
      }, {})
    })
    // filter out already indexed items
    .then(indexedList => {
      return list.filter(doc => indexedList[doc.link] === undefined)
    })
    // only add new items in database
    .then(filteredList => {
      log('debug', `Finally adding ${filteredList} to ${feedId}`)
      return bb.each(filteredList, item => {
        item.feed_id = feedId
        return cozyClient.data.create('io.cozy.feeditems', item)
          .then(() => updatedCount++)
      })
    })
    .then(() => updatedCount)
  }

  list (feedId) {
    return cozyClient.data.defineIndex('io.cozy.feeditems', ['feed_id'])
    .then(index => {
      let selector
      if (feedId) selector = {feed_id: feedId} // items from a specific feed
      else selector = {feed_id: {'$gt': ''}} // all items

      return cozyClient.data.query(index, {selector, limit: 10000})
    })
  }

  getNbDocs () {
    return cozyClient.data.defineIndex('io.cozy.feeditems', ['_id'])
    .then(index => cozyClient.data.query(index, {selector: {_id: {'$gt': ''}}, limit: 10000}))
    .then(list => list.length)
  }
}

const items = new Items()
module.exports = items
