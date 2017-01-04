import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import * as Actions from '../../actions';
import Config from '../../config';
import Layer from '../common/layer/mobile';
import Scroll from '../common/scroll/mobile';
import {Loading} from '../common/loading/mobile';
import {TopFixed,BackFixed} from '../common/fixed/mobile';
import {getSecond} from '../common';
import "zepto";
import "./mobile.scss";
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
	initData(type){
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
		self.props.dispatch(Actions.setLoading(true));
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
				self.props.dispatch(Actions.setLoading(false));
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
		let dfdTasks = [this.initData.call(this,this.state.type)];

		$.when.apply(null,dfdTasks).done(function(){
			// self.setState({
			// 	loading:false
			// })
			self.props.dispatch(Actions.setLoading(false));
		});

	}
	render(){
		let detail = this.state.detail;
		return (
			<div className="myorder">
				<TopFixed data="我的订单" />
				{
					this.state.data.length ? (
						<div className="myorder-list">
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
				<BackFixed>
					<Link to={Config.path.personal}><i className="icon-pre"></i></Link>
					<ul className="personal-nav">
						<li onClick={this.initData.bind(this,0)} className={this.state.type == 0 ? "active" : ""}>全部</li>
						<li onClick={this.initData.bind(this,1)} className={this.state.type == 1 ? "active" : ""}>待付款</li>
						<li onClick={this.initData.bind(this,2)} className={this.state.type == 2 ? "active" : ""}>待发货</li>
						<li onClick={this.initData.bind(this,3)} className={this.state.type == 3 ? "active" : ""}>已发货</li>
						<li onClick={this.initData.bind(this,4)} className={this.state.type == 4 ? "active" : ""}>已完成</li>
						<li onClick={this.initData.bind(this,6)} className={this.state.type == 6 ? "active" : ""}>已取消</li>
					</ul>
				</BackFixed>
				<Scroll page={this.state.page} handleScroll={this.handleScroll.bind(this)} />
				<CSSTransitionGroup
					component="div"
		        	transitionEnterTimeout={400}
		        	transitionLeaveTimeout={400}
		        	transitionName="transition-layer">
						{
							detail ? <Layer>
								<div className="orderdetail" onTouchMove={this.handleTouch}>
									<TopFixed data="订单详情" />
									<div className="pay-header">
										<strong>{detail.order_info && detail.order_info.title}</strong>
										<span># {detail.order_info && detail.order_info.order_sn}</span>
										<span className="pay-right" style={{backgroundColor:this.getColor(detail.order_info.order_status_param)}}>{detail.order_info.order_status_title}</span>
									</div>
									<ul className="pay-list">
										{
											detail.detail && detail.detail.length ? detail.detail.map((value,key) => (
												<li><span>{value.title}</span><span className="pay-right">{value.type == 0 ? '-' : (value.type == 1 ? '+' : '')} ¥ {value.content}</span></li>
											)) : null
										}
									</ul>
									<ul className="pay-list">
										{
											detail.describe && detail.describe.length ? detail.describe.map((value,key) => (
												<li><span>{value.title}</span><span className="pay-right" style={{width:'70%'}}>{value.content}</span></li>
											)) : null
										}
									</ul>
									{
										detail.paytype && detail.paytype.length ? <ul className="pay-list">
											{
												detail.paytype.map((value,key) => (
													<li><span>{value.title}</span><span className="pay-right">¥ {value.content}</span></li>
												))
											}
										</ul> : null
									}
									<BackFixed>
										<a href="javascript:;" onClick={this.handleCloseDetail.bind(this)}><i className="icon-close"></i></a>
										{
											detail.order_info.order_status_param == 1 ? <button onClick={this.handleToStatus.bind(this,detail.order_info.order_status_param,detail.order_info.order_id)} className="orderdetail-submit">去支付</button> : null
										}
									</BackFixed>
								</div>
							</Layer> : null
					}
				</CSSTransitionGroup>
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
