import React from 'react';
import { Route, IndexRoute,browserHistory } from 'react-router';
import Config from '../config';
import App from '../components/app';
import Home from '../components/home/mobile';
import Category from '../components/category/mobile';
import Show from '../components/show/mobile';
import Search from '../components/search/mobile';
import Details from '../components/details/mobile';
import Cart from '../components/cart/mobile';
import Order from '../components/order/mobile';
import Pay from '../components/pay/mobile';
import Personal from '../components/personal/mobile';

const enter = (nextState, replaceState) => {
	console.log(nextState);
	console.log(replaceState);
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
		<Route path={path.order} component={ Order } onEnter={enter} />
		<Route path={path.pay} component={ Pay } />
		<Route path={path.personal} component={ Personal } />
	</Route>
);
