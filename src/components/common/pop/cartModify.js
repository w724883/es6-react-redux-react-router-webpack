import React from 'react';
import Num from '../number/mobile';
import 'zepto';
import Config from '../../../config';
import * as Actions from '../../../actions';
class CartModify extends React.Component {
	constructor(props){
		super(props);
		let data = props.state.pop.data;
		let cart = props.state.cart;
		this.state = {
			num:cart[data.value][data.key].num
		}

	}
	handleUpdate(){
		let state = this.props.state;
		let dispatch = this.props.dispatch;
		let data = state.pop.data;
		let cart = state.cart;
		let goods = cart[data.value][data.key];
		goods.checked = this.state.num ? true : false;			
		goods.num = this.state.num;
		if(data.value == 'list'){
			$.ajax({
			  type: 'POST',
			  url: Config.api.e_shopping,
			  data:{cart_id:goods.id,goods_num:goods.num},
			  dataType: Config.dataType,
			  success: function(res){
			    if(res.code == 200){
			        dispatch(Actions.setCart(cart));
			    }
		        dispatch(Actions.setMessage({
		            text:res.message
		        }));

			  },
			  error: function(xhr, type){
			    dispatch(Actions.setMessage({
			    	text:Config.text.network
			    }));
			  }
			});
		}else{
			dispatch(Actions.setCart(cart));
		}
		
		
		dispatch(Actions.setPop({
			show:false
		}));
	}
	handleChange(num){
		this.setState({
			num:num
		})
	}
	// handleCancel(){
	// 	this.props.dispatch(Actions.setPop({
	// 		show:false
	// 	}));
	// }
	render(){
		let data = this.props.state.pop.data;
		let cart = this.props.state.cart;
		let goods = cart[data.value][data.key];
		return (
			<div className="pop" onTouchMove={this.props.handleTouchMove}>
				<div className="pop-bg" onClick={this.props.handleClose}></div>
				<div className="pop-box">
					<div className="cartModify">
						<div className="cartModify-head"><i className="icon-edit"></i></div>
						<div className="cartModify-title">
							<p>修改商品</p>
							<span>已选口味、规格无法修改</span>
						</div>
						
						<ul>
							<li>
								<div className="cartModify-list-head" style={{backgroundImage:"url("+(goods.goods_cover || goods.pic)+")"}}></div>
								<div className="cartModify-list-info">
									<p>{goods.goods_name || goods.title}</p>
									<span>{goods.attribute_item}</span><span>{this.state.num ? " x" + this.state.num : ""}</span>
								</div>
								<div className="vertical-middle cartModify-list-edit">
									<Num min="1" value={this.state.num} handleChange={this.handleChange.bind(this)} />
								</div>
							</li>
						</ul>
						<div className="cartModify-enter">
							<a className="pop-confirm" href="javascript:;" onClick={this.handleUpdate.bind(this)}><i className="icon-update"></i>保存修改</a>
						</div>
						<a href="javascript:;" onClick={this.props.handleClose} className="pop-cancle">放弃修改</a>
					</div>
					<a href="javascript:;" onClick={this.props.handleClose} className="icon-close pop-close"></a>
				</div>
			</div>
		)
	}
}


export default CartModify;