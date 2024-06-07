import { Router } from 'express';
import { readFileSync } from 'fs';
import { menuDB } from '../server.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await menuDB.find({});
        res.send(data);
    } catch(err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});

export default router;