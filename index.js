/* geoconverters */

const fs = require('fs');
const topojson = require('topojson');
const kml = require('togeojson').kml;
const gpx = require('togeojson').gpx;
const jsdom = require('jsdom').jsdom;
const shp = require('shpjs');

function convertSHPtoGeoJSON(shp_file, gj_file, callback) {
  shp(shp_file).then(function (gj) {
    fs.writeFile(gj_file, JSON.stringify(gj), function (err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  });
}

function convertKMLtoGeoJSON(kml_file, gj_file, callback) {
  fs.readFile(kml_file, { encoding: 'utf-8' }, function (err, kml_source) {
    if (err) {
      return callback(err);
    }
    var kmldom;
    try {
      kmldom = jsdom(kml_source);
    } catch(e) {
      return callback('KML was not valid XML format');
    }
    var gj = kml(kmldom, { styles: true });
    fs.writeFile(gj_file, JSON.stringify(gj), function (err) {
      if (err) {
        throw err;
      }
    });
  });
}

function convertGPXtoGeoJSON(gpx_file, gj_file, callback) {
  fs.readFile(gpx_file, { encoding: 'utf-8' }, function (err, gpx_source) {
    if (err) {
      return callback(err);
    }
    var gpxdom;
    try {
      gpxdom = jsdom(gpx_source);
    } catch(e) {
      return callback('GPX was not valid XML format');
    }
    var gj = gpx(gpxdom);
    fs.writeFile(gj_file, JSON.stringify(gj), function (err) {
      if (err) {
        throw err;
      }
    });
  });
}

function convertTopoJSONtoGeoJSON(tj_file, gj_file, callback) {
  fs.readFile(tj_file, { encoding: 'utf-8' }, function (err, tj_source) {
    if (err) {
      return callback(err);
    }
    var tj = JSON.parse(tj_source);
    var key = Object.keys(tj.objects)[0];
    var gj = topojson.feature(tj, tj.objects[key]);
    fs.writeFile(gj_file, JSON.stringify(gj), function (err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  });
}

function convertGeoJSONtoTopoJSON(gj_file, tj_file, callback) {
  fs.readFile(gj_file, { encoding: 'utf-8' }, function (err, gj_source) {
    if (err) {
      return callback(err);
    }
    var gj;
    try {
      gj = JSON.parse(gj_source);
    } catch (e) {
      return callback('GeoJSON file was not valid JSON');
    }
    var tj = topojson.topology({ geo: gj }, {
      'verbose': true,
      'pre-quantization': 1000000,
      'post-quantization': 10000,
      'coordinate-system': 'auto',
      'stitch-poles': true,
      'minimum-area': 0,
      'preserve-attached': true,
      'retain-proportion': 0,
      'force-clockwise': false,
      'property-transform': function (feature) {
        return feature.properties;
      }
    });
    fs.writeFile(tj_file, JSON.stringify(tj), function (err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  });
}

module.exports = {
  convertKMLtoGeoJSON: convertKMLtoGeoJSON,
  convertGPXtoGeoJSON: convertGPXtoGeoJSON,
  convertGeoJSONtoTopoJSON: convertGeoJSONtoTopoJSON,
  convertTopoJSONtoGeoJSON: convertTopoJSONtoGeoJSON,
  convertSHPtoGeoJSON: convertSHPtoGeoJSON
};
