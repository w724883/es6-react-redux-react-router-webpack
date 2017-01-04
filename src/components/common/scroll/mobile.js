import React from 'react';
import 'zepto';

import "./mobile.scss"
class Scroll extends React.Component {
    constructor(){
        super();
        this.state = {
            text:'下拉加载'
        }
    }
    componentDidMount(){
        let self = this;
        let $body = $('body');
        let height = $(window).height();
        let $placeholder = $(self.refs.placeholder);
        let top = $placeholder.offset().top;
        if(top < height){
          self.setState({
              text:''
          });
        }
        this.page = this.props.page;
        $(window).on('scroll',function(){
            let scrollTop = $body.scrollTop() || $(document).scrollTop();
            top = $placeholder.offset().top;

            if((scrollTop + height) > top){
                if(self.props.page == 0){
                    self.setState({
                        text:'翻到底了'
                    });
                    
                }else if(self.props.page != self.page){
                    self.page = self.props.page;
                    self.props.handleScroll();
                    
                }else{
                    self.setState({
                        text:'加载中...'
                    });
                }

            }else{
              self.setState({
                  text:''
              });
            }
        });
    }
    render(){
        return <div ref="placeholder" className="scroll-placeholder">{this.state.text}</div>

    }
}


export default Scroll;
