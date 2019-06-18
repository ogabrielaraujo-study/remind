import React from 'react';
import { Root } from "native-base";
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import Check from './auth/Check';
import Login from './auth/Login';
import Register from './auth/Register';
import List from './database/List';
import AddItem from './database/AddItem';
import Config from './components/Config';
import Agenda from './components/Agenda2';

const Tabs = createBottomTabNavigator(
    {
        List: {
            screen: List,
            navigationOptions: {
                title: 'Tarefas',
                tabBarOptions: { activeTintColor: '#085bc7' },
                tabBarIcon: ({ focused, tintColor }) => <Ionicons name="md-checkmark-circle-outline" size={25} color={tintColor} />
            },
        },
        Agenda: {
            screen: Agenda,
            navigationOptions: {
                title: 'Agenda',
                tabBarOptions: { activeTintColor: '#085bc7' },
                tabBarIcon: ({ focused, tintColor }) => <Ionicons name="md-calendar" size={25} color={tintColor} />
            }
        },
        AddItem: {
            screen: AddItem,
            navigationOptions: {
                title: 'Adicionar',
                tabBarOptions: { activeTintColor: '#085bc7' },
                tabBarIcon: ({ focused, tintColor }) => <Ionicons name="md-add-circle-outline" size={25} color={tintColor} />
            }
        },
        Config: {
            screen: Config,
            navigationOptions: {
                title: 'Configurações',
                tabBarVisible: true,
                tabBarOptions: { activeTintColor: '#085bc7' },
                tabBarIcon: ({ focused, tintColor }) => <Ionicons name="md-settings" size={25} color={tintColor} />
            }
        },
    }
);

const MainNavigator = createStackNavigator(
    {
        //Push: { screen: Push },
        Check: { screen: Check },
        Login: { screen: Login },
        Register: { screen: Register },
        Tabs: { screen: Tabs },
        Form: { screen: AddItem },
    },
    {
        defaultNavigationOptions: {
            title: 'Remind',
            headerStyle: {backgroundColor: '#085bc7'},
            headerTintColor: '#fff',
            gesturesEnabled: false,
        }
    }
);

const AppContainer = createAppContainer(MainNavigator);

export default () =>
    <Root>
        <AppContainer />
    </Root>;
