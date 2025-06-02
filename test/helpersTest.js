const { assert } = require('chai');

const { getUserbyEmail } = require('../helpers.js');
const { urlsForUser } = require('../urlsForUser.js');
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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserbyEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
      console.log(user);
      console.log(expectedUserID);
      assert.deepEqual(user,expectedUserID);
    
  });

});

describe('getUserByEmail', function() {
  it('should return undefined with invalid email', function() {
    const user = getUserbyEmail("user@example.co", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
      console.log(user);
      console.log(expectedUserID);
      assert.deepEqual(user,undefined);
    
  });
});

describe('urlsForUser', () => {
  const urlDatabase = {
    'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'user123' },
    '9sm5xK': { longURL: 'http://www.google.com', userID: 'user456' },
    '3fe1Zx': { longURL: 'http://www.example.com', userID: 'user123' }
  };

  it('should return urls that belong to the specified user', () => {
    const result = urlsForUser('user123', urlDatabase);
    const expected = {
      'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'user123' },
      '3fe1Zx': { longURL: 'http://www.example.com', userID: 'user123' }
    };
    assert.deepEqual(result, expected);
  });

  it('should return an empty object if the urlDatabase does not contain any urls for the specified user', () => {
    const result = urlsForUser('nonexistentUser', urlDatabase);
    assert.deepEqual(result, {});
  });

  it('should return an empty object if the urlDatabase is empty', () => {
    const result = urlsForUser('user123', {});
    assert.deepEqual(result, {});
  });

  it('should not return any urls that do not belong to the specified user', () => {
    const result = urlsForUser('user456', urlDatabase);
    const expected = {
      '9sm5xK': { longURL: 'http://www.google.com', userID: 'user456' }
    };
    assert.deepEqual(result, expected);
    assert.notProperty(result, 'b2xVn2');
    assert.notProperty(result, '3fe1Zx');
  });
});