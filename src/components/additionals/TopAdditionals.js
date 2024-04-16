class TopAdditionals extends HTMLElement {
    constructor() {
        super();

        const component = function(){
            return {
                data: {},
                text: '0',

                init(){
                    this.addHookEvents();
                },

                claculateScore(){
                    if (!this.data.words_pares) { return; }
                    
                },

                addHookEvents(){
                    let self = this;
                    window.addEventListener('app-updated', function(e) {
                        if (e.detail && e.detail.data) {
                            self.data = e.detail.data;
                            self.claculateScore();
                        }
                    });
                }
            }
        }

        this.innerHTML = /*html*/`
            <div class="top_additionals" x-data="${component}">
                <div style="display: flex; flex-direction:row; gap:5px; align-items:center;">
                    <span>⚔️ Level:</span>
                    <span x-text="text"></span>
                </div>
            </div>
            
        `;
    }
}
$tv.setComponent(TopAdditionals);