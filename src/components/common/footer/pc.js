import React,{Component} from 'react';
import { Link } from 'react-router';
import "./pc.scss";

class Footer extends Component{
	render(){
		return (
		  	<div className="footer">
		  		<div className="main">
			  		<div className="float-left">
			  			<Link to="/">品牌介绍</Link>
			  			<Link to="/">联系我们</Link>
			  			<Link to="/">帮助中心</Link>
			  		</div>
			  		<span><Link to="/">金家私厨出品</Link></span>
			  		<div className="float-right">
			  			<a href="/"><i className="icon-weibo"></i></a>
			  			<a href="/"><i className="icon-wechat"></i></a>
			  			<a href="/"><i className="icon-douban"></i></a>
			  			<a href="/"><i className="icon-twitter"></i></a>
			  		</div>
		  		</div>
		  	</div>
		)
	}
	
}
export default Footer;
