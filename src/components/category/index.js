import React,{Component} from 'react';
// import {CSSTransitionGroup} from 'react/addons';
import { connect } from 'react-redux';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import Config from '../../config';
import Nav from '../nav/mobile';
import 'zepto';
// import {setPop} from '../../actions';
import "./index.scss";



class Category extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:[]
		}
	}
	componentWillMount(){
		let params = {};
		let seft = this;
		$.get(Config.api.product,params,function(res){
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
	componentDidMount(){
		let seft = this;
		let params = {};
		$(seft.refs.container).on('click','.J-slide-item',function(e){
			let _this = this;
			$.get(Config.api.product,params,function(res){
				if(res.code == 200){
					seft.setState({
						data:res.data
					});
					$(_this).addClass('active').siblings('.active').removeClass('active');
				}else{
					console.log(res.message);
				}
			}).fail(function(error){
				console.log(error);
			})		
		})

		const winWidth = this.props.state.width;
		let categoryBars = $(this.refs.container).find('.J-slide-container');
		categoryBars.each(function(){
			let container = $(this).find('.J-slide-items');
			let items = $(this).find('.J-slide-item');
			
			let children = $(this).children();
			let width = items.length/5 * winWidth,
				lastgap=0,
				sx,gap;
			items.width(winWidth/5);
			if(width <= container.width()){
				return false;
			}
			container.width(Math.ceil(width));
			children.on('touchstart',function(e){
				sx = e.targetTouches[0].pageX;

			});
			children.on('touchmove',function(e){
				let mx = e.targetTouches[0].pageX;
				gap = mx-sx+lastgap;
				if(gap > 0){
					gap = 0;
				}
				if(gap < winWidth-width){
					gap = winWidth-width;
				}
				$(this).css({'transform':'translate3d('+gap+'px,0,0)'});
			});
			children.on('touchend',function(e){
				lastgap = gap ? gap : 0;
			});
		});

	}

	render(){
		let data = '';
		if(this.state.data.length){
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
				<div className="slide-container J-slide-container">
					<ul className="slide-items J-slide-items">
						<li className="slide-item J-slide-item active"><a href="javascript:;">111</a></li>
						<li className="slide-item J-slide-item"><a href="javascript:;">111</a></li>
						<li className="slide-item J-slide-item"><a href="javascript:;">111</a></li>
						<li className="slide-item J-slide-item"><a href="javascript:;">111</a></li>
						<li className="slide-item J-slide-item"><a href="javascript:;">111</a></li>
						<li className="slide-item J-slide-item"><a href="javascript:;">111</a></li>
						<li className="slide-item J-slide-item"><a href="javascript:;">111</a></li>
						<li className="slide-item J-slide-item"><a href="javascript:;">111</a></li>
						<li className="slide-item J-slide-item"><a href="javascript:;">111</a></li>
						<li className="slide-item J-slide-item"><a href="javascript:;">111</a></li>
					</ul>
				</div>
				<div className="category-content">
					<ul className="mobile-items">
					{
						data
					}
					</ul>
				</div>
				<Nav />
			</div>
		)
	}
}

Category = connect(state => ({state}))(Category);
export default Category;
