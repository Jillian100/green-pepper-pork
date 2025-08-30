// 青椒香肉食譜 - 抖音風格滑動播放系統

class RecipePlayer {
    constructor() {
        this.currentStep = 0;
        this.videos = [];
        this.steps = [];
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        // 獲取所有影片和步驟元素
        this.videos = document.querySelectorAll('.video-container video');
        this.steps = document.querySelectorAll('.recipe-step');
        
        // 初始化影片
        this.initializeVideos();
        
        // 綁定事件
        this.bindEvents();
        
        // 設置初始狀態
        this.updateCurrentStep();
        
        console.log('青椒香肉食譜播放器已初始化');
    }
    
    initializeVideos() {
        this.videos.forEach((video, index) => {
            // 設置影片屬性
            video.muted = true; // 預設靜音
            video.loop = true;
            video.playsInline = true;
            video.preload = 'metadata';
            
            // 添加載入事件
            video.addEventListener('loadedmetadata', () => {
                video.parentElement.classList.add('loaded');
            });
            
            // 添加錯誤處理
            video.addEventListener('error', (e) => {
                console.error(`影片 ${index + 1} 載入失敗:`, e);
                this.showVideoError(index);
            });
            
            // 添加點擊事件來切換靜音狀態
            video.addEventListener('click', () => {
                this.toggleVideoMute(video);
            });
            
            // 添加播放狀態指示器
            video.addEventListener('play', () => {
                video.parentElement.classList.add('playing');
            });
            
            video.addEventListener('pause', () => {
                video.parentElement.classList.remove('playing');
            });
        });
    }
    
    bindEvents() {
        // 滾動事件
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // 觸控事件（移動設備）
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            this.handleTouchSwipe(touchStartY, touchEndY);
        });
        
        // 鍵盤事件
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // 視窗大小改變事件
        window.addEventListener('resize', () => {
            this.debounce(() => {
                this.updateCurrentStep();
            }, 250);
        });
    }
    
    handleScroll() {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        
        // 清除之前的定時器
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // 設置新的定時器
        this.scrollTimeout = setTimeout(() => {
            this.updateCurrentStep();
            this.isScrolling = false;
        }, 100);
    }
    
    handleTouchSwipe(startY, endY) {
        const threshold = 50;
        const diff = startY - endY;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // 向上滑動，下一頁
                this.nextStep();
            } else {
                // 向下滑動，上一頁
                this.previousStep();
            }
        }
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.previousStep();
                break;
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                this.nextStep();
                break;
            case 'Home':
                e.preventDefault();
                this.goToStep(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToStep(this.steps.length - 1);
                break;
        }
    }
    
    updateCurrentStep() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let newStep = 0;
        
        this.steps.forEach((step, index) => {
            const stepTop = step.offsetTop;
            const stepBottom = stepTop + step.offsetHeight;
            
            if (scrollPosition >= stepTop && scrollPosition < stepBottom) {
                newStep = index;
            }
        });
        
        if (newStep !== this.currentStep) {
            this.currentStep = newStep;
            this.playCurrentVideo();
        }
    }
    
    playCurrentVideo() {
        // 暫停所有影片
        this.videos.forEach((video, index) => {
            if (index !== this.currentStep) {
                video.pause();
                video.currentTime = 0;
            }
        });
        
        // 播放當前影片
        const currentVideo = this.videos[this.currentStep];
        if (currentVideo && currentVideo.readyState >= 2) {
            currentVideo.play().catch(e => {
                console.log('自動播放失敗，需要用戶互動:', e);
            });
        }
        
        // 更新UI狀態
        this.updateStepIndicator();
        
        console.log(`切換到步驟 ${this.currentStep + 1}`);
    }
    
    updateStepIndicator() {
        // 移除所有活動狀態
        this.steps.forEach(step => {
            step.classList.remove('active');
        });
        
        // 添加當前步驟的活動狀態
        if (this.steps[this.currentStep]) {
            this.steps[this.currentStep].classList.add('active');
        }
    }
    
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.goToStep(this.currentStep + 1);
        }
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.goToStep(this.currentStep - 1);
        }
    }
    
    goToStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.steps.length) {
            const targetStep = this.steps[stepIndex];
            const targetPosition = targetStep.offsetTop;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            this.currentStep = stepIndex;
            this.playCurrentVideo();
        }
    }
    
    toggleVideoMute(video) {
        video.muted = !video.muted;
        
        // 顯示靜音狀態提示
        this.showMuteStatus(video.muted);
        
        // 如果取消靜音，嘗試播放
        if (!video.muted && video.paused) {
            video.play().catch(e => {
                console.log('播放失敗:', e);
            });
        }
    }
    
    showMuteStatus(isMuted) {
        const status = document.createElement('div');
        status.className = 'mute-status';
        status.textContent = isMuted ? '🔇 已靜音' : '🔊 已開啟聲音';
        status.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(status);
        
        setTimeout(() => {
            status.remove();
        }, 2000);
    }
    
    showVideoError(index) {
        const videoContainer = this.videos[index].parentElement;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'video-error';
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <div>影片載入失敗</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">
                    步驟 ${index + 1}: ${this.steps[index].querySelector('.step-title').textContent}
                </div>
            </div>
        `;
        
        videoContainer.appendChild(errorDiv);
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 添加CSS動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
    
    .recipe-step.active {
        background: linear-gradient(135deg, #e3f2fd, #f3e5f5) !important;
        transform: scale(1.02);
        transition: all 0.3s ease;
    }
    
    .video-error {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
    }
    
    .mute-status {
        font-family: 'Noto Sans TC', sans-serif;
    }
`;
document.head.appendChild(style);

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    new RecipePlayer();
});

// 添加使用說明
console.log(`
🍳 青椒香肉食譜使用說明：

📱 觸控操作：
- 向上滑動：下一個步驟
- 向下滑動：上一個步驟

⌨️ 鍵盤操作：
- ↑ 或 PageUp：上一個步驟
- ↓ 或 PageDown：下一個步驟
- 空白鍵：下一個步驟
- Home：回到開始
- End：跳到最後

🖱️ 滑鼠操作：
- 滾動滑鼠滾輪瀏覽步驟
- 點擊影片切換靜音/有聲

🎬 影片功能：
- 滑到步驟時自動播放
- 點擊影片可切換聲音
- 離開步驟時自動暫停
`);
