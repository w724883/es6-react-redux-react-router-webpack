import React,{Component} from 'react';
// import {CSSTransitionGroup} from 'react/addons';
import { connect } from 'react-redux';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import Config from '../../config';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';
import Nav from '../common/nav/mobile';
import Masonry from "react-masonry-component";
import {TopFixed} from '../common/fixed/mobile';
import Scroll from '../common/scroll/mobile';
import * as Actions from '../../actions';
import 'zepto';
import "./mobile.scss";


class Show extends Component{
	constructor(props){
		super(props);
		
		
		this.state = {
			data:[],
			page:1
		}
	}
	initShowData(){
		let self = this;
		let dfd = new $.Deferred();
		$.ajax({
		  type: 'POST',
		  url: Config.api.bask,
		  data:{
		  	page:this.state.page
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
	  			self.setState({
	  				data:res.data,
	  				page:self.state.page+1
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
		  },
		  complete:function(){
		  	dfd.resolve();
		  }
		});
		return dfd.promise();
	}
	getAppreciate(n){
		let text = '';
		n = parseInt(n, 10);
		// let stars = new Array(n).fill(1);
		switch(n){
			case 1:text = '很差';break;
			case 2:text = '不好';break;
			case 3:text = '一般';break;
			case 4:text = '很好';break;
			case 5:text = '非常好';break;
		}
		return text;
		// return {
		// 	text,
		// 	star:stars.map((v,k) => (
		// 		<i key={k} className="icon-appreciate"></i>
		// 	))
		// }
	}
	getShowData(){
		let self = this;
		$.ajax({
		  type: 'POST',
		  url: Config.api.bask,
		  data:{
		  	page:this.state.page
		  },
		  dataType: Config.dataType,
		  success: function(res){
		  	if(res.code == 200){
		  		let data = self.state.data;
	  			self.setState({
	  				data:data.concat(res.data),
	  				page:self.state.page+1
	  			});


		  	}else if(res.code == 403){
		  		self.setState({
		  			page:0
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
	handleScroll(){
		this.getShowData();
	}
	componentWillMount(){
		let self = this;
		let {dispatch} = this.props;
		let dfdTasks = [this.initShowData.call(this)];
		dispatch(Actions.setLoading(true));
		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
		});



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

	render(){

		return (
			<div className="show">
				<TopFixed data="顾客晒单" />
				<div className="show-content">
					<Masonry
		                className="show-items"
		                elementType="ul"
		                disableImagesLoaded={false}
		                updateOnEachImageLoad={false}
		            >
					{
						this.state.data.length ? (
							this.state.data.map((value,key) => {
								return <li key={key} className="J-item">
									<div className="show-item">
										<div className="show-img">
											<Link to={"/details?id="+value.goods_id}>
												<img src={value.comment_img} />
											</Link>
										</div>
										<div className="show-about">
											<p>{value.contents}</p>
											<div className="show-info">
												<div className="show-userhead" style={{backgroundImage:'url('+value.face+')'}}></div>
												<div className="username">
													<strong>{value.username}</strong>
													<span>{value.comment_num}星评价</span>
												</div>
												<a href="javascript:;"><i className="icon-appreciate"></i><span>{this.getAppreciate(value.comment_num)}</span></a>
											</div>
										</div>
									</div>
								</li>
							})
						) : null
					}
					</Masonry>
				</div>
				<Nav state={this.props.state} dispatch={this.props.dispatch} />
				<Scroll page={this.state.page} handleScroll={this.handleScroll.bind(this)} />
			</div>
		)
	}
}

Show = connect(state => ({state}))(Show);
export default Show;
