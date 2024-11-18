// Vue/filmDetail.js
import provider from '../Js/DBProvider.js'

export default {
    props: {
        targetFilm: {
            type: [String, Number],
            default: "default"
        },
        darkMode: Boolean
    },
    data() {
        return {
            film: {},
            hasData: false,
            errorMessage: '' // Thêm thông điệp lỗi
        }
    },
    methods: {
        async getData() {
            try {
                const query = `detail/Movies/${this.targetFilm}`;
                const response = await provider.methods.fetch(query);
                if (response && Array.isArray(response.items) && response.items.length > 0) {
                    this.film = response.items[0];
                    this.hasData = true;
                } else {
                    throw new Error('no data');
                }
            } catch (error) {
                console.error(error);
                this.hasData = false;
                this.errorMessage = 'Không tìm thấy dữ liệu phim.'; // Thông báo lỗi cho người dùng
            }
        },
        viewActorDetails(actor) {
            console.log('Emitting view-actor event for:', actor); // Debug log
            this.$emit('view-actor', actor);
        }
    },
    mounted() {
        this.getData();
    },
    template:
        `
    <div v-if="hasData" class="container py-4">
        <div class="row mb-4">
            <div class="col-md-6">
                <img :src="film.image" class="img-fluid rounded" :alt="film.title">
            </div>
            <div class="col-md-6">
                <h1 :class="{'text-light': darkMode}" class="mb-3">{{ film.title }} ({{ film.year }})</h1>
                <p><strong>Đạo diễn: </strong>
                    <span v-for="(director, index) in film.directorList" :key="director.id">
                        {{ director.name }}<span v-if="index < film.directorList.length - 1">, </span>
                    </span>
                </p>
                <p><strong>Thể loại: </strong>
                    <span v-for="(genre, index) in film.genreList" :key="genre.key">
                        {{ genre.value }}<span v-if="index < film.genreList.length - 1">, </span>
                    </span>
                </p>
                <p><strong>Tóm tắt: </strong> {{ film.plotFull }}</p>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-12">
                <h3 :class="{'text-light': darkMode}" class="mb-3">Diễn viên</h3>
                <div class="row">
                    <div class="col-md-3 mb-3" v-for="actor in film.actorList" :key="actor.id">
                        <div class="card h-100" @click="viewActorDetails(actor)">
                            <img :src="actor.image" class="card-img-top" :alt="actor.name">
                            <div class="card-body">
                                <h5 class="card-title">{{ actor.name }}</h5>
                                <p class="card-text">{{ actor.asCharacter }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Thêm các phần khác nếu cần, ví dụ: Reviews -->
    </div>
    <div v-else class="container py-4">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>
        <div v-else class="d-flex justify-content-center align-items-center" style="height: 300px;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    `
}