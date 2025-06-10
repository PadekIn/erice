
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSendContact } from '@/hooks/useContact';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const sendContactMutation = useSendContact();
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await sendContactMutation.mutateAsync(formData);
      toast({
        title: "Pesan Terkirim",
        description: "Terima kasih! Pesan Anda telah terkirim. Kami akan menghubungi Anda segera.",
      });
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan. Silakan coba lagi.",
        variant: "destructive",
      });
      console.error('Contact submit error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat',
      details: [
        'Jl. Raya Tembilahan No. 123',
        'Tembilahan, Indragiri Hilir',
        'Riau 29213, Indonesia'
      ]
    },
    {
      icon: Phone,
      title: 'Telepon',
      details: [
        '+62 768 123 4567',
        '+62 812 3456 7890',
        'WhatsApp: +62 812 3456 7890'
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        'info@berasindragirihilir.com',
        'sales@berasindragirihilir.com',
        'support@berasindragirihilir.com'
      ]
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      details: [
        'Senin - Jumat: 08:00 - 17:00',
        'Sabtu: 08:00 - 15:00',
        'Minggu: Tutup'
      ]
    }
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
            Hubungi Kami
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ada pertanyaan atau ingin mengetahui lebih lanjut tentang produk kami? 
            Tim customer service kami siap membantu Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-forest-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-800 mb-2">{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-sm text-muted-foreground mb-1">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Map Placeholder */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="text-forest-800">Lokasi Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-gradient-to-br from-forest-100 to-earth-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-forest-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Peta Interaktif
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Indragiri Hilir, Riau
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-forest-800">Kirim Pesan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Nama Lengkap *</Label>
                      <Input
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Contoh: 081234567890"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contoh@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subjek pesan Anda"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tulis pesan Anda di sini..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-forest-600 hover:bg-forest-700 text-white py-6 text-lg"
                    disabled={sendContactMutation.isPending}
                  >
                    {sendContactMutation.isPending ? (
                      'Mengirim...'
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-forest-800 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-muted-foreground">
              Temukan jawaban untuk pertanyaan umum seputar produk dan layanan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'Bagaimana cara pemesanan?',
                answer: 'Anda dapat memesan melalui website kami dengan menambahkan produk ke keranjang dan melakukan checkout. Tim kami akan memproses pesanan dalam 1x24 jam.'
              },
              {
                question: 'Berapa lama waktu pengiriman?',
                answer: 'Untuk wilayah Riau: 1-2 hari kerja. Untuk luar Riau: 3-5 hari kerja. Kami bekerja sama dengan ekspedisi terpercaya untuk memastikan produk sampai dengan aman.'
              },
              {
                question: 'Apakah ada garansi kualitas?',
                answer: 'Ya, kami memberikan garansi 100% uang kembali jika produk tidak sesuai ekspektasi. Kepuasan pelanggan adalah prioritas utama kami.'
              },
              {
                question: 'Bisakah berkunjung langsung ke lokasi?',
                answer: 'Tentu saja! Anda dapat mengunjungi kantor dan gudang kami di Tembilahan. Silakan hubungi kami terlebih dahulu untuk membuat janji.'
              }
            ].map((faq, index) => (
              <Card key={index} className="animate-fade-in" style={{ animationDelay: `${(index + 5) * 0.1}s` }}>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-forest-800 mb-2">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
