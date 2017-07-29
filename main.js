console.log("hello")
// pkgs
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session')
const expressValidator = require('express-validator')
const app = express();
// pkgs


// tell express to use handlebars
app.engine('handlebars', handlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');

// tell express how to serve static files
app.use(express.static('public'));

// session
app.use(session({
  secret: 'two',
  resave: false,
  saveUninitialized: true
}));

// tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(expressValidator());

// log request
app.use(morgan('dev'));

// Usernames & Passwords to mimic dataBase
let data = [{

    username: 'Bob',
    password: 'Cat'
  },
  {
    username: 'Mars',
    password: 'Volta'
  },
  {
    username: 'Steve',
    password: 'Jobs'
  }
];

// create session
app.use((req, res, next) => {
  if (!req.session) {

  }

  console.log(req.session);
  next();

});


// configure the webroot
app.get('/', function(req, res) {
  if (!req.session.someone === 0) {
    res.redirect('login')

 } else {
    res.render('home', {
      username: req.session.someone

    });
  }
});

app.get('/login', function(req, res) {
  res.render('login');

});


app.post('/enter', function(req, res) {
  let logIn = req.body;


// validation
req.checkBody('username', 'Username is required').notEmpty();
req.checkBody('password', 'Password is required').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.render('login', {

      errors: errors

    });

} else {

  let users = data.filter(function(verify) {
  return verify.username === req.body.username;

    });

// if user is not found
   if (users.length === 0) {
   let inv_user = "User not found. Please create an account."
      res.render("login", {
        invalid: inv_user
   });
  return;

    }

    let user = users[0];
// if the password is a match, direct back to homepage, ohterwise disple "need help?"
    if (user.password === req.body.password) {
      req.session.someone = user.username;
      res.redirect("/");

  } else {

    let inv_password = "Not a valid entry, need help?"
      res.render("login", {
        invalid: inv_password
   });

  }

 }

});

app.listen(3000, function() {
  console.log('App is running...');
});
