document.addEventListener('DOMContentLoaded', () => {
    // Background Decoration
    createFloatingHearts();

    // Elements
    const envelopeContainer = document.getElementById('envelope');
    const act1 = document.getElementById('act1');
    const act2 = document.getElementById('act2');
    const btnNo = document.getElementById('btn-no');
    const btnSi = document.getElementById('btn-si');
    const successOverlay = document.getElementById('success-overlay');

    // --- Act 1: Envelope Opening ---
    envelopeContainer.addEventListener('click', () => {
        const envelope = envelopeContainer.querySelector('.envelope');
        envelope.classList.add('open');
        
        // Wait for animation, then transition
        setTimeout(() => {
            act1.classList.add('hidden');
            setTimeout(() => {
                act1.style.display = 'none'; // distinct from opacity transition
                act2.classList.remove('hidden');
                act2.classList.add('active');
            }, 1000); // Wait for fade out
        }, 4000); // 4 seconds delay to show the heart longer
    });


    // --- Act 2: "No" Button Evasion ---
    // --- Act 2: "No" Button Evasion ---
    const moveButton = () => {
        // Fix: Move button to body to avoid 'transform' parents acting as containing block for 'fixed'
        if (btnNo.parentElement !== document.body) {
            document.body.appendChild(btnNo);
            btnNo.style.zIndex = '1000'; // Ensure it's on top of everything
        }
        
        // Calculate available space
        const maxX = window.innerWidth - btnNo.offsetWidth - 20;
        const maxY = window.innerHeight - btnNo.offsetHeight - 20;
        
        // Generate random positions with padding
        const x = Math.max(20, Math.random() * maxX);
        const y = Math.max(20, Math.random() * maxY);
        
        btnNo.style.position = 'fixed'; 
        btnNo.style.left = `${x}px`;
        btnNo.style.top = `${y}px`;
    };

    btnNo.addEventListener('mouseover', moveButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent clicking on touch
        moveButton();
    });
    btnNo.addEventListener('click', (e) => {
         e.preventDefault();
         moveButton();
    });


    // --- Act 2: "Si" Button Success ---
    btnSi.addEventListener('click', () => {
        // Hide the rogue 'No' button
        btnNo.style.display = 'none';

        // 1. Confetti
        fireFireworks();

        // 2. Show Success
        successOverlay.classList.remove('hidden');
        // trigger reflow
        void successOverlay.offsetWidth; 
        successOverlay.classList.add('visible');

        // 3. API Call
        sendNotification();
    });

    function fireFireworks() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // snipes
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    async function sendNotification() {
        const url = 'https://k-mailer.azurewebsites.net/api/k-mailer';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'G8jzPA3AxDB6ZkMtAZdPtTenXeiLyPnt442tyq2KJbdpu3u8K8'
        };
        
        // Exact API body from request
        const body = {
            "to": ["kmillionary@gmail.com"],
            "subject": "Nota de Agradecimiento - C01E01PE25", // Using the example logic, but maybe should be customized? Keeping as requested.
            // Wait, the user prompt says "BODY EJEMPLO", implying I should adapt it?
            // "Al dar clic en SI quiero que me notifiques por correo consumiendo esta api: ... BODY EJEMPLO"
            // Usually "Ejemplo" means layout. But the content in the example is about a Wedding (Boda María y Juan).
            // Context says: "Atentamente Diego".
            // I should probably update the content to reflect THIS event (The acceptance).
            // However, to be safe and avoid breaking strict API expectations if it's a specific format trigger, 
            // I'll stick close to the structure but update the TEXT to match the context.
            
            "text": "¡Ella dijo que SÍ! 🎉\n\nLa colochita aceptó la cita para el jueves 12 de febrero.\n\nAtentamente,\nTu sistema de San Valentín",
            "html": `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: sans-serif; color: #333; }
                    .container { padding: 20px; background: #fff0f5; border-radius: 10px; }
                    h1 { color: #e74c3c; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>¡Ella dijo que SÍ! 🎉</h1>
                    <p>¡Buenas noticias! La colochita aceptó la cita para el jueves 12 de febrero.</p>
                    <p><strong>Detalles:</strong></p>
                    <ul>
                        <li>Fecha: Jueves 12 de Febrero</li>
                        <li>Plan: Desayuno especial</li>
                    </ul>
                    <p><em>Enviado desde tu app de San Valentín</em></p>
                </div>
            </body>
            </html>
            `
        };

        try {
            // Attempt to send notification - Fire and forget style for user experience
            // If CORS fails, it fails silently to the user, but logs to console.
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            }).catch(e => console.log('API info: ' + e)); 

            // We treat visual success as the priority regardless of API result
            console.log('Notification request sent');
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    function createFloatingHearts() {
        const container = document.querySelector('.background-decorations');
        const heartCount = 20;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerHTML = '❤';
            
            // Random positioning and delay
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.fontSize = `${Math.random() * 20 + 10}px`;
            heart.style.animationDelay = `${Math.random() * 15}s`;
            heart.style.animationDuration = `${Math.random() * 10 + 10}s`;
            
            container.appendChild(heart);
        }
    }
});
