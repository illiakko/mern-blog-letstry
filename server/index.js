import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'

import authRoute from './routes/auth.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "Hello from server!" })
})

// Routes
// http://localhost:3002

app.use('/api/auth', authRoute)

async function start() {

    try {
        const connect = await mongoose.connect(MONGO_URI)
        console.log(`MongoDB Connected: ${connect.connection.host}`);

        app.listen(PORT, () => { console.log(`Server up and running on port: ${PORT}`); })

    } catch (error) {
        console.log(error);
    }
}

start()