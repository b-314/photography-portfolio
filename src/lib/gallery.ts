import type { ImageMetadata } from "astro";

export interface GalleryImage {
    category: string;
    name: string;
    path: string;
    image: ImageMetadata;
}

const modules = import.meta.glob<{
    default: ImageMetadata;
}>("../assets/images/*/*.{jpg,JPG,jpeg,png,webp,avif}", {
    eager: true
});

const gallery: GalleryImage[] = [];

for (const [path, mod] of Object.entries(modules)) {
    // Example path: ../assets/images/plants/flower.jpg
    const parts = path.split("/");
    const category = parts[parts.length - 2];
    const filename = parts[parts.length - 1];
    const name = filename.replace(/\.[^.]+$/, "");

    gallery.push({category, name, path, image: mod.default});
}

// Alphabetize everything once.
gallery.sort((a, b) => {
    if (a.category === b.category) {
        return a.name.localeCompare(b.name);
    }

    return a.category.localeCompare(b.category);
});

export function getImages() {
    return gallery;
}

export function getImagesByCategory(category: string) {
    return gallery.filter(image => image.category === category);
}

export function getCategories() {
    return [...new Set(gallery.map(image => image.category))];
}

export function categoryExists(category: string) {
    return getCategories().includes(category);
}

export function getImage(category: string, name: string) {
    return gallery.find(image => image.category === category &&image.name === name);
}