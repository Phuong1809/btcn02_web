import axios from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/esm/axios.min.js';

export default {
    methods: {
        async fetch(query) {
            const [type, className, pattern, params] = await this.parseQuery(query);
            const result = await this.getData(type, className, pattern, params);
            if (result) {
                return result;
            } else {
                throw new Error('no data');
            }
        },

        async parseQuery(query) {
            const [path, paramString] = query.split('?');
            const [type, className, pattern] = path.split('/');
            if (paramString != null) {
                const params = await this.parseParams(paramString);
                return [type, className, pattern, params];
            }
            return [type, className, pattern, {}];
        },

        async parseParams(paramString) {
            const params = {};
            paramString.split('&').forEach(param => {
                const [key, value] = param.split('=');
                params[key] = value || null;
            });
            return params;
        },

        async getData(type, className, pattern, params) {
            let url = `http://matuan.online:2422/api/${className}`;
            let perPage = 1;
            let page = 1;
            if ('per_page' in params) {
                perPage = params.per_page;
            }
            if ('page' in params) {
                page = params.page;
            }
            let startIndex = (page - 1) * perPage;
            let endIndex = perPage * page - 1;

            switch (type) {
                case 'search':
                    if ('search_type' in params) {
                        url += `?search_type=${params.search_type}&pattern=${pattern}`;
                    } else {
                        url += `?pattern=${pattern}`;
                    }
                    break;
                case 'get':
                    if (pattern == 'top-grossing') {
                        url = `http://matuan.online:2422/api/Top50Movies`;
                    } else {
                        url += `/${pattern}`;
                    }
                    break;
                case 'detail':
                    url += `/${pattern}`;
                    break;
                default:
                    console.error(`Invalid type: ${type}`);
                    return false;
            }

            try {
                console.log(`Fetching URL: ${url} with params:`, params);
                const response = await axios.default.get(url, { params });
                const data = response.data;
                const items = data.slice(startIndex, endIndex + 1);
                return {
                    [type]: className,
                    page: page,
                    per_page: perPage,
                    total_page: Math.ceil(data.length / perPage),
                    items: items
                };
            } catch (error) {
                console.error('Axios error:', error);
                return false;
            }
        },
    },
}