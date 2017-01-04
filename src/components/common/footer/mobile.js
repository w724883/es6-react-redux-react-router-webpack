import React,{Component} from 'react';
import { Link } from 'react-router';
import './mobile.scss';
import logo from '../../../static/imgs/logo-bottom.png';
class Footer extends Component{
	render(){
		return (
		  	<div className="footer">
		  		<Link to="/" className="footer-left" style={{backgroundImage:"url("+logo+")"}}></Link>
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
