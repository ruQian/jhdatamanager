<template>  
  <div id="content">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import XYZ from 'ol/source/XYZ';
  import MousePosition from "ol/control/MousePosition";
  import {createStringXY} from 'ol/coordinate';
  import Feature from 'ol/Feature';
  import {Vector as VectorSource} from 'ol/source';
  import {Fill, Icon, Stroke, Style} from 'ol/style';
  import {LineString, Point, Polygon} from 'ol/geom';
  import {Vector as VectorLayer} from 'ol/layer';
  import { Pointer as PointerInteraction,} from 'ol/interaction';
  import { fromLonLat} from "ol/proj";
  import {fetchData} from '../api/index';
  import {Control} from 'ol/control';
  import {defaults as defaultControls} from 'ol/control';

  export default {
    name: 'Mapper',
    data() {
        return {
            //当前的工作模式
            mode:0,
            map: null,
            editButton:null,
            mapdata:[],
            featureLayer:null,
            featureSource:null,
            coordinate_ :null,
            feature_ : null,
            features:null,
            RotateNorthControl:null,
            source:new VectorSource({wrapX: false}),
            pointFeature : new Feature(new Point([0, 0])),
            //pointFeature2 : new Feature(new Point([0, 1])),
            pointFeaturs: [],
            lineFeature: new Feature(
              new LineString([
              [-1e7, 1e6],
              [-1e6, 3e6] ])),
            polygonFeature :new Feature(
              new Polygon([
                [
                  [-3e6, -1e6],
                  [-3e6, 1e6],
                  [-1e6, 1e6],
                  [-1e6, -1e6],
                  [-3e6, -1e6] ] ])
            )
        };
    },
    methods: {
        getData() {
          console.log('获取地图数据');
          fetchData( ).then(res => {
                    if(res != null)
                    {
                      console.log('收到了数据!');
                      console.log(res);
                      //确保有数据
                      this.mapdata = res;
                      this.mapdata.forEach(feature =>{
                            console.log('添加标注点 :' + feature.lon + '-' + feature.lat);
                            this.AddFeature(feature.lon, feature.lat);
                        }
                      )
                    }
                });
        },
        /**
         * 初始化一个 openlayers 地图
         */
        initMap() {
          let target = "map"; //跟页面元素的 id 绑定来进行渲染
          // 向地图添加 MousePosition
          var mousePositionControl = new MousePosition({
            //坐标格式
            coordinateFormat: createStringXY(5),
            //地图投影坐标系（若未设置则输出为默认投影坐标系下的坐标）
            projection: "EPSG:4326",
            //坐标信息显示样式类名，默认是'ol-mouse-position'
            className: "custom-mouse-position",
            //显示鼠标位置信息的目标容器
            target: document.getElementById("mouse-position"),
            //未定义坐标的标记
            undefinedHTML: "&nbsp;"
          });
          var editHandle = this.handleRotateNorth;
          //var extent = boundingExtent(
          //  [[73.68310533463954,55.71875543651788],
          //  [135.19995117187501,15.911160631253153]]);
          var RotateNorthControl = /*@__PURE__*/(function (Control) {
              function RotateNorthControl(opt_options) {
              console.log('RotateNorthControl');
              var options = opt_options || {};
              this.editButton = document.createElement('button');
              this.editButton.innerHTML = 'A';
              var element = document.createElement('div');
              element.className = 'rotate-north ol-unselectable ol-control';
              element.appendChild(this.editButton);
              Control.call(this, {
                element: element,
                target: options.target
              });
              this.editButton.addEventListener('click', this.handleRotateNorth.bind(this), false);
            }
            if ( Control )
            {
              console.log('Control');
              RotateNorthControl.__proto__ = Control;
            } 
            console.log(Control);
            var u = Object.create( Control && Control.prototype );
            RotateNorthControl.prototype = u;
            
            RotateNorthControl.prototype = Object.create( Control && Control.prototype );
            RotateNorthControl.prototype.constructor = RotateNorthControl;
            RotateNorthControl.prototype.handleRotateNorth = editHandle;
            return RotateNorthControl;
          }(Control));


          this.map = new Map({
            target: target,
            controls: defaultControls().extend([new RotateNorthControl()]),
            layers: [
              new TileLayer({
                source: new XYZ({
                  url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                })
              })],
            view: new View({
              center: fromLonLat([103, 34]),
              zoom: 2,
              //extent: transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
            })
          });
          console.log('创建地图');
          console.log(this.map);
          this.map.addControl(mousePositionControl);


          var pi = new PointerInteraction({
                              handleDownEvent: this.handleDownEvent,
                              handleDragEvent: this.handleDragEvent,
                              handleMoveEvent: this.handleMoveEvent,
                              handleUpEvent: this.handleUpEvent,
                            });
          this.map.addInteraction(pi);
        },
        initFeatureLayer(){
          this.featureLayer = new VectorLayer({
                style: new Style({
                  image: new Icon({
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 1,
                    src: './data/position.png',
                  }),
                  stroke: new Stroke({
                    width: 3,
                    color: [255, 0, 0, 1],
                  }),
                  fill: new Fill({
                    color: [0, 0, 255, 0.6],
                  }),
                }),
              });
              console.log("添加Vector图层");
              this.map.addLayer(this.featureLayer);
              this.featureSource = new VectorSource();
              this.featureLayer.setSource(this.featureSource);
        },
        AddFeature(lon, lat)
        {
          var pp = fromLonLat([lon, lat]);
          console.log('point - '+pp);
          var pF = new Feature(
                  {
                    geometry: new Point(pp)
                  }
                  );
          this.featureSource.addFeature(pF);
        },
        handleDownEvent(evt) {
          var map = evt.map;
          var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
          });

          if (feature) {
            this.coordinate_ = evt.coordinate;
            this.feature_ = feature;
          }

          return !!feature;
        },
        handleDragEvent(evt) {
          console.log('handleDragEvent');
          var deltaX = evt.coordinate[0] - this.coordinate_[0];
          var deltaY = evt.coordinate[1] - this.coordinate_[1];

          var geometry = this.feature_.getGeometry();
          console.log(deltaX +' ' +deltaY);
          geometry.translate(deltaX, deltaY);

          this.coordinate_[0] = evt.coordinate[0];
          this.coordinate_[1] = evt.coordinate[1];
        },
        handleMoveEvent(evt) {
          console.log('handleMoveEvent');
          if (this.cursor_) {
            var map = evt.map;
            var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
              return feature;
            });
            var element = evt.map.getTargetElement();
            if (feature) {
              if (element.style.cursor != this.cursor_) {
                this.previousCursor_ = element.style.cursor;
                element.style.cursor = this.cursor_;
              }
            } else if (this.previousCursor_ !== undefined) {
              element.style.cursor = this.previousCursor_;
              this.previousCursor_ = undefined;
            }
          }
        },
        handleUpEvent() {
          this.coordinate_ = null;
          this.feature_ = null;
          return false;
        },
        handleRotateNorth() 
            {
              console.log('handleRotateNorth : ' + this.mode);
              console.log(this.editButton);
              if(this.mode == 0)
              {
                //处于编辑模式
                this.mode = 1;
                this.editButton.innerHTML('O');
                console.log('O');
              }
              if(this.mode == 1)
              {
                //处于编辑模式
                this.mode = 0;
                this.editButton.innerHTML('E');
                console.log('E');
              }
              //this.getMap().getView().setRotation(90);
            }
    },
    mounted() {
        console.log('获取地图数据.');
        this.getData();
        console.log('初始化地图');
        this.initMap();
        console.log('开始标注');
        this.initFeatureLayer();
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.map {
        width: 100%;
        height:100vh;
      }
.rotate-north {
  top: 65px;
  left: .5em;
}
</style>
