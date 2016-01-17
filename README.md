# geoconverters

Combines several Node modules to convert from one geo file to another

## Formats accepted

convertKMLtoGeoJSON (uses MapBox's togeojson)

convertGPXtoGeoJSON (uses MapBox's togeojson)

convertGeoJSONtoTopoJSON (uses Mike Bostock's topojson)

convertTopoJSONtoGeoJSON (uses Mike Bostock's topojson)

convertSHPtoGeoJSON (uses Calvin Metcalf's shpjs)

## Usage

```javascript
const converters = require('geoconverters');
converters.convertGeoJSONtoTopoJSON('original.geojson', 'output.topojson', function (err) {
  if (err) {
    throw err;
  }
  console.log('output.topojson was saved');
});
```

## License

MIT license
