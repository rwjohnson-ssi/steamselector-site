function renderList() {
  const list = JSON.parse(localStorage.getItem("list") || "[]");
  const tbody = document.getElementById("quoteTableBody");
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem;">No items in list yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map((item, index) => `
      <tr draggable="true" data-index="${index}" data-id="${item.id}">
        <td class="reorder">
          <button onclick="moveItem(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button onclick="moveItem(${index}, 1)" ${index === list.length - 1 ? 'disabled' : ''}>↓</button>
        </td>
        <td>${item.model ?? "–"}</td>
        <td>${item.size ?? "–"}</td>
        <td>${item.type ?? "–"}</td>
        <td>
          <input type="number" min="1" value="${item.qty ?? 1}" 
                 onchange="updateQty('${item.id}', this.value)" 
                 style="width:60px; text-align:center; padding:4px; border:1px solid #ccc; border-radius:4px;">
        </td>
        <td class="col-actions">
          <button onclick="removeItem('${item.id}')" style="background:#dc3545; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Delete</button>
        </td>
      </tr>
    `)
    .join("");

  initDragAndDrop();
}

function initDragAndDrop() {
  const tbody = document.getElementById("quoteTableBody");
  if (!tbody) return;

  let draggedRow = null;

  tbody.addEventListener("dragstart", (e) => {
    draggedRow = e.target.closest("tr");
    if (!draggedRow) return;
    draggedRow.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  });

  tbody.addEventListener("dragend", () => {
    if (draggedRow) {
      draggedRow.classList.remove("dragging");
      document.querySelectorAll("tr.over").forEach(r => r.classList.remove("over"));
      draggedRow = null;
    }
  });

  tbody.addEventListener("dragover", (e) => {
    e.preventDefault();
    const row = e.target.closest("tr");
    if (row && row !== draggedRow) {
      row.classList.add("over");
    }
  });

  tbody.addEventListener("dragleave", (e) => {
    const row = e.target.closest("tr");
    if (row) row.classList.remove("over");
  });

  tbody.addEventListener("drop", (e) => {
    e.preventDefault();
    const dropRow = e.target.closest("tr");
    if (!dropRow || !draggedRow || dropRow === draggedRow) return;

    let list = JSON.parse(localStorage.getItem("list") || "[]");

    const fromIndex = parseInt(draggedRow.dataset.index);
    const toIndex = parseInt(dropRow.dataset.index);

    const [movedItem] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, movedItem);

    localStorage.setItem("list", JSON.stringify(list));
    renderList();
  });
}

function moveItem(index, direction) {
  let list = JSON.parse(localStorage.getItem("list") || "[]");
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= list.length) return;

  [list[index], list[newIndex]] = [list[newIndex], list[index]];

  localStorage.setItem("list", JSON.stringify(list));
  renderList();
}

function updateQty(id, newQty) {
  let list = JSON.parse(localStorage.getItem("list") || "[]");
  const item = list.find(q => q.id === id);
  if (!item) return;

  const n = parseInt(newQty, 10);
  item.qty = isNaN(n) || n < 1 ? 1 : n;

  localStorage.setItem("list", JSON.stringify(list));
  renderList();
}

function removeItem(id) {
  let list = JSON.parse(localStorage.getItem("list") || "[]");
  list = list.filter(item => item.id !== id);
  localStorage.setItem("list", JSON.stringify(list));
  renderList();
}

function saveQuote() {
  alert("List saved locally in browser storage.");
}

function printQuote() {
  window.print();
}

function goBack() {
  window.location.href = "index.html";
}

function exportQuoteToCSV() {
  const list = JSON.parse(localStorage.getItem("list") || "[]");
  if (!list.length) return alert("List is empty.");

  const headers = ["Model", "Size", "Type", "Qty"];
  const rows = list.map(item => [
    `"${(item.model ?? "").replace(/"/g, '""')}"`,
    `"${(item.size ?? "").replace(/"/g, '""')}"`,
    `"${(item.type ?? "").replace(/"/g, '""')}"`,
    item.qty ?? 1
  ]);

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `watson-mcdaniel-list-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function exportQuoteToPDF() {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) return alert("PDF library not loaded. Check internet connection.");

  const list = JSON.parse(localStorage.getItem("list") || "[]");
  if (!list.length) return alert("List is empty.");

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(0, 61, 92);
  doc.text("Watson McDaniel – List Sheet", 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Issued: ${new Date().toLocaleDateString()}`, 20, 28);

  const tableData = list.map(item => [
    item.model ?? "–",
    item.size ?? "–",
    item.type ?? "–",
    item.qty ?? 1
  ]);

  doc.autoTable({
    startY: 40,
    head: [["Model", "Size", "Type", "Qty"]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [0, 61, 92], textColor: 255 },
    margin: { top: 40, left: 20, right: 20 }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 61, 92);
  doc.text("Additional Notes:", 20, finalY);

  const notes = document.getElementById("quoteNote")?.value.trim() || "(no notes)";
  doc.setFontSize(10);
  doc.setTextColor(0);
  const splitNotes = doc.splitTextToSize(notes, 170);
  doc.text(splitNotes, 20, finalY + 8);

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Page ${i} of ${pageCount} – Generated on ${new Date().toLocaleString()}`, 20, 290, { align: "left" });
  }

  doc.save(`watson-mcdaniel-list-${new Date().toISOString().split("T")[0]}.pdf`);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("issueDate").textContent = new Date().toLocaleDateString();

  const note = document.getElementById("quoteNote");
  if (note) {
    note.value = localStorage.getItem("listNote") || "";
    note.addEventListener("input", e => localStorage.setItem("listNote", e.target.value));
  }

  renderList();
});