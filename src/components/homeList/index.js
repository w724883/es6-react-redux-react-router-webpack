import React,{Component} from 'react';
import { connect } from 'react-redux';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import Swiper from 'swiper';
import { Link } from 'react-router';
import * as Actions from '../../actions';
import {Waiting} from '../loading';
import Config from '../../config';

import "./index.scss";


class HomeList extends Component{
	constructor(props){
		super(props);
		this.state = {
			homeData:[Waiting,Waiting,Waiting]
		}
	}
	getHotData(){
		let self = this;
		$.get(Config.api.hot_goods,function(res){
			if(res.code == 200){
				// dispatch(Actions.setHot(res.data.item));
				let homeData = self.state.homeData;
				homeData[0] = res.data.item;
				self.setState({homeData:homeData});
			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error);
		});
	}
	getNewData(){
		let self = this;
		$.get(Config.api.new_goods,function(res){
			if(res.code == 200){
				// dispatch(Actions.setNew(res.data.item));
				let homeData = self.state.homeData;
				homeData[1] = res.data.item;
				self.setState({homeData:homeData});
				self.swiper && self.swiper.update();
			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error);
		});
	}
	getLikeData(){
		let self = this;
		$.get(Config.api.my_like,function(res){
			if(res.code == 200){
				let homeData = self.state.homeData;
				homeData[2] = res.data.item;
				self.setState({homeData:homeData});
				self.props.dispatch(Actions.setLogin(true));

				self.swiper && self.swiper.update();
			}else if(res.code == 401){
				self.props.dispatch(Actions.setLogin(false));
				self.props.dispatch(Actions.setPop('login'));
			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error);
		});
	}
	renderHomeData(data){
		if(typeof data == 'string'){
			return <div dangerouslySetInnerHTML={{__html:data}}></div>
		}else{
			return (
				<ul className="mobile-items">
					{
						data.map((value,key) => (
							<li key={key}>
								<div className="mobile-item">
									<div className="mobile-img"><a href="/details" style={{backgroundImage:"url("+value.goods_cover+")"}}></a></div>
									<div className="mobile-about">
										<p>{value.goods_name}</p>
										<span className="price">{value.price}</span>
										<a href="javascript:;" className="vertical-middle"><i className="icon-like"></i></a>
									</div>
								</div>
							</li>
						))
					}
				</ul>
			)
		}
		
	}
	componentWillMount(){
	    // 获取热门推荐最新上架我的收藏
	    if(typeof this.state.homeData[0] == 'string'){
	    	this.getHotData.call(this);
	    }
	    // if(!this.state.newData.length){
	    // 	dfdTasks.push(this.getNewData());
	    // }
	    // if(state.login || !this.state.likeData.length){
	    // 	dfdTasks.push(this.getLikeData(dispatch));
	    // } 
	}
	componentDidUpdate(){
		if(typeof this.state.homeData[0] != 'string' && !this.swiper){
			let self = this;
			this.swiper = new Swiper('#homeSwiper', {
			    pagination: '#homeSwiper .swiper-pagination',
			    slidesPerView: 1,
			    paginationClickable: true,
			    speed:500,
			    autoHeight:true,
			    paginationType:'custom',
			    paginationCustomRender: function (swiper, current, total) {

			    	let str = '';
			    	for(let i = 0; i < total; i++){
			    		switch(i){
			    			case 0:
			    				str += '<li><a href="javascript:;" data-index='+i+' class='+(current == i+1 ? "active" : "")+'>商品详情</a></li>';break;
			    			case 1:
			    				str += '<li><a href="javascript:;" data-index='+i+' class='+(current == i+1 ? "active" : "")+'>最新上架</a></li>';break;
			    			case 2:
			    				str += '<li><a href="javascript:;" data-index='+i+' class='+(current == i+1 ? "active" : "")+'>我的收藏</a></li>';break;
			    		}
			    	}
			    	if(current == 2 && (typeof self.state.homeData[1] == 'string')){
			    		self.getNewData.call(self);
			    	}else if(current == 3 && (typeof self.state.homeData[2] == 'string')){
			    		self.getLikeData.call(self);
			    	}
			        
			        return str;
			    }
			});
			this.swiper.container.on('click','.swiper-pagination a',function(){
				self.swiper.slideTo($(this).data('index'));
			})
		}
	}
	render(){
		let self = this;
		// <CSSTransitionGroup
		// component="ul"
		// className="mobile-items hot"
  		// transitionEnterTimeout={500}
  		// transitionLeaveTimeout={500}
  		// transitionLeave={false}
  		// transitionName="transition-homelist">
		return (
			<div className="home-content">
				
				<div id="homeSwiper" className="swiper-container">
					<div className="home-bar">
						<ul className="swiper-pagination"></ul>
						<div className="home-search"><Link to="/search"><i className="icon-search"></i>搜索</Link></div>
					</div>
					
				    <div className="swiper-wrapper">
				    	{
				    		this.state.homeData.map((value,key) => (
				    			<div key={key} className="swiper-slide">
				    				{self.renderHomeData(value)}
				    			</div> 
				    		))
				    	}
				    	
				    </div>
				</div>
				
			</div>
		)
	}
}
export default HomeList;
