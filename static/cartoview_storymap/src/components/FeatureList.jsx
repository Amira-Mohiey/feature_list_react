import React, { Component } from 'react';
import { Collapse, Button } from 'reactstrap';
import Loading from './Loading.jsx';
import ol from 'openlayers';
import {getUrlWithQS} from '../utils/utils.jsx';

const isWMSLayer = (layer) => {
  return layer.getSource() instanceof ol.source.TileWMS || layer.getSource() instanceof ol.source.ImageWMS;
}
const getWMSLayer = (name, layers) => {
    var wmsLayer = null;
    layers.forEach((layer) => {
        if (layer instanceof ol.layer.Group) {
            wmsLayer = getWMSLayer(name, layer.getLayers());
        }
        else if(isWMSLayer(layer)
          && layer.getSource().getParams().LAYERS == name) {
            wmsLayer = layer;
        }
        if (wmsLayer) {
            return false
        }
    });
    return wmsLayer;
};


class FeatureList extends Component {
  constructor(props) {
    super(props);
    this.layerChange = this.layerChange.bind(this);
  }
  state = {}
  componentDidMount() {
    const {layers, map} = this.props;
    console.log(this.props)

    const url = getUrlWithQS(URLS.geoserver + 'wfs', {
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typename: 'geonode:'+layers[0].name,
      outputFormat: 'application/json',
      srsname: 'EPSG:3857'
    });
    console.log(url)
  fetch(url)
  .then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
  .then((data)=> {
  // console.log(data)
  // var features = new ol.format.GeoJSON().readFeatures(data) 
 
  //var feature=new ol.format.GeoJSON().readFeatures(data);
  this.setState({features:data})
  });
}

 layerChange(event){
         this.setState({layerSelected: event.target.value},()=>{
           console.log(this.state.layerSelected)
           // should fetch new feature of a layer here
           
           });
      
     }
   render() {

  
    }
  items(features){
    //  console.log(this.state.features.features[0].id)

       var featuresItems = this.state.features.features.map(function(feature) {
      return (
        <li >{feature.id}
       
        </li>
      );
    });
    
     return (
        <ul>
          {featuresItems}
        </ul>
    );

   
  }
  
  render() {
    const {features, errors} = this.state;
    if(!features && !errors) return <Loading />;
    const {className=""} = this.props;
    //console.log(getWMSLayer(layerName, map.getLayers().getArray()));
     var listItems = this.props.layers.map(function(layer) {
      return (
       <option>{layer.name}</option>
       
      );
    });
    return (


      <div> 
    <select className="form-control" onChange={this.layerChange} >
    {listItems}
    <option>dummy</option>
  </select>
      <div className={className + ' feature-list-ct'}>
        <div className="list-group">
          {this.items(features)}
        </div>
      </div>
      </div>
    );
  }
}

export default FeatureList;
