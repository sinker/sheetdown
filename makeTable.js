var request = require('request')
var csv = require('binary-csv')
var concat = require('concat-stream')

module.exports = function makeTable(KEY, callback) {
  var base = 'https://docs.google.com/spreadsheets/d/'
  var query = '/export?gid=0&amp;format=csv'
  var URL = base + KEY + query

  var csvParser = csv({json: true})

  request(URL).pipe(csvParser).pipe(concat(rows))

  function rows(data) {
    var table = '|'
    var headers = Object.keys(data[0])
    var underHeaders = ''
    headers.map(function(key) {
      table += key + '|'
      underHeaders += ' ------ |'
    })

    table += '\n|' + underHeaders + '\n'
    data.map(function(row) {
      var values = headers.map(function(h) { return row[h] })
      table += '|' + values.join('|') + '|\n'
    })
    return callback("null", table)
  }
}
