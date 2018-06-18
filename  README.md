Postges Library for CRUD operations
===================

## How to use
```js
let postgresDb = require('postgreslib');

let config = {
    host: 'localhost',
    port: '5432',
    database: 'test',
    user: 'postgres',
    password: 'postgres',
    max: '10',
    idleTimeoutMillis: '30000'
}

// init the connection in your bootstrap file using following code
postgresDb.__init(config).then(() => {
    console.log('Postgres connection started successfully');
}).catch(err => {
    throw err;
});

// later you can use the crud functions in following way
postgresDb.__select('SELECT * FROM test WHERE id >= $1', [10]).then((result) => {
    console.log('Got the result', result);
}).catch(err => {
    throw err;
});
```
