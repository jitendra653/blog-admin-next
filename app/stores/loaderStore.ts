import { makeAutoObservable } from "mobx";

class LoaderStore {
  isLoading: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
  show() {
    this.isLoading = true;
  }
  hide() {
    this.isLoading = false;
  }
}
const loaderStore = new LoaderStore();
export default loaderStore;