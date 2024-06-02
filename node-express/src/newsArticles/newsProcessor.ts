require ("dotenv").config()
import { ProcessedArticle, RawArticle } from "../types/article";
import { safetySettings } from "../constants/safetySettings";

const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const googleAiApiKey = process.env.GOOGLE_AI_API_KEY;

async function processNewsDataToArray(newsDataJson: RawArticle[], newsCategory: string) {
    const genAI = new GoogleGenerativeAI(googleAiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings});

    try {
        if (!newsDataJson) {
            throw new Error('Invalid news data format');
        }

        // gets whole article text content and stores it in content
        for (const article of newsDataJson){
            let textContent = await getArticleTextContent(article.url);
            if (textContent && textContent != '') {
                textContent = textContent.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
                article.content = textContent;
            }
            else{
                article.content = '';
            }
            
        }

        // removes article with less content or null content
       const rawArticles = newsDataJson.filter(article => 
            article.author &&
            article.title &&
            article.urlToImage &&
            article.source?.name &&
            article.url &&
            article.content &&
            article.content.trim() !== ''
        );

        // summarizes content and updates content with summarized value
        for (const article of rawArticles){
            try {
                const result = await model.generateContent(process.env.PROMPT + article.content);
                const response = await result.response;
                const text = await response.text();
                article.content = text ?? null;
            } catch (e) {
                console.error('Error generating content for article:', e);
                article.content = '';
            }
        }

        // removes articles with invalid summaries
        const validRawArticles = rawArticles.filter((article) => 
            article.content && article.content.length >= 200
        )

        const processedArticles: ProcessedArticle[] = validRawArticles.map(article => ({
            category: newsCategory,
            title: article.title,
            content: article.content,
            publisher: article.source?.name,
            author: article.author,
            url: article.url,
            image: article.urlToImage,
            publishedTime: article.publishedAt ?? new Date().toISOString(), // Using current time if publishedAt is null
            processedTime: new Date().toISOString(),
        }));
        return processedArticles;
    } catch (error) {
        console.error('Error processing news data:', error);
        return [];
    }
}

async function getArticleTextContent(url: string){
    try{
        const response = await axios.get(url);
        const html = response.data;
        const dom = new JSDOM(html, {
            url: url
        });

        await new Promise(resolve => {
            dom.window.document.addEventListener('DOMContentLoaded', resolve);
        });

        const article = new Readability(dom.window.document).parse();
        if (!article || !article.textContent) {
            throw new Error('Failed to parse article');
        }
        return article.textContent
    }
    catch(error){
        console.error('Error fetching or parsing article content ' + url, error);
        return '';
    }
}

export default processNewsDataToArray;