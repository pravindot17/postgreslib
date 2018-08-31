/*
    Created by Pravin Lolage on 14 June 2018.
*/
let pg = require('pg');
let libPg = {};
libPg.conn = {};

module.exports = {
    __init: init,
    __select: select,
    __insert: insert,
    __update: update,
    __getPoolConnection: getPoolConnection,
    __poolQuery: poolQuery,
    __close: close
}

function init(dbConfig) {
    return new Promise((resolve, reject) => {

        // set config here for later use
        libPg.dbConfig = dbConfig;

        if(!libPg.conn[libPg.dbConfig['database']]) {
            let pool = new pg.Pool(libPg.dbConfig);
            libPg.conn[libPg.dbConfig['database']] = pool;
            pool.connect((err, client, done) => {
                if (err) {
                    console.error('connection failed with postgres', err.message);
                    reject(err);
                } else {
                    client.release();
                    resolve(true);

                    client.on('error', function (err) {
                        console.error('libPg.init, error connecting postgres:', err.message);
                        libPg.conn[libPg.dbConfig['database']] = null;
                    });
                }
            });
        } else {
            resolve(null);
        }
    });
}

function select(query, queryParams = []) {
    return new Promise((resolve, reject) => {
        if (libPg.conn[libPg.dbConfig['database']]) {
            libPg.conn[libPg.dbConfig['database']].query(query, queryParams).then(res => {
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

function insert(query, queryParams = []) {
    return new Promise((resolve, reject) => {
        if (libPg.conn[libPg.dbConfig['database']]) {
            libPg.conn[libPg.dbConfig['database']].query(query, queryParams).then(res => {
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


function update(query, queryParams = []) {
    return new Promise((resolve, reject) => {
        if (libPg.conn[libPg.dbConfig['database']]) {
            libPg.conn[libPg.dbConfig['database']].query(query, queryParams).then(res => {
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

async function close() {
    await libPg.conn[libPg.dbConfig['database']].end();
}

function getPoolConnection() {
    return new Promise((resolve, reject) => {
        if (libPg.conn[libPg.dbConfig['database']]) {
            libPg.conn[libPg.dbConfig['database']].connect((err, client) => {
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

function poolQuery(pool, query, queryParams = []) {
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