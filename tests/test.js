var Manager = require('../')
var Dat = require('dat')
var path = require('path')
var memdb = require('memdb')
var test = require('tape')

var location = path.join(__dirname, 'manager_test')

test('basic manager config options', function (t) {
  var manager = Manager()
  manager.list(function (err, data) {
    t.ifError(err)
    t.equal(data.length, 0, 'no data')
    manager.close()
    t.end()
  })
})

test('manager start and stop', function (t) {
  var manager = Manager({
    location: location,
    datdb: memdb(),
    db: memdb({ valueEncoding: 'json' })
  })
  var db = Dat()
  db.addFiles(path.join(__dirname, 'fixtures'), function (err, link) {
    t.ifError(err)
    db.joinTcpSwarm(link, function (err) {
      t.ifError(err)
      manager.start('mydat', {link: link}, function (err, stats) {
        t.ifError(err)
        manager.list(function (err, data) {
          t.ifError(err)
          t.same(data[0].key, 'mydat')
          t.same(data[0].value.state, 'active')
          manager.close(function () {
            db.close()
            t.end()
          })
        })
      })
    })
  })
})
