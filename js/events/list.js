/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

import React, {
  ListView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BlurView } from 'react-native-blur';
import { connect } from 'react-redux';

import { EventRow } from './uicomponents';
import { Event } from './models';
import { search } from '../api';

type Props = {
  onEventSelected: (x: Event) => void,
};


class SearchHeader extends React.Component {
  render() {
    return <BlurView style={[{paddingTop: StatusBar.currentHeight}, styles.floatTop, styles.statusBar]} blurType="dark">
      <TextInput placeholder="Location" style={styles.searchField} />
      <TextInput placeholder="Keywords" style={styles.searchField} />
    </BlurView>;
  }
}

class EventListContainer extends React.Component {
  props: Props;

  state: {
    dataSource: ListView.DataSource,
    loaded: boolean,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loaded ? this.renderListView() : this.renderLoadingView()}
        <SearchHeader />
      </View>
    );
  }

  renderListView() {
    const onEventSelected = this.props.onEventSelected;
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(e) =>
          <EventRow
            event={new Event(e)}
            onEventSelected={onEventSelected}
          />
        }
        initialListSize={10}
        pageSize={5}
        scrollRenderAheadDistance={10000}
        scrollsToTop={false}
      />
    );
  }

  renderLoadingView() {
    return (
      <Text style={styles.loading}>
        Loading events...
      </Text>
    );
  }

  async fetchData() {
    try {
      const responseData = await search('NYC', '', 'UPCOMING');
      // TODO: This is the slow part. :( Can we request less data?
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData.results),
        loaded: true,
      });
    } catch (e) {
      // TODO: error fetching events.
      console.log('error fetching events', e);
    }
  }
}

export default connect()(EventListContainer);


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
  },
  floatTop: {
    position: 'absolute',
    paddingTop: 15,
    top: 0,
    left: 0,
    right: 0,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  searchField: {
    borderRadius: 5,
    height: 30,
    flex: 1,
    margin: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  loading: {
    color: 'white',
    textAlign: 'center',
  }
});
