export interface ICreateUserRequest {
  name: string;
  email: string;
  age: number;
  password: string;
  image: Express.Multer.File;
}
