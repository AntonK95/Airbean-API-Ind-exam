import { Router } from "express";
import { menuDB } from "../server.js";

const router = Router();

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await menuDB.findOne({ id: Number(id) });
        if(!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await menuDB.remove({ id: Number(id) });
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

export default router;