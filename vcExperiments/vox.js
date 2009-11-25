function aVoxel(){
	this.ARGB = null;//uint
	this.link = null;//UID
	this.sides = null;//sides
	this.A = function(){
		return (((0xFF000000 & this.ARGB) >> 24) / 255);
	};
	this.R = function(){
		return (((0x00FF0000 & this.ARGB) >> 16) / 255);
	};
	this.G = function(){
		return (((0x0000FF00 & this.ARGB) >> 8) / 255);
	};
	this.B = function(){
		return (((0x000000FF & this.ARGB)) / 255);
	};
}






function aCube(size){
	
	this.size = size||16; //apart from testing with different model sizes, we might allow any cube to be subdevided in more than one power of 2
	this.UID = null; // TODO: UID 
	this.voxels = null; //3D Array of voxel color.
	this.sides = null; //Array of sides bump maps
	this.texture = [];
}		
//aCube.texture = g_pack.createTexture2D(72, 72, g_o3d.Texture.ARGB8, 1, false);
      



//create a random cube
aCube.prototype.randomize = function(){
	//alert("randomizing"+ this.size);
	this.voxels = new Array();
	for (var i = 0; i < this.size; i++){
		this.voxels[i] = new Array();
		for (var j = 0; j < this.size; j++){
			this.voxels[i][j] = new Array();
			for (var k = 0; k < this.size; k++){
				if (randRange(1,10)> 8) {
					this.voxels[i][j][k] = new aVoxel();
					this.voxels[i][j][k].ARGB = (randRange(0xFFFEEE8F, 0xFFFFFFFF));
				} else {
					this.voxels[i][j][k] = undefined;
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





aCube.prototype.rebuild = function(x,y,z){//a method calculating what sides of each voxel should be rendered. If Turns out to be slow, I'll write a shader to do this
//alert("rebuilding voxels");
	if (arguments.length > 0) { 
		//var x = arguments[0];
		//var y = arguments[1];
		//var z = arguments[2];
		this.reskin(x, y, z);
	}else {
		for (var x = 0; x < this.size; x++) {
			for (var y = 0; y < this.size; y++) {
				for (var z = 0; z < this.size; z++) {
					this.reskin(x, y, z);
				};
			};
		};
	};
	//alert("rebuilding done");
};

aCube.prototype.reskin = function(x, y, z){ //function that does actual crunching. this one deasn-t handle surrounding objects... might need that
    var x = arguments[0];
    var y = arguments[1];
    var z = arguments[2];
    //alert(aCube.voxels[x][y][z]);
    if (this.voxels[x][y][z] != null) {
        this.voxels[x][y][z].sides = new Array(true, true, true, true, true, true);//use bites to store this...= pow(2,n) 6 bit 
        if (x < this.size - 1) {
            if (this.voxels[x + 1][y][z] == undefined) {
                this.voxels[x][y][z].sides[0] = true;
            }
            else {
                this.voxels[x][y][z].sides[0] = false;
            };
                };
        if (x > 0) {
            if (this.voxels[x - 1][y][z] == undefined) {
                this.voxels[x][y][z].sides[1] = true;
            }
            else {
                this.voxels[x][y][z].sides[1] = false;
            };
                };
        if (y < this.size - 1) {
            if (this.voxels[x][y + 1][z] == undefined) {
                this.voxels[x][y][z].sides[2] = true;
            }
            else {
                //alert("stripp y0");
                this.voxels[x][y][z].sides[2] = false;
            };
                };
        if (y > 0) {
            if (this.voxels[x][y - 1][z] == undefined) {
                this.voxels[x][y][z].sides[3] = true;
            }
            else {
                this.voxels[x][y][z].sides[3] = false;
            };
                };
        if (z < this.size - 1) {
            if (this.voxels[x][y][z + 1] == undefined) {
                this.voxels[x][y][z].sides[4] = true;
            }
            else {
                this.voxels[x][y][z].sides[4] = false;
            };
                };
        if (z > 0) {
            if (this.voxels[x][y][z - 1] == undefined) {
                this.voxels[x][y][z].sides[5] = true;
            }
            else {
                this.voxels[x][y][z].sides[5] = false;
            };
                };
        };
    //alert("done skinning");

};







//this doesn't work
aCube.prototype.createVoxelVertices = function(size, x,y,z) {
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
			if (this.voxels[x][y][z].sides[f] == true) {
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

aCube.prototype.createVoxel = function(pack,
                                       material,
                                       size,
                                       x,y,z) {
	
	//alert("new voxel");
  var vertexInfo = this.createVoxelVertices(size, x,y,z);
  return vertexInfo.createShape(pack, material);
};

aCube.prototype.makeVoxel = function(pack,
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
  var vertexInfo = this.createVoxelVertices(size, x,y,z);
  return vertexInfo.createShape(pack, material);
};
