# Nhịp Sống 24h — Template trang tin (static)

Template trang báo điện tử **tĩnh** (HTML/CSS/JS thuần), bố cục lấy cảm hứng từ
các trang tin Việt Nam. Dùng tên thương hiệu và nội dung **của riêng bạn** —
không chứa logo, tên hay nội dung của bất kỳ tờ báo nào.

## Cấu trúc

```
.
├── index.html       # Trang chủ: hero + 4 khối chuyên mục + sidebar
├── category.html    # Trang danh mục (đọc ?cat=... từ URL)
├── article.html     # Trang chi tiết (đọc ?id=... từ URL)
├── css/style.css    # Toàn bộ style (design tokens ở :root)
└── js/
    ├── articles.js  # KHO BÀI VIẾT (14 bài demo) — thêm bài sửa ở đây
    └── main.js      # Render bài/danh mục/sidebar + menu mobile + tab
```

## Thêm / sửa bài viết

Mở `js/articles.js`, thêm 1 object vào mảng `ARTICLES`:

```js
{
  id: "ma-bai-viet",          // dùng cho link article.html?id=ma-bai-viet
  cat: "Kinh doanh", catSlug: "kinh-doanh",
  title: "Tiêu đề bài viết",
  sapo: "Tóm tắt ngắn.",
  author: "Tên tác giả", date: "16/06/2026 - 09:00",
  views: "1.234", order: 141,  // order càng lớn = càng mới
  img: "seed-anh",             // seed cho picsum (đổi sang ảnh thật khi cần)
  tags: ["thẻ1", "thẻ2"],
  body: ["<p>Đoạn 1</p>", "<h2>Tiểu mục</h2>", "<p>Đoạn 2</p>"]
}
```

Danh mục, "Đọc nhiều / Mới nhất" và "Tin liên quan" tự cập nhật theo dữ liệu.

## Chạy thử

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy server tĩnh:

```bash
# Python
python3 -m http.server 8000

# hoặc Node
npx serve .
```

Rồi mở http://localhost:8000

## Tùy chỉnh

- **Đổi tên/màu thương hiệu:** sửa biến trong `:root` của `css/style.css`
  (`--color-accent`, `--brand`...) và chữ "Nhịp Sống 24h" trong các file HTML.
- **Ảnh:** đang dùng placeholder `picsum.photos` (cần internet). Thay bằng ảnh
  thật của bạn trong thư mục `assets/` và đổi `src`.
- **Nội dung:** thay tiêu đề, sapo, đoạn văn bằng nội dung của bạn.

## Deploy

Là site tĩnh nên deploy thẳng lên **Cloudflare Pages**, Netlify, hoặc Vercel —
chỉ cần trỏ tới thư mục gốc, không cần build.

## Lưu ý bản quyền

Đây là template gốc. **Không** sao chép logo, nhãn hiệu, bài viết hay hình ảnh
của báo có thật để tránh vi phạm bản quyền / nhãn hiệu.
