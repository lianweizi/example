const express = require('express');
const router = express.Router()
const multer = require('multer')

router.get("/", (req, res) => {
    res.send("访问用户路由成功")
})

//路由存放地址
const upload = multer({ dest: __dirname + "/../uploads" })
//上传图片路由 
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        let file = req.file;
        let model = {
            Url: "http://localhost:4399/uploads/" + file.filename,
            urlName: file.originalname
        }
        return res.status(200).send(model)
    }
    catch(err){
        return res.status(422).send({err})
    }

})
module.exports = router