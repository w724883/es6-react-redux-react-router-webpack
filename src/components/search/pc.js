import React,{Component} from 'react';
import { connect } from 'react-redux';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';
// import Swiper from 'swiper';
import { Link,browserHistory } from 'react-router';
import * as Actions from '../../actions';
import {Waiting} from '../common/loading/pc';
import Config from '../../config';
import Nav from '../common/nav/pc';
import Footer from '../common/footer/pc';
import 'zepto';
import "./pc.scss";



class Category extends Component{
	constructor(props){
		super(props);
		props.dispatch(Actions.setLoading(false));
		this.state = {
			data:[],
		}
	}
	getInitData(){
		let self = this;
		// let dfd = $.Deferred();
		$.ajax({
		  type: 'POST',
		  url: Config.api.search,
		  data:{keyword:this.props.location.query.keyword},
		  dataType: Config.dataType,
	      success: function(res){
	    	if(res.code == 200){
	    		self.setState({
	    			data:res.data
	    		});

	  	    }else{
  			 	self.props.dispatch(Actions.setMessage({
  					text:res.message
  				}));	  	    }
	      },
	      error: function(xhr, type){
	       	self.props.dispatch(Actions.setMessage({
	      		text:Config.text.network
	      	}));
	      },
		  // complete: function(){
		  // 	dfd.resolve();
		  // }
		});
		// return dfd.promise();
	}
	handleLike(id,key){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.clicklike,
		  data: {goods_id:id},
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				let data = self.state.data;
				data[key].is_like = !data[key].is_like;
				self.setState({
					data
				});
				if(data[key].is_like){
					self.props.dispatch(Actions.setMessage({
						text:'已收藏'
					}));
				}else{
					self.props.dispatch(Actions.setMessage({
						text:'已取消收藏'
					}));
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
		this.getInitData();
		// let self = this;
		// let dfdTasks = [this.getInitData()];
		//
		// $.when.apply(null,dfdTasks).done(function(){
		// 	self.props.dispatch(Actions.setLoading(false));
		// 	// self.setState({
		// 	// 	loading:false
		// 	// })
		// });

	}

	render(){
		let data = <div dangerouslySetInnerHTML={{__html:Waiting}}></div>;
		if($.isArray(this.state.data) && this.state.data.length){
			data = this.state.data.map((value,key) => (
				<li key={key}>
					<div className="mobile-item">
						<div className="mobile-img">
						<a href={"/details?id="+value.id} style={{backgroundImage:"url("+value.goods_cover+")"}}></a>
						{value.activty_message ? <span className="mobile-tag">{value.activty_message}</span> : null}
						</div>
						<div className="mobile-about">
							<p>{value.goods_name}</p>
							<span className="price">{value.price}</span>
							<a href="javascript:;" className="vertical-middle" onClick={this.handleLike.bind(this,value.id,key)}>{value.is_like ? <i className="icon-liked" style={{color:'#FBAE1E'}}></i> : <i className="icon-like"></i>}</a>
						</div>
					</div>
				</li>
			))
		}
		return (
			<div className="search">
				<div className="search-nav">
					<h2>{this.props.location.query.keyword}</h2>
					<p>分享至</p>
					<a href="/"><i className="icon-weibo"></i></a>
					<a href="/"><i className="icon-wechat"></i></a>
					<a href="/"><i className="icon-douban"></i></a>
					<a href="/"><i className="icon-twitter"></i></a>
				</div>
				<div className="search-content">
					<ul className="mobile-items">
					{
						data
					}
					</ul>
				</div>
				<Nav state={this.props.state} dispatch={this.props.dispatch} />
				<Footer />
			</div>
		)
	}
}

Category = connect(state => ({state}))(Category);
export default Category;
