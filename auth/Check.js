import React, {Component} from 'react';
import {firebase} from '../src/config';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default class Check extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = e => {
        const { navigation } = this.props;

        firebase.auth().onAuthStateChanged((user) => {
            if (user === null) {
                return navigation.replace("Login");
            } else {
                this.setState({ user });
                return navigation.replace("Tabs");
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#085bc7" />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
