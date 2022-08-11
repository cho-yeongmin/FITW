import * as THREE from 'three';
import { DoubleSide, Mesh, Scene } from 'three';
import remadeTileWall from './remadeTileWall';

export default function makeTileWall(wallWidth,wallHeight,tileWidth,tileHeight,tileImg,maegi_direction,homeMat,normalMap){
    const coordinations = [];
    const group = new THREE.Group();
    remadeTileWall(wallWidth,wallHeight,tileWidth,tileHeight,coordinations,homeMat);
    group.clear();
    for(let i = 0; i<coordinations.length; i++){
        const p_Geometry = new THREE.PlaneGeometry(
            coordinations[i].width,
            coordinations[i].height,
            1,
            1
        );
        const P_Mesh = new THREE.MeshStandardMaterial({
            // wireframe:true
            map:tileImg,
            normalMap:normalMap
        });
        P_Mesh.clippingPlanes;
        const Plane_part = new THREE.Mesh(p_Geometry,P_Mesh);
        P_Mesh.side = DoubleSide;
        Plane_part.name = 'ㅎㅇㅎㅇ' + i
        Plane_part.position.x = coordinations[i].x + coordinations[i].width / 2;
        Plane_part.position.y = coordinations[i].y + coordinations[i].height / 2;			
        group.add(Plane_part);
        
        if(i == coordinations.length - 1){
            const planeGeometry = new THREE.PlaneGeometry(
                1,
                1
            );
            const PlaneMesh = new THREE.MeshStandardMaterial({
                normalMap:normalMap
                // wireframe:true		
            });
            PlaneMesh.side = DoubleSide;
            const Plane = new THREE.Mesh(planeGeometry,PlaneMesh);
            Plane.name = 'ㅎㅇㅎㅇ'
               
            Plane.scale.set(wallWidth,wallHeight,1)
            Plane.position.x = wallWidth/2;
            Plane.position.y = wallHeight/2;
            Plane.position.z = maegi_direction * 0.01;
            group.add(Plane);
        }

    }

    return group;
}