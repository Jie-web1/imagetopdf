(function () {
  "use strict";

  window.I18N = {
    en: {
      title: "File Converter | Image to PDF · Document conversion",
      logo: "File Converter",
      tagline: "Image to PDF · Image format · Basic document conversion · Runs in browser",
      tabImg2Pdf: "Images → PDF",
      tabImgFormat: "Image format conversion",
      tabText: "Text / basic conversion",
      panelImg2PdfTitle: "Image to PDF",
      panelImg2PdfDesc: "Select one or more images to merge into a single PDF and download.",
      dropzonePdfText: "Drag images here or click to select",
      dropzonePdfHint: "Supports JPG, PNG, WebP, GIF, etc.",
      clearPdf: "Clear",
      convertPdf: "Generate PDF",
      panelImgFormatTitle: "Image format conversion",
      panelImgFormatDesc: "Upload an image, choose target format, convert in the browser and download.",
      dropzoneImgText: "Drag or click to select image",
      outputFormat: "Output format:",
      convertImg: "Convert and download",
      quality: "Quality:",
      panelTextTitle: "Text / basic conversion",
      panelTextDesc: "Upload text files to view content or convert encoding and download.",
      dropzoneTextText: "Drag or select .txt, .json, .csv, .md, etc.",
      encoding: "Encoding:",
      downloadText: "Download with current encoding",
      footerPrivacy: "All conversion is done locally in your browser. Your files are never uploaded.",
      remove: "Remove",
      preview: "Preview",
      truncated: "\n\n… (truncated; download includes full content)",
    },
    zh: {
      title: "文件转换器 | Image to PDF · 图片·文档转换",
      logo: "文件转换器",
      tagline: "图片转 PDF · 图片格式 · 基础文档转换 · 纯前端运行",
      tabImg2Pdf: "图片 → PDF",
      tabImgFormat: "图片格式转换",
      tabText: "文本/基础转换",
      panelImg2PdfTitle: "图片转 PDF",
      panelImg2PdfDesc: "选择一张或多张图片，合并为一个 PDF 文件下载。",
      dropzonePdfText: "拖拽图片到此处，或点击选择",
      dropzonePdfHint: "支持 JPG、PNG、WebP、GIF 等",
      clearPdf: "清空",
      convertPdf: "生成 PDF",
      panelImgFormatTitle: "图片格式转换",
      panelImgFormatDesc: "上传图片并选择目标格式，在浏览器内直接转换并下载。",
      dropzoneImgText: "拖拽或点击选择图片",
      outputFormat: "输出格式：",
      convertImg: "转换并下载",
      quality: "质量：",
      panelTextTitle: "文本 / 基础转换",
      panelTextDesc: "上传文本类文件，查看内容或转换编码后下载。",
      dropzoneTextText: "拖拽或选择 .txt、.json、.csv、.md 等",
      encoding: "编码：",
      downloadText: "按当前编码下载",
      footerPrivacy: "所有转换均在浏览器本地完成，不会上传您的文件。",
      remove: "移除",
      preview: "预览",
      truncated: "\n\n… (已截断，下载将包含完整内容)",
    },
  };

  const STORAGE_KEY = "imagetopdf-lang";
  const DEFAULT_LANG = "zh";

  function getStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === "en" || stored === "zh")) return stored;
    } catch (_) {}
    return DEFAULT_LANG;
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  }

  function applyLanguage(lang) {
    const t = window.I18N[lang];
    if (!t) return;
    document.title = t.title;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (t[key] != null) el.textContent = t[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key] != null) el.placeholder = t[key];
    });
    setStoredLang(lang);
    window.__currentLang = lang;
  }

  function initLanguageSwitcher() {
    const container = document.getElementById("lang-switcher");
    if (!container) return;
    container.querySelectorAll("button[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const lang = this.getAttribute("data-lang");
        applyLanguage(lang);
        container.querySelectorAll("button[data-lang]").forEach(function (b) {
          b.classList.toggle("active", b.getAttribute("data-lang") === lang);
        });
      });
    });
  }

  window.applyLanguage = applyLanguage;
  window.getCurrentLang = function () {
    return window.__currentLang || getStoredLang();
  };

  document.addEventListener("DOMContentLoaded", function () {
    const lang = getStoredLang();
    applyLanguage(lang);
    initLanguageSwitcher();
    var activeBtn = document.querySelector('#lang-switcher button[data-lang="' + lang + '"]');
    if (activeBtn) activeBtn.classList.add("active");
  });
})();
