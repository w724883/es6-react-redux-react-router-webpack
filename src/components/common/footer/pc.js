import React,{Component} from 'react';
import { Link } from 'react-router';
import "./pc.scss";

class Footer extends Component{
	componentDidMount() {
		window._bd_share_config = {
			//此处添加分享具体设置
			common : {		
				bdText : '卷时分享',	
				bdDesc : '',	
				bdUrl : '', 	
				bdPic : '',
			},
			share : [{
				"tag" : "share_1",
				"bdSize" : 16
			}]
		};
		(document.getElementsByTagName('head')[0]||document.body).appendChild(document.createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+(-new Date());
	}
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
			  		<div className="bdsharebuttonbox float-right" data-tag="share_1">
			  			<a className="bds_tsina" data-cmd="tsina" href="javascript:;"><i className="icon-weibo"></i></a>
			  			<a className="bds_weixin" data-cmd="weixin" href="javascript:;"><i className="icon-wechat"></i></a>
			  			<a className="bds_douban" data-cmd="douban" href="javascript:;"><i className="icon-douban"></i></a>
			  			<a className="bds_twi" data-cmd="twi" href="javascript:;"><i className="icon-twitter"></i></a>
			  		</div>
		  		</div>
		  	</div>
		)
	}
	
}
export default Footer;
