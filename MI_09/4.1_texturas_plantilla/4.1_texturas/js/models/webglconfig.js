var WebGLConfig = function(canvas) {
	this.gl = null;
	this.shaderProgram = null;

	try {		
		this.gl = canvas.getContext("experimental-webgl");
		this.gl.viewportWidth = canvas.width;
		this.gl.viewportHeight = canvas.height;
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		
		var vertexShader = this.getShader($('#shader-vs')[0]);
		var fragmentShader = this.getShader($('#shader-fs')[0]);

		this.shaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.shaderProgram, vertexShader);
		this.gl.attachShader(this.shaderProgram, fragmentShader);
		this.gl.linkProgram(this.shaderProgram);
		
		if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
			alert("No se pudo cargar los shaders");
			return;
		}
		this.gl.bindAttribLocation(this.shaderProgram, 0, "aVertexPosition");


		this.gl.useProgram(this.shaderProgram);
		this.shaderProgram.aVertexPosition = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.shaderProgram.aVertexColor = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
		this.shaderProgram.aTextureCoord = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");

		this.shaderProgram.uPMatrix = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
		this.shaderProgram.uMVMatrix = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");		
		this.shaderProgram.uSampler = this.gl.getUniformLocation(this.shaderProgram, "uSampler");		

		var pMatrix = mat4.create();
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		mat4.perspective(pMatrix, 45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0);		

		// INFORMAMOS AL SHADER SOBRE LA MATRIZ DE PERSPECTIVA
		this.gl.uniformMatrix4fv(this.shaderProgram.uPMatrix, false, pMatrix );
		
		
	} catch (e) {
		alert("Problema al cargar WebGL en el canvas");
		return false;
	}
}

WebGLConfig.prototype = {
	clear: function() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);	
	},
	getShader: function(shaderScript) {
		if (!shaderScript) {
		    return null;
		}
		var str = "";
		var k = shaderScript.firstChild;
		while (k) {
		    if (k.nodeType == 3) {
		        str += k.textContent;
		    }
		    k = k.nextSibling;
		}

		var shader;
		if (shaderScript.type == "x-shader/x-fragment") {
		    shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex") {
		    shader = this.gl.createShader(this.gl.VERTEX_SHADER);
		} else {
		    return null;
		}

		this.gl.shaderSource(shader, str);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
		    alert(this.gl.getShaderInfoLog(shader));
		    return null;
		}
		return shader;
	}
}