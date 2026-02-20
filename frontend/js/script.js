document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const charCounter = document.getElementById('char-counter');
    const convertBtn = document.getElementById('convert-btn');
    const outputArea = document.getElementById('output-area');
    const copyBtn = document.getElementById('copy-btn');
    const btnText = convertBtn.querySelector('.btn-text');
    const spinner = convertBtn.querySelector('.spinner');

    const MAX_CHARS = 500;
    const API_URL = '/api/convert';

    // 1. 글자 수 카운터 업데이트 및 초기화
    function updateCharCount() {
        const currentLength = textInput.value.length;
        charCounter.textContent = `${currentLength} / ${MAX_CHARS}`;
        
        if (currentLength >= MAX_CHARS) {
            charCounter.classList.add('text-red-500');
            charCounter.classList.remove('text-slate-400');
        } else {
            charCounter.classList.remove('text-red-500');
            charCounter.classList.add('text-slate-400');
        }
    }

    textInput.addEventListener('input', updateCharCount);
    updateCharCount();

    // 2. 변환 버튼 클릭 이벤트
    convertBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        const selectedTarget = document.querySelector('input[name="target"]:checked').value;

        if (!text) {
            alert("변환할 텍스트를 입력해주세요.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    target: selectedTarget,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            displayResult(data);

        } catch (error) {
            console.error("API Error:", error);
            displayError("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    });

    // 3. 복사 버튼 클릭 이벤트
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputArea.innerText.trim();
        const placeholderText = '입력한 내용이 여기에 변환되어 표시됩니다.';
        
        if (textToCopy && textToCopy !== placeholderText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = '복사하기';
                copyBtn.textContent = '복사 완료!';
                copyBtn.classList.replace('text-primary-600', 'text-green-600');
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.replace('text-green-600', 'text-primary-600');
                }, 2000);
            }).catch(err => {
                console.error('Copy failed', err);
            });
        }
    });
    
    // 로딩 상태 관리 함수
    function setLoading(isLoading) {
        if (isLoading) {
            convertBtn.disabled = true;
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            convertBtn.disabled = false;
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    // 결과 표시 함수
    function displayResult(data) {
        outputArea.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = data.converted_text;
        outputArea.appendChild(p);
        copyBtn.disabled = false;
    }

    // 오류 표시 함수
    function displayError(message) {
        outputArea.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'text-red-500 font-medium';
        p.textContent = message;
        outputArea.appendChild(p);
        copyBtn.disabled = true;
    }
});
