// server.js
// where your node app starts
// first you have to make sure node and npm are installed..

// To launch the program in node:
// 1) CD inside the project folder on terminal,
// >>> in terminal: cd [dragDropRepoFolderHere]

// 2) Do an npm install for installing all the project dependencies
// >>> in terminal: npm install

// 3) Then npm start OR node app.js
// >>> in terminal: npm start


// init project
var express = require('express');
// setup a new database
var Datastore = require('nedb'),
  // Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
  // which doesn't get copied if someone remixes the project.
  db = new Datastore({
    filename: '.data/datafile',
    autoload: true
  });
const path = require('path')
var app = express();

// default user list
var users = [{
    "firstName": "John",
    "lastName": "Hancock"
  },
  {
    "firstName": "Liz",
    "lastName": "Smith"
  },
  {
    "firstName": "Ahmed",
    "lastName": "Khan"
  }
];

db.count({}, function(err, count) {
  console.log("There are " + count + " users in the database");
  if (err) console.log("There's a problem with the database: ", err);
  else if (count <= 0) { // empty database so needs populating
    // default users inserted in the database
    db.insert(users, function(err, usersAdded) {
      if (err) console.log("There's a problem with the database: ", err);
      else if (usersAdded) console.log("Default users inserted in the database");
    });
  }
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/users", function(request, response) {
  var dbUsers = [];
  db.find({}, function(err, users) { // Find all users in the collection
    users.forEach(function(user) {
      dbUsers.push([user.firstName, user.lastName]); // adds their info to the dbUsers value
    });
    response.send(dbUsers); // sends dbUsers back to the page
  });
});

// creates a new entry in the users collection with the submitted values
app.post("/users", function(request, response) {
  db.insert({
    firstName: request.query.fName,
    lastName: request.query.lName
  }, function(err, userAdded) {
    if (err) console.log("There's a problem with the database: ", err);
    else if (userAdded) console.log("New user inserted in the database");
  });
  response.sendStatus(200);
});

// removes entries from users and populates it with default users
app.get("/reset", function(request, response) {
  // removes all entries from the collection
  db.remove({}, {
    multi: true
  }, function(err) {
    if (err) console.log("There's a problem with the database: ", err);
    else console.log("Database cleared");
  });
  // default users inserted in the database
  db.insert(users, function(err, usersAdded) {
    if (err) console.log("There's a problem with the database: ", err);
    else if (usersAdded) console.log("Default users inserted in the database");
  });
  response.redirect("/");
});

// removes all entries from the collection
app.get("/clear", function(request, response) {
  db.remove({}, {
    multi: true
  }, function(err) {
    if (err) console.log("There's a problem with the database: ", err);
    else console.log("Database cleared");
  });
  response.redirect("/");
});

// listen for requests :) >> this is where you can preview app locally
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening at http://localhost:' + listener.address().port);
});
