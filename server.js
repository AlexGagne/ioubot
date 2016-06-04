// Required for Rest API
var express = require('express');
var app = express();

/ This responds a POST request for the homepage
app.post('/api/create-event', function (req, res) {
   console.log("Got a POST request for the homepage");

   // Prepare output in JSON format
   response = {
       first_name:req.body.first_name,
       last_name:req.body.last_name
   };
   console.log(response);
   res.send(JSON.stringify(response));
});

app.get('/api/test', function(req, res)
{
    res.send('Test Sucessful!');
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});