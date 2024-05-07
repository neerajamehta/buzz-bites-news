const axios = require('axios');

async function fetchNewsData(url: string, apiKey: string | undefined): Promise<any> {
    
        try {
            const response = await axios.get(url+apiKey);
            return response.data;
        } catch (error) {
            console.error('Error fetching news data:', error);
            return null;
        }
    
}

export default fetchNewsData;