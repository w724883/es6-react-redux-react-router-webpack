import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
// import width from './getWidth';
import {searchData} from './getSearch';
import 'zepto';

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
// const loading = (state = true, action) => {
// 	switch (action.type) {
// 		case 'SET_LOADING':
// 			return action.data;
// 		default:
//       		return state;
// 	}
// }
const login = (state = false, action) => {
	switch (action.type) {
		case 'SET_LOGIN':
			return action.data;
		default:
      		return state;
	}
}

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
const order = (state = {
			payType:1
		}, action) => {
	switch (action.type) {
		case 'SET_ORDER':
			return {
				payType:action.data.payType,
				calendar:action.data.calendar,
				distribution:action.data.distribution,
				discount:action.data.discount,
				remark:action.data.remark
			};
		default:
      		return state;
	}
}
const reducers = combineReducers({
	searchData,
	pop,
	// loading,
	login,
	cart,
	order,
	routing: routerReducer
});

export default reducers;
