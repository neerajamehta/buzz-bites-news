export interface Article {
    id: number;
    category: string,
    title: string;
    content: string;
    publisher: string;
    author: string;
    url: string;
    image: string; 
    publishedTime: string; 
    processedTime: string; 
    addToDatabaseTime: string
}

export interface Category {
    name: string;
    id: string;
    image: string;
  }
