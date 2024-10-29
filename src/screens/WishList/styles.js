import {StyleSheet} from 'react-native';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

    backgroundColor: config.Constant.COLOR_WHITE,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getStatusBarHeight(),
    paddingBottom: 15,
    paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
    backgroundColor: 'white',
    shadowColor: config.Constant.COLOR_GREY,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 0.5,
    shadowOpacity: 0.4,
    elevation: 2,
    marginBottom: 5,
  },
  smallIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 18,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    letterSpacing: 1.26,
    alignSelf: 'center',
  },
  wishListView: {
    width: config.Constant.SCREEN_WIDTH * 0.4,
    alignSelf: 'center',
    marginVertical: 15,
  },
  rowViewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    textAlign: 'left',
    marginBottom: 5,
  },
  rowKm: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 13,
    color: config.Constant.COLOR_LIGHT_GREY,
    letterSpacing: 0,
    flex: 1,
    paddingHorizontal: 10,
  },
  rowRating: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 13,
    color: config.Constant.COLOR_YELLOW,
    letterSpacing: 0,
    marginLeft: 5,
  },
  bannerImg: {
    width: '100%',
    height: config.Constant.SCREEN_WIDTH * 0.4,
    borderRadius: 10,
  },
  heartIcon: {
    position: 'absolute',
    zIndex: 1,
    bottom: -13,
    right: 10,
    height: 25,
    width: 25,
    tintColor: '#FF0000',
  },
});
