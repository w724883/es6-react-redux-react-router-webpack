import React from 'react';
import { Link,browserHistory } from 'react-router';
import Config from '../../../config';
import * as Actions from '../../../actions';
import "./mobile.scss";

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
		browserHistory.push('/forget');
		this.props.dispatch(Actions.setPop({
		    show:false
		}));
	}
	handleRegister(){
		browserHistory.push('/register');
		this.props.dispatch(Actions.setPop({
		    show:false
		}));
	}
	render(){
		return (
			<div className="pop" onTouchMove={this.props.handleTouchMove}>
				<div className="pop-bg" onClick={this.props.handleClose}></div>
				<div className="pop-box">
					<div className="login">
						<div className="login-header">
							<div className="login-head"><i className="icon-account"></i></div>
							<p>登录账号</p>
							<span>若忘记密码请短信找回</span>
						</div>
						<ul className="login-box" onChange={this.handleForm.bind(this)}>
							<li>
								<label>手机号</label>
								<input type="number" defaultValue={this.state.phone} name="phone" placeholder="输入手机号" />
							</li>
							<li>
								<label>密&nbsp;&nbsp;&nbsp;&nbsp;码</label>
								<input type="password" defaultValue={this.state.passwd} name="passwd" placeholder="输入密码" />
							</li>
						</ul>
						<div className="login-footer">
							<button className="login-enter" onClick={this.handleLogin.bind(this)}>登录卷时</button>
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
