<template>  
  <div id="content">
    <div id="map" class="map"></div>
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
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
  //import {Fill, Icon, Stroke, Style} from 'ol/style';
  import {Icon, Style} from 'ol/style';
  import {LineString, Point, Polygon} from 'ol/geom';
  import {Vector as VectorLayer} from 'ol/layer';
  import {Pointer as PointerInteraction,} from 'ol/interaction';
  import {toLonLat, fromLonLat} from "ol/proj";
  import {fetchData, uploadFeatureApi} from '../api/index';
  import {Control} from 'ol/control';
  import {defaults as defaultControls} from 'ol/control';
  import {generateUUID} from '../utils/utils';
  import Overlay from 'ol/Overlay';  
  import $ from 'jquery';
  //import {toStringHDMS} from 'ol/coordinate';
  import {boundingExtent} from 'ol/extent';
  import {transformExtent} from 'ol/proj';
  import TileImage from 'ol/source/TileImage';
  import TileGrid from 'ol/tilegrid/TileGrid';
  import BingMaps from 'ol/source/BingMaps';
  import Projection from 'ol/proj/Projection';
  import {addProjection, addCoordinateTransforms} from 'ol/proj';
  import projzh from 'projzh';
  export default {
    name: 'Mapper',
    data() {
        return {
            //当前的工作模式 0 普通  1 添加标注
            mode:0,
            map: null,
            editButton:null,
            mapdata:[],
            featureLayer:null,
            featureSource:null,
            coordinate_ :null,
            container:null,// = document.getElementById('popup');
            content:null,// = document.getElementById('popup-content');
            closer:null,// = document.getElementById('popup-closer');
            overlay:null,

            //鼠标点击拖动feature需要的变量
            feature_ : null,
            //添加标注需要的变量
            featureAdd:null,
            editfeature_ : null,
            features:null,
            RotateNorthControl:null,
            source:new VectorSource({wrapX: false}),
            pointFeaturs: [],
            //正常
            pointStyle:null,
            //编辑
            editStyle:null,

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
                            this.AddFeature(feature.lon, feature.lat, this.pointStyle, feature.uid);
                        }
                      )
                    }
                });
        },
        //初始化点风格
        initFeatureStyle()
        {
            this.editStyle = new Style({
                  image: new Icon({
                    anchor: [16, 16],
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 1,
                    src: './data/addFeature.png',
                  })
                });
            this.pointStyle = new Style({
                  image: new Icon({
                    anchor: [16, 16],
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 1,
                    src: './data/position.png',
                  })
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
          var editHandle = this.handleAddFeature;
          var btn = null;
          var extent = boundingExtent(
            [[73.68310533463954,55.71875543651788],
            [135.19995117187501,15.911160631253153]]);
          var RotateNorthControl = /*@__PURE__*/(function (Control) 
          {
              function RotateNorthControl(opt_options) 
              {
                  var options = opt_options || {};
                  btn = document.createElement('button');
                  btn.innerHTML = 'A';
                  var element = document.createElement('div');
                  element.className = 'rotate-north ol-unselectable ol-control';
                  element.appendChild(btn);
                  Control.call(this, {
                    element: element,
                    target: options.target
                  });
                  btn.addEventListener('click', this.handleRotateNorth.bind(this), false);
              }
              if ( Control )
              {
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

          //baidu map       
                  /**
         *  定义百度投影，这是实现无偏移加载百度地图离线瓦片核心所在。
         *  网上很多相关资料在用OpenLayers加载百度地图离线瓦片时都认为投影就是EPSG:3857(也就是Web墨卡托投影)。
         *  事实上这是错误的，因此无法做到无偏移加载。
         *  百度地图有自己独特的投影体系，必须在OpenLayers中自定义百度投影，才能实现无偏移加载。
         *  百度投影实现的核心文件为bd09.js，在迈高图官网可以找到查看这个文件。
         */
        const projBD09 = new Projection({
          // baidu或者BD:09
          code: 'BD:09',
          extent: [-20037726.37, -11708041.66, 20037726.37, 12474104.17],
          units: 'm',
          axisOrientation: 'neu',
          global: false
          });
          addProjection(projBD09);
          addCoordinateTransforms('EPSG:4326', projBD09, projzh.ll2bmerc, projzh.bmerc2ll);
          addCoordinateTransforms('EPSG:3857', projBD09, projzh.smerc2bmerc, projzh.bmerc2smerc);

          // 自定义分辨率和瓦片坐标系
          const rlProject = [];

          // 计算百度使用的分辨率
          for (let i = 0; i <= 18; i++) {
              rlProject[i] = Math.pow(2, 18 - i);
          }
          const tilegrid = new TileGrid({
              origin: [0, 0],    // 设置原点坐标
              resolutions: rlProject // 设置分辨率
          });

          /**
          * 加载百度地图离线瓦片不能用ol.source.XYZ，ol.source.XYZ针对谷歌地图（注意：是谷歌地图）而设计，
          * 而百度地图与谷歌地图使用了不同的投影、分辨率和瓦片网格。
          * 因此这里使用ol.source.TileImage来自行指定投影、分辨率、瓦片网格。
          */
          const baiduSource = new TileImage({
              projection: 'BD:09',
              tileGrid: tilegrid,
              tilePixelRatio: 2,
              tileUrlFunction: (tileCoord, pixelRatio, proj) => {
                  if (!tileCoord) {
                      return;
                  }
                  const z = tileCoord[0];
                  let x = tileCoord[1];
                  // 注意，在openlayer3中由于载地图的方式是右上递增
                  // let y: number | string = tileCoord[2];
                  // 而openlayer6中是右下递增，所以y的值需要注意
                  // 6版本需要取负值,同时注意要减一，否则缩放有问题
                  let y  = -tileCoord[2] - 1;

                  // 百度瓦片服务url将负数使用M前缀来标识
                  if (x < 0) {
                      x = 'M' + (-x);
                  }
                  if (y < 0) {
                      y = 'M' + (-y);
                  }
                  // online3的3是用来分流的，还可以是其他路径
                  // udt应该表示的是地图发布日期。p表示地图上的信息，scaler表示缩放
                  // 0表示不显示地名等标注信息，只单纯的地图地图，1表示显示地名信息
                  return `http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=${x}&y=${y}&z=${z}&styles=pl&udt=20190426&scaler=2&p=1`;
              }
          });
          //baidumapend
          this.map = new Map({
            target: target,
            controls: defaultControls().extend([new RotateNorthControl()]),
            layers: [new TileLayer({
              source: baiduSource,
                   })],
            view: new View({
              projection: "EPSG:3857",
              center: fromLonLat([103, 34]),
              zoom: 2,
              extent: transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
            })
          });
          console.log('创建地图');
          console.log(this.map);
          this.map.addControl(mousePositionControl);

          this.editButton = btn;
          console.log(btn);

          var pi = new PointerInteraction({
                              handleUpEvent: this.handleUpEvent,
                              handleDownEvent: this.handleDownEvent,
                              //handleDragEvent: this.handleDragEvent,
                              handleMoveEvent: this.handleMoveEvent,
                            });
          this.map.addInteraction(pi);
          this.initFeatureStyle();
          //添加tooltips
          console.log($('.ol-zoom-in, .ol-zoom-out'));
          //$('.ol-zoom-in, .ol-zoom-out').tooltip({
          //                  placement: 'right',
          //                  container: '#map',
          //  });
          /*var b1 = $('.ol-zoom-in');
          b1.tooltip({
              placement: 'right',
              container: '#map',
            });*/
          /*
          $('.ol-zoom-in, .ol-zoom-out').tooltip({
              placement: 'right',
              container: '#map',
            });*/


          //获取popup相关元素
          this.container = document.getElementById('popup');
          this.content = document.getElementById('popup-content');
          this.closer = document.getElementById('popup-closer');

          //
          console.log(this.container);
          console.log(this.content);
          console.log(this.closer);
          //


          this.overlay = new Overlay({
            element: this.container,
            autoPan: true,
            autoPanAnimation: {
              duration: 250,
            },
          });
          //var content = this.content;
          var overlay = this.overlay;
          var closer = this.closer;
          this.closer.onclick = function () {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
          };
          this.map.addOverlay(this.overlay);
          /*this.map.on('singleclick', function (evt) {
                var coordinate = evt.coordinate;
                var hdms = toStringHDMS(toLonLat(coordinate));
                console.log(hdms);
                content.innerHTML = '详细信息';
                overlay.setPosition(coordinate);
              });*/
        },
        initFeatureLayer(){
          this.featureLayer = new VectorLayer();
              console.log("添加Vector图层");
              this.map.addLayer(this.featureLayer);
              this.featureSource = new VectorSource();
              this.featureLayer.setSource(this.featureSource);
        },
        AddFeature(lon, lat, style, id)
        {
          var pp = fromLonLat([lon, lat]);
          var pF = new Feature(
                  {
                    geometry: new Point(pp)
                  }
                  );
          pF.setStyle(style);
          pF.setId(id);
          this.featureSource.addFeature(pF);
          return pF;
        },
        RemoveFeature(fea)
        {
          this.featureSource.removeFeature(fea);
        },
        handleDownEvent(evt) 
        {
          if(this.mode == 1)
          {
              return true;
          }
          if(this.mode == 0)
          {           
              var map = evt.map;
              var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
              });
              if(feature)
              {
                  return true;
              }
          }
          return false;
        },
        handleUpEvent(evt) 
        {
          console.log("handleUpEvent");
          if(this.mode == 1)
          {
              var lon = evt.coordinate[0];
              var lat = evt.coordinate[1];
              var lonlat = toLonLat([lon, lat]);
              //向服务器上传该标记点
              var paramsData = new Object();
              var data = new Object();
              data.name = 'name';
              data.uid = generateUUID();
              data.lon = lonlat[0];
              data.lat = lonlat[1];
              data.file1 = "";
              data.file2 = "";
              data.file3 = "";
              paramsData['data'] = data;
              uploadFeatureApi( paramsData ).then(res => {
                        console.log(res);
                        if(res['status'] != null && res['status'] == 200)
                        {
                          //添加标注
                          this.AddFeature(lonlat[0], lonlat[1], this.pointStyle, data.uid);
                          this.switchMode(0);
                        }
                }
              );
          }else
          if(this.mode == 0)
          {           
              var map = evt.map;
              var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
              });
              if(feature)
              {
                //跳转新页面
                console.log('跳转新页面');
                var id = feature.getId();
                console.log(this.mapdata);
                
                let routeData = this.$router.resolve({
                  path: '/featureDetail',
                  query: {"uid":id}
                  });
                  window.open(routeData.href, '_blank');
              }
          }
          /*
          var map = evt.map;
          var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
          });

          if (feature) {
            this.coordinate_ = evt.coordinate;
            this.feature_ = feature;
          }
          return !!feature;*/
        },
        //handleDragEvent(evt) 
        //{
          /*
          var deltaX = evt.coordinate[0] - this.coordinate_[0];
          var deltaY = evt.coordinate[1] - this.coordinate_[1];

          var geometry = this.feature_.getGeometry();
          console.log(deltaX +' ' +deltaY);
          geometry.translate(deltaX, deltaY);

          this.coordinate_[0] = evt.coordinate[0];
          this.coordinate_[1] = evt.coordinate[1];*/
        //},
        switchMode(mode)
        {
            if(mode == 1)
            {
                //切换到编辑模式下
                if(this.mode == 0)
                {
                    this.mode = 1;
                    this.featureAdd = this.AddFeature(0, 0, this.editStyle);
                }
            }
            if(mode == 0)
            {
                //切换到普通模式下
                if(this.mode == 1)
                {
                    this.mode = 0;
                    this.RemoveFeature(this.featureAdd);
                    this.featureAdd = null;
                }
            }
        },
        handleMoveEvent(evt) 
        {
          //console.log(evt);
          if(this.mode == 1 && this.featureAdd != null)
          {
              var lon = evt.coordinate[0];
              var lat = evt.coordinate[1];
              //var lanlat = toLonLat([lon, lat]);
              //var pp = fromLonLat([lon, lat]);
              //console.log(pp);'XY'
              var p = this.featureAdd.getGeometry();
              //console.log(lanlat);
              p.setCoordinates([lon, lat]);
          }
          if(this.mode == 0)
          {
            var map = evt.map;
            var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
              return feature;
            });
            if(feature)
            {
              //console.log(feature);
              var coordinate = evt.coordinate;
              //var hdms = toStringHDMS(toLonLat(coordinate));
              console.log(feature.getId());
              this.content.innerHTML = '该点的详细信息展示。 点击查看文件信息';
              this.overlay.setPosition(coordinate);

            }else
            {
              this.overlay.setPosition(undefined);
            }
          }
          /*
          if (this.cursor_) 
          {
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
          }*/
        },
        handleRotateNorth() 
        {
          console.log('handleRotateNorth : ' + this.mode);
          console.log(this.editButton);
          if(this.mode == 0)
          {
            //处于编辑模式
            this.mode = 1;
            this.editButton.innerHTML = 'O';
            console.log('O');
          }else
          if(this.mode == 1)
          {
            //处于编辑模式
            this.mode = 0;
            this.editButton.innerHTML = 'E';
            console.log('E');
          }
          //this.getMap().getView().setRotation(90);
        },
        //添加标注
        handleAddFeature()
        {
          if(this.mode != 1)
          {
            this.switchMode(1);
          }else{
            this.switchMode(0);
          }
            //console.log(this.featureAdd);
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
.map {
        width: 100%;
        height:100vh;
      }
.rotate-north {
  top: 65px;
  left: .5em;
}
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after, .ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>
