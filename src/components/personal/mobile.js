import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';

import * as Actions from '../../actions';
// import CartFixed from '../fixed/cartFixed';
// import TopFixed from '../fixed/topFixed';
import Nav from '../common/nav/mobile';
import Config from '../../config';
import './mobile.scss';
import "zepto";
class Personal extends React.Component {
	constructor(props){
		super();
		

		this.state = {
			data:{
				username: "",
				phone: "",
				face: "",
				balance: 0,
				score: 0,
			}
		}
	}
	getData(){
		let self = this;
		let dfd = $.Deferred();
		$.ajax({
		  type: 'POST',
		  url: Config.api.my,
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				let data = self.state.data;
				data.username = res.data.username;
				data.phone = res.data.phone;
				data.face = res.data.face;
				data.balance = res.data.balance;
				data.score = res.data.score;

				self.setState({
					data
				});

				// self.props.dispatch(Actions.setMy({
				// 	username: res.data.username,
				// 	sex:res.data.sex,
				// 	birthday:res.data.birthday,
				// 	phone: res.data.phone,
				// 	reg_type:res.data.reg_type,
				// 	// address:res.data.address,
				// 	// passwd:res.data.passwd,
				// 	// pay_passwd:res.data.pay_passwd
				// }));
			}else if(res.code == 401){
				// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
				// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
				// 	return false;
				// }
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
		  },
		  complete: function(){
		  	dfd.resolve();
		  }
		});

		return dfd.promise();
	}
	handleLogout(){
		$.ajax({
		  type: 'POST',
		  url: Config.api.logout,
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				window.location.href = '/';
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
	shouldComponentUpdate(){
		return this.props.state.login;
	}
	componentWillMount(){
		let self = this;

		let dfdTasks = [this.getData.call(this)];
		self.props.dispatch(Actions.setLoading(true));
		$.when.apply(null,dfdTasks).done(function(){
			self.props.dispatch(Actions.setLoading(false));
			// self.setState({
			// 	loading:false
			// })
		});
	}
	// componentDidMount(){
	// 	let $personalList = $(this.refs.personalList);
	// 	let $body = $('body');
	// 	$(window).on('scroll',(e) => {
	// 		let scrollTop = $body.scrollTop() || $(document).scrollTop();
	// 		$personalList.css('transform','translate3d(0,-'+scrollTop*0.8+'px,0)');
	// 	});
	// }

	render(){
		let data = this.state.data;
		return (
			<div className="personal">
				<div className="personal-header">
					<div className="personal-head" style={{backgroundImage:"url("+(data.face ? data.face : "")+")"}}></div>
					<p className="personal-username">{data.username}</p>
					<div className="personal-head-line"></div>
				</div>

				<ul className="personal-account">
					<li>
						<i className="icon-balance"></i>
						<span>
							<strong>{data.balance}</strong>
							<br />
							账户余额
						</span>
					</li>
					<li className="personal-account-line"></li>
					<li>
						<i className="icon-userpoint"></i>
						<span>
							<strong>{data.score}</strong>
							<br />
							账户积分
						</span>
					</li>
				</ul>
				<div className="personal-list">
					<div className="personal-items">
						<Link to="/collection">
							<i className="icon-liked"></i>
							<span>我的收藏</span>
							<i className="icon-next personal-items-right"></i>
						</Link>
						<Link to={Config.path.myorder}>
							<i className="icon-orders"></i>
							<span>我的订单</span>
							<i className="icon-next personal-items-right"></i>
						</Link>
						<Link to={Config.path.coupon}>
							<i className="icon-coupons"></i>
							<span>优惠券</span>
							<i className="icon-next personal-items-right"></i>
						</Link>
						<Link to={Config.path.address}>
							<i className="icon-location"></i>
							<span>收货地址</span>
							<i className="icon-next personal-items-right"></i>
						</Link>
						<Link to={Config.path.my}>
							<i className="icon-account-info"></i>
							<span>个人资料</span>
							<i className="icon-next personal-items-right"></i>
						</Link>
						<Link to="/notify">
							<i className="icon-messages"></i>
							<span>系统消息</span>
							<i className="icon-next personal-items-right"></i>
						</Link>
						<Link to="/forget">
							<i className="icon-password"></i>
							<span>修改密码</span>
							<i className="icon-next personal-items-right"></i>
						</Link>
						<a href="javascript:;" onClick={this.handleLogout.bind(this)} className="active">
							<i className="icon-logout"></i>
							<span>退出账号</span>
						</a>
					</div>
				</div>
				<Nav state={this.props.state} dispatch={this.props.dispatch} />
			</div>
		)

	}
}
Personal = connect(state => ({state}))(Personal);
export default Personal;
