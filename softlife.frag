
precision mediump float;

uniform sampler2D u_image;//texture array

varying vec2 v_texCoord;
uniform vec2 u_textureSize;

uniform vec2 u_mouseCoord;
uniform mat3 u_transition_neighbor;
uniform mat3 u_transition_self;

void main() {

    vec2 onePixel = vec2(1.0, 1.0)/u_textureSize;

    //vec2 pxDistFromMouse = (v_texCoord - u_mouseCoord)*(v_texCoord - u_mouseCoord)/onePixel;

    //float tol = 0.005;
    //if (pxDistFromMouse.x < tol && pxDistFromMouse.y < tol) {
    //    gl_FragColor = vec4(1.0,1.0,1.0,1);
    //    return;
    //}
    vec3 thisValue = vec3(texture2D(u_image, v_texCoord));
    vec3 neighborSum = vec3(0.0, 0.0, 0.0);
    for (int i=-1;i<2;i++){
        for (int j=-1;j<2;j++){
            if (i == 0 && j == 0) continue;
            vec2 neighborCoord = v_texCoord + vec2(onePixel.x*float(i), onePixel.y*float(j));
            neighborSum += vec3(texture2D(u_image, neighborCoord));
        }
    }
    neighborSum *= 0.125;
    vec3 o = (u_transition_neighbor*neighborSum + u_transition_self*thisValue)*0.5;
    o = max(vec3(0), min(vec3(1), o));
    gl_FragColor = vec4(o, 1);
}