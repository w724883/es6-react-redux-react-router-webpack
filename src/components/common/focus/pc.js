import React,{Component} from 'react';
import Swiper from 'swiper';
import '../../../libs/swiper/swiper.css';
import './pc.scss';
// import 'zepto';
class Focus extends Component {
	componentDidMount(){
		let self = this;
		if(this.props.data.length && !this.swiper){
			this.swiper = new Swiper('#focusSwiper', {
			    pagination: '#focusSwiper .swiper-pagination .main',
			    slidesPerView: 1,
			    paginationClickable: true,
			    autoplay:5000,
			    autoHeight:true,
			    autoplayDisableOnInteraction:false,
			    loop: true,
			    preventClicks:false,
			    onlyExternal:true
			    // onInit:function(){
			    // 	setTimeout(function(){
			    // 		let dfd = self.props.dfd;
			    // 		dfd && dfd.resolve();
			    // 	},2000)
			    	
			    // }
			});
		}
	}
	render(){
		
		return (
			<div id="focusSwiper" className="swiper-container">
			    <div className="swiper-wrapper">
			    	{
			    		this.props.data.map((value,key) => (<div key={key} className="swiper-slide"><a href={value.ad_link ? value.ad_link : "javascript:;"}><img src={value.ad_img} /></a></div>))
			    	}
			    </div>
			    <div className="swiper-pagination"><div className="main"></div></div>
			</div>
		)
	}
}

export default Focus;