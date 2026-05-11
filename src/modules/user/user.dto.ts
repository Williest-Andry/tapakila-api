export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}
