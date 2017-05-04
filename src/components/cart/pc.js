import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';
import * as Actions from '../../actions';
import Config from '../../config';
import Nav from '../common/nav/pc';
import Num from '../common/number/pc';
import Order from '../order/pc';
import Pay from '../pay/pc';
import Footer from '../common/footer/pc';
import "zepto";
import "./pc.scss";

class Cart extends React.Component {
	constructor(props){
		super();
		
		this.state = {
			show:{
				add:false,
				order:null
			},
			pay:''
		}
	}
	handleList(key,e){
		if(this.state.pay){
			return false;
		}
		let $el = $(e.target);
		if($el.closest('.disable').length){
			return false;
		}
		// this.order = false;
		let value = $el.prop('checked');
		let cart = this.props.state.cart;
		cart.list[key].checked = cart.list[key].num ? value : false;
		// let show = this.state.show;
		// show.order = false;
		// this.setState({show});

		this.props.dispatch(Actions.setCart(cart));
		this.handleNext();
	}
	handleAdd(key,e){
		if(this.state.pay){
			return false;
		}
		let $el = $(e.target);
		if($el.closest('.disable').length){
			return false;
		}
		// let show = this.state.show;
		// show.order = false;
		// this.setState({show});

		let value = $el.prop('checked');
		let cart = this.props.state.cart;
		cart.add[key].checked = cart.add[key].number ? value : false;
		this.props.dispatch(Actions.setCart(cart));
		this.handleNext();
	}
	handleListAll(e){
		if(this.state.pay){
			return false;
		}
		let value = $(e.target).prop('checked');
		let cart = this.props.state.cart;
		let {list} = cart;
		// let show = this.state.show;
		// show.order = false;
		// this.setState({show});

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
		this.handleNext();
	}
	handleModifyAdd(){
		if(this.state.pay){
			return false;
		}
		let show = this.state.show;
		
		show.add = !show.add;
		this.setState({show});
	}
	// handleModify(data){
	// 	this.props.dispatch(Actions.setPop({
	// 		show:'cartModify',
	// 		data:{
	// 			key:data.key,
	// 			value:data.value
	// 		}
	// 	}));
	// }
	handleUpdateNum(id,num){
		let dispatch = this.props.dispatch;
		$.ajax({
		  type: 'POST',
		  url: Config.api.e_shopping,
		  data:{cart_id:id,goods_num:num},
		  dataType: Config.dataType,
		  success: function(res){
		    if(res.code != 200){
		    	console.log(res.message);
		    }
		  },
		  error: function(xhr, type){
		    dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
	}
	handleRemove(key,id){
		if(this.state.pay){
			return false;
		}
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
	handleNext(){
		let cart = this.props.state.cart;
		let list = cart.list;
		let show = this.state.show;
		this.cart_id = [];
		this.add_id = [];
		for(let i of list){
			if(i.checked){
				// let list_id = [];
				// let add_id = [];
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
						// list_id.push({
						// 	id:i.id,
						// 	num:i.num,
						// 	price:i.price
						// });
						this.cart_id.push(i.id);
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
						// add_id.push({
						// 	id:i.id,
						// 	num:i.num,
						// 	price:i.price
						// });
						let id = {};
						id[i.id] = i.num;
						this.add_id.push(id);
						total += (i.price*i.num);
						num += (1*i.num);
					}
				}
				let order = this.props.state.order;
				order.cost.total = total;
				order.cost.num = num;
				order.cost.sale = total < 196 ? 0 : 20;
				this.props.dispatch(Actions.setOrder(order));
				// browserHistory.push({pathname: '/order', state:{list_id:list_id,add_id:add_id}});
				
				this.getOrderData();
				return true;
			}
		}
		this.getOrderData();
		// this.props.dispatch(Actions.setMessage({
		// 	text:'请选择至少一种商品！'
		// }));
	}
	getOrderData(show){
		let self = this;
		this.state.order = null;
		if(this.cart_id.length){
			$.ajax({
			  type: 'POST',
			  url: Config.api.cart_next,
			  data:{
			  	cart_id:this.cart_id.join(',')
			  },
			  dataType: Config.dataType,
			  success: function(res){
			  	if(res.code == 200){
			  		self.setState({
			  			order: res.data
			  		});
			  	}else if(res.code == 401){
			  		self.props.dispatch(Actions.setPop({
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
			  		self.props.dispatch(Actions.setMessage({
			  			text:res.message
			  		}));
		  		}else{
			  		self.props.dispatch(Actions.setMessage({
			  			text:res.message
			  		}));
			  	}
			  },
			  error: function(xhr, type){
			    self.props.dispatch(Actions.setMessage({
			    	text:Config.text.network
			    }));
			  }
			});
		}
		
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
	handleNumber(key,type,value){
		if(this.state.pay){
			return false;
		}
		let cart = this.props.state.cart;
		cart[type][key].num = value;
		this.props.dispatch(Actions.setCart(cart));
		if(type == 'list'){
			this.handleUpdateNum(cart[type][key].id,value);
		}
	}
	handlePay(id){
		this.setState({
			pay:id,
			order:null
		});
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
	handleCreatOrder(cb){
		this.creatOrder = cb;
	}
	doCreatOrder(){
		this.creatOrder && this.creatOrder();
	}
	componentWillMount(){
		let self = this;
		let {dispatch} = this.props;
		let dfdTasks = [this.getCartList(dispatch)];
		dispatch(Actions.setLoading(true));
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

					<div className="cart-list-about j-remove">
						<Link to={"/details?id="+value.goods_id} className="cart-list-head" style={{backgroundImage:"url("+(value.goods_cover ? value.goods_cover : "")+")"}}></Link>
						<div className="cart-list-info">
							<Link to={"/details?id="+value.goods_id}>{value.goods_name}</Link >

							<span>{value.attribute_item ? value.attribute_item : ""}</span><span>{value.num ? " 数量：" + value.num : ""}</span>
							<Num min="1" value={value.num} handleChange={this.handleNumber.bind(this,key,'list')} />

						</div>
						<span className="price">{value.price}</span>
						<a className="cart-list-edit" onClick={self.handleRemove.bind(self,key,value.id)} href="javascript:;"><i className="icon-close"></i></a>
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
					<div className="cart-add-about">
						<div className="cart-add-head" style={{backgroundImage:"url("+(value.pic ? value.pic : "")+")"}}></div>
						<div className="cart-add-info">
							<p>{value.title}</p>
							<span>{value.num == undefined ? '' : "数量：" + value.num}</span>
							<Num min="1" value={value.num} handleChange={this.handleNumber.bind(this,key,'add')} />
						</div>
						<span className="price">{value.price}</span>
					</div>
				</li>
			))
		}
		return (
			<div className="cart">
				{
					list.length ? (
						<div className="cart-container">
							<div className="main">
								<div className={this.state.pay ? "cart-content disable" : "cart-content"}>
									<h2>购物车</h2>
									<ul className="cart-list">
										<li className="cart-list-header">
											<label className="vertical-middle">
												<div className="checkbox">
													<input type="checkbox" checked={allList ? "checked" : ""} onChange={this.handleListAll.bind(this)} />
													<span className="icon-check checked"></span>
												</div>
												<span>全选</span>
												<span className="cart-list-tips">消费196.00立减20.00运费</span>
											</label>
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
								<CSSTransitionGroup
									component="div"
									className="cart-table"
									transitionEnter={false}
					              	transitionLeaveTimeout={400}
					              	transitionName="transition-order">
										{this.state.order ? <div className="cart-order"><Order data={this.state.order} add={this.add_id} handleCreatOrder={this.handleCreatOrder.bind(this)} handlePay={this.handlePay.bind(this)} /><button onClick={this.doCreatOrder.bind(this)} className="order-submit">生成订单</button></div> : null}
										{this.state.pay ? <div className="cart-order"><Pay id={this.state.pay} /></div> : null}
								</CSSTransitionGroup>
							</div>
						</div>
					) : <div style={{padding:'300px 0',textAlign:'center',fontSize:'16px'}}>购物车是空的,去 <Link to="/category">商品列表</Link> 看看吧</div>
				}
				<Nav state={this.props.state} dispatch={this.props.dispatch} />
				<Footer />
			</div>
		)
	}
}

Cart = connect(state => ({state}))(Cart);
export default Cart;
