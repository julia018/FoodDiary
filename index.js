const express = require('express')
const path = require('path')
const app = express()
app.set("views", path.join(__dirname, "views"));
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.set("view engine", "pug");
const port = 3000

app.get("/", (req, res) => {
  console.log("start");
  res.render("main");
});



app.post('/addBreakfast', (req, res) => {
  console.log("addBreakfast request")
  console.log(req.body)
  console.log(req.body.weight)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))