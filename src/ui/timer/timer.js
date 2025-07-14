import { LitElement, html, css } from 'lit';

class LinearTimer extends LitElement {
    static properties = {
        targetDate: { type: Object },
        targetTitle: { type: String },
        isCompact: { type: Boolean }
    };

    constructor() {
        super();
        this.targetDate = new Date();
        this.targetTitle = '';
        this.isCompact = false;
        this.hasPlayedSound = false;
        
        // Start countdown update
        this.updateCountdown();
        
        // Check window size
        this.checkWindowSize();
    }

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: rgba(255, 255, 255, 0.9);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: rgba(20, 20, 20, 0.98);
            padding: 20px;
            -webkit-app-region: drag;
        }

        * {
            box-sizing: border-box;
        }

        /* Countdown Display */
        .countdown-display {
            font-size: 72px;
            font-weight: 100;
            letter-spacing: -3px;
            margin: 20px 0;
            font-variant-numeric: tabular-nums;
            line-height: 1;
            opacity: 0.9;
        }

        /* Input Container */
        .input-container {
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .target-title-input {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 20px;
            font-weight: 300;
            text-align: center;
            outline: none;
            width: calc(100% - 40px);
            padding: 0 8px;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
            -webkit-app-region: no-drag;
        }

        .target-title-input:hover {
            border-bottom-color: rgba(255, 255, 255, 0.2);
        }

        .target-title-input:focus {
            border-bottom-color: rgba(255, 255, 255, 0.4);
            color: rgba(255, 255, 255, 0.8);
        }

        .target-title-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }

        .date-input {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
            -webkit-app-region: no-drag;
        }
        

        .date-input:hover {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.7);
        }

    `;

    render() {
        return html`
            <!-- Countdown Display -->
            <div class="countdown-display">${this.getCountdown()}</div>

            <!-- Input Container -->
            <div class="input-container">
                <input 
                    type="text" 
                    class="target-title-input"
                    placeholder="타이머 이름..."
                    .value=${this.targetTitle}
                    @input=${e => this.targetTitle = e.target.value}
                >
                ${!this.isCompact ? html`
                    <input 
                        type="datetime-local"
                        class="date-input"
                        @change=${this.setTargetDate}
                        .value=${this.targetDate ? this.getDateTimeLocal(this.targetDate) : ''}
                    >
                ` : ''}
            </div>
        `;
    }

    getCountdown() {
        if (!this.targetDate) {
            return '0m 0s';
        }

        const now = new Date();
        const diff = this.targetDate - now;

        if (diff <= 0) {
            this.playCompletionSound();
            return 'Done!';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
            return `${days}d ${hours}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    }

    getDateTimeLocal(date) {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    }

    updateCountdown() {
        this.requestUpdate();
        // Update every second for better precision
        setTimeout(() => this.updateCountdown(), 1000);
    }

    setTargetDate(e) {
        this.targetDate = e.target.value ? new Date(e.target.value) : null;
        this.hasPlayedSound = false;
    }

    playCompletionSound() {
        if (!this.hasPlayedSound) {
            this.hasPlayedSound = true;
            
            // Create notification with sound
            if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification('Timer Complete! ⏰', {
                    body: this.targetTitle || 'Your timer has finished',
                    silent: false
                });
            } else if ('Notification' in window && Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        const notification = new Notification('Timer Complete! ⏰', {
                            body: this.targetTitle || 'Your timer has finished',
                            silent: false
                        });
                    }
                });
            }
            
            // Also play a simple tone as backup
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Play a pleasant two-tone chime
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.15); // E5
                
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
            } catch (e) {
                console.log('Audio playback failed:', e);
            }
        }
    }

    // Check window size
    checkWindowSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Hide date input if window is too small in either dimension
        this.isCompact = width < 280 || height < 200;
    }



    // Keyboard shortcuts
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
        window.addEventListener('resize', this.checkWindowSize.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.handleGlobalKeydown.bind(this));
        window.removeEventListener('resize', this.checkWindowSize.bind(this));
    }

    handleGlobalKeydown(e) {
        // New timer window
        if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
            e.preventDefault();
            window.electronAPI.createNewTimer();
            return;
        }

        // Show San Francisco time
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            window.electronAPI.createSFTimeWindow();
            return;
        }

        // Close window
        if (e.key === 'Escape') {
            window.electronAPI.closeWindow();
            return;
        }
    }

}

customElements.define('linear-timer', LinearTimer);