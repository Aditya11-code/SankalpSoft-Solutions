var express = require ('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
//setting up connection from the mysql using the npm mysql module
var mysql = require('mysql');

//creating connection here ....from the database online_judge
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'sankalpsoft',
    timezone : "+00:00"
})

//display connected and ensure proper connection has been setup
connection.connect(function(err) {
    if (err) throw err
});



app.set('views' , path.join(__dirname , 'views'));
app.set('views engine' , 'ejs');

app.use(express.static(path.join(__dirname , 'public')));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/' , function(req , res){
  res.render('home.ejs');
});

app.get('/login' , function(req , res){
  res.render('login.ejs', {message: ""});
});

app.post('/login' , function(req , res){
  connection.query('SELECT username FROM employee WHERE username = ? and password = ?' , [req.body.name , req.body.password] , function(err,rows,fields){
    if (err)  throw err;
    if(rows.length){
      res.redirect('/dashboard');
    }
    else{
      res.render('login.ejs' , {message:'Wrong username and password'});
    }
  });

});

app.post('/' , function(req , res){
  var contact = {
        name:req.body.name,
        contact_no:req.body.number,
        message:req.body.message
      }
      if(contact.name==="" || contact.contact_no ==="" || contact.message==="")
      {
        res.render('home.ejs');
      }
      else{
      connection.query('INSERT INTO feedback SET ?',[contact] , function(err,rows,fields){
        if(err) throw err;
        res.render('home.ejs');
      });
    }
  });


app.get('/dashboard' , function(req , res){
  res.render('dashboard.ejs');
});


app.listen('4000' , function(){
  console.log('server is started at port 4000');
})
