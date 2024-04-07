// tslint:disable-next-line:class-name
export class nzTableHelper {
  defaultPageOptions = [5, 10, 20, 30, 50, 100];
  // defaultSkipCount = 0;
  // defaultMaxResultCount = 5;
  pageIndex = 1;
  pageSize = 10;
  sorting: string = null;
  // sortValue: string | null = null;
  // sortKey: string | null = null;

  totalCount = 0;
  items: any[] = [];
  loading = false;

  getSort(sort: { key: string; value: string }) {
    if (sort.value === 'ascend') {
      this.sorting = sort.key + ' asc';
    } else if (sort.value === 'descend') {
      this.sorting = sort.key + ' desc';
    } else {
      this.sorting = null;
    }

  }

  getSkipCount(): number {
    return (this.pageIndex - 1) * this.pageSize;
  }

  getMaxResultCount(): number {
    return this.pageSize;
  }

  shouldResetPaging(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
  }


}
