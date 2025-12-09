import Navbar from './components/Home/Navbar';
import Hero from './components/Home/Hero';
import Highlights from './components/Home/Highlights';
import Model from './components/Home/Model';
import Features from './components/Home/Features';
import HowItWorks from './components/Home/HowItWorks';
import Footer from './components/Home/Footer';

import * as Sentry from '@sentry/react';

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}

export default Sentry.withProfiler(App);
