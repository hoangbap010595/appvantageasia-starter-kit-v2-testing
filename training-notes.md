# training-notes.md

## Project Structure Overview

### Key Directories

- **apps/**: Chứa các ứng dụng chính (frontend/backend). Ví dụ: `apps/backend`, `apps/console`.
- **packages/**: Chứa các thư viện dùng chung và service core. Ví dụ: `core-auth`, `core-broker`, `core-bull`.
- **services/**: Chứa các backend service riêng biệt, mỗi service có thể phục vụ một domain hoặc chức năng cụ thể.

### Architectural Patterns

- **Monorepo với packages**: Tách biệt các domain và chức năng thành từng package, dễ mở rộng và bảo trì.
- **Separation of Concerns**: Mỗi module/component có trách nhiệm rõ ràng, tránh phụ thuộc lẫn nhau.
- **Service Pattern**: Đặc biệt cho authentication và các service quan trọng, đảm bảo tính module hóa.
- **Async/Await**: Được sử dụng nhất quán cho các thao tác với database và service.
- **MongoDB với Typed Interfaces**: Đảm bảo type safety cho dữ liệu, dùng ObjectId cho định danh.
- **Migrations**: Thay đổi schema đều được quản lý qua migration với phương thức `up`.

### Coding Standards & Guidelines

- **Export default** cho function/class chính, **export named** cho type/interface.
- **Comment đầy đủ** cho function, class, interface, giải thích logic phức tạp và business logic.
- **Document hóa tham số, kiểu trả về, magic number, thuật toán phức tạp.**
- **React Best Practices**: Component nhỏ, hooks hợp lý, tách business logic khỏi UI, chú trọng accessibility.
- **Database Patterns**: Indexing cho hiệu năng, version hóa document, migration cho thay đổi schema.

### Development Workflow

- **CI/CD với Github Actions**: Tự động kiểm tra, build, lint, test, release.
- **Semantic Release**: Tự động release, upload source maps, push Docker image.
- **Devtools**: Có các lệnh build, lint, kiểm tra commit, upload report, ... hỗ trợ phát triển.

### Setup Instructions (theo README)

- Cài đặt dependencies: `yarn install`
- Build project: `yarn build`
- Chạy ứng dụng: `yarn start` hoặc theo hướng dẫn từng app/service
- Kiểm tra test: `yarn test`
- Các lệnh devtools hỗ trợ kiểm tra, build, release

## Summary

Dự án tuân thủ các best practice về modular hóa, separation of concerns, documentation, CI/CD, và tối ưu hiệu năng/bảo mật. Các guideline và workflow rõ ràng giúp dễ dàng mở rộng, bảo trì và phát triển các domain mới.
