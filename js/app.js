(function () {
  "use strict";

  const { jsPDF } = window.jspdf;

  // ----- Tab switching -----
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetId = "panel-" + this.dataset.tab;
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach((p) => {
        p.classList.remove("active");
        p.hidden = true;
      });
      this.classList.add("active");
      this.setAttribute("aria-selected", "true");
      const panel = document.getElementById(targetId);
      if (panel) {
        panel.classList.add("active");
        panel.hidden = false;
      }
    });
  });

  // ----- Image to PDF -----
  const dropzonePdf = document.getElementById("dropzone-pdf");
  const inputPdf = document.getElementById("input-pdf");
  const previewPdf = document.getElementById("preview-pdf");
  const clearPdfBtn = document.getElementById("clear-pdf");
  const convertPdfBtn = document.getElementById("convert-pdf");

  let pdfFiles = [];

  function setupDropzone(el, input, onFiles) {
    el.addEventListener("click", () => input.click());
    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      el.classList.add("dragover");
    });
    el.addEventListener("dragleave", () => el.classList.remove("dragover"));
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      el.classList.remove("dragover");
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
      if (files.length) onFiles(files);
    });
    input.addEventListener("change", () => {
      const files = Array.from(input.files || []);
      if (files.length) onFiles(files);
      input.value = "";
    });
  }

  function handlePdfFiles(files) {
    pdfFiles = pdfFiles.concat(files);
    renderPdfPreviews();
    convertPdfBtn.disabled = pdfFiles.length === 0;
  }

  function renderPdfPreviews() {
    previewPdf.querySelectorAll("img").forEach((img) => {
      if (img.src && img.src.startsWith("blob:")) URL.revokeObjectURL(img.src);
    });
    previewPdf.innerHTML = "";
    pdfFiles.forEach((file, i) => {
      const url = URL.createObjectURL(file);
      const div = document.createElement("div");
      div.className = "preview-item";
      div.innerHTML =
        '<span class="order">' +
        (i + 1) +
        "</span>" +
        '<img src="' +
        url +
        '" alt="">' +
        '<button type="button" class="remove" data-index="' +
        i +
        '" aria-label="移除">×</button>';
      previewPdf.appendChild(div);
      div.querySelector(".remove").addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        pdfFiles.splice(idx, 1);
        renderPdfPreviews();
        convertPdfBtn.disabled = pdfFiles.length === 0;
      });
    });
  }

  clearPdfBtn.addEventListener("click", () => {
    pdfFiles.forEach(() => {});
    pdfFiles = [];
    previewPdf.querySelectorAll("img").forEach((img) => {
      if (img.src) URL.revokeObjectURL(img.src);
    });
    previewPdf.innerHTML = "";
    convertPdfBtn.disabled = true;
  });

  convertPdfBtn.addEventListener("click", () => {
    if (pdfFiles.length === 0) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    function addImage(index) {
      if (index >= pdfFiles.length) {
        doc.save("converted.pdf");
        return;
      }
      const file = pdfFiles[index];
      const format = file.type === "image/png" ? "PNG" : "JPEG";
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const pageW = doc.internal.pageSize.getWidth();
          const pageH = doc.internal.pageSize.getHeight();
          const imgW = img.width;
          const imgH = img.height;
          const ratio = Math.min(pageW / imgW, pageH / imgH, 1);
          const w = imgW * ratio;
          const h = imgH * ratio;
          const x = (pageW - w) / 2;
          const y = (pageH - h) / 2;
          if (index > 0) doc.addPage();
          doc.addImage(e.target.result, format, x, y, w, h);
          addImage(index + 1);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    addImage(0);
  });

  setupDropzone(dropzonePdf, inputPdf, handlePdfFiles);

  // ----- Image format conversion -----
  const dropzoneImg = document.getElementById("dropzone-img");
  const inputImg = document.getElementById("input-img");
  const formatOptions = document.getElementById("format-options");
  const selectFormat = document.getElementById("select-format");
  const qualityLabel = document.getElementById("quality-label");
  const qualityInput = document.getElementById("quality");
  const convertImgBtn = document.getElementById("convert-img");
  const previewImg = document.getElementById("preview-img");

  let currentImageFile = null;

  selectFormat.addEventListener("change", () => {
    qualityLabel.style.display = selectFormat.value === "image/jpeg" ? "flex" : "none";
  });

  setupDropzone(dropzoneImg, inputImg, (files) => {
    if (files.length === 0) return;
    currentImageFile = files[0];
    formatOptions.hidden = false;
    const url = URL.createObjectURL(currentImageFile);
    previewImg.innerHTML = '<img src="' + url + '" alt="预览">';
  });

  convertImgBtn.addEventListener("click", () => {
    if (!currentImageFile) return;
    const mime = selectFormat.value;
    const quality = mime === "image/jpeg" ? qualityInput.value / 100 : 1;
    const ext = mime === "image/png" ? "png" : mime === "image/jpeg" ? "jpg" : "webp";

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = (currentImageFile.name.replace(/\.[^.]+$/, "") || "image") + "." + ext;
            a.click();
            URL.revokeObjectURL(a.href);
          },
          mime,
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(currentImageFile);
  });

  // ----- Text / basic file -----
  const dropzoneText = document.getElementById("dropzone-text");
  const inputText = document.getElementById("input-text");
  const textOptions = document.getElementById("text-options");
  const selectEncoding = document.getElementById("select-encoding");
  const downloadTextBtn = document.getElementById("download-text");
  const textPreview = document.getElementById("text-preview");

  let currentTextContent = "";
  let currentTextFileName = "";

  setupDropzone(dropzoneText, inputText, (files) => {
    if (files.length === 0) return;
    const file = files[0];
    currentTextFileName = file.name;
    textOptions.hidden = false;
    const encoding = selectEncoding.value === "utf-16" ? "utf-16" : "utf-8";
    const reader = new FileReader();
    reader.onload = function (e) {
      currentTextContent = e.target.result;
      textPreview.textContent = currentTextContent.slice(0, 50000);
      if (currentTextContent.length > 50000) {
        textPreview.textContent += "\n\n… (已截断，下载将包含完整内容)";
      }
    };
    if (encoding === "utf-16") {
      reader.readAsText(file, "UTF-16");
    } else {
      reader.readAsText(file, "UTF-8");
    }
  });

  downloadTextBtn.addEventListener("click", () => {
    if (!currentTextContent) return;
    const blob = new Blob([currentTextContent], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = currentTextFileName.replace(/\.[^.]+$/, "") + "-converted.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  });
})();
