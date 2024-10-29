import {Platform, StyleSheet} from 'react-native';
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
    marginBottom:5
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
  notificationView: {
    width: config.Constant.SCREEN_WIDTH * 0.95,
    alignSelf: 'center',
    paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.025,
    marginVertical: 5,
    paddingVertical:10,
    backgroundColor:config.Constant.COLOR_LIGHT_BACKGROUND
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  rowViewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rowTitle: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    flex: 1,
    textAlign:'left',
  },
  rowDesc: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 16,
    color: config.Constant.COLOR_DARK_GREY,
    letterSpacing: 0,
    flex: 1,
    textAlign:'left',
    paddingRight: 10,
  },
  rowTime: {
    fontFamily: config.Constant.Font_Roboto_Italic,
    fontSize: 14.5,
    color: config.Constant.COLOR_GREY,
    letterSpacing: 0,
  },
  clearText:{
    fontFamily: config.Constant.Font_Roboto_Italic,
    fontSize: 18,
    width: config.Constant.SCREEN_WIDTH * 0.8,
    textAlign:"right",
    // alignSelf:'center',
    color: config.Constant.COLOR_DARK_GREY,
  },
  emptyString: {
    fontFamily: config.Constant.Font_Roboto_Italic,
    fontSize: 18,
    width: config.Constant.SCREEN_WIDTH * 0.8,
    textAlign:'center',
    alignSelf:'center',
    color: config.Constant.COLOR_DARK_GREY,
  },
});
