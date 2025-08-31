import express from 'express';
import bodyParser, { json } from 'body-parser';
import  Pool  from './config/db';
import setUserRoutes from './routes/userRoutes';
import router from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// All APIs here
app.use("/api", router);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;