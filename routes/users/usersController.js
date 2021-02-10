const pool = require('../../dbconfig/dbconfig')

//================회원가입=====================

class usersController{
    async signup(req, res, next){
        const {signup_ID, signup_PW,signup_NAME} = req.body;
        
       // console.log(req.body);

        
        if(req.body.signup_ID =='' || req.body.signup_PW == '' || req.body.signup_NAME == ''){
            res.send('<script type="text/javascript">alert("아이디 비번 이름 지대로 입력 하자.");history.back();</script>');}
        else{
            pool.getConnection((err,conn)=>{
            if(err) throw err;
            
            var sql = 'INSERT INTO User VALUES(?,?,?)'
                var val = [signup_ID, signup_PW,signup_NAME]
                conn.query(sql, val,(err,row)=>{
                    conn.release();
                     
                    if(err)throw err;
                    
                    res.send('<script type="text/javascript">alert("흑우가 된것을 축하드립니다 많이 사세요.");location.href="/";</script>');
                })
            })
        }  
    }
    
//=====================로그인=========================
    async login(req, res, next){
        const {User_Id, User_Pw} = req.body;
        
        //console.log(User_Id,User_Pw);

        pool.getConnection((err,conn)=>{
            
   
            try{
                var sql =`SELECT * FROM User WHERE User_Id = "${User_Id}" AND User_Pw = "${User_Pw}"`
                conn.query(sql, (err,row)=>{
                    conn.release();
                    if(row[0] !== undefined){
                        req.session.User_Id = row[0].User_Id;
                        next();
                    } else if(row.length === 0) {
                        res.send('<script type="text/javascript">alert("니 아이디 비밀번호도 모르냐 이 빠가야.");history.back();</script>');
                    }
                })
            }
            catch(err){
            }
        })
    }

    //==============카드 등록==============================
    async card_add(req,res, next){
        if(!req.session.User_Id){
            req.message = "NotLogin";
            next();
        }
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            const val = [req.body.card_Number, req.body.card_Validity, req.body.card_Kind, req.session.User_Id];
            const sql = `INSERT INTO Credit VALUES (?,?,?,?)`
            conn.query(sql, val, function(err, row){
                conn.release();
                if(err) throw err;
                req.message = "success";
                next();
            })
        })
    }
    
    //==================배송지 등록=============================
    async address_add(req,res, next){
        if(!req.session.User_Id){
            req.message = "NotLogin";
            next();
        }
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            const val = [req.body.address_Base, req.body.address_Detail, req.body.address_Post, req.session.User_Id];
            const sql = `INSERT INTO Address(Address_Base,Address_Detail,Address_Post,User_Id) VALUES(?,?,?,?)`
            conn.query(sql, val, function(err, row){
                conn.release();
                if(err) throw err;
                req.message = "success";
                next();
            })
        })
    }
//==================마이페이지==============================
//카드 조회
async mypage_card(req, res, next){
    const myid = req.session.User_Id
    pool.getConnection((err,conn)=>{
       if(myid == undefined){      
          res.send('<script type="text/javascript">alert("로그인부터 하고오자.");history.back();</script>');
       }else{
        if(err) throw err;
        
        var sql =`SELECT * FROM Credit WHERE User_User_Id="${myid}"`

        conn.query(sql, (err,row)=>{
            conn.release();
            req.body.mypagecard = row;
           // console.log(row)
            next()
        })
       }
    })
}
//주소 조회
async mypage_address(req, res, next){
    const myid = req.session.User_Id
    pool.getConnection((err,conn)=>{
        if(err) throw err;

        var sql =`SELECT * FROM Address WHERE User_Id="${myid}"`
        conn.query(sql, (err,row)=>{
            conn.release();
            req.body.mypageadd = row;
            //console.log(row)
            next()
        })
    })
}

async mypage_coupon(req, res, next){
    const myid = req.session.User_Id
    pool.getConnection((err,conn)=>{
        if(err) throw err;

        var sql =`SELECT * FROM Coupon WHERE User_Id="${myid}"`
        conn.query(sql, (err,row)=>{
            conn.release();
            req.body.mypagecoupon = row;
            //console.log(row)
            next()
        })
    })
}


//주문 조회
async mypage_orderlist(req, res, next){

    var sess = req.session.User_Id;

    pool.getConnection((err,conn)=>{
        if(err) throw err;

        var sql =`SELECT * FROM Ordered,OrderInfo,Book WHERE Ordered.User_User_Id = "${sess}" AND Ordered.Order_Num = OrderInfo.Order_Num AND OrderInfo.Book_Num = Book.Book_Num`
        conn.query(sql, (err,row)=>{
            conn.release();
            req.body.mypageorderlist = row;
           // console.log("이것이야"+row)
            next()
        })
    })
}
//카드 삭제
async carddelete(req, res, next){
    pool.getConnection((err, conn)=>{
        const cardNum = req.params.Credit_Num
        //console.log(cardNum)

        if(err) throw err;
        const sql = `DELETE FROM Credit WHERE Credit_Num = "${cardNum}"`
        conn.query(sql, (err, row)=>{
            conn.release();
            
            if(err) throw err;

            else{
                res.send('<script type="text/javascript">alert("카드 가위로 싹뚝~!!.");location.href="/users/mypage";</script>');
            }
        })
    })
}
//배송지 삭제
async adddelete(req, res, next){
    pool.getConnection((err, conn)=>{
        const addNum = req.params.Address_Num
        //console.log(addNum)

        if(err) throw err;
        const sql = `DELETE FROM Address WHERE Address_Num = "${addNum}"`
        conn.query(sql, (err, row)=>{
            conn.release();
            
            if(err) throw err;

            else{
                res.send('<script type="text/javascript">alert("집이 없어져버렷!!.");location.href="/users/mypage";</script>');
            }
        })
    })
}

//주문목록 삭제
async orderlistdelete(req, res, next){
    pool.getConnection((err, conn)=>{
        const orderNum = req.params.Order_Num;
        //console.log(orderNum)

        if(err) throw err;
        const sql = `DELETE FROM Ordered WHERE Order_Num = "${orderNum}"`
        conn.query(sql, (err, row)=>{
            conn.release();
            
            if(err) throw err;

            else{
                res.send('<script type="text/javascript">alert("주문취소해버리기~.");location.href="/users/mypage";</script>');
            }
        })
    })
}
//주문목록 보여주기
async mybasketinfo(req, res, next){

    var sess = req.session.User_Id;

    pool.getConnection((err,conn)=>{
        if(err) throw err;
        
        if(sess == undefined){
            res.send('<script type="text/javascript">alert("로그인쫌 해라.");history.back();</script>');
        }
        else{
            var sql =`SELECT * FROM Basket,BasketInfo,Book WHERE Basket.User_User_Id = "${sess}" AND Basket.Basket_Num = BasketInfo.Basket_Num AND BasketInfo.Book_Num = Book.Book_Num`
        conn.query(sql, (err,row)=>{
            conn.release();
            if(row.length == 0){
                res.send('<script type="text/javascript">alert("장바구니가 텅텅 비었습니다.");location.href="/";</script>');
                        }
                        else{
            req.body.mypagebasketinfo = row;
            //console.log("이것이야"+row)
            next()
        }
        })
        }  
    })
}
async mybasketbuysucc(req, res, next){
    var cardnum = req.body.select_card;
    var sess = req.session.User_Id;
    var addnum = req.body.select_add;
    var bookscores = req.body.book_scores;

    pool.getConnection((err,conn)=> {
        if(err) throw err;

        var cardsql = `SELECT * FROM Credit WHERE Credit_Num="${cardnum}";`
        var addsql = `SELECT * FROM Address WHERE Address_Num="${addnum}";`
        var basketsql =`SELECT * FROM Basket,BasketInfo,Book WHERE Basket.User_User_Id = "${sess}" AND Basket.Basket_Num = BasketInfo.Basket_Num AND BasketInfo.Book_Num = Book.Book_Num`
        var orderedsql = `SELECT * FROM Ordered WHERE User_User_Id = "${sess}" ORDER BY Order_Num DESC;`

        var moment = require('moment');
            require('moment-timezone');
            moment.tz.setDefault("Asia/Seoul");
            var date = moment().format('YYYY-MM-DD');
        
        conn.query(cardsql, function(err,row1){ //카드 검색 사용
            if(err) throw err;
            //console.log(row1[0]);

            conn.query(addsql,function(err,row2){ //주소 검색 사용
                if(err) throw err;
               // console.log(row2[0])

                conn.query(basketsql,function(err,row3){ //장바구니 있는것들 검색
                    if(err) throw err;
                    //console.log(row3[0].BasketInfo_Count)
                   // console.log( row3[0].BasketInfo_Count * row3[0].Book_Price)
                    var totalpay = 0
                    for(var i = 0; i<row3.length;i++){
                        var total = row3[i].BasketInfo_Count * row3[i].Book_Price;
                        totalpay= totalpay+total

                    }console.log(row3[0].Book_Num);

                    const basketbuyval = [null, totalpay, date, row1[0].Credit_Kind, row1[0].Credit_Num, row1[0].Credit_Validity, row2[0].Address_Detail, row2[0].Address_Base, row2[0].Address_Post, sess]
                    const basketbuysql = `INSERT INTO ORDERED VALUES(?,?,?,?,?,?,?,?,?,?)`
                    conn.query(basketbuysql, basketbuyval, (err,row4)=>{
                        if(err) throw err;

                        conn.query(orderedsql, function(err, row5){
                            if(err) throw err;

                            for(var j=0 ; j<row3.length ; j++){
                                var booknum2= row3[j].Book_Num
                                var basketinfo2=row3[j].BasketInfo_Count
                                  const buyinfoval = [row5[0].Order_Num, booknum2, basketinfo2, bookscores[j],null]
                                 const buyinfosql = `INSERT INTO OrderInfo VALUES(?,?,?,?,?)`
                                conn.query(buyinfosql,buyinfoval , (err,row6)=>{
                                    if(err) throw err;
                                })
                               
                                    const countsql2 = `UPDATE Book SET Book_Count = Book_Count-? WHERE Book_Num="${booknum2}"`
                                    const countval2 = [ basketinfo2]
                                    
                                    conn.query(countsql2, countval2,(err,row8) =>{
                                        if(err) throw err;
                                        console.log("빠지는중"+countval2)
                                    })
                           }
                           const delbasket = `DELETE FROM Basket WHERE User_User_Id = "${sess}"`
                           conn.query(delbasket, function(err,row9){
                               if(err) throw err;
                           })
                           conn.release();
                           
                           next();  
                        })  
                    })         
                })
            })
        })
    })
}

}


module.exports= usersController