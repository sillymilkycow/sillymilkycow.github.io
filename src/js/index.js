function addGround(scene) {
    var ground = new BABYLON.MeshBuilder.CreateGround("ground", {height:100, width:100, sundivisions:4}, scene);
    //ground.material = GLOBAL_PARAM.materials[LLGrnd.mat_id];
    ground.rotation = new BABYLON.Vector3(0,0,0);
    ground.checkCollisions = true;
    ground.receiveShadows = true;
}


function addModel(scene, shadowGenerator) {       
    BABYLON.SceneLoader.ImportMeshAsync('', './models/', 'plane.glb').then((result) => {
        //result.meshes[1].scaling = new BABYLON.Vector3(10, 10, 10);
        result.meshes.forEach( (mesh, idx) => {
            //mesh.rotation = new BABYLON.Vector3(0, 0, 0);
            if (idx===1) {
                mesh.checkCollisions = true;  
                //shadowGenerator.addShadowCaster(mesh);
            }
            mesh.receiveShadows = true;
        } );
        //LOADING PRECENTEGES
		window.dispatchEvent(new CustomEvent('setPrecenteges', {detail:{precents:100}}));
        hideLoadingScreen();
        //result.meshes[1].rotation = new BABYLON.Vector3(0, 0, 0);
        //result.meshes[1].position = new BABYLON.Vector3(mdlObj.position[0], mdlObj.position[1], mdlObj.position[2]);
        //result.meshes[1].material = MaterialsGenerator(GLOBAL_PARAM.scene, mdlObj.texture_scale[0], mdlObj.texture_scale[1], mdlObj.texture, mdlObj.normal, undefined, mdlObj.alpha);
        //result.meshes[1].checkCollisions = true;         
    });
}


function addSkyBox(scene) {
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 100.0 }, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skybox.rotation = new BABYLON.Vector3(0, -Math.PI, 0);
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox2/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
}


function MAIN_SceneGenerator(engine, canvas) {
    var scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 5, Math.PI / 2.5, 5, new BABYLON.Vector3(0, 0.5, 0), scene);
    camera.attachControl(canvas, true);
    //camera.position = new BABYLON.Vector3(0, 0, COMMON.position.val); //COMMON.position.val

    const light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 0.5, 0.6), scene);
    light.position = new BABYLON.Vector3(-15, 15, 5);
    light.intensity = 5000;
    light.diffuse = new BABYLON.Color3(0.7, 0.7, 0.7);
    light.specular = new BABYLON.Color3(0, 0, 0);

    //const light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(2, -0.9, -1), scene);
    /**/
    const light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    light2.diffuse = new BABYLON.Color3(0, 0, 0);
	light2.specular = new BABYLON.Color3(0, 0, 0);
	light2.groundColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    //shadowGenerator.useBlurExponentialShadowMap = true;
    //shadowGenerator.blurBoxOffset = 4;
    
    //const box = BABYLON.MeshBuilder.CreateBox("box", {});

    //SKYBOX
    addSkyBox(scene);

    //Add meshes
    addModel(scene, shadowGenerator);
    
    //Add ground
    //addGround(scene);

    camera.checkCollisions = true;

    return scene;
}


function resetRender() {
    window.location.href = window.location.href;
}


function moveIt() {
    
}


function addControlls() {
    let resetBtn = document.getElementById('reset-btn');
    let moveBtn = document.getElementById('move-btn'); 
    resetBtn.addEventListener('click', resetRender);
    moveBtn.addEventListener('click', moveIt);
}


function MAIN_GFX_Start() {
	const canvas = document.getElementById("main_babylon_canvas");  
    canvas.width = window.innerWidth;      
    canvas.height = window.innerHeight;      
	const engine = new BABYLON.Engine(canvas, true, {stencil:true});

    var scene = MAIN_SceneGenerator(engine, canvas);

    engine.runRenderLoop(function() {
       scene.render();
    });

    //LOADING PRECENTEGES
	window.dispatchEvent(new CustomEvent('setPrecenteges', {detail:{precents:25}}));

    addControlls();
}


function hideLoadingScreen() {
    let lScrn = document.getElementById('loadingScreen');
    if (lScrn) {
        lScrn.style.opacity = '0';
        setTimeout(function(){
            lScrn.style.display = 'none';
        }, 1000);
    }
}

window.addEventListener('resize', function(){
    MAIN_GFX_Start();
});

window.addEventListener("load", MAIN_GFX_Start);


