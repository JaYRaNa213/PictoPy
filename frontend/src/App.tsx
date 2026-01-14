import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from '@/routes/AppRoutes';
import { ThemeProvider } from '@/contexts/ThemeContext';
import QueryClientProviders from '@/config/QueryClientProvider';
import { GlobalLoader } from './components/Loader/GlobalLoader';
import { InfoDialog } from './components/Dialog/InfoDialog';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';
import { useEffect } from 'react';
import { selectImages } from '@/features/imageSelectors';
import { useImagesStore } from '@/store/imagesStore';
import { usePictoQuery } from '@/hooks/useQueryExtension';
import { fetchAllImages } from '@/api/api-functions';
import { setImages } from '@/features/imageSlice';
import { Image } from '@/types/Media';
import { useMutationFeedback } from '@/hooks/useMutationFeedback';

/**
 * AppInitializer handles global data fetching and state synchronization.
 * It must be rendered within QueryClientProviders.
 */
const AppInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const images = useSelector(selectImages);
  const setZustandImages = useImagesStore((s) => s.setImages);
  const searchState = useSelector((state: RootState) => state.search);
  const isSearchActive = searchState.active;

  /* Global Image Fetching */
  const { data, isLoading, isSuccess, isError, error } = usePictoQuery({
    queryKey: ['images'],
    queryFn: () => fetchAllImages(),
    enabled: !isSearchActive,
  });

  useMutationFeedback(
    { isPending: isLoading, isSuccess, isError, error },
    {
      loadingMessage: 'Loading images',
      showSuccess: false,
      errorTitle: 'Error',
      errorMessage: 'Failed to load images. Please try again later.',
    },
  );

  useEffect(() => {
    if (!isSearchActive && isSuccess) {
      const images = data?.data as Image[];
      dispatch(setImages(images));
    }
  }, [data, isSuccess, dispatch, isSearchActive]);

  /* Sync Redux to Zustand */
  useEffect(() => {
    setZustandImages(images);
  }, [images, setZustandImages]);

  return null;
};

const App: React.FC = () => {
  const { loading, message } = useSelector((state: RootState) => state.loader);
  const {
    isOpen,
    title,
    message: infoMessage,
    variant,
    showCloseButton,
  } = useSelector((state: RootState) => state.infoDialog);

  return (
    <ThemeProvider>
      <QueryClientProviders>
        <AppInitializer />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <GlobalLoader loading={loading} message={message} />
        <InfoDialog
          isOpen={isOpen}
          title={title}
          message={infoMessage}
          variant={variant}
          showCloseButton={showCloseButton}
        />
      </QueryClientProviders>
    </ThemeProvider>
  );
};

export default App;
