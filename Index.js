const express = require("express");
const multer = require("multer");
const uuid = require("uuid");
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${uuid.v4()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

let files = [];

app.post("/upload", upload.single("file"), (req, res) => {
  files.push({ id: req.file.filename, name: req.file.originalname });
  res.json(files);
});

app.get("/download/:id", (req, res) => {
  const file = files.find((file) => file.id === req.params.id);
  if (file) {
    res.download(`uploads/${file.id}`, file.name);
  } else {
    res.status(404).send("File not found");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
