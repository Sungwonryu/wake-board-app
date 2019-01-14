import { DataLoadService } from './data-load.service';

export function Preloader(dataLoadService: DataLoadService) {
  // this factory needs to return a function which returns a promise
  return () => dataLoadService.loadAll();
};
