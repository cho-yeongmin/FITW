import * as THREE from 'three';
import { DoubleSide, Mesh, NearestFilter, Scene } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {PreventDragClick} from './PreventDragClick';
import {GUI} from 'dat.gui'

import makeTileWall from './makeTileWall';
// ----- 주제: 

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
    let canvas_window = document.querySelector(".canvas_window");
	
	
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(canvas_window.offsetWidth, canvas_window.offsetHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);


	//텍스쳐로더
	const loadingManger = new THREE.LoadingManager();
	loadingManger.onStart = () => {
	
	console.log('로드 시작');
	
	};
	
	loadingManger.onProgress = img => {
	
	console.log(img + '로드');
	
	};
	
	loadingManger.onLoad = () => {
	
	console.log('로드 완료');
	
	};
	
	loadingManger.onError = () => {
	
	console.log('에러');
	
	};

	const textureLoader = new THREE.TextureLoader(loadingManger);
	const f_tileImg = textureLoader.load('/textures/test_gray_tile.jpg');
	const f_tileImg_normal = textureLoader.load('/textures/test_gray_tile_normal.jpg');
	const fl_tileImg = textureLoader.load('/textures/2c302151edf98.jpg');
	const fl_tileImg_normal = textureLoader.load('/textures/2c302151edf98_normal.jpg');
	const homeMatSize = 0.01;

	f_tileImg.magFilter = NearestFilter;
	fl_tileImg.magFilter = NearestFilter;
	
	// Scene
	const scene = new THREE.Scene();
	scene.background = new THREE.Color('white');
	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		canvas_window.offsetWidth / canvas_window.offsetHeight,
		0.1,
		1000
	);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 10;
	scene.add(camera);


	const gui = new GUI();
	gui.add(camera.position,'x',0,10);
	gui.add(camera.position,'y',0,10);
	gui.add(camera.position,'z',0,10);
	gui.add(camera.rotation,'y',0,Math.PI);
	gui.add(camera.rotation,'x',0,Math.PI);
	gui.add(camera.rotation,'z',0,Math.PI);
	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera,renderer.domElement)
	// const helper = new THREE.CameraHelper( camera );
	// scene.add( helper );


	const axesHelper = new THREE.AxesHelper( 5 );
	scene.add( axesHelper );

	// Mesh
	const wallWidth = 2;
	const wallHeight = 2;
	let meshs=[];

	const planeGeometry = new THREE.PlaneGeometry(
		wallWidth,
		wallHeight,
		1,
		1
	);
	const PlaneMesh = new THREE.MeshStandardMaterial({
		// wireframe:true		
	});

	const Plane = new THREE.Mesh(planeGeometry,PlaneMesh);
	Plane.name = 'ㅎㅇㅎㅇ'
	scene.add(Plane);
	meshs.push(Plane);
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	// 그리기
	const clock = new THREE.Clock();

	function checkIntersencts(){
		if (preventDragClick.mouseMoved) return;
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(meshs);
		for (const item of intersects){
			console.log(item.object.name);
			break;
		}
	}

	function draw() {
		const time = clock.getElapsedTime();
		
		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	let f_wall = new THREE.Group();
	function makeFrontTileWallCallBack(){
		f_wall.clear();
		const f_wallWidth = document.getElementById('f_wallWidth').value;
		const f_wallHeight = document.getElementById('f_wallHeight').value;
		
		const f_tileWidth = Number(document.getElementById('f_tileWidth').value);
		const f_tileHeight =  Number(document.getElementById('f_tileHeight').value);
		f_wall = makeTileWall(f_wallWidth,f_wallHeight,f_tileWidth,f_tileHeight,f_tileImg,-1,homeMatSize,f_tileImg_normal)
		
		scene.remove(Plane);
		scene.add(f_wall);
		makeSideTileWallCallBack();
		makeFloorTileWallCallBack();

	}
    
	let s_wall = new THREE.Group();
	function makeSideTileWallCallBack(){
		s_wall.clear();
		const s_wallWidth = document.getElementById('s_wallWidth').value;
		const s_wallHeight = document.getElementById('f_wallHeight').value;
		
		const s_tileWidth = Number(document.getElementById('s_tileWidth').value);
		const s_tileHeight =  Number(document.getElementById('s_tileHeight').value);
		s_wall = makeTileWall(s_wallWidth,s_wallHeight,s_tileWidth,s_tileHeight,f_tileImg,1,homeMatSize,f_tileImg_normal)
		s_wall.rotation.y = -Math.PI/2;
		scene.add(s_wall);
		makeFloorTileWallCallBack();
	}

	let floor_wall = new THREE.Group();
	function makeFloorTileWallCallBack(){
		floor_wall.clear();
		const fl_wallWidth = document.getElementById('f_wallWidth').value;
		const fl_wallHeight = document.getElementById('s_wallWidth').value;
		
		const fl_tileWidth = Number(document.getElementById('fl_tileWidth').value);
		const fl_tileHeight =  Number(document.getElementById('fl_tileHeight').value);
		floor_wall = makeTileWall(fl_wallWidth,fl_wallHeight,fl_tileWidth,fl_tileHeight,fl_tileImg,1,0,f_tileImg_normal)
		floor_wall.rotation.x = Math.PI/2;
		scene.add(floor_wall);
	}

	function setSize() {
		camera.aspect = canvas_window.offsetWidth / canvas_window.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(canvas_window.offsetWidth, canvas_window.offsetHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);	
	canvas.addEventListener('click',e=>{
		// console.log(e.clientX, e.clientY);
		mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
		mouse.y = (e.clientY / canvas.clientHeight * 2 - 1)*-1;
		checkIntersencts();
	})

	const front_wall = document.querySelector('.tools_window .front_wall');
	front_wall.addEventListener('change',makeFrontTileWallCallBack);

	const side_wall = document.querySelector('.tools_window .side_wall');
	side_wall.addEventListener('change',makeSideTileWallCallBack);

	
	const floor = document.querySelector('.tools_window .floor');
	floor.addEventListener('change',makeFloorTileWallCallBack);

	const preventDragClick = new PreventDragClick(canvas);

	draw();
}
