import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MuseumApp from './museum/MuseumApp'
import './museum/museum.css'
import './museum/room.css'
import './museum/night.css'
import './museum/landing-art.css'
import './museum/hologram-ui.css'
import './museum/globe-room.css'
import './museum/landing-reverie.css'
import './museum/collections.css'

createRoot(document.getElementById('root')).render(<StrictMode><MuseumApp /></StrictMode>)
