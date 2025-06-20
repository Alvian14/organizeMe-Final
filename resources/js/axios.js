import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000'; // Ganti sesuai URL backend kamu
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default axios;
