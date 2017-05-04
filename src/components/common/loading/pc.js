import React,{Component} from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Layer from '../layer/pc';
import "./pc.scss";
import gif from "../../../static/imgs/loading.gif";

class Loading extends Component{
    // handleTouchstart(e){
    //  e.preventDefault();
    //  e.stopPropagation();
    //  return false;
    // }
    render(){
        return (
            <CSSTransitionGroup
                component="div"
                // transitionAppear={true}
                transitionEnter={false}
                // transitionEnterTimeout={4000}
                transitionLeaveTimeout={400}
                // transitionAppearTimeout={4000}
                transitionName="transition-layer">
                    {this.props.state.loading ? <Layer><div className="loading" style={{backgroundImage:"url("+gif+")"}}></div></Layer> : null}
            </CSSTransitionGroup>

        )
    }
}
// class Waiting extends Component{
//     render(){
//         return <div className="waiting" style={{backgroundImage:"url("+gif+")"}}></div>
//     }
// }
let Waiting = `<div class="waiting" style="background-image:url(${gif})"></div>`

export {Loading,Waiting};
