import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';
import * as Actions from '../../actions';
import Config from '../../config';
import Scroll from '../common/scroll/mobile';
import {TopFixed,BackFixed} from '../common/fixed/mobile';
import "zepto";
import "./mobile.scss";

class Notify extends React.Component {
	constructor(props){
		super();
		
		this.state = {
			data:[],
			page:1
		}
	}
	initMessageData(){
		let self = this;
		let dfd = new $.Deferred();
		$.ajax({
		  type: 'POST',
		  url: Config.api.mymessage,
		  data:{
		  	page:this.state.page
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
	  			self.setState({
	  				data:res.data.item,
	  				page:self.state.page+1
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
	getMessageData(){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.mymessage,
		  data:{
		  	page:this.state.page
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		let data = self.state.data;
	  			self.setState({
	  				data:data.concat(res.data.item),
	  				page:self.state.page+1
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
		    }else if(res.code == 400){
		  		self.setState({
		  			page:0
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
	handleScroll(){
		this.getMessageData();
	}
	getType(value){
		let title = '系统消息';
		switch(value){
			case '1':title = '积分奖励';break;
			case '2':title = '系统消息';break;
			case '3':title = '取消订单';break;
		}
		return title;
	}
	componentWillMount(){
		let self = this;
		let dfdTasks = [this.initMessageData.call(this)];
		self.props.dispatch(Actions.setLoading(true));
		$.when.apply(null,dfdTasks).done(function(){
			self.props.dispatch(Actions.setLoading(false));
		});

	}
	render(){

		return (
			<div className="notify">
				<TopFixed data="系统消息" />
				<ul className="notify-list">
					{
						this.state.data.length ? this.state.data.map((value,key) => (
							<li className="notify-item">
								<div className="notify-item-title">
									<p>{this.getType(value.type)}</p>
									{value.status > 0 ? <em style={{backgroundColor:'#CACACA'}}>已读</em> : <em style={{backgroundColor:'#C34765'}}>未读</em>}
									<span>{new Date(parseInt(value.addtime) * 1000).toLocaleString()}</span>
								</div>
								<div className="notify-item-desc">
									{value.contents}
								</div>
							</li>
						)) : <li style={{padding: '60px 0 0', textAlign: 'center', fontSize: '14px'}}>暂无消息</li>
					}
				</ul>
				<BackFixed>
					<Link to={Config.path.personal}><i className="icon-pre"></i></Link>
				</BackFixed>
				<Scroll page={this.state.page} handleScroll={this.handleScroll.bind(this)} />
			</div>
		)
	}
}
Notify = connect((state) => ({state}))(Notify);
export default Notify;
