import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import Swiper from 'swiper';
import * as Actions from '../../actions';
import Config from '../../config';
import Layer from '../common/layer/pc';
import Scroll from '../common/scroll/pc';
import {Loading} from '../common/loading/pc';
import {PopFixed} from '../common/fixed/pc';
import {getSecond} from '../common';
// import Pay from '../pay/pc';
import Comment from '../comment/pc';
import "zepto";
import "./pc.scss";
// import gif from "../../static/imgs/loading.gif";
class OrderDetail extends React.Component{
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		data:null
	// 	}
	// }
	// getColor(value){
	// 	let color = '#CACACA';
	// 	let link = '';
	// 	switch(value){
	// 		case 1:color = '#809FB5';break;
	// 		case 2:color = '#C34765';break;
	// 		case 3:color = '#C34765';break;
	// 		case 4:color = '#CACACA';break;
	// 		case 6:color = '#9B9B9B';break;
	// 	}
	// 	return color;
	// }
	// handleToStatus(value,id,e){
	// 	if(value == 1){
	// 		browserHistory.push('/pay?id='+id);
	// 		this.props.dispatch(Actions.setPop({
	// 			show:false
	// 		}));
	// 		return false;
	// 	}
	// 	e.stopPropagation();
	// 	e.preventDefault();
	// 	return false;
	// }
	// componentWillMount() {
	// 	let self = this;
	// 	self.props.dispatch(Actions.setLoading(true));
	// 	$.ajax({
	// 	  type: 'POST',
	// 	  url: Config.api.lineitem,
	// 	  data:{id:this.props.id},
	// 	  dataType: Config.dataType,
	// 	  success: function(res){
	// 	    if(res.code == 200){
	// 	    	if(res.data){
	// 	    		self.setState({
	// 	    			data:res.data
	// 	    		});
	// 	    	}
	// 	    }else if(res.code == 401){
	// 	    	// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
	// 	    	// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
	// 	    	// 	return false;
	// 	    	// }
	// 	        self.props.dispatch(Actions.setPop({
	// 	            show:'login',
	// 	            data:{
	// 	                success(){
	// 	                    window.location.reload();
	// 	                },
	// 					cancle(){
	// 						browserHistory.push('/');
	// 					}
	// 	            }
	// 	        }));
	// 	    }else{
	// 	        self.props.dispatch(Actions.setMessage({
	// 	            text:res.message
	// 	        }));
	// 	    }
	// 	  },
	// 	  complete:function(){
	// 			self.props.dispatch(Actions.setLoading(false));
	// 	  },
	// 	  error: function(xhr, type){
	// 	    self.props.dispatch(Actions.setMessage({
	// 	    	text:Config.text.network
	// 	    }));
	// 	  }
	// 	});

	// }


	constructor(props){
		super();
		
		this.payType = 1;
		this.state = {
			payType:this.payType
		}
	}
	scorePay(id){
		let {dispatch} = this.props;
		$.ajax({
		  type: 'POST',
		  url: Config.api.score_pay,
		  data:{
		  	id:id,
			pay_way:4,
			pay_role:'web'
		  },
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
				browserHistory.push('/myorder');
			}else if(res.code == 401){
				// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
				// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
				// 	return false;
				// }
		  		dispatch(Actions.setPop({
		  			show:'login',
		  			data:{
		  				success(){
		  					window.location.reload();
		  				}
		  			}
		  		}));
		  		dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}else{
				dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
			}
		  },
		  error: function(xhr, type){
		    dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
	}
	balancePay(id){
		let {dispatch} = this.props;
		$.ajax({
		  type: 'POST',
		  url: Config.api.balance,
		  data:{
		  	id:id,
			pay_way:3,
			pay_role:'web'
		  },
		  dataType: Config.dataType,
		  success: function(res){
				if(res.code == 200){
					dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
					browserHistory.push('/myorder');
				}else if(res.code == 401){
					// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
					// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
					// 	return false;
					// }
			  		dispatch(Actions.setPop({
			  			show:'login',
			  			data:{
			  				success(){
			  					window.location.reload();
			  				}
			  			}
			  		}));
			  		dispatch(Actions.setMessage({
			  			text:res.message
			  		}));
			  	}else{
					dispatch(Actions.setMessage({
			  			text:res.message
			  		}));
				}
		  },
		  error: function(xhr, type){
		    dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
	}
	handlePay(){
		let {dispatch} = this.props;
		let id = this.props.id;
		let order_amount = this.state.detail[0].order_amount;
		if(this.state.order_info.pay_id == 4){
			// 积分支付
			this.scorePay.call(this,id);
			return false;
		}
		if(this.state.order_info.pay_id == 3){
			// 余额支付
			this.balancePay.call(this,id);
			return false;
		}
		if(this.state.order_info.pay_id == 0){
			if(this.state.payType > 0){
				let params = {
				  	id:id,
					pay_way:(order_amount == this.total) ? this.state.payType : (this.state.payType+',3'),
					pay_role:'web'
			  	}
				window.location.href = Config.api.pay+'?'+$.param(params);
				return false;
				
			}else{
				// 余额支付
				this.balancePay.call(this,id);
			}
			return false;
		}
		// pay_id:1 2 1,3 2,3的情况 
		let params = {
		  	id:id,
			pay_way:this.state.order_info.pay_id,
			pay_role:'web'
	  	}
		window.location.href = Config.api.pay+'?'+$.param(params);
		return false;
	}
	handleCancle(){
		browserHistory.push('/myorder');
	}
	handleBalance(e){
		let checked = $(e.target).prop('checked');
		let order = this.props.state.order;
		let state = this.state;
		// let balance = this.state.balance;

		if(checked){
			order.cost.balance = state.balance.message;

			if(this.amount*1 < this.total*1){
				state.balance.message = 0;
				state.detail[0].order_amount = this.total - this.amount;
				state.payType = this.payType;
				this.discount = this.amount;
			}else{
				state.balance.message = (this.amount - this.total);
				state.detail[0].order_amount = 0;
				state.payType = 0;
				this.discount = this.total;
			}
		}else{
			order.cost.balance = 0;
			state.balance.message = this.amount;
			state.detail[0].order_amount = this.total;
			state.payType = this.payType;
			this.discount = 0;
		}


		this.setState(state);
		this.props.dispatch(Actions.setOrder(order));
	}
	getData(){
		let self = this;
		let {dispatch} = this.props;
		let dfd = new $.Deferred();

		$.ajax({
		  type: 'POST',
		  url: Config.api.settleaccounts,
		  data:{
		  	id:this.props.id
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		let state = self.state;
		  		$.extend(state,res.data);
				self.amount = res.data.balance.message;
				self.total = res.data.detail[0].order_amount;
		  		self.setState(state);
		  	}else if(res.code == 401){
		  		// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
		  		// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
		  		// 	return false;
		  		// }
		  		dispatch(Actions.setPop({
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
		  		dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}else if(res.code == 400){
		  		browserHistory.push('/cart');
		  		dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}else{
		  		dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}
		  },
		  error: function(xhr, type){
		     dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  },
		  complete:function(){
		  	dfd.resolve();
		  }
		});
		return dfd.promise();
	}
	handlePayType(type){
		let payType = this.state.payType;
		if(payType){
			this.setState({
				payType:type
			});
		}

	}
	getTotal(){
	    let price = 0;
	    let state = this.props.state;
	    let {list,add} = state.cart;
	    for(let i of list.concat(add)){
	        if(i.checked){
	            price += (i.price*i.num)
	        }
	    }
	    // 如果是order、pay则计算待支付
	    if(state.order.cost && (state.total != undefined || this.handleIntegral != undefined)){
	        let freight = state.order.cost.freight*1 || 0;
	        let discount = state.order.cost.discount*1 || 0;
	        let integral = state.order.cost.integral*1 || 0;
	        let sale = state.order.cost.sale*1 || 0;
	        // let balance = state.order.cost.balance*1 || 0;
	        freight = (freight > sale) ? (freight-sale) : 0;
	        price += freight;
	        price -= (discount < price ? discount : price);
	        this.handleIntegral && this.handleIntegral(price);
	        if(price){
	            price -= (integral/100 < price ? integral/100 : price);
	        }
	        
	    }

	    return parseFloat(price).toFixed(2);
	}
	// routerWillLeave(){

	// 	this.props.dispatch(Actions.setCart({
	// 		list:[],
	// 		add:[]
	// 	}));
	// }
	componentWillMount(){
		this.getData();
	}

	render(){
		let state = this.state;
		let order_info = state.order_info;
		return order_info ? (
			<Layer>
			    <div className="orderdetail">
			    	<div className="pay-header">
			    		<strong>{order_info && order_info.title}</strong>
			    		<span># {order_info && order_info.order_sn}</span>
			    	</div>
			    	
			    		
			    	<ul className="pay-list">
			    		{
			    			state.detail && state.detail.length ? state.detail.map((value,key) => (
			    				<li key={key}><span>{value.title}</span><span className="pay-right">{value.type == 0 ? '-' : (value.type == 1 ? '+' : '')} ¥ {value.content}</span></li>
			    			)) : null
			    		}
			    		{
			    			this.discount ? <li><span>使用账户余额抵扣</span><span className="pay-right">- ¥ {this.discount}</span></li> : null
			    		}
			    	</ul>
			    	<ul className="pay-list">
			    		{
			    			state.describe && state.describe.length ? state.describe.map((value,key) => (
			    				<li key={key}><span>{value.title}</span><span className="pay-right" style={{width:'70%'}}>{value.content}</span></li>
			    			)) : null
			    		}
			    	</ul>
			    	{
			    		state.paytype && state.paytype.length ? <ul className="pay-list">
			    			{
			    				state.paytype.map((value,key) => (
			    					<li key={key}><span>{value.title}</span><span className="pay-right">¥ {value.content}</span></li>
			    				))
			    			}
			    		</ul> : null
			    	}
			    	
			    	{

			    		state.detail ? ((state.order_info.pay_id == 0 || state.order_info.pay_id == 4) ? (
			    			<ul className="pay-list">
			    				{
			    					state.balance ? (
			    						<li className="pay-account" onChange={this.handleBalance.bind(this)}>
			    							<label>
			    								<div className="checkbox">
			    									{this.amount > 0 ? <input type="checkbox" name="balance" /> : null}

			    									<span className="icon-check checked"></span>
			    								</div>	
			    								<span> {state.balance.title}</span>
			    								<span className="pay-right">¥ {state.balance ? parseFloat(state.balance.message).toFixed(2) : ''}</span>
			    							</label>
			    						</li>
			    					) : null
			    				}
			    			</ul>
			    		) : null) : null
			    	}
			    	{
			    		state.detail ? ((state.order_info.pay_id == 0 || state.order_info.pay_id == 4) ? (
			    			<ul className="pay-type">
			    				<li onClick={this.handlePayType.bind(this,1)} data-type="1" className={this.state.payType == 1 ? "active" : ""}>
			    					<i className="icon-wechat"></i>
			    					<span>微信支付</span>
			    				</li>
			    				<li onClick={this.handlePayType.bind(this,2)} data-type="2" className={this.state.payType == 2 ? "active" : ""}>
			    					<i className="icon-alipay"></i>
			    					<span>支付宝付款</span>
			    				</li>								
			    			</ul>
			    		) : null) : null
			    	}
		    	  	<div className="orderdetail-btns">
		    	  		<a href="javascript:;" onClick={this.props.handleClose}>返回</a>
		    	  		<a href="javascript:;" onClick={this.handlePay.bind(this)}>去支付</a>
		    	  	</div>
			    </div>
		    </Layer>
		) : null
	}
}
  //   <div className="orderdetail">
  //   	<div className="pay-header">
  //   		<strong>{detail.order_info && detail.order_info.title}</strong>
  //   		<span># {detail.order_info && detail.order_info.order_sn}</span>
  //   		<span className="pay-right" style={{backgroundColor:this.getColor(detail.order_info.order_status_param)}}>{detail.order_info.order_status_title}</span>
  //   	</div>
  //   	<ul className="pay-list">
  //   		{
  //   			detail.detail && detail.detail.length ? detail.detail.map((value,key) => (
  //   				<li key={key}><span>{value.title}</span><span className="pay-right">{value.type == 0 ? '-' : (value.type == 1 ? '+' : '')} ¥ {value.content}</span></li>
  //   			)) : null
  //   		}
  //   	</ul>
  //   	<ul className="pay-list">
		// 	{
		// 		detail.describe && detail.describe.length ? detail.describe.map((value,key) => (
		// 			<li key={key}><span>{value.title}</span><span className="pay-right" style={{width:'70%'}}>{value.content}</span></li>
		// 		)) : null
		// 	}
		// </ul>
  //   	{
  //   		detail.paytype && detail.paytype.length ? <ul className="pay-list">
  //   			{
  //   				detail.paytype.map((value,key) => (
  //   					<li key={key}><span>{value.title}</span><span className="pay-right">¥ {value.content}</span></li>
  //   				))
  //   			}
  //   		</ul> : null
  //   	}
  //   	<div className="orderdetail-btns">
  //   		<a href="javascript:;" onClick={this.props.handleClose}>返回</a>
  //   		{
  //   			detail.order_info.order_status_param == 1 ? <a href="javascript:;" onClick={this.handleToStatus.bind(this,detail.order_info.order_status_param,detail.order_info.order_id)}>去支付</a> : null
  //   		}
    		
  //   	</div>
  //   </div>
class MyOrder extends React.Component {
	constructor(props){
		super();
		this.state = {
			data:[],
			detail:null,
			comment:null,
			type:0,
			page:1
			// comment:false
		}
	}

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
	showDetail(id){
		this.setState({
			detail:id
		});
	}
	hideDetail(){
		this.setState({
			detail:null
		});
	}
	hideComment(){
		this.setState({
			comment:null
		});
	}
	handleToStatus(value,id,e){
		if(value != 1){
			e.stopPropagation();
			e.preventDefault();
			return false;
		}
		
	}
	handleToComment(value,params,e){
		if(value > 0){
			return false;
		}
		this.setState({
			comment:params
		});
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
	handleClose(){
		this.props.handleClose();
		if(this.swiper){
			this.swiper.destroy();
		}
	}
	componentWillMount(){
		let self = this;
		let dfdTasks = [this.initData.call(this)];
		self.props.dispatch(Actions.setLoading(true));
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
				this.swiper.update(true);
			}
		}
		
	}
	render(){
		return (
			<div className="pop" onTouchMove={this.props.handleTouchMove}>
			    <div className="pop-bg" onClick={this.handleClose.bind(this)} onWheel={this.props.handleWheel}></div>
			    <div className="pop-box myorder">
					<div className="swiper-container">
						<div className="swiper-wrapper">

						{
							this.state.data.length ? (
								<div className="swiper-slide myorder-list">
									{
										this.state.data.map((value,key) => {
											return <ul key={key}>
												<li className="myorder-list-header" onClick={this.showDetail.bind(this,value.id)}>
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
														<li key={k} className="myorder-list-item">
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
														<li key={k} className="myorder-list-item">
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
									<Scroll page={this.state.page} handleScroll={this.handleScroll.bind(this)} />
								</div>
							) : null
						}
						</div>
						<div className="swiper-scrollbar"></div>
					</div>
					<PopFixed title="我的订单" handleSelect={this.initData.bind(this)} data={[{key:0,value:'全部'},{key:1,value:'待付款'},{key:2,value:'待发货'},{key:3,value:'已发货'},{key:4,value:'已完成'},{key:6,value:'已取消'}]} />
			        <a href="javascript:;" onClick={this.handleClose.bind(this)} className="icon-close pop-close"></a>
			    </div>
			    {this.state.detail ? <OrderDetail id={this.state.detail} handleClose={this.hideDetail.bind(this)} dispatch={this.props.dispatch} /> : null}
			    {
			    	this.state.comment ? (
			    		<Layer>
			    			<div className="ordercomment">
			    				<Comment params={this.state.comment} handleClose={this.hideComment.bind(this)} />
			    			</div>
			    		</Layer>
			    	) : null
			    }
			</div>
		)
	}
};

MyOrder = connect((state) => ({state}))(MyOrder);
export default MyOrder;