const mysql = require("mysql");

var pool = mysql.createPool({  // createPool 속도가 빠름 
    host:"localhost",
    user:"root",
    password:"",
    port:3306,
    database:"bookstroe"
})

//모듈화
module.exports = pool;
