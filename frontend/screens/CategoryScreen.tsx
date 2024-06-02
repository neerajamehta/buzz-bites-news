import { FlatList, SafeAreaView, Text, View } from 'react-native'
import React from 'react'
import { categoriesData } from '../constants/categories'
import SingleCategory from '../components/SingleCategory'

const CategoryScreen = () => {
    return (
      <View>
        <SafeAreaView style = {{backgroundColor: "#66A5AD" }}>
          <Text style={{color:"#fff", fontSize: 20, paddingLeft: 20, paddingTop: 20}}>Categories</Text>
          <FlatList
            data={categoriesData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <SingleCategory item={item}/>}
          />
        </SafeAreaView>
        
      </View>
    )
}

export default CategoryScreen

