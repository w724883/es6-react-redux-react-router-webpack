import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
// import * as Actions from '../actions';
import Pop from './pop';
// import {Loading} from './loading';
import Config from '../config';
// import Mobile from './mobile';
// import Pc from './pc';

import 'zepto';
import '../static/css/index.scss';
import '../static/css/fonts.css';

// 设备宽度
$(window).on('resize',function(e){
	let $width = $(window).width();
	// dispatch(Actions.setWidth($width));
	if($width > Config.media){
		window.location.href = '/pc.html';
	}
}).trigger('resize');

class App extends Component{
	
	render(){
		let {state,dispatch} = this.props;
		// let boundActionCreators = bindActionCreators(Actions, dispatch);
		console.log(state);
		return (
			<div>
				
				{this.props.children}
				<Pop state={state} dispatch={dispatch} />
				
			</div>
		);
	}
	
}

App = connect((state) => ({state}))(App);

export default App;