import React, { Component } from 'react';
import { AppRegistry, ActivityIndicator, FlatList, Text, View } from 'react-native';

// https://github.com/xgfe/react-native-datepicker
// npm install react-native-datepicker --save
import DatePicker from 'react-native-datepicker'

function groupByActivityAndSumDays(responseJson, pickedDate) {
  const activities = responseJson.map((time) => {
    return {
      title: time.activity.title,
      days: parseFloat(time.time_in_days)
    };
  });

  let groupedActivities = [];
  for (const activityIndex in activities) {
    let activity = activities[activityIndex];
    let index = groupedActivities.findIndex((item) =>
      activity.title === item.title
    );

    if (index === -1) {
      groupedActivities.push(activity)
    } else {
      groupedActivities[index].days += activity.days
    }
  }

  return groupedActivities;
}

export default class TimeSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      date: "2018-01-01"
    }
  }

  fetchTimeSheet() {
    // https://octopod.octo.com/api/v0/people/2142664391/time_input?from_date=${this.state.date}T01%3A00%3A00
    const url = "https://octopod.octo.com/api/v0/people/2142664391/time_input?from_date=" + this.state.date + "T01%3A00%3A00";
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer b22767984aba5119c02fa83007f0ff7bb0c559710d19a4dad7d42bdbcd7cbf83'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      const ds = groupByActivityAndSumDays(responseJson, this.state.date);
      this.setState({
        isLoading: false,
        dataSource: ds
      });
    })
    .catch((error) => {
        console.error(error);
    });
  }

  componentDidMount() {
    this.fetchTimeSheet();
  }

  componentDidUpdate() {
    this.fetchTimeSheet();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <DatePicker
            style={{width: 200, marginBottom: 10}}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2015-01-01"
            maxDate="2018-02-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {this.setState({date: date, isLoading: true})}}
          />
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.title} {item.days}</Text>}
        />
      </View>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => TimeSheet);
