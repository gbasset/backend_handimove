const express = require('express')
const morgan = require('morgan')
const app = express();
const port = 4000;
const route = require("./routes/index")
const connection = require('./conf')
const bodyParser = require('body-parser')

// morgan error support
app.use(morgan('dev'))
// Support JSON-encoded bodies
app.use(bodyParser.json());
// Support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use("/messages", route.messages)
app.use("/search", route.searchEstablishments)
app.use("/searchby", route.city)
app.use("/admin", route.admin)
app.use("/admusers", route.adminUsers)
app.use("/comments", route.comments)
app.use("/fav", route.fav)
app.use("/users", route.users)

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});