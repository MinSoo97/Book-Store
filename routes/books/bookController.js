const pool = require('../../dbconfig/dbconfig')

class bookController {

    //=================도서정보띄우기============================
    async bookinfo(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw err;

            var sql = `SELECT * FROM Book`
            conn.query(sql, (err, row) => {
                conn.release();
                req.body = row;
                next()
            })

        })
    }
    //=============도서상세정보=========================
    async bookdetail(req, res, next) {
        const bookNum = req.params["book_num"]
        var avg = 0 // 이게 별점 평균 구하는거
        var sum = 0 // 이게 이때까지 산 사람들의 별점 합 구하는거
       // console.log(bookNum)
        pool.getConnection((err, conn) => {
            if (err) throw err;
            var orderinfobooksql = `SELECT * FROM OrderInfo WHERE Book_Num="${bookNum}"`
            var sql = `SELECT * FROM Book WHERE Book_Num="${bookNum}"`
            conn.query(sql, (err, row) => {
                if(err) throw err;

                conn.query(orderinfobooksql,(err,row2)=>{
                    if(err) throw err;

                    conn.release();
                    req.params = row;
                    req.body.bookdetail = row;
                    //별점 평균 구해줘서 그걸 bookscore에 저장해준다.
                    for(var i=0 ; i < row2.length ; i++){
                        var booksc = row2[i].OrderInfo_Score
                        sum= sum+booksc
                    }
                    
                    avg=sum/row2.length;
                    req.body.bookscore=avg;
                    next();

                })

            })

        })
    }

    //=================도서수정==============================
    async bookupdate(req, res, next) {
        const { book_Name, book_Count, book_Price } = req.body;
        const bookNum = req.params.book_num
        //console.log(req.body);
        // console.log(bookNum);
        //수정 할려 하는데 만약 빈칸이 있으면 아무것도 하지 않는다는 말
        if (req.body.book_Name == '' || req.body.book_Count == '' || req.body.book_Price == '') {
            res.send('<script type="text/javascript">alert("책을 팔 생각이 없는 것이냐??");location.href="/";</script>');
        }
        else {
            pool.getConnection((err, conn) => {
                if (err) throw err;

                var sql = `UPDATE Book SET Book_Name = ? , Book_Count = ? ,Book_Price = ? WHERE Book_Num="${bookNum}"`
                var val = [book_Name, book_Count, book_Price]
                conn.query(sql, val, (err, row) => {
                    conn.release();

                    if (err) throw err;

                    else
                        next();
                })
            })

        }

    }

    //=================도서 삭제============================
    /*async bookdelete(req, res, next) {
        pool.getConnection((err, conn) => {
            const bookNum = req.params.book_num
            
            if (err) throw err;

            const sql = `DELETE FROM Book WHERE Book_Num = "${bookNum}"`
            conn.query(sql, (err, row) => {
                conn.release();

                if (err) throw err;

                else {
            res.send('<script type="text/javascript">alert("도서삭제.");location.href="/";</script>');   
                     }
            })
        })
    }*/
    //==================장바구니 도서 삭제========================
    async bookdelete(req, res, next) {
        pool.getConnection((err, conn) => {
            const bookNum = req.params.book_num


            if (err) throw err;
            const sql = `DELETE FROM BasketInfo WHERE Book_Num = "${bookNum}"`
            conn.query(sql, (err, row) => {
                conn.release();

                if (err) throw err;

                else {
                    next();
                }
            })
        })
    }
    //================도서구매방법=====================
    async howorder(req, res, next) {
        pool.getConnection((err, conn) => {
            const bookNum = req.params.book_num
            const sess = req.session.User_Id
          //  console.log("1" + req.body.buy)
           // console.log("2" + req.body.basket)
            //바로구매 페이지로 넘기기
            if (req.body.buy != undefined) {
               if(sess == undefined){
                res.send('<script type="text/javascript">alert("책을 사려면 로그인을 하거라.");location.href="/users/login";</script>');
               }
               else{
                req.session.count = req.body.bookcount
                res.redirect('/books/bookdetail/' + bookNum + '/bookbuy');
               }
               

            }
            //장바구니에 담기
            else if (req.body.basket != undefined) {
                if(sess == undefined){
                    res.send('<script type="text/javascript">alert("장바구니에 넣으려면 로그인을 하거라.");location.href="/users/login";</script>');

                }
                else{
                    pool.getConnection((err, conn) => {
                        if (err) throw err;
                        req.session.count = req.body.bookcount
    
                        var sess = req.session.User_Id;
                        var bookNum = req.params.book_num;

                        
                        var moment = require('moment');
                        require('moment-timezone');
                        moment.tz.setDefault("Asia/Seoul");
                        var date = moment().format('YYYY-MM-DD');
                        var basketsql = `SELECT * FROM Basket WHERE User_User_Id = "${sess}"`
                        conn.query(basketsql, (err,row8)=>{
                            if(err) throw err;
                           // console.log(row8);
                        if (row8.length == 0) {
                            var basketaddval = [null, date, sess];
                            var basketaddsql = `INSERT INTO Basket VALUES(?,?,?)`
                            conn.query(basketaddsql, basketaddval, (err, row5) => { //장바구니 생성
                                var sesscount = req.session.count; //도서수량 저장
                                var usecouponss = req.body.select_couponss
                             //   console.log('sdf'+sesscount)
                             var booksql = `SELECT * FROM Book WHERE Book_Num = "${bookNum}";`
                             var basketsql2 = `SELECT * FROM Basket WHERE User_User_Id = "${sess}"`
    
                             conn.query(booksql, (err, row6) => {
                                 conn.query(basketsql2,(err,row7)=>{
                                     var basketinfoaddsql = `INSERT INTO BasketInfo VALUES(?,?,?)`
                                     var basketinfoaddval = [row6[0].Book_Num, row7[0].Basket_Num, sesscount]
                                     conn.query(basketinfoaddsql, basketinfoaddval, (err, row) => {
                                         conn.release();
     
                                         if (err) throw err;
     
                                         else {
                                             next(); //오류가 없으면 다음으로 넘기겠다는 뜻
                                         }
                                     })    
                                 })
                                 
    
                             })
    
                            })
                        }
                        else{//장바구니가 빈칸이 아니면
                            req.session.count = req.body.bookcount
                            var sesscount = req.session.count; //도서수량 저장
                            var booksql = `SELECT * FROM Book WHERE Book_Num = "${bookNum}";`
                                var basketsql2 = `SELECT * FROM Basket WHERE User_User_Id = "${sess}"`
    
                                conn.query(booksql, (err, row6) => {
                                    conn.query(basketsql2,(err,row7)=>{
                                        var basketinfoaddsql = `INSERT INTO BasketInfo VALUES(?,?,?)`
                                        var basketinfoaddval = [row6[0].Book_Num, row7[0].Basket_Num, sesscount]
                                        conn.query(basketinfoaddsql, basketinfoaddval, (err, row) => {
                                            conn.release();
        
                                            if (err) throw err;
        
                                            else {
                                                next();
                                            }
                                        })    
                                    })
                                    
    
                                })
                        }
                    })
                })
    
                    res.redirect('/')
                }
                
            }
        })
    }
    //======================도서구매===============
    async bookbuy(req, res, next) {
        pool.getConnection((err, conn) => {

        })
    }

    //===============도서 구매완료===============
    async bookbuysucc(req, res, next) {
        var cardnum = req.body.select_card;
        var sess = req.session.User_Id;
        var addnum = req.body.select_add;
        var booknum = req.params.book_num
        var sesscount = req.session.count;
        var bookscore = req.body.book_score;
        var usecoupon = req.body.select_coupon;
        console.log(usecoupon)
        // console.log(" card "+cardnum , " add "+ addnum , " booknum "+booknum)


        pool.getConnection((err, conn) => {
            if (err) throw err;
            var cardsql = `SELECT * FROM Credit WHERE Credit_Num="${cardnum}";`
            var addsql = `SELECT * FROM Address WHERE Address_Num="${addnum}";`
            var booksql = `SELECT * FROM Book WHERE Book_Num = "${booknum}";`
            var orderedsql = `SELECT * FROM Ordered WHERE User_User_Id = "${sess}" ORDER BY Order_Num DESC;`
            var mycoupona= `SELECT * FROM Coupon`
            var moment = require('moment');
            require('moment-timezone');
            moment.tz.setDefault("Asia/Seoul");
            var date = moment().format('YYYY-MM-DD');
            //검색 해온 것들을 row에 저장
            conn.query(cardsql, function (err, row) { //카드 검색을 사용
                if (err) throw err;
                //console.log(row[0]);

                conn.query(addsql, function (err, row2) { //주소 검색을 사용
                    if (err) throw err;
                   // console.log(row2[0]);

                    conn.query(booksql, function (err, row3) { //책 검색을 사용
                        if (err) throw err;
                      //  console.log(row3[0]);

                        const orderval = [null, sesscount * row3[0].Book_Price, date, row[0].Credit_Kind, row[0].Credit_Num, row[0].Credit_Validity, row2[0].Address_Detail, row2[0].Address_Base, row2[0].Address_Post, sess];
                        const ordersql = `INSERT INTO Ordered VALUES(?,?,?,?,?,?,?,?,?,?)` //오더에 정보들을 다 저장
                        conn.query(ordersql, orderval, function (err, row) {//주빨
                            if (err) throw err;

                            const countsql = `UPDATE Book SET Book_Count = ? WHERE Book_Num="${booknum}"`
                            const countval = [row3[0].Book_Count - sesscount]

                            conn.query(countsql, countval, (err, row4) => {//주초 //책 구매 수량 업데이트

                                if (err) throw err;
                                conn.query(orderedsql, function (err, row4) { //주문정보 저장된 검색
                                    if (err) throw err;
                                   // console.log(row4[0]);
                                    const infoval = [row4[0].Order_Num, row3[0].Book_Num, sesscount,bookscore,usecoupon]
                                    const infosql = `INSERT INTO OrderInfo VALUES(?,?,?,?,?)`

                                    conn.query(infosql, infoval, (err, row) => {//흰색 //주문정보에 저장
                                        conn.release();

                                        if (err) throw err;

                                        else
                                            next();
                                    })//흰색
                                })//주초
                            })//주빨
                        })
                    })
                })
            })
        })
    }


}

module.exports = bookController

