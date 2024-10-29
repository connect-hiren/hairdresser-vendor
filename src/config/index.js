import Constant from './Constant'
import ApiEndpoint from './ApiEndpoint'
import I18N from './I18N'
import Sound from 'react-native-sound';
var customSound = new Sound('request.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      return;
    } 
    customSound.setCategory('Playback');
    customSound.setNumberOfLoops(37)
  });
export default {
    Constant,
    ApiEndpoint,
    I18N,
    MSound: customSound

}