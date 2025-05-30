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

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.use(express.urlencoded({extended:false}));

app.get("/",(req,res) => {
  res.send("Hello!");
});

app.get("/urls", (req,res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
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
   const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_new",templateVars);
});

app.get("/hello",(req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:id", (req,res) => {
  let id = req.params.id;
  let keys = Object.keys(urlDatabase);
  if(!urlDatabase[id])
  {
    return res.send('Not a valid short code.');
  }
  const templateVars = {id: req.params.id,longURL: urlDatabase[req.params.id],username: req.cookies["username"]};

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
  const user = req.body.username;
  res.cookie('username',user);
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie('username');
  res.redirect("/urls");
})

app.set("view engine","ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

