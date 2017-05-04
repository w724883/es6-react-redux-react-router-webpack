import React,{Component} from 'react';
// import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as Actions from '../actions';
import {Storage} from './common';
import Pop from './common/pop/mobile';
import Message from './common/message/mobile';
import Config from '../config';
// import Mobile from './mobile';
// import Pc from './pc';
import {Loading} from './common/loading/mobile';
import 'zepto';
import 'babel-polyfill';
import '../static/css/mobile.scss';

class App extends Component{
	// componentWillMount(){
	// 	if(($.fn.cookie('is_complete') == 1) && (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') && !!$.fn.cookie('user_id')){
	// 		browserHistory.push('/complete');
	// 		return false;
	// 	}
		
	// }
	componentWillUpdate(props) {
		let {state,dispatch} = props;
		if(state.message.text){

	        dispatch(Actions.setMessage({
	            text:''
	        }));
		}
	}
	render(){
		let {state,dispatch} = this.props;
		// let boundActionCreators = bindActionCreators(Actions, dispatch);
		console.log(state);
		return (
			<div>
				{this.props.children}
				<Pop state={state} dispatch={dispatch} />
				<Message state={state} dispatch={dispatch} />
				<Loading state={state} />
			</div>
		);
	}

}

App = connect((state) => ({state}))(App);

export default App;
