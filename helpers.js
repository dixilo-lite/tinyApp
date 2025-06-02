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

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

console.log(getUserbyEmail("user@example.co", testUsers));

module.exports= {getUserbyEmail, generateRandomString };