// Vue/actorDetail.js

export default {
    props: {
        actor: {
            type: Object,
            required: true
        },
        darkMode: Boolean
    },
    methods: {
        /**
         * Emit the 'back' event to return to the previous view.
         */
        goBack() {
            this.$emit('back');
        }
    },
    template: `
    <div class="container py-4">
        <button @click="goBack" class="btn btn-secondary mb-3">
            <i class="fas fa-arrow-left"></i>
        </button>
        <div class="row">
            <div class="col-md-4">
                <img :src="actor.image" class="img-fluid rounded" :alt="actor.name">
            </div>
            <div class="col-md-8">
                <h1 :class="{'text-light': darkMode}" class="mb-3">{{ actor.name }}</h1>
                <p><strong>Character:</strong> {{ actor.asCharacter }}</p>
                
                <!-- Thêm các thông tin khác nếu có -->
                <!-- Ví dụ: -->
                <!-- <p v-if="actor.birthDate"><strong>Birth Date:</strong> {{ actor.birthDate }}</p> -->
                <!-- <p v-if="actor.bio"><strong>Biography:</strong> {{ actor.bio }}</p> -->
            </div>
        </div>
    </div>
    `
}