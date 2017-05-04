import React from 'react';
import { connect } from 'react-redux';
import { browserHistory,Link } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import * as Actions from '../../actions';
import mobiscroll from '../../libs/mobiscroll/mobiscroll';
// import Layer from '../layer';
import Config from '../../config';
import {CartFixed,TopFixed} from '../common/fixed/mobile';
import {getDate} from '../common';
import '../../libs/mobiscroll/mobiscroll.css';
import './mobile.scss';
import "zepto";


class Order extends React.Component {
	constructor(props){
		super(props);
		

		let order = props.state.order;

		let data = {
			calendar:{
				show:true,
				data:''
			},
			distribution:{
				show:false,
				type:0,
				time:'',
				address:''
			},
			discount:{
				show:false,
				integral:{
					value:0,
					checked:false
				},
				// balance:{
				// 	value:0,
				// 	checked:true
				// },
				coupon:{
					value:'',
					checked:false,
					data:[]
				}
			},
			remark:{
				show:false,
				data:""
			},
			cost:{
				freight:0,
				discount:0,
				sale:0,
				integral:0
			}
		}
		$.extend(data,order,true);

		this.state = data;

	}
	getData(){
		let self = this;
		let dfd = new $.Deferred();
		let {state,dispatch} = this.props;


		$.ajax({
		  type: 'POST',
		  url: Config.api.cart_next,
		  data:{
		  	cart_id:this.cart_id
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){

		  		let data = res.data;
		  		let reserve_end_time = data.reserve_end_time ? data.reserve_end_time.split('-') : '';
		  		let reserve_start_time = data.reserve_start_time ? data.reserve_start_time.split('-') : '';
		  		let calendar = self.state.calendar;
		  		let distribution = self.state.distribution;

		  		self.distribution = data.shipping_mode;
		  		distribution.address = data.address_list;

		  		if(!calendar.data){
		  			// calendar.data = reserve_start_time[0]+"年"+reserve_start_time[1]+"月"+reserve_start_time[2]+"日";
		  			calendar.data = data.reserve_start_time;
		  		}
		  		self.setState({
		  			calendar,
		  			distribution
		  		});

		  		$('#calendar').mobiscroll().calendar({
		  			theme: 'mobiscroll',
		  		    lang:'zh',
		  		    invalid: data.delivery_data_array ? data.delivery_data_array.split('|') : '',
		  		    display:'inline',
		  		    dateFormat:'yy-mm-dd',
		  		    maxDate:reserve_end_time ? new Date(reserve_end_time[0],reserve_end_time[1]-1,reserve_end_time[2]) : '',
		  		    minDate:reserve_start_time ? new Date(reserve_start_time[0],reserve_start_time[1]-1,reserve_start_time[2]) : '',
		  		    // closeOnSelect:false,
		  		    // btnClass:'hide',
		  		    calendarWidth:"100%",
		  		    onDayChange:function(valueText, inst){
		  		    	let state = self.state;
		  		    	let date = 	valueText.date;
		  		    	let calendar = self.state.calendar;
		  		    	calendar.data = getDate(date);
		  		    	// calendar.data = date.toLocaleDateString().replace(/\//g,'-');
		  		        self.setState({calendar});
		  		    }
		  		});
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
		  	}else if(res.code == 406){
		  		browserHistory.push('/complete?from=order');
		  		return false;
		  	}else{
		  		dispatch(Actions.setMessage({
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
		  	dfd.resolve();
		  }
		});
		return dfd.promise();
	}

	handleShow(cat){
		let state = this.state;
		let dispatch = this.props.dispatch;
		for(let key in state){
			if(cat == key){
				if(cat == 'discount' && (!state.distribution.type || !state.distribution.time)){
					dispatch(Actions.setMessage({
						text:'请选择配送方式和时间段！'
					}));
					state['distribution'].show = true;
				}else{
					state[cat].show = !state[cat].show;
				}

			}else{
				if(state[key] && state[key].show){
					state[key].show = false;
				}
			}

		}
		this.setState(state);
	}
	handleDistribution(e){
		let self = this;
		let value = e.target.value;
		let dispatch = self.props.dispatch;
		let state = this.state;
		let distribution = state.distribution;
		let cost = state.cost;
		if(distribution.type == value){
			return false;
		}
		distribution.type = value;
		distribution.time = '';
		if(value == 1 && state.distribution.address.length != 0){
			// 设置运费
			cost.freight = distribution.address.region_freight
		}else{
			cost.freight = 0;
		}
		this.setState({
			cost
		});
		$.ajax({
		  type: 'POST',
		  url: Config.api.rest,
		  data:{
		  	cart_id:this.cart_id,
		  	shipping_mode:value
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		let data = res.data;
		  		let discount = self.state.discount;
		  		// discount.balance.value = data.pay_balance;
		  		discount.integral.value = data.pay_score;
		  		discount.coupon.data = data.voucher;
		  		self.setState({
		  			discount
		  		});

		  	}else if(res.code == 401){
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
		  	}else if(res.code == 402){
		  		// 没有该商品
		  		dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  		browserHistory.push('/cart');
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

		dispatch(Actions.setOrder(state));
	}
	handleDiscount(e){
		let name = e.target.name;
		if(name){
			let checked = $(e.target).prop('checked');
			let state = this.state;
			// let discount = this.state.discount;
			if(state.discount[name]){
				state.discount[name].checked = checked;
				if(name == 'coupon'){
					if(!checked){
						state.discount.coupon.value = '';
						state.cost.discount = 0;
						state.cost.freight = state.distribution.address.region_freight;
					}

				}
				if(name == 'integral'){
					if(checked){
						let value = e.target.value;
						state.cost.integral = value;
					}else{
						state.cost.integral = 0;
					}
				}
				this.setState(state);
				this.props.dispatch(Actions.setOrder(state));
			}

		}

	}

	handleCheck(e){

		let name = e.target.name;
		switch(name){
			case 'voucher' :
				let state = this.state;
				let value = e.target.value;
				let type = $(e.target).data('type');
				let price = $(e.target).data('price');
				// let user_voucher_id = $(e.target).data('user_voucher_id');
				// state.discount.coupon.id = user_voucher_id;
				let freight = state.distribution.address.region_freight;
				if(type == 2){
					if(parseInt(price)){
						state.cost.freight = (freight - price > 0) ? (freight - price) : 0;
					}else{
						state.cost.freight = 0;
					}
					state.cost.discount = 0;
				}else{
					if(parseInt(price)){
						state.cost.discount = price;
					}else{
						state.cost.discount = 0;
					}
					state.cost.freight = (state.distribution.type == 1) ? freight : 0;
				}
				state.discount.coupon.value = value;
				this.setState(state);
				this.props.dispatch(Actions.setOrder(state));
		}

	}
	handleRemark(e){
		let value = e.target.value;
		let state = this.state;
		state.remark.data = value;
		this.setState(state);
	}
	handleIntegral(value){
		this.beforeIntegral = value;
	}
	handleCreatOrder(){
		let {dispatch} = this.props;
		let state = this.state;
		// let props = this.props;
		// let add_id = [];
		// let add = props.state.order.add;
		// for(let i of add){
		// 	if(i.checked){
		// 		cart_id.push({
		// 			id:i[id],
		// 			num:i[num]
		// 		});
		// 	}
		// }
		// let order = this.props.order;

		// let calendar = state.calendar.data;
		// let distribution = {
		// 	type:state.distribution.type,
		// 	time:state.distribution.time
		// };
		// let discount = state.discount;
		// discount = {
		// 	integral:discount.integral.checked ? discount.integral.value : 0,
		// 	balance:discount.balance.checked ? discount.balance.value : 0,
		// 	coupon:discount.coupon.checked ? discount.coupon.value : 0
		// }
		// let remark = state.remark.data;
		// order = $.extend(order,{
		// 	calendar:calendar,
		// 	distribution:distribution,
		// 	discount:discount,
		// 	remark:remark
		// });
		// dispatch(Actions.setOrder(order));
		if(!state.distribution.type || !state.distribution.time){
			dispatch(Actions.setMessage({
				text:'请选择配送方式和时间段！'
			}));
			state['distribution'].show = true;
			return false;
		}
		if(!state.distribution.address.id){
			dispatch(Actions.setMessage({
				text:'请添加收货人信息！'
			}));
			state['distribution'].show = true;
			return false;
		}

		$.ajax({
		  type: 'POST',
		  url: Config.api.c_order,
		  data:{
		  	cart_id:this.cart_id,
		  	addition_info:this.add_id,
		  	pickup_date:state.calendar.data,
		  	pickup_time:state.distribution.time,
		  	shipping_mode:state.distribution.type,
		  	pay_score:state.discount.integral.checked ? 1 : 0,
		  	// pay_balance:state.discount.balance.checked ? 1 : 0,
		  	pay_voucher:state.discount.coupon.checked ? this.state.discount.coupon.value : 0,
		  	order_message:state.remark.data,
		  	address_id:state.distribution.address.id,
		  	// user_voucher_id:state.discount.coupon.user_voucher_id ? state.discount.coupon.user_voucher_id : ''
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		browserHistory.push('/pay?id='+res.data);

		  	}else{
		  		if (res.code == 401) {
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
			  					browserHistory.push('/cart');
			  				}
			  			}
			  		}));
			  		dispatch(Actions.setMessage({
			  			text:res.message
			  		}));
			  	}else if(res.code == 402){
			  		dispatch(Actions.setMessage({
			  			text:'商品不存在'
			  		}));
			  		browserHistory.push('/cart');
			  	}else if(res.code == 406){
			  		browserHistory.push('/complete?from=order');
			  		return false;
			  	}else if(res.code == 202){
					dispatch(Actions.setMessage({
			  			text:res.message
			  		}));
			  		browserHistory.push('/myorder');
				}else{
					dispatch(Actions.setMessage({
			  			text:res.message
			  		}));
				}

		  	}
		  },
		  error: function(xhr, type){
		    dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
	}
	routerWillLeave(){
		let state = this.state;
		let order = this.props.state.order;
		let {dispatch} = this.props;
		$.extend(order,state);
		dispatch(Actions.setOrder(order));
	}
	componentWillMount(){
		if(($.fn.cookie('is_complete') == 1) && (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') && !!$.fn.cookie('user_id')){
			browserHistory.push('/complete?from=order');
			return false;
		}

		let state = this.props.location.state;
		if(!state){
			browserHistory.push('/cart');
			return false;
		}
		let list = state.list_id;
		let add = state.add_id;
		let list_id = [];
		let add_id = [];
		let total = 0;
		let num = 0;

		// if(list){
		// 	try{
		// 		list = JSON.parse(list);

		// 	}catch(e){
		// 		list = [];
		// 	}
		// }

		if(!(list && list.length)){
			browserHistory.push('/cart');
			return false;
		}

		// if(add){
		// 	try{
		// 		add = JSON.parse(add);
		// 	}catch(e){
		// 		add = [];
		// 	}
		// }

		if(list && list.length){
			list.map((value) => {
				list_id.push(value.id);
				value.checked = true;
				total += value.price*value.num;
				num += value.num*1;
			});
		}else{
			list_id = [];
		}
		if(add && add.length){
			add.map(value => {
				let id = {};
				id[value.id] = value.num;
				add_id.push(id);
				value.checked = true;
				total += value.price*value.num;
				num += value.num*1;
			});
		}else{
			add_id = [];
		}

		let {dispatch} = this.props;
		if(!this.props.state.cart.list.length){
			let state = this.state;
			state.cost.total = total;
			state.cost.num = num;
			state.cost.sale = total < 196 ? 0 : 20;
			this.setState(state);
			dispatch(Actions.setCart({
				list:list,
				add:add
			}));
			dispatch(Actions.setOrder(state));
		}

		this.cart_id = list_id.join(',');
		this.add_id = JSON.stringify(add_id);

		let self = this;
		let dfdTasks = [this.getData()];

		dispatch(Actions.setLoading(true));
		
		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
		});

		// routerWillLeave
		this.props.history.listenBeforeLeavingRoute(
	      this.props.route,
	      this.routerWillLeave.bind(this)
	    );
	}
	componentDidMount(){
		let self = this;

		$(this.refs.distribution).on('click','li',function(e){
			let distribution = self.state.distribution;
			distribution.time = $(this).text();
			self.setState({
				distribution:distribution
			});
		});
	}
	// <label className="order-discount-label">
	// 	<div className="checkbox">
	// 		<input type="checkbox" name="balance" checked={this.state.discount.balance.checked ? "checked" : ""} />
	// 		<span className="icon-check checked"></span>
	// 	</div>
	// 	<span>余额支付</span>
	// 	<span className="order-discount-right">余额：{this.state.discount.balance.value > 0 ? this.state.discount.balance.value : 0}</span>
	// </label>
	render(){
		let distribution = this.distribution;
		// <span className="order-title-desc">{this.state.distribution.time ? ' '+this.state.distribution.time : ''}</span>
		return (
			<div className="order">

				<TopFixed data="订单详情" element="#orderList" />
				<div className="order-box">
					<div className="order-goods">
						<div className="cart-list-about">
							<div className="cart-list-head" style={{backgroundImage:"url("+(this.props.state.cart.list[0] && this.props.state.cart.list[0].goods_cover ? this.props.state.cart.list[0].goods_cover : "")+")"}}></div>
							<div className="cart-list-info">
								<p>已选 {this.props.state.order.cost.num} 件商品</p>
								<span>商品总价 {this.props.state.order.cost.total}元</span>
							</div>
						</div>
						<Link className="vertical-middle cart-list-edit" to="/cart"><i className="icon-edit"></i></Link>
					</div>
				</div>
				<div className="order-item order-calendar">
					<div className="order-header" onClick={this.handleShow.bind(this,"calendar")}>
						<span className="order-title">享用时间</span>
						<span className="order-title-desc">{this.state.calendar && this.state.calendar.data}</span>
						<div className="order-header-right">
							{this.state.calendar.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.calendar.show ? "order-box" : "order-box hide"}>
						<input type="hidden" value={this.state.calendar.data} id="calendar" />
					</div>
				</div>
				<div className="order-item order-distribution">
					<div className="order-header" onClick={this.handleShow.bind(this,"distribution")}>
						<span className="order-title">配送方式</span>
						<span className="order-title-desc">{this.state.distribution.type == 1 ? "配送" : (this.state.distribution.type == 2 ? "门店自提" : "")}</span>
						<span className="order-title-desc"> {!this.state.distribution.show && this.state.distribution.time ? ' '+this.state.distribution.time : ''}</span>
						<div className="order-header-right">
							{this.state.distribution.show ? this.state.distribution.time : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.distribution.show ? "order-box" : "order-box hide"} ref="distribution" onChange={this.handleDistribution.bind(this)}>
						{
							this.distribution ? Object.keys(this.distribution).reverse().map((value,key) => (
								<div key={key}>
									<label>
										<div className="checkbox">
											<input type="radio" value={value} name="distribution" checked={this.state.distribution.type == value ? "checked" : ""} />
											<span className="icon-check checked"></span>
										</div>
										<span className={this.state.distribution.type == value ? "active" : ""}>{value == 1 ? '配送' : '门店自提'}</span>
										<span className="order-distribution-right">选择时间段</span>
									</label>
									<ul className={this.state.distribution.type == value ? "" : "hide"}>
										{
											distribution[value].map((v,k) => (
												<li key={k} className={this.state.distribution.time == v ? "active" : ""}>{v}</li>
											))

										}
									</ul>
								</div>
							)) : null
						}
						<div className="order-address">
							<span>{this.state.distribution.address.username} </span>
							<span> {this.state.distribution.address.phone}</span>
							<Link to={{pathname: Config.path.address, state:{from:'/order',data:this.props.location.state}}}>{this.state.distribution.address.length != 0 ? '更改' : '添加'}</Link>
							<p>{this.state.distribution.address.length != 0 ? (this.state.distribution.type == 1 ? this.state.distribution.address.region_message+this.state.distribution.address.address : null) : '请添加收货人信息'}</p>
							
						</div>
					</div>
				</div>
				<div className="order-item order-discount">
					<div className="order-header" onClick={this.handleShow.bind(this,"discount")}>
						<span className="order-title">优惠抵扣</span>
						<span className="order-title-desc">省{this.state.cost.discount*1+(this.beforeIntegral == undefined ? 0 : (this.state.cost.integral/100 < this.beforeIntegral ? this.state.cost.integral/100 : this.beforeIntegral))}元</span>
						<div className="order-header-right">
							{this.state.discount.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.discount.show ? "order-box" : "order-box hide"} onChange={this.handleDiscount.bind(this)}>
						<label className="order-discount-label">
							<div className="checkbox">
								<input type="checkbox" name="coupon" disabled={this.state.discount.coupon.data.length ? "" : "disabled"} checked={this.state.discount.coupon.data.length && this.state.discount.coupon.checked ? "checked" : ""} />
								<span className="icon-check checked"></span>
							</div>
							<span>优惠券</span>
							<span className="order-discount-right">{this.state.discount.coupon.data ? this.state.discount.coupon.data.length : 0}张未使用</span>
						</label>
						<div className={this.state.discount.coupon.checked ? "order-coupon" : "hide"} onChange={this.handleCheck.bind(this)}>
							{
								this.state.discount.coupon.data && this.state.discount.coupon.data.length ? this.state.discount.coupon.data.map((value,key) => (
									<label>
										<div className="vertical-middle">
											<div className="checkbox">
												<input type="radio" disabled={this.props.state.order.cost.total >= value.satisfy*1 ? "" : "disabled"} checked={this.props.state.order.discount.coupon.checked && (this.props.state.order.cost.total >= value.satisfy*1) && (value.user_voucher_id == this.state.discount.coupon.value ? "checked" : "")} name="voucher" value={value.user_voucher_id} data-type={value.type} data-price={value.price} />
												<span className="icon-check checked"></span>
											</div>
										</div>
										<div className="order-coupon-list">
											<div className="order-coupon-about" style={{backgroundColor:value.color}}>
												<strong>{value.title_tag}</strong><span style={{color:value.color}}>{value.title}</span>
												<p>{getDate(new Date(parseInt(value.start_time) * 1000))} ~ {getDate(new Date(parseInt(value.end_time) * 1000))}</p>
											</div>
											<div className="order-coupon-info">
												<p>{(value.type == 2 && !parseInt(value.price)) ? '免运费' : '¥ '+value.price}</p>
												<span style={{color:value.color}}>满¥ {value.satisfy ? value.satisfy : 0}可用</span>
											</div>
										</div>
									</label>
								)) : null
							}
						</div>
						<label className="order-discount-label">
							<div className="checkbox">
								<input type="checkbox" name="integral" disabled={this.state.discount.integral.value > 0 && this.beforeIntegral ? "" : "disabled"} checked={this.state.discount.integral.value > 0 && this.state.discount.integral.checked ? "checked" : ""} value={this.state.discount.integral.value} />
								<span className="icon-check checked"></span>
							</div>
							<span>积分支付</span>
							<span className="order-discount-right">积分：{this.state.discount.integral.value > 0 ? this.state.discount.integral.value : 0}</span>
						</label>
					</div>
				</div>
				<div className="order-item order-remark">
					<div className="order-header" onClick={this.handleShow.bind(this,"remark")}>
						<span className="order-title">备注</span>
						<span className="order-title-desc">{this.state.remark.data ? this.state.remark.data : ""}</span>
						<div className="order-header-right">
							{this.state.remark.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.remark.show ? "order-box" : "order-box hide"}>
						<textarea placeholder="我们会在您选择的时间段内送达，请勿备注具体时间点" onBlur={this.handleRemark.bind(this)}></textarea>
					</div>
				</div>
				<CartFixed handleIntegral={this.handleIntegral.bind(this)} state={this.props.state} data={{btn:"生成订单"}} handleClick={this.handleCreatOrder.bind(this)} />
			</div>
		)
	}
}
Order = connect(state => ({state}))(Order);
export default Order;
