const express = require("express");
const router = express.Router();
const usersController = require("./usersController");
const usersCon = new usersController();

//===================회원가입=========================================
router.get("/signup", function(req, res){
    res.render("signup.ejs",{title: "Express"})
} )

router.post("/signup", usersCon.signup, (req, res) => {
    
    if(req.body.signup_ID == '' || req.body.signup_PW == '' || req.body.signup_NAME == ''){
        console.log("회원가입 실패")

        res.render("signup.ejs",{title: "Express", message: "pwerr"})
    }
    else{
        console.log("회원가입 성공")

        res.render('login.ejs',{title: "Express", message: "loginok"});
    }
})

//============================로그인=============================
router.get("/login", function(req, res, next){
    res.render("login.ejs",{title: "Express"})
} )

router.post("/Login", usersCon.login, (req, res) => {
    
    if(req.session.User_Id !== undefined){
        console.log("로그인 성공")
        res.redirect('/');
    }
    else{
        console.log("로그인 ")
        res.render("signup.ejs",{
            title: "Express", 
            message: "pwerr"
        })
        
        
    }
})

//========================로그아웃========================
router.get("/logout", function(req, res, next){
    req.session.destroy(function(){ 
        req.session;
        });
        res.redirect('/');
} )

//==================카드 등록===============================
router.get("/cardadd", function(req, res){
    var sess = req.session.User_Id;
    res.render("cardAdd.ejs",{
        title: "Express",
        sess: sess})
} )

router.post("/cardadd", usersCon.card_add, (req, res) => {
    
    if(req.body.card_Number == '' || req.body.card_Validity == '' || req.body.card_Kind == ''){
        console.log("카드등록 실패")

        res.render("cardAdd.ejs",{title: "Express"})
    }
    else{
        console.log("카드등록 성공")

        res.redirect('/');
    }
})

//================배송지 등록=======================================
router.get("/addressadd", function(req, res){
    var sess = req.session.User_Id;
    res.render("addressAdd.ejs",{
        title: "Express",
        sess: sess})
} )

router.post("/addressadd", usersCon.address_add, (req, res) => {
    
    if(req.body.card_Number == '' || req.body.card_Validity == '' || req.body.card_Kind == ''){
        console.log("배송지 등록 실패")

        res.render("addressAdd.ejs",{title: "Express"})
    }
    else{
        console.log("배송지 등록 성공")

        res.redirect('/');
    }
})

//==============마이페이지========================

router.get("/mypage", usersCon.mypage_card, usersCon.mypage_address, usersCon.mypage_orderlist, usersCon.mypage_coupon,(req, res)=>{
   
    var sess = req.session.User_Id;
    var mypagecard = req.body.mypagecard;
    var mypageadd = req.body.mypageadd;
    var mypageorderlist = req.body.mypageorderlist;
    var mypagecoupon= req.body.mypagecoupon;
    console.log(req.params);
    res.render("mypage.ejs",{
        sess:sess, 
        mypagecard:mypagecard,
        mypageadd:mypageadd,
        mypageorderlist : mypageorderlist,
        mypagecoupon : mypagecoupon
            })
})

//================카드 삭제=================================
router.get('/mypage/carddelete/:Credit_Num', usersCon.carddelete, (req, res) =>{
    res.redirect('/users/mypage');
})

//==============배송지 삭제=========
router.get('/mypage/adddelete/:Address_Num', usersCon.adddelete, (req, res) =>{
    res.redirect('/users/mypage');
})

//==============주문목록 삭제=========
router.get('/mypage/orderlistdelete/:Order_Num', usersCon.orderlistdelete, (req, res) =>{
    res.redirect('/users/mypage');
})
//그냥 테스트용 css
router.get("/test", function(req, res, next){
    res.render("test.ejs",{title: "Express"})
})

//===============장바구니 정보===========================
router.get("/mybasket", usersCon.mybasketinfo, (req, res)=>{
    var sess = req.session.User_Id;

    var mypagebasketinfo= req.body.mypagebasketinfo
    res.render("basket.ejs",{
        mypagebasketinfo : mypagebasketinfo,
        sess: sess})
} )

//=============도서 장바구니구매=============================
router.get("/mybasket/:basket_num", usersCon.mypage_card, usersCon.mypage_address, usersCon.mybasketinfo,  usersCon.mypage_coupon,(req, res)=>{
    var sess = req.session.User_Id;
    var mypagecard = req.body.mypagecard;
    var mypageadd= req.body.mypageadd;
    var mypagebasketinfo = req.body.mypagebasketinfo
    var mycouponss = req.body.mypagecoupon;

     res.render("basketbuy.ejs",{
         sess : sess,
         mypagecard : mypagecard,
         mypageadd : mypageadd,
         mycouponss : mycouponss,
         mypagebasketinfo : mypagebasketinfo
    })
 } )

 //============도서 장바구니 구매 완료=========================
 router.post("/mybasket/:basket_num/buysucc", usersCon.mybasketbuysucc,(req, res)=>{
    res.redirect('/');

})


module.exports = router;


