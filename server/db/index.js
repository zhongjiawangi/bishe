const mysqll = require('mysql')

const db = mysqll.createPool({
  host: 'localhost',
  user: 'root',
  password: 'z12010906',
  database: 'cwgl_db'
})

module.exports = db