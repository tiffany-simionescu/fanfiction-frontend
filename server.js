dotenv.config();

// Dependencies
var express = require('express');
var request = require('superagent');

var app = express();

// View Engine and default directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

// Directory to serve static assets
app.use(express.static(__dirname + '/public'));

var authData = {
  client_id: process.env.NON_INTERACTIVE_CLIENT_ID,
  client_secret: process.env.NON_INTERACTIVE_CLIENT_SECRET,
  grant_type: 'client_credentials',
  audience: 'longmire.com'
}

// Middleware
function getAccessToken(req, res, next) {
  request
    .post('dev-nur3x3bv.us.auth0.com/oauth/token')
    .send(authData)
    .end(function(err, res) {
      if (req.body.access_token) {
        req.access_token = res.body.access_token;
        next();
      } else {
        res.send(401, 'Unauthorized');
      }
    })
}

// Root Endpoint
app.get('/', (req, res) => {
  res.render('index');
})

// Fanfiction Endpoint
app.get('/fanfiction', getAccessToken, (req, res) => {
  request
    .get('http://localhost:8080/fanfiction')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var fanfictions = data.body;
        res.render('fanfictions', {fanfictions: fanfictions});
      }
    })
})

// Author Endpoint
app.get('/author', getAccessToken, (req, res) => {
  request
    .get('http://localhost:8080/author')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var authors = data.body;
        res.render('authors', {authors: authors});
      }
    })
})

// Category Endpoint
app.get('/category', getAccessToken, (req, res) => {
  request
    .get('http://localhost:8080/category')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var categories = data.body;
        res.render('categories', {categories: categories});
      }
    })
})

// Pending Endpoint
app.get('/pending', getAccessToken, (req, res) => {
  request
    .get('http://localhost:8080/pending')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      }
    })
})

app.listen(3000);