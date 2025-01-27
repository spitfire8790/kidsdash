import React from 'react';
import { Camera, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { tuyaService } from '../services/tuyaService';

interface CameraFeedProps {
  deviceId: string;
  feedUrl?: string;
}

export function CameraFeed({ deviceId, feedUrl }: CameraFeedProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [streamUrl, setStreamUrl] = React.useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    async function initializeCamera() {
      try {
        if (!feedUrl) {
          const stream = await tuyaService.getCameraStream(deviceId);
          setStreamUrl(stream.url);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize camera');
        setIsLoading(false);
      }
    }

    initializeCamera();
  }, [deviceId, feedUrl]);

  const handlePTZControl = async (direction: 'up' | 'down' | 'left' | 'right') => {
    try {
      await tuyaService.controlPTZ(deviceId, direction);
    } catch (err) {
      console.error('Failed to control camera:', err);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4 text-red-800">
        <p className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          <span>Error loading camera feed: {error}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-300">Connecting to camera...</p>
          </div>
        </div>
      )}
      
      <div className="aspect-video relative">
        {(feedUrl || streamUrl) && (
          <video
            ref={videoRef}
            src={feedUrl || streamUrl || ''}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            onLoadedData={() => setIsLoading(false)}
            onError={() => setError('Failed to load camera feed')}
          />
        )}
        
        {/* Camera controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
            <button
              onClick={() => handlePTZControl('up')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Pan camera up"
            >
              <ArrowUp className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
            <button
              onClick={() => handlePTZControl('left')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Pan camera left"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => handlePTZControl('down')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Pan camera down"
            >
              <ArrowDown className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => handlePTZControl('right')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Pan camera right"
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
          <div className="bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <p className="text-xs text-white flex items-center gap-1">
              <Camera className="w-4 h-4" />
              Live
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 