import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import * as Actions from '../../actions';
import mobiscroll from '../../libs/mobiscroll/mobiscroll.js';
import Layer from '../layer';
import {Loading} from '../loading';
import CartFixed from '../fixed/cartFixed';
import TopFixed from '../fixed/topFixed';
import '../../libs/mobiscroll/mobiscroll.css';
import './mobile.scss';
import "zepto";


class Order extends React.Component {
	constructor(props){
		super(props);

		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth()+1;
		let day = date.getDate();
		month = month < 10 ? "0"+month : month;
		day = day < 10 ? "0"+day : day;

		this.state = {
			calendar:{
				show:true,
				data:year+"年"+month+"月"+day+"日"
			},
			distribution:{
				show:false,
				data:[
					{
						type:1,
						time:["13:00~14:00","14:00~15:00","16:00~17:00","18:00~19:00"]
					},
					{
						type:2,
						time:["8:00~9:00","9:00~10:00","11:00~12:00","13:00~14:00"]
					}
				],
				type:1,
				time:"13:00~14:00"
			},
			discount:{
				show:false,
				integral:{
					value:20,
					checked:true
				},
				balance:{
					value:100,
					checked:true
				},
				coupon:{
					value:1,
					checked:true,
				}
			},
			remark:{
				show:false,
				data:""
			},
			loading:true
		}
	}
	handleShow(cat){
		let state = this.state;
		for(let key in state){
			if(cat == key){
				state[cat].show = !state[cat].show
			}else{
				state[key].show = false;
			}
			
		}
		this.setState(state);
	}
	handleDistribution(e){
		let value = e.target.value;
		let distribution = this.state.distribution;
		distribution.type = value;
		this.setState({
			distribution:distribution
		});
	}
	handleIntegral(e){
		let value = $(e.target).prop('checked');
		let discount = this.state.discount;
		discount.integral.checked = value;
		console.log(discount)
		this.setState({
			discount:discount
		});
	}
	handleBalance(e){
		let value = $(e.target).prop('checked');
		let discount = this.state.discount;
		discount.balance.checked = value;
		this.setState({
			discount:discount
		});
	}
	handleCoupon(e){
		let value = $(e.target).prop('checked');
		let discount = this.state.discount;
		discount.coupon.checked = value;
		this.setState({
			discount:discount
		});
	}
	handleCouponType(e){
		let value = e.target.value;
		let discount = this.state.discount;
		discount.coupon.value = value;
		this.setState({
			discount:discount
		});
	}
	handleRemark(e){
		let value = e.target.value;
		let state = this.state;
		state.remark.data = value;
		this.setState(state);
	}
	handleCreatOrder(){
		let {order,dispatch} = this.props;
		let state = this.state;
		// let order = this.props.order;

		let calendar = state.calendar.data;
		let distribution = {
			type:state.distribution.type,
			time:state.distribution.time
		};
		let discount = state.discount;
		discount = {
			integral:discount.integral.checked ? discount.integral.value : 0,
			balance:discount.balance.checked ? discount.balance.value : 0,
			coupon:discount.coupon.checked ? discount.coupon.value : 0
		}
		let remark = state.remark.data;
		order = $.extend(order,{
			calendar:calendar,
			distribution:distribution,
			discount:discount,
			remark:remark
		});
		dispatch(Actions.setOrder(order));
	}
	componentWillMount(){
		let self = this;
		let {state} = this.props;
		if(!state.cart.list.length || !state.cart.add.length){
			browserHistory.push('/cart');
			return false;
		}
		
		var dfdTasks = [];
		$.when.apply(null,dfdTasks).done(function(){
			// dispatch(Actions.setLoading(false));
			self.setState({
				loading:false
			});
		});
	}
	componentDidMount(){
		let self = this;
		$('#calendar').mobiscroll().calendar({
			theme: 'mobiscroll',
		    lang:'zh',
		    invalid: ['9/11'],
		    display:'inline',
		    dateFormat:'yy年mm月dd日',
		    // closeOnSelect:false,
		    // btnClass:'hide',
		    calendarWidth:"100%",
		    onDayChange:function(valueText, inst){
		    	let state = self.state;
		    	let date = 	valueText.date;
		    	let year = date.getFullYear();
		    	let month = date.getMonth()+1;
		    	let day = date.getDate();
		    	month = month < 10 ? "0"+month : month;
		    	day = day < 10 ? "0"+day : day;
		    	state.calendar.data = year+"年"+month+"月"+day+"日";
		        self.setState(state);
		    }
		});

		$(this.refs.distribution).on('click','li',function(e){
			let distribution = self.state.distribution;
			distribution.time = $(this).text();
			self.setState({
				distribution:distribution
			});
		})
	}
	render(){
		return (
			<div className="order">

				<TopFixed data="购物车" element="#orderList" />
				<div className="order-item order-calendar">
					<div className="order-header">
						<span className="order-title">享用时间</span>
						<span className="order-title-desc">{this.state.calendar.data}</span>
						<div className="order-header-right" onClick={this.handleShow.bind(this,"calendar")}>
							{this.state.calendar.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.calendar.show ? "order-box" : "order-box hide"}>
						<input type="hidden" id="calendar" />
					</div>
				</div>
				<div className="order-item order-distribution">
					<div className="order-header">
						<span className="order-title">配送方式</span>
						<span className="order-title-desc">{this.state.distribution.type == 1 ? "送货上门" : (this.state.distribution.type == 2 ? "到店自提" : "")}</span>
						<div className="order-header-right" onClick={this.handleShow.bind(this,"distribution")}>
							{this.state.distribution.show ? this.state.distribution.time : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.distribution.show ? "order-box" : "order-box hide"} ref="distribution">
						{
							this.state.distribution.data.map((value,key) => (
								<div key={key}>
									<label>
										<div className="checkbox">
											<input type="radio" value={value.type} name="distribution" checked={this.state.distribution.type == value.type ? "checked" : ""} onChange={this.handleDistribution.bind(this)} />
											<span className="icon-check checked"></span>
										</div>
										<span className={this.state.distribution.type == value.type ? "active" : ""}>送货上门</span>
										<span className="order-distribution-right">选择时间段</span>
									</label>
									<ul className={this.state.distribution.type == value.type ? "" : "hide"}>
										{
											value.time.map((v,k) => (
												<li key={k} className={this.state.distribution.time == v ? "active" : ""}>{v}</li>
											))
										
										}
									</ul>
								</div>
							))
						}
						<div className="order-address">
							<span>北京  朝阳区大望路总店</span>
							<a href="">更改</a>
						</div>
					</div>
				</div>
				<div className="order-item order-discount">
					<div className="order-header">
						<span className="order-title">优惠抵扣</span>
						<span className="order-title-desc">省15元</span>
						<div className="order-header-right" onClick={this.handleShow.bind(this,"discount")}>
							{this.state.discount.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.discount.show ? "order-box" : "order-box hide"}>
						<label className="order-discount-label">
							<div className="checkbox">
								<input type="checkbox" checked={this.state.discount.integral.checked ? "checked" : ""} onChange={this.handleIntegral.bind(this)} />
								<span className="icon-check checked"></span>
							</div>
							<span>积分支付</span>
							<span className="order-discount-right">积分：{this.state.discount.integral.value > 0 ? this.state.discount.integral.value : 0}</span>
						</label>
						<label className="order-discount-label">
							<div className="checkbox">
								<input type="checkbox" checked={this.state.discount.balance.checked ? "checked" : ""} onChange={this.handleBalance.bind(this)} />
								<span className="icon-check checked"></span>
							</div>
							<span>余额支付</span>
							<span className="order-discount-right">余额：{this.state.discount.balance.value > 0 ? this.state.discount.balance.value : 0}</span>
						</label>
						<label className="order-discount-label">
							<div className="checkbox">
								<input type="checkbox" checked={this.state.discount.coupon.checked ? "checked" : ""} onChange={this.handleCoupon.bind(this)} />
								<span className="icon-check checked"></span>
							</div>
							<span>优惠券</span>
							<span className="order-discount-right">2张可用</span>
						</label>
						<div className={this.state.discount.coupon.checked ? "order-coupon" : "hide"}>
							<label className="order-coupon-blue">
								<div className="vertical-middle">
									<div className="checkbox">
										<input type="checkbox" checked={this.state.discount.coupon.value == 1 ? "checked" : ""} onChange={this.handleCouponType.bind(this)} value="1" />
										<span className="icon-check checked"></span>
									</div>
								</div>
								
								<div className="order-coupon-list">
									<div className="order-coupon-about">
										<strong>新手优惠券</strong><span>单品券</span>
										<p>2016/02/13 ~ 2016/03/13</p>
									</div>
									<div className="order-coupon-info">
										<p>￥35.00</p>
										<span>满￥200可用</span>
									</div>
								</div>
							</label>
							<label className="order-coupon-red">
								<div className="vertical-middle">
									<div className="checkbox">
										<input type="checkbox" checked={this.state.discount.coupon.value == 2 ? "checked" : ""} onChange={this.handleCouponType.bind(this)} value="2" />
										<span className="icon-check checked"></span>
									</div>
								</div>
								
								<div className="order-coupon-list">
									<div className="order-coupon-about">
										<strong>新手优惠券</strong><span>单品券</span>
										<p>2016/02/13 ~ 2016/03/13</p>
									</div>
									<div className="order-coupon-info">
										<p>￥35.00</p>
										<span>满￥200可用</span>
									</div>
								</div>
							</label>
						</div>
					</div>
				</div>
				<div className="order-item order-remark">
					<div className="order-header">
						<span className="order-title">备注</span>
						<span className="order-title-desc">{this.state.remark.data ? this.state.remark.data : "如需嘱咐请留言"}</span>
						<div className="order-header-right" onClick={this.handleShow.bind(this,"remark")}>
							{this.state.remark.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.remark.show ? "order-box" : "order-box hide"}>
						<textarea placeholder="如果有特别要求请给我们留言" onBlur={this.handleRemark.bind(this)}></textarea>
					</div>
				</div>
				<CartFixed data={{btn:"生成订单",link:"/pay"}} handleClick={this.handleCreatOrder.bind(this)} />
				<CSSTransitionGroup
					component="div"
					transitionEnter={false}
	              	transitionLeaveTimeout={400}
	              	transitionName="transition-layer">
						{this.state.loading ? <Layer><Loading /></Layer> : null}
				</CSSTransitionGroup>
			</div>
		)
	}
}
Order = connect(state => ({state}))(Order);
export default Order;