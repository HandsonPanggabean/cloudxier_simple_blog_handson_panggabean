const axios = require('axios')
const formData = require('form-data')

async function imageKit(req, res, next) {
  try {
    if (req.file) {
      const form = new formData()
      const fileEncode = req.file.buffer.toString("base64")
      form.append('file', fileEncode)
      form.append('fileName', req.file.originalname)
      const privateKey = Buffer.from(process.env.IMAGE_KIT_PRIVAT_KEY + ':').toString("base64") // gaperlu new karna si Buffer tsbt static
      const uploader = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        form,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: `Basic ${privateKey}`
          }
        }
      )
      // console.log(uploader.data.url);
      req.body.imgUrl = uploader.data.url
      next()
    } else {
      throw ({ name: "Image is required" })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = imageKit