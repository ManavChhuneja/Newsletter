require("dotenv").config();
const express = require("express");
const axios = require("axios");
const request = require("request");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
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
  const apiKey = process.env.API_KEY;
  const listId = process.env.LIST_ID;
  const serverPrefix = process.env.SERVER_PREFIX;
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;

  axios({
    method: "post",
    url: url,
    data: jsonData,
    headers: {
      "Content-Type": "application/json",
      Authorization: `apikey ${apiKey}`,
    },
  })
    .then((response) => {
      console.log("User subscribed successfully", response);
      res.sendFile(__dirname + "/success.html");
    })
    .catch((error) => {
      console.error("Error subscribing user ", error);
      res.sendFile(__dirname + "/failure.html");
    });
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
