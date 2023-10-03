const express = require('express');
const router = express.Router();
const multer = require("multer");
const methodOverride = require('method-override');
const authController = require('../controllers/authController');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images/users");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
});
  
const upload = multer({ storage: storage });


router.get('/login', authController.login);

router.get('/profile', authController.profile);

router.get('/register', authController.register);

//upload.single('img')
router.post('/register', upload.single('img'), authController.doRegister);
// router.post('/register', upload.any(), authController.rr);


router.post('/login', authController.doLogin);

router.post('/logout', authController.doLogout);

module.exports = router;