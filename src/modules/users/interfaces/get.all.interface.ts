export enum sortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum sortField {
  id = 'id',
  createdAt = 'createdAt',
}

export interface IGetALlUsersRequest {
  page: number;
  limit: number;
  sortOrder: sortOrder;
  sorrtField: sortField;
}
