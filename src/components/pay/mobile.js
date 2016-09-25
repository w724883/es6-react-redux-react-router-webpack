import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Layer from '../layer';
import {Loading} from '../loading';

import * as Actions from '../../actions';
import CartFixed from '../fixed/cartFixed';
import TopFixed from '../fixed/topFixed';
import Config from '../../config';
import './mobile.scss';
import "zepto";
class Pay extends React.Component {
	constructor(){
		super();
		this.state = {
			payType:1,
			loading:true
		}
	}
	handlePay(){
		let {dispatch} = this.props;
		dispatch(Actions.setOrder({
			payType:this.state.payType
		}));
	}
	componentWillMount(){
		let self = this;
		let {state} = this.props;
		if(!state.cart.list.length || !state.cart.add.length){
			browserHistory.push('/cart');
		}
		var dfdTasks = [];
		$.when.apply(null,dfdTasks).done(function(){
			// dispatch(Actions.setLoading(false));
			self.setState({
				loading:false
			})
		});
	}
	componentDidMount(){
		let self = this;
		let type = $(this.refs.payType);
		type.on('click','li',function(){
			let type = $(this).data('type');
			self.setState({
				payType:type
			});
		})
	}
	render(){
		return (
			<div className="pay" id="pay">
				<TopFixed data="订单结算" />
				<div className="pay-scroll">
					<div className="pay-header">
						<strong>订单详情</strong>
						<span>#6653791033</span>
						<Link to="/order" className="pay-right"><i className="icon-close"></i></Link>
					</div>
					<ul className="pay-list">
						<li><span>商品金额</span><span className="pay-right">+ ￥ 368.00</span></li>
						<li><span>优惠券</span><span className="pay-right">- ￥ 15.00</span></li>
					</ul>
					<ul className="pay-list">
						<li><span>享用时间</span><span className="pay-right">2016年07月23日 17:00~18:00</span></li>
						<li><span>配送方式</span><span className="pay-right">北京朝阳区大望路总店  到店自提</span></li>
						<li><span>备注</span><span className="pay-right"></span></li>
					</ul>
					<ul className="pay-type" ref="payType">
						<li data-type="1" className={this.state.payType == 1 ? "active" : ""}>
							<i className="icon-alipay"></i>
							<span>支付宝付款</span>
						</li>
						<li data-type="2" className={this.state.payType == 2 ? "active" : ""}>
							<i className="icon-wechat"></i>
							<span>微信付款</span>
						</li>
					</ul>
				</div>
				<CartFixed data={{btn:"立即支付"}} handleClick={this.handlePay.bind(this)} />
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
Pay = connect(state => ({state}))(Pay);
export default Pay;