import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

interface RawArticle {
    source: {
        id: string | null; 
        name: string;
    };
    author: string | null; 
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
}

interface RawNewsData {
    articles: RawArticle[];
}

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

async function processNewsDataToArray(newsDataJson: RawNewsData, newsCategory: string, googleAiApiKey: string | undefined) {
    const genAI = new GoogleGenerativeAI(googleAiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings});
  
    const prompt = "Summarize the article in a paragraph within 80 words."
    try {
        if (!newsDataJson || !newsDataJson.articles) {
            throw new Error('Invalid news data format');
        }

        const articles = newsDataJson.articles;
        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            let textContent = await getArticleTextContent(article.url);
            if(textContent != ''){
                textContent = textContent.replace(/\n/g, '');
                textContent = textContent.replace(/\s{2,}/g, ' ');
            }
            article.content = textContent;
        }

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            if(article.content != ''){
                const result = await model.generateContent(prompt + article.content);
                const response = await result.response;
                const text = response.text();
                article.content = text ?? null;
            }
        }

        const processedArray = articles.map(article => ({
            title: article.title,
            newsCategory: newsCategory,
            content: article.content === '' ? null : article.content,
            publisher: article.source?.name,
            author: article.author,
            url: article.url,
            imageUrl: article.urlToImage,
            publishTime: article.publishedAt ?? new Date().toISOString(), // Using current time if publishedAt is null
            processedTime: Date.now()
        }));
        return processedArray;
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
        const article = new Readability(dom.window.document).parse();
        return article.textContent
    }
    catch(error){
        console.error('Error fetching article content', error);
        return '';
    }
}

export default processNewsDataToArray;