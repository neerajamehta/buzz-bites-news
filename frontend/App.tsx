import  React, { useContext, useEffect, useState } from 'react';
import ArticleScreen from './screens/ArticleScreen';
import CategoryScreen from './screens/CategoryScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Context, NewsContext, CategoryContent }  from './Context';


const Tab = createBottomTabNavigator();

export default function App(this: any) {


  return (
    <Context>
      <NavigationContainer>
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: () => {
              if (route.name === 'Categories') {
                return <MaterialIcons name='category' size={24} color="#66A5AD" />;
              } else if (route.name === 'Articles') {
                return <MaterialIcons name='article' size={24} color="#66A5AD" />;
              }
            },
            tabBarActiveTintColor: '#66A5AD',
            tabBarInactiveTintColor: 'gray',
            headerShown: false
          })}
        >
          <Tab.Screen name="Categories" children={() => <CategoryScreen/>}></Tab.Screen>
          <Tab.Screen name="Articles" children={() => <ArticleScreen/>}></Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer> 

    </Context>
    
  );
};

  


