import React from 'react';
import {setPop} from '../../../actions';
import Login from "../login/pc";
import Register from "../../register/pc";
import Forget from "../../forget/pc";
import CartJoin from "./cartJoin";
import CartModify from "./cartModify";
// import CartAdd from "./cartAdd";
import Recommend from "./recommend";
import MyOrder from "../../myorder/pc";

import My from "../../my/pc";
import Coupon from "../../coupon/pc";
import Address from "../../address/pc";
import Notify from "../../notify/pc";
import "./pc.scss";
// import CartAdd from "./cartAdd";
class Pop extends React.Component {
	handleClose(d){
		this.props.dispatch(setPop({
			show:false
		}));
		let data = this.props.state.pop.data;
		if(data && data.cancle){
			data.cancle(d);
		}
	}
	handleTouchMove(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	handleWheel(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	render(){
		let {state,dispatch} = this.props;
		let show = state.pop.show;
		let content = null;
		switch(show){
			case 'login':
				content = <Login state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'register':
				content = <Register state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'forget':
				content = <Forget state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'recommend':
				content = <Recommend state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'myorder':
				content = <MyOrder state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			// case 'orderdetail':
			// 	content = <OrderDetail state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'coupon':
				content = <Coupon state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'address':
				content = <Address state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'my':
				content = <My state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'notify':
				content = <Notify state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'cartJoin':
				content = <CartJoin dispatch={dispatch} data={state.pop.data} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			case 'cartModify':
				content = <CartModify state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} handleWheel={this.handleWheel} />;break;
			// case 'cartAdd':
			// 	content = <CartAdd state={state} dispatch={dispatch} />;break;
			default:break;
		}
		if(show){
			return content;
		}else{
			return null;	
		}
		
	}
}


export default Pop;