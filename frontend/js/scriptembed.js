//////////////////////
///  Get data  ///
/////////////////////

$.getJSON( "data/extraInfo.json", function( data ) {
	extraData = data;
	makeTopInfo();

});








///////////////////////////////////
//		MakeTopInfo   		///
///////////////////////////////////
makeTopInfo = function (){

  var shows = ["alle", "hart", "illner","maischberger","will"];
  var allBarClass = "";


//Talkshow Stand 
$('.stand').html(extraData.alle.lastentry);
$('.anzahlShows').html(extraData.alle.anzahlshows);
$('.anzahlGaeste').html(extraData.alle.allegaeste);





String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

  getMax = function (arr, prop) {
      var max;
      for (var i=1 ; i<5 ; i++) {
          if (!max || Number(arr[shows[i]][prop]) > Number(max[prop]))
              max = arr[shows[i]];
      }
      return max ;
  }

  getMin = function (arr, prop) {
      var max;
      for (var i=1 ; i<5 ; i++) {
          if (!max || Number(arr[shows[i]][prop]) < Number(max[prop]))
              max = arr[shows[i]];
      }
      return max ;
  }



  getMaxKey = function (arr,position, keys) {

      var maxKeyName;
      var maxKeyValue;
      var ausgangswert = 0;

      for (var i=0 ; i<keys.length ; i++) {
          if (Number(arr[position][keys[i]]) > Number(ausgangswert)){
            maxKeyValue = arr[position][keys[i]];
            maxKeyName = keys[i];
            ausgangswert = Number(arr[position][keys[i]]); 
          }
      }
      if (maxKeyName=="cducsu"){maxKeyName="cdu/csu"}
      if (maxKeyName=="gruene"){maxKeyName="grüne"}
      return [maxKeyValue, maxKeyName];
  }

  




    // Frauenquote 

    var maxFrauen = getMax(extraData, "frauenProzent");
    var minFrauen = getMin(extraData, "frauenProzent");

    // var htmlTextFM = "Im Durchschnitt liegt der Frauenanteil über alle Sendungen bei " + Math.round(extraData.alle.frauenProzent) + "%. Die Sendung  " + maxFrauen.name + " hat mit "+Math.round(maxFrauen.frauenProzent)+"% den höchsten Frauenanteil. Über "+extraData.alle.anzahlshows +" Shows wurden "+extraData.alle.maennergaestegesamt+" Männer und "+extraData.alle.frauengeastegesamt+" Frauen eingeladen. Die Sendung "+minFrauen.name+" hat mit "+Math.round(minFrauen.frauenProzent)+"% den niedrigsten Frauenanteil.";
    var htmlTextFM = "Der Frauenanteil bei den Gästen aller vier Talkshows liegt bei " + Math.round(extraData.alle.frauenProzent) + "%."
    $(".textFM").append(htmlTextFM);

    var htmlBarchartFM  = "";
    for (var i = 0; i < 5; i++) {
      if (i == 0){allBarClass = "gesamtBar"}
      else {allBarClass = ""}
      htmlBarchartFM  += 
      '<div class = "infoContent '+allBarClass+'" >' +
          '<div class = "frauen" style="width: '+extraData[shows[i]].frauenProzent+'%" title = "Frauen: '+ Math.round(extraData[shows[i]].frauenProzent) +'%" data-toggle="tooltip"></div>' +
          '<div class = "maenner" style="width: '+extraData[shows[i]].maennerProzent+'%" title = "Männer: ' +Math.round(extraData[shows[i]].maennerProzent) +'%" data-toggle="tooltip"></div>'+
        '</div>'
    };
    htmlBarchartFM  += '<div class = "infoContent" ><small>'+
        '<div class = "frauen legendItem"></div><div class = "legendText">Frauen</div>'+
        '<div class = "maenner legendItem"></div><div class = "legendText" >Männer</div>'+
      '</small></div>';
    $("#barchartFM").append(htmlBarchartFM);

    var htmlInfoFM = 
    '<div class = "infoContent gesamtBar" >Gesamt: '+Math.round(extraData.alle.frauenProzent)+'%<br><small>(' + extraData.alle.frauengeastegesamt + ' von ' + extraData.alle.allegaeste+' Gästen)</small></div>'+
      '<div class = "infoContent" >Hart a. F.<br>'+Math.round(extraData.hart.frauenProzent)+'% <small> (' + extraData.hart.frauengeastegesamt + ' von ' + extraData.hart.allegaeste+')</small></div>'+
      '<div class = "infoContent" >Illner<br>'+Math.round(extraData.illner.frauenProzent)+'% <small> (' + extraData.illner.frauengeastegesamt + ' von ' + extraData.illner.allegaeste+')</small></div>'+
      '<div class = "infoContent" >Maischberger<br>'+Math.round(extraData.maischberger.frauenProzent)+'%<small> (' + extraData.maischberger.frauengeastegesamt + ' von ' + extraData.maischberger.allegaeste+')</small></div>'+
      '<div class = "infoContent" >Will<br>'+Math.round(extraData.will.frauenProzent)+'% <small> (' + extraData.will.frauengeastegesamt + ' von ' + extraData.will.allegaeste+')</small></div>';
    $("#infoFM").append(htmlInfoFM);




    //Politker

    var maxPartei = getMaxKey(extraData, "alle", ["spd","cducsu","gruene","linke","afd","fdp","andere"])[1].toUpperCase();
    var maxPolitker = getMax(extraData, "alllemitpartei");
    var minPolitker = getMin(extraData, "alllemitpartei");


    //var htmlTextPol = "Parteivertreter werden häufig eingeladen. Im Durchschnitt waren " + Math.round((extraData.alle.alllemitpartei/extraData.alle.allegaeste)*100) + "% der Gäste auch Parteivertreter. Die Partei " + maxPartei + " wurde im Durchschnitt am häufigsten eingeladen. Besonders häufig werden Parteipolitiker in der Sendung "+ maxPolitker.name +" eingeladen ("+ Math.round((maxPolitker.alllemitpartei/maxPolitker.allegaeste)*100) +"%).";
    var htmlTextPol = "Das Diagramm zeigt, wie sich die " + Math.round((extraData.alle.alllemitpartei/extraData.alle.allegaeste)*100) + "% Politiker unter den Gästen auf die Parteien verteilen."
    $(".textPol").append(htmlTextPol);


    var htmlBarchartPol = 
    '<div class = "infoContent gesamtBar" >' +
        '<div class = "cdu" style="width: '+ (extraData.alle.cducsu / extraData.alle.alllemitpartei) * 100 +'%" title = "CDU/CSU ('+ Math.round((extraData.alle.cducsu / extraData.alle.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "spd" style="width: '+(extraData.alle.spd / extraData.alle.alllemitpartei) * 100+'%" title = "SPD (' +Math.round((extraData.alle.spd / extraData.alle.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "gruene" style="width: '+(extraData.alle.gruene / extraData.alle.alllemitpartei) * 100+'%" title = "Grüne ('+ Math.round((extraData.alle.gruene / extraData.alle.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "linke" style="width: '+(extraData.alle.linke / extraData.alle.alllemitpartei) * 100+'%" title = "Linke (' +Math.round((extraData.alle.linke / extraData.alle.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "fdp" style="width: '+(extraData.alle.fdp / extraData.alle.alllemitpartei) * 100+'%" title = "FDP (' +Math.round((extraData.alle.fdp / extraData.alle.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "afd" style="width: '+(extraData.alle.afd / extraData.alle.alllemitpartei) * 100+'%" title = "AfD ('+ Math.round((extraData.alle.afd / extraData.alle.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "andere" style="width: '+(extraData.alle.andere / extraData.alle.alllemitpartei) * 100+'%" title = "Sonstige ('+ Math.round((extraData.alle.andere / extraData.alle.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
      '</div>'+
      '<div class = "infoContent" >'+
        '<div class = "cdu" style="width: '+ (extraData.hart.cducsu / extraData.hart.alllemitpartei) * 100 +'%" title = "CDU/CSU ('+ Math.round((extraData.hart.cducsu / extraData.hart.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "spd" style="width: '+(extraData.hart.spd / extraData.hart.alllemitpartei) * 100+'%" title = "SPD (' +Math.round((extraData.hart.spd / extraData.hart.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "gruene" style="width: '+(extraData.hart.gruene / extraData.hart.alllemitpartei) * 100+'%" title = "Grüne ('+ Math.round((extraData.hart.gruene / extraData.hart.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "linke" style="width: '+(extraData.hart.linke / extraData.hart.alllemitpartei) * 100+'%" title = "Linke (' +Math.round((extraData.hart.linke / extraData.hart.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "fdp" style="width: '+(extraData.hart.fdp / extraData.hart.alllemitpartei) * 100+'%" title = "FDP (' +Math.round((extraData.hart.fdp / extraData.hart.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "afd" style="width: '+(extraData.hart.afd / extraData.hart.alllemitpartei) * 100+'%" title = "AfD ('+ Math.round((extraData.hart.afd / extraData.hart.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "andere" style="width: '+(extraData.hart.andere / extraData.hart.alllemitpartei) * 100+'%" title = "Sonstige ('+ Math.round((extraData.hart.andere / extraData.hart.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
      '</div>'+
      '<div class = "infoContent" >'+
        '<div class = "cdu" style="width: '+ (extraData.illner.cducsu / extraData.illner.alllemitpartei) * 100 +'%" title = "CDU/CSU ('+ Math.round((extraData.illner.cducsu / extraData.illner.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "spd" style="width: '+(extraData.illner.spd / extraData.illner.alllemitpartei) * 100+'%" title = "SPD (' +Math.round((extraData.illner.spd / extraData.illner.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "gruene" style="width: '+(extraData.illner.gruene / extraData.illner.alllemitpartei) * 100+'%" title = "Grüne ('+ Math.round((extraData.illner.gruene / extraData.illner.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "linke" style="width: '+(extraData.illner.linke / extraData.illner.alllemitpartei) * 100+'%" title = "Linke (' +Math.round((extraData.illner.linke / extraData.illner.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "fdp" style="width: '+(extraData.illner.fdp / extraData.illner.alllemitpartei) * 100+'%" title = "FDP (' +Math.round((extraData.illner.fdp / extraData.illner.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "afd" style="width: '+(extraData.illner.afd / extraData.illner.alllemitpartei) * 100+'%" title = "AfD ('+ Math.round((extraData.illner.afd / extraData.illner.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "andere" style="width: '+(extraData.illner.andere / extraData.illner.alllemitpartei) * 100+'%" title = "Sonstige ('+ Math.round((extraData.illner.andere / extraData.illner.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
      '</div>'+
      '<div class = "infoContent" >'+
        '<div class = "cdu" style="width: '+ (extraData.maischberger.cducsu / extraData.maischberger.alllemitpartei) * 100 +'%" title = "CDU/CSU ('+ Math.round((extraData.maischberger.cducsu / extraData.maischberger.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "spd" style="width: '+(extraData.maischberger.spd / extraData.maischberger.alllemitpartei) * 100+'%" title = "SPD (' +Math.round((extraData.maischberger.spd / extraData.maischberger.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "gruene" style="width: '+(extraData.maischberger.gruene / extraData.maischberger.alllemitpartei) * 100+'%" title = "Grüne ('+ Math.round((extraData.maischberger.gruene / extraData.maischberger.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "linke" style="width: '+(extraData.maischberger.linke / extraData.maischberger.alllemitpartei) * 100+'%" title = "Linke (' +Math.round((extraData.maischberger.linke / extraData.maischberger.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "fdp" style="width: '+(extraData.maischberger.fdp / extraData.maischberger.alllemitpartei) * 100+'%" title = "FDP (' +Math.round((extraData.maischberger.fdp / extraData.maischberger.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "afd" style="width: '+(extraData.maischberger.afd / extraData.maischberger.alllemitpartei) * 100+'%" title = "AfD ('+ Math.round((extraData.maischberger.afd / extraData.maischberger.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "andere" style="width: '+(extraData.maischberger.andere / extraData.maischberger.alllemitpartei) * 100+'%" title = "Sonstige ('+ Math.round((extraData.maischberger.andere / extraData.maischberger.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
      '</div>'+
      '<div class = "infoContent" >'+
        '<div class = "cdu" style="width: '+ (extraData.will.cducsu / extraData.will.alllemitpartei) * 100 +'%" title = "CDU/CSU ('+ Math.round((extraData.will.cducsu / extraData.will.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "spd" style="width: '+(extraData.will.spd / extraData.will.alllemitpartei) * 100+'%" title = "SPD (' +Math.round((extraData.will.spd / extraData.will.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "gruene" style="width: '+(extraData.will.gruene / extraData.will.alllemitpartei) * 100+'%" title = "Grüne ('+ Math.round((extraData.will.gruene / extraData.will.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "linke" style="width: '+(extraData.will.linke / extraData.will.alllemitpartei) * 100+'%" title = "Linke (' +Math.round((extraData.will.linke / extraData.will.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "fdp" style="width: '+(extraData.will.fdp / extraData.will.alllemitpartei) * 100+'%" title = "FDP (' +Math.round((extraData.will.fdp / extraData.will.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>'+
        '<div class = "afd" style="width: '+(extraData.will.afd / extraData.will.alllemitpartei) * 100+'%" title = "AfD ('+ Math.round((extraData.will.afd / extraData.will.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
        '<div class = "andere" style="width: '+(extraData.will.andere / extraData.will.alllemitpartei) * 100+'%" title = "Sonstige ('+ Math.round((extraData.will.andere / extraData.will.alllemitpartei) * 100) +'%)" data-toggle="tooltip"></div>' +
      '</div>'+
    '<div class = "infoContent" ><small>'+
        '<div class = "cdu legendItem"></div><div class = "legendText">CDU/CSU</div>' +
        '<div class = "spd legendItem"></div><div class = "legendText">SPD</div>' +
        '<div class = "gruene legendItem"></div><div class = "legendText">Grüne</div>' +
        '<div class = "linke legendItem"></div><div class = "legendText">Linke</div>' +
        '<div class = "fdp legendItem"></div><div class = "legendText">FDP</div>' +
        '<div class = "afd legendItem"></div><div class = "legendText">AfD</div>' +
        // '<div class = "andere legendItem"></div><div class = "legendText">sonstige</div>' +

      '</small></div>'
      ;
    $("#barchartPol").append(htmlBarchartPol);

     htmlInfoPol = 
    '<div class = "infoContent gesamtBar" >Gesamt: '+Math.round((extraData.alle.alllemitpartei/extraData.alle.allegaeste)*100)+'%<br><small> (' + extraData.alle.alllemitpartei + ' von ' + extraData.alle.allegaeste+' Gästen)</small></div>'+
      '<div class = "infoContent" >Hart a. F. <br> '+Math.round((extraData.hart.alllemitpartei/extraData.hart.allegaeste)*100)+'%<small> (' + extraData.hart.alllemitpartei + ' von ' + extraData.hart.allegaeste+')</small></div>'+
      '<div class = "infoContent" >Illner <br> '+Math.round((extraData.illner.alllemitpartei/extraData.illner.allegaeste)*100)+'%<small> (' + extraData.illner.alllemitpartei+' von ' + extraData.illner.allegaeste+')</small></div>'+
      '<div class = "infoContent" >Maischberger <br> '+Math.round((extraData.maischberger.alllemitpartei/extraData.maischberger.allegaeste)*100)+'%<small> (' + extraData.maischberger.alllemitpartei + ' von ' + extraData.maischberger.allegaeste+')</small></div>'+
      '<div class = "infoContent" >Will <br> '+Math.round((extraData.will.alllemitpartei/extraData.will.allegaeste)*100)+'%<small> (' + extraData.will.alllemitpartei + ' von ' + extraData.will.allegaeste+')</small></div>';
    $("#infoPol").append(htmlInfoPol);



    //Thema

    // var maxThema = getMaxKey(extraData, "alle", ["innenpolitik","aussenpolitik","wirtschaft","gesellschaft"])[1];

    var htmlTextThema = "Top-5 der Themen aller Sendungen: ";
    for (var i = 0; i < 5; i++) {
      htmlTextThema += extraData.alle.schlagwort[i].name + " (" + extraData.alle.schlagwort[i].times + " mal)"
      if (i < 4){htmlTextThema += ", "}
    };


    $(".textKat").append(htmlTextThema);

    var htmlBarchartThema  = "";
    for (var i = 0; i < 5; i++) {
      if (i == 0){allBarClass = "gesamtBar"}
      else {allBarClass = ""}
      htmlBarchartThema  += 
      '<div class = "infoContent '+allBarClass+'" >' +
          '<div class = "katInnen" style="width: '+ (extraData[shows[i]].innenpolitik / extraData[shows[i]].anzahlshows) * 100 +'%" title = "Innenpolitik: '+ Math.round((extraData[shows[i]].innenpolitik / extraData[shows[i]].anzahlshows) * 100) +'%" data-toggle="tooltip"></div>' +
          '<div class = "katAussen" style="width: '+(extraData[shows[i]].aussenpolitik / extraData[shows[i]].anzahlshows) * 100+'%" title = "Außenpolitik: ' +Math.round((extraData[shows[i]].aussenpolitik / extraData[shows[i]].anzahlshows) * 100) +'%" data-toggle="tooltip"></div>'+
          '<div class = "katWirt" style="width: '+(extraData[shows[i]].wirtschaft / extraData[shows[i]].anzahlshows) * 100+'%" title = "Finanzen/Wirtschaft: '+ Math.round((extraData[shows[i]].wirtschaft / extraData[shows[i]].anzahlshows) * 100) +'%" data-toggle="tooltip"></div>' +
          '<div class = "katGesell" style="width: '+(extraData[shows[i]].gesellschaft / extraData[shows[i]].anzahlshows) * 100+'%" title = "Gesellschaft: ' +Math.round((extraData[shows[i]].gesellschaft / extraData[shows[i]].anzahlshows) * 100) +'%" data-toggle="tooltip"></div>'+
        '</div>'
    };
    htmlBarchartThema  += '<div class = "infoContent" ><small>'+
        '<div class = "katInnen legendItem"></div><div class = "legendText">Innenpolitik</div>' +
        '<div class = "katAussen legendItem"></div><div class = "legendText">Außenpolitik</div>' +
        '<div class = "katWirt legendItem"></div><div class = "legendText">Finanz/Wirtsch.</div>' +
        '<div class = "katGesell legendItem"></div><div class = "legendText">Gesellschaft</div>' +
      '</small></div>';
    $("#barchartKat").append(htmlBarchartThema);



    var htmlInfoThema  = 
    '<div class = "infoContent gesamtBar" >Gesamt</div>'+
      '<div class = "infoContent" >Hart a. F.</div>'+
      '<div class = "infoContent" >Illner </div>'+
      '<div class = "infoContent" >Maischberger </div>'+
      '<div class = "infoContent" >Will </div>';
    $("#infoKat").append(htmlInfoThema);


    // ALter

    // var htmlTextAlter = "Von den "+extraData.alle.allegaeste+" Gästen ist uns von "+extraData.alle.allemitalter+" das Geburtsjahr bekannt. Nimmt man den Zeitpunkt ihres Auftritts, waren die Gäste im Durchschnitt "+ Math.round(extraData.alle.altersdurchschnitt*10)/10+" Jahre alt. Der jüngste Gast war " + extraData.alle.alterjuengstergast+" Jahre (" + extraData.alle.juengstergast+"), der älteste "+extraData.alle.alteraeltestergast+" Jahre (" + extraData.alle.aeltestergast+") alt.";
    var htmlTextAlter = "Die Gäste sind im Durchschnitt "+ Math.round(extraData.alle.altersdurchschnitt*10)/10+" Jahre alt. (Von " + Math.round((extraData.alle.allemitalter/extraData.alle.allegaeste)*100) + "% der Gäste ist das Alter bekannt)"
    $(".textAlt").append(htmlTextAlter);

    var htmlBarchartAlter = "";
    for (var i = 0; i < 5; i++) {
      if (i == 0){allBarClass = "gesamtBar"}
      else {allBarClass = ""}
      htmlBarchartAlter  += 
      '<div class = "infoContent '+allBarClass+'" >' +
          // '<div class = "alt19" style="width: '+(extraData[shows[i]].alter0bis19total / extraData[shows[i]].allemitalter) * 100 +'%" title = "0-19: '+ Math.round((extraData[shows[i]].alter0bis19total / extraData[shows[i]].allemitalter) * 100) +'%" data-toggle="tooltip"></div>' +
          '<div class = "alt29" style="width: '+(extraData[shows[i]].alter0bis29total / extraData[shows[i]].allemitalter) * 100+'%" title = "20-29: ' +Math.round((extraData[shows[i]].alter0bis29total / extraData[shows[i]].allemitalter) * 100) +'%" data-toggle="tooltip"></div>'+
          '<div class = "alt39" style="width: '+(extraData[shows[i]].alter30bis39total / extraData[shows[i]].allemitalter) * 100+'%" title = "30-39: '+ Math.round((extraData[shows[i]].alter30bis39total / extraData[shows[i]].allemitalter) * 100) +'%" data-toggle="tooltip"></div>' +
          '<div class = "alt49" style="width: '+(extraData[shows[i]].alter40bis49total / extraData[shows[i]].allemitalter) * 100+'%" title = "40-49: ' +Math.round((extraData[shows[i]].alter40bis49total / extraData[shows[i]].allemitalter) * 100) +'%" data-toggle="tooltip"></div>'+
          '<div class = "alt59" style="width: '+(extraData[shows[i]].alter50bis59total / extraData[shows[i]].allemitalter) * 100+'%" title = "50-59: ' +Math.round((extraData[shows[i]].alter50bis59total / extraData[shows[i]].allemitalter) * 100) +'%" data-toggle="tooltip"></div>'+
          '<div class = "alt69" style="width: '+(extraData[shows[i]].alter60bis69total / extraData[shows[i]].allemitalter) * 100+'%" title = "60-69: '+ Math.round((extraData[shows[i]].alter60bis69total / extraData[shows[i]].allemitalter) * 100) +'%" data-toggle="tooltip"></div>' +
          '<div class = "alt79" style="width: '+(extraData[shows[i]].alter70bis79total / extraData[shows[i]].allemitalter) * 100+'%" title = "70-79: ' +Math.round((extraData[shows[i]].alter70bis79total / extraData[shows[i]].allemitalter) * 100) +'%" data-toggle="tooltip"></div>'+
          '<div class = "alt80" style="width: '+(extraData[shows[i]].alter80plustotal / extraData[shows[i]].allemitalter) * 100+'%" title = "80+: ' +Math.round((extraData[shows[i]].alter80plustotal / extraData[shows[i]].allemitalter) * 100) +'%" data-toggle="tooltip"></div>'+
        '</div>'
    };
    htmlBarchartAlter  += '<div class = "infoContent" ><small>'+
        // '<div class = "alt19 legendItem"></div><div class = "legendText">0-19</div>' +
        '<div class = "alt29 legendItem"></div><div class = "legendText">0-29</div>' +
        '<div class = "alt39 legendItem"></div><div class = "legendText">30-39</div>' +
        '<div class = "alt49 legendItem"></div><div class = "legendText">40-49</div>' +
        '<div class = "alt59 legendItem"></div><div class = "legendText">50-59</div>' +
        '<div class = "alt69 legendItem"></div><div class = "legendText">60-69</div>' +
        '<div class = "alt79 legendItem"></div><div class = "legendText">70-79</div>' +
        '<div class = "alt80 legendItem"></div><div class = "legendText">80+</div>' +

      '</small></div>';
    $("#barchartAlt").append(htmlBarchartAlter);

    var htmlInfoAlt  = 
    '<div class = "infoContent gesamtBar" >Gesamt: '+Math.round(extraData.alle.altersdurchschnitt * 10)/10+' Jahre</div>'+
      '<div class = "infoContent" >Hart a. F. <br>&#8709; '+Math.round(extraData.hart.altersdurchschnitt * 10)/10+' Jahre</div>'+
      '<div class = "infoContent" >Illner <br>&#8709; '+Math.round(extraData.illner.altersdurchschnitt * 10)/10+' Jahre</div>'+
      '<div class = "infoContent" >Maischberger <br>&#8709; '+Math.round(extraData.maischberger.altersdurchschnitt * 10)/10+' Jahre </div>'+
      '<div class = "infoContent" >Will <br> &#8709; '+Math.round(extraData.will.altersdurchschnitt * 10)/10+' Jahre</div>';
    $("#infoAlt").append(htmlInfoAlt);

    




    // Tooltip
    addTooltip = function (){
      $(function () {
        $('[data-toggle="tooltip"]').tooltip({container: '#top', trigger: 'hover', html: true})
      })
    }
    addTooltip();



    //Graphic on to of Page START

    // //Carousel Interval
    // $('.carousel').carousel({
    //   interval: false
    // })


    //Navagation
    $('.navigation').on('click', function(){
      var openThisGraphic = $(this).attr("value");
      $('.carousel').carousel(Number(openThisGraphic));

      $('.navigation').removeClass('navActive');
      $(this).addClass('navActive');

    })


    //Bind Events from Corousel to Navigation
    $('.carousel').bind('click swipe', function() {
      setTimeout(function(){

          currentIndex =  $('.item.active').attr("value");

          $('.navigation').removeClass('navActive');
        $('.navigation[value=' +currentIndex+ ']').addClass('navActive');

      }, 800);
    });






}

