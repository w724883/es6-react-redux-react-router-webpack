import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';
import Swiper from 'swiper';
import * as Actions from '../../actions';
import Config from '../../config';
import {PopFixed} from '../common/fixed/pc';
import {getDate} from '../common';
import "zepto";
import "./pc.scss";

class Coupon extends React.Component {
	constructor(props){
		super();
		props.dispatch(Actions.setLoading(true));
		this.state = {
			data:[],
			type:1
		}
	}
	getData(e){
		let self = this;
		let type = e ? e.target.value : this.state.type;
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

		  		if(!self.swiper){
		  			self.swiper = new Swiper('.swiper-container', {
		  			    scrollbar: '.swiper-scrollbar',
		  			    direction: 'vertical',
		  			    slidesPerView: 'auto',
		  			    mousewheelControl: true,
		  			    freeMode: true
		  			});
		  		}else{
		  			self.swiper.updateContainerSize();
		  		}
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
		let dfdTasks = [this.getData()];
		$.when.apply(null,dfdTasks).done(function(){
			self.props.dispatch(Actions.setLoading(false));
		});

	}
	render(){
		return (
			<div className="pop" onTouchMove={this.props.handleTouchMove}>
			    <div className="pop-bg" onClick={this.props.handleClose} onWheel={this.props.handleWheel}></div>
			    <div className="pop-box coupon">
			    	<div className="swiper-container">
			    		<div className="swiper-wrapper">
							<ul className="swiper-slide coupon-list">
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
						</div>
						<div className="swiper-scrollbar"></div>
				    </div>
			        <PopFixed title="优惠券" handleSelect={this.getData.bind(this)} data={[{key:0,value:'全部优惠券'},{key:1,value:'未使用'},{key:2,value:'已使用'},{key:3,value:'已失效'}]} />
			        <a href="javascript:;" onClick={this.props.handleClose} className="icon-close pop-close"></a>
			    </div>
			    
			</div>
		)
	}
}
Coupon = connect((state) => ({state}))(Coupon);
export default Coupon;
