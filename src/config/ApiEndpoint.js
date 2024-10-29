import Config from "react-native-config";
import Constant from './Constant';
const AUTH_HEADER =Config.AUTH_HEADER

export default {
  AUTH_HEADER: AUTH_HEADER,
  LOGIN_API: Constant.Base_Url + 'login',
  REGISTER_API: Constant.Base_Url + 'register',
  CHECK_EMAIL: Constant.Base_Url + 'check_email',
  FORGOT_PASS: Constant.Base_Url + 'forgot_password',
  FORGOT_PASS_OTP: Constant.Base_Url + 'forgot_password_otp',
  UPDATE_PROFILE: Constant.Base_Url + 'update_profile',
  CHANGE_PASSWORD: Constant.Base_Url + 'change_password',
  CATEGORY_LIST: Constant.Base_Url + 'category_list',
  ORDER_DETAILS: Constant.Base_Url + 'order_detail',
  ORDER_ON_WAY: Constant.Base_Url + 'order_on_the_way',
  ORDER_PROCCESS: Constant.Base_Url + 'order_processing',
  ORDER_END: Constant.Base_Url + 'order_complete',
  ORDER_OTP: Constant.Base_Url + 'order_otp',
  ADD_EDIT_SERVICE: Constant.Base_Url + 'add_edit_service',
  DELETE_SERVICE: Constant.Base_Url + 'delete_service',
  ORDER_REJECT: Constant.Base_Url + 'order_reject',
  ORDER_ACCEPT: Constant.Base_Url + 'order_accept',
  ORDER_TIMEOUT: Constant.Base_Url + 'order_timeout',
  NOTIFICATION_LIST: Constant.Base_Url + 'notification_list',
  FAVORITE_DRESSER_LIST: Constant.Base_Url + 'user_favorite_list',
  ORDER_LIST: Constant.Base_Url + 'my_order_list',
  GET_PROFILE: Constant.Base_Url + 'profile',
  WALLET_DATA: Constant.Base_Url + 'wallet_list',
  GET_WITHDRAW: Constant.Base_Url + 'user_withdraw_request',
  GIVE_RATING: Constant.Base_Url + 'order_review',
  SETTING: Constant.Base_Url + 'settings',
  REQUEST_ORDER_LIST: Constant.Base_Url + 'request_order_list',
  CHECK_ONGOING_ORDER: Constant.Base_Url + 'check_ongoing_order',
  DELETE_ACCOUNT: Constant.Base_Url + 'delete_profile',
  USER_WITHDRAW_REQUEST: Constant.Base_Url + 'user_withdraw_request',
  ADD_MONEY: Constant.Base_Url + 'add_money', 
  CLEAR_NOTIFICATION_LIST: Constant.Base_Url + 'clear_notification_list',

};
