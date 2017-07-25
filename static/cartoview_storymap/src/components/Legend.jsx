import React, { Component } from 'react';
import ol from 'openlayers';
import ArcGISRestService from 'boundless-sdk/services/ArcGISRestService';

class ArcGISLegend extends Component{
  render(){
    if(this.state && this.state.legendInfo){
      var layers = this.state.legendInfo.layers;
      const style = {width:'auto', height: 'auto'};
      return <div>
        {
          layers.map( l => {
            return l.legend.map(legend => <div>
              <img style={style} src={'data:' + legend.contentType + ';base64,' + legend.imageData} />
              <span>{legend.label}</span>
            </div>)
          })
        }
      </div>
    }
    return null
  }
  componentDidMount(){
    var layer = this.props.layer;
    var source = layer.getSource();
    var url = source.getUrls()[0];
    ArcGISRestService.getLegend(url, (legendInfo) => {
      this.setState({legendInfo});
    });
  }
}

class Legend extends Component{
  render(){
    const {map} = this.props;
    if(!map) return null;
    const legends = this.getLegends(map.getLayers().getArray())
    return <div>
      {legends}
    </div>
  }
  getLegends(layers){
    var legends = [];
    layers.forEach((layer) => {
      if(layer instanceof ol.layer.Group){
        legends = legends.concat(this.getLegends(layer.getLayers()))
      }
      else if (layer.getVisible() && this.hasLegend(layer)) {
        if (this.isWMS(layer)) {
          var s = layer.getSource(), p = s.getParams();
          var url = s.getUrls()[0];
           url+= (url.indexOf("?") == -1) ? "?" : "&";
          url += "layer=" + p.LAYERS ;
          url += "&request=GetLegendGraphic&format=image%2Fpng&transparent=true&legend_options=fontAntiAliasing:true;fontSize:14;&width=30&height=30"
          url += "&style=" + (p.STYLES || '')
          legends.push(<div>
            <h5>{ layer.get('title') }</h5>
            <img src={url}/>
           </div> );
        }
        else if (layer.getSource() instanceof ol.source.TileArcGISRest) {
          legends.push(<div> <h5>{layer.get('title')}</h5> <ArcGISLegend layer={layer}/></div>);
        }
      }
    });
    return legends;
  }

  hasLegend(layer){
    return (layer instanceof ol.layer.Tile && layer.getSource() instanceof ol.source.TileWMS) ||
        (layer instanceof ol.layer.Image && layer.getSource() instanceof ol.source.ImageWMS) ||
        (layer instanceof ol.layer.Tile && layer.getSource() instanceof ol.source.TileArcGISRest);
  }

  isWMS(layer){
    return layer.getSource() instanceof ol.source.TileWMS || layer.getSource() instanceof ol.source.ImageWMS;
  }

}



export default Legend;
