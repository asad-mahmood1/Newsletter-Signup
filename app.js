//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
   var firstName = req.body.first;
   var lastName = req.body.last;
   var email = req.body.email;

   var data = {
     members: [
       {
         email_address: email,
         status: "subscribed",
         merge_fields: {
           FNAME: firstName,
           LNAME: lastName
         }
       }
     ]
   };

   var jsonData = JSON.stringify(data);

   var options = {
     url: "https://us20.api.mailchimp.com/3.0/lists/17b25c43b1",
     method: "POST",
     headers: {
       "Authorization": "username 3cecb1372e8ba6a55d5e2ac4eb4734a3-us20"
     },
     body: jsonData
   };

   request(options, function(error, response, body){
      if (error){
        res.sendFile(__dirname + "/failure.html");
      } else {
        if (response.statusCode === 200){
          res.sendFile(__dirname + "/success.html");
        }
        else {
          res.sendFile(__dirname + "/failure.html");
        }
      }
   });

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
