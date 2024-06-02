import express, { Express } from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import newsMain from "./newsArticles/newsMain";
import pool from './db/db-setup';
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
let processedData: any = null;

app.use(cors())

cron.schedule('46 * * * *', async () => {
  console.log('Fetching news data...');
  processedData = await newsMain();
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
    const { rows } = await client.query(`SELECT * from articles ORDER BY processedtime`);
    res.send(rows);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from database' });
  } finally {
    if(client)
    client.release();
}
});

app.get('/database/:category', async (req, res, next) => {
  let client;
  const {category} = req.params;
  try {
    client = await pool.connect();
    if(category === 'all'){
      const { rows } = await client.query(`SELECT * from articles ORDER BY addToDatabaseTime DESC;`);
      res.send(rows);
    }
    else{
      const { rows } = await client.query(`SELECT * from articles WHERE category = $1 ORDER BY addToDatabaseTime DESC;`, [category]);
      res.send(rows);
    }
  } catch (error) {
    console.error('Error fetching data by category:', error);
    res.status(500).json({ error: 'An error occurred while fetching data by category' });
  } finally {
    if(client)
    client.release();
}
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});