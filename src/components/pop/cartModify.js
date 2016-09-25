import React from 'react';
import Num from '../number';
import * as Actions from '../../actions';
class CartModify extends React.Component {
	constructor(props){
		super(props);
		let data = props.state.pop.data;
		let cart = props.state.cart;
		this.state = {
			num:cart[data.value][data.key].num
		}

	}
	handleClick(){
		let state = this.props.state;
		let dispatch = this.props.dispatch;
		let data = state.pop.data;
		let cart = state.cart;
		cart[data.value][data.key].checked = this.state.num ? true : false;			
		cart[data.value][data.key].num = this.state.num;
		dispatch(Actions.setCart(cart));
		dispatch(Actions.setPop({
			show:false
		}));
	}
	handleChange(num){
		this.setState({
			num:num
		})
	}
	render(){
		// let state = this.props.state;
		// let data = state.pop.data;
		// let cart = state.cart;
		return (
			<div className="cartModify">
				<div className="cartModify-head"><i className="icon-edit"></i></div>
				<div className="cartModify-title">
					<p>修改商品</p>
					<span>已选口味、规格无法修改</span>
				</div>
				
				<ul>
					<li>
						<div className="cartModify-list-head"></div>
						<div className="cartModify-list-info">
							<p>草莓戚风蛋糕</p>
							<span>口味：</span><em>芒果</em><span>规格：</span><em>2磅</em><span>数量：</span><em>1</em>
						</div>
						<div className="vertical-middle cartModify-list-edit">
							<Num min="0" value={this.state.num} handleChange={this.handleChange.bind(this)} />
						</div>
					</li>
				</ul>
				<div className="cartModify-enter">
					<a className="pop-confirm" href="javascript:;" onClick={this.handleClick.bind(this)}><i className="icon-update"></i>更新购物车</a>
				</div>
				<a href="" className="pop-cancle">放弃修改</a>
			</div>
		)
	}
}


export default CartModify;