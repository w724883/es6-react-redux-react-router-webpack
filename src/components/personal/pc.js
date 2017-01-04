import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../common/layer/pc';
// import {Loading} from '../loading';

import * as Actions from '../../actions';
// import CartFixed from '../fixed/cartFixed';
// import TopFixed from '../fixed/topFixed';
import Nav from '../common/nav/pc';
import Footer from '../common/footer/pc';
import Config from '../../config';
import './pc.scss';
import "zepto";
class Personal extends React.Component {
	constructor(props){
		super();
		props.dispatch(Actions.setLoading(true));

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
	handleMyorder(){
		this.props.dispatch(Actions.setPop({
			show:'myorder'
		}));	
	}
	handleCoupon(){
		this.props.dispatch(Actions.setPop({
			show:'coupon'
		}));
	}
	handleAddress(){
		this.props.dispatch(Actions.setPop({
			show:'address'
		}));
	}
	handleMy(){
		this.props.dispatch(Actions.setPop({
			show:'my'
		}));
	}
	handleNotify(){
		this.props.dispatch(Actions.setPop({
			show:'notify'
		}));
	}
	handleForget(){
		this.props.dispatch(Actions.setPop({
			show:'forget'
		}));
	}
	shouldComponentUpdate(){
		return this.props.state.login;
	}
	componentWillMount(){
		let self = this;

		let dfdTasks = [this.getData.call(this)];
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
					<ul className="personal-items">
						<li>
							<Link to="/collection">
								<i className="icon-liked"></i>
								<span>我的收藏</span>
								<i className="icon-next personal-items-right"></i>
							</Link>
						</li>
						<li>
							<a href="javascript:;" onClick={this.handleMyorder.bind(this)}>
								<i className="icon-orders"></i>
								<span>我的订单</span>
								<i className="icon-next personal-items-right"></i>
							</a>
						</li>
						<li>
							<a href="javascript:;" onClick={this.handleCoupon.bind(this)}>
								<i className="icon-coupons"></i>
								<span>优惠券</span>
								<i className="icon-next personal-items-right"></i>
							</a>
						</li>
						<li>
							<a href="javascript:;" onClick={this.handleAddress.bind(this)}>
								<i className="icon-location"></i>
								<span>收货地址</span>
								<i className="icon-next personal-items-right"></i>
							</a>
						</li>
						<li>
							<a href="javascript:;" onClick={this.handleMy.bind(this)}>
								<i className="icon-account-info"></i>
								<span>个人资料</span>
								<i className="icon-next personal-items-right"></i>
							</a>
						</li>
						<li>
							<a href="javascript:;" onClick={this.handleNotify.bind(this)}>
								<i className="icon-messages"></i>
								<span>系统消息</span>
								<i className="icon-next personal-items-right"></i>
							</a>
						</li>
						<li>
							<a href="javascript:;" onClick={this.handleForget.bind(this)}>
								<i className="icon-password"></i>
								<span>修改密码</span>
								<i className="icon-next personal-items-right"></i>
							</a>
						</li>
						<li>
							<a href="javascript:;" onClick={this.handleLogout.bind(this)} className="main active">
								<i className="icon-logout"></i>
								<span>退出账号</span>
							</a>
						</li>
						
					</ul>
				</div>
				<Nav state={this.props.state} dispatch={this.props.dispatch} />
				<Footer />
			</div>
		)

	}
}
Personal = connect(state => ({state}))(Personal);
export default Personal;
