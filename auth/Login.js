import React, {Component} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {firebase} from '../src/config';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: '',
            pass: '',
            errorMessage: '',
        };
    }

    handleChangeEmail = e => {
        this.setState({
            mail: e.nativeEvent.text
        });
    };

    handleChangePassword = e => {
        this.setState({
            pass: e.nativeEvent.text
        });
    };

    handleSubmit = e => {
        const { mail, pass } = this.state;
        const { navigation } = this.props;

        firebase.auth().signInWithEmailAndPassword(mail, pass)
            .then(() => {
                navigation.replace("Tabs");
            })
            .catch(error => this.setState({ errorMessage: error.message }))
    };

    render() {
        const { navigation } = this.props;

        return (
            <View style={styles.main}>
                <Text style={styles.title}>Faça login para começar!</Text>

                <Text style={styles.titleInput}>E-mail</Text>
                <TextInput style={styles.itemInput} onChange={ this.handleChangeEmail } keyboardType={"email-address"} />

                <Text style={styles.titleInput}>Senha</Text>
                <TextInput style={styles.itemInput} onChange={ this.handleChangePassword } secureTextEntry={true} password={true} />

                <Text style={styles.error}>{this.state.errorMessage}</Text>

                <Button
                    title="Login"
                    style={styles.button}
                    color="#085bc7"
                    onPress={this.handleSubmit}
                />

                <View style={{marginTop: 20}}>
                    <Button
                        title="Cadastre-se"
                        color="#343434"
                        onPress={(name) => navigation.replace("Register")}
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 30,
    },
    title: {
        fontSize: 25,
        marginBottom: 30,
        textAlign: 'center'
    },
    titleInput: {
        color: '#085BC7',
        fontWeight: '300',
        fontSize: 16,
        marginBottom: 8
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
        marginTop: 30,
        marginBottom: 20
    },
    error: {
        marginBottom: 20,
        color: 'red',
        textAlign: 'center'
    }
});
