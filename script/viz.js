const fs = require('fs');
const mainView = document.getElementById('mainView');
const glContext = require('gl-context');
const triangle = require('a-big-triangle');
const Shader = require('gl-shader');
const createTexture = require("gl-texture2d");
const path = require('path');
const Analyser = require('gl-audio-analyser');

module.exports = class Viz {
    constructor(audio) {
        this.gl = glContext(mainView, this.render.bind(this));
        this.analyser = Analyser(this.gl, audio);
        this.image = document.getElementById('sampleimg');
        this.imageSource = new Image();
        this.imageContext = this.image.getContext("2d");
        this.imageTexture = createTexture(this.gl, this.image);
        this.initTime = new Date().getTime();
        //this.imageTexture.setPixels([0, 0, 0]);
        this.shader = Shader(this.gl,
            fs.readFileSync(path.join(__dirname, 'index.vert')),
            fs.readFileSync(path.join(__dirname, 'index-simple.frag'))
        );
        require('canvas-fit')(mainView);
        window.addEventListener('resize', require('canvas-fit')(mainView), false);
    }

    updateShader({vert, frag}) {
        this.shader.dispose();
        this.initTime = new Date().getTime();
        try {
            this.shader = Shader(this.gl,
                fs.readFileSync(vert || path.join(__dirname, 'index.vert')),
                fs.readFileSync(frag || path.join(__dirname, 'index-simple.frag'))
            );
        } catch (e) {
            console.log(e);
            this.shader = Shader(this.gl,
                fs.readFileSync(path.join(__dirname, 'index.vert')),
                fs.readFileSync(path.join(__dirname, 'index-simple.frag'))
            );
        }
    }

    render() {
        const width = this.gl.drawingBufferWidth;
        const height = this.gl.drawingBufferHeight;

        this.gl.viewport(0, 0, width, height);

        this.shader.bind();
        if (!this.x) {
            console.log(this.shader.uniforms);
            this.x = true;
        }

        this.shader.uniforms.uWaveform = this.analyser.bindWaveform(1);
        this.shader.uniforms.uFrequencies = this.analyser.bindFrequencies(2);
        this.shader.uniforms.uImage = this.imageTexture.bind(3);
        this.shader.uniforms.uResolution = [width, height];
        this.shader.uniforms.uTime = (new Date().getTime() - this.initTime) / 1000;

        triangle(this.gl);
    }

    updateImage(uri) {
        this.imageSource.src = uri;
        this.image.width = Math.max(1, this.imageSource.naturalWidth);
        this.image.height = Math.max(1, this.imageSource.naturalHeight);
        this.imageContext.clearRect(0, 0, this.image.width, this.image.height);
        this.imageContext.drawImage(this.imageSource, 0, 0);
        this.imageTexture = createTexture(this.gl, this.image);
    }
};
