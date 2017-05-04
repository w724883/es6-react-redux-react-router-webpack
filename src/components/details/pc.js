import React,{Component} from 'react';
import { connect } from 'react-redux';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import Swiper from 'swiper';
import { Link,browserHistory } from 'react-router';
import Config from '../../config';
// import {getQuery} from '../common';
import * as Actions from '../../actions';
import {Waiting} from '../common/loading/pc';
import Scroll from '../common/scroll/pc';
// import Layer from '../layer';
import Nav from '../common/nav/pc';
import Num from '../common/number/pc';
// import {CartFixed} from '../common/fixed/mobile';
import "zepto";
import "./pc.scss";


class Details extends Component{
	constructor(props){
		super(props);
		
		this.getDetail = this.getDetail.bind(this);
		this.renderDetail = this.renderDetail.bind(this);

		this.state = {
			detailData:{
				attr_name:null,
				sku_arr:null,
				goods_info:null
			},
			detailInfo:[Waiting],
			params:{
				goods_id: props.location.query.id,
				goods_attribute: {},
				goods_num: 1,
				goods_price:""
			},
			showPage:1
		}
	}
	getDetail(){
		let self = this;
		let id = this.props.location.query.id;
		let dfd = $.Deferred();
		if(id){
			$.ajax({
			  type: 'POST',
			  url: Config.api.details,
			  data: {id:id},
			  dataType: Config.dataType,
			  success: function(res){
				if(res.code == 200){
					let detailData = self.state.detailData;
					detailData.attr_name = res.data.attr_name;
					detailData.sku_arr = res.data.sku_arr;
					detailData.goods_info = res.data.goods_info;

					let detailInfo = self.state.detailInfo;
					let goods_field = res.data.goods_field;

					if(goods_field && goods_field.length){
						detailInfo = goods_field.concat(detailInfo);
					}

					let params = self.state.params;
					if(detailData.sku_arr){
						for(let i in detailData.sku_arr){
							params.goods_attribute[i] = detailData.sku_arr[i][0];
						}

					}

					self.setState({
						detailData,
						detailInfo,
						params
					});
					self.handlePrice.call(self,self.info = res.data.info);


					let thumbSwipers = new Swiper('#thumbSwipers', {
					    spaceBetween: 15,
					    centeredSlides: true,
					    // slidesPerView: 'auto',
					    // touchRatio: 0.2,
					    slideToClickedSlide: true,
					    direction: 'vertical',
					    slidesPerView: detailData.goods_info.goods_imgs.length > 4 ? 4 : detailData.goods_info.goods_imgs.length,
					    initialSlide:1
					});

					
					let contentSwiper = new Swiper('#contentSwiper', {
					    nextButton: '.swiper-button-next',
					    prevButton: '.swiper-button-prev',
					    spaceBetween: 10,
					});
					contentSwiper.params.control = thumbSwipers;
					thumbSwipers.params.control = contentSwiper;
					
					
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
			  complete: function(){
			  	dfd.resolve();
			  }
			});
		}

		return dfd.promise();
	}
	handleShowScroll(){
		this.getShowData();
	}
	getShowData(){
		let self = this;
		let detailInfo = this.state.detailInfo;
		$.ajax({
			type: 'POST',
			url: Config.api.goodscommentlists,
			data:{
				page:this.state.showPage,
				goods_id:this.state.detailData.goods_info.id
			},
			dataType: Config.dataType,
			success: function(res){
				if(res.code == 200){
					// let data = detailInfo[detailInfo.length-1];
					if($.isArray(detailInfo[detailInfo.length-1])){
						detailInfo[detailInfo.length-1] = detailInfo[detailInfo.length-1].concat(res.data);
					}else{
						detailInfo[detailInfo.length-1] = res.data || [];
					}
					// detailInfo[detailInfo.length-1] = res.data;
					self.setState({
						detailInfo:detailInfo,
						// showPage:self.state.showPage+1
					});
					self.swiper && self.swiper.update();
					self.setState({
						// detailInfo:detailInfo,
						showPage:self.state.showPage+1
					});
				}else if(res.code == 403){
			  		self.setState({
			  			showPage:0
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
	renderStar(n){
		n = parseInt(n, 10);
		let stars = new Array(n).fill(1);
		return stars.map((v,k) => (
			<i key={k} className="icon-appreciate"></i>
		))
	}
	renderShow(imgs){
		if(imgs){
			return (<div className="detailShow-items">
				{
					$.isArray(imgs) ? imgs.map((v,k) => (
						<div key={k} className="detailShow-item" style={{backgroundImage:"url("+v+")"}}></div>
					)) : <div className="detailShow-item" style={{backgroundImage:"url("+imgs+")"}}></div>
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
			if($.isArray(value) && value.length){

				return (<ul className="detailShow-list">
					{value.map((sv,sk) => (
						<li key={sk}>
							<div className="detailShow-head" style={{backgroundImage:"url("+sv.face+")"}}></div>
							<div className="detailShow-info">
								<strong>{sv.username}</strong>
								{
									self.renderStar(sv.comment_num)
								}
								<span>{sv.addtime}</span>
								<p>{sv.contents}</p>
								{
									self.renderShow(sv.comment_img)
								}

							</div>
						</li>
					))}
					<li><Scroll page={this.state.showPage} handleScroll={this.handleShowScroll.bind(this)} /></li>
				</ul>)
			}else if(typeof value.value == 'string'){
				// value.value = value.value.replace(/\+/g,"%20");
				return <div className="detail-desc" dangerouslySetInnerHTML={{__html:decodeURIComponent(value.value)}}></div>
			}
		}
	}
	renderInfo(){
		// if(this.state.detailInfo.length>1 && !this.swiper){
			let self = this;
			this.swiper = new Swiper('#detailsSwiper', {
			    pagination: '#detailsSwiper .swiper-pagination',
			    slidesPerView: 1,
			    paginationClickable: true,
			    speed:500,
			    autoHeight:true,
			    paginationType:'custom',
			    onlyExternal:true,
			    paginationCustomRender: function (swiper, current, total) {

			    	let str = '';
			    	swiper.container.find('.swiper-scroll').css({
			    		width:(1/total)*100+'%',
			    		transform:'translate3d('+100*(current-1)+'%,0,0)'
			    	});
		    		for(let i = 0; i < total; i++){

							str += `<span data-index="${i}" class=${current == i+1 ? "active" : ""}>${i+1 == total ? "食客晒单<i>"+(self.state.detailData.goods_info ? self.state.detailData.goods_info.comment_count : 0)+"</i>" : decodeURIComponent(self.state.detailInfo[i].key)}</span>`;

		    		}
			    	if(current == total && (typeof self.state.detailInfo[self.state.detailInfo.length-1] == 'string') && self.state.detailData.goods_info){
			    		self.getShowData();
			    	}

			        return str;
			    }
			});
			this.swiper.container.on('click','.swiper-pagination span',function(){
				self.swiper.slideTo($(this).data('index'));
			})
		// }
	}
	handleSubmit(){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.joincart,
		  data: this.state.params,
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				self.props.dispatch(Actions.setPop({
					show:'cartJoin',
					data:self.state.detailData.goods_info
				}));
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
	handleAttr(attr,value){
		let params = this.state.params;
		params.goods_attribute[attr] = value;
		this.setState({
			params
		});
		this.handlePrice.call(this);
	}
	handleNumber(value){
		let params = this.state.params;
		params.goods_num = value;
		this.setState({
			params
		});
	}
	handlePrice(infos){
		infos = infos || this.info;
		let params = this.state.params;
		let goods_attribute = this.state.params.goods_attribute;
		let attribute = [];
		for(let attr in goods_attribute){
			attribute.push(goods_attribute[attr]);
		}
		attribute.sort();
		for(let info in infos){
			let attributes = info.split(",").sort();
			if(attributes.join(",") === attribute.join(",")){
				params.goods_price = infos[info][1];
			}
		}
		this.setState({params});
	}
	handleLike(goods_id){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.clicklike,
		  data: {goods_id:goods_id},
		  dataType: Config.dataType,
		  success: function(res){
			if(res.code == 200){
				let detailData = self.state.detailData;
				detailData.goods_info.is_like = !detailData.goods_info.is_like;
				self.setState({detailData});
				self.props.dispatch(Actions.setMessage({
					text:detailData.goods_info.is_like ? '已收藏' :'已取消收藏'
				}));
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
		let self = this;
		let {dispatch} = this.props;
		let dfdTasks = [this.getDetail()];
		dispatch(Actions.setLoading(true));
		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
			self.renderInfo();
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
		});


	}
	
	render(){
		let self = this;
		let detailData = this.state.detailData;
		let detailInfo = this.state.detailInfo;

		let goods_imgs = detailData.goods_info ? detailData.goods_info.goods_imgs : detailData.goods_info;
		if(goods_imgs && goods_imgs.length){
			goods_imgs = goods_imgs.map((value,key) => {
				return {ad_img:value}
			});
		}

		let attr_name = detailData.attr_name ? Object.keys(detailData.attr_name) : detailData.attr_name;
		if(attr_name){
			attr_name = attr_name.map((value,key) => (
				<div key={key} className="details-filter-item">
					<label>{detailData.attr_name[value]}</label>
					<ul>
						{
							detailData.sku_arr && detailData.sku_arr[value] && detailData.sku_arr[value].length && detailData.sku_arr[value].map((v,k) => {
									return <li key={k} className={v == this.state.params.goods_attribute[value] ? "active" : ""} onClick={this.handleAttr.bind(this,value,v)}>{v}</li>

								})
						}
					</ul>
				</div>
			))
		}
		// {goods_imgs && goods_imgs.length ? <Focus data={goods_imgs} /> : null}
		return (
			<div className="details">
				<div className="details-focus">
					<div className="main">
						<div className="details-focus-thumb">
							<div id="thumbSwipers" className="swiper-container">
							    <div className="swiper-wrapper">
							    	{
							    		goods_imgs && goods_imgs.length ? (
							    			goods_imgs.map((value,key) => (<div key={key} className="swiper-slide" style={{backgroundImage:"url("+value.ad_img+")"}}></div>))
							    		) : null
							    	}
							    </div>
							    <div className="swiper-pagination"></div>
							</div>
						</div>
						<div className="details-focus-content">
							<div id="contentSwiper" className="swiper-container">
							    <div className="swiper-wrapper">
							    	{
							    		goods_imgs && goods_imgs.length ? (
							    			goods_imgs.map((value,key) => (<div key={key} className="swiper-slide" style={{backgroundImage:"url("+value.ad_img+")"}}></div>))
							    		) : null
							    	}
							    </div>
							    <div className="swiper-pagination"></div>
							</div>
						</div>
						<div className="details-focus-attribute">
							{
								detailData.goods_info ? (
									<div className="details-info">
										<h1>{detailData.goods_info.goods_name}</h1>
										<span className="price">{(this.state.params.goods_price*1).toFixed(2)}</span>
										<p>消费满196.00元，立减20.00运费</p>
									</div>
								) : null
							}

							<div className="details-filter">
								{
									attr_name
								}
								<div className="details-filter-item">
									<label>选择数量</label>
									<Num min="1" value={this.state.params.goods_num} handleChange={this.handleNumber.bind(this)} />
								</div>
							</div>
							<div className="details-focus-btns">
								<a href="javascript:;" onClick={this.handleSubmit.bind(this)} className="details-focus-buy"><i className="icon-cart"></i>放入购物车</a>
								{
									detailData.goods_info ? <a className="details-focus-like" onClick={this.handleLike.bind(this,this.state.params.goods_id)} href="javascript:;" ><i className={(detailData.goods_info.is_like) ? "icon-liked" : "icon-like"}></i>{detailData.goods_info.goods_like_num}人已收藏</a> : null
								}
								
							</div>
							<div className="details-focus-link">
								<span>分享美食</span>
								<a href="/"><i className="icon-weibo"></i></a>
								<a href="/"><i className="icon-wechat"></i></a>
								<a href="/"><i className="icon-douban"></i></a>
								<a href="/"><i className="icon-twitter"></i></a>
							</div>
							
						</div>
					</div>
				</div>
				<div className="main details-about">
					<div id="detailsSwiper" className="swiper-container">
						<div className="swiper-navigator">
							<div ref="swiperNavigator">
								<div className="swiper-inline">
									<div className="swiper-pagination"></div>
									<div className="swiper-scroll"></div>
								</div>
							</div>
						</div>
					    <div className="swiper-wrapper">
					    	{
					    		detailInfo.map((value,key) => (
			    					<div key={key} className="swiper-slide">
			    						{
			    							self.renderDetail(value)
			    						}
			    					</div>
			    				))
					    	}
					    </div>
					</div>
				</div>
				<Nav state={this.props.state} dispatch={this.props.dispatch} />
			</div>
		)
	}
}
Details = connect(state => ({state}))(Details);
export default Details;
