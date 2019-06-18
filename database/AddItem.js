import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Picker, ScrollView, Button} from 'react-native';
import {firebase} from '../src/config';
import DatePicker from 'react-native-datepicker';
import Calendar from '../components/Calendar';

let addItem = (item) => {
    firebase.auth().onAuthStateChanged((user) => {
        const user_id = user.uid;

        if (typeof item.oldName === 'undefined') {
            // new
            delete item.selected;
            delete item.oldName;
            firebase.database().ref('tarefas/' + user_id).push(item)
                .then((data) => {
                    console.log('Tarefa adicionada com sucesso');
                    this.setState({
                        name: '',
                        priority: 'min',
                        date: null,
                        timestamp: null,
                        status: false,
                        selected: new Date().toISOString().substr(0, 10),
                    });
                });
        } else {
            // edit
            firebase.database().ref('tarefas/' + user_id).orderByChild("name").equalTo(item.oldName).once('value', (snapshot) => {
                var key = Object.keys(snapshot.val())[0];

                delete item.selected;
                delete item.oldName;

                firebase.database().ref('tarefas/' + user_id + '/' + key).update(item)
                    .then((data) => {
                        console.log('Tarefa alterada com sucesso!');
                        this.setState({
                            name: '',
                            priority: 'min',
                            date: null,
                            timestamp: null,
                            status: false,
                            selected: new Date().toISOString().substr(0, 10),
                        });
                    });
            });
        }
    });

    return null;
};

export default class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            priority: 'min',
            date: null,
            timestamp: null,
            status: false,
            selected: new Date().toISOString().substr(0, 10),
        };

        this.triggerData = this.triggerData.bind(this);
    };

    componentWillReceiveProps = (nextProps, nextContext) => {

        console.log(nextProps);

        const itemToEdit = this.props.navigation.getParam('item', '');

        console.log(itemToEdit);
    };

    handleChangeName = e => {
        this.setState({
            name: e.nativeEvent.text
        });
    };

    triggerData = e => {
        this.setState({
            date: e.dateString,
            timestamp: e.timestamp
        })
    };

    handleSubmit = () => {
        const { navigation } = this.props;

        if (this.state.name === '') {
            alert('Você esqueceu de adicionar um título.');
            return;
        }

        if (this.state.date === null) {
            alert('Você esqueceu de selecionar uma data.');
            return;
        }

        addItem(this.state);
        navigation.navigate('List');
    };

    cleanForm = () => {
        this.state = {
            name: '',
            priority: 'min',
            date: null,
            timestamp: null,
            status: false,
            selected: new Date().toISOString().substr(0, 10),
        };
    };

    render() {
        return (
            <ScrollView>
                <View style={styles.main}>
                    <DatePicker
                        style={styles.datePicker}
                        date={this.state.picker} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        placeholder="Selecionar data"
                        format="DD/MM/YYYY"
                        confirmBtnText="Confirmar"
                        cancelBtnText="Cancelar"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36,
                                borderWidth: 1,
                                borderColor: '#e4e4e4',
                                borderRadius: 3,
                            }
                        }}
                        onDateChange={(date) => {
                            var dia = date.substring(0, 2);
                            var mes = date.substring(3, 5);
                            var ano = date.substring(6, 12);
                            var d = new Date(ano, mes, dia);

                            this.setState({date: ano + '-' + mes + '-' + dia});
                            this.setState({timestamp: d.getTime()});
                            this.setState({picker: date});
                        }}
                    />

                    <Text style={styles.title}>Título</Text>
                    <TextInput style={styles.itemInput} onChange={this.handleChangeName} value={this.state.name}/>

                    <Text style={styles.title}>Prioridade</Text>
                    <Picker
                        style={styles.input}
                        selectedValue={(this.state && this.state.priority)}
                        itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily:"Ebrima", fontSize:17 }}
                        color="red"
                        onValueChange={(value) => {
                            this.setState({priority: value});
                        }}
                    >
                        <Picker.Item label="Baixa" value="min" />
                        <Picker.Item label="Média" value="med" />
                        <Picker.Item label="Alta" value="max" />
                    </Picker>

                    <Button
                        onPress={this.handleSubmit}
                        title="Salvar"
                        color="#085bc7"
                        accessibilityLabel="Salvar tarefa"
                    />
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
    datePicker: {
        width: '100%',
        marginBottom: 15,
    },
});
