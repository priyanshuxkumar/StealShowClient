import  { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "../components/ui/button"

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
  dates: string[]
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://assets-in.bmscdn.com/nmcms/events/banner/mobile/media-mobile-abhishek-upmanyu-live-2025-bengaluru-0-2024-9-8-t-7-31-54.jpg",
    title: "CHARLOTTE DE WITTE",
    subtitle: "SPACE BOUND",
    dates: ["22 NOV | BENGALURU", "23 NOV | DELHI NCR", "24 NOV | MUMBAI"]
  },
  {
    id: 2,
    image: "https://assets-in.bmscdn.com/promotions/cms/creatives/1726726634596_sunburnarenaftcharlottedewitte1240x300revised.jpg",
    title: "CHARLOTTE DE WITTE",
    subtitle: "SPACE BOUND",
    dates: ["22 NOV | BENGALURU", "23 NOV | DELHI NCR", "24 NOV | MUMBAI"]
  },
]

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
  }

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
  }

  return (
    <div className="absolute inset-5 w-full mx-auto overflow-hidden rounded-lg shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
        </div>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50"
        onClick={goToPrevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50"
        onClick={goToNextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  )
}