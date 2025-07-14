import { LitElement, html, css } from 'lit';

class SFTime extends LitElement {
    constructor() {
        super();
        this.updateTime();
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
            padding: 0;
            -webkit-app-region: drag;
        }

        * {
            box-sizing: border-box;
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }

        .time-display {
            font-size: 72px;
            font-weight: 100;
            letter-spacing: -3px;
            font-variant-numeric: tabular-nums;
            line-height: 1;
            opacity: 0.9;
        }

        .location-input {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 20px;
            font-weight: 300;
            text-align: center;
            outline: none;
            width: 200px;
            padding: 0 8px;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
            -webkit-app-region: no-drag;
        }

        .location-input:hover {
            border-bottom-color: rgba(255, 255, 255, 0.2);
        }

        .location-input:focus {
            border-bottom-color: rgba(255, 255, 255, 0.4);
            color: rgba(255, 255, 255, 0.8);
        }
    `;

    render() {
        return html`
            <div class="container">
                <div class="time-display">${this.getSFTime()}</div>
                <input 
                    type="text" 
                    class="location-input"
                    value="San Francisco"
                    readonly
                >
            </div>
        `;
    }

    getSFTime() {
        const sfTime = new Date().toLocaleTimeString('en-US', {
            timeZone: 'America/Los_Angeles',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return sfTime;
    }

    updateTime() {
        this.requestUpdate();
        setTimeout(() => this.updateTime(), 60000); // Update every minute since we don't show seconds
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.handleKeydown.bind(this));
    }

    handleKeydown(e) {
        if (e.key === 'Escape') {
            window.electronAPI.closeWindow();
        }
    }
}

customElements.define('sf-time', SFTime);