const PORT = 4011;
const express = require("express");
const { cookie } = require("express/lib/response");
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api", (req, res) => {
  setTimeout(() => res.json({ message: "Hello from server" }), 1000);
});

app.post("/api", (req, res) => {
  console.log(req.body);
  res.send("/");
});

app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
