/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

'use strict';

import FacebookSDK from 'FacebookSDK';
import ActionSheetIOS from 'ActionSheetIOS';
import {Platform} from 'react-native';
import Alert from 'Alert';

import type { Action, ThunkAction } from './types';

async function FacebookLogin(scope): Promise {
  return new Promise((resolve, reject) => {
    FacebookSDK.login((response) => {
      if (response && !response.error) {
        resolve(response);
      } else {
        reject(response && response.error);
      }
    }, {scope});
  });
}

async function queryFacebookAPI(path, ...args): Promise {
  return new Promise((resolve, reject) => {
    FacebookSDK.api(path, ...args, (response) => {
      if (response && !response.error) {
        resolve(response);
      } else {
        reject(response && response.error);
      }
    });
  });
}
export function loginWaitingForState(): Action {
  return {
    type: 'LOGIN_LOADING',
  };
}
export function loginStartTutorial(): Action {
  return {
    type: 'LOGIN_START_TUTORIAL',
  };
}

export function loginComplete(): Action {
  return {
    type: 'LOGIN_LOGGED_IN',
  };
}

export function skipLogin(): Action {
  return {
    type: 'LOGIN_SKIPPED',
  };
}

export function logOut(): ThunkAction {
  return (dispatch) => {
    // TODO: Mixpanel logout
    FacebookSDK.logout();

    // TODO: Make sure reducers clear their state
    return dispatch({
      type: 'LOGIN_LOGGED_OUT',
    });
  };
}

export function logOutWithPrompt(): ThunkAction {
  return (dispatch, getState) => {
    let name = getState().user.name || 'there';

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: `Hi, ${name}`,
          options: ['Log out', 'Cancel'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            dispatch(logOut());
          }
        }
      );
    } else {
      Alert.alert(
        `Hi, ${name}`,
        'Log out from DanceDeets?',
        [
          { text: 'Cancel' },
          { text: 'Log out', onPress: () => dispatch(logOut()) },
        ]
      );
    }
  };
}