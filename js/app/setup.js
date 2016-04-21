/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

'use strict';

import App from './app';
//import FacebookSDK from 'FacebookSDK';
import React from 'React';
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import Mixpanel from 'react-native-mixpanel';

export default function setup(): React.Component {
  console.disableYellowBox = true;

  if (__DEV__) {
    Mixpanel.sharedInstanceWithToken('668941ad91e251d2ae9408b1ea80f67b');
  } else {
    Mixpanel.sharedInstanceWithToken('f5d9d18ed1bbe3b190f9c7c7388df243');
  }

  class Root extends React.Component {
    constructor() {
      super();
      this.state = {
        isLoading: true,
        store: configureStore(() => this.setState({isLoading: false})),
      };
    }
    render() {
      if (this.state.isLoading) {
        return null;
      }
      return (
        <Provider store={this.state.store}>
          <App />
        </Provider>
      );
    }
  }

  return Root;
}

global.LOG = (...args) => {
  console.log('/------------------------------\\');
  console.log(...args);
  console.log('\\------------------------------/');
  return args[args.length - 1];
};