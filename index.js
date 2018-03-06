var _ = require('underscore')
var format = require('sqlstring').format
var escape = require('sqlstring').escape
var escapeId = require('sqlstring').escapeId

var app = module.exports = {
  set: require('db3-set'),
  where: require('db3-where'),
  orderBy: require('db3-order-by'),
  stringify: function (d, value) {
    if (_.isString(d)) {
      if (!_.isUndefined(value))
        return format(d, value)
      return d
    }
    if (!_.isUndefined(d.table))
      d.table = String(d.table)
    if (_.isFunction(app.stringify[d.name]))
      return app.stringify[d.name](d)
    return String(d)
  }
}

_.extend(app.stringify, {
  createTable: function (d) {
    if (d.like)
      return format('create table ?? like ??', [d.table, d.like])
    var field = d.field
    if (!_.size(field))
      field = ['id', 'name']
    field = _.map(field, function (field) {
      var type = 'text'
      if (field == 'id')
        type = 'bigint primary key auto_increment'
      if (field.match(/Id$/))
        type = 'bigint'
      return escapeId(field) + ' ' + type
    }).join(', ')
    return 'create table ' + escapeId(d.table) + ' (' + field + ')'
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
    var query = 'insert ' + escapeId(d.table) + ' '
    if (d.select)
      return query + app.stringify.select(d.select)
    var set = d.set
    if (_.isArray(set)) {
      if (_.size(set)) {
        query += '('  + _.map(_.keys(_.first(set)), format.bind(this, '??')).join(', ') + ') values ' + _.map(set, function (value) {
          return '(' + _.map(value, format.bind(format, '?')).join(', ') + ')'
        }).join(', ')
      }
    }
    else {
      if (!_.size(set))
        set = {id: null}
      query += 'set ' + app.set.query(set)
    }
    if (d.update)
      query += ' on duplicate key update ' + app.set.query(d.update)
    return query
  },
  update: function (d) {
    return format('update ?? set ', d.table) + app.set.query(d.set) + ' where ' + app.where.query(d.where)
  },
  delete: function (d) {
    return 'delete from ' + escapeId(d.table) + ' where ' + app.where.query(d.where)
  },
  select: function (d) {
    if (_.isString(d))
      d = {table: d}
    var field = d.field
    if (_.isUndefined(field))
     field = '*'
    if (!_.isArray(field))
      field = [field]
    field = _.map(field, function (d) {
      if (d != '*')
        return escapeId(String(d))
      return d
    }).join(', ')
    var query = 'select ' + field + ' from ' + escapeId(d.table)
    var where = app.where.query(d.where)
    if (where)
      query += ' where ' + where
    var orderBy = app.orderBy.query(d.orderBy)
    if (orderBy)
      query += ' order by ' + orderBy
    if (d.limit)
      query += ' limit ' + +d.limit
    return query
  },
  groupBy: function (d) {
    var where = app.where.query(d.where)
    var field = _.clone(d.field || 'id')
    if (!_.isArray(field))
      field = [field]
    var lastField = escapeId(field.pop())
    field = _.map(field, function (d, i) {return escapeId(field)}).join(', ')
    var query = 'select ' + field
    if (field.length)
      query += ', '
    query += d.func + '(' + lastField + ') as ' + d.func + ' from ' + escapeId(d.table)
    if (where)
      query += ' where ' + where
    if (field.length)
      query += ' group by ' + field
    return query
  }
})
