const qrencode = require("qr-encode");
const exp = require("express");
const app = require("express")();

app.use(exp.json());

app.get("", (req, res) => res.json(qrencode("Hello", {level: "L"})))

app.listen(5000);
