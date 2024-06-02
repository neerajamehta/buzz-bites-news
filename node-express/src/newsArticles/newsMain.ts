import fetchNewsData from "./newsFetcher";
import processNewsDataToArray from "./newsProcessor";
import addToDatabase from "../db/addToDatabase";
import { ProcessedArticle } from "../types/article";
import { newsCategories } from "../constants/newsCategories";

let allProcessedData: ProcessedArticle[] = []

const shuffleArray = (arr: any[]) => {
    for(let i = 1; i < arr.length; i++){
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr;
}

async function newsMain() {
    for(const category of newsCategories){
        try {
            const newsDataJson = await fetchNewsData(category);
            const processedData = await processNewsDataToArray(newsDataJson.articles, category);
            allProcessedData = [...allProcessedData, ...processedData]; 
            console.log("Length:" + processedData.length);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 60 seconds before next iteration
    }
    allProcessedData = shuffleArray(allProcessedData);
    await addToDatabase(allProcessedData);
    console.log("Total Length:" + allProcessedData.length);
    return allProcessedData
}

export default newsMain;
