precision mediump float;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;

uniform sampler2D uSampler;

uniform float uNov; // Related to the amount of spectral change over time
uniform float uRamp; // Roughly correlated to beat tracking up and down
uniform float uActivation; // Roughly correlated to beat clap probability

#define MAX_ITERS 100.0


vec2 complexMultiply(vec2 x, vec2 y) {
  vec2 res;
  res[0] = x[0]*y[0] - x[1]*y[1];
  res[1] = x[0]*y[1] + x[1]*y[0];
  return res;
}

void main() {
    vec3 uPows = vec3(500, 1000, 500);
    float uScale = 1.0;
    vec2 uCenter = vec2(0.0, 0.0);
    float uEscape = 2.0;
    
    float count = 0.0;
    vec2 c = vec2(-1.0, uNov*4.0 - 1.0);
    vec2 z = uScale*v_position - uCenter;
    for (float i = 0.0; i < MAX_ITERS; i++) {
        z = complexMultiply(z, z) + c;
        count++;
        if (dot(z, z) > uEscape*uEscape) {
            break;
        }
    }
    //TODO: Fill this in
    float red   = pow(uPows.x,-count/MAX_ITERS);
    float green = pow(uPows.y,-count/MAX_ITERS);
    float blue  = pow(uPows.z,-count/MAX_ITERS);
    // gl_FragColor = vec4(red, green, blue, 1);
    vec4 color = vec4(red, green, blue, 1.0);
    vec4 I1 = texture2D(uSampler, v_texture);
    if (uNov > 0.5) {
        gl_FragColor = color*0.7 + I1*0.3;
    }
    else {
        gl_FragColor = color;
    }



}
