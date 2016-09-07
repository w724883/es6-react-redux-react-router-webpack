import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import Pop from './pop';
import {Loading} from './loading';

// import Mobile from './mobile';
// import Pc from './pc';

import 'zepto';
import '../static/css/index.scss';
import '../static/css/fonts.css';


const mapStateToProps = (state) => {
	return {state}
}
const mapDispatchToProps = (dispatch) => {
	// 设备宽度
	$(window).on('resize',function(e){
		let $width = $(window).width();
		dispatch(Actions.setWidth($width));
	}).trigger('resize');


	return {dispatch};
}

class App extends Component{
	
	render(){
		let {state,dispatch} = this.props;
		// let boundActionCreators = bindActionCreators(Actions, dispatch);
		console.log(state)
		return (
			<div>
				{this.props.children}
				<Pop data={state.pop} dispatch={dispatch} />
				<Loading data={state.loading} />
			</div>
		);
	}
	
}

App = connect(mapStateToProps,mapDispatchToProps)(App);

export default App;