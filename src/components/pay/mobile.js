import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';

import * as Actions from '../../actions';
import {CartFixed,TopFixed} from '../common/fixed/mobile';
import Config from '../../config';
import './mobile.scss';
import "zepto";
class Pay extends React.Component {
	constructor(props){
		super();
		props.dispatch(Actions.setLoading(true));
		this.payType = (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') ? 1 : 2;
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
			pay_role:'wap'
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
			pay_role:'wap'
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
		let id = this.props.location.query.id;
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
					pay_role:'wap'
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
			pay_role:'wap'
	  	}
		window.location.href = Config.api.pay+'?'+$.param(params);
		return false;
		// if(this.state.order_info.pay_id == 0){
		// 余额，微信第三方混合支付
		
		// }
		// if(order_amount*1 > 0 && this.state.payType){
		// 	// 余额，微信第三方混合支付
		// 	let params = {
		// 	  	id:id,
		// 		pay_way:order_amount == this.total ? this.state.payType : this.state.payType+',3',
		// 		pay_role:'wap'
		//   	}
		// 	window.location.href = Config.api.pay+'?'+$.param(params);
		// 	return false;
			// $.ajax({
			//   type: 'POST',
			//   url: Config.api.pay,
			//   data:{
			//   	id:id,
			// 	pay_way:order_amount == this.total ? this.state.payType : this.state.payType+',3',
			// 	pay_role:'wap'
		 //  	  },
			//   dataType: Config.dataType,
			//   success: function(res){
			// 	if(res.code == 200){
			// 		browserHistory.push('/myorder');
			// 		dispatch(Actions.setMessage({
			//   			text:res.message
			//   		}));
			// 	}else if(res.code == 401){
			// 		// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
			// 		// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
			// 		// 	return false;
			// 		// }
			//   		dispatch(Actions.setPop({
			//   			show:'login',
			//   			data:{
			//   				success(){
			//   					window.location.reload();
			//   				}
			//   			}
			//   		}));
			//   		dispatch(Actions.setMessage({
			//   			text:res.message
			//   		}));
			//   	}else{
			// 		dispatch(Actions.setMessage({
			//   			text:res.message
			//   		}));
			//   	}
			//   },
			//   error: function(xhr, type){
			//     console.log(type);
			//   }
			// });
		// }else{
			
		// }
		// dispatch(Actions.setOrder({
		// 	payType:this.state.payType
		// }));

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
	// handleTotal(total){
	// 	this.total = total;
	// }
	getData(){
		let self = this;
		let {dispatch} = this.props;
		let dfd = new $.Deferred();

		$.ajax({
		  type: 'POST',
		  url: Config.api.settleaccounts,
		  data:{
		  	id:this.props.location.query.id
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
	handlePayType(e){
		let value = e.target.value;
		let payType = this.state.payType;
		if(payType){
			this.setState({
				payType:value
			});
		}

	}
	// getTotal(){
	// 	let detail = this.state.detail;
	// 	if(detail){
	// 		for(let item of detail){
	// 			item
	// 		}
	// 	}
	// }
	routerWillLeave(){

		this.props.dispatch(Actions.setCart({
			list:[],
			add:[]
		}));
	}
	componentWillMount(){
		let self = this;
		let {dispatch} = this.props;

		// if(!state.cart.list.length || !state.cart.add.length){
		// 	browserHistory.push('/cart');
		// }
		let dfdTasks = [this.getData()];
		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
			// self.setState({
			// 	loading:false
			// })
		});

		this.props.history.listenBeforeLeavingRoute(
	      this.props.route,
	      this.routerWillLeave.bind(this)
	    );
	}

	render(){
		let state = this.state;

		return (
			<div className="pay" id="pay">
				<TopFixed data="订单结算" />
				
					
				<div className="pay-header">
					<strong>{state.order_info ? state.order_info.title : ''}</strong>
					<span># {state.order_info ? state.order_info.order_sn : ''}</span>
					<a href="javascript:;" onClick={this.handleCancle.bind(this)} className="pay-right"><i className="icon-close"></i></a>
				</div>
				<ul className="pay-list">
					{
						state.detail && state.detail.length ? state.detail.map((value,key) => (
							<li><span>{value.title}</span><span className="pay-right">{value.type == 0 ? '-' : (value.type == 1 ? '+' : '')} ¥ {value.content}</span></li>
						)) : null
					}
					{
						this.discount ? <li><span>使用账户余额抵扣</span><span className="pay-right">- ¥ {this.discount}</span></li> : null
					}
				</ul>
				<ul className="pay-list">
					{
						state.describe && state.describe.length ? state.describe.map((value,key) => (
							<li><span>{value.title}</span><span className="pay-right" style={{width:'70%'}}>{value.content}</span></li>
						)) : null
					}
				</ul>
				{
					state.paytype && state.paytype.length ? <ul className="pay-list">
						{
							state.paytype.map((value,key) => (
								<li><span>{value.title}</span><span className="pay-right">¥ {value.content}</span></li>
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
											<span>{state.balance.title}</span>
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
						<ul className="pay-list" style={{opacity:this.state.payType ? 1 : 0.6}} onChange={this.handlePayType.bind(this)}>
							{
								(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') ? (
									
									<li className="pay-account">
										<label>
											<div className="checkbox">
												<input type="radio" name="pay" value="1" checked={this.state.payType == 1 ? "checked" : ""} />
												<span className="icon-check checked"></span>
											</div>
											<span>微信支付</span>
										</label>
									</li>
								) : (
									<li className="pay-account">
										<label>
											<div className="checkbox">
												<input type="radio" name="pay" value="2" checked={this.state.payType == 2 ? "checked" : ""} />
												<span className="icon-check checked"></span>
											</div>
											<span>支付宝付款</span>
										</label>
									</li>
								)
							}
							
						</ul>
					) : null) : null
				}
				<CartFixed total={this.state.detail ? this.state.detail[0].order_amount : 0} state={this.props.state} data={{btn:"立即支付"}} handleClick={this.handlePay.bind(this)} />
			</div>
		)

	}
}
Pay = connect(state => ({state}))(Pay);
export default Pay;
