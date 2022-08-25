import mysql from 'mysql2/promise';

export const {DB_HOST, DB_NAME, DB_USER, DB_PWD} = process.env;

const POOL = mysql.createPool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PWD,

})

POOL.getConnection().then(res=> console.log(`Connected to ${res.config.database}`))

export default POOL;