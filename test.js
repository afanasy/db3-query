var _ = require('underscore')
var assert = require('assert')
var s = require('./').stringify

var query = {
  'create table `person` (`id` bigint primary key auto_increment, `name` text)': {name: 'createTable', table: 'person'},
  'drop table `person`': {name: 'dropTable', table: 'person'},
  'drop table `0`': {name: 'dropTable', table: 0},
  'truncate table `person`': {name: 'truncateTable', table: 'person'},
  'rename table `person` to `nosrep`': {name: 'renameTable', table: 'person', to: 'nosrep'},
  'alter table `person` drop `name`': {name: 'alterTable', table: 'person', drop: 'name'},
  'insert `person` set `id` = NULL': {name: 'insert', table: 'person'}, 
  'insert `person` select * from `nosrep`': {name: 'insert', table: 'person', select: 'nosrep'},
  'insert `person` set `id` = 1, `name` = \'Bob\'': {name: 'insert', table: 'person', set: {id: 1, name: 'Bob'}},
  'insert `person` set `name` = \'Bob\' on duplicate key update `name` = \'Alice\'': {name: 'insert', table: 'person', set: {name: 'Bob'}, update: {name: 'Alice'}},
  'insert `person` (`id`, `name`) values (1, \'Bob\'), (2, \'Alice\'), (3, NULL)': {name: 'insert', table: 'person', set: [
    {id: 1, name: 'Bob'},
    {id: 2, name: 'Alice'},
    {id: 3, name: null}
  ]},
  'update `person` set `name` = \'Alice\' where `id` = 1': {name: 'update', table: 'person', set: {name: 'Alice'}, where: 1},
  'update `person` set `name` = \'Alice\' where `name` = \'Bob\'': {name: 'update', table: 'person', set: {name: 'Alice'}, where: {name: 'Bob'}},
  'delete from `person` where `id` = 1': {name: 'delete', table: 'person', where: 1},
  'delete from `person` where `name` = \'Alice\'': {name: 'delete', table: 'person', where: {name: 'Alice'}},
  'select `0` from `person`': {name: 'select', table: 'person', field: 0},
  'select count(`id`) as count from `person` where `name` = \'Bob\'': {name: 'groupBy', func: 'count', table: 'person', where: {name: 'Bob'}}
}

describe('#queryString', function () {
  describe('#stringify', function () {
    _.each(query, function (value, key) {
      it('does ' + value.name, function () {
        assert.equal(s(value), key)
      })
    })
    it('does nothing with string query', function () {
      assert.equal(s('?'), '?')
    })
    it('replaces placeholders in string query when there are 2 arguments', function () {
      assert.equal(s('?', 'a'), "'a'")
    })
  })
})
