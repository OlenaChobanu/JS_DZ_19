class Http {
    #API_url = 'http://nestapi-env.eba-9kgvuxij.eu-central-1.elasticbeanstalk.com/';
    
    constructor(){}

    getAll(url){
        return axios.get(this.#API_url + url).then(r => r.data);
    }

    create(url, item){
        return axios.post(this.#API_url + url, item).then(r => r.data);
    }

    update(url, id, item){
        return axios.put(this.#API_url + url + id, item).then(r => r);
    }

    delete(url, id){
        return axios.delete(this.#API_url + url + id). then(r => r.data);
    }
}