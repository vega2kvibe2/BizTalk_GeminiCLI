// app.js
const API_BASE = window.location.origin; // 로컬 테스트 및 배포 시 동일 도메인 사용

document.addEventListener('DOMContentLoaded', () => {
    const targetButtons = document.querySelectorAll('.target-btn');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const loadingDiv = document.getElementById('loading');

    // 1. 수신 대상 버튼 클릭 이벤트
    targetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 모든 버튼에서 활성화 클래스 제거
            targetButtons.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'border-primary');
                b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
            });
            // 클릭된 버튼에 활성화 클래스 추가
            btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
            btn.classList.add('bg-primary', 'text-white', 'border-primary');
        });
    });

    // 2. 변환하기 버튼 클릭 이벤트
    convertBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        const activeBtn = document.querySelector('.target-btn.bg-primary');
        const target = activeBtn ? activeBtn.dataset.target : null;

        if (!text) {
            alert('변환할 내용을 입력해주세요.');
            inputText.focus();
            return;
        }

        if (!target) {
            alert('수신 대상을 선택해주세요.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    target_audience: target
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || '변환 중 오류가 발생했습니다.');
            }

            const data = await response.json();
            outputText.value = data.converted_text;
        } catch (error) {
            console.error('Error:', error);
            alert(`오류: ${error.message}`);
        } finally {
            setLoading(false);
        }
    });

    // 3. 복사하기 버튼 클릭 이벤트
    copyBtn.addEventListener('click', () => {
        const text = outputText.value;
        if (!text) {
            alert('복사할 내용이 없습니다.');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span>✅</span> 복사 완료!';
            copyBtn.classList.remove('bg-emerald-500', 'hover:bg-emerald-600');
            copyBtn.classList.add('bg-blue-600');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('bg-blue-600');
                copyBtn.classList.add('bg-emerald-500', 'hover:bg-emerald-600');
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('복사에 실패했습니다.');
        });
    });

    // 로딩 상태 설정 함수
    function setLoading(isLoading) {
        if (isLoading) {
            loadingDiv.classList.remove('hidden');
            loadingDiv.style.display = 'flex';
            convertBtn.disabled = true;
            outputText.value = '';
        } else {
            loadingDiv.classList.add('hidden');
            loadingDiv.style.display = 'none';
            convertBtn.disabled = false;
        }
    }
});
