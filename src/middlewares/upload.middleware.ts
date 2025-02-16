import multer from "multer"
import path from "path"
import fs from "fs"
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const imagePath = path.join("uploads",file.originalname)
      if(fs.existsSync(imagePath)){
      }
        cb(null, file.originalname)  
    }
  })
   
  var upload = multer({ storage: storage })

  export default upload;