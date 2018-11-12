var Pressure = require('pressure');

var $ = require("jquery");
var Chart = require("chart.js");
var loremIpsum = require("lorem-ipsum");


require("bootstrap");

function debugMsg(msg){
      $("#debug_text").html(msg);
}


var timeUpdate = [];
var forceTimeline = [];
var chartTimeUpdate = [];
var chartForceTimeline = [];
var forceLineChart = null;



function forceUpdate(force){
        //debugMsg(force);
        forceBarVal = 100 * force;
        forceBarValStr = forceBarVal + "%";

        timeUpdate.push(Date.now() - tDown);
        forceTimeline.push(force);

        $("#forceBar").width(forceBarValStr);
}


$("#debug_toggle").on("click", function(e){
    $("#debug_panel").toggle();
});

$("#forceBar_toggle").on("click", function(e){
    $("#forceBar").toggle();
});


$("#touchDetectArea").on("mousedown", function(e){
  debugMsg("mouse down detected");
  xDown = e.pageX;
  yDown = e.pageY;
  tDown = Date.now();
})
.on("mouseup", function(e){
  xUp = e.pageX;
  yUp = e.pageY;
  tUp = Date.now();

  xTraverse = xUp - xDown;
  yTraverse = yUp - yDown;
  timeElapsed = tUp - tDown;

  if ((Math.abs(xTraverse) > 30 || Math.abs(yTraverse) > 30 ) && (timeElapsed < 2000))  {
    console.log("swipe detected!");

    swipeHandler(xTraverse, yTraverse);
  }


    //debugMsg(forceTimeline);
    chartTimeUpdate = [];
    chartForceTimeline = [];
    chartTimeUpdate = timeUpdate;
    chartForceTimeline = forceTimeline;



    if(forceLineChart != null)
      forceLineChart.destroy();

    var ctx = document.getElementById("forceLineChart");

    forceLineChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: chartTimeUpdate,
              datasets: [{
                label:"Force applied",
                data:chartForceTimeline,
                borderColor: "#3e95cd",
                fill:false
              }]
            },
            options: {  responsive:false, 
                        animation:{duration:0},
                        scales:{
                          yAxes:[{
                            ticks:{
                              max:1,
                              min:0,
                              stepsize:0.05
                            }
                          }]
                        }
                      }
    });

    forceLineChart.update(0);


  timeUpdate = [];
  forceTimeline = [];

})

var DIRECTION = Object.freeze({"LEFT":1, "RIGHT": 2, "UP":3, "DOWN":4});

function getDirection(xMove, yMove){
  if(Math.abs(xMove) >= Math.abs(yMove)){
    if(xMove > 0)
      return DIRECTION.RIGHT;
    else
      return DIRECTION.LEFT;
  }
  else{
    if(yMove > 0)
      return DIRECTION.UP;
    else
      return DIRECTION.DOWN;
  }
}

function getCurrentChapter(){
  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();


}


function forceSwipeHandler(swpDir){
  switch(swpDir){
    case DIRECTION.LEFT:
      console.log("Navigate to previous chapter");
      //PrevChapter();
      break;
    case DIRECTION.RIGHT:
      console.log("Navigate to next chapter");
      //NextChapter();
      break;
    default:
      console.log("...");
  }
}

function normalSwipeHandler(swpDir){

}


function swipeHandler( xMove, yMove ){
    console.log("Now into swipe Handler");


    dbgInfo =   "swipe detected<br>" + 
                "Duration: " + timeElapsed + "<br>" + 
                "Max of Force: " + Math.max.apply(Math, forceTimeline) + "<br>"
                ;

    swipeDirection = getDirection(xMove, yMove);

    if (Math.max.apply(Math, forceTimeline) > 0.5){ 
        forceSwipeHandler(swipeDirection);
    }
    else{
        normalSwipeHandler(swipeDirection);
    }

    debugMsg(dbgInfo);

    //console.log(JSON.stringify(chartTimeUpdate));
    //console.log(JSON.stringify(chartForceTimeline));
}



Pressure.set('#touchDetectArea', {
  start: function(force, event){
        //console.log(force);
        //forceUpdate(force);
    },
  end: function(force, event){
        //console.log(force);
        //forceUpdate(force);
    },
  startDeepPress: function(force, event){
        //console.log(force);
        //forceUpdate(force);
    },
  endDeepPress: function(force, event){
        //console.log(force);
        //forceUpdate(force);
    },
  change: function(force, event){
        //console.log(force);
        forceUpdate(force);
    }
  }
  );


function genChapter(chapterNum){

  minParagraphs = 50;
  rangeParagraphs = 30;

  randParagraphs = Math.floor(Math.random() * rangeParagraphs + minParagraphs); 

  console.log(randParagraphs);

  liRandomText = loremIpsum({
      count: randParagraphs,
      units: 'paragraphs',
      sentenceLowerBound: 5,
      sentenceUpperBound: 20,
      paragraphLowerBound: 3,
      paragraphUpperBound: 10,
      format: 'plain'
  });

  liRandomText = "<div class='chContainer' id='ch"+chapterNum+"'><h2 class='chTitle'>Chapter " + chapterNum + "</h2>" + liRandomText + "</div>"


  output = liRandomText;

  return output;
}


$(document).ready(function(){

    output = genChapter(1) + genChapter(2) + genChapter(3);



    $("#randomTextArea").html(output);

}); 
