import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import width from './getWidth';
import {searchData} from './getSearch';
// import * as homeData from './getHome';

const pop = (state = false, action) => {
	switch (action.type) {
		case 'SET_POP':
			return action.data;
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
const login = (state = false, action) => {
	switch (action.type) {
		case 'SET_LOGIN':
			return action.data;
		default:
      		return state;
	}
}

const reducers = combineReducers(Object.assign({
	width,
	searchData,
	pop,
	loading,
	login,
	routing: routerReducer
},{}));

export default reducers;
