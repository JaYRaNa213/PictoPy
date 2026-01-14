import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useImagesStore, selectImagesWithGPS } from '@/store/imagesStore';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
const icon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
});

function MapBoundsListener() {
    const setMapBounds = useImagesStore((s) => s.setMapBounds);

    useMapEvents({
        moveend: (e) => {
            const bounds = e.target.getBounds();
            setMapBounds({
                minLat: bounds.getSouth(),
                maxLat: bounds.getNorth(),
                minLng: bounds.getWest(),
                maxLng: bounds.getEast(),
            });
        },
    });

    return null;
}


export default function PhotoMap() {
    // Subscribe to imagesWithGPS from the store
    const imagesWithGPS = useImagesStore(selectImagesWithGPS);

    return (
        <div className="h-full w-full">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                className="h-full w-full"
                style={{ minHeight: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapBoundsListener />

                <MarkerClusterGroup>
                    {imagesWithGPS.map((img) => (
                        <Marker
                            key={img.id}
                            position={[img.metadata!.gps!.latitude, img.metadata!.gps!.longitude]}
                            icon={icon}
                        >
                            <Popup>
                                <div className="flex flex-col items-center">
                                    <img
                                        src={img.thumbnailPath || img.path} // Fallback to path if thumbnail missing
                                        alt={img.metadata?.name || 'Image'}
                                        className="w-32 rounded object-cover"
                                        style={{ maxHeight: '150px' }}
                                    />
                                    <span className="text-xs mt-1 font-semibold">{img.metadata?.name}</span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}
