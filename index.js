'use strict'

const {BaseKonnector} = require('cozy-konnector-libs')

module.exports = new BaseKonnector(fields => {
  process.argv.push('fetch')
  process.argv.push(fields.nb)
  require('./cmd/feeds')
})
