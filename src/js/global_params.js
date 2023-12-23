function GlobalParams_MakeCorrectHeight(sWidth) {
	let RetParam;
	let CANVAS = document.getElementById("main_babylon_canvas");
	let WindScale = document.getElementById("game_window_scale");
	let CurH = WindScale.getBoundingClientRect().height;
	let CurW = WindScale.getBoundingClientRect().width;
	let Proportions = CurW/CurH;
		RetParam = sWidth/Proportions;
	GLOBAL_PARAM.sHeight = RetParam;
}


var GLOBAL_PARAM = {};
	//GLOBAL_PARAM.sWidth = 1280;	GLOBAL_PARAM.sHeight = 720;
	GLOBAL_PARAM.sWidth = 1024;
	GLOBAL_PARAM.sHeight = 576;
	GLOBAL_PARAM.person_name = "";
	GLOBAL_PARAM.language = "rus";
	GLOBAL_PARAM.canvas;		//Main canvas
	GLOBAL_PARAM.scene;		//Main scene
	GLOBAL_PARAM.camera;	//Player Camera
	GLOBAL_PARAM.cursor_locked = false;	//Player Camera
	GLOBAL_PARAM.maxZ = 50;	
	GLOBAL_PARAM.MyRay;		//Ray from eyes
	GLOBAL_PARAM.ControlDisabled = false;
	GLOBAL_PARAM.hero;
	GLOBAL_PARAM.skeletons = [];
	GLOBAL_PARAM.materials = {};

var SHADOW_LIGHTS_ELEMENTS = [];
var SHADOWS_ELEMENTS = [];
var SHADOWS_CONTAINS = [];
var PHYSICS_COLLISIONS = [];
var MODELS_COLLISION = [];
var EVENTS_COLLECTION = [];	//Game events
	EVENTS_COLLECTION.push({
            "toucher" : GLOBAL_PARAM.MyRay,
            "touchElements": []
        });


function GlobalParams_SaveData() {
	var NewDataJSON = {};
		NewDataJSON.hero_position = GLOBAL_PARAM.hero.position;
		NewDataJSON = JSON.stringify(NewDataJSON);
	console.log(NewDataJSON);
}

function GlobalParams_LoadData() {
	
}

function GlobalParams_LevelLoad() {
	function AddScript(_fileName_) {
		var AddScript = document.createElement("script");
			AddScript.setAttribute("src", "./"+_fileName_+".js");
			AddScript.setAttribute("type", "text/javascript");
		document.head.appendChild(AddScript);
	}
	var GetLink = window.location.href+""; 
	try {
		GetLink = GetLink.split("?level=")[1]+"";
	} catch(no) { GetLink = undefined; } 
	if (GetLink!=undefined && GetLink!=null && GetLink!="") {
		AddScript(GetLink);
	}
}