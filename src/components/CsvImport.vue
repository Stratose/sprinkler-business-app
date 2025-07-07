<template>
  <div class="csv-import">
    <!-- File Upload Section -->
    <div v-if="step === 'upload'" class="upload-section">
      <div class="upload-header">
        <h3 class="upload-title">Import Customers from CSV</h3>
        <p class="upload-description">
          Upload a CSV file to import multiple customers at once. Make sure your CSV includes the
          required columns.
        </p>
      </div>

      <!-- File Drop Zone -->
      <div
        class="file-drop-zone"
        :class="{ 'drag-over': isDragOver, 'has-error': uploadError }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileSelect"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          @change="handleFileSelect"
          class="file-input"
        />

        <div class="drop-zone-content">
          <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p class="drop-zone-text">
            <span class="upload-action">Click to upload</span>
            or drag and drop
          </p>
          <p class="file-types">CSV files only</p>
        </div>
      </div>

      <!-- Upload Error -->
      <div v-if="uploadError" class="error-message">
        <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ uploadError }}</span>
      </div>

      <!-- CSV Format Example -->
      <div class="format-example">
        <h4>Expected CSV Format:</h4>
        <div class="csv-example">
          <code>first_name,last_name,phone,address,latitude,longitude</code><br />
          <code>John,Doe,555-123-4567,"123 Main St, City, State",40.7128,-74.0060</code><br />
          <code>Jane,Smith,555-987-6543,"456 Oak Ave, City, State",,</code>
        </div>
        <p class="format-note">
          <strong>Required:</strong> first_name, last_name, phone, address<br />
          <strong>Optional:</strong> latitude, longitude
        </p>
      </div>
    </div>

    <!-- Preview Section -->
    <div v-else-if="step === 'preview'" class="preview-section">
      <div class="preview-header">
        <h3 class="preview-title">Review Import Data</h3>
        <p class="preview-description">
          {{ validRows.length }} valid customers found, {{ invalidRows.length }} with errors
        </p>
      </div>

      <!-- Import Summary -->
      <div class="import-summary">
        <div class="summary-item">
          <div class="summary-number valid">{{ validRows.length }}</div>
          <div class="summary-label">Valid</div>
        </div>
        <div class="summary-item">
          <div class="summary-number invalid">{{ invalidRows.length }}</div>
          <div class="summary-label">Errors</div>
        </div>
        <div class="summary-item">
          <div class="summary-number total">{{ parsedData.length }}</div>
          <div class="summary-label">Total</div>
        </div>
      </div>

      <!-- Data Preview Table -->
      <div class="table-container">
        <table class="preview-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Coordinates</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in previewRows"
              :key="index"
              :class="{ 'error-row': row.errors.length > 0 }"
            >
              <td class="status-cell">
                <span v-if="row.errors.length === 0" class="status-icon valid">✓</span>
                <span v-else class="status-icon invalid">✗</span>
              </td>
              <td>{{ row.data.first_name }}</td>
              <td>{{ row.data.last_name }}</td>
              <td>{{ row.data.phone }}</td>
              <td class="address-cell">{{ row.data.address }}</td>
              <td>
                <span v-if="row.data.latitude && row.data.longitude">
                  {{ Number(row.data.latitude).toFixed(4) }},
                  {{ Number(row.data.longitude).toFixed(4) }}
                </span>
                <span v-else class="text-muted">Not provided</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Error Details -->
      <div v-if="invalidRows.length > 0" class="error-details">
        <h4>Errors Found:</h4>
        <div class="error-list">
          <div v-for="(row, index) in invalidRows.slice(0, 5)" :key="index" class="error-item">
            <strong>Row {{ row.rowIndex + 1 }}:</strong>
            <ul class="error-messages">
              <li v-for="error in row.errors" :key="error">{{ error }}</li>
            </ul>
          </div>
          <p v-if="invalidRows.length > 5" class="more-errors">
            ... and {{ invalidRows.length - 5 }} more rows with errors
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="preview-actions">
        <button @click="goBackToUpload" class="btn secondary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Upload
        </button>

        <button
          @click="importCustomers"
          class="btn primary"
          :disabled="validRows.length === 0 || importing"
        >
          <span v-if="importing">Importing...</span>
          <span v-else>Import {{ validRows.length }} Customers</span>
        </button>
      </div>
    </div>

    <!-- Success Section -->
    <div v-else-if="step === 'success'" class="success-section">
      <div class="success-content">
        <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="success-title">Import Successful!</h3>
        <p class="success-message">
          Successfully imported {{ importedCount }} customers.
          <span v-if="skippedCount > 0"> {{ skippedCount }} rows were skipped due to errors. </span>
        </p>
        <button @click="resetImport" class="btn primary">Import More</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCustomersStore } from "@/stores/customers";
import { useAuthStore } from "@/stores/auth";

interface ImportRow {
  data: Record<string, string>;
  errors: string[];
  rowIndex: number;
}

interface Emits {
  (e: "close"): void;
  (e: "success", count: number): void;
}

const emit = defineEmits<Emits>();

const customersStore = useCustomersStore();
const authStore = useAuthStore();

// File upload
const fileInput = ref<HTMLInputElement>();
const isDragOver = ref(false);
const uploadError = ref("");

// Import process
const step = ref<"upload" | "preview" | "success">("upload");
const parsedData = ref<ImportRow[]>([]);
const importing = ref(false);
const importedCount = ref(0);
const skippedCount = ref(0);

// Computed properties
const validRows = computed(() => parsedData.value.filter((row) => row.errors.length === 0));
const invalidRows = computed(() => parsedData.value.filter((row) => row.errors.length > 0));
const previewRows = computed(() => parsedData.value.slice(0, 10)); // Show first 10 rows

// File handling
const triggerFileSelect = () => {
  fileInput.value?.click();
};

const handleDragOver = () => {
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

const processFile = (file: File) => {
  uploadError.value = "";

  // Validate file type
  if (!file.name.toLowerCase().endsWith(".csv")) {
    uploadError.value = "Please select a CSV file";
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = "File size must be less than 5MB";
    return;
  }

  // Read file
  const reader = new FileReader();
  reader.onload = (e) => {
    const csvText = e.target?.result as string;
    parseCSV(csvText);
  };
  reader.onerror = () => {
    uploadError.value = "Error reading file";
  };
  reader.readAsText(file);
};

const parseCSV = (csvText: string) => {
  try {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      uploadError.value = "CSV file must have at least a header row and one data row";
      return;
    }

    // Parse header
    const header = lines[0].split(",").map((col) => col.trim().toLowerCase());

    // Validate required columns
    const requiredColumns = ["first_name", "last_name", "phone", "address"];
    const missingColumns = requiredColumns.filter((col) => !header.includes(col));

    if (missingColumns.length > 0) {
      uploadError.value = `Missing required columns: ${missingColumns.join(", ")}`;
      return;
    }

    // Parse data rows
    const rows: ImportRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0) continue; // Skip empty lines

      const rowData: Record<string, string> = {};
      header.forEach((col, index) => {
        rowData[col] = values[index] || "";
      });

      // Validate row data
      const validation = customersStore.validateCustomerData(rowData);

      rows.push({
        data: rowData,
        errors: validation.errors,
        rowIndex: i - 1,
      });
    }

    if (rows.length === 0) {
      uploadError.value = "No valid data rows found in CSV";
      return;
    }

    parsedData.value = rows;
    step.value = "preview";
  } catch (error) {
    uploadError.value = "Error parsing CSV file";
    console.error("CSV parsing error:", error);
  }
};

// Simple CSV line parser (handles basic cases)
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

const importCustomers = async () => {
  if (!authStore.user?.id) return;

  importing.value = true;

  try {
    // Prepare customer data for import
    const customersToImport = validRows.value.map((row) => ({
      first_name: row.data.first_name.trim(),
      last_name: row.data.last_name.trim(),
      phone: row.data.phone.trim(),
      address: row.data.address.trim(),
      latitude: row.data.latitude ? Number(row.data.latitude) || undefined : undefined,
      longitude: row.data.longitude ? Number(row.data.longitude) || undefined : undefined,
      user_id: authStore.user?.id || "",
    }));

    // Import customers
    await customersStore.bulkCreateCustomers(customersToImport);

    importedCount.value = validRows.value.length;
    skippedCount.value = invalidRows.value.length;
    step.value = "success";

    emit("success", importedCount.value);
  } catch (error) {
    uploadError.value = "Failed to import customers. Please try again.";
    console.error("Import error:", error);
  } finally {
    importing.value = false;
  }
};

const goBackToUpload = () => {
  step.value = "upload";
  parsedData.value = [];
  uploadError.value = "";
};

const resetImport = () => {
  step.value = "upload";
  parsedData.value = [];
  uploadError.value = "";
  importedCount.value = 0;
  skippedCount.value = 0;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
</script>

<style scoped>
.csv-import {
  padding: 1.5rem;
  max-width: 800px;
  width: 100%;
}

/* Upload Section */
.upload-header {
  text-align: center;
  margin-bottom: 2rem;
}

.upload-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.upload-description {
  color: #6b7280;
  margin: 0;
}

.file-drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9fafb;
}

.file-drop-zone:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.file-drop-zone.drag-over {
  border-color: #3b82f6;
  background: #dbeafe;
}

.file-drop-zone.has-error {
  border-color: #ef4444;
  background: #fef2f2;
}

.file-input {
  display: none;
}

.upload-icon {
  width: 3rem;
  height: 3rem;
  color: #6b7280;
  margin: 0 auto 1rem;
}

.drop-zone-text {
  font-size: 1.125rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.upload-action {
  color: #3b82f6;
  font-weight: 500;
}

.file-types {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
  margin: 1rem 0;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.format-example {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
}

.format-example h4 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1rem;
}

.csv-example {
  background: #1f2937;
  color: #e5e7eb;
  padding: 1rem;
  border-radius: 0.375rem;
  font-family: "Courier New", monospace;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.format-note {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Preview Section */
.preview-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.preview-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.preview-description {
  color: #6b7280;
  margin: 0;
}

.import-summary {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.summary-item {
  text-align: center;
}

.summary-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.summary-number.valid {
  color: #059669;
}

.summary-number.invalid {
  color: #ef4444;
}

.summary-number.total {
  color: #3b82f6;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-container {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-bottom: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th {
  background: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
}

.preview-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.error-row {
  background: #fef2f2;
}

.status-cell {
  text-align: center;
  width: 60px;
}

.status-icon {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25rem;
}

.status-icon.valid {
  background: #d1fae5;
  color: #059669;
}

.status-icon.invalid {
  background: #fee2e2;
  color: #ef4444;
}

.address-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-muted {
  color: #6b7280;
  font-style: italic;
}

.error-details {
  margin-bottom: 2rem;
}

.error-details h4 {
  color: #ef4444;
  margin: 0 0 1rem 0;
}

.error-list {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
}

.error-item {
  margin-bottom: 1rem;
}

.error-item:last-child {
  margin-bottom: 0;
}

.error-messages {
  margin: 0.5rem 0 0 1rem;
  padding: 0;
  list-style: disc;
}

.error-messages li {
  color: #ef4444;
  font-size: 0.875rem;
}

.more-errors {
  color: #6b7280;
  font-style: italic;
  margin: 1rem 0 0 0;
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

/* Success Section */
.success-section {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  width: 4rem;
  height: 4rem;
  color: #059669;
  margin: 0 auto 1rem;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.success-message {
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.btn svg {
  width: 1rem;
  height: 1rem;
}

.btn.primary {
  background: #3b82f6;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn.secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .csv-import {
    padding: 1rem;
  }

  .file-drop-zone {
    padding: 2rem 1rem;
  }

  .import-summary {
    gap: 1rem;
  }

  .summary-number {
    font-size: 1.5rem;
  }

  .preview-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .table-container {
    font-size: 0.875rem;
  }

  .preview-table th,
  .preview-table td {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .upload-title,
  .preview-title {
    font-size: 1.25rem;
  }

  .format-example {
    padding: 1rem;
  }

  .csv-example {
    font-size: 0.75rem;
    padding: 0.75rem;
  }
}
</style>
