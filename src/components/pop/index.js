import React from 'react';
import {setPop} from '../../actions';
import Login from "../login";

class Pop extends React.Component {
	handleClose(){
		this.props.dispatch(setPop(false));
	}
	render(){
		var data = this.props.data;
		var content = '';
		switch(data){
			case 'login':
				content = <Login />;break;
			default:break;
		}
		if(data){
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