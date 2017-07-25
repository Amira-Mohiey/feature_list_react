import React, { Component } from 'react';
import ol from 'openlayers';
import {Table} from 'reactstrap';

const isUrl = (str) => {
  var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str && str.length < 2083 && url.test(str);
}
const getDisplayText = (str) => {
  if(isUrl(str)) return <a target="_blank" href={str}>{str}</a>
  else return str;
}
class FeatureDetails extends Component {
  state = {}

  render() {
    const {fid, layer, imageUrl} = this.props;
    const {feature} = this.state;
    // console.log(feature);
    console.log(fid);
    console.log(imageUrl);
    return (
      <div className={ ' feature-details-ct'}>
        <img src={imageUrl} className="w-100"/>
        <Table bordered>
          <tbody>
            {
              // Object.keys(feature.properties).map((key) => {
              //   return (<tr>
              //     <th>{key}</th>
              //     <td>{getDisplayText(feature.properties[key])}</td>
              //   </tr>)
              // })
            }
          </tbody>
        </Table>
      </div>
    );
  }
}

export default FeatureDetails;
