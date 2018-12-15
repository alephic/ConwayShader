
precision mediump float;

uniform sampler2D u_image;//texture array

varying vec2 v_texCoord;
uniform vec2 u_textureSize;

uniform vec2 u_mouseCoord;
uniform mat3 u_transition_neighbor;


vec3 hill(vec3 x, vec3 center, vec3 spread) {
    vec3 x2 = (x - center)/spread;
    return exp(-(x2*x2));
}
/*
float cub_hill(float x, float center, float spread) {
    float x2 = abs((x - center) / spread);
    return max(0.0, 1.0 - (3.0 - 2.0*x)*x*x);
}
*/

const float cardinal = 0.137473; //0.97174;
const float diagonal = 0.07716; //0.54541;
//const float areaTotal = 7.06858;
const float innerWeight = 0.141471;

const vec3 rates = vec3(0.1, 0.01, 0.001);

vec3 transition(vec3 value) {
    vec3 mean = vec3((value.x + value.y + value.z) / 3.0);
    vec3 activation = hill(mean + vec3(0.01, -0.1, 0.1), vec3(0.5), vec3(0.1)) - 0.25;
    return value * (1.0 - rates) + activation * rates;
}

void main() {

    vec2 onePixel = vec2(1.0, 1.0)/u_textureSize;

    vec3 value = vec3(texture2D(u_image, v_texCoord + vec2(-onePixel.x, -onePixel.y))) * diagonal;
    value += vec3(texture2D(u_image, v_texCoord + vec2(0, -onePixel.y))) * cardinal;
    value += vec3(texture2D(u_image, v_texCoord + vec2(onePixel.x, -onePixel.y))) * diagonal;
    value += vec3(texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0))) * cardinal;
    value += vec3(texture2D(u_image, v_texCoord + vec2(onePixel.x, 0))) * cardinal;
    value += vec3(texture2D(u_image, v_texCoord + vec2(-onePixel.x, onePixel.y))) * diagonal;
    value += vec3(texture2D(u_image, v_texCoord + vec2(0, onePixel.y))) * cardinal;
    value += vec3(texture2D(u_image, v_texCoord + vec2(onePixel.x, onePixel.y))) * diagonal;
    value += vec3(texture2D(u_image, v_texCoord)) * innerWeight;
    vec3 o = transition(value);
    gl_FragColor = vec4(o, 1);
}