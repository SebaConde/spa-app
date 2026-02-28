import React, { useState, useEffect, useRef, useCallback } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import { Input } from "@/components/ui/input";

interface NominatimResult {
  place_id?: string;
  display_name: string;
  lon: string;
  lat: string;
}

const LocationSelection = ({
  selectedLocationObject,
  setSelectedLocationObject,
  hideMap = false,
}: {
  selectedLocationObject: NominatimResult | null;
  setSelectedLocationObject: (location: NominatimResult) => void;
  hideMap?: boolean;
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Inicializar el mapa solo si el div existe y no está oculto
  useEffect(() => {
    if (hideMap || !mapDivRef.current) return;

    const map = new Map({
      target: mapDivRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: fromLonLat([78.4867, 17.385]),
        zoom: 12,
      }),
    });

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, [hideMap]);

  // Solo lógica del mapa — sin ningún setState, seguro para llamar desde effects
  const updateMap = useCallback((location: NominatimResult) => {
    if (!mapRef.current) return;

    const coords = fromLonLat([parseFloat(location.lon), parseFloat(location.lat)]);

    mapRef.current.getView().animate({ center: coords, zoom: 14 });

    if (vectorLayerRef.current) {
      mapRef.current.removeLayer(vectorLayerRef.current);
    }

    const marker = new Feature({ geometry: new Point(coords) });
    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
        }),
      })
    );

    const vectorLayer = new VectorLayer({
      source: new VectorSource({ features: [marker] }),
    });

    vectorLayerRef.current = vectorLayer;
    mapRef.current.addLayer(vectorLayer);
  }, []);

  // Llamado desde eventos del UI — puede llamar setState libremente
  const handleSelectLocation = useCallback(
    (location: NominatimResult) => {
      setSelectedLocationObject(location);
      setQuery(location.display_name);
      setSuggestions([]);
      updateMap(location);
    },
    [setSelectedLocationObject, updateMap]
  );

  // Handler del input: todo el setState ocurre aquí (event handler), no en un effect
  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length <= 2) {
      setSuggestions([]);
      setFetchError(null);
    }
  }, []);

  // Effect solo para el fetch.
  // setState solo ocurre dentro de callbacks async (.then/.catch), nunca en el cuerpo del effect
  useEffect(() => {
    if (query.length <= 2) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Error al buscar la ubicación");
          return res.json();
        })
        .then((data: NominatimResult[]) => {
          setSuggestions(data);  // ✅ callback async — válido
          setFetchError(null);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setFetchError("No se pudieron cargar las sugerencias.");
            console.error(err);
          }
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Sincroniza el mapa cuando selectedLocationObject cambia desde el padre
  // Solo llama updateMap (sin setState) — no genera cascading renders
  useEffect(() => {
    if (selectedLocationObject?.display_name) {
      updateMap(selectedLocationObject);
    }
  }, [selectedLocationObject, updateMap]);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search for a location"
        value={query}
        onChange={handleQueryChange}
      />

      {fetchError && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {fetchError}
        </p>
      )}

      <div
        style={{
          position: "absolute",
          background: "#fff",
          width: "300px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        {suggestions.map((place) => (
          <div
            key={place.place_id}
            onClick={() => handleSelectLocation(place)}
            style={{
              padding: "8px",
              cursor: "pointer",
              borderBottom: "1px solid #ddd",
            }}
          >
            {place.display_name}
          </div>
        ))}
      </div>

      {!hideMap && (
        <div
          ref={mapDivRef}
          style={{ width: "100%", height: "400px", marginTop: "10px" }}
        />
      )}
    </div>
  );
};

export default LocationSelection;