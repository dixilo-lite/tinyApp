const express = require("express");
const app = express();
const PORT = 8080;

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
  const templateVars = {urls: urlDatabase};
  res.render("urls_index",templateVars);
});

app.post("/urls", (req,res) => {
  let shortKey= generateRandomString();
  const newLongUrl= req.body.longURL;
  urlDatabase[shortKey]= newLongUrl;
  res.redirect(`/urls/${shortKey}`);
});

app.get("/urls/new", (req,res) => {
  res.render("urls_new");
});

app.get("/hello",(req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:id", (req,res) => {
  let id = req.params.id;
  if(!urlDatabase[id])
  {
    return res.send('Not a valid short code.');
  }
  const templateVars = {id: req.params.id,longURL: urlDatabase[req.params.id]};

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

app.set("view engine","ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

