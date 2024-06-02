export interface RawArticle{
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

export interface ProcessedArticle{
    category: string;
    title: string;
    content: string;
    publisher: string;
    author: string | null;
    url: string;
    image: string | null;
    publishedTime: string;
    processedTime: string;
}
