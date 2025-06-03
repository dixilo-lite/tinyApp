const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require("bcryptjs");
const {getUserbyEmail, generateRandomString, urlsForUser, findUserID} = require("./helpers");
var cookieSession = require('cookie-session');
const {users, urlDatabase} = require("./database.js");

// middleware

app.use(cookieSession({
  name:'session',
  keys:['key1','key2']
}));
app.use(express.urlencoded({extended:false}));
app.set("view engine","ejs");

app.listen(PORT, () => {
});


app.get("/",(req,res) => {
  const id = req.session.user_id;
  if (id) {
    res.redirect("/urls");
  } else {
    const templateVars = {id};
    res.render("login", templateVars);
  }
});

app.get("/login",(req,res) => {
  const id = req.session.user_id;
  // if there's an existing user, pass the email and id of the user
  if (id) {
    const templateVars = {id,
      email: users[id].email};
    res.render("login", templateVars);
  } else {
    const templateVars = {id};
    res.render("login", templateVars);
  }
});

app.post("/login", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = findUserID(email,users);
  const foundUser = getUserbyEmail(email,users);
  const hashedPassword = users[id].hashedPassword;
  const passwordCompare = bcrypt.compareSync(password,hashedPassword);

  if (!foundUser || passwordCompare === false) {
    res
      .status(403)
      .send("Please enter a valid email or password");
  }
  if (foundUser  && passwordCompare) {
    req.session.user_id = id;
    res.redirect("/urls");
  }
});


app.get("/urls", (req,res) => {
  const id = req.session.user_id;
  const personalizedUrlList = urlsForUser(id,urlDatabase);
  // if there is a session, show the email of the user
  if (id) {
    const templateVars = {
      id,
      urls: personalizedUrlList,
      user: users[id],
      email: users[id].email,
    };
    res.render("urls_index",templateVars);
  }
  if (!id) {
    res.send("Please login to view shortened urls");
  }

});

app.post("/urls", (req,res) => {
  let id = req.session.user_id;
  if (!id) {
    res.send("Please login to see shorten urls");
  }
  
  if (id) {
    let shortKey = generateRandomString();
    const newLongUrl = req.body.longURL;
    urlDatabase[shortKey] = {};
    urlDatabase[shortKey].longURL = newLongUrl;
    urlDatabase[shortKey].userID = id;
    res.redirect(`/urls/${shortKey}`);
  }
});

app.get("/urls/new", (req,res) => {
  const id = req.session.user_id;
  if (id)  {
    const templateVars = {
      id,
      urls: urlDatabase,
      user: users[id],
      email: users[id].email,
    };
    res.render("urls_new",templateVars);
  }
  if (!id) {
    res.redirect("/login");
  }
});


app.get("/register",(req,res) => {
  const id = req.session.user_id;
  const templateVars = {id};

  res.render("register",templateVars);
});

app.post("/register", (req,res) => {

  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password,10);
  if (!email || !password)  {
    return res
      .status(400)
      .send("Please provide an email and password before you proceed");
  }
  
  let foundUser = getUserbyEmail(email,users);

  if (foundUser) {
    return res.status(400).send("User with email exists");
  }
  //generates new user if there isn't an existing user
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    hashedPassword,
  };
  req.session.user_id = id;
  res.redirect("/urls");
});


app.get("/urls/:id", (req,res) => {
  let id = req.params.id;
  let user_id = req.session.user_id;
  //invalid url id
  if (!urlDatabase[id])  {
    return res.send('You do not have access to this url.');
  }
  //users doesn't own the url id
  if (urlDatabase[id].userID !== user_id) {
    res.send("You do not own a url with this ID");
  }
  //not logged in
  if (!user_id)  {
    res.send("Please log in to view the url");
  }
  if (user_id) {
    const templateVars = {
      id: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      email: users[user_id].email,
  
    };
    res.render("urls_show",templateVars);
  }
});

app.get("/u/:id", (req,res) => {
  let id = req.params.id;

  if (!urlDatabase[id]) {
    return res.send('Not a valid short code');
  }
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req,res) => {
  const user_ID = req.session.user_id;
  const id = req.params.id;
  if (!id) {
    res.send("ID doesn't exist");
  }
  if (!user_ID) {
    res.send("Please login first");
  }
  if (urlDatabase[id].userID !== user_ID) {
    res.send("You do not own a url with this ID");
  } else {
    delete urlDatabase[id];
    res.redirect('/urls');
  }
});

app.post("/urls/:id/edit", (req,res) => {
  const user_ID = req.session.user_id;
  const id = req.params.id;
  if (!id) {
    res.send("ID doesn't exist");
  }
  if (!user_ID) {
    res.send("Please login first");
  }
  if (urlDatabase[id].userID !== user_ID) {
    res.send("You do not own a url with this ID");
  }
  if (urlDatabase[id].userID === user_ID) {
    urlDatabase[id].longURL = req.body.url;
    res.redirect(`/urls/${id}`);
  }
});

app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect("/login");
});



