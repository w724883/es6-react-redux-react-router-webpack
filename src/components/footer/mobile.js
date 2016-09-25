import React,{Component} from 'react';
import { Link } from 'react-router';
import "./mobile.scss";

class Footer extends Component{
	render(){
		return (
		  	<div className="footer">
		  		<span className="footer-left"><Link to="/">金家私厨出品</Link></span>
		  		<div className="footer-right">
		  			<Link to="/">品牌介绍</Link>
		  			<Link to="/">联系我们</Link>
		  			<Link to="/">帮助中心</Link>
		  		</div>
		  	</div>
		)
	}
	
}
export default Footer;
