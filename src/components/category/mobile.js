import React,{Component} from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Layer from '../layer';
import {Loading} from '../loading';
import Swiper from 'swiper';
import { Link } from 'react-router';
import * as Actions from '../../actions';
import {Waiting} from '../loading';
import Config from '../../config';
import Nav from '../nav/mobile';
import 'zepto';
// import {setPop} from '../../actions';
import "./mobile.scss";



class Category extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:Waiting,
			loading:true
		}
	}
	getInitData(){
		let self = this;
		let dfd = $.Deferred();
		let params = {};
		$.get(Config.api.product,params,function(res){
			if(res.code == 200){
				self.setState({
					data:res.data
				});
				dfd.resolve();
			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error)
		});
		return dfd.promise();
	}
	componentWillMount(){
		let dfdTasks = [];
		let self = this;
		dfdTasks.push(this.getInitData());
		$.when.apply(null,dfdTasks).done(function(){
			// self.props.dispatch(Actions.setLoading(false));
			self.setState({
				loading:false
			})
		});
		
	}
	componentDidMount(){
		let self = this;
		let params = {};
		$(self.refs.container).on('click','.J-slide-item',function(e){
			let _this = this;
			self.setState({
				data:Waiting
			})
			$.get(Config.api.product,params,function(res){
				if(res.code == 200){
					self.setState({
						data:res.data
					});
					
					$(_this).addClass('active').siblings('.active').removeClass('active');
				}else{
					console.log(res.message);
				}
			}).fail(function(error){
				console.log(error);
			})		
		});
		new Swiper('#categorySwiper', {
		    slidesPerView: 5,
		    // spaceBetween: 30,
		    freeMode: true
		});

		// const winWidth = $(window).width();
		// let categoryBars = $(this.refs.container).find('.J-slide-container');
		// categoryBars.each(function(){
		// 	let container = $(this).find('.J-slide-items');
		// 	let items = $(this).find('.J-slide-item');
			
		// 	let children = $(this).children();
		// 	let width = items.length/5 * winWidth,
		// 		lastgap=0,
		// 		sx,gap;
		// 	items.width(winWidth/5);
		// 	if(width <= container.width()){
		// 		return false;
		// 	}
		// 	container.width(Math.ceil(width));
		// 	children.on('touchstart',function(e){
		// 		sx = e.targetTouches[0].pageX;
		// 	});
		// 	children.on('touchmove',function(e){
		// 		let mx = e.targetTouches[0].pageX;
		// 		gap = mx-sx+lastgap;
		// 		if(gap > 0){
		// 			gap = 0;
		// 		}
		// 		if(gap < winWidth-width){
		// 			gap = winWidth-width;
		// 		}
		// 		$(this).css({'transform':'translate3d('+gap+'px,0,0)'});
		// 	});
		// 	children.on('touchend',function(e){
		// 		lastgap = gap ? gap : 0;
		// 	});
		// });

	}

	render(){
		let data = <div dangerouslySetInnerHTML={{__html:Waiting}}></div>;
		if(typeof this.state.data != 'string' && this.state.data.length){
			data = this.state.data.map((value,key) => (
				<li key={key}>
					<div className="mobile-item">
						<div className="mobile-img">
						<a href="/" style={{backgroundImage:"url("+value.goods_cover+")"}}></a>
						<span className="mobile-tag">特别优惠</span>
						</div>
						<div className="mobile-about">
							<p>{value.goods_name}</p>
							<span className="price">{value.price}</span>
							<a href="javascript:;" className="vertical-middle"><i className="icon-like"></i></a>
						</div>
					</div>
				</li>
			))
		}
		return (
			<div className="category" ref="container">
				<div id="categorySwiper" className="swiper-container slide-container">
				    <div className="swiper-wrapper slide-items">
				    	<div className="swiper-slide slide-item active">
				    		<a href="javascript:;">111</a>
				    	</div>
				    	<div className="swiper-slide slide-item">
				    		<a href="javascript:;">111</a>
				    	</div>
				    	<div className="swiper-slide slide-item">
				    		<a href="javascript:;">111</a>
				    	</div>
				    	<div className="swiper-slide slide-item">
				    		<a href="javascript:;">111</a>
				    	</div>
				    	<div className="swiper-slide slide-item">
				    		<a href="javascript:;">111</a>
				    	</div>
				    	<div className="swiper-slide slide-item">
				    		<a href="javascript:;">111</a>
				    	</div>
				    	<div className="swiper-slide slide-item">
				    		<a href="javascript:;">111</a>
				    	</div>
				    	<div className="swiper-slide slide-item">
				    		<a href="javascript:;">111</a>
				    	</div>
				    	<div className="swiper-slide slide-item">
				    		<a href="javascript:;">111</a>
				    	</div>
				    </div>
				</div>
				
				<div className="category-content">
					<ul className="mobile-items">
					{
						data
					}
					</ul>
				</div>
				<Nav />
				<CSSTransitionGroup
					component="div"
					className="home"
					transitionEnter={false}
	              	transitionLeaveTimeout={400}
	              	transitionName="transition-layer">
						{this.state.loading ? <Layer><Loading /></Layer> : null}
				</CSSTransitionGroup>
			</div>
		)
	}
}

Category = connect(state => ({state}))(Category);
export default Category;
