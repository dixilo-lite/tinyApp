const express = require("express");
const app = express();
const PORT = 8080;
var cookieParser = require('cookie-parser');

app.use(cookieParser());

function generateRandomString() {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result='';
  for (let i = 0; i <  6; i ++)
  {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.use(express.urlencoded({extended:false}));

app.get("/",(req,res) => {
  res.send("Hello!");
});

app.get("/urls", (req,res) => {
  const id = req.cookies.user_id;
  const templateVars = {
    urls: urlDatabase,
    user: users[id],
  };
  res.render("urls_index",templateVars);
});

app.post("/urls", (req,res) => {
  let shortKey= generateRandomString();
  const newLongUrl= req.body.longURL;
  urlDatabase[shortKey]= newLongUrl;
  res.redirect(`/urls/${shortKey}`);
});

app.get("/urls/new", (req,res) => {
  const id = req.cookies.user_id;
   const templateVars = {
    urls: urlDatabase,
    user: users[id],
  };
  res.render("urls_new",templateVars);
});

app.get("/register",(req,res) => {
  res.render("register");
});

app.post("/register", (req,res) => {
  const id =generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password){
    return res.status(400).send("Please provide an email and password before you proceed");
  }
  const newUser ={
    id,
    email,
    password,
  };
  users[id] = newUser;
  
  res.cookie("user_id",id);
  res.redirect("/urls");
});
app.get("/hello",(req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:id", (req,res) => {
  let id = req.params.id;
  let user_id = req.cookies.user_id;
  let keys = Object.keys(urlDatabase);
  if(!urlDatabase[id])
  {
    return res.send('Not a valid short code.');
  }
  const templateVars = {id: req.params.id,longURL: urlDatabase[req.params.id], user:users[user_id]};

  res.render("urls_show",templateVars);
})

app.get("/u/:id", (req,res) => {
  let id = req.params.id;

  if(!urlDatabase[id]){
    return res.send('Not a valid short code');
  }
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req,res) =>
{
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

app.post("/urls/:id/edit", (req,res) => {
  const id = req.params.id;
  urlDatabase[id]= req.body.url;
  console.log(req.body.url);
   res.redirect(`/urls/${id}`);
});

app.post("/login", (req,res) => {
  const user = req.body.email;
  res.cookie('email',user);
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie('email');
  res.redirect("/urls");
})

app.set("view engine","ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

