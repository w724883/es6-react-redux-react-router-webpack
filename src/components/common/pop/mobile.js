import React from 'react';
import {setPop} from '../../../actions';
import Login from "../login/mobile";
import CartJoin from "./cartJoin";
import CartModify from "./cartModify";
import Recommend from "./recommend";
// import CartAdd from "./cartAdd";
import "./mobile.scss";
class Pop extends React.Component {
	handleClose(){
		this.props.dispatch(setPop({
			show:false
		}));
		let data = this.props.state.pop.data;
		if(data && data.cancle){
			data.cancle();
		}
	}
	handleTouchMove(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	render(){
		let {state,dispatch} = this.props;
		let show = state.pop.show;
		var content = "";
		switch(show){
			case 'login':
				content = <Login state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} />;break;
			case 'recommend':
				content = <Recommend state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} />;break;
			case 'cartJoin':
				content = <CartJoin dispatch={dispatch} data={state.pop.data} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} />;break;
			case 'cartModify':
				content = <CartModify state={state} dispatch={dispatch} handleClose={this.handleClose.bind(this)} handleTouchMove={this.handleTouchMove} />;break;
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