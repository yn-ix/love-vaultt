document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // CONFIGURATION TWEAKS (Completely Independent Codes!)
    // ==========================================================================
    const CORRECT_NAME = "ythan namo";          // Code to pass the "Kanino ka lang?" gate
    const DELETION_PASSWORD = "10 inch";    // Independent password required to delete memories

    // UI Screens
    const welcomeScreen = document.getElementById('welcome-screen');
    const menuScreen = document.getElementById('menu-screen');
    const albumScreen = document.getElementById('album-screen');
    const codeScreen = document.getElementById('code-screen');
    const messageDisplay = document.getElementById('message-display');
    
    // Welcome Screen Structural Components
    const welcomeMessageContent = document.getElementById('welcome-message-content');
    const gatekeeperContent = document.getElementById('gatekeeper-content');
    let welcomeStage = 1; // 1: Initial, 2: Answering Question, 3: Letter Review

    // Custom Emergency Layouts
    const dramaticModalOverlay = document.getElementById('dramatic-modal-overlay');
    const dangerCardElement = document.getElementById('danger-card-element');
    const dangerConfirmInput = document.getElementById('danger-confirm-input');
    const dangerCancelBtn = document.getElementById('danger-cancel-btn');
    const dangerConfirmBtn = document.getElementById('danger-confirm-btn');

    // Core Interaction Elements
    const ownerNameInput = document.getElementById('owner-name');
    const getStartedBtn = document.getElementById('get-started-btn');
    const goAlbumBtn = document.getElementById('go-album-btn');
    const goVaultBtn = document.getElementById('go-vault-btn');
    const openVaultBtn = document.getElementById('open-vault-btn');
    const lockVaultBtn = document.getElementById('lock-vault-btn');
    const clearProgressBtn = document.getElementById('clear-progress-btn');
    
    // Back Direction Links
    const backFromAlbumBtn = document.getElementById('back-from-album-btn');
    const backFromCodeBtn = document.getElementById('back-from-code-btn');

    // Presentation Layout Wrappers
    const secretCodeInput = document.getElementById('secret-code');
    const flipCard = document.getElementById('flip-card');
    const secretText = document.getElementById('secret-text');
    const vaultImage = document.getElementById('vault-image');
    const dynamicAlbumGrid = document.getElementById('dynamic-album-grid');

    let messagesData = null;
    let navigationSource = 'menu'; 

    // Read stored profile history variables
    let unlockedCodes = JSON.parse(localStorage.getItem('unlockedLoveVaultCodes')) || [];

    createFloatingHearts();

    // Fetch JSON assets folder details
    fetch('messages.json')
        .then(res => {
            if (!res.ok) throw new Error('Network file system parsing fault');
            return res.json();
        })
        .then(data => { messagesData = data; })
        .catch(err => console.error('Error matching messages.json entries:', err));

    // ==========================================================================
    // GATEKEEPER STRING COMPARATOR 
    // ==========================================================================
    ownerNameInput.addEventListener('input', () => {
        if (welcomeStage !== 2) return; 

        const typedValue = ownerNameInput.value.trim().toLowerCase();

        if (typedValue === CORRECT_NAME) {
            getStartedBtn.removeAttribute('disabled');
            getStartedBtn.style.background = 'linear-gradient(135deg, var(--primary-pink), var(--deep-rose))';
            getStartedBtn.style.boxShadow = '0 4px 15px rgba(255, 71, 87, 0.3)';
            getStartedBtn.style.cursor = 'pointer';
            getStartedBtn.innerText = "Continue ❤️";
        } else {
            getStartedBtn.setAttribute('disabled', 'true');
            getStartedBtn.style.background = '#d3c5c7';
            getStartedBtn.style.boxShadow = 'none';
            getStartedBtn.style.cursor = 'not-allowed';
            getStartedBtn.innerText = "Get Started ❤️";
        }
    });

    // ==========================================================================
    // TIMELINE CONFIGURATION ENGINE (Fixed step flow sequence)
    // ==========================================================================
    getStartedBtn.addEventListener('click', () => {
        if (getStartedBtn.hasAttribute('disabled')) return;
        
        if (welcomeStage === 1) {
            gatekeeperContent.classList.add('reveal-now');
            
            getStartedBtn.setAttribute('disabled', 'true');
            getStartedBtn.style.background = '#d3c5c7';
            getStartedBtn.style.boxShadow = 'none';
            getStartedBtn.style.cursor = 'not-allowed';
            
            welcomeStage = 2; 
            setTimeout(() => ownerNameInput.focus(), 300);
            
        } else if (welcomeStage === 2) {
            gatekeeperContent.classList.remove('reveal-now');
            
            setTimeout(() => {
                gatekeeperContent.style.display = 'none';
                welcomeMessageContent.classList.add('reveal-now');
                getStartedBtn.innerText = "Continue ❤️";
                welcomeStage = 3; 
            }, 350);
            
        } else if (welcomeStage === 3) {
            welcomeScreen.classList.add('hidden');
            menuScreen.classList.remove('hidden');
        }
    });

    // ==========================================================================
    // SELECTION HUB HUB ROUTINES
    // ==========================================================================
    goAlbumBtn.addEventListener('click', () => {
        menuScreen.classList.add('hidden');
        renderUnlockedAlbum(); 
        albumScreen.classList.remove('hidden');
    });

    backFromAlbumBtn.addEventListener('click', () => {
        albumScreen.classList.add('hidden');
        menuScreen.classList.remove('hidden');
    });

    goVaultBtn.addEventListener('click', () => {
        menuScreen.classList.add('hidden');
        codeScreen.classList.remove('hidden');
        setTimeout(() => secretCodeInput.focus(), 400);
    });

    backFromCodeBtn.addEventListener('click', () => {
        codeScreen.classList.add('hidden');
        menuScreen.classList.remove('hidden');
        secretCodeInput.value = '';
    });

    // ==========================================================================
    // ALBUM INTERFACE COMPILER ENGINE
    // ==========================================================================
    function renderUnlockedAlbum() {
        dynamicAlbumGrid.innerHTML = '';
        if (!messagesData) return;

        let activeItemsFound = 0;

        unlockedCodes.forEach(code => {
            if (messagesData.hasOwnProperty(code) && messagesData[code].image) {
                activeItemsFound++;
                
                const albumItem = document.createElement('div');
                albumItem.className = 'album-item';
                albumItem.innerHTML = `<img src="${messagesData[code].image}" alt="Memory">`;
                
                albumItem.addEventListener('click', () => {
                    navigationSource = 'album'; 
                    loadCardContent(messagesData[code]);
                    albumScreen.classList.add('hidden');
                    messageDisplay.classList.remove('hidden');
                });
                
                dynamicAlbumGrid.appendChild(albumItem);
            }
        });

        if (activeItemsFound === 0) {
            dynamicAlbumGrid.innerHTML = `
                <div style="grid-column: span 3; text-align: center; color: #5c3a44; padding: 3rem 0; font-style: italic; font-size: 1.05rem;">
                    Your album is empty right now... <br><br> 
                    Unlock hidden letters with your secret codes to populate your gallery memories! 🔑
                </div>
            `;
        }
    }

    // ==========================================================================
    // DANGER REACTION SYSTEM OVERLAYS
    // ==========================================================================
    clearProgressBtn.addEventListener('mouseenter', () => clearProgressBtn.style.opacity = '1');
    clearProgressBtn.addEventListener('mouseleave', () => clearProgressBtn.style.opacity = '0.4');
    
    clearProgressBtn.addEventListener('click', () => {
        dramaticModalOverlay.classList.remove('hidden');
        dangerConfirmInput.value = '';
        dangerConfirmInput.placeholder = "the size of ma dih";
        
        dangerCardElement.style.animation = 'none';
        setTimeout(() => { dangerCardElement.style.animation = ''; }, 10);
        setTimeout(() => dangerConfirmInput.focus(), 300);
    });

    dangerCancelBtn.addEventListener('click', () => {
        dramaticModalOverlay.classList.add('hidden');
    });

    dangerConfirmBtn.addEventListener('click', handleDangerDelete);
    dangerConfirmInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleDangerDelete(); });

    function handleDangerDelete() {
        const confirmVal = dangerConfirmInput.value.trim(); // Keeps original case settings for security password safety

        // PROGRESS FIXED: Now independently checks the new DELETION_PASSWORD variable string line instead!
        if (confirmVal === DELETION_PASSWORD) {
            unlockedCodes = [];
            localStorage.removeItem('unlockedLoveVaultCodes');
            dramaticModalOverlay.classList.add('hidden');
            renderUnlockedAlbum(); 
            alert("Memories locked back up in the vault... 🔒");
        } else {
            dangerConfirmInput.value = '';
            dangerConfirmInput.placeholder = "Wrong size bub! Love remains intact! 🥰";
            
            dangerCardElement.style.transform = 'translateX(0)';
            let steps = [-12, 12, -12, 12, -6, 6, 0];
            let idx = 0;
            const runShake = setInterval(() => {
                if (idx < steps.length) {
                    dangerCardElement.style.transform = `translateX(${steps[idx]}px)`;
                    idx++;
                } else {
                    clearInterval(runShake);
                    dangerCardElement.style.transform = '';
                }
            }, 45);
        }
    }

    // ==========================================================================
    // DYNAMIC CARD PARSING UNLOCK SYSTEM
    // ==========================================================================
    openVaultBtn.addEventListener('click', () => { navigationSource = 'code'; handleUnlock(); });
    secretCodeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { navigationSource = 'code'; handleUnlock(); } });

    function handleUnlock() {
        const enteredCode = secretCodeInput.value.trim();

        if (!messagesData) return;
        if (!enteredCode) { shakeInput(); return; }

        if (messagesData.hasOwnProperty(enteredCode)) {
            const data = messagesData[enteredCode];
            
            if (!unlockedCodes.includes(enteredCode)) {
                unlockedCodes.push(enteredCode);
                localStorage.setItem('unlockedLoveVaultCodes', JSON.stringify(unlockedCodes));
            }

            loadCardContent(data);
            codeScreen.classList.add('hidden');
            messageDisplay.classList.remove('hidden');
        } else {
            shakeInput();
            secretCodeInput.value = '';
            secretCodeInput.placeholder = 'Wrong code, try again Love... 🌸';
        }
    }

    function loadCardContent(dataItem) {
        if (typeof dataItem === 'object' && dataItem !== null) {
            secretText.innerText = dataItem.message || ""; 
            if (dataItem.image) vaultImage.src = dataItem.image;
        } else {
            secretText.innerText = dataItem;
        }
    }

    flipCard.addEventListener('click', (e) => {
        if (e.target === lockVaultBtn) return;
        flipCard.classList.toggle('is-flipped');
    });

    lockVaultBtn.addEventListener('click', () => {
        flipCard.classList.remove('is-flipped');
        setTimeout(() => {
            messageDisplay.classList.add('hidden');
            secretCodeInput.value = '';
            secretCodeInput.placeholder = 'Enter the code on your paper...';
            
            if (navigationSource === 'album') {
                renderUnlockedAlbum(); 
                albumScreen.classList.remove('hidden');
            } else {
                menuScreen.classList.remove('hidden');
            }
        }, 300);
    });

    function shakeInput() {
        const card = codeScreen.querySelector('.card');
        let steps = [-10, 10, -10, 10, -5, 5, 0];
        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                card.style.transform = `translateX(${steps[i]}px)`;
                i++;
            } else {
                clearInterval(interval);
                card.style.transform = '';
            }
        }, 50);
    }

    function createFloatingHearts() {
        const emojis = ['❤️', '💖', '🌸', '✨', '💕'];
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.animationDelay = `${Math.random() * 8}s`;
            heart.style.animationDuration = `${6 + Math.random() * 6}s`;
            heart.style.fontSize = `${1 + Math.random() * 1.5}rem`;
            document.body.appendChild(heart);
        }
    }
});