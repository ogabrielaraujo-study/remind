import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ItemComponent from './ItemComponent';
import {firebase} from '../src/config';

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref('tarefas/' + user.uid).on('value', snapshot => {
                if (snapshot != null) {
                    let data = snapshot.val();
                    if (data !== null) {
                        let items = Object.values(data);
                        this.setState({items});
                    }
                }
            });
        });
    };

    render() {
        const { navigation } = this.props;

        return (
            <ScrollView style={styles.container}>
                {this.state.items.length > 0 ?
                    (<ItemComponent items={this.state.items} props={this.props} />) :
                    (<Text style={styles.noItems}></Text>)}
            </ScrollView>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noItems: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#282828'
    },
});
