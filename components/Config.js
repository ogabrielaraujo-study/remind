import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import {firebase} from "../src/config";

export default class Config extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                displayName: null,
                email: null
            },
            qtdTotal: 0,
            qtdConcluida: 0,
            qtdAberta: 0,
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user === null) {
                return navigation.replace("Login");
            } else {
                this.setState({ user });

                firebase.database().ref('tarefas/' + user.uid).on('value', snapshot => {
                    if (snapshot != null) {
                        let data = snapshot.val();
                        if (data !== null) {
                            let items = Object.values(data);
                            let concluida = 0;
                            let aberta = 0;

                            items.map((item, index, object) => {
                                 if (item.status === true) {
                                     concluida++;
                                 } else {
                                     aberta++;
                                 }
                            });

                            this.setState({
                                qtdTotal: items.length,
                                qtdConcluida: concluida,
                                qtdAberta: aberta,
                            })
                        }
                    }
                });
            }
        });
    };

    handleLogout = e => {
        const { navigation } = this.props;
        firebase.auth().signOut();
        return navigation.replace('Login');
    };

    render() {
        return(
            <View style={styles.main}>
                <Text style={styles.titleBig}>Informações da Conta</Text>

                <Text style={(this.state.user.displayName !== null) ? styles.title : styles.disabled}>Nome</Text>
                <TextInput style={(this.state.user.displayName !== null) ? styles.itemInput : styles.disabled} editable={false} value={this.state.user.displayName} />

                <Text style={styles.title}>E-mail</Text>
                <TextInput style={styles.itemInput} editable={false} value={this.state.user.email} />

                <TextInput style={styles.itemValues} editable={false} value={this.state.qtdTotal + ' total de tarefas'} />

                <TextInput style={styles.itemValues} editable={false} value={this.state.qtdConcluida + ' tarefas concluídas'} />

                <TextInput style={styles.itemValuesLast} editable={false} value={this.state.qtdAberta + ' tarefas em aberto'} />

                <Button
                    onPress={this.handleLogout}
                    title="Logout"
                    color="#085bc7"
                    accessibilityLabel="Logout"
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 20
    },
    titleBig: {
        color: '#085BC7',
        fontWeight: '300',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30
    },
    title: {
        color: '#085BC7',
        fontWeight: '300',
        fontSize: 16,
    },
    itemInput: {
        height: 45,
        padding: 0,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 3,
        marginBottom: 20
    },
    itemValues: {
        fontSize: 16,
        borderColor: '#eee',
        borderTopWidth: 1,
        height: 30,
        marginBottom: 10,
        paddingTop: 10,
    },
    itemValuesLast: {
        fontSize: 16,
        borderColor: '#eee',
        borderTopWidth: 1,
        height: 30,
        paddingTop: 10,
        marginBottom: 30,
    },
    input: {
        borderColor: '#fff',
        marginBottom: 20
    },
    disabled: {
        display: 'none'
    },
});
