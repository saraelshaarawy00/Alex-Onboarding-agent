document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const widgetTrigger = document.getElementById('widget-trigger');
    const panelOverlay = document.getElementById('panel-overlay');
    const assistantPanel = document.getElementById('assistant-panel');
    const closePanelBtn = document.getElementById('close-panel');
    const mainContent = document.getElementById('main-content');
    const aiResponseArea = document.getElementById('ai-response-area');
    const dynamicFields = document.getElementById('dynamic-fields');
    
    // Controls
    const continueBtn = document.getElementById('continue-btn');
    const skipBtn = document.getElementById('skip-btn');
    const backBtn = document.getElementById('back-btn');
    
    // Templates
    const tplStep1 = document.getElementById('tpl-step-1');
    const tplStep2 = document.getElementById('tpl-step-2');
    const tplStep3 = document.getElementById('tpl-step-3');
    const tplStep4 = document.getElementById('tpl-step-4');
    const tplStep5 = document.getElementById('tpl-step-5');
    const tplStepFinal = document.getElementById('tpl-step-final');
    const tplAiThinking = document.getElementById('tpl-ai-thinking');

    // --- State ---
    let currentStep = 1;
    let userData = {
        url: '',
        reference: '',
        industry: 'E-commerce',
        audience: 'Businesses',
        sourceLang: 'English',
        targetLanguages: [],
        pageSelection: 'all'
    };

    const languagesList = ['Arabic', 'French', 'Spanish', 'German', 'Italian', 'Japanese', 'Chinese', 'Portuguese', 'Russian'];

    // --- Helpers ---
    const showThinking = (text) => {
        aiResponseArea.innerHTML = '';
        const thinking = tplAiThinking.content.cloneNode(true);
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
        backBtn.style.visibility = step > 1 && step <= 5 ? 'visible' : 'hidden';
    };

    // --- Steps Implementation ---

    const renderStep = (step) => {
        currentStep = step;
        updateStepIndicators(step);
        toggleBackBtn(step);
        dynamicFields.innerHTML = '';
        clearThinking();
        
        // Reset buttons defaults
        continueBtn.innerText = 'Continue';
        continueBtn.style.display = 'inline-block';
        skipBtn.style.display = (step === 5 || step === 6) ? 'none' : 'inline-block';
        continueBtn.disabled = false;

        switch(step) {
            case 1: initStep1(); break;
            case 2: initStep2(); break;
            case 3: initStep3(); break;
            case 4: initStep4(); break;
            case 5: initStep5(); break;
            case 6: initStepFinal(); break;
        }
    };

    // Step 1: Website Input
    const initStep1 = () => {
        dynamicFields.appendChild(tplStep1.content.cloneNode(true));
        const urlInput = document.getElementById('website-url');
        const refInput = document.getElementById('reference-url');
        const step1Next = document.getElementById('step-1-next');
        
        urlInput.value = userData.url;
        refInput.value = userData.reference;

        const validate = () => {
            const isValid = urlInput.value.trim().includes('.');
            continueBtn.disabled = !isValid;
            step1Next.disabled = !isValid;
        };

        urlInput.addEventListener('input', validate);
        validate();

        const handleNext = () => {
            userData.url = urlInput.value.trim();
            userData.reference = refInput.value.trim();
            
            showThinking('Analyzing your website...');
            dynamicFields.innerHTML = '';
            continueBtn.disabled = true;
            
            setTimeout(() => {
                renderStep(2);
            }, 1800);
        };

        continueBtn.onclick = handleNext;
        step1Next.onclick = handleNext;
    };

    // Step 2: AI Detection
    const initStep2 = () => {
        dynamicFields.appendChild(tplStep2.content.cloneNode(true));
        const industryInput = document.getElementById('detected-industry');
        const audienceInput = document.getElementById('detected-audience');
        const step2Next = document.getElementById('step-2-next');
        
        industryInput.value = userData.industry;
        audienceInput.value = userData.audience;

        industryInput.addEventListener('input', (e) => userData.industry = e.target.value);
        audienceInput.addEventListener('input', (e) => userData.audience = e.target.value);

        continueBtn.innerText = 'Looks good';
        
        const handleNext = () => renderStep(3);
        continueBtn.onclick = handleNext;
        step2Next.onclick = handleNext;
    };

    // Step 3: Languages
    const initStep3 = () => {
        dynamicFields.appendChild(tplStep3.content.cloneNode(true));
        const chipsContainer = document.getElementById('chips-container');
        const step3Next = document.getElementById('step-3-next');
        
        languagesList.forEach(lang => {
            const chip = document.createElement('div');
            chip.className = 'chip' + (userData.targetLanguages.includes(lang) ? ' selected' : '');
            chip.innerText = lang;
            chip.onclick = () => {
                chip.classList.toggle('selected');
                if (chip.classList.contains('selected')) {
                    userData.targetLanguages.push(lang);
                } else {
                    userData.targetLanguages = userData.targetLanguages.filter(l => l !== lang);
                }
                validate();
            };
            chipsContainer.appendChild(chip);
        });

        const validate = () => {
            const isValid = userData.targetLanguages.length > 0;
            continueBtn.disabled = !isValid;
            step3Next.disabled = !isValid;
        };
        validate();

        const handleNext = () => {
            showThinking('Detecting pages...');
            dynamicFields.innerHTML = '';
            continueBtn.disabled = true;
            setTimeout(() => renderStep(4), 1200);
        };
        continueBtn.onclick = handleNext;
        step3Next.onclick = handleNext;
    };

    // Step 4: Page Selection
    const initStep4 = () => {
        dynamicFields.appendChild(tplStep4.content.cloneNode(true));
        const optionCards = document.querySelectorAll('.option-card');
        const checklist = document.getElementById('pages-checklist');
        const step4Next = document.getElementById('step-4-next');

        const updateUI = (val) => {
            userData.pageSelection = val;
            optionCards.forEach(card => {
                card.classList.toggle('active', card.getAttribute('data-option') === val);
                card.querySelector('input').checked = (card.getAttribute('data-option') === val);
            });
            checklist.classList.toggle('hidden', val !== 'specific');
        };

        optionCards.forEach(card => {
            card.onclick = () => updateUI(card.getAttribute('data-option'));
        });

        updateUI(userData.pageSelection);

        const handleNext = () => renderStep(5);
        continueBtn.onclick = handleNext;
        step4Next.onclick = handleNext;
    };

    // Step 5: Script Installation
    const initStep5 = () => {
        dynamicFields.appendChild(tplStep5.content.cloneNode(true));
        const copyBtn = document.getElementById('copy-script-btn');
        const step5Next = document.getElementById('step-5-next');
        const step5Skip = document.getElementById('step-5-skip');
        const scriptCode = '<script src="https://cdn.wap-translate.com/widget.js" data-project="WP-782" async></script>';

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(scriptCode).then(() => {
                copyBtn.innerText = 'Copied!';
                setTimeout(() => copyBtn.innerText = 'Copy', 2000);
            });
        };

        const handleSkip = () => renderStep(6);
        skipBtn.style.display = 'inline-block';
        skipBtn.innerText = 'I’ll do this later';
        skipBtn.onclick = handleSkip;
        step5Skip.onclick = handleSkip;

        const handleNext = () => {
            navigator.clipboard.writeText(scriptCode);
            renderStep(6);
        };
        continueBtn.innerText = 'Copy Script & Continue';
        continueBtn.onclick = handleNext;
        step5Next.onclick = handleNext;
    };

    // Final Step: Success
    const initStepFinal = () => {
        dynamicFields.appendChild(tplStepFinal.content.cloneNode(true));
        continueBtn.style.display = 'none';
        skipBtn.style.display = 'none';
        
        document.getElementById('finish-go-project').onclick = () => {
            alert('Redirecting to your project dashboard...');
            closePanel();
        };
        
        document.getElementById('finish-copy-script').onclick = () => {
            const scriptCode = '<script src="https://cdn.wap-translate.com/widget.js" data-project="WP-782" async></script>';
            navigator.clipboard.writeText(scriptCode);
            alert('Script copied to clipboard!');
        };
    };

    // --- Global Controls ---
    backBtn.onclick = () => {
        if (currentStep > 1) renderStep(currentStep - 1);
    };

    skipBtn.onclick = () => {
        if (currentStep < 5) renderStep(currentStep + 1);
        else if (currentStep === 5) renderStep(6);
    };

    const openPanel = () => {
        panelOverlay.classList.add('active');
        assistantPanel.classList.add('open');
        if (currentStep === 1 && dynamicFields.children.length === 0) {
            renderStep(1);
        }
    };

    const closePanel = () => {
        panelOverlay.classList.remove('active');
        assistantPanel.classList.remove('open');
    };

    widgetTrigger.addEventListener('click', openPanel);
    closePanelBtn.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', closePanel);

    // Initial State
    openPanel();

});
