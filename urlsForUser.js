const urlsForUser = (id , urlDatabase) =>{
  let personalizedUrlList={};
  for (const url in urlDatabase)
  {
    console.log(`this is the url ${url}`);
    console.log(`this is the id of the url ${JSON.stringify(urlDatabase[url])}`);
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

const urlDatabase = {
    'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userId: 'user123' },
    '9sm5xK': { longURL: 'http://www.google.com', userId: 'user456' },
    '3fe1Zx': { longURL: 'http://www.example.com', userId: 'user123' }
  };

const result = urlsForUser('user123', urlDatabase)

console.log(result);
module.exports ={urlsForUser};