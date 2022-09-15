import * as THREE from 'three';
import custom_node from './struct_node';

export default function drawLine(t_length, t_angle, length, angle, node, numNode, scene){
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
        let t_x = node[numNode].x + length[numNode] * Math.sin(THREE.MathUtils.degToRad(angle[numNode]));
        let t_z = node[numNode].z - length[numNode] * Math.cos(THREE.MathUtils.degToRad(angle[numNode]));
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
}