import React,{Component} from 'react';
import { connect } from 'react-redux';
import Config from '../../config';
import * as Actions from '../../actions';
import Mobile from './mobile';
import Pc from './pc';
import 'zepto';

class Home extends Component{
	constructor(){
		super();
		this.getFocusData = this.getFocusData.bind(this);
		this.getHotData = this.getHotData.bind(this);
		this.getNewData = this.getNewData.bind(this);
		this.getLikeData = this.getLikeData.bind(this);
		this.state = {
			focusData:[],
			hotData:[],
			newData:[],
			likeData:[]
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
	getHotData(dispatch){
		let dfd = $.Deferred();
		let seft = this;
		$.get(Config.api.hot_goods,function(res){
			if(res.code == 200){
				// dispatch(Actions.setHot(res.data.item));
				seft.setState({hotData:res.data.item});
			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error);
		}).always(function(){
			dfd.resolve();
		});
		return dfd.promise();
	}
	getNewData(dispatch){
		let dfd = $.Deferred();
		let seft = this;
		$.get(Config.api.new_goods,function(res){
			if(res.code == 200){
				// dispatch(Actions.setNew(res.data.item));
				seft.setState({newData:res.data.item});
			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error);
		}).always(function(){
			dfd.resolve();

		});
		return dfd.promise();
	}
	getLikeData(dispatch){
		let dfd = $.Deferred();
		let seft = this;
		$.get(Config.api.my_like,function(res){
			if(res.code == 200){
				dispatch(Actions.setLogin(true));
				seft.setState({likeData:res.data});
			}else if(res.code == 401){
				dispatch(Actions.setLogin(false));
			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error);
		}).always(function(){
			dfd.resolve();
		});
		return dfd.promise();
	}
	componentWillMount(){
		let dfdTasks = [];
		let {state,dispatch} = this.props;
		// 获取滚动图数据
		if(!this.state.focusData.length){
			dfdTasks.push(this.getFocusData());
		}
		// 获取热门推荐最新上架我的收藏
		if(!this.state.hotData.length){
			dfdTasks.push(this.getHotData());
		}
		if(!this.state.newData.length){
			dfdTasks.push(this.getNewData());
		}
		if(state.login || !this.state.likeData.length){
			dfdTasks.push(this.getLikeData(dispatch));
		}
		
		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
		});
	}
	render(){
		let {state,dispatch} = this.props;
		return state.width < Config.media ? <Mobile {...this.state} login={state.login} dispatch={dispatch} /> : <Pc {...state} />
	}
}
Home = connect(state => ({state}))(Home);
export default Home;
