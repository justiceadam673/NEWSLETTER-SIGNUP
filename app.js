const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
// const path = require("path");
const https = require("https");
require("dotenv").config();

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

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;

  const options = {
    method: "POST",
    auth: `codex:${apiKey}`,
  };

  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
      console.log(response.statusCode);
    });
  });

  if (res.statusCode === 200) {
    res.sendFile(__dirname + "/success.html");
    console.log(res.statusCode);
  } else {
    res.sendFile(__dirname + "/failure.html");
    console.log(res.statusCode);
  }

  request.write(jsonData);
  request.end();

  console.log(firstName, lastName, email);

  // res.send("Thanks for signing up");
});

app.listen(4444, () => {
  console.log("server is following my lead on port 4444");
});
