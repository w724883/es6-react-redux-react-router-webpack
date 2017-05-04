import React,{Component} from 'react';
import { connect } from 'react-redux';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import Config from '../../config';
import * as Actions from '../../actions';
// import Layer from '../layer';
// import {Loading} from '../loading';
import {Storage} from '../common';
import Nav from '../common/nav/pc';
import Focus from '../common/focus/pc';
import HomeList from '../homeList/pc';
import Footer from '../common/footer/pc';

import 'zepto';
import './pc.scss';
class Home extends Component{
	constructor(props){
		super();
		

		this.getFocusData = this.getFocusData.bind(this);
		this.handleDeferred = this.handleDeferred.bind(this);
		// this.getNewData = this.getNewData.bind(this);
		// this.getLikeData = this.getLikeData.bind(this);
		this.state = {
			focusData:[]
		}
	}
	getFocusData(dispatch){
		let dfd = $.Deferred();
		let seft = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.advertisement,
		  // data: { name: 'Zepto.js' },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		// dispatch(Actions.setFocus(res.data));
		  		seft.setState({focusData:res.data});
		  	}else{
		  		dispatch(Actions.setMessage(res.message));
		  	}
		  },
		  error: function(xhr, type){
		    console.log(type);
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
		let dfdTasks = [this.handleDeferred()];
		let {state,dispatch} = this.props;
		dispatch(Actions.setLoading(true));
		// 获取滚动图数据
		if(!this.state.focusData.length){
			dfdTasks.push(this.getFocusData());
		}
		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
		});
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
