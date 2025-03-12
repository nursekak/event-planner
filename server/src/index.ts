import express from 'express';
import router from './routes/index.js';
import dotenv from 'dotenv';
import sequelize from './db.js';

import cors from 'cors';
import errorHandler from './middleware/ErrorHandlingMiddleware.js';

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter: true})
        app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})
        
    } catch (error) {
        console.log(error)
    }
    
}
start()