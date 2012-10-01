// **Namespace** of `cwb-icon.js`
window.cwbIcon = {
  Model: {},
  Collection: {},
  View: {},
  option: {
    source: "",
    userName: "",
    outputEl: "coderwall-badged-icon",
    width: 210,
    height: 210,
    position: "bottom-left",
    direction: "horizontal",
    background: "rgba(186, 203, 216, 0.5)",
    badge_w: 50,
    badge_h: 50,
    proxy:""
  },
  onSuccess: {},
  onFail: {},
  CODERWALL_URL: "http://coderwall.com/:USERNAME.json?callback=?",
  GITHUB_URL: "https://api.github.com/users/:USERNAME",
  // Entry point of **cwb-icon.js**
  init: function(opts, success, fail) {
    for (key in opts) {
      if (opts[key]) cwbIcon.option[key] = opts[key];
    }
    cwbIcon.onSuccess = success || {};
    cwbIcon.onFail = fail || {};
    new cwbIcon.View.OutputIcon();
  }
};


// **Model**<br>
// `cwbIcon.Model.githubAccount` corresponds to one badge.
cwbIcon.Model.SrcImg = Backbone.Model.extend({
  defaults: {
    source: "",
    sourceImg: "",
    userName: "",
  },

  url: function() {
    return cwbIcon.GITHUB_URL.replace(":USERNAME", cwbIcon.option.userName);
  },

  fetch: function() {
    var self = this;
    if ("github" == self.get("source")) {
      $.ajax({
        url: self.url(),
        dataType: "jsonp"
      })
      .done(function(data) {
        // console.log("Success:SrcImg.fetch", data);
        // if user was not
        if (data.message == "Not Found") {
          self.trigger("noUser");
          return;          
        }
        self.set(data);
        self.trigger("success");
      })
      .fail(function() {
        // console.log("Fail:SrcImg.fetch");
        self.trigger("error", arguments);
      })
      .always(function(){
        // console.log("Finish:SrcImg.fetch");        
      });
    } else {
      self.set({
        "data": {"avatar_url": self.get("source")}
      });
      self.trigger("success");
    }
  }
});

// **Model**<br>
// `cwbIcon.Model.Badge` corresponds to one badge.
cwbIcon.Model.Badge = Backbone.Model.extend({});

// **Collection**<br>
// The collection of `cwbIcon.Collection.Badge`
cwbIcon.Collection.Badges = Backbone.Collection.extend({

  model: cwbIcon.Model.Badge,

  url: function() {
    return cwbIcon.CODERWALL_URL.replace(":USERNAME", cwbIcon.option.userName);
  },

  fetch: function() {
    var self = this;
    // if user doesn't have a acount at coderwall, resoponse will be 404.
    // To handle this error, use jquery.jsonp
    // http://forum.jquery.com/topic/jquery-ajax-with-datatype-jsonp-will-not-use-error-callback-if-request-fails
    $.jsonp({
      "url": self.url(),
      "data": "json",
      "success": function(data) {
        // console.log("Success:Badges.fetch: ", data);
        // set badges as collection of models
        self.reset(data["data"]["badges"]);
      },
      "error": function(d,msg) {
        // console.log("Fail:Badges.fetch: " + msg);
        self.trigger("error");
      }
    });
  }
});

// **View**<br>
// `cwbIcon.View.Icon`.
cwbIcon.View.OutputIcon = Backbone.View.extend({
  el: '.coderwall-badged-icon',

  // initialize view
  initialize: function() {
    var self = this;
    _.bindAll(this, "renderIcon","renderBadges", "getBadges", "onFailure");

    // create model
    self.model = new cwbIcon.Model.SrcImg({
      source: cwbIcon.option.source,
      userName: cwbIcon.option.userName
    });
    // bind events.
    self.model.on("error", self.onFailure);
    self.model.on("noUser", self.onFailure);
    self.model.on("success",self.getBadges);

    // create collection
    self.collection = new cwbIcon.Collection.Badges();
    self.collection.on("error", self.onFailure);
    this.collection.on("reset", this.renderIcon);

    // start to get data.
    self.model.fetch();
  },

  getBadges:function() {
    var self = this;
    self.collection.fetch();
  },

  renderIcon: function() {
    var self = this;
    // console.log("renderIcon start");

    // create canvas
    var canvas = document.createElement("canvas")
    canvas.id = "output";
    // set canvas size doubled 
    canvas.width = cwbIcon.option.width * 2;
    canvas.height = cwbIcon.option.height * 2;
    var ctx = canvas.getContext("2d"),
        icon = new Image(),
        src = self.model.get("data").avatar_url;

    // delete dispatch url
    if (src.indexOf("?d",0) > 0) src = src.substring(0,src.indexOf("?d",0));

    //save canvas
    self.canvas = canvas;
    self.ctx = ctx;
    // for enable to use `canvas.toDataURL`
    // set crossOrigin = "Anonymous";
    icon.crossOrigin = "Anonymous";

    // load image url
    icon.onload = function() {
      ctx.drawImage(icon, 0, 0, cwbIcon.option.width * 2,cwbIcon.option.width * 2);
      self.renderBadges();
    }
    icon.src = src;
    if (icon.complete === undefined ) {
      // error
      // console.log("icon draw error");
      self.onFailure();
    }
  },

  renderBadges: function() {
    var self = this;
    // console.log("renderBadges start");

    var src = self.model.get("data").avatar_url,
        canvas = self.canvas,
        ctx = self.ctx;

    // overwrite with badges
    ctx.globalCompositeOperation = "source-over";
    
    // Issue
    // to be flexible
    ctx.fillStyle = cwbIcon.option.background;
    ctx.fillRect(0, (cwbIcon.option.height * 2) - cwbIcon.option.badge_h, (cwbIcon.option.width * 2), cwbIcon.option.badge_h);


    // draw coderwall badges
    this.collection.each(function(badge,idx){
      var position = getPosition(idx+1);
      if ( position["dx"] > canvas.width || position["dy"] > canvas.height ) return;

      var badgeImg = new Image(),
          src = badge.get("badge");
      
      // coderwall's API doesn't set Access-Control-Allow-Origin Header
      // To save canvas image as png, overwrite header through proxy.
      if(cwbIcon.option.proxy) {
        src = cwbIcon.option.proxy + src;
        badgeImg.crossOrigin = "Anonymous";
      }

      badgeImg.onload = function() {
        var position = getPosition(idx);
        ctx.drawImage(badgeImg,position["dx"],position["dy"],cwbIcon.option.badge_w,cwbIcon.option.badge_h);
      }
      badgeImg.src = src;
      if (badgeImg.complete === undefined ) {
        // console.log("badgeImg draw error");
        self.onFailure();
      }
     });


    // set badge position
    function getPosition(idx){
      if (idx < 0) {
        return {"dx":0,"dy":0};
      }
      var dx = cwbIcon.option.badge_w * idx;
      var dy = (cwbIcon.option.height * 2) - cwbIcon.option.badge_h;
      return {"dx":dx,"dy":dy};

      // Issue 
      // enable to adjust position and direction.
      //
      // switch(cwbIcon.option.position){
      //   case 'top-left':
      //     break;
      //   case 'top-right':
      //     break;
      //   case 'top-right':
      //     break;
      //   case 'bottom-right':
      //     break;
      // }
      // switch(cwbIcon.option.direction){
      //   case 'vertical':
      //     break;
      //   case 'horizontal':
      //     break;
      // }
    }

    // display canvas with double resolution
    var style = {
      zoom:"50%",
      width:cwbIcon.option.width * 2 + "px",
      height:cwbIcon.option.height * 2 + "px"
    };
    $(canvas).css(style);
    self.$el.append(canvas);
    // callback of succes
    if (typeof cwbIcon.onSuccess == "function") cwbIcon.onSuccess.call();
  },

  onFailure: function(args) {
    console.log("cwbIcon is failed:" + args);
    // callback of fail
    if (typeof cwbIcon.onFail == "function") cwbIcon.onFail.call();
  }

});
