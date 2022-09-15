import * as THREE from 'three';
import dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { DoubleSide, MathUtils, Vector3, NearestFilter } from 'three';

// 함수추가
import  custom_node  from './struct_node';
import drawLine from './drawLine';
import {PreventDragClick} from './PreventDragClick';

export default function initTHREE() {
    // // plane 저장
    // let sidePlane = [];     let numSidePlane = 0;
    // let topPlane = [];      let numTopPlane = 0;
    // let botPlane = [];      let numBotPlane = 0;
    // let divSidePlane = [];  let numDivSidePlane = 0;
    // let divTopPlane = [];   let numDivTopPlane = 0;
    // let divBotPlane = [];   let numDivBotPlane = 0;

    // 각, 거리 변수
    let t_angle = 0;
    let t_length = 0;
    let angle = []; angle[0] = 0;       // 외곽선 노드간 각도
    let length = []; length[0] = 0;     // 외곽선 노드간 길이

	//텍스쳐로더 /////////////영민
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
	const f_tileImg = textureLoader.load('/textures/realWorldTile_core2.jpg');
	const f_tileImg_normal = textureLoader.load('/textures/realWorldTile_normal.jpg');
	const fl_tileImg = textureLoader.load('/textures/test_gray_tile.jpg');
	const fl_tileImg_normal = textureLoader.load('/textures/test_gray_tile_normal.jpg');
	const homeMatSize = 0.01;

	f_tileImg.magFilter = NearestFilter;
	fl_tileImg.magFilter = NearestFilter; //////////////////////////////////////////////////

    // // 노드 좌표
    // class node{

    //     constructor(){
    //         let numNode;
    //     }
        
    // }
    let node = [];                      // 외곽선 노드
    node[0] = new custom_node(0,0,0);   // 노드 초기값(0,0,0) 설정
    let numNode = 0;                       // 노드 개수

    // 공간 높이
    let height = 1;
    
    //// 버튼입력
    // 직진
    document.getElementById("id_btn_upper").addEventListener("click",btn_upper);
    function btn_upper(){
        console.log("id_btn_top: ",t_angle);
    };

    // 왼쪽
    document.getElementById("id_btn_left").addEventListener("click",btn_left);
    function btn_left(){
        t_angle -= 90;
        if(t_angle < 0){
            t_angle += 360;
        }
        console.log("id_btn_left: ",t_angle);
    };
    // 오른쪽
    document.getElementById("id_btn_right").addEventListener("click",btn_right);
    function btn_right(){
        t_angle += 90;
        if(t_angle >= 360){
            t_angle -= 360;
        }
        console.log("id_btn_right: ",t_angle);
    };
    // 길이 입력
    document.getElementById("id_btn_length").addEventListener("click",btn_length);
    function btn_length(){
        t_length = Number(document.getElementById("id_input_length").value);
        // console.log(length);
        // drawLine(t_length, t_angle, length, angle, node, numNode, scene);
        // console.log(length);
        if(t_length == 0){
            alert('길이가 0입니다.');
            return 0;
        }else if(t_length < 0){
            alert('길이가 음수입니다.');
            return 0;
        }
        if(angle[numNode-1] == t_angle){
            length[numNode-1] += t_length;
            console.log(length[numNode-1],t_length);
            numNode--;
        }else{
            angle[numNode] = t_angle;
            length[numNode] = t_length;
        }

        // 좌표계산     --> x[0], y[0]은 (0,0,0) 원점의 좌표
        let t_x = node[numNode].x + length[numNode] * Math.sin(MathUtils.degToRad(angle[numNode]));
        let t_z = node[numNode].z - length[numNode] * Math.cos(MathUtils.degToRad(angle[numNode]));
        node[numNode+1] = new custom_node(t_x,0,t_z);
        numNode++;

        const material = new THREE.LineBasicMaterial({
            color: 'white'
        });
        const points = [];
        points.push(new THREE.Vector3(0,0,0));
        for(let i = 1; i <= numNode; i++){
            points.push(new THREE.Vector3(node[i].x,0,node[i].z));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry,material);
        scene.add(line);
    };
    // 공간 생성
    document.getElementById('id_btn_create').addEventListener('click',btn_create);
    function btn_create(){
        if(numNode == 0){
            alert('공간을 생성할 수 없습니다.');
            return 0;
        }
        height = Number(document.getElementById('id_input_height').value);
        if(height == 0){
            alert('높이가 0 입니다.');
            return 0;
        }else if(height < 0){
            alert('높이가 음수 입니다.');
            return 0;
        }
        
        // 옆면
        for(let i = 0; i < numNode; i++){
            // console.log(i, angle[i], length[i], x[i], y[i], x[i+1],y[i+1]);
            const geometry = new THREE.PlaneGeometry(
                length[i],
                height,
                1,
                1
            )
            const material = new THREE.MeshStandardMaterial({
                color: 'white',
                side: DoubleSide
            })
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (node[i].x + node[i+1].x) / 2;
            mesh.position.y = height / 2;
            mesh.position.z = (node[i].z + node[i+1].z) / 2;
            mesh.rotateY(MathUtils.degToRad(angle[i] + 90));
            scene.add(mesh);
        }
        
        //아랫면
        const botShape = new THREE.Shape();
        botShape.moveTo(node[0].x, -node[0].z);
        for(let i = 1; i < numNode; i++){
            botShape.lineTo(node[i].x, -node[i].z);
        }
        console.log(botShape);
        const botGeom = new THREE.ShapeGeometry(botShape);
        const botMaterial = new THREE.MeshStandardMaterial({
            color: 'white',
            side: DoubleSide
        });
        const botMesh = new THREE.Mesh(botGeom, botMaterial);
        botMesh.rotateX(MathUtils.degToRad(-90));
        console.log(botMesh);
        scene.add(botMesh);

        // 윗면
        // const topGeom = new THREE.ShapeGeometry(botShape);
        // const topMaterial = new THREE.MeshStandardMaterial({
        //     color: 'green',
        //     side: DoubleSide
        // });
        // const topMesh = new THREE.Mesh(topGeom, topMaterial);
        // topMesh.rotateX(MathUtils.degToRad(-90));
        // topMesh.translateOnAxis(new Vector3(0,0,1),height);
        // scene.add(topMesh);
    }

    // 타일크기로 분할
    let meshs=[];


    let tile_width = 0;
    let tile_height = 0;
    document.getElementById("id_btn_tile").addEventListener("click",btn_tile);
    function btn_tile(){
        meshs = [];
        tile_width = Number(document.getElementById("id_input_tile_width").value);
        tile_height = Number(document.getElementById("id_input_tile_height").value);

        // 옆면 분할
        for (let i = scene.children.length - 1; i >= 0; i--) {
            if(scene.children[i].type === "Mesh")
                scene.remove(scene.children[i]);
        }
        for(let i = 0; i < numNode; i++){
            // 변수 선언
            let spareWidth = (length[i]%tile_width) * 0.5;  // 여분 --> 가로는 양사이드에 여분타일 추가
            let spareHeight = (height%tile_height);   // 여분 --> 세로는 아래쪽에만 여분타일 추가
            let numberWidth = parseInt(length[i]/tile_width) + 2;
            let numberHeight = parseInt(height/tile_height) + 1;
            let bufLength = []; // index 1부터 시작
            let bufHeight = []; // index 1부터 시작
            let bufAngle = angle[i];
            
            // 타일별 높이, 각 입력
            bufLength[1] = spareWidth;
            bufLength[numberWidth] = spareWidth;
            for(let idx = 2; idx < numberWidth; idx++){
                bufLength[idx] = tile_width;
            }

            bufHeight[numberHeight] = spareHeight;
            for(let idx = 1; idx < numberHeight; idx++){
                bufHeight[idx] = tile_height;
            }
            console.log(bufLength);
            console.log(bufHeight);

            // 좌표계산
            let planeNode = [];
            planeNode[0] = new custom_node(node[i].x,height,node[i].z);
            let pre_X, pre_Y, pre_Z;
            let cur_X, cur_Y, cur_Z;
            for(let h = 0; h < numberHeight + 1; h++){
                if(h == 0){
                    cur_Y = planeNode[0].y;
                }
                else{
                    pre_Y = planeNode[(h - 1) * (numberWidth + 1)].y
                    cur_Y = pre_Y - bufHeight[h];
                }
                for(let w = 0; w < numberWidth + 1; w++){
                    if(w == 0){
                        cur_X = planeNode[0].x;
                        cur_Z = planeNode[0].z;
                    }
                    else{
                        pre_X = planeNode[w - 1].x;
                        pre_Z = planeNode[w - 1].z;
                        cur_X = pre_X + bufLength[w] * Math.sin(MathUtils.degToRad(bufAngle));
                        cur_Z = pre_Z - bufLength[w] * Math.cos(MathUtils.degToRad(bufAngle));
                    }
                    planeNode[h * (numberWidth + 1) + w] = new custom_node(
                        cur_X,
                        cur_Y,
                        cur_Z
                    );
                } 
            }

            // plane생성
            for(let h = 1; h < numberHeight + 1; h++){
                for(let w = 1; w < numberWidth + 1; w++){
                    const geometry = new THREE.PlaneGeometry(
                        bufLength[w],
                        bufHeight[h],
                        1,
                        1
                    );
                    const color = THREE.MathUtils.randInt(0, 0xffffff)
                    const material = new THREE.MeshStandardMaterial({
                        color: color,
                        side: DoubleSide
                    });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = (planeNode[(h - 1) * (numberWidth + 1) + (w - 1)].x + planeNode[h * (numberWidth + 1) + w].x) * 0.5;
                    mesh.position.y = (planeNode[(h - 1) * (numberWidth + 1) + (w - 1)].y + planeNode[h * (numberWidth + 1) + w].y) * 0.5;
                    mesh.position.z = (planeNode[(h - 1) * (numberWidth + 1) + (w - 1)].z + planeNode[h * (numberWidth + 1) + w].z) * 0.5;
                    mesh.rotateY(MathUtils.degToRad(bufAngle + 90));
                    mesh.name = String(i*100 + h*10 + w)
                    scene.add(mesh);
                    meshs.push(mesh); ////영민
                }
            }
        }

        // 바닥면 분할
        
    };

    // Renderer
    const canvas = document.querySelector('#id_three-Canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.y = 8;
    camera.lookAt(0,0,0);
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('white', 1);
    directionalLight.position.y = 8;
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // AxesHelper
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);

    // Dat GUI
    // const gui = new dat.GUI({autoPlace:false});
    // gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
    // gui.add(camera.position, 'y', -5, 5, 0.1).name('카메라 Y');
    // gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');

    // var customContainer = document.getElementById('id_datGUI');
    // customContainer.appendChild(gui.domElement);

    // 그리기


    ////////////영민 추가
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	let count = 0;
    let clickPoints = [];
    let selectedMesh = [];

    function checkIntersencts_start(){
        clickPoints = [];

        if(selectedMesh.length!=0){
            for(let i = 0; i<selectedMesh.length; i++){
                selectedMesh[i].material.opacity = 1;
            }
            selectedMesh = [];
        }


		if (preventDragClick.mouseMoved) return;
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(meshs);
		for (const item of intersects){
            clickPoints.push(item.object);
            item.object.material.transparent = true;
            item.object.material.opacity = 0.7;
			break;
		}
	}

    function checkIntersencts_end(){
		if (preventDragClick.mouseMoved) return;
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(meshs);
		for (const item of intersects){
            clickPoints.push(item.object);
            item.object.material.transparent = true;
            item.object.material.opacity = 0.7;
			break;
		}
        
        for(let i=0; i<scene.children.length;i++){
            if(scene.children[i] instanceof THREE.Mesh){
                const current_num = parseInt(scene.children[i].name)
                let start_point = parseInt(clickPoints[0].name);
                let end_point = parseInt(clickPoints[1].name);
                if(start_point > end_point){
                    const dummy = start_point;
                    start_point = end_point;
                    end_point = dummy;
                }

                if(current_num<=end_point && current_num>=start_point){
                    if((current_num%10)<=(end_point%10) && (current_num%10)>=(start_point%10)){
                        console.log(current_num)
                        scene.children[i].material.transparent = true;
                        scene.children[i].material.opacity = 0.7; 
                        selectedMesh.push(scene.children[i])

                    }
                }
            }
        }
        console.log(selectedMesh)
	}

    document.addEventListener('keydown',e=>{
        const keyCode = e.key;
        if(keyCode=='Escape'){
            if(clickPoints.length!=0){
                for(let i = 0; i < clickPoints.length; i++){
                    clickPoints[i].material.opacity = 1;
                }
            }
            if(selectedMesh.length!=0){
                for(let i=0; i < selectedMesh.length; i++){
                    selectedMesh[i].material.opacity = 1;
                }
            }
            clickPoints = [];
            selectedMesh = [];
            count = 0;
        }
    })

	canvas.addEventListener('dblclick',e=>{
        count = count + 1;
        mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
        mouse.y = ((e.clientY-canvas.getBoundingClientRect().top) / canvas.clientHeight * 2 - 1)*-1;
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(meshs);
        if(intersects.length == 0 ){
            count = count - 1;
            return;
        }
        if((count%2) == 1){
            checkIntersencts_start();
        }
        else if ((count%2) == 0){
            checkIntersencts_end();
        }
        
	})

    
    document.getElementById("getMaterial").addEventListener("click",changeTexture);
    function changeTexture(){
        if(selectedMesh.length!=0){
            for(let i=0; i < selectedMesh.length; i++){
                selectedMesh[i].material.map = f_tileImg;
                selectedMesh[i].material.needsUpdate = true;
                selectedMesh[i].material.opacity = 1;
                selectedMesh[i].material.color.set( 0xffffff );
            }
        } 
    }


    function draw() {
        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    }

    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }


    // 이벤트
    window.addEventListener('resize', setSize);

	const preventDragClick = new PreventDragClick(canvas);

    draw();
}