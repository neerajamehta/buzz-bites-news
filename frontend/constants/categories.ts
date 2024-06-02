import { Category } from "../types";

const imagePath = '/Users/neerajamehta/Desktop/projects/BuzzBites/frontend/assets/images/categories-white/'

export const categoriesData: Category[] = [
    { 
        name: 'All', 
        id:'all', 
        image: imagePath + 'all.png'
    },
    { 
        name: 'Business', 
        id:'business', 
        image: imagePath + 'business.png'
    },
    { 
        name: 'General', 
        id:'general', 
        image: imagePath + 'general.png'
    },
    { 
        name: 'Entertainment', 
        id:'entertainment', 
        image: imagePath + 'entertainment.png'
    },
    { 
        name: 'Health', 
        id:'health', 
        image: imagePath + 'health.png'
    },
    { 
        name: 'Science', 
        id:'science', 
        image: imagePath + 'science.png'
    },
    { 
        name: 'Sports', 
        id:'sports', 
        image: imagePath + 'sports.png'
    },
    { 
        name: 'Technology', 
        id:'technology', 
        image: imagePath + 'technology.png'
    },
  ];