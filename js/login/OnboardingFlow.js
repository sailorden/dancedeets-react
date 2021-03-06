/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

import React from 'react';
import {
  Linking
} from 'react-native';
import { connect } from 'react-redux';
import TutorialScreen from './TutorialScreen';
import NoLoginScreen from './NoLoginScreen';
import { loginButtonPressed } from './logic';
import { track } from '../store/track';

type ScreenState = 'CAROUSEL' | 'NO_LOGIN';

class OnboardingFlow extends React.Component {
  props: {
    onLogin: () => void,
  };

  state: {
    screen: ScreenState,
  };

  constructor(props) {
    super(props);
    this.state = {
      screen: 'CAROUSEL',
    };
    (this: any).onDontWantLoginPressed = this.onDontWantLoginPressed.bind(this);
    (this: any).onOpenWebsite = this.onOpenWebsite.bind(this);
  }

  onDontWantLoginPressed() {
    track('Login - Without Facebook');
    this.setState({...this.state, screen: 'NO_LOGIN'});
  }

  onOpenWebsite(button: string) {
    track('Login - Use Website', {'Button': button});
    Linking.openURL('http://www.dancedeets.com/').catch(err => console.error('Error opening dancedeets.com:', err));
  }

  render() {
    if (this.state.screen === 'CAROUSEL') {
      return <TutorialScreen
        onLogin={() => {
          track('Login - FBLogin Button Pressed', {'Button': 'First Screen'});
          this.props.onLogin();
        }}
        onNoLogin={this.onDontWantLoginPressed}
      />;
    } else if (this.state.screen === 'NO_LOGIN') {
      return <NoLoginScreen
        onLogin={() => {
          track('Login - FBLogin Button Pressed', {'Button': 'Second Screen'});
          this.props.onLogin();
        }}
        onNoLogin={this.onOpenWebsite}
        />;
    }
  }
}

export default connect(
    null,
    (dispatch) => {
      return {
        onLogin: (e) => loginButtonPressed(dispatch),
      };
    },
)(OnboardingFlow);
