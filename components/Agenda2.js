import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Picker, ScrollView, Button} from 'react-native';
import {firebase} from '../src/config';
import ItemComponent from '../database/ItemComponent';
import Calendar from '../components/Calendar';

export default class Agenda2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: [],
            items: [],
        };

        this.triggerData = this.triggerData.bind(this);
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

        var current = {
            dateString: new Date().toISOString().substr(0, 10)
        };
        this.triggerData.bind(current);
    };

    triggerData = e => {
        var news = [];

        this.state.items.map((item, index, object) => {
            if (item.date === e.dateString) {
                news.push(item);
            }
        });

        this.setState({selected: news});
    };

    render() {
        return (
            <ScrollView>
                <View style={styles.calendario}>
                    <Calendar triggerData={this.triggerData} selected={this.state.selected} />
                </View>

                <View style={styles.container}>
                    {this.state.selected.length > 0 ?
                        (<ItemComponent items={this.state.selected} props={this.props} />) :
                        (<Text style={styles.noItems}>Nenhuma tarefa para esse dia.</Text>)}
                </View>
            </ScrollView>
        );
    };
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 20,
        marginBottom: 20,
    },
    calendario: {
        marginTop: 10
    },
    container: {
        borderWidth: 1,
        borderColor: '#fff',
    },
    title: {
        color: '#085BC7',
        fontWeight: '300',
        fontSize: 16,
        marginBottom: 10
    },
    itemInput: {
        height: 45,
        padding: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e4e4e4',
        borderRadius: 3,
        marginBottom: 20
    },
    button: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 30,
        backgroundColor: "#085bc7"
    },
    input: {
        borderColor: '#e4e4e4',
        marginBottom: 20
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
