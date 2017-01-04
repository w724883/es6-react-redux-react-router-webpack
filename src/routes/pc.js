import React from 'react';
import { Route, IndexRoute,browserHistory } from 'react-router';
import Config from '../config';
import App from '../components/pc';
import Home from '../components/home/pc';
import Category from '../components/category/pc';
import Show from '../components/show/pc';
import Search from '../components/search/pc';
import Details from '../components/details/pc';
import Cart from '../components/cart/pc';
// import Order from '../components/order/pc';
import Pay from '../components/pay/pc';
import Personal from '../components/personal/pc';
// import Coupon from '../components/coupon/pc';
// import Address from '../components/address/pc';
import Location from '../components/location/pc';
// import My from '../components/my/pc';
// import MyOrder from '../components/myorder/pc';
// import Notify from '../components/notify/pc';
// import Register from '../components/register/pc';
// import Forget from '../components/forget/pc';
import Collection from '../components/collection/pc';
import Comment from '../components/comment/pc';
// import Complete from '../components/complete/pc';
import Prompt from '../components/prompt/pc';

const leave = (nextState, replaceState) => {
	console.log(nextState);
	console.log(replaceState);
	return false;
}
const path = Config.path;
export default (
	<Route path={path.home} component={ App }>
		<IndexRoute component={ Home } />
		<Route path={path.category} component={ Category } />
		<Route path={path.show} component={ Show } />
		<Route path={path.search} component={ Search } />
		<Route path={path.details} component={ Details } />
		<Route path={path.cart} component={ Cart } />
		<Route path={path.pay} component={ Pay } />
		<Route path={path.personal} component={ Personal } />
		<Route path={path.location} component={ Location } />
		<Route path={path.collection} component={ Collection } />
		<Route path={path.comment} component={ Comment } />
		<Route path={path.prompt} component={ Prompt } />
		<Route path="/**" component={ Prompt } />
	</Route>
);
