const response = require('./response.js');
const express = require('express')
const server = express();
const cors = require('cors')
const bodyparser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inforsa'
});

server.use(cors());
server.use(bodyparser.urlencoded({ extended: true }));
server.use(express.json());

const storage = multer.diskStorage({
destination: function (req, file, cb) {
  cb(null, './public/uploads');
},
filename: function (req, file, cb) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
}
});

const upload = multer({ storage: storage });

server.post('/api/insert', upload.single('Gambar'), (req, res) => {
  const { Judul, Waktu, Depart, Isi } = req.body;
  const Gambar = req.file.filename; 
  const ID_AdminValue = 6; 

  const sqlInsert = `INSERT INTO artikel (ID_Admin, Judul, Waktu, Depart, Gambar, Isi) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [ID_AdminValue,Judul, Waktu, Depart, Gambar, Isi];

db.query(sqlInsert, values, (err, fields) => {
  if (err) {
    console.error('Error = ',err);
    res.status(500).send('Gagal menyimpan data.');
  } else {
    if (fields.affectedRows) {
      response(200, "INI INSERT", "BERHASIL", res);
    } else {
      console.log("Gagal menyimpan data.");
    }
    console.log(fields);
  }
});
});

server.get('/api/get', (req, res) => {
  const sqlSelect = "SELECT * FROM artikel";
  db.query(sqlSelect, (err, result) => {
      res.send(result);
  });
});

server.get('/api/getAcc', (req, res) => {
  const sqlSelect = "SELECT * FROM admin";
  db.query(sqlSelect, (err, result) => {
      res.send(result);
  });
});

db.connect((err) => {
  if (err) throw err;
  console.log("Sukses terhubung");
  server.get("/", (req, res) => {
      res.send("OK");
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
