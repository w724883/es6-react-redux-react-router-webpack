import React from 'react';

import "./index.scss";

class CartJoin extends React.Component {
	render(){
		return (
			<div className="cartJoin">
				<div className="cartJoin-head"></div>
				<p>您选择的商品已经加入购物车</p>
				<div className="cartJoin-enter">
					<button><i className="icon-pay"></i>购物车结算</button>
				</div>
				
				<a href="">继续逛</a>
			</div>
		)
	}
}


export default CartJoin;