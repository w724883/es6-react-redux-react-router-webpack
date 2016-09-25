import React,{Component} from 'react';
// import {CSSTransitionGroup} from 'react/addons';
// import { connect } from 'react-redux';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import Config from '../../config';
import Nav from '../nav/mobile';
import Masonry from "react-masonry-component";
// import {setPop} from '../../actions';
import "./index.scss";


class Show extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:[]
		}
	}
	componentWillMount(){
		let params = {};
		let seft = this;
		$.get(Config.api.bask,params,function(res){
			if(res.code == 200){
				seft.setState({
					data:res.data
				})
			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error)
		})
		
	}
	// componentDidMount(){
	// 	// console.log(Masonry)
	// 	// new Masonry(this.refs.mobileItems,{
	// 	// 	itemSelector: ".J-item"
	// 	// });
	// 	var msnry = new Masonry('.show-items', {
	// 		columnWidth: 100,
	// 		itemSelector: "li"
	// 	});
	// }
	handleScroll(){
		$(window).scrollTop(0);
	}
	render(){
		let data = '';
		if(this.state.data.length){
			data = this.state.data.map((value,key) => (
				<li key={key} className="J-item">
					<div className="show-item">
						<div className="show-img">
							<a href="/">
								<img src={value.goods_cover} />
							</a>
						</div>
						<div className="show-about">
							<p>{value.goods_name}</p>
							<div className="show-info">
								<div className="show-userhead"></div>
								<div className="username">
									<strong>赵晓雯</strong>
									<span>28人点赞</span>
								</div>
								<a href="" className="vertical-middle"><i className="icon-appreciate"></i></a>
							</div>
						</div>
					</div>
				</li>
			))
		}
		return (
			<div className="show">
				<div className="show-top" onClick={this.handleScroll.bind(this)}>顾客晒单</div>
				<div className="show-content">
					<Masonry
		                className="show-items"
		                elementType="ul"
		                disableImagesLoaded={false}
		                updateOnEachImageLoad={false}
		            >
					{
						data
					}
					</Masonry>
				</div>
				<Nav />
			</div>
		)
	}
}

// Category = connect(state => ({state}))(Category);
export default Show;
