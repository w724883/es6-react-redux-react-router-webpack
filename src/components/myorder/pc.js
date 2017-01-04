import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Swiper from 'swiper';
import * as Actions from '../../actions';
import Config from '../../config';
import Layer from '../common/layer/pc';
import Scroll from '../common/scroll/pc';
import {Loading} from '../common/loading/pc';
import {PopFixed} from '../common/fixed/pc';
import {getSecond} from '../common';
import "zepto";
import "./pc.scss";
// import gif from "../../static/imgs/loading.gif";
class MyOrder extends React.Component {
	constructor(props){
		super();
		props.dispatch(Actions.setLoading(true));
		this.state = {
			data:[],
			detail:null,
			type:0,
			page:1
			// comment:false
		}
	}
	// handleHideComment(){
	// 	this.setState({
	// 		comment:false
	// 	});
	// }
	// handleShowComment(){
	// 	this.setState({
	// 		comment:true
	// 	});
	// }
	handleTouch(e){
		e.stopPropagation();
		e.preventDefault();
		return false;
	}
	initData(e){

		let type = e ? e.target.value : this.state.type;
		$(window).scrollTop(0);
		let self = this;
		let dfd = $.Deferred();
		$.ajax({
		  type: 'POST',
		  url: Config.api.myorder,
		  data:{param:type,page:1},
		  dataType: Config.dataType,
		  success: function(res){
		    if(res.code == 200){
		        self.setState({
		        	data:res.data.order_list,
		        	type:type,
		        	page:2
		        });
		        
		        
		    }else if(res.code == 401){
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
		  complete:function(){
		    dfd.resolve();
		  },
		  error: function(xhr, type){
		    self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
		return dfd.promise();
	}
	handleScroll(){
		this.getData();
	}
	getData(){
		let self = this;

		$.ajax({
		  type: 'POST',
		  url: Config.api.myorder,
		  data:{param:this.state.type,page:this.state.page},
		  dataType: Config.dataType,
		  success: function(res){
		    if(res.code == 200){
		    	let data = self.state.data;
		        self.setState({
		        	data:data.concat(res.data.order_list),
		        	type:self.state.type,
		        	page:self.state.page+1
		        });

		        
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
		    }else if(res.code == 403){
		  		self.setState({
		  			page:0
		  		});
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
	getDetail(id){
		let self = this;
		// self.props.dispatch(Actions.setLoading(true));
		$.ajax({
		  type: 'POST',
		  url: Config.api.lineitem,
		  data:{id:id},
		  dataType: Config.dataType,
		  success: function(res){
		    if(res.code == 200){

	        self.setState({
	        	detail:res.data
	        });

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
		                },
						cancle(){
							browserHistory.push('/');
						}
		            }
		        }));
		    }else{
		        self.props.dispatch(Actions.setMessage({
		            text:res.message
		        }));
		    }
		  },
		  complete:function(){
				// self.props.dispatch(Actions.setLoading(false));
		  },
		  error: function(xhr, type){
		    self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});

	}
	handleCloseDetail(){
		this.setState({
			detail:null
		});
	}
	handleToStatus(value,id,e){
		if(value == 1){
			browserHistory.push('/pay?id='+id);
			return false;
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	}
	handleToComment(value,params,e){
		if(value > 0){
			return false;
		}
		browserHistory.push('/comment?params='+JSON.stringify(params));
		e.stopPropagation();
		e.preventDefault();
		return false;
	}
	handleCancel(key,id,e){
		
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.cellent_order,
		  data:{id:id},
		  dataType: Config.dataType,
		  success: function(res){
		    if(res.code == 200){

	        	let data = self.state.data;
	        	data[key].status_param = 6;
	        	data[key].status_title = '已取消';
	        	self.setState({
	        		data
	        	});

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
		    }
	        self.props.dispatch(Actions.setMessage({
	            text:res.message
	        }));
		    
		  },
		  error: function(xhr, type){
		    self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
		e.stopPropagation();
		e.preventDefault();
		return false;
	}
	getColor(value){
		let color = '#CACACA';
		let link = '';
		switch(value){
			case 1:color = '#809FB5';break;
			case 2:color = '#C34765';break;
			case 3:color = '#C34765';break;
			case 4:color = '#CACACA';break;
			case 6:color = '#9B9B9B';break;
		}
		return color;
	}
	componentWillMount(){
		let self = this;
		let dfdTasks = [this.initData.call(this)];

		$.when.apply(null,dfdTasks).done(function(){
			self.props.dispatch(Actions.setLoading(false));
		});

	}
	componentDidUpdate() {
		let self = this;
		if(this.state.data.length){
			if(!this.swiper){
				self.swiper = new Swiper('.swiper-container', {
				    scrollbar: '.swiper-scrollbar',
				    direction: 'vertical',
				    slidesPerView: 'auto',
				    mousewheelControl: true,
				    freeMode: true
				});
				
			}else{
				this.swiper.updateContainerSize();
			}
		}
		
	}
	render(){
		let detail = this.state.detail;
		return (
			<div className="pop" onTouchMove={this.props.handleTouchMove}>
			    <div className="pop-bg" onClick={this.props.handleClose} onWheel={this.props.handleWheel}></div>
			    <div className="pop-box myorder">
					<div className="swiper-container">
						<div className="swiper-wrapper">

						{
							this.state.data.length ? (
								<div className="swiper-slide myorder-list">
									{
										this.state.data.map((value,key) => {
											return <ul>
												<li className="myorder-list-header" onClick={this.getDetail.bind(this,value.id)}>
													<strong>订单号 # {value.order_sn}</strong>
													<span>{value.addtime}</span>
													{
														value.status_param == 1 && (new Date().getTime() - new Date(Date.parse(value.addtime.replace(/-/g,'/'))).getTime() <= 1800000) ? <span>剩余支付时间：{getSecond(1800000 - (new Date().getTime() - new Date(Date.parse(value.addtime.replace(/-/g,'/'))).getTime()))}</span> : null
													}
													<div className="vertical-middle">
														
														{
															value.status_param == 1  ? <a href="javascript:;" style={{backgroundColor:this.getColor(6)}} onClick={this.handleCancel.bind(this,key,value.id)}>取消订单</a> : null
														}												
														<a href="javascript:;" style={{backgroundColor:this.getColor(value.status_param)}} onClick={this.handleToStatus.bind(this,value.status_param,value.id)}>{value.status_title}</a>
													</div>
												</li>
												{
													value.goods_info && value.goods_info.length ? value.goods_info.map((v,k) => (
														<li className="myorder-list-item">
															<div className="myorder-list-head" style={{backgroundImage:'url('+v.goods_cover+')'}}></div>
															<div className="myorder-list-text">
																<strong>{v.goods_name}</strong>
																<span>{v.attr_name}</span>
															</div>
															<div className="vertical-middle">
															{
																(value.pay_status == 1 && value.shipping_status == 1 && value.order_status >= 2) ? (
																	<a href="javascript:;" onClick={this.handleToComment.bind(this,v.is_comment,{order_id:value.id,order_goods_id:v.id})} style={{backgroundColor:'transparent',border:'1px solid #809FB5',color:'#809FB5'}}>{v.is_comment > 0 ? '已评价' : '点评晒单'}</a>
																) : (
																	<p>
																		<strong>¥ {v.goods_price}</strong>
																		<span>x {v.goods_num}</span>
																	</p>
																)
															}
															</div>
														</li>
													)) : null
												}
												{
													value.addition_info && value.addition_info.length ? value.addition_info.map((v,k) => (
														<li className="myorder-list-item">
															<div className="myorder-list-head" style={{backgroundImage:'url('+v.addition_goods_cover+')'}}></div>
															<div className="myorder-list-text">
																<strong>{v.addition_goods_name}</strong>
																<span></span>
															</div>
															<div className="vertical-middle">
																<p>
																	<strong>¥ {v.addition_goods_price}</strong>
																	<span>x {v.addition_goods_num}</span>
																</p>
															</div>
														</li>
													)) : null
												}
											</ul>
										})
									}
								</div>
							) : null
						}

						</div>
						<div className="swiper-scrollbar"></div>
					</div>
					<PopFixed title="我的订单" handleSelect={this.initData.bind(this)} data={[{key:0,value:'全部'},{key:1,value:'待付款'},{key:2,value:'待发货'},{key:3,value:'已发货'},{key:4,value:'已完成'},{key:6,value:'已取消'}]} />
			        <a href="javascript:;" onClick={this.props.handleClose} className="icon-close pop-close"></a>
			    </div>
			</div>
		)
	}
}
MyOrder = connect((state) => ({state}))(MyOrder);
export default MyOrder;
// {
// 	this.state.comment ? (
// 		<Layer>
// 			<div className="myorder-layer" onClick={this.handleHideComment.bind(this)}></div>

// 			<Comment />

// 		</Layer>
// 	) : null
// }
