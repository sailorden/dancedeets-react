/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

'use strict';

import React from 'react';
import {
  Image,
  StyleSheet,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import generateNavigator from '../containers/generateNavigator';
import ProfilePage from '../containers/Profile';
import { yellowColors, gradientBottom, gradientTop } from '../Colors';
import LinearGradient from 'react-native-linear-gradient';
import {
  semiNormalize,
} from '../ui';
import {
  injectIntl,
  defineMessages,
} from 'react-intl';
import { connect } from 'react-redux';
import EventListContainer from '../events/list';
import EventPager from '../events/EventPager';
import {
  BlogList,
  BlogPostList,
  BlogPostContents,
} from '../learn/BlogList';
import {
  ZoomableImage,
} from '../ui';
import {
  selectTab,
} from '../actions';
import AddEvents from '../containers/AddEvents';
import NotificationPreferences from '../containers/NotificationPreferences';
import { track, trackWithEvent } from '../store/track';
import { setDefaultState } from '../reducers/navigation';
import {
  PlaylistListView,
  PlaylistStylesView,
  PlaylistView,
} from '../learn/playlistViews';
import type {
  NavigationSceneRendererProps,
} from 'NavigationTypeDefinition';

const messages = defineMessages({
  events: {
    id: 'tab.events',
    defaultMessage: 'Events',
    description: 'Tab button to show list of events',
  },
  learn: {
    id: 'tab.learn',
    defaultMessage: 'Tutorials',
    description: 'Tab button to help folks learn about dance',
  },
  about: {
    id: 'tab.about',
    defaultMessage: 'About',
    description: 'Tab button to show general info about Dancedeets, Profile, and Share info',
  },
  addEvent: {
    id: 'navigator.addEvent',
    defaultMessage: 'Add Event',
    description: 'Title Bar for Adding Event',
  },
  viewFlyer: {
    id: 'navigator.viewFlyer',
    defaultMessage: 'View Flyer',
    description: 'Title Bar for Viewing Flyer',
  },
  eventsTitle: {
    id: 'navigator.eventsTitle',
    defaultMessage: 'DanceDeets: Events',
    description: 'Initial title bar for Events tab',
  },
  learnTitle: {
    id: 'tutorialVideos.navigatorTitle',
    defaultMessage: 'Tutorials',
    description: 'Initial title bar for Learn tab',
  },
  styleTutorialTitle: {
    id: 'tutorialVideos.styleTutorialTitle',
    defaultMessage: '{style} Tutorials',
    description: 'Title Bar for viewing a given style\'s tutorials',
  },
  notificationsTitle: {
    id: 'navigator.notificationsTitle',
    defaultMessage: 'Notification Settings',
    description: 'Titlebar for notification settings'
  },
});

const EventNavigator = generateNavigator('EVENT_NAV');
setDefaultState('EVENT_NAV', { key: 'EventList', message: messages.eventsTitle });

const LearnNavigator = generateNavigator('LEARN_NAV');
setDefaultState('LEARN_NAV', { key: 'TutorialStyles', message: messages.learnTitle });

const AboutNavigator = generateNavigator('ABOUT_NAV');
setDefaultState('ABOUT_NAV', { key: 'About', message: messages.about });

class GradientTabBar extends React.Component {
  render() {
    return <LinearGradient
      start={[0.0, 0.0]} end={[0.0, 1]}
      colors={[gradientTop, gradientBottom]}
      style={this.props.style}>
      {this.props.children}
    </LinearGradient>;
  }
}

class _EventView extends React.Component {
  render() {
    const { scene } = this.props.sceneProps;
    const { route } = scene;
    switch (route.key) {
    case 'EventList':
      return <EventListContainer
        onEventSelected={(event) => {
          trackWithEvent('View Event', event);
          this.props.navigatable.onNavigate({key: 'EventView', title: event.name, event: event});
        }}
        onAddEventClicked={(source) => {
          track('Add Event', {source: source});
          this.props.navigatable.onNavigate({key: 'AddEvent', title: this.props.intl.formatMessage(messages.addEvent)});
        }}
      />;
    case 'EventView':
      return <EventPager
        onEventNavigated={(event)=> {
          trackWithEvent('View Event', event);
          this.props.navigatable.onSwap('EventView', {key: 'EventView', title: event.name, event: event});
        }}
        onFlyerSelected={(event)=> {
          trackWithEvent('View Flyer', event);
          this.props.navigatable.onNavigate({
            key: 'FlyerView',
            title: this.props.intl.formatMessage(messages.viewFlyer),
            image: event.cover.images[0].source,
            width: event.cover.images[0].width,
            height: event.cover.images[0].height,
          });
        }}
        selectedEvent={route.event}
      />;
    case 'FlyerView':
      return <ZoomableImage
        url={route.image}
        width={route.width}
        height={route.height}
      />;
    case 'AddEvent':
      return <AddEvents />;
    }
  }
}
const EventView = injectIntl(_EventView);

class _LearnView extends React.Component {
  render() {
    const { scene } = this.props.sceneProps;
    const { route } = scene;
    switch (route.key) {
    case 'BlogList':
      return <BlogList
        onSelected={(blog) => {
          // TODO: Track blog details
          track('Blog Selected');
          //this.props.navigatable.onNavigate({key: 'BlogPostList', title: blog.title, blog: blog});
          this.props.navigatable.onNavigate({key: 'Tutorial', title: blog.title, tutorial: blog});
        }}
        />;
    case 'TutorialStyles':
      return <PlaylistStylesView
        onSelected={(style) => {
          track('Tutorial Style Selected', {
            tutorialStyle: style.title,
          });
          this.props.navigatable.onNavigate({key: 'TutorialList', title: this.props.intl.formatMessage(messages.styleTutorialTitle, {style: style.title}), tutorials: style.tutorials});
        }}
        />;
    case 'TutorialList':
      return <PlaylistListView
        playlists={route.tutorials}
        onSelected={(playlist) => {
          track('Tutorial Selected', {
            tutorialName: playlist.title,
            tutorialStyle: playlist.style,
          });
          this.props.navigatable.onNavigate({key: 'Tutorial', title: playlist.title, tutorial: playlist});
        }}
        />;
    case 'Tutorial':
      return <PlaylistView
        playlist={route.tutorial}
        />;
    case 'BlogPostList':
      return <BlogPostList
        blog={route.blog}
        onSelected={(post) => {
          // TODO: Track post details
          track('Blog Post Selected');
          this.props.navigatable.onNavigate({key: 'BlogPostItem', title: post.title, post: post});
        }}
        />;
    case 'BlogPostItem':
      return <BlogPostContents
        post={route.post}
        />;
    }
  }
}
const LearnView = injectIntl(_LearnView);

class _AboutView extends React.Component {
  render() {
    const { scene } = this.props.sceneProps;
    const { route } = scene;
    switch (route.key) {
    case 'About':
      return <ProfilePage
        onNotificationPreferences={() => {
          track('Open Notification Preferences');
          this.props.navigatable.onNavigate({key: 'NotificationPreferences', title: this.props.intl.formatMessage(messages.notificationsTitle)});
        }}
        />;
    case 'NotificationPreferences':
      return <NotificationPreferences>Hey</NotificationPreferences>;
    }
  }
}
const AboutView = injectIntl(_AboutView);

class _TabbedAppView extends React.Component {
  icon(source) {
    return <Image source={source} style={styles.icon}/>;
  }

  render() {
    return <TabNavigator
        tabBarStyle={styles.tabBarStyle}
        sceneStyle={styles.tabBarSceneStyle}
        tabBarClass={GradientTabBar}
      >
      <TabNavigator.Item
        selected={this.props.selectedTab === 'events'}
        title={this.props.intl.formatMessage(messages.events)}
        titleStyle={styles.titleStyle}
        selectedTitleStyle={styles.selectedTitleStyle}
        renderIcon={() => this.icon(require('../containers/icons/events.png'))}
        renderSelectedIcon={() => this.icon(require('../containers/icons/events-highlighted.png'))}
        onPress={() => {
          if (this.props.selectedTab === 'events') {
            this.refs.event_navigator.dispatchProps.goHome();
          } else {
            track('Tab Selected', {Tab: 'Events'});
            this.props.selectTab('events');
          }
        }}>
        <EventNavigator
          ref="event_navigator"
          renderScene={(sceneProps: NavigationSceneRendererProps) =>
            <EventView sceneProps={sceneProps} navigatable={this.refs.event_navigator && this.refs.event_navigator.dispatchProps} />
          }
          />
      </TabNavigator.Item>
      <TabNavigator.Item
        selected={this.props.selectedTab === 'learn'}
        title={this.props.intl.formatMessage(messages.learn)}
        titleStyle={styles.titleStyle}
        selectedTitleStyle={styles.selectedTitleStyle}
        renderIcon={() => this.icon(require('../containers/icons/learn.png'))}
        renderSelectedIcon={() => this.icon(require('../containers/icons/learn-highlighted.png'))}
        onPress={() => {
          if (this.props.selectedTab === 'learn') {
            this.refs.learn_navigator.dispatchProps.goHome();
          } else {
            track('Tab Selected', {Tab: 'Learn'});
            this.props.selectTab('learn');
            //this.setState({ selectedTab: 'learn' });
          }
        }}>
        <LearnNavigator
          ref="learn_navigator"
          renderScene={(sceneProps: NavigationSceneRendererProps) =>
            <LearnView sceneProps={sceneProps} navigatable={this.refs.learn_navigator && this.refs.learn_navigator.dispatchProps} />
          }
          />
      </TabNavigator.Item>
      <TabNavigator.Item
        selected={this.props.selectedTab === 'about'}
        title={this.props.intl.formatMessage(messages.about)}
        titleStyle={styles.titleStyle}
        selectedTitleStyle={styles.selectedTitleStyle}
        renderIcon={() => this.icon(require('../containers/icons/profile.png'))}
        renderSelectedIcon={() => this.icon(require('../containers/icons/profile-highlighted.png'))}
        onPress={() => {
          if (this.props.selectedTab !== 'about') {
            track('Tab Selected', {Tab: 'About'});
            this.props.selectTab('about');
          }
        }}>
        <AboutNavigator
          ref="about_navigator"
          renderScene={(sceneProps: NavigationSceneRendererProps) =>
            <AboutView sceneProps={sceneProps} navigatable={this.refs.about_navigator && this.refs.about_navigator.dispatchProps} />
          }
        />
      </TabNavigator.Item>
    </TabNavigator>;
  }
}
export default connect(
  state => ({
    selectedTab: state.mainTabs.selectedTab,
  }),
  dispatch => ({
    selectTab: (x) => dispatch(selectTab(x)),
  }),
)(injectIntl(_TabbedAppView));

var tabBarHeight = semiNormalize(52);

let styles = StyleSheet.create({
  icon: {
    width: semiNormalize(28),
    height: semiNormalize(28),
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    height: tabBarHeight,
  },
  tabBarSceneStyle: {
    paddingBottom: tabBarHeight,
  },
  titleStyle: {
    color: 'white',
    fontSize: semiNormalize(14),
  },
  selectedTitleStyle: {
    color: yellowColors[1],
  },
});
