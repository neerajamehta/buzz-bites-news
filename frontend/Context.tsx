import React, { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

export type CategoryContent = {
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

const NewsContext = createContext<CategoryContent | null>(null);

type ContextProps = {
  children: ReactNode;
};

const Context: React.FC<ContextProps> = ({ children }) => {
  const [category, setCategory] = useState<string>('all');

  const contextValue: CategoryContent = {
    category,
    setCategory,
  };

  return (
    <NewsContext.Provider value={contextValue}>
      {children}
    </NewsContext.Provider>
  );
};

export { Context, NewsContext };
