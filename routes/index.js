

const mainRouter = require('./main'); 
const usersRouter = require('./users');
const booksRouter = require('./books');

const getrouter = (path,controller ) => ({path,controller});

const route = [
  getrouter('/', mainRouter),
  getrouter('/users', usersRouter),
  getrouter('/books', booksRouter),
  
  getrouter('/*',(req,res)=>{
    res.send({
      status : 404,
      message : "잘못들어왔데이"
    })
  })
];

module.exports = route 