import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';
import * as Actions from '../../actions';
import Config from '../../config';
import {TopFixed,BackFixed} from '../common/fixed/mobile';
import {getDate} from '../common';
import "zepto";
import "./mobile.scss";

class Coupon extends React.Component {
	constructor(props){
		super();
		props.dispatch(Actions.setLoading(true));
		this.state = {
			data:[],
			type:1
		}
	}
	getData(type){
		let self = this;
		let dfd = $.Deferred();
		$.ajax({
		  type: 'POST',
		  url: Config.api.coupon,
		  data:{type:type},
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		self.setState({
		  			data:res.data,
		  			type:type
		  		});

		  	}else if(res.code == 401){
		  		// if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
		  		// 	browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
		  		// 	return false;
		  		// }
		  		// dispatch(Actions.setLogin(false));
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
		  },
		  complete:function(){
		  	dfd.resolve();
		  }
		});
		return dfd.promise();
	}
	componentWillMount(){
		let self = this;
		let dfdTasks = [this.getData(this.state.type)];
		$.when.apply(null,dfdTasks).done(function(){
			self.props.dispatch(Actions.setLoading(false));
		});

	}
	render(){
		return (
			<div className="coupon">
				<TopFixed data="优惠券" />
				<ul className="coupon-list">
					{
						this.state.data.length ? this.state.data.map((value,key) => (
							<li key={key} className="order-coupon-list">
								<div className="order-coupon-about" style={{backgroundColor:value.voucher.color}}>
									<strong>{value.voucher.title}</strong><span style={{color:value.voucher.color}}>{value.voucher.title_tag}</span>
									<p>{getDate(new Date(parseInt(value.voucher.start_time) * 1000))} ~ {getDate(new Date(parseInt(value.voucher.end_time) * 1000))}</p>
								</div>
								<div className="order-coupon-info">
									<p>{(value.voucher.type == 2 && !parseInt(value.voucher.price)) ? '免运费' : '¥ '+value.voucher.price}</p>
									<span style={{color:value.voucher.color}}>满¥ {value.voucher.satisfy ? value.voucher.satisfy : 0}可用</span>
								</div>
							</li>
						)) : null
					}
				</ul>
				<BackFixed>
					<Link to={Config.path.personal}><i className="icon-pre"></i></Link>
					<ul className="personal-nav">
						<li onClick={this.getData.bind(this,0)} className={this.state.type == 0 ? "active" : ""}>全部优惠券</li>
						<li onClick={this.getData.bind(this,1)} className={this.state.type == 1 ? "active" : ""}>未使用</li>
						<li onClick={this.getData.bind(this,2)} className={this.state.type == 2 ? "active" : ""}>已使用</li>
						<li onClick={this.getData.bind(this,3)} className={this.state.type == 3 ? "active" : ""}>已失效</li>
					</ul>
				</BackFixed>
			</div>
		)
	}
}
Coupon = connect((state) => ({state}))(Coupon);
export default Coupon;
