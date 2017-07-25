import React, { Component } from 'react';
import ol from 'openlayers';


class LayerItem extends Component{
  render(){
    const {layer} = this.props;
    return <div>{layer.get('title')}</div>
  }
}

class LayersSwitcher extends Component{
  render(){
    const {map} = this.props;
    if(!map) return null;
    return <div>
      {this.getItems(map.getLayers().getArray())}
    </div>
  }
  getItems(layers){
    var items = [];
    layers.forEach((layer) => {
      if(layer instanceof ol.layer.Group){
        items = items.concat(this.getItems(layer.getLayers()))
      }
      else {
        items.push(<LayerItem layer={layer} />);
      }
    });
    return items;
  }


}



export default LayersSwitcher;
