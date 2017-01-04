import React from 'react';
// import { browserHistory } from 'react-router';
import Num from '../number/mobile';
import 'zepto';
import Config from '../../../config';
// import * as Actions from '../../../actions';
// import recommend from '../../../static/imgs/recommend.jpg';
class Recommend extends React.Component {
    constructor(props){
        super();
        this.state = null;
    }
    handleLink(link){
        if(link){
           // browserHistory.push(link); 
           window.location.href = link;
        }
        
    }
    componentWillMount() {
        let self = this;
        $.ajax({
          type: 'POST',
          url: Config.api.recommend,
          // data:this.state,
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                self.setState(res.data);

            }else{
                console.log(res.message);
            }
          },
          error: function(xhr, type){
            console.log(res.message);
          }
        });     
    }
    render(){
        if(this.state){
            return (
                <div className="pop pop-recommend" onTouchMove={this.props.handleTouchMove}>
                    <div className="pop-bg" onClick={this.props.handleClose}></div>
                    <div className="pop-box">
                        <div className="recommend">
                            <div className="recommend-head" onClick={this.handleLink.bind(this,this.state.link)} style={{backgroundImage:"url("+this.state.images+")"}}></div>
                            <div className="recommend-content" dangerouslySetInnerHTML={{__html:this.state.contents}}>
                            </div>
                        </div>
                        <a href="javascript:;" onClick={this.props.handleClose} className="icon-close pop-close"></a>
                    </div>
                </div>
            )
        }else{
            return null;
        }
    }
}


export default Recommend;