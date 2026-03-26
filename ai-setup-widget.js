document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const panelOverlay = document.getElementById('panel-overlay');
    const assistantPanel = document.getElementById('assistant-panel');
    const closePanelBtn = document.getElementById('close-panel');
    const dynamicFields = document.getElementById('dynamic-fields');
    const aiResponseArea = document.getElementById('ai-response-area');
    
    // Controls
    const continueBtn = document.getElementById('continue-btn');
    const skipBtn = document.getElementById('skip-btn');
    const backBtn = document.getElementById('back-btn');
    
    // Templates
    const templates = {
        1: document.getElementById('tpl-step-1'),
        2: document.getElementById('tpl-step-2'),
        3: document.getElementById('tpl-step-3'),
        4: document.getElementById('tpl-step-4'),
        5: document.getElementById('tpl-step-5'),
        6: document.getElementById('tpl-step-6'),
        final: document.getElementById('tpl-step-final'),
        thinking: document.getElementById('tpl-ai-thinking')
    };

    // --- State ---
    let currentStep = 1;
    let userData = {
        companyName: '',
        url: '',
        apolloKey: '',
        agentGoal: '',
        persona: {
            name: 'Alex',
            tone: 'Professional',
            style: 'Direct',
            gender: 'Neutral',
            instructions: ''
        },
        supportName: '',
        supportEmail: '',
        leadsMethod: ''
    };

    // --- Helpers ---
    const showThinking = (text) => {
        aiResponseArea.innerHTML = '';
        const thinking = templates.thinking.content.cloneNode(true);
        thinking.querySelector('#thinking-text').innerText = text;
        aiResponseArea.appendChild(thinking);
    };

    const clearThinking = () => {
        aiResponseArea.innerHTML = '';
    };

    const updateStepIndicators = (step) => {
        document.querySelectorAll('.step-indicator').forEach((el, idx) => {
            el.classList.remove('active', 'completed');
            if (idx + 1 < step) el.classList.add('completed');
            if (idx + 1 === step) el.classList.add('active');
        });
        document.querySelectorAll('.step-line').forEach((el, idx) => {
            el.classList.remove('completed');
            if (idx + 1 < step) el.classList.add('completed');
        });
    };

    const toggleBackBtn = (step) => {
        backBtn.style.visibility = (step > 1 && step <= 6) ? 'visible' : 'hidden';
    };

    const renderStep = (step) => {
        currentStep = step;
        updateStepIndicators(step);
        toggleBackBtn(step);
        dynamicFields.innerHTML = '';
        clearThinking();
        
        // Reset defaults
        continueBtn.innerText = 'Next Step';
        continueBtn.style.display = 'inline-block';
        continueBtn.disabled = false;
        skipBtn.style.display = (step === 1 || step > 6) ? 'none' : 'inline-block';
        skipBtn.innerText = 'Do this later';

        if (step === 7) {
            initStepFinal();
            return;
        }

        switch(step) {
            case 1: initStep1(); break;
            case 2: initStep2(); break;
            case 3: initStep3(); break;
            case 4: initStep4(); break;
            case 5: initStep5(); break;
            case 6: initStep6(); break;
        }
    };

    // --- Step Implementations ---

    // Step 1: Company Profile
    const initStep1 = () => {
        dynamicFields.appendChild(templates[1].content.cloneNode(true));
        const nameInput = document.getElementById('company-name');
        const urlInput = document.getElementById('website-url');
        const inlineNextBtn = document.getElementById('step-1-next-inline');
        
        nameInput.value = userData.companyName;
        urlInput.value = userData.url;

        const validate = () => {
            const isValid = nameInput.value.trim() && urlInput.value.trim();
            continueBtn.disabled = !isValid;
            if (inlineNextBtn) inlineNextBtn.disabled = !isValid;
        };

        const handleNext = () => {
            showThinking('Saving profile...');
            setTimeout(() => renderStep(2), 800);
        };

        nameInput.addEventListener('input', (e) => { userData.companyName = e.target.value; validate(); });
        urlInput.addEventListener('input', (e) => { userData.url = e.target.value; validate(); });
        
        validate();
        continueBtn.onclick = handleNext;
        if (inlineNextBtn) inlineNextBtn.onclick = handleNext;
    };

    // Step 2: Knowledge Sources
    const initStep2 = () => {
        dynamicFields.appendChild(templates[2].content.cloneNode(true));
        continueBtn.onclick = () => {
            showThinking('Indexing sources...');
            setTimeout(() => renderStep(3), 1000);
        };
    };

    // Step 3: Service Catalog
    const initStep3 = () => {
        dynamicFields.appendChild(templates[3].content.cloneNode(true));
        continueBtn.onclick = () => {
            showThinking('Processing catalog...');
            setTimeout(() => renderStep(4), 800);
        };
    };

    // Step 4: Agent Persona (AI Magic ✨)
    const initStep4 = () => {
        dynamicFields.appendChild(templates[4].content.cloneNode(true));
        const goalInput = document.getElementById('agent-goal');
        const resultArea = document.getElementById('ai-persona-result');
        
        goalInput.value = userData.agentGoal;
        
        if (userData.agentGoal) {
            resultArea.classList.remove('hidden');
            continueBtn.innerText = 'Looks good';
        } else {
            continueBtn.innerText = 'Generate Agent';
            continueBtn.disabled = true;
        }

        goalInput.addEventListener('input', (e) => {
            userData.agentGoal = e.target.value;
            continueBtn.disabled = !e.target.value.trim();
        });

        continueBtn.onclick = () => {
            if (resultArea.classList.contains('hidden')) {
                // Generate magic
                showThinking('Analyzing your goals...');
                setTimeout(() => {
                    showThinking('Building your perfect agent...');
                    setTimeout(() => {
                        clearThinking();
                        resultArea.classList.remove('hidden');
                        
                        // Fake AI data
                        const persona = {
                            name: 'Alex',
                            tone: 'Professional & Friendly',
                            style: 'Modern & Quick',
                            gender: 'Neutral/Professional',
                            instructions: `Focus on ${userData.companyName}'s USP. Be helpful and drive meetings.`
                        };
                        
                        document.getElementById('persona-name').value = persona.name;
                        document.getElementById('persona-tone').value = persona.tone;
                        document.getElementById('persona-style').value = persona.style;
                        document.getElementById('persona-gender').value = persona.gender;
                        document.getElementById('persona-instructions').value = persona.instructions;
                        
                        continueBtn.innerText = 'Looks good';
                        continueBtn.disabled = false;
                        
                        // Smart microcopy
                        const hint = document.createElement('p');
                        hint.className = 'micro-note fade-in mt-2';
                        hint.innerText = 'Nice choice 👌 You can edit these if needed.';
                        resultArea.prepend(hint);
                    }, 1500);
                }, 1000);
            } else {
                renderStep(5);
            }
        };
    };

    // Step 5: Support Contact
    const initStep5 = () => {
        dynamicFields.appendChild(templates[5].content.cloneNode(true));
        const nameInput = document.getElementById('support-name');
        const emailInput = document.getElementById('support-email');
        
        nameInput.value = userData.supportName;
        emailInput.value = userData.supportEmail;

        continueBtn.onclick = () => renderStep(6);
    };

    // Step 6: Leads Setup
    const initStep6 = () => {
        dynamicFields.appendChild(templates[6].content.cloneNode(true));
        const cards = document.querySelectorAll('.option-card');
        
        cards.forEach(card => {
            card.onclick = () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                userData.leadsMethod = card.dataset.option;
                continueBtn.disabled = false;
            };
        });

        continueBtn.innerText = 'Finish Setup';
        continueBtn.disabled = !userData.leadsMethod;
        continueBtn.onclick = () => renderStep(7);
    };

    // Final Step
    const initStepFinal = () => {
        dynamicFields.appendChild(templates.final.content.cloneNode(true));
        continueBtn.style.display = 'none';
        skipBtn.style.display = 'none';
        backBtn.style.display = 'none';
        
        document.getElementById('finish-generate').onclick = () => {
            alert('Generating initial sales strategy...');
            closePanel();
        };
        
        document.getElementById('finish-dashboard').onclick = () => {
            closePanel();
        };
    };

    // --- Global Controls ---
    backBtn.onclick = () => {
        if (currentStep > 1) renderStep(currentStep - 1);
    };

    skipBtn.onclick = () => {
        if (currentStep < 6) renderStep(currentStep + 1);
        else renderStep(7);
    };

    const openPanel = () => {
        panelOverlay.classList.add('active');
        assistantPanel.classList.add('open');
        if (dynamicFields.children.length === 0) {
            renderStep(1);
        }
    };

    const closePanel = () => {
        panelOverlay.classList.remove('active');
        assistantPanel.classList.remove('open');
    };

    closePanelBtn.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', closePanel);

    // Initial Trigger - Immediate auto-open
    openPanel();
});
