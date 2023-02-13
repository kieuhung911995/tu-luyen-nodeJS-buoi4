const { urlencoded } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("./user.schema");
const { token } = require("morgan");

const app = express();
const port = 3000;

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.get("/ping", async (req, res) => {
  try {
    res.status(200).send("Kiem tra trang thai");
  } catch (error) {}
});

app.post("/login", async (req, res) => {
  try {
    const findUser = userModel.findOne({ username: `${req.body.username}` });
    const doc = await findUser.exec();
    if (!doc) {
      res.status(400).send("ko ton tai user nay");
    } else {
      //so sanh pass da ma hoa
      bcrypt.compare(req.body.password, doc.password, function (err, result) {
        if (!result) {
          res.status(404).send("sai password");
        } else {
          const token = jwt.sign(
            { username: `${doc.username}` },
            "afjjsahjfhjkas"
          );
          res.send(token);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    //ma hoa email
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const user = await userModel.create({
      username: `${req.body.username}`,
      password: `${hashPass}`,
    });
    res.send(user);
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
