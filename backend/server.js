import express from 'express';
import menuRouter from './routes/menu.js';
import nedb from 'nedb-promises';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import updateUserRouter from './routes/updateUser.js';
import cartRouter from './routes/cart.js';
import errorHandlerMiddleware from './middlewares/errorHandler.js'
import orderRouter from './routes/order.js';
import info from './routes/info.js';
import confirmationRouter from './routes/confirmation.js';
import logger from './middlewares/logger.js';
import orderHistoryRouter from './routes/orderhistory.js';
import addMenuItem from './routes/addMenuItem.js';

const app = express();
const PORT = process.env.PORT || 8080;

export const menuDB = nedb.create({ filename: 'menu.db', autoload: true });
export const database = nedb.create({ filename: 'users.db', autoload: true });
export const db = nedb.create({ filename: 'cart.db', autoload: true });
export const orderDB = nedb.create({ filename: 'order.db', autoload: true });
export const orderNumberDB = nedb.create({ filename: 'orderNumber.db', autoload: true });

app.use(express.json());
app.use(logger); // Global logger middleware

app.use('/menu', menuRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/update-account', updateUserRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/info', info);
app.use('/confirmation', confirmationRouter);
app.use('/order-history', orderHistoryRouter);
app.use('/add-to-menu', addMenuItem);

app.use(errorHandlerMiddleware);


// Om databasen är tom, skicka in denna data
const seedDatabase = async () => {
    const count = await menuDB.count({});
    if(count === 0) {
        const menuItems = [
            { "id": 1, "title": "Bryggkaffe", "desc": "Bryggd på månadens bönor.", "price": 39 },
            { "id": 2, "title": "Caffè Doppio", "desc": "Bryggd på månadens bönor.", "price": 49 },
            { "id": 3, "title": "Cappuccino", "desc": "Bryggd på månadens bönor.", "price": 49 },
            { "id": 4, "title": "Latte Macchiato", "desc": "Bryggd på månadens bönor.", "price": 49 },
            { "id": 5, "title": "Kaffe Latte", "desc": "Bryggd på månadens bönor.", "price": 54 },
            { "id": 6, "title": "Cortado", "desc": "Bryggd på månadens bönor.", "price": 39 }
        ];
        await menuDB.insert(menuItems);
        await menuDB.insert({ type: 'counter', value: 6 });
    }
};

seedDatabase().then(() => {
    // Starta server
    app.listen(PORT, (req, res) => {
        console.log(`Server is running on port ${PORT}`);
    });

})
