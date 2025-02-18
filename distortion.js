class DistortionEffect {
    constructor() {
        this.app = null;
        this.displacementSprite = null;
        this.init();
    }

    async init() {
        try {
            await this.setupPixi();
            this.createDisplacementFilter();
            this.addEventListeners();
            this.handleMobileFallback();
        } catch (error) {
            console.error('Error initializing distortion effect:', error);
            this.activateFallback();
        }
    }

    async setupPixi() {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
        });

        const container = document.getElementById('js-canvas-container');
        if (!container) throw new Error('Canvas container not found');
        container.appendChild(this.app.view);

        const texture = await PIXI.Texture.fromURL('https://images.pexels.com/photos/6384783/pexels-photo-6384783.jpeg');
        const image = new PIXI.Sprite(texture);
        image.width = this.app.screen.width;
        image.height = this.app.screen.height;
        this.app.stage.addChild(image);
    }

    async createDisplacementFilter() {
        const displacementTexture = await PIXI.Texture.fromURL('https://pixijs.io/examples/examples/assets/displacement_map_repeat.jpg');
        this.displacementSprite = new PIXI.Sprite(displacementTexture);
        this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        
        const displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        displacementFilter.scale.x = 50;
        displacementFilter.scale.y = 50;
        
        this.app.stage.addChild(this.displacementSprite);
        this.app.stage.filters = [displacementFilter];
    }

    addEventListeners() {
        this.app.ticker.add(() => {
            this.displacementSprite.x += 1;
            this.displacementSprite.y += 1;
        });

        window.addEventListener('mousemove', (e) => {
            this.displacementSprite.filters[0].scale.x = (window.innerWidth/2 - e.clientX) / 20;
            this.displacementSprite.filters[0].scale.y = (window.innerHeight/2 - e.clientY) / 20;
        });
    }

    handleMobileFallback() {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            this.activateFallback();
        }
    }

    activateFallback() {
        const fallback = document.getElementById('js-fallback-bg');
        if (fallback) {
            fallback.style.display = 'block';
            fallback.style.backgroundImage = 'url(https://images.pexels.com/photos/6384783/pexels-photo-6384783.jpeg)';
        }
        if (this.app) this.app.destroy(true);
    }
}

// Initialize effect
new DistortionEffect();