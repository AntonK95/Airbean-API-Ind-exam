import { Router } from "express";
import { menuDB, offersDB } from "../server.js";
import offerSchema from "../models/offersModel.js";


const router = Router();

router.post('/', async (req, res, next) => {
    const { error } = offerSchema.validate(req.body);

    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { products, offer } = req.body;

    try {
        // Kontrollera så att produkterna finns i menuDB
        const productExist = await Promise.all(products.map(async (product) => {
            const item = await menuDB.findOne({ title: product });
            return item !== null;
        }));
        // Finna inte en produkt skicka felmeddelande
        if(productExist.includes(false)) {
            return res.status(404).json({ message: 'One or more products does not exist' });
        }
        // Annars lägg till i offersDB
        const newOffer = { products, offer };
        const savedOffer = await offersDB.insert(newOffer);

        res.status(201).json(savedOffer);

    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }

});

export default router;