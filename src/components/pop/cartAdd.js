import React from 'react';
import Num from '../number';
import * as Actions from '../../actions';

class CartAdd extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			num:1
		}
	}
	handleChange(num){
		
		this.setState({
			num:num
		})
	}
	handleClick(){
		let state = this.props.state;
		let dispatch = this.props.dispatch;
		let cart = state.cart;
		cart.add.push({
			checked:true,
			num:this.state.num
		})
		dispatch(Actions.setCart(cart));
		dispatch(Actions.setPop({
			show:false
		}));
	}
	render(){
		return (
			<div className="cartAdd">
				<div className="cartAdd-head"></div>
				<div className="cartModify-title">
					<p>选购附加产品</p>
					<span>生日蛋糕已包含餐具及保温包，无需单独购买</span>
				</div>
				
				<ul>
					<li>
						<div className="cartAdd-list-head"></div>
						<div className="cartAdd-list-info">
							<p>草莓戚风蛋糕</p>
							<span>口味：</span><em>芒果</em><span>规格：</span><em>2磅</em><span>数量：</span><em>1</em>
						</div>
						<div className="vertical-middle cartAdd-list-edit">
							<Num min="0" value={this.state.num} handleChange={this.handleChange.bind(this)} />
						</div>
					</li>
				</ul>
				<div className="cartAdd-enter">
					<a className="pop-confirm" href="javascript:;" onClick={this.handleClick.bind(this)}><i className="icon-add"></i>添加到购物车</a>
				</div>
				<a href="" className="pop-cancle">不需要了</a>
			</div>
		)
	}
}


export default CartAdd;