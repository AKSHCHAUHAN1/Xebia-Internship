import { Application } from 'https://unpkg.com/@splinetool/runtime/build/runtime.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Spline 3D Setup ---
    const canvas = document.getElementById('canvas3d');
    const app = new Application(canvas);
    window.splineApp = app;
    app.load('https://prod.spline.design/ZzZA-xiWoFB3bqNg/scene.splinecode').then(() => {
        console.log("Spline loaded.");
        try {
            if (app._camera) {
                app._camera.zoom = 0.62;
                app._camera.updateProjectionMatrix();
                console.log("Set camera zoom to 0.62 and updated projection matrix.");
            } else {
                console.log("Camera reference app._camera not found.");
            }
        } catch (e) {
            console.error("Error modifying camera zoom:", e);
        }
    });

    // --- Form Elements ---
    const form = document.getElementById('registrationForm');
    const formContainer = document.getElementById('formContainer');
    const successContainer = document.getElementById('successContainer');
    
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    const submitBtn = document.getElementById('registerBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = document.getElementById('btnSpinner');
    const formMessage = document.getElementById('formMessage');

    // --- Validation Logic ---
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const isStrongPassword = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    };

    const showError = (inputElement, messageElementId, message) => {
        const group = inputElement.closest('.input-group');
        group.classList.add('error');
        document.getElementById(messageElementId).textContent = message;
    };

    const clearError = (inputElement, messageElementId) => {
        const group = inputElement.closest('.input-group');
        group.classList.remove('error');
        document.getElementById(messageElementId).textContent = '';
    };

    const triggerErrorShake = () => {
        formContainer.classList.remove('shake');
        // Trigger reflow to restart animation
        void formContainer.offsetWidth; 
        formContainer.classList.add('shake');
    };

    const setGlobalError = (message) => {
        formMessage.textContent = message;
        formMessage.className = 'global-message error';
        triggerErrorShake();
    };

    const clearGlobalError = () => {
        formMessage.className = 'global-message hidden';
        formMessage.textContent = '';
    };

    const setLoading = (isLoading) => {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    };

    const showSuccessState = () => {
        // Fade out form
        formContainer.classList.add('fade-out');
        
        setTimeout(() => {
            formContainer.classList.add('hidden');
            
            // Show success container
            successContainer.classList.remove('hidden');
            // Allow display:none to apply before triggering transition
            setTimeout(() => {
                successContainer.classList.add('visible');
            }, 50);
        }, 400); // Wait for CSS fade out to finish
    };

    // --- Form Submission ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset state
        clearGlobalError();
        clearError(fullNameInput, 'fullNameError');
        clearError(emailInput, 'emailError');
        clearError(passwordInput, 'passwordError');
        clearError(confirmPasswordInput, 'confirmPasswordError');

        let isValid = true;

        const fullName = fullNameInput.value.trim();
        if (!fullName) {
            showError(fullNameInput, 'fullNameError', 'Full name is required');
            isValid = false;
        }

        const email = emailInput.value.trim();
        if (!email) {
            showError(emailInput, 'emailError', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailInput, 'emailError', 'Please enter a valid email address');
            isValid = false;
        }

        const password = passwordInput.value;
        if (!password) {
            showError(passwordInput, 'passwordError', 'Password is required');
            isValid = false;
        } else if (!isStrongPassword(password)) {
            showError(passwordInput, 'passwordError', 'Min 8 chars, 1 uppercase, 1 lowercase, 1 number');
            isValid = false;
        }

        const confirmPassword = confirmPasswordInput.value;
        if (!confirmPassword) {
            showError(confirmPasswordInput, 'confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, 'confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }

        if (!isValid) {
            triggerErrorShake();
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Trigger success flow
                showSuccessState();
            } else {
                setGlobalError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setGlobalError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    });

    // Clear errors dynamically on input change
    const inputs = [
        { el: fullNameInput, errId: 'fullNameError' },
        { el: emailInput, errId: 'emailError' },
        { el: passwordInput, errId: 'passwordError' },
        { el: confirmPasswordInput, errId: 'confirmPasswordError' }
    ];

    inputs.forEach(({ el, errId }) => {
        el.addEventListener('input', () => {
            clearError(el, errId);
        });
    });
});
