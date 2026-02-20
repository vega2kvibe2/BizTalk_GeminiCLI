document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const charCounter = document.getElementById('char-counter');
    const convertBtn = document.getElementById('convert-btn');
    const outputArea = document.getElementById('output-area');
    const copyBtn = document.getElementById('copy-btn');
    const btnText = convertBtn.querySelector('span');
    const spinner = convertBtn.querySelector('.spinner');

    const MAX_CHARS = 500;
    const API_URL = '/api/convert'; // 이제 상대 경로로 API를 호출합니다.

    // 1. 글자 수 카운터 업데이트
    textInput.addEventListener('input', () => {
        const currentLength = textInput.value.length;
        charCounter.textContent = `${currentLength} / ${MAX_CHARS}`;
    });

    // 2. 변환 버튼 클릭 이벤트
    convertBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        const selectedTarget = document.querySelector('input[name="target"]:checked').value;

        if (!text) {
            alert("변환할 텍스트를 입력해주세요.");
            return;
        }

        // 로딩 상태 시작
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
            // 로딩 상태 종료
            setLoading(false);
        }
    });

    // 3. 복사 버튼 클릭 이벤트
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputArea.textContent;
        if (textToCopy && textToCopy !== '결과가 여기에 표시됩니다.') {
            navigator.clipboard.writeText(textToCopy).then(() => {
                // 복사 성공 피드백
                copyBtn.textContent = '복사 완료!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '복사하기';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Copy failed', err);
                alert('복사에 실패했습니다.');
            });
        }
    });
    
    // 로딩 상태 관리 함수
    function setLoading(isLoading) {
        if (isLoading) {
            convertBtn.disabled = true;
            btnText.style.display = 'none';
            spinner.style.display = 'block';
        } else {
            convertBtn.disabled = false;
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    }

    // 결과 표시 함수
    function displayResult(data) {
        outputArea.innerHTML = ''; // 이전 내용 삭제
        const p = document.createElement('p');
        p.textContent = data.converted_text;
        outputArea.appendChild(p);
        copyBtn.disabled = false;
    }

    // 오류 표시 함수
    function displayError(message) {
        outputArea.innerHTML = ''; // 이전 내용 삭제
        const p = document.createElement('p');
        p.className = 'error-message';
        p.style.color = 'var(--error-color)';
        p.textContent = message;
        outputArea.appendChild(p);
        copyBtn.disabled = true;
    }
});
