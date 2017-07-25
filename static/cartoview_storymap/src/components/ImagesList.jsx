import React, { Component } from 'react';
import { Collapse, Button, Card, CardImg, CardText, CardBlock,
  CardTitle, CardSubtitle } from 'reactstrap';
import Loading from './Loading.jsx';
import ol from 'openlayers';
import {getUrlWithQS} from '../utils/utils.jsx';




class FeatureList extends Component {
  state = {}
  componentDidMount() {
    const {layerName, map} = this.props;
    const url =`${ URLS.imagesUrl }?layer=${layerName.split(":").pop()}`;

    fetch(url, {
      credentials: 'include',
    }).then(res => res.json()).then(res => {
      console.log(res);
      this.setState({images: res})
    })
  }
  items(images){
    const {layerName } = this.props;

    return images.map((image) => {
      // const text = listItemTpl.replace(/\{{2}\w+\}{2}/gm, (match) => {
      //   const propName = match.substr(2, match.length -4)
      //   return f.properties[propName];
      // });
      const imageUrl = `${URLS.viewImageBaseUrl}${layerName.split(":").pop()}/${image.pk}`;
      const onFeatureSelected = (e) => {
        e.preventDefault();
        this.props.onFeatureSelected(image.fields.feature, imageUrl);
      }
      return (<div onClick={onFeatureSelected} className="col-lg-4 col-md-4 col-sm-4 col-xs-6">
      <Card>
        <CardImg top width="100%" src={ imageUrl } alt="" />
        <CardBlock>
          <CardTitle>Card title</CardTitle>
        </CardBlock>
      </Card>
      </div>);
    })
  }
  render() {
    const {images, errors} = this.state;
    if(!images && !errors) return <Loading />;
    const {className=""} = this.props;
    //console.log(getWMSLayer(layerName, map.getLayers().getArray()));

    return (
      <div className={className + ' feature-list-ct'}>
        <div className="row">
          {this.items(images)}
        </div>
      </div>
    );
  }
}

export default FeatureList;
