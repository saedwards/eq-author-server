// Set up Express server
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var ejs = require("ejs");

const url = process.env.SLACK_WEBHOOK_URL;
const IncomingWebhook = require("@slack/client").IncomingWebhook;

console.log(url);

const webhook = new IncomingWebhook(url);

app.set("port", process.env.PORT || 8050);
app.set("view engine", "html");
app.set("views", "src");
app.engine("html", ejs.renderFile);

var staticFolder = ".";
app.use(express.static(staticFolder));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var server = app.listen(app.get("port"), function () {
  console.log(
    "Express server running on http://localhost:" + server.address().port
  );
});

app.post("/api/slack", function (req, res) {
  console.log(req.body);

  webhook.send(req.body.attachments[0].text, function(
    slackError,
    slackResponse
  ) {
    if (slackError) {
      console.log("Error:", slackError);
    } else {
      console.log("Message sent: ", slackResponse);
    }
    res.send("finished");
  });
});
