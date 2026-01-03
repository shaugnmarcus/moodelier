        // FIREBASE CONFIG
        const firebaseConfig = {
            apiKey: "AIzaSyBwhgcm1NSklD2ZlnWHfiyXeXBgAHoJUUY",
            authDomain: "moodelier-2025.firebaseapp.com",
            projectId: "moodelier-2025",
            storageBucket: "moodelier-2025.firebasestorage.app",
            messagingSenderId: "119446309058",
            appId: "1:119446309058:web:4cbf7a8e05866c678cd35b"
        };
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();

        // redirect to main page if already signed in
        auth.onAuthStateChanged(user => {
            if (user) {
                window.location.href = "index.html";
            }
        });

        // DOM STUFF
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const slider = document.getElementById('toggleSlider');
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');
        const passInput = document.getElementById('spass');
        const passError = document.getElementById('passError');

        // TAB SWITCHING
        function switchTab(tab) {
            if (tab === 'login') {
                // slider goes left
                slider.style.transform = 'translateX(0%)';
                
                // update tab styles
                loginTab.classList.add('active');
                signupTab.classList.remove('active');

                // swap which form is visible
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
                signupForm.style.transform = 'translateX(20px)';
                loginForm.style.transform = 'translateX(0)';
            } else {
                // slider goes right
                slider.style.transform = 'translateX(100%)';

                // update tab styles
                signupTab.classList.add('active');
                loginTab.classList.remove('active');

                // swap which form is visible
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
                loginForm.style.transform = 'translateX(-20px)';
                signupForm.style.transform = 'translateX(0)';
            }
        }

        // LOGIN
        function handleLogin(event) {
            event.preventDefault();
            const submitButton = event.target.querySelector('button');
            const email = event.target.querySelector('input[type="email"]').value;
            const password = event.target.querySelector('input[type="password"]').value;
            
            submitButton.innerText = "Logging in...";
            submitButton.style.opacity = "0.7";
            submitButton.disabled = true;
            
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    submitButton.innerText = "Enter Journal";
                    submitButton.style.opacity = "1";
                    submitButton.disabled = false;
                    alert(error.message);
                });
        }

        // SIGNUP
        function handleSignup(event) {
            event.preventDefault();
            const password = passInput.value;
            const submitButton = event.target.querySelector('button');

            const passwordRegex = /^.{6,}$/;

            if (!passwordRegex.test(password)) {
                passError.style.display = 'block';
                passInput.style.borderColor = 'var(--error)';
                return;
            }

            passError.style.display = 'none';
            passInput.style.borderColor = 'rgba(255,255,255,0.1)';

            const username = event.target.querySelector('input[type="text"]').value;
            const email = event.target.querySelector('input[type="email"]').value;

            submitButton.innerText = "Creating Account...";
            submitButton.disabled = true;
            
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // save username to profile
                    return userCredential.user.updateProfile({
                        displayName: username
                    });
                })
                .then(() => {
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    submitButton.innerText = "Create Account";
                    submitButton.disabled = false;
                    alert(error.message);
                });
        }

        // PASSWORD RESET
        document.querySelector('.forgot-link').addEventListener('click', (event) => {
            event.preventDefault();
            const email = prompt("Enter your email address:");
            if (email) {
                auth.sendPasswordResetEmail(email)
                    .then(() => {
                        alert("Password reset email sent! Check your inbox.");
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            }
        });

        // clear error when user starts typing again
        passInput.addEventListener('input', () => {
            passError.style.display = 'none';
            passInput.style.borderColor = 'rgba(255,255,255,0.1)';
        });