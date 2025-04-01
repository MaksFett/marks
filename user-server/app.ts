import express, { Request, Response, Express } from "express";
import cors from "cors";
import userRoutes from './routes/users';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Server is up and running');
});

app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
});