import React from 'react';
import { Link,IndexLink } from 'react-router';
import './mobile.scss';

const Nav = () => (
	<div className="nav-mobile">
		<IndexLink to="/" activeClassName="active"><i className="icon-home"></i><br /><span>主页</span></IndexLink>
		<Link to="/category" activeClassName="active"><i className="icon-product"></i><br /><span>产品</span></Link>
		<Link to="show" activeClassName="active"><i className="icon-yelp"></i><br /><span>晒单</span></Link>
		<Link to="cart" activeClassName="active"><i className="icon-carts"></i><br /><span>购物车</span></Link>
		<Link to="menber" activeClassName="active"><i className="icon-account"></i><br /><span>会员</span></Link>
	</div>
)

export default Nav;