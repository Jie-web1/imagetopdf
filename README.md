# 文件转换器 File Converter

纯前端实现的文件转换工具：**图片转 PDF**、**图片格式转换**、**文本/基础文件查看与编码下载**。所有处理均在浏览器本地完成，不上传任何文件。

## 在线访问（GitHub Pages）

启用 GitHub Pages 后，你的站点地址为：

**https://jie-web1.github.io/image_to_pdf/**

### 如何开启

1. 打开仓库：https://github.com/Jie-web1/image_to_pdf  
2. 点击 **Settings** → 左侧 **Pages**  
3. 在 **Build and deployment** 里：**Source** 选 **Deploy from a branch**  
4. **Branch** 选 `main`，文件夹选 **/ (root)**，点 **Save**  
5. 等一两分钟，刷新 **Pages** 页面会显示绿色提示和上述 URL  

之后用 `https://jie-web1.github.io/image_to_pdf/` 访问即可（HTTPS，显示为安全）。

## 功能

| 功能 | 说明 |
|------|------|
| **图片 → PDF** | 选择多张图片，合并为一个 PDF 并下载 |
| **图片格式转换** | 上传图片，转换为 PNG / JPEG / WebP 并下载（可调 JPEG 质量） |
| **文本/基础转换** | 上传 .txt、.json、.csv、.md 等，查看内容并按 UTF-8/UTF-16 编码重新下载 |

## 技术栈

- **前端**: HTML5、CSS3、原生 JavaScript
- **PDF 生成**: [jsPDF](https://github.com/parallax/jsPDF)（通过 CDN 引入）
- **图片处理**: Canvas API（格式转换）、FileReader（读取）
- 无构建步骤，可直接用静态服务器或双击 `index.html` 打开（部分功能需本地服务器以正确加载脚本）

## 本地运行

```bash
# 使用 Python 启动简单 HTTP 服务（推荐）
python3 -m http.server 8080
# 浏览器访问 http://localhost:8080

# 或使用 Node.js
npx serve .
```

然后用浏览器打开 `http://localhost:8080`（或对应端口）。

### 为什么显示「Not Secure」？

用 **HTTP**（`http://...`）打开页面时，浏览器会显示「不安全」——因为连接未加密。  
- **本地**：`http://localhost` 只是本地访问，数据不经过网络，功能正常，可忽略该提示。  
- **线上**：部署到 **GitHub Pages** 后，请使用 **HTTPS** 地址（如 `https://你的用户名.github.io/仓库名/`），即可变为「安全」。

### 本地也要 HTTPS（可选）

若希望本地也显示为安全，可用支持 HTTPS 的静态服务：

```bash
# 需要先安装 Node.js，然后：
npx serve . --listen 8080
# 若已全局安装 serve 且支持 SSL：
# serve -s . -l 8080 --ssl（具体以 serve 文档为准）
```

**推荐**：直接部署到 GitHub Pages，用其自带的 HTTPS 访问，无需证书配置。

## 项目结构

```
.
├── index.html      # 主页面
├── css/
│   └── style.css  # 样式
├── js/
│   └── app.js     # 转换逻辑与交互
└── README.md
```

## 浏览器支持

支持现代浏览器（Chrome、Firefox、Safari、Edge）。图片转 PDF 与图片格式转换依赖 Canvas 与 Blob；文本转换依赖 FileReader。

## 隐私说明

所有转换均在本地完成，不会将文件上传到任何服务器。

## License

MIT
