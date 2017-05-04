const getQuery = (query) => {
	query = query ? query : window.location.search;
	query = query.replace(/^\?+/,'').replace(/&amp;/,'');
	let querys = query.split('&'),
		len = querys.length,
		params = {};
	while(len--){
		let items = querys[len].split('=');
		if(items[0]){
			let value = items[1] || '';
			try{
				value = decodeURIComponent(value);
			}catch(e){
				value = unescape(value);
			}
			params[decodeURIComponent(items[0])] = value;
		}
	}
	return params;
}
const getDate = (date) => {
	date = date || new Date();
	let year = date.getFullYear();
	let month = date.getMonth()+1;
	let day = date.getDate();
	month = month < 10 ? "0"+month : month;
	day = day < 10 ? "0"+day : day;
	return year+'-'+month+'-'+day;
}

const getSecond = (date) => {
	let seconds = date/1000;
	let minutes = '';
	let hours = '';
	let day = '';

	if(seconds >= 60){
		minutes = Math.floor(seconds/60);
		seconds = seconds%60;
	}
	if(minutes >= 60){
		hours = Math.floor(minutes/60);
		minutes = minutes%60;
	}
	if(hours >= 24){
		day = Math.floor(hours/24);
		hours = hours%24;
	}
	return (day?(day+'天'):'')+(hours?(hours+'小时'):'')+(minutes?(minutes+'分'):'')+parseInt(seconds)+'秒';
}

const Storage = {
	localStorage(key, value) {
		let storage = Storage.getLocalStorage();
		if (storage) {
			if ('undefined' === typeof value) {
				value = storage.getItem(key);
				return value && JSON.parse(value);
			} else {
				storage.setItem(key, JSON.stringify(value));
			}
		}
	},
	sessionStorage(key, value) {
		let storage = Storage.getSessionStorage();
		if (storage) {
			if ('undefined' === typeof value) {
				value = storage.getItem(key);
				return value && JSON.parse(value);
			} else {
				storage.setItem(key, JSON.stringify(value));
			}
		}
	},
	getLocalStorage() {
		let _localStorage;
		try{
			_localStorage = window['localStorage'];
		} catch(e){
			console.log(e);
		}
		Storage.getLocalStorage = function() {
			return window['localStorage'];
		}
		return _localStorage;	
	},
	getSessionStorage() {
		let _sessionStorage;
		try{
			_sessionStorage = window['sessionStorage'];
		} catch(e){
			console.log(e);
		}
		Storage.getSessionStorage = function() {
			return window['sessionStorage'];
		}
		return _sessionStorage;	
	},
	clearLocalStorage(prefix) {
		let storage = Storage.getLocalStorage();
		if (storage) {
			if (prefix) {
				for (let key in storage) {
					if (0 === key.indexOf(prefix)) {
						storage.removeItem(key);
					}
				}
			} else {
				storage.clear();
			}
		}
	},
	clearSessionStorage(prefix) {
		let storage = Storage.getSessionStorage();
		if (storage) {
			if (prefix) {
				for (let key in storage) {
					if (0 === key.indexOf(prefix)) {
						storage.removeItem(key);
					}
				}
			} else {
				storage.clear();
			}
		}
	}
}

export {
	getQuery,
	getDate,
	getSecond,
	Storage
}