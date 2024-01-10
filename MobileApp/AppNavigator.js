import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from './AuthContext';
import Logspage from './Admin/Logs';
import AddPharamcyPage from './Admin/AddPharamcy';
import UploadPhotoPage from './User/UploadPhotoPage';
import LoginPage from './LoginPage';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons or your preferred icon set
import Recommendations from './User/Recommendations';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Logs') {
            iconName = focused ? 'list' : 'list-outline'; // Replace with your log icon
          } else if (route.name === 'AddPharamcy') {
            iconName = focused ? 'add-circle' : 'add-circle-outline'; // Replace with your add pharmacy icon
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
      tabBarOptions={{
        activeTintColor: 'black', // Color of the icon when the tab is selected
        inactiveTintColor: 'grey', // Color of the icon when the tab is not selected
      }}
    >
      <Tab.Screen name="Logs" component={Logspage} options={{ headerShown: false }} />
      <Tab.Screen name="AddPharamcy" component={AddPharamcyPage} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const UserTabNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Upload') {
            iconName = focused ? 'camera' : 'camera-outline'; // Replace with your upload photo icon
          }
          if (route.name === 'Recommendations') {
            iconName = focused ? 'star' : 'star-outline'; // Replace with your upload photo icon
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
      tabBarOptions={{
        activeTintColor: 'black', // Color of the icon when the tab is selected
        inactiveTintColor: 'grey', // Color of the icon when the tab is not selected
      }}
    >
      <Tab.Screen name="Upload" component={UploadPhotoPage} options={{ headerShown: false }} />
      {/* Add other user pages here if needed */}
      <Tab.Screen name="Recommendations" component={Recommendations} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {user ? (
        user.userType === 'admin' ? (
          <Stack.Screen name="AdminTabs" component={AdminTabNavigator} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="UserTabs" component={UserTabNavigator} options={{ headerShown: false }} />
        )
      ) : (
        <Stack.Screen name="User Authentication" component={LoginPage} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
