/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Settings, 
  MapPin, 
  Phone, 
  User, 
  Home, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Cake,
  Instagram,
  MessageCircle,
  Clock,
  LogOut,
  Edit2,
  Save,
  X,
  ChevronDown
} from 'lucide-react';

// Types
interface City {
  id: number;
  name: string;
  location: string;
  hours: string;
}

interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface Reservation {
  id: number;
  name: string;
  whatsapp: string;
  city_id: number;
  city_name: string;
  city_location: string;
  city_hours: string;
  product: string;
  quantity: number;
  observations: string;
  status: string;
  created_at: string;
}

interface AppSettings {
  pix_key: string;
  signal_value: string;
  payment_message: string;
  whatsapp_number: string;
  instagram_link: string;
  about_text: string;
}

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    pix_key: '',
    signal_value: '',
    payment_message: '',
    whatsapp_number: '',
    instagram_link: '',
    about_text: ''
  });

  useEffect(() => {
    fetchCities();
    fetchSettings();
    fetchImages();
    fetchProducts();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await fetch('/api/cities');
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error("Failed to fetch cities", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch settings", err);
    }
  };

  const handleAdminLogin = (username: string, pass: string) => {
    if (username === 'Sid' && pass === 'Sophia20@') {
      setIsAdminAuthenticated(true);
    } else {
      alert('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream selection:bg-brand-caramel/30">
      {/* Header */}
      <header className="bg-white border-b border-brand-brown/10 py-4 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView('customer')}
          >
            <div className="w-10 h-10 bg-brand-brown rounded-xl flex items-center justify-center text-brand-gold shadow-md">
              <Cake size={24} />
            </div>
            <div>
              <h1 className="serif text-xl font-bold tracking-tight text-brand-brown">Doçuras do Sid</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-caramel">Doceria Premium</p>
            </div>
          </div>
          
          <nav className="flex gap-1">
            <button 
              onClick={() => setView('customer')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'customer' ? 'bg-brand-brown text-brand-gold shadow-md' : 'text-brand-brown/60 hover:bg-brand-brown/5'}`}
            >
              Início
            </button>
            <button 
              onClick={() => setView('admin')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'admin' ? 'bg-brand-brown text-brand-gold shadow-md' : 'text-brand-brown/60 hover:bg-brand-brown/5'}`}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'customer' ? (
            <CustomerView key="customer" cities={cities} settings={settings} images={images} products={products} />
          ) : (
            isAdminAuthenticated ? (
              <AdminView 
                key="admin" 
                cities={cities} 
                settings={settings}
                images={images}
                products={products}
                onRefreshCities={fetchCities}
                onRefreshSettings={fetchSettings}
                onRefreshImages={fetchImages}
                onRefreshProducts={fetchProducts}
                onLogout={() => setIsAdminAuthenticated(false)}
              />
            ) : (
              <AdminLogin key="login" onLogin={handleAdminLogin} />
            )
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 px-4 bg-brand-brown text-brand-gold/80">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 bg-brand-gold/20 rounded-lg flex items-center justify-center text-brand-gold">
                <Cake size={18} />
              </div>
              <h3 className="serif text-xl font-bold text-brand-gold">Doçuras do Sid</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              {settings.about_text}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-gold/40">Redes Sociais</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href={settings.instagram_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center hover:bg-brand-gold/20 transition-colors">
                <Instagram size={20} />
              </a>
              <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center hover:bg-brand-gold/20 transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-gold/40">Atendimento</h4>
            <p className="text-sm opacity-80">
              Segunda a Sábado<br />
              09:00 às 18:00
            </p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-brand-gold/10 text-center text-[10px] uppercase tracking-widest opacity-40">
          Doçuras do Sid &copy; {new Date().getFullYear()} — Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (user: string, pass: string) => void, key?: string }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-sm mx-auto bg-white p-8 rounded-[32px] shadow-xl border border-brand-brown/5 text-center"
    >
      <div className="w-16 h-16 bg-brand-brown/5 text-brand-brown rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Settings size={32} />
      </div>
      <h2 className="serif text-2xl font-bold mb-2">Acesso Restrito</h2>
      <p className="text-sm text-brand-ink/60 mb-8">Digite suas credenciais para continuar.</p>
      
      <form onSubmit={(e) => { e.preventDefault(); onLogin(username, password); }} className="space-y-4">
        <input 
          type="text"
          placeholder="Usuário"
          className="w-full px-4 py-4 bg-brand-cream border border-brand-brown/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 transition-all text-center"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          type="password"
          placeholder="Senha"
          className="w-full px-4 py-4 bg-brand-cream border border-brand-brown/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 transition-all text-center"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button 
          type="submit"
          className="w-full bg-brand-brown text-brand-gold py-4 rounded-2xl font-bold shadow-lg shadow-brand-brown/20 hover:translate-y-[-2px] transition-all"
        >
          Entrar
        </button>
      </form>
    </motion.div>
  );
}

function CustomerView({ cities, settings, images, products }: { cities: City[], settings: AppSettings, images: ProductImage[], products: Product[], key?: string }) {
  const [step, setStep] = useState<'home' | 'form' | 'success'>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    city_id: '',
    product: '',
    quantity: 1 as number | string,
    observations: ''
  });
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const getWhatsAppLink = () => {
    const cleanNumber = settings.whatsapp_number.replace(/\D/g, '');
    const text = `Olá! Fiz uma reserva de ${formData.product} (${formData.quantity} unidades) para ${selectedCity?.name}. Meu nome é ${formData.name}. Segue o comprovante do sinal de R$ ${settings.signal_value}.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    const city = cities.find(c => c.id.toString() === formData.city_id);
    setSelectedCity(city || null);
  }, [formData.city_id, cities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Por favor, informe seu nome.');
      return;
    }
    if (!formData.whatsapp.trim()) {
      alert('Por favor, informe seu WhatsApp.');
      return;
    }
    if (!formData.city_id) {
      alert('Por favor, selecione uma cidade.');
      return;
    }
    if (!formData.product) {
      alert('Por favor, selecione uma opção de reserva.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity.toString()) || 1
        })
      });
      
      if (res.ok) {
        setStep('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Erro no servidor' }));
        alert(`Erro ao enviar reserva: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error('Reservation error:', err);
      alert('Erro de conexão ao enviar reserva. Verifique sua internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {step === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <section className="text-center space-y-6 py-12">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-block px-4 py-1.5 bg-brand-caramel/10 text-brand-caramel rounded-full text-[10px] font-bold uppercase tracking-widest"
              >
                Confeitaria Artesanal
              </motion.div>
              <h2 className="serif text-6xl md:text-7xl font-bold text-brand-brown leading-tight">
                A autêntica <span className="italic text-brand-caramel">Torta de Manteiga Escocesa</span>.
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-brand-ink/70 leading-relaxed">
                {settings.about_text}
              </p>
              <div className="pt-8">
                <button 
                  onClick={() => setStep('form')}
                  className="bg-brand-brown text-brand-gold px-12 py-5 rounded-full font-bold text-lg shadow-2xl shadow-brand-brown/30 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                >
                  Fazer Reserva
                  <ChevronRight size={20} />
                </button>
              </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <motion.div 
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg border-4 border-white"
                >
                  <img src={img.url || null} alt={img.alt} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </motion.div>
              ))}
            </section>
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-brand-brown/5">
              <div className="flex items-center gap-4 mb-10">
                <button onClick={() => setStep('home')} className="p-2 hover:bg-brand-cream rounded-full transition-colors">
                  <X size={24} />
                </button>
                <h2 className="serif text-3xl font-bold text-brand-brown">Nova Reserva</h2>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-caramel" size={18} />
                    <input 
                      required
                      type="text"
                      placeholder="Seu nome"
                      className="w-full pl-12 pr-4 py-4 bg-brand-cream/50 border border-brand-brown/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">WhatsApp</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-caramel" size={18} />
                    <input 
                      required
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="w-full pl-12 pr-4 py-4 bg-brand-cream/50 border border-brand-brown/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 transition-all"
                      value={formData.whatsapp}
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Cidade</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-caramel" size={18} />
                    <select 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-brand-cream/50 border border-brand-brown/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 transition-all appearance-none"
                      value={formData.city_id}
                      onChange={e => setFormData({...formData, city_id: e.target.value})}
                    >
                      <option value="">Selecione</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-brown/30 pointer-events-none" size={18} />
                  </div>
                </div>

                <AnimatePresence>
                  {selectedCity && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="md:col-span-2 overflow-hidden"
                    >
                      <div className="bg-brand-gold/5 p-4 rounded-2xl border border-brand-gold/20 flex flex-col gap-2 text-xs">
                        <div className="flex items-center gap-2 text-brand-brown/70">
                          <MapPin size={14} className="text-brand-caramel" />
                          <strong>Local:</strong> {selectedCity.location}
                        </div>
                        <div className="flex items-center gap-2 text-brand-brown/70">
                          <Clock size={14} className="text-brand-caramel" />
                          <strong>Horário:</strong> {selectedCity.hours}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Opções de Reserva</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setFormData({...formData, product: product.name})}
                        className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                          formData.product === product.name 
                            ? 'bg-brand-brown text-brand-gold border-brand-brown shadow-lg' 
                            : 'bg-brand-cream/50 border-brand-brown/10 text-brand-brown hover:border-brand-caramel/30'
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight mb-1">{product.name}</span>
                        <span className={`text-[10px] font-mono ${formData.product === product.name ? 'text-brand-gold/70' : 'text-brand-caramel'}`}>
                          R$ {product.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Quantidade</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-4 bg-brand-cream/50 border border-brand-brown/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 transition-all"
                    value={Number.isNaN(formData.quantity) ? '' : formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value === '' ? '' : parseInt(e.target.value)})}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Observações (Opcional)</label>
                  <textarea 
                    placeholder="Algum detalhe especial?"
                    className="w-full px-4 py-4 bg-brand-cream/50 border border-brand-brown/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 transition-all min-h-[100px]"
                    value={formData.observations}
                    onChange={e => setFormData({...formData, observations: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`md:col-span-2 w-full bg-brand-brown text-brand-gold py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-brown/20 transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-[-2px]'}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Reserva
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-lg mx-auto bg-white p-10 rounded-[40px] shadow-2xl border border-brand-brown/5 text-center"
          >
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="serif text-4xl font-bold text-brand-brown mb-4">Reserva Registrada!</h2>
            <p className="text-brand-ink/70 mb-8 leading-relaxed">
              {settings.payment_message}
            </p>

            <div className="bg-brand-cream p-6 rounded-3xl border-2 border-dashed border-brand-caramel/30 mb-8 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-brand-brown/60 uppercase tracking-wider">Valor do Sinal</span>
                <span className="text-2xl font-bold text-brand-caramel">R$ {settings.signal_value}</span>
              </div>
              <div className="pt-4 border-t border-brand-caramel/10">
                <span className="block text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 mb-2">Chave PIX</span>
                <div 
                  onClick={() => {
                    navigator.clipboard.writeText(settings.pix_key);
                    alert('Chave PIX copiada!');
                  }}
                  className="bg-white px-4 py-3 rounded-xl font-mono text-brand-brown border border-brand-brown/5 select-all cursor-pointer hover:bg-brand-gold/5 transition-colors flex items-center justify-between group"
                >
                  <span>{settings.pix_key}</span>
                  <span className="text-[8px] uppercase font-bold text-brand-caramel opacity-0 group-hover:opacity-100 transition-opacity">Copiar</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <a 
                href={getWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <MessageCircle size={24} />
                Enviar Comprovante
              </a>
              <button 
                onClick={() => setStep('home')}
                className="text-brand-brown/60 font-bold hover:text-brand-brown transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${settings.whatsapp_number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[60] group"
        title="Falar no WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="absolute right-full mr-3 bg-white text-brand-brown px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-brand-brown/5">
          Dúvidas? Chame no WhatsApp
        </span>
      </a>
    </div>
  );
}

function AdminView({ 
  cities, 
  settings,
  images,
  products,
  onRefreshCities, 
  onRefreshSettings,
  onRefreshImages,
  onRefreshProducts,
  onLogout
}: { 
  cities: City[], 
  settings: AppSettings,
  images: ProductImage[],
  products: Product[],
  onRefreshCities: () => void,
  onRefreshSettings: () => void,
  onRefreshImages: () => void,
  onRefreshProducts: () => void,
  onLogout: () => void,
  key?: string
}) {
  const [activeTab, setActiveTab] = useState<'reservations' | 'cities' | 'settings' | 'images' | 'products'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [newCity, setNewCity] = useState({ name: '', location: '', hours: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCity ? `/api/cities/${editingCity.id}` : '/api/cities';
    const method = editingCity ? 'PUT' : 'POST';
    const body = editingCity || newCity;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setEditingCity(null);
        setNewCity({ name: '', location: '', hours: '' });
        onRefreshCities();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCity = async (id: number) => {
    if (!confirm('Excluir cidade?')) return;
    try {
      await fetch(`/api/cities/${id}`, { method: 'DELETE' });
      onRefreshCities();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';
    const body = editingProduct || newProduct;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setEditingProduct(null);
        setNewProduct({ name: '', price: '', description: '' });
        onRefreshProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Excluir produto?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      onRefreshProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) onRefreshSettings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <h2 className="serif text-4xl font-bold text-brand-brown">Painel Admin</h2>
          <button onClick={onLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-brand-brown/10 overflow-x-auto max-w-full">
          {(['reservations', 'cities', 'products', 'images', 'settings'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-brand-brown text-brand-gold shadow-md' : 'text-brand-brown/60 hover:text-brand-brown'}`}
            >
              {tab === 'reservations' ? 'Pedidos' : tab === 'cities' ? 'Cidades' : tab === 'products' ? 'Produtos' : tab === 'images' ? 'Imagens' : 'Ajustes'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'reservations' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            {reservations.map(res => (
              <div key={res.id} className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5 grid md:grid-cols-4 gap-6 items-center">
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-brown">{res.name}</h4>
                  <a 
                    href={`https://wa.me/${res.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-caramel flex items-center gap-1 hover:underline"
                  >
                    <MessageCircle size={12} /> {res.whatsapp}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{res.product}</p>
                  <p className="text-xs text-brand-ink/50">Qtd: {res.quantity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-brand-brown/60 uppercase tracking-widest">{res.city_name}</p>
                  <p className="text-[10px] text-brand-ink/40 italic">{res.observations || 'Sem observações'}</p>
                </div>
                <div>
                  <select 
                    value={res.status}
                    onChange={(e) => handleUpdateStatus(res.id, e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      res.status === 'Finalizado' ? 'bg-green-50 border-green-200 text-green-700' :
                      res.status === 'Confirmado' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      res.status === 'Aguardando pagamento' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                      'bg-brand-cream border-brand-brown/10 text-brand-brown'
                    }`}
                  >
                    <option>Reserva enviada</option>
                    <option>Aguardando pagamento</option>
                    <option>Confirmado</option>
                    <option>Finalizado</option>
                  </select>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'cities' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <form onSubmit={handleSaveCity} className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5 space-y-4 sticky top-24">
                <h3 className="serif text-xl font-bold text-brand-brown">{editingCity ? 'Editar' : 'Nova'} Cidade</h3>
                <div className="space-y-4">
                  <input 
                    required
                    placeholder="Nome da Cidade"
                    className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5"
                    value={editingCity ? editingCity.name : newCity.name}
                    onChange={e => editingCity ? setEditingCity({...editingCity, name: e.target.value}) : setNewCity({...newCity, name: e.target.value})}
                  />
                  <input 
                    required
                    placeholder="Local de Atendimento"
                    className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5"
                    value={editingCity ? editingCity.location : newCity.location}
                    onChange={e => editingCity ? setEditingCity({...editingCity, location: e.target.value}) : setNewCity({...newCity, location: e.target.value})}
                  />
                  <input 
                    required
                    placeholder="Horário de Atendimento"
                    className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5"
                    value={editingCity ? editingCity.hours : newCity.hours}
                    onChange={e => editingCity ? setEditingCity({...editingCity, hours: e.target.value}) : setNewCity({...newCity, hours: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-brand-brown text-brand-gold py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                    <Save size={16} /> Salvar
                  </button>
                  {editingCity && (
                    <button type="button" onClick={() => setEditingCity(null)} className="p-3 bg-red-50 text-red-500 rounded-xl">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="md:col-span-2 space-y-4">
              {cities.map(city => (
                <div key={city.id} className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5 flex justify-between items-center">
                  <div className="space-y-1">
                    <h4 className="font-bold text-brand-brown">{city.name}</h4>
                    <p className="text-xs text-brand-ink/50">{city.location} • {city.hours}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingCity(city)} className="p-2 text-brand-caramel hover:bg-brand-caramel/5 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteCity(city.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5 space-y-4 sticky top-24">
                <h3 className="serif text-xl font-bold text-brand-brown">{editingProduct ? 'Editar' : 'Novo'} Produto</h3>
                <div className="space-y-4">
                  <input 
                    required
                    placeholder="Nome do Produto"
                    className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5"
                    value={editingProduct ? editingProduct.name : newProduct.name}
                    onChange={e => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProduct({...newProduct, name: e.target.value})}
                  />
                  <input 
                    required
                    placeholder="Preço (Ex: 15.00)"
                    className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5"
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-brand-brown text-brand-gold py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                    <Save size={16} /> Salvar
                  </button>
                  {editingProduct && (
                    <button type="button" onClick={() => setEditingProduct(null)} className="p-3 bg-red-50 text-red-500 rounded-xl">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="md:col-span-2 space-y-4">
              {products.map(product => (
                <div key={product.id} className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5 flex justify-between items-center">
                  <div className="space-y-1">
                    <h4 className="font-bold text-brand-brown">{product.name}</h4>
                    <p className="text-xs text-brand-caramel">R$ {product.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProduct(product)} className="p-2 text-brand-caramel hover:bg-brand-caramel/5 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'images' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-2 gap-8">
            {images.map(img => (
              <div key={img.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-brand-brown/5 space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-brand-cream">
                  <img src={img.url || null} alt={img.alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">URL da Imagem {img.id}</label>
                  <div className="flex gap-2">
                    <input 
                      className="flex-1 px-4 py-3 bg-brand-cream rounded-xl text-xs border border-brand-brown/5"
                      defaultValue={img.url}
                      onBlur={async (e) => {
                        if (e.target.value === img.url) return;
                        try {
                          await fetch(`/api/images/${img.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: e.target.value })
                          });
                          onRefreshImages();
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-[40px] shadow-sm border border-brand-brown/5 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="serif text-2xl font-bold text-brand-brown">Pagamento</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Chave PIX</label>
                    <input name="pix_key" defaultValue={settings.pix_key} className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Valor do Sinal (R$)</label>
                    <input name="signal_value" defaultValue={settings.signal_value} className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Mensagem de Pagamento</label>
                    <textarea name="payment_message" defaultValue={settings.payment_message} className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5 min-h-[100px]" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="serif text-2xl font-bold text-brand-brown">Institucional</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">WhatsApp (Número com DDD)</label>
                    <input name="whatsapp_number" defaultValue={settings.whatsapp_number} placeholder="5511999999999" className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Link Instagram</label>
                    <input name="instagram_link" defaultValue={settings.instagram_link} className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 ml-1">Sobre a Empresa</label>
                    <textarea name="about_text" defaultValue={settings.about_text} className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm border border-brand-brown/5 min-h-[100px]" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-brand-brown text-brand-gold py-5 rounded-2xl font-bold shadow-lg shadow-brand-brown/20 flex items-center justify-center gap-3">
                  <Save size={20} /> Salvar Alterações
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
