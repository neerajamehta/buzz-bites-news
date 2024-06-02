import { ProcessedArticle } from '../types/article';
import pool from './db-setup';

async function addToDatabase(processedData: ProcessedArticle[]) {
    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            for (const data of processedData) {
                if(data.image && data.author){
                    const query = `
                        INSERT INTO articles (category, title, content, publisher, author, url, image, publishedTime, processedTime, addToDatabaseTime)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
                        ON CONFLICT (title) DO NOTHING
                    `;
                    
                    await client.query(query, [
                        data.category,
                        data.title,
                        data.content,
                        data.publisher,
                        data.author,
                        data.url,
                        data.image,
                        data.publishedTime,
                        data.processedTime,
                    ]);
                }
            }
            await client.query('COMMIT');
            console.log("Added to database");         
        } catch (error) {
            await client.query('ROLLBACK');
            throw error; // Rethrow the error to handle it in the caller
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error processing news data:', error);
    }
}

export default addToDatabase;
