import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { MapPin, X, Layers, Navigation, Home, Filter, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PROPERTIES } from '@/constants/properties';
import type { Property, PropertyType } from '@/constants/properties';

type ViewMode = '2d' | '3d' | 'satellite';
type GeoResult = {
  lat: string;
  lon: string;
  display_name: string;
};

interface Filters {
  priceMin: number | null;
  priceMax: number | null;
  bedroomsMin: number;
  types: Set<PropertyType>;
}

function getPropertyEmoji(type: PropertyType): string {
  switch (type) {
    case 'MAISON':
      return '🏠';
    case 'APPARTEMENT':
      return '🏢';
    case 'TERRAIN':
      return '🌳';
    case 'COMMERCE':
      return '🏪';
    case 'BUREAU':
      return '💼';
    default:
      return '📍';
  }
}

function injectLinkOnce(id: string, href: string, rel: string = 'stylesheet') {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('link');
  el.id = id;
  el.rel = rel;
  el.href = href;
  document.head.appendChild(el);
}

function injectScriptOnce(id: string, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document not available'));
      return;
    }

    const existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed loading ${src}`)));
      return;
    }

    const s = document.createElement('script');
    s.id = id;
    s.src = src;
    s.async = true;
    s.addEventListener('load', () => {
      s.dataset.loaded = 'true';
      resolve();
    });
    s.addEventListener('error', () => reject(new Error(`Failed loading ${src}`)));
    document.body.appendChild(s);
  });
}

export default function MapViewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { format } = useCurrency();

  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('2d');
  const [isMapReady, setIsMapReady] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    priceMin: null,
    priceMax: null,
    bedroomsMin: 0,
    types: new Set(),
  });
  const [priceMinInput, setPriceMinInput] = useState('');
  const [priceMaxInput, setPriceMaxInput] = useState('');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);

  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const osmbRef = useRef<any>(null);
  const osmbOverlayRef = useRef<any>(null);
  const layersRef = useRef<{ base: any; satellite: any; labels: any }>({
    base: null,
    satellite: null,
    labels: null,
  });
  const markersRef = useRef<Map<string, any>>(new Map());
  const clusterGroupRef = useRef<any>(null);

  const centerAbidjan = useMemo(() => [5.3364, -4.0267] as [number, number], []);

  const properties = useMemo(() => PROPERTIES, []);

  const ALL_TYPES = useMemo(
    () => Array.from(new Set(properties.map((p: Property) => p.type))).filter(Boolean) as PropertyType[],
    [properties]
  );

  const filtered = useMemo(() => {
    const min = filters.priceMin ?? -Infinity;
    const max = filters.priceMax ?? Infinity;
    const bed = filters.bedroomsMin ?? 0;
    const types = filters.types;

    return properties.filter((p: Property) => {
      const price = p.price ?? 0;
      const inPrice = price >= min && price <= max;
      const inBeds = (p.bedrooms ?? 0) >= bed;
      const inType = types.size === 0 || types.has(p.type);
      return inPrice && inBeds && inType;
    });
  }, [properties, filters]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    console.log('[Map] Initializing with', PROPERTIES.length, 'properties');

    injectLinkOnce('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    injectLinkOnce('osmb-css', 'https://cdn.osmbuildings.org/OSMBuildings-Leaflet.css');
    injectLinkOnce(
      'mc-css',
      'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css'
    );
    injectLinkOnce(
      'mc-css-def',
      'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css'
    );

    if (!document.getElementById('custom-map-styles')) {
      const s = document.createElement('style');
      s.id = 'custom-map-styles';
      s.innerHTML = `
        /* Tooltip des propriétés */
        .leaflet-tooltip.property-tooltip{
          background:#fff;
          border:none;
          border-radius:12px;
          box-shadow:0 4px 16px rgba(0,0,0,.15);
          padding:0;
          max-width:260px;
        }
        .leaflet-tooltip.property-tooltip::before{display:none}
        .leaflet-marker-shadow{display:none!important}

        /* Container du marker avec pique */
        .custom-marker{
          transition:transform .15s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }
        
        .custom-marker:hover{
          transform: scale(1.1);
          z-index: 1000 !important;
        }

        /* Badge principal avec emoji et prix - RÉDUIT DE 30% */
        .price-marker{
          background: white;
          border: 2px solid ${Colors.light.primary};
          border-radius: 18px;
          padding: 6px 10px;
          font-weight: 700;
          font-size: 11px;
          color: ${Colors.light.primary};
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 3px 8px rgba(0,0,0,.2);
          position: relative;
          z-index: 2;
        }

        .price-marker .emoji {
          font-size: 14px;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,.1));
        }

        .price-marker .price {
          font-size: 11px;
          font-weight: 800;
        }

        .price-marker:hover{
          background: ${Colors.light.primary};
          color: white;
          border-color: ${Colors.light.primary};
          transform: scale(1.05);
          box-shadow: 0 4px 14px rgba(234, 88, 12, .35);
        }

        /* Pique pointant vers le bas - RÉDUIT DE 30% */
        .marker-pin {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 11px solid ${Colors.light.primary};
          margin-top: -2px;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,.15));
          z-index: 1;
        }

        .custom-marker:hover .marker-pin {
          border-top-color: ${Colors.light.primary};
        }

        /* Point d'ancrage au sol - RÉDUIT DE 30% */
        .marker-anchor {
          width: 6px;
          height: 6px;
          background: ${Colors.light.primary};
          border-radius: 50%;
          margin-top: -3px;
          box-shadow: 0 1px 4px rgba(0,0,0,.25);
        }

        .custom-marker:hover .marker-anchor {
          width: 7px;
          height: 7px;
          margin-top: -3.5px;
        }

        /* Badge vérifié - RÉDUIT DE 30% */
        .verified-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #10B981;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,.15);
          z-index: 3;
        }

        /* Clusters - RÉDUITS DE 30% */
        .custom-cluster{background:transparent;border:none}
        .custom-cluster .cluster-badge{
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:999px;
          font-weight:800;
          color:#fff;
          box-shadow:0 4px 12px rgba(0,0,0,.2);
          border:2px solid rgba(255,255,255,.85);
        }
        .custom-cluster .cluster-badge.small{width:32px;height:32px;background:${Colors.light.primary}}
        .custom-cluster .cluster-badge.medium{width:42px;height:42px;background:${Colors.light.primary}}
        .custom-cluster .cluster-badge.large{width:52px;height:52px;background:${Colors.light.primary}}
        .custom-cluster .cluster-badge .emoji{margin-right:2px;font-size:12px}
        .custom-cluster .cluster-badge.small .count{font-size:11px}
        .custom-cluster .cluster-badge.medium .count{font-size:13px}
        .custom-cluster .cluster-badge.large .count{font-size:15px}
      `;
      document.head.appendChild(s);
    }

    (async () => {
      try {
        await injectScriptOnce(
          'leaflet-js',
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        );
        await injectScriptOnce('osmb-js', 'https://cdn.osmbuildings.org/OSMBuildings-Leaflet.js');
        await injectScriptOnce(
          'mc-js',
          'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'
        );
        initMap();
      } catch (e) {
        console.error('Error loading map scripts:', e);
      }
    })();

    return () => {
      const currentMarkers = markersRef.current;
      try {
        if (mapRef.current) {
          mapRef.current.off();
          mapRef.current.remove();
        }
      } catch (e) {
        console.error('Error cleaning up map:', e);
      }
      mapRef.current = null;
      osmbRef.current = null;
      currentMarkers.clear();
      clusterGroupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !LRef.current) return;
    applyViewMode(viewMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, isMapReady]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !LRef.current) return;
    addPropertyMarkers(mapRef.current, LRef.current, filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, isMapReady]);

  const initMap = useCallback(() => {
    const L = (window as any).L;
    if (!L) {
      console.error('Leaflet not available');
      return;
    }
    LRef.current = L;

    const container = document.getElementById('map-container');
    if (!container) return;

    const map = L.map('map-container', {
      center: centerAbidjan,
      zoom: 13,
      zoomControl: true,
      preferCanvas: true,
    });

    const basePane = map.getPane('base') || map.createPane('base');
    if (basePane) basePane.style.zIndex = '200';
    const labelsPane = map.getPane('labels') || map.createPane('labels');
    if (labelsPane) labelsPane.style.zIndex = '650';

    const base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
      pane: 'base',
    });
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        pane: 'base',
      }
    );
    const labels = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; CartoDB',
        pane: 'labels',
      }
    );

    layersRef.current = { base, satellite, labels };
    base.addTo(map);

    const clusterIconFn = (cluster: any) => {
      const count = cluster.getChildCount();
      const size = count < 10 ? 'small' : count < 50 ? 'medium' : 'large';
      const typeCounts: Record<string, number> = {};
      cluster.getAllChildMarkers().forEach((m: any) => {
        const t = (m && m.options && m.options._propertyType) || 'MAISON';
        typeCounts[t] = (typeCounts[t] || 0) + 1;
      });
      const topType =
        (Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as PropertyType) ||
        'MAISON';
      const emoji = getPropertyEmoji(topType);
      return L.divIcon({
        html: `<div class="cluster-badge ${size}"><span class="emoji">${emoji}</span><span class="count">${count}</span></div>`,
        className: 'custom-cluster',
        iconSize: undefined,
      });
    };

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 56,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: clusterIconFn,
    });
    clusterGroup.addTo(map);
    clusterGroupRef.current = clusterGroup;

    const OSMBOverlay = L.Layer.extend({
      onAdd: () => {
        ensureOSMBuildings();
        showOSMBuildings();
      },
      onRemove: () => {
        hideOSMBuildings();
      },
    });
    osmbOverlayRef.current = new OSMBOverlay();

    const baseLayers = { '🗺️ OSM': base, '🛰️ Satellite': satellite };
    const overlays = { '🏷️ Labels': labels, '🏗️ Bâtiments 3D': osmbOverlayRef.current };
    L.control.layers(baseLayers, overlays, { position: 'topright', collapsed: true }).addTo(map);

    const locateControl = L.control({ position: 'topleft' });
    locateControl.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      div.innerHTML =
        '<a href="#" title="Me localiser" style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;background:#fff;text-decoration:none;font-size:18px">🧭</a>';
      div.onclick = (e: Event) => {
        e.preventDefault();
        map.locate({ setView: true, maxZoom: 16 });
      };
      return div;
    };
    locateControl.addTo(map);

    map.on('locationfound', (e: any) => {
      L.circle(e.latlng, {
        radius: 200,
        color: Colors.light.primary,
        fillColor: Colors.light.primary,
        fillOpacity: 0.2,
      }).addTo(map);
    });

    addPropertyMarkers(map, L, filtered);

    mapRef.current = map;
    setIsMapReady(true);
    console.log('[Map] Initialization complete');
  }, [centerAbidjan, filtered]);

  const addPropertyMarkers = useCallback(
    (map: any, L: any, data: Property[]) => {
      if (clusterGroupRef.current) clusterGroupRef.current.clearLayers();
      markersRef.current.clear();

      console.log(`[Map] Adding ${data.length} property markers to map`);
      
      if (data.length === 0) {
        console.warn('[Map] No properties to display on map');
        return;
      }

      data.forEach((p) => {
        if (!p.latitude || !p.longitude) {
          console.warn(`[Map] Property ${p.id} has no coordinates:`, p);
          return;
        }
        const emoji = getPropertyEmoji(p.type);
        const formattedPrice = format(p.price, 'FCFA').replace(' FCFA', '');
        
        // Badge vérifié simulé (30% des propriétés)
        const isVerified = Math.random() > 0.7;
        
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="price-marker">
              <span class="emoji">${emoji}</span>
              <span class="price">${formattedPrice}</span>
              ${isVerified ? '<span class="verified-badge">✓</span>' : ''}
            </div>
            <div class="marker-pin"></div>
            <div class="marker-anchor"></div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 28], // AJUSTÉ (était 40)
          popupAnchor: [0, -28], // AJUSTÉ (était -40)
        });

        const marker = L.marker([p.latitude, p.longitude], {
          icon: customIcon,
          _propertyType: p.type,
        });

        const tooltipContent = `
        <div style="padding:0;min-width:220px">
          ${p.images && p.images[0] ? `<img src="${p.images[0]}" style="width:100%;height:120px;object-fit:cover;border-radius:8px 8px 0 0" />` : ''}
          <div style="padding:12px">
            <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:${Colors.light.text}">${p.title}</h3>
            <p style="margin:0 0 4px 0;font-size:16px;font-weight:700;color:${Colors.light.primary}">${format(p.price, 'FCFA')}</p>
            <p style="margin:0 0 4px 0;font-size:12px;color:${Colors.light.textSecondary}">${p.neighborhoodName || ''}</p>
            <p style="margin:0;font-size:12px;color:${Colors.light.textSecondary}">${p.surfaceArea}m²${p.bedrooms ? ` • ${p.bedrooms} ch.` : ''}</p>
          </div>
        </div>`;

        marker.bindTooltip(tooltipContent, {
          permanent: false,
          direction: 'top',
          offset: [0, -28],
          className: 'property-tooltip',
        });

        marker.on('click', () => {
          map.setView([p.latitude, p.longitude], Math.max(map.getZoom(), 15), {
            animate: true,
            duration: 0.8,
          });
          setSelectedProperty(p.id);
        });

        if (clusterGroupRef.current) clusterGroupRef.current.addLayer(marker);
        markersRef.current.set(p.id, marker);
      });

      console.log('[Map] All markers added successfully');
    },
    [format]
  );

  const ensureOSMBuildings = useCallback(() => {
    const map = mapRef.current;
    if (!map) return null;
    if (osmbRef.current) return osmbRef.current;
    const OSMBuildings = (window as any).OSMBuildings;
    if (!OSMBuildings) return null;
    const osmb = new OSMBuildings(map);
    osmb.load();
    osmbRef.current = osmb;
    return osmb;
  }, []);

  const hideOSMBuildings = useCallback(() => {
    if (typeof document === 'undefined') return;
    const el = document.querySelector('.osmbuildings-layer') as HTMLElement;
    if (el) el.style.display = 'none';
  }, []);

  const showOSMBuildings = useCallback(() => {
    if (typeof document === 'undefined') return;
    const el = document.querySelector('.osmbuildings-layer') as HTMLElement;
    if (el) el.style.display = 'block';
  }, []);

  const applyViewMode = useCallback(
    (mode: ViewMode) => {
      const map = mapRef.current;
      const L = LRef.current;
      if (!map || !L) return;

      Object.values(layersRef.current).forEach((lyr) => {
        if (lyr && map.hasLayer(lyr)) map.removeLayer(lyr);
      });
      const osmbOverlay = osmbOverlayRef.current;

      if (mode === '2d') {
        layersRef.current.base && layersRef.current.base.addTo(map);
        if (osmbOverlay && map.hasLayer(osmbOverlay)) map.removeLayer(osmbOverlay);
        hideOSMBuildings();
        map.setZoom(Math.max(map.getZoom(), 13));
      } else if (mode === '3d') {
        layersRef.current.base && layersRef.current.base.addTo(map);
        if (osmbOverlay && !map.hasLayer(osmbOverlay)) osmbOverlay.addTo(map);
        ensureOSMBuildings();
        showOSMBuildings();
        map.setZoom(Math.max(map.getZoom(), 16));
      } else if (mode === 'satellite') {
        layersRef.current.satellite && layersRef.current.satellite.addTo(map);
        layersRef.current.labels && layersRef.current.labels.addTo(map);
        if (osmbOverlay && map.hasLayer(osmbOverlay)) map.removeLayer(osmbOverlay);
        hideOSMBuildings();
        map.setZoom(Math.max(map.getZoom(), 15));
      }

      addPropertyMarkers(map, L, filtered);
      console.log(`[Map] View mode changed to: ${mode}`);
    },
    [filtered, addPropertyMarkers, hideOSMBuildings, showOSMBuildings, ensureOSMBuildings]
  );

  const cycleViewMode = useCallback(() => {
    setViewMode((m) => (m === '2d' ? '3d' : m === '3d' ? 'satellite' : '2d'));
  }, []);

  const getViewModeIcon = useCallback(() => {
    if (viewMode === '2d') return <Layers size={24} color="#fff" />;
    if (viewMode === '3d') return <Home size={24} color="#fff" />;
    return <MapPin size={24} color="#fff" />;
  }, [viewMode]);

  const getViewModeLabel = useCallback(() => {
    if (viewMode === '2d') return 'Vue 2D';
    if (viewMode === '3d') return 'Vue 3D';
    return 'Satellite';
  }, [viewMode]);

  const searchGeocode = useCallback(async () => {
    if (!query || !query.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=ci&q=${encodeURIComponent(query)}`;
      const r = await fetch(url);
      const data = await r.json();
      setResults(Array.isArray(data) ? data : []);
      setSearchOpen(true);
    } catch (e) {
      console.error('Geocoding error:', e);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const goToResult = useCallback((res: GeoResult) => {
    const lat = parseFloat(res.lat);
    const lon = parseFloat(res.lon);
    if (mapRef.current && isFinite(lat) && isFinite(lon)) {
      mapRef.current.setView([lat, lon], 15, { animate: true, duration: 1 });
    }
    setResults([]);
    setSearchOpen(false);
  }, []);

  const toggleType = useCallback((t: PropertyType) => {
    setFilters((f) => {
      const next = new Set(Array.from(f.types));
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return { ...f, types: next };
    });
  }, []);

  const applyPriceInputs = useCallback(() => {
    const min = priceMinInput ? parseInt(priceMinInput.replace(/\D/g, ''), 10) : null;
    const max = priceMaxInput ? parseInt(priceMaxInput.replace(/\D/g, ''), 10) : null;
    setFilters((f) => ({
      ...f,
      priceMin: Number.isFinite(min) ? min : null,
      priceMax: Number.isFinite(max) ? max : null,
    }));
  }, [priceMinInput, priceMaxInput]);

  const resetFilters = useCallback(() => {
    setFilters({ priceMin: null, priceMax: null, bedroomsMin: 0, types: new Set() });
    setPriceMinInput('');
    setPriceMaxInput('');
  }, []);

  const selectedPropertyData = useMemo(
    () => (selectedProperty ? properties.find((p: Property) => p.id === selectedProperty) : null),
    [selectedProperty, properties]
  );

  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carte des biens</Text>
        </View>
        <View style={styles.notAvailable}>
          <Text style={styles.notAvailableText}>
            La carte interactive est disponible uniquement sur le web
          </Text>
          <Text style={[styles.notAvailableText, { marginTop: 8, fontSize: 14 }]}>
            {properties.length} propriétés disponibles
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carte - Côte d&apos;Ivoire</Text>
        <Pressable
          onPress={() => {
            if (mapRef.current)
              mapRef.current.setView(centerAbidjan, 13, { animate: true, duration: 1.5 });
          }}
          style={styles.locationButton}
        >
          <Navigation size={20} color={Colors.light.primary} />
        </Pressable>
      </View>

      <Pressable style={styles.viewModeButton} onPress={cycleViewMode}>
        <View style={styles.viewModeIcon}>{getViewModeIcon()}</View>
        <Text style={styles.viewModeLabel}>{getViewModeLabel()}</Text>
        <Text style={styles.viewModeHint}>Appuyez pour changer</Text>
      </Pressable>

      <View style={styles.propertyCountBadge}>
        <Text style={styles.propertyCountText}>
          {filtered.length} bien{filtered.length > 1 ? 's' : ''}
        </Text>
      </View>

      {filtered.length === 0 && (
        <View style={styles.noPropertiesCard}>
          <Text style={styles.noPropertiesText}>Aucun bien à afficher sur la carte</Text>
          <Text style={styles.noPropertiesSubtext}>
            {properties.length === 0 
              ? "Aucune propriété n'est disponible pour le moment"
              : "Essayez d'ajuster vos filtres"}
          </Text>
        </View>
      )}

      <View style={styles.searchBox}>
        <Search size={16} color={Colors.light.textSecondary} />
        <TextInput
          placeholder="Rechercher une adresse..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchGeocode}
          style={styles.searchInput}
          placeholderTextColor={Colors.light.textSecondary}
        />
        <Pressable style={styles.searchBtn} onPress={searchGeocode} disabled={isSearching}>
          {isSearching ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.searchBtnText}>OK</Text>
          )}
        </Pressable>
        {searchOpen && results.length > 0 && (
          <View style={styles.searchResults}>
            {results.map((r, idx) => (
              <Pressable key={idx} style={styles.searchResultItem} onPress={() => goToResult(r)}>
                <Text numberOfLines={1} style={styles.searchResultText}>
                  {r.display_name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <Pressable style={styles.filtersToggle} onPress={() => setFiltersOpen((v) => !v)}>
        <Filter size={16} color="#fff" />
        <Text style={styles.filtersToggleText}>{filtersOpen ? 'Fermer' : 'Filtres'}</Text>
      </Pressable>

      {filtersOpen && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filtersTitle}>💰 Prix (FCFA)</Text>
          <View style={styles.row}>
            <TextInput
              value={priceMinInput}
              onChangeText={setPriceMinInput}
              keyboardType="numeric"
              placeholder="Min"
              style={styles.input}
              placeholderTextColor={Colors.light.textSecondary}
            />
            <Text style={{ marginHorizontal: 8, color: Colors.light.text }}>—</Text>
            <TextInput
              value={priceMaxInput}
              onChangeText={setPriceMaxInput}
              keyboardType="numeric"
              placeholder="Max"
              style={styles.input}
              placeholderTextColor={Colors.light.textSecondary}
            />
            <Pressable style={styles.applyBtn} onPress={applyPriceInputs}>
              <Text style={styles.applyBtnText}>OK</Text>
            </Pressable>
          </View>

          <Text style={styles.filtersTitle}>🛏️ Chambres (min)</Text>
          <View style={styles.chipsRow}>
            {[0, 1, 2, 3, 4].map((n) => (
              <Pressable
                key={n}
                style={[styles.chip, (filters.bedroomsMin || 0) === n && styles.chipActive]}
                onPress={() => setFilters((f) => ({ ...f, bedroomsMin: n }))}
              >
                <Text
                  style={[
                    styles.chipText,
                    (filters.bedroomsMin || 0) === n && styles.chipTextActive,
                  ]}
                >
                  {n}+{n === 0 ? ' (toutes)' : ''}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.filtersTitle}>🏷️ Types</Text>
          <View style={styles.chipsRow}>
            {ALL_TYPES.map((t) => (
              <Pressable
                key={t}
                style={[styles.chip, filters.types.has(t) && styles.chipActive]}
                onPress={() => toggleType(t)}
              >
                <Text style={[styles.chipText, filters.types.has(t) && styles.chipTextActive]}>
                  {getPropertyEmoji(t)} {t}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.filtersActions}>
            <Pressable
              style={[styles.applyBtn, { flex: 1 }]}
              onPress={() => setFiltersOpen(false)}
            >
              <Text style={styles.applyBtnText}>Appliquer</Text>
            </Pressable>
            <Pressable style={[styles.resetBtn, { flex: 1 }]} onPress={resetFilters}>
              <Text style={styles.resetBtnText}>Réinitialiser</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.mapWrapper}>
        <div id="map-container" style={{ width: '100%', height: '100%' }} />
      </View>

      {selectedPropertyData && (
        <View style={styles.propertyCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable style={styles.closeCard} onPress={() => setSelectedProperty(null)}>
              <X size={20} color={Colors.light.text} />
            </Pressable>

            <View style={styles.cardContent}>
              {selectedPropertyData.images && selectedPropertyData.images[0] ? (
                <Image
                  source={{ uri: selectedPropertyData.images[0] }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={styles.cardImagePlaceholder}>
                  <Text style={{ fontSize: 42 }}>{getPropertyEmoji(selectedPropertyData.type)}</Text>
                </View>
              )}

              <Text style={styles.cardTitle}>{selectedPropertyData.title}</Text>
              <Text style={styles.cardPrice}>{format(selectedPropertyData.price, 'FCFA')}</Text>

              <View style={styles.cardLocation}>
                <MapPin size={16} color={Colors.light.textSecondary} />
                <Text style={styles.cardLocationText}>
                  {selectedPropertyData.neighborhoodName}, {selectedPropertyData.cityName}
                </Text>
              </View>

              <View style={styles.cardDetails}>
                <Text style={styles.detailText}>{selectedPropertyData.bedrooms ?? 0} chambres</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.detailText}>{selectedPropertyData.bathrooms ?? 0} SDB</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.detailText}>{selectedPropertyData.surfaceArea ?? 0}m²</Text>
              </View>

              <View style={styles.cardTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{selectedPropertyData.type}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {selectedPropertyData.transactionType === 'VENTE' ? 'À vendre' : 'À louer'}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.viewBtn}
                onPress={() => {
                  setSelectedProperty(null);
                  router.push(`/property/${selectedPropertyData.id}`);
                }}
              >
                <Text style={styles.viewBtnText}>Voir tous les détails</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  viewModeButton: {
    position: 'absolute',
    top: 88,
    right: 16,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 20,
    alignItems: 'center',
    minWidth: 120,
  },
  viewModeIcon: {
    marginBottom: 4,
  },
  viewModeLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 2,
  },
  viewModeHint: {
    fontSize: 10,
    color: 'rgba(255,255,255,.85)',
    fontWeight: '500' as const,
  },
  propertyCountBadge: {
    position: 'absolute',
    top: 178,
    right: 16,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },
  propertyCountText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  searchBox: {
    position: 'absolute',
    top: 88,
    left: 16,
    right: 160,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 8,
  },
  searchBtn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '700' as const,
    fontSize: 12,
  },
  searchResults: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  searchResultItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchResultText: {
    fontSize: 13,
    color: Colors.light.text,
  },
  filtersToggle: {
    position: 'absolute',
    top: 136,
    left: 16,
    zIndex: 30,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filtersToggleText: {
    color: '#fff',
    fontWeight: '700' as const,
  },
  filtersPanel: {
    position: 'absolute',
    top: 180,
    left: 16,
    width: 360,
    maxWidth: '90%',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 14,
    zIndex: 40,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: Colors.light.text,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: Colors.light.primary,
  },
  chipText: {
    color: Colors.light.text,
    fontWeight: '700' as const,
    fontSize: 12,
  },
  chipTextActive: {
    color: '#fff',
  },
  filtersActions: {
    flexDirection: 'row',
    gap: 8,
  },
  applyBtn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '700' as const,
  },
  resetBtn: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  resetBtnText: {
    color: Colors.light.text,
    fontWeight: '700' as const,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  propertyCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    maxHeight: '50%',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  closeCard: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 16,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginBottom: 12,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLocationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500' as const,
    marginRight: 8,
  },
  dot: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginRight: 8,
  },
  cardTags: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  viewBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  notAvailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notAvailableText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  noPropertiesCard: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 15,
    alignItems: 'center',
  },
  noPropertiesText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  noPropertiesSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});