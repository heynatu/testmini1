# MiniLab

**Tô màu, quét tranh và xem nhân vật sống dậy.** MiniLab là web miễn phí: in tranh tô màu khổ A4, để bé tô, rồi quét bằng camera. Nhân vật bước ra khỏi trang giấy thành bạn 3D biết nhảy, xoay và làm trò khi bé chạm vào.

- Không quảng cáo, không công cụ thống kê, không gọi tới máy chủ bên ngoài.
- Ảnh quét, nhân vật 3D, ảnh chụp và video đều được xử lý ngay trên thiết bị.
- Camera và thư viện ảnh chỉ mở sau khi chủ thiết bị bấm đồng ý (ít nhất một lần, thu hồi được trong mục Quyền riêng tư), sau đó trình duyệt hỏi thêm một lần nữa.
- Web bắt buộc đăng nhập. Toàn bộ ứng dụng được **mã hoá**: không có tài khoản thì không mở được, kể cả khi ai đó có đường dẫn.
- Chạy mượt trên laptop, điện thoại và máy tính bảng. Đăng lên **Vercel** hoặc **GitHub Pages** miễn phí.

## Tính năng

| Mục | Nội dung |
|---|---|
| Thư viện tranh | 7 nhân vật gốc (cá voi, khủng long, bướm, bạch tuộc, tên lửa, mèo, gà con) và trang "Bé tự sáng tạo". Lọc theo chủ đề, xem mẫu đã tô, tải SVG. |
| In A4 | In một hoặc nhiều trang, nhiều bản cho cả lớp, ghi chú tên lớp ở đầu trang, in kèm bản mẫu đã tô. Lưu PDF bằng hộp thoại in của trình duyệt. |
| Quét tranh | Camera tự nhận bốn ô vuông đen và tự chụp khi giữ yên. Nhận ra trang nào nhờ dãy mã ở cuối trang. Nắn phối cảnh, cân bằng ánh sáng, làm màu tươi hơn. Có chế độ kéo bốn góc bằng tay. |
| Nhân vật 3D | Tranh của bé được "thổi phồng" thành thú bông 3D có xương, chuyển động riêng cho từng nhân vật, đứng trên chính trang giấy. Chạm để làm trò, kéo để xoay, chụm hai ngón để phóng to. |
| Bé tự sáng tạo | Bé vẽ nhân vật bất kỳ, MiniLab tự tách hình vẽ và cho nó nhảy múa. |
| Thực tế (AR) | Dùng camera làm nền để đặt nhân vật vào khung cảnh thật. |
| Chụp ảnh, quay video | Lưu thẳng vào máy (hoặc mở bảng chia sẻ trên điện thoại). |
| Bộ sưu tập | Lưu tranh đã quét trên chính thiết bị đó (IndexedDB), chơi lại sau. |
| Quản trị | Thêm, xoá, đặt lại mật khẩu, đổi vai trò, tạo hàng loạt tài khoản cho lớp, in phiếu đăng nhập, đổi khoá bảo mật. |

## Bảo mật hoạt động thế nào

```
public/access.json  (công khai, an toàn)      MINILAB_SECRET  (bí mật, chỉ nằm trong cài đặt Vercel/GitHub)
  mỗi tài khoản = khoá K được "gói" bằng            = khoá K (AES-256)
  PBKDF2-SHA256 600.000 vòng từ tên + mật khẩu                │
                │                                             ▼
                ▼                                 lúc build: ứng dụng được mã hoá AES-GCM thành dist/app.bin
  đăng nhập đúng → mở được K → giải mã app.bin → chạy ứng dụng
```

- `access.json` **không chứa tên đăng nhập hay mật khẩu** ở dạng đọc được, nên đưa lên GitHub an toàn.
- Danh sách tài khoản chỉ quản trị viên giải mã được (kho riêng mã hoá bằng khoá của quản trị).
- Nếu thiếu `MINILAB_SECRET`, bản build **không bao giờ** chứa mã ứng dụng ở dạng thường: web chỉ hiện trang đăng nhập hoặc trang thiết lập.
- `npm run check` (tự chạy trước mỗi build) chặn mọi file có dạng khoá bí mật trước khi lên GitHub.
- Trên Vercel có thêm các header bảo mật (CSP, chặn nhúng iframe, Permissions-Policy chỉ cho camera của chính trang).
- Muốn chặn hẳn một người đã bị xoá tài khoản: vào Quản trị, bấm **Đổi khoá bảo mật**.

## Đưa lên web (không cần cài gì trên máy)

> Nên tạo **2 tài khoản quản trị** (ví dụ cho bạn và một đồng nghiệp). Nếu quản trị viên duy nhất quên mật khẩu thì không ai khôi phục được, phải thiết lập lại từ đầu.

### Bước 1. Đưa mã nguồn lên GitHub

1. Vào github.com, bấm **New repository**, đặt tên `MiniLab`.
   - Dùng Vercel: chọn **Private** (khuyến nghị, giữ kín mã nguồn).
   - Dùng GitHub Pages miễn phí: phải chọn **Public**.
2. Bấm **uploading an existing file**, kéo thả **tất cả** file và thư mục của dự án vào, **trừ** `node_modules`, `dist`, `.env.local` (nếu có). Nhớ kéo cả thư mục `.github` và các file `.gitignore`, `.gitattributes`. (Trên Mac bấm `Cmd + Shift + .` để thấy file ẩn.)
3. Bấm **Commit changes**.

Hoặc dùng lệnh git:

```bash
git init -b main
git add .
git commit -m "MiniLab"
git remote add origin https://github.com/<tên-bạn>/MiniLab.git
git push -u origin main
```

### Bước 2A. Vercel (khuyến nghị)

1. Vào vercel.com, đăng nhập bằng GitHub, bấm **Add New**, **Project**, chọn repo `MiniLab`, bấm **Deploy** (không cần chỉnh gì, cấu hình đã có trong `vercel.json`).
2. Mở web vừa tạo. Bạn sẽ thấy trang **Thiết lập lần đầu**: tạo tài khoản quản trị. Trang sẽ đưa cho bạn:
   - khoá `MINILAB_SECRET` (bấm Chép),
   - file `access.json` (bấm Tải).
3. Trên Vercel: **Settings**, **Environment Variables**, thêm `MINILAB_SECRET` = khoá vừa chép, chọn **Production**, **Save**.
4. Trên GitHub: mở thư mục `public`, **Add file**, **Upload files**, thả `access.json` (thay file cũ), **Commit changes**. Vercel tự build lại trong khoảng một phút.
5. Mở web và đăng nhập. Xong.

### Bước 2B. GitHub Pages

1. Repo, **Settings**, **Pages**, mục **Source** chọn **GitHub Actions**.
2. Tab **Actions**, chọn workflow **Deploy MiniLab**, bấm **Run workflow**. Đợi xong, mở địa chỉ `https://<tên-bạn>.github.io/MiniLab/`.
3. Trên trang **Thiết lập lần đầu**, tạo tài khoản quản trị, chép khoá và tải `access.json`.
4. Repo, **Settings**, **Secrets and variables**, **Actions**, **New repository secret**: tên `MINILAB_SECRET`, giá trị là khoá vừa chép.
5. Tải `access.json` lên thư mục `public` (Add file, Upload files, Commit). Workflow tự chạy, khoảng một đến hai phút sau là đăng nhập được.

> Nếu bạn chỉ dùng Vercel, workflow GitHub vẫn chạy để kiểm tra build nhưng tự bỏ qua bước đăng lên Pages, không báo lỗi.

## Quản lý tài khoản

1. Đăng nhập bằng tài khoản quản trị, mở menu tên bạn, chọn **Quản trị tài khoản**, nhập lại mật khẩu.
2. Thêm tài khoản lẻ hoặc **Tạo tài khoản cho cả lớp** (ví dụ `lop2a-01` đến `lop2a-30`, mỗi bạn một mật khẩu dễ gõ). In **phiếu đăng nhập** A4 để phát cho học sinh.
3. Bấm **Tải access.json** rồi đưa lên thư mục `public` của repo như trên. Bấm **Kiểm tra web đã cập nhật** để chắc chắn.

Mật khẩu chỉ hiện ngay lúc tạo, MiniLab không lưu ở đâu. Quên mật khẩu thì quản trị viên đặt lại.

**Đổi khoá bảo mật**: cập nhật `MINILAB_SECRET` trên Vercel hoặc GitHub **trước**, rồi mới tải `access.json` mới lên. Nếu làm ngược thứ tự, build sẽ dừng với thông báo "không khớp" và web cũ vẫn chạy bình thường cho tới khi bạn sửa.

**Quên khoá MINILAB_SECRET**: đăng nhập quản trị, vào Quản trị, bấm **Xem khoá hiện tại**.

## Chạy trên máy (tuỳ chọn, cho người làm kỹ thuật)

Cần Node.js 20.19 trở lên.

```bash
npm install
npm run dev        # http://localhost:5173  (chế độ phát triển, không mã hoá)
npm run check      # quét khoá bí mật trước khi đưa lên GitHub
npm run build      # build như trên Vercel/GitHub
npm run preview    # build rồi chạy thử bản mã hoá ở http://localhost:4173
```

Để `npm run preview` có ứng dụng đầy đủ: chép `.env.example` thành `.env.local` và dán `MINILAB_SECRET` vào. File `.env.local` đã bị git bỏ qua; **đừng** tải nó lên GitHub.

## In tranh cho học sinh

- Thư viện tranh, chọn tranh, **In A4** (hoặc tick nhiều tranh rồi in một lần).
- Hộp thoại in: khổ **A4**, hướng **dọc**, tỉ lệ **100% / Thực tế**, tắt **Đầu trang và chân trang**.
- Máy in đen trắng dùng tốt. Đừng cắt hay tô lên bốn ô vuông đen và dãy ô nhỏ ở cuối trang.

## Cấu trúc thư mục

```
index.html                 trang công khai (đăng nhập, thiết lập)
public/access.json         danh sách tài khoản đã mã hoá
src/shell/                 đăng nhập, thiết lập lần đầu, giải mã app.bin
src/shared/                mã hoá, giao diện chung, phông chữ, biểu tượng
src/app/                   ứng dụng (được mã hoá khi build)
  templates/characters.js  nhân vật: nét vẽ, xương, chuyển động
  print/                   trang A4 và in ấn
  scan/                    nhận góc, nắn ảnh, cân màu, tách hình tự vẽ
  three/                   dựng nhân vật 3D, sân khấu, âm thanh
  pages/                   các trang
scripts/build.mjs          build và mã hoá
scripts/check-secrets.mjs  chặn lộ khoá
.github/workflows/         GitHub Pages
vercel.json                cấu hình Vercel và header bảo mật
```

## Thêm nhân vật mới

Mở `src/app/templates/characters.js`, sao chép một nhân vật có sẵn, đặt `id` mới (từ 8 đến 29, không trùng), vẽ các phần (`parts`) bằng các hàm `blob`, `ellipse`, `tube`... trong khung 1000 x 1250, khai báo xương (`bones`) và hàm chuyển động `idle`. Thêm vào mảng `CHARACTERS`. Dãy mã cuối trang được tạo tự động từ `id`.

## Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| Web hiện "Thiết lập lần đầu" dù đã tải access.json | Build chưa chạy lại. Vercel: Deployments, Redeploy. GitHub: Actions, Run workflow. |
| Web hiện "đang chờ khoá bảo mật" | Chưa thêm `MINILAB_SECRET`. Thêm rồi build lại. |
| Build báo "MINILAB_SECRET không khớp" | Khoá trong cài đặt khác với access.json. Đăng nhập quản trị, xem khoá hiện tại, dán lại. |
| GitHub Actions báo lỗi ở bước deploy | Chưa bật Settings, Pages, Source: GitHub Actions. |
| Camera không mở | Web phải chạy bằng https. Kiểm tra quyền camera ở biểu tượng ổ khoá cạnh địa chỉ web. |
| Không nhận ra tranh | Đủ sáng, thấy đủ bốn ô vuông đen, giữ yên máy. Hoặc dùng "Chỉnh bốn góc". |

## Giấy phép

Mã nguồn: MIT (xem `LICENSE`). Tranh và nhân vật trong MiniLab là thiết kế gốc. Thành phần bên thứ ba: xem `THIRD_PARTY_NOTICES.md`.
