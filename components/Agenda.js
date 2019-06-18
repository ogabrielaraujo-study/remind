import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {firebase} from "../src/config";
import { LocaleConfig, Agenda } from 'react-native-calendars';

LocaleConfig.locales['br'] = {
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
};

LocaleConfig.defaultLocale = 'br';

export default class AgendaScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            tasks: {},
        };
    }

    componentDidMount() {
        var now = new Date(2019, 12, 31);
        for (var d = new Date(2019, 1, 1); d <= now; d.setDate(d.getDate() + 1)) {
            let days = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
            if (typeof this.state.tasks[days] === 'undefined') {
                this.state.tasks[days] = [];
            }
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (user === null) {
                return navigation.replace("Login");
            } else {
                this.setState({ user });

                // loading tasks
                firebase.database().ref('tarefas/' + this.state.user.uid).on('value', snapshot => {
                    if (snapshot != null) {
                        let data = snapshot.val();
                        if (data !== null) {
                            // init state
                            var tasks = {};

                            // Order items by timestamp (date)
                            var itemByDate = Object.values(data).sort(function(a, b) {
                                a = new Date(a.timestamp);
                                b = new Date(b.timestamp);
                                return a<b ? -1 : a<b ? 1 : 0;
                            });

                            lastDate = null;

                            itemByDate.map((item, index, object) => {
                                // avoid to repeat days
                                if (index >= 1) {
                                    lastDate = itemByDate[index - 1].date;
                                }

                                if (lastDate !== item.date) {
                                    // new
                                    this.state.tasks[item.date] = [{text: item.name, date: item.date, priority: item.priority, status: item.status}];
                                } else {
                                    // append
                                    this.state.tasks[item.date].push({text: item.name, date: item.date, priority: item.priority, status: item.status});
                                }
                            });
                        }
                    }
                });
            }
        });

        console.log(this.state.tasks);
    }

    loadItems(day) {

    }

    renderItem(item) {
        const color = (item.priority === 'max') ? '#e41616' : ((item.priority === 'med') ? '#ff8244' : '#085bc7');
        const textStyle = {
            fontWeight: '300',
            color: ((item.status === true) ? '#515151' : color),
            letterSpacing: 0.5,
            textDecorationLine: ((item.status === true) ? 'line-through' : 'none')
        };

        return (
            <View style={styles.item}>
                <Text style={textStyle}>{item.text}</Text>
            </View>
        );
    };

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    };

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    };

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text></Text></View>
        );
    }

    renderEmptyData() {
        return (
            <View style={styles.emptyDate}><Text></Text></View>
        );
    }

    render() {
        return(
            <Agenda
                items={this.state.tasks}
                loadItemsForMonth={(day) => this.loadItems(day)}
                renderItem={this.renderItem.bind(this)}
                //renderDay={(day, item) => {return (<View><Text>day</Text></View>);}}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
                renderEmptyData={this.renderEmptyData.bind(this)}
                renderEmptyDay={this.renderItem.bind(this)}
                //onDayPress={this.loadEmpty.bind(this)}
                theme={{
                    selectedDayBackgroundColor: '#085BC7',
                    todayTextColor: '#085BC7',
                    selectedDayTextColor: '#ffffff',
                    dayTextColor: '#000',
                    dotColor: '#085BC7',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#085BC7',
                    agendaKnobColor: '#ccc',
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 15,
        marginBottom: 15,
        height: 70,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    emptyDate: {
        height: 70,
        flex: 1,
        marginRight: 10,
        marginTop: 17,
        borderBottomWidth: 1,
        borderColor: '#eee',
    }
});
