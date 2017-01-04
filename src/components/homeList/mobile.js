import React,{Component} from 'react';
// import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Swiper from 'swiper';
import { Link,browserHistory } from 'react-router';
// import LazyLoad from 'react-lazyload';
import * as Actions from '../../actions';
import {Waiting} from '../common/loading/mobile';
import Config from '../../config';
import Layer from '../common/layer/mobile';
import Search from '../search/mobile';
import "./mobile.scss";


class HomeList extends Component{
	constructor(props){
		super(props);
		this.state = {
			homeData:[Waiting,Waiting,Waiting],
			search:false
		}
	}
	getHotData(){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.hot_goods,
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		// dispatch(Actions.setHot(res.data.item));
		  		let homeData = self.state.homeData;
		  		homeData[0] = res.data;
		  		self.setState({homeData:homeData});
		  	}else{
		  		self.props.dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}
		  },
		  error: function(xhr, type){
		    self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  },
		  complete:function(){
		  	self.props.dfd.resolve();
		  }
		});
	}
	getNewData(){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.new_goods,
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		// dispatch(Actions.setNew(res.data.item));
		  		let homeData = self.state.homeData;
		  		homeData[1] = res.data;
		  		self.setState({homeData:homeData});
		  		self.swiper && self.swiper.update();
		  	}else{
		  		self.props.dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}
		  },
		  error: function(xhr, type){
		    self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
	}
	getLikeData(){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.my_like,
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		let homeData = self.state.homeData;
		  		homeData[2] = res.data;
		  		self.setState({homeData:homeData});
		  		// self.props.dispatch(Actions.setLogin(true));

		  		self.swiper && self.swiper.update();
		  	// }else if(res.code == 401){
		  	// 	// self.props.dispatch(Actions.setLogin(false));
		  	// 	self.props.dispatch(Actions.setPop({
		  	// 		show:'login',
		  	// 		data:{
		  	// 		    success(){
		  	// 		        window.location.reload();
		  	// 		    }
		  	// 		}
		  	// 	}));
		  	}else{
		  		self.props.dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}
		  },
		  error: function(xhr, type){
		    self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
	}
	renderHomeData(data,index){
		if(typeof data == 'string'){
			return <div dangerouslySetInnerHTML={{__html:data}}></div>
		}else{
			return (
				<ul className="mobile-items">
					{
						data.length ? data.map((value,key) => (
							<li key={key}>
								<div className="mobile-item">

									<div className="mobile-img">
										<Link to={"/details?id="+value.goods_id} style={{backgroundImage:"url("+value.goods_cover+")"}}></Link>
										{value.activty_message ? <span className="mobile-tag">{value.activty_message}</span> : null}
									</div>

									<div className="mobile-about">
										<p>{value.goods_name}</p>
										<span className="price">{value.price}</span>
										<a href="javascript:;" className="vertical-middle" onClick={this.handleLike.bind(this,value.goods_id,index,key)}>
											{
												value.is_like ? <i className="icon-liked" style={{color:'#C34765'}}></i> : <i className="icon-like"></i>
											}
										</a>
									</div>
								</div>
							</li>
						)) : <li style={{textAlign:'center',padding:'40px 0 0',fontSize:'14px',float:'none',width:'100%'}}>还没有商品哦</li>
					}
				</ul>
			)
		}

	}
	handleSearch(){
		this.setState({
			search:true
		})
	}
	handleClose(){
		this.setState({
			search:false
		})
	}
	handleLike(goods_id,index,key){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.clicklike,
		  data: {goods_id:goods_id},
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				let homeData = self.state.homeData;
				homeData[index][key].is_like = !homeData[index][key].is_like;
				self.setState({
					homeData
				});
				if(homeData[index][key].is_like){
					self.props.dispatch(Actions.setMessage({
						text:'已收藏'
					}));
				}else{
					self.props.dispatch(Actions.setMessage({
						text:'已取消收藏'
					}));
				}

			}else if(res.code == 401){
				// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
				// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
				// 	return false;
				// }
				self.props.dispatch(Actions.setPop({
					show:'login',
					data:{
						success(){
							window.location.reload();
						}
					}
				}));
			}else{
				self.props.dispatch(Actions.setMessage({
					text:res.message
				}));
			}
		  },
		  error: function(xhr, type){
		    self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
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
	// componentDidMount() {
	// 	let self = this;
	// 	$('#homeSwiper').on('click','a[data-like]',function(e){
	// 		let goods_id = $(this).data('like');

	// 	});

	// }
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
			    				str += '<li><a href="javascript:;" data-index='+i+' class='+(current == i+1 ? "active" : "")+'>热门商品</a></li>';break;
			    			case 1:
			    				str += '<li><a href="javascript:;" data-index='+i+' class='+(current == i+1 ? "active" : "")+'>最新上架</a></li>';break;
			    			case 2:
			    				str += '<li><a href="javascript:;" data-index='+i+' class='+(current == i+1 ? "active" : "")+'>我的收藏</a></li>';break;
			    		}
			    	}

			    	if(current == 2 && (typeof self.state.homeData[1] == 'string')){
			    		self.getNewData.call(self);
			    	}
			    	if(current == 3 && (typeof self.state.homeData[2] == 'string')){
			    		if(self.props.state.login){
			    			self.getLikeData.call(self);
			    		}else{
			    			// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
			    			// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
			    			// 	return false;
			    			// }
			    			self.props.dispatch(Actions.setPop({
			    				show:'login',
			    				data:{
			    				    success(){
			    				        window.location.reload();
			    				    },
			    				    cancle(){
			    				    	self.swiper.slideTo(0);
			    				    }
			    				}
			    			}));
			    			// return false;
			    		}
			    	}
			        return str;
			    }
			});
			this.swiper.container.on('click','.swiper-pagination a',function(){
				let index = $(this).data('index');
				if(index+1 == 2 && (typeof self.state.homeData[1] == 'string')){
					self.getNewData.call(self);
				}else if(index+1 == 3 && (typeof self.state.homeData[2] == 'string')){
					if(self.props.state.login){
						self.getLikeData.call(self);
					}else{
						// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
						// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
						// 	return false;
						// }
						self.props.dispatch(Actions.setPop({
							show:'login',
							data:{
							    success(){
							        window.location.reload();
							    },
		    				    cancle(){
		    				    	self.swiper.slideTo(0);
		    				    }
							}
						}));
						// return false;
					}

				}
				self.swiper.slideTo(index);
			});
		}
	}
	render(){
		let self = this;
		return (
			<div className="home-content">

				<div id="homeSwiper" className="swiper-container">
					<div className="home-bar">
						<ul className="swiper-pagination"></ul>
						<div className="home-search" onClick={this.handleSearch.bind(this)}><a href="javascript:;"><i className="icon-search"></i>搜索</a></div>
					</div>

				    <div className="swiper-wrapper">
				    	{
				    		this.state.homeData.map((value,key) => (
				    			<div key={key} className="swiper-slide">
				    				{self.renderHomeData(value,key)}
				    			</div>
				    		))
				    	}

				    </div>
				</div>
				<CSSTransitionGroup
					component="div"
					transitionEnter={false}
	              	transitionLeaveTimeout={350}
	              	transitionName="transition-layer">
						{this.state.search ? <Layer><Search handleClose={this.handleClose.bind(this)} /></Layer> : null}
				</CSSTransitionGroup>
			</div>
		)
	}
}
export default HomeList;
