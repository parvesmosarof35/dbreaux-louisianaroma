# Maison Louisianaroma — Product Integration Guide
## Dynamic Product Creation & Updates with `sectiontwo` Editorial Blocks

This guide provides a comprehensive walkthrough for front-end developers integrating the product creation and updating forms in the admin dashboard (`app/admin/products/page.tsx`). It details the schema, multi-part form structure, and how to handle the two-step image uploading flow required for editorial card components.

---

## 1. Core Data Models & Schema

The backend uses a NestJS server backed by MongoDB (Prisma) and uses `Zod` validation. Here is the structure of the fields involved:

### The `sectiontwo` Type (Editorial Block)
```typescript
interface SectionTwoCard {
  image: string;       // ⚠️ MUST be a resolved, secure Cloudinary URL. (No raw File or empty strings)
  slogan: string;      // e.g. "Pure Elegance" (Min 2 chars)
  title: string;       // e.g. "Morning Bloom" (Min 2 chars)
  description: string; // e.g. "Harvested at dawn..." (Min 5 chars)
}

interface SectionTwo {
  show: boolean;         // Toggles visibility on the client detail page (Default: true)
  title: string;         // Main heading of the editorial block (Min 2 chars)
  description: string;   // Paragraph under the heading (Min 5 chars)
  cards: SectionTwoCard[]; // List of editorial cards
}
```

### The Product Form Type
```typescript
interface ProductForm {
  name: string;             // Name of the masterpiece (Min 2 chars)
  label: string;            // Secondary brand label (Min 2 chars)
  category: string;         // MongoDB ObjectId of the Collection
  price: string | number;   // Must be a positive number
  stock: string | number;   // Int, optional
  description: string;      // HTML or plain text narrative
  isfeatured: boolean;      // Displays on the home showcase
  isAvailable: boolean;     // Available to purchase (Default: true)
  hasfreedelivery: boolean; // Enables free delivery banner
  sizes: string[];          // e.g. ["30ml", "50ml", "100ml"]
  tags: string[];          // e.g. ["floral", "oud", "summer"]
  faqs: {                   // Frequently Asked Questions array
    question: string;
    answer: string;
    isvisible: boolean;
  }[];
  existingImages: {         // Stored images carried over in edit mode
    image: string;
    position: number;
  }[];
  sectiontwo: SectionTwo | null; // Nullable if the section is not wanted
}
```

---

## 2. API Communication Protocol

All write operations (`POST /create_product` and `PATCH /update_product/:id`) use **`multipart/form-data`**. The body is split into two distinct channels:

| Request Key | Content-Type / Nature | Purpose |
| :--- | :--- | :--- |
| **`data`** | `text/plain` (JSON Stringified) | Holds **all text, numbers, arrays, and nested structures** (e.g. sizes, FAQs, tags, existing images, and the complete `sectiontwo` object). |
| **`files`** | `file` (Binary Image Files) | Optional list of **new product gallery images**. The backend automatically uploads these to Cloudinary, positions them, and appends them to the product gallery. |

---

## 3. Product Gallery vs. SectionTwo Cards (The 2 Upload Patterns)

To prevent massive payload sizes and network timeouts, the system separates image uploads into two clean, predictable pipelines:

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 Form Submission Flow                   │
                  └───────────────────────────┬────────────────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         [1] Product Gallery Images                      [2] SectionTwo Card Images
      ┌──────────────────────────────┐                ┌──────────────────────────────┐
      │ Raw files are appended directly│                │ Must be uploaded to Cloud-   │
      │ into FormData as `files`.    │                │ inary FIRST from the form.   │
      │                              │                │                              │
      │   fd.append("files", file)   │                │ POST /products/upload_image  │
      │                              │                │                              │
      │ Backend handles upload automatically          │ Injects Cloudinary URL into  │
      │ and merges with the product. │                │ card.image before submit!    │
      └──────────────────────────────┘                └──────────────────────────────┘
```

---

## 4. Step-by-Step Frontend Workflow

Follow this precise sequence inside your React/Next.js dashboard when saving a product:

### Step 4.1: Upload Card Images Immediately on Selection
When an admin selects a file for a `sectiontwo` card, upload it immediately via the dedicated `/upload_image` endpoint. This gives a premium, interactive user experience with loaders and verification marks.

Use the custom front-end utility `uploadCardImage.ts`:
```typescript
// utils/uploadCardImage.ts
import { url } from "@/store/config/envConfig";

export async function uploadCardImage(file: File, token: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${url}products/upload_image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body?.error?.message || body?.message || `Upload failed (${res.status})`
    );
  }

  const data = await res.json();
  return data.url as string; // Return secure Cloudinary URL
}
```

Implement the state handler inside `page.tsx`:
```typescript
const handleCardImageUpload = async (cardIndex: number, file: File) => {
  // Update state to "uploading" and store the file
  setS2Card(cardIndex, { imageFile: file, uploadState: "uploading", imageUrl: "" });
  try {
    const cloudUrl = await uploadCardImage(file, token || "");
    // Success: store URL and update state to "done"
    setS2Card(cardIndex, { imageUrl: cloudUrl, uploadState: "done" });
    showToast(`Card ${cardIndex + 1} image uploaded successfully.`, "success");
  } catch (err: any) {
    setS2Card(cardIndex, { uploadState: "error" });
    showToast(err.message || "Card image upload failed.", "error");
  }
};
```

### Step 4.2: Build the `FormData` Payload
Serialize the fields into the unified `data` parameter and append the main product files under `files`. 

```typescript
const buildFormData = (): FormData => {
  const fd = new FormData();

  const jsonPayload: Record<string, any> = {
    name:            formData.name,
    label:           formData.label || formData.name,
    category:        formData.category,
    price:           parseFloat(formData.price),
    description:     formData.description || undefined,
    isfeatured:      formData.isfeatured,
    isAvailable:     formData.isAvailable,
    hasfreedelivery: formData.hasfreedelivery,
    sizes:           formData.sizes.length > 0 ? formData.sizes : undefined,
    tags:            formData.tags.length > 0 ? formData.tags : undefined,
    faqs:            formData.faqs.length > 0 ? formData.faqs : undefined,
    
    // Carry over existing images during updates
    images:          formData.existingImages.length > 0 ? formData.existingImages : undefined,

    // Serialize sectiontwo editorial blocks if enabled
    sectiontwo: formData.sectiontwo
      ? {
          show:        formData.sectiontwo.show,
          title:       formData.sectiontwo.title,
          description: formData.sectiontwo.description,
          cards: formData.sectiontwo.cards
            .filter((c) => c.imageUrl.startsWith("http")) // Strict filter: only uploaded card URLs
            .map((c) => ({
              image:       c.imageUrl,
              slogan:      c.slogan,
              title:       c.title,
              description: c.description,
            })),
        }
      : undefined,
  };

  if (formData.stock !== "") {
    jsonPayload.stock = parseInt(formData.stock, 10);
  }

  // 1. Pack the JSON payload under "data"
  fd.append("data", JSON.stringify(jsonPayload));

  // 2. Pack the main product gallery files under "files"
  imageFiles.forEach((file) => {
    fd.append("files", file);
  });

  return fd;
};
```

---

## 5. Product Creation vs. Update Rules

| Operation | Method / Route | Form state handling | File upload behavior |
| :--- | :--- | :--- | :--- |
| **Create** | `POST /create_product` | Reset all inputs to `emptyForm`. `existingImages` is initialized as empty `[]`. | Main gallery files appended to `files` will populate the product's default images. |
| **Update** | `PATCH /update_product/:id` | Populate state with existing data. Map current product images to `existingImages` to retain them on submit. | Optional: If new files are uploaded under `files`, they will override the existing gallery or append based on backend configuration. |

### Best Practice for Updates (Important):
When loading editing mode, always populate `existingImages` with the current product images:
```typescript
const handleOpenEdit = (product: any) => {
  setEditingId(product.id || product._id);
  
  const existingImages = Array.isArray(product.images)
    ? product.images.map((img: any, idx: number) => ({
        image: typeof img === "object" ? img.image : img,
        position: img.position ?? idx
      }))
    : [];

  setFormData({
    ...emptyForm,
    name: product.name,
    existingImages,
    // Map rest of fields...
  });
};
```

---

## 6. Premium UX Features

1. **Upload States**: The card selection interface uses custom visual indicators corresponding to `idle`, `uploading`, `done`, and `error` states to notify the admin:
   - `uploading`: Disables input and shows a subtle gold spinner.
   - `done`: Displays a green checkmark `✓ Uploaded` and showcases the live preview directly inside the card form.
   - `error`: Highlights the box in a subtle red tint with a retry button.
2. **Graceful Submissions**: Since Zod prohibits saving cards with empty image URLs, the `buildFormData` logic acts as a safeguard. It filters out card segments lacking a live `http` link, keeping the database perfectly structured and clean.
3. **Responsive Previews**: Dynamic CSS transforms allow instant image previews, providing instant visual feedback before executing edits on the main database catalog.
