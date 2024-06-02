import React from 'react'
import { Text, View , Image, Linking, useWindowDimensions, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Article } from '../types';
import { useNavigation } from '@react-navigation/native';
import { categoryStyles } from '../constants/categoryStyles';

const SingleArticle = ({ item }: { item: Article}) => {
    const navigation = useNavigation();
    const {height, width} = useWindowDimensions();
    const handleArticlePress = () => {
      if (item.url) {
        Linking.openURL(item.url);
      }
    };
    const bgcolor = item.category && categoryStyles[item.category] ? categoryStyles[item.category].backgroundColor : '#000';

    return (
      <View style={{height: height, width: width, backgroundColor:`${bgcolor}D9` }}>
        <View style={{margin:"5%", marginTop:"15%", display:'flex'}}>
          <TouchableOpacity style={{marginBottom:"2%"}}onPress={() => navigation.navigate('Categories' as never)}>
            <AntDesign name="left" size={15} color="white"/> 
          </TouchableOpacity>  
          <Text style={{marginBottom:"2%", fontSize: 11, color: "#fff"}}>{item.category}</Text>
          <Image source={{ uri: item.image }} style={{height:0.2*height, alignItems: 'center'}}  />
          <Text style={{fontWeight:"bold", fontSize: 20, color: "#fff", alignItems: 'center', marginTop: "3%", marginBottom: "3%"}}>{item.title}</Text>
          <Text style={{fontSize: 17, color: "#fff", alignItems: 'center', marginBottom: "5%"}}>{item.content}</Text>
          <TouchableOpacity style = {{borderRadius: 5, borderWidth: 1, borderColor: bgcolor}}onPress={handleArticlePress}>
              <Text style={{padding: 10, backgroundColor: bgcolor,  fontSize: 19, color: "#fff", textAlign: 'center' }}>
                Click here to read article
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  };
  
const styles =  StyleSheet.create({
    container:{
        
    }
})

export default SingleArticle
