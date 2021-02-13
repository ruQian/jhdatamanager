<template>  
  <div id="content">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
  //import HelloWorld from './components/HelloWorld.vue'
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import XYZ from 'ol/source/XYZ';
  //import {boundingExtent} from 'ol/extent';
  //import {transformExtent} from 'ol/proj';
  import MousePosition from "ol/control/MousePosition";
  import {createStringXY} from 'ol/coordinate';
  //import { defaults as defaultControls} from "ol/control";
  //import Overlay from "ol/Overlay";
  //import { fromLonLat, transform, toLonLat } from "ol/proj";
  //import fromLonLat from "ol/proj";
  import Feature from 'ol/Feature';
  //import Draw from 'ol/interaction/Draw';
  import {Vector as VectorSource} from 'ol/source';
  import {Fill, Icon, Stroke, Style} from 'ol/style';
  import {LineString, Point, Polygon} from 'ol/geom';
  //import {defaults as defaultInteractions} from 'ol/interaction';
  import {Vector as VectorLayer} from 'ol/layer';
  //import VectorSource from 'ol/source/Vector';


  export default {
    name: 'Mapper',
    data() {
        return {
            map: null,
            featureLayer:null,
            featureSource:null,
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
          //var extent = boundingExtent(
          //  [[73.68310533463954,55.71875543651788],
          //  [135.19995117187501,15.911160631253153]]);
          this.map = new Map({
            target: target,
            //controls: defaultControls({ zoom: false }).extend([]),
            layers: [
              new TileLayer({
                source: new XYZ({
                  url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                })
              })],
            view: new View({
              center: [0, 0],
              zoom: 2,
              //extent: transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
            })
          });
          console.log('创建地图');
          console.log(this.map);
          this.map.addControl(mousePositionControl);
        },
        initFeatureLayer(){
          this.featureLayer = new VectorLayer({
                style: new Style({
                  image: new Icon({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
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
        initData()
        {        
          var pF = new Feature(new Point([0, 0]));
          this.featureSource.addFeature(pF);
          console.log(this.pointFeaturs);
        } 
    },
    mounted() {
        console.log('初始化地图');
        this.initMap();
        console.log('开始标注');
        this.initFeatureLayer();
        this.initData();
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
</style>
