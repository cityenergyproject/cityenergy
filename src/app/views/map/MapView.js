define([
  'jquery',
  'underscore',
  'backbone',
  'models/city/CityModel',
  'models/map/MapModel',
  'models/map/LayerModel',
  'views/map/LayerView',
  'views/map/AddressSearchView',
  'views/map/MapControlView',
  'views/map/MapCategoryControlView',
  'views/map/YearControlView',
  'text!/app/templates/map_controls/MapControlCategoryTemplate.html'
], function($, _, Backbone,CityModel,MapModel,LayerModel,LayerView,AddressSearchView,MapControlView,MapCategoryControlView,YearControlView, MapControlCategoryTemplate){

  var MapView = Backbone.View.extend({
    el: $("#map"),

    initialize: function(){
      document.title = this.model.get('title');

      this.listenTo(this.model, 'change:city', this.changeCity);
      this.listenTo(this.model, 'cityChange', this.initWithCity);
      this.listenTo(this.model, 'yearChange', this.yearChange);
    },

    initWithCity: function(){
      document.title = this.model.get('title');
      $('#title').html(this.model.get('title'));

      if (!this.leafletMap){
        this.leafletMap = new L.Map(this.el, {
          center: this.model.get('center'),
          zoom: this.model.get('zoom'),
          scrollWheelZoom: false
        });
        L.tileLayer(this.model.get('city').get('tileSource')).addTo(this.leafletMap);
        this.leafletMap.zoomControl.setPosition('topright');
      }

      this.currentLayerView = this.currentLayerView || new LayerView({mapView: this});
      this.addressSearchView = this.addressSearchView || new AddressSearchView({mapView: this});
      this.yearControlView = this.yearControlView || new YearControlView({mapView: this});
      this.render();
      return this;
    },

    render: function(){ 
      this.renderMapControls();
      return this;
    },

    renderMapControls: function(){
      var layers = this.model.get('city').layers;

      _.each(layers.models, function(layer){
        if (layer.get('display_type')=='range'){
          new MapControlView({model: layer, map: this.model});
        }else if (layer.get('display_type')=='category'){
          new MapCategoryControlView({model: layer, map: this.model});
        }
      }, this);

      return this;
    },

    changeCity: function(){
      console.log("change city");
      $('#map-controls').empty();
      this.leafletMap.setView(this.model.get('center'), parseInt(this.model.get('zoom')));
      // other cleanup here
    },

    yearChange: function(){
      $('#map-controls').empty();
      $('#map-category-controls').empty();
      this.initWithCity();
    }




  });

  return MapView;

});