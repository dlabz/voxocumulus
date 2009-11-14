var vMatrix = new Array();
vMatrix.size = 32;
//create a random cube
for (var i = 0; i < vMatrix.size; i++){
	vMatrix[i] = new Array();
	for (var j = 0; j < vMatrix.size; j++){
		vMatrix[i][j] = new Array();
		for (var k = 0; k < vMatrix.size; k++){
			if (randRange(1,10)> 7) {
				vMatrix[i][j][k] = randRange(0xFFFEEE8F, 0xFFFFFFFF);
				
				
			} else {
				vMatrix[i][j][k] = 0;
			}
			//document.write(vMatrix[i][j][k]+ "<br />");
		};
	};
};
//document.write(vMatrix.length);


function randRange(start,end) {
	return Math.floor(start + (Math.random()*(end-start)));
};
