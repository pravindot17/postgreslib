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

        let pool = new pg.Pool(libPg.dbConfig.options);

        pool.connect((err, client, done) => {
            if (err) {
                console.error('connection failed with postgres', err.message);
                reject(err);
            } else {
                libPg.conn = client;
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

module.exports = {
    __init: init,
    __select: select,
    __insert: insert,
    __update: update,
    __close: close
}
