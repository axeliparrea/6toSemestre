import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CustomCounter from './components/CustomCounter'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mi Aplicación React</h1>
        <p className="mb-4">
          El valor actual del contador es: <span className="font-bold">{count}</span>
        </p>
        <CustomCounter count={count} setCount={setCount} />
      </main>
      <Footer />
    </div>
  )
}