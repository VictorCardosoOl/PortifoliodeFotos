// Bloqueio de clique direito e inspeção
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 'F12')) {
        e.preventDefault();
        alert('Funcionalidade desabilitada.');
    }
});

// Efeito de distorção no hover (Three.js)
const heroContainer = document.getElementById('heroContainer');
const heroImage = document.getElementById('heroImage');

let scene, camera, renderer, planeMesh;
let mousePosition = { x: 0.5, y: 0.5 };
let targetMousePosition = { x: 0.5, y: 0.5 };
let aberrationIntensity = 0.0;

// Shaders
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform float u_aberrationIntensity;

    void main() {
        vec2 uv = vUv;
        vec2 mouseDirection = u_mouse - vec2(0.5, 0.5);
        uv += mouseDirection * 0.1 * u_aberrationIntensity;

        vec4 colorR = texture2D(u_texture, uv + vec2(u_aberrationIntensity * 0.01, 0.0));
        vec4 colorG = texture2D(u_texture, uv);
        vec4 colorB = texture2D(u_texture, uv - vec2(u_aberrationIntensity * 0.01, 0.0));

        gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
    }
`;

// Inicializar Three.js
function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, heroContainer.offsetWidth / heroContainer.offsetHeight, 0.1, 1000);
    camera.position.z = 1;

    const texture = new THREE.TextureLoader().load(heroImage.src);
    const uniforms = {
        u_texture: { value: texture },
        u_mouse: { value: new THREE.Vector2() },
        u_aberrationIntensity: { value: 0.0 }
    };

    planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
    );
    scene.add(planeMesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(heroContainer.offsetWidth, heroContainer.offsetHeight);
    heroContainer.appendChild(renderer.domElement);
}

// Animar a cena
function animate() {
    requestAnimationFrame(animate);
    mousePosition.x += (targetMousePosition.x - mousePosition.x) * 0.05;
    mousePosition.y += (targetMousePosition.y - mousePosition.y) * 0.05;

    planeMesh.material.uniforms.u_mouse.value.set(mousePosition.x, 1.0 - mousePosition.y);
    planeMesh.material.uniforms.u_aberrationIntensity.value = aberrationIntensity;

    renderer.render(scene, camera);
}

// Event listeners
heroContainer.addEventListener('mousemove', (e) => {
    const rect = heroContainer.getBoundingClientRect();
    targetMousePosition.x = (e.clientX - rect.left) / rect.width;
    targetMousePosition.y = (e.clientY - rect.top) / rect.height;
    aberrationIntensity = 1.0;
});

heroContainer.addEventListener('mouseleave', () => {
    aberrationIntensity = 0.0;
});

// Inicializar
initThreeJS();
animate();