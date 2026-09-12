import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/portal-enhancements.css'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

const root = createRoot(document.getElementById('root'))
root.render(
	<AuthProvider>
		<DataProvider>
			<App />
		</DataProvider>
	</AuthProvider>
)
