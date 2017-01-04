import React,{Component} from 'react';
import { connect } from 'react-redux';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import Config from '../../config';
import * as Actions from '../../actions';
// import Layer from '../layer';
// import {Loading} from '../loading';
import Nav from '../common/nav/mobile';
import {Storage} from '../common';

import Focus from '../common/focus/mobile';
import HomeList from '../homeList/mobile';
import Footer from '../common/footer/mobile';

import 'zepto';
import './mobile.scss';
class Home extends Component{
	constructor(props){
		super();
		props.dispatch(Actions.setLoading(true));

		// this.getFocusData = this.getFocusData.bind(this);
		// this.handleDeferred = this.handleDeferred.bind(this);
		// this.getNewData = this.getNewData.bind(this);
		// this.getLikeData = this.getLikeData.bind(this);
		this.state = {
			focusData:[]
		}
	}
	
	getFocusData(){
		let dfd = $.Deferred();
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.advertisement,
		  // data: { name: 'Zepto.js' },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		// dispatch(Actions.setFocus(res.data));
		  		self.setState({focusData:res.data});
		  	}else{
		  		self.props.dispatch(Actions.setMessage(res.message));
		  	}
		  },
		  error: function(xhr, type){
		    self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  },
		  complete: function(){
		  	dfd.resolve();
		  	// dfd.resolve();
		  	// dfd.reject();
		  }
		});
		return dfd.promise();
	}
	handleDeferred(){
		this.dfd = $.Deferred();

		return this.dfd.promise();
	}
	componentWillMount(){
		let self = this;
		let dfdTasks = [this.handleDeferred.call(this)];
		let {state,dispatch} = this.props;
		// 获取滚动图数据
		if(!this.state.focusData.length){
			dfdTasks.push(this.getFocusData.call(this));
		}
		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
		});
		// console.log(Storage.localStorage('recommend'))
		if(!Storage.sessionStorage('recommend')){
			dispatch(Actions.setPop({
				show:'recommend'
			}));
			Storage.sessionStorage('recommend',1);
		}
	}
	render(){
		let {state,dispatch} = this.props;
		
		return (
			<div className="home">
	      		{this.state.focusData.length ? <Focus data={this.state.focusData} /> : null}
	      		<HomeList dfd={this.dfd} dispatch={dispatch} state={state} />
	      		<Footer />
	      		<Nav state={state} dispatch={dispatch} />
			</div>
		)
	}
}
Home = connect((state) => ({state}))(Home);
export default Home;
