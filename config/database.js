const mysql = require('mysql')
const util = require('util')

const db = mysql.createPool({
    host: 'localhost',
    user: 'slthnsf',
    password: 'tamaninduk44',
    database: 'backend_2021',
    port: 3306,
    multipleStatements: true
})

const dbQuery = util.promisify(db.query).bind(db)

module.exports={ db, dbQuery }