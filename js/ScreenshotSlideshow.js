/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

'use strict';

import React from 'react';
import {
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import type { Dispatch } from './actions/types';
import {disableTracking} from './store/track';
import { loginComplete } from './actions';
import {
  AccessToken,
} from 'react-native-fbsdk';
import {
  disableWrites,
  event,
} from './api/dancedeets';
import {
  logOut,
  navigatePush,
  performSearch,
  updateLocation,
} from './actions';
import {
  injectIntl,
  defineMessages,
} from 'react-intl';

const messages = defineMessages({
  locations: {
    id: 'search.autocompleteLocations',
    defaultMessage: 'New York City, United States\nLos Angeles, United States\nSan Francisco, United States\nWashington DC, United States\nLondon, United Kingdom\nParis, France\nTokyo, Japan\nTaipei, Taiwan\nSeoul, South Korea',
    description: 'A list of locations that we should show in our autocomplete',
  },
});

class _ScreenshotSlideshow extends React.Component {
  state: {
    page: number;
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
    (this: any).transitionPage = this.transitionPage.bind(this);
  }

  componentWillMount() {
    disableTracking();
    disableWrites();
    this.props.transitionPage(this);
  }

  async setupListView(dispatch) {
    // TODO: Fill out dummy token better
    AccessToken.setCurrentAccessToken({
      accessToken: '',
      applicationID: '2347064084',
      userID: '701004',
      declinedPermissions: [],
      expirationTime: 0,
      lastRefreshTime: 0,
      permissions: [],
    });
    const token = await AccessToken.getCurrentAccessToken();
    if (!token) {
      return;
    }
    await dispatch(loginComplete(token));
    const firstLocation = this.props.intl.formatMessage(messages.locations).split('\n')[0];
    await dispatch(updateLocation(firstLocation));
    await dispatch(performSearch());
  }

  async setupEventView(dispatch) {
    const fetchedEvent = await event('397757633752918'); //SYGU 2015
    await dispatch(navigatePush('EVENT_NAV', {key: 'EventView', title: fetchedEvent.name, event: fetchedEvent}));
  }

  async logout(dispatch) {
    dispatch(logOut());
  }

  async transitionPage(dispatch) {
    switch (this.state.page) {
      case 0:
        break;
      case 1:
        await this.setupListView(dispatch);
        break;
      case 1:
        await this.setupEventView(dispatch);
        break;
      case 2:
        // To delete the accesstoken and make this emulator usable again
        await this.logout(dispatch);
        //await this.setupAddEventView(dispatch);
        break;
      case 3:
        //await this.setupProfileView(dispatch);
        break;
      case 4:
        break;
    }
    this.setState({page: this.state.page + 1});
  }

  render() {
    return <View style={{flex: 1}}>
      {this.props.children}
      <TouchableHighlight
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        onPress={() => this.props.transitionPage(this)}
        testID="mainButton">
        <View />
      </TouchableHighlight>
    </View>;
  }
}
export default connect(
  (state) => {
    return {
      translatedEvents: state.translate.events,
    };
  },
  (dispatch: Dispatch) => ({
    transitionPage: (obj) => obj.transitionPage(dispatch),
  }),
)(injectIntl(_ScreenshotSlideshow));
