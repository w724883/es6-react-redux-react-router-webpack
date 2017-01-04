import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer/mobile';
// import {Loading} from '../loading';
import * as Actions from '../../actions';
import Config from '../../config';
// import Location from '../location/mobile';
// import Area from '../area/mobile';
import {TopFixed,BackFixed} from '../common/fixed/mobile';
import "zepto";
import "./mobile.scss";

class Address extends React.Component {
	constructor(props){
		super();
		props.dispatch(Actions.setLoading(true));
		this.state = {
			data:[],
			// key:'',
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
	handleAddLocation(){
		browserHistory.push('/location');
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

		$.when.apply(null,dfdTasks).done(function(){
			self.props.dispatch(Actions.setLoading(false));
		});

	}
	render(){
		let params = this.state.data[this.state.key] ? this.state.data[this.state.key] : {
			username:"",
			phone:"",
			region_info_message:"",
			address:""
		};
		let location = this.props.location;
		return (
			<div className="address">
				<TopFixed data="收货地址" />
				<ul className="address-list">
					{
						this.state.data.length ? this.state.data.map((value,key) => (
							<li className={Number(value.default) ? 'active' : ''}>
								<div className="address-item">
									<div className="address-username" onClick={this.handleDefault.bind(this,key,value.id,value.default)}>{value.username}</div>
									<div className="address-phone">{value.phone}</div>
									<div className="address-location" onClick={this.handleDefault.bind(this,key,value.id,value.default)}>{value.region_info_message} {value.address}</div>
									<a href="javascript:;" onClick={this.handleDelete.bind(this,key,value.id)} className="icon-close"></a>
									<Link to="/location" query={this.state.data[key]} className="icon-edit"></Link>
								</div>
							</li>
						)) : null
					}
				</ul>
				<BackFixed>
				    <Link to={location.state ? {pathname:location.state.from,state:location.state.data} : Config.path.personal}><i className="icon-pre"></i></Link>
				    <button className="address-add" onClick={this.handleAddLocation.bind(this)}>新增地址</button>
				</BackFixed>

			</div>
		)
	}
}
	// onClick={this.handleModifyLocation.bind(this,key)}

	// <CSSTransitionGroup
	// 	component="div"
    //            	transitionEnterTimeout={400}
    //            	transitionLeaveTimeout={400}
    //            	transitionName="transition-address">

	// 		{this.state.area ? <Layer><Area dispatch={this.props.dispatch} handleArea={this.handleArea.bind(this)} /></Layer> : null}
	// </CSSTransitionGroup>
	// {this.state.key ? <Layer><Location dispatch={this.props.dispatch} data={params} handleData={this.handleData.bind(this)} handleClose={this.handleClose.bind(this)} handleArea={this.handleArea.bind(this)} /></Layer> : null}
Address = connect((state) => ({state}))(Address);
export default Address;
