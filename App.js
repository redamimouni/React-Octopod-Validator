import React, { Component } from 'react';
import { AppRegistry, ActivityIndicator, ListView, Text, View } from 'react-native';

export default class TimeSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    return fetch('https://octopod.octo.com/api/v0/people/2142664391/time_input?page=1', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 6a9db7eac3f9f6821b687f71431672e3de4843e7bd6fbc46605ab247873c3861'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson)
        }, function() {
          // do something with new state
        });
      })
    .catch((error) => {
        console.error(error);
    });
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
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text>{rowData.day}, {rowData.activity.title}</Text>}
        />
      </View>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => TimeSheet);
