import React from 'react';
import { browserHistory } from 'react-router';
import {setPop} from '../../../actions';
class CartJoin extends React.Component {
	handleCancel(){
		browserHistory.goBack();
		this.props.dispatch(setPop({
			show:false
		}));
	}
	handleToCart(){
		browserHistory.push('/cart');
		this.props.dispatch(setPop({
			show:false
		}));
	}
	render(){
		return (
			<div className="pop" onTouchMove={this.props.handleTouchMove}>
				<div className="pop-bg" onClick={this.props.handleClose}></div>
				<div className="pop-box">
					<div className="cartJoin">
						<div className="cartJoin-head" style={{backgroundImage:"url("+(this.props.data ? this.props.data.goods_imgs[0] : "")+")"}}></div>
						<div className="cartJoin-title">
							<p>您选择的商品已经加入购物车</p>
						</div>
						
						<div className="cartJoin-enter">
							<a className="pop-confirm" onClick={this.handleToCart.bind(this)} href="javascript:;"><i className="icon-pay"></i>购物车结算</a>
						</div>
						
						<a onClick={this.handleCancel.bind(this)} className="pop-cancle" href="javascript:;">继续逛</a>
						
					</div>
					<a href="javascript:;" onClick={this.props.handleClose} className="icon-close pop-close"></a>
				</div>
			</div>
			
			
		)
	}
}


export default CartJoin;