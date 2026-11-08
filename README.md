# CCAO-F Drill

Web luyện thi **Claude Certified Associate – Foundations (CCAO-F)**. Web tĩnh, không cần build.

## Chạy
- Mở thẳng `index.html` bằng trình duyệt, hoặc
- `cd ~/Documents/CCAO-F_Drill && python3 -m http.server 8000` → http://localhost:8000

## Tính năng
- Thi thử đầy đủ 60 câu / 120 phút, phân bổ câu theo trọng số 7 domain; thi nhanh 20 câu / 40 phút
- Luyện theo domain, câu khó, câu chọn nhiều đáp án, có giải thích ngay
- Chọn mức tự tin (chắc chắn / đang đoán) → tìm ra câu "sai dù chắc chắn"
- Sổ câu sai: câu sai tự lưu, làm đúng lại thì chuyển sang mục đã khắc phục
- Kiến thức theo domain, thẻ ghi nhớ, chiến thuật làm bài, trang ôn nhanh in được
- Có giao diện sáng/tối, dùng tốt trên điện thoại. Tiến độ lưu trong localStorage của trình duyệt.

## Cấu trúc
- `data/domains.js`: blueprint, ghi chú, thẻ ghi nhớ
- `data/q-*.js`: ngân hàng câu hỏi. Mỗi câu gồm `{id, d, q, o, a, e, h}`; `a` là mảng index đáp án đúng
- `data/guide.js`: chiến thuật + cheat sheet
- `js/app.js`, `css/style.css`

## Lưu ý
Câu hỏi do người soạn tự viết, không phải đề thật, và dự án không liên kết với Anthropic.
Nội dung theo exam guide v1.0 và tài liệu Anthropic tính tới 10/2026.
Anthropic cập nhật đề ngày 07/12/2026 (guide mới dự kiến 17/11/2026), nên cần đối chiếu và cập nhật khi guide mới ra.
