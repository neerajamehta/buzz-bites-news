import express, { Express } from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import newsMain from "./newsArticles/newsMain";
import pool from './db/db-setup';
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const newsApiKey = process.env.NEWS_API_KEY;
const googleAiApiKey = process.env.GOOGLE_AI_API_KEY;
let processedData: any = null;

app.use(cors())

cron.schedule('00 * * * *', async () => {
  console.log('Fetching news data...');
  processedData = await newsMain(newsApiKey, googleAiApiKey);
});

app.get('/news', async (req, res) => {
  try {
    if (!processedData) {
      return "News data is being fetched. Please try again later";
    }
    res.json(processedData);
  }
   catch (error) {
   console.error('Error fetching news:', error);
   res.status(500).json({ error: 'An error occurred while fetching news' });
  }
});

app.get('/database', async (req, res, next) => {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(`SELECT * from articles`);
    res.send(rows);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from database' });
  } finally {
    if(client)
    client.release();
}
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});