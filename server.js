const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const middleware = require("./middleware");

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "kuchbhi",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.send("working");
});

app.get("/api/agora-call/token", middleware, (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const channel = req.query.channel;
  if (!channel) {
    return res.status(500).json({ error: "channel name missing" });
  }
  let uid = req.query.uid;
  if (!uid || uid == "") {
    uid = 0;
  }
  let role = RtcRole.SUBSCRIBER;
  if (req.query.role == "publisher") {
    role = RtcRole.PUBLISHER;
  }
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == "") {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.APP_ID,
    process.env.APP_CERTIFICATE,
    channel,
    uid,
    role,
    expireTime
  );
  return res.json({ token: token });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is runing on ${port}`);
});
