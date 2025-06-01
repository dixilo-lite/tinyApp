const express = require("express");
const app = express();
const PORT = 8080;
const {getUserbyEmail} = require("./helper")
const {findUserID} = require("./findUserID");
var cookieParser = require('cookie-parser');

// middleware
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

//generates random 6 character string
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



app.get("/",(req,res) => {
  res.send("Hello!");
});

app.get("/login",(req,res) => {
  const id = req.cookies.user_id;
  // if there's an existing user, pass the email and id of the user
  if(id){
    const templateVars= {id, 
    email: users[id].email};
    res.render("login", templateVars);
  } else {
    const templateVars= {id};
    res.render("login", templateVars);
  }
});

app.post("/login", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = findUserID(email,users);
  const foundUser= getUserbyEmail(email,users);
  const userEmail = users[id].email;
  const userPassword = users[id].password;

  if(!foundUser || userEmail !== email || userPassword !== password)
  {
    res
    .status(403)
    .send("Please enter a valid email or password");
  } else if (foundUser && userEmail === email && userPassword === password) {
    res.cookie('user_id',id);
    res.redirect("/urls");
  }
});

app.get("/urls", (req,res) => {
  const id = req.cookies.user_id;
  if(id){
  const templateVars = {
    id,
    urls: urlDatabase,
    user: users[id],
    email: users[id].email,
  };
  
  res.render("urls_index",templateVars);
} else {
  res.send("Please login to see your list of URLS");
}

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
    id,
    urls: urlDatabase,
    user: users[id],
    email: users[id].email,
  };
  res.render("urls_new",templateVars);
});

app.get("/register",(req,res) => {
  const id = req.cookies.user_id;
  const templateVars= {id};
  res.render("register",templateVars);
});

app.post("/register", (req,res) => {

  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password){
    return res
    .status(400)
    .send("Please provide an email and password before you proceed");
  }
  let foundUser = getUserbyEmail(email,users)

  if(foundUser){
    return res.status(400).send("User with email exists");
  }
  const id =generateRandomString();

  users[id] = {
    id,
    email,
    password,
  };

  
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



app.post("/logout", (req,res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
})

app.set("view engine","ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

