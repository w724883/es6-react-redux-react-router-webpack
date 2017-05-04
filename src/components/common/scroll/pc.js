import React from 'react';
import 'zepto';

import "./pc.scss"
class Scroll extends React.Component {
    constructor(){
        super();
        this.page = 1;
        this.state = {
            text:'加载更多'
        }
    }
    hanldeClick(){
        if(this.props.page > this.page){
            this.props.handleScroll();
            this.setState({
                text:'加载中...'
            });
            this.page = this.props.page;
        }
    }
    componentWillUpdate(props) {
        if(props.page > 0 && props.page < this.page){
            this.page = 1;
            this.setState({
                text:'加载更多'
            });
        }
    }
    render(){
        return <div ref="placeholder" onClick={this.hanldeClick.bind(this)} className="scroll-placeholder">{this.props.page == 0 ? '翻到底了' : (this.props.page > this.page ? '加载更多' : this.state.text)}</div>

    }
}


export default Scroll;
