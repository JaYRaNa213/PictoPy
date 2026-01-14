import { create } from 'zustand';
import { createSelector } from '@reduxjs/toolkit';
import { Image } from '@/types/Media';

interface MapBounds {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}

interface ImagesState {
    images: Image[];
    mapBounds: MapBounds | null;
    setImages: (images: Image[]) => void;
    setMapBounds: (bounds: MapBounds | null) => void;
}

export const useImagesStore = create<ImagesState>((set) => ({
    images: [],
    mapBounds: null,
    setImages: (images) => set({ images }),
    setMapBounds: (bounds) => set({ mapBounds: bounds }),
}));

// Selectors
const selectImages = (state: ImagesState) => state.images;
const selectMapBounds = (state: ImagesState) => state.mapBounds;

export const selectImagesWithGPS = createSelector([selectImages], (images) => {
    return images.filter(
        (i) =>
            i.metadata?.gps &&
            typeof i.metadata.gps.latitude === 'number' &&
            typeof i.metadata.gps.longitude === 'number',
    );
});

export const selectFilteredImages = createSelector(
    [selectImages, selectMapBounds],
    (images, mapBounds) => {
        if (!mapBounds) return images;

        return images.filter((img) => {
            const gps = img.metadata?.gps;
            if (!gps) return false;

            return (
                gps.latitude >= mapBounds.minLat &&
                gps.latitude <= mapBounds.maxLat &&
                gps.longitude >= mapBounds.minLng &&
                gps.longitude <= mapBounds.maxLng
            );
        });
    },
);
