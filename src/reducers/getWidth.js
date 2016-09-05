
const width = (state = 0, action) => {
	switch (action.type) {
		case 'SET_WIDTH':
			return action.width;
		default:
      		return state;
	}
}


export default width;