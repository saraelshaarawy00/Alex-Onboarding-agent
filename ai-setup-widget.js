document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const widgetTrigger = document.getElementById('widget-trigger');
    const panelOverlay = document.getElementById('panel-overlay');
    const assistantPanel = document.getElementById('assistant-panel');
    const closePanelBtn = document.getElementById('close-panel');
    const chatContainer = document.getElementById('chat-container');
    const inputArea = document.getElementById('input-area');
    const continueBtn = document.getElementById('continue-btn');
    const skipBtn = document.getElementById('skip-btn');
    const progressBar = document.getElementById('progress-bar');
    
    // Templates
    const tplAiMsg = document.getElementById('tpl-ai-message').innerHTML;
    const tplUserMsg = document.getElementById('tpl-user-message').innerHTML;
    const tplTyping = document.getElementById('tpl-typing').innerHTML;

    // --- State ---
    let currentStep = 1;
    let userData = {
        url: '',
        languages: [],
        autoDetect: true
    };
    
    const languagesList = ['Arabic', 'English', 'French', 'Spanish', 'German', 'Italian', 'Japanese', 'Chinese'];

    // --- Panel Toggle ---
    const openPanel = () => {
        panelOverlay.classList.add('active');
        assistantPanel.classList.add('open');
        if (chatContainer.children.length === 0) {
            initStep1();
        }
    };

    const closePanel = () => {
        panelOverlay.classList.remove('active');
        assistantPanel.classList.remove('open');
    };

    widgetTrigger.addEventListener('click', openPanel);
    closePanelBtn.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', closePanel);

    // --- Chat Helpers ---
    const addAiMessage = (text) => {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = tplAiMsg.replace('${content}', text);
        chatContainer.appendChild(msgDiv.firstElementChild);
        scrollToBottom();
    };

    const addUserMessage = (text) => {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = tplUserMsg.replace('${content}', text);
        chatContainer.appendChild(msgDiv.firstElementChild);
        scrollToBottom();
    };

    const showTyping = () => {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = tplTyping;
        const el = msgDiv.firstElementChild;
        el.id = 'current-typing';
        chatContainer.appendChild(el);
        scrollToBottom();
        return el;
    };

    const removeTyping = () => {
        const typingEl = document.getElementById('current-typing');
        if (typingEl) typingEl.remove();
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 50);
    };

    const updateProgress = (step) => {
        progressBar.style.width = step === 1 ? '33%' : step === 2 ? '66%' : '100%';
        
        // Update indicators
        document.querySelectorAll('.step').forEach((el, index) => {
            el.classList.remove('active');
            if (index + 1 < step) {
                el.classList.add('completed');
            } else if (index + 1 === step) {
                el.classList.add('active');
            }
        });
    };

    // --- Step 1: URL Input ---
    const initStep1 = () => {
        currentStep = 1;
        updateProgress(1);
        
        // Initial Greeting
        setTimeout(() => {
            let typing = showTyping();
            setTimeout(() => {
                removeTyping();
                addAiMessage('Hello! I am your AI Setup Assistant. Let’s get your website translated in a few simple steps.');
                
                setTimeout(() => {
                     let typing2 = showTyping();
                     setTimeout(() => {
                         removeTyping();
                         addAiMessage('To start, please paste your website link below.');
                         renderStep1Input();
                     }, 800);
                }, 400);
            }, 1000);
        }, 300);
    };

    const renderStep1Input = () => {
        inputArea.innerHTML = `
            <div class="url-input-container">
                <input type="url" id="website-url" class="url-input" placeholder="https://yourwebsite.com" autocomplete="off">
                <button id="submit-url" class="enter-btn" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
            </div>
        `;
        
        const urlInput = document.getElementById('website-url');
        const submitUrlBtn = document.getElementById('submit-url');
        
        continueBtn.disabled = true;

        const checkInput = () => {
            const val = urlInput.value.trim();
            const isValid = val.length > 3 && val.includes('.');
            submitUrlBtn.disabled = !isValid;
            continueBtn.disabled = !isValid;
        };

        urlInput.addEventListener('input', checkInput);
        
        const handleUrlSubmit = () => {
            if (!submitUrlBtn.disabled) {
                userData.url = urlInput.value.trim();
                addUserMessage(userData.url);
                inputArea.innerHTML = '';
                continueBtn.disabled = true;
                processStep1To2();
            }
        };

        submitUrlBtn.addEventListener('click', handleUrlSubmit);
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUrlSubmit();
        });
        
        // If continue is clicked from outside
        continueBtn.onclick = handleUrlSubmit;
    };

    const processStep1To2 = () => {
        let typing = showTyping();
        setTimeout(() => {
            removeTyping();
            addAiMessage(`Got it! Nice choice 🔥 Analyzing <strong>${userData.url}</strong>...`);
            
            setTimeout(() => {
                let typing2 = showTyping();
                setTimeout(() => {
                    removeTyping();
                    addAiMessage('Now, let’s choose the target languages you want to translate your website into.');
                    initStep2();
                }, 1200);
            }, 800);
            
        }, 1500);
    };

    // --- Step 2: Languages ---
    const initStep2 = () => {
        currentStep = 2;
        updateProgress(2);
        
        let chipsHtml = languagesList.map(lang => `
            <div class="chip" data-lang="${lang}">
                ${lang}
                <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
        `).join('');

        inputArea.innerHTML = `
            <div class="chips-container">${chipsHtml}</div>
        `;

        const chips = document.querySelectorAll('.chip');
        
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
                const lang = chip.getAttribute('data-lang');
                if (chip.classList.contains('selected')) {
                    userData.languages.push(lang);
                } else {
                    userData.languages = userData.languages.filter(l => l !== lang);
                }
                continueBtn.disabled = userData.languages.length === 0;
            });
        });

        // Skip logic for Step 2
        skipBtn.onclick = () => {
             userData.languages = ['Arabic']; // default skip fallback
             addUserMessage('Skip for now');
             inputArea.innerHTML = '';
             processStep2To3();
        };

        // Continue click
        continueBtn.onclick = () => {
            addUserMessage(`Translate to: ${userData.languages.join(', ')}`);
            inputArea.innerHTML = '';
            continueBtn.disabled = true;
            processStep2To3();
        };
    };

    const processStep2To3 = () => {
        let typing = showTyping();
        setTimeout(() => {
            removeTyping();
            addAiMessage('Excellent selections. By default, we will auto-detect your website’s source language.');
            
            setTimeout(() => {
                initStep3();
            }, 600);
        }, 1000);
    };

    // --- Step 3: Auto Detect / Final Setup ---
    const initStep3 = () => {
        currentStep = 3;
        updateProgress(3);
        
        continueBtn.innerText = 'Auto Setup';
        continueBtn.disabled = false;

        inputArea.innerHTML = `
            <div class="setup-options">
                <label class="toggle-row">
                    <div class="toggle-info">
                        <h4>Auto-detect language</h4>
                        <p>We'll automatically detect your site's main language.</p>
                    </div>
                    <div class="switch">
                        <input type="checkbox" id="auto-detect-toggle" checked>
                        <span class="slider"></span>
                    </div>
                </label>
            </div>
        `;

        const toggle = document.getElementById('auto-detect-toggle');
        toggle.addEventListener('change', (e) => {
            userData.autoDetect = e.target.checked;
        });

        skipBtn.onclick = () => finalizeSetup('Skip');

        continueBtn.onclick = () => {
            addUserMessage('Proceed with auto setup');
            inputArea.innerHTML = '';
            continueBtn.disabled = true;
            skipBtn.style.display = 'none';
            finalizeSetup();
        };
    };

    const finalizeSetup = (action = 'Continue') => {
        let typing = showTyping();
        continueBtn.style.display = 'none';

        setTimeout(() => {
            removeTyping();
            addAiMessage('🎉 Setup complete! Your website is being translated. Welcome aboard.');
            
            progressBar.classList.add('completed');
            document.getElementById('step-3-indicator').classList.add('active');
            
            setTimeout(() => {
               // Show a subtle celebrate animation or close message
               const msgDiv = document.createElement('div');
               msgDiv.style.textAlign = 'center';
               msgDiv.style.marginTop = '10px';
               msgDiv.style.fontSize = '14px';
               msgDiv.style.color = 'var(--text-muted)';
               msgDiv.innerHTML = 'You can close this window now.';
               chatContainer.appendChild(msgDiv);
               scrollToBottom();
            }, 1000);
            
        }, 2000);
    };

});
