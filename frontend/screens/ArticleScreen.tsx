import  React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View , FlatList, SafeAreaView} from 'react-native';
import axios from 'axios';
import { Article } from '../types';
import SingleArticle from '../components/SingleArticle';
import { CategoryContent, NewsContext } from '../Context';

const ArticleList = ({data} : {data: any}) => {
  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }, [data]);
  return(
  <View style = {{backgroundColor: "#000"}}>
          <FlatList
            data={data}
            ref={flatListRef} 
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <SingleArticle item={item} />}
          />
  </View>
  )
}

const ArticleScreen =() => {
  const newsContextValue: CategoryContent | null = React.useContext(NewsContext);

  const [data, setData] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, [newsContextValue?.category]);

  const fetchData = async () => {
    try {
      const response = await axios.get<Article[]>(`http://localhost:3000/database/${newsContextValue?.category}`);
      setData(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <View>
      {loading ? (
        <View>
          <Text>Loading...</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
      <View>
          <ArticleList data={data}/>
      </View>
      )
      }
    </View>
  );
}

export default ArticleScreen


