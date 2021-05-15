const { Pool } = require('pg');
const mysql = require('mysql');
const util = require('util');


async function connect() {
    const { dbtype } = process.env;
    let pool = null;

    if (dbtype === 'postgres') {
        pool = new Pool({
            user: process.env.user,
            password: process.env.password,
            port: process.env.port,
            host: process.env.host,
            database: process.env.database
        });

        //teste de conexão
        const client = await pool.connect();
        console.log(`Pool de conexões criado no ${dbtype}`);

        const res = await client.query('SELECT NOW()');
        console.info(res.rows[0]);
        client.release();

        return pool.connect();
    }

    if (dbtype === 'mysql') {
        pool = mysql.createConnection({
            user: process.env.user,
            password: process.env.password,
            port: process.env.port,
            host: process.env.host,
            database: process.env.database
        });

        console.log(`Pool de conexões criado no ${dbtype}`);
        pool.query('SELECT NOW() as now', function (error, results, fields) {
            if (error) throw error;
            console.log('The time is: ', results[0].now);
        });

        return pool;
    }

}

async function selectImages() {
    const client = await connect();

    if (process.env.dbtype === 'mysql') {
        const query = util.promisify(client.query).bind(client);
        const rows = await query(process.env.sql);
        client.end();
        return rows;
    }

    const res = await client.query(process.env.sql);
    client.end();

    return res.rows;
}

module.exports = { selectImages }