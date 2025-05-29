const getUserbyEmail= (email, user) => {
  let found= null;
  let key = Object.keys(user);
  console.log(user.userRandomID.email);
  
  for (const users of key)
  {  
    if(email === user[users].email){
      console.log(user[users].email);
      found = true;
    }
  }

  return found;
};

module.exports= {getUserbyEmail};