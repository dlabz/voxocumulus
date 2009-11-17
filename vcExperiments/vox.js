var aVoxel = new Object();


var aCube = new Object();
	aCube.size = 16; //apart from testing with different model sizes, we might allow any cube to be subdevided in more than one power of 2
	//aCube.UID = newUID(); // TODO: UID 
	aCube.voxels = new Array(); //3D Array of voxel color.
	aCube.sides = new Array(); //Array of sides bump maps
	





//create a random cube
aCube.randomize = function(){
	aCube.voxels = new Array();
	for (var i = 0; i < aCube.size; i++){
		aCube.voxels[i] = new Array();
		for (var j = 0; j < aCube.size; j++){
			aCube.voxels[i][j] = new Array();
			for (var k = 0; k < aCube.size; k++){
				if (randRange(1,10)> 0) {
					aCube.voxels[i][j][k] = new Object();
					aCube.voxels[i][j][k].sides = new Array();
					aCube.voxels[i][j][k].ARGB = (randRange(0xFFFEEE8F, 0xFFFFFFFF));
				} else {
					aCube.voxels[i][j][k] = undefined;
				};
			//document.write(vMatrix[i][j][k]+ "<br />");
			};
		};
	};
//document.write(vMatrix.length);
	
}; 



function randRange(start,end) {
	return Math.floor(start + (Math.random()*(end-start)));
};





aCube.rebuild = function(){//a method calculating what sides of each voxel should be rendered. If Turns out to be slow, I'll write a shader to do this
//alert("rebuilding voxels");
	if (arguments.length > 0) { 
		var x = arguments[0];
		var y = arguments[1];
		var z = arguments[2];
		aCube.reskin(x, y, z);
	}else {
		for (var x = 0; x < aCube.size; x++) {
			for (var y = 0; y < aCube.size; y++) {
				for (var z = 0; z < aCube.size; z++) {
					aCube.reskin(x, y, z);
				};
			};
		};
	};
	//alert("generation done");
};

aCube.reskin = function(x, y, z){ //function that does actual crunching. this one deasn-t handle surrounding objects... might need that
    var x = arguments[0];
    var y = arguments[1];
    var z = arguments[2];
    //alert(aCube.voxels[x][y][z]);
    if (aCube.voxels[x][y][z] != null) {
        aCube.voxels[x][y][z].sides = new Array(true, true, true, true, true, true);
        if (x < aCube.size - 1) {
            if (aCube.voxels[x + 1][y][z] == undefined) {
                aCube.voxels[x][y][z].sides[0] = true;
            }
            else {
                aCube.voxels[x][y][z].sides[0] = false;
            };
                };
        if (x > 0) {
            if (aCube.voxels[x - 1][y][z] == undefined) {
                aCube.voxels[x][y][z].sides[1] = true;
            }
            else {
                aCube.voxels[x][y][z].sides[1] = false;
            };
                };
        if (y < aCube.size - 1) {
            if (aCube.voxels[x][y + 1][z] == undefined) {
                aCube.voxels[x][y][z].sides[2] = true;
            }
            else {
                //alert("stripp y0");
                aCube.voxels[x][y][z].sides[2] = false;
            };
                };
        if (y > 0) {
            if (aCube.voxels[x][y - 1][z] == undefined) {
                aCube.voxels[x][y][z].sides[3] = true;
            }
            else {
                aCube.voxels[x][y][z].sides[3] = false;
            };
                };
        if (z < aCube.size - 1) {
            if (aCube.voxels[x][y][z + 1] == undefined) {
                aCube.voxels[x][y][z].sides[4] = true;
            }
            else {
                aCube.voxels[x][y][z].sides[4] = false;
            };
                };
        if (z > 0) {
            if (aCube.voxels[x][y][z - 1] == undefined) {
                aCube.voxels[x][y][z].sides[5] = true;
            }
            else {
                aCube.voxels[x][y][z].sides[5] = false;
            };
                };
        };
    //alert("done skinning");

};







//this doesn't work
aCube.createVoxelVertices = function(size, x,y,z) {
  var k = size / 2;
	//var x = x;
	//var y = y;
	//var z = z;

  var cornerVertices = [
    [-k, -k, -k],
    [+k, -k, -k],
    [-k, +k, -k],
    [+k, +k, -k],
    [-k, -k, +k],
    [+k, -k, +k],
    [-k, +k, +k],
    [+k, +k, +k]
  ];

  var faceNormals = [
    [+1, +0, +0],
    [-1, +0, +0],
    [+0, +1, +0],
    [+0, -1, +0],
    [+0, +0, +1],
    [+0, +0, -1]
  ];

  var uvCoords = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1]
  ];

  var vertexInfo = o3djs.primitives.createVertexInfo();
  var positionStream = vertexInfo.addStream(
      3, o3djs.base.o3d.Stream.POSITION);
  var normalStream = vertexInfo.addStream(
      3, o3djs.base.o3d.Stream.NORMAL);
  var texCoordStream = vertexInfo.addStream(
      2, o3djs.base.o3d.Stream.TEXCOORD, 0);
  var n = 0;
  for (var f = 0; f < 6; ++f) {
  	
  	//if (aCube.voxels[x][y][z].sides[f] == true){//here is where the magic happens... i read my array and decide whatsurfaces to draw on the voxel
			if (aCube.voxels[x][y][z].sides[f] == true) {
				var faceIndices = o3djs.primitives.CUBE_FACE_INDICES_[f];
			
				for (var v = 0; v < 4; ++v) {
			
					var position = cornerVertices[faceIndices[v]];
					var normal = faceNormals[f];
					var uv = uvCoords[v];
					
					// Each face needs all four vertices because the normals and texture
					// coordinates are not all the same.
					
					positionStream.addElementVector(position);
					normalStream.addElementVector(normal);
					texCoordStream.addElementVector(uv);
				
					// Two triangles make a square face.
					var offset = 4 * (f-n);
					
					vertexInfo.addTriangle(offset + 0, offset + 1, offset + 2);
					vertexInfo.addTriangle(offset + 0, offset + 2, offset + 3);
				};
			}else{
				n++;
				
			};
			
		};

  
  	return vertexInfo;
  
  
};

aCube.createVoxel = function(pack,
                                       material,
                                       size,
                                       x,y,z) {
	
	//alert("new voxel");
  var vertexInfo = aCube.createVoxelVertices(size, x,y,z);
  return vertexInfo.createShape(pack, material);
};

aCube.makeVoxel = function(pack,
                                       material,
                                       size,
                                       x,y,z) {
	 for (var i=0; i < 6; i++) {
	 	var x0 = o3djs.primitives.createPlane(pack,
                                        material,
                                        30,
                                        30,
                                        16,
                                        16	)
	return x0;
                                        //opt_matrix
};
	//alert("new voxel");
  var vertexInfo = aCube.createVoxelVertices(size, x,y,z);
  return vertexInfo.createShape(pack, material);
};
