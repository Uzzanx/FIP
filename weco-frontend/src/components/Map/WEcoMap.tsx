import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getMachines, getPickupLocations } from '../../api/machines'
import type { Machine, PickupLocation } from '../../api/machines'
import styles from './WEcoMap.module.css'

// Fix Leaflet default icon in Vite — use DivIcon to avoid path issues
const boxIcon = L.divIcon({
  className: '',
  html: '<div class="weco-marker weco-marker--box"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
})

const pickupIcon = L.divIcon({
  className: '',
  html: '<div class="weco-marker weco-marker--pickup"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
})

export default function WEcoMap() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [locations, setLocations] = useState<PickupLocation[]>([])
  const [apiOk, setApiOk] = useState(true)

  useEffect(() => {
    Promise.all([getMachines(), getPickupLocations()]).then(([m, l]) => {
      setMachines(m)
      setLocations(l)
      if (m.length === 0 && l.length === 0) setApiOk(false)
    })
  }, [])

  return (
    <div className={styles['map']}>
      <MapContainer
        center={[42.8746, 74.5946]}
        zoom={12}
        scrollWheelZoom={false}
        className={styles['map__container']}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {machines.map((m) => (
          <Marker key={`box-${m.id}`} position={[m.lat, m.lng]} icon={boxIcon}>
            <Popup>
              {m.image && (
                <img src={m.image} alt={m.name} style={{ width: '100%', maxWidth: 200, marginBottom: 6 }} />
              )}
              <strong>{m.name}</strong>
              {m.address && <p style={{ marginTop: 4, fontSize: 13 }}>{m.address}</p>}
            </Popup>
          </Marker>
        ))}
        {locations.map((loc) => (
          <Marker key={`pickup-${loc.id}`} position={[loc.lat, loc.lng]} icon={pickupIcon}>
            <Popup>
              {loc.image && (
                <img src={loc.image} alt={loc.name} style={{ width: '100%', maxWidth: 200, marginBottom: 6 }} />
              )}
              <strong>{loc.name}</strong>
              {loc.address && <p style={{ marginTop: 4, fontSize: 13 }}>{loc.address}</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className={styles['map__legend']}>
        <span className={styles['map__legend-item']}>
          <span className={styles['map__legend-dot'] + ' ' + styles['map__legend-dot--box']} />
          Eco-boxes
        </span>
        <span className={styles['map__legend-item']}>
          <span className={styles['map__legend-dot'] + ' ' + styles['map__legend-dot--pickup']} />
          Pickup locations
        </span>
      </div>
      {!apiOk && (
        <p className={styles['map__no-data']}>No locations available — backend may be offline.</p>
      )}
    </div>
  )
}
