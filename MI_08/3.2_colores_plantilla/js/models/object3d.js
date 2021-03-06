var Object3D = function (gl, shaderProgram) {
	this.gl = gl;
	this.shaderProgram = shaderProgram;
	this.vertexBuffer = null;
	this.indexBuffer = null;
	this.colorBuffer = null;
	this.position = { x: 0, y: 0, z: -5 };
	this.rotation = { x: 0, y: 0, z: 0 };
	this.scale = { x: 1, y: 1, z: 1 };
	this.drawMode = this.gl.TRIANGLE_STRIP;
	this.drawByIndex = false;
}

Object3D.prototype = {
	initVertexBuffer: function (vertices) {
		this.vertexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		this.vertexBuffer.itemSize = 3;
		this.vertexBuffer.numItems = vertices.length / this.vertexBuffer.itemSize;
		this.vertexBuffer.bufferType = this.gl.ARRAY_BUFFER;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	},
	initIndexBuffer: function (indices) {
		this.indexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
		this.indexBuffer.itemSize = 1;
		this.indexBuffer.numItems = indices.length;
		this.indexBuffer.bufferType = this.gl.ELEMENT_ARRAY_BUFFER;
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	},
	initColorBuffer: function (colors) {
		this.colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
		this.colorBuffer.itemSize = 4;
		this.colorBuffer.numItems = colors.length / this.colorBuffer.itemSize;
		this.colorBuffer.bufferType = this.gl.ARRAY_BUFFER;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	},
	draw: function () {
		var gl = this.gl;

		var mvMatrix = mat4.create();
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(this.position.x, this.position.y, this.position.z));
		mat4.rotateX(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotation.x);
		mat4.rotateY(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotation.y);
		mat4.rotateZ(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotation.z);
		mat4.scale(mvMatrix, mvMatrix, vec3.fromValues(this.scale.x, this.scale.y, this.scale.z));
		// INFORMAMOS AL SHADER SOBRE LA MATRIZ DE TRANSFORMACIONES
		gl.uniformMatrix4fv(this.shaderProgram.uMVMatrix, false, mvMatrix)

		// SELECCIONAMOS EL BUFFER DE COLOR Y COMUNICAMOS AL SHADER	
		gl.bindBuffer(this.colorBuffer.bufferType, this.colorBuffer);
		gl.vertexAttribPointer(this.shaderProgram.aVertexColor, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// SELECCIONAMOS EL BUFFER DE VERTICES Y COMUNICAMOS AL SHADER
		gl.bindBuffer(this.vertexBuffer.bufferType, this.vertexBuffer);
		gl.vertexAttribPointer(this.shaderProgram.aVertexPosition, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// HABILITAMOS EL ENVIO DE TIPO ARRAY DE LOS VERTICES Y COLORES
		gl.enableVertexAttribArray(this.shaderProgram.aVertexColor);
		gl.enableVertexAttribArray(this.shaderProgram.aVertexPosition);

		if (this.drawByIndex == false) {
			gl.bindBuffer(this.vertexBuffer.bufferType, this.vertexBuffer);
			// DIBUJAMOS POR VERTICES		
			gl.drawArrays(this.drawMode, 0, this.vertexBuffer.numItems);
		} else {
			gl.bindBuffer(this.indexBuffer.bufferType, this.indexBuffer);
			// DIBUJAMOS POR INDICES
			gl.drawElements(this.drawMode, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}

		// DESHABILITAMOS EL ENVIO DE TIPO ARRAY DE LOS VERTICES Y COLORES
		// ..
		gl.disableVertexAttribArray(this.shaderProgram.aVertexPosition);
	}
}

Object3D.createFromVertices = function (gl, shaderProgram, vertices) {
	var object3D = new Object3D(gl, shaderProgram);
	object3D.initVertexBuffer(vertices);
	return object3D;
}

Object3D.createCubeWithColor = function (gl, shaderProgram) {
	var vertices = [
		// Front
		-1.0, -1.0, 1.0, //0
		1.0, -1.0, 1.0, //1
		1.0, 1.0, 1.0, //2
		-1.0, 1.0, 1.0, //3

		// Back
		-1.0, -1.0, -1.0, //4
		-1.0, 1.0, -1.0, //5
		1.0, 1.0, -1.0, //6
		1.0, -1.0, -1.0, //7

		// Top
		-1.0, 1.0, -1.0, //8
		-1.0, 1.0, 1.0, //9
		1.0, 1.0, 1.0, //10
		1.0, 1.0, -1.0, //11

		// Bottom 
		-1.0, -1.0, -1.0, //12
		1.0, -1.0, -1.0, //13
		1.0, -1.0, 1.0, //14
		-1.0, -1.0, 1.0, //15

		// Right
		1.0, -1.0, -1.0, //16
		1.0, 1.0, -1.0, //17
		1.0, 1.0, 1.0, //18
		1.0, -1.0, 1.0, //19

		// Left
		-1.0, -1.0, -1.0, //20
		-1.0, -1.0, 1.0, //21
		-1.0, 1.0, 1.0, //22
		-1.0, 1.0, -1.0  //23
	];

	var indices = [
		0, 1, 2, 0, 2, 3,    // front
		4, 5, 6, 4, 6, 7,    // back
		8, 9, 10, 8, 10, 11,   // top
		12, 13, 14, 12, 14, 15,   // bottomm
		16, 17, 18, 16, 18, 19,   // right
		20, 21, 22, 20, 22, 23    // left
	];

	var colors = [
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,


		0.0, 0.0, 1.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 0.0, 1.0, 1.0,


		0.0, 1.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,


		1.0, 0.0, 0.0, 1.0,
		1.0, 0.0, 0.0, 1.0,
		1.0, 0.0, 0.0, 1.0,
		1.0, 0.0, 0.0, 1.0,


		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,


		1.0, 0.0, 1.0, 1.0,
		1.0, 0.0, 1.0, 1.0,
		1.0, 0.0, 1.0, 1.0,
		1.0, 0.0, 1.0, 1.0
	]

	var object3D = new Object3D(gl, shaderProgram);
	object3D.initVertexBuffer(vertices);
	object3D.initIndexBuffer(indices);
	object3D.initColorBuffer(colors);

	object3D.drawByIndex = true;
	object3D.drawMode = gl.TRIANGLES;
	return object3D;
}








