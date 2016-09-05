import React,{Component} from 'react';
// import {CSSTransitionGroup} from 'react/addons';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import Config from '../../config';
import {setPop} from '../../actions';
import "./index.scss";


class HomeList extends Component{
	constructor(props){
		super(props);
		this.state = {data:props.hotData};
	}
	handleShowHot(){
		this.setState({
			data:this.props.hotData
		})
	}
	handleShowNew(){
		this.setState({
			data:this.props.newData
		})
	}
	handleShowLike(){
		if(this.props.login){
			this.setState({
				data:this.props.likeData.item
			})
		}else{
			this.props.dispatch(setPop('login'));
		}
		
	}
	
	render(){
		let data = this.state.data;
		let props = this.props;
		return (
			<div className="home-content">
				<ul className="home-bar">
					<li><a className={data == props.hotData ? "active" : ""} onClick={this.handleShowHot.bind(this)} href="javascript:;">热门推荐</a></li>
					<li><a className={data == props.newData ? "active" : ""} onClick={this.handleShowNew.bind(this)} href="javascript:;">最新上架</a></li>
					<li><a className={data == props.likeData.item ? "active" : ""} onClick={this.handleShowLike.bind(this)} href="javascript:;">我的收藏</a></li>
					<li className="home-search"><Link to="/search"><i className="icon-search"></i>搜索</Link></li>
				</ul>
				<CSSTransitionGroup
					component="ul"
					className="mobile-items hot"
	              	transitionEnterTimeout={500}
	              	transitionLeaveTimeout={500}
	              	transitionLeave={false}
	              	transitionName="transition-homelist">
					{
						data.map((value,key) => (
							<li key={key}>
								<div className="mobile-item">
									<div className="mobile-img"><a href="/" style={{backgroundImage:"url("+value.goods_cover+")"}}></a></div>
									<div className="mobile-about">
										<p>{value.goods_name}</p>
										<span className="price">{value.price}</span>
										<a href="javascript:;" className="vertical-middle"><i className="icon-like"></i></a>
									</div>
								</div>
							</li>
						))
					}
				</CSSTransitionGroup>
			</div>
		)
	}
}
export default HomeList;
