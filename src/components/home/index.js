import React,{Component} from 'react';
import { connect } from 'react-redux';
import Config from '../../config';
import * as Actions from '../../actions';
import Nav from '../nav/mobile';
import Focus from '../focus/mobile';
import HomeList from '../homeList';
import Footer from '../footer';
import "./mobile.scss";

import Pc from './pc';
import 'zepto';

class Home extends Component{
	constructor(){
		super();
		this.getFocusData = this.getFocusData.bind(this);
		// this.getHotData = this.getHotData.bind(this);
		// this.getNewData = this.getNewData.bind(this);
		// this.getLikeData = this.getLikeData.bind(this);
		this.state = {
			focusData:[]
		}
	}
	getFocusData(dispatch){
		let dfd = $.Deferred();
		let seft = this;
		$.get(Config.api.advertisement,function(res){
			if(res.code == 200){
				// dispatch(Actions.setFocus(res.data));
				seft.setState({focusData:res.data});
			}else{
				console.log(res.message);
			}
			
		}).fail(function(error){
			console.log(error);
		}).always(function(){
			dfd.resolve();
			// dfd.resolve();
			// dfd.reject();
		});
		return dfd.promise();
	}
	// getHotData(dispatch){
	// 	let dfd = $.Deferred();
	// 	let self = this;
	// 	$.get(Config.api.hot_goods,function(res){
	// 		if(res.code == 200){
	// 			// dispatch(Actions.setHot(res.data.item));
	// 			let homeData = self.state.homeData;
	// 			homeData[0] = res.data.item;
	// 			self.setState({homeData:homeData});
	// 		}else{
	// 			console.log(res.message);
	// 		}
	// 	}).fail(function(error){
	// 		console.log(error);
	// 	}).always(function(){
	// 		dfd.resolve();
	// 	});
	// 	return dfd.promise();
	// }
	// getNewData(dispatch){
	// 	let dfd = $.Deferred();
	// 	let self = this;
	// 	$.get(Config.api.new_goods,function(res){
	// 		if(res.code == 200){
	// 			// dispatch(Actions.setNew(res.data.item));
	// 			let homeData = self.state.homeData;
	// 			homeData[1] = res.data.item;
	// 			self.setState({homeData:homeData});
	// 		}else{
	// 			console.log(res.message);
	// 		}
	// 	}).fail(function(error){
	// 		console.log(error);
	// 	}).always(function(){
	// 		dfd.resolve();

	// 	});
	// 	return dfd.promise();
	// }
	// getLikeData(dispatch){
	// 	let dfd = $.Deferred();
	// 	let self = this;
	// 	$.get(Config.api.my_like,function(res){
	// 		if(res.code == 200){
	// 			let homeData = self.state.homeData;
	// 			homeData[2] = res.data;
	// 			self.setState({homeData:homeData});
	// 			dispatch(Actions.setLogin(true));
	// 		}else if(res.code == 401){
	// 			dispatch(Actions.setLogin(false));
	// 		}else{
	// 			console.log(res.message);
	// 		}
	// 	}).fail(function(error){
	// 		console.log(error);
	// 	}).always(function(){
	// 		dfd.resolve();
	// 	});
	// 	return dfd.promise();
	// }
	componentWillMount(){
		let dfdTasks = [];
		let {state,dispatch} = this.props;
		// 获取滚动图数据
		if(!this.state.focusData.length){
			dfdTasks.push(this.getFocusData());
		}
		
		
		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
		});
	}
	render(){
		let {state,dispatch} = this.props;
		if(state.width < Config.media){
			return (
				<div className="home">
					{this.state.focusData.length ? <Focus data={this.state.focusData} /> : ""}
					<HomeList login={state.login} dispatch={dispatch} />
					<Footer />
					<Nav />
				</div>
			)
		}else{
			<Pc {...state} />
		}
	}
}
Home = connect(state => ({state}))(Home);
export default Home;
