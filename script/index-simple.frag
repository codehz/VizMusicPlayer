precision mediump float;

uniform sampler2D uWaveform;
uniform sampler2D uFrequencies;
uniform sampler2D uImage;
uniform vec2 uResolution;

float glAudioAnalyser(sampler2D audioData, float audioIndex) {
    return texture2D(audioData, vec2(audioIndex, 0.5)).r;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float minxy = uResolution.x > uResolution.y ? uResolution.y : uResolution.x;
    vec2 cuv = (0.5 * (minxy - uResolution) + gl_FragCoord.xy) / minxy;
    vec2 pixel = 1. / uResolution.xy;

    float wave = glAudioAnalyser(uWaveform, uv.x) / 2. + 0.5;
    float lwave = glAudioAnalyser(uWaveform, uv.x - pixel.x) / 2. + 0.5;
    float fwave = glAudioAnalyser(uWaveform, uv.x + pixel.x) / 2. + 0.5;

    float fft = glAudioAnalyser(uFrequencies, abs(uv.y - 0.5) * 1.7) * 1.2;

    vec3 color = texture2D(uImage, vec2(cuv.x, 1. - cuv.y)).rgb * fft + vec3( fft, 4.0*fft*(1.0-fft), 1.0-fft ) * fft;
    if ((fwave - uv.y) * (wave - uv.y) < 0. || abs(wave - uv.y) * 2. < pixel.y)
        color = vec3(1.);
    else if ((lwave - uv.y - pixel.y) * (wave - uv.y - pixel.y) < 0. || abs(wave - uv.y - pixel.y) * 2. < pixel.y)
        color = vec3(0.);

    gl_FragColor = vec4(color, 1.0);
}
