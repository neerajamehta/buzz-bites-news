import React from 'react'
import { Text, Image, TouchableOpacity} from 'react-native';
import { Category } from '../types';
import { useNavigation } from '@react-navigation/native';
import { CategoryContent, NewsContext } from '../Context';

const SingleCategory = ({ item }: { item: Category}) => {
    const navigation = useNavigation();
    const newsContextValue: CategoryContent | null = React.useContext(NewsContext);

    const handleOnCategoryPress = () => {
      newsContextValue?.setCategory(item.id)
      navigation.navigate('Articles' as never);
    }

    return (
      <TouchableOpacity style={{backgroundColor: "#66A5AD", display:'flex', padding: 20}} onPress={handleOnCategoryPress}>
          <Text style={{fontSize: 13, color: "#fff", textAlign:'center', padding:10}}>{item.name}</Text>
          <Image source={{uri: item.image}} style={{width: 80, height: 80, margin: 3} }/>
      </TouchableOpacity>
    );
  };

export default SingleCategory
