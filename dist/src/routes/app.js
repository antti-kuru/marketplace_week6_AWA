"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Offer_1 = require("../models/Offer");
const Image_1 = require("../models/Image");
const multer_config_1 = __importDefault(require("../middleware/multer-config"));
const router = (0, express_1.Router)();
router.post("/upload", multer_config_1.default.single("image"), async (req, res) => {
    try {
        const { title, price, description } = req.body;
        // Either there is image or not
        let imageId;
        if (!title || !price || !description) {
            res.status(400).json({ message: "Some required field is missing" });
        }
        console.log(req.file);
        if (req.file) {
            const imgPath = req.file.path.replace("public", "");
            const image = new Image_1.Image({
                filename: req.file.filename,
                path: imgPath
            });
            const uploadedImage = await image.save();
            imageId = uploadedImage._id.toString();
        }
        const offer = new Offer_1.Offer({
            title: title,
            price: price,
            description: description,
            imageId: imageId || undefined
        });
        offer.save();
        res.status(201).json({ message: "Offer saved" });
    }
    catch (error) {
        res.status(404).json({ message: "Error happened" });
    }
});
router.get("/offers", async (req, res) => {
    try {
        const offers = await Offer_1.Offer.find();
        const imageOffers = await Promise.all(offers.map(async (offer) => {
            let image = null;
            if (offer.imageId) {
                image = await Image_1.Image.findById(offer.imageId);
                console.log(image);
            }
            return {
                title: offer.title,
                description: offer.description,
                price: offer.price,
                imagePath: image ? image.path : null
            };
        }));
        res.status(200).json(imageOffers);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
