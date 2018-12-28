import { DataLoadService } from './data-load.service';

export function Preloader(
  dataLoadService: DataLoadService
) {

  const promiseList: any[] = [
    ...dataLoadService.loadAll()
  ];

  return new Promise((resolve) => {
    Promise.all(promiseList).then(() => {
      console.log('Preloader() finishes all promises - all data are stored in localStorage');
      resolve();
    });
  });
}
