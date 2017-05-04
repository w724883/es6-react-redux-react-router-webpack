import React from 'react';
import { connect } from 'react-redux';
import { browserHistory,Link } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import * as Actions from '../../actions';
import mobiscroll from '../../libs/mobiscroll/mobiscroll';
// import Layer from '../common/layer/pc';
import Config from '../../config';
// import {CartFixed,TopFixed} from '../common/fixed/mobile';
import {getDate} from '../common';
import '../../libs/mobiscroll/mobiscroll.css';
import './pc.scss';
import "zepto";


class Order extends React.Component {
	constructor(props){
		super(props);

		let order = props.state.order;

		let data = {
			calendar:{
				show:false,
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
	handleAddress(){
		let self = this;
		this.props.dispatch(Actions.setPop({
			show:'address',
			data:{
				cancle:function(d){
					let username = d.username;
					let phone = d.phone;
					if(username){
						let distribution = self.state.distribution;
						distribution.address.username = username;
						distribution.address.phone = phone;
						self.setState({
							distribution
						});
					}
					
				}
			}
		}));
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
		  	cart_id:this.props.data.cart_id,
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
		let self = this;
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
		  	cart_id:this.props.data.cart_id,
		  	addition_info:JSON.stringify(this.props.add),
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
		  		self.props.handlePay(res.data);
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
	// 	let state = this.state;
	// 	let order = this.props.state.order;
	// 	let {dispatch} = this.props;
	// 	$.extend(order,state);
	// 	dispatch(Actions.setOrder(order));
	// }
	componentWillUpdate(props) {
	    this.getTotal();  
	}
	componentWillMount(){
		let {data} = this.props;
  		
  		let calendar = this.state.calendar;
  		let distribution = this.state.distribution;
  		// data.reserve_start_time = "2017-01-05";
  		this.distribution = data.shipping_mode;
  		distribution.address = data.address_list;
  		calendar.show = true;
  		if(!calendar.data){
  			// calendar.data = reserve_start_time[0]+"年"+reserve_start_time[1]+"月"+reserve_start_time[2]+"日";
  			calendar.data = data.reserve_start_time;
  		}
  		// this.getTotal(); 
  		this.setState({
  			calendar,
  			distribution
  		});
	 	this.props.handleCreatOrder(this.handleCreatOrder.bind(this));
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

		let {data} = this.props;

  		
		let reserve_end_time = data.reserve_end_time ? data.reserve_end_time.split('-') : '';
  		let reserve_start_time = data.reserve_start_time ? data.reserve_start_time.split('-') : '';

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
				<div className={this.state.calendar.show ? "order-item order-calendar active" : "order-item order-calendar"}>
					<div className="order-header" onClick={this.handleShow.bind(this,"calendar")}>
						<span className="order-title">享用时间</span>
						<span className="order-title-desc">{this.state.calendar && this.state.calendar.data}</span>
						<div className="order-header-right">
							{this.state.calendar.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className="order-box">
						<input type="hidden" value={this.state.calendar.data} id="calendar" />
					</div>
				</div>
				<div className={this.state.distribution.show ? "order-item order-distribution active" : "order-item order-distribution"}>
					<div className="order-header" onClick={this.handleShow.bind(this,"distribution")}>
						<span className="order-title">配送方式</span>
						<span className="order-title-desc">{this.state.distribution.type == 1 ? "配送" : (this.state.distribution.type == 2 ? "门店自提" : "")}</span>
						<span className="order-title-desc"> {!this.state.distribution.show && this.state.distribution.time ? ' '+this.state.distribution.time : ''}</span>
						<div className="order-header-right">
							{this.state.distribution.show ? this.state.distribution.time : <i className="icon-add"></i>}
						</div>
					</div>
					<div className="order-box" ref="distribution" onChange={this.handleDistribution.bind(this)}>
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
							{
								this.state.distribution.type == 1 ? <p>我们会在您选择的时间段内送达，无法指定具体的时间点</p> : null
							}
							<span>{this.state.distribution.address.username} </span>
							<span> {this.state.distribution.address.phone}</span>
							<a onClick={this.handleAddress.bind(this)} href="javascript:;">{this.state.distribution.address.length != 0 ? '更改' : '添加'}</a>
							<p>{this.state.distribution.address.length != 0 ? (this.state.distribution.type == 1 ? this.state.distribution.address.region_message+this.state.distribution.address.address : null) : '请添加收货人信息'}</p>
							
						</div>
					</div>
				</div>
				<div className={this.state.discount.show ? "order-item order-discount active" : "order-item order-discount"}>
					<div className="order-header" onClick={this.handleShow.bind(this,"discount")}>
						<span className="order-title">优惠抵扣</span>
						<span className="order-title-desc">省{this.state.cost.discount*1+(this.beforeIntegral == undefined ? 0 : (this.state.cost.integral/100 < this.beforeIntegral ? this.state.cost.integral/100 : this.beforeIntegral))}元</span>
						<div className="order-header-right">
							{this.state.discount.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className="order-box" onChange={this.handleDiscount.bind(this)}>
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
				<div className={this.state.remark.show ? "order-item order-remark active" : "order-item order-remark"}>
					<div className="order-header" onClick={this.handleShow.bind(this,"remark")}>
						<span className="order-title">备注</span>
						<span className="order-title-desc">{this.state.remark.data ? this.state.remark.data : ""}</span>
						<div className="order-header-right">
							{this.state.remark.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className="order-box">
						<textarea placeholder="如果有特别要求请给我们留言" onBlur={this.handleRemark.bind(this)}></textarea>
					</div>
				</div>
			</div>
		)
	}
}
Order = connect(state => ({state}))(Order);
export default Order;
