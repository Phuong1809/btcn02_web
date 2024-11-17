
import pageHome from './home.js'


export default {
    data() {
        return {
            currentContent: "page-home",
        }
    },
  
    methods: {
        
        returnHome(){
            this.currentContent = 'page-home';
        }
    },
    components: {
       pageHome
    },
    template: 
    `
    <div >
        <component :is="currentContent"/>
    </div>
    `
}