const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require ("bcryptjs");
const {getUserbyEmail} = require("./helper")
const {findUserID} = require("./findUserID");
const {urlsForUser} = require("./urlsForUser");
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
  aJ48lW: {
    id: "aJ48lW",
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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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
  const hashedPassword = users[id].hashedPassword;


  if(!foundUser || bcrypt.compareSync(password,hashedPassword) === false)
  {
    res
    .status(403)
    .send("Please enter a valid email or password");
  } else if (foundUser  && bcrypt.compareSync(password,hashedPassword)) {
    res.cookie('user_id',id);
    res.redirect("/urls");
  }
});

app.get("/urls", (req,res) => {
  const id = req.cookies.user_id;
  const personalizedUrlList = urlsForUser(id,urlDatabase);
  if(id){

  const templateVars = {
    id,
    urls: personalizedUrlList,
    user: users[id],
    email: users[id].email,
  }; 
  res.render("urls_index",templateVars);
} else {
  
  res.send("Please login to view shortened urls");
}
//res.render("urls_index",templateVars);
});

app.post("/urls", (req,res) => {
  let id =req.cookies.user_id;
  if(!id)
  {
    res.send("Please login to see shorten urls");
  } else {
  let shortKey= generateRandomString();
  const newLongUrl= req.body.longURL;
  urlDatabase[shortKey]={};
  urlDatabase[shortKey].longURL= newLongUrl;
  res.redirect(`/urls/${shortKey}`);
  }
});

app.get("/urls/new", (req,res) => {
  const id = req.cookies.user_id;
  if(id){
   const templateVars = {
    id,
    urls: urlDatabase,
    user: users[id],
    email: users[id].email,
  };
  res.render("urls_new",templateVars);
} else {
  res.redirect("/login");
}
});

app.get("/register",(req,res) => {
  const id = req.cookies.user_id;
  const templateVars= {id};
  res.render("register",templateVars);
});

app.post("/register", (req,res) => {

  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password,10);
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
    hashedPassword,
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
  if(!urlDatabase[id])
    {
      return res.send('You do not have access to this url.');
    }
  if (urlDatabase[id].userID !== user_ID) {
    res.send("You do not own a url with this ID");
  }
  if(!user_id){
    res.send("Please log in to view the url");
  } else {
   const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    email: users[user_id].email,
  
  }
   res.render("urls_show",templateVars);
}
});

app.get("/u/:id", (req,res) => {
  let id = req.params.id;

  if(!urlDatabase[id]){
    return res.send('Not a valid short code');
  }
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req,res) =>
{ 
  const user_ID = req.cookies.user_id;
  const id = req.params.id;
  if(!id)
  {
    res.send("ID doesn't exist");
  } else if(!user_ID) {
    res.send("Please login first");
  } else if (urlDatabase[id].userID !== user_ID) {
    res.send("You do not own a url with this ID");
  } else {
 
  delete urlDatabase[id];
  res.redirect('/urls');
  }
});

app.post("/urls/:id/edit", (req,res) => {
  const user_ID = req.cookies.user_id;
  const id = req.params.id;
  if(!id)
  {
    res.send("ID doesn't exist");
  } else if(!user_ID) {
    res.send("Please login first");
  } else if (urlDatabase[id].userID !== user_ID) {
    res.send("You do not own a url with this ID");
  } else {
  urlDatabase[id].longURL= req.body.url;
  console.log(req.body.url);
   res.redirect(`/urls/${id}`);
  }
});

app.post("/logout", (req,res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
})

app.set("view engine","ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

