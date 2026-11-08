/* CCAO-F — Claude Certified Associate (Foundations)
   Domain blueprint + study notes. Weights from exam guide v1.0 (current as of Oct 2026).
   Anthropic will update exam content on 7 Dec 2026 (new guide due 17 Nov 2026) — re-check then. */
window.EXAM = {
  code: 'CCAO-F',
  name: 'Claude Certified Associate – Foundations',
  items: 60,
  minutes: 120,
  pass: 720,
  facts: [
    ['Số câu', '60 câu (multiple choice + multiple response, đề ghi rõ chọn mấy đáp án)'],
    ['Thời gian', '120 phút → trung bình 2 phút/câu'],
    ['Điểm đạt', '720 / 1000 (thang điểm quy đổi 100–1000)'],
    ['Lệ phí', 'USD 99 / lượt (đối tác Select/Preferred giảm 50%)'],
    ['Hình thức', 'Closed-book, có giám thị, qua Pearson VUE (online hoặc test center)'],
    ['Đăng ký', 'Anthropic Partner Academy, cần email tổ chức thuộc Claude Partner Network'],
    ['Hiệu lực', '12 tháng; gia hạn bằng bài đánh giá ngắn không giám thị'],
    ['Ngôn ngữ', 'Tiếng Anh, tiếng Nhật'],
    ['Đối tượng', 'Người dùng nghiệp vụ (ops, marketing, PM, giáo dục, truyền thông…), KHÔNG yêu cầu code'],
    ['Lưu ý', 'Anthropic cập nhật nội dung đề ngày 07/12/2026, guide mới dự kiến 17/11/2026']
  ]
};

window.DOMAINS = [
  {k:'PT', n:1, name:'Prompting and Task Execution', vi:'Viết prompt & thực thi tác vụ', w:14, color:'#2F7D5B'},
  {k:'OE', n:2, name:'Output Evaluation and Validation', vi:'Đánh giá & kiểm chứng output', w:21, color:'#C2410C'},
  {k:'PS', n:3, name:'Product and Model Selection', vi:'Chọn sản phẩm & model', w:12, color:'#2563EB'},
  {k:'WI', n:4, name:'Workflow Integration and Solution Design', vi:'Tích hợp quy trình & thiết kế giải pháp', w:16, color:'#7C3AED'},
  {k:'CK', n:5, name:'Configuration and Knowledge Management', vi:'Cấu hình & quản lý tri thức', w:12, color:'#0E7490'},
  {k:'GR', n:6, name:'Governance, Risk, and Responsible Use', vi:'Quản trị, rủi ro & sử dụng có trách nhiệm', w:15, color:'#B91C1C'},
  {k:'TO', n:7, name:'Troubleshooting and Optimization', vi:'Xử lý sự cố & tối ưu', w:10, color:'#A16207'}
];

window.NOTES = {

PT: {
intro: `Domain kiểm tra bạn có biến một yêu cầu công việc mơ hồ thành prompt rõ ràng, chia việc lớn thành bước nhỏ và lặp lại cho tới khi output dùng được. Đề hầu như không hỏi "mẹo prompt" kỹ thuật, mà hỏi: trong tình huống này, thêm gì vào prompt sẽ cải thiện kết quả nhiều nhất?`,
objectives: [
  'Viết prompt cho tác vụ nghiệp vụ: mục tiêu, bối cảnh, đối tượng đọc, ràng buộc, định dạng.',
  'Chia yêu cầu lớn thành chuỗi bước (prompt chaining) và kiểm tra giữa các bước.',
  'Lặp (iterate) khi output yếu: thêm ngữ cảnh, ví dụ, tiêu chí; tách nhỏ; đổi cách hỏi.',
  'Điều chỉnh cách làm theo loại tác vụ: phân tích, nghiên cứu, soạn thảo, brainstorm.'
],
sections: [
  {h:'Cấu trúc một prompt tốt', b:[
    '<b>Mục tiêu</b>: output dùng để làm gì, ai đọc. "Viết email" kém hơn "Viết email cho khách hàng doanh nghiệp đang bực vì giao trễ, mục tiêu giữ hợp đồng".',
    '<b>Bối cảnh</b>: Claude không biết công ty, khách hàng, lịch sử dự án của bạn trừ khi bạn đưa vào (hoặc Project/connector cung cấp).',
    '<b>Ràng buộc</b>: độ dài, giọng văn, thuật ngữ cấm/bắt buộc, thời hạn, chính sách.',
    '<b>Định dạng</b>: bảng, bullet, JSON, mục có tiêu đề… Nói rõ thay vì hy vọng.',
    '<b>Ví dụ</b> (few-shot): 1–3 mẫu tốt giúp khớp giọng văn/định dạng nhanh hơn mô tả dài.',
    '<b>Tiêu chí thành công</b>: "đạt khi có đủ 3 phương án, mỗi cái có ước tính chi phí".',
    'Đặt tài liệu dài lên trước, câu hỏi/chỉ dẫn ở cuối; dùng thẻ hoặc tiêu đề để tách tài liệu khỏi chỉ dẫn.'
  ]},
  {h:'Chia nhỏ & chuỗi bước', b:[
    'Tác vụ nhiều giai đoạn (nghiên cứu → dàn ý → nháp → chỉnh) cho kết quả tốt hơn khi làm từng bước và duyệt giữa các bước.',
    'Mỗi bước có đầu ra rõ, dùng làm đầu vào bước sau. Lỗi phát hiện sớm thì rẻ hơn.',
    'Yêu cầu quá lớn trong một prompt → output nông, bỏ sót. Dấu hiệu: "tóm tắt 40 tài liệu và viết chiến lược 3 năm" trong một lần.',
    'Có thể nhờ Claude đề xuất kế hoạch/dàn ý trước, bạn duyệt rồi mới viết.'
  ]},
  {h:'Lặp lại có chủ đích', b:[
    'Khi output chưa đạt, hãy chẩn đoán: thiếu ngữ cảnh? tiêu chí mơ hồ? yêu cầu quá rộng? sai định dạng?',
    'Phản hồi cụ thể ("đoạn 2 quá kỹ thuật cho giám đốc tài chính, bỏ thuật ngữ, giữ số liệu") tốt hơn "viết lại cho hay hơn".',
    'Nếu sửa nhiều vòng trong một cuộc chat dài mà vẫn lệch → cân nhắc chat mới với prompt đã hoàn thiện.',
    'Cho phép Claude hỏi lại: "Nếu thiếu thông tin, hãy hỏi trước khi viết".'
  ]},
  {h:'Theo loại tác vụ', b:[
    '<b>Phân tích</b>: đưa dữ liệu thật, yêu cầu nêu giả định, cách tính, giới hạn.',
    '<b>Nghiên cứu</b>: dùng web search/Research, yêu cầu trích nguồn, ngày công bố; vẫn phải kiểm chứng.',
    '<b>Soạn thảo</b>: đối tượng đọc, giọng văn, mẫu tham khảo, độ dài.',
    '<b>Brainstorm</b>: yêu cầu số lượng & độ đa dạng, tạm hoãn đánh giá, sau đó lọc theo tiêu chí.'
  ]}
],
traps: [
  'Phương án "yêu cầu Claude cố gắng hơn / suy nghĩ kỹ hơn" mà không thêm thông tin → hiếm khi đúng.',
  'Đổi sang model mạnh hơn khi vấn đề thật là prompt thiếu bối cảnh → thường là đáp án nhiễu.',
  'Viết một prompt khổng lồ cho tác vụ nhiều giai đoạn → nên chia bước.'
],
cards: [
  ['5 thành phần của prompt nghiệp vụ tốt?', 'Mục tiêu (+ người đọc), bối cảnh, ràng buộc, định dạng, tiêu chí/ví dụ.'],
  ['Output nông, bỏ sót khi yêu cầu quá lớn → làm gì?', 'Chia thành chuỗi bước, duyệt output giữa từng bước.'],
  ['Phản hồi "viết lại hay hơn" có hiệu quả không?', 'Kém. Hãy chỉ rõ đoạn nào, sai gì, muốn thế nào.'],
  ['Few-shot dùng khi nào?', 'Khi cần khớp giọng văn/định dạng cụ thể; 1–3 ví dụ đa dạng.'],
  ['Tài liệu dài nên đặt ở đâu trong prompt?', 'Đặt trước, chỉ dẫn/câu hỏi ở cuối, tách bằng tiêu đề hoặc thẻ.']
]
},

OE: {
intro: `Domain nặng nhất (21%, ~12–13 câu). Giá trị của người dùng Claude trong tổ chức nằm ở chỗ biết output có <b>đúng, đủ và an toàn để gửi</b> hay không. Đề hay cho một output trông rất tự tin rồi hỏi bước tiếp theo đúng nhất trước khi dùng.`,
objectives: [
  'Kiểm tra độ chính xác & đầy đủ; phát hiện hallucination, mâu thuẫn, thiên lệch (bias).',
  'Fact-check theo mức rủi ro; quyết định khi nào cần con người duyệt.',
  'Biên tập output cho đúng đối tượng đọc.',
  'Chọn định dạng output: inline text, artifact, hay dữ liệu có cấu trúc.'
],
sections: [
  {h:'Hallucination: nhận diện', b:[
    'Dấu hiệu nguy cơ cao: số liệu cụ thể, trích dẫn điều khoản/luật, tên tài liệu, URL, tên người, ngày tháng, trích nguyên văn.',
    'Độ tự tin của câu chữ KHÔNG phản ánh độ chính xác. Câu trả lời trôi chảy vẫn có thể sai.',
    'Nguồn được trích vẫn phải mở ra kiểm tra: nguồn có thể không nói điều Claude nói.',
    'Kiến thức của model có ngày cắt (knowledge cutoff); thông tin mới cần web search/Research hoặc tài liệu bạn cung cấp.'
  ]},
  {h:'Kiểm chứng theo mức rủi ro', b:[
    'Rủi ro thấp (brainstorm nội bộ, nháp ý tưởng) → đọc lướt hợp lý.',
    'Rủi ro trung bình (báo cáo nội bộ) → kiểm số liệu chính, logic, nguồn.',
    'Rủi ro cao (pháp lý, tài chính, y tế, gửi khách hàng/công chúng, quyết định về con người) → đối chiếu nguồn gốc chính thức + người có chuyên môn duyệt.',
    'Kiểm chứng bằng nguồn độc lập (văn bản gốc, hệ thống nội bộ), không chỉ hỏi lại Claude "bạn chắc chứ?".',
    'Nhờ Claude tự rà soát (liệt kê giả định, câu khẳng định cần kiểm) là bước hỗ trợ tốt, nhưng không thay thế kiểm chứng độc lập.'
  ]},
  {h:'Đầy đủ, nhất quán, thiên lệch', b:[
    'Đối chiếu output với yêu cầu gốc: đủ mọi mục? đúng phạm vi? có bỏ sót tài liệu nào?',
    'Khi tóm tắt nhiều tài liệu: kiểm tra mỗi tài liệu có được phản ánh; số liệu khớp bản gốc.',
    'Mâu thuẫn nội bộ: tổng không khớp chi tiết, ngày trước–sau lệch, kết luận trái dữ liệu.',
    'Bias: ngôn ngữ thiên lệch về giới, tuổi, vùng miền; khuyến nghị bất lợi cho nhóm cụ thể; chỉ trình bày một phía. Với nội dung tuyển dụng, đánh giá nhân sự, khách hàng → cần soát kỹ + người duyệt.'
  ]},
  {h:'Con người duyệt (human-in-the-loop)', b:[
    'Bắt buộc khi: quyết định ảnh hưởng quyền lợi con người, cam kết pháp lý/tài chính, phát ngôn ra bên ngoài, lĩnh vực được quản lý.',
    'Người duyệt phải có chuyên môn phù hợp và đủ thông tin (nguồn, giả định), không chỉ "bấm duyệt".',
    'Người dùng vẫn chịu trách nhiệm với nội dung gửi đi, kể cả khi Claude soạn.'
  ]},
  {h:'Định dạng output', b:[
    '<b>Inline text</b>: câu trả lời ngắn, trao đổi nhanh, giải thích.',
    '<b>Artifact</b>: nội dung độc lập, dài, cần chỉnh sửa/lặp lại hoặc tái sử dụng/chia sẻ (tài liệu, bảng, code, trang web nhỏ, sơ đồ).',
    '<b>Dữ liệu có cấu trúc</b> (bảng, CSV, JSON): khi output sẽ được nhập vào hệ thống/bảng tính khác hoặc so sánh nhiều mục.',
    'Viết lại cho đối tượng khác: giám đốc → kết luận trước, ngắn; đội kỹ thuật → chi tiết; khách hàng → không thuật ngữ nội bộ.'
  ]}
],
traps: [
  '"Hỏi lại Claude xem có chắc không" là kiểm chứng yếu — đáp án đúng thường là đối chiếu nguồn gốc.',
  '"Thêm vào prompt: không được bịa" giảm rủi ro nhưng không thay thế kiểm chứng trước khi gửi.',
  'Đáp án "bỏ không dùng Claude cho việc này nữa" thường quá tay; đúng hơn là thêm bước kiểm chứng/duyệt.',
  'Nghe có vẻ "cẩn thận" (đọc lại toàn bộ thật kỹ) nhưng không kiểm điểm rủi ro thật (trích dẫn, số liệu) → bẫy.'
],
cards: [
  ['Loại nội dung nào dễ hallucinate nhất?', 'Số liệu cụ thể, trích dẫn luật/điều khoản, URL, tên tài liệu, ngày tháng, trích nguyên văn.'],
  ['Claude trích nguồn rồi — đủ chưa?', 'Chưa. Mở nguồn và xác nhận nguồn thực sự nói điều đó.'],
  ['Khi nào bắt buộc con người duyệt?', 'Rủi ro cao: pháp lý, tài chính, y tế, ảnh hưởng con người, phát ngôn ra ngoài.'],
  ['Khi nào dùng artifact thay vì inline?', 'Nội dung độc lập, dài, cần chỉnh sửa lặp lại, tái sử dụng hoặc chia sẻ.'],
  ['Độ tự tin của câu chữ có báo hiệu độ đúng?', 'Không. Văn trôi chảy vẫn có thể sai.'],
  ['Self-review của Claude có thay kiểm chứng?', 'Không — chỉ là bước hỗ trợ, cần nguồn độc lập.']
]
},

PS: {
intro: `Chọn đúng <b>tính năng</b> (chat, Projects, Research, artifacts, connectors, skills, Cowork…) và đúng <b>tầng model</b> (Haiku / Sonnet / Opus) cho tác vụ, theo chi phí, tốc độ và chất lượng; hiểu context window và khi nào nên bắt đầu lại.`,
objectives: [
  'Chọn giữa chat thường, Projects, Research, artifacts và các tính năng khác.',
  'So sánh tầng model theo chi phí, tốc độ, chất lượng.',
  'Hiểu context window; quyết định tiếp tục, tóm tắt, lưu tri thức hay bắt đầu mới.'
],
sections: [
  {h:'Tầng model (dòng hiện hành, 10/2026)', b:[
    '<b>Haiku</b> (Haiku 5.5): nhanh & rẻ nhất — khối lượng lớn, độ trễ thấp: phân loại, trích xuất, định tuyến, trả lời ngắn lặp lại.',
    '<b>Sonnet</b> (Sonnet 5.5): cân bằng tốc độ–trí tuệ tốt nhất — phần lớn công việc tri thức hằng ngày.',
    '<b>Opus</b> (Opus 5.5): mạnh cho công việc tri thức dài, nhiều bước, agentic; Anthropic khuyên bắt đầu từ Opus cho đa số workload API.',
    '<b>Fable</b> (Fable 5.1): tầng cao nhất cho suy luận rất khó, tác vụ dài; chậm & đắt nhất.',
    'Nguyên tắc đề thi: chọn model <b>đủ tốt rẻ nhất</b> cho nhu cầu; việc khó/rủi ro cao → tầng mạnh; khối lượng lớn, đơn giản → Haiku.',
    'Tất cả model hiện hành có context 1M token, hỗ trợ ảnh, đa ngôn ngữ. (Đề có thể gọi chung "Haiku, Sonnet, Opus".)'
  ]},
  {h:'Tính năng trên Claude apps', b:[
    '<b>Chat</b>: hỏi đáp nhanh, việc một lần.',
    '<b>Projects</b>: không gian làm việc riêng có kiến thức (file), hướng dẫn (instructions), lịch sử chat và memory riêng; cho công việc lặp lại cùng bối cảnh; chia sẻ trong Team/Enterprise.',
    '<b>Research</b>: điều tra nhiều bước, nhiều lượt tìm kiếm nối nhau, có trích nguồn; cần bật web search; gói trả phí.',
    '<b>Web search</b>: lấy thông tin mới hơn knowledge cutoff.',
    '<b>Artifacts</b>: nội dung độc lập (tài liệu, code, trang, sơ đồ) ở khung riêng, chỉnh lặp lại, chia sẻ.',
    '<b>Connectors</b> (dựa trên MCP): nối Google Drive, Gmail, Calendar, Slack… để Claude đọc/thao tác dữ liệu thật.',
    '<b>Skills</b>: gói quy trình/chuyên môn tái sử dụng (vd. tạo Excel, Word, PPT theo chuẩn công ty); Claude tự dùng khi liên quan.',
    '<b>Cowork</b>: chế độ agentic cho việc không phải code — mô tả kết quả, Claude lập kế hoạch & thực hiện nhiều bước (sắp xếp file, dựng bảng tính/slide, tổng hợp nghiên cứu); có lịch chạy định kỳ.',
    '<b>Memory</b>: nhớ sở thích/bối cảnh giữa các chat; <b>Incognito</b>: chat không lưu lịch sử/memory.',
    '<b>Claude in Chrome / Excel / PowerPoint…</b>: Claude làm việc ngay trong công cụ quen thuộc.'
  ]},
  {h:'Context window & quản lý hội thoại', b:[
    'Context = mọi thứ Claude "thấy" trong một lần: prompt, file, lịch sử chat, instructions.',
    'Chat rất dài → chất lượng có thể giảm, chi phí/giới hạn sử dụng tăng; thông tin đầu có thể bị bỏ qua.',
    '<b>Tiếp tục</b>: khi vẫn cùng chủ đề, ngữ cảnh còn đúng.',
    '<b>Tóm tắt rồi mở chat mới</b>: khi chat dài, lệch hướng nhưng vẫn cần kết luận cũ.',
    '<b>Lưu thành tri thức</b> (project knowledge/instructions): khi bối cảnh dùng lại nhiều lần.',
    '<b>Bắt đầu mới hoàn toàn</b>: đổi chủ đề, hoặc chat cũ chứa giả định sai đang kéo lệch output.',
    'Project dùng RAG trên gói trả phí khi kiến thức gần vượt context, mở rộng dung lượng tới ~10 lần.'
  ]}
],
traps: [
  'Mặc định chọn model mạnh nhất cho mọi việc → sai khi đề nhấn mạnh khối lượng lớn/chi phí/tốc độ.',
  'Chọn Haiku cho việc phân tích phức tạp, rủi ro cao chỉ vì rẻ → sai.',
  'Dùng chat thường + dán lại tài liệu mỗi ngày cho việc lặp lại → nên dùng Project.',
  'Đổi model khi vấn đề là thiếu dữ liệu mới → cần web search/Research/connector.'
],
cards: [
  ['Haiku phù hợp với gì?', 'Khối lượng lớn, độ trễ thấp, tác vụ đơn giản: phân loại, trích xuất, định tuyến, trả lời ngắn.'],
  ['Sonnet phù hợp với gì?', 'Cân bằng tốc độ–chất lượng cho đa số công việc tri thức hằng ngày.'],
  ['Opus phù hợp với gì?', 'Việc phức tạp, nhiều bước, phân tích sâu, rủi ro cao.'],
  ['Research khác web search thế nào?', 'Research chạy nhiều lượt tìm kiếm nối tiếp, tự quyết hướng tiếp theo, ra báo cáo có trích nguồn.'],
  ['Chat dài bắt đầu lệch → 4 lựa chọn?', 'Tiếp tục / tóm tắt rồi chat mới / lưu vào project knowledge / bắt đầu mới hoàn toàn.'],
  ['Project chứa những gì?', 'Knowledge (file), instructions, lịch sử chat riêng, memory riêng của project.']
]
},

WI: {
intro: `Đưa Claude vào quy trình thật: phân tích yêu cầu, chọn chỗ Claude tạo giá trị, quyết định <b>chèn vào quy trình hiện có</b> hay <b>thiết kế lại</b>, và truyền đạt với stakeholder Claude làm được gì, không làm được gì. Biết khi nào việc vượt phạm vi và cần chuyển cho Developer/Architect.`,
objectives: [
  'Phân tích yêu cầu & use case; xác định bước nào Claude hỗ trợ tốt.',
  'Dùng Claude để nghiên cứu, lập kế hoạch, thiết kế lại quy trình.',
  'Chọn tích hợp vào workflow hiện có hay redesign.',
  'Truyền đạt giá trị và giới hạn cho stakeholder; nhận biết khi cần escalate.'
],
sections: [
  {h:'Phân tích use case', b:[
    'Bắt đầu từ <b>vấn đề nghiệp vụ & chỉ số</b> (thời gian xử lý, lỗi, chi phí), không bắt đầu từ công nghệ.',
    'Ứng viên tốt: việc lặp lại, nhiều chữ, cần tổng hợp/soạn nháp, có người kiểm tra cuối.',
    'Ứng viên kém: cần độ chính xác tuyệt đối không có bước kiểm; quyết định thuần tính toán đã có hệ thống xác định (deterministic) làm tốt.',
    'Xác định đầu vào (dữ liệu nằm đâu, có nhạy cảm?), đầu ra, người duyệt, tiêu chí thành công.'
  ]},
  {h:'Chèn vào hay thiết kế lại', b:[
    '<b>Augment</b>: thêm Claude vào 1–2 bước (soạn nháp, tóm tắt) — rủi ro thấp, nhanh có giá trị, ít thay đổi thói quen.',
    '<b>Redesign</b>: khi quy trình cũ tồn tại vì giới hạn thủ công mà Claude xóa bỏ (vd. chỉ đọc mẫu 10% hồ sơ vì không đủ người).',
    'Thực tế tốt: thí điểm (pilot) nhỏ, đo trước–sau, giữ người duyệt, rồi mở rộng.',
    'Luôn thiết kế điểm kiểm (checkpoint) con người ở bước rủi ro cao.'
  ]},
  {h:'Truyền đạt với stakeholder', b:[
    'Nói rõ: Claude tăng tốc soạn thảo/tổng hợp; không bảo đảm đúng 100%; cần quy trình kiểm chứng.',
    'Tránh hứa quá mức ("thay thế cả phòng"); nêu số liệu thí điểm thật.',
    'Nêu rủi ro & kiểm soát: dữ liệu nhạy cảm, người duyệt, chính sách AI.',
    'Phù hợp đối tượng: lãnh đạo cần giá trị & rủi ro; người dùng cuối cần cách làm việc mới.'
  ]},
  {h:'Biết giới hạn vai trò (escalation)', b:[
    'Associate dùng Claude qua ứng dụng (claude.ai, desktop, Cowork, connectors có sẵn).',
    'Cần tích hợp API, tự động hóa quy mô lớn, xây agent, connector/MCP server tùy chỉnh, xử lý dữ liệu hệ thống lõi → chuyển cho Claude Developer/Architect hoặc IT.',
    'Không tự ý nối hệ thống mới hoặc cài công cụ chưa được phê duyệt để "đi tắt".'
  ]}
],
traps: [
  'Đáp án tự động hóa toàn bộ, bỏ người duyệt ngay từ đầu → thường sai.',
  'Bắt đầu từ "dùng Claude cho mọi thứ" thay vì xác định vấn đề nghiệp vụ → sai.',
  'Associate tự xây tích hợp API phức tạp thay vì escalate → sai.',
  'Hứa với lãnh đạo độ chính xác tuyệt đối → sai.'
],
cards: [
  ['Bắt đầu thiết kế use case từ đâu?', 'Vấn đề nghiệp vụ và chỉ số đo được.'],
  ['Augment vs redesign?', 'Augment: chèn vào bước có sẵn, rủi ro thấp. Redesign: khi quy trình cũ chỉ tồn tại do giới hạn thủ công.'],
  ['Cách triển khai an toàn?', 'Pilot nhỏ, đo trước–sau, giữ người duyệt, rồi mở rộng.'],
  ['Khi nào Associate escalate cho Developer/Architect?', 'Cần API, agent tùy chỉnh, MCP/connector riêng, tự động hóa quy mô lớn, tích hợp hệ thống lõi.']
]
},

CK: {
intro: `Thiết lập <b>Claude Projects</b> đúng cách: cái gì vào instructions, cái gì vào knowledge, khi nào dùng connector, và giữ cấu hình luôn mới. Cũng bao gồm memory, skills và quyền chia sẻ.`,
objectives: [
  'Thiết lập Project: instructions, knowledge, connectors.',
  'Phân biệt thông tin thuộc instructions / knowledge / connector.',
  'Bảo trì: cập nhật nội dung cũ, tránh mâu thuẫn, quản lý quyền chia sẻ.'
],
sections: [
  {h:'Instructions vs Knowledge vs Connector', b:[
    '<b>Project instructions</b>: cách làm — vai trò, giọng văn, định dạng, quy tắc luôn áp dụng ("luôn trả lời bằng tiếng Việt, kết thúc bằng bước tiếp theo").',
    '<b>Project knowledge</b>: tài liệu tham chiếu tương đối ổn định — sổ tay thương hiệu, chính sách, mẫu, FAQ, báo cáo.',
    '<b>Connector</b>: dữ liệu sống, thay đổi thường xuyên, nằm ở hệ thống gốc — Drive, Gmail, Calendar, CRM… Không nên upload bản sao sẽ lỗi thời.',
    '<b>Prompt từng chat</b>: chi tiết riêng của lần đó.',
    '<b>Skills</b>: quy trình đóng gói, dùng lại qua nhiều project/chat (vd. "tạo báo cáo tuần theo mẫu công ty").',
    '<b>Memory</b>: sở thích cá nhân/bối cảnh làm việc chung; không phải nơi lưu chính sách của team.'
  ]},
  {h:'Projects: chi tiết đáng nhớ', b:[
    'Mỗi project có lịch sử chat, knowledge, instructions và memory riêng.',
    'Free tạo được tối đa 5 project; RAG (mở rộng ~10x) chỉ trên gói trả phí, tự bật khi knowledge gần vượt context.',
    'Chia sẻ (Team/Enterprise): theo email, hàng loạt, hoặc toàn tổ chức; quyền <b>Can view</b> (xem & chat) và <b>Can edit</b> (sửa instructions/knowledge, quản lý thành viên).',
    'Chỉ cấp Can edit cho người chịu trách nhiệm nội dung; còn lại Can view.',
    'Chat search tìm trong từng project riêng, không bao giờ xuyên project.'
  ]},
  {h:'Memory', b:[
    'Claude ghi memory theo chủ đề khi chat; bạn có thể yêu cầu nhớ/sửa/quên.',
    'Mặc định bật ở Free/Pro/Max; Team/Enterprise: owner bật cho tổ chức, mỗi thành viên tự opt-in.',
    'Chủ đề nhạy cảm (sức khỏe, chính trị, tôn giáo) không lưu trừ khi opt-in; số giấy tờ tùy thân, số tài khoản tài chính… không bao giờ lưu.',
    'Project memory tách riêng; có thể tắt "Use account memory" để cô lập project.',
    'Pause: giữ nhưng ngừng dùng/ghi. Reset: xóa vĩnh viễn toàn bộ (kể cả project memory).',
    'Xóa một cuộc chat không xóa memory sinh ra từ nó — xóa memory riêng.',
    'Incognito: không lưu lịch sử, không vào memory.'
  ]},
  {h:'Bảo trì cấu hình', b:[
    'Knowledge lỗi thời → output sai một cách tự tin. Thay file cũ, đừng để hai phiên bản mâu thuẫn cùng tồn tại.',
    'Đặt tên file rõ, có phiên bản/ngày; xóa bản nháp không còn dùng.',
    'Instructions ngắn, rõ, không mâu thuẫn với knowledge.',
    'Lên lịch rà soát định kỳ, có người phụ trách (owner) cho mỗi project dùng chung.',
    'Dữ liệu thay đổi hằng ngày → chuyển sang connector thay vì upload lại thủ công.'
  ]}
],
traps: [
  'Nhét chính sách dài 40 trang vào instructions → nên để ở knowledge; instructions dành cho quy tắc hành vi.',
  'Upload bản xuất CRM mỗi tuần thay vì dùng connector → dữ liệu lỗi thời.',
  'Để cả "Policy_v3" và "Policy_v4" trong knowledge → mâu thuẫn.',
  'Cấp Can edit cho cả tổ chức → rủi ro thay đổi ngoài ý muốn.'
],
cards: [
  ['Instructions chứa gì?', 'Quy tắc hành vi luôn áp dụng: vai trò, giọng văn, định dạng, quy trình trả lời.'],
  ['Knowledge chứa gì?', 'Tài liệu tham chiếu ổn định: chính sách, mẫu, sổ tay, FAQ.'],
  ['Khi nào dùng connector thay vì upload?', 'Dữ liệu thay đổi thường xuyên và đã nằm ở hệ thống gốc.'],
  ['Can view vs Can edit?', 'View: xem & chat. Edit: sửa instructions/knowledge, quản lý thành viên.'],
  ['Xóa chat có xóa memory liên quan?', 'Không, phải xóa memory riêng.'],
  ['Memory trong Team/Enterprise bật thế nào?', 'Owner bật cấp tổ chức; mỗi thành viên tự opt-in. Owner không xem được memory cá nhân.']
]
},

GR: {
intro: `Dùng AI an toàn ở nơi làm việc: use case nào phù hợp, dữ liệu nào được đưa vào, tuân thủ chính sách AI của tổ chức, minh bạch và đạo đức. Đề thường cho một đề xuất/một file nhạy cảm và hỏi: được làm không, với kiểm soát nào?`,
objectives: [
  'Đánh giá use case phù hợp hay không.',
  'Độ nhạy cảm dữ liệu & quyền riêng tư.',
  'Tuân thủ chính sách AI của tổ chức.',
  'Đạo đức khi làm việc có AI hỗ trợ: minh bạch, công bằng, trách nhiệm.'
],
sections: [
  {h:'Dữ liệu nhạy cảm', b:[
    'Phân loại trước khi đưa vào: công khai / nội bộ / mật / dữ liệu cá nhân (PII) / dữ liệu được quản lý (sức khỏe, tài chính, trẻ em…).',
    'Nguyên tắc <b>tối thiểu hóa</b>: chỉ đưa dữ liệu cần cho tác vụ; ẩn danh hoặc giả danh (pseudonymize) khi có thể.',
    'Kiểm soát kỹ thuật/quy trình (ẩn danh trước, dùng tài khoản tổ chức được phê duyệt) tốt hơn lời dặn trong prompt ("đừng ghi nhớ dữ liệu này").',
    'Dùng tài khoản/gói được tổ chức phê duyệt (Team/Enterprise) — không dùng tài khoản cá nhân cho dữ liệu công ty.',
    'Incognito chỉ ẩn khỏi lịch sử/memory; trên Team/Enterprise vẫn theo chính sách lưu trữ & export của tổ chức — không phải "chế độ bí mật" để lách chính sách.'
  ]},
  {h:'Chính sách AI của tổ chức', b:[
    'Chính sách công ty luôn được ưu tiên hơn tiện lợi cá nhân.',
    'Không chắc dữ liệu/use case có được phép → hỏi người phụ trách (compliance, bảo mật, pháp chế) trước khi làm.',
    'Không cài skill, connector, extension từ nguồn chưa tin cậy; đọc file/script của skill trước khi bật; rủi ro chính: prompt injection, rò rỉ dữ liệu.',
    'Cowork/agent: chọn mức quyền phù hợp (Manual khi có file nhạy cảm), chỉ kết nối thư mục cần thiết, đặt connector "Needs approval" cho hành động ghi/gửi.'
  ]},
  {h:'Use case phù hợp?', b:[
    'Rủi ro cao: quyết định tuyển dụng, tín dụng, kỷ luật, y tế, pháp lý → Claude chỉ hỗ trợ; con người quyết định & chịu trách nhiệm.',
    'Không dùng Claude để tạo nội dung gây hiểu lầm, mạo danh, giả mạo bằng chứng, giám sát nhân viên trái phép.',
    'Cân nhắc tác động tới nhóm bị ảnh hưởng (bias, công bằng).'
  ]},
  {h:'Minh bạch & trách nhiệm', b:[
    'Công khai việc dùng AI khi chính sách/ngữ cảnh yêu cầu (vd. khách hàng, học thuật, nội dung xuất bản).',
    'Người dùng chịu trách nhiệm về nội dung mình gửi đi.',
    'Prompt injection: tài liệu/email/web có thể chứa chỉ dẫn ẩn; Claude đọc nội dung bên ngoài → kiểm tra hành động trước khi phê duyệt.',
    'Phát hiện sự cố (lộ dữ liệu, output có hại) → báo theo quy trình nội bộ, không tự xử lý im lặng.'
  ]}
],
traps: [
  '"Dặn Claude không lưu dữ liệu" là kiểm soát yếu — đáp án đúng là ẩn danh/không đưa vào/dùng kênh được duyệt.',
  '"Dùng incognito để được phép đưa dữ liệu nhạy cảm" → sai.',
  'Đáp án cấm hoàn toàn AI khi có cách kiểm soát hợp lý → thường quá tay.',
  'Tự quyết thay vì hỏi compliance khi chính sách không rõ → sai.'
],
cards: [
  ['Nguyên tắc tối thiểu hóa dữ liệu?', 'Chỉ đưa vào dữ liệu cần thiết; ẩn danh/giả danh khi có thể.'],
  ['Kiểm soát mạnh vs yếu?', 'Mạnh: ẩn danh trước, không đưa vào, dùng kênh được duyệt. Yếu: lời dặn trong prompt.'],
  ['Incognito có phải kênh an toàn cho dữ liệu nhạy cảm?', 'Không. Chỉ ẩn khỏi lịch sử/memory; vẫn theo chính sách tổ chức.'],
  ['Cài skill từ đồng nghiệp chia sẻ — cần làm gì?', 'Chỉ cài từ nguồn tin cậy; đọc file, script trước khi bật.'],
  ['Prompt injection là gì?', 'Chỉ dẫn ẩn trong nội dung bên ngoài (web, email, file) cố điều khiển Claude.'],
  ['Chính sách không rõ ràng → làm gì?', 'Hỏi compliance/bảo mật/pháp chế trước khi tiến hành.']
]
},

TO: {
intro: `Chẩn đoán vì sao prompt hoặc workflow cho kết quả kém, điều chỉnh theo phản hồi, tăng tốc việc lặp lại; quyết định <b>sửa prompt</b> hay <b>đổi cách tiếp cận</b> (tính năng, model, quy trình, dữ liệu).`,
objectives: [
  'Chẩn đoán prompt/workflow kém hiệu quả.',
  'Điều chỉnh dựa trên phản hồi người dùng/stakeholder.',
  'Tối ưu workflow lặp lại.',
  'Quyết định sửa prompt hay thay đổi cách tiếp cận rộng hơn.'
],
sections: [
  {h:'Chẩn đoán theo triệu chứng', b:[
    'Sai sự thật về thông tin mới → thiếu nguồn: bật web search/Research hoặc cung cấp tài liệu.',
    'Sai về thông tin nội bộ → thiếu/lỗi thời knowledge; kiểm tra file project, connector.',
    'Đúng nội dung nhưng sai giọng văn/định dạng → prompt/instructions; thêm ví dụ mẫu.',
    'Không nhất quán giữa các lần → tiêu chí mơ hồ; chuẩn hóa thành template/instructions/skill.',
    'Bỏ sót phần sau trong chat dài/tài liệu dài → context quá tải; chia nhỏ, tóm tắt, chat mới.',
    'Bỏ qua instructions → instructions mâu thuẫn hoặc bị chìm; rút gọn, làm rõ, kiểm tra xung đột với knowledge.',
    'Kết quả đúng nhưng chậm/tốn → model quá mạnh cho việc đơn giản; cân nhắc tầng nhẹ hơn.'
  ]},
  {h:'Sửa prompt hay đổi cách?', b:[
    'Sửa prompt khi: lỗi về hướng dẫn, định dạng, giọng, độ dài.',
    'Đổi cách khi: thiếu dữ liệu (cần connector/Research), tác vụ vượt khả năng một lượt (chia bước/Cowork), cần lặp lại ổn định (Project/skill), model không đủ (lên tầng), hoặc vượt phạm vi (escalate).',
    'Thay đổi <b>một biến mỗi lần</b> và so sánh trên cùng bộ ví dụ để biết cái gì có tác dụng.'
  ]},
  {h:'Tối ưu workflow lặp lại', b:[
    'Prompt dùng nhiều lần → lưu thành template / project instructions / skill.',
    'Bối cảnh dán lại mỗi lần → đưa vào project knowledge.',
    'Dữ liệu copy thủ công từ công cụ khác → connector.',
    'Việc định kỳ nhiều bước → Cowork với scheduled task (vẫn có người kiểm output).',
    'Thu thập phản hồi người dùng có cấu trúc (ví dụ tốt/xấu) để cải thiện có cơ sở.'
  ]}
],
traps: [
  'Đổi model ngay khi output sai — trong khi gốc rễ là thiếu dữ liệu/ngữ cảnh.',
  'Sửa nhiều thứ cùng lúc → không biết cái gì có tác dụng.',
  'Tiếp tục vá trong chat dài đã lệch thay vì làm lại với prompt hoàn thiện.',
  'Thêm instructions dài hơn khi vấn đề là instructions mâu thuẫn.'
],
cards: [
  ['Sai thông tin sự kiện gần đây → sửa gì?', 'Bật web search/Research hoặc cung cấp nguồn; không phải sửa giọng văn hay đổi model.'],
  ['Output không nhất quán giữa các thành viên team?', 'Chuẩn hóa: project instructions/template/skill dùng chung.'],
  ['Cách thử nghiệm cải tiến prompt?', 'Đổi một biến mỗi lần, so trên cùng bộ ví dụ.'],
  ['Copy dữ liệu từ Drive mỗi ngày → tối ưu thế nào?', 'Dùng connector Google Drive.'],
  ['Instructions bị bỏ qua → kiểm tra gì trước?', 'Mâu thuẫn giữa instructions/knowledge, instructions quá dài hoặc mơ hồ.']
]
}
};
