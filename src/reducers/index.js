import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
// import width from './getWidth';
import {searchData} from './getSearch';
import 'zepto';

import 'cookie';

const pop = (state = {
	show:false,
	data:null
}, action) => {
	switch (action.type) {
		case 'SET_POP':
			return {
				show:action.data.show,
				data:action.data.data
			};
		default:
      		return state;
	}
}
const loading = (state = true, action) => {
	switch (action.type) {
		case 'SET_LOADING':
			return action.data;
		default:
      		return state;
	}
}
const message = (state = {
	text:''
}, action) => {
	switch (action.type) {
		case 'SET_MESSAGE':
			return {
				text:action.data.text
			};
		default:
      		return state;
	}
}
const login = (state = !!$.fn.cookie('user_id'), action) => {
	switch (action.type) {
		case 'SET_LOGIN':
			return action.data;
		default:
      		return state;
	}
}
// const ua = (state = {
// 	ua:window.navigator.userAgent.toLowerCase(),
// 	weixin:window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'
// }, action) => {
// 	switch (action.type) {
// 		case 'SET_UA':
// 			return {
// 				ua:action.data.ua,
// 				weixin:action.data.weixin
// 			};
// 		default:
//       		return state;
// 	}
// }
const cart = (state = {
			list:[],
			add:[]
		}, action) => {
	switch (action.type) {
		case 'SET_CART':
			return {
				list:action.data.list,
				add:action.data.add
			};
		default:
      		return state;
	}
}
// const my = (state = {
// 		username: "",
// 		sex:"1",
// 		birthday:"",
// 		phone: "",
// 		reg_type:"",
// 		address:"",
// 		passwd:"",
// 		pay_passwd:""
// 	}, action) => {
// 	switch (action.type) {
// 		case 'SET_MY':
// 			return {
// 				username: action.data.username,
// 				sex:action.data.sex,
// 				birthday:action.data.birthday,
// 				phone: action.data.phone,
// 				reg_type:action.data.reg_type,
// 				address:action.data.address,
// 				passwd:action.data.passwd,
// 				pay_passwd:action.data.pay_passwd
// 			};
// 		default:
//       		return state;
// 	}
// }
const order = (state = {
			// payType:1,
			calendar:{
				show:true,
				data:''
			},
			distribution:{
				show:false,
				type:0,
				time:'',
				address:''
			},
			discount:{
				show:false,
				integral:{
					value:0,
					checked:false
				},
				// balance:{
				// 	value:0,
				// 	checked:true
				// },
				coupon:{
					value:'',
					checked:false,
					data:[]
				}
			},
			remark:{
				show:false,
				data:""
			},
			cost:{
				freight:0,
				discount:0,
				sale:0,
				integral:0
			}
		}, action) => {
	switch (action.type) {
		case 'SET_ORDER':
			return {
				// payType:action.data.payType,
				calendar:action.data.calendar,
				distribution:action.data.distribution,
				discount:action.data.discount,
				remark:action.data.remark,
				cost:action.data.cost
			};
		default:
      		return state;
	}
}
const reducers = combineReducers({
	searchData,
	pop,
	loading,
	login,
	cart,
	order,
	message,
	// my,
	// ua,
	routing: routerReducer
});

export default reducers;
