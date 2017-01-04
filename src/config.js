import "zepto";
let Config = {
	media:768,
	host:'http://www.cake.com/api/',
	dataType:'json',
	path:{
		home:'/',
		search:'/search',
		category:'/category',
		show:'/show',
		details:'/details',
		cart:'/cart',
		order:'/order',
		pay:'/pay',
		personal:'/personal',
		coupon:'/coupon',
		address:'/address',
		location:'/location',
		my:'/my',
		myorder:'/myorder',
		notify:'/notify',
		register:'/register',
		forget:'/forget',
		collection:'/collection',
		comment:'/comment',
		complete:'/complete',
		prompt:'/prompt'
	},
	text:{
		network:'网络不给力~~'
	}
};
if(DEBUG){
	$.extend(Config,{
		api:{
			advertisement:'/test/advertisement.json',
			hot_goods:'/test/hot_goods.json',
			new_goods:'/test/new_goods.json',
			my_like:'/test/my_like.json',
			search:'/test/search.json',
			product:'/test/category.json',
			bask:'/test/show.json',
			details:'/test/details.json',
			detailshow:'/test/detailShow.json',
			cartlist:'/test/cartlist.json',
			joincart:'/test/cartlist.json',

		},

	})
}else{
	$.extend(Config,{
		api:{
			advertisement:Config.host+'advertisement',
			hot_goods:Config.host+'hot_goods',
			new_goods:Config.host+'new_goods',
			my_like:Config.host+'my_like',
			search:Config.host+'search',
			product:Config.host+'product',
			bask:Config.host+'bask',
			details:Config.host+'details',
			goodscommentlists:Config.host+'goodscommentlists',
			cartlist:Config.host+'shopping',
			joincart:Config.host+'c_shopping',
			login:Config.host+'alogin',
			e_shopping:Config.host+'e_shopping',
			register:Config.host+'register',
			forget:Config.host+'forget_passwd',
			logout:Config.host+'logout',
			my:Config.host+'my',
			code:Config.host+'get_code',
			get_region:Config.host+'get_region',
			cart_next:Config.host+'cart_next',
			rest:Config.host+'get_user_rest',
			c_order:Config.host+'c_order',
			clicklike:Config.host+'clicklike',
			address:Config.host+'address',
			set_address:Config.host+'set_address_default',
			d_address:Config.host+'d_address',
			c_address:Config.host+'c_address',
			coupon:Config.host+'coupon',
			clicklike:Config.host+'clicklike',
			pay:Config.host+'do_pay',
			myorder:Config.host+'myorder',
			lineitem:Config.host+'lineitem',
			mymessage:Config.host+'mymessage',
			settleaccounts:Config.host+'settleaccounts',
			balance:Config.host+'balance_pay',
			getordergoods:Config.host+'getordergoods',
			uploadcommentpic:Config.host+'uploadcommentpic',
			deletecommentpic:Config.host+'deletecommentpic',
			createcomment:Config.host+'createcomment',
			editmember:Config.host+'editmember',
			score_pay:Config.host+'score_pay',
			complete:Config.host+'complete',
			d_shopping:Config.host+'d_shopping',
			cellent_order:Config.host+'cellent_order',
			recommend:Config.host+'recommend'
		},

	})
}





export default Config;
