import fetchNewsData from "./newsFetcher";
import processNewsDataToArray from "./newsProcessor";
import addToDatabase from "../db/addToDatabase";

const newsApiMap: Map<string, string> = new Map();
newsApiMap.set("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=", "business");
newsApiMap.set("https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=", "entertainment");
newsApiMap.set("https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=", "general");
newsApiMap.set("https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=", "health");
newsApiMap.set("https://newsapi.org/v2/top-headlines?country=us&category=science&apiKey=", "science");
newsApiMap.set("https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=", "sports");
newsApiMap.set("https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=", "technology");

let allProcessedData: any[] = []

async function newsMain(newsApiKey: string | undefined, googleAiApiKey: string | undefined) {
    for (const [url, category] of newsApiMap.entries()) {
        try {
            const newsDataJson = await fetchNewsData(url, newsApiKey);
            const processedData = await processNewsDataToArray(newsDataJson, category, googleAiApiKey);
            allProcessedData.push(...processedData); 
            await addToDatabase(processedData);
            console.log(processedData.length);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 60 seconds before next iteration
    }
    return allProcessedData
}

export default newsMain;
