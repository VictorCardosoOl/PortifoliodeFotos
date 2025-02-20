document.addEventListener('DOMContentLoaded', function () {
    // Verifica se o Pixi.js está carregado
    if (!PIXI) {
        console.error('Pixi.js não carregado.');
        return;
    }

    // Configuração do Pixi.js
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        transparent: true,
        view: document.getElementById('hero-canvas') // Usa o canvas diretamente
    });

    // Ajusta o tamanho do renderer quando a janela é redimensionada
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        image.width = app.screen.width;
        image.height = app.screen.height;
        displacementSprite.width = app.screen.width;
        displacementSprite.height = app.screen.height;
    });

    // Carrega a imagem de fundo
    const texture = PIXI.Texture.from('https://images.pexels.com/photos/6384783/pexels-photo-6384783.jpeg');
    const image = new PIXI.Sprite(texture);
    image.width = app.screen.width;
    image.height = app.screen.height;
    app.stage.addChild(image);

    // Carrega o mapa de deslocamento (substitua pelo seu mapa)
    const displacementTexture = PIXI.Texture.from('https://pixijs.io/examples/examples/assets/displacement_map_repeat.jpg'); // Exemplo
    const displacementSprite = new PIXI.Sprite(displacementTexture);
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT; // Ou não, dependendo do seu mapa
    displacementSprite.anchor.set(0.5); // Centraliza o mapa de deslocamento
    displacementSprite.scale.set(2);  // Ajuste a escala conforme necessário
    app.stage.addChild(displacementSprite);
    displacementSprite.position.set(app.screen.width / 2, app.screen.height / 2);

    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementFilter.scale.x = 0; // Começa com escala zero
    displacementFilter.scale.y = 0;
    image.filters = [displacementFilter];

    // Efeito de "bolha" com o mouse
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calcula a distância entre o mouse e o centro da tela
        const distX = mouseX - app.screen.width / 2;
        const distY = mouseY - app.screen.height / 2;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Define a escala do filtro com base na distância (ajuste os valores)
        const maxDistance = 200; // Raio da "bolha"
        const maxScale = 50;  // Intensidade da distorção

        if (distance < maxDistance) {
            displacementFilter.scale.x = (maxDistance - distance) / maxDistance * maxScale;
            displacementFilter.scale.y = (maxDistance - distance) / maxDistance * maxScale;

            displacementSprite.x = mouseX;
            displacementSprite.y = mouseY;
        } else {
            displacementFilter.scale.x = 0;
            displacementFilter.scale.y = 0;
        }
    });
});