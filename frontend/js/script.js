	$(window).on('scroll resize', function(){

		if ($(document).scrollTop() > $('#top').height()){
			$('#fixedContainer').addClass('fixedBar');
			$('#fixedContainer').width($('#bottom').width());

			var paddingTop = $('#fixedContainer').height() + 0;
			$('#alleGaesteWrapper').css({"padding-top": paddingTop});

			$('#goUp').show();
		}
		else{
			$('#fixedContainer').removeClass('fixedBar');
			$('#fixedContainer').width($('#bottom').width());
			$('#alleGaesteWrapper').css({"padding-top": 0});
			$('#goUp').hide();
		}

	});


	$('#goUp').on('click', function(){
		$("html, body").animate({
				scrollTop: 0
		}, 500);
	})


	$('.radio').on('click', function(){
		var themaSelected = $(this).children().children().attr("value");
		var newEmbedText = '<iframe src="http://apps.dacosto.com/meinungsmaschine/embed.html#'+themaSelected.toLowerCase()+'" width="580px" height="435px"></iframe>';
		$('#embedLink').val(newEmbedText);

	})



//////////////////////
///  Get data  ///
/////////////////////

$.getJSON( "data/extraInfo.json", function( data ) {
	extraData = data;
	makeTopInfo();
	getMoreData();
});



getMoreData = function (){

	$.getJSON( "data/personen.json", function( data ) {
		personenData = data.gaesteData;
		showsData = data.shows;
		makeApp();
	});

}


//Funktion that makes the list
makeApp = function () {



	//////////////////////
	///  Global Vars  ///
	/////////////////////

	var divAlreadRendered = [];
	var tagToStayVisible = "all";
	var sortby = "times";


	//////////////////////
	///  Prepare data  ///
	/////////////////////

	personenData.forEach(function(person) {

		person.shows.forEach(function(show) {
			show.year = show.sendungdatum.slice(6,8);
			show.month = show.sendungdatum.slice(3,5);
			show.day = show.sendungdatum.slice(0,2);
		})
	})

	//Amount of Weeks running Programm
	var startMonth = extraData.alle.firstentry.slice(3,5);
	var startYear = extraData.alle.firstentry.slice(6,8);
	var endMonth = extraData.alle.lastentry.slice(3,5);
	var endYear = extraData.alle.lastentry.slice(6,8);
	var totalMonthsRunningProgramm = endYear * 12 + Number(endMonth) - startYear * 12 - startMonth;
	totalMonthsRunningProgramm = totalMonthsRunningProgramm + 1;	//Total Hack???
	$('#anzahlDerMonate').append(totalMonthsRunningProgramm);


	personenData.forEach(function(person) {
		person.shows.forEach(function(show) {
			show.ausstrahlungsWoche = show.year * 12 + Number(show.month) - startYear * 12 - startMonth;
		})
	})

	//Für die Suche
	gaesteArrayFuerSuche = [];
	personenData.forEach(function(person) {
		gaesteArrayFuerSuche.push(person.name);
	})

	//How many times for each show and person
	for (var i = 0; i < personenData.length; i++) {

		personenData[i].times = personenData[i].shows.length;

		var array_elements = [];
		for (var ii = 0; ii < personenData[i].shows.length; ii++) {
			array_elements.push(personenData[i].shows[ii].sendungart)
		}

		var  counts = {}; 
		array_elements.forEach(function(x) { 
			counts[x] = (counts[x] || 0)+1; 
		});
		personenData[i].willCounter = counts["Anne Will"] || 0;
		personenData[i].maischbergerCounter = counts["Maischberger"] || 0;
		personenData[i].hartCounter = counts["Hart Aber Fair"] || 0;
		personenData[i].illnerCounter = counts["Illner"] || 0;
	}


	

	//Sort the data by amount of times visited AND THEN name
	personenData.objSort("times", -1, "name", 1 );


	//Data for Timeline
	var wrapperWidth = $("#barMainTimeline").width();
	var monatInPixel = wrapperWidth / totalMonthsRunningProgramm;







////////////////////////////////////////////////////////
//   populateTimelineWithTags for Time and Talkshows ///
////////////////////////////////////////////////////////


	populateTimelineWithTags = function (populateBar, x){
		//Populate Timebar with years 
		// (totalMonthsRunningProgramm - 3) / 12; can be improved here
		var anzahlJahre = (totalMonthsRunningProgramm - 1) / 12;
		var startJahr = 14;
		var barJahrPosition = 0;


		for (var iii = 0; iii < anzahlJahre; iii++) {

			var timeBarPosition = (monatInPixel * barJahrPosition) / wrapperWidth * 100;

			if (x){$('.timeBar').append('<div value = "' + barJahrPosition +'" class = "timeBarTag" style="left: ' + timeBarPosition +'%;">Jan ' + startJahr + ' </div>');};
			populateBar.append('<div class = "timeTag"style="left: ' + timeBarPosition + '%;"></div>');

			var moveMonthBy = barJahrPosition / 4;
			var months= ["Apr", "Juli", "Okt"];
			var monthPosition = timeBarPosition + ((monatInPixel / wrapperWidth * 100) * 3)
			for (var iiii = 0; iiii < 3; iiii++) {
				if (x){$('.timeBar').append('<div class = "timeBarTag monthTag" style="left: ' + monthPosition +'%;">' + months[iiii] +'  </div>');};		//' + startJahr + '
				populateBar.append('<div class = "timeTag"style="left: ' + monthPosition + '%;"></div>');
				monthPosition = monthPosition + ((monatInPixel / wrapperWidth * 100) * 3);
			}

			startJahr++;
			barJahrPosition = barJahrPosition + 12;
		}
	}




///////////////////////
//   Filter by show  //
///////////////////////

	var buttonClicked = 0;
	$(".showButton").on('click', function(e){

		// $('#alleGaesteWrapper').scrollTop("0px");

		var whichIdClicked = $(e.currentTarget).attr("id");

		if (whichIdClicked == "buttonMaischberger"){
			sortby = "maischbergerCounter"; 
			tagToStayVisible = "Maischberger"
			$('#anzahlDerShows').html(extraData.maischberger.anzahlshows + " Sandra Maischberger-");
			$('#anzahlDerGaeste').html(extraData.maischberger.allegaeste);

		}
		else if (whichIdClicked == "buttonIllner"){
			sortby = "illnerCounter"; 
			tagToStayVisible = "Illner"
			$('#anzahlDerShows').html(extraData.illner.anzahlshows + " Maybrit Illner-");
			$('#anzahlDerGaeste').html(extraData.illner.allegaeste);
		}
		else if (whichIdClicked == "buttonHart"){
			sortby = "hartCounter"; 
			tagToStayVisible = "Hart Aber Fair"
			$('#anzahlDerShows').html(extraData.hart.anzahlshows + " Hart Aber Fair-");
			$('#anzahlDerGaeste').html(extraData.hart.allegaeste);
		}
		else if (whichIdClicked == "buttonWill"){
			sortby = "willCounter"; 
			tagToStayVisible = "Anne Will"
			$('#anzahlDerShows').html(extraData.will.anzahlshows + " Anne Will-");
			$('#anzahlDerGaeste').html(extraData.will.allegaeste);
		}


		//Buttons style
		$(".showButton").removeClass('active');
		$(".showButton").addClass('notActive');
		

		//If Button is active at the moment
		if (buttonClicked != this){
			$(this).removeClass('notActive');
			$(this).addClass('active');
			buttonClicked = this;
		}
		else{
			sortby = "times"; 
			tagToStayVisible = "all";
			buttonClicked = 0;
			$('#anzahlDerShows').html(extraData.alle.anzahlshows + " ");
			$('#anzahlDerGaeste').html(extraData.alle.allegaeste);
			$(".showButton").removeClass('notActive');
		}

		//Scroll to top of page
		var scrollTo = $('#top').height() +10;


		$("html, body").animate({
			scrollTop: scrollTo
		}, 500);

		

 		$( "#alleGaesteWrapper" ).animate({
			opacity: 0
		}, 400, "linear", function() {
			$("#alleGaesteWrapper").css({opacity: 1.0})
			createEmptyWrapper(sortby);
			
		});

	})



///////////////////////
//  Search function  //
///////////////////////


	$( "#topInnerSearchBar" ).autocomplete({
		minLength: 2,
		// source: function( request, response ) {
		// 	var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
		// 	response( $.grep( gaesteArrayFuerSuche, function( item ){
		// 		return matcher.test( item );
		// 	}) );
		// },
		source: gaesteArrayFuerSuche,
		focus : function(event, ui) {
       		$(this).val(ui.item.label);
     	},
     	select: function( event, ui ) {

     		//Set back to all
     		sortby = "times"; 
			tagToStayVisible = "all";
			createEmptyWrapper(sortby);


     		//What was selected?
     		var selectedValue = ui.item.value;
     		selectedValue = "#" + selectedValue;
			selectedValue = selectedValue.replace(/\s/g, '');


			//Position to scroll to
			var currentPositionOfalleGaesteWrapper = $("html, body").scrollTop();
			var positionToScrollTo = $(selectedValue).offset().top - 240;

			// window.location.hash = selectedValue;
     		$("html, body").animate({
		        scrollTop: positionToScrollTo
		    }, 0);

     		//Add timeout since gastwrapper is not rendered yet
     		setTimeout(function(){

         		//Highlight Name and set back to balch after 5 sec.
			    $(selectedValue).children().children( ".barGastName" ).css({
			    	color:'#DE8F63'//,  "text-shadow": "0 0 3px gray"
			    });
			    setTimeout(function(){
					$(selectedValue).children().children( ".barGastName" ).css({
				    	color:'#5e7582'//,  "text-shadow": "0 0 0px #DE8F63"
				   	});
			    }, 5000);

				//Open Info
			    $(selectedValue).children().children( ".openextraData:first" ).click();

		  
			}, 100);

		//Close searchbar 
		$("#topSearchBar").slideUp( "slow")
			searchOn = false;
     	}
	});





//Check which wrapper is visible and then render it with renderVisibleGastWrapper()

	initGastWrapper = function () {

		var alleGaeste = $('#alleGaesteWrapper').children();
		
		//Go trought all the divs named GaesteWrapper
		for (i = 0; i < alleGaeste.length; i++) {

			var singleGastWrapper = alleGaeste[i];
	    	var singleGastWrapperVisible = $(singleGastWrapper).fracs().visible;
			var divValue = singleGastWrapper.getAttribute("value");

			//If GastWrapperVisible is visible AND has not been rendered yet
			if (singleGastWrapperVisible == 1 && divAlreadRendered.indexOf(divValue) == "-1"){

				divAlreadRendered.push(divValue);
				renderVisibleGastWrapper(divValue, singleGastWrapper, tagToStayVisible);


				for (var ii = 1; ii < 10; ii++) {
					var newDivValue = Number(divValue) + ii;
					if (divAlreadRendered.indexOf(newDivValue.toString()) == "-1"){

						var NewSingleGastWrapper = alleGaeste[i  + ii];
						renderVisibleGastWrapper(newDivValue, NewSingleGastWrapper, tagToStayVisible);
						divAlreadRendered.push(newDivValue.toString());


					};
				}
			}
		}
	}




////////////////////
//  Empty Wrapper //
////////////////////

	createEmptyWrapper = function (whatToFilter) {

		divAlreadRendered = [];
		$("#alleGaesteWrapper").empty();

		personenData.objSort(whatToFilter, -1, "name", 1 );

		//Add empty wrapper with name ids
		for (var i = 0; i < personenData.length; i++) {

			//If all have been rendered OR filtered: count the amout of guests
			if (personenData[i][whatToFilter] == 0 || i + 1 == personenData.length){

				personenData.anzahlDerPersonen = i;
				$('#anzahlDerPersonen').empty().append(personenData.anzahlDerPersonen);

				initGastWrapper();

				return
			};

			var gastName = personenData[i].name.replace('<em>', '');
			$("#alleGaesteWrapper").append(
				'<div id = "' + gastName.replace(/\s/g, '') + '"value = '+ i +' class = "gastWrapper"></div>'
			);

		}	

	}



///////////////////////////
// Append Empty wrappers //
///////////////////////////


	renderVisibleGastWrapper = function (valueOfDiv, divToPopulate, tagToStayVisible) {

		//Unset the fixed height of the empty wrapper
		$(divToPopulate).css({"height": "auto"});

		var gastName = personenData[valueOfDiv].name;
		var gastAnzahlDerBesuche = personenData[valueOfDiv][sortby];
		var gastPartei = '';
		if (personenData[valueOfDiv].partei != "keine Partei"){
			gastPartei = personenData[valueOfDiv].partei;
		}


		$(divToPopulate).append(
			'<div class = "barWrapper">' +
				'<div class = "barCounter openextraData">' +
			    	'<span class= "barCounterNumber">' + gastAnzahlDerBesuche + '</span>' +
			      	'AUFTRITTE' +
			    '</div>' +
			    '<div class= "barGastName openextraData"><i class="fa fa-angle-right openInfoIcon"></i> ' + gastName + ' <span class = "parteiImTitel">' + gastPartei + '</span><span class = "barCounterNumberSmall pull-right visible-xs-block">' + gastAnzahlDerBesuche + ' AUFTRITTE</span></div>' +
			    //'<div class = "gastextraData openextraData"></div>' +
				'<div class="bar openextraData"></div>' +
				'<div class="infoSpace"></div>' +
			'</div>' 

		);


		//Populate bar with tags
		for (var ii = 0; ii < personenData[valueOfDiv].shows.length; ii++) {

			//Only show one type of show OR All
			if (personenData[valueOfDiv].shows[ii].sendungart == tagToStayVisible || tagToStayVisible == "all"){

				var monthAired = personenData[valueOfDiv].shows[ii].ausstrahlungsWoche;

				var barPosition = (monatInPixel * monthAired - 6) / wrapperWidth * 100 ;
				var einTagInPixel = (monatInPixel / wrapperWidth * 100) / 31;
				
				barPosition = barPosition + (einTagInPixel * personenData[valueOfDiv].shows[ii].day);


				//if first bar is outside bar
				if (barPosition < 0) {barPosition= 0};

				var nameOfShowClass;
				if (personenData[valueOfDiv].shows[ii].sendungart  == "Anne Will"){nameOfShowClass= "will"}
				else if (personenData[valueOfDiv].shows[ii].sendungart == "Maischberger"){nameOfShowClass = "maischberger"}
				else if (personenData[valueOfDiv].shows[ii].sendungart  == "Hart Aber Fair"){nameOfShowClass = "hartAberfair"}
				else if (personenData[valueOfDiv].shows[ii].sendungart  == "Illner"){nameOfShowClass = "illner"}

				var dataToAddToTag = personenData[valueOfDiv].shows[ii].sendungart + " - " + personenData[valueOfDiv].shows[ii].sendungdatum + " <br> " + personenData[valueOfDiv].shows[ii].sendungthema;
				dataToAddToTag.replace(/"/g, "'")

				$(divToPopulate).children().children(".bar").append('<div data-toggle="tooltip" title = "'+ dataToAddToTag + '"  value = "' + monthAired +'" class = "barTag ' + nameOfShowClass + ' "style="left: calc(' + barPosition + '% - 0px);"></div>');

			}
		}


		populateThis = $(divToPopulate).children().children(".bar");

		populateTimelineWithTags(populateThis, false);


		addTooltip();

}



/////////////////////
// Open Extra Info //
/////////////////////




var gastWrapperToPopulateWithextraData = 0;


 $('#alleGaesteWrapper').on('click','.openextraData',function(e) {



 		//Close last one if open
 		if ($(gastWrapperToPopulateWithextraData).hasClass( "open" )){

 			$(gastWrapperToPopulateWithextraData).children().children(".infoSpace").slideUp("slow");
 			$(e.currentTarget).parent().parent().removeClass('open');

 		}

 		//If open one should be closed
 		if ($(gastWrapperToPopulateWithextraData).attr("id") == $(e.currentTarget).parent().parent().attr("id")){
 			gastWrapperToPopulateWithextraData = 0;
 			return
 		}


 		$('.gastWrapper').removeClass('open');


		gastWrapperToPopulateWithextraData = $(e.currentTarget).parent().parent();
		$(gastWrapperToPopulateWithextraData).addClass('open');
 			

		//Info no Info has been rendered yet
		if(!$(gastWrapperToPopulateWithextraData).hasClass('hasExtraInfo')){


			$(gastWrapperToPopulateWithextraData).addClass('hasExtraInfo');


				var valueOfDiv = $( this ).parent().parent().attr("value");


				var arrayPosition =  gastWrapperToPopulateWithextraData[0].getAttribute('value');

				//Sort extra Info by year and then date
				personenData[arrayPosition].shows.objSort("year", -1, "month", -1, "day", -1);

				//Add Shows shown
				for (var i = 0; i < personenData[arrayPosition].shows.length; i++) {

					//Only show one type of show OR All
					if (personenData[valueOfDiv].shows[i].sendungart == tagToStayVisible || tagToStayVisible == "all"){	

						var tagClass;
						var nameOfTransmission = personenData[arrayPosition].shows[i].sendungart;

						if ( nameOfTransmission == "Maischberger"){
							tagClass = "maischberger";
						}
						else if ( nameOfTransmission == "Hart Aber Fair"){
							tagClass = "hartAberfair";
						}
						else if ( nameOfTransmission == "Anne Will"){
							tagClass = "will";
						}
						else if ( nameOfTransmission = "Illner"){
							tagClass = "illner";
						}

						if (personenData[arrayPosition].shows[i].sendungkategorie == "Wirtschaft"){
							personenData[arrayPosition].shows[i].sendungkategorie = "Finanzen/Wirtschaft";
						}


						$(gastWrapperToPopulateWithextraData).children().children(".infoSpace").append(
							'<div class ="info"> ' +
								'<div class = "infoShows">' +
								'<div class = "infoTag ' + tagClass + '" ></div>' + 
								'<div class = "showNameInfoWrapper">' + personenData[arrayPosition].shows[i].sendungart + '</div>' + 
								'<div class = "dateNameInfoWrapper">' + personenData[arrayPosition].shows[i].sendungdatum + '</div>' + 
								'<div class = "kategorieInfoWrapper">' + personenData[arrayPosition].shows[i].sendungkategorie + '</div>' + 
								'</div>' +
								'<div class = "showTitleNameInfoWrapper">' + personenData[arrayPosition].shows[i].sendungthema +  
								'&nbsp;&nbsp;<a href="' + personenData[arrayPosition].shows[i].sendunglink +'  " target = "_blank">LINK</a>' + '</div>' +
							'</div>') 
					}
				}

				var addEverySecondGrayTO = '#' + $(gastWrapperToPopulateWithextraData).attr("id") + '  .info:odd';
				$(addEverySecondGrayTO).addClass('Infogrey');

		}//Info renderer

		$(gastWrapperToPopulateWithextraData).children().children(".infoSpace").slideDown( "slow");


 });






/////////////////////////////////////
//   On load create empty wrapper  //
/////////////////////////////////////

	createEmptyWrapper('times');


///////////////////////////////////
//		render GastWrapper 		///
///////////////////////////////////

	$(window).on( 'scroll', function(){
		initGastWrapper();
	});
	//initGastWrapper();
	// $("html, body").animate({scrollTop: 0});



///////////////////////////////////
//		render Timeline 		///
///////////////////////////////////

	var mainTimeLine = $("#barMainTimeline")
	populateTimelineWithTags(mainTimeLine, true);



	// Tooltip
	addTooltip = function (){
		$(function () {
		  $('[data-toggle="tooltip"]').tooltip({container: '#alleGaesteWrapper', trigger: 'hover', html: true})
		})
	}
	addTooltip();



	var showList = "<small><ul>";
	for (var i = 0; i < showsData[0].length; i++) {
		showList += "<li>" + showsData[0][i].sendungdatum + "&nbsp;&nbsp;<b>" + showsData[0][i].sendungart + "</b>&nbsp;&nbsp;" + showsData[0][i].sendungthema + "&nbsp;&nbsp;("+  showsData[0][i].sendungkategorie  + ", "+ showsData[0][i].sendungschlagwort  + ")&nbsp;<a href=" + showsData[0][i].sendunglink + " target='_blank'> Link </a></li>"
	}
	showList += "</ul></small>";

	$("#showListe").html(showList)


}











///////////////////////////////////
//		MakeTopInfo   		///
///////////////////////////////////


makeTopInfo = function (){


$('#anzahlDerShows').append(extraData.alle.anzahlshows + " ");
$('#anzahlDerGaeste').html(extraData.alle.allegaeste);

var shows = ["alle", "hart", "illner","maischberger","will"];
var allBarClass = "";

//Talkshow Stand 
$('.stand').html(extraData.alle.lastentry);
$('.anzahlShows').html(extraData.alle.anzahlshows);
$('.anzahlGaeste').html(extraData.alle.allegaeste);



String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


//Funktions for Statistics

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

		var htmlTextFM = "Insgesamt wurden in den "+extraData.alle.anzahlshows +" Talkshows "+extraData.alle.maennergaestegesamt+" Männer und "+extraData.alle.frauengeastegesamt+" Frauen eingeladen. Damit liegt der Frauenanteil der Gäste im Durchschnitt bei " + Math.round(extraData.alle.frauenProzent) + "%. Die Sendung " + maxFrauen.name + " hat mit "+Math.round(maxFrauen.frauenProzent)+"% den höchsten, die Sendung "+minFrauen.name+" mit "+Math.round(minFrauen.frauenProzent)+"% den niedrigsten Frauenanteil."
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
		'<div class = "infoContent gesamtBar" >'+Math.round(extraData.alle.frauenProzent)+'% Frauenanteil <br><small>(' + extraData.alle.frauengeastegesamt + ' von ' + extraData.alle.allegaeste+' Gästen)</small></div>'+
			'<div class = "infoContent" >'+Math.round(extraData.hart.frauenProzent)+'% <small> (' + extraData.hart.frauengeastegesamt + ' von ' + extraData.hart.allegaeste+')</small></div>'+
			'<div class = "infoContent" >'+Math.round(extraData.illner.frauenProzent)+'% <small> (' + extraData.illner.frauengeastegesamt + ' von ' + extraData.illner.allegaeste+')</small></div>'+
			'<div class = "infoContent" >'+Math.round(extraData.maischberger.frauenProzent)+'%<small> (' + extraData.maischberger.frauengeastegesamt + ' von ' + extraData.maischberger.allegaeste+')</small></div>'+
			'<div class = "infoContent" >'+Math.round(extraData.will.frauenProzent)+'% <small> (' + extraData.will.frauengeastegesamt + ' von ' + extraData.will.allegaeste+')</small></div>';
		$("#infoFM").append(htmlInfoFM);




		//Politker

		var maxPartei = getMaxKey(extraData, "alle", ["spd","cducsu","gruene","linke","afd","fdp","andere"])[1].toUpperCase();
		var maxPolitker = getMax(extraData, "alllemitpartei");
		var minPolitker = getMin(extraData, "alllemitpartei");


		//var htmlTextPol = "Parteivertreter werden häufig eingeladen. Im Durchschnitt waren " + Math.round((extraData.alle.alllemitpartei/extraData.alle.allegaeste)*100) + "% der Gäste auch Parteivertreter. Die Partei " + maxPartei + " wurde im Durchschnitt am häufigsten eingeladen. Besonders häufig werden Parteipolitiker in der Sendung "+ maxPolitker.name +" eingeladen ("+ Math.round((maxPolitker.alllemitpartei/maxPolitker.allegaeste)*100) +"%).";
		var htmlTextPol ="Von den Gästen waren " + Math.round((extraData.alle.alllemitpartei/extraData.alle.allegaeste)*100) + "% Politiker. Das Diagramm schlüsselt sie nach Parteien auf. Am häufigsten eingeladen wurde: " + maxPartei + ". Am meisten Politiker kamen zu "+ maxPolitker.name +" ("+ Math.round((maxPolitker.alllemitpartei/maxPolitker.allegaeste)*100) +"%) - am wenigsten zu "+minPolitker.name+" ("+ Math.round((minPolitker.alllemitpartei/minPolitker.allegaeste)*100) +"%)."
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
		'<div class = "infoContent gesamtBar" >'+Math.round((extraData.alle.alllemitpartei/extraData.alle.allegaeste)*100)+'% Politikeranteil<br><small> (' + extraData.alle.alllemitpartei + ' von ' + extraData.alle.allegaeste+' Gästen)</small></div>'+
			'<div class = "infoContent" >'+Math.round((extraData.hart.alllemitpartei/extraData.hart.allegaeste)*100)+'% <small> (' + extraData.hart.alllemitpartei + ' von ' + extraData.hart.allegaeste+')</small></div>'+
			'<div class = "infoContent" >'+Math.round((extraData.illner.alllemitpartei/extraData.illner.allegaeste)*100)+'% <small> (' + extraData.illner.alllemitpartei+' von ' + extraData.illner.allegaeste+')</small></div>'+
			'<div class = "infoContent" >'+Math.round((extraData.maischberger.alllemitpartei/extraData.maischberger.allegaeste)*100)+'% <small> (' + extraData.maischberger.alllemitpartei + ' von ' + extraData.maischberger.allegaeste+')</small></div>'+
			'<div class = "infoContent" >'+Math.round((extraData.will.alllemitpartei/extraData.will.allegaeste)*100)+'% <small> (' + extraData.will.alllemitpartei + ' von ' + extraData.will.allegaeste+')</small></div>';
		$("#infoPol").append(htmlInfoPol);



		//Thema

		// var maxThema = getMaxKey(extraData, "alle", ["innenpolitik","aussenpolitik","wirtschaft","gesellschaft"])[1];

		var htmlTextThema = "Top 10-Themen:<br><br><ul>";
		for (var i = 0; i < 5; i++) {
			htmlTextThema += "<li>" + extraData.alle.schlagwort[i].name + " (" + extraData.alle.schlagwort[i].times + " mal)</li>"
		};
		htmlTextThema += "</ul>";

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
		'<div class = "infoContent gesamtBar" >Top Themen:</div>'+
			'<div class = "infoContent" >'+extraData.hart.schlagwort[0].name+' ('+extraData.hart.schlagwort[0].times+' mal)</small></div>'+
			'<div class = "infoContent" >'+extraData.illner.schlagwort[0].name+' ('+extraData.illner.schlagwort[0].times+' mal)</small></div>'+
			'<div class = "infoContent" >'+extraData.maischberger.schlagwort[0].name+' ('+extraData.maischberger.schlagwort[0].times+' mal)</small></div>'+
			'<div class = "infoContent" >'+extraData.will.schlagwort[0].name+' ('+extraData.will.schlagwort[0].times+' mal)</small></div>';
		$("#infoKat").append(htmlInfoThema);


		// ALter

		var htmlTextAlter = "Von den "+extraData.alle.allegaeste+" Gästen ist uns von "+extraData.alle.allemitalter+" das Geburtsjahr bekannt. Nimmt man den Zeitpunkt ihres Auftritts, waren die Gäste im Durchschnitt "+ Math.round(extraData.alle.altersdurchschnitt*10)/10+" Jahre alt. Der jüngste Gast war " + extraData.alle.alterjuengstergast+" Jahre (" + extraData.alle.juengstergast+"), der älteste "+extraData.alle.alteraeltestergast+" Jahre (" + extraData.alle.aeltestergast+") alt.";

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
		'<div class = "infoContent gesamtBar" >Durchschnittsalter:<br>'+Math.round(extraData.alle.altersdurchschnitt * 10)/10+' Jahre</div>'+
			'<div class = "infoContent" >&#8709; '+Math.round(extraData.hart.altersdurchschnitt * 10)/10+' Jahre</div>'+
			'<div class = "infoContent" >&#8709; '+Math.round(extraData.illner.altersdurchschnitt * 10)/10+' Jahre</div>'+
			'<div class = "infoContent" >&#8709; '+Math.round(extraData.maischberger.altersdurchschnitt * 10)/10+' Jahre </div>'+
			'<div class = "infoContent" >&#8709; '+Math.round(extraData.will.altersdurchschnitt * 10)/10+' Jahre</div>';
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




