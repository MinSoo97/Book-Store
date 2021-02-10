const express = require('express'); //통신할 수 있는 함수 몇개 들고오는거야 .호균
const router = express.Router(); //express를 써서 라우터를 통신 쓸꺼다
const Main = require('./mainController')
const Book = require('../books/bookController')
const bookCon = new Book();
const mainCon = new Main();

router.get("/",bookCon.bookinfo, function(req, res, next){
    var sess = req.session.User_Id;

    var book = req.body;
    console.log("새로고침됨");
    res.render("main.ejs",{
        title: "Express", 
        sess:sess, 
        book:book
    })
} )






module.exports = router;