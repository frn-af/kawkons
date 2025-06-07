// components/MapTooltip.tsx
import React from 'react';

// Types
interface HoverInfo {
  feature: GeoJSON.Feature;
  x: number;
  y: number;
}

interface MapTooltipProps {
  hoverInfo: HoverInfo | null;
}

export const MapTooltip: React.FC<MapTooltipProps> = ({ hoverInfo }) => {
  if (!hoverInfo) return null;

  const { feature, x, y } = hoverInfo;
  const properties = feature.properties || {};

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: x + 10,
        top: y - 10,
        transform: 'translate(0, -100%)'
      }}
    >
      <div className="bg-background backdrop-blur-sm border rounded-lg shadow-lg px-3 py-2 max-w-xs">
        <div className="space-y-0">
          {/* Display primary feature properties */}
          {properties.NKWS && (
            <div className="font-semibold text-sm">
              {properties.NKWS}
            </div>
          )}
          {properties.Area && (
            <div className="text-xs ">
              Area: {properties.Area}
            </div>
          )}
          {properties.area && (
            <div className="text-xs ">
              Area: {properties.area}
            </div>
          )}
          {properties.population && (
            <div className="text-xs ">
              Population: {properties.population.toLocaleString()}
            </div>
          )}

          {/* Fallback for when no specific properties are available */}
          {!properties.name && !properties.type && !properties.area && !properties.population && (
            <div className="text-xs ">
              {Object.keys(properties).length > 0 ? (
                <div>
                  {Object.entries(properties)
                    .slice(0, 3)
                    .map(([key, value]) => (
                      <div key={key}>
                        {key}: {String(value)}
                      </div>
                    ))}
                </div>
              ) : (
                <div>Feature information</div>
              )}
            </div>
          )}
        </div>

        {/* Small arrow pointing to the feature */}
        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background/95"></div>
      </div>
    </div>
  );
};

// Export types for use in other components
export type { HoverInfo, MapTooltipProps };
