import React from 'react';
import ReactDOM from 'react-dom';
import MapViewer from './components/MapViewer.jsx';
import SlidingMenu from './components/SlidingMenu.jsx';
import Legend from './components/Legend.jsx';
import LayersSwitcher from './components/LayersSwitcher.jsx';
import ImagesList from './components/ImagesList.jsx';
import FeatureList from './components/FeatureList.jsx';
import FeatureDetails from './components/FeatureDetails.jsx';
import CollapsibleMenuItem from './components/CollapsibleMenuItem.jsx';
import '../css/map-viewer.css';

class App extends React.Component {
  constructor(props){
    super(props);
      fetch(this.props.layerUrl)
  .then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
  .then((data)=> {
  var layer=data.objects
 this.setState({layers:layer})
 
  });
    

  } 
  state = {
    ready: false,
    sideComponent: 'list'
  }
  showFeatureList = () => {
    this.setState({
      sideComponent: 'list'
    })
  }
  showFeatureDetails = (fid, imageUrl) => {
    console.log(fid);
    console.log(imageUrl);
    this.setState({
      sideComponent: 'details',
      fid,
      imageUrl
    })
  }
  render = () => {
    const {ready, map, fid, imageUrl, sideComponent} = this.state;
    const {title, listItemTpl} = this.props;
        console.log(this.state)


    return (
      <div className="app-ct row h-100">
        <div className="col-md-4 h-100">
          <nav className="navbar navbar-toggleable navbar-inverse  bg-primary side-panel-header">
            <ul className="navbar-nav">
              <li className="nav-item">
                <SlidingMenu title={title} toggleBtnCls="nav-link">
                  <CollapsibleMenuItem label="Layers">
                    <LayersSwitcher map={map} />
                  </CollapsibleMenuItem>
                  <CollapsibleMenuItem label="Legend">
                    <Legend map={map} />
                  </CollapsibleMenuItem>
                </SlidingMenu>
              </li>
            </ul>
            {
              sideComponent != 'list' &&
              <div className="close-btn-ct justify-content-end">
                <ul className="navbar-nav">
                  <li className="nav-item ">
                    <a className="nav-link " href="#" onClick={this.showFeatureList}>&times;</a>
                  </li>
                </ul>
              </div>
            }
          </nav>
         {this.state.layers && <FeatureList
            className={sideComponent == 'list' ? "h-100" : 'hidden-xs-up' }
            map={this.state.map}
            onFeatureSelected={this.showFeatureDetails}
            layers={this.state.layers}
             />}

          {
            sideComponent == 'details' &&
              <FeatureDetails className="h-100" map={map} fid={fid} imageUrl={imageUrl} layer={layer}/>
          }

        </div>
        <div className="col  h-100">
          <MapViewer {...this.props} onMapReady={(map) => this.setState({ready:true, map})} className="h-100">
          </MapViewer>
        </div>
      </div>

    );
  }

}

global.MapViewer = {
  show: (elId, config) => {
    var viewer = React.createElement(App, config);
    ReactDOM.render(viewer, document.getElementById(elId));
  }
};
