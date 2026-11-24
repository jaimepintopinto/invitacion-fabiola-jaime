'use client';

import { useEffect, useRef, useState } from 'react';
import { Baby, CalendarCheck, ChevronDown, Gift, Landmark, ListMusic, MapPin, Music2, PartyPopper, Pause, Play, Shirt } from 'lucide-react';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const weddingDate = new Date('2027-03-13T17:30:00-03:00').getTime();

function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const distance = Math.max(0, weddingDate - Date.now());
      setTime({
        days: Math.floor(distance / 86_400_000),
        hours: Math.floor((distance / 3_600_000) % 24),
        minutes: Math.floor((distance / 60_000) % 60),
        seconds: Math.floor((distance / 1_000) % 60),
      });
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="countdown" aria-label="Cuenta regresiva para la boda">
      {Object.entries(time).map(([label, value]) => (
        <div className="countdown-item" key={label}>
          <span>{String(value).padStart(2, '0')}</span>
          <small>{{ days: 'Días', hours: 'Horas', minutes: 'Min', seconds: 'Seg' }[label]}</small>
        </div>
      ))}
    </div>
  );
}

const gallery = [
  { src: '/imagen6.jpg', alt: 'Fabiola & Jaime juntos en una terraza' },
  { src: '/imagen1.jpg', alt: 'Fabiola & Jaime frente al mar' },
  { src: '/imagen2.PNG', alt: 'Fabiola & Jaime celebrando juntos' },
  { src: '/imagen3.JPG', alt: 'Las manos de Fabiola & Jaime con el anillo de compromiso' },
  { src: '/imagen4.JPG', alt: 'Fabiola & Jaime disfrutando un día en la playa' },
  { src: '/imagen5.JPG', alt: 'Fabiola & Jaime abrazados frente al mar al atardecer' },
];

function PhotoCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on('select', update);
    return () => { api.off('select', update); };
  }, [api]);

  return (
    <section className="photo-gallery" aria-label="Galería de fotos de Fabiola & Jaime">
      <div className="gallery-heading"><p>Nuestros momentos</p><span>{current + 1} / {gallery.length}</span></div>
      <Carousel setApi={setApi} opts={{ loop: true }} className="gallery-carousel">
        <CarouselContent className="ml-0">
          {gallery.map((photo) => (
            <CarouselItem key={photo.src} className="gallery-slide pl-0">
              <img src={photo.src} alt={photo.alt} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="gallery-prev" aria-label="Foto anterior" />
        <CarouselNext className="gallery-next" aria-label="Foto siguiente" />
      </Carousel>
      <div className="gallery-dots" aria-label="Seleccionar fotografía">
        {gallery.map((photo, index) => (
          <button key={photo.src} type="button" className={current === index ? 'active' : ''} onClick={() => api?.scrollTo(index)} aria-label={`Ver fotografía ${index + 1}`} aria-current={current === index ? 'true' : undefined} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let waitingForInteraction = false;
    const syncPlaybackState = () => setIsPlaying(!audio.paused && !audio.ended);
    audio.addEventListener('playing', syncPlaybackState);
    audio.addEventListener('pause', syncPlaybackState);
    audio.addEventListener('ended', syncPlaybackState);
    syncPlaybackState();

    const removeFallbackListeners = () => {
      window.removeEventListener('scroll', startAfterInteraction);
      document.removeEventListener('click', startAfterInteraction);
      document.removeEventListener('touchstart', startAfterInteraction);
    };
    const startAfterInteraction = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.music-control')) return;
      void audio.play().then(() => {
        syncPlaybackState();
        removeFallbackListeners();
      }).catch(() => undefined);
    };

    void audio.play().then(syncPlaybackState).catch(() => {
      syncPlaybackState();
      waitingForInteraction = true;
      window.addEventListener('scroll', startAfterInteraction, { passive: true });
      document.addEventListener('click', startAfterInteraction);
      document.addEventListener('touchstart', startAfterInteraction, { passive: true });
    });

    return () => {
      if (waitingForInteraction) removeFallbackListeners();
      audio.removeEventListener('playing', syncPlaybackState);
      audio.removeEventListener('pause', syncPlaybackState);
      audio.removeEventListener('ended', syncPlaybackState);
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <main>
      <audio
        ref={audioRef}
        src="/music/musica_invitacion.mp3"
        autoPlay
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        className={`music-control${isPlaying ? ' playing' : ''}`}
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pausar nuestra canción' : 'Reproducir nuestra canción'}
        aria-pressed={isPlaying}
      >
        <span className="music-control-icon" aria-hidden="true">{isPlaying ? <Pause /> : <Play />}</span>
        <span className="music-control-copy">
          <small><Music2 /> Nuestra canción</small>
          <strong>{isPlaying ? 'Pausar' : 'Reproducir'}</strong>
        </span>
      </button>
      <header className="nav-shell">
        <a className="monogram" href="#inicio" aria-label="Volver al inicio">F <b className="ampersand-inline">&amp;</b> J</a>
        <nav aria-label="Navegación principal">
          <a href="#historia">Nosotros</a><a href="#detalles">Detalles</a><a href="#regalos">Regalos</a><a href="#rsvp">Confirmar</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-frame" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">¡Nos casamos!</p>
          <h1><span>Fabiola</span><b className="ampersand">&amp;</b><span>Jaime</span></h1>
          <div className="date-lockup"><span>Sábado</span><strong>13 · 03 · 2027</strong><span>Santo Domingo</span></div>
          <p className="intro">Queremos celebrar el amor, la vida y la alegría de encontrarnos. Será aún más especial si estás con nosotros.</p>
        </div>
        <a className="scroll-cue" href="#historia" aria-label="Ver más"><ChevronDown /></a>
      </section>

      <section className="story section" id="historia">
        <div className="section-number">01</div>
        <div className="story-copy">
          <p className="eyebrow">Nuestro día</p><h2>Hay momentos que duran para siempre</h2>
          <p>Después de tantos caminos, sobremesas y sueños compartidos, elegimos dar este paso juntos. Nos encantaría que fueras parte de este nuevo comienzo.</p>
        </div>
        <figure className="quote-card">
          <img src="/imagen_fuera.JPG" alt="Fabiola & Jaime juntos en un jardín" />
        </figure>
      </section>

      <PhotoCarousel />

      <section className="countdown-section">
        <p className="eyebrow light">Falta muy poquito</p><h2>Cuenta Regresiva</h2><Countdown />
      </section>

      <section className="details section" id="detalles">
        <div className="details-heading"><p className="eyebrow">Nos encontramos</p><h2>Lugar <b className="ampersand-inline">&amp;</b> Horario</h2><i aria-hidden="true" /></div>
        <div className="venues">
          <article className="venue">
            <span className="venue-icon"><Landmark /></span>
            <p className="card-kicker">Ceremonia</p>
            <h3>Parroquia de Santo Domingo</h3>
            <div className="venue-time"><div><strong>13</strong><span>Marzo</span></div><time dateTime="2027-03-13T17:30:00-03:00">17:00 <small>hrs</small></time></div>
            <p className="venue-place">Santo Domingo, Región de Valparaíso</p>
            <p className="arrival-note">Se recomienda llegar con 30 minutos de anticipación.</p>
            <a className="location-button" href="https://maps.app.goo.gl/icwX1FmuTzUpyiWj8" target="_blank" rel="noopener noreferrer"><MapPin /> Cómo llegar</a>
          </article>
          <article className="venue">
            <span className="venue-icon"><PartyPopper /></span>
            <p className="card-kicker">Celebración</p>
            <h3>Parcelas Vista Hermosa</h3>
            <div className="venue-time"><div><strong>13</strong><span>Marzo</span></div><time dateTime="2027-03-13T19:00:00-03:00">18:30 <small>hrs</small></time></div>
            <p className="venue-place">El Convento, Región de Valparaíso</p>
            <a className="location-button" href="https://maps.app.goo.gl/vY4CHYDWZVgP1kfXA" target="_blank" rel="noopener noreferrer"><MapPin /> Cómo llegar</a>
          </article>
        </div>
        <div className="rules-heading"><p className="eyebrow">A tener en cuenta</p><h2>Algunas Indicaciones</h2><i aria-hidden="true" /></div>
        <div className="rules-grid">
          <article><span className="rule-icon"><Shirt /></span><h3>Código de Vestimenta</h3><p>Elegante. Reservemos el blanco y tonos similares para la novia.</p></article>
          <article><span className="rule-icon"><Baby /></span><h3>Solo para Adultos</h3><p>La celebración será sin niños. Agradecemos mucho su comprensión.</p></article>
        </div>
      </section>

      <section className="gifts" id="regalos">
        <div className="gifts-inner">
          <span className="gift-icon"><Gift /></span>
          <p className="eyebrow light">Lista de novios</p>
          <h2>El mejor regalo es compartir este día</h2>
          <p>Si además quieres tener un detalle con nosotros, preparamos una lista de regalos con mucho cariño.</p>
          <a className="gift-button" href="https://milistadenovios.cl/lista-publica.html?id=35856" target="_blank" rel="noopener noreferrer">
            Ver lista de regalos <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="playlist-section" id="playlist">
        <div className="spotify-card">
          <img className="spotify-cover" src="/imagen1.jpg" alt="Fabiola & Jaime frente al mar" />
          <div className="spotify-copy">
            <p>Playlist pública</p>
            <h2>Matri F&amp;J <span aria-hidden="true">👰🏻‍♀️🤵🏻‍♂️🎉</span></h2>
            <strong>Agrega 3 canciones que no pueden faltar 🎉</strong>
            <small>Fabiola &amp; Jaime</small>
            <a href="https://open.spotify.com/playlist/0qE5rt0bfP8TbIggpMT66o?si=OKd4Yfy4RwGbFOuPGGIrDg&utm_source=copy-link&pi=JuLmWtt6RO2YZ&pt=ff0f30f189a473216af483742a099313" target="_blank" rel="noopener noreferrer">
              <ListMusic /> Agregar canciones
            </a>
          </div>
        </div>
      </section>

      <section className="rsvp" id="rsvp"><div className="rsvp-inner">
        <h2>¿Nos acompañas?</h2>
        <div className="whatsapp-note">
          <span className="whatsapp-icon"><CalendarCheck /></span>
          <p>Confirma tu asistencia antes del</p>
          <strong>15 de Enero de 2027</strong>
          <a className="rsvp-button" href="https://milistadenovios.cl/invitados/35856" target="_blank" rel="noopener noreferrer">
            Confirmar asistencia <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div></section>

      <footer><div className="monogram footer-mark">Fabiola <b className="ampersand-inline">&amp;</b> Jaime</div><p>13 · 03 · 2027</p><span>Con amor, Fabiola y Jaime</span></footer>
    </main>
  );
}
