export interface UserType {
  id: string;
  name: string;
  role: "admin" | "user" | string;
  // add more fields if needed, e.g. email, token etc.
}
