import { store } from './Store';

class Auth {
    constructor() {
        this.testAuth = store.getState();
        // let a = store.subscribe(function () {
        //     this.testAuth = store.getState();
        // })
        this.authentication = false;
    }

    getAuth = () => {
        this.testAuth = store.getState().user;
        return this.testAuth;
    }
}

export default new Auth();
