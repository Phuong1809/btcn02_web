// Vue/parentComponent.js
import FilmDetail from './filmDetail.js'
import ActorDetail from './actorDetail.js'

export default {
    props: {
        darkMode: Boolean
    },
    data() {
        return {
            currentView: 'film',
            selectedActor: null
        }
    },
    methods: {
        viewActor(actor) {
            this.selectedActor = actor;
            this.currentView = 'actor';
        },
        viewFilm() {
            this.currentView = 'film';
            this.selectedActor = null;
        }
    },
    components: {
        FilmDetail,
        ActorDetail
    },
    template: `
    <div>
        <film-detail v-if="currentView === 'film'" @view-actor="viewActor"></film-detail>
        <actor-detail v-else :actor="selectedActor" @back="viewFilm"></actor-detail>
    </div>
    `
}