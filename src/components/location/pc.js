import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../common/layer/mobile';
import Area from '../common/area/pc';
import * as Actions from '../../actions';
import Config from '../../config';
// import {BackFixed} from '../common/fixed/mobile';
import "zepto";
import "./pc.scss";
// console.log(browserHistory)
class Location extends React.Component {
	constructor(props){
		super(props);
		let data = this.props.data ? this.props.data : {};
		data.show = '';
		this.state = data;
	}
	getData(){
	    let self = this;
	    let dfd = $.Deferred();
	    $.ajax({
	      type: 'POST',
	      url: Config.api.get_region,
	      dataType: Config.dataType,
	      success: function(res){
	        if(res.code == 200){
	                self.region = res.data.region
	        }else{
	            self.props.dispatch(Actions.setMessage({
	                text:res.message
	            }));
	        }
	      },
	      complete: function(){
	        dfd.resolve();
	      },
	      error: function(xhr, type){
	        self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
	      }
	    });
	    return dfd.promise();
	}
	handleSubmit(){
		let self = this;
		let msg = '';
		if(!$.trim(this.state.username)){
			msg = '用户名不能为空';
		}else if(!$.trim(this.state.phone)){
			msg = '手机号不能为空';
		}else if(!/^1[34578]\d{9}$/.test(this.state.phone)){
			msg = '请输入正确手机号';
		}
		else if(!$.trim(this.state.region_info_message)){
			msg = '地区不能为空';
		}
		else if(!$.trim(this.state.address)){
			msg = '地址不能为空';
		}
		if(msg){
			this.props.dispatch(Actions.setMessage({
				text:msg
			}));
			return false;
		}
		let state = this.state;
		$.ajax({
		  type: 'POST',
		  url: Config.api.c_address,
		  data:{
		  	username:state.username,
		  	phone:state.phone,
		  	region_param:state.region_id,
		  	address:state.address,
		  	id:state.id
		  },
		  dataType: Config.dataType,
		  success: function(res){
		    if(res.code == 200){
	            self.props.dispatch(Actions.setMessage({
	                text:res.message
	            }));
		    	self.props.handleHide();
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
		// this.props.handleData(this.state);
		// this.props.handleClose();
	}
	handleChange(e){
		let name = e.target.name;
		let value = e.target.value;
		let data = this.state;
		data[name] = value;
		this.setState(data);
	}
	handleArea(data){
		let state = this.state;
		$.extend(state,data);
		this.setState(state);
	}
	componentWillMount(){
		let self = this;
		let dfdTasks = [this.getData()];
		// self.props.dispatch(Actions.setLoading(true));
		$.when.apply(null,dfdTasks).done(function(){
			// self.props.dispatch(Actions.setLoading(false));
		});

	}
	render(){
		return (
			<div className="location">
				<p className="location-title">添加收货地址<a href="javascript:;" onClick={this.props.handleClose} className="icon-close"></a></p>
				<ul className="location-list" onChange={this.handleChange.bind(this)}>
					<li>
						<div className="location-item">
							<label>收货人</label>
							<div className="location-input">
								<input placeholder="请填写" name="username" defaultValue={this.state.username ? this.state.username : ''} type="text" />
							</div>
						</div>
					</li>
					<li>
						<div className="location-item">
							<label>手机号</label>
							<div className="location-input">
								<input placeholder="请填写" name="phone" defaultValue={this.state.phone ? this.state.phone : ''} type="number" />
							</div>
						</div>
					</li>
					<li>
						<div className="location-item" onClick={this.handleArea.bind(this,{show:true})}>
							<label>区域选择</label>
							<div className="location-input">
								<input placeholder="请选择" name="region_info_message" value={this.state.region_info_message ? this.state.region_info_message : ''} type="text" readOnly="readOnly" />
							</div>
						</div>
					</li>
					<li>
						<div className="location-item">
							<label>详细地址</label>
							<div className="location-input">
								<input type="text" name="address" defaultValue={this.state.address ? this.state.address : ''} placeholder="请填写" />
							</div>
						</div>
					</li>
				</ul>
				<div className="location-add"><button onClick={this.handleSubmit.bind(this)}>{this.state.id ? "更新地址" : "确认添加"}</button></div>
				
				<CSSTransitionGroup
					component="div"
	              	transitionEnterTimeout={400}
	              	transitionLeaveTimeout={400}
	              	transitionName="transition-address">
						{this.state.show ? <Area dispatch={this.props.dispatch} handleArea={this.handleArea.bind(this)} /> : null}
				</CSSTransitionGroup>
			</div>
		)
	}
}
Location = connect((state) => ({state}))(Location);
export default Location;
