/*
    Created by Pravin Lolage on 14 June 2018.
*/
let pg = require('pg');
let libPg = {};

let init = (dbConfig) => {
    return new Promise((resolve, reject) => {

        // set config here for later use
        libPg.dbConfig = dbConfig;

        if (!libPg.dbConfig.init) {
            libPg.conn = null;
            return resolve(false);
        }

        let pool = new pg.Pool(libPg.dbConfig);
        libPg.conn = pool;
        pool.connect((err, client, done) => {
            if (err) {
                console.error('connection failed with postgres', err.message);
                reject(err);
            } else {
                client.release();
                resolve(true);

                client.on('error', function (err) {
                    console.error('libPg.init, error connecting postgres:', err.message);
                    libPg.conn = null;
                });
            }
        });
    });
}

let select = (query, queryParams = []) => {
    return new Promise((resolve, reject) => {
        if (libPg.conn) {
            libPg.conn.query(query, queryParams).then(res => {
                resolve(res.rows);
            }).catch(e => {
                console.error('libPg.select, failed', e.message);
                reject(e);
            });
        } else {
            console.error('libPg.select, error connecting postgres');
            reject(new Error('Postgres is not connected, please try again later'));
        }
    });
}

let insert = (query, queryParams = []) => {
    return new Promise((resolve, reject) => {
        if (libPg.conn) {
            libPg.conn.query(query, queryParams).then(res => {
                resolve(res);
            }).catch(e => {
                console.error('libPg.insert, failed', e.message);
                reject(e);
            });
        } else {
            console.error('libPg.insert, error connecting postgres');
            reject(new Error('Postgres is not connected, please try again later'));
        }
    });
}


let update = (query, queryParams = []) => {
    return new Promise((resolve, reject) => {
        if (libPg.conn) {
            libPg.conn.query(query, queryParams).then(res => {
                resolve(res);
            }).catch(e => {
                console.error('libPg.update, failed', e.message);
                reject(e);
            });
        } else {
            console.error('libPg.update, error connecting postgres');
            reject(new Error('Postgres is not connected, please try again later'));
        }
    });
}

let close = async () => {
    if (libPg.dbConfig.init) {
        await libPg.conn.end();
    }
}

let getPoolConnection = () => {
    return new Promise((resolve, reject) => {
        if (libPg.conn) {
            libPg.conn.connect((err, client) => {
                if(err) {
                    console.error('libPg.getPoolConnection, failed', err.message);
                    reject(err);
                } else {
                    resolve(client);
                }
            });
        } else {
            console.error('libPg.getPoolConnection, error connecting postgres');
            reject(new Error('Postgres is not connected, please try again later'));
        }
    });
}

let poolQuery = (pool, query, queryParams = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, queryParams, (err, result) => {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    __init: init,
    __select: select,
    __insert: insert,
    __update: update,
    __getPoolConnection: getPoolConnection,
    __poolQuery: poolQuery,
    __close: close
}