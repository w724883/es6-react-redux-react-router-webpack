import React from 'react';
import {setPop} from '../../actions';
class CartJoin extends React.Component {
	handleClick(){
		this.props.dispatch(setPop({
			show:false
		}));
	}
	render(){
		return (
			<div className="cartJoin">
				<div className="cartJoin-head"></div>
				<div className="cartJoin-title">
					<p>您选择的商品已经加入购物车</p>
				</div>
				
				<div className="cartJoin-enter">
					<a className="pop-confirm" href="/cart"><i className="icon-pay"></i>购物车结算</a>
				</div>
				
				<a className="pop-cancle" href="/">继续逛</a>
			</div>
		)
	}
}


export default CartJoin;