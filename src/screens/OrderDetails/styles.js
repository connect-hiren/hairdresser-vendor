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
    width: config.Constant.SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    marginVertical: 15,
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
  },
  rowDesc: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 16,
    color: config.Constant.COLOR_DARK_GREY,
    letterSpacing: 0,
    flex: 1,
    paddingRight: 10,
  },
  rowTime: {
    fontFamily: config.Constant.Font_Roboto_Italic,
    fontSize: 14.5,
    color: config.Constant.COLOR_GREY,
    letterSpacing: 0,
  },
  reviewTxt: {
    fontSize: 13,
    fontFamily: config.Constant.Font_Roboto_Light_Italic,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.9,
    textAlign: 'left',
    flex: 1,
    marginTop: -5,
    marginLeft: 60,
  },
  timeTxt: {
    fontSize: 12,
    fontFamily: config.Constant.Font_LIGHT,
    color: config.Constant.COLOR_GREY,
    letterSpacing: 0.98,
  },
  reviewName: {
    fontSize: 15,
    flex: 1,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    textAlign: 'left',
    marginBottom: 5,
  },
  reviewBox: {
    backgroundColor: config.Constant.COLOR_WHITE,
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  serviceRowView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
    alignItems: 'center',
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerBorderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 5,
    marginLeft: config.Constant.SCREEN_WIDTH * 0.05,
    borderBottomWidth: 1.5,
    borderBottomColor: config.Constant.COLOR_TAB,
  },
  adddressTxt: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    marginBottom: 10,
    width:'90%',alignSelf:'center'
  },
  descStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: config.Constant.COLOR_LIGHT_BG,
    borderRadius: 100,
  },
  descTitle: {
    fontSize: 19,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    flex: 1,
  },
  qtyTitle: {
    fontSize: 19,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    width: 80,
  },
  priceTitle: {
    fontSize: 19,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'right',
    width: 70,
  },
  descData: {
    fontSize: 15,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    flex: 1,
  },
  qtyData: {
    fontSize: 15,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    width: 80,
  },
  priceData: {
    fontSize: 15,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'right',
    width: 70,
  },
  descSubTotal: {
    fontSize: 15,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    flex: 1,
  },
  qtySubTotal: {
    fontSize: 15,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    width: 80,
  },
  priceSubTotal: {
    fontSize: 15,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'right',
    width: 70,
  },
  borderView: {
    width: '90%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    marginTop: 10,
    borderColor: config.Constant.COLOR_BORDER_COLOR,
  },
  btnStyle: {
    width: '85%',
    marginTop: 0,
    marginBottom: 10,
    alignSelf: 'center',
  },
  wrapTxtRow: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 15,
    letterSpacing: 0.84,
    color: config.Constant.COLOR_WHITE,

    paddingTop: 2,
    paddingBottom: 1.5,
  },
  wrapRow: {
    borderColor: config.Constant.COLOR_TAB,
    backgroundColor: config.Constant.COLOR_TAB,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
  },
  mapBox: {
    overflow:'hidden',
    borderRadius: 20,
    width:'90%',
    alignSelf:'center',
    shadowColor: config.Constant.COLOR_GREY,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 1 ,
    backgroundColor:'white',
    shadowOpacity: 1,
    elevation: 5,
    marginBottom:20,
  },
  mapDescTxt:{
      fontFamily:config.Constant.Font_Regular,
      color:'black',
      textAlign:'left',
      width:'90%',
      alignSelf:'center',
      marginVertical:15,
  },
  mapChangeTxt:{
    fontFamily:config.Constant.Font_Regular,
    color:config.Constant.COLOR_TAB,
    textAlign:'left',
    width:'90%',
    alignSelf:'center',
    marginBottom:20,
},
selectedItemsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    alignItems:'center'
  },
  searchName: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    flex: 1,
    textAlign: 'left',
    letterSpacing: 0.98,
    paddingHorizontal: 5,
  },
  emptyIcon:{
    borderRadius:30,
    borderWidth:3,
    height:20,
    width:20,
    borderColor:'#0000000F',
    justifyContent:'center',
    alignItems:'center'
  },
  filledIcon:{
    borderRadius:30,
    borderWidth:0,
    height:14,
    width:14,
    backgroundColor: config.Constant.COLOR_TAB,

  },
  inputStyle: {flex:1,marginRight:10},
  applyStyle: {
      width:100
  },
  statusTxt:{
    fontFamily: config.Constant.Font_Italic_LIGHT,
    color:'red',
    fontSize:18,
    alignSelf:'center',
    textAlign:'center',
    marginBottom:15
  },
  counterStyle:{
    width:'100%',
    textAlign:'center',
    fontWeight:'500',
    color:config.Constant.COLOR_TAB,
    fontSize:25,
    marginBottom:10,
  },
});