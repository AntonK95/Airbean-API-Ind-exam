import { Router } from 'express';
// import { database } from '../server.js';
import validate from '../middlewares/validate.js';
import getTimeStamp from '../utilities/timeStamp.js';
import productSchema from '../models/productModel.js';
import { menuDB } from '../server.js';

const router = Router();

router.post('/', validate(productSchema), async (req, res, next) => {
    try {
        const { error } = productSchema.validate(req.body);
        
        if (error) return res.status(400).send(error.details[0].message);

        const { title, desc, price } = req.body;

        const existingItem = await menuDB.findOne({ title });
        if (existingItem) return res.status(400).json({ message: 'Product already in menu' });

        async function getNextId() {
            try {
                const counterDoc = await menuDB.findOne({ type: 'counter' });
            
                if(counterDoc) {
                    const newId = counterDoc.value + 1;
                    await menuDB.update({ type: 'counter' }, { $set: { value: newId } });
                    return newId;
                } else {
                    const newCounter = { type: 'counter', value: 1 };
                    await menuDB.insert(newCounter);
                    return 1;
                }
            
            } catch(error) {
                console.log(err, 'Error fetching next Id');
            }
        };
        
        const id = await getNextId();

        const newItem = await menuDB.insert({ 
            id,
            title,
            desc,
            price: Number(price),
            createdAt: getTimeStamp() 
        });

         // Logga datum och tid för registrering
         const now = new Date();
         console.log(`Product registered: ${newItem.title} date and time: ${now.toLocaleString()}`);

        res.status(201).json({ message: 'Product registered successfully', product: newItem });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;