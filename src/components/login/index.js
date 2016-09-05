import React from 'react';

import "./index.scss";

class Login extends React.Component {
	render(){
		return (
			<div className="login">
				<div className="login-header">
					<div className="icon-account login-head"></div>
					<p>登录账号</p>
					<span>若忘记密码请短信找回</span>
				</div>
				<ul className="login-box">
					<li>
						<label>手机号</label>
						<input type="number" placeholder="输入注册时的手机号" />
					</li>
					<li>
						<label>密&nbsp;&nbsp;&nbsp;&nbsp;码</label>
						<input type="password" placeholder="输入注册时的密码" />
					</li>
				</ul>
				<div className="login-footer">
					<button className="login-enter">登录卷时</button>
					<p>
						<a href="javascript:;">注册账号</a>
						<a href="javascript:;">忘记密码</a>
					</p>
					
				</div>
			</div>
		)
	}
}


export default Login;