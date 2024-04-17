class TopAdditionals extends HTMLElement {
    constructor() {
        super();

        const component = function(){
            let curDate = new Date();
            return {
                daysPower: 7,
                curDate: curDate,
                loaded: false,
                data: {},
                score: 0,
                level: 0,
                lastAbstract: 0,
                lastAssessment: 0,
                levels: [
                    { title: 'Newbie', icon: '🐣', score: 10 },
                    { title: 'Beginner', icon: '🐥', score: 30 },
                    { title: 'Hello-Goodbye', icon: '🐓', score: 60 },
                    { title: 'Where is a toilet', icon: '🐵', score: 100 },
                    { title: 'I can talk', icon: '🐨', score: 150 },
                    { title: 'Walky talky', icon: '🐯', score: 250 },
                ],

                init(){
                    this.addHookEvents();
                },

                sortByStrDate(data, field){
                    return data.sort( (a,b) => {
                        let compA = a[field] ? a[field] : 1;
                        let compB = b[field] ? b[field] : 0;
                        return new Date(compB) - new Date(compA);
                    });
                },

                countDaysDiff(from, to){
                    to = to ? to : this.curDate;
                    const lastDate = new Date(from);
                    let diffTime =  Math.abs(this.curDate - lastDate);
                    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    return diffDays;
                },

                claculateScore(){
                    if (!this.data.words_pares) { return; }
                    let daysPower = this.daysPower;
                    let self = this;
                    let data = this.data.words_pares;
                    data = this.sortByStrDate(data, 'date');
                    this.checkAbstractFillLastDate(data[0].date);
                    data = this.sortByStrDate(data, 'last_check');
                    this.checkAssessmentLastDate(data[0].last_check);

                    function returnMePowerDays(num){
                        return num > daysPower ? daysPower : num;
                    }

                    let allStrings = data.length;
                    let negatives = 0;
                    data.forEach( el => {
                        if (!el.average_score) { return; }
                        let days = returnMePowerDays(el.date ? this.countDaysDiff(el.date) : daysPower);
                        let assessmentDays = returnMePowerDays(el.last_check ? this.countDaysDiff(el.last_check) : daysPower);
                        days = days - assessmentDays;
                        days = days < 0 ? 0 : days;
                        let elScore = el.average_score * days;
                        // console.log(el.translate+' : '+elScore);
                        self.score += elScore;
                    });
                    this.calculateLevel();
                    this.loaded = true;
                },

                calculateLevel(){
                    let self = this;
                    let daysPower = this.daysPower;
                    this.levels.forEach( ( lvl, idx ) => {
                        let plank = lvl.score * daysPower * 4; /* 4 - max evaluation in assessment */
                        if ( self.score >= plank ) {
                            self.level = idx;
                        }
                    });
                },

                checkAssessmentLastDate(lastDateStr){
                    this.lastAssessment = this.countDaysDiff(lastDateStr);
                },

                checkAbstractFillLastDate(lastDateStr){
                    this.lastAbstract = this.countDaysDiff(lastDateStr);
                },

                addHookEvents(){
                    let self = this;
                    window.addEventListener('app-updated', function(e) {
                        if (!self.loaded && e.detail && e.detail.data) {
                            self.data = e.detail.data;
                            self.claculateScore();
                        }
                    });
                }
            }
        }

        this.innerHTML = /*html*/`
            <div x-data="${component}">
                <template x-if="loaded">
                    <div class="top_additionals_block">
                        <div class="top_additionals" x-bind:title="levels[level].title">
                            <div class="t-a_row">
                                <span>Level:</span>
                                <span x-text="level"></span>
                            </div>
                            <div class="t-a_row">
                                <span>Score:</span>
                                <span x-text="score"></span>
                            </div>
                            <div class="t-a_row">
                                <span>Last abstract fill:</span>
                                <span x-text="lastAbstract+' day'+(lastAbstract!==1?'s':'')+' ago'"></span>
                            </div>
                            <div class="t-a_row">
                                <span>Last assessment:</span>
                                <span x-text="lastAssessment+' day'+(lastAssessment!==1?'s':'')+' ago'"></span>
                            </div>
                        </div>
                        <span class="row-icon" x-text="levels[level].icon"></span>
                    </div>
                </template>     
            </div>       
        `;
    }
}
$tv.setComponent(TopAdditionals);