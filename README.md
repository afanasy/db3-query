[![Build Status](https://api.travis-ci.org/afanasy/db3-query-string.svg)](https://travis-ci.org/afanasy/db3-query-string)

SQL query in JSON format

### When is this useful?
If you want to store SQL queries in JSON format

### Examples
```js
var
queryString = require('db3-query-string')

queryString.stringify({"name":"createTable", "table":"person"})
// returns create table `person` (`id` bigint primary key auto_increment,  `name` text)
queryString.stringify({"name":"dropTable", "table":"person"})
// returns drop table `person`
queryString.stringify({"name":"truncateTable", "table":"person"})
// returns truncate table `person`
queryString.stringify({"name":"renameTable", "table":"person", "to":"nosrep"})
// returns rename table `person` to `nosrep`
queryString.stringify({"name":"alterTable", "table":"person", "drop":"name"})
// returns alter table `person` drop `name`
queryString.stringify({"name":"insert", "table":"person", "select":"nosrep"})
// returns insert `person` select * from `nosrep`
queryString.stringify({"name":"insert", "table":"person", "set":{"id":1, "name":"Bob"}})
// returns insert `person` set `id` = 1,  `name` = 'Bob'
queryString.stringify({"name":"insert", "table":"person", "set":{"name":"Bob"}, "update":{"name":"Alice"}})
// returns insert `person` set `name` = 'Bob' on duplicate key update `name` = 'Alice'
queryString.stringify({"name":"update", "table":"person", "set":{"name":"Alice"}, "where":1})
// returns update `person` set `name` = 'Alice' where `id` = 1
queryString.stringify({"name":"update", "table":"person", "set":{"name":"Alice"}, "where":{"name":"Bob"}})
// returns update `person` set `name` = 'Alice' where `name` = 'Bob'
queryString.stringify({"name":"delete", "table":"person", "where":1})
// returns delete from `person` where `id` = 1
queryString.stringify({"name":"delete", "table":"person", "where":{"name":"Alice"}})
// returns delete from `person` where `name` = 'Alice'
```
