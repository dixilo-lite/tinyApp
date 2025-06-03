const getUserbyEmail= (email, user) => {
  let found;
  let key = Object.keys(user);
  
  for (const users of key)
  {  
    if(email === user[users].email){

      found = user[users].id;
    }
  }

  return found;
};

const generateRandomString= () => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result='';
  for (let i = 0; i <  6; i ++)
  {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const urlsForUser = (id , urlDatabase) =>{
  let personalizedUrlList={};
  for (const url in urlDatabase)
  {
    if(urlDatabase[url].userID === id)
    {
      const shortKey={
        longURL:urlDatabase[url].longURL,
        userID: urlDatabase[url].userID,
      }
      personalizedUrlList[url] = shortKey;
    }
  }
return personalizedUrlList;
}

const findUserID = (email,users) =>{

  for (const user in users) {
    if(users[user].email === email){
      return user;
    }
  }
  return false;
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

module.exports= {getUserbyEmail, generateRandomString, urlsForUser, findUserID };