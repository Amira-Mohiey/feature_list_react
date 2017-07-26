import React, { Component } from 'react';
import { Collapse, Button } from 'reactstrap';
import Loading from './Loading.jsx';
import ol from 'openlayers';
import { getUrlWithQS } from '../utils/utils.jsx';
import ReactPaginate from 'react-paginate';
const isWMSLayer = (layer) => {
	return layer.getSource() instanceof ol.source.TileWMS || layer.getSource() instanceof ol
		.source.ImageWMS;
}
const getWMSLayer = (name, layers) => {
	var wmsLayer = null;
	layers.forEach((layer) => {
		if (layer instanceof ol.layer.Group) {
			wmsLayer = getWMSLayer(name, layer.getLayers());
		} else if (isWMSLayer(layer) &&
			layer.getSource().getParams().LAYERS == name) {
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
		this.handlePageClick = this.handlePageClick.bind(this);
	}
	state = {
    perPage:10
  }
	componentDidMount() {
		const { layers, map } = this.props;
		console.log(this.props)

		const url = getUrlWithQS(URLS.geoserver + 'wfs', {
			service: 'WFS',
			version: '2.0.0',
			request: 'GetFeature',
			typename: 'geonode:' + layers[0].name,
			outputFormat: 'application/json',
			srsname: 'EPSG:3857'
		});
		console.log(layers[0])
		fetch(url)
			.then(function(response) {
				if (response.status >= 400) {
					throw new Error("Bad response from server");
				}
				return response.json();
			})
			.then((data) => {
				console.log(data.totalFeatures)
				var features = new ol.format.GeoJSON().readFeatures(data)
        console.log(features[0].getProperties());
        console.log(Math.ceil(data.totalFeatures/this.state.perPage))

				this.setState({ allfeatures:features,pageCount:Math.ceil(data.totalFeatures/this.state.perPage )})
        var sliced = this.state.allfeatures.slice(1, this.state.perPage+1)
        this.setState({ features:sliced})
			});
	}
	handlePageClick(data) {
		console.log(data.selected);
    console.log(this.state.features)
    console.log("cond",this.state.perPage*data.selected, this.state.perPage*data.selected+1);
    var sliced = this.state.allfeatures.slice(this.state.perPage*data.selected, this.state.perPage*(data.selected+1))
    this.setState({ features:sliced})

	}
	_handleFeatureClick (event,feature) {
    event.preventDefault();
    console.log(feature.getGeometry().getExtent());
    this.props.map.getView().fit(feature.getGeometry().getExtent(), this.props.map.getSize());

  console.log(feature);

	}
	layerChange(event) {
		this.setState({ layerSelected: event.target.value }, () => {
			console.log(this.state.layerSelected)
			// should fetch new feature of a layer here

		});

	}
	render() {


	}
	items(features) {
		//  console.log(this.state.features.features[0].id)

		var featuresItems = this.state.features.map((feature)=> {
			return (

				<li className="list-group-item" onClick={(e)=>this._handleFeatureClick(e,feature)}>
          {feature.getProperties().sec_name_e}</li>
			);
		});

		return (
			<div >
        <ul className="list-group">
          {featuresItems}
        </ul>
         <div style={{padding:20}}>
           <ReactPaginate  previousLabel={"previous"}
                                  nextLabel={"next"}
                                  breakLabel={<a href="">...</a>}
                                  breakClassName={"break-me"}
                                  pageCount={this.state.pageCount}
                                  marginPagesDisplayed={2}
                                  pageRangeDisplayed={5}
                                  pageClassName={"page-item"}
                                  pageLinkClassName={"page-link"}
                                  previousClassName={"page-item"}
                                  previousLinkClassName={"page-link"}
                                  nextClassName={"page-item"}
                                  nextLinkClassName={"page-link"}
                                  onPageChange={this.handlePageClick}
                                  containerClassName={"pagination"}
                                  subContainerClassName={"Page navigation"}
                                  activeClassName={"active"} />

         </div>






      </div>
		);


	}

	render() {
		const { features, errors } = this.state;
		if (!features && !errors) return <Loading />;
		const { className = "" } = this.props;
		//console.log(getWMSLayer(layerName, map.getLayers().getArray()));
		var listItems = this.props.layers.map(function(layer) {
			return (
				<option>{layer.name}</option>

			);
		});
		return (


			<div >

    <select className="form-control" onChange={this.layerChange} >
    {listItems}
    <option>dummy</option>
  </select>
      <div>
        <div  style={{maxHeight: '800px'}} >
          {this.items(features)}
        </div>

      </div>


      </div>
		);
	}
}

export default FeatureList;
