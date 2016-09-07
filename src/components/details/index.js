import React,{Component} from 'react';
import { connect } from 'react-redux';
import Swiper from 'swiper';
import { Link } from 'react-router';
import Config from '../../config';
import * as Actions from '../../actions';
import {Waiting} from '../loading';
import Focus from '../focus/mobile';
import Number from '../number';
import "zepto";
import "./index.scss";


class Details extends Component{
	constructor(props){
		super(props);
		this.getDetailData = this.getDetailData.bind(this);
		this.renderDetail = this.renderDetail.bind(this);

		this.state = {
			focusData:[],
			detailData:[Waiting]
		}
	}
	getDetailData(){
		let self = this;
		let dfd = $.Deferred();

		$.get(Config.api.details,function(res){
			if(res.code == 200){
				let state = self.state;
				let detailData = self.state.detailData;

				detailData.unshift(res.product,res.tips);
				self.setState({
					focusData:res.data,
					detailData:detailData
				})
			}else{
				console.log(res.message);
			}
			
		}).fail(function(error){
			console.log(error);
		}).always(function(){
			dfd.resolve();
		});
		return dfd.promise();
	}
	getShowData(){
		let self = this;
		let detailData = this.state.detailData;

		$.get(Config.api.detailshow,function(res){
			if(res.code == 200){
				detailData[2] = res.data;
				self.setState({
					detailData:detailData
				});
				self.swiper && self.swiper.update();
				
			}else{
				console.log(res.message);
			}
			
		}).fail(function(error){
			console.log(error);
		});
	}
	handleCart(){
		this.props.dispatch(Actions.setPop('cartJoin'));
	}
	renderStar(n){
		let stars = new Array(n);
		return stars.map((v,k) => (
			<i key={k} className="icon-appreciate"></i>
		))
	}
	renderImgs(imgs){
		if(imgs && imgs.length){
			return (<div className="detailShow-items">
				{
					imgs.map((v,k) => (
						<div key={k} className="detailShow-item" style={{backgroundImage:"url("+v+")"}}></div>
					))
				}
			</div>)
		}else{
			return "";
		}

	}
	renderDetail(value){
		let self = this;
		if(typeof value == 'string'){
			return <div className="detail-desc" dangerouslySetInnerHTML={{__html:value}}></div>
		}else{
			
			return (<ul className="detailShow-list">
				{value.map((sv,sk) => (
					<li key={sk}>
						<div className="detailShow-head"></div>
						<div className="detailShow-info">
							<strong>{sv.name}</strong>
							{
								self.renderStar(sv.star)
							}
							<span>{sv.time}</span>
							<p>{sv.content}</p>
							{
								self.renderImgs(sv.imgs)
							}
							
						</div>
					</li>
				))}
			</ul>)
		}
	}
	componentWillMount(){
		let {dispatch} = this.props;
		var dfdTasks = [];
		dfdTasks.push(this.getDetailData());

		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
		});

	}
	componentDidMount(){
		let $swiperNavigator = $(this.refs.swiperNavigator);
		let $top = $swiperNavigator.offset().top;

		let $body = $('body');
		let isFixed = false;
		$(window).on('scroll',function(){
			let scrollTop = $body.scrollTop() || $(document).scrollTop();
			if(!isFixed){
				$top = $swiperNavigator.offset().top;
			}
			
			if($top <= scrollTop){
				if(!isFixed){
					$swiperNavigator.addClass('fixed');
					isFixed = true;
				}
				
			}else if(isFixed){
				$swiperNavigator.removeClass('fixed');
				isFixed = false;
			}
		})
	}
	componentDidUpdate(){
		if(this.state.detailData.length && !this.swiper){
			let self = this;
			this.swiper = new Swiper('#detailsSwiper', {
			    pagination: '#detailsSwiper .swiper-pagination',
			    slidesPerView: 1,
			    paginationClickable: true,
			    speed:500,
			    autoHeight:true,
			    paginationType:'custom',
			    paginationCustomRender: function (swiper, current, total) {

			    	let str = '';
			    	swiper.container.find('.swiper-scroll').css({
			    		width:(1/total)*100+'%',
			    		transform:'translate3d('+100*(current-1)+'%,0,0)'
			    	});
			    	for(let i = 0; i < total; i++){
			    		switch(i){
			    			case 0:
			    				str += '<span data-index='+i+' class='+(current == i+1 ? "active" : "")+'>商品详情</span>';break;
			    			case 1:
			    				str += '<span data-index='+i+' class='+(current == i+1 ? "active" : "")+'>购买提示</span>';break;
			    			case 2:
			    				str += '<span data-index='+i+' class='+(current == i+1 ? "active" : "")+'>食客晒单<i>68</i></span>';break;
			    		}
			    	}
			    	if(current == 3 && (typeof self.state.detailData[2] == 'string')){
			    		self.getShowData();
			    	}
			        
			        return str;
			    }
			});
			this.swiper.container.on('click','.swiper-pagination span',function(){
				self.swiper.slideTo($(this).data('index'));
			})
		}
	}
	render(){
		let self = this;
		let focusData = this.state.focusData;
		let detailData = this.state.detailData;

		let swiperData = detailData.map((value,key) => (
			<div key={key} className="swiper-slide">
				{
					self.renderDetail(value)
				}
			</div> 
		))
		return (
			<div className="details">
				{focusData.length ? <Focus data={focusData} /> : ""}
				<div className="details-content">
					<div className="details-info">
						<h1>巧克力松塔蛋糕</h1>
						<span className="price">368.00</span>
						<p>消费满196.00元，立减20.00运费</p>

						<a href="javascript:;" className="vertical-middle"><em><i className="icon-like"></i><br/>收藏</em></a>
					</div>
					<div className="details-filter">
						<label>选择规格</label>
						<ul className="details-filter-item">
							<li className="active">1.5磅</li>
							<li>1.5磅</li>
							<li>1.5磅</li>
							<li>1.5磅</li>
						</ul>
						<label>选择口味</label>
						<ul className="details-filter-item">
							<li>芝士榴莲</li>
							<li>芝士榴莲</li>
							<li>芝士榴莲</li>
							<li>芝士榴莲</li>
						</ul>
						<label>选择数量</label>
						<div className="details-filter-item">
							<Number />
						</div>
					</div>
					<div className="details-about">
						<div id="detailsSwiper" className="swiper-container">
							<div className="swiper-navigator" ref="swiperNavigator">
								<div className="swiper-inline">
									<div className="swiper-pagination"></div>
									<div className="swiper-scroll"></div>
								</div>
							</div>
							
						    <div className="swiper-wrapper">
						    	{
						    		swiperData
						    	}
						    </div>
						</div>
					</div>
				</div>
				<div className="cart-fixed">
					<div className="cart-bar">
						<p>
							<i className="icon-product"></i>
							<strong>已选 <span className="price">688.00</span></strong>
						</p>
						
						<a href="javascript:;" onClick={this.handleCart.bind(this)}>放入购物车</a>
					</div>
				</div>
			</div>
		)
	}
}
Details = connect(state => ({state}))(Details);
export default Details;
