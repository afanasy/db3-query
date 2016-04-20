var
  _ = require('underscore'),
  expect = require('expect.js'),
  s = require('./').stringify

var query = {
  'create table `person` (`id` bigint primary key auto_increment, `name` text)': {name: 'createTable', table: 'person'},
  'drop table `person`': {name: 'dropTable', table: 'person'},
  'truncate table `person`': {name: 'truncateTable', table: 'person'},
  'rename table `person` to `nosrep`': {name: 'renameTable', table: 'person', to: 'nosrep'},
  'alter table `person` drop `name`': {name: 'alterTable', table: 'person', drop: 'name'},
  'insert `person` select * from `nosrep`': {name: 'insert', table: 'person', select: 'nosrep'},
  'insert `person` set `id` = 1, `name` = \'Bob\'': {name: 'insert', table: 'person', set: {id: 1, name: 'Bob'}},
  'insert `person` set `name` = \'Bob\' on duplicate key update `name` = \'Alice\'': {name: 'insert', table: 'person', set: {name: 'Bob'}, update: {name: 'Alice'}},
  'update `person` set `name` = \'Alice\' where `id` = 1': {name: 'update', table: 'person', set: {name: 'Alice'}, where: 1},
  'update `person` set `name` = \'Alice\' where `name` = \'Bob\'': {name: 'update', table: 'person', set: {name: 'Alice'}, where: {name: 'Bob'}},
  'delete from `person` where `id` = 1': {name: 'delete', table: 'person', where: 1},
  'delete from `person` where `name` = \'Alice\'': {name: 'delete', table: 'person', where: {name: 'Alice'}}
}

describe('#queryString', function () {
  describe('#stringify', function () {
    _.each(query, function (value, key) {
      it('does ' + value.name, function () {
        expect(s(value)).to.be.equal(key)
      })
    })
    it('does nothing with string query', function () {
      expect(s('?')).to.be.equal('?')
    })
    it('replaces placeholders in string query when there are 2 arguments', function () {
      expect(s('?', 'a')).to.be.equal("'a'")
    })
    it('accepts number as table name', function () {
      expect(s({name: 'dropTable', table: 0})).to.be.equal('drop table `0`')
    })
    it('accepts number as field name', function () {
      expect(s({name: 'select', table: 'person', field: 0})).to.be.equal('select `0` from `person`')
    })
  })
})
