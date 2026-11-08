/* Exam strategy + quick-review content (Vietnamese) */
window.GUIDE = [
  {id:'g-time', h:'Phân bổ thời gian', b:[
    '60 câu / 120 phút = <b>2 phút/câu</b>. Đề CCAO-F chủ yếu là tình huống ngắn, không có code — thường dư thời gian.',
    'Vòng 1: làm hết, câu nào phân vân quá 2,5 phút thì chọn tạm + <b>đánh dấu</b>, đi tiếp.',
    'Vòng 2: quay lại câu đánh dấu. Còn ~10 phút cuối: chắc chắn không bỏ trống câu nào (bỏ trống = sai).'
  ]},
  {id:'g-read', h:'Đọc đề', b:[
    'Đọc <b>câu hỏi cuối</b> trước: "best first step", "most appropriate", "most likely cause", "Choose TWO".',
    'Gạch chân ràng buộc: khối lượng, chi phí, tốc độ, dữ liệu nhạy cảm, gửi ra ngoài, chính sách công ty.',
    'Xác định <b>vai trò</b> của bạn trong tình huống: Associate dùng Claude qua ứng dụng, không xây API/agent.',
    'Câu multiple response ghi rõ số đáp án — chọn đúng số lượng.'
  ]},
  {id:'g-elim', h:'Loại trừ phương án', b:[
    'Loại phương án <b>tuyệt đối</b>: "always", "never", "100% accurate", "replace the team", "remove human review".',
    'Loại phương án <b>lời dặn thay kiểm soát</b>: "tell Claude not to remember", "ask Claude if it is sure", "add a disclaimer".',
    'Loại phương án <b>quá tay</b>: cấm hẳn AI, dừng dự án, xóa mọi thứ — khi có kiểm soát hợp lý hơn.',
    'Loại phương án <b>đổi model</b> khi gốc rễ là thiếu dữ liệu/ngữ cảnh/định dạng.',
    'Loại phương án <b>đi tắt</b>: tài khoản cá nhân, connector/skill không rõ nguồn, đưa mật khẩu vào prompt.'
  ]},
  {id:'g-right', h:'Mẫu đáp án đúng hay gặp', b:[
    '<b>Kiểm chứng bằng nguồn gốc</b> (văn bản luật, dữ liệu gốc, trang chính thức) trước khi dùng output rủi ro cao.',
    '<b>Kiểm soát tỷ lệ với rủi ro</b>: rủi ro thấp đọc lướt; rủi ro cao có chuyên gia duyệt.',
    '<b>Cung cấp bối cảnh cụ thể</b> (người đọc, mục tiêu, ràng buộc, ví dụ) thay vì tính từ.',
    '<b>Chia bước</b> cho tác vụ lớn; duyệt kết quả trung gian.',
    '<b>Đúng công cụ đúng việc</b>: Project cho bối cảnh lặp lại, connector cho dữ liệu sống, Research cho thông tin mới có trích dẫn, skill cho quy trình đóng gói, Cowork cho việc nhiều bước.',
    '<b>Model đủ tốt rẻ nhất</b>: Haiku cho khối lượng lớn/đơn giản, Sonnet cân bằng, Opus+ cho phức tạp.',
    '<b>Tối thiểu hóa & ẩn danh dữ liệu</b>; dùng kênh tổ chức phê duyệt; hỏi compliance khi chính sách không rõ.',
    '<b>Escalate</b> việc vượt phạm vi (API, agent, tích hợp hệ thống lõi) cho Developer/Architect/IT.',
    '<b>Đổi một biến mỗi lần</b> khi tối ưu; thu phản hồi cụ thể.'
  ]},
  {id:'g-diligent', h:'Bẫy "nghe có vẻ cẩn thận"', b:[
    'Mỗi câu thường có một phương án nghe chu đáo nhưng <b>không kiểm soát rủi ro thật</b>:',
    '— "Đọc lại kỹ toàn bộ" (nhưng không đối chiếu nguồn).',
    '— "Thêm disclaimer AI" (nhưng nội dung vẫn sai).',
    '— "Dặn Claude giữ bí mật" (nhưng dữ liệu đã vào).',
    '— "Hỏi lại Claude có chắc không" (không phải kiểm chứng độc lập).',
    'Hãy hỏi: phương án này có thực sự <b>ngăn</b> lỗi/rủi ro xảy ra không?'
  ]},
  {id:'g-map', h:'Bản đồ domain → số câu ước tính', b:[
    'D1 Prompting 14% ≈ 8 câu · D2 Output Evaluation 21% ≈ 13 câu · D3 Product & Model 12% ≈ 7 câu',
    'D4 Workflow 16% ≈ 10 câu · D5 Configuration 12% ≈ 7 câu · D6 Governance 15% ≈ 9 câu · D7 Troubleshooting 10% ≈ 6 câu',
    'D2 + D4 + D6 = 52% — phần lớn đề là <b>phán đoán</b>, không phải kỹ thuật.'
  ]},
  {id:'g-hands', h:'Thực hành trước khi thi', b:[
    'Tạo một Project thật: instructions + knowledge; thử thay file cũ/mới và xem output thay đổi.',
    'Bật/tắt memory, thử Incognito, xem Settings → memory; tắt "Use account memory" trong project.',
    'Chạy Research cho một câu hỏi thị trường và kiểm từng nguồn trích dẫn.',
    'Thử cùng một tác vụ trên Haiku / Sonnet / Opus, so tốc độ và chất lượng.',
    'Kết nối một connector (Drive/Gmail/Calendar) và thử Cowork với chế độ Manual.',
    'Bật một skill có sẵn (Excel/Word/PowerPoint), đọc cách nó hoạt động.'
  ]},
  {id:'g-day', h:'Ngày thi', b:[
    'Thi qua Pearson VUE (online hoặc test center), closed-book. Kiểm tra máy/phòng trước nếu thi online.',
    'Không có điểm trừ khi đoán — trả lời mọi câu.',
    'Điểm đạt 720/1000 (thang quy đổi). Luyện tới khi thi thử đầy đủ ổn định ≥ 80% để có biên an toàn.'
  ]}
];

window.REVIEW = [
  {h:'Thông số đề', rows:[
    ['Mã', 'CCAO-F · Claude Certified Associate – Foundations'],
    ['Đề', '60 câu, 120 phút, MC + multiple response'],
    ['Đạt', '720 / 1000'],
    ['Phí / hiệu lực', 'USD 99 · 12 tháng'],
    ['Cập nhật đề', 'Guide mới 17/11/2026 · đề mới 07/12/2026']
  ]},
  {h:'Tầng model', rows:[
    ['Haiku', 'Nhanh, rẻ nhất · khối lượng lớn: phân loại, trích xuất, định tuyến'],
    ['Sonnet', 'Cân bằng tốc độ–trí tuệ · việc hằng ngày'],
    ['Opus', 'Việc phức tạp, nhiều bước, công việc tri thức dài'],
    ['Fable', 'Suy luận rất khó, tác vụ dài · chậm & đắt nhất'],
    ['Nguyên tắc', 'Model đủ tốt rẻ nhất · thử trên mẫu trước khi đổi']
  ]},
  {h:'Đặt thông tin ở đâu?', rows:[
    ['Prompt', 'Chi tiết riêng của lần này'],
    ['Project instructions', 'Quy tắc hành vi luôn áp dụng: vai trò, giọng, định dạng'],
    ['Project knowledge', 'Tài liệu tham chiếu ổn định: chính sách, mẫu, sổ tay'],
    ['Connector', 'Dữ liệu sống ở hệ thống gốc: Drive, Gmail, Calendar, CRM'],
    ['Skill', 'Quy trình đóng gói dùng lại nhiều nơi; owner có thể cấp toàn tổ chức'],
    ['Memory', 'Sở thích/bối cảnh cá nhân giữa các chat']
  ]},
  {h:'Tính năng nhanh', rows:[
    ['Research', 'Nhiều lượt tìm nối tiếp, có trích nguồn · cần web search · gói trả phí'],
    ['Artifact', 'Nội dung độc lập, dài, chỉnh lặp lại, chia sẻ'],
    ['Cowork', 'Agentic cho việc không code · Manual / Auto / Skip · /schedule'],
    ['Connector quyền', 'Always allow · Needs approval · Blocked'],
    ['Incognito', 'Không lưu lịch sử/memory · vẫn theo chính sách tổ chức (Team/Ent)'],
    ['Project sharing', 'Can view (xem & chat) · Can edit (sửa, quản lý thành viên)'],
    ['RAG', 'Project tự bật khi knowledge gần vượt context (gói trả phí, ~10x)']
  ]},
  {h:'Memory', rows:[
    ['Mặc định', 'Bật ở Free/Pro/Max · Team/Ent: owner bật, thành viên tự opt-in'],
    ['Nhạy cảm', 'Sức khỏe/chính trị/tôn giáo: chỉ khi opt-in · ID, số TK tài chính: không bao giờ'],
    ['Project', 'Memory riêng từng project · tắt "Use account memory" để cô lập'],
    ['Pause / Reset', 'Pause: giữ, ngừng dùng · Reset: xóa vĩnh viễn tất cả'],
    ['Xóa chat', 'Không xóa memory đã sinh ra — xóa riêng']
  ]},
  {h:'Kiểm chứng output', rows:[
    ['Nguy cơ cao', 'Số liệu, trích dẫn luật, URL, tên, ngày, trích nguyên văn'],
    ['Kiểm thế nào', 'Đối chiếu nguồn gốc độc lập, không chỉ hỏi lại Claude'],
    ['Người duyệt', 'Pháp lý, tài chính, y tế, ảnh hưởng con người, gửi ra ngoài'],
    ['Định dạng', 'Inline: nhanh · Artifact: dài/chia sẻ · Có cấu trúc: nhập hệ thống']
  ]},
  {h:'Governance', rows:[
    ['Kiểm soát mạnh', 'Ẩn danh trước · tối thiểu dữ liệu · kênh tổ chức phê duyệt'],
    ['Kiểm soát yếu', 'Lời dặn trong prompt · incognito · disclaimer'],
    ['Không rõ chính sách', 'Hỏi compliance/bảo mật/pháp chế trước'],
    ['Skill/connector lạ', 'Chỉ nguồn tin cậy · đọc file/script · rủi ro injection & rò rỉ'],
    ['Trách nhiệm', 'Người gửi nội dung chịu trách nhiệm']
  ]}
];
