import {
	checkInternetConnection,
	manageApiResponseCode,
  } from '../Util/Utilities';
  import config from '../config';
  import modules from './index';
  const showLog = true
  const GetApiCall = async (
	url,
	header,
	showNoInternetMessage = true,
	manageApiResponse = true,
  ) => {
	const isInternet = await checkInternetConnection();
  
	if (!isInternet) {
	  if (showNoInternetMessage) {
		modules.DropDownAlert.showAlert(
		  'error',
		  config.I18N.t('no_internet_title'),
		  config.I18N.t('no_internet_msg'),
		);
	  }
	  return null;
	}
	// showLog && console.log(`Token ->> ${config.Constant.USER_DATA.token}`)
	const start = new Date();
	const rawResponse = await fetch(url, {
	  method: 'GET',
	  headers: {
		Authorization: !!config.Constant.USER_DATA.token
		  ? `Bearer ${config.Constant.USER_DATA.token}`
		  : '',
		AuthorizationUser: config.ApiEndpoint.AUTH_HEADER,
		'X-localization': config.Constant.isRTL ? 'ar' : 'en',
	  },
	})
	  .then( async(r) =>{
		
		// showLog && console.log("RESPONSE-1--",new Date() - start)  
		return await r.json()
		})
	  .catch((exc) => {
		
		config.Constant.showLoader.hideLoader();
		modules.DropDownAlert.showAlert(
		  'error',
		  '',
		  config.I18N.t('somethingWentWrong'),
		);
		return null;
	  });
	//   showLog && console.log("RESPONSE-2--",new Date() - start)  
	  showLog && console.log('rawResponse ',url,  rawResponse);
	// const rawResponse = await temp.json()
	if (!manageApiResponse) {
	//   showLog && console.log('rawResponse1 url', rawResponse);
	 console.log('rawResponse2.....1', rawResponse);
	  return null;
	} else if (rawResponse === null) {
	//   showLog && console.log('rawResponse2', rawResponse);
	console.log('rawResponse2.....2', rawResponse);
	  return null;
	} else if (rawResponse.status_code === undefined) {
	//   showLog && console.log('rawResponse3', rawResponse);
	console.log('rawResponse2.....3', rawResponse);
	  return rawResponse;
	} else if (
	  rawResponse.status_code === 200 ||
	  rawResponse.status_code === 101 || rawResponse.status_code === 102
	) {
		console.log('rawResponse2.....4', rawResponse);
	//   showLog && console.log('rawResponse4', rawResponse);
	  return rawResponse;
	} else {
	//   showLog && console.log('rawResponse5', rawResponse);
	console.log('rawResponse2.....5', rawResponse);
	  manageApiResponseCode(rawResponse);
	  return null;
	}
  };
  
  const PostApiCall = async (
	url,
	payLoad,
	header,
	showNoInternetMessage = true,
	manageApiResponse = true,
  ) => {
	const isInternet = await checkInternetConnection();
	if (!isInternet) {
	  if (showNoInternetMessage) {
		modules.DropDownAlert.showAlert(
		  'error',
		  config.I18N.t('no_internet_title'),
		  config.I18N.t('no_internet_msg'),
		);
	  }
	  return null;
	}
	if (!!payLoad && Object.keys(payLoad).length > 0) {
		showLog && console.log(`POST Token ->> ${config.Constant.USER_DATA.token}`)
		const start = new Date();
	  const rawResponse = await fetch(url, {
		method: 'POST',
		headers: {
		  Authorization: !!config.Constant.USER_DATA.token
			? `Bearer ${config.Constant.USER_DATA.token}`
			: '',
		  AuthorizationUser: config.ApiEndpoint.AUTH_HEADER,
		  'X-localization': config.Constant.isRTL ? 'ar' : 'en',
		},
		body: payLoad,
	  })
		.then(async (response) =>{
			// showLog && console.log("RESPONSE-1--",new Date() - start)
			return await response.json()})
		.then((response) => {
		//   showLog && console.log('Response Json:',url, JSON.stringify(response));
		// showLog && console.log("RESPONSE-2--",new Date() - start)
		  return response;
		})
		.catch((exc) => {
		//   showLog && console.log('Response exc:', exc);
		  config.Constant.showLoader.hideLoader();
		  modules.DropDownAlert.showAlert(
			'error',
			'',
			config.I18N.t('somethingWentWrong'),
		  );
		  return null;
		});
		showLog && console.log('rawResponse ',url,payLoad, rawResponse);
	  if (!manageApiResponse) {
		// showLog && console.log('rawResponse1',url, rawResponse);
		return null;
	  } else if (rawResponse === null) {
		// showLog && console.log('rawResponse2', url, rawResponse);
		return rawResponse;
	  } else if (rawResponse.status_code === undefined) {
		// showLog && console.log('rawResponse3', url, rawResponse);
		return rawResponse;
	  } else if (
		rawResponse.status_code === 200 ||
		rawResponse.status_code === 101 || rawResponse.status_code === 102
	  ) {
		// showLog && console.log('rawResponse4',url, rawResponse);
		return rawResponse;
	  } else {
		// showLog && console.log('rawResponse5',url, rawResponse);
		manageApiResponseCode(rawResponse);
	  }
	} else {
	 const start = new Date();
	  const rawResponse = await fetch(url, {
		method: 'POST',
		headers: {
		  Authorization: !!config.Constant.USER_DATA.token
			? `Bearer ${config.Constant.USER_DATA.token}`
			: '',
		  AuthorizationUser: config.ApiEndpoint.AUTH_HEADER,
		  'X-localization': config.Constant.isRTL ? 'ar' : 'en',
		},
	  })
		.then(async (r) =>{
			showLog && console.log("RESPONSE-1--",new Date() - start)
			return await r.json()})
		.catch((exc) => {
		  modules.DropDownAlert.showAlert(
			'error',
			'',
			config.I18N.t('somethingWentWrong'),
		  );
		  return null;
		});
		showLog && console.log("RESPONSE-2--",new Date() - start)
		showLog && console.log('rawResponse ',url, rawResponse);
		
	  if (!manageApiResponse) {
		return null;
	  } else if (rawResponse === null) {
		return null;
	  } else if (rawResponse.status_code === undefined) {
		return rawResponse;
	  } else if (
		rawResponse.status_code === 200 ||
		rawResponse.status_code === 101||
		rawResponse.status_code === 400
	  ) {
		return rawResponse;
	  } else {
		manageApiResponseCode(rawResponse);
		return null;
	  }
	}
  };
  
  export default {
	GetApiCall,
	PostApiCall,
  };
  