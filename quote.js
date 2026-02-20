function renderQuote() {
  const quote = JSON.parse(localStorage.getItem("quote") || "[]");
  const tbody = document.getElementById("quoteTableBody");
  if (!tbody) return;

  if (!quote.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No items in quote.</td></tr>`;
    return;
  }

  tbody.innerHTML = quote
    .map((item, index) => `
      <tr data-id="${item.id}">
        <td class="reorder">
          <button onclick="moveItem(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button onclick="moveItem(${index}, 1)" ${index === quote.length - 1 ? 'disabled' : ''}>↓</button>
        </td>
        <td><strong>${item.model ?? "–"}</strong></td>
        <td>${item.size || "–"}</td>
        <td>${item.type || "–"}</td>
        <td>
          <input class="qty-input" type="number" min="1" value="${item.qty ?? 1}"
                 onchange="updateQty('${item.id}', this.value)">
          <span class="qty-print">${item.qty ?? 1}</span>
        </td>
        <td class="col-actions">
          <a href="#" onclick="removeItem('${item.id}'); return false;">Delete</a>
        </td>
      </tr>
    `)
    .join("");
}

function moveItem(index, direction) {
  let quote = JSON.parse(localStorage.getItem("quote") || "[]");
  if (index < 0 || index >= quote.length) return;

  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= quote.length) return;

  // Swap items
  [quote[index], quote[newIndex]] = [quote[newIndex], quote[index]];

  localStorage.setItem("quote", JSON.stringify(quote));
  renderQuote();
}

function updateQty(id, newQty) {
  let quote = JSON.parse(localStorage.getItem("quote") || "[]");
  const item = quote.find((q) => q.id === id);
  if (!item) return;

  const n = parseInt(newQty, 10);
  item.qty = Number.isFinite(n) && n > 0 ? n : 1;

  localStorage.setItem("quote", JSON.stringify(quote));
  renderQuote();
}

function removeItem(id) {
  let quote = JSON.parse(localStorage.getItem("quote") || "[]");
  quote = quote.filter((item) => item.id !== id);
  localStorage.setItem("quote", JSON.stringify(quote));
  renderQuote();
}

function saveQuote() {
  alert("Quote saved locally (in browser). You can print or export as CSV/PDF.");
}

function printQuote() {
  window.print();
}

function goBack() {
  window.location.href = "index.html";
}

function exportQuoteToCSV() {
  const quote = JSON.parse(localStorage.getItem("quote") || "[]");

  if (!quote.length) {
    alert("Nothing to export – quote is empty.");
    return;
  }

  const headers = [
    "Model",
    "Size",
    "Type",
    "Material",
    "Max PMO (psig)",
    "Capacity (lb/hr)",
    "Quantity"
  ];

  const rows = quote.map(item => [
    `"${(item.model ?? "").replace(/"/g, '""')}"`,
    `"${(item.size ?? "").replace(/"/g, '""')}"`,
    `"${(item.type ?? "").replace(/"/g, '""')}"`,
    `"${(item.material ?? "").replace(/"/g, '""')}"`,
    item.maxPMO ?? "",
    item.capacity ?? "",
    item.qty ?? 1
  ]);

  let csv = headers.join(",") + "\n";
  rows.forEach(row => {
    csv += row.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `watson-mcdaniel-quote-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportQuoteToPDF() {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
    alert("PDF library failed to load. Check internet connection.");
    return;
  }

  const quote = JSON.parse(localStorage.getItem("quote") || "[]");
  if (!quote.length) {
    alert("Nothing to export – quote is empty.");
    return;
  }

  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 61, 92);
  doc.text("Watson McDaniel – Quote Sheet", 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Issued: ${new Date().toLocaleDateString()}`, 20, 28);

  // Table
  const tableData = quote.map(item => [
    item.model ?? "–",
    item.size ?? "–",
    item.type ?? "–",
    item.qty ?? 1
  ]);

  doc.autoTable({
    startY: 40,
    head: [["Model", "Size", "Type", "Quantity"]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 4, overflow: "linebreak" },
    headStyles: { fillColor: [0, 61, 92], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40 },
      2: { cellWidth: 60 },
      3: { cellWidth: 20 }
    },
    margin: { top: 40, left: 20, right: 20 }
  });

  // Notes
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 61, 92);
  doc.text("Additional Notes:", 20, finalY);

  const notes = document.getElementById("quoteNote")?.value.trim() || "(no notes)";
  doc.setFontSize(10);
  doc.setTextColor(0);
  const splitNotes = doc.splitTextToSize(notes, 170);
  doc.text(splitNotes, 20, finalY + 8);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Page ${i} of ${pageCount} – Generated on ${new Date().toLocaleString()}`, 20, 290, { align: "left" });
  }

  doc.save(`watson-mcdaniel-quote-${new Date().toISOString().split("T")[0]}.pdf`);
}

document.addEventListener("DOMContentLoaded", () => {
  const issue = document.getElementById("issueDate");
  if (issue) issue.textContent = new Date().toLocaleDateString();

  const note = document.getElementById("quoteNote");
  if (note) {
    note.value = localStorage.getItem("quoteNote") || "";
    note.addEventListener("input", (e) => {
      localStorage.setItem("quoteNote", e.target.value);
    });
  }

  renderQuote();
});