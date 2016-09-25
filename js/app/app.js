/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

'use strict';

import React from 'react';
import {
  AppState,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import LoginFlow from '../login/LoginFlow';
import CodePush from 'react-native-code-push';
import { connect } from 'react-redux';
import TabbedApp from '../containers/TabbedApp';
import { gradientTop } from '../Colors';

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
  };
}

class App extends React.Component {
  constructor(props) {
    super(props);
    (this: any).handleAppStateChange = this.handleAppStateChange.bind(this);
    (this: any).componentDidMount = this.componentDidMount.bind(this);
  }

  loadAppData() {
    // TODO: Download any app-wide data we need, here.
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.loadAppData();
    CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME, minimumBackgroundDuration: 60 * 5});
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    if (appState === 'active') {
      this.loadAppData();
      CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME, minimumBackgroundDuration: 60 * 5});
    }
  }

  render() {
    if (!this.props.isLoggedIn) {
      return <LoginFlow />;
    }
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={false}
          backgroundColor={gradientTop}
          barStyle="light-content"
         />
        <TabbedApp />
      </View>
    );
  }
  // Add <PushNotificationsController /> back in to <View>...
}
export default connect(select)(App);

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
