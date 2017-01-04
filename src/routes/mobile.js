import React from 'react';
import { Route, IndexRoute,browserHistory } from 'react-router';
import Config from '../config';
import App from '../components/mobile';
import Home from '../components/home/mobile';
import Category from '../components/category/mobile';
import Show from '../components/show/mobile';
import Search from '../components/search/mobile';
import Details from '../components/details/mobile';
import Cart from '../components/cart/mobile';
import Order from '../components/order/mobile';
import Pay from '../components/pay/mobile';
import Personal from '../components/personal/mobile';
import Coupon from '../components/coupon/mobile';
import Address from '../components/address/mobile';
import Location from '../components/location/mobile';
import My from '../components/my/mobile';
import MyOrder from '../components/myorder/mobile';
import Notify from '../components/notify/mobile';
import Register from '../components/register/mobile';
import Forget from '../components/forget/mobile';
import Collection from '../components/collection/mobile';
import Comment from '../components/comment/mobile';
import Complete from '../components/complete/mobile';
import Prompt from '../components/prompt/mobile';

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
		<Route path={path.order} component={ Order } />
		<Route path={path.pay} component={ Pay } />
		<Route path={path.personal} component={ Personal } />
		<Route path={path.coupon} component={ Coupon } />
		<Route path={path.address} component={ Address } />
		<Route path={path.location} component={ Location } />
		<Route path={path.my} component={ My } />
		<Route path={path.myorder} component={ MyOrder } />
		<Route path={path.notify} component={ Notify } />
		<Route path={path.register} component={ Register } />
		<Route path={path.forget} component={ Forget } />
		<Route path={path.collection} component={ Collection } />
		<Route path={path.comment} component={ Comment } />
		<Route path={path.complete} component={ Complete } />
		<Route path={path.prompt} component={ Prompt } />
		<Route path="/**" component={ Prompt } />
	</Route>
);
