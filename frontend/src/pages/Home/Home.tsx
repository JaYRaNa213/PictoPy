import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ChronologicalGallery,
  MonthMarker,
} from '@/components/Media/ChronologicalGallery';
import TimelineScrollbar from '@/components/Timeline/TimelineScrollbar';
import { selectImages } from '@/features/imageSelectors';
import { RootState } from '@/app/store';
import { EmptyGalleryState } from '@/components/EmptyStates/EmptyGalleryState';
import { useImagesStore, selectFilteredImages } from '@/store/imagesStore';
import { FilteredEmptyState } from '@/components/EmptyStates/FilteredEmptyState';

export const Home = () => {
  const images = useSelector(selectImages);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [monthMarkers, setMonthMarkers] = useState<MonthMarker[]>([]);
  const searchState = useSelector((state: RootState) => state.search);
  const isSearchActive = searchState.active;

  /* Get filtered images from Zustand */
  const filteredImages = useImagesStore(selectFilteredImages);
  const mapBounds = useImagesStore((state) => state.mapBounds);
  const setMapBounds = useImagesStore((state) => state.setMapBounds);

  const title =
    isSearchActive && images.length > 0
      ? `Face Search Results (${images.length} found)`
      : 'Image Gallery';

  return (
    <div className="relative flex h-full flex-col pr-6">
      {/* Map Filter Status Banner */}
      {mapBounds && (
        <div className="bg-primary/10 border-primary/20 mb-4 flex items-center justify-between rounded-lg border px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-muted-foreground">
              Filtering by Map View ({filteredImages.length} results)
            </span>
          </div>
          <button
            onClick={() => setMapBounds(null)}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            Clear Map Filter
          </button>
        </div>
      )}

      {/* Gallery Section */}
      <div
        ref={scrollableRef}
        className="hide-scrollbar flex-1 overflow-x-hidden overflow-y-auto"
      >
        {filteredImages.length > 0 ? (
          <ChronologicalGallery
            images={filteredImages}
            showTitle={true}
            title={title}
            onMonthOffsetsChange={setMonthMarkers}
            scrollContainerRef={scrollableRef}
          />
        ) : mapBounds ? (
          <FilteredEmptyState onClearFilter={() => setMapBounds(null)} />
        ) : (
          <EmptyGalleryState />
        )}
      </div>

      {/* Timeline Scrollbar */}
      {monthMarkers.length > 0 && (
        <TimelineScrollbar
          scrollableRef={scrollableRef}
          monthMarkers={monthMarkers}
          className="absolute top-0 right-0 h-full w-4"
        />
      )}
    </div>
  );
};
