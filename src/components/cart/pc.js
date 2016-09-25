import React from 'react';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import CartFixed from './cartFixed';
import CartList from './cartList';
import CartOrder from './cartOrder';
import "zepto";
import "./index.scss";

class Cart extends React.Component {
	constructor(props){
		super(props);
	}
	// componentWillMount(){
	// 	let {dispatch} = this.props;
	// 	var dfdTasks = [];

	// 	$.when.apply(null,dfdTasks).done(function(){
	// 		dispatch(Actions.setLoading(false));
	// 	});
	// }
	render(){
		return (
			<div className="cart">
				<div className="cart-top">购物车</div>
				<CartList dispatch={this.props.dispatch} state={this.props.state.cart} />
				<CartFixed dispatch={this.props.dispatch} />
			</div>
		)
	}
}

Cart = connect(state => ({state}))(Cart);
export default Cart;