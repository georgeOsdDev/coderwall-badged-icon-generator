### coderwall-badged icon Generator
Create icon with coderwall badges.

#### Demo
[Apps]()

#### Usage

You can use this as blogparts

1.Download cwb-icon.js & [jquery-jsonp](https://github.com/jaubourg/jquery-jsonp)

2.Include this script on last of `body` tag

    <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min.js"></script>
    <script src="vendor/jquery-jsonp/jquery.jsonp-2.4.0.min.js"></script>
    <script src="javascript/cwb-icon.js"></script>

3.insert output div, the result canvas will be inserted this div.

    <div class="coderwall-badged-icon"></div>

3.Setup option after dom ready

    <script type="text/javascript">
    $(function(){    
      var option ={
        source:"github",                                // `github` or your own file url
        userName:"your coderwall username here",        // enter your coderwall username
        width:210,                                      // the icon width
        height:210,                                     // the icon height
        background: "rgba(186, 203, 216, 0.5)",         // background of badges
        badge_w: 50,                                    // the badge width
        badge_h: 50,                                    // the badge height
        proxy:"http://allow-any-origin.appspot.com/"    // proxy url to access image url of another domain if you need
      };

      // set callback
      // On `success` 
      var success = function(){
        console.log("success!");
      }
      // On `fail`
      var fail = function(){
        console.log("fail!");
      }
      // init
      cwbIcon.init(option,success,fail);
    });
    </script>

#### Licence

Source code can be found on [github](https://github.com/georgeOsdDev/coderwall-badged-icon-generator), licenced under [MIT](http://opensource.org/licenses/mit-license.php). And Document can be found [Here](https://github.com/georgeOsdDev/coderwall-badged-icon-generator/blob/master/ReadMe.md).

Coderwall-badged Icon Generator is an unofficial application.

There is no relationship and responsibility with github, coderwall, and gravator.

