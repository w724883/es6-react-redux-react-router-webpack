export const searchData = (state = {
	value:'',
	data:[]
}, action) => {
  	switch (action.type) {
    	case 'SET_SEARCH':
	      	return {
	      		value:action.data.value,
	      		data:action.data.data
	      	}
	    default:
	      	return state;
  	}
}