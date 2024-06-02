import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import MainScreen from './screens/MainScreen';
import HistoryScreen from './screens/HistoryScreen'

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Calculator" 
          component={MainScreen} 
          options={{ headerShown: false }} />
          
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
