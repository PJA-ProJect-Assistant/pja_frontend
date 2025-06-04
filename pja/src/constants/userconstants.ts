import type { users } from "../types/user";

export const Users: users = {
  user_id: 1,
  email: "alice@example.com",
  password: "hashed_password_1", // 실제 사용 시에는 해시된 비밀번호여야 합니다
  uid: "uid_abc123", //일반 아이디
  name: "Alice Kim",
  // profile_image: "https://example.com/profiles/alice.png",
};

export const Members: users[] = [
  {
    user_id: 1,
    email: "alice@example.com",
    password: "hashed_password_1", // 실제 사용 시에는 해시된 비밀번호여야 합니다
    uid: "uid_abc123", //일반 아이디
    name: "Alice Kim",
  },
  {
    user_id: 2,
    email: "bob@example.com",
    password: "hashed_password_2",
    uid: "uid_def456",
    name: "Bob Lee",
    profile_image: "",
  },
  {
    user_id: 3,
    email: "charlie@example.com",
    password: "hashed_password_3",
    uid: "uid_ghi789",
    name: "Charlie Park",
    // profile_image 생략됨 (옵셔널)
  },
  {
    user_id: 4,
    email: "gildong@example.com",
    password: "hashed_password_2",
    uid: "uid_def456",
    name: "홍길동",
    profile_image: "",
  },
  {
    user_id: 5,
    email: "chaebin@example.com",
    password: "hashed_password_3",
    uid: "uid_ghi789",
    name: "정채빈",
  },
  {
    user_id: 6,
    email: "chaebin@example.com",
    password: "hashed_password_3",
    uid: "uid_ghi789",
    name: "이름진짜긺진짜로너무길어어어어어엉ㅇ",
  },
];
