import {Request, Response, Router} from "express"
import {Offer, IOffer} from "../models/Offer"
import {Image, IImage} from "../models/Image"
import upload from "../middleware/multer-config"

const router: Router = Router()


router.post("/upload" , upload.single("image"), async (req: Request, res: Response) => {

    try {
       
        const {title, price, description} = req.body

        // Either there is image or not
        let imageId : string | undefined

        if (!title || !price || !description ) {
            res.status(400).json({message: "Some required field is missing"})
        }


        console.log(req.file)
        if (req.file) {
            const imgPath: string = req.file.path.replace("public", "")
            const image: IImage = new Image ({
                filename: req.file.filename,
                path: imgPath
            })
          
            const uploadedImage = await image.save()
            imageId = uploadedImage._id.toString()
        }
        const offer : IOffer = new Offer ({
            title: title,
            price: price,
            description: description,
            imageId : imageId || undefined
        })

        offer.save()
        res.status(201).json({message: "Offer saved"})
    
    } catch (error) {
        res.status(404).json({message: "Error happened"})
    }
})



router.get("/offers", async (req: Request, res: Response) => {

    try {
      
        const offers: IOffer[] | null = await Offer.find()

        const imageOffers = await Promise.all(
            offers.map(async (offer) => {
                let image = null
                if (offer.imageId) {
                    image = await Image.findById(offer.imageId)
                    console.log(image)
                }

                return {
                    title: offer.title,
                    description: offer.description,
                    price: offer.price,
                    imagePath: image ? image.path : null
                }
            })
        )

        res.status(200).json(imageOffers)

    } catch (error: any) {
        console.log(error)        
    }

})










export default router