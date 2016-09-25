import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Layer from '../layer';
import {Loading} from '../loading';
import * as Actions from '../../actions';
import Config from '../../config';
import CartFixed from '../fixed/cartFixed';
import TopFixed from '../fixed/topFixed';
import "zepto";
import "./mobile.scss";

class Cart extends React.Component {
	constructor(){
		super();
		this.state = {
			loading:true
		}
	}
	handleList(key,e){
		let value = $(e.target).prop('checked');
		let cart = this.props.state.cart;
		cart.list[key].checked = cart.list[key].num ? value : false;
		this.props.dispatch(Actions.setCart(cart));
		
	}
	handleAdd(key,e){
		let value = $(e.target).prop('checked');
		let cart = this.props.state.cart;
		cart.add[key].checked = cart.add[key].num ? value : false;
		// this.setState(cart);
		this.props.dispatch(Actions.setCart(cart));
		
	}
	handleListAll(e){
		let value = $(e.target).prop('checked');
		let cart = this.props.state.cart;
		let {list} = cart;
		for(let i = 0; i < list.length; i++){
			if(value){
				if(!list[i].checked && list[i].num){
					list[i].checked = true;
				}
			}else{
				if(list[i].checked && list[i].num){
					list[i].checked = false;
				}
			}
		}
		this.props.dispatch(Actions.setCart(cart));
	}
	handleModifyAdd(){
		this.props.dispatch(Actions.setPop({
			show:'cartAdd'
		}));
	}
	handleModify(data){
		this.props.dispatch(Actions.setPop({
			show:'cartModify',
			data:{
				key:data.key,
				value:data.value
			}
		}));
	}
	getCartList(dispatch){
		let dfd = new $.Deferred();
		let self = this;
		$.get(Config.api.cartlist,function(res){
			if(res.code == 200){
				// self.setState(res.data);
				dispatch(Actions.setCart(res.data));
			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error);
		}).always(function(){
			dfd.resolve();
		});
		return dfd.promise();
	}
	componentWillMount(){
		let self = this;
		let {dispatch} = this.props;
		var dfdTasks = [];
		dfdTasks.push(this.getCartList(dispatch))
		$.when.apply(null,dfdTasks).done(function(){
			// dispatch(Actions.setLoading(false));
			self.setState({
				loading:false
			})
		});
	}
	render(){
		let self = this;
		let listRender = null;
		let addsRender = null;
		let {list,add} = this.props.state.cart;
		let allList = true;
		for(let value of list){
			if(!value.checked){
				allList = false;
			}
		}
		if(list && list.length){
			listRender = list.map((value,key) => (
								<li key={key}>
									<label className="vertical-middle">
										<div className="checkbox">
											<input type="checkbox"
											checked={value.checked ? "checked" : ""}
											onChange={self.handleList.bind(self,key)} />
											<span className="icon-check checked"></span>
										</div>
									</label>
									
									<a href="" className="cart-list-about">
										<div className="cart-list-head"></div>
										<div className="cart-list-info">
											<p>草莓戚风蛋糕</p>

											<span>{value.flavor ? "口味：" : ""}</span><em>{value.flavor ? value.flavor : ""}</em><span>{value.size ? "规格：" : ""}</span><em>{value.size ? value.size : ""}</em><span>{value.num ? "数量：" : ""}</span><em>{value.num}</em>
										</div>
									</a>
									<a className="vertical-middle cart-list-edit" onClick={self.handleModify.bind(self,{key:key,value:"list"})} href="javascript:;"><i className="icon-edit"></i></a>
								</li>
							))
		}
		if(add && add.length){
			addsRender = add.map((value,key) => (
							<li key={key}>
								<label className="vertical-middle">
									<div className="checkbox">
										<input type="checkbox" onChange={self.handleAdd.bind(self,key)} checked={value.checked ? "checked" : ""} />
										<span className="icon-check checked"></span>
									</div>
								</label>
								<a href="" className="cart-add-about">
									<div className="cart-add-head"></div>
									<div className="cart-add-info">
										<p>草莓戚风蛋糕</p>
										<span>{value.flavor ? "口味：" : ""}</span><em>{value.flavor ? value.flavor : ""}</em><span>{value.size ? "规格：" : ""}</span><em>{value.size ? value.size : ""}</em><span>{value.num ? "数量：" : ""}</span><em>{value.num}</em>
									</div>
								</a>
								<a className="vertical-middle cart-add-edit" onClick={self.handleModify.bind(self,{key:key,value:"add"})} href="javascript:;"><i className="icon-edit"></i></a>
							</li>
						))
		}
		return (
			<div className="cart">
				<TopFixed data="购物车" />
				<ul className="cart-list">
					<li className="cart-list-header">
						<label className="vertical-middle">
							<div className="checkbox">
								<input type="checkbox" checked={allList ? "checked" : ""} onChange={this.handleListAll.bind(this)} />
								<span className="icon-check checked"></span>
							</div>
							<span>全选</span>
						</label>
						<span className="cart-list-tips">消费196.00立减20.00运费</span>
					</li>
					{
						listRender
					}
					
				</ul>
				<ul className="cart-add">
					<li className="cart-add-header">
						<span>选购附加产品</span>
						可选保温袋、餐具等
						<a href="javascript:;" onClick={this.handleModifyAdd.bind(this)}><i className="icon-add"></i></a>
					</li>
					{
						addsRender
					}
					
				</ul>
				<CartFixed data={{btn:"下一步",link:"/order"}} />
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

Cart = connect(state => ({state}))(Cart);
export default Cart;