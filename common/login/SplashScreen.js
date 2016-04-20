/**
 * Copyright 2016 DanceDeets.
 * @flow
 */
'use strict';

import StatusBarIOS from 'StatusBarIOS';
import React, {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  LoginManager,
  AccessToken,
} from 'react-native-fbsdk';
import TutorialScreen from './TutorialScreen';
// TODO: Maybe when we have styles, use a DDText.js file?
// TODO: import LoginButton from '../common/LoginButton';

import { loginStartTutorial, loginComplete } from '../actions';
import { connect } from 'react-redux';
import type { Dispatch } from '../actions/types';


function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    inTutorial: store.user.inTutorial,
  };
}


class SplashScreen extends React.Component {


  state: {
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    StatusBarIOS && StatusBarIOS.setStyle('default');
    performLoginTransitions(this.props.dispatch);
  }

  render() {
    if (this.props.inTutorial) {
      return <TutorialScreen />;
    }
    return (
      <TouchableWithoutFeedback
        //onPress={() => this.props.dispatch(skipLogin())}>
        >
        <Image
          style={styles.container}
          source={require('./images/LaunchScreen.jpg')}>
          <Image
            style={styles.container}
            source={require('./images/LaunchScreenText.png')} />
        </Image>
      </TouchableWithoutFeedback>
    );
    //<LoginButton source="First screen" />
  }
}
export default connect(select)(SplashScreen);

async function loginOrLogout() {
  console.log('loginOrLogout');
  try {
    var loginResult = await LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends', 'user_events']);
    console.log('LoginResult is ' + String(loginResult));
    if (loginResult.isCancelled) {
      LoginManager.logOut();
    }
  } catch (exc) {
    console.log('Error calling logInWithReadPermissions' + exc);
  }
}

async function performLoginTransitions(dispatch: Dispatch) {
  //await dispatch(loginWaitingForState())
  const accessToken = await AccessToken.getCurrentAccessToken();
  console.log('AccessToken is ' + String(accessToken));
  if (!accessToken) {
    console.log('Wait for click!');
    return dispatch(loginStartTutorial());
  } else {
    var howLongAgo = Math.round((Date.now() - accessToken.lastRefreshTime) / 1000);
    if (howLongAgo < 60 * 60) {
      console.log('Good click, logging in!');
      return dispatch(loginComplete());
    } else {
      try {
        const token = await AccessToken.refreshCurrentAccessTokenAsync();
        console.log('Refreshed Token result is ' + token);
        if (!token.hasGranted('user_events')) {
          await loginOrLogout();
        }
      } catch (exc) {
        console.log('Exception refreshing or logging in: ' + exc);
        LoginManager.logOut();
      }
    }
    return performLoginTransitions(dispatch);
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // Image's source contains explicit size, but we want
    // it to prefer flex: 1
    width: undefined,
    height: undefined,
  }
});
