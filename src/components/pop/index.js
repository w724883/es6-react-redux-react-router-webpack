import React from 'react';
import {setPop} from '../../actions';
import Login from "../login/mobile";
import CartJoin from "./cartJoin";
import CartModify from "./cartModify";
import CartAdd from "./cartAdd";
import "./mobile.scss"
class Pop extends React.Component {
	handleClose(){
		this.props.dispatch(setPop({
			show:false
		}));
	}
	render(){
		let state = this.props.state;
		let show = state.pop.show;
		var content = "";
		switch(show){
			case 'login':
				content = <Login />;break;
			case 'cartJoin':
				content = <CartJoin />;break;
			case 'cartModify':
				content = <CartModify state={state} dispatch={this.props.dispatch} />;break;
			case 'cartAdd':
				content = <CartAdd state={state} dispatch={this.props.dispatch} />;break;
			default:break;
		}
		if(show){
			return (
				<div className="pop">
					<div className="pop-bg" onClick={this.handleClose.bind(this)}></div>
					<div className="pop-box">
						{content}
						<a href="javascript:;" onClick={this.handleClose.bind(this)} className="icon-close pop-close"></a>
					</div>
				</div>
			)
		}else{
			return null;	
		}
		
	}
}


export default Pop;