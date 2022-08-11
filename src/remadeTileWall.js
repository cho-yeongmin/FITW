import { Coordinate } from "./coordinate";

export default function remadeTileWall(wallWidth,wallHeight,tileWidth,tileHeight,coordinations,homeMat){
    const tileWidthNum = parseInt(wallWidth / (tileWidth + homeMat));
    const tileHeightNum =  parseInt(wallHeight / (tileHeight + homeMat));    
    const spareWidth = wallWidth - (tileWidthNum * (tileWidth + homeMat));
    const spareHeight = wallHeight - (tileHeightNum * (tileHeight + homeMat));

    const step1Result = step1(tileWidth,tileHeight,homeMat,tileWidthNum,tileHeightNum,coordinations);
    const step2Result = step2(tileWidth,tileHeight,homeMat,tileWidthNum,tileHeightNum,spareWidth,coordinations);
    const step3Result = step3(tileWidth,tileHeight,homeMat,tileWidthNum,tileHeightNum,spareHeight,coordinations);
    const step4Result = step4(tileWidth,tileHeight,homeMat,tileWidthNum,tileHeightNum,spareWidth,spareHeight,coordinations);
 
}

function step1(tileWidth,tileHeight,homeMat,tileWidthNum,tileHeightNum,Coordinations){

    var numOfTiles = tileWidthNum * tileHeightNum;
    let x;
    let y;
    let count = 0;
    let pre_y;
    for(let i = 0; i < numOfTiles; i++){
        var tileWidthInt = parseInt(i / tileWidthNum);
        y = Math.round(100 * tileWidthInt * (tileHeight + homeMat)) / 100;
        if(pre_y != y){
            count = 0;
        }                  
        x = Math.round(100 * (tileWidth + homeMat) * count) / 100;
        pre_y = y
        count += 1;
        var coordinate = new Coordinate(x,y,tileWidth,tileHeight);
        
        Coordinations.push(coordinate);
    }
}

function step2(tileWidth,tileHeight,homeMat,tileWidthNum,tileHeightNum,spareWidth,Coordinations){

    let x;
    let y;

    for(let i = 0; i < tileHeightNum; i++){
        x =  Math.round(100 * tileWidthNum * (tileWidth + homeMat)) / 100;
        y =  Math.round(100 * i * (tileHeight + homeMat)) / 100;
        var coordinate = new Coordinate(x,y, Math.round(100 * spareWidth) / 100,tileHeight);
        Coordinations.push(coordinate);
    }


}



function step3(tileWidth,tileHeight,homeMat,tileWidthNum,tileHeightNum,spareHeight,Coordinations){

    let x;
    let y;

    for(let i = 0; i < tileWidthNum; i++){
        x =  Math.round(100 * i * (tileWidth + homeMat)) / 100;
        y =  Math.round(100 * tileHeightNum * (tileHeight + homeMat)) / 100;
        var coordinate = new Coordinate(x,y,tileWidth, Math.round(100 * spareHeight) / 100);
        Coordinations.push(coordinate);     
    }


}

function step4(tileWidth,tileHeight,homeMat,tileWidthNum,tileHeightNum,spareWidth,spareHeight,Coordinations){
 
    let x;
    let y;

    x =  Math.round(100 * tileWidthNum * (tileWidth + homeMat)) / 100;
    y =  Math.round(100 * tileHeightNum * (tileHeight + homeMat)) / 100;

    var coordinate = new Coordinate(x,y, Math.round(100 * spareWidth) / 100, Math.round(100 * spareHeight) / 100);
    Coordinations.push(coordinate);
}