import { MapPinOff } from 'lucide-react';

interface FilteredEmptyStateProps {
    onClearFilter: () => void;
}

export const FilteredEmptyState = ({ onClearFilter }: FilteredEmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 rounded-full bg-blue-50 p-4 dark:bg-blue-900/20">
                <MapPinOff className="h-16 w-16 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
                No Photos in This Area
            </h2>
            <p className="mb-6 max-w-md text-gray-500 dark:text-gray-400">
                We couldn't find any photos with GPS data in the region currently selected on the map.
            </p>
            <button
                onClick={onClearFilter}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
                Clear Map Filter
            </button>
        </div>
    );
};
