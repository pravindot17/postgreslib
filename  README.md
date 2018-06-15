Mysql Library for CRUD operations
===================

## How to use
```js
let mysqlDb = require('mysqllib');

// init the connection in your bootstrap file using following code
mysqlDb.__init(__config.mysql).then(() => {
    console.log('Mssql connection started successfully');
}).catch(err => {
    throw err;
});

// later you can use the crud functions in following way
mysqlDb.__select('SELECT * FROM test WHERE id >= ?', [1]).then((result) => {
    console.log('Got the result', result);
}).catch(err => {
    throw err;
});
```
