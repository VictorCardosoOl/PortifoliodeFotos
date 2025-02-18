document.addEventListener('DOMContentLoaded', function () {
    // Verifica se o Pixi.js está carregado
    if (!PIXI) {
        console.error('Pixi.js não carregado.');
        activateFallback();
        return;
    }

    // Configuração do Pixi.js
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        transparent: true,
    });

    const heroCanvas = document.getElementById('hero-canvas');
    if (!heroCanvas) {
        console.error('Elemento canvas não encontrado.');
        activateFallback();
        return;
    }

    heroCanvas.appendChild(app.view);

    // Carrega a imagem de fundo
    const texture = PIXI.Texture.from('https://images.pexels.com/photos/6384783/pexels-photo-6384783.jpeg');
    const image = new PIXI.Sprite(texture);
    image.width = app.screen.width;
    image.height = app.screen.height;
    app.stage.addChild(image);

    // Carrega o mapa de deslocamento
    const displacementTexture = PIXI.Texture.from('https://pixijs.io/examples/examples/assets/displacement_map_repeat.jpg');
    const displacementSprite = new PIXI.Sprite(displacementTexture);
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementFilter.scale.x = 50;
    displacementFilter.scale.y = 50;

    app.stage.addChild(displacementSprite);
    app.stage.filters = [displacementFilter];

    // Atualiza a distorção com base no movimento do mouse
    app.ticker.add(() => {
        displacementSprite.x += 1;
        displacementSprite.y += 1;
    });

    window.addEventListener('mousemove', (e) => {
        displacementFilter.scale.x = (window.innerWidth / 2 - e.clientX) / 20;
        displacementFilter.scale.y = (window.innerHeight / 2 - e.clientY) / 20;
    });

    // Fallback para dispositivos móveis
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        activateFallback();
    }

    function activateFallback() {
        const fallback = document.getElementById('hero-fallback');
        if (fallback) {
            fallback.style.display = 'block';
        }
        if (app) {
            app.destroy(true);
        }
    }
});