# WEB GL
WebGL requires 2 shaders every time you draw something. A vertex shader and a fragment shader. Each shader is a function. A vertex shader and fragment shader are linked together into a shader program (or just program). A typical WebGL app will have many shader programs.

## Vertex Shader
A Vertex Shader's job is to generate clipspace coordinates. It always takes the form.

`
void main() {
   gl_Position = doMathToMakeClipspaceCoordinates
}
`

