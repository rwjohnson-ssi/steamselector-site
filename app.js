(function () {
  // ── Helpers ──────────────────────────────────────────────────────────────

  function getCheckedValues(id) {
    return Array.from(document.querySelectorAll(`#${id} input:checked`))
      .map(el => el.value);
  }

  function uniqueValues(key) {
    return [...new Set(products.map(p => p[key]).filter(Boolean))].sort();
  }

  function buildCheckboxGroup(containerId, values) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    values.forEach(val => {
      const label = document.createElement("label");
      label.style.display = "block";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = val;
      input.addEventListener("change", debounceRender);
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${val}`));
      container.appendChild(label);
    });
  }

  // ── Filters ──────────────────────────────────────────────────────────────

  function buildFilters() {
    buildCheckboxGroup("sizeFilters", uniqueValues("size"));
    buildCheckboxGroup("materialFilters", uniqueValues("material"));
    buildCheckboxGroup("typeFilters", uniqueValues("type"));
  }

  window.clearFilters = function() {
    document.getElementById("quickSearch").value = "";
    document.getElementById("inletPressure").value = "";
    document.getElementById("condensateLoad").value = "";
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => cb.checked = false);
  };

  // ── Mobile View Toggle ───────────────────────────────────────────────────

  let currentMobileView = "cards";

  window.switchMobileView = function() {
    currentMobileView = document.getElementById("mobileViewMode").value;
    renderTable();
  };

  // ── Table / Cards Rendering ──────────────────────────────────────────────

  function renderTable() {
    const container = document.getElementById("tableContainer");
    if (!container) return;

    const pressure = Math.max(0, Number(document.getElementById("inletPressure")?.value) || 0);
    const load     = Math.max(0, Number(document.getElementById("condensateLoad")?.value)  || 0);
    const search   = (document.getElementById("quickSearch")?.value || "").trim().toLowerCase();

    const selSize = getCheckedValues("sizeFilters");
    const selMat  = getCheckedValues("materialFilters");
    const selType = getCheckedValues("typeFilters");

    let scrollRows = "";
    let cardHtml = "";
    let hasResults = false;

    products.forEach(p => {
      if (
        (!selSize.length || selSize.includes(p.size)) &&
        (!selMat.length  || selMat.includes(p.material)) &&
        (!selType.length || selType.includes(p.type)) &&
        (!pressure || Number(p.maxPMO) >= pressure) &&
        (!load     || Number(p.capacity) >= load) &&
        (!search   || p.model.toLowerCase().includes(search))
      ) {
        hasResults = true;

        scrollRows += `
          <tr>
            <td>${p.model ?? "–"}</td>
            <td>${p.size ?? "–"}</td>
            <td>${p.type ?? "–"}</td>
            <td>${p.material ?? "–"}</td>
            <td>${p.maxPMO ?? "–"}</td>
            <td>${p.capacity ?? "–"}</td>
            <td>
              <div class="table-actions">
                <button onclick="addToQuote('${p.id}')">Add to Quote</button>
                <button class="add-list" onclick="addToList('${p.id}')">Add to List</button>
              </div>
            </td>
          </tr>`;

        cardHtml += `
          <div class="product-card">
            <img src="${p.image || 'https://via.placeholder.com/150?text=No+Image'}" alt="${p.model}" class="card-image">
            <div class="card-content">
              <div class="card-title">${p.model ?? "–"} - ${p.size ?? "–"}</div>
              <div class="card-subtitle">${p.type ?? "–"}</div>
              <div class="card-specs">
                <p><strong>Material:</strong> ${p.material ?? "–"}</p>
                <p><strong>Max PMO:</strong> ${p.maxPMO ?? "–"} psig</p>
                <p><strong>Capacity:</strong> ${p.capacity ?? "–"} lb/hr</p>
              </div>
            </div>
            <div class="card-actions">
              <button onclick="addToQuote('${p.id}')">Add to Quote</button>
              <button class="add-list" onclick="addToList('${p.id}')">Add to List</button>
            </div>
          </div>`;
      }
    });

    let finalHtml = "";

    if (!hasResults) {
      finalHtml = `<p style="text-align:center; padding:3rem; color:#666; font-size:1.1rem;">
        No products match your filters.<br>
        Try adjusting search, pressure, load, or checkboxes.
      </p>`;
    } else if (currentMobileView === "scroll-table") {
      finalHtml = `
        <div class="scroll-table-view">
          <div class="table-header-clone" id="headerClone"></div>
          <table id="productsTable">
            <thead>
              <tr>
                <th>Model</th>
                <th>Size</th>
                <th>Type</th>
                <th>Material</th>
                <th>Max PMO</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${scrollRows}</tbody>
          </table>
        </div>`;
    } else {
      finalHtml = `<div class="cards-view">${cardHtml}</div>`;
    }

    container.innerHTML = finalHtml;
    container.className = currentMobileView === "scroll-table" ? "show-scroll" : "show-cards";

    // Clone header for fixed overlay
    if (currentMobileView === "scroll-table") {
      const table = document.getElementById("productsTable");
      const cloneContainer = document.getElementById("headerClone");
      if (table && cloneContainer) {
        const thead = table.querySelector("thead");
        if (thead) {
          cloneContainer.innerHTML = thead.outerHTML;
          const cloneTable = cloneContainer.querySelector("table");
          if (cloneTable) {
            cloneTable.style.width = table.offsetWidth + "px";
            cloneTable.style.tableLayout = "fixed";
          }
        }
      }
    }

    adjustFixedHeader();
  }

  // ── Debounce ─────────────────────────────────────────────────────────────

  let timeout;
  function debounceRender() {
    clearTimeout(timeout);
    timeout = setTimeout(renderTable, 280);
  }
  window.debounceRender = debounceRender;

  // ── Quote & List interaction ─────────────────────────────────────────────

  window.addToQuote = function(id) {
    let quote = JSON.parse(localStorage.getItem("quote") || "[]");
    const item = quote.find(q => q.id === id);
    if (item) {
      item.qty = (item.qty || 1) + 1;
    } else {
      const prod = products.find(p => p.id === id);
      if (prod) quote.push({ ...prod, qty: 1 });
    }
    localStorage.setItem("quote", JSON.stringify(quote));
    alert("Item added to quote");
  };

  window.addToList = function(id) {
    let list = JSON.parse(localStorage.getItem("list") || "[]");
    const item = list.find(l => l.id === id);
    if (item) {
      item.qty = (item.qty || 1) + 1;
    } else {
      const prod = products.find(p => p.id === id);
      if (prod) list.push({ ...prod, qty: 1 });
    }
    localStorage.setItem("list", JSON.stringify(list));
    alert("Item added to list");
  };

  window.toggleFilters = function() {
    const modal = document.getElementById("filterModal");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
  };

  // ── Fixed Header Adjustment ──────────────────────────────────────────────

  function adjustFixedHeader() {
    const clone = document.getElementById("headerClone");
    if (!clone) return;

    if (currentMobileView === "scroll-table") {
      clone.style.display = "block";
      // Sync horizontal scroll
      const scrollView = document.querySelector(".scroll-table-view");
      if (scrollView) {
        scrollView.addEventListener("scroll", () => {
          clone.scrollLeft = scrollView.scrollLeft;
        });
      }
    } else {
      clone.style.display = "none";
    }
  }

  // Override renderTable to call adjustment
  const originalRenderTable = renderTable;
  renderTable = function() {
    originalRenderTable.apply(this, arguments);
    adjustFixedHeader();
  };

  // Call on resize/orientation change
  window.addEventListener("resize", adjustFixedHeader);

  // ── Init ─────────────────────────────────────────────────────────────────

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("inletPressure")?.addEventListener("input", debounceRender);
    document.getElementById("condensateLoad")?.addEventListener("input", debounceRender);
    document.getElementById("quickSearch")?.addEventListener("input", debounceRender);

    buildFilters();
    renderTable();
    adjustFixedHeader();

    document.getElementById("mobileViewMode")?.addEventListener("change", switchMobileView);
  });
})();
