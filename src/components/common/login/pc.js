import React from 'react';
import { Link,browserHistory } from 'react-router';
import Config from '../../../config';
import * as Actions from '../../../actions';
import "./pc.scss";

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			phone:'',
			passwd:''
		}
	}
	handleForm(e){
		let target = e.target;
		let state = this.state;
		state[target.name] = target.value;
		this.setState(state);
	}
	handleLogin(){
		let {state,dispatch} = this.props;
		if(!/^1[34578]\d{9}$/.test(this.state.phone)){
			dispatch(Actions.setMessage({
				text:'请输入正确手机号！'
			}));
			return false;
		}
		$.ajax({
		  type: 'POST',
		  url: Config.api.login,
		  data:this.state,
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		let data = state.pop.data;
		  		if(data){
		  			data.success ? data.success() : window.location.reload();
		  		}else{
		  			window.location.reload();
		  		}

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
		  }
		});
	}
	handleForget(){
		this.props.dispatch(Actions.setPop({
		    show:'forget'
		}));
	}
	handleRegister(){
		this.props.dispatch(Actions.setPop({
		    show:'register',
		    data:{
		        success(){
		            window.location.href = '/personal';
		        }
		    }
		}));
	}
	render(){
		return (
			<div className="pop" onTouchMove={this.props.handleTouchMove}>
				<div className="pop-bg" onClick={this.props.handleClose} onWheel={this.props.handleWheel}></div>
				<div className="pop-box">
					<div className="login">
						<div className="login-header">
							<div className="login-head"><i className="icon-account"></i></div>
							<p>登录账号</p>
						</div>
						<ul className="login-box" onChange={this.handleForm.bind(this)}>
							<li>
								<input type="number" defaultValue={this.state.phone} name="phone" placeholder="手机号" />
							</li>
							<li>
								<input type="password" defaultValue={this.state.passwd} name="passwd" placeholder="密码" />
							</li>
						</ul>
						<div className="login-footer">
							<button className="login-enter" onClick={this.handleLogin.bind(this)}>&nbsp;&nbsp;&nbsp;登&nbsp;录&nbsp;&nbsp;&nbsp;</button>
							<p>
								<a href="javascript:;" onClick={this.handleRegister.bind(this)}>注册账号</a>
								<a href="javascript:;" onClick={this.handleForget.bind(this)}>忘记密码</a>
							</p>

						</div>
					</div>
					<a href="javascript:;" onClick={this.props.handleClose} className="icon-close pop-close"></a>
				</div>
			</div>
		)
	}
}


export default Login;
