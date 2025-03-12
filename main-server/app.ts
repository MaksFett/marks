import express, { Request, Response, Express} from "express";
import cors from "cors";
import markRoutes from './routes/marks';
import studRoutes from "./routes/students";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5051;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Server is up and running');
});

app.use('/marks', markRoutes);
app.use('/students', studRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
});