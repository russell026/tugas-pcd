document.addEventListener("DOMContentLoaded", () => {
  // The Prediction
  const fileInput = document.getElementById("file-input");
  const classifyBtn = document.getElementById("classify-btn");
  const labelCell = document.querySelector("tr:nth-child(1) td");
  const presentaseCell = document.querySelector("tr:nth-child(2) td");
  const deskripsiCell = document.querySelector("tr:nth-child(3) td");

  classifyBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      alert("Silakan pilih gambar terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://web-production-02ce.up.railway.app/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memproses gambar");
      }

      const data = await response.json();
      const label = data.label;
      const confidence = data.confidence;

      labelCell.textContent = label === 0 ? "Segar" : "Tidak Segar";
      presentaseCell.textContent = (confidence * 100).toFixed(2) + " %";
      deskripsiCell.textContent =
        label === 0
          ? "Ikan ini tergolong segar berdasarkan fitur visualnya."
          : "Ikan ini tidak segar, perhatikan perubahan warna dan tekstur.";
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim gambar ke API.");
    }
  });

  // preview gambar
  const previewImg = document.getElementById("preview-image");
  const previewLabel = document.getElementById("preview-label");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        previewImg.src = reader.result;
        previewImg.style.display = "block";
        previewLabel.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      previewImg.src = "";
      previewImg.style.display = "none";
      previewLabel.style.display = "block";
    }
  });

  // Reset Button
  const resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", () => {
    fileInput.value = "";
    labelCell.textContent = "-";
    presentaseCell.textContent = "-";
    deskripsiCell.textContent = "-";

    previewImg.src = "";
    previewImg.style.display = "none";
    previewLabel.style.display = "block";
  });

  // Modal Interaction
  const modal = document.getElementById("about-modal");
  const aboutUsBtn = document.getElementById("about-us-btn");
  const closeBtn = document.querySelector(".close-btn");

  aboutUsBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
