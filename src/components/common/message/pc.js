import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import 'zepto';
import "./pc.scss";

class Message extends React.Component {
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         phone:'',
    //         passwd:''
    //     }
    // }
    render(){
        return (
            <CSSTransitionGroup
                component="div"
                className="message"
                // transitionAppear={true}
                transitionEnter={false}
                // transitionEnterTimeout={4000}
                transitionLeaveTimeout={3000}
                // transitionAppearTimeout={10000}
                transitionName="transition-message">
                {this.props.state.message.text ? <p><span>{this.props.state.message.text}</span></p> : null}
            </CSSTransitionGroup>
        )
    }
}

export default Message;