import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';
import * as Actions from '../../../actions';
import Config from '../../../config';
import {TopFixed,BackFixed} from '../fixed/mobile';
import "zepto";
import "./mobile.scss";

class Area extends React.Component {
    constructor(props){
        super(props);
        // props.dispatch(Actions.setLoading(true));
        this.state = {
            data:props.data,
            params:[]
        };
        // console.log(props.data)
    }

    // handleClose(){
    //     this.props.handleArea(false);
    // }
    // componentWillMount(){
    //     let self = this;
    //     let dfdTasks = [this.getData()];
    //     $.when.apply(null,dfdTasks).done(function(){
    //         self.props.dispatch(Actions.setLoading(false));
    //     });

    // }
    componentWillMount(){
      let self = this;
      if(!this.props.data){
        $.ajax({
  	      type: 'POST',
  	      url: Config.api.get_region,
  	      dataType: Config.dataType,
  	      success: function(res){
  	        if(res.code == 200){
              self.setState({
                data:res.data.region
              });
  	        }else{
	            self.props.dispatch(Actions.setMessage({
	                text:res.message
	            }));
  	        }
  	      },
  	      error: function(xhr, type){
  	        self.props.dispatch(Actions.setMessage({
              text:Config.text.network
            }));
  	      }
  	    });
      }
    }
    componentDidMount() {
        let self = this;
        $(this.refs.areaItems).on('click','.J-item',function(e){
            let params = self.state.params;
            params.push($(this).data('name'));
            self.setState({
                params
            });
        })
    }
    render(){
        let data = this.state.data;
        let params = this.state.params;
        // let params = $.trim(this.state.params) ? this.state.params.split(' ') : null;
        return (
            <div className="area">
                <TopFixed data="选择地区" />
                <div className="area-container">

                    {
                        this.state.params.length ? (
                            <ul className="area-head">
                                {
                                    this.state.params.map((value,key) => (
                                        <li>{value}</li>
                                    ))
                                }
                            </ul>
                        ) : null
                    }

                    <div className="area-body" ref="areaItems">
                        {
                            data && data.length ? data.map((value,key) => {
                                if(params[0]){
                                    if(value.region_name == params[0]){
                                        if(value.child && value.child.length){
                                            return value.child.map((sv,sk) => {
                                                if(params[1]){
                                                    if(sv.region_name == params[1]){
                                                        if(sv.child && sv.child.length){
                                                            return sv.child.map((tv,tk) => {
                                                                if(params[2]){
                                                                    if(tv.region_name == params[2]){
                                                                        if(tv.child && tv.child.length){
                                                                            return tv.child.map((nv,nk) => {
                                                                                if(params[3]){
                                                                                  if(nv.region_name == params[3]){
                                                                                    // if(nv.child && nv.child.length){
                                                                                    //   this.props.handleArea({area:false,region_info_message:this.state.params.join(' '),region_id:value.id+','+sv.id+','+tv.id+','+nv.id})
                                                                                    // }else{
                                                                                      this.props.handleArea({show:false,region_info_message:this.state.params.join(' '),region_id:value.id+','+sv.id+','+tv.id+','+nv.id})
                                                                                      return false
                                                                                    // }
                                                                                  }else{
                                                                                    return null
                                                                                  }

                                                                                }else{
                                                                                   return (
                                                                                       <div className="area-item J-item" data-name={nv.region_name}>
                                                                                           {nv.region_name}
                                                                                       </div>
                                                                                   )
                                                                                }
                                                                            })
                                                                        }else{
                                                                            this.props.handleArea({show:false,region_info_message:this.state.params.join(' '),region_id:value.id+','+sv.id+','+tv.id})
                                                                            return false
                                                                        }
                                                                    }else{
                                                                        return null
                                                                    }
                                                                }else{
                                                                   return (
                                                                       <div className="area-item J-item" data-name={tv.region_name}>
                                                                           {tv.region_name}
                                                                       </div>
                                                                   )
                                                                }
                                                            })
                                                        }else{
                                                            this.props.handleArea({show:false,region_info_message:this.state.params.join(' '),region_id:value.id+','+sv.id})
                                                            return false
                                                        }
                                                    }else{
                                                        return null
                                                    }
                                                }else{
                                                    return (
                                                        <div className="area-item J-item" data-name={sv.region_name}>
                                                            {sv.region_name}
                                                        </div>
                                                    )
                                                }
                                            })
                                        }else{
                                            this.props.handleArea({show:false,region_info_message:this.state.params.join(' '),region_id:value.id})
                                            return false
                                        }
                                    }else{
                                        return null
                                    }
                                }else{
                                    return (
                                        <div className="area-item J-item" data-name={value.region_name}>
                                            {value.region_name}
                                        </div>
                                    )
                                }

                            }) : null
                        }

                    </div>

                </div>
                <BackFixed>
                    <a href="javascript:;" onClick={this.props.handleArea.bind(this,{show:false})}><i className="icon-close"></i></a>
                </BackFixed>
            </div>
        )
    }
}
export default Area;
