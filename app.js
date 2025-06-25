const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
// const path = require("path");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // const path = require("path");
  // res.sendFile(__dirname, +"/signup.html");
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/bcc3a4b6b0";

  const options = {
    method: "POST",
    auth: "codex:6b8b54a288c67746878da22249a4ae32-us14",
  };

  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

  console.log(firstName, lastName, email);

  if (res.statusCode === 200) {
    res.sendFile(__dirname + "/success.html");
  } else if (res.statusCode !== 200) {
    res.sendFile(__dirname + "/failure.html");
  }

  // res.send("Thanks for signing up");
});

app.listen(4444, () => {
  console.log("server is following my lead on port 4444");
});

// 6b8b54a288c67746878da22249a4ae32-us14

// bcc3a4b6b0
