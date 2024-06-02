require ("dotenv").config()

const axios = require('axios');
const newsApiKey = process.env.NEWS_API_KEY;

async function fetchNewsData(category: string): Promise<any> {
        try {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${newsApiKey}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching news data:', error);
            return null;
        }
    
}

export default fetchNewsData;