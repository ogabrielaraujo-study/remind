import React, {Component} from 'react';
import {View, ScrollView, Alert, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
import {firebase} from "../src/config";

export default class ItemComponent extends React.Component {
    static propTypes = {
        items: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    };

    checkTask(index, item) {
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref('tarefas/' + user.uid).orderByChild("name").equalTo(item.name).once('value', function(snapshot) {
                var key = Object.keys(snapshot.val())[0];

                firebase.database().ref('tarefas/' + user.uid + '/' + key).update({
                    status: (item.status !== true)
                });
            });
        });
    };

    alertTask(index, item) {
        this.setState({item: item, key: index});

        Alert.alert(
            this.state.item.name,
            new Date(this.state.item.date).toISOString().substr(0, 10).split('-').reverse().join('/'),
            [
                {text: 'Excluir', onPress: () => this.removeTask(item)},
                /*{text: 'Editar', onPress: () => this.editTask(item)},*/
                {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'cancel'},
            ],
            {cancelable: true},
        );
    };

    editTask = (item) => {
        const { navigation } = this.props.props;
        item["selected"] = item.date;
        item["oldName"] = item.name;
        navigation.navigate("AddItem", {item});
    };

    removeTask(item) {
        firebase.auth().onAuthStateChanged((user) => {
            const user_id = user.uid;

            firebase.database().ref('tarefas/' + user_id).orderByChild("name").equalTo(item.name).once('value', function(snapshot) {
                var key = Object.keys(snapshot.val())[0];

                firebase.database().ref('tarefas/' + user_id + '/' + key).remove();
            });
        });
    };

    render() {
        // Order items by timestamp (date)
        var itemByDate = this.props.items.sort(function(a, b) {
            a = new Date(a.timestamp);
            b = new Date(b.timestamp);
            return a<b ? -1 : a<b ? 1 : 0;
        });

        lastDate = null;

        return (

            <View>
                {itemByDate.map((item, index, object) => {
                    const color = (item.priority === 'max') ? '#e41616' : ((item.priority === 'med') ? '#ff8244' : '#085bc7');
                    const textStyle = {
                        fontWeight: '300',
                        color: ((item.status === true) ? '#515151' : color),
                        letterSpacing: 0.5,
                        textDecorationLine: ((item.status === true) ? 'line-through' : 'none')
                    };

                    // avoid to repeat days
                    if (index >= 1) {
                        lastDate = itemByDate[index - 1].date;
                    }

                    currentdate = new Date(item.date).toISOString().substr(0, 10).split('-').reverse().join('/');

                    return (
                        <View key={index}>
                            { lastDate !== item.date ? <Text style={styles.dataFormato}>{currentdate}</Text> : <Text></Text> }
                            <CheckBox
                                title={item.name}
                                checked={item.status}
                                checkedColor={'#515151'}
                                uncheckedColor={color}
                                iconType="ionicon"
                                checkedIcon="ios-checkmark-circle"
                                size={27}
                                uncheckedIcon="ios-checkmark-circle-outline"
                                onPress={this.checkTask.bind(this, index, item)}
                                onLongPress={this.alertTask.bind(this, index, item)}
                                textStyle={textStyle}
                            />
                        </View>
                    );
                })}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    dataFormato: {
        fontSize: 15,
        color: '#515151',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 15,
        fontWeight: 'bold',
    },
});

