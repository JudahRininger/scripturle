var createError = require('http-errors');
let express = require("express");
let path = require("path");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use( expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "super $ecret phrase 123", 
  cookie: {
    maxAge: 1000*60*10 // in ms
  }
}) );

app.use(express.static(path.join(__dirname, "public")));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.get('/v1', (req, res)=> {
  res.render('v1');
});

app.post("/v1", (req, res)=> {

  let secretWord = "hebrews".toUpperCase();

  // extract the guess value from the body
  const guess = req.body.guess.toUpperCase();

  let result = computeResult(guess, secretWord);

  function computeResult(guess, secretWord) {
    let result = []
    let tempWord = secretWord;
    for (let i = 0; i < 7; i++) {
      if (guess[i] == tempWord[i]) {
        result.push({ letter: guess[i],
                      state: 'correct'})
        tempWord = setCharAt(tempWord,i,'-');
      }
      else {
        if(tempWord.includes(guess[i])) {
          let proc = true
          for (let e = 0; e < 7; e++) {
            if (guess[i] == tempWord[e] && proc) {
              if(guess[e] != tempWord[e]) {
                result.push({ letter: guess[i],
                              state: 'misplaced'})
                              tempWord = setCharAt(tempWord,e,'-');
                proc = false;
              }
            }
          }
          if (proc) {
            result.push({ letter: guess[i],
                          state: 'incorrect'})
          }


        }
        else {
          result.push({ letter: guess[i],
                        state: 'incorrect'})
        }
      }
    }
    return result;
  }
  function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
  }
  console.log(result);
  res.render('v1', {result: result} ) ;
});

   

  
app.get('/v2', (req, res)=> {
  if( !req.session.guesses) {
    req.session.guesses = [];
  }
  let secretWord = "hebrews".toUpperCase();
  let guesses = req.session.guesses
  let visibility = 'visible'
  if(guesses.length >= 7) {
    res.render('v2-2', {guesses:guesses, secretWord:secretWord}) ;
  }
  else{
    res.render('v2', {guesses:guesses, visibility: visibility}) ;
  }
});

app.post("/v2", (req, res)=> {

  if( !req.session.guesses) {
    req.session.guesses = [];
  }

  let secretWord = "hebrews".toUpperCase();

  // extract the guess value from the body
  const guess = req.body.guess.toUpperCase();

  let result = computeResult(guess, secretWord);

  function computeResult(guess, secretWord) {
    let result = []
    let tempWord = secretWord;
    for (let i = 0; i < 7; i++) {
      if (guess[i] == tempWord[i]) {
        result.push({ letter: guess[i],
                      state: 'correct'})
        tempWord = setCharAt(tempWord,i,'-');
      }
      else {
        if(tempWord.includes(guess[i])) {
          let proc = true
          for (let e = 0; e < 7; e++) {
            if (guess[i] == tempWord[e] && proc) {
              if(guess[e] != tempWord[e]) {
                result.push({ letter: guess[i],
                              state: 'misplaced'})
                              tempWord = setCharAt(tempWord,e,'-');
                proc = false;
              }
            }
          }
          if (proc) {
            result.push({ letter: guess[i],
                          state: 'incorrect'})
          }
        }
        else {
          result.push({ letter: guess[i],
                        state: 'incorrect'})
        }
      }
    }
    return result;
  }
  function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
  }
  // console.log(result);
  req.session.guesses.push(result);
  console.log(req.session.guesses);
  let visibility = 'visible'
  if(req.session.guesses.length >= 7) {
    visibility = 'hidden'
  }
  if(guess == secretWord) {
    res.render('v2-3', {guesses: req.session.guesses, secretWord:secretWord})
  }
  if(req.session.guesses.length >= 7) {
    res.render('v2-2', {guesses: req.session.guesses, secretWord:secretWord}) ;
  }
  else {
    res.render('v2', {guesses: req.session.guesses, visibility: visibility}) ;
  }
  
});
app.post("/v2-2", (req, res)=> {

  if( !req.session.guesses) {
    req.session.guesses = [];
  }

  let secretWord = "hebrews".toUpperCase();
  // console.log(result);
  res.render('v2-2', {guesses: req.session.guesses, secretWord: secretWord}) ;
});

app.post("/v2-3", (req, res)=> {

  if( !req.session.guesses) {
    req.session.guesses = [];
  }

  let secretWord = "hebrews".toUpperCase();
  // console.log(result);
  res.render('v2-3', {guesses: req.session.guesses, secretWord: secretWord}) ;
});


const port = process.env.PORT || 3000;
const hostname = process.env.hostname || "localhost";

app.listen(port, () => {
  console.log(`Running server on http://${hostname}:${port}`);
});

