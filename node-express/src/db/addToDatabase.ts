import pool from './db-setup';

async function addToDatabase(processedData: any[]) {
    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            for (const data of processedData) {
                if(data.title && data.content && data.imageUrl){
                    const query = `
                        INSERT INTO articles (category, title, content, publisher, author, url, imageUrl, publishTime, processedTime)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                    `;
                    
                    await client.query(query, [
                        data.newsCategory,
                        data.title,
                        data.content,
                        data.publisher,
                        data.author,
                        data.url,
                        data.imageUrl,
                        data.publishTime
                    ]);
                }
            }
            await client.query('COMMIT');           
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
