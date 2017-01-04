import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';
import * as Actions from '../../actions';
import Config from '../../config';
import {CartFixed,TopFixed} from '../common/fixed/mobile';
import "zepto";
import "./mobile.scss";

class Cart extends React.Component {
	constructor(props){
		super();
		props.dispatch(Actions.setLoading(true));
		this.state = {
			show:{
				add:false
			}
		}
	}
	handleList(key,e){
		let $el = $(e.target);
		if($el.closest('.disable').length){
			return false;
		}

		let value = $el.prop('checked');
		let cart = this.props.state.cart;
		cart.list[key].checked = cart.list[key].num ? value : false;
		this.props.dispatch(Actions.setCart(cart));

	}
	handleAdd(key,e){
		let $el = $(e.target);
		if($el.closest('.disable').length){
			return false;
		}

		let value = $el.prop('checked');
		let cart = this.props.state.cart;
		cart.add[key].checked = cart.add[key].number ? value : false;
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
		let show = this.state.show;
		
		show.add = !show.add;
		this.setState({show});
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
	handleRemove(key,id){
		if(confirm('确定要删除这个商品吗？')){
			let self = this;
			let {dispatch} = this.props;
			$.ajax({
			  type: 'POST',
			  url: Config.api.d_shopping,
			  data:{cart_id:id},
			  dataType: Config.dataType,
			  success: function(res){
			  	if(res.code == 200){
			  		let cart = self.props.state.cart;
			  		cart.list.splice(key,1);
			  		dispatch(Actions.setCart(cart));
			  		dispatch(Actions.setMessage({
			  			text:'删除成功'
			  		}));

			  	}else if(res.code == 401){
			  		dispatch(Actions.setPop({
			  			show:'login',
			  			data:{
			  				success(){
			  					window.location.reload();
			  				},
			  				cancle(){
			  					browserHistory.push('/');
			  				}
			  			}
			  		}));
			  		dispatch(Actions.setMessage({
			  			text:res.message
			  		}));
			  	}else{
			  		dispatch(Actions.setMessage({
			  			text:res.message
			  		}));
			  	}
			  },
			  error: function(xhr, type){
			    dispatch(Actions.setMessage({
			    	text:Config.text.network
			    }));
			    // alert(JSON.stringify(xhr));
			    // alert(JSON.stringify(type));
			  }
			});
		}
	}
	handleNext(){
		if(($.fn.cookie('is_complete') == 1) && (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') && !!$.fn.cookie('user_id')){
			browserHistory.push('/complete');
			return false;
		}
		let cart = this.props.state.cart;
		let list = cart.list;

		for(let i of list){
			if(i.checked){
				let list_id = [];
				let add_id = [];
				let add = cart.add;

				let total = 0;
				let num = 0;
				for(let i of list){
					if(i.checked){
						if(i.number < 1){
							this.props.dispatch(Actions.setMessage({
								text:i.goods_name+' 库存不足'
							}));
							return false;
						}
						list_id.push({
							id:i.id,
							num:i.num,
							price:i.price
						});
						total += (i.price*i.num);
						num += (1*i.num);
					}
				}
				for(let i of add){
					if(i.checked){
						if(i.number < 1){
							this.props.dispatch(Actions.setMessage({
								text:i.title+' 库存不足'
							}));
							return false;
						}
						add_id.push({
							id:i.id,
							num:i.num,
							price:i.price
						});
						total += (i.price*i.num);
						num += (1*i.num);
					}
				}
				let order = this.props.state.order;
				order.cost.total = total;
				order.cost.num = num;
				order.cost.sale = total < 196 ? 0 : 20;
				this.props.dispatch(Actions.setOrder(order));
				browserHistory.push({pathname: '/order', state:{list_id:list_id,add_id:add_id}});

				return false;
			}
		}
		this.props.dispatch(Actions.setMessage({
			text:'请选择至少一种商品！'
		}));
	}
	mixinCartList(data){
		let cart = this.props.state.cart;
		for(let value of cart.list){
			if(value.goods_id == data.goods_id){
				return $.extend(data,value);
			}
		}
	}
	mixinCartAdd(data){
		let cart = this.props.state.cart;
		for(let value of cart.add){
			if(value.id == data.id){
				return $.extend(data,value);
			}
		}
	}
	getCartList(dispatch){
		let dfd = new $.Deferred();
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.cartlist,
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		if(res.data.cart_data.cart.length){
		  			let list = res.data.cart_data.cart;
		  			let add = res.data.goods_addition;
		  			let show = self.state.show;
		  			for(let i = 0; i < list.length; i++){
		  				let mixin = self.mixinCartList(list[i]);
		  				if(mixin){
		  					list[i] = mixin;
		  				}
		  			}
		  			for(let i = 0; i < add.length; i++){
		  				let mixin = self.mixinCartAdd(add[i]);
		  				if(mixin){
		  					add[i] = mixin;
		  				}
		  			}
		  			if(add.length){
		  				for(let value of add){
		  					if(value.checked){
		  						show.add = true;
		  						break;
		  					}
		  				}
		  			}
		  			// add[0].number=0;
		  			dispatch(Actions.setCart({
		  				list,
		  				add,
		  				show

		  			}));
		  		}else{
		  			dispatch(Actions.setCart({
		  				list:res.data.cart_data.cart,
		  				add:res.data.goods_addition
		  			}));
		  			dispatch(Actions.setMessage({
		  				text:'购物车是空的！'
		  			}));
		  			// browserHistory.push('/category');
		  		}

		  	}else if(res.code == 401){
		  		// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
		  		// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
		  		// 	return false;
		  		// }
		  		dispatch(Actions.setPop({
		  			show:'login',
		  			data:{
		  				success(){
		  					window.location.reload();
		  				},
		  				cancle(){
		  					browserHistory.push('/');
		  				}
		  			}
		  		}));
		  		dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}else{
		  		dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}
		  },
		  error: function(xhr, type){
		    dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  },
		  complete:function(){
		  	dfd.resolve();
		  }
		});
		return dfd.promise();
	}
	componentWillMount(){
		if(($.fn.cookie('is_complete') == 1) && (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') && !!$.fn.cookie('user_id')){
			browserHistory.push('/complete?from=cart');
			return false;
		}
		let self = this;
		let {dispatch} = this.props;
		let dfdTasks = [this.getCartList(dispatch)];
		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
			// self.setState({
			// 	loading:false
			// })
		});
	}
	// componentDidMount() {
	// 	$(this.refs.list).find('.j-remove').swipeLeft(function(){
	// 		console.log(1)
	// 		$(this).closest('li').addClass('remove');
	// 	});
	// }
	render(){
		let self = this;
		let listRender = null;
		let addsRender = null;
		let {list,add} = this.props.state.cart;
		let allList = true;


		if(list && list.length){
			for(let value of list){
				if(!value.checked){
					allList = false;
				}
			}

			listRender = list.map((value,key) => (
				<li key={key} className={value.number < 1 ? "disable" : ""}>
					<label className="vertical-middle">
						<div className="checkbox">
							<input type="checkbox"
							checked={value.checked ? "checked" : ""}
							onChange={self.handleList.bind(self,key)} />
							<span className="icon-check checked"></span>
						</div>
					</label>

					<Link to={"/details?id="+value.goods_id} className="cart-list-about j-remove">
						<div className="cart-list-head" style={{backgroundImage:"url("+(value.goods_cover ? value.goods_cover : "")+")"}}></div>
						<div className="cart-list-info">
							<p><span>{value.goods_name}</span><em className="price">{value.price}</em></p>

							<span>{value.attribute_item ? value.attribute_item : ""}</span><span>{value.num ? " x" + value.num : ""}</span>
						</div>
					</Link>
					<div className="vertical-middle cart-list-edit">
						<a onClick={self.handleModify.bind(self,{key:key,value:"list"})} href="javascript:;"><i className="icon-edit"></i></a>
						<a className="enable" onClick={self.handleRemove.bind(self,key,value.id)} href="javascript:;"><i className="icon-close"></i></a>
					</div>
				</li>
			))
		}
		if(add && add.length){
			addsRender = add.map((value,key) => (
				<li key={key} className={value.number < 1 ? "disable" : ""}>
					<label className="vertical-middle">
						<div className="checkbox">
							<input type="checkbox" onChange={self.handleAdd.bind(self,key)} checked={value.checked ? "checked" : ""} />
							<span className="icon-check checked"></span>
						</div>
					</label>
					<a href="javascript:;" className="cart-add-about">
						<div className="cart-add-head" style={{backgroundImage:"url("+(value.pic ? value.pic : "")+")"}}></div>
						<div className="cart-add-info">
							<p>{value.title}</p>
							<span>{value.price ? "价格：" : ""}</span><em>{value.price ? value.price : ""}</em><span>{value.num == undefined ? '' : "数量：" + value.num}</span>
						</div>
					</a>
					<a className="vertical-middle cart-add-edit" onClick={self.handleModify.bind(self,{key:key,value:"add"})} href="javascript:;"><i className="icon-edit"></i></a>
				</li>
			))
		}
		return (
			<div className="cart">
				<TopFixed data="购物车" />
				{
					list.length ? (
						<div>
							<ul className="cart-list">
								<li className="cart-list-header">
									<label className="vertical-middle">
										<div className="checkbox">
											<input type="checkbox" checked={allList ? "checked" : ""} onChange={this.handleListAll.bind(this)} />
											<span className="icon-check checked"></span>
										</div>
										<span>全选</span>
									</label>
									<span className="cart-list-tips">单笔消费满196元，运费立减20元</span>
								</li>
								{
									listRender
								}

							</ul>
							<ul className="cart-add">
								<li className="cart-add-header" onClick={this.handleModifyAdd.bind(this)}>
									<span>附加商品</span>
									生日蛋糕附送保温包及餐具，无需单独购买
									<a href="javascript:;"><i className="icon-add"></i></a>
								</li>
								{
									this.state.show.add ? addsRender : null
								}

							</ul>
						</div>
					) : <div style={{padding:'100px 0 0',textAlign:'center',fontSize:'14px'}}>购物车是空的,去 <Link to="/category">商品列表</Link> 看看吧</div>
				}

				<CartFixed state={this.props.state} dispatch={this.props.dispatch} data={{btn:"下一步"}} handleClick={this.handleNext.bind(this)} />
			</div>
		)
	}
}

Cart = connect(state => ({state}))(Cart);
export default Cart;
