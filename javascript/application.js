// this is a snippet for github-page sample
var tempAlert;

// Dom ready
$(function(){

  // when __Create__ button was `click`ed
  // validate input
  $("#createBtn").bind("click",function(){
    var userNm = $("#inputName").val().toLowerCase();
    if (!userNm) {
      // alert
      $("#alertMessage > p").text("Enter Your github username");
      $("#alertMessage").removeClass('fade in display-none')
        // when alert dialogue was `close`d<br>
        // do not remove alert dialogue but hide. 
      .bind("close", function () {
        $(this).addClass('fade out display-none');
      });
    return;
    }
    // disable __Create__ button
    $("#createBtn").addClass("disabled");
    // show progress-bar
    $("#progress-bar").attr("style", "width: 40%;");

    // set option
    var option ={
      source:"github",
      userName:userNm,
      width:210,
      heiht:210,
      position:"bottom-left",
      direction:"horizontal",
      background: "rgba(186, 203, 216, 0.5)",
      badge_w: 50,
      badge_h: 50,
      proxy:"http://allow-any-origin.appspot.com/"
    };

    // set callback
    // On `success` 
    var success = function(){
      console.log("success!");
      $("#srcIcon").remove();
      $("#saveBtn").addClass("enabled").removeClass("disabled");
      $("#progress-bar").attr("style", "width: 100%;").addClass("bar-success").removeClass("progress-striped");
      $(".coderwall-badged-icon").removeClass('display-none');
      $("#output").addClass("img-polaroid");
      $("#navSection").removeClass('display-none');
    }
    // On `fail`
    var fail = function(){
      console.log("fail!");
      $("#progress-bar").addClass("bar-danger");
      // alert
      $("#alertMessage > p").text("failed to load Your icon,please try againg");
      $("#alertMessage").removeClass('fade in display-none')
      .bind("close", function () {
        $(this).addClass('fade out display-none');
        $("#createBtn").addClass("enabled").removeClass("disabled");
        $("#progress-bar").removeClass('bar-danger').attr("style", "width: 0%;");
      });
    }
    // init
    cwbIcon.init(option,success,fail);
  });

  // when __Save__ button was `click`ed
  $("#saveBtn").bind("click",function(){
    var self = this;
    console.log("save image");
    // save canvas as png
    // http://www.nihilogic.dk/labs/canvas2image/
    Canvas2Image.saveAsPNG(document.getElementById("output"));
  });
});
