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

module.exports ={urlsForUser};