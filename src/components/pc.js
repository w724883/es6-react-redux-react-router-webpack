import React,{Component} from 'react';
// import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import Pop from './common/pop/pc';
import Message from './common/message/pc';
import Config from '../config';
// import Mobile from './mobile';
// import Pc from './pc';
import {Loading} from './common/loading/pc';
import 'zepto';
import 'babel-polyfill';
import '../static/css/pc.scss';


class App extends Component{
	// componentWillMount(){
	// 	this.props.dispatch(Actions.setLoading(false));
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
