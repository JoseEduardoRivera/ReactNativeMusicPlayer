import * as React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer"
import { NavigationContainer } from "@react-navigation/native"
import { Home } from "./src/Screens/Home"
import { Profile } from "./src/Screens/Profile"
import { Details } from "./src/Screens/Details"
import { HistoryProvider } from './src/context/HistoryProvider';


const Drawer = createDrawerNavigator()

export default function App() {
  return (
    <>
      <HistoryProvider>
        <NavigationContainer >
          <Drawer.Navigator initialRouteName='Home'>
            <Drawer.Screen name="Home" component={Home} options={{
              headerTitle: '', headerStyle: {
                backgroundColor: "#1D233A"
              }
            }} />
            <Drawer.Screen name="Mi perfil" component={Profile} options={{
              headerTitle: '', headerStyle: {
                backgroundColor: "#1D233A"
              }
            }} />
            <Drawer.Screen name="Detalles" component={Details} options={{
              headerTitle: '', headerStyle: {
                backgroundColor: "#1D233A"
              }
            }} />
          </Drawer.Navigator>
        </NavigationContainer>
      </HistoryProvider>
    </>
  );
}