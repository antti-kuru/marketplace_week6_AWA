import multer, {StorageEngine, Multer} from "multer"
import path from 'path'
import {v4 as uuidv4} from "uuid"



const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {

        console.log("Ollaako")
        const extension = path.extname(file.originalname)
        const originalFilename = path.basename(file.originalname, extension)
        const id = uuidv4()

      cb(null, `${originalFilename}_${id}${extension}`)
    }
  })
  
  const upload: Multer = multer({ storage: storage })


  export default upload