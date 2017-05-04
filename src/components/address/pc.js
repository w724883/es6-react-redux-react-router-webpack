import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer/mobile';
// import {Loading} from '../loading';
import Swiper from 'swiper';
import * as Actions from '../../actions';
import Config from '../../config';
import Location from '../location/pc';
// import Area from '../area/mobile';
import {PopFixed} from '../common/fixed/pc';
import "zepto";
import "./pc.scss";

class Address extends React.Component {
	constructor(props){
		super();
		
		this.state = {
			data:[],
			location:'',
			// area:''
		}
	}
	getData(){
		let self = this;
		let dfd = new $.Deferred();
		$.ajax({
		  type: 'POST',
		  url: Config.api.address,
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		self.setState({
		  			data:res.data.address_list
		  		});

		  		if(!self.swiper){
		  			self.swiper = new Swiper('.swiper-container', {
		  			    scrollbar: '.swiper-scrollbar',
		  			    direction: 'vertical',
		  			    slidesPerView: 'auto',
		  			    mousewheelControl: true,
		  			    freeMode: true
		  			});
		  		}
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
		  complete:function(){
		  	dfd.resolve();
		  }
		});
		return dfd.promise();
	}
	handleDefault(key,id,value){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.set_address,
		  data: {
		  	id:id,
		  	default_status:value
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		let data = self.state.data;
		  		for(let i of data){
		  			i.default = 0;
		  		}
		  		data[key].default = 1;
		  		self.setState({
		  			data
		  		});
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
		  }
		});

	}
	handleDelete(key,id){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.d_address,
		  data: {
		  	id:id
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		let data = self.state.data;
		  		data.splice(key,1);
		  		self.setState({
		  			data
		  		});
		  		self.props.dispatch(Actions.setMessage({
		  			text:res.message
		  		}));

		  		if(self.swiper){
		  			this.swiper.update(true);
		  		}
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
	handleEdit(key){
		this.setState({
			location:key
		});
	}
	showLocation(){
		this.setState({
			location:this.state.data.length
		});
	}
	hideLocation(){
		this.setState({
			location:''
		});
	}
	handleClose(){
		let data = this.state.data;
		let d = {};
		for(let i = 0; i < data.length; i++){
			if(Number(data[i].default)){
				d.username = data[i].username;
				d.phone = data[i].phone;
				break;
			}
		}
		this.props.handleClose(d);
		if(this.swiper){
			this.swiper.destroy();
		}
	}
	// handleModifyLocation(key,e){
	// 	e.preventDefault();
	// 	e.stopPropagation();
	// 	this.setState({
	// 		key:key + ''
	// 	});
	// 	return false;
	// }
	// handleClose(){
	// 	this.setState({
	// 		key:''
	// 	});
	// }
	// handleData(value){
	// 	if(value){
	// 		let key = this.state.key;
	// 		let data = this.state.data;
	// 		data[key] = value;
	// 		this.setState({
	// 			data
	// 		});
	// 	}

	// }
	// handleArea(area,value){
	// 	let data = this.state.data;
	// 	if(data[this.state.key]){
	// 		data[this.state.key].region_info_message = value;
	// 	}

	// 	this.setState({
	// 		area,
	// 		data
	// 	});
	// }
	componentWillMount(){
		let self = this;
		let dfdTasks = [this.getData()];
		self.props.dispatch(Actions.setLoading(true));
		$.when.apply(null,dfdTasks).done(function(){
			self.props.dispatch(Actions.setLoading(false));
		});

	}
	render(){
		// let params = this.state.data[this.state.key] ? this.state.data[this.state.key] : {
		// 	username:"",
		// 	phone:"",
		// 	region_info_message:"",
		// 	address:""
		// };
		// let location = this.props.location;
		return (
			<div className="pop" onTouchMove={this.props.handleTouchMove}>
			    <div className="pop-bg" onClick={this.handleClose.bind(this)} onWheel={this.props.handleWheel}></div>
			    <div className="pop-box address">
					<div className="swiper-container">
						<div className="swiper-wrapper">
							<ul className="swiper-slide address-list">
								{
									this.state.data.length ? this.state.data.map((value,key) => (
										<li key={key} className={Number(value.default) ? 'active' : ''}>
											<div className="address-item">
												<div className="address-username" onClick={this.handleDefault.bind(this,key,value.id,value.default)}>{value.username}</div>
												<div className="address-phone">{value.phone}</div>
												<div className="address-location" onClick={this.handleDefault.bind(this,key,value.id,value.default)}>{value.region_info_message} {value.address}</div>
												<a href="javascript:;" onClick={this.handleDelete.bind(this,key,value.id)} className="icon-close"></a>
												<a href="javascript:;" onClick={this.handleEdit.bind(this,key)} className="icon-edit"></a>
											</div>
										</li>
									)) : null
								}
							</ul>
							<div className="swiper-scrollbar"></div>
						</div>
					</div>
					{
						this.state.location !== '' ? (
							<div className="pop-location">
								<Location handleClose={this.hideLocation.bind(this)} handleHide={this.props.handleClose} data={this.state.data[this.state.location]} />
							</div>
						) : null
					}
					
			        <PopFixed title="收货地址" data={<a onClick={this.showLocation.bind(this)} href="javascript:;">添加<i className="icon-add"></i></a>} />
			        <a href="javascript:;" onClick={this.handleClose.bind(this)} className="icon-close pop-close"></a>
			    </div>
			</div>
		)
	}
}
Address = connect((state) => ({state}))(Address);
export default Address;
