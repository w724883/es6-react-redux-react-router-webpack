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
			menu:null,
			goods:null,
			id:0
		}
	}
	getInitData(){
		let self = this;
		let dfd = $.Deferred();
		let params = {id:this.state.id};
		$.ajax({
		  type: 'POST',
		  url: Config.api.product,
		  data: params,
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		if(res.data.menu.length){
		  			self.setState({
		  				menu:res.data.menu,
		  				id:0,
		  				goods:res.data.goods
		  			});
		  			// if(!self.swiper){
		  			// 	self.swiper = new Swiper('#categorySwiper', {
		  			// 	    slidesPerView: res.data.menu.length > 4 ? 4 : res.data.menu.length,
		  			// 	    // spaceBetween: 30,
		  			// 	    freeMode: true
		  			// 	});
		  			// }
		  		}
		  		

		  		// dfd.resolve();
		  	}else{
		  		self.props.dispatch(Actions.setMessage({
		  			text:res.message
		  		}));
		  	}
		  },
		  error: function(xhr, type){
		    console.log(type);
		  },
		  complete: function(){
		  	dfd.resolve();
		  	// dfd.resolve();
		  	// dfd.reject();
		  }
		});
		return dfd.promise();
	}
	handleLike(goods_id,key){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.clicklike,
		  data: {goods_id:goods_id},
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				let goods = self.state.goods;
				goods[key].is_like = !goods[key].is_like;
				self.setState({
					goods
				});
				if(goods[key].is_like){
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
		    console.log(type);
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
	componentDidMount(){
		let self = this;
		$(self.refs.container).on('click','a',function(e){
			let _this = this;
			let id = $(this).data('id');
			self.setState({
				goods:Waiting,
				id:id
			});
			if(id > 0){
				$.ajax({
				  type: 'POST',
				  url: Config.host+'c/'+id,
				  data: {id:id},
				  dataType: Config.dataType,
				  success: function(res){
				  	if(res.code == 200){
				  		self.setState({
				  			goods:res.data
				  		});
				  	}else{
				  		console.log(res.message);
				  	}
				  },
				  error: function(xhr, type){
				    console.log(type);
				  }
				});
			}else{
				self.getInitData();
			}

		});
		// let scrollTop = 10;
		// let $categorySwiper = $('#categorySwiper');
		// $(window).on('scroll',function(){
		// 	let top = $body.scrollTop() || $(document).scrollTop();
		// 	if(top > scrollTop){
		// 		$categorySwiper.removeClass('active');
		// 		scrollTop = top;
		// 	}
		// });

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
		if($.isArray(this.state.goods) && this.state.goods.length){
			data = this.state.goods.map((value,key) => (
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
			<div className="category">
				<div className="category-nav" ref="container">
					<div className="main">
				    	{
				    		(this.state.menu && this.state.menu.length) ? this.state.menu.map((value,key) => (
			    				<a key={key} href="javascript:;" data-id={value.id} className={this.state.id == value.id ? "active" : ""}>
			    					<img src={value.icon} />
			    					<span>{value.name}</span>
			    				</a>
				    		)) : null
				    	}
		    		</div>
					    
				</div>
				<div className="main category-content">
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
