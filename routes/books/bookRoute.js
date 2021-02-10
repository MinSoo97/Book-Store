const express = require("express");
const router = express.Router();
const bookController = require("./bookController");
const bookCon = new bookController();
const usersController = require("../users/usersController");
const usersCon = new usersController();


//===================도서 상세정보==============================
router.get("/bookdetail/:book_num", bookCon.bookdetail,(req, res)=>{
   
    var sess = req.session.User_Id;
    const bookdetail = req.body.bookdetail[0]
    var score = req.body.bookscore
    console.log(req.params);
    res.render("bookdetail.ejs",{
        sess:sess, 
        bookdetail:bookdetail,
        score : score
    })

})
//===================도서 수정======================================


router.post("/bookdetail/:book_num", bookCon.bookupdate,(req, res)=>{
   
    var sess = req.session.User_Id;
    const bookupdate = req.body;
    var booknum = req.params.book_num

    if(req.body.book_Name == '' || req.body.book_Count == '' || req.body.book_Price == ''){
        console.log("도서수정 ㄴㄴ")

        res.render("bookupdate.ejs",{title: "Express" ,sess: sess ,bookupdate : bookupdate})
    }
    else{
        console.log("도서수정 완료")

        res.redirect('/');
    }

})
router.get("/bookdetail/:book_num/bookupdate", function(req, res){
    var booknum = req.params.book_num
    var sess = req.session.User_Id;
 
     res.render("bookupdate.ejs",{
        booknum : booknum, 
        sess : sess})
 } )

//==================도서삭제========================
/*router.get('/bookdetail/:book_num/bookdelete', bookCon.bookdelete, (req, res) =>{
})*/

//================도서구매방법==============================
router.post("/bookdetail/:book_num/howorder", bookCon.howorder,(req, res)=>{
   
    var sess = req.session.User_Id;
    const bookbuy = req.body;
    var booknum = req.params.book_num
})

//============도서 구매================
router.get("/bookdetail/:book_num/bookbuy", usersCon.mypage_card, usersCon.mypage_address, usersCon.mypage_coupon,(req, res)=>{
    var sess = req.session.User_Id;
    var sesscount = req.session.count;
    var mypagecard = req.body.mypagecard;
    var mypageadd= req.body.mypageadd;
    var booknum = req.params.book_num
    var mycoupons = req.body.mypagecoupon;

     res.render("buy.ejs",{
        sess : sess,
         booknum : booknum, 
         sesscount : sesscount,
         mypagecard : mypagecard,
         mypageadd : mypageadd,
         mycoupons : mycoupons
    })
 } )
//================도서구매완료===========================
 router.post("/bookdetail/:book_num/buysucc", bookCon.bookbuysucc,(req, res)=>{
    res.redirect('/');

    var sess = req.session.User_Id;
    const bookbuy = req.body;
    var booknum = req.params.book_num
})



module.exports = router;

