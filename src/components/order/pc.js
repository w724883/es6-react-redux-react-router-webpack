import React from 'react';
import * as Actions from '../../actions';
import mobiscroll from '../../libs/mobiscroll/mobiscroll.js';
import '../../libs/mobiscroll/mobiscroll.css';
import "zepto";

class CartOrder extends React.Component {
	constructor(props){
		super(props);
		this.state={
			calendar:{
				show:false,
				data:"2016-08-01"
			},
			distribution:{
				show:false,
				type:"1",
				time:"13:00~14:00"
			},
			discount:{
				show:false,
				integral:20,
				balance:100,
				coupon:1
			},
			remark:{
				show:false,
				data:""
			}
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
		let state = this.state;
		state.distribution.type = value;
		this.setState(state);
	}
	handleRemark(e){
		let value = e.target.value;
		let state = this.state;
		state.remark.data = value;
		this.setState(state);
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
		    btnClass:'hide',
		    calendarWidth:"100%",
		    onDayChange:function(valueText, inst){
		    	let state = self.state;
		    	let date = 	valueText.date;
		    	let year = date.getFullYear();
		    	let month = date.getMonth()+1;
		    	let day = date.getDate();
		    	month = month < 10 ? "0"+month : month;
		    	day = day < 10 ? "0"+day : day;
		    	state.calendar.data = year+"-"+month+"-"+day;
		        self.setState(state);
		    }
		});

		$(this.refs.distribution).on('click','li',function(e){
			let state = self.state;
			state.distribution.time = $(this).data('time');
			self.setState(state);
		})
	}
	render(){
		return (
			<div className="cartOrder">
				<div className="cartOrder-item cartOrder-calendar">
					<div className="cartOrder-header">
						<span className="cartOrder-title">享用时间</span>
						<span>{this.state.calendar.data}</span>
						<div className="cartOrder-header-right" onClick={this.handleShow.bind(this,"calendar")}>
							{this.state.calendar.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.calendar.show ? "cartOrder-box" : "cartOrder-box hide"}>
						<input type="hidden" id="calendar" />
					</div>
				</div>
				<div className="cartOrder-item cartOrder-distribution">
					<div className="cartOrder-header">
						<span className="cartOrder-title">配送方式</span>
						<span>{this.state.distribution.type == 1 ? "送货上门" : (this.state.distribution.type == 2 ? "到店自提" : "")}</span>
						<div className="cartOrder-header-right" onClick={this.handleShow.bind(this,"distribution")}>
							{this.state.distribution.show ? this.state.distribution.time : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.distribution.show ? "cartOrder-box" : "cartOrder-box hide"} ref="distribution">
						<label>
							<div className="checkbox">
								<input type="radio" value="1" name="distribution" checked={this.state.distribution.type == 1 ? "checked" : ""} onChange={this.handleDistribution.bind(this)} />
								<span className="icon-check checked"></span>
							</div>
							<span className={this.state.distribution.type == 1 ? "active" : ""}>送货上门</span>
							<span className="cartOrder-distribution-right">选择时间段</span>
						</label>
						<ul className={this.state.distribution.type == 1 ? "" : "hide"}>
							<li className={this.state.distribution.time == "12:00~13:00" ? "active" : ""} data-time="12:00~13:00">12:00~13:00</li>
						</ul>
						<label>
							<div className="checkbox">
								<input type="radio" name="distribution" value="2" checked={this.state.distribution.type == 2 ? "checked" : ""} onChange={this.handleDistribution.bind(this)} />
								<span className="icon-check checked"></span>
							</div>
							<span className={this.state.distribution.type == 2 ? "active" : ""}>到店自提</span>
							<span className="cartOrder-distribution-right">选择时间段</span>
						</label>
						<ul className={this.state.distribution.type == 2 ? "" : "hide"}>
							<li className={this.state.distribution.time == "12:00~13:00" ? "active" : ""} data-time="12:00~13:00">12:00~13:00</li>
						</ul>
						<div className="cartOrder-address">
							<span>北京  朝阳区大望路总店</span>
							<a href="">更改</a>
						</div>
					</div>
				</div>
				<div className="cartOrder-item cartOrder-discount">
					<div className="cartOrder-header">
						<span className="cartOrder-title">优惠抵扣</span>
						<span>省15元</span>
						<div className="cartOrder-header-right" onClick={this.handleShow.bind(this,"discount")}>
							{this.state.discount.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.discount.show ? "cartOrder-box" : "cartOrder-box hide"}>
						<label className="cartOrder-discount-label">
							<div className="checkbox">
								<input type="checkbox" />
								<span className="icon-check checked"></span>
							</div>
							<span>积分支付</span>
							<span className="cartOrder-discount-right">积分：{this.state.discount.integral}</span>
						</label>
						<label className="cartOrder-discount-label">
							<div className="checkbox">
								<input type="checkbox" />
								<span className="icon-check checked"></span>
							</div>
							<span>余额支付</span>
							<span className="cartOrder-discount-right">余额：{this.state.discount.balance}</span>
						</label>
						<label className="cartOrder-discount-label">
							<div className="checkbox">
								<input type="checkbox" />
								<span className="icon-check checked"></span>
							</div>
							<span>优惠券</span>
							<span className="cartOrder-discount-right">2张可用</span>
						</label>
						<div className="cartOrder-coupon">
							<label className="cartOrder-coupon-blue">
								<div className="vertical-middle">
									<div className="checkbox">
										<input type="checkbox" />
										<span className="icon-check checked"></span>
									</div>
								</div>
								
								<div className="cartOrder-coupon-list">
									<div className="cartOrder-coupon-about">
										<strong>新手优惠券</strong><span>单品券</span>
										<p>2016/02/13 ~ 2016/03/13</p>
									</div>
									<div className="cartOrder-coupon-info">
										<p>￥35.00</p>
										<span>满￥200可用</span>
									</div>
								</div>
							</label>
							<label className="cartOrder-coupon-red">
								<div className="vertical-middle">
									<div className="checkbox">
										<input type="checkbox" />
										<span className="icon-check checked"></span>
									</div>
								</div>
								
								<div className="cartOrder-coupon-list">
									<div className="cartOrder-coupon-about">
										<strong>新手优惠券</strong><span>单品券</span>
										<p>2016/02/13 ~ 2016/03/13</p>
									</div>
									<div className="cartOrder-coupon-info">
										<p>￥35.00</p>
										<span>满￥200可用</span>
									</div>
								</div>
							</label>
						</div>
					</div>
				</div>
				<div className="cartOrder-item cartOrder-remark">
					<div className="cartOrder-header">
						<span className="cartOrder-title">备注</span>
						<span>如需嘱咐请留言</span>
						<div className="cartOrder-header-right" onClick={this.handleShow.bind(this,"remark")}>
							{this.state.remark.show ? "" : <i className="icon-add"></i>}
						</div>
					</div>
					<div className={this.state.remark.show ? "cartOrder-box" : "cartOrder-box hide"}>
						<textarea placeholder="如果有特别要求请给我们留言" onBlur={this.handleRemark.bind(this)}></textarea>
					</div>
				</div>
			</div>
		)
	}
}

export default CartOrder;