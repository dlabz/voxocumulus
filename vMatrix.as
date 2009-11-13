package  
{
	import flash.display.Bitmap;
	import flash.geom.Point;
	import org.papervision3d.objects.DisplayObject3D;
	import org.papervision3d.objects.primitives.Cube;
	import Array;
	//import org.papervision3d.core.math.Matrix3D;
	import flash.geom.Matrix3D;
	import flash.utils.ByteArray;
	import flash.display.BitmapData;
	import org.papervision3d.events.InteractiveScene3DEvent;
	import preRender;
	import flash.events.Event;
	import org.papervision3d.materials.special.VectorShapeMaterial;
	import org.papervision3d.objects.special.VectorShape3D;
	/**
	 * ...
	 * @author Petrovic Veljko DLabz@intubo.com
	 */
	public class vMatrix
	{
		public var size:int = 16;//size of a matrix
		public var myBitmapData:BitmapData;
		public var myBitmapPrerender:BitmapData;
		public var grid:uint;
		public var dOb:DisplayObject3D = new DisplayObject3D();
		
		public var eMode:Boolean = true;
		public var hS:Number = 1; 
		public var vS:Number = 10;
		public var vAlph:Number = 1;
		private var myPrerender:preRender = new preRender();
		public var parser:RegExp = new RegExp("x(\\d*)y(\\d*)z(\\d*)"); 
		
		public var matV:VectorShapeMaterial = new VectorShapeMaterial();
		
		public function vMatrix(size:Number = 16) 
		{
			//matV.interactive = true;
			trace("New Matrix", size);
			//myBitmapPrerender=new BitmapData((size+2) * 3, (size+2), true, 0xFF000000);
			//create a bitmapData to store voxel information
			this.size = size;
			grid = Math.sqrt(size);
			myBitmapData = new BitmapData((size+2) * (grid), (size+2)*(grid),true,0x00000000);
			myBitmapPrerender = new BitmapData((size+2) * 3, (size+2), false);
			fillCube(0xFF000000);//0xFF000000
			
		}
		
		public function randCube():void { //Fill with random pixels
			for (var i:int = 0; i <size; i++) {
				for (var j:int = 0; j <  size; j++) {
					for (var k:int = 0; k < size; k++) {
						
						if (randRange(0, 10) > 7) {
							//trace("randCube add new", i, j, k);
							setPixel3D(i, j, k, randRange(0xFFFEEE8F, 0xFFFFFFFF));
							//setPixel3D(i+1 , j+1, size+1,(getPixel3D(i, j, size) + 0x0000000f * 2^k));

							}else {
							
							setPixel3D(i,j,k, 0x00000000);
						}
					}
				}
			}
		}
		
		public function fillCube(c:uint = 0):void {//Fill all voxels. If color specified, use it, if not, use random color.
			var c:uint = c;
			
			
			for (var i:int = 0; i < size; i++) {
				for (var j:int = 0; j <  size; j++) {
					for (var k:int = 0; k < size; k++) {
						if (c) { 
							//trace("fillCube add new", i, j, k);
							if (c==0xFF000000) {
								setPixel3D(i, j, k, randRange(0xFFFEEE8F, 0xFFFFFFFF));
								//setPixel3D(i , j, size+1,(getPixel3D(i, j, size+1) - 0x0000000f * k));
							}else {
								setPixel3D(i, j, k, c);
								//setPixel3D(i , j, size+1,(getPixel3D(i, j, size+1) - 0x0000000f * k));
							}
						}else {
							
							setPixel3D(i,j,k, 0x00000000);
						}
					}
				}
				
			}
		}
		private function randRange(start:Number, end:Number) : Number
		{
			return Math.floor(start +(Math.random() * (end - start)));
		}
		public function getPixel3D(x:uint, y:uint, z:uint):uint { //Read voxel at x,y,z. Returns Color.
			var px:uint = x;
			var py:uint = y;
			var pz:Point = zF(z);
			//convert 3D coordinates to 2D layout
			var bx:uint =1+ px + pz.x*(size+2);
			var by:uint =1+ py + pz.y*(size+2);
			//trace("get",px,py,pz,">>",bx,by,this.myBitmapData.getPixel32(bx, by))
			return this.myBitmapData.getPixel32(bx, by);
			
		}
		
		public function setPixel3D(x:uint, y:uint, z:uint,c:uint):Boolean { //Set voxel x,y,z to color c.
			var px:uint = x;
			var py:uint = y;
			var pz:Point = zF(z);
			var pc:uint = c;
							
			var bx:uint =1+ px + pz.x*(size+2);
			var by:uint =1+ py + pz.y*(size+2);
			
			//trace("set",px,py,z,pz,">>",bx,by)		
			this.myBitmapData.setPixel32(bx, by, pc);
			return true;
		}
		
		private function zF(z:uint):Point {
			var p:Point = new Point(0, 0);
				p.x = z % grid;
				p.y = (z - p.x)/grid;
			//trace(grid,z, p.x, p.y);
			return p;
		}
		
		public function makeShapes():void {
			trace("makeShapes");
			
			//myBitmapPrerender=myPrerender.refreshPre(m);
			dOb = new DisplayObject3D();
			for (var lx:int = 0; lx < size; lx++) {
				for (var ly:int = 0; ly <  size; ly++) {
					for (var lz:int = 0; lz < size; lz++) {
						
						var pointer:uint = getPixel3D(lx, ly, lz);
						//trace(pointer+">>>"+m.XYZ[lx][ly][lz]);
						//if (m.XYZ[lx][ly][lz]) {
						if (pointer!=0){
								//trace("new!"+pointer);
								makeCube(new dlVoxol(pointer, lx, ly, lz));
						}else {
							//trace(m.XYZ[lx][ly][lz]);
						}
					}
				}
			}
			//default_scene.addChild(m.dOb);
		}
		
		private function makeCube(v:dlVoxol):void {
			
			//trace(v);
			var voxO:DisplayObject3D = new DisplayObject3D();
			
			voxO.z = v.z * (vS + hS);
			voxO.y = v.y * (vS + hS);
			voxO.x = v.x * (vS + hS);
			
			//trace( "new makeCube", v.x , v.y, v.z, getPixel3D(v.x , v.y, v.z).toString(16));
			//if (!m.XYZ[v.x][v.y][v.z - 1]) {
			if ( getPixel3D(v.x, v.y, v.z -1) == 0) {//m.myBitmapData.getPixel32(v.x +m.size * (v.z - 1), v.y)) {
				//trace(m.myBitmapData.getPixel32(v.x +m.size * (v.z - 1), v.y));
				
				var z0:VectorShape3D = new VectorShape3D(matV);
				z0.graphics.beginFill(v.color*(1/3),vAlph);
				z0.graphics.drawRect(0, 0, vS, vS);
				z0.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, popVoxO);
				if (v.z > 0) {
					z0.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, pullVoxO);
				}
				z0.name = "z0";
				voxO.addChild(z0);
				
			}
			
			//if (!m.XYZ[v.x][v.y][v.z+1]) {
			if (getPixel3D(v.x, v.y, v.z +1) == 0) {	
				var z1:VectorShape3D = new VectorShape3D(matV);
				z1.graphics.beginFill(v.color-(1*0xFFFF/3),vAlph);
				z1.graphics.drawRect(0, 0, vS, vS);
				z1.z += vS; 
				z1.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, popVoxO);
				if (v.z < size-1) {
					z1.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, pullVoxO);
				}
				z1.name = "z1";
				voxO.addChild(z1);
			}
			
			//if (!m.XYZ[v.x][v.y-1][v.z]) {
			if (getPixel3D(v.x, v.y-1, v.z) == 0) {
			var y0:VectorShape3D = new VectorShape3D(matV);
			y0.graphics.beginFill(v.color*(2/3),vAlph);
			y0.graphics.drawRect(0, 0, vS, vS);
			y0.rotationX = 90;
			y0.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, popVoxO);
			if (v.y > 0) {
					y0.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, pullVoxO);
				}
			y0.name = "y0";
			voxO.addChild(y0);
			}
			
			//if (!m.XYZ[v.x][v.y+1][v.z]) {
			if ( getPixel3D(v.x, v.y+1, v.z) == 0) {
			var y1:VectorShape3D = new VectorShape3D(matV);
			y1.graphics.beginFill(v.color-(2*0xFFFF/3),vAlph);
			y1.graphics.drawRect(0, 0, vS, vS);
			y1.rotationX = 90;
			y1.y += vS; 
			y1.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, popVoxO);
			if (v.y < size-1) {
					y1.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, pullVoxO);
			}
			y1.name = "y1";
			voxO.addChild(y1);
			}
			
			//if (!m.XYZ[v.x - 1][v.y][v.z]) {
			if (getPixel3D(v.x-1, v.y, v.z) == 0) {
			var x0:VectorShape3D = new VectorShape3D(matV);
			x0.graphics.beginFill(v.color*(3/3),vAlph);
			x0.graphics.drawRect(0, 0, vS, vS);
			x0.rotationY = -90;
			x0.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, popVoxO);
			if (v.x > 0) {
					x0.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, pullVoxO);
				}
			x0.name = "x0";
			voxO.addChild(x0);
			}
			
			//if (!m.XYZ[v.x + 1][v.y][v.z]) {
			if (getPixel3D(v.x+1, v.y, v.z) == 0) {
			var x1:VectorShape3D = new VectorShape3D(matV);
			x1.graphics.beginFill(v.color-(3*0xFFFF/3),vAlph)//v.color.toString(10).substr(3,2));
			x1.graphics.drawRect(0, 0, vS, vS);
			x1.rotationY = -90;
			x1.x += vS; 
			x1.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, popVoxO);
			if (v.x < size-1) {
					x1.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, pullVoxO);
			}
			x1.name = "x1";
			voxO.addChild(x1);
			}
			//voxO.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, popVoxO);
			voxO.name = "x"+v.x.toString() + "y"+v.y.toString()+"z" + v.z.toString();
			//trace(voxO.name);
			dOb.addChild(voxO);

		}
		private function pullVoxO(e:InteractiveScene3DEvent):void {
			if (eMode==false){
			
			
			
			var pullThis:String = e.currentTarget.parent.name;
			trace("pull!",pullThis);
			var parsed:Array = parser.exec(pullThis);
			trace(pullThis,parsed[1],parsed[2],parsed[3]);
			var eX:int = parsed[1];//e.currentTarget.parent.x/ (vS+hS);
			var eY:int = parsed[2];//e.currentTarget.parent.y/ (vS+hS);
			var eZ:int = parsed[3];//e.currentTarget.parent.z/ (vS+hS);
			//trace(eX, eY, eZ, e.currentTarget.rotationX, e.currentTarget.rotationY);
			
			switch (e.currentTarget.name) {
				case "x0" :
				trace(getPixel3D(eX, eY, eZ)+" "+eX+" "+eY+" "+eZ+">>"+getPixel3D(eX-1, eY, eZ));
				
				//m.XYZ[eX-1][eY][eZ] = m.XYZ[eX][eY][eZ];
				setPixel3D(eX - 1, eY, eZ, getPixel3D(eX, eY, eZ));
				updateBlock(eX,eY,eZ);
				break;
				case "x1" :
				
				//m.XYZ[eX + 1][eY][eZ] = m.XYZ[eX][eY][eZ];
				setPixel3D(eX + 1, eY, eZ, getPixel3D(eX, eY, eZ));
				updateBlock(eX,eY,eZ);
				break;
				case "y0" :
				
				//m.XYZ[eX][eY-1][eZ] = m.XYZ[eX][eY][eZ];
				setPixel3D(eX, eY - 1, eZ, getPixel3D(eX, eY, eZ));
				updateBlock(eX,eY,eZ);
				break;
				case "y1" :
				
				//m.XYZ[eX][eY + 1][eZ] = m.XYZ[eX][eY][eZ];
				setPixel3D(eX, eY + 1, eZ, getPixel3D(eX, eY, eZ));
				updateBlock(eX,eY,eZ);
				break;
				case "z0" :
				
				//m.XYZ[eX][eY][eZ - 1] = m.XYZ[eX][eY][eZ];
				setPixel3D(eX, eY, eZ - 1, getPixel3D(eX, eY, eZ));
				updateBlock(eX,eY,eZ);
				
				break;
				case "z1" :
				
				//m.XYZ[eX][eY][eZ + 1] = m.XYZ[eX][eY][eZ];
				setPixel3D(eX, eY, eZ + 1, getPixel3D(eX, eY, eZ));
				updateBlock(eX,eY,eZ);
				break;
				
			}
			
			//myBitmapPrerender = myPrerender.refreshPre(m);
			}
		}	
			private function popVoxO(e:Event):void {
			if (eMode == true) {
				
			var popThis:String = e.currentTarget.parent.name;
			trace("pop!",popThis);
			var parsed:Array = parser.exec(popThis);
			//trace(popThis,parsed[1],parsed[2],parsed[3]);
			var eX:int = parsed[1];//e.currentTarget.parent.x/ (vS+hS);
			var eY:int = parsed[2];//e.currentTarget.parent.y/ (vS+hS);
			var eZ:int = parsed[3];//e.currentTarget.parent.z/ (vS+hS);
			
			dOb.removeChildByName(popThis);
			//trace(popThis,parsed[1],parsed[2],parsed[3]);
			//trace(eX, eY, eZ, e.currentTarget.rotationX, e.currentTarget.rotationY);
			//trace(m.XYZ[eX][eY][eZ]);
			//m.XYZ[eX][eY][eZ] = 0;
			setPixel3D(eX, eY, eZ,0);
			//m.myBitmapData.setPixel32(m.size*m.size+eX , eY, (m.myBitmapData.getPixel32(m.size*m.size+eX, eY) - 2^eZ));
			//default_scene.removeChild(dOb);
			updateBlock(eX,eY,eZ);
			
			//trace(m.XYZ[eX][eY][eZ]);
			//makeShapes();
			}
		}
		
		private function updateBlock(eX:uint, eY:uint, eZ:uint):void {
			var x:uint = eX;
			var y:uint = eY;
			var z:uint = eZ;
			
			for (var lx:int = x-1; lx <= x+1; lx++) {
				for (var ly:int = y-1; ly <=  y+1; ly++) {
					for (var lz:int = z-1; lz <= z+1; lz++) {
						dOb.removeChildByName("x" + lx + "y" + ly + "z" + lz);
						var pointer:uint = getPixel3D(lx, ly, lz);
						//trace(pointer+">>>"+m.XYZ[lx][ly][lz]);
						//if (m.XYZ[lx][ly][lz]) {
						if (pointer!=0){
								//trace("new!"+pointer);
								makeCube(new dlVoxol(pointer, lx, ly, lz));
						}else {
							//trace(m.XYZ[lx][ly][lz]);
						}
					}
				}
			}
			//myBitmapPrerender = myPrerender.refreshPre(m);
			
		}
		
		
	}

}