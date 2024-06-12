import { Router } from "express";
// import productSchema from "../models/productModel.js";
import updateMenuItemSchema from "../models/updateMenuItemModel.js";
import { menuDB } from "../server.js";
import validate from "../middlewares/validate.js";
import getTimeStamp from "../utilities/timeStamp.js";

const router = Router();

router.put('/', validate(updateMenuItemSchema), async (req, res, next) => {
    try {
        const { error } = updateMenuItemSchema.validate(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const { id, title, desc, price } = req.body;

        // Logga det userId som söks efter
        console.log(`Sök efter item med id ${ id }`);

        // Leta upp användare med hjälp av userId
        const existingItem = await menuDB.findOne({ id: Number(id) });

        // Logga resultat av sökning
        console.log(`Resultat av sökningen ${JSON.stringify( id )}`);

        if (!existingItem) return res.status(404).json({ message: 'Produkten hittades inte' });

        // Objekt för att lagra uppdateringsfälten
        const updateFields = {};

        // Om nytt title, desc eller price skickas, lägg till det i uppdateringsfälten
        if (title) {
            // Kontrollera om den nya titeln redan existerar i databasen
            const itemWithNewTitle = await menuDB.findOne({ title });
            if (itemWithNewTitle && itemWithNewTitle.id !== id) {
                return res.status(400).json({ message: 'Denna produkt finns redan i menyn' });
            }
            updateFields.title = title;
        }
        if (desc) {
            updateFields.desc = desc;
        }
        if (price) {
            updateFields.price = price;
        }

        updateFields.modifiedAt = getTimeStamp();

        // Uppdatera användarinformationen i databasen och returnera det uppdaterade dokumentet
        const updateItem = await menuDB.update(
            { id: Number(id) }, 
            { $set: updateFields }, 
            { returnUpdatedDocs: true, multi: false }
        );

        // Skicka meddelande och den uppdaterade användaren
        res.status(200).json({ message: 'Item updated successfully', user: updateItem });

    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;