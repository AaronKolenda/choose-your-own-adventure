var Router = Backbone.Router.extend({

  routes: {
    "": "showTOC",
    "page/:pageNumber": "showPage",
  },

  showTOC: function() {
    $.ajax({
      url: "/api/toc",
      method: "GET",
      success: function(data) {
        console.log(data);

        _.each(data, function(element, index){
        	element = new PageTOCModel({
        		page: element.page,
        		title: element.title
        	});
        	tocViews.push(new PageTOCView(element));

        });

       _.each(tocViews, function(element, index){
    		$("#tocContainer").append(tocViews[index].el);
    	});

      },
    })
  },

  showPage: function(page) {
    $.ajax({
      url: "/api/page/" + page,
      method: "GET",
      success: function(data) {
      	$("#tocContainer").html("");
      	linkViews = [];
        console.log(data);

        _.each(data.paragraphs, function(element, index){
    		$("#tocContainer").append(element);
    	});

    	 _.each(data.links, function(element, index){
        	element = new LinkModel({
        		page: element.page,
        		sentence: element.sentence
        	});
        	linkViews.push(new LinkView(element));
        });


    	  _.each(linkViews, function(element, index){
    		$("#tocContainer").append(linkViews[index].el);
    	});


      },
    })
  },

});

var LinkModel = Backbone.Model.extend({

	defaults: {
    page: 0,
    sentence: ""
  	},

  viewDetails: function() {
    var details = this.toJSON();
    return details;
  },

});

var LinkView = Backbone.View.extend({

  tagName: "div",

  className: "links",

  initialize: function(model) {
  	this.model = model;
    this.render();
  },

  render: function() {
    this.$el.html(templates.linkInfo(this.model.viewDetails()));
  },

});

var PageTOCModel = Backbone.Model.extend({

	defaults: {
    page: 0,
    title: ""
  	},

  viewDetails: function() {
    var details = this.toJSON();
    return details;
  },

});

var PageTOCView = Backbone.View.extend({

  tagName: "div",

  initialize: function(model) {
  	this.model = model;
    this.render();
  },

  render: function() {
    this.$el.html(templates.tocInfo(this.model.viewDetails()));
  },

});

var getTemplates = function(){

  var tocString = $("#toc-template").text()
  templates.tocInfo = Handlebars.compile(tocString);

  var linkString = $("#link-template").text()
  templates.linkInfo = Handlebars.compile(linkString);

};

var templates = {};
var router = new Router;
var tocViews = [];
var linkViews = [];

$(document).ready(function() {
	Backbone.history.start();
	getTemplates();
});