import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Layer from '../common/layer/mobile';
import Area from '../common/area/mobile';
import * as Actions from '../../actions';
import Config from '../../config';
import {TopFixed,BackFixed} from '../common/fixed/mobile';
import {getDate} from '../common';
import "zepto";
import "./mobile.scss";

class My extends React.Component {
	constructor(props){
		props.dispatch(Actions.setLoading(true));
		super();
		this.state = {
			username:'',
			// phone:{
			// 	status:0,
			// 	value:''
			// },
			sex:1,
			birthday:getDate(new Date()),
			region:'',
			address:'',
			constellation:'',
			phone:'',
			reg_time:'',
			// area:'',
			region_info_message:'',
			show:false
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
				let state = self.state;
				// self.region = res.data.region;
				state.username = res.data.username;
				// state.phone.value = res.data.phone;
				state.sex = res.data.sex;
				state.birthday = res.data.birthday;
				state.region = res.data.region;
				state.address = res.data.address;
				state.constellation = res.data.constellation;
				state.phone = res.data.phone;
				state.reg_time = res.data.reg_time;
				state.region_info_message = self.area ? self.getRegion(res.data.region) : '';


				self.setState(state);

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
	// handleEdit(key){
	// 	let state = this.state;
	// 	state[key].status = !state[key].status;
	// 	this.setState(state);
	// 	$(document.getElementsByName(key)).focus();
	// }
	handleChange(e){
		let name = e.target.name;
		let state = this.state;

		let value = e.target.value;
		state[name] = value;
		this.setState(state);
	}
	// handleBlur(e){
	// 	let name = e.target.name;
	// 	let state = this.state;
	// 	if(state[name]){
	// 		state[name].status = 0;
	// 		this.setState(state);
	// 	}
	// 	this.handleSubmit();

	// }
	handleArea(data){
		let state = this.state;
		$.extend(state,{
			region:data.region_id,
			show:data.show,
			region_info_message:data.region_info_message
		});
		this.setState(state);
	}
	getArea(){
		let self = this;
		$.ajax({
  	      type: 'POST',
  	      url: Config.api.get_region,
  	      dataType: Config.dataType,
  	      success: function(res){
  	        if(res.code == 200){
  	        	self.area = res.data.region;
  	        	let region_info_message = self.state.region ? self.getRegion(self.state.region) : '';
  	        	self.setState({
  	        		region_info_message
  	        	});
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
	getRegion(ids){
		try{
			ids = ids.split(',');
		}catch(e){
			return '';
		}
		
		let region = '';
		if(this.area && this.area.length){
			$.each(this.area,(key,value) => {
			    if(ids[0]){
			        if(value.id == ids[0]){
			        	region = value.region_name;
			            if(value.child && value.child.length){
			                $.each(value.child,(sk,sv) => {
			                    if(ids[1]){
			                        if(sv.id == ids[1]){
			                        	region = value.region_name+' '+sv.region_name;
			                            if(sv.child && sv.child.length){
			                                $.each(sv.child,(tk,tv) => {
			                                    if(ids[2]){
			                                        if(tv.id == ids[2]){
			                                        	region = value.region_name+' '+sv.region_name+' '+tv.region_name;
			                                            if(tv.child && tv.child.length){
			                                                $.each(tv.child,(nk,nv) => {
			                                                    if(ids[3]){
			                                                      if(nv.id == ids[3]){
			                                                        region = value.region_name+' '+sv.region_name+' '+tv.region_name+' '+nv.region_name;
			                                                        // return;
			                                                      }
			                                                    }
			                                                })
			                                            }
			                                        }
			                                    }
			                                })
			                            }
			                        }
			                    }
			                })
			            }
			        }
			    }

			});
		}
		return region;
	}
	handleSubmit(){
		let self = this;
		let state = this.state;
		// let params = {};
		// for(let key in state){
		// 	if(state[key].value != undefined){
		// 		params[key] = state[key].value;
		// 	}
		// }
		$.ajax({
		  type: 'POST',
		  url: Config.api.editmember,
		  data:state,
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				self.props.dispatch(Actions.setMessage({
					text:'修改成功'
				}));

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
		  }
		});
	}
	componentWillMount(){
		let self = this;
		let dfdTasks = [this.getData.call(this),this.getArea.call(this)];

		$.when.apply(null,dfdTasks).done(function(){
			// self.setState({
			// 	loading:false
			// })
			self.props.dispatch(Actions.setLoading(false));
		});

	}
	render(){
		let state = this.state;
		return (
			<div className="my">
				<TopFixed data="个人资料" />
				<ul className="my-list" onChange={this.handleChange.bind(this)}>
					<li>
						<div className="my-item">
							<label>姓 名</label>
							<div className="my-input">
								<input type="text" name="username" value={state.username} />
							</div>
						</div>
					</li>
					<li>
						<div className="my-item">
							<label>性 别</label>
							<div className="my-input">
								<select name="sex" value={state.sex}>
									<option value="1">男</option>
									<option value="0">女</option>
								</select>
							</div>
						</div>
					</li>
					<li>
						<div className="my-item">
							<label>生 日</label>
							<div className="my-input">
								<input type="date" name="birthday" value={state.birthday ? state.birthday : ''} />
							</div>
						</div>
					</li>
					<li>
						<div className="my-item">
							<label>地 区</label>
							<div className="my-input" onClick={this.handleArea.bind(this,{show:true})}>
								<a href="javascript:;">{state.region_info_message}</a>
							</div>
						</div>
					</li>
					<li>
						<div className="my-item">
							<label>地 址</label>
							<div className="my-input">
								<input type="text" name="address" value={state.address} />
							</div>
						</div>
					</li>
					
					<li>
						<div className="my-item">
							<label>星 座</label>
							<div className="my-input">
								<span>{state.constellation}</span>
							</div>
						</div>
					</li>
					<li>
						<div className="my-item">
							<label>手机号</label>
							<div className="my-input">
								<span>{state.phone}</span>
							</div>
						</div>
					</li>
					<li>
						<div className="my-item">
							<label>注册时间</label>
							<div className="my-input">
								<span>{state.reg_time}</span>
							</div>
						</div>
					</li>
				</ul>
				<BackFixed>
					<Link to={Config.path.personal}><i className="icon-pre"></i></Link>
                    <button className="my-submit" onClick={this.handleSubmit.bind(this)}>确认修改</button>
				</BackFixed>
				<CSSTransitionGroup
					component="div"
	              	transitionEnterTimeout={400}
	              	transitionLeaveTimeout={400}
	              	transitionName="transition-address">

						{state.show ? <Layer><Area data={this.area} dispatch={this.props.dispatch} handleArea={this.handleArea.bind(this)} /></Layer> : null}
				</CSSTransitionGroup>
			</div>
		)
	}
}
My = connect((state) => ({state}))(My);
export default My;
