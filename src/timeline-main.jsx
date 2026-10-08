import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TimelinePage from './museum/TimelinePage'
import './museum/timeline.css'

createRoot(document.getElementById('root')).render(<StrictMode><TimelinePage/></StrictMode>)
