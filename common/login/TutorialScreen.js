import ViewPager from 'react-native-viewpager';
import React, {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-carousel';
import LinearGradient from 'react-native-linear-gradient';
import LoginButton from './LoginButton';

var PAGES = [
  'Page 0',
  'Page 1',
  'Page 2',
  'Page 3',
];

class TopView extends React.Component {
  render() {
    var listItems = this.props.items.map((val, i) =>
      <Text key={i} style={styles.onboardListItem}>{val}</Text>
    );
    return (
      <View style={styles.centerItems} >
        <Text style={styles.onboardHeader}>{this.props.header.toUpperCase()}</Text>
        <View style={styles.onboardList}>
          {listItems}
        </View>
      </View>
    );
  }
}

export default class TutorialScreen extends React.Component {
  constructor(props) {
    super(props);
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });
    this.state = {
      dataSource: dataSource.cloneWithPages(PAGES),
    };
    this._renderPage = this._renderPage.bind(this);
  }

  render() {
    var pages = PAGES.map((val, i) => this._renderPage(i));
    return <Carousel
      indicatorOffset={0}
      indicatorColor="#FFFFFF"
      indicatorSize={25}
      indicatorSpace={15}
      animate={false}
      loop={false}
      >
      {pages}
    </Carousel>;
  }

  _renderPage(pageId: number) {
    var contents = this._renderPageContents(pageId);
    var windowSize = Dimensions.get('window');
    return <View
      style={{
        flex: 1,
        width: windowSize.width,
        height: windowSize.height,
      }}
      key={pageId}>
    {contents}
    </View>;
  }

  _renderPageContents(pageID: number) {
    // We manually insert a bottomFade into each page below,
    // so that we can stick buttons/links/text on top of the fade.

    var bottomFade = <LinearGradient
      start={[0.0, 0.0]} end={[0.0, 1.0]}
      locations={[0.0, 0.8, 1.0]}
      colors={['#00000000', '#000000CC', '#000000CC']}
      style={styles.bottomFade} />;

    if (pageID === 0) {
      return <Image
        style={styles.container}
        source={require('./images/LaunchScreen.jpg')}>
        {bottomFade}
        <Image
          style={styles.container}
          source={require('./images/LaunchScreenText.png')} />
      </Image>;
    } else if (pageID === 1) {
      return <Image
        style={styles.container}
        source={require('./images/Onboard1.jpg')}>
        {bottomFade}
        <Image
        style={[styles.container, styles.centerItems]}
          source={require('./images/Onboard1Text.png')}>
          <TopView header="Take a Trip:" items={[
            'Meet local dancers',
            'Hit up dance events',
          ]}/>
        </Image>
      </Image>;
    } else if (pageID === 2) {
      return <Image
        style={[styles.container, styles.centerItems]}
        source={require('./images/Onboard2.jpg')}>
        {bottomFade}
        <TopView header="Learn to Dance:" items={[
          'Take a class',
          'Watch a show',
          'Hit the clubs',
        ]}/>
      </Image>;
    } else if (pageID === 3) {
      return <View style={styles.container}>
        <Image
          style={styles.container}
          source={require('./images/Onboard3.jpg')}>
          {bottomFade}
          <Image
            style={[styles.container, styles.centerItems, styles.topAndBottom]}
            source={require('./images/Onboard3Text.png')}>
            <TopView header="Promote your event:" items={[
              'Share your event',
              "Share your city's events",
              'Reach dancers worldwide\nand join our 90,000 events',
            ]} />
            <View style={[styles.centerItems, styles.bottomBox]}>
              <LoginButton icon={require('./icons/facebook.png')} type="primary" caption="Login with Facebook" />
              <TouchableOpacity style={styles.bottomLowerLink} activeOpacity={0.7}><Text style={[styles.bottomLink, styles.bottomThinLink]}>DON'T WANT TO LOGIN?</Text></TouchableOpacity>
            </View>
          </Image>
        </Image>
      </View>;
    }
  }
}

var styles = StyleSheet.create({
  topAndBottom: {
    justifyContent: 'space-between',
  },
  onboardHeader: {
    color: 'white',
    top: 60,
    fontSize: 30,
    fontWeight: 'bold',
  },
  onboardList: {
    top: 80,
  },
  onboardListItem: {
    color: 'white',
    lineHeight: 35,
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBox: {
    height: 125,
  },
  bottomLink: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    top: 0,
  },
  bottomLowerLink: {
    top: 10,
  },
  bottomThinLink: {
    fontWeight: 'normal',
  },
  centerItems: {
    alignItems: 'center',
  },
  bottomFade: {
    position: 'absolute',
    flex: 1,
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // Image's source contains explicit size, but we want
    // it to prefer flex: 1
    width: undefined,
    height: undefined,
  },
});