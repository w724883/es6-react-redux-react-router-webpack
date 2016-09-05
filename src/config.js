let Config = {
	media:768,
	path:{
		home:'/',
		search:'/search',
		category:'/category',
		show:'/show',
		details:'/details'
	}
};
if(DEBUG){
	Object.assign(Config,{
		api:{
			advertisement:'/test/advertisement.json',
			hot_goods:'/test/hot_goods.json',
			new_goods:'/test/new_goods.json',
			my_like:'/test/my_like.json',
			search:'/test/search.json',
			product:'/test/category.json',
			bask:'/test/show.json',
			details:'/test/details.json'
		},
		
	})
}else{
	Object.assign(Config,{
		api:{
			advertisement:'/advertisement',
			hot_goods:'/hot_goods',
			new_goods:'/new_goods',
			my_like:'/my_like',
			search:'/search',
			product:'/product',
			bask:'/bask',
			details:'/details'
		},
		
	})
}





export default Config;