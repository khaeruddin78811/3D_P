// تنظیم صحنه Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.8, 500);
document.getElementById('3dCanvas').appendChild(renderer.domElement);

// اضافه کردن نور
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0, 1, 1);
scene.add(light);

// متغیر برای مدل
let model;

// تابع برای آپلود و پردازش تصویر
document.getElementById('imageUpload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                // تبدیل تصویر به مدل سه‌بعدی ساده (مثلاً مکعب)
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                model = new THREE.Mesh(geometry, material);
                scene.add(model);
                animate();
            };
        };
        reader.readAsDataURL(file);
    }
});

// تابع برای انتخاب رنگ
document.getElementById('colorPicker').addEventListener('change', (event) => {
    if (model) {
        model.material.color.set(event.target.value);
    }
});

// تابع برای ایجاد مدل از کد
function generateModel() {
    const code = document.getElementById('codeInput').value;
    try {
        const modelData = JSON.parse(code); // فرض می‌کنیم کد به صورت JSON است
        const geometry = new THREE.BoxGeometry(modelData.width || 1, modelData.height || 1, modelData.depth || 1);
        const material = new THREE.MeshBasicMaterial({ color: modelData.color || 0xff0000 });
        if (model) scene.remove(model);
        model = new THREE.Mesh(geometry, material);
        scene.add(model);
    } catch (error) {
        alert('خطا در کد: ' + error.message);
    }
}

// تابع برای خروجی گرفتن به فرمت STL
function exportModel() {
    if (model) {
        const exporter = new THREE.STLExporter();
        const stlString = exporter.parse(model);
        const blob = new Blob([stlString], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'model.stl';
        link.click();
    }
}

// انیمیشن رندر
function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.01;
    renderer.render(scene, camera);
}

// تنظیم موقعیت دوربین
camera.position.z = 5;
