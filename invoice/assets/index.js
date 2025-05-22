
  // ===== Calculate Totals =====
  function calculateTotals() {
    const prices = document.querySelectorAll(".price");
    let subtotal = 0;
    prices.forEach(input => {
      subtotal += parseFloat(input.value) || 0;
    });

    document.getElementById("subtotal").value = subtotal.toFixed(2);

    const gstPercent = parseFloat(document.getElementById("gstPercent").value) || 0;
    const gstValue = (subtotal * gstPercent) / 100;
    document.getElementById("gstValue").value = gstValue.toFixed(2);

    const grandTotal = subtotal + gstValue;
    document.getElementById("grandTotal").value = grandTotal.toFixed(2);
  }

  // ===== Attach Input Event Listeners =====
  function attachListeners() {
    document.querySelectorAll(".price").forEach(input => {
      input.removeEventListener("input", calculateTotals);
      input.addEventListener("input", calculateTotals);
    });

    const gstInput = document.getElementById("gstPercent");
    gstInput.removeEventListener("input", calculateTotals);
    gstInput.addEventListener("input", calculateTotals);
  }

  // ===== Add Row Dynamically =====
  function addRow() {
    const tbody = document.getElementById("invoiceBody");
    const subtotalRow = document.getElementById("subtotal").closest("tr");

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="tel" placeholder="2025-05-21" /></td>
      <td><input type="text" placeholder="Account Name" /></td>
      <td><input type="text" placeholder="Detail" /></td>
      <td><input type="number" step="0.01" class="price" placeholder="0" /></td>
    `;

    tbody.insertBefore(newRow, subtotalRow);
    attachListeners(); // Add listener to new .price input
  }

  // ===== PDF Download =====
  

  // ===== Excel Download =====
   function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws_data = [];
let companyName = document.querySelector('input[placeholder="Company Name"]')?.value || "invoice";
companyName = companyName.replace(/[^a-z0-9]/gi, '_'); // sanitize filename (optional)
    // Section 1: Invoice Info
    ws_data.push(["Invoice To", document.querySelector('input[placeholder="Company Name"]')?.value || ""]);
    ws_data.push(["Address", document.querySelector('input[placeholder="H-98, Grham Industrial Area-1 ,Gujrat-11200"]')?.value || ""]);
    ws_data.push(["PAN No", document.querySelector('input[placeholder="XXXXXXXXXXXXXXXXX"]')?.value || ""]);
    ws_data.push(["GSTIN", document.querySelector('input[placeholder="yyyyyyyyyyyyyyyyyyy"]')?.value || ""]);
    ws_data.push(["Invoice Generating Date", document.querySelector('input[placeholder="20/12/2025"]')?.value || ""]);
    ws_data.push([]);

    // Section 2: Bank Details
    const bankName = document.querySelector('input[placeholder="HDFC Bank"]')?.value || "HDFC Bank";
    const acNo = document.querySelector('input[placeholder="475 453 7990"]')?.value || "475 453 7990";
    const ifsc = document.querySelector('input[placeholder="HDFC09233"]')?.value || "HDFC09233";
    const branch = document.querySelector('input[placeholder="Coimbatore"]')?.value || "Coimbatore";

    ws_data.push(["Bank Details"]);
    ws_data.push(["Bank Name", bankName]);
    ws_data.push(["Account No", acNo]);
    ws_data.push(["IFSC Code", ifsc]);
    ws_data.push(["Branch", branch]);
    ws_data.push([]);

    // Section 3: Table Data
    const table = document.querySelector("table");
    if (table) {
      const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.innerText.trim());
      ws_data.push(headers);

      const rows = table.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = [];
        cells.forEach(cell => {
          const input = cell.querySelector("input");
          if (input) {
            rowData.push(input.value || input.placeholder || "");
          } else {
            rowData.push(cell.innerText.trim());
          }
        });
        // Skip empty rows
        if (rowData.some(cell => cell !== "")) {
          ws_data.push(rowData);
        }
      });

      ws_data.push([]);
    }

    // Section 4: Totals
    const subtotal = document.getElementById("subtotal")?.value || "0.00";
    const gstPercent = document.getElementById("gstPercent")?.value || "0";
    const gstValue = document.getElementById("gstValue")?.value || "0.00";
    const grandTotal = document.getElementById("grandTotal")?.value || "0.00";

    ws_data.push(["Sub Total", "", "", subtotal]);
    ws_data.push(["GST (%)", gstPercent + "%", "GST Amount", gstValue]);
    ws_data.push(["Total", "", "", grandTotal]);
    ws_data.push([]);

    // Export to Excel
 const ws = XLSX.utils.aoa_to_sheet(ws_data);
XLSX.utils.book_append_sheet(wb, ws, "Invoice");
XLSX.writeFile(wb, `${companyName}.xlsx`);
  }

  // Optional: Attach listeners and calculations on page load
  window.addEventListener("DOMContentLoaded", () => {
    if (typeof attachListeners === "function") attachListeners();
    if (typeof calculateTotals === "function") calculateTotals();
  });

function printInvoice() {
  window.print();
}
