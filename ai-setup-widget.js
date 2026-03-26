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
        7: document.getElementById('tpl-step-7'),
        8: document.getElementById('tpl-step-8'),
        final: document.getElementById('tpl-step-final'),
        thinking: document.getElementById('tpl-ai-thinking')
    };

    // --- State ---
    let currentStep = 1;
    let userData = {
        companyName: '',
        url: '',
        knowledgeFiles: [],
        knowledgeLinks: '',
        serviceFiles: [],
        agentGoal: '',
        persona: { name: 'Alex', tone: 'Professional' },
        leadsMethod: '',
        apolloKey: ''
    };

    // --- Helpers ---
    const showThinking = (text) => {
        aiResponseArea.innerHTML = '';
        const thinking = templates.thinking.content.cloneNode(true);
        thinking.querySelector('#thinking-text').innerText = text;
        aiResponseArea.appendChild(thinking);
    };

    const clearThinking = () => aiResponseArea.innerHTML = '';

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

    const renderStep = (step) => {
        currentStep = step;
        updateStepIndicators(step);
        backBtn.style.visibility = (step > 1 && step <= 8) ? 'visible' : 'hidden';
        dynamicFields.innerHTML = '';
        clearThinking();
        
        // Reset defaults
        continueBtn.innerText = 'Next Step';
        continueBtn.style.display = 'inline-block';
        continueBtn.disabled = false;
        skipBtn.style.display = (step > 8) ? 'none' : 'inline-block';

        if (step > 8) {
            initStepFinal();
            return;
        }

        const initFunc = window[`initStep${step}`];
        if (initFunc) initFunc();
    };

    // --- Step Implementations ---

    window.initStep1 = () => {
        dynamicFields.appendChild(templates[1].content.cloneNode(true));
        const input = document.getElementById('company-name');
        input.value = userData.companyName;
        const validate = () => continueBtn.disabled = !input.value.trim();
        input.addEventListener('input', (e) => { userData.companyName = e.target.value; validate(); });
        validate();
        continueBtn.onclick = () => renderStep(2);
    };

    window.initStep2 = () => {
        dynamicFields.appendChild(templates[2].content.cloneNode(true));
        const input = document.getElementById('website-url');
        input.value = userData.url;
        const validate = () => continueBtn.disabled = !input.value.trim();
        input.addEventListener('input', (e) => { userData.url = e.target.value; validate(); });
        validate();
        continueBtn.onclick = () => {
            showThinking('Learning about your brand...');
            setTimeout(() => renderStep(3), 1000);
        };
    };

    window.initStep3 = () => {
        dynamicFields.appendChild(templates[3].content.cloneNode(true));
        continueBtn.onclick = () => renderStep(4);
    };

    window.initStep4 = () => {
        dynamicFields.appendChild(templates[4].content.cloneNode(true));
        const input = document.getElementById('kb-website');
        input.value = userData.knowledgeLinks;
        input.addEventListener('input', (e) => userData.knowledgeLinks = e.target.value);
        continueBtn.onclick = () => {
            showThinking('Building your AI Brain...');
            setTimeout(() => renderStep(5), 1000);
        };
    };

    window.initStep5 = () => {
        dynamicFields.appendChild(templates[5].content.cloneNode(true));
        continueBtn.onclick = () => renderStep(6);
    };

    window.initStep6 = () => {
        dynamicFields.appendChild(templates[6].content.cloneNode(true));
        const goalInput = document.getElementById('agent-goal');
        const resultArea = document.getElementById('ai-persona-result');
        goalInput.value = userData.agentGoal;

        const updateUI = () => {
            if (userData.agentGoal) {
                resultArea.classList.remove('hidden');
                continueBtn.innerText = 'Looks good';
                continueBtn.disabled = false;
            } else {
                continueBtn.innerText = 'Generate Agent';
                continueBtn.disabled = true;
            }
        };

        goalInput.addEventListener('input', (e) => {
            userData.agentGoal = e.target.value;
            updateUI();
        });

        continueBtn.onclick = () => {
            if (resultArea.classList.contains('hidden')) {
                showThinking('Analyzing your goals...');
                setTimeout(() => {
                    clearThinking();
                    resultArea.classList.remove('hidden');
                    continueBtn.innerText = 'Looks good';
                }, 1500);
            } else {
                renderStep(7);
            }
        };
        updateUI();
    };

    window.initStep7 = () => {
        dynamicFields.appendChild(templates[7].content.cloneNode(true));
        const cards = document.querySelectorAll('.option-card');
        cards.forEach(card => {
            card.onclick = () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                userData.leadsMethod = card.dataset.option;
                continueBtn.disabled = false;
            };
        });
        continueBtn.disabled = !userData.leadsMethod;
        continueBtn.onclick = () => renderStep(8);
    };

    window.initStep8 = () => {
        dynamicFields.appendChild(templates[8].content.cloneNode(true));
        const input = document.getElementById('apollo-key');
        input.value = userData.apolloKey;
        input.addEventListener('input', (e) => userData.apolloKey = e.target.value);
        
        document.getElementById('test-apollo-btn').onclick = () => {
            showThinking('Testing connection...');
            setTimeout(() => {
                clearThinking();
                alert('Connection successful! (Simulated)');
            }, 1000);
        };

        continueBtn.innerText = 'Finish Setup';
        continueBtn.onclick = () => renderStep(9);
    };

    const initStepFinal = () => {
        dynamicFields.appendChild(templates.final.content.cloneNode(true));
        continueBtn.style.display = 'none';
        skipBtn.style.display = 'none';
        backBtn.style.display = 'none';
        
        document.getElementById('finish-generate').onclick = () => {
            alert('Generating your first campaign...');
            closePanel();
        };
        
        document.getElementById('finish-dashboard').onclick = () => closePanel();
    };

    // --- Global Controls ---
    backBtn.onclick = () => { if (currentStep > 1) renderStep(currentStep - 1); };
    skipBtn.onclick = () => { if (currentStep < 8) renderStep(currentStep + 1); else renderStep(9); };

    const openPanel = () => {
        panelOverlay.classList.add('active');
        assistantPanel.classList.add('open');
        if (dynamicFields.children.length === 0) renderStep(1);
    };

    const closePanel = () => {
        panelOverlay.classList.remove('active');
        assistantPanel.classList.remove('open');
    };

    closePanelBtn.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', closePanel);

    // Auto-open
    openPanel();
});
