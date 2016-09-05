import React from 'react';
import { Route, IndexRoute,browserHistory } from 'react-router';
import Config from '../config';
import App from '../components/app';
import Home from '../components/home';
import Category from '../components/category';
import Show from '../components/show';
import Search from '../components/search';
import Details from '../components/details';
// import 'zepto';
// 设备宽度
// $(window).on('resize',function(e){
// 	let $width = $(window).width();
// 	if($width < media){
// 		browserHistory.push('/moblie');
// 	}else{
// 		browserHistory.push('/pc');
// 	}
// }).trigger('resize');
const path = Config.path;
export default (
	<Route path={path.home} component={ App }>
		<IndexRoute component={ Home } />
		<Route path={path.category} component={ Category } />
		<Route path={path.show} component={ Show } />
		<Route path={path.search} component={ Search } />
		<Route path={path.details} component={ Details } />
	</Route>
);
