import React,{Component} from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Config from '../../config';
import * as Actions from '../../actions';
import Layer from '../layer';
import {Loading} from '../loading';
import Nav from '../nav/mobile';
import Focus from '../focus/mobile';
import HomeList from '../homeList/mobile';
import Footer from '../footer/mobile';

import 'zepto';
import './mobile.scss';
class Home extends Component{
	constructor(){
		super();
		this.getFocusData = this.getFocusData.bind(this);
		// this.getHotData = this.getHotData.bind(this);
		// this.getNewData = this.getNewData.bind(this);
		// this.getLikeData = this.getLikeData.bind(this);
		this.state = {
			focusData:[],
			loading:true
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
	// handleInit(isInit){
	// 	this.dfd = $.Deferred();
	// 	return this.dfd.promise();
	// }
	componentWillMount(){
		let self = this;
		let dfdTasks = [];
		let {state} = this.props;
		// 获取滚动图数据
		if(!this.state.focusData.length){
			dfdTasks.push(this.getFocusData());
		}
		
		
		$.when.apply(null,dfdTasks).done(function(){
			self.setState({
				loading:false
			})
		});
	}
	render(){
		let {state,dispatch} = this.props;
			
		return (
			<CSSTransitionGroup
				component="div"
				className="home"
				// transitionAppear={true}
				transitionEnter={false}
              	// transitionEnterTimeout={4000}
              	transitionLeaveTimeout={400}
              	// transitionAppearTimeout={4000}
              	transitionName="transition-layer">
              		{this.state.focusData.length ? <Focus data={this.state.focusData} /> : null}
              		<HomeList login={state.login} dispatch={dispatch} />
              		<Footer />
              		<Nav />
					{this.state.loading ? <Layer><Loading /></Layer> : null}
			</CSSTransitionGroup>
		)
	}
}
Home = connect((state) => ({state}))(Home);
export default Home;
