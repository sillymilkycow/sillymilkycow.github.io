$tv.setComponent(
    class MainPage extends HTMLElement {
        constructor() {
            super();

            // const content = this.innerHTML;
    
            const component = function(){
                return {
                    currentInput: '',
                    alert: '',
                    data: {
                        words_pares: []
                    },

                    init(){
                        this.addHookEvents();
                    },

                    handleEnter(){

                        function handleSpaces(str){
                            return str.replace(/\s+/g, ' ');
                        }

                        this.currentInput = this.currentInput.trim();
                        if ( !this.currentInput ) { return; }

                        let difLangStr = this.currentInput.trim().split('+++');

                        if (difLangStr.length<2) {
                            this.alert = 'Пример строки<b>+++</b>Exaple string'
                            setTimeout(()=>{
                                this.alert = '';
                            }, 3000);
                            return;
                        }

                        let myLang = difLangStr.length > 1 ? difLangStr[1].trim() : '';
                            difLangStr = difLangStr[0].trim();
                        let curDate = new Date();
                            curDate = curDate.getFullYear()+'-'+(curDate.getMonth()+1)+'-'+curDate.getDate();

                        this.data.words_pares.push(
                            { translate: handleSpaces(difLangStr), lang: handleSpaces(myLang), date: curDate }
                        );

                        this.clearInput();
                        this.callUpdate();
                    },

                    clearInput(){
                        this.currentInput = '';
                    },

                    callUpdate(){
                        let self = this;
                        window.dispatchEvent( new CustomEvent( 'data-save-storage', { detail: { data: self.data } } ) );
                    },

                    addHookEvents(){
                        let self = this;
                        window.addEventListener('app-updated', function(e){
                            if (e.detail && e.detail.data) {
                                self.data = { ...self.data, ...e.detail.data };
                            }
                        });
                    }
                }
            }
            
            this.innerHTML = /*html*/`
                <div x-data="${component}">
                    <h2>Abstract</h2>
                    <template x-if="alert">
                        <div style="color:#f00; position:relative; z-index:10; background-color:#faa; padding:10px;" 
                             x-html="'ENTER: '+alert"></div>
                    </template>
                    <div class="abstract_input_field">
                        <input @keyup.enter="handleEnter()" 
                               x-model="currentInput"
                               type="text"
                               placeholder="Enter 'Translation +++ Fraze' and press Enter"
                               style="margin-bottom:0px;"
                        />
                    </div>
                    <button style="width:100%;" @click="handleEnter()">Save</button>
                </div>
            `;
        }
    }
);