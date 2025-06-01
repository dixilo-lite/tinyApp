const findUserID = (email,users) =>{

  for (const user in users) {
    if(users[user].email === email){
      console.log(user);
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

findUserID("user@example.com",users);

module.exports = {findUserID};
