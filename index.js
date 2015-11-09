var
  _ = require('underscore'),
  format = require('sqlstring').format,
  escapeId = require('sqlstring').escapeId,
  set = require('db3-set'),
  where = require('db3-where'),
  orderBy = require('db3-order-by')

var app = module.exports = {
  set: set,
  where: where,
  orderBy: orderBy,
  stringify: function (d, value) {
    if (_.isString(d))
      return format(d, value)
    if (_.isFunction(app.stringify[d.name]))
      return app.stringify[d.name](d)
    return String(d)
  }
}

_.extend(app.stringify, {
  createTable: function (d) {
    if (d.like)
      return format('create table ?? like ??', [d.table, d.like])
    if (!_.size(d.field))
      d.field = ['id', 'name']
    d.field = _.map(d.field, function (field) {
      var type = 'text'
      if (field == 'id')
        type = 'bigint primary key auto_increment'
      if (field.match(/Id$/))
        type = 'bigint'
      return escapeId(field) + ' ' + type
    }).join(', ')
    return 'create table ' + escapeId(d.table) + ' (' + d.field + ')'
  },
  dropTable: function (d) {
    return format('drop table ??', d.table)
  },
  truncateTable: function (d) {
    return format('truncate table ??', d.table)
  },
  renameTable: function (d) {
    return format('rename table ?? to ??', [d.table, d.to])
  },
  alterTable: function (d) {
    return format('alter table ?? drop ??', [d.table, d.drop])
  },
  insert: function (d) {
    if (d.select)
      return 'insert ' + escapeId(d.table) + ' ' + app.stringify.select(d.select)
    if (!_.size(d.set))
      d = {id: null}
    var query = 'insert ' + escapeId(d.table) + ' set ' + set.query(d.set)
    if (d.update)
      query += ' on duplicate key update ' + set.query(d.update)
    return query
  },
  update: function (d) {
    return format('update ?? set ', d.table) + set.query(d.set) + ' where ' + where.query(d.where)
  },
  delete: function (d) {
    return 'delete from ' + escapeId(d.table) + ' where ' + where.query(d.where)
  },
  select: function (d) {
    if (_.isString(d))
      d = {table: d}
    d.field = d.field || '*'
    if (_.isString(d.field))
      d.field = [d.field]
    d.field = _.map(d.field, function (d) {
      if (d != '*')
        return escapeId(d)
      return d
    }).join(', ')
    var query = 'select ' + d.field + ' from ' + escapeId(d.table)
    d.where = where.query(d.where)
    if (d.where)
      query += ' where ' + d.where
    d.orderBy = orderBy.query(d.orderBy)
    if (d.orderBy)
      query += ' order by ' + d.orderBy
    if (d.limit)
      query += ' limit ' + +d.limit
    return query
  }
})
