import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import {Link,browserHistory} from 'react-router';
import Config from '../../config';
import {Waiting} from '../common/loading/mobile';
import "zepto";
import "./mobile.scss";

class Search extends Component{
	handleLike(goods_id,key){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.clicklike,
		  data: {goods_id:goods_id},
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				let searchData = self.props.state.searchData;
				searchData.data[key].is_like = !searchData.data[key].is_like;

				self.props.dispatch(Actions.setSearch(searchData));
				if(searchData.data[key].is_like){
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
	render(){
		let {state,dispatch} = this.props;
		let boundActionCreators = bindActionCreators(Actions, dispatch);
		return (
			<div className="search">
				<div className="search-fixed">
					<Input {...boundActionCreators} data={state.searchData} handleClose={this.props.handleClose}/>
				</div>

				<ul className="mobile-items">
					{
						state.searchData.data ? (state.searchData.data.length ? (typeof state.searchData.data == 'string' ? <li style={{float: 'none', width: '100%', textAlign: 'center', padding: '60px 0 0'}} dangerouslySetInnerHTML={{__html:state.searchData.data}}></li> : state.searchData.data.map((value,key) => (
							<li key={key}>
								<div className="mobile-item">
									<div className="mobile-img">
										<Link to={"/details?id="+value.id} style={{backgroundImage:"url("+value.goods_cover+")"}}></Link>
										{value.activty_message ? <span className="mobile-tag">{value.activty_message}</span> : null}
									</div>
									<div className="mobile-about">
										<p>{value.goods_name}</p>
										<span className="price">{value.price}</span>
										<a href="javascript:;" className="vertical-middle" onClick={this.handleLike.bind(this,value.goods_id,key)}>
											{value.is_like ? <i className="icon-liked" style={{color:'#FBAE1E'}}></i> : <i className="icon-like"></i>}
										</a>
									</div>
								</div>
							</li>
						))) : null) : <li style={{float: 'none', width: '100%', textAlign: 'center', padding: '60px 0 0'}}>没有找到你搜索的结果，去 <Link to="/category">列表</Link> 看看吧</li>
					}
				</ul>
			</div>
		)
	}
}
class Input extends Component{
	constructor(props){
		super(props);
	    this.state = {
	    	value:this.props.data.value
	    };
	}
	handleChange(e){
		let value = e.target.value.trim();
		this.setState({
			value:value
		})
	}
	handleClose(){
		this.props.handleClose();
	}
	handleClick(){
		let self = this;
		this.props.setSearch({
			value:self.state.value,
			data:Waiting
		});
		$.ajax({
		  type: 'POST',
		  url: Config.api.search,
		  data:{keyword:this.state.value},
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){

				self.props.setSearch({
					value:self.state.value,
					data:res.data
				});

			}else{
				console.log(res.message);
			}
		  },
		  error: function(xhr, type){
		     self.props.dispatch(Actions.setMessage({
		    	text:Config.text.network
		    }));
		  }
		});
	}
	render(){
		let value = this.state.value;
		let originValue = this.props.data.value;
		return (
			<div className={this.props.data.data && this.props.data.data.length ? "search-input search-result" : "search-input"}>
				<label htmlFor="search" className="icon-search"></label>
				<input onChange={this.handleChange.bind(this)} type="text" placeholder="输入关键字" defaultValue={this.state.value} />
				{(!value || value == originValue) ? <a href="javascript:;" onClick={this.handleClose.bind(this)} className="icon-close"></a> : <a onClick={this.handleClick.bind(this)} className="search-button" href="javascript:;">搜索</a>}
			</div>
		)
	}
}
Search = connect(state => ({state}))(Search);
export default Search;
